import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signToken, verifyPassword, TOKEN_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as
    | { correo?: string; clave?: string }
    | null;

  const correo = body?.correo?.trim().toLowerCase();
  const clave = body?.clave;

  if (!correo || !clave) {
    return NextResponse.json(
      { error: "Correo y clave son obligatorios" },
      { status: 400 }
    );
  }

  const usuario = await prisma.usuario.findUnique({ where: { correo } });
  if (!usuario || !(await verifyPassword(usuario.clave, clave))) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  const token = await signToken(usuario.id);
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  return NextResponse.json({
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
  });
}
