# Sevlex GTM & Pitch Bible (Master Sales Playbook)

**Last Updated:** October 2026  
**Website:** [sevlex.com](https://sevlex.com)  
**Founder:** Meet Panchal  
**Live Demo:** `https://sevlex.com/api/mcp/dub` (Anthropic Streamable HTTP / SSE)

---

## 1. What Is Sevlex? (The 2 Core Products)

### Product 1: Turnkey MCP & In-App AI Copilot (For Greenfield B2B SaaS)
* **The Problem:** Vertical B2B SaaS ($5M–$50M ARR) has rich APIs and non-technical users, but zero in-house AI engineers. Building tool-calling, Anthropic MCP protocol compliance, and security guardrails takes 6+ months of core dev time.
* **Our Solution:** We build and host turnkey Model Context Protocol (MCP) servers and drop-in in-app AI Copilot widgets. Users can control the software via Claude Desktop / ChatGPT OR directly inside their SaaS dashboard with 1 line of code.
* **Dev Team Friction:** Under 30 minutes total (they just issue an API key and paste a 1-line `<script>` tag).

### Product 2: Sevlex AST Security Firewall (For Tech Darlings & Enterprise)
* **The Problem:** Companies whose MCP servers allow destructive actions (`DROP TABLE`, mass-deleting records, leaking API keys).
* **Our Solution:** A Layer 7 JSON-RPC firewall that inspects tool calls in <3ms, blocks destructive commands, and maintains audit trails.

---

## 2. Packaging & Pricing Architecture

| Tier | Name | Target Profile | Deliverables | Pricing |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | **Ecosystem MCP Server** | Greenfield SaaS looking for Claude/ChatGPT distribution | Hosted remote MCP server, registered on Smithery & Glama, live tool execution. | **$3,500 setup**<br>+ $300/mo retainer |
| **Tier 2** | **Complete AI Suite (In-App Copilot + MCP)** *(Recommended)* | Greenfield SaaS wanting native AI inside their web app | 1. In-App Copilot widget (embeddable script/React).<br>2. External MCP Server for Claude/ChatGPT.<br>3. Security & rate-limiting firewall. | **$8,500 – $12,000 setup**<br>+ $750/mo retainer |
| **Tier 3** | **Enterprise AST Security Gateway** | Tech companies with existing MCP servers | Gateway proxy inspecting JSON-RPC payloads, blocking destructive queries. | **$499/mo – $1,500/mo** |

---

## 3. High-Priority Target Pipeline & Current Status

### 🟢 Recently Accepted LinkedIn Connections (Hot Outreach):
1. **Alamin Uddin** (CEO & Co-Founder @ **NexHealth** — `alamin.uddin@nexhealth.com`)  
   * *Hook:* "Sync dental patient records and send 6-month cleaning reminder without opening the EHR."
2. **Abhi Krishna** (CEO & Founder @ **CareStack** — `abhikrishna@carestack.com`)  
   * *Hook:* "Verify commercial dental insurance claims submitted yesterday via plain-English query."
3. **Mark DeHaan** (CEO @ **TenantCloud** — `mark.dehaan@tenantcloud.com`)  
   * *Hook:* "Create maintenance work order for leaking sink in Unit 4B directly from chat."

### 📋 Full Target Database:
Refer to [`greenfield_b2b_leads_verified.csv`](./greenfield_b2b_leads_verified.csv) for all 35 verified greenfield B2B SaaS targets across:
* **Trades & Field Ops:** Tradify, Fergus, Buildertrend, Simpro, ServiceM8, JobNimbus, Housecall Pro.
* **Legal Practice:** Clio, MyCase, PracticePanther, Smokeball, Filevine, Lawmatics, Concord.
* **Agency & Billing:** HoneyBook, Dubsado, Harvest, FreeAgent, Wave, Everhour, Float, Avaza.
* **Healthcare & Dental:** Jane App, Cliniko, Carepatron, NexHealth, Curve Dental, CareStack.
* **Real Estate & Property:** Follow Up Boss, Buildium, TenantCloud, Sierra Interactive, Cloze, Lofty.

---

## 4. Standard Outreach & Follow-Up Scripts

### A. The 2-Sentence LinkedIn Follow-Up (After Connection Accepted)
> *Hi {First_Name}, thanks for connecting!*  
> *We build turnkey AI Copilots and Model Context Protocol (MCP) integrations for {Category} platforms so your customers can run queries like: "{Conversational_Hook}" directly inside their dashboard or via Claude Desktop.*  
> *Our infrastructure drops in with less than 30 minutes of your dev team's time. Mind if I send over a quick 60-second video demo showing how this works with your endpoints?*

### B. The 2-Sentence Cold Email (If LinkedIn Goes Cold)
> **Subject:** {Company} inside Claude Desktop & in-app copilot  
>
> *Hi {First_Name},*  
> *Sent you a note on LinkedIn earlier — we built a turnkey Model Context Protocol (MCP) connector and embeddable AI Copilot for {Company}'s API so users can run actions like "{Conversational_Hook}" without clicking through multiple menus.*  
> *We host the execution layer and safety filters so your core team doesn't have to build it from scratch. Would you be open to a 60-second video demo?*  
>
> *Best,*  
> *Meet Panchal — Founder, Sevlex (`sevlex.com`)*

---

## 5. Objection Handling

1. **"Our dev team is too busy."**  
   * *Response:* "That's exactly why we built Sevlex. It requires less than 30 minutes of your team's time—they just issue an API key and drop in our 1-line script. We host all the AI infrastructure, streaming, and tool execution on our servers."
2. **"Our users don't know what Claude Desktop or MCP is."**  
   * *Response:* "100% agreed. That's why we pair the external MCP connector with a native in-app Copilot widget right inside your dashboard. Your users don't need Claude—they just click the AI chat button inside your app to manage their workflows."
3. **"Is it safe? What if the AI takes destructive actions?"**  
   * *Response:* "Every action passes through our Layer 7 security firewall. Destructive commands (deleting invoices, updating billing status) require an explicit one-click confirmation card before execution."
