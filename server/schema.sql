-- Esquema de la base de datos. Se ejecuta automáticamente al arrancar el
-- servidor (ver src/migrate.js), así que no tienes que correr nada a mano:
-- solo necesitas que DATABASE_URL apunte a tu base de Neon.

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  pin_hash TEXT,
  display_name TEXT NOT NULL DEFAULT 'Sr. Anderson BM',
  theme TEXT NOT NULL DEFAULT 'dark',
  fixed_limit NUMERIC NOT NULL DEFAULT 10000,
  CONSTRAINT settings_single_row CHECK (id = 1)
);

INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bank TEXT,
  last4 TEXT,
  card_limit NUMERIC NOT NULL DEFAULT 0,
  cutoff_day INTEGER,
  payment_day INTEGER,
  color TEXT,
  image_data_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS expenses_card_id_idx ON expenses (card_id);

CREATE TABLE IF NOT EXISTS fixed_expenses (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
