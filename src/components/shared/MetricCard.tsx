interface MetricCardProps {
  label: string;
  value: string | number;
  note?: string;
}

export function MetricCard({ label, value, note }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-dashboard-line bg-white p-4">
      <div className="text-xs font-medium text-dashboard-sub">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-tight text-dashboard-text">{value}</div>
      {note ? <div className="mt-1 text-xs text-dashboard-weak">{note}</div> : null}
    </div>
  );
}
