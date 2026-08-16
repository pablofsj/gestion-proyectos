import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";
import { parseProyectoInput } from "@/lib/proyecto";

type Ctx = { params: Promise<{ id: string }> };

async function findProyecto(id: number) {
  return prisma.proyecto.findUnique({
    where: { id },
    include: { creador: { select: { id: true, nombre: true, correo: true } } },
  });
}

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const proyecto = await findProyecto(Number(id));
  if (!proyecto) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }
  return NextResponse.json(proyecto);
}

export async function PUT(request: Request, { params }: Ctx) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const proyecto = await findProyecto(Number(id));
  if (!proyecto) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const { data, error } = parseProyectoInput(body);
  if (error || !data) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const actualizado = await prisma.proyecto.update({
    where: { id: proyecto.id },
    data,
  });
  return NextResponse.json(actualizado);
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const proyecto = await findProyecto(Number(id));
  if (!proyecto) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
  }

  await prisma.proyecto.delete({ where: { id: proyecto.id } });
  return NextResponse.json({ ok: true });
}
