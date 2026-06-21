import * as Tone from 'tone';
import type { IngredientCategory } from '../data/songManifest';

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
};

const tracks = new Map<string, TrackState>();
const activeByCategory = new Map<IngredientCategory, string>();
let effectGraph: EffectGraph | null = null;
let initialized = false;
let currentHeat: HeatLevel = 'medium';
let activeSeasonings = new Set<string>();

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function getEffectGraph() {
  if (!effectGraph) {
    const master = new Tone.Gain(0.9);
    const filter = new Tone.Filter(9000, 'lowpass');
    const distortion = new Tone.Distortion({ distortion: 0.45, wet: 0 });
    const chorus = new Tone.Chorus({ frequency: 1.5, delayTime: 2.5, depth: 0.45, wet: 0 }).start();
    const delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.28, wet: 0 });
    const reverb = new Tone.Reverb({ decay: 2.4, preDelay: 0.03, wet: 0.12 });

    master.chain(filter, distortion, chorus, delay, reverb, Tone.Destination);
    effectGraph = { master, filter, distortion, chorus, delay, reverb };
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

  if (activeSeasonings.has('chili')) {
    next.gain += 0.05;
    next.distortion += 0.28;
    next.filter = Math.max(next.filter, 10000);
  }

  if (activeSeasonings.has('honey')) {
    next.chorus += 0.22;
    next.filter = Math.max(next.filter, 12000);
  }

  if (activeSeasonings.has('ice')) {
    next.gain -= 0.04;
    next.delay += 0.08;
    next.reverb += 0.22;
    next.filter = Math.min(next.filter, 5200);
  }

  if (activeSeasonings.has('moon')) {
    next.reverb += 0.25;
    next.delay += 0.04;
    next.filter = Math.min(next.filter, 3400);
  }

  if (activeSeasonings.has('rain')) {
    next.delay += 0.24;
    next.reverb += 0.14;
    next.filter = Math.min(next.filter, 6200);
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
  if (Tone.Transport.state !== 'started') {
    Tone.Transport.start();
  }
}

export function stopTransport() {
  Tone.Transport.stop();
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
    return;
  }

  replaceTrack(track.category, trackId);
}

export function replaceTrack(category: IngredientCategory, trackId: string) {
  const nextTrack = tracks.get(trackId);
  if (!nextTrack?.player) {
    console.warn(`[audioEngine] Track is not available: ${trackId}`);
    return;
  }

  tracks.forEach((track) => {
    if (track.category === category && track.player) {
      track.player.volume.value = -Infinity;
    }
  });

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
  tracks.forEach((track) => {
    if (track.player) {
      track.player.volume.value = -Infinity;
    }
  });
  activeByCategory.clear();
  resetEffects();
  Tone.Transport.seconds = 0;
}

export function setHeatLevel(level: HeatLevel) {
  currentHeat = level;
  applyEffects();
}

export function setSeasoningEffects(seasoningIds: readonly string[]) {
  activeSeasonings = new Set(seasoningIds);
  applyEffects();
}

export function resetEffects() {
  currentHeat = 'medium';
  activeSeasonings = new Set();
  applyEffects();
}
