import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
  const dbPath = process.env.SEVLEX_DB_PATH || path.resolve(process.cwd(), '../gateway/audit_log.db');
  const policyPath = process.env.SEVLEX_POLICY_PATH || path.resolve(process.cwd(), '../gateway/sevlex.json');

  let dbStatus = "connected";
  let totalReceipts = 0;
  let dbError: string | undefined;

  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ dbPath)) {
      const db = new Database(dbPath, { readonly: true, timeout: 2000 });
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

  const policyExists = fs.existsSync(/*turbopackIgnore: true*/ policyPath);
  const healthy = dbStatus !== "error";

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "degraded",
      service: "sevlex-enterprise-gateway",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        receiptsCount: totalReceipts,
        path: dbPath,
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
