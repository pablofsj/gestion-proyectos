"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FolderKanban, LogIn, LogOut, Plus, UserPlus } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === "/login" || pathname === "/registro";

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />

        <nav className="flex items-center gap-2">
          {isAuthPage ? (
            <>
              <Button asChild variant="ghost" size="lg">
                <Link href="/login">
                  <LogIn />
                  Iniciar sesión
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/registro">
                  <UserPlus />
                  Registrarse
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="lg">
                <Link href="/proyectos">
                  <FolderKanban />
                  Proyectos
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link href="/proyectos/nuevo">
                  <Plus />
                  Nuevo proyecto
                </Link>
              </Button>
              <Button variant="outline" size="lg" onClick={logout}>
                <LogOut />
                Cerrar sesión
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
