# Proyecto EVA2 Desarrollo de Software Web

Crear proyecto de aplicacion web con patron MVC que cumpla con los siguientes puntos definidos (contenido -primera parte y segunda parte-, stack tecnico y rubrica)

# Contenido
# Primera parte
• Definición de las siguientes rutas que serán manejadas por la API:
1. Listar todos los proyectos.
2. Agregar Proyecto.
3. Eliminar proyecto por su Id.
4. Actualizar proyecto por su id.
5. Obtener un proyecto por su id.
• Generar los siguientes controladores que conectaran cada una de las rutas definidas con los
modelos definidos:
1. Controlador para crear un proyecto.
2. Controlador para obtener los proyectos.
3. Controlador para actualizar un proyecto por id.
4. Controlador para eliminar un proyecto por id.
5. Controlador para obtener un proyecto por id.
• Genera los siguientes modelos que serán usados por el controlador con datos estáticos con
los siguientes campos:
1. Proyecto
▪ Id.
▪ Nombre.
▪ Fecha de Inicio.
▪ Estado.
▪ Responsable.
▪ Monto.
• Construir las siguientes vistas con estilos básicos que muestren la información retornada por
el controlador:
1. Vista para crear un proyecto.
2. Vista para obtener los proyectos.
3. Vista para actualizar un proyecto por id.
4. Vista para eliminar un proyecto por id.
5. Vista para obtener un proyecto por id.


# Segunda parte de contenido
Definición de las siguientes rutas que serán manejadas por la API:
1. Registro de Usuario
2. Inicio de Sesión de Usuario
• Generar los siguientes controladores que conectaran cada una de las rutas definidas
con los modelos definidos
1. Controlador de Autenticación que se encargara de lo siguiente:
▪ Función de Registro de Usuario en el cual se implementará un cifrado
a la clave
▪ Función de Inicio de Sesión el cual devolverá un JWT si las
credenciales son correctas
• Configurar las variables de entorno para usar las siguientes configuraciones:
1. Nombre de la Base de Datos: desarrollo_software_1
2. Username: root
3. Clave: desarrollo_software_1
• Genera los siguientes modelos que serán usados por el controlador con datos
estáticos con los siguientes campos
1. Usuario
▪ Id
▪ Nombre
▪ Correo. (Identificador Único)
▪ Clave
2. Proyecto (Actualizar)
▪ Id
▪ Nombre
▪ Fecha de Inicio
▪ Estado
▪ Responsable
▪ Monto
▪ created_by (Debería ser el Id del usuario)
• Construir las siguientes vistas con estilos básicos que muestren la información
retornada por el controlador
1. Inicio de Sesión
2. Registro
• Genera un middleware que valida si el usuario esta autenticado o no por medio de
un JWT



# Stack Tecnico

Patron MVC (monolito)
Next.js + (App Router) + TypeScript
Prisma + PostgreSQL
Argon2 (paquete argon2 de npm, usa Argon2id por defecto)
JWT (jsonwebtoken o jose, mejor jose porque corre en Edge Runtime, útil si usas middleware)
Cookie httpOnly + Secure + SameSite para el JWT
Tailwind CSS para los estilos

# Rubrica

- Se evidencia correcta
implementación de los
modelos y la configuración de
la Base de Datos en las
variables de entorno.

- Se evidencia una correcta
implementación de Inicio de
Sesión o middleware para la
validación de los datos

- Se evidencia construcción de
controlador Registro de Usuario
con el cifrado de la clave.



