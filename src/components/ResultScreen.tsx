import { seasoningOptions, type FlavorProfile, type IngredientOption, type Song } from '../data/songManifest';
import type { HeatLevel } from './HeatControl';

type ResultScreenProps = {
  song: Song;
  ingredients: IngredientOption[];
  seasonings: string[];
  heat: HeatLevel;
  onCookAgain: () => void;
  onHome: () => void;
};

const clamp = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

function ResultScreen({ song, ingredients, seasonings, heat, onCookAgain, onHome }: ResultScreenProps) {
  const finalFlavor = ingredients.reduce<FlavorProfile>(
    (profile, ingredient) => ({
      energy: profile.energy + (ingredient.flavorDelta.energy ?? 0),
      brightness: profile.brightness + (ingredient.flavorDelta.brightness ?? 0),
      chill: profile.chill + (ingredient.flavorDelta.chill ?? 0),
      night: profile.night + (ingredient.flavorDelta.night ?? 0),
    }),
    { ...song.analysis },
  );

  seasonings.forEach((id) => {
    const seasoning = seasoningOptions.find((item) => item.id === id);
    if (!seasoning) return;
    finalFlavor.energy += seasoning.flavorDelta.energy ?? 0;
    finalFlavor.brightness += seasoning.flavorDelta.brightness ?? 0;
    finalFlavor.chill += seasoning.flavorDelta.chill ?? 0;
    finalFlavor.night += seasoning.flavorDelta.night ?? 0;
  });

  if (heat === 'low') finalFlavor.chill += 10;
  if (heat === 'high') finalFlavor.energy += 10;

  const remixName = `${ingredients[0]?.label ?? '厨房'} ${song.title} Remix`;
  const final = {
    energy: clamp(finalFlavor.energy),
    brightness: clamp(finalFlavor.brightness),
    chill: clamp(finalFlavor.chill),
    night: clamp(finalFlavor.night),
  };

  const chefComment =
    final.night > 75
      ? '这道料理充满夜晚氛围，低频温暖，旋律轻松，很适合一个人戴着耳机散步。'
      : final.brightness > 75
        ? '这道料理清爽明亮，像阳光洒在厨房台面，适合给下午加一点跳动感。'
        : final.energy > 75
          ? '这道料理火候很足，节奏弹性强，适合把派对从第一口推到副歌。'
          : '这道料理平衡顺口，鼓点、和弦和氛围都融合得很自然。';

  const usedSeasonings = seasoningOptions.filter((item) => seasonings.includes(item.id));

  return (
    <section className="screen result-screen">
      <p className="eyebrow">出锅评价</p>
      <h1>{remixName}</h1>
      <p className="result-duration">时长 {song.duration} · 火候 {heat === 'low' ? '小火' : heat === 'high' ? '大火' : '中火'}</p>

      <div className="recipe-card">
        <div className="result-food">🍽️</div>
        <h2>AI 厨师评价</h2>
        <p>{chefComment}</p>
      </div>

      <div className="result-grid">
        {Object.entries(final).map(([key, value]) => (
          <div className="result-stat" key={key}>
            <span>{key}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="used-list">
        <h2>使用食材</h2>
        <p>{ingredients.map((item) => `${item.emoji} ${item.label}`).join(' · ')}</p>
        <h2>使用调味料</h2>
        <p>{usedSeasonings.length ? usedSeasonings.map((item) => `${item.emoji} ${item.label}`).join(' · ') : '未添加'}</p>
      </div>

      <div className="result-actions">
        <button className="secondary-button" type="button" onClick={onHome}>
          分享菜谱
        </button>
        <button className="primary-button" type="button" onClick={onCookAgain}>
          再做一次
        </button>
      </div>
    </section>
  );
}

export default ResultScreen;
