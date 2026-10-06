import type { ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
}
function Input({ label, error, id, className = "", ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-lg border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/25${error ? "border-danger" : "border-border"} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default Input;
