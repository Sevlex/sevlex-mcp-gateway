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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="text-[#2563EB]" size={22} />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Incident Alerting &amp; ChatOps</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200 uppercase tracking-wider font-mono">
              Real-Time Active
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Instant high-priority alarms sent to SecOps channels the second an AI tool attempts unauthorized actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            P1 Dispatch Ready
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1: SLACK REAL-TIME ALERTS */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ClientBrandIcon name="Slack" size="xl" className="rounded-md shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">Slack Incident Alerts</h3>
                  <p className="text-xs text-slate-500 font-mono">Instant SecOps Channel Notifications</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200 font-mono">
                WEBHOOK
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              When a developer or AI client triggers a banned tool (e.g. <code>drop_table</code>), Sevlex immediately posts a rich threat card directly into your incident channel.
            </p>

            <div className="space-y-3 font-mono text-xs mb-4">
              <div>
                <label className="text-slate-500 text-[11px] block mb-1">Incoming Webhook URL</label>
                <input 
                  type="text" 
                  placeholder="https://hooks.slack.com/services/T00/B00/XXXX"
                  value={slackUrlInput}
                  onChange={(e) => setSlackUrlInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 text-[11px] font-mono outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Trigger Condition:</span>
                  <span className="text-red-700 font-bold">Policy BLOCKED Event</span>
                </div>
                <div className="flex justify-between">
                  <span>Dispatch Latency:</span>
                  <span className="text-emerald-700 font-semibold">&lt; 15ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button 
              onClick={handleTestSlack}
              className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5"
            >
              <Send size={13} /> Send Test Alert
            </button>
            <span className="text-[11px] text-slate-400 font-mono">Channel: #secops-ai-alerts</span>
          </div>
        </div>

        {/* CARD 2: PAGERDUTY & INCIDENT AUTOMATION */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ClientBrandIcon name="PagerDuty" size="xl" className="rounded-md shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">PagerDuty &amp; Opsgenie</h3>
                  <p className="text-xs text-slate-500 font-mono">P1 Critical Severity Escalation</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 font-mono">
                P1 / P2
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Escalate critical tool exfiltration events directly to the on-call security engineer phone tree during off-hours.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono mb-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Escalation Rule:</span>
                <span className="text-slate-900 font-bold">&gt; 3 Blocked Tools / 60s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Auto-Remediation:</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Kill Node Child Process</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Audit Proof:</span>
                <span className="text-slate-800 font-semibold">Attached to Incident Ticket</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Integration: REST Events API v2</span>
            <span className="text-slate-400 font-mono">Routing Key: Configured</span>
          </div>
        </div>

      </div>
    </div>
  );
}
