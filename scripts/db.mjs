import EmbeddedPostgres from "embedded-postgres";

// Script de desarrollo: levanta un PostgreSQL local embebido para correr la
// app sin instalar PostgreSQL. Credenciales según INIT.md.
// El proceso se mantiene vivo: al terminarlo (Ctrl+C), PostgreSQL se detiene.
const pg = new EmbeddedPostgres({
  databaseDir: "./data/db",
  user: "root",
  password: "desarrollo_software_1",
  port: 5432,
  authMethod: "scram-sha-256",
  persistent: true,
  onLog: () => {},
});

await pg.initialise().catch(() => {});
await pg.start();
await pg.createDatabase("desarrollo_software_1").catch(() => {});
console.log("PostgreSQL listo en localhost:5432 (root / desarrollo_software_1)");

// Mantener el proceso vivo; async-exit-hook detiene PostgreSQL al salir.
await new Promise(() => {});
