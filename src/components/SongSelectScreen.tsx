import type { Song } from '../data/songManifest';

type SongSelectScreenProps = {
  songs: Song[];
  onSelect: (song: Song) => void;
};

function SongSelectScreen({ songs, onSelect }: SongSelectScreenProps) {
  return (
    <section className="screen">
      <header className="screen-header">
        <p className="eyebrow">Step 1</p>
        <h1>选择曲目</h1>
        <p>选一首你心爱的歌，AI 厨师会把它拆成食材。</p>
      </header>
      <div className="song-list">
        {songs.map((song) => (
          <button className="song-card" type="button" key={song.id} onClick={() => onSelect(song)}>
            <div className="cover-fallback">{song.coverFallback}</div>
            <div className="song-info">
              <strong>{song.title}</strong>
              <span>{song.artist}</span>
              <small>
                {song.duration} · {song.bpm} BPM · {song.key}
              </small>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default SongSelectScreen;
