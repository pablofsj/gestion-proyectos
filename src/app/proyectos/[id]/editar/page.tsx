"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { api, type Proyecto } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditarProyectoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Proyecto>(`/api/proyectos/${id}`)
      .then((p) => {
        setProyecto(p);
        setLoading(false);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "No encontrado");
        setLoading(false);
      });
  }, [id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await api(`/api/proyectos/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          nombre: form.get("nombre"),
          fechaInicio: form.get("fechaInicio"),
          estado: form.get("estado"),
          responsable: form.get("responsable"),
          monto: form.get("monto"),
        }),
      });
      router.push(`/proyectos/${id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8 text-muted-foreground">
        Cargando…
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
        <Card className="shadow-lg">
          <CardContent className="space-y-4 py-8 text-center">
            <p className="text-destructive">{error}</p>
            <Button asChild variant="outline">
              <Link href="/proyectos">
                <ArrowLeft />
                Volver
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-lg flex-1 px-4 py-8">
      <Link
        href={`/proyectos/${id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Volver al proyecto
      </Link>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Pencil className="size-6 text-primary" />
            Editar Proyecto
          </CardTitle>
          <CardDescription>Actualiza la información del proyecto</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                required
                defaultValue={proyecto.nombre}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
              <Input
                id="fechaInicio"
                name="fechaInicio"
                type="date"
                required
                defaultValue={proyecto.fechaInicio.slice(0, 10)}
                className="h-10"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  name="estado"
                  required
                  defaultValue={proyecto.estado}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsable">Responsable</Label>
                <Input
                  id="responsable"
                  name="responsable"
                  required
                  defaultValue={proyecto.responsable}
                  className="h-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="monto">Monto</Label>
              <Input
                id="monto"
                name="monto"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={proyecto.monto}
                className="h-10"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2 pt-2">
              <Button type="submit" size="lg">
                Guardar cambios
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/proyectos/${id}`}>Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
