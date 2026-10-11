## Agentic AI Security Agentic Al Security 

Enterprise guide Enterprise guide to secure agentic A to secure agentic Al 

202 

## Two Realities in Enterprise A 

reality 

## You've blocked 

reality 

## You've approved AI tools 

## Both paths lead to the same place 

## How agents connect 

 

0 

## What is MCP 

## Two dimensions to understan 

**==> picture [560 x 155] intentionally omitted <==**

**----- Start of picture text -----**<br>
Deployment typ Ownershi<br>Remot First-part<br>Loca Third-part<br>**----- End of picture text -----**<br>


**==> picture [489 x 126] intentionally omitted <==**

**----- Start of picture text -----**<br>
remot loca<br>First-party (You build it<br>Third-party (External<br>**----- End of picture text -----**<br>


0 

## The F tation Fragmentation Proble 

MCP solved the integration problem. It didn’t solve the governance problem. 

You might look at the previous section and think: "Great, one universal standard. All my agents speak the same protocol. Problem solved." 

—§ Cursor stores MCP connections in a local config file. Claude manages them in a connectors panel. Warp has their own settings. ChatGPT handles integrations differently. Each agent maintains its own list of which servers it connects to, which credentials it uses, which permissions it has. 

Not quite. 

MCP standardized how agents connect to tools. It didn’t standardize where those connections are controlled. Each agent is still a separate MCP client with its own configuration. 

So if you've approved five agents across your organization, you now have five separate control points. Five places where someone can add a new integration. Five different ways authentication is handled. Five different places to check if you want to audit what’s connected to what. 

## MCP gave you interoperability. It didn't give you centralized governance MCP gave you interoperability. It didn’t give you centralized governance. 

The protocol is standardized. The control plane is fragmented. Close the gap to manage agent integrations across teams with a single view. 

**==> picture [430 x 300] intentionally omitted <==**

**----- Start of picture text -----**<br>
|||||||||||||
|---|---|---|---|---|---|---|---|---|---|---|---|
|MC|MCP 7|GitHub MCP Serve|GitHub MCP Server|ap|API|©|GitHu|GitHub|
|Claud|Claude|MC|McP|Slack MCP Serve|Slack MCP Server|ap|API|al|Slac|Slack|
|MC|Jira MCP Serve|ap|Jir|
|MCP|Jira MCP Server|API|&)|Jira|
|Agents|inside|enterprise|Claude|Code|Connectors|Upstream|
|MC|MCP 7|GitHub MCP Serve|GitHub MCP Server|ap|API|©|GitHu|GitHub|
|ChatGP|ChatGPT|MC|MCP|Slack MCP Serve|Slack MCP Server|ap|API|ae|Slac|Slack|
|MC|Jira MCP Serve|ap|Jir|
|MCP|Jira MCP Server|API|~~|&) Jira|
|Agents|inside|enterprise|Claude|Code|Connectors|Upstream|
|MC|McP 7|GitHub MCP Serve|GitHub MCP Server|ap|API|)|GitHu|GitHub|
|©|Copilo|Copilot|MC|MCP|Slack MCP Serve|Slack MCP Server|ap|API|al|Slac|Slack|
|MC|Jira MCP Serve|ap|Jir|
|MCP|Jira MCP Server|API|._—|&)|Jira|

**----- End of picture text -----**<br>


0 04 

## What We're Seeing 

## I 

## Shadow A 

## II 

## Unvetted Server 

## III 

## Rug Pull 

0 

IV 

## PII Leakage to Model Provider 

## V 

## No Audit Trai 

III 

## Prompt Injection via Integration 

0 

## The P | | Principl 

These problems have a common root: fragmented control and limited visibility across multiple agents. 

The solution is a single governance layer that all agents route through. 

**==> picture [536 x 155] intentionally omitted <==**

**----- Start of picture text -----**<br>
AI Agent AI Agents MCP atea MCP Gateway ptrea Upstream<br>Services erice<br>Auth & RBA<br>ChatGP<br>Prompt injection<br>@ Curso Cursor detec detecPromp t injection MC McP —— GitHub MCP Serve GitHub MCP Server API ap ~~ © GitHu GitHub<br>DLP/PII Redactio<br>© Copilo Copilot MC ucp — PIEUENSS Glee tehseteIn MC MCP = Slack MCP Serve Slack MCP Server API ap  w al Slac Slack<br>Audit Loggin Audit Logging<br>Claud MC Jira MCP Serve ap Jir<br>Claude McP Jira MCP Server API wy Jira<br>Policy Enforcemen Policy Enforcement<br>W’ Windsur Windsurf MCP Catalo MCP Catalog<br>**----- End of picture text -----**<br>


> All agent route through one gateay Centralied auth All agents route through one gateway. Centralized auth, logging and policy enforcement logging, and policy enforcement. 

One control point for authentication, permissions, data inspection, and audit logging - regardless of which agent an employee uses. 

The next section details what that looks like in 

## What Governance What Governance Looks Lik Looks Like 

This section outlines the components of an effective governance framework for Al agent integrations. Think of itas a checklist - wnat you need in place to enable agents safely. 

## Centralized Integration Centralized Integration Contro Control 

All agent connections route through a single gateway. Doesn't matter if an employee uses Claude, Cursor, ChatGPT, or Warp - when they connect to GitHub, Slack, or an internal system, the connection goes through the same control point. 

§ One inventory. One place to see which agents access which systems. One place to make changes. 

0 07 

## Classification & Approva 

## Authentication & Access Contro 

## Data Protectio 

## Audit & Visibilit 

## Enforcement (Phased Approach 

phase phase Polic Endpoint Configuratio 

phase 

Network Enforcemen 

0 

## SelfAssessmen 

**==> picture [563 x 676] intentionally omitted <==**

**----- Start of picture text -----**<br>
efore evaluating solutions, understand your current state  These uestions help identify gaps<br>Visibilit Can you list every AI agent employees are using today<br>Do you know which internal & external systems those agents connect to<br>Can you see what data flows through those connections<br>Contro Is there an approval process for new agent integrations<br>Can you revoke access to a specific integration across all agents at once<br>Do you control which tools within an integration are available to which roles<br>Complianc Could you produce an audit log of all agent activity for the past 90 days<br>Are you confident PII isn't flowing to model providers through agent integrations<br>Do your current DLP policies cover agent connections<br>If an employee's credentials were compromised, could you identify what an<br>Incident Respons attacker accessed through their agent integrations<br>Can you answer "what did this agent do between 2pm & 4pm last Tuesday"<br>Enforcemen Are agent integration policies documented<br>Are those policies enforced technically, or just on paper<br>Could an employee bypass governance by configuring their own connections<br>The uncomfortable one If an auditor asked how you govern AI agent access to production systems, what<br>would you show them<br>Could a departing employee exfiltrate data through an agent integration on their<br>last day<br>Do you know the difference between what agents can access vs what they<br>actually access<br>**----- End of picture text -----**<br>


0 

If most of these are “no” or “| don’t know" If most of these are "no" or "I don't know" 

The question is whether you close it proactively or after an incident. 

- Golf builds the governance layer Golf builds the governance layer for AI agent integrations for Al agent integrations. 

Let’s talk about your agentic governanc 

golf.de golf.dev LinkedI LinkedIn 

wojciech@golf.dev wojciech@golf.de 

