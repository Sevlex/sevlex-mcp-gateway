# MEET PANCHAL
**Ahmedabad, India (Open to US / Global Remote & Relocation)**  
**Email:** connectwithpanchal@gmail.com | **Phone:** +91-9574707385  
**GitHub:** [github.com/meetpanchal-sevlex](https://github.com/meetpanchal-sevlex) | **LinkedIn:** [linkedin.com/in/meetpanchalsevlex](https://www.linkedin.com/in/meetpanchalsevlex/) | **Portfolio / Project:** [Sevlex Gateway](https://github.com/meetpanchal-sevlex/sevlex-mcp-gateway)

---

### SUMMARY
AI Infrastructure & Forward Deployed Software Engineer with a strong foundation in cybersecurity (VAPT, SIEM, threat modeling). Builder of **Sevlex**, an open-source Layer 7 Model Context Protocol (MCP) security proxy designed to intercept, audit, and enforce zero-trust policies on agentic AI tool executions. Experienced in low-level stream buffering, real-time DPI inspection, microsecond SQLite WAL logging, and deploying client-facing LLM integrations and data pipelines.

---

### TECHNICAL SKILLS
* **Languages & Runtimes:** TypeScript, JavaScript, Python, Node.js, SQL, Bash
* **Protocols & Systems:** Model Context Protocol (MCP), JSON-RPC 2.0, Unix stdio Streams, Stream Buffering, WebSockets, REST APIs
* **Databases & Frameworks:** SQLite (WAL Mode), Next.js, React, Tailwind CSS, LangGraph
* **Security & Observability:** Layer 7 Firewalls, Deep Packet Inspection (DPI), VAPT, Wazuh SIEM, API Security, Threat Modeling, SOC 2 Compliance Controls

---

### FEATURED INFRASTRUCTURE PROJECT

**Sevlex — Open-Source Layer 7 Zero-Trust MCP Gateway**  
*Repository: [github.com/meetpanchal-sevlex/sevlex-mcp-gateway](https://github.com/meetpanchal-sevlex/sevlex-mcp-gateway)*  
* **Bidirectional Stream Interception:** Engineered a transparent Layer 7 proxy in TypeScript/Node.js sitting between AI clients (Claude Desktop, Cursor) and internal tools, intercepting raw JSON-RPC traffic over Unix `stdio` streams without protocol degradation.
* **Resilient Stream Parser:** Implemented an iterative bracket-counting buffer parser that eliminates "fail-open" vulnerabilities caused by multi-line/pretty-printed JSON chunks, paired with a 10MB memory-limit DoS shield.
* **Dynamic Deep Packet Inspection (DPI):** Intercepted `tools/list` JSON-RPC handshake calls on the fly, dynamically auto-discovering server tool schemas and maintaining a live registry in real time.
* **Runtime Policy Engine & Alerts:** Built an active firewall evaluating `tools/call` requests against configurable blocklists; returns synthetic JSON-RPC `-32600` access-denied payloads and fires automated Slack webhook security alerts on blocked threats.
* **High-Performance Observability:** Architected an immutable audit pipeline using `better-sqlite3` in Write-Ahead Logging (WAL) mode achieving sub-millisecond writes, coupled with an authenticated Next.js dark-mode control plane for live log exploration and visual policy toggling.

---

### WORK EXPERIENCE

**Forward Deployed Software Engineer (FDSE)** — *VerseOdin* | Delaware, USA (Remote)  
*Feb 2026 – Oct 2026*
* Engineered and deployed client-facing web applications and internal automation tools in the AI search and visibility domain.
* Integrated multi-model LLM APIs (Claude API, OpenAI) with dynamic schema validation, automated rate-limiting, and resilient error-handling loops.
* Architected end-to-end technical data pipelines ingesting, processing, and indexing large-scale brand visibility data across AI search engines.
* Monitored LLM response anomalies, API latency regressions, and data security risks across automated production workflows.

**AI Systems Engineer (Open-Source)** — *Sevlex* | Ahmedabad, India  
*May 2025 – Present*
* Researched threat vectors in agentic tool-calling ecosystems, specifically focusing on prompt injection, tool poisoning, privilege escalation, and unintended database exfiltration.
* Designed and published reference architectures for air-gapped enterprise tool execution, enabling engineering teams to safely expose internal databases and APIs to LLMs.
* Maintained public documentation, architectural RFCs, and quickstart harnesses for developer onboarding.

**Information Security Research Intern** — *NIT Kurukshetra (ISEA Project Phase-III)* | Haryana, India  
*Jan 2025 – Mar 2025*
* Conducted cybersecurity and network protocol research under the Information Security Education and Awareness (ISEA) Project Phase-III (Govt. of India, Ministry of Education).
* Analyzed system vulnerabilities, cryptographic mechanisms, and attack surface mitigations across computing infrastructure.

**Cybersecurity Analyst** — *BISAG-N (Ministry of Electronics & Information Technology)* | Gandhinagar, India  
*July 2024 – Jan 2025*
* Conducted Vulnerability Assessment and Penetration Testing (VAPT) across government web infrastructure and backend API endpoints.
* Configured and monitored Wazuh SIEM for real-time security log analysis, unauthorized intrusion detection, and incident response.
* Applied threat modeling and network defense principles to cloud and API communication channels.

---

### EDUCATION

**B.Tech in Computer Engineering**  
*Silver Oak Institute of Engineering & Technology, Ahmedabad*  
* *Relevant Coursework:* Network Security, Ethical Hacking, Cloud Computing, Operating Systems, Data Structures & Algorithms.
