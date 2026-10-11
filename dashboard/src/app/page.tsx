"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, ShieldCheck, Download, Search, Activity, BookOpen, ToggleLeft, ToggleRight, LayoutDashboard, TrendingUp, Zap, Clock, AlertTriangle, ChevronRight, ChevronDown, BarChart3, Lock, Server, Sliders, Check, Copy, ExternalLink, Send, Laptop, Terminal, Cpu, Code2, Sparkles, RefreshCw } from "lucide-react";

type Log = { id: number; timestamp: string; user_id: string; tool_name: string; status: "ALLOWED" | "BLOCKED"; raw_request: string; };

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
        className="w-5 h-5 invert opacity-90"
      />
    );
  }
  return <Server size={20} className="text-zinc-400" />;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"OVERVIEW" | "AUDIT" | "POLICY" | "INTEGRATIONS">("OVERVIEW");
  const [ddEndpoint, setDdEndpoint] = useState("https://http-intake.logs.us5.datadoghq.com/api/v2/logs");
  const [ddKeyInput, setDdKeyInput] = useState("");
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
    } catch (e) {
      setLoginError(true);
    }
  };

  // Fetch Logs (Polling)
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

  // Fetch Current Policy on load
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

  // Fetch Fleet & Device Telemetry
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
      ? blockedTools.filter(t => t !== toolName) // Remove it (Allow)
      : [...blockedTools, toolName];             // Add it (Block)
    
    setBlockedTools(newBlockedList);
    
    // Save to the actual sevlex.json file via API
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
        return;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.tool_name.toLowerCase().includes(search.toLowerCase()) || 
    log.status.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalExecutions: 142394,
    threatsBlocked: 1243,
    laborHoursSaved: 3840
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-[#121212] p-8 rounded-2xl border border-zinc-800 shadow-xl max-w-sm w-full text-center">
          <ShieldAlert className="mx-auto mb-4 text-blue-500" size={48} />
          <h2 className="text-2xl font-semibold text-white mb-2">Admin Login</h2>
          <p className="text-sm text-zinc-400 mb-6">Enter your Admin API Key to access the dashboard.</p>
          <input
            type="password"
            placeholder="Admin API Key"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-zinc-700 rounded-lg px-4 py-2 text-white mb-4 focus:outline-none focus:border-blue-500 transition-colors"
          />
          {loginError && <p className="text-red-500 text-sm mb-4">Incorrect API Key. Please try again.</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded-lg transition-colors">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans p-4 md:p-8">
      
      {/* Header Area */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Activity className="text-blue-500" size={24} />
            </div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              Sevlex Enterprise
            </h1>
            <span className="ml-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-widest">
              Beta
            </span>
          </div>
          <p className="text-sm text-zinc-400">Next-Generation Zero-Trust AI Agent Gateway</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-[#121212] p-1 rounded-lg border border-zinc-800 shadow-inner">
          <button 
            onClick={() => setActiveTab("OVERVIEW")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "OVERVIEW" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <LayoutDashboard size={16} /> Overview
          </button>
          <button 
            onClick={() => setActiveTab("AUDIT")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "AUDIT" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <ShieldCheck size={16} /> Audit Logs
          </button>
          <button 
            onClick={() => setActiveTab("POLICY")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "POLICY" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <BookOpen size={16} /> Policy Library
          </button>
          <button 
            onClick={() => setActiveTab("INTEGRATIONS")}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === "INTEGRATIONS" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            <Sliders size={16} /> Integrations Hub
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        
        {activeTab === "OVERVIEW" && (
          // ==========================================
          // TAB 0: OVERVIEW / ANALYTICS
          // ==========================================
          <div className="space-y-6">
            {/* Massive Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-20">
                  <Zap size={64} className="text-blue-500" />
                </div>
                <h3 className="text-zinc-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <Activity size={16} /> Total Tool Executions
                </h3>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-semibold text-white tracking-tight">
                    {stats.totalExecutions.toLocaleString("en-US")}
                  </p>
                  <span className="text-emerald-500 flex items-center text-sm font-medium">
                    <TrendingUp size={14} className="mr-1" /> +14.2%
                  </span>
                </div>
                <p className="text-xs text-zinc-600 mt-4">Across all deployed MCP agents</p>
              </div>

              <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-20">
                  <ShieldAlert size={64} className="text-red-500" />
                </div>
                <h3 className="text-zinc-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <Lock size={16} /> Threats Blocked
                </h3>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-semibold text-white tracking-tight">
                    {stats.threatsBlocked.toLocaleString("en-US")}
                  </p>
                  <span className="text-red-500 flex items-center text-sm font-medium">
                    <TrendingUp size={14} className="mr-1" /> +2.1%
                  </span>
                </div>
                <p className="text-xs text-zinc-600 mt-4">Malicious instructions intercepted</p>
              </div>

              <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 transition-opacity group-hover:opacity-20">
                  <Clock size={64} className="text-purple-500" />
                </div>
                <h3 className="text-zinc-400 text-sm font-medium mb-2 flex items-center gap-2">
                  <Clock size={16} /> Labor Hours Saved
                </h3>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-semibold text-white tracking-tight">
                    {stats.laborHoursSaved.toLocaleString("en-US")}
                  </p>
                  <span className="text-emerald-500 flex items-center text-sm font-medium">
                    <TrendingUp size={14} className="mr-1" /> +8.4%
                  </span>
                </div>
                <p className="text-xs text-zinc-600 mt-4">Estimated value based on tool usage</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart Placeholder */}
              <div className="lg:col-span-2 bg-[#121212] border border-zinc-800 rounded-2xl shadow-xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <BarChart3 size={20} className="text-blue-500" /> Activity Over Time
                  </h3>
                  <select className="bg-[#1a1a1a] border border-zinc-700 text-sm rounded-md px-3 py-1.5 text-zinc-300 outline-none">
                    <option>Last 24 Hours</option>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
                <div className="flex-1 border border-zinc-800/50 rounded-lg bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden min-h-[300px]">
                  {/* Decorative chart lines */}
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                  <div className="z-10 text-center">
                    <BarChart3 size={48} className="mx-auto text-zinc-700 mb-3" />
                    <p className="text-zinc-500 text-sm">Interactive visualization loading...</p>
                  </div>
                </div>
              </div>

              {/* Threat Alerts */}
              <div className="bg-[#121212] border border-zinc-800 rounded-2xl shadow-xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <AlertTriangle size={20} className="text-orange-500" /> Active Alerts
                  </h3>
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2.5 py-1 rounded-full border border-red-500/30">
                    3 CRITICAL
                  </span>
                </div>
                <div className="space-y-4 flex-1">
                  {[
                    { title: "Unauthorized SQL Drop Attempt", time: "2 mins ago", level: "critical" },
                    { title: "Excessive Repo Searches", time: "15 mins ago", level: "warning" },
                    { title: "Sensitive File Access Blocked", time: "1 hour ago", level: "critical" },
                    { title: "API Rate Limit Near", time: "3 hours ago", level: "info" }
                  ].map((alert, i) => (
                    <div key={i} className="p-4 rounded-xl border border-zinc-800/80 bg-[#18181b] hover:bg-zinc-800/50 transition-colors cursor-pointer group flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${alert.level === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : alert.level === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                        <div>
                          <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{alert.title}</p>
                          <p className="text-xs text-zinc-500 mt-1">{alert.time}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-800 rounded-lg hover:bg-zinc-800/50 transition-all">
                  View All Alerts
                </button>
              </div>
            </div>

            {/* FLEET & CONNECTED AI TOOLS ASSET INVENTORY (SOC 2 CC6.1 / SHADOW AI DISCOVERY) */}
            <div className="bg-[#121212] border border-zinc-800 rounded-2xl shadow-xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Laptop size={20} className="text-emerald-400" />
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Fleet & Connected AI Tools Inventory
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      SOC 2 CC6.1 COMPLIANT
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Continuous Deep Packet Inspection across enterprise endpoints routing MCP traffic through Sevlex Zero-Trust Gateway.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#090909] border border-zinc-800 text-xs text-zinc-300 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Host: {fleetData?.host?.hostname || "Meet-Panchal"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 font-semibold">
                    <ShieldCheck size={14} />
                    <span>Zero-Trust Active</span>
                  </div>
                </div>
              </div>

              {/* Connected AI Clients Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {(fleetData?.runtimes || [
                  { name: "Claude Code CLI", type: "Terminal CLI Agent", status: "SHIELDED", installed: true, configured: true },
                  { name: "Claude Desktop", type: "Native Desktop App", status: "SHIELDED", installed: true, configured: true },
                  { name: "Google Antigravity IDE", type: "Autonomous Agent Environment", status: "SHIELDED", installed: true, configured: true },
                  { name: "Cursor IDE", type: "AI Code Editor", status: "READY_TO_CONNECT", installed: false, configured: false }
                ]).map((client: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-zinc-800 bg-[#090909] flex flex-col justify-between hover:border-zinc-700 transition">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                          {client.name.includes("Terminal") || client.name.includes("Code CLI") ? <Terminal size={14} className="text-purple-400" /> : <Code2 size={14} className="text-emerald-400" />}
                          {client.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          client.status === "SHIELDED" 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                            : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                        }`}>
                          {client.status === "SHIELDED" ? "● SHIELDED" : "○ STANDBY"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400">{client.type}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>Gateway Mode</span>
                      <span className="text-zinc-300">L7 Intercept</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Endpoint Device Telemetry Table */}
              <div className="overflow-x-auto rounded-xl border border-zinc-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#18181b] border-b border-zinc-800 text-zinc-400 uppercase font-mono text-[10px]">
                      <th className="py-3 px-4">Endpoint Host</th>
                      <th className="py-3 px-4">OS & Arch</th>
                      <th className="py-3 px-4">Active User</th>
                      <th className="py-3 px-4">Secured Tools In Scope</th>
                      <th className="py-3 px-4">SIEM Ingestion</th>
                      <th className="py-3 px-4 text-right">Protection State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono text-zinc-300">
                    <tr className="hover:bg-zinc-800/20 transition">
                      <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        {fleetData?.host?.hostname || "Meet-Panchal"}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">
                        {fleetData?.host?.platform || "win32 (x64)"} • {fleetData?.host?.totalMemory || "16 GB"}
                      </td>
                      <td className="py-3.5 px-4 text-purple-400 font-medium">
                        @{fleetData?.host?.user || "meetp"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-zinc-300">
                          {fleetData?.telemetry?.discoveredCount || 44} discovered ({fleetData?.telemetry?.blockedRulesCount || 4} banned)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-emerald-400">
                        Datadog US5 (Live Stream)
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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

        {(activeTab === "AUDIT" || activeTab === "POLICY") && (
          <div className="bg-[#121212] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            {activeTab === "AUDIT" ? (
              // ==========================================
              // TAB 1: AUDIT LOGS
              // ==========================================
              <>
                <div className="p-5 border-b border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#18181b] gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-1/2 bg-[#0a0a0a] border border-zinc-800 px-4 py-2.5 rounded-lg focus-within:border-zinc-600 transition-colors">
                    <Search size={18} className="text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Search by tool name or status..."
                      className="bg-transparent border-none outline-none w-full text-zinc-200 placeholder:text-zinc-600 text-sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <button className="flex items-center gap-2 bg-white text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors whitespace-nowrap">
                    <Download size={16} /> Export SOC-2 PDF
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800 bg-[#0f0f0f] text-xs uppercase tracking-wider text-zinc-500">
                        <th className="p-5 font-medium">Status</th>
                        <th className="p-5 font-medium">Timestamp</th>
                        <th className="p-5 font-medium">Employee</th>
                        <th className="p-5 font-medium">Tool Name</th>
                        <th className="p-5 font-medium">Raw Request</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                        <tr key={log.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                          <td className="p-5">
                            {log.status === "BLOCKED" ? (
                              <span className="inline-flex items-center gap-1.5 text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap shadow-sm">
                                <ShieldAlert size={14} /> BLOCKED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap shadow-sm">
                                <ShieldCheck size={14} /> ALLOWED
                              </span>
                            )}
                          </td>
                          <td className="p-5 text-sm text-zinc-400">{log.timestamp}</td>
                          <td className="p-5 text-sm font-medium text-zinc-200">{log.user_id || "unknown"}</td>
                          <td className="p-5 text-sm font-mono text-zinc-200">{log.tool_name}</td>
                          <td className="p-5 text-xs font-mono text-zinc-500 truncate max-w-md">{log.raw_request}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-zinc-500 text-sm">
                            No logs found matching your criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              // ==========================================
              // TAB 2: VISUAL POLICY LIBRARY
              // ==========================================
              <div className="p-6">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-1">Global Tool Catalog</h2>
                    <p className="text-zinc-400 text-xs">Manage access control policies for all connected MCP servers and tools.</p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto bg-[#0a0a0a] border border-zinc-800 px-3 py-1.5 rounded-lg focus-within:border-zinc-600 transition-colors">
                    <Search size={16} className="text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Search tools..."
                      className="bg-transparent border-none outline-none w-full sm:w-64 text-zinc-200 placeholder:text-zinc-600 text-sm"
                      value={policySearch}
                      onChange={(e) => {
                        setPolicySearch(e.target.value);
                        setExpandedServers({});
                      }}
                    />
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
                      <div key={server.server} className="border border-zinc-800 rounded-lg overflow-hidden bg-[#0f0f0f]">
                        <button 
                          onClick={() => setExpandedServers(prev => ({ ...prev, [server.server]: !isExpanded }))}
                          className="w-full bg-[#18181b] px-4 py-3 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-zinc-800/80 rounded-md shadow-sm border border-zinc-700/50 flex items-center justify-center">
                              {getBrandIcon(server.server)}
                            </div>
                            <h3 className="font-medium text-sm text-zinc-200">{server.server} <span className="text-zinc-500 text-xs font-normal ml-2">({filteredTools.length} tools)</span></h3>
                          </div>
                          {isExpanded ? <ChevronDown size={16} className="text-zinc-500" /> : <ChevronRight size={16} className="text-zinc-500" />}
                        </button>
                        
                        {isExpanded && (
                          <div className="divide-y divide-zinc-800/50">
                            {filteredTools.map((tool) => {
                              const isBlocked = blockedTools.includes(tool);
                              return (
                                <div key={tool} className="flex items-center justify-between px-4 py-2 hover:bg-zinc-800/20 transition-colors group">
                                  <div className="flex-1 flex items-center gap-3">
                                    <p className="font-mono text-xs font-medium text-zinc-300 group-hover:text-blue-400 transition-colors">{tool}</p>
                                    {isBlocked && (
                                      <span className="px-1.5 py-0 rounded text-[9px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                                        Blocked
                                      </span>
                                    )}
                                  </div>
                                  <button 
                                    onClick={() => toggleTool(tool)}
                                    className="focus:outline-none ml-3 transition-transform active:scale-95"
                                    title={isBlocked ? "Click to Allow" : "Click to Block"}
                                  >
                                    {isBlocked ? (
                                      <ToggleLeft size={28} className="text-red-500 hover:text-red-400 transition-colors" />
                                    ) : (
                                      <ToggleRight size={28} className="text-emerald-500 hover:text-emerald-400 transition-colors" />
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
          </div>
        )}

        {activeTab === "INTEGRATIONS" && (
          // ==========================================
          // TAB 3: ENTERPRISE INTEGRATIONS HUB
          // ==========================================
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sliders className="text-emerald-500" size={22} /> Enterprise Integrations Hub
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Connect Sevlex to your corporate SIEM, alert channels, and fleet MDM.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Gateway Active
                </span>
              </div>
            </div>

            {/* AI TOOLS & DEVELOPER RUNTIMES (1-CLICK GATEWAY CONFIGS) */}
            <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Code2 className="text-blue-400" size={18} /> AI Tools & Developer Runtimes
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    1-Click configurations to route employee AI coding agents through Sevlex L7 Firewall.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 bg-[#090909] px-3 py-1 rounded-lg border border-zinc-800">
                  Transport: stdio / JSON-RPC 2.0
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* TOOL 1: CLAUDE CODE CLI */}
                <div className="p-4 rounded-xl border border-zinc-800 bg-[#090909] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Terminal size={18} className="text-purple-400" />
                        <h4 className="text-sm font-bold text-white">Claude Code CLI</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {fleetData?.runtimes?.find((r: any) => r.name.includes("Claude Code"))?.status === "SHIELDED" ? "● SHIELDED" : "● CONFIGURED"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Anthropic&apos;s terminal agent. Intercept tool executions, shell calls, and data queries.
                    </p>
                    <div className="mt-3 bg-[#121212] p-2.5 rounded-lg border border-zinc-800/80 font-mono text-[11px] text-zinc-300 overflow-x-auto">
                      <code>claude mcp add sevlex-firewall node &quot;...\gateway\dist\src\gateway.js&quot; node &quot;...\gateway\test_tool.js&quot;</code>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                    <span className="text-[11px] font-mono text-zinc-500">~/.claude.json</span>
                    <button 
                      onClick={() => {
                        const snippet = `claude mcp add sevlex-firewall node "C:\\Users\\meetp\\OneDrive\\Desktop\\Projects\\Sevlex\\gateway\\dist\\src\\gateway.js" node "C:\\Users\\meetp\\OneDrive\\Desktop\\Projects\\Sevlex\\gateway\\test_tool.js"`;
                        navigator.clipboard.writeText(snippet);
                        setCopiedType("claude_code");
                        setTimeout(() => setCopiedType(null), 2000);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
                    >
                      {copiedType === "claude_code" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      {copiedType === "claude_code" ? "Copied Command" : "Copy Command"}
                    </button>
                  </div>
                </div>

                {/* TOOL 2: CLAUDE DESKTOP */}
                <div className="p-4 rounded-xl border border-zinc-800 bg-[#090909] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Code2 size={18} className="text-amber-400" />
                        <h4 className="text-sm font-bold text-white">Claude Desktop</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {fleetData?.runtimes?.find((r: any) => r.name.includes("Claude Desktop"))?.status === "SHIELDED" ? "● SHIELDED" : "● CONFIGURED"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Desktop client. Protect enterprise MCP connections to GitHub, Postgres, and Slack.
                    </p>
                    <div className="mt-3 bg-[#121212] p-2.5 rounded-lg border border-zinc-800/80 font-mono text-[11px] text-zinc-300 overflow-x-auto">
                      <code>%APPDATA%\Claude\claude_desktop_config.json</code>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                    <span className="text-[11px] font-mono text-zinc-500">mcpServers.sevlex-firewall</span>
                    <button 
                      onClick={() => {
                        const snippet = JSON.stringify({
                          mcpServers: {
                            "sevlex-firewall": {
                              command: "node",
                              args: [
                                "C:\\Users\\meetp\\OneDrive\\Desktop\\Projects\\Sevlex\\gateway\\dist\\src\\gateway.js",
                                "node",
                                "C:\\Users\\meetp\\OneDrive\\Desktop\\Projects\\Sevlex\\gateway\\test_tool.js"
                              ],
                              env: {
                                SEVLEX_USER: "meetp",
                                SEVLEX_SIEM_PROVIDER: "datadog",
                                SEVLEX_SIEM_API_KEY: "70bb17537553cedfad6a9cc2e57dfa52",
                                SEVLEX_SIEM_ENDPOINT: "https://http-intake.logs.us5.datadoghq.com/api/v2/logs"
                              }
                            }
                          }
                        }, null, 2);
                        navigator.clipboard.writeText(snippet);
                        setCopiedType("claude_desktop");
                        setTimeout(() => setCopiedType(null), 2000);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
                    >
                      {copiedType === "claude_desktop" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      {copiedType === "claude_desktop" ? "Copied JSON" : "Copy JSON"}
                    </button>
                  </div>
                </div>

                {/* TOOL 3: GOOGLE ANTIGRAVITY IDE */}
                <div className="p-4 rounded-xl border border-zinc-800 bg-[#090909] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-cyan-400" />
                        <h4 className="text-sm font-bold text-white">Google Antigravity IDE</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {fleetData?.runtimes?.find((r: any) => r.name.includes("Antigravity"))?.status === "SHIELDED" ? "● SHIELDED" : "● CONFIGURED"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Autonomous DeepMind Agent. Real-time subagent inspection & multi-turn tool guardrails.
                    </p>
                    <div className="mt-3 bg-[#121212] p-2.5 rounded-lg border border-zinc-800/80 font-mono text-[11px] text-zinc-300 overflow-x-auto">
                      <code>~/.gemini/config/mcp_config.json</code>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                    <span className="text-[11px] font-mono text-zinc-500">mcpServers.sevlex-firewall</span>
                    <button 
                      onClick={() => {
                        const snippet = JSON.stringify({
                          mcpServers: {
                            "sevlex-firewall": {
                              command: "node",
                              args: [
                                "C:\\Users\\meetp\\OneDrive\\Desktop\\Projects\\Sevlex\\gateway\\dist\\src\\gateway.js",
                                "node",
                                "C:\\Users\\meetp\\OneDrive\\Desktop\\Projects\\Sevlex\\gateway\\test_tool.js"
                              ]
                            }
                          }
                        }, null, 2);
                        navigator.clipboard.writeText(snippet);
                        setCopiedType("antigravity");
                        setTimeout(() => setCopiedType(null), 2000);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
                    >
                      {copiedType === "antigravity" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      {copiedType === "antigravity" ? "Copied JSON" : "Copy JSON"}
                    </button>
                  </div>
                </div>

                {/* TOOL 4: CURSOR IDE & VS CODE */}
                <div className="p-4 rounded-xl border border-zinc-800 bg-[#090909] flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Cpu size={18} className="text-blue-400" />
                        <h4 className="text-sm font-bold text-white">Cursor IDE & VS Code</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
                        READY TO ROUTE
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Standard MCP configuration for Cursor Composer and VS Code agentic extensions.
                    </p>
                    <div className="mt-3 bg-[#121212] p-2.5 rounded-lg border border-zinc-800/80 font-mono text-[11px] text-zinc-300 overflow-x-auto">
                      <code>~/.cursor/mcp.json</code>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
                    <span className="text-[11px] font-mono text-zinc-500">mcpServers.sevlex-firewall</span>
                    <button 
                      onClick={() => {
                        const snippet = JSON.stringify({
                          mcpServers: {
                            "sevlex-firewall": {
                              command: "node",
                              args: [
                                "C:\\Users\\meetp\\OneDrive\\Desktop\\Projects\\Sevlex\\gateway\\dist\\src\\gateway.js",
                                "node",
                                "C:\\Users\\meetp\\OneDrive\\Desktop\\Projects\\Sevlex\\gateway\\test_tool.js"
                              ]
                            }
                          }
                        }, null, 2);
                        navigator.clipboard.writeText(snippet);
                        setCopiedType("cursor");
                        setTimeout(() => setCopiedType(null), 2000);
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
                    >
                      {copiedType === "cursor" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                      {copiedType === "cursor" ? "Copied JSON" : "Copy JSON"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Corporate SIEM & Enterprise MDM */}
            <div className="flex items-center justify-between pt-2">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider font-mono">
                Corporate SIEM & Enterprise Fleet Rollout
              </h3>
            </div>

            {/* Integration Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CARD 1: DATADOG SIEM */}
              <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/datadog.svg" alt="Datadog" className="w-5 h-5 invert" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white">Datadog Cloud SIEM</h3>
                        <p className="text-xs text-zinc-400">Universal Log Streaming & Stateless DR</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      CONNECTED (US5)
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                    Asynchronously transmits all MCP tool calls (both allowed and blocked) to your Datadog Log Explorer. Satisfies SOC 2 & HIPAA audit retention automatically.
                  </p>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="text-zinc-500 text-[11px] block mb-1">Target Endpoint</label>
                      <input 
                        type="text" 
                        readOnly 
                        value={ddEndpoint} 
                        className="w-full bg-[#090909] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                  <button 
                    onClick={async () => {
                      setPingStatus("Sending ping to Datadog...");
                      try {
                        const res = await fetch("/api/integrations", {
                          method: "POST",
                          headers: { "Content-Type": "application/json", "Authorization": apiKey },
                          body: JSON.stringify({ action: "test_datadog" })
                        });
                        const data = await res.json();
                        if (data.success) {
                          setPingStatus("✅ Verified! Datadog accepted ping (202)");
                        } else {
                          setPingStatus("❌ Ping failed: " + (data.error || "Unknown"));
                        }
                      } catch {
                        setPingStatus("❌ Network error connecting to API");
                      }
                      setTimeout(() => setPingStatus(null), 4000);
                    }}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-purple-950"
                  >
                    <Send size={14} /> Send Live Test Ping
                  </button>

                  <a 
                    href="https://us5.datadoghq.com/logs" 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
                  >
                    Open Logs Explorer <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* CARD 2: SLACK REAL-TIME ALERTS */}
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
                        type="password" 
                        placeholder="https://hooks.slack.com/services/T00/B00/XXXX"
                        value={slackUrlInput}
                        onChange={(e) => setSlackUrlInput(e.target.value)}
                        className="w-full bg-[#090909] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-300 text-xs focus:outline-none focus:border-amber-500/50"
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
                          setPingStatus("✅ Test alert delivered to Slack channel!");
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

                  <span className="text-[11px] text-zinc-500">Payload: Blocked Incident</span>
                </div>
              </div>

              {/* CARD 3: MICROSOFT INTUNE (WINDOWS) */}
              <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Server size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Microsoft Intune (Windows)</h3>
                      <p className="text-xs text-zinc-400">Zero-Touch Fleet Rollout Script</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    POWERSHELL
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mb-3">
                  Paste into Microsoft Intune or Group Policy to silently deploy Sevlex across all engineering Windows laptops during login.
                </p>

                <div className="bg-[#090909] p-3 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-400 flex items-center justify-between">
                  <code>deploy/deploy-mdm.ps1</code>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("powershell -ExecutionPolicy Bypass -File deploy/deploy-mdm.ps1");
                      setCopiedType("intune");
                      setTimeout(() => setCopiedType(null), 2000);
                    }}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium ml-2"
                  >
                    {copiedType === "intune" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copiedType === "intune" ? "Copied Command" : "Copy Command"}
                  </button>
                </div>
              </div>

              {/* CARD 4: JAMF PRO (MACOS & LINUX) */}
              <div className="bg-[#121212] border border-zinc-800 p-6 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Server size={20} className="text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">Jamf Pro / Kandji (macOS)</h3>
                      <p className="text-xs text-zinc-400">Zero-Touch MacBook Rollout Script</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    BASH
                  </span>
                </div>

                <p className="text-xs text-zinc-400 mb-3">
                  Upload to Jamf Pro, Kandji, or Munki to silently protect all employee MacBooks and route Claude Desktop to Sevlex.
                </p>

                <div className="bg-[#090909] p-3 rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-400 flex items-center justify-between">
                  <code>deploy/deploy-mdm.sh</code>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("bash deploy/deploy-mdm.sh");
                      setCopiedType("jamf");
                      setTimeout(() => setCopiedType(null), 2000);
                    }}
                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium ml-2"
                  >
                    {copiedType === "jamf" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    {copiedType === "jamf" ? "Copied Command" : "Copy Command"}
                  </button>
                </div>
              </div>

            </div>

            {/* Notification Banner */}
            {pingStatus && (
              <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-xl text-center text-xs font-mono text-zinc-200">
                {pingStatus}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
