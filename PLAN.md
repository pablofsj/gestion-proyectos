# PLAN — Proyecto EVA2: Desarrollo de Software Web

Aplicación web con patrón MVC (monolito). CRUD de proyectos + autenticación JWT.

## Stack

- Next.js (App Router) + TypeScript
- Prisma + PostgreSQL
- Argon2 (paquete `argon2`, Argon2id por defecto) — cifrado de clave
- JWT con `jose` (Edge Runtime) — token de sesión
- Cookie `httpOnly` + `Secure` + `SameSite` — transporte del JWT
- Tailwind CSS — estilos

## Arquitectura MVC (mapeo en Next.js App Router)

| Capa MVC | Implementación |
|---|---|
| Modelo | Modelos Prisma (`prisma/schema.prisma`) |
| Controlador | Route Handlers (`app/api/**/route.ts`) |
| Vista | Pages + componentes React (`app/**/page.tsx`) |
| Middleware | `middleware.ts` (Edge) con `jose` |

## Estructura de archivos (objetivo)

```
prisma/schema.prisma
.env
middleware.ts
src/lib/
  auth.ts          # hash/verify (argon2), firmar/verificar JWT (jose), cookies
  prisma.ts        # singleton PrismaClient
src/app/
  api/
    proyectos/route.ts          # GET listar, POST crear
    proyectos/[id]/route.ts     # GET, PUT, DELETE
    auth/registro/route.ts      # POST registro (cifra clave)
    auth/login/route.ts         # POST login (devuelve JWT en cookie)
  login/page.tsx
  registro/page.tsx
  proyectos/page.tsx            # listar
  proyectos/nuevo/page.tsx      # crear
  proyectos/[id]/page.tsx       # obtener por id
  proyectos/[id]/editar/page.tsx
  proyectos/[id]/eliminar/page.tsx
```

## Fases

### Fase 0 — Setup
1. Crear proyecto Next.js + TypeScript + Tailwind.
2. Instalar dependencias: `prisma`, `@prisma/client`, `argon2`, `jose`.
3. Inicializar Prisma con provider PostgreSQL.

### Fase 1 — Variables de entorno
```
DATABASE_URL="postgresql://root:desarrollo_software_1@localhost:5433/desarrollo_software_1"
JWT_SECRET="<generado>"
```
- Nombre BD: `desarrollo_software_1`
- Username: `root`
- Clave: `desarrollo_software_1`

### Fase 2 — Modelos (Prisma schema)

**Usuario**
| Campo | Tipo | Restricción |
|---|---|---|
| id | Int | PK, autoincrement |
| nombre | String | |
| correo | String | `@unique` |
| clave | String | hash (no se expone) |

**Proyecto**
| Campo | Tipo | Restricción |
|---|---|---|
| id | Int | PK, autoincrement |
| nombre | String | |
| fechaInicio | DateTime | |
| estado | String | |
| responsable | String | |
| monto | Float | |
| created_by | Int | FK → Usuario.id |

- Relación: `Usuario 1—N Proyecto` (un proyecto tiene un `created_by`).
- Migración inicial + `prisma generate`.

### Fase 3 — Parte 1: CRUD Proyecto

**Rutas API**
| Método | Ruta | Controlador |
|---|---|---|
| GET | `/api/proyectos` | listar proyectos |
| POST | `/api/proyectos` | crear proyecto |
| GET | `/api/proyectos/[id]` | obtener por id |
| PUT | `/api/proyectos/[id]` | actualizar por id |
| DELETE | `/api/proyectos/[id]` | eliminar por id |

**Controladores** (route handlers que conectan rutas ↔ modelos):
1. `create` — inserta registro vía Prisma.
2. `getAll` — `findMany`.
3. `getById` — `findUnique`.
4. `update` — `update`.
5. `delete` — `delete`.
- Validación de entrada y manejo de errores (404 si no existe).

**Vistas** (estilos Tailwind básicos):
1. Crear proyecto → `proyectos/nuevo`
2. Listar proyectos → `proyectos`
3. Obtener por id → `proyectos/[id]`
4. Actualizar → `proyectos/[id]/editar`
5. Eliminar → `proyectos/[id]/eliminar` (confirmación)

### Fase 4 — Parte 2: Autenticación

**Rutas API**
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/registro` | registro de usuario |
| POST | `/api/auth/login` | inicio de sesión |

**Controlador de Autenticación**:
1. `registro` — valida campos, cifra clave con Argon2 (`argon2id`), crea Usuario.
2. `login` — verifica credenciales; si son correctas firma JWT (`jose`) y lo guarda en cookie `httpOnly + Secure + SameSite`.

**Middleware** (`middleware.ts`):
- Valida la cookie JWT con `jose` (Edge Runtime).
- Protege rutas de proyecto; redirige a `/login` si no autenticado.
- Excluye `/login`, `/registro` y rutas `auth`.

**Vistas**:
1. Inicio de sesión → `login`
2. Registro → `registro`

### Fase 5 — Verificación

- Levantar PostgreSQL, correr migración.
- Flujo manual: registrar → login → cookie JWT → crear/listar/editar/eliminar proyecto.
- Verificar que rutas de proyecto redirigen a login sin sesión.
- Comprobar rúbrica (ver sección siguiente).

## Mapeo a rúbrica

| Criterio | Dónde se cumple |
|---|---|
| Modelos + config BD en variables de entorno | `prisma/schema.prisma`, `.env` |
| Inicio de sesión + middleware de validación | `auth/login`, `middleware.ts` |
| Registro con cifrado de clave | `auth/registro` (Argon2id) |

## Decisiones

- "Datos estáticos" = estructura de campos fija; los datos se persisten en PostgreSQL (el stack exige Prisma + BD).
- JWT se transporta en cookie `httpOnly` (no localStorage) para mitigar XSS.
- `jose` en lugar de `jsonwebtoken` por compatibilidad con Edge Runtime del middleware.
