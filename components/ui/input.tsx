import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "focus-ring h-12 w-full rounded-lg border border-border/90 bg-white px-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "focus-ring min-h-28 w-full resize-y rounded-lg border border-border/90 bg-white px-4 py-3 text-sm text-foreground shadow-sm placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "focus-ring h-12 w-full rounded-lg border border-border/90 bg-white px-4 text-sm font-medium text-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
