## **EXECUTIVE SUMMARY** 

## **The market exists. Confirmed by:** 

- 19+ funded competitors all going after the same problem 

- $11M+ in seed funding for category leaders (Runlayer, Obot has $35M) 

- Major enterprise vendors (CrowdStrike, Cloudflare, Cisco, Microsoft, AWS) all shipped MCP security in Q1 2026 

- Real breaches: Vercel (April 19 2026), Asana (June 2025), 437,000+ environments via CVE-2025-6514 

## **Three distinct competitor camps emerged:** 

1. **Native MCP-security startups** (Runlayer, MintMCP, Alter, Golf) — built specifically for MCP, going enterprise 

2. **Enterprise security giants** (CrowdStrike, Cloudflare, Cisco, Proofpoint, Qualys) — bolted MCP onto existing platforms, sell to F500 only 

3. **Open source / self-hosted** (Lasso, MCPX, ContextForge, Obot, Pipelock) — free but require DevOps team to run 

## **The single empty seat at the table:** 

- Self-serve signup with public pricing 

- Under $1000/month 

- 30-minute deployment, no DevOps, no sales call 

- Targeted at AI-native Series A companies (50-300 employees, CTO buying) 

Nobody is sitting in that seat as of April 30, 2026. That is your only realistic wedge. 

## **TIER 1: DIRECT COMPETITORS — Native MCP Security Startups** 

## **1. RUNLAYER** 

## **The most dangerous competitor. Treat as your north star.** 

## **Funding & Backing** 

- $11M seed 

- Khosla Ventures (Keith Rabois) + Felicis lead 

- David Soria Parra (lead MCP creator at Anthropic) as angel/advisor 

- Travis McPeak (Head of Security at Cursor) as advisor 

- Nikita Shamgunov (Neon founder) as advisor 

## **Team** 

- Andrew Berman (CEO) — 3rd time founder. Built Nanit (baby monitor) and Vowel (AI video conf, sold to Zapier 2024). Director of AI at Zapier. Built one of first MCP servers working with OpenAI and Anthropic. 

