"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { api, formatFecha, type Proyecto } from "@/lib/api";

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
      <main className="min-h-screen bg-gray-100 p-6">
        <p className="text-red-600">{error}</p>
        <Link href="/proyectos" className="text-blue-600 hover:underline">
          Volver a proyectos
        </Link>
      </main>
    );
  }

  if (!proyecto) {
    return <main className="min-h-screen bg-gray-100 p-6">Cargando…</main>;
  }

  const rows: [string, string][] = [
    ["Nombre", proyecto.nombre],
    ["Fecha de Inicio", formatFecha(proyecto.fechaInicio)],
    ["Estado", proyecto.estado],
    ["Responsable", proyecto.responsable],
    ["Monto", `$${proyecto.monto.toLocaleString()}`],
    ["Creado por", proyecto.creador?.nombre ?? "—"],
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{proyecto.nombre}</h1>
        <dl className="divide-y divide-gray-100 rounded-lg bg-white p-6 shadow">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 text-sm">
              <dt className="font-medium text-gray-600">{label}</dt>
              <dd className="text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex gap-2">
          <Link
            href={`/proyectos/${proyecto.id}/editar`}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Editar
          </Link>
          <Link
            href={`/proyectos/${proyecto.id}/eliminar`}
            className="rounded border border-red-300 bg-white px-4 py-2 font-medium text-red-600 hover:bg-red-50"
          >
            Eliminar
          </Link>
          <Link
            href="/proyectos"
            className="rounded border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Volver
          </Link>
        </div>
      </div>
    </main>
  );
}
