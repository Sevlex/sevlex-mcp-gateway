# Sevlex MVP — Build Tracker

## PHASE 1: Gateway (Week 1)
The core product. Everything else depends on this.

- [ ] Create `.env` file with Supabase credentials (move out of proxy.mjs)
- [ ] Build `gateway.mjs` — real stdio proxy that:
  - [ ] Reads upstream MCP server command from env var
  - [ ] Spawns it as child process
  - [ ] Pipes stdin/stdout through itself
  - [ ] Intercepts every `tools/call` JSON-RPC request
  - [ ] Logs to Supabase `tool_calls` table (tool name, params, timestamp, duration)
  - [ ] Forwards request upstream and returns response
- [ ] Test: run `mcp-server.mjs` as upstream, call `get_company_info`, confirm row appears in Supabase
- [ ] Test: confirm response to Claude is identical to calling upstream directly

---

## PHASE 2: Dashboard (Week 1-2)
Makes the gateway's value visible. What justifies $299/month.

- [ ] Set up Next.js project
- [ ] Connect to Supabase
- [ ] Build main table view — every tool call, tool name, params, timestamp, duration
- [ ] Build search/filter — filter by tool name, date range
- [ ] Build simple stats — total calls today, most used tool, which agent called what
- [ ] Deploy to Vercel

---

## PHASE 3: Payments + Signup (Week 2)
Without this you cannot charge anyone.

- [ ] Set up Stripe account
- [ ] Build pricing page — $299/mo, $799/mo, $2000/mo (public, no "contact sales")
- [ ] Build signup flow — email, password, Stripe checkout
- [ ] Gate dashboard behind auth (only paying users see their logs)
- [ ] Connect gateway logs to user account (each user only sees their own data)

---

## PHASE 4: CLI Scanner (Week 3)
Free tool that drives signups. The acquisition engine.

- [ ] Build `npx sevlex-scan` command
- [ ] Scan Claude Desktop config (`claude_desktop_config.json`)
- [ ] Scan Cursor config
- [ ] Scan VS Code config
- [ ] For each MCP server found, check:
  - [ ] Is it a known/verified server or random?
  - [ ] Does it have authentication?
  - [ ] Does it have access to filesystem or internet?
  - [ ] Is the package still maintained? (last update date)
  - [ ] Any hardcoded credentials in the config?
- [ ] Output plain English risk report (not technical jargon)
- [ ] End with CTA: "Monitor all servers at sevlex.io/signup"
- [ ] Publish to npm so `npx sevlex-scan` works
- [ ] Post on Hacker News

---

## PHASE 5: Basic Policy Rules (Week 3-4)
What separates you from just being a logging tool.

- [ ] Add rules UI to dashboard
- [ ] Rule: block specific tool by name
- [ ] Rule: rate limit (X calls per minute)
- [ ] Rule: alert via Slack webhook when tool is called
- [ ] Rule: block if PII detected in parameters (regex for SSN, credit card, email)
- [ ] Gateway enforces rules in real time before forwarding

---

## PHASE 6: Get First Customers (Week 2-4, parallel)
Do this while building. Do not wait until everything is done.

- [ ] Write outreach message (use template from competitor doc)
- [ ] Find 20 Series A AI startup CTOs on LinkedIn/Twitter
- [ ] Send 20 messages — Cresta, Decagon, Sierra, Glean, Hebbia, EvenUp, Ironclad, Writer, Vapi, Retell AI + 10 more
- [ ] Get 3 people on a 20-minute call
- [ ] Get 1 person to pay $299/month
- [ ] Get 5 paying customers total

---

## FUTURE (After 5 customers)
Do not touch these until you have paying customers asking for them.

- [ ] OAuth 2.1 authentication
- [ ] Anomaly detection (unusual tool call patterns)
- [ ] Per-team RBAC (different rules for different employees)
- [ ] Slack integration (beyond just alerts)
- [ ] PDF compliance export
- [ ] SSO / Okta / SAML
- [ ] SOC 2 certification
- [ ] VPC / self-hosted deployment
- [ ] MCP server catalog/registry
- [ ] ML-based threat detection

---

## CURRENT STATUS
- [x] Supabase project live
- [x] `tool_calls` table exists
- [x] Basic MCP server exists (`mcp-server.mjs`)
- [x] Supabase logging wired up (`proxy.mjs`)
- [ ] Real gateway (next thing to build)
