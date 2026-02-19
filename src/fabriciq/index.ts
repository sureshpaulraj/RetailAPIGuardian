/**
 * Fabric IQ — Barrel Exports
 */

export type { FabricIQConfig } from "./config.js";
export { loadFabricConfig, isFabricConfigured } from "./config.js";

export type {
  HealthTrend,
  ChangeMetric,
  DeploymentMetric,
  CostSavings,
  VendorHealthScore,
  DashboardSummary,
} from "./data-models.js";

export { AnalyticsEngine } from "./analytics-engine.js";
export { createDashboardRouter } from "./dashboard-routes.js";

// ── Singleton ───────────────────────────────────────────────────

import { AnalyticsEngine as AE } from "./analytics-engine.js";

let _engine: AE | undefined;

export function getAnalyticsEngine(): AE {
  if (!_engine) {
    _engine = new AE();
  }
  return _engine;
}
