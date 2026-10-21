import path from 'path';
import fs from 'fs';

export function getDbPath(): string {
  return process.env.SEVLEX_DB_PATH || path.resolve(process.cwd(), '../gateway/audit_log.db');
}

/**
 * Returns a lightweight SQLite database handle using Node.js built-in node:sqlite,
 * with fallback to better-sqlite3 or null if running in a stateless environment.
 */
export function getSqliteDb(readonly = false): any {
  const dbPath = getDbPath();
  if (readonly && !fs.existsSync(dbPath)) {
    return null;
  }

  try {
    // 1. Built-in Node.js standard library SQLite (Node 22+)
    // Zero native build dependencies, zero C++ compilation
    const { DatabaseSync } = require('node:sqlite');
    return new DatabaseSync(dbPath, readonly ? { readOnly: true } : {});
  } catch {
    try {
      // 2. Fallback to better-sqlite3 if present in environment
      const Database = require('better-sqlite3');
      return new Database(dbPath, readonly ? { readonly: true } : {});
    } catch {
      return null;
    }
  }
}
