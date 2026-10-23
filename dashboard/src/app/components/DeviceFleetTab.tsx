"use client";

import { useState, useMemo } from "react";
import { 
  Laptop, Server, ShieldCheck, Search, Activity, Cpu, 
  Terminal, RefreshCw, CheckCircle2, AlertTriangle, Filter,
  ExternalLink, ArrowUpRight, Sparkles, HardDrive, Plus, X,
  Copy, Check, PackageCheck, Code2, ArrowRight
} from "lucide-react";
import ClientBrandIcon from "./ClientBrandIcon";

interface Device {
  id: string;
  hostname: string;
  user: string;
  department: string;
  os: string;
  daemonStatus: "ONLINE" | "DRIFT_DETECTED" | "OFFLINE";
  autoHealLatency: string;
  shieldedClients: string[];
  policyVersion: string;
  lastHeartbeat: string;
  ip: string;
  isLocal: boolean;
}

interface DeviceFleetTabProps {
  devices: Device[];
  onForceSync?: (hostname: string) => void;
  setPingStatus: (msg: string | null) => void;
  onNavigateToMdm?: () => void;
}

export default function DeviceFleetTab({ devices = [], setPingStatus, onNavigateToMdm }: DeviceFleetTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ONLINE" | "DRIFT">("ALL");
  const [inspectingDevice, setInspectingDevice] = useState<Device | null>(null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollPlatform, setEnrollPlatform] = useState<"windows" | "macos">("windows");
  const [enrollTab, setEnrollTab] = useState<"quickstart" | "mdm" | "manual">("quickstart");
  const [copiedEnroll, setCopiedEnroll] = useState(false);

  const filteredDevices = useMemo(() => {
    return devices.filter(d => {
      const matchesSearch = 
        d.hostname.toLowerCase().includes(search.toLowerCase()) ||
        d.user.toLowerCase().includes(search.toLowerCase()) ||
        d.os.toLowerCase().includes(search.toLowerCase()) ||
        d.ip.includes(search);
      
      const matchesStatus = 
        statusFilter === "ALL" ? true :
        statusFilter === "ONLINE" ? d.daemonStatus === "ONLINE" :
        d.daemonStatus === "DRIFT_DETECTED";

      return matchesSearch && matchesStatus;
    });
  }, [devices, search, statusFilter]);

  const handleForceSync = (hostname: string) => {
    setPingStatus(`⚡ Policy re-sync triggered for ${hostname} (30ms auto-heal verified)`);
    setTimeout(() => setPingStatus(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0E0D17] border border-white/[0.08] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="text-blue-400" size={22} />
            <h2 className="text-xl font-bold text-white tracking-tight">Endpoint Fleet &amp; Device Inventory</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider font-mono">
              Sevlex Watch™ Telemetry
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Real-time telemetry and tamper-resistant auto-healing across all engineering laptops running AI tools.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{devices.filter(d => d.daemonStatus === "ONLINE").length}/{devices.length} Daemons Active</span>
          </div>
          <button 
            onClick={() => setShowEnrollModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/25 cursor-pointer"
          >
            <Plus size={14} /> Enroll New Host
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#0E0D17] border border-white/[0.08] p-4 rounded-2xl shadow-xl">
          <span className="text-[11px] text-zinc-400 font-mono uppercase block mb-1">Managed Laptops</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">{devices.length}</span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-mono">Enrolled</span>
          </div>
        </div>
        <div className="bg-[#0E0D17] border border-white/[0.08] p-4 rounded-2xl shadow-xl">
          <span className="text-[11px] text-zinc-400 font-mono uppercase block mb-1">Watcher Auto-Heal</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">&lt; 30ms</span>
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 font-mono">Instant Reset</span>
          </div>
        </div>
        <div className="bg-[#0E0D17] border border-white/[0.08] p-4 rounded-2xl shadow-xl">
          <span className="text-[11px] text-zinc-400 font-mono uppercase block mb-1">Policy Sync Health</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white font-mono">98.2%</span>
            <span className="text-[10px] text-zinc-300 font-semibold bg-white/[0.06] px-2 py-0.5 rounded-md border border-white/[0.08] font-mono">v1.0.5</span>
          </div>
        </div>
        <div className="bg-[#0E0D17] border border-white/[0.08] p-4 rounded-2xl shadow-xl">
          <span className="text-[11px] text-zinc-400 font-mono uppercase block mb-1">Shielded AI Clients</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-blue-400 font-mono">15 Active</span>
            <span className="text-[10px] text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 font-mono">Cursor/Claude</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#0E0D17] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/[0.08] bg-[#141322] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Filter by hostname, engineer, OS, or IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0A0910] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 outline-none font-mono focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#0A0910] border border-white/[0.08] rounded-xl p-0.5 text-xs font-mono">
              <button 
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${statusFilter === "ALL" ? "bg-blue-600 text-white font-semibold" : "text-zinc-400 hover:text-white"}`}
              >
                All ({devices.length})
              </button>
              <button 
                onClick={() => setStatusFilter("ONLINE")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${statusFilter === "ONLINE" ? "bg-emerald-500/20 text-emerald-300 font-semibold" : "text-zinc-400 hover:text-white"}`}
              >
                Online
              </button>
              <button 
                onClick={() => setStatusFilter("DRIFT")}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${statusFilter === "DRIFT" ? "bg-amber-500/20 text-amber-300 font-semibold" : "text-zinc-400 hover:text-white"}`}
              >
                Drift Detected
              </button>
            </div>
          </div>
        </div>

        {/* Devices Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#141322] border-b border-white/[0.08] text-zinc-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-4 font-medium">Device &amp; Hostname</th>
                <th className="py-3 px-4 font-medium">Assigned Engineer</th>
                <th className="py-3 px-4 font-medium">OS Platform</th>
                <th className="py-3 px-4 font-medium">Daemon Status</th>
                <th className="py-3 px-4 font-medium">Shielded AI Clients</th>
                <th className="py-3 px-4 font-medium">Policy Version</th>
                <th className="py-3 px-4 font-medium text-right">Heartbeat</th>
                <th className="py-3 px-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-mono text-zinc-300">
              {filteredDevices.map((dev) => (
                <tr key={dev.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Laptop size={15} className={dev.isLocal ? "text-blue-400" : "text-zinc-500"} />
                      <div>
                        <span className="font-bold text-white block">{dev.hostname}</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{dev.ip}</span>
                      </div>
                      {dev.isLocal && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          THIS HOST
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-blue-400">@{dev.user}</span>
                    <span className="block text-[10px] text-zinc-500">{dev.department}</span>
                  </td>
                  <td className="py-3 px-4 text-zinc-300 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <ClientBrandIcon name={dev.os.toLowerCase().includes("mac") || dev.os.toLowerCase().includes("darwin") ? "macos" : "windows"} size="xs" />
                      <span>{dev.os}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {dev.daemonStatus === "ONLINE" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        ONLINE ({dev.autoHealLatency})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <AlertTriangle size={11} /> DRIFT DETECTED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {dev.shieldedClients.map((client, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] bg-white/[0.05] hover:bg-white/[0.08] text-zinc-200 font-sans font-medium transition-colors">
                          <ClientBrandIcon name={client} size="xs" />
                          <span>{client}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] text-zinc-200 font-semibold">{dev.policyVersion}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-zinc-400 text-[11px]">
                    {dev.lastHeartbeat}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => handleForceSync(dev.hostname)}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-blue-600 hover:text-white border border-white/[0.08] text-[11px] font-semibold transition cursor-pointer text-zinc-300"
                      title="Force immediate policy refresh and auto-heal verification"
                    >
                      Sync Policy
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboarding & Device Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0E0D17] border border-white/[0.1] rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/[0.08] flex items-start justify-between bg-[#141322]">
              <div className="flex items-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/sevlex-icon.png" alt="Sevlex" className="w-9 h-9 object-contain shrink-0 mt-0.5 rounded-xl shadow-md" />
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    Enroll Device to Sevlex Gateway
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase">
                      L7 Watch
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Connect an engineering laptop or deploy across the entire fleet in under 30 seconds.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowEnrollModal(false)}
                className="text-zinc-400 hover:text-white transition p-1 rounded-lg hover:bg-white/[0.06] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body & Tab Navigation */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Method Switcher */}
              <div className="flex rounded-xl border border-white/[0.08] bg-[#0A0910] p-1 text-xs font-mono">
                <button
                  onClick={() => setEnrollTab("quickstart")}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    enrollTab === "quickstart" ? "bg-blue-600 text-white shadow-md shadow-blue-600/25" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Terminal size={13} className="text-blue-200" />
                  <span>1-Click Terminal Quickstart</span>
                </button>
                <button
                  onClick={() => setEnrollTab("mdm")}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
                    enrollTab === "mdm" ? "bg-blue-600 text-white shadow-md shadow-blue-600/25" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center -space-x-1 shrink-0">
                    <ClientBrandIcon name="microsoft" size="xs" />
                    <ClientBrandIcon name="jamf" size="xs" />
                  </div>
                  <span>Enterprise MDM (Intune / Jamf)</span>
                </button>
                <button
                  onClick={() => setEnrollTab("manual")}
                  className={`flex-1 py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    enrollTab === "manual" ? "bg-blue-600 text-white shadow-md shadow-blue-600/25" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center -space-x-1 shrink-0">
                    <ClientBrandIcon name="cursor" size="xs" />
                    <ClientBrandIcon name="claude" size="xs" />
                  </div>
                  <span>Manual MCP JSON</span>
                </button>
              </div>

              {/* Tab 1: Terminal Quickstart */}
              {enrollTab === "quickstart" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Target Operating System
                    </span>
                    <div className="flex gap-1.5 bg-[#0A0910] border border-white/[0.08] p-1 rounded-xl text-[11px] font-mono">
                      <button
                        onClick={() => setEnrollPlatform("windows")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition cursor-pointer ${
                          enrollPlatform === "windows" 
                            ? "bg-blue-600 text-white font-bold" 
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <ClientBrandIcon name="windows" size="xs" />
                        <span>Windows (PowerShell)</span>
                      </button>
                      <button
                        onClick={() => setEnrollPlatform("macos")}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition cursor-pointer ${
                          enrollPlatform === "macos" 
                            ? "bg-blue-600 text-white font-bold" 
                            : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <ClientBrandIcon name="apple" size="xs" />
                          <ClientBrandIcon name="linux" size="xs" />
                        </div>
                        <span>macOS &amp; Linux (Bash)</span>
                      </button>
                    </div>
                  </div>

                  {/* Command Snippet */}
                  <div className="p-3.5 rounded-xl bg-[#060609] text-zinc-100 font-mono text-xs relative group border border-white/[0.08]">
                    <p className="text-[10px] text-zinc-400 mb-1.5 uppercase font-sans font-bold">Run as Administrator in terminal:</p>
                    <code className="text-emerald-400 block break-all select-all pr-16 text-[11px]">
                      {enrollPlatform === "windows"
                        ? "irm https://raw.githubusercontent.com/meetpanchal-sevlex/sevlex-mcp-gateway/main/deploy/deploy-mdm.ps1 | iex"
                        : "curl -fsSL https://raw.githubusercontent.com/meetpanchal-sevlex/sevlex-mcp-gateway/main/deploy/deploy-mdm.sh | bash"}
                    </code>
                    <button
                      onClick={() => {
                        const cmd = enrollPlatform === "windows"
                          ? "irm https://raw.githubusercontent.com/meetpanchal-sevlex/sevlex-mcp-gateway/main/deploy/deploy-mdm.ps1 | iex"
                          : "curl -fsSL https://raw.githubusercontent.com/meetpanchal-sevlex/sevlex-mcp-gateway/main/deploy/deploy-mdm.sh | bash";
                        navigator.clipboard.writeText(cmd);
                        setCopiedEnroll(true);
                        setPingStatus("📋 Copied enrollment command to clipboard!");
                        setTimeout(() => setCopiedEnroll(false), 3000);
                      }}
                      className="absolute right-3 top-3 px-2 py-1 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-white text-[11px] font-sans font-medium flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedEnroll ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      {copiedEnroll ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* 4-Step Explanation */}
                  <div className="p-4 rounded-xl border border-white/[0.08] bg-[#12111D] space-y-2.5 text-xs">
                    <p className="font-bold text-white">What happens when this command runs:</p>
                    <ul className="space-y-1.5 text-zinc-300 font-mono text-[11px]">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">1. Scan:</span>
                        <span className="flex items-center gap-1.5 flex-wrap">
                          <span>Auto-detects</span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.06] font-sans font-bold text-white text-[10px]">
                            <ClientBrandIcon name="cursor" size="xs" /> Cursor
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.06] font-sans font-bold text-white text-[10px]">
                            <ClientBrandIcon name="claude" size="xs" /> Claude Desktop
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.06] font-sans font-bold text-white text-[10px]">
                            <ClientBrandIcon name="claude" size="xs" /> Claude Code CLI
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.06] font-sans font-bold text-white text-[10px]">
                            <ClientBrandIcon name="windsurf" size="xs" /> Windsurf
                          </span>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">2. Wrap:</span>
                        <span>Injects Layer 7 proxy without breaking existing MCP server tools.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">3. Daemon:</span>
                        <span>Starts 30ms auto-heal background service with tamper resistance.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">4. Live:</span>
                        <span>Reports device specs &amp; heartbeats to this dashboard immediately.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: MDM Rollout */}
              {enrollTab === "mdm" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-950/20 text-xs text-blue-200 leading-relaxed">
                    <strong className="font-bold block text-white mb-1">Zero-Touch IT Fleet Deployment</strong>
                    Push Sevlex silently across 50-500 employee laptops using your existing corporate MDM portal. No employee intervention or terminal access required.
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl border border-white/[0.08] bg-[#12111D] hover:border-blue-500/40 transition shadow-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ClientBrandIcon name="microsoft" size="lg" className="rounded-md shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white">Microsoft Intune</p>
                          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">sevlex.intunewin</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-mono">Win32</span>
                    </div>

                    <div className="p-4 rounded-xl border border-white/[0.08] bg-[#12111D] hover:border-blue-500/40 transition shadow-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ClientBrandIcon name="jamf" size="lg" className="rounded-md shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white">Jamf Pro</p>
                          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">sevlex.pkg</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-mono">macOS PKG</span>
                    </div>
                  </div>

                  {onNavigateToMdm && (
                    <button
                      onClick={() => {
                        setShowEnrollModal(false);
                        onNavigateToMdm();
                      }}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 cursor-pointer"
                    >
                      Open Rollout Packages Tab <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              )}

              {/* Tab 3: Manual MCP JSON */}
              {enrollTab === "manual" && (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-400">
                    If testing directly in Cursor or Claude Desktop without a background daemon, add this to your local config:
                  </p>
                  <pre className="p-3.5 rounded-xl bg-[#060609] text-blue-300 font-mono text-[11px] overflow-x-auto border border-white/[0.08]">
{`"mcpServers": {
  "sevlex-firewall": {
    "command": "npx",
    "args": ["-y", "sevlex", "demo"],
    "env": {
      "SEVLEX_GATEWAY_URL": "https://app.sevlex.com"
    }
  }
}`}
                  </pre>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#141322] border-t border-white/[0.08] flex items-center justify-between text-xs">
              <span className="text-zinc-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Listening for device heartbeats</span>
              </span>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="px-4 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.08] text-white text-xs font-bold transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
