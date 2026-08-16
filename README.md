# Gestión de Proyectos (EVA2)

Aplicación web con patrón **MVC (monolito)** para la gestión de proyectos, con autenticación basada en JWT.

## Características

- **Autenticación**
  - Registro de usuarios con cifrado de clave usando Argon2 (`argon2id`).
  - Inicio de sesión que devuelve un JWT firmado con `jose` y lo guarda en una cookie `httpOnly + Secure + SameSite`.
  - Middleware (proxy) que valida el JWT en cada petición y protege las rutas de proyectos.
- **Gestión de proyectos** (CRUD completo)
  - Crear, listar, obtener por id, actualizar y eliminar.
  - Cada proyecto registra al usuario que lo creó (`created_by` → `Usuario`).
- **Vistas** con Tailwind CSS: login, registro, listado, detalle, formularios de crear/editar y confirmación de borrado.
- **Persistencia** en PostgreSQL vía Prisma.

## Stack

- Next.js 16 (App Router) + TypeScript
- Prisma 7 + PostgreSQL
- Argon2 (`argon2id`)
- `jose` (JWT)
- Tailwind CSS v4

## Requisitos

- Node.js 20+
- PostgreSQL **o** nada (se incluye uno embebido, ver abajo)

## Ejecución (desarrollo)

```bash
npm install

# 1. Base de datos
#    Opción A — PostgreSQL embebido (sin instalar nada):
npm run db:start
#    Opción B — tu propio PostgreSQL: crea la BD "desarrollo_software_1" y configura .env

# 2. Migraciones (crea las tablas Usuario y Proyecto)
npm run db:migrate -- --name init

# 3. Servidor de desarrollo
npm run dev    # http://localhost:3000
```

### Producción

```bash
npm run build
npm run start  # http://localhost:3000
```

## Variables de entorno (`.env`)

Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.example .env
```

Contenido:
```ini
DATABASE_URL="postgresql://root:desarrollo_software_1@localhost:5432/desarrollo_software_1"
JWT_SECRET="<secreto-de-32-bytes>"
```

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL (db `desarrollo_software_1`, user `root`, pass `desarrollo_software_1`). |
| `JWT_SECRET` | Clave para firmar/verificar los JWT. |

## Arquitectura MVC

| Capa | Ubicación |
|---|---|
| Modelo | `prisma/schema.prisma` |
| Controlador | `src/app/api/**/route.ts` |
| Vista | `src/app/**/page.tsx` |
| Middleware (JWT) | `src/proxy.ts` (Next 16 renombró `middleware.ts` → `proxy.ts`) |

## Rutas

### API

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/registro` | Registro de usuario (cifra la clave con Argon2id) |
| POST | `/api/auth/login` | Inicio de sesión (JWT en cookie httpOnly) |
| POST | `/api/auth/logout` | Cierra sesión |
| GET / POST | `/api/proyectos` | Listar / crear proyecto |
| GET / PUT / DELETE | `/api/proyectos/[id]` | Obtener / actualizar / eliminar por id |

### Vistas

| Ruta | Descripción |
|---|---|
| `/login` | Inicio de sesión |
| `/registro` | Registro de usuario |
| `/proyectos` | Listar proyectos |
| `/proyectos/nuevo` | Crear proyecto |
| `/proyectos/[id]` | Detalle de un proyecto |
| `/proyectos/[id]/editar` | Actualizar proyecto |
| `/proyectos/[id]/eliminar` | Eliminar proyecto (confirmación) |

## Capturas de pantalla

Aplicación en ejecución (`http://localhost:3000`), probando la autenticación JWT y el CRUD de proyectos desde el frontend.

### Autenticación

**Registro** — `POST /api/auth/registro`: crea un usuario cifrando la clave con Argon2id.

![Registro](docs/screenshots/registro.png)

**Inicio de sesión** — `POST /api/auth/login`: valida credenciales y guarda el JWT en una cookie `httpOnly`.

![Inicio de sesión](docs/screenshots/login.png)

### Gestión de proyectos (rutas protegidas por el JWT)

**Crear** — `POST /api/proyectos`: formulario de alta de un proyecto.

![Crear proyecto](docs/screenshots/proyecto-nuevo.png)

**Listar** — `GET /api/proyectos`: tabla con todos los proyectos.

![Lista de proyectos](docs/screenshots/proyectos-lista.png)

**Detalle** — `GET /api/proyectos/[id]`: información de un proyecto por su id.

![Detalle de proyecto](docs/screenshots/proyecto-detalle.png)

**Editar** — `PUT /api/proyectos/[id]`: formulario precargado para actualizar.

![Editar proyecto](docs/screenshots/proyecto-editar.png)

**Eliminar** — `DELETE /api/proyectos/[id]`: confirmación antes de borrar.

![Eliminar proyecto](docs/screenshots/proyecto-eliminar.png)
