import Link from "next/link";
import { Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2", className)}
      aria-label="Tech Solutions"
    >
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/30">
        <Boxes className="size-5" />
      </span>
      {!compact && (
        <span className="font-display text-xl font-bold tracking-tight text-foreground text-shadow-brand">
          Tech<span className="text-primary"> Solutions</span>
        </span>
      )}
    </Link>
  );
}
