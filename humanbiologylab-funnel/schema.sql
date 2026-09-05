CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'direct',
  medium TEXT NOT NULL DEFAULT 'none',
  campaign TEXT NOT NULL DEFAULT 'starter-guide',
  content TEXT NOT NULL DEFAULT 'unknown',
  placement TEXT NOT NULL DEFAULT 'unknown',
  consent INTEGER NOT NULL DEFAULT 1 CHECK (consent = 1),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email
ON leads (email);

CREATE INDEX IF NOT EXISTS idx_leads_created_at
ON leads (created_at);