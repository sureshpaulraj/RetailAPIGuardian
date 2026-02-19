/**
 * Adaptive Card Templates — RetailAPIGuardian Work IQ Integration
 *
 * Factory functions that return Adaptive Card JSON payloads for
 * Teams notifications. Each card uses schema v1.4.
 */

const SCHEMA = "http://adaptivecards.io/schemas/adaptive-card.json";
const VERSION = "1.4";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function severityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case "critical":
      return "attention";
    case "high":
      return "warning";
    case "medium":
      return "accent";
    default:
      return "default";
  }
}

function statusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "success":
    case "healthy":
      return "good";
    case "failed":
    case "down":
      return "attention";
    case "degraded":
    case "pending-approval":
      return "warning";
    default:
      return "default";
  }
}

function cardWrapper(body: object[], actions?: object[]): object {
  const card: Record<string, unknown> = {
    $schema: SCHEMA,
    type: "AdaptiveCard",
    version: VERSION,
    body,
  };
  if (actions && actions.length > 0) {
    card.actions = actions;
  }
  return card;
}

// ---------------------------------------------------------------------------
// Change Detected Card
// ---------------------------------------------------------------------------

export function createChangeDetectedCard(
  vendor: string,
  severity: string,
  summary: string,
  deadline: string,
  affectedEndpoints: string[],
): object {
  const color = severityColor(severity);
  return cardWrapper(
    [
      {
        type: "TextBlock",
        text: `⚠️ API Change Detected — ${vendor}`,
        weight: "Bolder",
        size: "Medium",
        color,
      },
      {
        type: "ColumnSet",
        columns: [
          {
            type: "Column",
            width: "auto",
            items: [
              {
                type: "TextBlock",
                text: "Severity",
                weight: "Bolder",
                isSubtle: true,
              },
            ],
          },
          {
            type: "Column",
            width: "stretch",
            items: [
              {
                type: "TextBlock",
                text: severity.toUpperCase(),
                color,
                weight: "Bolder",
              },
            ],
          },
        ],
      },
      {
        type: "TextBlock",
        text: summary,
        wrap: true,
      },
      {
        type: "FactSet",
        facts: [
          { title: "Vendor", value: vendor },
          { title: "Migration Deadline", value: deadline },
          {
            title: "Affected Endpoints",
            value: affectedEndpoints.join(", "),
          },
        ],
      },
    ],
    [
      {
        type: "Action.OpenUrl",
        title: "View Details",
        url: `https://dashboard.retailapiguardian.dev/changes/${vendor.toLowerCase()}`,
      },
      {
        type: "Action.Submit",
        title: "Assign to Me",
        data: { action: "assign", vendor },
      },
    ],
  );
}

// ---------------------------------------------------------------------------
// Deployment Card
// ---------------------------------------------------------------------------

export interface DeploymentStep {
  step: string;
  status: string;
  duration?: string;
}

export function createDeploymentCard(
  vendor: string,
  environment: string,
  status: string,
  deploymentId: string,
  steps: DeploymentStep[],
): object {
  const color = statusColor(status);
  const icon = status === "success" ? "✅" : status === "failed" ? "❌" : "⏳";

  return cardWrapper(
    [
      {
        type: "TextBlock",
        text: `${icon} Deployment ${status.toUpperCase()} — ${vendor}`,
        weight: "Bolder",
        size: "Medium",
        color,
      },
      {
        type: "FactSet",
        facts: [
          { title: "Environment", value: environment },
          { title: "Deployment ID", value: deploymentId },
          { title: "Status", value: status },
        ],
      },
      {
        type: "TextBlock",
        text: "Deployment Steps",
        weight: "Bolder",
        spacing: "Medium",
      },
      ...steps.map((s) => ({
        type: "ColumnSet",
        columns: [
          {
            type: "Column",
            width: "stretch",
            items: [{ type: "TextBlock", text: s.step }],
          },
          {
            type: "Column",
            width: "auto",
            items: [
              {
                type: "TextBlock",
                text:
                  s.status === "completed"
                    ? "✅"
                    : s.status === "failed"
                      ? "❌"
                      : s.status === "in-progress"
                        ? "🔄"
                        : "⏸️",
              },
            ],
          },
          {
            type: "Column",
            width: "auto",
            items: [
              {
                type: "TextBlock",
                text: s.duration ?? "—",
                isSubtle: true,
              },
            ],
          },
        ],
      })),
    ],
    [
      {
        type: "Action.OpenUrl",
        title: "View in Dashboard",
        url: `https://dashboard.retailapiguardian.dev/deployments/${deploymentId}`,
      },
    ],
  );
}

