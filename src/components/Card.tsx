import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "panel" | "outline";
}

export default function Card({ children, variant = "default", className = "", ...rest }: CardProps) {
  const base = "rounded-md border";
  const variants: Record<string, string> = {
    default: "bg-op-charcoal border-op-line",
    panel: "bg-op-panel border-op-line",
    outline: "bg-transparent border-op-line",
  };
  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </div>
  );
}
