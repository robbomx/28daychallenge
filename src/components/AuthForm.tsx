import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Field({ label, error, id, ...rest }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="mono-label text-xs text-op-off-white-dim">
        {label}
      </label>
      <input
        id={id}
        className="bg-op-panel border border-op-line focus:border-op-orange px-3 py-2.5 text-sm text-op-off-white rounded-sm outline-none placeholder:text-op-off-white-dim/50"
        {...rest}
      />
      {error && <span className="text-xs text-op-error">{error}</span>}
    </div>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  children: ReactNode;
}

export function SelectField({ label, id, children, ...rest }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="mono-label text-xs text-op-off-white-dim">
        {label}
      </label>
      <select
        id={id}
        className="bg-op-panel border border-op-line focus:border-op-orange px-3 py-2.5 text-sm text-op-off-white rounded-sm outline-none"
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}
