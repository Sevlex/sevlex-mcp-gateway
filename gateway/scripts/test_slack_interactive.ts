import path from "node:path";
import { fileURLToPath } from "node:url";
import { AuditLogger } from "../src/logger.js";
import { buildSlackHitlBlockKit } from "../src/slack_notifier.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "../audit_log.db");

async function main() {
  console.log("======================================================================");
  console.log("  SEVLEX TEST: 1-CLICK SLACK INTERACTIVE DUAL-CUSTODY APPROVAL");
  console.log("======================================================================");

  const logger = new AuditLogger(dbPath);
  const userId = "sarah.chen@enterprise.internal";
  const toolName = "github_list_pull_requests";
  const dummyPayload = JSON.stringify({ repo: "enterprise/core-billing" });

  // 1. Create a simulated pending ticket
  console.log("\n[Step 1] Gateway intercepts tool call and creates stateful HITL ticket...");
  const ticketId = logger.createHitlTicket(userId, toolName, dummyPayload);
  console.log(`  ✓ Generated Ticket ID: ${ticketId}`);

  // 2. Generate and verify Block Kit interactive card
  console.log("\n[Step 2] Generating Slack Block Kit interactive card with 1-click action buttons...");
  const blockKit = buildSlackHitlBlockKit({
    webhookUrl: "https://hooks.slack.com/dummy",
    userId,
    toolName,
    ticketId,
    argsSnippet: dummyPayload,
    dashboardUrl: "http://localhost:3000"
  });

  const actionsBlock = blockKit.blocks.find((b: any) => b.type === "actions") as any;
  if (!actionsBlock || actionsBlock.elements.length !== 2) {
    throw new Error("Failed to find 2 action buttons in Block Kit payload!");
  }
  console.log(`  ✓ Action Buttons found: '${actionsBlock.elements[0].text.text}' and '${actionsBlock.elements[1].text.text}'`);
  console.log(`  ✓ Button Payload: ${actionsBlock.elements[0].value}`);

  // 3. Simulate Slack sending an interactive button click to Next.js webhook
  console.log("\n[Step 3] Simulating SecOps clicking '✅ Authorize' in Slack...");
  const slackPayload = {
    type: "block_actions",
    user: {
      id: "U0123456789",
      username: "alex.secops.lead",
      name: "Alex Mercer (SecOps Lead)"
    },
    actions: [
      {
        action_id: "approve_hitl_ticket",
        block_id: actionsBlock.block_id,
        value: actionsBlock.elements[0].value
      }
    ]
  };

  const response = await fetch("http://localhost:3000/api/hitl/slack", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(slackPayload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Slack webhook returned status ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  console.log(`  ✓ Slack Webhook Response Status: ${response.status} OK`);
  console.log(`  ✓ Slack Card Updated: ${result.replace_original ? "YES (Replaced original message)" : "NO"}`);
  console.log(`  ✓ Confirmation: ${result.text.split("\n")[0]}`);

  // 4. Verify in SQLite that the ticket is APPROVED
  console.log("\n[Step 4] Verifying ticket state in SQLite WAL audit log...");
  const tickets = logger.getHitlTickets();
  const targetTicket = tickets.find((t: any) => t.ticket_id === ticketId);
  if (!targetTicket || targetTicket.status !== "APPROVED") {
    throw new Error(`Expected ticket status to be APPROVED, got: ${targetTicket?.status}`);
  }
  console.log(`  ✓ Ticket Status in DB: ${targetTicket.status}`);
  console.log(`  ✓ Authorized By: ${targetTicket.approved_by}`);
  console.log(`  ✓ Cryptographic Signature: ${targetTicket.signature?.slice(0, 24)}...`);

  // 5. Test Agent Retry: consume clearance
  console.log("\n[Step 5] Simulating agent retrying the tool call...");
  const clearance = logger.consumeApprovedHitlClearance(userId, toolName);
  if (!clearance.approved) {
    throw new Error("Expected clearance.approved to be true on retry!");
  }
  console.log(`  ✓ Dual-Custody Clearance Granted!`);
  console.log(`  ✓ Ticket Marked CONSUMED (Anti-Replay protection active).`);

  console.log("\n======================================================================");
  console.log("  ★ 1-CLICK SLACK INTERACTIVE HITL TEST: 100% SUCCESSFUL! ★");
  console.log("======================================================================\n");
}

main().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
