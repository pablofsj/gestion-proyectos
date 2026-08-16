"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

const fieldClass =
  "w-full rounded border border-gray-300 px-3 py-2 text-gray-900";

export default function NuevoProyectoPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      await api("/api/proyectos", {
        method: "POST",
        body: JSON.stringify({
          nombre: form.get("nombre"),
          fechaInicio: form.get("fechaInicio"),
          estado: form.get("estado"),
          responsable: form.get("responsable"),
          monto: form.get("monto"),
        }),
      });
      router.push("/proyectos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Crear Proyecto</h1>
        <form onSubmit={onSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nombre</label>
            <input name="nombre" required className={fieldClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de Inicio</label>
            <input name="fechaInicio" type="date" required className={fieldClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
            <input name="estado" required className={fieldClass} placeholder="En progreso, Finalizado…" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Responsable</label>
            <input name="responsable" required className={fieldClass} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Monto</label>
            <input name="monto" type="number" step="0.01" required className={fieldClass} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Guardando…" : "Crear"}
            </button>
            <Link
              href="/proyectos"
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
