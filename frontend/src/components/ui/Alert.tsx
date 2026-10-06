import type { ComponentProps } from "react";

type AlertVariant = "danger" | "success";

interface AlertProps extends ComponentProps<"div"> {
  variant?: AlertVariant;
}

const variantClasses: Record<AlertVariant, string> = {
  danger: "border-danger/30 bg-danger/10 text-danger",
  success: "border-primary/30 bg-primary/10 text-primary",
};

function Alert({ variant = "danger", className = "", ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-md border px-3 py-2 text-sm ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

export default Alert;
