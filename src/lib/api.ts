export interface Proyecto {
  id: number;
  nombre: string;
  fechaInicio: string;
  estado: string;
  responsable: string;
  monto: number;
  created_by: number;
  creador?: { id: number; nombre: string; correo: string };
}

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
}

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      (data as { error?: string } | null)?.error ?? "Error del servidor"
    );
  }
  return data as T;
}

export function formatFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES");
}
