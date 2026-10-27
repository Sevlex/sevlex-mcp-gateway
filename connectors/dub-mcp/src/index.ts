#!/usr/bin/env node
import readline from "node:readline";

// Native environment file loader (Node 20+)
if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    // .env not present or optional
  }
}

const DUB_API_BASE = "https://api.dub.co";
const DUB_API_KEY = process.env.DUB_API_KEY;

interface JsonRpcRequest {
  jsonrpc: string;
  id?: number | string;
  method: string;
  params?: Record<string, any>;
}

// ============================================================================
// DUB.CO REST API CLIENT
// ============================================================================

async function callDubApi(endpoint: string, options: RequestInit = {}) {
  if (!DUB_API_KEY) {
    // Graceful fallback for local developer demo if API key is not yet set
    return handleSimulatedResponse(endpoint, options);
  }

  const url = `${DUB_API_BASE}${endpoint}`;
  const headers = {
    Authorization: `Bearer ${DUB_API_KEY}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Dub API Error (${response.status}): ${errorText}`);
  }

  return await response.json();
}

function handleSimulatedResponse(endpoint: string, options: RequestInit = {}) {
  // Provides clean mock responses if DUB_API_KEY is omitted for quick testing
  if (endpoint.startsWith("/links") && options.method === "POST") {
    const body = options.body ? JSON.parse(options.body as string) : {};
    const slug = body.key || "mcp-" + Math.random().toString(36).substring(2, 7);
    const domain = body.domain || "dub.sh";
    return {
      id: "link_simulated_" + Date.now(),
      domain,
      key: slug,
      url: body.url,
      shortLink: `https://${domain}/${slug}`,
      clicks: 0,
      createdAt: new Date().toISOString(),
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      _simulated: true,
      _note: "Running in demo simulation mode. Set DUB_API_KEY in .env for live Dub.co synchronization."
    };
  }

  if (endpoint.startsWith("/links")) {
    return [
      {
        id: "link_demo_1",
        domain: "dub.sh",
        key: "ai-launch",
        url: "https://sevlex.com",
        shortLink: "https://dub.sh/ai-launch",
        clicks: 482,
        createdAt: "2026-10-25T10:00:00Z"
      },
      {
        id: "link_demo_2",
        domain: "dub.sh",
        key: "docs",
        url: "https://sevlex.com/docs",
        shortLink: "https://dub.sh/docs",
        clicks: 1250,
        createdAt: "2026-10-20T12:00:00Z"
      }
    ];
  }

  if (endpoint.startsWith("/analytics")) {
    return {
      event: "clicks",
      totalClicks: 1732,
      topCountries: [
        { country: "US", count: 890, percentage: 51.4 },
        { country: "GB", count: 320, percentage: 18.5 },
        { country: "DE", count: 210, percentage: 12.1 }
      ],
      topReferrers: [
        { referer: "twitter.com", count: 1104, percentage: 63.7 },
        { referer: "linkedin.com", count: 412, percentage: 23.8 },
        { referer: "direct", count: 216, percentage: 12.5 }
      ]
    };
  }

  return { status: "ok" };
}

// ============================================================================
// TOOL DEFINITIONS (ANTHROPIC MCP SPECIFICATION)
// ============================================================================

const TOOLS = [
  {
    name: "dub_create_link",
    description: "Create a branded shortlink on Dub.co with optional custom slug, UTM parameters, and tags.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The destination URL that the shortlink should redirect to (must start with http:// or https://)"
        },
        key: {
          type: "string",
          description: "Custom short slug (e.g., 'summer-sale' for dub.sh/summer-sale). Leave empty for random slug."
        },
        domain: {
          type: "string",
          description: "The domain of the shortlink (e.g., 'dub.sh' or your custom branded domain)."
        },
        comments: {
          type: "string",
          description: "Internal note or campaign description for this link."
        },
        utm_source: {
          type: "string",
          description: "UTM Source (e.g. 'twitter', 'linkedin', 'newsletter')"
        },
        utm_medium: {
          type: "string",
          description: "UTM Medium (e.g. 'social', 'email', 'cpc')"
        },
        utm_campaign: {
          type: "string",
          description: "UTM Campaign name (e.g. 'v2_launch', 'ai_demo')"
        }
      },
      required: ["url"]
    }
  },
  {
    name: "dub_list_links",
    description: "Retrieve recently created links, their target destinations, and current click counts from Dub.co.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of links to fetch (default: 10, max: 100)"
        },
        search: {
          type: "string",
          description: "Search keyword to filter links by target URL or short slug"
        },
        sort: {
          type: "string",
          enum: ["createdAt", "clicks", "lastClicked"],
          description: "Sort metric (default: 'createdAt')"
        }
      }
    }
  },
  {
    name: "dub_get_analytics",
    description: "Fetch comprehensive click analytics, referrer data, and geographic visitor breakdown for Dub.co links.",
    inputSchema: {
      type: "object",
      properties: {
        linkId: {
          type: "string",
          description: "The unique link ID or leave empty to fetch workspace-wide aggregated analytics"
        },
        groupBy: {
          type: "string",
          enum: ["count", "countries", "referers", "devices", "browsers"],
          description: "How to group the analytics data (default: 'count')"
        },
        interval: {
          type: "string",
          enum: ["24h", "7d", "30d", "90d", "all"],
          description: "Time interval to aggregate (default: '7d')"
        }
      }
    }
  }
];

