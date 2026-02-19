/**
 * Fabric IQ Analytics Engine
 *
 * Generates sample analytics data, computes dashboard summaries,
 * and pushes data to Microsoft Fabric Lakehouse when configured.
 */

import { loadFabricConfig } from "./config.js";
import type {
  HealthTrend,
  ChangeMetric,
  DeploymentMetric,
  CostSavings,
  DashboardSummary,
  VendorHealthScore,
} from "./data-models.js";

// ── Deterministic seeded random for reproducible demo data ──────
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export class AnalyticsEngine {
  private healthTrends: HealthTrend[] = [];
  private changeMetrics: ChangeMetric[] = [];
  private deploymentMetrics: DeploymentMetric[] = [];
  private costSavings: CostSavings[] = [];
  private initialized = false;

  /** Ensure sample data is generated once. */
  private ensureData(): void {
    if (!this.initialized) {
      const data = this.generateSampleData();
      this.healthTrends = data.healthTrends;
      this.changeMetrics = data.changeMetrics;
      this.deploymentMetrics = data.deploymentMetrics;
      this.costSavings = data.costSavings;
      this.initialized = true;
    }
  }

  // ── Public accessors ──────────────────────────────────────────

  getHealthTrends(): HealthTrend[] {
    this.ensureData();
    return this.healthTrends;
  }

  getChangeMetrics(): ChangeMetric[] {
    this.ensureData();
    return this.changeMetrics;
  }

  getDeploymentMetrics(): DeploymentMetric[] {
    this.ensureData();
    return this.deploymentMetrics;
  }

  getCostSavings(): CostSavings[] {
    this.ensureData();
    return this.costSavings;
  }

  // ── Sample data generation ────────────────────────────────────

  generateSampleData(): {
    healthTrends: HealthTrend[];
    changeMetrics: ChangeMetric[];
    deploymentMetrics: DeploymentMetric[];
    costSavings: CostSavings[];
  } {
    const rand = seededRandom(42);
    const now = Date.now();
    const DAY = 86_400_000;
    const HOUR = 3_600_000;
    const vendors = ["Stripe", "Shippo", "LoyaltyAPI"] as const;

    // ── Health trends: every 4 hours for 30 days (540 records) ──
    const healthTrends: HealthTrend[] = [];
    for (let d = 29; d >= 0; d--) {
      for (let h = 0; h < 24; h += 4) {
        const ts = new Date(now - d * DAY + h * HOUR).toISOString();
        for (const vendor of vendors) {
          let status: HealthTrend["status"] = "healthy";
          let latencyMs: number;
          let errorRate: number;
          let uptimePercent: number;

          if (vendor === "Stripe") {
            latencyMs = 35 + Math.round(rand() * 30);
            errorRate = Math.round(rand() * 0.005 * 1000) / 1000;
            uptimePercent = 99.95 + Math.round(rand() * 5) / 100;
            if (uptimePercent > 100) uptimePercent = 100;
          } else if (vendor === "Shippo") {
            latencyMs = 180 + Math.round(rand() * 200);
            errorRate = Math.round(rand() * 0.08 * 1000) / 1000;
            uptimePercent = 98.5 + Math.round(rand() * 150) / 100;
            if (uptimePercent > 100) uptimePercent = 100;
            // Occasional degradation (days 10-12)
            if (d >= 18 && d <= 20) {
              status = "degraded";
              latencyMs += 200;
              errorRate = 0.05 + Math.round(rand() * 0.1 * 1000) / 1000;
              uptimePercent = 95 + Math.round(rand() * 300) / 100;
            }
          } else {
            // LoyaltyAPI — brief outage around day 7
            latencyMs = 60 + Math.round(rand() * 40);
            errorRate = Math.round(rand() * 0.01 * 1000) / 1000;
            uptimePercent = 99.8 + Math.round(rand() * 20) / 100;
            if (uptimePercent > 100) uptimePercent = 100;
            if (d === 23 && h >= 8 && h <= 16) {
              status = "down";
              latencyMs = 0;
              errorRate = 1;
              uptimePercent = 0;
            } else if (d === 23 && h >= 4) {
              status = "degraded";
              latencyMs += 400;
              errorRate = 0.15;
              uptimePercent = 88;
            }
          }

          healthTrends.push({ timestamp: ts, vendor, status, latencyMs, errorRate, uptimePercent });
        }
      }
    }

    // ── Change metrics: 10 changes over 30 days ─────────────────
    const severities: ChangeMetric["severity"][] = ["low", "medium", "high", "critical"];
    const changeTypes: ChangeMetric["changeType"][] = ["breaking", "deprecation", "security", "feature"];
    const changeMetrics: ChangeMetric[] = [
      { timestamp: new Date(now - 28 * DAY).toISOString(), vendor: "Stripe", severity: "high", changeType: "breaking", detectionTimeMinutes: 12, resolutionTimeMinutes: 45, automated: true },
      { timestamp: new Date(now - 25 * DAY).toISOString(), vendor: "Shippo", severity: "medium", changeType: "deprecation", detectionTimeMinutes: 8, resolutionTimeMinutes: 30, automated: true },
      { timestamp: new Date(now - 22 * DAY).toISOString(), vendor: "LoyaltyAPI", severity: "critical", changeType: "security", detectionTimeMinutes: 5, resolutionTimeMinutes: 90, automated: false },
      { timestamp: new Date(now - 19 * DAY).toISOString(), vendor: "Stripe", severity: "low", changeType: "feature", detectionTimeMinutes: 15, resolutionTimeMinutes: 20, automated: true },
      { timestamp: new Date(now - 16 * DAY).toISOString(), vendor: "Shippo", severity: "high", changeType: "breaking", detectionTimeMinutes: 10, resolutionTimeMinutes: 60, automated: true },
      { timestamp: new Date(now - 13 * DAY).toISOString(), vendor: "LoyaltyAPI", severity: "medium", changeType: "deprecation", detectionTimeMinutes: 7, resolutionTimeMinutes: 35, automated: true },
      { timestamp: new Date(now - 10 * DAY).toISOString(), vendor: "Stripe", severity: "medium", changeType: "security", detectionTimeMinutes: 4, resolutionTimeMinutes: 25, automated: true },
      { timestamp: new Date(now - 7 * DAY).toISOString(), vendor: "Shippo", severity: "low", changeType: "feature", detectionTimeMinutes: 18, resolutionTimeMinutes: 15, automated: true },
      { timestamp: new Date(now - 4 * DAY).toISOString(), vendor: "LoyaltyAPI", severity: "high", changeType: "breaking", detectionTimeMinutes: 6, resolutionTimeMinutes: 55, automated: true },
      { timestamp: new Date(now - 1 * DAY).toISOString(), vendor: "Stripe", severity: "critical", changeType: "security", detectionTimeMinutes: 3, resolutionTimeMinutes: 40, automated: true },
    ];

    // ── Deployment metrics: 18 deployments ──────────────────────
    const strategies: DeploymentMetric["strategy"][] = ["canary", "blue-green", "rolling"];
    const deploymentMetrics: DeploymentMetric[] = [];
    const deployDays = [28, 27, 25, 23, 22, 20, 19, 17, 16, 14, 13, 11, 10, 7, 5, 4, 2, 1];
    for (let i = 0; i < deployDays.length; i++) {
      const vendor = vendors[i % 3];
      const env: DeploymentMetric["environment"] = i % 3 === 0 ? "production" : "staging";
      const strat = strategies[i % 3];
      const success = i !== 4 && i !== 11; // two failures
      const rolledBack = !success;
      const duration = 3 + Math.round(rand() * 12);
      deploymentMetrics.push({
        timestamp: new Date(now - deployDays[i] * DAY).toISOString(),
        vendor,
        environment: env,
        strategy: strat,
        success,
        rolledBack,
        durationMinutes: duration,
      });
    }

    // ── Cost savings: 4 weekly summaries ────────────────────────
    const costSavings: CostSavings[] = [];
    for (let w = 3; w >= 0; w--) {
      const weekStart = new Date(now - (w * 7 + 7) * DAY);
      const weekEnd = new Date(now - w * 7 * DAY);
      const period = `${weekStart.toISOString().slice(0, 10)} to ${weekEnd.toISOString().slice(0, 10)}`;
      costSavings.push({
        period,
        manualHoursAvoided: 12 + Math.round(rand() * 18),
        automatedFixCount: 2 + Math.round(rand() * 4),
        incidentsPreventedCount: 1 + Math.round(rand() * 3),
        estimatedSavingsUSD: 2800 + Math.round(rand() * 4200),
      });
    }

    // Suppress unused-variable lint for helper arrays used to type-check
    void severities;
    void changeTypes;

    return { healthTrends, changeMetrics, deploymentMetrics, costSavings };
  }

  // ── Dashboard summary ─────────────────────────────────────────

  computeDashboard(): DashboardSummary {
    this.ensureData();

    const vendors = ["Stripe", "Shippo", "LoyaltyAPI"];
    const vendorScores: VendorHealthScore[] = vendors.map((vendor) => {
      const records = this.healthTrends.filter((h) => h.vendor === vendor);
      const recent = records.slice(-30); // last 5 days
      const avgLatency =
        recent.reduce((s, r) => s + r.latencyMs, 0) / (recent.length || 1);
      const avgError =
        recent.reduce((s, r) => s + r.errorRate, 0) / (recent.length || 1);
      const avgUptime =
        recent.reduce((s, r) => s + r.uptimePercent, 0) / (recent.length || 1);

      // Score: 100 minus penalties for latency, errors, downtime
      let score = 100;
      score -= Math.min(20, avgLatency / 50);
      score -= Math.min(40, avgError * 400);
      score -= Math.min(30, (100 - avgUptime) * 3);
      score = Math.max(0, Math.round(score * 10) / 10);

      const lastStatus = recent.length > 0 ? recent[recent.length - 1].status : "healthy";

      return {
        vendor,
        score,
        status: lastStatus,
        avgLatencyMs: Math.round(avgLatency),
        avgErrorRate: Math.round(avgError * 1000) / 1000,
        uptimePercent: Math.round(avgUptime * 100) / 100,
      };
    });

    const overallReliability =
      Math.round(
        (vendorScores.reduce((s, v) => s + v.uptimePercent, 0) /
          vendorScores.length) *
          100
      ) / 100;

    const totalChanges = this.changeMetrics.length;
    const fixedChanges = this.changeMetrics.filter(
      (c) => c.resolutionTimeMinutes > 0
    ).length;

    const mttd =
      Math.round(
        (this.changeMetrics.reduce((s, c) => s + c.detectionTimeMinutes, 0) /
          (totalChanges || 1)) *
          10
      ) / 10;

    const mttf =
      Math.round(
        (this.changeMetrics.reduce((s, c) => s + c.resolutionTimeMinutes, 0) /
          (totalChanges || 1)) *
          10
      ) / 10;

    const successfulDeploys = this.deploymentMetrics.filter((d) => d.success).length;
    const deploySuccessRate =
      Math.round(
        (successfulDeploys / (this.deploymentMetrics.length || 1)) * 1000
      ) / 10;

    const totalRollbacks = this.deploymentMetrics.filter((d) => d.rolledBack).length;

    const totalSavings = this.costSavings.reduce(
      (s, c) => s + c.estimatedSavingsUSD,
      0
    );
    const monthlySavings = Math.round(
      (totalSavings / (this.costSavings.length || 1)) * 4.33
    );

    return {
      generatedAt: new Date().toISOString(),
      overallReliabilityPercent: overallReliability,
      vendorScores,
      totalChangesDetected: totalChanges,
      totalChangesFixed: fixedChanges,
      mttdMinutes: mttd,
      mttfMinutes: mttf,
      deploymentSuccessRate: deploySuccessRate,
      totalDeployments: this.deploymentMetrics.length,
      totalRollbacks,
      totalCostSavingsUSD: totalSavings,
      monthlySavingsUSD: monthlySavings,
    };
  }

  // ── Push to Fabric Lakehouse ──────────────────────────────────

  async pushToFabric(data: Record<string, unknown>): Promise<boolean> {
    const config = loadFabricConfig();

    if (!config.enabled) {
      console.log(
        "[FabricIQ] Fabric not configured — analytics stored locally."
      );
      return false;
    }

    const tokenUrl = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`;

    try {
      // Obtain access token via client credentials
      const tokenRes = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: config.clientId,
          client_secret: config.clientSecret,
          scope: "https://api.fabric.microsoft.com/.default",
        }),
      });

      if (!tokenRes.ok) {
        console.error("[FabricIQ] Token acquisition failed:", tokenRes.status);
        return false;
      }

      const tokenBody = (await tokenRes.json()) as { access_token: string };
      const accessToken = tokenBody.access_token;

      // Push each table
      const tables = Object.keys(data);
      for (const tableName of tables) {
        const url =
          `https://api.fabric.microsoft.com/v1/workspaces/${config.workspaceId}` +
          `/lakehouses/${config.lakehouseId}/tables/${tableName}/load`;

        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data[tableName]),
        });

        if (!res.ok) {
          console.error(
            `[FabricIQ] Failed to push table ${tableName}:`,
            res.status
          );
          return false;
        }
      }

      console.log("[FabricIQ] Data pushed to Fabric Lakehouse successfully.");
      return true;
    } catch (err) {
      console.error("[FabricIQ] Push to Fabric failed:", err);
      return false;
    }
  }
}
