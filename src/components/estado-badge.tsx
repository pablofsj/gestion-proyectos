import { Badge } from "@/components/ui/badge";

export function EstadoBadge({ estado }: { estado: string }) {
  const e = estado.toLowerCase();
  const variant =
    e.includes("finaliz") || e.includes("complet") || e.includes("termin")
      ? "default"
      : e.includes("progres") || e.includes("curso") || e.includes("planif")
        ? "secondary"
        : "outline";

  return <Badge variant={variant}>{estado}</Badge>;
}
