import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { parseProyectoInput } from "@/lib/proyecto";

export async function GET() {
  const proyectos = await prisma.proyecto.findMany({
    orderBy: { id: "desc" },
    include: { creador: { select: { id: true, nombre: true, correo: true } } },
  });
  return NextResponse.json(proyectos);
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const { data, error } = parseProyectoInput(body);
  if (error || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const proyecto = await prisma.proyecto.create({
    data: { ...data, created_by: userId },
  });
  return NextResponse.json(proyecto, { status: 201 });
}
