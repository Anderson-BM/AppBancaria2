import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { pool } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function runMigrations() {
  const schemaPath = path.join(__dirname, '..', 'schema.sql');
  const sql = readFileSync(schemaPath, 'utf8');
  await pool.query(sql);
  console.log('✔ Base de datos lista (esquema aplicado).');
}
