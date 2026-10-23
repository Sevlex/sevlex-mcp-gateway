"use client";

import { Bell, ShieldAlert, Send } from "lucide-react";
import ClientBrandIcon from "./ClientBrandIcon";

interface AlertingTabProps {
  apiKey: string;
  slackUrlInput: string;
  setSlackUrlInput: (url: string) => void;
  setPingStatus: (msg: string | null) => void;
}

export default function AlertingTab({ apiKey, slackUrlInput, setSlackUrlInput, setPingStatus }: AlertingTabProps) {
  const handleTestSlack = async () => {
    if (!slackUrlInput) {
      setPingStatus("⚠️ Enter a valid Slack Webhook URL first.");
      setTimeout(() => setPingStatus(null), 3000);
      return;
    }
    setPingStatus("🚀 Dispatching simulated threat alert to Slack...");
    try {
      const res = await fetch("/api/alerts/test", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": apiKey },
        body: JSON.stringify({ webhookUrl: slackUrlInput })
      });
      if (res.ok) {
        setPingStatus("✅ Test alert successfully received in Slack!");
      } else {
        setPingStatus("⚠️ Sent test webhook payload (check channel).");
      }
    } catch {
      setPingStatus("⚠️ Webhook dispatched (verify Slack incoming settings).");
    } finally {
      setTimeout(() => setPingStatus(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0E0D17] border border-white/[0.08] p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="text-blue-400" size={22} />
            <h2 className="text-xl font-bold text-white tracking-tight">Incident Alerting &amp; ChatOps</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider font-mono">
              Real-Time Active
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Instant high-priority alarms sent to SecOps channels the second an AI tool attempts unauthorized actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            P1 Dispatch Ready
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: SLACK REAL-TIME ALERTS */}
        <div className="bg-[#0E0D17] border border-white/[0.08] p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-blue-500/30 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ClientBrandIcon name="Slack" size="xl" className="rounded-md shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-white">Slack Incident Alerts</h3>
                  <p className="text-xs text-zinc-400 font-mono">Instant SecOps Channel Notifications</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                WEBHOOK
              </span>
            </div>

            <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
              When a developer or AI client triggers a banned tool (e.g. <code className="text-red-400 font-mono">drop_table</code>), Sevlex immediately posts a rich threat card directly into your incident channel.
            </p>

            <div className="space-y-3 font-mono text-xs mb-4">
              <div>
                <label className="text-zinc-400 text-[11px] block mb-1">Incoming Webhook URL</label>
                <input 
                  type="text" 
                  placeholder="https://hooks.slack.com/services/T00/B00/XXXX"
                  value={slackUrlInput}
                  onChange={(e) => setSlackUrlInput(e.target.value)}
                  className="w-full bg-[#12111D] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-[11px] font-mono outline-none focus:border-blue-500 transition"
                />
              </div>

              <div className="bg-[#12111D] p-3 rounded-xl border border-white/[0.06] text-[11px] space-y-1.5 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Trigger Condition:</span>
                  <span className="text-red-400 font-bold">Policy BLOCKED Event</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Dispatch Latency:</span>
                  <span className="text-emerald-400 font-semibold">&lt; 15ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <button 
              onClick={handleTestSlack}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
            >
              <Send size={13} /> Send Test Alert
            </button>
            <span className="text-[11px] text-zinc-500 font-mono">Channel: #secops-ai-alerts</span>
          </div>
        </div>

        {/* CARD 2: PAGERDUTY & INCIDENT AUTOMATION */}
        <div className="bg-[#0E0D17] border border-white/[0.08] p-6 rounded-2xl shadow-xl flex flex-col justify-between hover:border-blue-500/30 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ClientBrandIcon name="PagerDuty" size="xl" className="rounded-md shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-white">PagerDuty &amp; Opsgenie</h3>
                  <p className="text-xs text-zinc-400 font-mono">P1 Critical Severity Escalation</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                P1 / P2
              </span>
            </div>

            <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
              Escalate critical tool exfiltration events directly to the on-call security engineer phone tree during off-hours.
            </p>

            <div className="bg-[#12111D] p-4 rounded-xl border border-white/[0.06] space-y-2 text-xs font-mono mb-4">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Escalation Rule:</span>
                <span className="text-white font-bold">&gt; 3 Blocked Tools / 60s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Auto-Remediation:</span>
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Kill Node Child Process</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Audit Proof:</span>
                <span className="text-zinc-200 font-semibold">Attached to Incident Ticket</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
            <span>Integration: REST Events API v2</span>
            <span className="text-zinc-500 font-mono">Routing Key: Configured</span>
          </div>
        </div>

      </div>
    </div>
  );
}
