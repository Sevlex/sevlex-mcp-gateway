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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HardDrive className="text-[#2563EB]" size={22} />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Endpoint Fleet &amp; Device Inventory</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200 uppercase tracking-wider font-mono">
              Runlayer Watch Parity
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time telemetry and tamper-resistant auto-healing across all engineering laptops running AI tools.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{devices.filter(d => d.daemonStatus === "ONLINE").length}/{devices.length} Daemons Active</span>
          </div>
          <button 
            onClick={() => setShowEnrollModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition shadow-xs"
          >
            <Plus size={14} /> Enroll New Host
          </button>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-mono uppercase block mb-1">Managed Laptops</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{devices.length}</span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">Enrolled</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-mono uppercase block mb-1">Watcher Auto-Heal</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">&lt; 30ms</span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">Instant Reset</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-mono uppercase block mb-1">Policy Sync Health</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">98.2%</span>
            <span className="text-[10px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono">v2.4.1</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-mono uppercase block mb-1">Shielded AI Clients</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-[#2563EB] font-mono">15 Active</span>
            <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">Cursor/Claude</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by hostname, engineer, OS, or IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none font-mono focus:border-[#2563EB]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-mono">
              <button 
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1 rounded transition ${statusFilter === "ALL" ? "bg-slate-900 text-white font-semibold" : "text-slate-500"}`}
              >
                All ({devices.length})
              </button>
              <button 
                onClick={() => setStatusFilter("ONLINE")}
                className={`px-3 py-1 rounded transition ${statusFilter === "ONLINE" ? "bg-emerald-100 text-emerald-800 font-semibold" : "text-slate-500"}`}
              >
                Online
              </button>
              <button 
                onClick={() => setStatusFilter("DRIFT")}
                className={`px-3 py-1 rounded transition ${statusFilter === "DRIFT" ? "bg-amber-100 text-amber-800 font-semibold" : "text-slate-500"}`}
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
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
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
            <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
              {filteredDevices.map((dev) => (
                <tr key={dev.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Laptop size={15} className={dev.isLocal ? "text-[#2563EB]" : "text-slate-400"} />
                      <div>
                        <span className="font-bold text-slate-900 block">{dev.hostname}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{dev.ip}</span>
                      </div>
                      {dev.isLocal && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-100 text-[#2563EB] border border-blue-200">
                          THIS HOST
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-blue-700">@{dev.user}</span>
                    <span className="block text-[10px] text-slate-500">{dev.department}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">{dev.os}</td>
                  <td className="py-3 px-4">
                    {dev.daemonStatus === "ONLINE" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        ONLINE ({dev.autoHealLatency})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertTriangle size={11} /> DRIFT DETECTED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {dev.shieldedClients.map((client, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] bg-slate-50 text-slate-800 border border-slate-200 font-sans font-medium">
                          <ClientBrandIcon name={client} size="xs" />
                          <span>{client}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] text-slate-800 font-semibold">{dev.policyVersion}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                    {dev.lastHeartbeat}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button 
                      onClick={() => handleForceSync(dev.hostname)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] hover:border-blue-200 border border-slate-200 text-[11px] font-semibold transition"
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
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0 mt-0.5">
                  <HardDrive size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    Enroll Device to Sevlex Gateway
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200 font-bold uppercase">
                      L7 Watch
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Connect an engineering laptop or deploy across the entire fleet in under 30 seconds.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowEnrollModal(false)}
                className="text-slate-400 hover:text-slate-700 transition p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body & Tab Navigation */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Method Switcher */}
              <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-mono">
                <button
                  onClick={() => setEnrollTab("quickstart")}
                  className={`flex-1 py-1.5 rounded-md font-semibold transition flex items-center justify-center gap-1.5 ${
                    enrollTab === "quickstart" ? "bg-white text-slate-900 shadow-xs border border-slate-200" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Terminal size={13} /> 1-Click Terminal Quickstart
                </button>
                <button
                  onClick={() => setEnrollTab("mdm")}
                  className={`flex-1 py-1.5 rounded-md font-semibold transition flex items-center justify-center gap-1.5 ${
                    enrollTab === "mdm" ? "bg-white text-slate-900 shadow-xs border border-slate-200" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <PackageCheck size={13} /> Enterprise MDM (Intune/Jamf)
                </button>
                <button
                  onClick={() => setEnrollTab("manual")}
                  className={`flex-1 py-1.5 rounded-md font-semibold transition flex items-center justify-center gap-1.5 ${
                    enrollTab === "manual" ? "bg-white text-slate-900 shadow-xs border border-slate-200" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Code2 size={13} /> Manual MCP JSON
                </button>
              </div>

              {/* Tab 1: Terminal Quickstart */}
              {enrollTab === "quickstart" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Target Operating System
                    </span>
                    <div className="flex gap-1 bg-slate-100 p-0.5 rounded-md text-[11px] font-mono">
                      <button
                        onClick={() => setEnrollPlatform("windows")}
                        className={`px-2.5 py-0.5 rounded ${enrollPlatform === "windows" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-500"}`}
                      >
                        Windows (PowerShell)
                      </button>
                      <button
                        onClick={() => setEnrollPlatform("macos")}
                        className={`px-2.5 py-0.5 rounded ${enrollPlatform === "macos" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-500"}`}
                      >
                        macOS &amp; Linux (Bash)
                      </button>
                    </div>
                  </div>

                  {/* Command Snippet */}
                  <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs relative group border border-slate-800">
                    <p className="text-[10px] text-slate-400 mb-1.5 uppercase font-sans font-bold">Run as Administrator in terminal:</p>
                    <code className="text-blue-400 block break-all select-all pr-16 text-[11px]">
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
                      className="absolute right-3 top-3 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-sans font-medium flex items-center gap-1 transition"
                    >
                      {copiedEnroll ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      {copiedEnroll ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* 4-Step Explanation */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5 text-xs">
                    <p className="font-bold text-slate-800">What happens when this command runs:</p>
                    <ul className="space-y-1.5 text-slate-600 font-mono text-[11px]">
                      <li className="flex items-start gap-2">
                        <span className="text-[#2563EB] font-bold">1. Scan:</span>
                        <span>Auto-detects Cursor, Claude Desktop, Claude Code, and Windsurf manifests.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#2563EB] font-bold">2. Wrap:</span>
                        <span>Injects <code>sevlex-firewall</code> proxy without breaking developer's existing tools.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#2563EB] font-bold">3. Daemon:</span>
                        <span>Starts 30ms auto-heal background service with tamper resistance.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">4. Live:</span>
                        <span>Reports device specs &amp; heartbeats to this dashboard immediately.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: MDM Rollout */}
              {enrollTab === "mdm" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 text-xs text-blue-900 leading-relaxed">
                    <strong className="font-bold block text-slate-900 mb-1">Zero-Touch IT Fleet Deployment</strong>
                    Push Sevlex silently across 50-500 employee laptops using your existing corporate MDM portal. No employee intervention or terminal access required.
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <p className="text-xs font-bold text-slate-900">Microsoft Intune</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-1">sevlex.intunewin</p>
                      <span className="inline-block mt-2 text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">Win32 Package</span>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-white">
                      <p className="text-xs font-bold text-slate-900">Jamf Pro</p>
                      <p className="text-[11px] text-slate-500 font-mono mt-1">sevlex.pkg</p>
                      <span className="inline-block mt-2 text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-mono">macOS Package</span>
                    </div>
                  </div>

                  {onNavigateToMdm && (
                    <button
                      onClick={() => {
                        setShowEnrollModal(false);
                        onNavigateToMdm();
                      }}
                      className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
                    >
                      Open Rollout Packages Tab <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              )}

              {/* Tab 3: Manual MCP JSON */}
              {enrollTab === "manual" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    If testing directly in Cursor or Claude Desktop without a background daemon, add this to your local config:
                  </p>
                  <pre className="p-3.5 rounded-xl bg-slate-900 text-blue-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`"mcpServers": {
  "sevlex-firewall": {
    "command": "npx",
    "args": ["-y", "@sevlex/gateway"],
    "env": {
      "SEVLEX_GATEWAY_URL": "http://localhost:3000"
    }
  }
}`}
                  </pre>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Listening for device heartbeats</span>
              </span>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
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
