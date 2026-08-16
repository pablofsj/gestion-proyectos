"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, TriangleAlert } from "lucide-react";
import { api, type Proyecto } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EliminarProyectoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api<Proyecto>(`/api/proyectos/${id}`)
      .then(setProyecto)
      .catch((e) => setError(e instanceof Error ? e.message : "No encontrado"));
  }, [id]);

  async function onDelete() {
    setLoading(true);
    setError("");
    try {
      await api(`/api/proyectos/${id}`, { method: "DELETE" });
      router.push("/proyectos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
      setLoading(false);
    }
  }

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
          <div className="mx-auto mb-2 grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
            <TriangleAlert className="size-6" />
          </div>
          <CardTitle className="text-center text-2xl">Eliminar Proyecto</CardTitle>
          <CardDescription className="text-center">
            Esta acción no se puede deshacer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!proyecto && !error ? (
            <p className="text-center text-muted-foreground">Cargando…</p>
          ) : !proyecto ? (
            <p className="text-center text-destructive">{error}</p>
          ) : (
            <p className="text-center">
              ¿Estás seguro de eliminar el proyecto{" "}
              <span className="font-semibold">{proyecto.nombre}</span>?
            </p>
          )}

          {error && proyecto && (
            <p className="text-center text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-center gap-2 pt-2">
            <Button
              onClick={onDelete}
              disabled={loading || !proyecto}
              variant="destructive"
              size="lg"
            >
              <Trash2 />
              {loading ? "Eliminando…" : "Eliminar"}
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/proyectos/${id}`}>Cancelar</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
