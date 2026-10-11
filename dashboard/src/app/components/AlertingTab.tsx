"use client";

import { Bell, ShieldAlert, Send } from "lucide-react";

interface AlertingTabProps {
  apiKey: string;
  slackUrlInput: string;
  setSlackUrlInput: (url: string) => void;
  setPingStatus: (msg: string | null) => void;
}

export default function AlertingTab({ apiKey, slackUrlInput, setSlackUrlInput, setPingStatus }: AlertingTabProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Bell className="text-amber-400" size={22} /> Incident Alerting &amp; ChatOps
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Instant high-priority alarms sent to SecOps channels the second an AI tool attempts unauthorized actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Real-Time Active
          </span>
        </div>
      </div>

      {/* Architecture Role Callout */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-xs text-amber-200 leading-relaxed flex items-start gap-3">
        <span className="text-base">💡</span>
        <div>
          <strong className="text-white block mb-0.5">Role of Slack in Sevlex:</strong>
          Slack <span className="underline font-semibold text-amber-300">does not store logs or deploy software</span>. It is an instant alarm wire that pings your team&apos;s channel the millisecond an attack, unauthorized SQL drop, or policy breach is blocked.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: SLACK REAL-TIME ALERTS */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/slack.svg" alt="Slack" className="w-5 h-5 invert" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Slack Incident Alerts</h3>
                  <p className="text-xs text-zinc-400">Instant SecOps Channel Notifications</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                WEBHOOK
              </span>
            </div>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Sends immediate, high-priority notifications to your #secops channel when an employee or AI agent attempts an unauthorized tool execution.
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-zinc-500 text-[11px] block mb-1">Slack Webhook URL</label>
                <input 
                  type="text" 
                  placeholder="https://hooks.slack.com/services/..."
                  value={slackUrlInput}
                  onChange={(e) => setSlackUrlInput(e.target.value)}
                  className="w-full bg-[#090909] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
            <button 
              onClick={async () => {
                if (!slackUrlInput) {
                  alert("Please enter a Slack Webhook URL first.");
                  return;
                }
                setPingStatus("Sending test alert to Slack...");
                try {
                  const res = await fetch("/api/integrations", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Authorization": apiKey },
                    body: JSON.stringify({ action: "test_slack", webhookUrl: slackUrlInput })
                  });
                  const data = await res.json();
                  if (data.success) {
                    setPingStatus("⚡ Test alert delivered to Slack channel!");
                  } else {
                    setPingStatus("❌ Alert failed: " + (data.error || "Check URL"));
                  }
                } catch {
                  setPingStatus("❌ Error sending alert");
                }
                setTimeout(() => setPingStatus(null), 4000);
              }}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-amber-950"
            >
              <Send size={14} /> Send Test Slack Alert
            </button>

            <span className="text-[11px] text-zinc-500 font-mono">Payload: Blocked Threat</span>
          </div>
        </div>

        {/* CARD 2: INCIDENT ESCALATION RULES */}
        <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <ShieldAlert size={20} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Alert Trigger Rules</h3>
                  <p className="text-xs text-zinc-400">Zero-Trust Escalation Matrix</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                ACTIVE
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#090909] border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Banned Tool Execution</span>
                <span className="text-red-400 font-bold">P1 CRITICAL (Instant Ping)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090909] border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Buffer Size Limit Exceeded</span>
                <span className="text-amber-400 font-bold">P2 WARNING</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090909] border border-zinc-800 flex items-center justify-between">
                <span className="text-zinc-400">Unknown Server Discovery</span>
                <span className="text-blue-400 font-bold">P3 AUDIT NOTICE</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>Routing Protocol</span>
            <span className="text-zinc-300">Webhook POST</span>
          </div>
        </div>
      </div>
    </div>
  );
}
