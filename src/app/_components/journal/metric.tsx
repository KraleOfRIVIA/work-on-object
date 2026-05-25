type MetricProps = {
  label: string;
  value: string;
};

export function Metric({ label, value }: MetricProps) {
  return (
    <div className="min-w-0 px-2">
      <p className="truncate text-[11px] uppercase tracking-[0.1em] text-[#7a7468]">
        {label}
      </p>
      <p className="mt-1 truncate text-base font-semibold text-[#1f211d]">{value}</p>
    </div>
  );
}
