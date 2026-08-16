"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegistroPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      await api("/api/auth/registro", {
        method: "POST",
        body: JSON.stringify({
          nombre: form.get("nombre"),
          correo: form.get("correo"),
          clave: form.get("clave"),
        }),
      });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background px-4 py-12">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <UserPlus className="size-6" />
          </div>
          <CardTitle className="text-2xl">Registro</CardTitle>
          <CardDescription>Crea tu cuenta para gestionar proyectos</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                required
                placeholder="Tu nombre"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="correo">Correo</Label>
              <Input
                id="correo"
                name="correo"
                type="email"
                required
                autoComplete="email"
                placeholder="correo@empresa.com"
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clave">Clave</Label>
              <Input
                id="clave"
                name="clave"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="h-10"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? "Registrando…" : "Registrarse"}
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
