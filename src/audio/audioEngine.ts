import * as Tone from 'tone';
import type { IngredientCategory } from '../data/songManifest';
import { getEffectiveSeasoningCounts } from '../data/seasoningLogic';

export type AudioTrackManifest = {
  id: string;
  category: IngredientCategory;
  path: string;
};

export type AudioManifest = {
  bpm?: number;
  tracks: readonly AudioTrackManifest[];
};

type TrackState = {
  id: string;
  category: IngredientCategory;
  path: string;
  player?: Tone.Player;
  loaded: boolean;
};

type HeatLevel = 'low' | 'medium' | 'high';

type EffectGraph = {
  master: Tone.Gain;
  filter: Tone.Filter;
  distortion: Tone.Distortion;
  chorus: Tone.Chorus;
  delay: Tone.FeedbackDelay;
  reverb: Tone.Reverb;
  output: Tone.Gain;
};

const tracks = new Map<string, TrackState>();
const activeByCategory = new Map<IngredientCategory, string>();
let effectGraph: EffectGraph | null = null;
let initialized = false;
let currentHeat: HeatLevel = 'medium';
let activeSeasonings: readonly string[] = [];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function getEffectGraph() {
  if (!effectGraph) {
    const master = new Tone.Gain(0.9);
    const filter = new Tone.Filter(9000, 'lowpass');
    const distortion = new Tone.Distortion({ distortion: 0.45, wet: 0 });
    const chorus = new Tone.Chorus({ frequency: 1.5, delayTime: 2.5, depth: 0.45, wet: 0 }).start();
    const delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.28, wet: 0 });
    const reverb = new Tone.Reverb({ decay: 2.4, preDelay: 0.03, wet: 0.12 });
    const output = new Tone.Gain(1);

    master.chain(filter, distortion, chorus, delay, reverb, output, Tone.Destination);
    effectGraph = { master, filter, distortion, chorus, delay, reverb, output };
  }

  return effectGraph;
}

function applyEffects() {
  const graph = getEffectGraph();

  const heatSettings: Record<HeatLevel, { gain: number; filter: number; distortion: number; chorus: number; delay: number; reverb: number }> = {
    low: { gain: 0.72, filter: 1800, distortion: 0, chorus: 0.06, delay: 0.08, reverb: 0.3 },
    medium: { gain: 0.9, filter: 9000, distortion: 0, chorus: 0, delay: 0, reverb: 0.12 },
    high: { gain: 1.05, filter: 12000, distortion: 0.16, chorus: 0.03, delay: 0.03, reverb: 0.08 },
  };

  const next = { ...heatSettings[currentHeat] };
  const seasoning = getEffectiveSeasoningCounts(activeSeasonings);

  if (seasoning.chili > 0) {
    next.gain += 0.04 * seasoning.chili;
    next.distortion += 0.16 * seasoning.chili;
    next.filter = Math.max(next.filter, 10000);
  }

  if (seasoning.honey > 0) {
    next.chorus += 0.12 * seasoning.honey;
    next.filter = Math.max(next.filter, 12000);
  }

  if (seasoning.salt > 0) {
    next.gain += 0.015 * seasoning.salt;
    next.filter = Math.max(next.filter, 10500 + 500 * seasoning.salt);
  }

  if (seasoning.water > 0) {
    next.gain -= 0.025 * seasoning.water;
    next.delay += 0.04 * seasoning.water;
    next.reverb += 0.08 * seasoning.water;
    next.filter = Math.min(next.filter, 6400);
  }

  if (seasoning.ice > 0) {
    next.gain -= 0.03 * seasoning.ice;
    next.delay += 0.05 * seasoning.ice;
    next.reverb += 0.12 * seasoning.ice;
    next.filter = Math.min(next.filter, 5200);
  }

  if (seasoning.moon > 0) {
    next.reverb += 0.14 * seasoning.moon;
    next.delay += 0.03 * seasoning.moon;
    next.filter = Math.min(next.filter, 3400);
  }

  if (seasoning.rain > 0) {
    next.delay += 0.12 * seasoning.rain;
    next.reverb += 0.08 * seasoning.rain;
    next.filter = Math.min(next.filter, 6200);
  }

  if (seasoning.chiliIceCancel > 0) {
    next.distortion = Math.max(0, next.distortion - 0.12 * seasoning.chiliIceCancel);
    next.gain -= 0.02 * seasoning.chiliIceCancel;
  }

  if (seasoning.honeyRainCancel > 0) {
    next.chorus += 0.04 * seasoning.honeyRainCancel;
    next.delay += 0.04 * seasoning.honeyRainCancel;
  }

  graph.master.gain.rampTo(clamp(next.gain, 0.55, 1.15), 0.12);
  graph.filter.frequency.rampTo(clamp(next.filter, 900, 14000), 0.12);
  graph.distortion.wet.rampTo(clamp(next.distortion, 0, 0.6), 0.12);
  graph.chorus.wet.rampTo(clamp(next.chorus, 0, 0.42), 0.12);
  graph.delay.wet.rampTo(clamp(next.delay, 0, 0.4), 0.12);
  graph.reverb.wet.rampTo(clamp(next.reverb, 0, 0.55), 0.12);
}

