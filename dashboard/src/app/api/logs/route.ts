import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';

// Force Next.js to not cache this route so the logs are always live
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (request.headers.get('Authorization') !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Locate the SQLite database created by our Gateway (Phase 1)
    // The dashboard is just a viewer; it reads from the gateway's folder.
    const dbPath = path.resolve(process.cwd(), '../gateway/audit_log.db');
    
    // 2. Open it in read-only mode for safety
    const db = new Database(dbPath, { readonly: true });
    
    // 3. Fetch the latest 100 receipts
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100').all();
    db.close();
    
    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Failed to read logs:', error);
    // If the gateway hasn't created the DB yet, we return a friendly empty array instead of crashing
    return NextResponse.json({ logs: [] });
  }
}
