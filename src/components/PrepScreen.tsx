import IngredientCard from './IngredientCard';
import type { Dispatch, SetStateAction } from 'react';
import type { SelectionState } from '../App';
import type { IngredientCategory, Song } from '../data/songManifest';

type PrepScreenProps = {
  song: Song;
  selection: SelectionState;
  onChange: Dispatch<SetStateAction<SelectionState>>;
  onBack: () => void;
  onNext: () => void;
};

const categoryOrder: IngredientCategory[] = ['base', 'bass', 'chords', 'atmosphere', 'vocal'];

function PrepScreen({ song, selection, onChange, onBack, onNext }: PrepScreenProps) {
  return (
    <section className="screen">
      <header className="screen-header compact">
        <button className="text-button" type="button" onClick={onBack}>
          ← 分析
        </button>
        <p className="eyebrow">Step 2</p>
        <h1>备菜准备</h1>
        <p>每类选一个味道。Vocal 是可选点缀。</p>
      </header>

      <div className="prep-list">
        {categoryOrder.map((category) => (
          <section className="prep-category" key={category}>
            <div className="category-row">
              <h2>{song.ingredientOptions[category][0].roleLabel}</h2>
              {category === 'vocal' && (
                <button
                  className="mini-button"
                  type="button"
                  onClick={() => onChange((current) => ({ ...current, vocal: null }))}
                >
                  不加
                </button>
              )}
            </div>
            <div className="choice-row">
              {song.ingredientOptions[category].map((ingredient) => (
                <IngredientCard
                  ingredient={ingredient}
                  key={ingredient.id}
                  selected={selection[category]?.id === ingredient.id}
                  onClick={() => onChange((current) => ({ ...current, [category]: ingredient }))}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <button className="primary-button bottom-action" type="button" onClick={onNext}>
        进入锅台
      </button>
    </section>
  );
}

export default PrepScreen;
