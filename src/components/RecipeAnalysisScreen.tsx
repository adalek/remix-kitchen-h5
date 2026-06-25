import type { FlavorProfile, IngredientCategory, Song } from '../data/songManifest';

type RecipeAnalysisScreenProps = {
  song: Song;
  onBack: () => void;
  onNext: () => void;
};

const flavorLabels: Record<keyof FlavorProfile, string> = {
  energy: 'Energy 能量',
  brightness: 'Brightness 明亮',
  chill: 'Chill 松弛',
  night: 'Night 夜晚',
};

const categoryCopy: Record<IngredientCategory, { music: string; kitchen: string }> = {
  base: { music: '鼓组', kitchen: '底料' },
  bass: { music: '贝斯', kitchen: '主料' },
  chords: { music: '和弦', kitchen: '配菜' },
  atmosphere: { music: '氛围', kitchen: '调料' },
  vocal: { music: '人声', kitchen: '点缀' },
};

function RecipeAnalysisScreen({ song, onBack, onNext }: RecipeAnalysisScreenProps) {
  return (
    <section className="screen analysis-screen">
      <header className="screen-header compact">
        <button className="text-button" type="button" onClick={onBack}>
          ← 换歌
        </button>
        <p className="eyebrow">AI 菜谱分析</p>
        <h1>{song.title}</h1>
        <p>{song.artist} · {song.bpm} BPM · {song.key}</p>
        <p>AI 厨师先拆解原歌，再准备可替换的新食材。</p>
      </header>

      <div className="section-title">
        <h2>关键 AI 提示词</h2>
        <span>先理解这首歌的味道</span>
      </div>
      <div className="prompt-card">
        {song.promptTags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="section-title">
        <h2>风味数值</h2>
        <span>AI 厨师的听感判断</span>
      </div>
      <div className="flavor-grid">
        {(Object.keys(song.analysis) as Array<keyof FlavorProfile>).map((key) => (
          <div className="flavor-meter" key={key}>
            <div className="meter-label">
              <span>{flavorLabels[key]}</span>
              <strong>{song.analysis[key]}</strong>
            </div>
            <div className="meter-track">
              <div className="meter-fill" style={{ width: `${song.analysis[key]}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">
        <h2>原歌拆解</h2>
        <span>声音变成真实食材</span>
      </div>
      <div className="recipe-map compact">
        {song.originalIngredients.map((ingredient) => {
          const copy = categoryCopy[ingredient.category];
          return (
            <article className="recipe-map-item" key={ingredient.id}>
              <div>
                <span>{copy.music} → {copy.kitchen}</span>
                <strong>
                  {ingredient.emoji} {ingredient.label}
                </strong>
              </div>
              <p>{ingredient.musicSource}</p>
            </article>
          );
        })}
      </div>

      <button className="primary-button bottom-action" type="button" onClick={onNext}>
        开始备菜
      </button>
    </section>
  );
}

export default RecipeAnalysisScreen;
