import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { replaceTrack, resetAllTracks, setHeatLevel, setSeasoningEffects, startTransport } from '../audio/audioEngine';
import type { IngredientOption, Song } from '../data/songManifest';
import HeatControl, { type HeatLevel } from './HeatControl';
import IngredientCard from './IngredientCard';
import SeasoningPanel from './SeasoningPanel';

type CookingScreenProps = {
  song: Song;
  ingredients: IngredientOption[];
  cookedItems: IngredientOption[];
  setCookedItems: Dispatch<SetStateAction<IngredientOption[]>>;
  seasonings: string[];
  setSeasonings: Dispatch<SetStateAction<string[]>>;
  heat: HeatLevel;
  setHeat: (heat: HeatLevel) => void;
  onBack: () => void;
  onServe: () => void;
};

function CookingScreen({
  song,
  ingredients,
  cookedItems,
  setCookedItems,
  seasonings,
  setSeasonings,
  heat,
  setHeat,
  onBack,
  onServe,
}: CookingScreenProps) {
  const cookedIds = cookedItems.map((item) => item.id);
  const canServe = cookedItems.length >= 2;

  useEffect(() => {
    setHeatLevel(heat);
    setSeasoningEffects(seasonings);
  }, [heat, seasonings]);

  const addIngredient = async (ingredient: IngredientOption) => {
    await startTransport();
    replaceTrack(ingredient.category, ingredient.audioTrackId);
    setCookedItems((current) => {
      const withoutCategory = current.filter((item) => item.category !== ingredient.category);
      return [...withoutCategory, ingredient];
    });
  };

  const resetPan = () => {
    resetAllTracks();
    setHeatLevel(heat);
    setSeasoningEffects([]);
    setCookedItems([]);
    setSeasonings([]);
  };

  const toggleSeasoning = (seasoningId: string) => {
    setSeasonings((current) =>
      current.includes(seasoningId)
        ? current.filter((id) => id !== seasoningId)
        : [...current, seasoningId],
    );
  };

  return (
    <section className="screen cooking-screen">
      <header className="cooking-header">
        <button className="text-button" type="button" onClick={onBack}>
          ← 备菜
        </button>
        <div>
          <p className="eyebrow">Step 3 · {song.bpm} BPM</p>
          <h1>开始下锅</h1>
        </div>
      </header>

      <HeatControl value={heat} onChange={setHeat} />

      <div className="cooktop">
        <div className="selected-rail">
          <h2>食材</h2>
          {ingredients.map((ingredient) => (
            <IngredientCard
              ingredient={ingredient}
              key={ingredient.id}
              cooked={cookedIds.includes(ingredient.id)}
              onClick={() => addIngredient(ingredient)}
            />
          ))}
        </div>

        <div className={`pan heat-${heat}`}>
          <div className="pan-inner">
            {cookedItems.length === 0 ? (
              <p>点击食材加入锅中</p>
            ) : (
              cookedItems.map((item) => (
                <span className="pan-food" key={item.id}>
                  {item.emoji}
                </span>
              ))
            )}
          </div>
          <span className="pan-handle" />
        </div>

        <SeasoningPanel selected={seasonings} onToggle={toggleSeasoning} />
      </div>

      <footer className="cooking-actions">
        <button className="secondary-button" type="button" onClick={startTransport}>
          Play
        </button>
        <button className="secondary-button" type="button" onClick={resetPan}>
          Reset
        </button>
        <button className="primary-button" type="button" disabled={!canServe} onClick={onServe}>
          Serve
        </button>
      </footer>

      {!canServe && <p className="hint">至少加入 2 种食材才能出锅。</p>}
    </section>
  );
}

export default CookingScreen;
