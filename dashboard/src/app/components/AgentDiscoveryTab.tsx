"use client";

import { useState } from "react";
import { 
  Bot, ShieldCheck, ShieldAlert, Sparkles, Terminal, 
  Code2, Laptop, Database, ArrowRight, ExternalLink, Sliders, Check
} from "lucide-react";
import ClientBrandIcon from "./ClientBrandIcon";

interface Runtime {
  name: string;
  type: string;
  installed: boolean;
  configured: boolean;
  configPath: string;
  status: string;
  lastActivity: string;
  version: string;
  boundServers: string[];
  riskTier: string;
  callsTotal: number;
}

interface AgentDiscoveryTabProps {
  runtimes: Runtime[];
  onNavigateToPolicy: () => void;
  setPingStatus: (msg: string | null) => void;
}

export default function AgentDiscoveryTab({ runtimes = [], onNavigateToPolicy, setPingStatus }: AgentDiscoveryTabProps) {
  const [selectedAgent, setSelectedAgent] = useState<Runtime | null>(runtimes[0] || null);

  const totalCalls = runtimes.reduce((acc, r) => acc + (r.callsTotal || 0), 0);
  const activeCount = runtimes.filter(r => r.status === "SHIELDED").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0E0D17] border border-white/[0.08] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot className="text-blue-400" size={22} />
            <h2 className="text-xl font-bold text-white tracking-tight">Shadow AI &amp; Agent Discovery (AgentGuard)</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider font-mono">
              Official Client Manifests
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Real-time inventory of all AI developer IDEs, autonomous agents, and terminal CLIs bound to enterprise data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{activeCount} AI Agents Governed</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0E0D17] border border-white/[0.08] p-4 rounded-2xl shadow-xl">
          <span className="text-[11px] text-zinc-400 font-mono uppercase block mb-1">Discovered AI Runtimes</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">{runtimes.length}</span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">100% Detected</span>
          </div>
        </div>
        <div className="bg-[#0E0D17] border border-white/[0.08] p-4 rounded-2xl shadow-xl">
          <span className="text-[11px] text-zinc-400 font-mono uppercase block mb-1">Tool Executions</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-blue-400 font-mono">{totalCalls.toLocaleString("en-US")}</span>
            <span className="text-[10px] text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-mono">L7 DPI</span>
          </div>
        </div>
        <div className="bg-[#0E0D17] border border-white/[0.08] p-4 rounded-2xl shadow-xl">
          <span className="text-[11px] text-zinc-400 font-mono uppercase block mb-1">Unsanctioned Shadow AI</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">0</span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">No Leakage</span>
          </div>
        </div>
        <div className="bg-[#0E0D17] border border-white/[0.08] p-4 rounded-2xl shadow-xl">
          <span className="text-[11px] text-zinc-400 font-mono uppercase block mb-1">Firewall Interception</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">Active</span>
            <span className="text-[10px] text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-mono">Fail-Closed</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Agent Selector + Right Agent Topology Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 cols): AI Agents List with Official Logos */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
            Detected AI Agent Runtimes
          </div>
          {runtimes.map((agent) => {
            const isSelected = selectedAgent?.name === agent.name;
            const isShielded = agent.status === "SHIELDED";
            return (
              <div
                key={agent.name}
                onClick={() => setSelectedAgent(agent)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#141322] border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500 text-white"
                    : "bg-[#0E0D17] border-white/[0.08] hover:border-white/[0.15] text-zinc-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <ClientBrandIcon name={agent.name} size="lg" className="rounded-md shrink-0" />
                    <div>
                      <h3 className={`text-sm font-bold flex items-center gap-1.5 ${isSelected ? "text-white" : "text-zinc-200"}`}>
                        {agent.name}
                        <span className="text-[10px] text-zinc-500 font-mono font-normal">({agent.version})</span>
                      </h3>
                      <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">{agent.type}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    isShielded ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-white/[0.06] text-zinc-400 border border-white/[0.08]"
                  }`}>
                    {agent.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>{agent.boundServers.length} MCP Servers Bound</span>
                  <span className="text-zinc-200 font-semibold">{agent.callsTotal.toLocaleString("en-US")} Calls</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (7 cols): Selected Agent Topology & Bound Tools Matrix */}
        <div className="lg:col-span-7 bg-[#0E0D17] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-6">
          {selectedAgent ? (
            <>
              {/* Agent Overview Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <ClientBrandIcon name={selectedAgent.name} size="xl" className="rounded-xl shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{selectedAgent.name}</span>
                      <span className="text-xs text-zinc-400 font-mono">[{selectedAgent.type}]</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5 truncate max-w-md">
                      Manifest: {selectedAgent.configPath}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                  selectedAgent.riskTier.includes("CRITICAL") 
                    ? "bg-red-500/10 text-red-400 border border-red-500/20" 
                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  Risk: {selectedAgent.riskTier}
                </span>
              </div>

              {/* Data Flow Diagram (Client ➔ Sevlex Gateway ➔ Enterprise Tools) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Layer 7 Architecture Topology
                </span>
                <div className="p-4 rounded-xl bg-[#12111D] border border-white/[0.08] space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141322] border border-white/[0.08]">
                    <span className="text-zinc-300 font-semibold flex items-center gap-2">
                      <ClientBrandIcon name={selectedAgent.name} size="xs" /> 1. AI Client Agent
                    </span>
                    <span className="text-white font-bold">{selectedAgent.name} ({selectedAgent.version})</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-300">
                    <span className="font-bold flex items-center gap-1.5">
                      <ShieldCheck size={14} /> 2. Sevlex L7 Inspection
                    </span>
                    <span className="font-semibold text-emerald-400">30ms Auto-Heal &bull; Fail-Closed</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#141322] border border-white/[0.08]">
                    <span className="text-zinc-300 font-semibold">3. Bound MCP Servers</span>
                    <span className="text-emerald-400 font-bold">{selectedAgent.boundServers.length} Configured</span>
                  </div>
                </div>
              </div>

              {/* Bound MCP Servers Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Connected Corporate MCP Servers
                  </span>
                  <button 
                    onClick={onNavigateToPolicy}
                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    Configure Policy Rules <ArrowRight size={12} />
                  </button>
                </div>

                {selectedAgent.boundServers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedAgent.boundServers.map((server, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-white/[0.08] bg-[#12111D] hover:border-blue-500/40 transition shadow-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ClientBrandIcon name={server} size="md" className="rounded-md shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-white">{server}</p>
                            <span className="text-[10px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                              ● Shielded Proxy
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">L7 DPI</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-white/[0.08] bg-[#12111D] text-center text-xs text-zinc-500 font-mono">
                    No corporate MCP servers configured on this client.
                  </div>
                )}
              </div>

              {/* Security Recommendations */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Shadow AI Policy: Real-time Config Watcher</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Check size={13} /> Tamper Resistance Active
                </span>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">
              Select an AI Agent runtime to inspect topology.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