// ---------------------------------------------------------------------------
// Health Alert Card
// ---------------------------------------------------------------------------

export function createHealthAlertCard(
  vendor: string,
  previousStatus: string,
  currentStatus: string,
  latencyMs: number,
  errorRate: number,
): object {
  const color = statusColor(currentStatus);
  const icon =
    currentStatus === "healthy"
      ? "💚"
      : currentStatus === "degraded"
        ? "🟡"
        : "🔴";

  return cardWrapper(
    [
      {
        type: "TextBlock",
        text: `${icon} Health Alert — ${vendor}`,
        weight: "Bolder",
        size: "Medium",
        color,
      },
      {
        type: "ColumnSet",
        columns: [
          {
            type: "Column",
            width: "stretch",
            items: [
              {
                type: "TextBlock",
                text: "Previous Status",
                weight: "Bolder",
                isSubtle: true,
              },
              {
                type: "TextBlock",
                text: previousStatus.toUpperCase(),
                color: statusColor(previousStatus),
              },
            ],
          },
          {
            type: "Column",
            width: "auto",
            items: [
              { type: "TextBlock", text: "→", size: "Large" },
            ],
          },
          {
            type: "Column",
            width: "stretch",
            items: [
              {
                type: "TextBlock",
                text: "Current Status",
                weight: "Bolder",
                isSubtle: true,
              },
              {
                type: "TextBlock",
                text: currentStatus.toUpperCase(),
                color,
              },
            ],
          },
        ],
      },
      {
        type: "FactSet",
        facts: [
          { title: "Latency", value: `${latencyMs}ms` },
          { title: "Error Rate", value: `${(errorRate * 100).toFixed(2)}%` },
          { title: "Checked", value: new Date().toISOString() },
        ],
      },
    ],
    [
      {
        type: "Action.OpenUrl",
        title: "Investigate",
        url: `https://dashboard.retailapiguardian.dev/health/${vendor.toLowerCase()}`,
      },
    ],
  );
}

// ---------------------------------------------------------------------------
// Daily Digest Card
// ---------------------------------------------------------------------------

export interface HealthSummary {
  vendor: string;
  status: string;
}

export interface ChangesSummary {
  vendor: string;
  severity: string;
  summary: string;
}

export interface DeploymentsSummary {
  vendor: string;
  environment: string;
  status: string;
}

export function createDailyDigestCard(
  healthSummary: HealthSummary[],
  changesSummary: ChangesSummary[],
  deploymentsSummary: DeploymentsSummary[],
): object {
  return cardWrapper([
    {
      type: "TextBlock",
      text: "📊 Daily Integration Digest",
      weight: "Bolder",
      size: "Large",
    },
    {
      type: "TextBlock",
      text: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      isSubtle: true,
    },
    // Health overview
    {
      type: "TextBlock",
      text: "Integration Health",
      weight: "Bolder",
      spacing: "Medium",
      separator: true,
    },
    {
      type: "FactSet",
      facts: healthSummary.map((h) => ({
        title: h.vendor,
        value:
          h.status === "healthy"
            ? "💚 Healthy"
            : h.status === "degraded"
              ? "🟡 Degraded"
              : "🔴 Down",
      })),
    },
    // Pending changes
    {
      type: "TextBlock",
      text: `Pending API Changes (${changesSummary.length})`,
      weight: "Bolder",
      spacing: "Medium",
      separator: true,
    },
    ...(changesSummary.length > 0
      ? changesSummary.map((c) => ({
          type: "TextBlock",
          text: `**${c.vendor}** [${c.severity.toUpperCase()}]: ${c.summary}`,
          wrap: true,
          color: severityColor(c.severity),
        }))
      : [{ type: "TextBlock", text: "No pending changes.", isSubtle: true }]),
    // Recent deployments
    {
      type: "TextBlock",
      text: `Recent Deployments (${deploymentsSummary.length})`,
      weight: "Bolder",
      spacing: "Medium",
      separator: true,
    },
    ...(deploymentsSummary.length > 0
      ? deploymentsSummary.map((d) => ({
          type: "TextBlock",
          text: `**${d.vendor}** → ${d.environment}: ${d.status === "success" ? "✅" : d.status === "failed" ? "❌" : "⏳"} ${d.status}`,
          wrap: true,
        }))
      : [
          {
            type: "TextBlock",
            text: "No recent deployments.",
            isSubtle: true,
          },
        ]),
  ]);
}
