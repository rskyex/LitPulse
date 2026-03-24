interface Props {
  label: string;
  value: string | number;
  sub?: string;
}

export default function StatCard({ label, value, sub }: Props) {
  return (
    <div className="rounded-xl border border-parchment-dark bg-white p-4 text-center">
      <p className="text-2xl font-bold text-accent">{value}</p>
      <p className="text-sm font-medium text-ink">{label}</p>
      {sub && <p className="mt-1 text-xs text-ink-muted">{sub}</p>}
    </div>
  );
}
