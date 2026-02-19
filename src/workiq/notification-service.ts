/**
 * Notification Service — RetailAPIGuardian Work IQ Integration
 *
 * Sends notifications through Microsoft 365 channels (Teams, Email)
 * using either an Incoming Webhook URL or the Microsoft Graph API.
 * Falls back to structured console logging when neither is configured.
 */

import { workiqConfig, isWorkIQConfigured } from "./config.js";
import type { WorkIQConfig } from "./config.js";
import {
  createChangeDetectedCard,
  createDeploymentCard,
  createHealthAlertCard,
  createDailyDigestCard,
} from "./adaptive-cards.js";
import type {
  HealthSummary,
  ChangesSummary,
  DeploymentsSummary,
} from "./adaptive-cards.js";

export class NotificationService {
  private config: WorkIQConfig;
  private graphClient: unknown | null = null;

  constructor(config?: WorkIQConfig) {
    this.config = config ?? workiqConfig;
  }

  // -------------------------------------------------------------------------
  // Low-level transport methods
  // -------------------------------------------------------------------------

  /** Send an Adaptive Card via Teams Incoming Webhook. */
  async sendTeamsWebhook(card: object): Promise<boolean> {
    if (!this.config.webhookUrl) {
      console.log(
        "[WorkIQ] No webhook URL configured — skipping Teams webhook.",
      );
      return false;
    }

    try {
      const response = await fetch(this.config.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "message",
          attachments: [
            {
              contentType: "application/vnd.microsoft.card.adaptive",
              content: card,
            },
          ],
        }),
      });

      if (!response.ok) {
        console.error(
          `[WorkIQ] Webhook POST failed: ${response.status} ${response.statusText}`,
        );
        return false;
      }
      console.log("[WorkIQ] Teams webhook notification sent successfully.");
      return true;
    } catch (err) {
      console.error("[WorkIQ] Teams webhook error:", err);
      return false;
    }
  }

  /** Send a channel message via Microsoft Graph API with an Adaptive Card. */
  async sendGraphMessage(card: object, message: string): Promise<boolean> {
    if (!this.config.clientId || !this.config.clientSecret) {
      console.log(
        "[WorkIQ] Graph credentials not configured — skipping Graph message.",
      );
      return false;
    }

    try {
      const client = await this.getGraphClient();
      if (!client) return false;

      const graphClient = client as {
        api: (path: string) => {
          post: (body: object) => Promise<unknown>;
        };
      };

      await graphClient
        .api(
          `/teams/${this.config.teamId}/channels/${this.config.channelId}/messages`,
        )
        .post({
          body: {
            contentType: "html",
            content: message,
          },
          attachments: [
            {
              id: "adaptive-card-1",
              contentType: "application/vnd.microsoft.card.adaptive",
              content: JSON.stringify(card),
            },
          ],
        });

      console.log("[WorkIQ] Graph channel message sent successfully.");
      return true;
    } catch (err) {
      console.error("[WorkIQ] Graph message error:", err);
      return false;
    }
  }

  /** Send an email notification via Microsoft Graph API. */
  async sendEmail(
    subject: string,
    htmlBody: string,
    recipients?: string[],
  ): Promise<boolean> {
    if (!this.config.clientId || !this.config.clientSecret) {
      console.log(
        "[WorkIQ] Graph credentials not configured — skipping email.",
      );
      return false;
    }

    const toRecipients = (recipients ?? this.config.emailRecipients).map(
      (email) => ({
        emailAddress: { address: email },
      }),
    );

    if (toRecipients.length === 0) {
      console.log("[WorkIQ] No email recipients configured — skipping email.");
      return false;
    }

    try {
      const client = await this.getGraphClient();
      if (!client) return false;

      const graphClient = client as {
        api: (path: string) => {
          post: (body: object) => Promise<unknown>;
        };
      };

      await graphClient.api("/me/sendMail").post({
        message: {
          subject,
          body: { contentType: "HTML", content: htmlBody },
          toRecipients,
        },
      });

      console.log("[WorkIQ] Email sent successfully.");
      return true;
    } catch (err) {
      console.error("[WorkIQ] Email send error:", err);
      return false;
    }
  }

  // -------------------------------------------------------------------------
  // High-level notification methods
  // -------------------------------------------------------------------------

  /** Notify when a vendor API change is detected (high/critical). */
  async notifyChangeDetected(
    vendor: string,
    severity: string,
    summary: string,
    deadline: string,
    affectedEndpoints: string[] = [],
  ): Promise<void> {
    const card = createChangeDetectedCard(
      vendor,
      severity,
      summary,
      deadline,
      affectedEndpoints,
    );

    if (!isWorkIQConfigured()) {
      console.log(
        "[WorkIQ] Notification (console fallback):",
        JSON.stringify(
          { type: "change_detected", vendor, severity, summary, deadline },
          null,
          2,
        ),
      );
      return;
    }

    const sent =
      (await this.sendTeamsWebhook(card)) ||
      (await this.sendGraphMessage(
        card,
        `⚠️ API Change Detected: <b>${vendor}</b> [${severity.toUpperCase()}]`,
      ));

    if (!sent) {
      console.log(
        "[WorkIQ] All delivery channels failed — logging to console:",
        JSON.stringify({ type: "change_detected", vendor, severity, summary }),
      );
    }
  }

  /** Notify when a deployment completes. */
  async notifyDeploymentComplete(
    vendor: string,
    environment: string,
    status: string,
    deploymentId: string,
    steps: Array<{ step: string; status: string; duration?: string }> = [],
  ): Promise<void> {
    const card = createDeploymentCard(
      vendor,
      environment,
      status,
      deploymentId,
      steps,
    );

    if (!isWorkIQConfigured()) {
      console.log(
        "[WorkIQ] Notification (console fallback):",
        JSON.stringify(
          {
            type: "deployment_complete",
            vendor,
            environment,
            status,
            deploymentId,
          },
          null,
          2,
        ),
      );
      return;
    }

    const icon =
      status === "success" ? "✅" : status === "failed" ? "❌" : "⏳";
    const sent =
      (await this.sendTeamsWebhook(card)) ||
      (await this.sendGraphMessage(
        card,
        `${icon} Deployment ${status}: <b>${vendor}</b> → ${environment}`,
      ));

    if (!sent) {
      console.log(
        "[WorkIQ] All delivery channels failed — logging to console:",
        JSON.stringify({
          type: "deployment_complete",
          vendor,
          environment,
          status,
          deploymentId,
        }),
      );
    }
  }

  /** Notify when a vendor health status changes to degraded or down. */
  async notifyHealthAlert(
    vendor: string,
    previousStatus: string,
    currentStatus: string,
    metrics: { latencyMs?: number; errorRate?: number } = {},
  ): Promise<void> {
    const card = createHealthAlertCard(
      vendor,
      previousStatus,
      currentStatus,
      metrics.latencyMs ?? 0,
      metrics.errorRate ?? 0,
    );

    if (!isWorkIQConfigured()) {
      console.log(
        "[WorkIQ] Notification (console fallback):",
        JSON.stringify(
          {
            type: "health_alert",
            vendor,
            previousStatus,
            currentStatus,
            metrics,
          },
          null,
          2,
        ),
      );
      return;
    }

    const icon =
      currentStatus === "down"
        ? "🔴"
        : currentStatus === "degraded"
          ? "🟡"
          : "💚";
    const sent =
      (await this.sendTeamsWebhook(card)) ||
      (await this.sendGraphMessage(
        card,
        `${icon} Health Alert: <b>${vendor}</b> ${previousStatus} → ${currentStatus}`,
      ));

    if (!sent) {
      console.log(
        "[WorkIQ] All delivery channels failed — logging to console:",
        JSON.stringify({
          type: "health_alert",
          vendor,
          previousStatus,
          currentStatus,
        }),
      );
    }
  }

  /** Send daily integration health digest. */
  async sendDailyDigest(
    healthSummary: HealthSummary[] = [],
    changesSummary: ChangesSummary[] = [],
    deploymentsSummary: DeploymentsSummary[] = [],
  ): Promise<void> {
    const card = createDailyDigestCard(
      healthSummary,
      changesSummary,
      deploymentsSummary,
    );

    if (!isWorkIQConfigured()) {
      console.log(
        "[WorkIQ] Daily Digest (console fallback):",
        JSON.stringify(
          {
            type: "daily_digest",
            health: healthSummary,
            changes: changesSummary,
            deployments: deploymentsSummary,
          },
          null,
          2,
        ),
      );
      return;
    }

    const sent =
      (await this.sendTeamsWebhook(card)) ||
      (await this.sendGraphMessage(
        card,
        "📊 <b>Daily Integration Digest</b> — RetailAPIGuardian",
      ));

    // Also send email digest if configured
    if (this.config.emailRecipients.length > 0) {
      const htmlBody = this.buildDigestEmailHtml(
        healthSummary,
        changesSummary,
        deploymentsSummary,
      );
      await this.sendEmail(
        "RetailAPIGuardian — Daily Integration Digest",
        htmlBody,
      );
    }

    if (!sent) {
      console.log(
        "[WorkIQ] All delivery channels failed — logging to console:",
        JSON.stringify({ type: "daily_digest" }),
      );
    }
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  /** Lazily initialize the Microsoft Graph SDK client (dynamic import). */
  private async getGraphClient(): Promise<unknown> {
    if (this.graphClient) return this.graphClient;

    try {
      const { ClientSecretCredential } = await import("@azure/identity");
      // @ts-expect-error — @microsoft/microsoft-graph-client is an optional peer dependency
      const { Client } = await import("@microsoft/microsoft-graph-client");
      // @ts-expect-error — optional peer dependency
      const { TokenCredentialAuthenticationProvider } = await import("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js");

      const credential = new ClientSecretCredential(
        this.config.tenantId,
        this.config.clientId,
        this.config.clientSecret,
      );

      const authProvider = new TokenCredentialAuthenticationProvider(
        credential,
        { scopes: ["https://graph.microsoft.com/.default"] },
      );

      this.graphClient = Client.initWithMiddleware({ authProvider });
      return this.graphClient;
    } catch (err) {
      console.error(
        "[WorkIQ] Failed to initialize Graph SDK (packages may not be installed):",
        err,
      );
      return null;
    }
  }

  /** Build a simple HTML email body for the daily digest. */
  private buildDigestEmailHtml(
    healthSummary: HealthSummary[],
    changesSummary: ChangesSummary[],
    deploymentsSummary: DeploymentsSummary[],
  ): string {
    const healthRows = healthSummary
      .map(
        (h) =>
          `<tr><td>${h.vendor}</td><td>${h.status === "healthy" ? "💚" : h.status === "degraded" ? "🟡" : "🔴"} ${h.status}</td></tr>`,
      )
      .join("");

    const changesRows = changesSummary
      .map(
        (c) =>
          `<tr><td>${c.vendor}</td><td>${c.severity.toUpperCase()}</td><td>${c.summary}</td></tr>`,
      )
      .join("");

    const deploymentsRows = deploymentsSummary
      .map(
        (d) =>
          `<tr><td>${d.vendor}</td><td>${d.environment}</td><td>${d.status}</td></tr>`,
      )
      .join("");

    return `
      <h2>RetailAPIGuardian — Daily Integration Digest</h2>
      <h3>Integration Health</h3>
      <table border="1" cellpadding="4"><tr><th>Vendor</th><th>Status</th></tr>${healthRows}</table>
      <h3>Pending API Changes (${changesSummary.length})</h3>
      <table border="1" cellpadding="4"><tr><th>Vendor</th><th>Severity</th><th>Summary</th></tr>${changesRows}</table>
      <h3>Recent Deployments (${deploymentsSummary.length})</h3>
      <table border="1" cellpadding="4"><tr><th>Vendor</th><th>Environment</th><th>Status</th></tr>${deploymentsRows}</table>
      <p><em>Generated by RetailAPIGuardian at ${new Date().toISOString()}</em></p>
    `.trim();
  }
}
