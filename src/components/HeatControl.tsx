export type HeatLevel = 'low' | 'medium' | 'high';

type HeatControlProps = {
  value: HeatLevel;
  onChange: (value: HeatLevel) => void;
};

const heatOptions: Array<{ id: HeatLevel; label: string; note: string }> = [
  { id: 'low', label: '小火', note: 'Chill' },
  { id: 'medium', label: '中火', note: 'Default' },
  { id: 'high', label: '大火', note: 'Energy' },
];

function HeatControl({ value, onChange }: HeatControlProps) {
  return (
    <div className="heat-control">
      {heatOptions.map((option) => (
        <button
          className={value === option.id ? 'active' : ''}
          type="button"
          key={option.id}
          onClick={() => onChange(option.id)}
        >
          <span>{option.label}</span>
          <small>{option.note}</small>
        </button>
      ))}
    </div>
  );
}

export default HeatControl;
