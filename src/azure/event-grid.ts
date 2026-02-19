/**
 * Event Grid Publisher — RetailAPIGuardian
 *
 * Publishes domain events (change detected, deployment complete, health alert)
 * to Azure Event Grid for downstream routing. Falls back to console logging
 * when Event Grid is not configured.
 */

import { azureConfig, isAzureConfigured } from "./config.js";

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface RetailApiEvent {
  eventType: string;
  vendor: string;
  severity: "low" | "medium" | "high" | "critical";
  data: unknown;
  timestamp?: string;
}

// ---------------------------------------------------------------------------
// EventPublisher class
// ---------------------------------------------------------------------------

export class EventPublisher {
  private client: unknown | null = null;
  private initialized = false;

  private async ensureClient(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    const { endpoint, key } = azureConfig.eventGrid;
    if (!endpoint || !key) {
      console.warn(
        "[EventPublisher] Event Grid not configured — events will be logged to console"
      );
      return;
    }

    try {
      const { EventGridPublisherClient } = await import("@azure/eventgrid");
      const { AzureKeyCredential } = await import("@azure/core-auth");
      this.client = new EventGridPublisherClient(
        endpoint,
        "EventGrid",
        new AzureKeyCredential(key)
      );
      console.log("[EventPublisher] Event Grid client initialized");
    } catch (err) {
      console.warn(
        `[EventPublisher] Event Grid init failed — falling back to console: ${(err as Error).message}`
      );
    }
  }

  private async publish(event: RetailApiEvent): Promise<void> {
    await this.ensureClient();
    const envelope = {
      ...event,
      timestamp: event.timestamp ?? new Date().toISOString(),
    };

    if (this.client) {
      await (this.client as any).send([
        {
          eventType: event.eventType,
          subject: `retail-api-guardian/${event.vendor}`,
          dataVersion: "1.0",
          data: envelope,
        },
      ]);
      console.log(
        `[EventPublisher] Published ${event.eventType} for ${event.vendor}`
      );
    } else {
      console.log(
        `[EventPublisher][console] ${JSON.stringify(envelope)}`
      );
    }
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  async publishChangeDetected(
    vendor: string,
    changeData: unknown
  ): Promise<void> {
    await this.publish({
      eventType: "RetailApiGuardian.ChangeDetected",
      vendor,
      severity: "medium",
      data: changeData,
    });
  }

  async publishDeploymentComplete(
    vendor: string,
    deployResult: unknown
  ): Promise<void> {
    await this.publish({
      eventType: "RetailApiGuardian.DeploymentComplete",
      vendor,
      severity: "low",
      data: deployResult,
    });
  }

  async publishHealthAlert(
    vendor: string,
    status: "healthy" | "degraded" | "down"
  ): Promise<void> {
    const severity = status === "down" ? "critical" : status === "degraded" ? "high" : "low";
    await this.publish({
      eventType: "RetailApiGuardian.HealthAlert",
      vendor,
      severity,
      data: { status },
    });
  }
}
