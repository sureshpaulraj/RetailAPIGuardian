import { defineTool } from "@github/copilot-sdk";

interface ApiChange {
  vendor: string;
  changeType: "breaking" | "deprecation" | "new-feature" | "security";
  severity: "low" | "medium" | "high" | "critical";
  version: string;
  summary: string;
  affectedEndpoints: string[];
  effectiveDate: string;
  migrationDeadline: string;
}

interface MonitorArgs {
  vendor?: string;
  severity?: string;
}

/**
 * Tool: monitor_api_changes
 * Monitors vendor API changelogs and OpenAPI spec diffs for upcoming changes.
 * In production, this would poll vendor changelog feeds, GitHub releases, and OpenAPI diffs.
 */
export const monitorApiChanges = defineTool("monitor_api_changes", {
  description:
    "Monitor vendor API changelogs and OpenAPI specs for breaking changes, deprecations, and new features. Optionally filter by vendor or severity.",
  parameters: {
    type: "object" as const,
    properties: {
      vendor: {
        type: "string",
        description: "Filter changes by vendor name (e.g., 'stripe', 'shippo').",
      },
      severity: {
        type: "string",
        description: "Filter by severity: 'low', 'medium', 'high', 'critical'.",
      },
    },
    required: [],
  },
  handler: async (args: MonitorArgs): Promise<ApiChange[]> => {
    // Simulated API changes — in production, these come from vendor feeds
    const changes: ApiChange[] = [
      {
        vendor: "Stripe",
        changeType: "breaking",
        severity: "high",
        version: "2025-02-01",
        summary:
          "Payment Intents API: 'source' parameter removed. Must use 'payment_method' instead.",
        affectedEndpoints: [
          "POST /v1/payment_intents",
          "POST /v1/payment_intents/:id/confirm",
        ],
        effectiveDate: "2025-03-01",
        migrationDeadline: "2025-04-01",
      },
      {
        vendor: "Shippo",
        changeType: "deprecation",
        severity: "medium",
        version: "2025-01-15",
        summary:
          "Legacy rate endpoint deprecated. New /v2/rates endpoint with updated response schema.",
        affectedEndpoints: ["GET /v1/rates", "POST /v1/rates"],
        effectiveDate: "2025-02-15",
        migrationDeadline: "2025-06-01",
      },
      {
        vendor: "LoyaltyAPI",
        changeType: "security",
        severity: "critical",
        version: "3.3.0",
        summary:
          "OAuth2 required for all endpoints. API key auth will be rejected after deadline.",
        affectedEndpoints: ["ALL endpoints"],
        effectiveDate: "2025-03-15",
        migrationDeadline: "2025-03-15",
      },
      {
        vendor: "Stripe",
        changeType: "new-feature",
        severity: "low",
        version: "2025-02-01",
        summary:
          "New 'automatic_payment_methods' parameter enables simplified payment flow.",
        affectedEndpoints: ["POST /v1/payment_intents"],
        effectiveDate: "2025-02-01",
        migrationDeadline: "N/A",
      },
    ];

    let filtered = changes;
    if (args.vendor) {
      filtered = filtered.filter(
        (c) => c.vendor.toLowerCase() === args.vendor!.toLowerCase()
      );
    }
    if (args.severity) {
      filtered = filtered.filter(
        (c) => c.severity === args.severity!.toLowerCase()
      );
    }

    // Work IQ Integration: notify on high/critical changes
    // const { getNotificationService } = await import("../../workiq/index.js");
    // const notifier = getNotificationService();
    // for (const change of filtered.filter(c => c.severity === "critical" || c.severity === "high")) {
    //   await notifier.notifyChangeDetected(change.vendor, change.severity, change.summary, change.migrationDeadline, change.affectedEndpoints);
    // }

    return filtered;
  },
});
