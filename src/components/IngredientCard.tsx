import type { IngredientOption } from '../data/songManifest';

type IngredientCardProps = {
  ingredient: IngredientOption;
  selected?: boolean;
  cooked?: boolean;
  onClick?: () => void;
};

function IngredientCard({ ingredient, selected = false, cooked = false, onClick }: IngredientCardProps) {
  return (
    <button
      className={`ingredient-card ${selected ? 'is-selected' : ''} ${cooked ? 'is-cooked' : ''}`}
      type="button"
      onClick={onClick}
    >
      <span className="ingredient-emoji">{ingredient.emoji}</span>
      <span className="ingredient-name">{ingredient.label}</span>
      <span className="ingredient-source">{ingredient.musicSource}</span>
    </button>
  );
}

export default IngredientCard;
