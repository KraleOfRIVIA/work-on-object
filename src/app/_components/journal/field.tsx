import type { ReactNode } from "react";

type FieldProps = {
  className?: string;
  children: ReactNode;
  error?: string;
  label: string;
};

export function Field({
  className = "mb-3",
  children,
  error,
  label,
}: FieldProps) {
  return (
    <label className={`${className} block text-sm font-medium text-[#3c3d36]`}>
      <span className="mb-1.5 block">{label}</span>
      {children}
      {error ? <span className="form-error mt-1.5 block">{error}</span> : null}
    </label>
  );
}
