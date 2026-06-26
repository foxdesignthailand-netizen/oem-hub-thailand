import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline" | "ghost" | "soft" | "dark";
type ButtonSize = "sm" | "md" | "lg" | "icon";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-sm hover:bg-primary-deep",
  outline:
    "border border-primary/45 bg-white text-primary-deep hover:bg-primary-light",
  ghost: "text-foreground hover:bg-muted",
  soft: "bg-primary-light text-primary-deep hover:bg-primary-soft",
  dark: "bg-foreground text-white hover:bg-primary-deep"
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
    "focus-ring inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return <Link className={classNames} href={href} {...(props as any)} />;
  }

  return <button className={classNames} {...props} />;
}
