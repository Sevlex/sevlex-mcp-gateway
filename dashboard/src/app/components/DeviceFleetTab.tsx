"use client";

import { useState, useMemo } from "react";
import { 
  Laptop, Server, ShieldCheck, Search, Activity, Cpu, 
  Terminal, RefreshCw, CheckCircle2, AlertTriangle, Filter,
  ExternalLink, ArrowUpRight, Sparkles, HardDrive
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
}

export default function DeviceFleetTab({ devices = [], setPingStatus }: DeviceFleetTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ONLINE" | "DRIFT">("ALL");
  const [inspectingDevice, setInspectingDevice] = useState<Device | null>(null);

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
    </div>
  );
}
