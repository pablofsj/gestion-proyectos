"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, formatFecha, type Proyecto } from "@/lib/api";

export default function ProyectosPage() {
  const router = useRouter();
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<Proyecto[]>("/api/proyectos")
      .then(setProyectos)
      .catch(() => setProyectos([]))
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Proyectos</h1>
          <div className="flex gap-2">
            <Link
              href="/proyectos/nuevo"
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Nuevo proyecto
            </Link>
            <button
              onClick={logout}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600">Cargando…</p>
        ) : proyectos.length === 0 ? (
          <p className="rounded bg-white p-6 text-gray-600 shadow">
            No hay proyectos registrados.
          </p>
        ) : (
          <table className="w-full overflow-hidden rounded-lg bg-white shadow">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Responsable</th>
                <th className="px-4 py-3 font-medium">Monto</th>
                <th className="px-4 py-3 font-medium">Inicio</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
              {proyectos.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <Link href={`/proyectos/${p.id}`} className="font-medium text-blue-600 hover:underline">
                      {p.nombre}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{p.estado}</td>
                  <td className="px-4 py-3">{p.responsable}</td>
                  <td className="px-4 py-3">${p.monto.toLocaleString()}</td>
                  <td className="px-4 py-3">{formatFecha(p.fechaInicio)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link href={`/proyectos/${p.id}/editar`} className="text-blue-600 hover:underline">
                        Editar
                      </Link>
                      <Link href={`/proyectos/${p.id}/eliminar`} className="text-red-600 hover:underline">
                        Eliminar
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
