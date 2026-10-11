# Golf: Agentic AI Security & Governance (Enterprise Guide 2026)
**Source:** `golf.dev` | **Author:** Wojciech (`wojciech@golf.dev`)
**Preserved for Sevlex Competitive Strategy & Architecture Reference**

---

## 1. Executive Summary: The Two Realities in Enterprise AI

Every enterprise adopting AI sits in one of two situations:

### Reality A: You've Blocked AI Tools
* **What Happened:** Security said no. Too much risk, zero visibility, no way to control what connects to what. The answer was to block Claude, ChatGPT, Cursor, Copilot.
* **The Problem:** Employees use these tools anyway on personal devices and personal accounts outside the corporate network. You don't see it, you can't audit it, and you have zero control. The block didn't reduce risk—it just eliminated visibility and governance.
* **The Business Impact:** Competitors build faster. 65% of enterprises now use generative AI regularly (double from McKinsey 2025).

### Reality B: You've Approved AI Tools
* **What Happened:** Official procurement or team-level decisions approved Claude, ChatGPT, Cursor, Copilot, Warp, Claude Code.
* **The Problem:** These tools connect to your core systems—GitHub, Slack, Jira, internal APIs. Each agent has separate integration settings, separate authentication, separate permissions, and separate audit trails (if any exist).
* **The Security Blind Spot:** Security cannot answer: *Which AI tools are connected to GitHub? Who approved those connections? What data flowed through them last month?* You enabled AI, but you are flying blind.

> **The Universal Conclusion:** Both paths lead to the same requirement: Organizations need a **centralized strategy for governing how AI tools connect to internal systems**. In 2026, the standard protocol for those connections is **MCP (Model Context Protocol)**.

---

## 2. What is MCP? (The Foundation)

* **Definition:** Model Context Protocol. Think of it as **USB-C for AI agents**—one universal standard instead of custom integrations for every tool.
* **Scale Advantage:** Before MCP, 10 AI apps connecting to 50 tools required 500 custom integrations. With MCP, you need 60 (10 apps + 50 tools).
* **Governance Standard:** Open standard under the **Linux Foundation's Agentic AI Foundation** (Anthropic, OpenAI, Google, Microsoft, AWS, Cloudflare). Every major agent (Claude, ChatGPT, Cursor, Copilot, Warp, Claude Code) has adopted it.

### The 4 Quadrants of MCP Architecture

```
                    DEPLOYMENT TYPE
                  Remote               Local
         ┌───────────────────────┬────────────────────────┐
First-   │ Internal APIs,        │ Developer Tooling      │
Party    │ Databases             │                        │
OWNERSHIP├───────────────────────┼────────────────────────┤
Third-   │ GitHub, Linear, Slack │ Random GitHub Repos    │
Party    │ (Official SaaS MCP)   │ (Community MCP Servers)│
         └───────────────────────┴────────────────────────┘
```

* **Remote:** Hosted as a service. Centralized security, audit logging, access controls, always-on. (Enterprise production standard).
* **Local:** Runs on developer laptop. No central control, no audit trail, dies when laptop closes. (Fine for experimentation; dangerous for unmonitored production).

---

## 3. The Fragmentation Problem

> **"MCP solved the integration problem. It didn't solve the governance problem."**

* MCP standardized *how* agents connect to tools, but **not where those connections are controlled**.
* Cursor stores MCP connections in a local config file.
* Claude manages them in a connectors panel.
* Warp has its own settings.
* ChatGPT handles integrations differently.
* **Result:** If an organization approves 5 agents, it creates **5 separate control points, 5 separate authentication methods, and 5 separate places to audit**.

---

## 4. The 5 Core Vulnerabilities ("What We're Seeing Go Wrong")

### I. Shadow AI (Shadow MCP)
* Without clear policies, employees connect whatever they find on GitHub.
* An engineer discovers an MCP server for Salesforce, connects their agent, and shares it with teammates.
* Soon, multiple employees are using integrations that Security has never reviewed, IT doesn't know exist, and nobody is monitoring.

### II. Unvetted Servers & Remote Command Injection CVEs
* Developers Google *"MCP server for [tool]"*, download a random repo with a few hundred stars, and run it locally with full machine privileges.
* **Empirical 2025 CVEs in MCP Servers:**
  * `CVE-2025-53107`
  * `CVE-2025-5277`
  * `CVE-2025-53818`
  * `CVE-2025-69256`
* These vulnerabilities allow malicious remote actors to achieve remote command injection on developer machines through the MCP interface.

