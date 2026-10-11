"use client";

import { Zap, ShieldCheck, Send, ExternalLink } from "lucide-react";

interface SiemObservabilityTabProps {
  apiKey: string;
  ddEndpoint: string;
  setPingStatus: (msg: string | null) => void;
}

export default function SiemObservabilityTab({ apiKey, ddEndpoint, setPingStatus }: SiemObservabilityTabProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="text-purple-400" size={22} /> SIEM & Security Observability
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Universal log streaming for SOC 2, HIPAA, and ISO 27001 compliance audit trails.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Datadog US5 Connected
          </span>
        </div>
      </div>

      {/* Architecture Role Callout */}
      <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 text-xs text-purple-200 leading-relaxed flex items-start gap-3">
        <span className="text-base">💡</span>
        <div>
          <strong className="text-white block mb-0.5">Role of SIEM in Sevlex:</strong>
          Datadog is where <span className="underline font-semibold text-purple-300">audit logs live</span>. Every allowed and blocked tool call is streamed asynchronously over HTTPS to Datadog&apos;s Log Explorer for compliance audits, threat hunting, and long-term retention.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: DATADOG SIEM */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/datadog.svg" alt="Datadog" className="w-5 h-5 invert" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Datadog Cloud SIEM</h3>
                  <p className="text-xs text-zinc-400">Universal Log Streaming & Stateless DR</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                CONNECTED (US5)
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Asynchronously transmits all MCP tool calls (both allowed and blocked) to your Datadog Log Explorer. Satisfies SOC 2 &amp; HIPAA audit retention automatically.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-zinc-500 text-[11px] block mb-1">Target Endpoint</label>
                <input 
                  type="text" 
                  readOnly 
                  value={ddEndpoint} 
                  className="w-full bg-[#090909] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
            <button 
              onClick={async () => {
                setPingStatus("Sending ping to Datadog...");
                try {
                  const res = await fetch("/api/integrations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": apiKey },
                    body: JSON.stringify({ action: "test_datadog" })
                  });
                  const data = await res.json();
                  if (data.success) {
                    setPingStatus("⚡ Verified! Datadog accepted ping (202 Accepted)");
                  } else {
                    setPingStatus("❌ Ping failed: " + (data.error || "Unknown"));
                  }
                } catch {
                  setPingStatus("❌ Network error connecting to API");
                }
                setTimeout(() => setPingStatus(null), 4000);
              }}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-purple-950"
            >
              <Send size={14} /> Send Live Test Ping
            </button>

            <a 
              href="https://us5.datadoghq.com/logs" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
            >
              Open Logs Explorer <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* CARD 2: RETENTION SLA & COMPLIANCE METRICS */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Compliance & Retention SLAs</h3>
                  <p className="text-xs text-zinc-400">SOC 2 CC6.8 &amp; HIPAA Immutable Storage</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                VERIFIED
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#090909] border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Streaming Latency</span>
                <span className="text-emerald-400 font-bold">&lt; 0.2ms overhead (Async)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090909] border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Local Write Buffer</span>
                <span className="text-zinc-200">SQLite WAL (Zero write loss)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090909] border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Cold Storage SLA</span>
                <span className="text-zinc-200">365 Days Retention</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>Data Classification</span>
            <span className="text-zinc-300">Layer 7 Deep Packet Inspection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
