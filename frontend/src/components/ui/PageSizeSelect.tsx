interface PageSizeSelectProps {
  value: number;
  onChange: (value: number) => void;
}

function PageSizeSelect({ value, onChange }: PageSizeSelectProps) {
  return (
    <label className="whitespace-nowrap text-sm text-muted">
      Afficher{" "}
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rounded-lg border border-border bg-surface px-2 py-1 text-heading focus:border-primary focus:outline-none"
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
        <option value={50}>50</option>
      </select>{" "}
      par page
    </label>
  );
}

export default PageSizeSelect;
