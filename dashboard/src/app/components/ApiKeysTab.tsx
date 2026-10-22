"use client";

import { useState, useEffect } from "react";
import { 
  Key, Plus, Copy, Check, Trash2, AlertTriangle, ShieldCheck, 
  Terminal, Server, Clock, RefreshCw, CheckCircle2, Lock
} from "lucide-react";

interface ApiKeyItem {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
  org_name?: string;
  plan?: string;
}

interface ApiKeysTabProps {
  apiKey: string;
}

export default function ApiKeysTab({ apiKey }: ApiKeysTabProps) {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<{ rawKey: string; keyPrefix: string; name: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/keys", {
        headers: { Authorization: apiKey },
      });
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch (err: any) {
      console.error("Failed to load API keys:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, [apiKey]);

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setIsCreating(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: apiKey,
        },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.key) {
        setCreatedKey({
          rawKey: data.key.rawKey,
          keyPrefix: data.key.keyPrefix,
          name: data.key.name,
        });
        setNewKeyName("");
        fetchKeys();
      } else {
        setErrorMsg(data.error || "Failed to create API key");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to revoke this API key? Workstations using it will immediately lose telemetry clearance.")) {
      return;
    }

    try {
      const res = await fetch(`/api/keys?id=${keyId}`, {
        method: "DELETE",
        headers: { Authorization: apiKey },
      });

      if (res.ok) {
        fetchKeys();
      }
    } catch (err: any) {
      console.error("Failed to revoke key:", err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------- */}
      {/* 1. Header Workspace Context                                   */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-white tracking-tight">Organization Access & Gateway Tokens</h2>
            <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
              app.sevlex.com
            </span>
          </div>
          <p className="text-sm text-neutral-400">
            Cryptographically signed tokens (<code className="text-neutral-300 font-mono text-xs">slx_live_...</code>) used by developer CLIs to stream telemetry to your dedicated cloud organization.
          </p>
        </div>

        <button
          onClick={fetchKeys}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white bg-[#1a1a1a] border border-[#333] hover:border-[#555] rounded-lg transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Newly Minted Key Banner (Only shown once!)                 */}
      {/* ------------------------------------------------------------- */}
      {createdKey && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              API Key Generated Successfully: &ldquo;{createdKey.name}&rdquo;
            </div>
            <button
              onClick={() => setCreatedKey(null)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-neutral-300">
            Please copy this key now. For zero-trust security, <span className="font-semibold text-emerald-300">it will never be displayed again</span>.
          </p>

          <div className="flex items-center gap-2 bg-[#0A0A0A] border border-emerald-500/40 rounded-lg p-2.5">
            <code className="text-sm font-mono text-emerald-400 flex-1 select-all break-all">
              {createdKey.rawKey}
            </code>
            <button
              onClick={() => copyToClipboard(createdKey.rawKey, "newly-created")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black rounded transition-colors"
            >
              {copiedId === "newly-created" ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Key
                </>
              )}
            </button>
          </div>

          <div className="pt-2 text-xs text-neutral-400 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-neutral-400" />
            <span>Developer workstation 1-line command:</span>
            <code className="bg-[#181818] px-2 py-0.5 rounded text-neutral-200 font-mono">
              npx sevlex config set api_key={createdKey.rawKey}
            </code>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. Issue New Key Form                                         */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-400" />
          Create New Gateway Token
        </h3>
        <form onSubmit={handleCreateKey} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Token description (e.g. Sarah's MacBook, SF Core Engineering, CI/CD Pipeline)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            className="flex-1 bg-[#0A0A0A] border border-[#333] rounded-lg px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isCreating || !newKeyName.trim()}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {isCreating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
            Generate Production Token
          </button>
        </form>
        {errorMsg && <p className="text-xs text-red-400 mt-2">{errorMsg}</p>}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. Active API Keys Table                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#262626] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Active Organization Keys</h3>
          <span className="text-xs text-neutral-500">{keys.length} tokens registered</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Loading organization credentials...
          </div>
        ) : keys.length === 0 ? (
          <div className="p-8 text-center text-sm text-neutral-500">
            No API keys issued yet. Generate your first gateway token above.
          </div>
        ) : (
          <div className="divide-y divide-[#1e1e1e]">
            {keys.map((k) => {
              const isRevoked = !!k.revoked_at;
              return (
                <div key={k.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#181818]/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{k.name}</span>
                      {isRevoked ? (
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20 rounded">
                          Revoked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                      <code className="font-mono text-neutral-300">{k.key_prefix}</code>
                      <span>•</span>
                      <span>Created {new Date(k.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>
                        Last used: {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : "Never"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {!isRevoked && (
                      <>
                        <button
                          onClick={() => copyToClipboard(`npx sevlex config set api_key=${k.key_prefix.replace('...', '')}`, k.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-lg transition-colors"
                          title="Copy setup command"
                        >
                          {copiedId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          CLI Command
                        </button>
                        <button
                          onClick={() => handleRevokeKey(k.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors"
                          title="Revoke Token"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Revoke
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 5. Developer Quick Connect Guide                              */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#121212] border border-[#262626] rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Developer Workstation Setup (30 Seconds)
        </h3>
        <p className="text-xs text-neutral-400">
          Developers only need to run these two commands to connect their IDE (Cursor, Claude Desktop, Cline) to your organization:
        </p>

        <div className="bg-[#0A0A0A] border border-[#262626] rounded-lg p-3 font-mono text-xs text-neutral-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500"># 1. Install Sevlex Gateway globally</span>
          </div>
          <div className="text-emerald-400">npm install -g sevlex</div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-neutral-500"># 2. Bind workstation to your cloud organization</span>
          </div>
          <div className="text-neutral-200">
            sevlex config set api_key=<span className="text-emerald-400">slx_live_your_token_here</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-neutral-500"># 3. Transparently shield all local AI coding runtimes</span>
          </div>
          <div className="text-neutral-200">sevlex inject</div>
        </div>
      </div>
    </div>
  );
}
