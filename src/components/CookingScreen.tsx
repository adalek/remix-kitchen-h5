import { useEffect, type CSSProperties, type Dispatch, type SetStateAction } from 'react';
import {
  initAudio,
  removeTrack,
  replaceTrack,
  resetAllTracks,
  setHeatLevel,
  setSeasoningEffects,
  startTransport,
} from '../audio/audioEngine';
import { seasoningOptions, type IngredientOption, type Song } from '../data/songManifest';
import { seasoningRules } from '../data/seasoningLogic';
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
  const panMotionStyles = [
    {
      '--x': '-30%',
      '--y': '-14%',
      '--x1': '18px',
      '--y1': '-12px',
      '--x2': '2px',
      '--y2': '16px',
      '--x3': '-15px',
      '--y3': '4px',
      '--spin': '38deg',
      '--delay': '0s',
      '--dur': '2.05s',
      '--scale': '1.08',
    },
    {
      '--x': '22%',
      '--y': '-24%',
      '--x1': '-16px',
      '--y1': '-6px',
      '--x2': '13px',
      '--y2': '15px',
      '--x3': '6px',
      '--y3': '-10px',
      '--spin': '-44deg',
      '--delay': '-0.32s',
      '--dur': '2.42s',
      '--scale': '0.96',
    },
    {
      '--x': '28%',
      '--y': '20%',
      '--x1': '-20px',
      '--y1': '8px',
      '--x2': '-4px',
      '--y2': '-18px',
      '--x3': '15px',
      '--y3': '-4px',
      '--spin': '52deg',
      '--delay': '-0.76s',
      '--dur': '1.88s',
      '--scale': '1.02',
    },
    {
      '--x': '-24%',
      '--y': '24%',
      '--x1': '14px',
      '--y1': '10px',
      '--x2': '20px',
      '--y2': '-12px',
      '--x3': '-8px',
      '--y3': '-15px',
      '--spin': '-34deg',
      '--delay': '-1.05s',
      '--dur': '2.28s',
      '--scale': '0.92',
    },
    {
      '--x': '2%',
      '--y': '2%',
      '--x1': '10px',
      '--y1': '-20px',
      '--x2': '-18px',
      '--y2': '8px',
      '--x3': '12px',
      '--y3': '12px',
      '--spin': '66deg',
      '--delay': '-1.38s',
      '--dur': '2.18s',
      '--scale': '1',
    },
    {
      '--x': '-6%',
      '--y': '-30%',
      '--x1': '22px',
      '--y1': '5px',
      '--x2': '-10px',
      '--y2': '18px',
      '--x3': '-18px',
      '--y3': '-8px',
      '--spin': '-58deg',
      '--delay': '-1.72s',
      '--dur': '2.52s',
      '--scale': '0.9',
    },
    {
      '--x': '12%',
      '--y': '28%',
      '--x1': '-12px',
      '--y1': '-18px',
      '--x2': '18px',
      '--y2': '-3px',
      '--x3': '-6px',
      '--y3': '14px',
      '--spin': '46deg',
      '--delay': '-0.58s',
      '--dur': '2.33s',
      '--scale': '0.94',
    },
    {
      '--x': '-34%',
      '--y': '6%',
      '--x1': '20px',
      '--y1': '14px',
      '--x2': '4px',
      '--y2': '-16px',
      '--x3': '-10px',
      '--y3': '-6px',
      '--spin': '-48deg',
      '--delay': '-1.18s',
      '--dur': '1.98s',
      '--scale': '1.04',
    },
    {
      '--x': '34%',
      '--y': '-2%',
      '--x1': '-22px',
      '--y1': '-14px',
      '--x2': '-8px',
      '--y2': '18px',
      '--x3': '13px',
      '--y3': '7px',
      '--spin': '72deg',
      '--delay': '-0.94s',
      '--dur': '2.62s',
      '--scale': '0.88',
    },
    {
      '--x': '-12%',
      '--y': '32%',
      '--x1': '8px',
      '--y1': '-16px',
      '--x2': '-20px',
      '--y2': '-2px',
      '--x3': '17px',
      '--y3': '-10px',
      '--spin': '-64deg',
      '--delay': '-1.56s',
      '--dur': '2.12s',
      '--scale': '0.98',
    },
  ];

  useEffect(() => {
    setHeatLevel(heat);
    setSeasoningEffects(seasonings);
  }, [heat, seasonings]);

  const addIngredient = async (ingredient: IngredientOption) => {
    await initAudio();

    if (cookedIds.includes(ingredient.id)) {
      removeTrack(ingredient.audioTrackId);
      setCookedItems((current) => current.filter((item) => item.id !== ingredient.id));
      return;
    }

    replaceTrack(ingredient.category, ingredient.audioTrackId);
    await startTransport();
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

  const addSeasoning = (seasoningId: string) => {
    setSeasonings((current) => [...current, seasoningId]);
  };

  const seasoningItems = seasonings
    .map((id) => seasoningOptions.find((seasoning) => seasoning.id === id))
    .filter((seasoning): seasoning is (typeof seasoningOptions)[number] => Boolean(seasoning));

  return (
    <section className={`screen cooking-screen heat-${heat}`}>
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
        <div className="selected-rail cook-tray">
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

        <div className="pan-station">
          <div className="pan-status">
            <span>最少两种食材</span>
          </div>

          <div className="pan-rule-board">
            <small>调味反应</small>
            <div className="pan-rule-icons" aria-label="调味反应">
              {seasoningRules.map((rule) => (
                <span key={rule.id} title={rule.description}>
                  {rule.icons.map((icon, index) => (
                    <i key={`${icon}-${index}`}>{icon}</i>
                  ))}
                  <em>→</em>
                  <b>{rule.resultIcon}</b>
                </span>
              ))}
            </div>
          </div>

          <div className={`pan heat-${heat}`}>
            <div className="pan-inner">
              {cookedItems.length === 0 && seasoningItems.length === 0 ? (
                <p>点击食材加入锅中</p>
              ) : (
                <>
                  {cookedItems.map((item, index) => (
                    <span
                      className="pan-food"
                      key={item.id}
                      style={panMotionStyles[index % panMotionStyles.length] as CSSProperties}
                    >
                      {item.emoji}
                    </span>
                  ))}
                  {seasoningItems.map((item, index) => (
                    <span
                      className="pan-food pan-seasoning"
                      key={`${item.id}-${index}`}
                      style={panMotionStyles[(index + cookedItems.length) % panMotionStyles.length] as CSSProperties}
                    >
                      {item.emoji}
                    </span>
                  ))}
                </>
              )}
            </div>
            <span className="pan-handle" />
          </div>
        </div>

        <SeasoningPanel selected={seasonings} onAdd={addSeasoning} />
      </div>

      <footer className="cooking-actions">
        <button className="secondary-button" type="button" onClick={resetPan}>
          重置
        </button>
        <button className="primary-button" type="button" disabled={!canServe} onClick={onServe}>
          出锅
        </button>
      </footer>
    </section>
  );
}

export default CookingScreen;