- Tal Peretz — Built Zapier MCP in 2 days (became Zapier's fastest growing product). Led ML in Israeli Air Force. 

- Vitor Balocco — Staff AI Engineer at Zapier. Speaks internationally on MCP security vulnerabilities. 

## **Product (13 distinct features)** 

1. **MCP Registry/Catalog** — 18,000+ pre-vetted servers, app-store style browsing 

2. **MCP Watch** — Fleet-wide shadow MCP discovery across all employee machines 

3. **Gateway/Control Plane** — Sits between AI clients and MCP servers, every tool call intercepted 

4. **Identity + SSO** — Okta, Entra, SCIM provisioning, group sync, per-user OAuth 

5. **Credential Management** — 1Password integration, runtime secret injection, no .env files 

6. **ToolGuard** — Custom ML models for tool poisoning, prompt injection, rug pulls, fake MCPs 

7. **PII + Token Masking** — Automatic redaction, configurable filters 

8. **Fine-Grained Permissions** — Drag-drop policy controls, parameter-level RBAC, approval workflows 

9. **Observability Dashboard** — Unified view of every MCP/skill/agent/plugin org-wide 

10. **Compliance** — SOC 2 + HIPAA + GDPR certified. AARM Extended Conformance (Vanta-backed) 

11. **VPC/Self-Hosted** — Deploy behind their VPC, zero data egress, or cloud 

12. **Cursor Hooks Partnership** — Official launch partner, blocks any non-Runlayer MCP in Cursor 

13. **Box Integration** — Official Box MCP server in their marketplace 

## **Customers (signed in 4 months)** 

- Gusto 

- dbt Labs 

- Instacart 

- Opendoor 

- (Plus dozens more "unicorns and public companies") 

## **Target Customer** 

**Enterprise IT and security teams at unicorn/public companies.** Their stated buyer is the CISO or Head of IT. Not engineering teams at startups. 

## **Go-To-Market Motion** 

- **Contact sales only.** No public pricing. 

- Heavy enterprise sales cycle. 

- Building marketplace partnerships (Cursor, Box). 

- Thought leadership via blog (Tal Peretz publishes attack research). 

- Inbound from "Anthropic's MCP creator backs Runlayer" PR. 

## **Pricing Model** 

- Not public. Enterprise contracts only. 

- Industry estimates: $50k–$500k+/year based on agent volume. 

## **Their Stated Weakness (from your perspective)** 

- Will not talk to a 50-person AI startup. 

- No self-serve. Period. 

- Mention in TechCrunch: "all-in-one security tool" — they want to be the platform, not a wedge product. 

## **What They Cannot Do** 

- Cannot serve customers under $50k contract value (their economics don't work). 

- Cannot deploy in 30 minutes without sales onboarding. 

- Cannot publish $500/month pricing without cannibalizing enterprise deals. 

## **2. MINTMCP** 

**The closest analog to what you're building, but enterprise-priced.** 

## **Funding & Backing** 

- Andrej Karpathy (founding member of OpenAI, ex-Tesla AI) 

- Jeff Dean (Google AI lead) 

- Scott Belsky, Tom Willerer, Brian Shultz 

- Coatue, Maven Ventures, Hustle Fund, WVV Capital 

## **Team** 

- Jiquan Ngiam (CEO) — co-founder 

- Mustafa Furniturewala (Coursera CTO, customer-quoted advisor) 

- Tobias Boelter (Head of Security at Harvey AI, customer-quoted advisor) 

## **Product** 

- **One-click STDIO deployment** — Local MCP servers wrapped as production services 

- **Automatic OAuth wrapping** — No code changes needed 

- **Virtual MCPs** — Per-team, per-role tool exposure (sales sees marketing Confluence only, etc.) 

- **Real-time monitoring dashboards** — Usage, anomalies, alerts 

- **Audit logging** — Every tool call recorded 

- **Real-time guardrails** — Block risky behavior 

- **Granular RBAC** — Read-only vs write tools per role 

- **OAuth 2.0 + SAML + SSO** — All major identity providers 

- **Cursor Hooks partner** (same as Runlayer) 

- **SOC 2 Type II audited** as of 2026 

- **STDIO-to-managed conversion** — Their proprietary tech to convert local servers to remote 

## **Customers** 

- Coursera (CTO publicly endorses) 

- Harvey AI (Head of Security publicly endorses) 

- "Enterprises deploying AI agents at scale" 

## **Target Customer** 

- **Regulated enterprises** (financial services, healthcare, legal) 

- Companies where "compliance team has veto power over AI tooling" 

- Mid-to-large companies with budget for SOC 2 vendors 

## **Go-To-Market Motion** 

- "Contact sales for enterprise pricing" — no public pricing 

- Heavy content marketing (their blog publishes 6+ comparison guides per month) 

- Cursor Hooks integration as wedge 

- Setup in "minutes" once contracted (pre-configured policies) 

## **Pricing Model** 

- Not public. Enterprise SLAs and dedicated support tiers. 

- Industry estimates: $20k–$200k+/year 

## **Their Stated Weakness** 

- Same as Runlayer — no self-serve, no public pricing 

- Closed source (vendor lock-in concern) 

- Limited to features the vendor exposes (less customization than open source) 

## **3. ALTER (YC S25)** 

**Most technically advanced auth approach. Enterprise-only.** 

## **Funding & Backing** 

- YC S25 batch 

- Partnered with former OpenAI cybersecurity experts for ongoing red teaming 

## **Team** 

- CEO — Former Platform Lead at Goldman Sachs (scaled GSAM post-trade infrastructure, helped launch GM Card at Apple) 

- CTO — Previously co-founded Compute.ai (acquired by Terizza 2025, sold into LSEG) 

## **Product (focused on identity layer)** 

- **Parameter-level RBAC + ABAC** — "DROP TABLE in prod during freeze never reaches production" 

- **Ephemeral credentials** — Seconds-lived, scope-narrowed tokens, auto-rotation 

- **Real-time approve/deny** — Identity verified on every call 

- **CISO-ready dashboard** — Full audit logs, real-time visibility 

- **Compliance** — SOC 2, HIPAA, GDPR 

- **MCP + Native tools support** — A2A coming soon 

- **No long-lived API keys** — Eliminates static credentials entirely 

## **Customers** 

- Not publicly disclosed. 

- "Beta access" still required as of April 2026. 

## **Target Customer** 

**Two ICPs they explicitly state:** 

1. "Startups building AI-first products that need zero-trust access controls" 

2. "Infosec teams looking to eliminate long-lived credentials" 

## **Go-To-Market Motion** 

- **Beta-only access at alterai.dev** 

- Enterprise sales for infosec teams 

- YC network and Goldman Sachs alumni network 

## **Pricing Model** 

- Not public. Beta access by request. 

## **Their Stated Weakness** 

- Still in beta as of April 2026 

- Complex zero-trust setup requires security team buy-in 

- Built for regulated enterprises (their team's background) 

## **4. GOLF (YC)** 

**Closest to your strategy. Open source wedge + paid enterprise.** 

## **Funding & Backing** 

- YC funded 

- Wojciech (CEO) — started building first company at 14, scaled to $200k revenue. Dropped out of university. Built AI SDR previously. 

## **Product** 

## **Two-pronged:** 

1. **GolfMCP (open source framework)** — File-based MCP server framework. Handles auth, tracing, transport, error reporting, deployment. 

2. **Golf Gateway (paid)** — Hosted layer with: 

   - Shadow MCP discovery across endpoints 

   - MCP-layer governance (not LLM layer — explicit positioning) 

   - Sub-millisecond enforcement latency 

   - SSO + SIEM integration 

   - 90-day audit trail 

   - Pre-mapped compliance evidence (SOC 2, ISO 27001, NIST AI RMF, FINRA) 

   - SOC 2 Type II certified 

3. **Golf Scanner (open source CLI)** — Scans IDE/AI tool configs, identifies every MCP server, runs ~15 security checks. Posted on Hacker News March 2026. 

## **Their Customer Insight (Direct Quote from YC Page)** 

"Over the past few weeks, we spoke with over 40 teams building MCP servers. Everyone hit the same walls: wiring up authentication, figuring out how to trace agent calls, setting up working transports, and debugging behavior in production. The MCP spec doesn't cover these parts. Teams told us it takes 2-4 weeks to get that to production." 

## **Target Customer** 

## **Enterprises specifically — their stated focus is:** 

- "Engineering, security, and compliance teams" 

- Financial services (FINRA-aware) 

- Companies subject to EU AI Act (penalties up to 7% of global revenue) 

- Customer use case: "When an engineer connects Cursor to a codebase or Claude Code to a production database, Golf notifies the security team instantly" 

## **Go-To-Market Motion** 

- **Open source framework as developer adoption hook** (this is the smart play) 

- **Open source scanner shipped on HN** for awareness 

- **Paid enterprise tier** for governance 

- This is closest to what you should do — but they're focused on security buyers, not CTOs. 

## **Pricing Model** 

- Open source: Free 

- Enterprise: Contact sales 

## **Their Stated Weakness** 

- Compete head-on with Runlayer at the enterprise level — Runlayer has more funding and bigger advisors. 

- Open source framework is competing against MintMCP's STDIO conversion. 

## **5. REFORTIFAI (YC)** 

## **Product** 

- Runtime AI agent monitoring 

- Tool call interception 

- Governance policy enforcement 

- Attack blocking (prompt injection, memory poisoning, privilege escalation) 

## **Target Customer** 

- Enterprise security teams 

## **Status** 

- Limited public information; YC funded. 

## **TIER 2: ENTERPRISE SECURITY GIANTS (Adjacent Threats, Not Direct)** 

## **6. CROWDSTRIKE — Falcon for AI** 

**Generally available shadow MCP discovery as of March 2026.** 

## **Product** 

- **AI Discovery in Falcon Exposure Management** — Auto-discovers AI apps, agents, LLM runtimes, MCP servers, IDE extensions across endpoints in real time 

- **Falcon AIDR** — Runtime guardrails for Microsoft Copilot Studio agents 

- **Application Insights for AI** — Cloud application layer AI discovery 

- **Falcon Data Protection for Cloud** — eBPF-powered data flow visibility into AI services 

- **Charlotte AI Agentic Workflows** — AI agents helping security analysts 

## **Target Customer** 

- **F500 enterprises** — existing CrowdStrike Falcon customers only 

- CISOs, SOC teams 

## **Go-To-Market Motion** 

- Bolted on top of existing Falcon platform sales 

- Enterprise contracts ($100k+/year minimum for Falcon) 

- Channel partner driven 

## **Why They're Not Your Competitor** 

- Will not sell standalone MCP security 

- Cannot serve customers without existing Falcon deployment 

- Too expensive for any startup 

## **7. CLOUDFLARE — MCP Server Portals** 

## **Reference architecture published April 2026. Strong enterprise play.** 

## **Product** 

- **MCP Server Portals** — Identity-based access to authorized servers 

- **Cloudflare Access** — Authentication for remote MCP servers 

- **AI Gateway** — Cost control, LLM mediation, Code Mode 

- **Cloudflare Gateway** — Shadow MCP detection across enterprise network 

- **DLP profiles** — Block, redirect, log MCP payloads 

## **Target Customer** 

- **Existing Cloudflare enterprise customers** 

- They literally say: "for organizations advancing on their own enterprise MCP journeys, we recommend starting by putting your existing remote and third-party MCP servers behind Cloudflare MCP server portals" 

## **Go-To-Market Motion** 

- Pull-through sales to existing Cloudflare customers 

- Major reference architecture publication for thought leadership 

- Free tier exists but security features are enterprise 

## **Why They're Not Your Direct Competitor** 

- Only addressable to existing Cloudflare customers 

- No standalone MCP security product 

## **8. CISCO AI Defense** 

**Announced at RSA Conference 2026. Major industry validation.** 

## **Product** 

- **Zero-trust MCP gateway** — Cisco's own 

- **Identity-tied access control** — Real-time behavior 

- **Just-in-time short-lived tokens** for MCP server access 

- **Centralized agent directory** — Map every agent identity to human owner 

- **Real-time behavioral inspection** — Block unsafe actions, data exfiltration 

- **mcp-scanner (open source)** — YARA + LLM judge for tool definition scanning (DefenseClaw project) 

## **Target Customer** 

- F500 enterprises (existing Cisco Talos / Duo / Umbrella customers) 

## **Why They're Not Your Direct Competitor** 

- Massive enterprise sales motion 

- Bundled with broader Cisco security stack 

## **9. PROOFPOINT AI MCP Security** 

## **Most polished enterprise MCP security marketing as of March 2026.** 

## **Product (full feature list, very similar to Runlayer)** 

- **Automated discovery** — Servers across devices, networks, cloud 

- **Risk classification** — Unauthenticated, unencrypted, externally hosted labels 

- **Centralized policy enforcement** — Auth, authz, content controls 

- **Governed traffic routing** — Auto-redirect to secure gateway 

- **Continuous monitoring** — Usage, access, behavior tracking 

- **Multi-gateway architecture** — Distributed with central config 

- **OAuth 2.0 authentication** for every connection 

- **Role + agent-based authz** — Limits per user/agent 

- **Content inspection** — PII/sensitive data detection, blocking, redaction 

- **OpenTelemetry integration** — SIEM and observability 

- **Audit-ready transaction forensics** — Per-event detail 

## **Target Customer** 

- Existing Proofpoint enterprise customers (typically large, regulated) 

## **Why They're Not Your Direct Competitor** 

- Enterprise email security incumbent — different sales motion 

- Extends existing Proofpoint contracts 

## **10. QUALYS TotalAI** 

## **Strong on shadow MCP discovery specifically.** 

## **Product** 

- **MCP server discovery** — Network, host, supply chain perspectives 

- **Capability mapping** — What each server exposes 

- **Risk fingerprinting** — Auth weaknesses, privilege levels 

- **Security assessment** (in development) — Tool poisoning, injection, credential exposure 

## **Target Customer** 

- Existing Qualys vulnerability management customers (large enterprises) 

## **11. MICROSOFT — Foundry MCP + AI Gateway** 

## **Bundled with Azure ecosystem.** 

## **Product** 

- **Foundry Agent Service** — Agent orchestration 

- **AI Gateway** — Single entry point for MCP tools 

- **AI Gateway Prompt Shield** — Network-layer prompt injection protection (Entra-integrated) 

- **Azure API Center catalog** — Internal MCP server registry 

- **Built-in tracing, monitoring, evaluations** 

## **Target Customer** 

- Azure-committed enterprises only 

## **12. AWS — AgentCore** 

## **AWS-native. Usage-based pricing.** 

## **Product** 

- Agent identity and gateway 

- Bedrock + AgentCore integration 

## **Target Customer** 

- AWS-committed enterprises only 

## **13. KONG AI Gateway** 

## **Product** 

- AI MCP OAuth2 plugin 

- Extends existing Kong API gateway with MCP protocol support 

- Reuses Kong's existing auth, rate limiting, monitoring 

## **Pricing** 

- **Kong Gateway Enterprise (self-hosted) or Konnect (hybrid cloud)** 

- $50k+/year minimum 

## **Target Customer** 

- Existing Kong API management customers (large enterprises) 

## **TIER 3: OPEN SOURCE / SELF-HOSTED** 

## **14. LASSO SECURITY MCP Gateway** 

## **First open source MCP security gateway (April 2025). Tel Aviv based.** 

## **Funding** 

- Gartner Cool Vendor 2024 for AI Security 

- Specific funding undisclosed 

## **Product (open source on GitHub)** 

- **Plugin-based proxy/orchestrator** for all MCP interactions 

- **Agnostic guardrails** — Configurable security filters on requests AND responses 

- **Presidio plugin** — PII detection (separate install) 

- **Lasso plugin** — Their advanced AI safety guardrails (paid API key) 

- **Security scanner** — Server reputation analysis before loading 

- **xetrack plugin** — DuckDB/SQLite logging for tool calls 

- **Token/credential masking** 

- **Unified visibility dashboard** 

## **Configuration (from their actual GitHub)** 

json 

{ 

"mcpServers": { 

"mcp-gateway": { 

"command": "mcp-gateway", 

"args": ["--mcp-json-path", "~/.cursor/mcp.json", "-p", "lasso"], "env": { "LASSO_API_KEY": "<token>" } } } } 

## **Target Customer** 

- Developers willing to self-host 

- Companies with DevOps teams who want open source transparency 

## **Go-To-Market Motion** 

- **Open source as adoption funnel** 

- Paid Lasso API key for enterprise guardrails 

- Contact sales for full enterprise platform 

## **Pricing Model** 

- Open source: Free 

- Lasso API key: Pricing not public 

- Full Lasso GenAI Security Platform: Enterprise pricing 

## **Why They're Adjacent (Not Direct)** 

- They sell the broader GenAI security platform; MCP gateway is a wedge 

- Self-hosted means customer owns ops burden 

- Plugin model means complexity to set up 

## **15. LUNAR.DEV / MCPX** 

## **Gartner Representative Vendor for MCP Gateways.** 

## **Product** 

- **MCPX (open source core)** — Tool Groups, customization, local + remote auth 

- **Multi-tier RBAC** — Global, service, individual tool level 

- **Tool Groups** — Different teams see different subsets of same MCP server 

- **Audit trail** — Prompt → LLM decision → tool call → API response 

- **Latency tracking, cost monitoring, request tracing** 

- **Enterprise IdP integration** (Okta, Entra) — paid tier only 

- **Vulnerability scanning** — paid tier only 

- **Token/cost monitoring** 

## **Customers** 

- Fortune 200 enterprises (named in their marketing) 

## **Target Customer** 

- DevOps-mature engineering teams 

- Banks balancing developer velocity with governance 

## **Go-To-Market Motion** 

- Open source MCPX for community adoption 

- Enterprise tier for SOC 2, IdP integration, vuln scanning 

- Gartner recognition driving inbound 

## **Pricing Model** 

- Open source: Free 

- Enterprise: Contact sales 

## **16. IBM CONTEXTFORGE** 

## **Apache 2.0 licensed. 3,500+ GitHub stars.** 

## **Product** 

- Federation across MCP servers, A2A protocols, REST/gRPC APIs 

- Most feature-complete open source option 

- Multi-transport: HTTP, WebSocket, SSE, STDIO 

- Redis backend for distributed caching 

- Protocol bridging (REST/gRPC → MCP) 

## **Target Customer** 

- Large distributed orgs (10,000+ employees) 

- Teams wanting vendor independence 

## **Critical Note** 

- **IBM explicitly disclaims official support.** Community project only. 

## **17. OBOT** 

## **$35M seed funding. Open source all-in-one platform.** 

## **Funding** 

- $35M seed (significant for open source MCP) 

## **Product** 

- Hub-and-spoke architecture (eliminates N×M complexity) 

- MCP server catalog with searchable directory and trust levels 

- Kubernetes-native 

- Enterprise IdP support (Okta, Entra, GitHub, Google) in enterprise edition 

- Nanobot framework for agent orchestration 

- Multi-tenant by design 

## **Target Customer** 

- Platform teams building custom AI agent infrastructure 

- Teams requiring vendor independence 

## **Pricing** 

- Open source: Free 

- Enterprise: License required for IdP and risk scoring 

## **18. PIPELOCK (open source - Apache 2.0)** 

## **Product** 

- Network-layer enforcement (different from gateway-layer) 

- 48 credential pattern detection (with base64, hex, URL encoding awareness) 

- 25 injection patterns through 6 normalization passes 

- Entropy analysis + environment variable leak detection 

- SSRF protection (private IPs, cloud metadata, link-local) 

- DNS rebinding protection 

- All scanning logic open source — you can audit every regex 

## **Target Customer** 

- Teams that want full transparency and self-host everything 

## **19. DOCKER MCP Gateway** 

## **Product** 

- Container-native MCP server hosting 

- docker mcp CLI plugin 

- Integrates with Docker Compose 

## **Target Customer** 

- Teams already invested in Docker ecosystem 

- Container-native infrastructure 

## **Performance Note** 

- 50-200ms container management latency overhead 

- Not as fast as purpose-built gateways 

## **TIER 4: SHADOW AI / DISCOVERY SPECIALISTS** 

## **20. CLUTCH SECURITY** 

## **First-in-market positioning for shadow MCP discovery.** 

## **Product** 

- **MCP server discovery on developer machines** 

- Identifies Copilot, Claude, Cursor consuming MCP servers 

- Maps credentials each server accesses 

- Risk classification per server 

## **Target Customer** 

- Enterprise security teams 

## **21. OBSIDIAN SECURITY** 

## **Used by Snowflake CISO (publicly endorsed).** 

## **Product** 

- Browser-level discovery 

- API integration scanning 

- Agent monitoring 

- Maps every agent + MCP connection 

- "Detected over 10,000 routing numbers entered into AI prompts" 

## **Target Customer** 

- Fortune 1000, Global 2000 enterprises 

## **22. KNOSTIC (Kirin)** 

## **Product** 

- IDE-layer shadow AI detection 

- MCP proxy capturing every AI agent interaction in real-time 

- Purpose-built for development environments 

## **23. OPERANT AI** 

## **Product** 

- Shadow Escape zero-click exploit detection 

- Inline PII redaction 

- AI-DR (AI Detection and Response) 

- Publishes leading MCP security research ("2026 Guide to Securing MCP") 

## **Target Customer** 

- Research-heavy enterprise security teams 

## **24. AUVIK Shadow AI Detection** 

## **Product** 

- Lightweight endpoint collectors 

- 125,000+ SaaS application database 

- 30-day QuickScan 

- Browser extension AI tool tracking 

## **Target Customer** 

- IT teams + MSPs (managed service providers) 

## **25. NUDGE SECURITY** 

## **Product** 

- AI discovery (1,000+ AI tools tracked) 

- OAuth grant inventory 

- Email-based discovery (historical) 

- SaaS Security Posture Management adjacent 

## **26. PORTAL26** 

## **Product** 

- Real-time shadow AI detection (30-min deployment claim) 

- LLM database real-time updates 

- Usage pattern tracking 

## **27. LOOKOUT AI Visibility & Governance** 

## **Product** 

- **Mobile-native** shadow AI discovery (launched April 29 2026) 

- Sanctioned vs unsanctioned AI use on mobile devices 

- Policy enforcement on mobile 

## **Target Customer** 

- Enterprises with significant mobile workforce 

## **28. ARMORCODE AIEM** 

## **AI Exposure Management.** 

## **Product** 

- Continuous AI signal ingestion across SASE, EDR, firewalls, cloud 

- Live system of record for AI inventory 

- Owned, policy-driven decisions 

- Auditable records for board/regulators 

## **Target Customer** 

- Large enterprise CISOs 

## **TIER 5: ADJACENT TOOLS (Not Security-First)** 

## **29. COMPOSIO** 

## **Product** 

- 500+ pre-built integrations 

- Unified authentication abstraction layer 

- 25+ agent framework support (LangChain, CrewAI, AutoGen) 

- 18,370+ GitHub stars 

- SOC 2 Type II 

## **Pricing** 

- **Free tier available** 

- Paid plans for scaling 

## **Why Not Direct Competitor** 

- Integration breadth focus, not security focus 

- Different value proposition (build vs buy integrations) 

## **30. TRUEFOUNDRY** 

## **Product** 

- Sub-3ms gateway latency (performance leader) 

- 350+ requests per second per vCPU 

- OAuth 2.0 identity injection 

- LLM serving + MCP combined 

## **Target Customer** 

- High-frequency trading, real-time analytics 

- Performance-critical deployments 

## **Pricing** 

- Full platform commitment required 

## **31. PORTKEY** 

## **Product** 

- LLM gateway with MCP capabilities (added) 

- OAuth integration with Okta, Azure AD 

- Multi-MCP multiplexing 

## **Why Not Direct Competitor** 

- LLM-first, not security-first 

- Different buyer persona (ML engineers, not security) 

## **32. HYPR MCP** 

## **Product** 

- $10/month MCP hosting 

- Free tier for individual developers 

- Not security focused 

## **33. PREFECT HORIZON** 

## **Product** 

- MCP server lifecycle: Deploy + Registry + Gateway + Agents 

- Built by FastMCP team (FastMCP powers ~70% of all Python MCP servers) 

## **Target Customer** 

- Python-first teams using FastMCP 

## **34. POMERIUM** 

## **Product** 

- Zero-trust proxy specifically for MCP 

- Live policy evaluation per request 

- Identity assertion (no raw OAuth tokens to MCP server) 

- SIEM integration 

## **Pricing** 

- Open source core, enterprise tier 

## **COMPETITIVE MATRIX** 

## **Self-Serve & Pricing Comparison** 

|**Company**|**Self-Serve**|**Public**|**Free Tier**|**Min Price**|**Setup Time**|
|---|---|---|---|---|---|
|||**Pricing**||||
|Runlayer|❌|❌|❌|~$50k+/yr|Days (sales)|
|MintMCP|❌|❌|❌|~$20k+/yr|Days (sales)|
|Alter|❌Beta|❌|❌|Unknown|Beta access|
||only|||||
|Golf|✅Open|❌|✅|Unknown|Hours (OSS) /|
||source|Enterprise|Framework|enterprise|Days (paid)|



|Lasso|✅Open|❌|✅OSS|Unknown|Hours (OSS)|
|---|---|---|---|---|---|
||source|Enterprise||||
|MCPX/Lunar|✅Open|❌|✅OSS|Unknown|Hours (OSS)|
||source|Enterprise||||
|Obot|✅Open|❌|✅OSS|Unknown|K8s setup days|
||source|Enterprise||||
|Composio|✅|✅|✅|$0|Minutes|
|Hypr|✅|✅|✅|$10/mo|Minutes|
|**YOUR**|✅|✅|✅|**$299/mo**|**30 min**|
|**PRODUCT**||||||



## **Feature Coverage Comparison** 

|**Feature**|**Runlay**|**MintMC**|**Lass**|**MCPX**|**Gol**|**Cloudflar**|**CrowdStrik**|**YOU**|
|---|---|---|---|---|---|---|---|---|
||**er**|**P**|**o**||**f**|**e**|**e**||
|Gateway|✅|✅|✅|✅|✅|✅|❌|✅|
|proxy|||||||||
|Audit|✅|✅|✅|✅|✅|✅|✅|✅|
|logging|||||||||
|Shadow|✅|❌|❌|❌|✅|✅|✅|🟡|
|MCP scan||||||||Plan|
|PII detection|✅|✅|✅|❌|✅|✅|✅|🟡|
|||||||||Plan|
|OAuth 2.1|✅|✅|🟡|🟡|✅|✅|❌|🟡|
|||||||||Plan|
|SSO/SAML|✅|✅|❌|✅|✅|✅|✅|❌|
|||||Ent||||Future|
|Compliance|✅|✅|❌|✅|✅|✅|✅|❌|
|certs||||Ent||||Future|
|ML threat|✅|🟡|❌|❌|❌|❌|✅|❌|
|detect||||||||Future|



MCP catalog ✅ 🟡 ❌ 🟡 ❌ ❌ ❌ ❌ Future Self-hosted/ ✅ ✅ ✅ ✅ 🟡 ❌ ❌ ❌ VPC Future 

🟡 = Partial / coming soon 

## **THE EMPTY SEAT — WHERE YOU FIT** 

## **Customer Segments by Vendor** 

F500 / unicorns / public companies ├── Runlayer ✅ ├── MintMCP ✅ ├── CrowdStrike ✅ ├── Cloudflare ✅ ├── Cisco ✅ ├── Proofpoint ✅ ├── Qualys ✅ └── Palo Alto ✅ 

Mid-market enterprises ($30M-$500M revenue) ├── Runlayer ✅ (going down-market) ├── MintMCP ✅ ├── Alter ✅ ├── Golf ✅ └── Obot ✅ 

Series A AI-native startups (50-300 employees)  ← YOUR ICP └── ❌ NOBODY SERVING THEM AT $500/MONTH SELF-SERVE 

Pre-seed / hobbyist developers ├── Lasso (free open source) ├── Composio (free tier) ├── Hypr ($10/month) ├── Pipelock (open source) └── Obot (free K8s) 

**Your seat: Series A AI-native startup, CTO buying, $300-2000/month, self-serve, working in 30 minutes.** 

## **WHAT EACH COMPETITOR'S GTM TELLS YOU** 

## **Runlayer's GTM Story (the playbook to learn from)** 

1. **Founder credibility first** — Got David Soria Parra (lead MCP creator) as advisor before launching 

2. **High-profile customers in stealth** — Signed Gusto, Instacart, dbt Labs in 4 months before press 

3. **Coordinated launch** — TechCrunch + Felicis blog + customer quotes 

4. **Marketplace partnerships** — Cursor Hooks + Box integration as distribution 

5. **Standards leadership** — AARM Extended Conformance partnership 

6. **Thought leadership** — Tal Peretz publishing OX Security research breakdowns 

**Lesson for you:** You can't outspend them on PR. You CAN out-execute them on a different segment. 

## **MintMCP's GTM Story** 

1. **Massive name backers as social proof** — Karpathy, Jeff Dean 

2. **Comparison content marketing** — Their blog is 80% "X vs Y" gateway comparisons 

3. **Cursor Hooks integration** (parallel to Runlayer) 

4. **Customer endorsements from CTOs** — Coursera, Harvey AI quotes everywhere 

5. **SOC 2 Type II as credibility moat** — They mention it in every blog post 

**Lesson for you:** Comparison content works. You should publish "X vs MintMCP for AI startups" to ride their search traffic. 

## **Golf's GTM Story (closest to yours)** 

1. **Open source framework as developer hook** — GolfMCP framework 

2. **Open source scanner as awareness hook** — Posted on HN 

3. **40-customer interview as validation proof** — Mentioned in YC application 

4. **Enterprise tier as monetization** — Same playbook you should consider 

**Lesson for you:** This is the closest playbook. Steal it. Open source scanner → free tier → paid gateway. 

## **Lasso's GTM Story** 

1. **First open source MCP gateway** — claimed in press release 

2. **Plugin architecture for extensibility** 

3. **Free OSS + paid Lasso API key** 

4. **Gartner Cool Vendor 2024** validation 

**Lesson for you:** You missed the "first" claim — they have it. But you can claim "first self-serve" or "first for startups." 

## **WHAT YOU SHOULD ACTUALLY BUILD (RANKED BY PMF EVIDENCE)** 

## **Tier 1: Build Immediately (0-30 days)** 

Validated by every competitor having it AND being mentioned by 40+ teams Golf interviewed. 

1. **Gateway proxy with audit logging** ✅ DONE TODAY 

2. **Real-time dashboard showing tool calls** — 2 days work 

3. **PDF compliance export** — 1 day work 

4. **Stripe integration + self-serve signup** — 2 days work 

5. **Public pricing page** — 1 day work 

## **Tier 2: Build for First Customers (30-60 days)** 

Differentiation features that justify $500/month vs free open source. 

6. **Shadow MCP scanner CLI** (free tier hook) — 3 days work 

7. **PII detection via Claude API** — 2 days work 

8. **5 simple policy rules** (block tools, rate limits, time-of-day) — 1 week work 

9. **Slack alerts integration** — 1 day work 

## **Tier 3: Build After 5+ Customers (60-90 days)** 

Required to grow customers to $2000/month tier. 

10. **OAuth 2.1 authentication** — 3-4 weeks work (need help) 

11. **Anomaly detection via Claude API** — 1 week work 

12. **Per-team RBAC** — 2 weeks work 

## **Tier 4: Build After YC (90+ days)** 

Enterprise upsell features. 

13. **SSO/SAML** — Series A funding required 

14. **SOC 2 Type II** — 6-12 months + $30k+ 

15. **VPC/self-hosted deployment** 

16. **MCP catalog/registry** 

17. **ML-based threat detection** 

## **WHAT NONE OF THE COMPETITORS HAVE FIGURED OUT** 

After analyzing all 30+ competitors, three things are still missing in the market: 

## **1. Pricing transparency** 

Every competitor except Composio and Hypr hides pricing behind "contact sales." This creates massive friction for any startup CTO trying to evaluate options without a sales call. 

**Your move:** Public pricing page. $299, $799, $2000 tiers. Stripe checkout. Done. 

## **2. Sub-1-hour deployment for non-DevOps teams** 

Open source options (Lasso, MCPX, Obot) require Kubernetes or careful config. Enterprise options (Runlayer, MintMCP) require sales calls before deployment. 

**Your move:** "5-minute deployment" hero claim. Single npm install command. Working dashboard immediately. 

## **3. Free shadow MCP scanner that converts to paid** 

## **gateway** 

Golf has a scanner. CrowdStrike has discovery. None of them is positioned as a free wedge that converts to $500/month gateway. 

**Your move:** Free CLI scanner → "you have 12 unknown MCP servers" → upgrade to gateway to monitor and control them. 

## **WHO TO INTERVIEW FIRST (ICP VALIDATION)** 

Before building any more features, talk to these specific company types: 

## **Top 20 Series A AI-Native Companies to Reach Out To** 

These are companies likely using MCP and likely to have your specific pain: 

1. **Cresta** — AI for contact centers 

2. **Decagon** — AI customer support 

3. **Sierra** — Conversational AI agents (Bret Taylor) 

4. **Glean** — Enterprise AI search 

5. **Hebbia** — AI for finance/legal research 

6. **Harvey** — AI for legal (already MintMCP customer — caution) 

7. **EvenUp** — AI for personal injury law 

8. **Ironclad** — Contract AI 

9. **Writer** — Enterprise AI writing 

10. **Adept** — AI agents for enterprise (if still operating) 

11. **Lutra** — AI agents 

12. **Mintlify** — AI documentation 

13. **Cohere** — Enterprise LLMs 

14. **AssemblyAI** — Speech AI 

15. **Vapi** — Voice AI agents 

16. **Retell AI** — Voice AI 

17. **Bland AI** — Voice AI 

18. **Cursor** — Already Runlayer partner (caution) 

19. **Continue** — Open source AI coding 

20. **Superhuman** — AI email 

**Caveat:** Cursor and Harvey are already partnered with Runlayer/MintMCP. Avoid those. Focus on the others. 

## **The Outreach Message (refined from this analysis)** 

"Hey [name] — quick one. With Vercel's MCP-related breach 2 weeks ago and [their company]'s enterprise customers asking for AI agent audit trails, how are you handling MCP security right now? 

Most Series A teams I talk to either: (a) built it themselves in 2-4 weeks, (b) tried Runlayer/MintMCP but couldn't justify the price, or (c) haven't gotten to it yet. 

Curious where you are. Happy to share what other founders are doing." 

This message uses real news (Vercel breach), real competitor names (Runlayer/MintMCP — they will recognize them), and gives them three options to self-identify. 

## **THE BOTTOM LINE** 

## **Market validation: CONFIRMED.** 

- 30+ companies competing in this category 

- $11M-$35M+ in seed funding for category leaders 

- Major enterprise vendors all entered Q1 2026 

- Real breaches creating real urgency 

## **Your wedge: CONFIRMED.** 

- Nobody serves Series A AI-native startups at $500/month with self-serve 

- Every competitor either contact-sales-only OR DevOps-required-self-hosted 

- Gap is real, persistent, and widening (as competitors go more upmarket) 

## **Your build path: CLEAR.** 

- You already have the core gateway working (✅ done today) 

- 30 days to MVP that can charge $299/month 

- 90 days to 10 customers 

- Apply YC Fall 2026 with traction 

## **Your only real risk:** 

- Customer doesn't actually feel pain at $500/month (they tolerate building it themselves for 2-4 weeks) 

- Competitor goes downmarket faster than you go upmarket 

- You can't get the OAuth authentication right without a co-founder who's done it 

## **Your single most important next action:** 

- Send 20 messages to Series A AI company CTOs tomorrow 

- Validate the pain before building anything else 

- Get 1 customer paying $299/month within 14 days 

- Everything else flows from that 

## **END OF DOCUMENT** 

This is your foundation. Reference it before every product decision. Update it as you learn from customer conversations. Don't build features that don't have direct customer validation. 

Now go rest. Tomorrow, send the 20 messages. 

