# Security Policy

Sevlex is an enterprise Layer 7 Zero-Trust Security Gateway designed to protect organizations running agentic AI workflows. We take the security, integrity, and non-repudiation of our software with the highest priority.

---

## Supported Versions

We provide active security patches and vulnerability triage for the following releases:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

**Please do NOT disclose security vulnerabilities publicly through GitHub Issues, Discussions, or pull requests.**

If you discover a security vulnerability or potential threat in Sevlex (such as a stream parser bypass, privilege escalation, policy circumvention, or token leak):

1. **GitHub Security Advisory (Preferred):** Open a draft advisory under the [Sevlex Security Tab](https://github.com/Sevlex/sevlex-mcp-gateway/security/advisories/new).
2. **Encrypted Security Email:** Send a detailed report to `security@sevlex.io` with the subject `[VULNERABILITY] <Component>: <Brief Description>`.

### Report Requirements

To help us triage and patch the issue as quickly as possible, please include:
- A clear description of the vulnerability, including attack vector and severity assessment.
- Exact reproduction steps, sample MCP JSON-RPC payloads, or proof-of-concept scripts.
- The environment configuration (OS, Node.js version, gateway deployment mode: stdio or SSE).
- Potential impact and any suggested mitigations or patches.

---

## Response Timelines & SLA

| Phase | SLA |
| :--- | :--- |
| **Initial Acknowledgment** | Within **24 hours** of report receipt |
| **Severity Assessment & Triage** | Within **72 hours** |
| **Remediation & Patch Release** | Critical: **7 days** / Moderate: **14 days** |
| **Public Disclosure & CVE Assignment** | Coordinated disclosure after patch verification |

---

## Scope & Safe Harbor

### In Scope
- Gateway stream parser (`gateway/src/gateway.ts`, `gateway/src/sse_proxy.ts`)
- Deep Packet Inspection (DPI) & Policy Engine (`gateway/src/policy_engine.ts`, `gateway/src/circuit_breaker.ts`)
- Tamper-evident Merkle hash chain audit integrity (`gateway/src/merkle_chain.ts`, `gateway/src/logger.ts`)
- Dual-Custody HITL token verification (`dashboard/src/app/api/hitl/`)
- Enterprise fleet deployment manifests (`deploy/`)

### Out of Scope
- Third-party MCP servers not maintained by Sevlex.
- Attacks requiring physical access to an unlocked developer workstation.
- Social engineering attacks against Sevlex contributors.

### Safe Harbor
Sevlex will not pursue legal action against security researchers who conduct good-faith vulnerability research in compliance with this policy.
