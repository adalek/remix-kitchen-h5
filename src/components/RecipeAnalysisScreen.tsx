import IngredientCard from './IngredientCard';
import type { FlavorProfile, Song } from '../data/songManifest';

type RecipeAnalysisScreenProps = {
  song: Song;
  onBack: () => void;
  onNext: () => void;
};

const flavorLabels: Record<keyof FlavorProfile, string> = {
  energy: 'Energy 能量',
  brightness: 'Brightness 明亮',
  chill: 'Chill 放松',
  night: 'Night 夜晚感',
};

function RecipeAnalysisScreen({ song, onBack, onNext }: RecipeAnalysisScreenProps) {
  return (
    <section className="screen">
      <header className="screen-header compact">
        <button className="text-button" type="button" onClick={onBack}>
          ← 换歌
        </button>
        <p className="eyebrow">AI 菜谱分析</p>
        <h1>{song.title}</h1>
        <p>{song.artist} · {song.bpm} BPM · {song.key}</p>
      </header>

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
        <h2>原始食材</h2>
        <span>音乐已被翻译成真实食物</span>
      </div>
      <div className="ingredient-grid">
        {song.originalIngredients.map((ingredient) => (
          <IngredientCard ingredient={ingredient} key={ingredient.id} />
        ))}
      </div>

      <button className="primary-button bottom-action" type="button" onClick={onNext}>
        开始备菜
      </button>
    </section>
  );
}

export default RecipeAnalysisScreen;
