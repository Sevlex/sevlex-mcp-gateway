# Contributing to Sevlex

Thank you for your interest in contributing to **Sevlex** — the Layer 7 Zero-Trust Security Gateway for the Model Context Protocol (MCP).

Sevlex protects enterprise infrastructure and agentic workflows where software failure or bypass can lead to data exfiltration or credential leaks. We enforce rigorous engineering standards across all pull requests.

---

## Engineering Principles

1. **Think Before Coding:** Identify root causes before writing code. Read context thoroughly.
2. **Simplicity First:** The best code is simple, robust, and minimal. Avoid unnecessary abstraction layers.
3. **Surgical Changes:** Modify only what is required. Avoid collateral refactors or unrelated formatting changes.
4. **Zero-Vibe Verification:** Never assume code works. Prove it programmatically with automated simulations and strict compiler checks (`tsc --noEmit`).

---

## Development Prerequisites

- **Node.js:** `>= 20.x LTS`
- **npm:** `>= 10.x`
- **Git**

---

## Local Setup & Monorepo Workflow

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Sevlex/sevlex-mcp-gateway.git
   cd sevlex-mcp-gateway
   ```

2. **Install All Dependencies:**
   ```bash
   npm run install:all
   ```

3. **Run Both Services in Development Mode:**
   ```bash
   npm run dev
   ```
   - Gateway Engine runs on `http://localhost:8080` (or `stdio` intercept mode).
   - Next.js Control Plane runs on `http://localhost:3000`.

---

## Testing & Verification

Every commit must pass the automated verification suite before a pull request can be merged:

1. **Type Check (Gateway):**
   ```bash
   cd gateway && npx tsc --noEmit
   ```

2. **Type Check (Dashboard):**
   ```bash
   cd dashboard && npx tsc --noEmit
   ```

3. **Run the Live E2E Security Simulation:**
   ```bash
   cd gateway && npm run simulate
   ```

4. **Verify Merkle Hash Chain Integrity (Cryptographic Proof):**
   ```bash
   cd gateway && node bin/sevlex.js verify
   ```

5. **Production Build:**
   ```bash
   cd dashboard && npm run build
   ```

---

## Commit & PR Guidelines

- Use [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat(gateway): implement real-time output DLP masking`
  - `fix(parser): prevent buffer truncation on malformed JSON-RPC`
  - `perf(merkle): optimize SHA-256 rolling digest hash generation`
  - `chore(deps): bump dependencies`
- Open PRs against the `main` branch.
- Include reproduction steps and automated test coverage with all bug fixes.

---

## Community & Code of Conduct

All contributors are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Be respectful, professional, and collaborative.
