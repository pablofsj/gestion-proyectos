"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderKanban, Pencil, Plus, Trash2 } from "lucide-react";
import { api, formatFecha, type Proyecto } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EstadoBadge } from "@/components/estado-badge";

export default function ProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Proyecto[]>("/api/proyectos")
      .then(setProyectos)
      .catch(() => setProyectos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FolderKanban className="size-6 text-primary" />
              Proyectos
            </CardTitle>
            <CardDescription>
              Gestiona todos los proyectos de la empresa
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/proyectos/nuevo">
              <Plus />
              Nuevo proyecto
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Cargando…</p>
          ) : proyectos.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              No hay proyectos registrados.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proyectos.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-muted-foreground">
                      #{p.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/proyectos/${p.id}`}
                        className="text-foreground hover:text-primary hover:underline"
                      >
                        {p.nombre}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <EstadoBadge estado={p.estado} />
                    </TableCell>
                    <TableCell>{p.responsable}</TableCell>
                    <TableCell>${p.monto.toLocaleString()}</TableCell>
                    <TableCell>{formatFecha(p.fechaInicio)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link
                            href={`/proyectos/${p.id}/editar`}
                            aria-label={`Editar ${p.nombre}`}
                          >
                            <Pencil />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon-sm">
                          <Link
                            href={`/proyectos/${p.id}/eliminar`}
                            aria-label={`Eliminar ${p.nombre}`}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