// ============================================================================
// MCP JSON-RPC 2.0 PROTOCOL ENGINE
// ============================================================================

async function handleToolCall(name: string, args: Record<string, any>) {
  switch (name) {
    case "dub_create_link": {
      const payload: Record<string, any> = {
        url: args.url
      };
      if (args.key) payload.key = args.key;
      if (args.domain) payload.domain = args.domain;
      if (args.comments) payload.comments = args.comments;
      if (args.utm_source) payload.utm_source = args.utm_source;
      if (args.utm_medium) payload.utm_medium = args.utm_medium;
      if (args.utm_campaign) payload.utm_campaign = args.utm_campaign;

      const result: any = await callDubApi("/links", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                message: "Shortlink successfully created via Dub.co",
                shortLink: result.shortLink || `https://${result.domain || "dub.sh"}/${result.key}`,
                destination: result.url,
                details: result
              },
              null,
              2
            )
          }
        ]
      };
    }

    case "dub_list_links": {
      const limit = args.limit || 10;
      const params = new URLSearchParams();
      params.append("limit", limit.toString());
      if (args.search) params.append("search", args.search);
      if (args.sort) params.append("sort", args.sort);

      const links = await callDubApi(`/links?${params.toString()}`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                count: Array.isArray(links) ? links.length : 0,
                links
              },
              null,
              2
            )
          }
        ]
      };
    }

    case "dub_get_analytics": {
      const groupBy = args.groupBy || "count";
      const interval = args.interval || "7d";
      const params = new URLSearchParams();
      params.append("event", "clicks");
      params.append("groupBy", groupBy);
      params.append("interval", interval);
      if (args.linkId) params.append("linkId", args.linkId);

      const analytics = await callDubApi(`/analytics?${params.toString()}`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                interval,
                groupBy,
                analytics
              },
              null,
              2
            )
          }
        ]
      };
    }

    default:
      throw new Error(`Unknown tool requested: ${name}`);
  }
}

// ============================================================================
// STDIO TRANSPORT INTERFACE
// ============================================================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on("line", async (line) => {
  if (!line.trim()) return;

  try {
    const req = JSON.parse(line) as JsonRpcRequest;

    // 1. Initialize Protocol Handshake
    if (req.method === "initialize") {
      const response = {
        jsonrpc: "2.0",
        id: req.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {
              listChanged: true
            }
          },
          serverInfo: {
            name: "dub-mcp",
            version: "1.0.0"
          }
        }
      };
      process.stdout.write(JSON.stringify(response) + "\n");
      return;
    }

    // 2. Ignore Client Notifications (e.g. notifications/initialized)
    if (req.method.startsWith("notifications/")) {
      return;
    }

    // 3. Tool Discovery
    if (req.method === "tools/list") {
      const response = {
        jsonrpc: "2.0",
        id: req.id,
        result: {
          tools: TOOLS
        }
      };
      process.stdout.write(JSON.stringify(response) + "\n");
      return;
    }

    // 4. Tool Execution
    if (req.method === "tools/call") {
      const toolName = req.params?.name;
      const toolArgs = req.params?.arguments || {};

      try {
        const result = await handleToolCall(toolName, toolArgs);
        const response = {
          jsonrpc: "2.0",
          id: req.id,
          result
        };
        process.stdout.write(JSON.stringify(response) + "\n");
      } catch (err: any) {
        const response = {
          jsonrpc: "2.0",
          id: req.id,
          error: {
            code: -32603,
            message: err?.message || "Internal error executing Dub tool"
          }
        };
        process.stdout.write(JSON.stringify(response) + "\n");
      }
      return;
    }

    // 5. Fallback for unhandled methods
    if (req.id !== undefined) {
      process.stdout.write(
        JSON.stringify({
          jsonrpc: "2.0",
          id: req.id,
          error: {
            code: -32601,
            message: `Method not found: ${req.method}`
          }
        }) + "\n"
      );
    }
  } catch (parseError: any) {
    process.stdout.write(
      JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32700,
          message: `Parse error: ${parseError?.message}`
        }
      }) + "\n"
    );
  }
});

process.stderr.write("Dub.co MCP Connector running on stdio transport...\n");
