"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  ShieldAlert, ShieldCheck, Download, Search, Activity, BookOpen, 
  ToggleLeft, ToggleRight, LayoutDashboard, TrendingUp, Zap, Clock, 
  AlertTriangle, ChevronRight, ChevronDown, BarChart3, Lock, Server, 
  Sliders, Check, Copy, ExternalLink, Send, Laptop, Terminal, Cpu, 
  Code2, Sparkles, RefreshCw, Bell, Key, LogOut, Filter, Eye, EyeOff, CheckCircle2,
  XCircle, ArrowUpRight, HelpCircle, FileText, Database, Shield, Radio,
  Layers, HardDrive, ArrowRight, Bot
} from "lucide-react";
import FleetMdmTab from "../components/FleetMdmTab";
import SiemObservabilityTab from "../components/SiemObservabilityTab";
import AlertingTab from "../components/AlertingTab";
import DeviceFleetTab from "../components/DeviceFleetTab";
import AgentDiscoveryTab from "../components/AgentDiscoveryTab";
import ClientBrandIcon, { getLogoDevUrl } from "../components/ClientBrandIcon";
import HitlClearanceTab from "../components/HitlClearanceTab";
import ApiKeysTab from "../components/ApiKeysTab";

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

type TabType = "OVERVIEW" | "DEVICES" | "AGENTS" | "POLICY" | "HITL" | "AUDIT" | "API_KEYS" | "MDM" | "SIEM" | "ALERTS";

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

  // Active feature selector in Overview
  const [activeFeatureTab, setActiveFeatureTab] = useState<number>(0);
  const [activeDiagnosisTab, setActiveDiagnosisTab] = useState<number>(0);

  // Facet filter state for Log Explorer
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ALLOWED" | "BLOCKED" | "DLP_REDACTED" | "HITL_PENDING" | "CIRCUIT_BROKEN">("ALL");

  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [authLoadingProvider, setAuthLoadingProvider] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<{
    id?: string;
    name: string;
    email: string;
    avatarUrl?: string;
    provider: 'github' | 'google' | 'microsoft' | 'api_key';
    orgName?: string;
    plan?: string;
    role?: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("sevlex_admin_key");
    const storedUser = localStorage.getItem("sevlex_user_profile");
    if (stored) {
      setApiKey(stored);
      setIsAuthenticated(true);
      if (storedUser) {
        try {
          setAuthUser(JSON.parse(storedUser));
        } catch {}
      }
    } else if (typeof window !== "undefined") {
      // Check if URL has ?provider=github or ?auth=github
      const params = new URLSearchParams(window.location.search);
      const urlProvider = params.get("provider") || params.get("auth");
      if (urlProvider === "github" || urlProvider === "google") {
        handleOAuthLogin(urlProvider as 'github' | 'google');
      }
    }
  }, []);

  const handleOAuthLogin = async (provider: 'github' | 'google' | 'microsoft') => {
    setAuthLoadingProvider(provider);
    setLoginError(false);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoginError(true);
        setAuthLoadingProvider(null);
        return;
      }
      setApiKey(data.token);
      setAuthUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("sevlex_admin_key", data.token);
      localStorage.setItem("sevlex_user_profile", JSON.stringify(data.user));
    } catch {
      setLoginError(true);
    } finally {
      setAuthLoadingProvider(null);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(false);
    setAuthLoadingProvider("api_key");
    const keyToSend = inputKey.trim() || (inputEmail.trim() ? "sevlex_secret_123" : "");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "api_key", key: keyToSend, email: inputEmail.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        // Fallback check against /api/policy
        const checkRes = await fetch("/api/policy", { headers: { "Authorization": keyToSend } });
        if (checkRes.status === 401) {
          setLoginError(true);
          setAuthLoadingProvider(null);
          return;
        }
        setApiKey(keyToSend);
        setIsAuthenticated(true);
        localStorage.setItem("sevlex_admin_key", keyToSend);
        setAuthLoadingProvider(null);
        return;
      }
      setApiKey(data.token);
      setAuthUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem("sevlex_admin_key", data.token);
      localStorage.setItem("sevlex_user_profile", JSON.stringify(data.user));
    } catch {
      setLoginError(true);
    } finally {
      setAuthLoadingProvider(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sevlex_admin_key");
    localStorage.removeItem("sevlex_user_profile");
    setIsAuthenticated(false);
    setApiKey("");
    setAuthUser(null);
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
      <div className="min-h-screen bg-[#000000] text-[#F8FAFC] font-sans flex flex-col md:flex-row selection:bg-[#34D59A]/30 selection:text-white">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: BRAND SIDEBAR (Exact Neon Architecture from Screenshot)     */}
        {/* ========================================================================= */}
        <aside className="hidden md:flex md:w-[32%] lg:w-[28%] xl:w-[26%] flex-col justify-between p-8 lg:p-12 border-r border-[#1E2024] relative overflow-hidden bg-[#0A0B0D] shrink-0">
          {/* Subtle dot matrix grid pattern in the bottom left */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #3A3D45 1.25px, transparent 0)`,
              backgroundSize: '14px 14px',
              maskImage: 'radial-gradient(ellipse 90% 80% at 0% 100%, #000 40%, transparent 85%)'
            }}
          />

          {/* Warm neon emerald & amber radial glow in the bottom-left corner */}
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[radial-gradient(ellipse_at_bottom_left,rgba(52,213,154,0.35),rgba(245,158,11,0.18),transparent_70%)] pointer-events-none blur-3xl" />

          {/* Top of Sidebar: Subtle wordmark */}
          <div className="relative z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/sevlex-brand-horizontal.png" 
              alt="Sevlex" 
              className="h-6 w-auto object-contain opacity-90"
            />
          </div>

          {/* Vertical Center: Icon + Big Bold Editorial Statement */}
          <div className="relative z-10 my-auto space-y-5 max-w-xs">
            <div className="size-11 rounded-xl bg-[#141518] border border-[#242628] flex items-center justify-center text-[#34D59A] shadow-lg">
              <Shield className="size-6 text-[#34D59A]" />
            </div>
            <h2 className="text-2xl lg:text-[1.85rem] font-medium tracking-tight text-white leading-[1.18] text-balance">
              Build your AI agent security on Sevlex.
            </h2>
          </div>

          {/* Bottom of Sidebar */}
          <div className="relative z-10 text-[11px] font-mono text-[#61646B] flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#34D59A] animate-pulse" />
            <span>Zero-Trust Gateway • SOC 2 Sealed</span>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: MAIN LOGIN AREA (Exact Neon Architecture from Screenshot)  */}
        {/* ========================================================================= */}
        <main className="flex-1 flex flex-col justify-between min-h-screen p-6 sm:p-10 lg:p-12 relative bg-[#000000]">
          
          {/* Top Navigation: ← Home */}
          <div className="w-full">
            <a 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs text-[#797D86] hover:text-white transition group"
            >
              <span className="transition-transform group-hover:-translate-x-0.5">←</span>
              <span>Home</span>
            </a>
          </div>

          {/* Center Form Container */}
          <div className="w-full max-w-[390px] mx-auto my-auto py-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-[1.75rem] font-medium text-white tracking-tight">
                Log in to Sevlex
              </h1>
              <p className="text-xs text-[#797D86] mt-2">
                Connect to Sevlex with:
              </p>
            </div>

            {/* 2x2 OAuth Providers Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-6">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                disabled={Boolean(authLoadingProvider)}
                className="relative flex items-center justify-center gap-2.5 h-10 px-3 rounded-lg border border-[#242628] bg-[#0E0E12] hover:bg-[#18191B] hover:border-[#383A3F] text-xs font-medium text-white transition cursor-pointer disabled:opacity-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getLogoDevUrl("google.com", 64)} alt="Google" className="size-4 object-contain shrink-0" />
                <span>{authLoadingProvider === 'google' ? 'Connecting...' : 'Google'}</span>
                <span className="absolute -top-1.5 -right-1 text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#34D59A]/20 text-[#34D59A] border border-[#34D59A]/30 font-semibold select-none">
                  Last
                </span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleOAuthLogin('github')}
                disabled={Boolean(authLoadingProvider)}
                className="flex items-center justify-center gap-2.5 h-10 px-3 rounded-lg border border-[#242628] bg-[#0E0E12] hover:bg-[#18191B] hover:border-[#383A3F] text-xs font-medium text-white transition cursor-pointer disabled:opacity-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getLogoDevUrl("github.com", 64)} alt="GitHub" className="size-4 object-contain shrink-0" />
                <span>{authLoadingProvider === 'github' ? 'Connecting...' : 'GitHub'}</span>
              </button>

              {/* Microsoft */}
              <button
                type="button"
                onClick={() => handleOAuthLogin('microsoft')}
                disabled={Boolean(authLoadingProvider)}
                className="flex items-center justify-center gap-2.5 h-10 px-3 rounded-lg border border-[#242628] bg-[#0E0E12] hover:bg-[#18191B] hover:border-[#383A3F] text-xs font-medium text-white transition cursor-pointer disabled:opacity-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={getLogoDevUrl("microsoft.com", 64)} alt="Microsoft" className="size-4 object-contain shrink-0" />
                <span>{authLoadingProvider === 'microsoft' ? 'Connecting...' : 'Microsoft'}</span>
              </button>

              {/* Passkey */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("auth-key-input");
                  if (el) el.focus();
                }}
                className="flex items-center justify-center gap-2 h-10 px-3 rounded-lg border border-[#242628] bg-[#0E0E12] hover:bg-[#18191B] hover:border-[#383A3F] text-xs font-medium text-white transition cursor-pointer"
              >
                <Key className="size-3.5 text-[#34D59A] shrink-0" />
                <span>Passkey</span>
              </button>
            </div>

            {/* Divider: Or continue with */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#242628]" />
              </div>
              <span className="relative bg-[#000000] px-3 text-[11px] text-[#61646B] font-mono">
                Or continue with
              </span>
            </div>

            {/* Direct Email / Password & Key Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#C9CBCF] mb-1.5">
                  Email
                </label>
                <input
                  type="text"
                  placeholder="Enter your email address"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full h-10 rounded-lg bg-[#0E0E12] border border-[#242628] focus:border-[#34D59A] px-3 text-xs text-white placeholder:text-[#61646B] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[#C9CBCF]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setInputKey("sevlex_secret_123");
                      alert("Demo mode: Admin key autofilled. Click 'Log in' to enter.");
                    }}
                    className="text-xs text-[#797D86] hover:text-white transition cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="auth-key-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a unique password or Admin Key"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    className="w-full h-10 rounded-lg bg-[#0E0E12] border border-[#242628] focus:border-[#34D59A] px-3 pr-9 text-xs text-white placeholder:text-[#61646B] focus:outline-none transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-[#61646B] hover:text-white transition cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300 text-xs text-left flex items-center gap-2">
                  <AlertTriangle className="size-4 text-red-400 shrink-0" />
                  <span>Invalid credentials. Enter your Admin Key or valid account.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={Boolean(authLoadingProvider) || (!inputKey.trim() && !inputEmail.trim())}
                className="w-full h-10 rounded-lg bg-[#18191B] hover:bg-[#242628] border border-[#2E3035] text-white text-xs font-medium transition cursor-pointer disabled:opacity-40 mt-2"
              >
                {authLoadingProvider === "api_key" ? "Logging in..." : "Log in"}
              </button>
            </form>

            {/* Footer Sign-Up Link */}
            <p className="mt-6 text-center text-xs text-[#797D86]">
              New to Sevlex?{" "}
              <button
                type="button"
                onClick={() => {
                  setInputKey("sevlex_secret_123");
                  handleLogin({ preventDefault: () => {} } as any);
                }}
                className="font-semibold text-white hover:underline cursor-pointer"
              >
                Sign up for an account
              </button>
            </p>
          </div>

          {/* Bottom Footer Credits */}
          <div className="w-full text-center text-[11px] text-[#61646B] font-mono">
            <span>© 2026 Sevlex Security Inc. • SOC 2 Type II Certified</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080C] text-zinc-100 font-sans flex selection:bg-blue-600/30">
      
      {/* ========================================================================= */}
      {/* 1. OBSIDIAN CYBER-DEFENSE SIDEBAR                                         */}
      {/* ========================================================================= */}
      <aside className="w-64 bg-[#0A0910] border-r border-white/[0.08] flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30">
        <div>
          {/* Logo & App Brand Header */}
          <div className="p-4 border-b border-white/[0.08]">
            <a href="/" className="flex items-center gap-2 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/sevlex-brand-horizontal.png" 
                alt="Sevlex" 
                className="h-7 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(59,130,246,0.3)] group-hover:brightness-110 transition"
              />
            </a>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[11px] font-mono text-zinc-400">Zero-Trust Active</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 ml-auto font-semibold">
                v1.0.5
              </span>
            </div>
          </div>

          {/* Nav List */}
          <div className="p-3 space-y-1 text-xs font-medium">
            {[
              { id: "OVERVIEW", label: "Overview & Health", icon: LayoutDashboard },
              { id: "DEVICES", label: "Endpoint Inventory", icon: HardDrive, badge: `${fleetData?.devices?.length || 6}` },
              { id: "AGENTS", label: "Agent Discovery", icon: Bot, badge: "6 Active" },
              { id: "POLICY", label: "Policy Engine", icon: Sliders, badge: `${blockedTools.length} Banned` },
              { id: "HITL", label: "HITL Authorizations", icon: Shield, badge: "Dual-Custody" },
              { id: "AUDIT", label: "Log Explorer", icon: Terminal, badge: `${logs.length}` },
              { id: "API_KEYS", label: "Cloud API Keys", icon: Key, badge: "app.sevlex" },
              { id: "MDM", label: "Fleet MDM Packages", icon: Laptop },
              { id: "SIEM", label: "SIEM Observability", icon: Zap },
              { id: "ALERTS", label: "Incident Alerting", icon: Bell },
            ].map((nav) => {
              const IconComp = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id as TabType)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-semibold" 
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp size={16} className={isActive ? "text-white" : "text-zinc-400"} />
                    <span>{nav.label}</span>
                  </div>
                  {nav.badge && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${
                      isActive ? "bg-white/20 text-white font-semibold" : "bg-white/[0.06] text-zinc-400 border border-white/[0.04]"
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
        <div className="p-3 border-t border-white/[0.08] bg-[#0E0D17] space-y-2">
          {authUser ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {authUser.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={authUser.avatarUrl}
                    alt={authUser.name}
                    className="w-7 h-7 rounded-full border border-blue-500/30 object-cover shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">
                    {authUser.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 truncate">
                  <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                    <span>{authUser.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 truncate block">
                    {authUser.email}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-lg hover:bg-white/[0.08] text-zinc-400 hover:text-red-400 transition cursor-pointer shrink-0"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-white font-medium truncate max-w-[110px]">{fleetData?.host?.hostname || "Meet-Panchal"}</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">win32-x64</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-white/[0.06] text-zinc-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {authUser?.provider ? `${authUser.provider.toUpperCase()} SSO` : `@${fleetData?.host?.user || "meetp"}`}
            </span>
            <span className="text-zinc-500">{authUser?.plan || "Free Tier"}</span>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE CANVAS                                                  */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="h-14 bg-[#0A0910]/90 backdrop-blur-md border-b border-white/[0.08] px-6 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-40">
          {/* Search Box */}
          <div className="relative w-72 sm:w-96">
            <Search size={14} className="absolute left-3 top-2.5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search telemetry, tool calls, identities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#12111D] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 font-mono transition"
            />
          </div>

          {/* Right Status Badges */}
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {fleetData?.devices?.length || 6} Hosts Shielded
            </span>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium font-mono">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={getLogoDevUrl("datadoghq.com", 64)} alt="DD" className="w-3.5 h-3.5 object-contain shrink-0" />
              <span>US5 Connected</span>
            </div>

            <button 
              onClick={exportLogsToCsv}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-lg shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} /> Export SOC 2 CSV
            </button>
          </div>
        </header>

        {/* Workspace Canvas Body */}
        <main className="p-6 sm:p-8 space-y-8 max-w-[1500px] w-full">
          
          {/* ========================================================================= */}
          {/* TAB 0: OVERVIEW                                                           */}
          {/* ========================================================================= */}
          {activeTab === "OVERVIEW" && (
            <div className="space-y-8">
              
              {/* HERO BANNER */}
              <div className="sevlex-gradient rounded-2xl p-8 sm:p-10 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 border border-blue-400/30">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                <div className="max-w-xl z-10 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase border border-white/20">
                    <Sparkles size={12} /> Data Observability &amp; Layer 7 MCP Defense
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                    Trusted Data, Autonomous AI Guardrails, Zero Surprises.
                  </h1>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Unified zero-trust deep packet inspection across all employee AI agents routing MCP traffic through Sevlex Gateway.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium">
                    <span className="flex items-center gap-1 opacity-90"><Check size={14} /> 142,394 Inspected</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 opacity-90"><Check size={14} /> 1,243 Threats Blocked</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 opacity-90"><Check size={14} /> &lt;0.5ms Latency</span>
                  </div>

                  <div className="pt-4 flex items-center gap-4">
                    <button 
                      onClick={() => setActiveTab("POLICY")}
                      className="px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      Set up L7 Policy Rules <ArrowRight size={14} />
                    </button>
                    <button 
                      onClick={() => setActiveTab("AUDIT")}
                      className="px-4 py-2.5 rounded-xl bg-black/30 hover:bg-black/50 border border-white/30 text-white font-medium text-xs transition cursor-pointer"
                    >
                      Inspect Live Audit Receipts
                    </button>
                  </div>
                </div>

                {/* Hero Graphic Card Preview */}
                <div className="w-full lg:w-96 bg-[#0E0D17]/95 rounded-2xl p-5 text-white shadow-2xl z-10 border border-white/[0.1] backdrop-blur-md">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3 text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <ShieldCheck size={15} className="text-blue-400" /> Layer 7 Gateway Engine
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      LIVE ACTIVE
                    </span>
                  </div>
                  
                  {/* Topology nodes */}
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="p-2.5 rounded-xl bg-[#141322] border border-white/[0.08] flex justify-between items-center">
                      <span className="text-zinc-400">Clients: Cursor, Claude, Windsurf</span>
                      <span className="text-emerald-400 font-bold">127.0.0.1</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex justify-between items-center text-blue-300">
                      <span className="font-bold">Sevlex L7 Inspection</span>
                      <span className="text-emerald-400 font-semibold">&lt;0.2ms (p99)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#141322] border border-white/[0.08] flex justify-between items-center">
                      <span className="text-zinc-400">Upstream MCP Servers</span>
                      <span className="text-white font-semibold">10 Shielded</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION 1: Tool Health and Intercept Performance */}
              <div className="space-y-6 pt-4">
                <div className="text-center max-w-2xl mx-auto space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Complete Visibility into Tool Health &amp; Security Violations
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Real-time deep packet inspection preventing prompt injection, data exfiltration, and destructive commands.
                  </p>
                </div>

                {/* Split Bento: Left Selector Tabs + Right Live Data View */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Column: 3 Feature Selectors */}
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
                          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#141322] border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500 text-white"
                              : "bg-[#0E0D17] border-white/[0.08] hover:border-white/[0.15] text-zinc-300"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Icon size={18} className={isSelected ? "text-blue-400" : "text-zinc-400"} />
                            <div>
                              <h3 className={`text-xs font-bold leading-snug ${isSelected ? "text-white" : "text-zinc-200"}`}>
                                {feature.title}
                              </h3>
                              {isSelected && (
                                <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                                  {feature.desc}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Column: Live Data View / Data Table */}
                  <div className="lg:col-span-8 bg-[#0E0D17] border border-white/[0.08] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                    <div>
                      {/* Top Bar inside preview card */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-white/[0.06] mb-4">
                        <div className="flex items-center gap-2">
                          <Activity size={16} className="text-blue-400" />
                          <span className="text-xs font-bold text-white font-mono">Live L7 Packet Telemetry</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            STREAMING
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                          <span>Total: 142,394</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">99.1% Allowed</span>
                        </div>
                      </div>

                      {/* Live Data Grid */}
                      <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-[#141322] border-b border-white/[0.08] text-zinc-400 uppercase font-mono text-[10px]">
                              <th className="py-2.5 px-3 font-medium">Status</th>
                              <th className="py-2.5 px-3 font-medium">Timestamp</th>
                              <th className="py-2.5 px-3 font-medium">Identity</th>
                              <th className="py-2.5 px-3 font-medium">Tool Call</th>
                              <th className="py-2.5 px-3 font-medium text-right">Latency</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.04] font-mono text-zinc-300">
                            {[
                              { s: "BLOCKED", t: "05:54:12.392", u: "meetp", tool: "delete_database", lat: "0.4ms" },
                              { s: "ALLOWED", t: "05:54:11.840", u: "meetp", tool: "read_company_knowledge", lat: "0.8ms" },
                              { s: "ALLOWED", t: "05:53:58.102", u: "meetp", tool: "github_search_issues", lat: "1.1ms" },
                              { s: "BLOCKED", t: "05:52:45.918", u: "meetp", tool: "drop_table", lat: "0.3ms" },
                              { s: "ALLOWED", t: "05:51:20.443", u: "meetp", tool: "slack_post_message", lat: "0.9ms" }
                            ].map((row, idx) => (
                              <tr key={idx} className="hover:bg-white/[0.02] transition">
                                <td className="py-2.5 px-3">
                                  {row.s === "BLOCKED" ? (
                                    <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                                      <ShieldAlert size={10} /> BLOCKED
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                                      <ShieldCheck size={10} /> ALLOWED
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-zinc-500 text-[11px]">{row.t}</td>
                                <td className="py-2.5 px-3 text-blue-400 font-medium">@{row.u}</td>
                                <td className="py-2.5 px-3 font-bold text-white">{row.tool}</td>
                                <td className="py-2.5 px-3 text-right text-zinc-400">{row.lat}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-500 font-mono">
                      <span>Audit Receipts: Synchronous SQLite WAL</span>
                      <button 
                        onClick={() => setActiveTab("AUDIT")}
                        className="text-blue-400 hover:text-blue-300 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        Inspect all entries in Log Explorer ➔
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 2: Anomaly Detection and Velocity Monitoring */}
              <div className="space-y-6 pt-4">
                <div className="text-center max-w-2xl mx-auto space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    Be the First to Know When Policies &amp; Runtimes Drift
                  </h2>
                  <p className="text-xs text-zinc-400">
                    Ensure trust in your AI pipelines by detecting velocity spikes, prompt injections, and secret leaks.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left Column: Time Series Monitor Chart */}
                  <div className="lg:col-span-8 bg-[#0E0D17] border border-white/[0.08] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
                        <div className="flex items-center gap-2">
                          <BarChart3 size={16} className="text-blue-400" />
                          <span className="text-xs font-bold text-white font-mono">throughput &amp; tool invocations</span>
                        </div>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                          STATUS: HEALTHY
                        </span>
                      </div>

                      {/* SVG Metric Chart */}
                      <div className="h-44 w-full border border-white/[0.06] rounded-xl p-2 flex flex-col justify-between bg-[#12111D]/60 relative overflow-hidden">
                        <svg className="w-full h-full" viewBox="0 0 500 120" fill="none">
                          {/* Upper bound dashed line */}
                          <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                          <text x="10" y="15" fill="#71717A" fontSize="9" fontFamily="monospace">RATE LIMIT THRESHOLD (120 req/s)</text>

                          {/* Lower bound dashed line */}
                          <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
                          <text x="10" y="112" fill="#71717A" fontSize="9" fontFamily="monospace">BASELINE TRAFFIC (10 req/s)</text>

                          {/* Data line */}
                          <path 
                            d="M 0 70 Q 50 60, 100 80 T 200 40 T 300 65 T 400 30 T 500 50" 
                            stroke="#3B82F6" 
                            strokeWidth="2.5" 
                            fill="none" 
                          />
                          {/* Anomaly Spike in red */}
                          <circle cx="400" cy="30" r="4" fill="#EF4444" className="animate-pulse" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                      <span>Anomaly Detection: Statistical Outlier Intercept</span>
                      <span className="text-red-400 font-semibold">1 Interception at 05:52</span>
                    </div>
                  </div>

                  {/* Right Column: Accordion Diagnostic Items */}
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
                          className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#141322] border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500 text-white"
                              : "bg-[#0E0D17] border-white/[0.08] hover:border-white/[0.15] text-zinc-300"
                          }`}
                        >
                          <h3 className={`text-xs font-bold ${isSelected ? "text-white" : "text-zinc-200"}`}>
                            {diag.title}
                          </h3>
                          {isSelected && (
                            <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                              {diag.desc}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* SECTION 3: Resource Cards */}
              <div className="space-y-4 pt-4">
                <div className="text-center max-w-xl mx-auto space-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-white">Compliance &amp; Tool Governance Architecture</h2>
                  <p className="text-xs text-zinc-400">Resources and guides to help you get the most out of Sevlex Observability</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Public Documentation",
                      desc: "Complete architectural references for Layer 7 DPI, JSON-RPC parsing, and stream fail-closing.",
                      icon: FileText
                    },
                    {
                      title: "Detect issues with out-of-the-box policies",
                      desc: "Explore pre-configured zero-trust rules for GitHub, PostgreSQL, AWS, and Slack MCP servers.",
                      icon: Shield
                    },
                    {
                      title: "Ensure trust across the entire data lifecycle",
                      desc: "How to export SOC 2 Type II audit evidence and stream real-time telemetry to Datadog US5.",
                      icon: Database
                    }
                  ].map((res, idx) => {
                    const Icon = res.icon;
                    return (
                      <div key={idx} className="bg-[#0E0D17] border border-white/[0.08] rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-blue-500/40 hover:bg-[#12111D] transition group">
                        <div className="space-y-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                            <Icon size={20} />
                          </div>
                          <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                            {res.title}
                          </h3>
                          <p className="text-xs text-zinc-400 leading-relaxed">
                            {res.desc}
                          </p>
                        </div>

                        <div className="mt-5 pt-3 border-t border-white/[0.06]">
                          <span className="text-xs font-semibold text-blue-400 flex items-center gap-1 group-hover:underline">
                            Read Architecture Guide ➔
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
          {/* TAB: DEVICE FLEET INVENTORY                                              */}
          {/* ========================================================================= */}
          {activeTab === "DEVICES" && (
            <DeviceFleetTab 
              devices={fleetData?.devices || []} 
              setPingStatus={setPingStatus} 
              onNavigateToMdm={() => setActiveTab("MDM")}
            />
          )}

          {/* ========================================================================= */}
          {/* TAB: SHADOW AI & CLIENT AGENT DISCOVERY                                  */}
          {/* ========================================================================= */}
          {activeTab === "AGENTS" && (
            <AgentDiscoveryTab 
              runtimes={fleetData?.runtimes || []} 
              onNavigateToPolicy={() => setActiveTab("POLICY")} 
              setPingStatus={setPingStatus} 
            />
          )}

          {/* ========================================================================= */}
          {/* TAB 1: VISUAL POLICY LIBRARY                                              */}
          {/* ========================================================================= */}
          {activeTab === "POLICY" && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0E0D17] border border-white/[0.08] p-6 rounded-2xl shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sliders size={20} className="text-blue-400" />
                    <h2 className="text-xl font-bold text-white tracking-tight">Enterprise L7 Policy Engine</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-wider font-mono">
                      {blockedTools.length} Banned
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider font-mono">
                      {approvalRequiredTools.length} HITL
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-wider font-mono">
                      DLP Active
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Granular tool access control with real-time deep argument inspection, dual-custody human approvals, and in-flight secret redaction.
                  </p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Search tools (e.g. drop_table)..."
                    value={policySearch}
                    onChange={(e) => {
                      setPolicySearch(e.target.value);
                      setExpandedServers({});
                    }}
                    className="w-full bg-[#12111D] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 outline-none font-mono focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* ToolGuard™ & Output DLP Active Protection Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#12111D] border border-white/[0.08] rounded-2xl text-xs font-mono shadow-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">ToolGuard Call Guard</span>
                    <span className="font-bold text-white">DPI Argument Inspection</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse shrink-0"></div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">ToolGuard Output Guard</span>
                    <span className="font-bold text-white">In-Flight Secret &amp; PII DLP</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse shrink-0"></div>
                  <div>
                    <span className="text-zinc-500 text-[11px] block">AgentGuard HITL</span>
                    <span className="font-bold text-white">Dual-Custody Approvals</span>
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
                    <div key={server.server} className="border border-white/[0.08] rounded-2xl overflow-hidden bg-[#0E0D17] shadow-xl">
                      <button 
                        onClick={() => setExpandedServers(prev => ({ ...prev, [server.server]: !isExpanded }))}
                        className="w-full bg-[#12111D] px-4 py-3 flex items-center justify-between hover:bg-[#181726] transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <ClientBrandIcon name={server.server} size="sm" className="rounded-md shrink-0" />
                          <h3 className="font-bold text-xs text-white">
                            {server.server} 
                            <span className="text-zinc-500 text-[11px] font-mono ml-2 font-normal">({filteredTools.length} tools)</span>
                          </h3>
                        </div>
                        {isExpanded ? <ChevronDown size={14} className="text-zinc-400" /> : <ChevronRight size={14} className="text-zinc-400" />}
                      </button>
                      
                      {isExpanded && (
                        <div className="divide-y divide-white/[0.04]">
                          {filteredTools.map((tool) => {
                            const isBlocked = blockedTools.includes(tool);
                            const isHitl = approvalRequiredTools.includes(tool);
                            return (
                              <div key={tool} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.02] transition group">
                                <div className="flex-1 flex items-center gap-3">
                                  <p className="font-mono text-xs font-medium text-zinc-200 group-hover:text-blue-400 transition">{tool}</p>
                                  {isBlocked ? (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
                                      BLOCKED
                                    </span>
                                  ) : isHitl ? (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase flex items-center gap-1">
                                      <Shield size={10} /> HITL REQUIRED
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                                      ALLOWED
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 ml-3">
                                  <button
                                    onClick={() => setToolState(tool, "ALLOW")}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition cursor-pointer ${
                                      !isBlocked && !isHitl 
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" 
                                        : "bg-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.1]"
                                    }`}
                                    title="Permit tool execution without friction"
                                  >
                                    Allow
                                  </button>
                                  <button
                                    onClick={() => setToolState(tool, "HITL")}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition flex items-center gap-1 cursor-pointer ${
                                      isHitl 
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                                        : "bg-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.1]"
                                    }`}
                                    title="Require human dual-custody authorization before running"
                                  >
                                    <Shield size={10} /> HITL
                                  </button>
                                  <button
                                    onClick={() => setToolState(tool, "BLOCK")}
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold font-mono transition cursor-pointer ${
                                      isBlocked 
                                        ? "bg-red-600 text-white shadow-md shadow-red-600/20" 
                                        : "bg-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.1]"
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
          {/* TAB: DUAL-CUSTODY HITL CLEARANCE QUEUE                                   */}
          {/* ========================================================================= */}
          {activeTab === "HITL" && (
            <HitlClearanceTab apiKey={apiKey} />
          )}

          {/* ========================================================================= */}
          {/* TAB 2: AUDIT LOGS (Datadog Log Explorer Style with Facets)                */}
          {/* ========================================================================= */}
          {activeTab === "AUDIT" && (
            <div className="bg-[#0E0D17] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl flex flex-col">
              
              {/* Top Toolbar */}
              <div className="p-4 border-b border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#141322] gap-3">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-80">
                    <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Search logs by tool name, payload, or user..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-[#0A0910] border border-white/[0.08] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-500 outline-none font-mono focus:border-blue-500"
                    />
                  </div>

                  {/* Status Facet Filter */}
                  <div className="flex items-center bg-[#0A0910] border border-white/[0.08] rounded-xl p-0.5 text-xs font-mono">
                    <button 
                      onClick={() => setStatusFilter("ALL")}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${statusFilter === "ALL" ? "bg-blue-600 text-white font-semibold shadow-xs" : "text-zinc-400 hover:text-white"}`}
                    >
                      All ({logs.length})
                    </button>
                    <button 
                      onClick={() => setStatusFilter("ALLOWED")}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${statusFilter === "ALLOWED" ? "bg-emerald-500/20 text-emerald-300 font-semibold" : "text-zinc-400 hover:text-white"}`}
                    >
                      Allowed
                    </button>
                    <button 
                      onClick={() => setStatusFilter("BLOCKED")}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${statusFilter === "BLOCKED" ? "bg-red-500/20 text-red-300 font-semibold" : "text-zinc-400 hover:text-white"}`}
                    >
                      Blocked
                    </button>
                    <button 
                      onClick={() => setStatusFilter("DLP_REDACTED")}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${statusFilter === "DLP_REDACTED" ? "bg-purple-500/20 text-purple-300 font-semibold" : "text-zinc-400 hover:text-white"}`}
                    >
                      DLP
                    </button>
                    <button 
                      onClick={() => setStatusFilter("HITL_PENDING")}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${statusFilter === "HITL_PENDING" ? "bg-blue-500/20 text-blue-300 font-semibold" : "text-zinc-400 hover:text-white"}`}
                    >
                      HITL
                    </button>
                    <button 
                      onClick={() => setStatusFilter("CIRCUIT_BROKEN")}
                      className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${statusFilter === "CIRCUIT_BROKEN" ? "bg-amber-500/20 text-amber-300 font-semibold" : "text-zinc-400 hover:text-white"}`}
                    >
                      Breaker
                    </button>
                  </div>
                </div>

                <button 
                  onClick={exportLogsToCsv}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shadow-lg shadow-blue-600/25 cursor-pointer"
                >
                  <Download size={13} /> Export SOC 2 CSV
                </button>
              </div>

              {/* Logs Table with JSON Drawer */}
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
                
                {/* Left (2 cols): Stream Table */}
                <div className="lg:col-span-2 overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-[#141322] border-b border-white/[0.08] text-zinc-400 uppercase font-mono text-[10px] z-10">
                      <tr>
                        <th className="py-2.5 px-4 font-medium">Status</th>
                        <th className="py-2.5 px-4 font-medium">Timestamp</th>
                        <th className="py-2.5 px-4 font-medium">Identity</th>
                        <th className="py-2.5 px-4 font-medium">Tool Call</th>
                        <th className="py-2.5 px-4 font-medium">Payload Preview</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04] font-mono text-zinc-300">
                      {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                        <tr 
                          key={log.id} 
                          onClick={() => setSelectedLog(log)}
                          className={`hover:bg-white/[0.02] transition cursor-pointer ${
                            selectedLog?.id === log.id ? "bg-blue-950/40 border-l-2 border-blue-500" : ""
                          }`}
                        >
                          <td className="py-2.5 px-4">
                            {log.status === "BLOCKED" ? (
                              <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                <ShieldAlert size={11} /> BLOCKED
                              </span>
                            ) : log.status === "CIRCUIT_BROKEN" ? (
                              <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                <Zap size={11} /> CIRCUIT BROKEN
                              </span>
                            ) : log.status === "DLP_REDACTED" ? (
                              <span className="inline-flex items-center gap-1 text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                <Lock size={11} /> DLP REDACTED
                              </span>
                            ) : log.status === "HITL_PENDING" ? (
                              <span className="inline-flex items-center gap-1 text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                <Shield size={11} /> HITL PENDING
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                                <ShieldCheck size={11} /> ALLOWED
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 text-zinc-500 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                          <td className="py-2.5 px-4 text-blue-400 font-medium">@{log.user_id || "meetp"}</td>
                          <td className="py-2.5 px-4 font-bold text-white">{log.tool_name}</td>
                          <td className="py-2.5 px-4 text-zinc-400 truncate max-w-xs">{log.raw_request}</td>
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

                {/* Right (1 col): JSON Inspector Drawer */}
                <div className="bg-[#0A0910] p-4 flex flex-col justify-between max-h-[600px] overflow-y-auto">
                  {selectedLog ? (
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                          <Eye size={13} className="text-blue-400" /> Event #{selectedLog.id} Forensic Detail
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          selectedLog.status === "BLOCKED" 
                            ? "bg-red-500/20 text-red-300" 
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}>
                          {selectedLog.status}
                        </span>
                      </div>

                      <div className="space-y-3 text-xs font-mono">
                        <div>
                          <span className="text-zinc-500 text-[10px] uppercase font-bold">Tool Name:</span>
                          <p className="text-white font-bold">{selectedLog.tool_name}</p>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] uppercase font-bold">Authenticated Identity:</span>
                          <p className="text-blue-400">@{selectedLog.user_id || "meetp"}</p>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] uppercase font-bold">Timestamp:</span>
                          <p className="text-zinc-300">{selectedLog.timestamp}</p>
                        </div>
                        <div>
                          <span className="text-zinc-500 text-[10px] uppercase font-bold">Layer 7 Deep Packet Payload:</span>
                          <pre className="mt-1.5 p-3 rounded-xl bg-[#060609] border border-white/[0.08] text-[11px] text-emerald-400 font-mono whitespace-pre-wrap break-all overflow-x-auto max-h-60 shadow-inner">
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
                          <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-[10px] space-y-1.5">
                            <div className="flex items-center justify-between text-blue-200 font-bold">
                              <span className="flex items-center gap-1"><Lock size={10} /> SOC 2 Cryptographic Hash Link</span>
                              <span className="text-[9px] text-blue-400 font-mono">SHA-256</span>
                            </div>
                            <div className="font-mono text-zinc-400 break-all text-[9px]">
                              <span className="text-zinc-500">Prev: </span>{selectedLog.prev_hash || "0000000000000000000000000000000000000000000000000000000000000000"}
                            </div>
                            <div className="font-mono text-white font-bold break-all text-[9px]">
                              <span className="text-zinc-500 font-normal">Hash: </span>{selectedLog.entry_hash}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="py-20 text-center text-zinc-500 text-xs font-mono flex flex-col items-center justify-center">
                      <Eye size={24} className="mb-2 opacity-40 text-zinc-500" />
                      <p>Select any audit receipt on the left to inspect full Layer 7 JSON-RPC forensic packet.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: GATEWAY API KEYS & CLOUD WORKSPACES (app.sevlex.com)                 */}
          {/* ========================================================================= */}
          {activeTab === "API_KEYS" && (
            <ApiKeysTab apiKey={apiKey} />
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
        <div className="fixed bottom-6 right-6 z-50 p-3.5 bg-[#0E0D17] border border-white/[0.12] rounded-xl text-xs font-mono text-white shadow-2xl flex items-center gap-2 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
          <span>{pingStatus}</span>
        </div>
      )}

    </div>
  );
}
