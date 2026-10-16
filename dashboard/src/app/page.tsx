"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  ShieldAlert, ShieldCheck, Download, Search, Activity, BookOpen, 
  ToggleLeft, ToggleRight, LayoutDashboard, TrendingUp, Zap, Clock, 
  AlertTriangle, ChevronRight, ChevronDown, BarChart3, Lock, Server, 
  Sliders, Check, Copy, ExternalLink, Send, Laptop, Terminal, Cpu, 
  Code2, Sparkles, RefreshCw, Bell, Key, LogOut, Filter, Eye, CheckCircle2,
  XCircle, ArrowUpRight, HelpCircle, FileText, Database, Shield, Radio,
  Layers, HardDrive, ArrowRight, Bot
} from "lucide-react";
import FleetMdmTab from "./components/FleetMdmTab";
import SiemObservabilityTab from "./components/SiemObservabilityTab";
import AlertingTab from "./components/AlertingTab";
import DeviceFleetTab from "./components/DeviceFleetTab";
import AgentDiscoveryTab from "./components/AgentDiscoveryTab";
import ClientBrandIcon from "./components/ClientBrandIcon";

type Log = { 
  id: number; 
  timestamp: string; 
  user_id: string; 
  tool_name: string; 
  status: "ALLOWED" | "BLOCKED" | "DLP_REDACTED" | "HITL_PENDING" | "CIRCUIT_BROKEN"; 
  raw_request: string;
  prev_hash?: string;
  entry_hash?: string;
};

