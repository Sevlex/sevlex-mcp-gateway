"use client";

import { useState, useEffect } from "react";
import { Shield, ShieldAlert, CheckCircle2, XCircle, Clock, Key, Lock, RefreshCw, UserCheck, AlertTriangle } from "lucide-react";

export interface HitlTicketRecord {
  ticket_id: string;
  created_at: string;
  user_id: string;
  tool_name: string;
  raw_request: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approved_by?: string;
  approved_at?: string;
  signature?: string;
}

interface HitlClearanceTabProps {
  apiKey: string;
}

export default function HitlClearanceTab({ apiKey }: HitlClearanceTabProps) {
  const [tickets, setTickets] = useState<HitlTicketRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "RESOLVED">("PENDING");

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/hitl", {
        headers: { Authorization: apiKey },
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (e) {
      console.error("Failed to load HITL tickets:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 3000);
    return () => clearInterval(interval);
  }, [apiKey]);

  const handleAction = async (ticketId: string, action: "APPROVE" | "REJECT") => {
    setProcessingId(ticketId);
    try {
      const res = await fetch("/api/hitl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({
          ticketId,
          action,
          approver: "ciso.lead@enterprise.internal",
        }),
      });
      if (res.ok) {
        await fetchTickets();
      }
    } catch (e) {
      console.error(`Failed to ${action} ticket:`, e);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingTickets = tickets.filter((t) => t.status === "PENDING");
  const approvedTickets = tickets.filter((t) => t.status === "APPROVED");
  const rejectedTickets = tickets.filter((t) => t.status === "REJECTED");

  const displayedTickets = tickets.filter((t) => {
    if (filter === "PENDING") return t.status === "PENDING";
    if (filter === "RESOLVED") return t.status !== "PENDING";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Metrics Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="text-[#2563EB]" size={22} />
            Dual-Custody HITL Clearance Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time human authorization queue for high-impact MCP tools requiring SecOps signoff.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchTickets()}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition border border-slate-200"
            title="Refresh tickets"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilter("PENDING")}
              className={`px-3 py-1 rounded-md transition ${
                filter === "PENDING"
                  ? "bg-white text-slate-900 font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pending ({pendingTickets.length})
            </button>
            <button
              onClick={() => setFilter("RESOLVED")}
              className={`px-3 py-1 rounded-md transition ${
                filter === "RESOLVED"
                  ? "bg-white text-slate-900 font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Resolved ({approvedTickets.length + rejectedTickets.length})
            </button>
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 rounded-md transition ${
                filter === "ALL"
                  ? "bg-white text-slate-900 font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({tickets.length})
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 shadow-2xs">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold font-mono">
            <span>AWAITING CLEARANCE</span>
            <Clock size={16} />
          </div>
          <div className="text-3xl font-extrabold text-amber-950 font-mono mt-2">
            {pendingTickets.length}
          </div>
          <p className="text-[11px] text-amber-700/90 mt-1">
            Suspended agent executions waiting for SecOps signature.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold font-mono">
            <span>APPROVED SESSIONS</span>
            <UserCheck size={16} />
          </div>
          <div className="text-3xl font-extrabold text-emerald-950 font-mono mt-2">
            {approvedTickets.length}
          </div>
          <p className="text-[11px] text-emerald-700/90 mt-1">
            Cryptographically cleared actions executed with dual custody.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 shadow-2xs">
          <div className="flex items-center justify-between text-rose-800 text-xs font-bold font-mono">
            <span>DENIED & BLOCKED</span>
            <XCircle size={16} />
          </div>
          <div className="text-3xl font-extrabold text-rose-950 font-mono mt-2">
            {rejectedTickets.length}
          </div>
          <p className="text-[11px] text-rose-700/90 mt-1">
            High-risk requests rejected by security team.
          </p>
        </div>
      </div>

      {/* Ticket Stream / Cards */}
      <div className="space-y-4">
        {displayedTickets.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Shield className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-sm font-semibold text-slate-700">No HITL tickets in this view</p>
            <p className="text-xs text-slate-500 mt-1">
              When an AI agent requests a dual-custody tool, authorization tickets appear here.
            </p>
          </div>
        ) : (
          displayedTickets.map((t) => (
            <div
              key={t.ticket_id}
              className={`p-5 rounded-xl border transition shadow-2xs bg-white ${
                t.status === "PENDING"
                  ? "border-amber-300 ring-2 ring-amber-100"
                  : t.status === "APPROVED"
                  ? "border-emerald-200"
                  : "border-slate-200 opacity-80"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                    {t.ticket_id}
                  </span>
                  <span className="text-xs font-semibold text-[#2563EB]">
                    @{t.user_id}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <Clock size={11} /> {t.created_at}
                  </span>
                </div>

                <div>
                  {t.status === "PENDING" ? (
                    <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      <Clock size={12} /> PENDING AUTHORIZATION
                    </span>
                  ) : t.status === "APPROVED" ? (
                    <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      <CheckCircle2 size={12} /> AUTHORIZED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-100/80 px-2.5 py-0.5 rounded-full text-xs font-bold font-mono">
                      <XCircle size={12} /> REJECTED
                    </span>
                  )}
                </div>
              </div>

              {/* Tool & Payload Details */}
              <div className="mt-3.5 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    Requested Tool:
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900 bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded">
                    {t.tool_name}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                    Interception Payload:
                  </span>
                  <pre className="mt-1 p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs whitespace-pre-wrap break-all max-h-36 overflow-y-auto">
                    {(() => {
                      try {
                        return JSON.stringify(JSON.parse(t.raw_request), null, 2);
                      } catch {
                        return t.raw_request;
                      }
                    })()}
                  </pre>
                </div>

                {/* Cryptographic Signoff Details (if resolved) */}
                {t.signature && (
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-[11px] font-mono space-y-1">
                    <div className="flex items-center justify-between text-emerald-900 font-bold">
                      <span className="flex items-center gap-1">
                        <Lock size={12} /> Dual-Custody Signature Verified
                      </span>
                      <span className="text-[10px] text-emerald-700">
                        Signed by {t.approved_by} at {t.approved_at}
                      </span>
                    </div>
                    <div className="text-[10px] text-emerald-800/80 break-all">
                      SHA256: {t.signature}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons for Pending Tickets */}
              {t.status === "PENDING" && (
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    disabled={processingId === t.ticket_id}
                    onClick={() => handleAction(t.ticket_id, "REJECT")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition disabled:opacity-50"
                  >
                    <XCircle size={14} /> Deny Request
                  </button>
                  <button
                    disabled={processingId === t.ticket_id}
                    onClick={() => handleAction(t.ticket_id, "APPROVE")}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition disabled:opacity-50"
                  >
                    <CheckCircle2 size={14} /> Authorize Execution
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
