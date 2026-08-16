"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, type Proyecto } from "@/lib/api";

const fieldClass =
  "w-full rounded border border-gray-300 px-3 py-2 text-gray-900";

export default function EditarProyectoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);

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
    return <main className="min-h-screen bg-gray-100 p-6">Cargando…</main>;
  }

  if (!proyecto) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <p className="text-red-600">{error}</p>
        <Link href="/proyectos" className="text-blue-600 hover:underline">
          Volver
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Editar Proyecto</h1>
        <form onSubmit={onSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
            <input name="nombre" required defaultValue={proyecto.nombre} className={fieldClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de Inicio</label>
            <input
              name="fechaInicio"
              type="date"
              required
              defaultValue={proyecto.fechaInicio.slice(0, 10)}
              className={fieldClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
            <input name="estado" required defaultValue={proyecto.estado} className={fieldClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Responsable</label>
            <input name="responsable" required defaultValue={proyecto.responsable} className={fieldClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Monto</label>
            <input
              name="monto"
              type="number"
              step="0.01"
              required
              defaultValue={proyecto.monto}
              className={fieldClass}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Guardar cambios
            </button>
            <Link
              href={`/proyectos/${id}`}
              className="rounded border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
