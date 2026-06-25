import { seasoningOptions } from '../data/songManifest';
import { getSeasoningCounts } from '../data/seasoningLogic';

type SeasoningPanelProps = {
  selected: string[];
  onAdd: (seasoningId: string) => void;
};

function SeasoningPanel({ selected, onAdd }: SeasoningPanelProps) {
  const counts = getSeasoningCounts(selected);

  return (
    <aside className="seasoning-panel">
      <h2>调味料</h2>
      <div className="seasoning-list">
        {seasoningOptions.map((seasoning) => {
          const count = counts[seasoning.id] ?? 0;
          return (
            <button
              className={count > 0 ? 'seasoning active' : 'seasoning'}
              type="button"
              key={seasoning.id}
              onClick={() => onAdd(seasoning.id)}
            >
              <span>{seasoning.emoji}</span>
              <small>{seasoning.label}</small>
              {count > 0 && <b>×{count}</b>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default SeasoningPanel;
