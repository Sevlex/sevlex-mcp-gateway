"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  ShieldAlert, ShieldCheck, Download, Search, Activity, BookOpen, 
  ToggleLeft, ToggleRight, LayoutDashboard, TrendingUp, Zap, Clock, 
  AlertTriangle, ChevronRight, ChevronDown, BarChart3, Lock, Server, 
  Sliders, Check, Copy, ExternalLink, Send, Laptop, Terminal, Cpu, 
  Code2, Sparkles, RefreshCw, Bell, Key, LogOut, Filter, Eye, CheckCircle2,
  XCircle, ArrowUpRight, HelpCircle
} from "lucide-react";
import FleetMdmTab from "./components/FleetMdmTab";
import SiemObservabilityTab from "./components/SiemObservabilityTab";
import AlertingTab from "./components/AlertingTab";

type Log = { 
  id: number; 
  timestamp: string; 
  user_id: string; 
  tool_name: string; 
  status: "ALLOWED" | "BLOCKED"; 
  raw_request: string; 
};

const getBrandIcon = (serverName: string) => {
  const normalized = serverName.toLowerCase();
  let brand = "";
  if (normalized.includes("github")) brand = "github";
  else if (normalized.includes("slack")) brand = "slack";
  else if (normalized.includes("postgres")) brand = "postgresql";
  else if (normalized.includes("aws") || normalized.includes("amazon")) brand = "amazonaws";
  else if (normalized.includes("jira")) brand = "jira";
  else if (normalized.includes("kubernetes") || normalized.includes("k8s")) brand = "kubernetes";
  else if (normalized.includes("linear")) brand = "linear";
  else if (normalized.includes("notion")) brand = "notion";
  else if (normalized.includes("figma")) brand = "figma";
  else if (normalized.includes("discord")) brand = "discord";
  else if (normalized.includes("docker")) brand = "docker";
  else if (normalized.includes("gcp") || normalized.includes("googlecloud")) brand = "googlecloud";

  if (brand) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img 
        src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${brand}.svg`} 
        alt={`${serverName} logo`}
        className="w-4 h-4 invert opacity-90"
      />
    );
  }
  return <Server size={16} className="text-zinc-400" />;
};

type TabType = "OVERVIEW" | "POLICY" | "AUDIT" | "MDM" | "SIEM" | "ALERTS";

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
  const [mcpLibrary, setMcpLibrary] = useState<{server: string, tools: string[]}[]>([]);
  const [expandedServers, setExpandedServers] = useState<Record<string, boolean>>({});
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  // Facet filter state for Log Explorer (Datadog style)
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ALLOWED" | "BLOCKED">("ALL");

  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [timeRange, setTimeRange] = useState("24h");

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

  // Handle Toggle Switch
  const toggleTool = async (toolName: string) => {
    const isCurrentlyBlocked = blockedTools.includes(toolName);
    const newBlockedList = isCurrentlyBlocked 
      ? blockedTools.filter(t => t !== toolName)
      : [...blockedTools, toolName];
    
    setBlockedTools(newBlockedList);
    
    try {
      const res = await fetch("/api/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": apiKey },
        body: JSON.stringify({ blockedTools: newBlockedList })
      });
      if (res.status === 401) {
        setIsAuthenticated(false);
        setApiKey("");
        localStorage.removeItem("sevlex_admin_key");
      }
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

  // Export logs to CSV
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
      <div className="min-h-screen bg-[#08080a] text-zinc-300 font-sans flex items-center justify-center p-4 datadog-grid">
        <form onSubmit={handleLogin} className="bg-[#101014] p-8 rounded-2xl border border-white/[0.08] shadow-2xl max-w-sm w-full text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
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
            className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-white mb-4 focus:outline-none focus:border-blue-500 font-mono transition-colors"
          />
          {loginError && <p className="text-red-400 text-xs mb-4">Invalid Admin Key. Check .env.local</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg text-sm transition-all shadow-md shadow-blue-950">
            Authenticate Session
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-300 font-sans flex flex-col">
      
      {/* 1. TOP SEC-OPS COMMAND BAR (Datadog / Linear Style) */}
      <header className="sticky top-0 z-50 bg-[#08080a]/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          
          {/* Left: Brand + Env Selector */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#141419] border border-white/[0.1] flex items-center justify-center p-1 shadow-[0_0_12px_rgba(255,255,255,0.12)] group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/sevlex-icon.png" 
                  alt="Sevlex Logo Icon" 
                  className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(255,255,255,0.4)] transition-transform group-hover:scale-105" 
                />
              </div>
              <span className="font-bold text-sm tracking-tight text-white font-mono">SEVLEX</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                L7 FIREWALL
              </span>
            </div>

            <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

            {/* Scope pill */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121216] border border-white/[0.06] text-xs text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]"></span>
              <span className="font-medium text-white">Production Fleet</span>
              <span className="text-zinc-500 font-mono">(50 Hosts)</span>
            </div>
          </div>

          {/* Center: Live Command Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden lg:block">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-zinc-500" />
              <input 
                type="text"
                placeholder="Search tools, CVEs, users (@meetp), or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#101014] border border-white/[0.06] focus:border-blue-500/50 rounded-lg pl-9 pr-12 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 outline-none font-mono transition-colors"
              />
              <span className="absolute right-2.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-500 bg-zinc-800/80 border border-zinc-700/50">
                ⌘K
              </span>
            </div>
          </div>

          {/* Right: Telemetry Health Indicators */}
          <div className="flex items-center gap-2.5 text-xs">
            {/* Live Streaming indicator */}
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#121216] border border-white/[0.06] font-mono text-[11px]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-zinc-300">STREAMING</span>
              <span className="text-zinc-500 hidden sm:inline">(&lt; 0.8ms)</span>
            </div>

            {/* Datadog status */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121216] border border-white/[0.06] text-zinc-300 text-[11px] font-mono">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/datadog.svg" alt="DD" className="w-3.5 h-3.5 invert opacity-80" />
              <span>US5</span>
            </div>

            {/* Admin Badge & Logout */}
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
              <span className="text-zinc-400 font-mono text-xs hidden sm:inline">@{fleetData?.host?.user || "meetp"}</span>
              <button 
                onClick={handleLogout}
                title="Sign out of SecOps console"
                className="p-1.5 text-zinc-500 hover:text-zinc-200 rounded-md hover:bg-zinc-800/60 transition"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* 2. SUB-NAV / SEGMENTED TABS (Datadog Tab Strip) */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex items-center justify-between border-t border-white/[0.04]">
          <nav className="flex space-x-1 sm:space-x-2 py-1 overflow-x-auto">
            {[
              { id: "OVERVIEW", label: "Overview", icon: LayoutDashboard, badge: "142k" },
              { id: "POLICY", label: "L7 Policies", icon: Sliders, badge: `${blockedTools.length} Banned` },
              { id: "AUDIT", label: "Log Explorer", icon: Activity, badge: `${logs.length}` },
              { id: "MDM", label: "Fleet MDM", icon: Server, badge: "Level 3" },
              { id: "SIEM", label: "SIEM Stream", icon: Zap, badge: "US5" },
              { id: "ALERTS", label: "Alerts", icon: Bell, badge: "Live" },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-all flex items-center gap-2 relative ${
                    isActive
                      ? "text-white bg-[#141418] shadow-sm border border-white/[0.08]"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon size={14} className={isActive ? "text-blue-400" : "text-zinc-500"} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                      isActive 
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                        : "bg-zinc-800/60 text-zinc-500"
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute -bottom-1 inset-x-3 h-[2px] bg-blue-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] text-zinc-500 font-mono">SOC 2 Type II Verified</span>
          </div>
        </div>
      </header>

      {/* 3. MAIN DASHBOARD CONTENT CANVAS */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* ========================================================================= */}
        {/* TAB 0: OVERVIEW & INTELLIGENCE (Datadog Aesthetic)                        */}
        {/* ========================================================================= */}
        {activeTab === "OVERVIEW" && (
          <div className="space-y-6">
            
            {/* DATADOG METRIC STRIP (4-Column High-Density Ribbon) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Metric 1 */}
              <div className="bg-[#101014] border border-white/[0.06] p-4 rounded-xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                    <Activity size={14} className="text-blue-400" /> Total Invocations
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center">
                    <TrendingUp size={12} className="mr-0.5" /> +14.2%
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-3xl font-bold tracking-tight text-white font-mono">
                    142,394
                  </p>
                  {/* Mini SVG sparkline */}
                  <svg className="w-16 h-6 text-blue-500/40" viewBox="0 0 60 20" fill="none">
                    <path d="M0 16 L10 14 L20 17 L30 11 L40 13 L50 7 L60 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-[11px] text-zinc-500 mt-2 font-mono">Last 24h across 50 hosts</p>
              </div>

              {/* Metric 2 */}
              <div className="bg-[#101014] border border-white/[0.06] p-4 rounded-xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                    <Lock size={14} className="text-red-400" /> Threats Blocked
                  </span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                    0.87% RATE
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-3xl font-bold tracking-tight text-red-400 font-mono">
                    1,243
                  </p>
                  <svg className="w-16 h-6 text-red-500/40" viewBox="0 0 60 20" fill="none">
                    <path d="M0 18 L15 15 L25 17 L35 8 L45 12 L55 3 L60 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-[11px] text-zinc-500 mt-2 font-mono">Malicious tool calls intercepted</p>
              </div>

              {/* Metric 3 */}
              <div className="bg-[#101014] border border-white/[0.06] p-4 rounded-xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                    <Zap size={14} className="text-purple-400" /> L7 Proxy Overhead
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    p99: 1.42ms
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-3xl font-bold tracking-tight text-white font-mono">
                    0.78 <span className="text-sm font-normal text-zinc-400">ms</span>
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                    ZERO LAG
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-2 font-mono">In-memory stdio stream intercept</p>
              </div>

              {/* Metric 4 */}
              <div className="bg-[#101014] border border-white/[0.06] p-4 rounded-xl relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-400" /> Active AI Fleet
                  </span>
                  <span className="text-[11px] font-mono text-blue-400">
                    Level 3 Package
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <p className="text-3xl font-bold tracking-tight text-white font-mono">
                    4 <span className="text-sm font-normal text-zinc-400">Agents</span>
                  </p>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
                    100% SECURED
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-2 font-mono">Claude, Cursor, Windsurf, Antigravity</p>
              </div>

            </div>

            {/* BENTO SECTION: LIVE TRAFFIC HISTOGRAM + THREAT QUARANTINE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left (2 cols): Datadog-style Traffic Waveform */}
              <div className="lg:col-span-2 bg-[#101014] border border-white/[0.06] rounded-xl p-5 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <BarChart3 size={16} className="text-blue-400" />
                      L7 Invocations &amp; Threat Intercept Histogram
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Real-time throughput inspected by Sevlex Zero-Trust engine</p>
                  </div>
                  
                  {/* Time Range Pills */}
                  <div className="flex items-center bg-[#0a0a0d] border border-white/[0.06] rounded-lg p-0.5 text-[11px] font-mono">
                    {["15m", "1h", "24h", "7d"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeRange(t)}
                        className={`px-2.5 py-1 rounded-md transition ${
                          timeRange === t ? "bg-zinc-800 text-white font-semibold shadow-xs" : "text-zinc-500 hover:text-zinc-300"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Visualizer Bar Histogram */}
                <div className="h-52 w-full flex items-end gap-1.5 pt-4 pb-2 px-2 border border-white/[0.04] rounded-lg bg-[#0c0c10] datadog-grid">
                  {[
                    { h: 35, b: false }, { h: 50, b: false }, { h: 65, b: false }, { h: 40, b: false },
                    { h: 75, b: false }, { h: 90, b: true },  { h: 60, b: false }, { h: 45, b: false },
                    { h: 70, b: false }, { h: 80, b: false }, { h: 55, b: false }, { h: 85, b: true },
                    { h: 65, b: false }, { h: 95, b: false }, { h: 70, b: false }, { h: 50, b: false },
                    { h: 60, b: false }, { h: 75, b: false }, { h: 85, b: false }, { h: 100, b: true },
                    { h: 68, b: false }, { h: 82, b: false }, { h: 74, b: false }, { h: 91, b: false }
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end items-center h-full group relative cursor-pointer">
                      <div 
                        style={{ height: `${bar.h}%` }}
                        className={`w-full rounded-t-xs transition-all group-hover:brightness-125 ${
                          bar.b 
                            ? "bg-gradient-to-t from-red-600 to-red-400" 
                            : "bg-gradient-to-t from-blue-600/80 to-blue-400"
                        }`}
                      />
                      {/* Tooltip on hover */}
                      <div className="absolute -top-7 hidden group-hover:flex items-center px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] text-white font-mono whitespace-nowrap z-20 shadow-md">
                        {bar.b ? "Threat Intercepted" : `${bar.h * 15} calls`}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-3 font-mono">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-blue-500"></span> Allowed Calls (99.1%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-red-500"></span> Blocked Injections (0.9%)</span>
                  </div>
                  <span>Sampling: 100% Packets Inspected</span>
                </div>
              </div>

              {/* Right (1 col): Live Threat Quarantine */}
              <div className="bg-[#101014] border border-white/[0.06] rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <AlertTriangle size={15} className="text-amber-400" />
                      SecOps Threat Quarantine
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                      3 CRITICAL
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-4">Autonomous agent violations blocked at L7:</p>

                  <div className="space-y-2.5">
                    {[
                      { 
                        title: "CVE-2025-53107: Prompt Injection", 
                        detail: "Malicious GitHub issue payload", 
                        time: "2m ago", 
                        user: "@meetp", 
                        sev: "CRIT" 
                      },
                      { 
                        title: "Unauthorized SQL Drop Intercepted", 
                        detail: "DROP TABLE users via postgres MCP", 
                        time: "14m ago", 
                        user: "@meetp", 
                        sev: "CRIT" 
                      },
                      { 
                        title: "Arbitrary Shell Execution Blocked", 
                        detail: "/bin/sh -c exfil_keys attempt", 
                        time: "1h ago", 
                        user: "@meetp", 
                        sev: "HIGH" 
                      },
                      { 
                        title: "Mass Knowledge Exfiltration", 
                        detail: "45 concurrent repo searches", 
                        time: "3h ago", 
                        user: "@meetp", 
                        sev: "MED" 
                      }
                    ].map((threat, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-[#0a0a0d] border border-white/[0.04] hover:border-zinc-700 transition">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-medium text-white truncate">{threat.title}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                            threat.sev === "CRIT" 
                              ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          }`}>
                            {threat.sev}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 font-mono">{threat.detail}</p>
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 mt-2 font-mono">
                          <span>{threat.user}</span>
                          <span>{threat.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setActiveTab("AUDIT")}
                  className="w-full mt-4 py-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white transition flex items-center justify-center gap-1.5"
                >
                  View All Forensic Receipts in Log Explorer <ArrowUpRight size={13} />
                </button>
              </div>

            </div>

            {/* ASSET INVENTORY & CONNECTED AI CLIENTS (SOC 2 CC6.1 TABLE) */}
            <div className="bg-[#101014] border border-white/[0.06] rounded-xl p-5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Laptop size={16} className="text-emerald-400" />
                    <h3 className="text-sm font-semibold text-white">
                      Enrolled Endpoints &amp; Shadow AI Governance
                    </h3>
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      SOC 2 CC6.1
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">Continuous deep packet inspection routing MCP clients through Sevlex Gateway</p>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Host: {fleetData?.host?.hostname || "Meet-Panchal"}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-purple-400">@{fleetData?.host?.user || "meetp"}</span>
                </div>
              </div>

              {/* 4 Shielded AI Clients Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {[
                  { name: "Claude Desktop", type: "Native Desktop App", status: "SHIELDED", icon: Laptop },
                  { name: "Claude Code CLI", type: "Terminal Coding Agent", status: "SHIELDED", icon: Terminal },
                  { name: "Cursor IDE", type: "AI Code Editor", status: "SHIELDED", icon: Code2 },
                  { name: "Google Antigravity", type: "Autonomous Agent IDE", status: "SHIELDED", icon: ShieldCheck }
                ].map((client, idx) => {
                  const IconComp = client.icon;
                  return (
                    <div key={idx} className="p-3.5 rounded-lg bg-[#0a0a0d] border border-white/[0.04] flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                            <IconComp size={14} className="text-blue-400" />
                            {client.name}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ● SHIELDED
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500">{client.type}</p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                        <span>L7 Intercept</span>
                        <span className="text-emerald-400">Auto-Heal Active</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Endpoint Device Specification Table */}
              <div className="overflow-x-auto rounded-lg border border-white/[0.04]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#0c0c10] border-b border-white/[0.04] text-zinc-500 uppercase font-mono text-[10px]">
                      <th className="py-2.5 px-4 font-medium">Endpoint Host</th>
                      <th className="py-2.5 px-4 font-medium">OS Architecture</th>
                      <th className="py-2.5 px-4 font-medium">Authenticated Identity</th>
                      <th className="py-2.5 px-4 font-medium">Tools In Scope</th>
                      <th className="py-2.5 px-4 font-medium">SIEM Stream</th>
                      <th className="py-2.5 px-4 font-medium text-right">Protection State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] font-mono text-zinc-300">
                    <tr className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {fleetData?.host?.hostname || "Meet-Panchal"}
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {fleetData?.host?.platform || "win32 (x64)"} • {fleetData?.host?.totalMemory || "16 GB"}
                      </td>
                      <td className="py-3 px-4 text-purple-400">
                        @{fleetData?.host?.user || "meetp"}
                      </td>
                      <td className="py-3 px-4 text-zinc-300">
                        {fleetData?.telemetry?.discoveredCount || 44} discovered ({blockedTools.length} banned)
                      </td>
                      <td className="py-3 px-4 text-emerald-400">
                        Datadog US5 (Synced)
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          100% Zero-Trust Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: VISUAL POLICY LIBRARY (L7 Rules)                                  */}
        {/* ========================================================================= */}
        {activeTab === "POLICY" && (
          <div className="bg-[#101014] border border-white/[0.06] rounded-xl p-5 shadow-xl">
            <div className="mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/[0.06] pb-4">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Sliders size={18} className="text-blue-400" />
                  Enterprise L7 Policy Engine
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Toggle allowed and blocked MCP tools across all connected corporate servers in real time.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search tools (e.g. drop_table)..."
                    value={policySearch}
                    onChange={(e) => {
                      setPolicySearch(e.target.value);
                      setExpandedServers({});
                    }}
                    className="w-full bg-[#0a0a0d] border border-white/[0.06] rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 outline-none font-mono focus:border-blue-500/50"
                  />
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
                  <div key={server.server} className="border border-white/[0.06] rounded-lg overflow-hidden bg-[#0c0c10]">
                    <button 
                      onClick={() => setExpandedServers(prev => ({ ...prev, [server.server]: !isExpanded }))}
                      className="w-full bg-[#121216] px-4 py-3 flex items-center justify-between hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-zinc-900 rounded-md border border-white/[0.06] flex items-center justify-center">
                          {getBrandIcon(server.server)}
                        </div>
                        <h3 className="font-medium text-xs text-zinc-200">
                          {server.server} 
                          <span className="text-zinc-500 text-[11px] font-mono ml-2">({filteredTools.length} tools)</span>
                        </h3>
                      </div>
                      {isExpanded ? <ChevronDown size={14} className="text-zinc-500" /> : <ChevronRight size={14} className="text-zinc-500" />}
                    </button>
                    
                    {isExpanded && (
                      <div className="divide-y divide-white/[0.04]">
                        {filteredTools.map((tool) => {
                          const isBlocked = blockedTools.includes(tool);
                          return (
                            <div key={tool} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition-colors group">
                              <div className="flex-1 flex items-center gap-3">
                                <p className="font-mono text-xs font-medium text-zinc-300 group-hover:text-blue-400 transition-colors">{tool}</p>
                                {isBlocked ? (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                                    BLOCKED
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                                    ALLOWED
                                  </span>
                                )}
                              </div>
                              <button 
                                onClick={() => toggleTool(tool)}
                                className="focus:outline-none ml-3 transition-transform active:scale-95"
                                title={isBlocked ? "Click to Allow" : "Click to Block"}
                              >
                                {isBlocked ? (
                                  <ToggleLeft size={26} className="text-red-500 hover:text-red-400 transition-colors" />
                                ) : (
                                  <ToggleRight size={26} className="text-emerald-500 hover:text-emerald-400 transition-colors" />
                                )}
                              </button>
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
        {/* TAB 2: DATADOG LOG EXPLORER (Audit Viewer + Facets)                       */}
        {/* ========================================================================= */}
        {activeTab === "AUDIT" && (
          <div className="bg-[#101014] border border-white/[0.06] rounded-xl overflow-hidden shadow-xl flex flex-col">
            
            {/* Top Toolbar */}
            <div className="p-4 border-b border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#121216] gap-3">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search logs by tool name, payload, or user..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-white/[0.06] rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 outline-none font-mono focus:border-blue-500/50"
                  />
                </div>

                {/* Status Facet Filter */}
                <div className="flex items-center bg-[#0a0a0d] border border-white/[0.06] rounded-lg p-0.5 text-xs font-mono">
                  <button 
                    onClick={() => setStatusFilter("ALL")}
                    className={`px-2.5 py-1 rounded transition ${statusFilter === "ALL" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-500"}`}
                  >
                    All ({logs.length})
                  </button>
                  <button 
                    onClick={() => setStatusFilter("ALLOWED")}
                    className={`px-2.5 py-1 rounded transition ${statusFilter === "ALLOWED" ? "bg-emerald-500/20 text-emerald-400 font-semibold" : "text-zinc-500"}`}
                  >
                    Allowed
                  </button>
                  <button 
                    onClick={() => setStatusFilter("BLOCKED")}
                    className={`px-2.5 py-1 rounded transition ${statusFilter === "BLOCKED" ? "bg-red-500/20 text-red-400 font-semibold" : "text-zinc-500"}`}
                  >
                    Blocked
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={exportLogsToCsv}
                  className="flex items-center gap-1.5 bg-white text-black px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-zinc-200 transition shadow-sm"
                >
                  <Download size={13} /> Export SOC-2 CSV
                </button>
              </div>
            </div>

            {/* Logs Table with JSON Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
              
              {/* Left (2 cols): Stream Table */}
              <div className="lg:col-span-2 overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-[#0d0d11] border-b border-white/[0.06] text-zinc-500 uppercase font-mono text-[10px] z-10">
                    <tr>
                      <th className="py-2.5 px-4 font-medium">Status</th>
                      <th className="py-2.5 px-4 font-medium">Timestamp</th>
                      <th className="py-2.5 px-4 font-medium">Identity</th>
                      <th className="py-2.5 px-4 font-medium">Tool Call</th>
                      <th className="py-2.5 px-4 font-medium">Preview</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] font-mono text-zinc-300">
                    {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                      <tr 
                        key={log.id} 
                        onClick={() => setSelectedLog(log)}
                        className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${
                          selectedLog?.id === log.id ? "bg-blue-500/10 border-l-2 border-blue-500" : ""
                        }`}
                      >
                        <td className="py-2.5 px-4">
                          {log.status === "BLOCKED" ? (
                            <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                              <ShieldAlert size={11} /> BLOCKED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                              <ShieldCheck size={11} /> ALLOWED
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-zinc-500 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                        <td className="py-2.5 px-4 text-purple-400">@{log.user_id || "meetp"}</td>
                        <td className="py-2.5 px-4 font-semibold text-white">{log.tool_name}</td>
                        <td className="py-2.5 px-4 text-zinc-500 truncate max-w-xs">{log.raw_request}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-zinc-500 text-xs font-mono">
                          No audit receipts found matching criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Right (1 col): Datadog-style JSON Inspector Drawer */}
              <div className="bg-[#0c0c10] p-4 flex flex-col justify-between max-h-[600px] overflow-y-auto">
                {selectedLog ? (
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                        <Eye size={13} className="text-blue-400" /> Event #{selectedLog.id} Detail
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        selectedLog.status === "BLOCKED" 
                          ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        {selectedLog.status}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs font-mono">
                      <div>
                        <span className="text-zinc-500 text-[10px] uppercase">Tool Name:</span>
                        <p className="text-white font-semibold">{selectedLog.tool_name}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[10px] uppercase">Authenticated Identity:</span>
                        <p className="text-purple-400">@{selectedLog.user_id || "meetp"}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[10px] uppercase">Timestamp:</span>
                        <p className="text-zinc-300">{selectedLog.timestamp}</p>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[10px] uppercase">Layer 7 Deep Packet Payload:</span>
                        <pre className="mt-1.5 p-3 rounded-lg bg-[#08080a] border border-white/[0.06] text-[11px] text-zinc-300 font-mono whitespace-pre-wrap break-all overflow-x-auto max-h-60">
                          {(() => {
                            try {
                              return JSON.stringify(JSON.parse(selectedLog.raw_request), null, 2);
                            } catch {
                              return selectedLog.raw_request;
                            }
                          })()}
                        </pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center text-zinc-500 text-xs font-mono flex flex-col items-center justify-center">
                    <Eye size={24} className="mb-2 opacity-40" />
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

        {/* Global Toast Notification */}
        {pingStatus && (
          <div className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#121216] border border-white/[0.1] rounded-xl text-xs font-mono text-zinc-200 shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            <span>{pingStatus}</span>
          </div>
        )}

      </main>
    </div>
  );
}
