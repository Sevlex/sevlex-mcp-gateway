// ==============================================================================
// SEVLEX SLACK INTERACTIVE BLOCK KIT NOTIFIER
// Dispatches 1-click dual-custody authorization cards to SecOps Slack channels
// ==============================================================================

export interface SlackHitlNotificationOptions {
  webhookUrl: string;
  userId: string;
  toolName: string;
  ticketId: string;
  argsSnippet?: string;
  dashboardUrl?: string;
}

export function buildSlackHitlBlockKit(options: SlackHitlNotificationOptions) {
  const { userId, toolName, ticketId, argsSnippet, dashboardUrl } = options;
  const prettyArgs = argsSnippet 
    ? (argsSnippet.length > 300 ? argsSnippet.slice(0, 300) + "..." : argsSnippet)
    : "{}";

  return {
    text: `🛡️ [HITL Clearance Required] ${userId} requested high-impact tool '${toolName}' (Ticket: ${ticketId})`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🛡️ Sevlex Zero-Trust: Dual-Custody Clearance Required",
          emoji: true
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*User / Agent:*\n\`${userId}\``
          },
          {
            type: "mrkdwn",
            text: `*Protected Tool:*\n\`${toolName}\``
          },
          {
            type: "mrkdwn",
            text: `*Ticket ID:*\n\`${ticketId}\``
          },
          {
            type: "mrkdwn",
            text: `*State:*\n🟡 \`PENDING_AUTHORIZATION\``
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Tool Arguments:*\n\`\`\`json\n${prettyArgs}\n\`\`\``
        }
      },
      {
        type: "actions",
        block_id: `hitl_actions_${ticketId}`,
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "✅ Authorize (15m Window)",
              emoji: true
            },
            style: "primary",
            action_id: "approve_hitl_ticket",
            value: JSON.stringify({ ticketId, action: "APPROVE", toolName, userId })
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "❌ Reject & Terminate",
              emoji: true
            },
            style: "danger",
            action_id: "reject_hitl_ticket",
            value: JSON.stringify({ ticketId, action: "REJECT", toolName, userId })
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Sevlex L7 Zero-Trust Gateway • Anti-Replay TTL: 15 mins${dashboardUrl ? ` • <${dashboardUrl}|Open Dashboard>` : ""}`
          }
        ]
      }
    ]
  };
}

export async function sendSlackHitlCard(options: SlackHitlNotificationOptions): Promise<void> {
  const { webhookUrl } = options;
  if (!webhookUrl) return;

  const payload = buildSlackHitlBlockKit(options);

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (err: any) {
    console.error("[Sevlex Slack Webhook] Failed to deliver Block Kit payload:", err.message);
  }
}
