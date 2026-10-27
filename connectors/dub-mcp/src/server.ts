#!/usr/bin/env node
import http from "node:http";
import { URL } from "node:url";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const DUB_API_BASE = "https://api.dub.co";
const DUB_API_KEY = process.env.DUB_API_KEY;

// Native environment file loader (Node 20+)
if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {}
}

// ============================================================================
// DUB.CO REST API CLIENT & SIMULATION
// ============================================================================

async function callDubApi(endpoint: string, options: RequestInit = {}) {
  if (!DUB_API_KEY) {
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
      _note: "Running in interactive demo simulation mode. Set DUB_API_KEY for live synchronization."
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
// TOOL DEFINITIONS
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
          description: "The destination URL that the shortlink should redirect to"
        },
        key: {
          type: "string",
          description: "Custom short slug (e.g. 'launch-v2')"
        },
        domain: {
          type: "string",
          description: "The domain of the shortlink (e.g. 'dub.sh')"
        },
        comments: {
          type: "string",
          description: "Internal note for this link"
        },
        utm_source: {
          type: "string",
          description: "UTM Source (e.g. 'twitter', 'linkedin')"
        },
        utm_medium: {
          type: "string",
          description: "UTM Medium"
        },
        utm_campaign: {
          type: "string",
          description: "UTM Campaign name"
        }
      },
      required: ["url"]
    }
  },
  {
    name: "dub_list_links",
    description: "Retrieve recently created links, destinations, and click counts from Dub.co.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of links to fetch (default: 10)"
        },
        search: {
          type: "string",
          description: "Search keyword"
        }
      }
    }
  },
  {
    name: "dub_get_analytics",
    description: "Fetch comprehensive click analytics, referrer data, and geographic visitor breakdown for Dub.co.",
    inputSchema: {
      type: "object",
      properties: {
        linkId: {
          type: "string",
          description: "Unique link ID or omit for aggregate workspace analytics"
        },
        groupBy: {
          type: "string",
          enum: ["count", "countries", "referers", "devices"],
          description: "How to group the analytics data"
        },
        interval: {
          type: "string",
          enum: ["24h", "7d", "30d", "all"],
          description: "Time interval"
        }
      }
    }
  }
];

async function handleToolCall(name: string, args: Record<string, any>) {
  switch (name) {
    case "dub_create_link": {
      const payload: Record<string, any> = { url: args.url };
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

      const links = await callDubApi(`/links?${params.toString()}`);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ success: true, count: Array.isArray(links) ? links.length : 0, links }, null, 2)
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
            text: JSON.stringify({ success: true, interval, groupBy, analytics }, null, 2)
          }
        ]
      };
    }

    default:
      throw new Error(`Unknown tool requested: ${name}`);
  }
}

async function processRpc(req: any): Promise<any> {
  if (req.method === "initialize") {
    return {
      jsonrpc: "2.0",
      id: req.id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: { listChanged: true } },
        serverInfo: { name: "dub-mcp", version: "1.0.0" }
      }
    };
  }

  if (req.method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id: req.id,
      result: { tools: TOOLS }
    };
  }

  if (req.method === "tools/call") {
    const name = req.params?.name;
    const args = req.params?.arguments || {};
    try {
      const result = await handleToolCall(name, args);
      return { jsonrpc: "2.0", id: req.id, result };
    } catch (err: any) {
      return {
        jsonrpc: "2.0",
        id: req.id,
        error: { code: -32603, message: err?.message || "Execution error" }
      };
    }
  }

  if (req.id !== undefined) {
    return {
      jsonrpc: "2.0",
      id: req.id,
      error: { code: -32601, message: `Method not found: ${req.method}` }
    };
  }

  return null;
}

// ============================================================================
// HTTP / SSE TRANSPORT SERVER
// ============================================================================

interface ClientSession {
  res: http.ServerResponse;
  id: string;
}

const sessions = new Map<string, ClientSession>();

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const reqUrl = new URL(req.url || "/", `http://${host}`);

  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // 1. SSE Connection Handshake (/sse)
  if (req.method === "GET" && (reqUrl.pathname === "/sse" || reqUrl.pathname.endsWith("/sse"))) {
    const sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    });

    sessions.set(sessionId, { res, id: sessionId });
    console.log(`[Dub SSE] Client connected: ${sessionId}`);

    // Standard MCP SSE handshake: send endpoint event pointing to /message
    const messageEndpoint = `/message?sessionId=${sessionId}`;
    res.write(`event: endpoint\ndata: ${messageEndpoint}\n\n`);

    const heartbeat = setInterval(() => {
      res.write(": ping\n\n");
    }, 15000);

    req.on("close", () => {
      clearInterval(heartbeat);
      sessions.delete(sessionId);
      console.log(`[Dub SSE] Client disconnected: ${sessionId}`);
    });
    return;
  }

  // 2. Message intake endpoint (/message)
  if (req.method === "POST" && (reqUrl.pathname === "/message" || reqUrl.pathname.startsWith("/message"))) {
    const sessionId = reqUrl.searchParams.get("sessionId");
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const rpc = JSON.parse(body);
        console.log(`[Dub SSE] RPC Received: ${rpc.method} (id=${rpc.id})`);

        const response = await processRpc(rpc);

        if (response) {
          // If active SSE session exists, send via SSE stream
          if (sessionId && sessions.has(sessionId)) {
            const client = sessions.get(sessionId)!;
            client.res.write(`event: message\ndata: ${JSON.stringify(response)}\n\n`);
          }

          // Also return HTTP 200 with response JSON for direct HTTP clients
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(response));
        } else {
          res.writeHead(204);
          res.end();
        }
      } catch (err: any) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err?.message || "Invalid JSON" }));
      }
    });
    return;
  }

  // Fallback info route
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      server: "dub-mcp",
      version: "1.0.0",
      status: "running",
      sseEndpoint: `http://${host}/sse`,
      messageEndpoint: `http://${host}/message`
    })
  );
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`=================================================`);
  console.log(`  DUB.CO MCP HTTP / SSE SERVER LIVE`);
  console.log(`  SSE URL: http://localhost:${PORT}/sse`);
  console.log(`=================================================`);
});