type TabType = "OVERVIEW" | "DEVICES" | "AGENTS" | "POLICY" | "AUDIT" | "MDM" | "SIEM" | "ALERTS";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("OVERVIEW");
  const [ddEndpoint] = useState("https://http-intake.logs.us5.datadoghq.com/api/v2/logs");
  const [slackUrlInput, setSlackUrlInput] = useState("");
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [fleetData, setFleetData] = useState<any>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [search, setSearch] = useState("");
  const [policySearch, setPolicySearch] = useState("");
  const [blockedTools, setBlockedTools] = useState<string[]>([]);
  const [approvalRequiredTools, setApprovalRequiredTools] = useState<string[]>([]);
  const [mcpLibrary, setMcpLibrary] = useState<{server: string, tools: string[]}[]>([]);
  const [expandedServers, setExpandedServers] = useState<Record<string, boolean>>({});
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  // Active feature tab in Section 1 (Datadog style interactive selector)
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);
  const [activeDiagnosisTab, setActiveDiagnosisTab] = useState<number>(0);

  // Facet filter state for Log Explorer (Datadog style)
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ALLOWED" | "BLOCKED" | "DLP_REDACTED" | "HITL_PENDING" | "CIRCUIT_BROKEN">("ALL");

  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [loginError, setLoginError] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sevlex_admin_key");
    if (stored) {
      setApiKey(stored);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    try {
      const res = await fetch("/api/policy", { headers: { "Authorization": inputKey } });
      if (res.status === 401) {
        setLoginError(true);
        return;
      }
      setApiKey(inputKey);
      setIsAuthenticated(true);
      localStorage.setItem("sevlex_admin_key", inputKey);
    } catch {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sevlex_admin_key");
    setIsAuthenticated(false);
    setApiKey("");
  };

  // Fetch Logs (Polling every 3s)
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/logs", { headers: { "Authorization": apiKey } });
        if (res.status === 401) {
          setIsAuthenticated(false);
          setApiKey("");
          localStorage.removeItem("sevlex_admin_key");
          return;
        }
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated, apiKey]);

  // Fetch Current Policy
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchPolicy = async () => {
      try {
        const res = await fetch("/api/policy", { headers: { "Authorization": apiKey } });
        if (res.status === 401) {
          setIsAuthenticated(false);
          setApiKey("");
          localStorage.removeItem("sevlex_admin_key");
          return;
        }
        const data = await res.json();
        if (data.policy?.blockedTools) {
          setBlockedTools(data.policy.blockedTools);
        }
        if (data.policy?.approvalRequiredTools) {
          setApprovalRequiredTools(data.policy.approvalRequiredTools);
        }
        if (data.discoveredTools) {
          setMcpLibrary(data.discoveredTools);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchPolicy();
  }, [isAuthenticated, apiKey]);

  // Fetch Fleet Telemetry
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchFleet = async () => {
      try {
        const res = await fetch("/api/fleet", { headers: { "Authorization": apiKey } });
        if (res.ok) {
          const data = await res.json();
          setFleetData(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchFleet();
    const interval = setInterval(fetchFleet, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, apiKey]);

  // 3-State Tool Policy Controller (ALLOW / HITL / BLOCK)
  const setToolState = async (toolName: string, state: "ALLOW" | "HITL" | "BLOCK") => {
    const newBlocked = blockedTools.filter(t => t !== toolName);
    const newApproval = approvalRequiredTools.filter(t => t !== toolName);

    if (state === "BLOCK") {
      newBlocked.push(toolName);
    } else if (state === "HITL") {
      newApproval.push(toolName);
    }

    setBlockedTools(newBlocked);
    setApprovalRequiredTools(newApproval);

    try {
      const res = await fetch("/api/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": apiKey },
        body: JSON.stringify({ 
          blockedTools: newBlocked,
          approvalRequiredTools: newApproval
        })
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        setApiKey("");
        localStorage.removeItem("sevlex_admin_key");
        return;
      }
      setPingStatus(`🛡️ Policy updated: ${toolName} ➔ ${state}`);
      setTimeout(() => setPingStatus(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.tool_name.toLowerCase().includes(search.toLowerCase()) || 
        log.status.toLowerCase().includes(search.toLowerCase()) ||
        (log.user_id && log.user_id.toLowerCase().includes(search.toLowerCase()));
      
      const matchesStatus = 
        statusFilter === "ALL" ? true : log.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [logs, search, statusFilter]);

  const exportLogsToCsv = () => {
    if (!logs.length) return;
    const headers = "id,timestamp,user_id,tool_name,status,raw_request\n";
    const rows = logs.map(l => `${l.id},"${l.timestamp}","${l.user_id}","${l.tool_name}","${l.status}","${(l.raw_request || '').replace(/"/g, '""')}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sevlex_audit_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#131220] text-zinc-300 font-sans flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-[#1C1B2E] p-8 rounded-2xl border border-white/[0.1] shadow-2xl max-w-sm w-full text-center relative overflow-hidden">
          <div className="flex justify-center mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/sevlex-logo.png" 
              alt="Sevlex Logo" 
              className="h-12 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.25)]" 
            />
          </div>
          <h2 className="text-base font-bold text-white mb-1 tracking-tight">Enterprise SecOps Console</h2>
          <p className="text-xs text-zinc-400 mb-6">Enter Admin API Key to access Layer 7 telemetry.</p>
          <input
            type="password"
            placeholder="Admin API Key"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-full bg-[#131220] border border-zinc-700 rounded-lg px-3.5 py-2.5 text-sm text-white mb-4 focus:outline-none focus:border-blue-500 font-mono transition-colors"
          />
          {loginError && <p className="text-red-400 text-xs mb-4">Invalid Admin Key. Check .env.local</p>}
          <button type="submit" className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium py-2 rounded-lg text-sm transition-all shadow-md shadow-blue-950/20">
            Authenticate Session
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans flex">
      
      {/* ========================================================================= */}
      {/* 1. LEFT DARK SIDEBAR (Official Datadog Style: #131220)                   */}
      {/* ========================================================================= */}
      <aside className="w-60 bg-[#131220] border-r border-[#242337] flex flex-col justify-between shrink-0 h-screen sticky top-0 text-zinc-300 z-50">
        <div>
          {/* Brand Header with Unified Sevlex Horizontal Lockup */}
          <div className="h-16 px-5 flex items-center border-b border-[#242337]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/sevlex-brand-horizontal.png" 
              alt="SEVLEX" 
              className="h-7 w-auto object-contain object-left" 
            />
          </div>

          {/* Navigation Menu */}
          <div className="px-3 py-4 space-y-1 text-xs font-medium">
            <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              AI Observability
            </div>

            {[
              { id: "OVERVIEW", label: "Overview", icon: LayoutDashboard },
              { id: "DEVICES", label: "Device Fleet", icon: HardDrive, badge: `${fleetData?.devices?.length || 6} Hosts` },
              { id: "AGENTS", label: "Shadow AI & Agents", icon: Bot, badge: `${fleetData?.runtimes?.length || 5} IDEs` },
              { id: "POLICY", label: "L7 Policies", icon: Sliders, badge: `${blockedTools.length} Banned` },
              { id: "AUDIT", label: "Log Explorer", icon: Activity, badge: `${logs.length}` },
              { id: "MDM", label: "Rollout Packages", icon: Server, badge: "Win32/Pkg" },
              { id: "SIEM", label: "SIEM Stream", icon: Zap, badge: "US5" },
              { id: "ALERTS", label: "Alerts & ChatOps", icon: Bell, badge: "P1-P3" },
            ].map((nav) => {
              const IconComp = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id as TabType)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                    isActive 
                      ? "bg-[#2563EB] text-white shadow-sm font-semibold" 
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp size={16} className={isActive ? "text-white" : "text-zinc-400"} />
                    <span>{nav.label}</span>
                  </div>
                  {nav.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-[#201F33] text-zinc-400"
                    }`}>
                      {nav.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Profile & Host Specs */}
        <div className="p-3 border-t border-[#242337] bg-[#0E0D18]">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-white font-medium truncate max-w-[110px]">{fleetData?.host?.hostname || "Meet-Panchal"}</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">win32-x64</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono pt-2 border-t border-[#242337]">
            <span>@{fleetData?.host?.user || "meetp"}</span>
            <button 
              onClick={handleLogout}
              title="Sign out"
              className="text-zinc-500 hover:text-white transition"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE CANVAS (Crisp Datadog White: #F8F9FB)                  */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-40">
          {/* Search Box */}
          <div className="relative w-72 sm:w-96">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Datadog telemetry, tools, CVEs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#2563EB] focus:bg-white font-mono transition"
            />
          </div>

          {/* Right Status Badges */}
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {fleetData?.devices?.length || 6} Hosts Shielded
            </span>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium font-mono">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/datadog.svg" alt="DD" className="w-3.5 h-3.5" />
              <span>US5 Connected</span>
            </div>

            <button 
              onClick={exportLogsToCsv}
              className="px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition shadow-xs flex items-center gap-1.5"
            >
              <Download size={13} /> Export PDF
            </button>
          </div>
        </header>

        {/* Workspace Canvas Body */}
        <main className="p-6 sm:p-8 space-y-8 max-w-[1500px] w-full">
          
          {/* ========================================================================= */}
          {/* TAB 0: OVERVIEW (Directly Modeled on User Screenshot!)                     */}
          {/* ========================================================================= */}
          {activeTab === "OVERVIEW" && (
            <div className="space-y-10">
              
              {/* HERO BANNER (Official Datadog Purple Gradient Banner from Screenshot) */}
              <div className="sevlex-gradient rounded-2xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                {/* Background decorative glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <div className="max-w-xl z-10 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase border border-white/20">
                    <Sparkles size={12} /> Data Observability (L7 MCP)
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                    Trusted Data, Optimized Pipelines, Zero Surprises.
                  </h1>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Unified zero-trust deep packet inspection across employee AI agents routing MCP traffic through Sevlex Gateway.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium">
                    <span className="flex items-center gap-1 opacity-90"><Check size={14} /> 142,394 Calls</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 opacity-90"><Check size={14} /> 1,243 Threats Blocked</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 opacity-90"><Check size={14} /> 0.78ms Latency</span>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button 
                      onClick={() => setActiveTab("POLICY")}
                      className="px-5 py-2.5 rounded-lg bg-white text-[#2563EB] font-bold text-xs hover:bg-blue-50 transition shadow-lg flex items-center gap-2"
                    >
                      Set up L7 Policy Control <ArrowRight size={14} />
                    </button>
                    <button 
                      onClick={() => setActiveTab("AUDIT")}
                      className="px-4 py-2.5 rounded-lg bg-black/20 hover:bg-black/30 border border-white/30 text-white font-medium text-xs transition"
                    >
                      View Live Audit Stream
                    </button>
                  </div>
                </div>

                {/* Hero Graphic Card (Right side preview from screenshot) */}
                <div className="w-full lg:w-96 bg-white rounded-xl p-4 text-slate-800 shadow-2xl z-10 border border-blue-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#2563EB]" /> L7 Gateway Node
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      LIVE ACTIVE
                    </span>
                  </div>
                  
                  {/* Miniature topology nodes */}
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <span className="text-slate-600">Client: Cursor &amp; Claude</span>
                      <span className="text-emerald-600 font-bold">127.0.0.1</span>
                    </div>
                    <div className="p-2 rounded bg-blue-50 border border-blue-200 flex justify-between items-center text-[#2563EB]">
                      <span className="font-bold">Sevlex L7 Inspection</span>
                      <span>0.78ms (p99)</span>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between items-center">
                      <span className="text-slate-600">Upstream MCP Servers</span>
                      <span className="text-slate-900 font-semibold">10 Connected</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION 1: "Complete visibility into job health and performance" (Exact Screenshot Layout!) */}
              <div className="space-y-6 pt-4">
                <div className="text-center max-w-2xl mx-auto space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Complete visibility into tool health and performance
                  </h2>
                  <p className="text-xs text-slate-500">
                    Learn how Sevlex L7 Monitoring can help you solve security issues faster and save money
                  </p>
                </div>

                {/* Split Bento: Left Selector Tabs + Right Live Data View */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Column: 3 Feature Selectors (Directly from Screenshot!) */}
                  <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
                    {[
                      {
                        title: "Detect prompt injections & tool violations with out-of-the-box alerts",
                        desc: "Quickly prioritize threats by seeing raw intercepted JSON-RPC tokens and automated policy mitigations.",
                        icon: ShieldAlert
                      },
                      {
                        title: "Pinpoint and resolve failed and long-running MCP tool calls faster",
                        desc: "Identify latency bottlenecks, rate-limit thresholds, and failed database operations before developers report them.",
                        icon: Zap
                      },
                      {
                        title: "Reduce risk by governing shadow AI on developer laptops",
                        desc: "Unify visibility across Claude Desktop, Cursor, and Windsurf through automated Win32 and Jamf deployments.",
                        icon: Laptop
                      }
                    ].map((feature, idx) => {
                      const Icon = feature.icon;
                      const isSelected = activeFeatureTab === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveFeatureTab(idx)}
                          className={`p-5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-white border-[#2563EB] shadow-md ring-1 ring-[#2563EB]"
                              : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Icon size={18} className={isSelected ? "text-[#2563EB]" : "text-slate-400"} />
                            <div>
                              <h3 className={`text-xs font-bold leading-snug ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                                {feature.title}
                              </h3>
                              {isSelected && (
                                <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                                  {feature.desc}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Live Data View / Data Table (Directly from Screenshot!) */}
                  <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      {/* Top Bar inside preview card */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-2">
                          <Activity size={16} className="text-[#2563EB]" />
                          <span className="text-xs font-bold text-slate-900 font-mono">Live L7 Packet Telemetry</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-[#2563EB] border border-blue-200">
                            STREAMING
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                          <span>Total: 142,394</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-semibold">99.1% Allowed</span>
                        </div>
                      </div>

                      {/* Live Data Grid */}
                      <div className="overflow-x-auto rounded-lg border border-slate-100">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-mono text-[10px]">
                              <th className="py-2.5 px-3 font-medium">Status</th>
                              <th className="py-2.5 px-3 font-medium">Timestamp</th>
                              <th className="py-2.5 px-3 font-medium">Identity</th>
                              <th className="py-2.5 px-3 font-medium">Tool Call</th>
                              <th className="py-2.5 px-3 font-medium text-right">Latency</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                            {[
                              { s: "BLOCKED", t: "05:54:12.392", u: "meetp", tool: "delete_database", lat: "0.4ms" },
                              { s: "ALLOWED", t: "05:54:11.840", u: "meetp", tool: "read_company_knowledge", lat: "0.8ms" },
                              { s: "ALLOWED", t: "05:53:58.102", u: "meetp", tool: "github_search_issues", lat: "1.1ms" },
                              { s: "BLOCKED", t: "05:52:45.918", u: "meetp", tool: "drop_table", lat: "0.3ms" },
                              { s: "ALLOWED", t: "05:51:20.443", u: "meetp", tool: "slack_post_message", lat: "0.9ms" }
                            ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/80 transition">
                                <td className="py-2.5 px-3">
                                  {row.s === "BLOCKED" ? (
                                    <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                      <ShieldAlert size={10} /> BLOCKED
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                      <ShieldCheck size={10} /> ALLOWED
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-slate-500 text-[11px]">{row.t}</td>
                                <td className="py-2.5 px-3 text-blue-700 font-medium">@{row.u}</td>
                                <td className="py-2.5 px-3 font-bold text-slate-900">{row.tool}</td>
                                <td className="py-2.5 px-3 text-right text-slate-500">{row.lat}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span>Audit Receipts: Synchronous SQLite WAL</span>
                      <button 
                        onClick={() => setActiveTab("AUDIT")}
                        className="text-[#2563EB] hover:underline font-semibold flex items-center gap-1"
                      >
                        Inspect all 10,000+ entries in Log Explorer →
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 2: "Be the first to know when policies break" (Matching Screenshot Section 3!) */}
              <div className="space-y-6 pt-4">
                <div className="text-center max-w-2xl mx-auto space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    Be the first to know when data breaks
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ensure trust in your data by detecting, resolving, and preventing data issues with Quality Monitoring
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Column: Time Series Monitor Chart */}
                  <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 size={16} className="text-[#2563EB]" />
                          <span className="text-xs font-bold text-slate-900 font-mono">pricing freshness &amp; tool invocations</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          STATUS: OK
                        </span>
                      </div>

                      {/* SVG Metric Chart with Upper/Lower bounds */}
                      <div className="h-44 w-full border border-slate-100 rounded-lg p-2 flex flex-col justify-between bg-slate-50/50 relative overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 500 120" fill="none">
                          {/* Upper bound dashed line */}
                          <line x1="0" y1="20" x2="500" y2="20" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
                          <text x="10" y="15" fill="#94A3B8" fontSize="9" fontFamily="monospace">UPPER BOUND (120 req/s)</text>

                          {/* Lower bound dashed line */}
                          <line x1="0" y1="100" x2="500" y2="100" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4" />
                          <text x="10" y="112" fill="#94A3B8" fontSize="9" fontFamily="monospace">LOWER BOUND (10 req/s)</text>

                          {/* Data line */}
                          <path 
                            d="M 0 70 Q 50 60, 100 80 T 200 40 T 300 65 T 400 30 T 500 50" 
                            stroke="#2563EB" 
                            strokeWidth="2.5" 
                            fill="none" 
                          />
                          {/* Anomaly Spike in red */}
                          <circle cx="400" cy="30" r="4" fill="#EF4444" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Anomaly Detection: Statistical Outlier Intercept</span>
                      <span className="text-red-600 font-semibold">1 Interception at 05:52</span>
                    </div>
                  </div>

                  {/* Right Column: Accordion Diagnostic Items (Matching Screenshot!) */}
                  <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
                    {[
                      {
                        title: "Detect silent data issues",
                        desc: "Continuously monitor the health of tools within your AI pipelines, so you're the first to know when data breaks."
                      },
                      {
                        title: "Assess blast radius",
                        desc: "Trace which AI models, agents, and employee accounts were exposed to the compromised tool call."
                      },
                      {
                        title: "Diagnose root cause",
                        desc: "Pinpoint whether the failure was an indirect prompt injection, credential exfiltration, or invalid schema."
                      }
                    ].map((diag, idx) => {
                      const isSelected = activeDiagnosisTab === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setActiveDiagnosisTab(idx)}
                          className={`p-5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-white border-[#2563EB] shadow-md ring-1 ring-[#2563EB]"
                              : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                          }`}
                        >
                          <h3 className={`text-xs font-bold ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                            {diag.title}
                          </h3>
                          {isSelected && (
                            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                              {diag.desc}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* SECTION 3: "Dive deeper" (Matching Bottom of User Screenshot!) */}
              <div className="space-y-4 pt-4">
                <div className="text-center max-w-xl mx-auto space-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">Dive deeper</h2>
                  <p className="text-xs text-slate-500">Resources and guides to help you get the most out of Sevlex Observability</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Public Documentation",
                      desc: "Complete architectural references for Layer 7 DPI, JSON-RPC parsing, and stream fail-closing.",
                      icon: FileText
                    },
                    {
                      title: "Detect issues and optimize speed with out-of-the-box policies",
                      desc: "Explore pre-configured zero-trust rules for GitHub, PostgreSQL, AWS, and Slack MCP servers.",
                      icon: Shield
                    },
                    {
                      title: "Ensure trust across the entire data life cycle",
                      desc: "How to export SOC 2 Type II audit evidence and stream real-time telemetry to Datadog US5.",
                      icon: Database
                    }
                  ].map((res, idx) => {
                    const Icon = res.icon;
                    return (
                      <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition group">
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-100">
                            <Icon size={20} />
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#2563EB] transition">
                            {res.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {res.desc}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100">
                          <span className="text-xs font-semibold text-[#2563EB] flex items-center gap-1 group-hover:underline">
                            See more →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: DEVICE FLEET INVENTORY (Runlayer Watch Parity)                       */}
          {/* ========================================================================= */}
          {activeTab === "DEVICES" && (
            <DeviceFleetTab 
              devices={fleetData?.devices || []} 
              setPingStatus={setPingStatus} 
              onNavigateToMdm={() => setActiveTab("MDM")}
            />
          )}

          {/* ========================================================================= */}
          {/* TAB: SHADOW AI & CLIENT AGENT DISCOVERY (AgentGuard)                      */}
          {/* ========================================================================= */}
          {activeTab === "AGENTS" && (
            <AgentDiscoveryTab 
              runtimes={fleetData?.runtimes || []} 
              onNavigateToPolicy={() => setActiveTab("POLICY")} 
              setPingStatus={setPingStatus} 
            />
          )}

          {/* ========================================================================= */}
          {/* TAB 1: VISUAL POLICY LIBRARY (Clean White Datadog Styling)                */}
          {/* ========================================================================= */}
          {activeTab === "POLICY" && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-6 rounded-xl shadow-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sliders size={20} className="text-[#2563EB]" />
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">Enterprise L7 Policy Engine</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 uppercase tracking-wider font-mono">
                      {blockedTools.length} Banned
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200 uppercase tracking-wider font-mono">
                      {approvalRequiredTools.length} HITL
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider font-mono">
                      DLP Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Granular tool access control with real-time deep argument inspection, dual-custody human approvals, and in-flight secret redaction.
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search tools (e.g. drop_table)..."
                    value={policySearch}
                    onChange={(e) => {
                      setPolicySearch(e.target.value);
                      setExpandedServers({});
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 outline-none font-mono focus:border-[#2563EB] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* ToolGuard™ & Output DLP Active Protection Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">ToolGuard Call Guard</span>
                    <span className="font-bold text-slate-900">DPI Argument Inspection</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse shrink-0"></div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">ToolGuard Output Guard</span>
                    <span className="font-bold text-slate-900">In-Flight Secret &amp; PII DLP</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shrink-0"></div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">AgentGuard HITL</span>
                    <span className="font-bold text-slate-900">Dual-Custody Approvals</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {mcpLibrary.map((server) => {
                  const filteredTools = server.tools.filter(tool => 
                    tool.toLowerCase().includes(policySearch.toLowerCase())
                  );
                  
                  if (filteredTools.length === 0 && policySearch) return null;
                  const isExpanded = expandedServers[server.server] ?? (policySearch.trim() !== "");

                  return (
                    <div key={server.server} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                      <button 
                        onClick={() => setExpandedServers(prev => ({ ...prev, [server.server]: !isExpanded }))}
                        className="w-full bg-slate-50/70 px-4 py-3 flex items-center justify-between hover:bg-slate-100/70 transition"
                      >
                        <div className="flex items-center gap-3">
                          <ClientBrandIcon name={server.server} size="sm" className="rounded-md shrink-0" />
                          <h3 className="font-bold text-xs text-slate-800">
                            {server.server} 
                            <span className="text-slate-500 text-[11px] font-mono ml-2 font-normal">({filteredTools.length} tools)</span>
                          </h3>
                        </div>
                        {isExpanded ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="divide-y divide-slate-100">
                          {filteredTools.map((tool) => {
                            const isBlocked = blockedTools.includes(tool);
                            const isHitl = approvalRequiredTools.includes(tool);
                            return (
                              <div key={tool} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50/50 transition group">
                                <div className="flex-1 flex items-center gap-3">
                                  <p className="font-mono text-xs font-medium text-slate-800 group-hover:text-[#2563EB] transition">{tool}</p>
                                  {isBlocked ? (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-red-50 text-red-700 border border-red-200 uppercase">
                                      BLOCKED
                                    </span>
                                  ) : isHitl ? (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-50 text-[#2563EB] border border-blue-200 uppercase flex items-center gap-1">
                                      <Shield size={10} /> HITL REQUIRED
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                                      ALLOWED
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 ml-3">
                                  <button
                                    onClick={() => setToolState(tool, "ALLOW")}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition ${
                                      !isBlocked && !isHitl 
                                        ? "bg-emerald-600 text-white shadow-2xs" 
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                    title="Permit tool execution without friction"
                                  >
                                    Allow
                                  </button>
                                  <button
                                    onClick={() => setToolState(tool, "HITL")}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition flex items-center gap-1 ${
                                      isHitl 
                                        ? "bg-[#2563EB] text-white shadow-2xs" 
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                    title="Require human dual-custody authorization before running"
                                  >
                                    <Shield size={10} /> HITL
                                  </button>
                                  <button
                                    onClick={() => setToolState(tool, "BLOCK")}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition ${
                                      isBlocked 
                                        ? "bg-red-600 text-white shadow-2xs" 
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                    title="Hard block tool calls immediately"
                                  >
                                    Block
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: AUDIT LOGS (Datadog Log Explorer Style with Facets)                */}
          {/* ========================================================================= */}
          {activeTab === "AUDIT" && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
              
              {/* Top Toolbar */}
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-50 gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search logs by tool name, payload, or user..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none font-mono focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Status Facet Filter */}
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-mono">
                    <button 
                      onClick={() => setStatusFilter("ALL")}
                      className={`px-2 py-1 rounded transition ${statusFilter === "ALL" ? "bg-slate-900 text-white font-semibold" : "text-slate-500"}`}
                    >
                      All ({logs.length})
                    </button>
                    <button 
                      onClick={() => setStatusFilter("ALLOWED")}
                      className={`px-2 py-1 rounded transition ${statusFilter === "ALLOWED" ? "bg-emerald-100 text-emerald-800 font-semibold" : "text-slate-500"}`}
                    >
                      Allowed
                    </button>
                    <button 
                      onClick={() => setStatusFilter("BLOCKED")}
                      className={`px-2 py-1 rounded transition ${statusFilter === "BLOCKED" ? "bg-red-100 text-red-800 font-semibold" : "text-slate-500"}`}
                    >
                      Blocked
                    </button>
                    <button 
                      onClick={() => setStatusFilter("DLP_REDACTED")}
                      className={`px-2 py-1 rounded transition ${statusFilter === "DLP_REDACTED" ? "bg-purple-100 text-purple-800 font-semibold" : "text-slate-500"}`}
                    >
                      DLP
                    </button>
                    <button 
                      onClick={() => setStatusFilter("HITL_PENDING")}
                      className={`px-2 py-1 rounded transition ${statusFilter === "HITL_PENDING" ? "bg-blue-100 text-blue-800 font-semibold" : "text-slate-500"}`}
                    >
                      HITL
                    </button>
                    <button 
                      onClick={() => setStatusFilter("CIRCUIT_BROKEN")}
                      className={`px-2 py-1 rounded transition ${statusFilter === "CIRCUIT_BROKEN" ? "bg-amber-100 text-amber-800 font-semibold" : "text-slate-500"}`}
                    >
                      Breaker
                    </button>
                  </div>
                </div>

                <button 
                  onClick={exportLogsToCsv}
                  className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 transition"
                >
                  <Download size={13} /> Export SOC-2 CSV
                </button>
              </div>

              {/* Logs Table with JSON Drawer */}
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                
                {/* Left (2 cols): Stream Table */}
                <div className="lg:col-span-2 overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px] z-10">
                      <tr>
                        <th className="py-2.5 px-4 font-medium">Status</th>
                        <th className="py-2.5 px-4 font-medium">Timestamp</th>
                        <th className="py-2.5 px-4 font-medium">Identity</th>
                        <th className="py-2.5 px-4 font-medium">Tool Call</th>
                        <th className="py-2.5 px-4 font-medium">Payload Preview</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                      {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                        <tr 
                          key={log.id} 
                          onClick={() => setSelectedLog(log)}
                          className={`hover:bg-slate-50 transition cursor-pointer ${
                            selectedLog?.id === log.id ? "bg-blue-50/70 border-l-2 border-[#2563EB]" : ""
                          }`}
                        >
                          <td className="py-2.5 px-4">
                            {log.status === "BLOCKED" ? (
                              <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                <ShieldAlert size={11} /> BLOCKED
                              </span>
                            ) : log.status === "CIRCUIT_BROKEN" ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                <Zap size={11} /> CIRCUIT BROKEN
                              </span>
                            ) : log.status === "DLP_REDACTED" ? (
                              <span className="inline-flex items-center gap-1 text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                <Lock size={11} /> DLP REDACTED
                              </span>
                            ) : log.status === "HITL_PENDING" ? (
                              <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                <Shield size={11} /> HITL PENDING
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                <ShieldCheck size={11} /> ALLOWED
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                          <td className="py-2.5 px-4 text-blue-700 font-medium">@{log.user_id || "meetp"}</td>
                          <td className="py-2.5 px-4 font-bold text-slate-900">{log.tool_name}</td>
                          <td className="py-2.5 px-4 text-slate-500 truncate max-w-xs">{log.raw_request}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-500 text-xs font-mono">
                            No audit receipts found matching criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Right (1 col): JSON Inspector Drawer */}
                <div className="bg-slate-50/50 p-4 flex flex-col justify-between max-h-[600px] overflow-y-auto">
                  {selectedLog ? (
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-mono">
                          <Eye size={13} className="text-[#2563EB]" /> Event #{selectedLog.id} Detail
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          selectedLog.status === "BLOCKED" 
                            ? "bg-red-100 text-red-800" 
                            : "bg-emerald-100 text-emerald-800"
                        }`}>
                          {selectedLog.status}
                        </span>
                      </div>

                      <div className="space-y-3 text-xs font-mono">
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Tool Name:</span>
                          <p className="text-slate-900 font-bold">{selectedLog.tool_name}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Authenticated Identity:</span>
                          <p className="text-blue-700">@{selectedLog.user_id || "meetp"}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Timestamp:</span>
                          <p className="text-slate-700">{selectedLog.timestamp}</p>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Layer 7 Deep Packet Payload:</span>
                          <pre className="mt-1.5 p-3 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800 font-mono whitespace-pre-wrap break-all overflow-x-auto max-h-60 shadow-xs">
                            {(() => {
                              try {
                                return JSON.stringify(JSON.parse(selectedLog.raw_request), null, 2);
                              } catch {
                                return selectedLog.raw_request;
                              }
                            })()}
                          </pre>
                        </div>

                        {selectedLog.entry_hash && (
                          <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200/80 text-[10px] space-y-1.5">
                            <div className="flex items-center justify-between text-blue-900 font-bold">
                              <span className="flex items-center gap-1"><Lock size={10} /> SOC 2 Cryptographic Hash Link</span>
                              <span className="text-[9px] text-blue-600 font-mono">SHA-256</span>
                            </div>
                            <div className="font-mono text-slate-600 break-all text-[9px]">
                              <span className="text-slate-400">Prev: </span>{selectedLog.prev_hash || "0000000000000000000000000000000000000000000000000000000000000000"}
                            </div>
                            <div className="font-mono text-slate-800 font-bold break-all text-[9px]">
                              <span className="text-slate-400 font-normal">Hash: </span>{selectedLog.entry_hash}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 text-center text-slate-400 text-xs font-mono flex flex-col items-center justify-center">
                      <Eye size={24} className="mb-2 opacity-40 text-slate-400" />
                      <p>Select any audit receipt on the left to inspect full Layer 7 JSON-RPC forensic packet.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: FLEET MDM (Level 3 Packages)                                       */}
          {/* ========================================================================= */}
          {activeTab === "MDM" && (
            <FleetMdmTab 
              apiKey={apiKey} 
              setPingStatus={setPingStatus} 
              copiedType={copiedType} 
              setCopiedType={setCopiedType} 
            />
          )}

          {/* ========================================================================= */}
          {/* TAB 4: SIEM STREAM (Datadog US5)                                          */}
          {/* ========================================================================= */}
          {activeTab === "SIEM" && (
            <SiemObservabilityTab 
              apiKey={apiKey} 
              ddEndpoint={ddEndpoint} 
              setPingStatus={setPingStatus} 
            />
          )}

          {/* ========================================================================= */}
          {/* TAB 5: INCIDENT ALERTS (Slack & PagerDuty)                                 */}
          {/* ========================================================================= */}
          {activeTab === "ALERTS" && (
            <AlertingTab 
              apiKey={apiKey} 
              slackUrlInput={slackUrlInput} 
              setSlackUrlInput={setSlackUrlInput} 
              setPingStatus={setPingStatus} 
            />
          )}

        </main>
      </div>

      {/* Global Toast Notification */}
      {pingStatus && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white shadow-2xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
          <span>{pingStatus}</span>
        </div>
      )}

    </div>
  );
}
