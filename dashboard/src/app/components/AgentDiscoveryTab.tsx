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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot className="text-[#2563EB]" size={22} />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Shadow AI &amp; Agent Discovery (AgentGuard)</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200 uppercase tracking-wider font-mono">
              Official Client Manifests
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time inventory of all AI developer IDEs, autonomous agents, and terminal CLIs bound to enterprise data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{activeCount} AI Agents Governed</span>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-mono uppercase block mb-1">Discovered AI Runtimes</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{runtimes.length}</span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">100% Detected</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-mono uppercase block mb-1">Tool Executions</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#2563EB] font-mono">{totalCalls.toLocaleString("en-US")}</span>
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">L7 DPI</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-mono uppercase block mb-1">Unsanctioned Shadow AI</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">0</span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">No Leakage</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-mono uppercase block mb-1">Firewall Interception</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">Active</span>
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">Fail-Closed</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Agent Selector + Right Agent Topology Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (5 cols): AI Agents List with Official Logos */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Detected AI Agent Runtimes
          </div>
          {runtimes.map((agent) => {
            const isSelected = selectedAgent?.name === agent.name;
            const isShielded = agent.status === "SHIELDED";
            return (
              <div
                key={agent.name}
                onClick={() => setSelectedAgent(agent)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white border-[#2563EB] shadow-md ring-1 ring-[#2563EB]"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center p-2 shrink-0 ${
                      isSelected ? "bg-blue-50/70 border-blue-200" : "bg-slate-50 border-slate-200"
                    }`}>
                      <ClientBrandIcon name={agent.name} size="md" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        {agent.name}
                        <span className="text-[10px] text-slate-400 font-mono font-normal">({agent.version})</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{agent.type}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    isShielded ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}>
                    {agent.status}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>{agent.boundServers.length} MCP Servers Bound</span>
                  <span className="text-slate-700 font-semibold">{agent.callsTotal.toLocaleString("en-US")} Calls</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (7 cols): Selected Agent Topology & Bound Tools Matrix */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          {selectedAgent ? (
            <>
              {/* Agent Overview Bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-2 shrink-0">
                    <ClientBrandIcon name={selectedAgent.name} size="lg" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900">{selectedAgent.name}</span>
                      <span className="text-xs text-slate-500 font-mono">[{selectedAgent.type}]</span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-md">
                      Manifest: {selectedAgent.configPath}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold font-mono ${
                  selectedAgent.riskTier.includes("CRITICAL") 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  Risk: {selectedAgent.riskTier}
                </span>
              </div>

              {/* Data Flow Diagram (Client ➔ Sevlex Gateway ➔ Enterprise Tools) */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Layer 7 Architecture Topology
                </span>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded bg-white border border-slate-200">
                    <span className="text-slate-600 font-semibold flex items-center gap-2">
                      <ClientBrandIcon name={selectedAgent.name} size="xs" /> 1. AI Client Agent
                    </span>
                    <span className="text-slate-900 font-bold">{selectedAgent.name} ({selectedAgent.version})</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-blue-50 border border-blue-200 text-[#2563EB]">
                    <span className="font-bold flex items-center gap-1.5">
                      <ShieldCheck size={14} /> 2. Sevlex L7 Inspection
                    </span>
                    <span className="font-semibold">30ms Auto-Heal &bull; Fail-Closed</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded bg-white border border-slate-200">
                    <span className="text-slate-600 font-semibold">3. Bound MCP Servers</span>
                    <span className="text-emerald-700 font-bold">{selectedAgent.boundServers.length} Configured</span>
                  </div>
                </div>
              </div>

              {/* Bound MCP Servers Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Connected Corporate MCP Servers
                  </span>
                  <button 
                    onClick={onNavigateToPolicy}
                    className="text-xs text-[#2563EB] hover:underline font-bold flex items-center gap-1"
                  >
                    Configure Policy Rules <ArrowRight size={12} />
                  </button>
                </div>

                {selectedAgent.boundServers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedAgent.boundServers.map((server, idx) => (
                      <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-200 transition shadow-xs flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
                            <ClientBrandIcon name={server} size="sm" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{server}</p>
                            <span className="text-[10px] text-emerald-600 font-mono font-medium flex items-center gap-1">
                              ● Shielded Proxy
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">L7 DPI</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-lg border border-slate-200 bg-slate-50 text-center text-xs text-slate-500 font-mono">
                    No corporate MCP servers configured on this client.
                  </div>
                )}
              </div>

              {/* Security Recommendations */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>Shadow AI Policy: Real-time Config Watcher</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <Check size={13} /> Tamper Resistance Active
                </span>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 font-mono text-xs">
              Select an AI Agent runtime to inspect topology.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
