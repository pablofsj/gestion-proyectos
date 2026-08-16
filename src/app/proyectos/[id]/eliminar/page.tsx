"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Proyecto } from "@/lib/api";

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

  if (!proyecto && !error) {
    return <main className="min-h-screen bg-gray-100 p-6">Cargando…</main>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Eliminar Proyecto</h1>
        {error && !proyecto ? (
          <>
            <p className="text-red-600">{error}</p>
            <Link href="/proyectos" className="text-blue-600 hover:underline">
              Volver
            </Link>
          </>
        ) : (
          <>
            <p className="text-gray-700">
              ¿Estás seguro de eliminar el proyecto{" "}
              <strong>{proyecto?.nombre}</strong>? Esta acción no se puede deshacer.
            </p>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="mt-6 flex gap-2">
              <button
                onClick={onDelete}
                disabled={loading}
                className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Eliminando…" : "Eliminar"}
              </button>
              <Link
                href={`/proyectos/${id}`}
                className="rounded border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