export async function initAudio() {
  if (initialized) return;
  await Tone.start();
  Tone.Transport.bpm.value = 120;
  getEffectGraph();
  applyEffects();
  initialized = true;
}

export async function loadTracks(manifest: AudioManifest) {
  Tone.Transport.bpm.value = manifest.bpm ?? 120;

  await Promise.all(
    manifest.tracks.map(async (track) => {
      if (tracks.has(track.id)) return;

      const state: TrackState = {
        id: track.id,
        category: track.category,
        path: track.path,
        loaded: false,
      };
      tracks.set(track.id, state);

      try {
        const player = new Tone.Player({
          url: track.path,
          loop: true,
          autostart: false,
          fadeIn: 0.02,
          fadeOut: 0.05,
          onload: () => {
            state.loaded = true;
          },
          onerror: () => {
            console.warn(`[audioEngine] Missing or invalid audio file: ${track.path}`);
          },
        }).connect(getEffectGraph().master);

        player.volume.value = -Infinity;
        player.sync().start(0);
        state.player = player;
      } catch (error) {
        console.warn(`[audioEngine] Could not create Tone.Player for ${track.path}`, error);
      }
    }),
  );
}

export async function startTransport() {
  await initAudio();
  try {
    await Tone.loaded();
  } catch (error) {
    console.warn('[audioEngine] Audio buffers did not finish loading before playback.', error);
  }
  getEffectGraph().output.gain.rampTo(1, 0.03);
  if (Tone.Transport.state !== 'started') {
    Tone.Transport.start();
  }
}

export function stopTransport() {
  getEffectGraph().output.gain.cancelScheduledValues(Tone.now());
  getEffectGraph().output.gain.value = 0;
  Tone.Transport.stop();
  Tone.Transport.seconds = 0;
}

export function toggleTrack(trackId: string) {
  const track = tracks.get(trackId);
  if (!track?.player) {
    console.warn(`[audioEngine] Track is not available: ${trackId}`);
    return;
  }

  const isActive = activeByCategory.get(track.category) === trackId;
  if (isActive) {
    track.player.volume.value = -Infinity;
    activeByCategory.delete(track.category);
    if (activeByCategory.size === 0) {
      stopTransport();
    }
    return;
  }

  replaceTrack(track.category, trackId);
}

export function removeTrack(trackId: string) {
  const track = tracks.get(trackId);
  if (!track?.player) {
    console.warn(`[audioEngine] Track is not available: ${trackId}`);
    return;
  }

  if (activeByCategory.get(track.category) !== trackId) return;

  track.player.volume.cancelScheduledValues(Tone.now());
  track.player.volume.value = -Infinity;
  activeByCategory.delete(track.category);

  if (activeByCategory.size === 0) {
    stopTransport();
  }
}

export function replaceTrack(category: IngredientCategory, trackId: string) {
  const nextTrack = tracks.get(trackId);
  if (!nextTrack?.player) {
    console.warn(`[audioEngine] Track is not available: ${trackId}`);
    return;
  }

  tracks.forEach((track) => {
    if (track.category === category && track.player) {
      track.player.volume.cancelScheduledValues(Tone.now());
      track.player.volume.value = -Infinity;
    }
  });

  nextTrack.player.volume.cancelScheduledValues(Tone.now());
  nextTrack.player.volume.value = -8;
  activeByCategory.set(category, trackId);
}

export function setVolume(trackId: string, volume: number) {
  const track = tracks.get(trackId);
  if (!track?.player) {
    console.warn(`[audioEngine] Track is not available: ${trackId}`);
    return;
  }

  track.player.volume.value = volume;
}

export function resetAllTracks() {
  stopTransport();
  tracks.forEach((track) => {
    if (track.player) {
      track.player.volume.value = -Infinity;
    }
  });
  activeByCategory.clear();
  resetEffects();
}

export function setHeatLevel(level: HeatLevel) {
  currentHeat = level;
  applyEffects();
}

export function setSeasoningEffects(seasoningIds: readonly string[]) {
  activeSeasonings = seasoningIds;
  applyEffects();
}

export function resetEffects() {
  currentHeat = 'medium';
  activeSeasonings = [];
  applyEffects();
}
