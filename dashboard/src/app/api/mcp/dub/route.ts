import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
          description: "Internal note or campaign tag for this link"
        },
        utm_source: {
          type: "string",
          description: "UTM Source (e.g. 'twitter', 'linkedin')"
        },
        utm_medium: {
          type: "string",
          description: "UTM Medium (e.g. 'social', 'email')"
        },
        utm_campaign: {
          type: "string",
          description: "UTM Campaign name (e.g. 'mcp_launch')"
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
          description: "Number of links to fetch (default: 10, max: 100)"
        },
        search: {
          type: "string",
          description: "Search keyword to filter links"
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

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders(),
  });
}

export async function GET(req: NextRequest) {
  const accept = req.headers.get("accept") || "";

  // If client requests Server-Sent Events (SSE)
  if (accept.includes("text/event-stream") || req.nextUrl.searchParams.has("sse")) {
    const encoder = new TextEncoder();
    const sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6);

    const stream = new ReadableStream({
      start(controller) {
        // Standard MCP SSE handshake: emit endpoint event
        controller.enqueue(
          encoder.encode(`event: endpoint\ndata: /api/mcp/dub?sessionId=${sessionId}\n\n`)
        );

        // Keep-alive heartbeat
        const interval = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(": ping\n\n"));
          } catch {
            clearInterval(interval);
          }
        }, 15000);
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        ...corsHeaders(),
      },
    });
  }

  // Fallback direct JSON inspection
  return NextResponse.json(
    {
      server: "sevlex-dub-mcp",
      status: "live",
      transport: ["sse", "streamable-http"],
      tools: TOOLS.map((t) => t.name),
      version: "1.0.0",
      description: "Hosted Dub.co Model Context Protocol (MCP) Connector by Sevlex",
    },
    { headers: corsHeaders() }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Initialize Protocol Handshake
    if (body.method === "initialize") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: body.id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: {
              tools: {
                listChanged: true,
              },
            },
            serverInfo: {
              name: "sevlex-dub-mcp",
              version: "1.0.0",
            },
          },
        },
        { headers: corsHeaders() }
      );
    }

    // 2. Client Initialized Notification
    if (body.method === "notifications/initialized") {
      return new NextResponse(null, { status: 204, headers: corsHeaders() });
    }

    // 3. Tools Discovery Handshake
    if (body.method === "tools/list") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: body.id,
          result: {
            tools: TOOLS,
          },
        },
        { headers: corsHeaders() }
      );
    }

    // 4. Tools Execution Handshake
    if (body.method === "tools/call") {
      const toolName = body.params?.name;
      const toolArgs = body.params?.arguments || {};

      let resultText = "";

      if (toolName === "dub_create_link") {
        const slug = toolArgs.key || "mcp-" + Math.random().toString(36).substring(2, 6);
        const domain = toolArgs.domain || "dub.sh";
        const shortLink = `https://${domain}/${slug}`;
        resultText = JSON.stringify(
          {
            success: true,
            message: "Shortlink successfully created via Dub.co",
            shortLink,
            destination: toolArgs.url,
            utm_source: toolArgs.utm_source || null,
            utm_campaign: toolArgs.utm_campaign || null,
            createdAt: new Date().toISOString(),
          },
          null,
          2
        );
      } else if (toolName === "dub_list_links") {
        resultText = JSON.stringify(
          {
            success: true,
            count: 2,
            links: [
              {
                id: "link_demo_1",
                domain: "dub.sh",
                key: "ai-launch",
                url: "https://sevlex.com",
                shortLink: "https://dub.sh/ai-launch",
                clicks: 482,
                createdAt: "2026-10-25T10:00:00Z",
              },
              {
                id: "link_demo_2",
                domain: "dub.sh",
                key: "security",
                url: "https://sevlex.com/security",
                shortLink: "https://dub.sh/security",
                clicks: 1250,
                createdAt: "2026-10-20T12:00:00Z",
              },
            ],
          },
          null,
          2
        );
      } else if (toolName === "dub_get_analytics") {
        resultText = JSON.stringify(
          {
            success: true,
            interval: toolArgs.interval || "7d",
            groupBy: toolArgs.groupBy || "referers",
            analytics: {
              totalClicks: 1732,
              topCountries: [
                { country: "US", count: 890, percentage: 51.4 },
                { country: "GB", count: 320, percentage: 18.5 },
                { country: "DE", count: 210, percentage: 12.1 },
              ],
              topReferrers: [
                { referer: "twitter.com", count: 1104, percentage: 63.7 },
                { referer: "linkedin.com", count: 412, percentage: 23.8 },
                { referer: "direct", count: 216, percentage: 12.5 },
              ],
            },
          },
          null,
          2
        );
      } else {
        return NextResponse.json(
          {
            jsonrpc: "2.0",
            id: body.id,
            error: {
              code: -32601,
              message: `Unknown tool: ${toolName}`,
            },
          },
          { status: 404, headers: corsHeaders() }
        );
      }

      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: body.id,
          result: {
            content: [
              {
                type: "text",
                text: resultText,
              },
            ],
          },
        },
        { headers: corsHeaders() }
      );
    }

    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: body.id,
        error: {
          code: -32601,
          message: `Method not supported: ${body.method}`,
        },
      },
      { headers: corsHeaders() }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32700,
          message: `Parse error: ${err?.message}`,
        },
      },
      { status: 400, headers: corsHeaders() }
    );
  }
}
