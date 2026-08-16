"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  FolderKanban,
  Hash,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";
import { api, formatFecha, type Proyecto } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EstadoBadge } from "@/components/estado-badge";

export default function ProyectoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<Proyecto>(`/api/proyectos/${id}`)
      .then(setProyecto)
      .catch((e) => setError(e instanceof Error ? e.message : "No encontrado"));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
        <Card className="shadow-lg">
          <CardContent className="space-y-4 py-8 text-center">
            <p className="text-destructive">{error}</p>
            <Button asChild variant="outline">
              <Link href="/proyectos">
                <ArrowLeft />
                Volver a proyectos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8 text-muted-foreground">
        Cargando…
      </div>
    );
  }

  const campos = [
    { label: "ID", valor: `#${proyecto.id}`, Icon: Hash },
    { label: "Fecha de Inicio", valor: formatFecha(proyecto.fechaInicio), Icon: CalendarDays },
    { label: "Estado", Icon: FolderKanban, badge: true },
    { label: "Responsable", valor: proyecto.responsable, Icon: UserRound },
    {
      label: "Monto",
      valor: `$${proyecto.monto.toLocaleString()}`,
      Icon: CircleDollarSign,
    },
    {
      label: "Creado por",
      valor: proyecto.creador?.nombre ?? "—",
      Icon: UserRound,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
      <Link
        href="/proyectos"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver a proyectos
      </Link>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{proyecto.nombre}</CardTitle>
          <CardDescription>Detalle del proyecto</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y">
            {campos.map(({ label, valor, Icon, badge }) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 py-3"
              >
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className="size-4" />
                  {label}
                </dt>
                <dd className="text-sm font-medium">
                  {badge ? (
                    <EstadoBadge estado={proyecto.estado} />
                  ) : (
                    valor
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex gap-2">
            <Button asChild>
              <Link href={`/proyectos/${proyecto.id}/editar`}>
                <Pencil />
                Editar
              </Link>
            </Button>
            <Button asChild variant="destructive">
              <Link href={`/proyectos/${proyecto.id}/eliminar`}>
                <Trash2 />
                Eliminar
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
