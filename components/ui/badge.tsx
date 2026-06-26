import { cn } from "@/lib/utils";

type BadgeTone = "green" | "blue" | "orange" | "red" | "gray" | "purple";

const tones: Record<BadgeTone, string> = {
  green: "bg-primary-light text-primary-deep ring-primary-soft",
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  orange: "bg-orange-50 text-orange-700 ring-orange-100",
  red: "bg-red-50 text-red-700 ring-red-100",
  gray: "bg-gray-100 text-gray-700 ring-gray-200",
  purple: "bg-purple-50 text-purple-700 ring-purple-100"
};

export function Badge({
  className,
  tone = "green",
  children
}: {
  className?: string;
  tone?: BadgeTone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
