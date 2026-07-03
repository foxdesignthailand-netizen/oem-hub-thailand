import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "soft" | "dark" | "white";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(16,185,129,0.26)] hover:bg-primary-deep hover:shadow-[0_12px_28px_rgba(4,120,87,0.28)]",
  outline:
    "border border-primary/35 bg-white text-primary-deep hover:border-primary/60 hover:bg-primary-light",
  ghost: "text-foreground hover:bg-emerald-50 hover:text-primary-deep",
  soft: "bg-primary-light text-primary-deep hover:bg-primary-soft",
  dark: "bg-slate-950 text-white hover:bg-primary-deep",
  white: "bg-white text-primary-deep shadow-sm hover:bg-primary-light"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 p-0"
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  href?: string;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild,
  href,
  ...props
}: ButtonProps) {
  const classNames = cn(
    "focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return <Link className={classNames} href={href} {...(props as any)} />;
  }

  return <button className={classNames} {...props} />;
}
