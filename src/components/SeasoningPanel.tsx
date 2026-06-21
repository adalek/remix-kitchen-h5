import { seasoningOptions } from '../data/songManifest';

type SeasoningPanelProps = {
  selected: string[];
  onToggle: (seasoningId: string) => void;
};

function SeasoningPanel({ selected, onToggle }: SeasoningPanelProps) {
  return (
    <aside className="seasoning-panel">
      <h2>调味料</h2>
      <div className="seasoning-list">
        {seasoningOptions.map((seasoning) => (
          <button
            className={selected.includes(seasoning.id) ? 'seasoning active' : 'seasoning'}
            type="button"
            key={seasoning.id}
            onClick={() => onToggle(seasoning.id)}
          >
            <span>{seasoning.emoji}</span>
            <small>{seasoning.label}</small>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default SeasoningPanel;
