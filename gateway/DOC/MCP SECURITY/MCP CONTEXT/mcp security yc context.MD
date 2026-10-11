# MCP Security — Master Context
## Founder: Meet Panchal | Goal: YC Fall 2026

---

## One-Line Pitch
"Every AI startup building with MCP is one enterprise security review away from losing a $50k deal. We make them enterprise-ready in one day."

---

## Who I Am
Meet Panchal. Indian founder. Ahmedabad. 6 hours/day fully committed. Know Next.js, TypeScript, Python, Claude API. Proved outreach works — 3,200 LinkedIn connections in 7 weeks for another product. No degree. No US network yet. No co-founder yet. No customers yet. Two failed products behind me (don't bring up unless relevant).

---

## What We're Building
MCP Security Gateway. Real infrastructure — not an AI wrapper, not a report generator. Sits in the critical path between AI agents and MCP servers. Every tool call passes through our system. We authenticate it, authorize it, log it, can block it. Remove our product and the customer's entire AI agent setup breaks. That's the moat.

**NOT:** A PDF report. A compliance document. An AI wrapper. A good-to-have product.

**IS:** Infrastructure. Like Cloudflare but for MCP.

---

## The Problem (Verified Facts Only)

MCP (Model Context Protocol) is Anthropic's standard for connecting AI agents to external tools. Released November 2024. Now supported by Anthropic, OpenAI, Google, Microsoft.

**Security facts (all verified):**
- 88% of MCP servers require credentials but 53% use insecure hard-coded static secrets
- Only 8.5% use proper OAuth (Astrix Security, 5,200 servers analyzed, Feb 2026)
- 200,000 servers at risk from Anthropic's own MCP design flaw (The Register, April 2026)
- Gartner: 75% of API gateway vendors will have MCP features by 2026
- Cisco announced MCP security tooling at RSA Conference 2026 — category is mainstream

**Real breaches:**
- Vercel breached April 19 2026 via OAuth token from AI tool (Context AI) — $2M data sold on BreachForums — covered by TechCrunch, BleepingComputer, The Register
- Asana MCP breach June 2025 — customer data leaked between instances — offline for 2 weeks
- CVE-2025-6514 — mcp-remote npm package RCE — 437,000+ developer environments compromised
- CVE-2025-49596 — CVSS 9.4 — unauthenticated command injection

**The exact scenario your product solves:**
1. Startup builds AI agent using Claude/GPT with MCP
2. Agent accesses database, sends emails, calls APIs
3. Enterprise buyer interested — $50k-$200k deal
4. Enterprise security team asks: "How do you audit your AI agent? Control permissions? Prove data access?"
5. Startup has no answer
6. Deal dies
7. Your product gives them that answer in one day

---

## Two Customer Segments (Both Matter)

**Segment 1 — Startups (primary wedge, first 90 days):**
- Seed to Series A AI startup
- 2-10 engineers
- Building with MCP
- Active enterprise deal stalled due to security questions
- Price: $99-299/month
- Close fast → get traction → get YC

**Segment 2 — Enterprise (parallel, longer cycle):**
- Mid to large companies deploying AI agents internally
- Need SOC 2, HIPAA, GDPR compliance
- Need SSO, SAML, dedicated deployment, SLAs
- Price: $2,000-5,000/month
- 3-6 month sales cycle but bigger revenue

**GTM sequence:** Startups close in days/weeks. Enterprise takes months. Run both in parallel but startups get you to YC. Enterprise gets you to Series A.

---

## Full Product Spec

**Startup tier ($99-299/month) — Build first:**
- Sign up and deploy in under 10 minutes
- No DevOps required
- OAuth 2.1 authentication out of the box
- Complete audit log of every tool call (agent ID, tool name, parameters, response, timestamp)
- One-click compliance report PDF
- PII detection and flagging
- Basic policy controls — block specific tools
- Works with any MCP server — no code changes required

**Enterprise tier ($2,000-5,000/month) — Build after first customers:**
- Everything in startup tier
- SSO and SAML integration
- Dedicated cloud deployment
- Custom data retention policies
- SLA guarantees
- Dedicated Slack channel support
- SOC 2 Type II compliance reports
- Custom policy engine
- RBAC at user and team level

**Week 1 MVP — build only this:**
- Node.js proxy in front of any MCP server
- Every tool call logged to PostgreSQL (Supabase)
- Basic Next.js dashboard showing logs
- One-click PDF export of logs
- Nothing else. Charge $99/month from day one.

---

## Complete Competitor Landscape (19 Companies)

### Tier 1 — Most Dangerous (Direct MCP Security)

**Runlayer — $11M Khosla Ventures**
- All-in-one MCP security: gateway + threat detection + observability + enterprise permissions
- David Soria Parra (lead MCP creator at Anthropic) as angel/advisor
- Already signed unicorns: Gusto, dbt Labs, Instacart, Opendoor
- Third-time founder (Nanit, Vowel sold to Zapier)
- Threat level: HIGHEST. Best positioned competitor.
- Their weakness: Enterprise only. No self-serve startup tier.

**MintMCP — Karpathy + Jeff Dean + Coatue backed**
- SOC 2 Type II certified. One-click STDIO deployment. OAuth wrapping. Audit logging. RBAC.
- Most complete managed platform right now.
- No public pricing — contact sales only.
- Threat level: HIGH. Most similar product.
- Their weakness: No self-serve. No startup pricing. Must talk to sales.

**Alter — YC S25**
- Zero-trust identity platform. Parameter-level RBAC/ABAC. Ephemeral credentials. CISO dashboard.
- Founders from Goldman Sachs. Targets regulated enterprises.
- Request beta access only — not self-serve.
- Threat level: HIGH. Going upmarket, not downmarket.
- Their weakness: Complex. Enterprise sales cycle. Not for startups.

**Golf — YC funded**
- Shadow AI visibility across entire organizations. MCP control for enterprise IT teams.
- Threat level: MEDIUM. Different customer (large org IT teams).
- Their weakness: Overkill for startups. Enterprise only.

**Refortifai — YC funded**
- Monitors AI agents. Intercepts tool calls. Enforces governance policies. Blocks attacks.
- Covers prompt injection, memory poisoning, privilege escalation.
- Threat level: MEDIUM. Similar technical approach.

### Tier 2 — Security Focused

**Lasso Security — Open source**
- Security-first gateway. Prompt injection protection. PII detection. Real-time threat detection.
- Open source core. Contact sales for enterprise.
- Their weakness: Self-hosted. You own operational burden. Not managed.

**Operant AI**
- Shadow Escape zero-click exploit detection. Inline PII redaction. AI-DR.
- Publishes cutting-edge MCP security research.
- Their weakness: Research-heavy. Enterprise only. Not for startups.

**MCPX / Lunar.dev — Open source, Gartner recognized**
- Tool-level access control. Immutable audit trails. DLP. Parameter locking.
- Self-hosted. Contact sales for enterprise.
- Their weakness: You own operational burden. High setup friction.

### Tier 3 — Infrastructure Adding Security

**Cloudflare MCP Portals** — Tightest security model. Only for existing Cloudflare customers.
**Amazon AgentCore** — AWS-native. Only for AWS ecosystem. Usage-based.
**Microsoft MCP Gateway** — Azure-native. Kubernetes. Only for Azure-committed enterprises.
**Kong AI Gateway** — $50k+/year. For existing Kong customers only.
**TrueFoundry — Gartner recognized** — Performance leader (sub-3ms). Full platform commitment required.
**Docker MCP Gateway** — Container-native. For teams with Docker/Kubernetes expertise.
**IBM ContextForge — Open source** — Federation features. No official IBM support.
**Obot — $35M seed** — Open source. All-in-one platform. Full Kubernetes expertise required.

### Tier 4 — Developer Tools (Adjacent)

**Composio** — 500+ integrations. Developer-first. Not security focused. Usage-based. Free tier.
**Portkey** — LLM gateway with MCP capabilities. Not security focused.
**Hypr MCP** — Free / $10/month. Just hosting. Not security. For individual developers only.

---

## Your Gap (The Only One That Exists)

Every competitor requires either:
- Contacting sales before seeing pricing
- Complex DevOps setup (days/weeks)
- Enterprise commitment upfront
- Existing infrastructure (Kong, Cloudflare, AWS, Azure)
- Technical expertise to self-host

**Not one lets a founder sign up now, deploy in 10 minutes, pay $99/month with a credit card, and show a compliance report tomorrow morning.**

That's your product. That's your differentiation. Own it completely.

---

## Tech Stack

- **Framework:** Next.js (you already know this)
- **Proxy Layer:** Node.js — sits between AI agent and MCP server
- **Database:** PostgreSQL on Supabase (free tier = first 50 customers)
- **Deployment:** Vercel (you already know this)
- **Auth:** OAuth 2.1 — hardest part, need co-founder or Claude Code
- **Anomaly Detection:** Claude API for pattern analysis

**Monthly cost to run:** Under $100/month until real scale.

---

## Co-Founder

You need one. Specifically someone who has built OAuth/identity/auth systems before. Not general security knowledge — specifically authentication infrastructure.

**Where to find:**
1. YC co-founder matching — sign up today
2. Twitter/X — search "MCP security" and engage everyone posting about it
3. GitHub — find contributors to Lasso Security (open source MCP project)

**Strategy:** Build MVP yourself with Claude Code first. Keep a list of every security decision you don't understand. That list = co-founder job description. Find them from position of "I have traction" not "I have an idea."

---

## YC Strategy

**Timeline:**
- May 2026: Learn MCP. Build MVP. Find co-founder.
- June 2026: First 3 paying customers through YC network outreach.
- July 2026: 10 customers. Apply YC Fall 2026.
- August-September: YC interviews.

**YC interview answers:**
- "Why you?" — Proven outreach machine (3,200 connections in 7 weeks). Understand compliance/security from Sevlex experience. Building for customer Alter and Golf are ignoring.
- "Traction?" — X customers paying $Y/month. Growing week over week.
- "Why not get beaten by MintMCP/Runlayer?" — They're going enterprise. We own the startup segment they're ignoring. Same playbook as Stripe vs Braintree.
- "Market size?" — Every company deploying AI agents needs this. Hundreds of thousands now, millions in 2 years.

**The YC story (one paragraph):**
"Runlayer raised $11M and is signing unicorns. MintMCP is backed by Karpathy. Every competitor is going enterprise. But the seed-stage AI startup trying to close their first $50k deal can't afford any of them, and none offer self-serve. After the Vercel breach last week, every AI startup with MCP got a panicked security questionnaire from their enterprise prospect. None of them had an answer. We give them that answer in 10 minutes for $99/month. We have X customers. We're the Stripe to their Braintree."

---

## Outreach Message (Use This)

"Hey [name] — saw you're building [AI product] with MCP. Quick question: when enterprise buyers ask how you audit what your AI agent does, how are you handling that right now?"

Send to 20 people today. If they say "we don't have a good answer" — that's your sales call.

---

## Key CVEs to Know

- CVE-2025-6514 — mcp-remote RCE via OAuth. 437k installs. CRITICAL.
- CVE-2025-49596 — Unauthenticated command injection. CVSS 9.4.
- CVE-2025-53110 — Filesystem MCP sandbox escape.
- CVE-2025-53109 — Symlink bypass on MCP filesystem server.

---

## This Weekend's Action (Non-Negotiable)

1. Go to docs.anthropic.com/en/docs/agents-and-tools/mcp — read everything
2. Build a basic MCP server from scratch
3. Connect it to Claude Desktop
4. Build a Node.js proxy in front of it that logs every tool call to Supabase
5. See the missing auth layer yourself

Everything else in this document is useless until you do this.

---

## North Star

10 paying customers in 90 days. Apply YC Fall 2026. Get in.

Not MRR. Not features. Not SOC 2 certification. Not enterprise tier. Not co-founder.

**10 customers. That's it. Everything else follows.**
