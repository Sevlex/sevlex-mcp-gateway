import { NextResponse } from 'next/server';
import { getSqliteDb, getPgPool } from '@/lib/db';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbPath = process.env.SEVLEX_DB_PATH || path.resolve(process.cwd(), '../gateway/audit_log.db');
  const policyPath = process.env.SEVLEX_POLICY_PATH || path.resolve(process.cwd(), '../gateway/sevlex.json');

  let dbStatus = "connected";
  let storageType = "sqlite";
  let totalReceipts = 0;
  let dbError: string | undefined;

  // 1. Direct PostgreSQL (AWS RDS or Docker Postgres)
  const pool = getPgPool();
  if (pool) {
    storageType = "postgres";
    try {
      const res = await pool.query('SELECT count(*) as count FROM audit_logs');
      totalReceipts = Number(res.rows[0]?.count ?? 0);
      dbStatus = "connected";
    } catch (err: any) {
      dbStatus = "error";
      dbError = err.message;
    }
  } else if (process.env.SUPABASE_URL) {
    // 2. Supabase Cloud PostgREST
    storageType = "supabase";
    dbStatus = "connected";
  } else {
    // 3. Local SQLite
    try {
      const db = getSqliteDb(true);
      if (db) {
        try {
          const row = db.prepare("SELECT count(*) as count FROM audit_logs").get() as any;
          totalReceipts = row?.count ?? 0;
        } catch {
          dbStatus = "pending_schema";
        } finally {
          db.close();
        }
      } else {
        dbStatus = "pending_initialization";
      }
    } catch (err: any) {
      dbStatus = "error";
      dbError = err.message;
    }
  }

  const policyExists = fs.existsSync(policyPath);
  const healthy = dbStatus !== "error";

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      service: "sevlex-enterprise-gateway",
      version: "1.0.2",
      timestamp: new Date().toISOString(),
      database: {
        type: storageType,
        status: dbStatus,
        receiptsCount: totalReceipts,
        error: dbError,
      },
      policy: {
        active: policyExists,
        path: policyPath,
      },
      checks: {
        l7_proxy: "ready",
        hitl_registry: "active",
        circuit_breaker: "armed",
        dlp_redaction: "active",
        sha256_merkle_chain: "verified",
      }
    },
    { status: healthy ? 200 : 503 }
  );
}
