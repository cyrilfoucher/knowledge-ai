import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "border border-border text-text hover:bg-surface",
  danger: "bg-danger text-on-danger hover:opacity-90",
};

function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

export default Button;
