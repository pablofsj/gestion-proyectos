<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Contexto del proyecto

Aplicación web con patrón **MVC (monolito)** para gestión de proyectos con autenticación JWT. Trabajo escolar (EVA2).

## Stack

- Next.js 16 (App Router) + TypeScript
- Prisma 7 + PostgreSQL (driver adapter `@prisma/adapter-pg`)
- Argon2 (`argon2id`) para el hash de claves
- `jose` para firmar/verificar JWT (Edge/Node)
- shadcn/ui (componentes) + Tailwind CSS v4 + `lucide-react` (iconos)
- Cookie `httpOnly` + `Secure` + `SameSite` para el JWT

## Arquitectura (mapeo MVC)

| Capa | Ubicación |
|---|---|
| Modelo | `prisma/schema.prisma` (`Usuario`, `Proyecto`) |
| Controlador | `src/app/api/**/route.ts` |
| Vista | `src/app/**/page.tsx` |
| Componentes UI | `src/components/ui/` (shadcn) y `src/components/` (navbar, footer, logo, estado-badge, brand-icons) |
| Middleware JWT | `src/proxy.ts` |
| Prisma client | `src/lib/prisma.ts` (singleton + adapter) |
| Auth helpers | `src/lib/auth.ts` |
| Validación entrada | `src/lib/proyecto.ts` |

## Convenciones de Next.js 16 / Prisma 7 (¡rompen con versiones anteriores!)

- `params` de un route handler es una **Promise**: `const { id } = await params`.
- `cookies()` de `next/headers` es **async**: `(await cookies()).get("token")`.
- `middleware.ts` está **deprecado** → se usa `src/proxy.ts` (export `proxy` + `config.matcher`). Doc: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
- Prisma 7 usa el generator `prisma-client` (salida en `generated/prisma/`) y **requiere driver adapter**: `new PrismaClient({ adapter: new PrismaPg({ connectionString }) })`.
- El cliente generado se importa desde `../../generated/prisma/client`, **no** desde `@prisma/client`. Regenerar con `npx prisma generate` (corre en `postinstall`).

## Base de datos

- PostgreSQL **embebido** (`embedded-postgres`, `scripts/db.mjs`): sin Docker ni instalación local. Corre en el puerto `5433`.
- `.env` se crea **automáticamente** en `postinstall`/`dev`/`build` vía `scripts/setup-env.js` (con `JWT_SECRET` aleatorio de 32 bytes). No requiere configuración manual.
- `npm run db:start` lo levanta en `localhost:5433` (db `desarrollo_software_1`, user `root`, pass `desarrollo_software_1`).
- Migraciones: `npm run db:migrate -- --name <nombre>`.

## Comandos

```bash
npm install
npm run db:start        # levanta PostgreSQL embebido
npm run db:migrate -- --name init
npm run dev             # http://localhost:3000
npm run build
npm run start
```

## Seguridad / validación

- `src/lib/proyecto.ts` centraliza la validación de entrada de proyectos (POST y PUT).
- `getSessionUserId()` (`src/lib/auth.ts`) re-decoda el JWT de la cookie; los controladores de proyectos la usan para `created_by` y para responder 401.
- El proxy valida el JWT y protege `/proyectos` y `/api/proyectos` (redirige a `/login` o devuelve 401). La cookie se firma con `JWT_SECRET` (HS256, `jose`).

- PUT y DELETE de `/api/proyectos/[id]` verifican que `proyecto.created_by === userId`; si no coinciden devuelven 403 (un usuario no puede editar/borrar proyectos de otro).
