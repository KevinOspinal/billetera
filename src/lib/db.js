import { Pool } from "pg";

// Reutilizamos un único pool para evitar abrir conexiones con cada hot reload en dev.
const poolSingleton = globalThis.pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL no está definido. Configura la variable de entorno para habilitar la API.");
}

if (process.env.NODE_ENV !== "production") {
  globalThis.pgPool = poolSingleton;
}

// Ejecuta una consulta simple usando el pool.
export async function query(text, params = []) {
  const client = await poolSingleton.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

// Permite ejecutar varias queries dentro de una transacción SQL.
export async function transaction(callback) {
  const client = await poolSingleton.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
