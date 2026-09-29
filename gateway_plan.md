# Sevlex Gateway Engine (Phase 1)

This document outlines the exact flow of data through `gateway.js`. This is our "Toll Booth".

## The Architecture Flowchart

```mermaid
flowchart TD
    %% Define Nodes with Analogy + Technical Term
    A[🚗 The Driver<br>(AI Client like Cursor)]:::client
    G_IN[🛑 Toll Booth Operator<br>(gateway.js catches the JSON message)]:::gateway
    SEC{📋 The Clipboard<br>(Check if tool is in sevlex.json list)}:::security
    LOG_B[(📓 The Logbook<br>Write 'BLOCKED' to SQLite DB)]:::database
    LOG_A[(📓 The Logbook<br>Write 'ALLOWED' to SQLite DB)]:::database
    S[🏢 The Destination<br>(The real MCP Python/Node script)]:::server
    ERR[🚧 Barrier Down<br>(Return JSON Error to AI)]:::error
    G_OUT[✅ Barrier Up<br>(Return Tool Output to AI)]:::gateway

    %% Define Flow
    A -->|"1. 'I want to use this tool!'"| G_IN
    G_IN -->|"2. Reads the request"| SEC
    
    SEC -->|"3a. Tool is BANNED!"| LOG_B
    LOG_B --> ERR
    ERR -->|"4a. Access Denied"| A
    
    SEC -->|"3b. Tool is SAFE"| LOG_A
    LOG_A -->|"4b. Forward to Destination"| S
    
    S -->|"5. Destination replies with data"| G_OUT
    G_OUT -->|"6. Hand data back to Driver"| A

    %% Styling
    classDef client fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
    classDef gateway fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
    classDef security fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    classDef database fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    classDef server fill:#64748b,stroke:#475569,stroke-width:2px,color:#fff
    classDef error fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff
```

## The 3 Core Components in `gateway.js` (Explained Simply)

To make this flow work, our code will be divided into three simple blocks:

1. **The Interceptor (The Toll Booth Operator):** We use standard Javascript to catch the text coming from Cursor before it reaches its destination.
2. **The Security Engine (The Clipboard):** A simple `if` statement. *IF* the AI asks for a tool that is listed in our `sevlex.json` file, we block it.
3. **The Audit Logger (The Logbook):** We use a simple database tool called `sqlite3` to write down a receipt of exactly what happened, so the boss can read it later.
