/**
 * Azure Monitor Telemetry — RetailAPIGuardian
 *
 * Tracks health checks, API changes, deployments, and agent tool invocations.
 * Queries Log Analytics for recent alerts. Falls back to structured JSON
 * console logging when Azure Monitor is not configured.
 */

import { azureConfig } from "./config.js";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TelemetryEntry {
  metric: string;
  dimensions: Record<string, string | number | boolean>;
  timestamp: string;
}

interface AlertRecord {
  id: string;
  vendor: string;
  severity: string;
  message: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Telemetry class
// ---------------------------------------------------------------------------

export class Telemetry {
  private logsClient: unknown | null = null;
  private initialized = false;

  private async ensureClient(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    if (!azureConfig.monitor.workspaceId) {
      console.warn(
        "[Telemetry] Azure Monitor not configured — using console JSON fallback"
      );
      return;
    }

    try {
      const { LogsQueryClient } = await import("@azure/monitor-query");
      const { DefaultAzureCredential } = await import("@azure/identity");
      this.logsClient = new LogsQueryClient(new DefaultAzureCredential());
      console.log("[Telemetry] Azure Monitor client initialized");
    } catch (err) {
      console.warn(
        `[Telemetry] Azure Monitor init failed — using console fallback: ${(err as Error).message}`
      );
    }
  }

  private emit(entry: TelemetryEntry): void {
    console.log(`[Telemetry] ${JSON.stringify(entry)}`);
  }

  // -----------------------------------------------------------------------
  // Public API
  // -----------------------------------------------------------------------

  trackHealthCheck(
    vendor: string,
    status: "healthy" | "degraded" | "down",
    latencyMs: number
  ): void {
    this.emit({
      metric: "health_check",
      dimensions: { vendor, status, latencyMs },
      timestamp: new Date().toISOString(),
    });
  }

  trackApiChange(
    vendor: string,
    severity: string,
    changeType: string
  ): void {
    this.emit({
      metric: "api_change_detected",
      dimensions: { vendor, severity, changeType },
      timestamp: new Date().toISOString(),
    });
  }

  trackDeployment(
    vendor: string,
    environment: string,
    success: boolean
  ): void {
    this.emit({
      metric: "deployment",
      dimensions: { vendor, environment, success },
      timestamp: new Date().toISOString(),
    });
  }

  trackToolInvocation(
    toolName: string,
    durationMs: number,
    success: boolean
  ): void {
    this.emit({
      metric: "tool_invocation",
      dimensions: { toolName, durationMs, success },
      timestamp: new Date().toISOString(),
    });
  }

  /** Query recent alerts from Log Analytics; returns mock data when not configured. */
  async queryRecentAlerts(): Promise<AlertRecord[]> {
    await this.ensureClient();

    if (this.logsClient && azureConfig.monitor.workspaceId) {
      try {
        const result = await (this.logsClient as any).queryWorkspace(
          azureConfig.monitor.workspaceId,
          "AppExceptions | where TimeGenerated > ago(24h) | project TimeGenerated, Properties, SeverityLevel | order by TimeGenerated desc | take 20",
          { duration: "P1D" }
        );
        const rows: AlertRecord[] = (result.tables?.[0]?.rows ?? []).map(
          (row: unknown[], idx: number) => ({
            id: `alert-${idx}`,
            vendor: String((row as any)[1] ?? "unknown"),
            severity: String((row as any)[2] ?? "medium"),
            message: String((row as any)[1] ?? ""),
            timestamp: String((row as any)[0] ?? new Date().toISOString()),
          })
        );
        return rows;
      } catch (err) {
        console.warn(
          `[Telemetry] Log Analytics query failed: ${(err as Error).message}`
        );
      }
    }

    // Demo / fallback mock data
    return [
      {
        id: "mock-alert-1",
        vendor: "Stripe",
        severity: "high",
        message: "Stripe API latency exceeded 2000ms threshold",
        timestamp: new Date(Date.now() - 3_600_000).toISOString(),
      },
      {
        id: "mock-alert-2",
        vendor: "Shippo",
        severity: "medium",
        message: "Shippo webhook delivery delayed",
        timestamp: new Date(Date.now() - 7_200_000).toISOString(),
      },
    ];
  }
}
