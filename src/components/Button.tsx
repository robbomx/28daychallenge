import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-op-orange text-op-black hover:bg-op-orange-light active:bg-op-orange border border-op-orange",
  secondary:
    "bg-transparent text-op-off-white border border-op-olive-light hover:bg-op-olive-dark",
  ghost:
    "bg-transparent text-op-off-white-dim border border-transparent hover:border-op-line hover:text-op-off-white",
  danger:
    "bg-transparent text-op-error border border-op-error/60 hover:bg-op-error/10",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`font-display uppercase stencil-tracking font-semibold transition-colors duration-150 clip-notch disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
