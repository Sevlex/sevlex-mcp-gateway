# Sevlex Architecture Layout

This workspace contains both the public marketing website and the actual SecOps product application, cleanly separated into two distinct folders.

---

## 📁 1. `src/app/(marketing-website)/` (Powers https://sevlex.com)
Contains all public marketing, landing, and technical documentation pages:

| Path | URL Route | Purpose |
| :--- | :--- | :--- |
| `page.tsx` | [`/`](https://sevlex.com) | Clean hero, Zero-Config Client Bar, Architecture Pillars, and Policy Guard Threat Simulator. |
| `product/` | [`/product`](https://sevlex.com/product) | Detailed Layer 7 security architecture (ToolGuard, AgentGuard, DLP, Merkle Audit). |
| `service/` | [`/service`](https://sevlex.com/service) | White-glove enterprise MCP engineering services with pricing & intake. |
| `about/` | [`/about`](https://sevlex.com/about) | Company mission, architectural guarantees, and contact channels. |
| `docs/` | [`/docs`](https://sevlex.com/docs) | Developer documentation, CLI guides, and IDE agent configuration manuals (Cursor, Claude, Windsurf). |

---

## 📁 2. `src/app/(product-app)/` (Powers https://app.sevlex.com)
Contains the actual enterprise SaaS product console:

| Path | URL Route | Purpose |
| :--- | :--- | :--- |
| `console/` | [`app.sevlex.com`](https://app.sevlex.com) / [`/console`](https://sevlex.com/console) | **SecOps Enterprise Console** featuring 10 production tabs: Overview & Health, Endpoint Inventory, Agent Discovery (Shadow AI), Visual Policy Library, HITL Approvals, Merkle Audit Log Explorer, Cloud API Keys, Fleet MDM Packages, SIEM Observability, and Incident Alerts. Connected live to Neon PostgreSQL. |

---

## ⚙️ Shared Infrastructure & Routing
- **`src/app/api/`**: Production serverless backend endpoints (Google & GitHub OAuth 2.0, Neon Postgres sync, HITL Slack webhooks, Device Telemetry, Policy Sync).
- **`src/app/components/`**: Design system components, tabs, bento grids, and the persistent `ThemeProvider`.
- **`src/middleware.ts`**: Intelligent edge routing that seamlessly routes `app.sevlex.com` directly to the `(product-app)/console` and `sevlex.com` to `(marketing-website)`.