### III. The "Rug Pull" Attack (Supply Chain Vulnerability)
* Security reviews and approves a third-party MCP server today.
* Next week, the maintainer pushes an update to GitHub adding new tools or changing behavior (carelessly or maliciously).
* Agents are now running code different from what was reviewed.
* **Zero versioning enforcement and zero change detection exist in native MCP clients.**

### IV. PII & Sensitive Data Leakage
* Every agent request passes through a model provider (Anthropic, OpenAI, Google).
* When an employee asks an agent to summarize an internal document, data is transmitted off-premise.
* Without a governance proxy, there is no DLP (Data Loss Prevention), no PII detection, and no scrubbing of credit card numbers, SSNs, or healthcare records before reaching external LLMs.

### V. No Audit Trail & Compliance Failure
* When a security incident occurs, teams must answer: *What data was accessed? Which systems were queried? Who initiated the request? What was returned?*
* Native clients provide no central logs. Telling an auditor "we don't track that" fails SOC 2, HIPAA, PCI-DSS, and GDPR.

### VI. Prompt Injection via Integrations (The "Lethal Trifecta")
* In May 2025, researchers demonstrated prompt injection against the official GitHub MCP server (14,000+ stars).
* An attacker creates a malicious issue in a public repository. When a developer asks their agent to "check open issues", the agent reads the malicious instruction, gets hijacked, and leaks data from private repositories.
* Security researcher **Simon Willison** termed this the *"lethal trifecta for prompt injection: access to private data, exposure to malicious instructions, and the ability to exfiltrate information."*

---

## 5. The Solution: Centralized MCP Gateway Architecture

```
AI AGENTS                    MCP GATEWAY                   UPSTREAM SERVICES
┌───────────┐         ┌─────────────────────────┐         ┌───────────────────┐
│ ChatGPT   │         │ Auth & RBAC             │         │ GitHub MCP Server │
│ Cursor    │ ──MCP──▶│ Prompt Injection Detect │ ──MCP──▶│ Slack MCP Server  │
│ Copilot   │         │ DLP / PII Redaction     │         │ Jira MCP Server   │
│ Claude    │         │ Audit Logging           │         │ Internal APIs     │
│ Windsurf  │         │ Policy Enforcement      │         │ Databases         │
└───────────┘         │ MCP Discovered Catalog  │         └───────────────────┘
                      └─────────────────────────┘
```

* **Core Principle:** A single control point for authentication, permissions, data inspection, and audit logging regardless of which agent an employee uses.

---

## 6. Enterprise Phased Enforcement Blueprint

Golf defines the exact 3-phase enforcement roadmap that enterprises follow:

* **Phase 1: Policy**
  * Document corporate AI usage policies. Communicate that all agent integrations must pass through the governance layer.
* **Phase 2: Endpoint Configuration (The MDM Bridge)**
  * **"Use MDM (Jamf, Intune) to deploy pre-configured agent setups that point to the gateway by default. Make compliance the path of least resistance."**
* **Phase 3: Network Enforcement**
  * Block direct outbound connections to external MCP server endpoints at the corporate firewall/proxy level. Whitelist only the central gateway IP address.

---

## 7. The CISO Self-Assessment (Sales & Audit Tool)

1. **Visibility:** Can you list every AI agent employees are using today? Do you know which systems they connect to? Can you see what data flows through those connections?
2. **Control:** Is there an approval process for new agent integrations? Can you revoke access to a specific integration across all agents at once?
3. **Compliance:** Could you produce an audit log of all agent activity for the past 90 days? Are you confident PII isn't flowing to model providers?
4. **Incident Response:** If an employee's credentials were compromised, could you identify what an attacker accessed through their agent integrations? Can you answer: *"What did this agent do between 2pm & 4pm last Tuesday?"*
5. **Enforcement:** Are agent integration policies enforced technically, or just on paper? Could a departing employee exfiltrate data through an agent integration on their last day?

---

## 8. Sevlex Strategic Synthesis: How We Win

| Dimension | Competitor Golf (`golf.dev`) | Sevlex Strategy |
| :--- | :--- | :--- |
| **GTM Motion** | Closed-Source, Top-Down CISO Sales | **Open-Core, Developer-First (Bottom-Up to Enterprise)** |
| **Speed to Value** | Heavy enterprise procurement cycle | **60-second setup (`npx sevlex` / local `stdio` proxy)** |
| **SIEM Ecosystem** | Proprietary walled-garden cloud | **Universal native export to customer's Datadog / Splunk** |
| **Moat Defense** | Cloud governance layer | **Zero-Latency Layer 7 Deep Packet Inspection over `stdio` & SSE** |
| **Key Differentiator**| SaaS platform | **Tamper-proof SQLite WAL receipts + automated MDM rollout** |
