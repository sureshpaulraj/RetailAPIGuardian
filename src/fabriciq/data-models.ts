/**
 * Fabric IQ Data Models
 *
 * TypeScript interfaces for the analytics data pushed to
 * Microsoft Fabric Lakehouse tables and rendered on the dashboard.
 */

export interface HealthTrend {
  timestamp: string;
  vendor: string;
  status: "healthy" | "degraded" | "down";
  latencyMs: number;
  errorRate: number;
  uptimePercent: number;
}

export interface ChangeMetric {
  timestamp: string;
  vendor: string;
  severity: "low" | "medium" | "high" | "critical";
  changeType: "breaking" | "deprecation" | "security" | "feature";
  detectionTimeMinutes: number;
  resolutionTimeMinutes: number;
  automated: boolean;
}

export interface DeploymentMetric {
  timestamp: string;
  vendor: string;
  environment: "staging" | "production";
  strategy: "canary" | "blue-green" | "rolling";
  success: boolean;
  rolledBack: boolean;
  durationMinutes: number;
}

export interface CostSavings {
  period: string;
  manualHoursAvoided: number;
  automatedFixCount: number;
  incidentsPreventedCount: number;
  estimatedSavingsUSD: number;
}

export interface VendorHealthScore {
  vendor: string;
  score: number;
  status: "healthy" | "degraded" | "down";
  avgLatencyMs: number;
  avgErrorRate: number;
  uptimePercent: number;
}

export interface DashboardSummary {
  generatedAt: string;
  overallReliabilityPercent: number;
  vendorScores: VendorHealthScore[];
  totalChangesDetected: number;
  totalChangesFixed: number;
  mttdMinutes: number;
  mttfMinutes: number;
  deploymentSuccessRate: number;
  totalDeployments: number;
  totalRollbacks: number;
  totalCostSavingsUSD: number;
  monthlySavingsUSD: number;
}
