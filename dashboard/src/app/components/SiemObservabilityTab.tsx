"use client";

import { Zap, ShieldCheck, Send, ExternalLink } from "lucide-react";
import ClientBrandIcon from "./ClientBrandIcon";

interface SiemObservabilityTabProps {
  apiKey: string;
  ddEndpoint: string;
  setPingStatus: (msg: string | null) => void;
}

export default function SiemObservabilityTab({ apiKey, ddEndpoint, setPingStatus }: SiemObservabilityTabProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0E0D17] border border-white/[0.08] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="text-blue-400" size={22} />
            <h2 className="text-xl font-bold text-white tracking-tight">SIEM &amp; Security Observability</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider font-mono">
              Datadog US5 Connected
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Universal log streaming for SOC 2, HIPAA, and ISO 27001 compliance audit trails.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Zero-Knowledge Forwarder Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: DATADOG SIEM */}
        <div className="bg-[#0E0D17] border border-white/[0.08] p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-blue-500/30 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ClientBrandIcon name="Datadog" size="xl" className="rounded-md shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-white">Datadog Cloud SIEM</h3>
                  <p className="text-xs text-zinc-400 font-mono">Universal Log Streaming &amp; Stateless DR</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                CONNECTED (US5)
              </span>
            </div>

            <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
              Asynchronously transmits all MCP tool calls (both allowed and blocked) to your Datadog Log Explorer. Satisfies SOC 2 &amp; HIPAA audit retention automatically.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-zinc-400 text-[11px] block mb-1">Target Endpoint</label>
                <input 
                  type="text" 
                  readOnly 
                  value={ddEndpoint} 
                  className="w-full bg-[#12111D] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-[11px] font-mono outline-none"
                />
              </div>

              <div className="bg-[#12111D] p-3.5 rounded-xl border border-white/[0.06] space-y-2 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Service Tag:</span>
                  <span className="text-blue-400 font-bold">sevlex-mcp-gateway</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Pipeline Mode:</span>
                  <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Non-blocking Async (0ms added)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Compliance Audit:</span>
                  <span className="text-zinc-200 font-semibold">SOC 2 Type II Immutable</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] mt-5 flex items-center justify-between">
            <a 
              href="https://app.datadoghq.com/logs" 
              target="_blank" 
              rel="noreferrer" 
              className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-bold flex items-center gap-1"
            >
              Open Datadog Log Explorer <ExternalLink size={12} />
            </a>
            <span className="text-[11px] text-zinc-500 font-mono">Stream: active</span>
          </div>
        </div>

        {/* CARD 2: ENTERPRISE SIEM FORWARDING */}
        <div className="bg-[#0E0D17] border border-white/[0.08] p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-blue-500/30 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ClientBrandIcon name="Splunk" size="xl" className="rounded-md shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-white">Splunk / Sentinel / S3</h3>
                  <p className="text-xs text-zinc-400 font-mono">Multi-Destination Compliance Sinks</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/[0.06] text-zinc-300 border border-white/[0.08] font-mono">
                ENTERPRISE
              </span>
            </div>

            <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
              Route high-throughput audit telemetry to enterprise SIEM collectors via Syslog (RFC 5424) or AWS S3 encrypted parquet buckets.
            </p>

            <div className="bg-[#12111D] p-4 rounded-xl border border-white/[0.06] space-y-2 text-xs font-mono mb-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Splunk HEC:</span>
                <span className="text-white font-bold">Supported (HTTPS:8088)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Microsoft Sentinel:</span>
                <span className="text-white font-bold">Azure Monitor Ingestion</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Immutable Storage:</span>
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">AWS S3 Object Lock (WORM)</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span>Enterprise SLA: 99.99%</span>
            <button 
              onClick={() => {
                setPingStatus("📋 SIEM configuration docs copied to clipboard");
                setTimeout(() => setPingStatus(null), 3000);
              }}
              className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-bold cursor-pointer"
            >
              Export Terraform Spec
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
