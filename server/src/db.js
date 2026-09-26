import 'dotenv/config';
import pg from 'pg';

const { Pool, types } = pg;

// Postgres por defecto convierte las columnas DATE a objetos Date de JS
// interpretados en la zona horaria del servidor, lo que puede correr la
// fecha un día según dónde esté desplegado. Como nuestras fechas de gasto
// no llevan hora, las dejamos como texto "YYYY-MM-DD" tal cual vienen.
types.setTypeParser(1082, (val) => val);

if (!process.env.DATABASE_URL) {
  console.warn(
    '⚠️  No se definió DATABASE_URL. Configúrala con la cadena de conexión de tu base de Neon (Settings > Connection string en neon.tech).',
  );
}

// Neon requiere SSL. node-postgres necesita este flag para no rechazar
// el certificado en algunos entornos de contenedor.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export function query(text, params) {
  return pool.query(text, params);
}
