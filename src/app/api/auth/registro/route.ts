import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as
    | { nombre?: string; correo?: string; clave?: string }
    | null;

  const nombre = body?.nombre?.trim();
  const correo = body?.correo?.trim().toLowerCase();
  const clave = body?.clave;

  if (!nombre || !correo || !clave) {
    return NextResponse.json(
      { error: "Nombre, correo y clave son obligatorios" },
      { status: 400 }
    );
  }
  if (clave.length < 6) {
    return NextResponse.json(
      { error: "La clave debe tener al menos 6 caracteres" },
      { status: 400 }
    );
  }

  const existente = await prisma.usuario.findUnique({ where: { correo } });
  if (existente) {
    return NextResponse.json(
      { error: "El correo ya está registrado" },
      { status: 409 }
    );
  }

  const usuario = await prisma.usuario.create({
    data: { nombre, correo, clave: await hashPassword(clave) },
    select: { id: true, nombre: true, correo: true },
  });

  return NextResponse.json(usuario, { status: 201 });
}
