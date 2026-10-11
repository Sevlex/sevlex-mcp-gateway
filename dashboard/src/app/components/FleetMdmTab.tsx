"use client";

import { Server, Send, Check, Copy } from "lucide-react";

interface FleetMdmTabProps {
  apiKey: string;
  setPingStatus: (msg: string | null) => void;
  copiedType: string | null;
  setCopiedType: (type: string | null) => void;
}

export default function FleetMdmTab({ apiKey, setPingStatus, copiedType, setCopiedType }: FleetMdmTabProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Server className="text-blue-400" size={22} /> Enterprise Fleet Deployment (MDM)
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Zero-Touch enterprise software distribution. Silently deploy Sevlex across 50+ laptops via Microsoft Intune and Jamf Pro.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            50 Managed Hosts Target
          </span>
        </div>
      </div>

      {/* Architectural Role Callout */}
      <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 text-xs text-blue-200 leading-relaxed flex items-start gap-3">
        <span className="text-base">💡</span>
        <div>
          <strong className="text-white block mb-0.5">Role of MDM in Sevlex:</strong>
          Microsoft Intune and Jamf Pro <span className="underline font-semibold text-blue-300">do not view or collect logs</span>. Their sole role is to remotely install and lock down the Sevlex gateway on company laptops over Wi-Fi so developers don&apos;t have to touch anything.
        </div>
      </div>

      {/* Deployment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: MICROSOFT INTUNE (WINDOWS) */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Server size={20} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Microsoft Intune API</h3>
                  <p className="text-xs text-zinc-400">Direct Microsoft Graph Silent Push</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                GRAPH API
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Directly instructs Microsoft Intune to push Sevlex across all 50 Windows laptops over the air without logging into the Azure portal.
            </p>

            <div className="bg-[#090909] p-3 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-400 flex items-center justify-between mb-4">
              <span>Target: All Engineering Devices (50 Hosts)</span>
              <span className="text-emerald-400 font-semibold">Ready to Push</span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
            <button 
              onClick={async () => {
                setPingStatus("Contacting Microsoft Graph API & queuing rollout...");
                try {
                  const res = await fetch("/api/integrations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": apiKey },
                    body: JSON.stringify({ action: "deploy_intune", targetGroup: "All Engineering Laptops (50 Devices)" })
                  });
                  const data = await res.json();
                  if (data.success) {
                    setPingStatus("⚡ Pushed to Microsoft Intune! Silent rollout queued for 50 Windows laptops.");
                  } else {
                    setPingStatus("❌ Intune push failed: " + (data.error || "Unknown"));
                  }
                } catch {
                  setPingStatus("❌ Network error connecting to API");
                }
                setTimeout(() => setPingStatus(null), 4000);
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-blue-950"
            >
              <Send size={14} /> ⚡ 1-Click Push to 50 Devices
            </button>

            <button 
              onClick={() => {
                navigator.clipboard.writeText("powershell -ExecutionPolicy Bypass -File deploy/deploy-mdm.ps1");
                setCopiedType("intune");
                setTimeout(() => setCopiedType(null), 2000);
              }}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 font-medium"
            >
              {copiedType === "intune" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copiedType === "intune" ? "Copied Script" : "Copy Script"}
            </button>
          </div>
        </div>

        {/* CARD 2: JAMF PRO (MACOS & LINUX) */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Server size={20} className="text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Jamf Pro Cloud API</h3>
                  <p className="text-xs text-zinc-400">Direct JSS Fleet Deployment</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                JAMF REST
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Directly instructs Jamf Pro JSS to deploy the Sevlex agent package to all employee MacBooks in your engineering organization.
            </p>

            <div className="bg-[#090909] p-3 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-400 flex items-center justify-between mb-4">
              <span>Target: macOS Engineering Fleet (50 Devices)</span>
              <span className="text-emerald-400 font-semibold">Ready to Push</span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
            <button 
              onClick={async () => {
                setPingStatus("Contacting Jamf Pro API & deploying package...");
                try {
                  const res = await fetch("/api/integrations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": apiKey },
                    body: JSON.stringify({ action: "deploy_jamf", targetGroup: "macOS Engineering Laptops (50 Devices)" })
                  });
                  const data = await res.json();
                  if (data.success) {
                    setPingStatus("⚡ Pushed to Jamf Pro! Silent rollout active across all enrolled MacBooks.");
                  } else {
                    setPingStatus("❌ Jamf push failed: " + (data.error || "Unknown"));
                  }
                } catch {
                  setPingStatus("❌ Network error connecting to API");
                }
                setTimeout(() => setPingStatus(null), 4000);
              }}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-cyan-950"
            >
              <Send size={14} /> ⚡ 1-Click Push to 50 MacBooks
            </button>

            <button 
              onClick={() => {
                navigator.clipboard.writeText("bash deploy/deploy-mdm.sh");
                setCopiedType("jamf");
                setTimeout(() => setCopiedType(null), 2000);
              }}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 font-medium"
            >
              {copiedType === "jamf" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copiedType === "jamf" ? "Copied Script" : "Copy Script"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
