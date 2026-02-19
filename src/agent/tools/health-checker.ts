import { defineTool } from "@github/copilot-sdk";

interface VendorHealthStatus {
  vendor: string;
  status: "healthy" | "degraded" | "down";
  latencyMs: number;
  lastChecked: string;
  errorRate: number;
  details: string;
}

interface HealthCheckArgs {
  vendor?: string;
}

/**
 * Tool: check_api_health
 * Checks the health of vendor API integrations.
 * In production, this would call actual vendor health endpoints.
 */
export const checkApiHealth = defineTool("check_api_health", {
  description:
    "Check the health status of vendor API integrations. Optionally specify a vendor name to check a specific integration, or omit to check all.",
  parameters: {
    type: "object" as const,
    properties: {
      vendor: {
        type: "string",
        description:
          "Vendor name to check (e.g., 'stripe', 'shippo', 'loyalty-api'). Omit to check all vendors.",
      },
    },
    required: [],
  },
  handler: async (args: HealthCheckArgs): Promise<VendorHealthStatus[]> => {
    const vendors: Record<string, VendorHealthStatus> = {
      stripe: {
        vendor: "Stripe",
        status: "healthy",
        latencyMs: 45,
        lastChecked: new Date().toISOString(),
        errorRate: 0.001,
        details: "All payment endpoints responding normally. API v2024-12-18.",
      },
      shippo: {
        vendor: "Shippo",
        status: "degraded",
        latencyMs: 320,
        lastChecked: new Date().toISOString(),
        errorRate: 0.05,
        details:
          "Rate tracking endpoint showing elevated latency. API v2024-01-01. Investigating.",
      },
      "loyalty-api": {
        vendor: "LoyaltyAPI",
        status: "healthy",
        latencyMs: 78,
        lastChecked: new Date().toISOString(),
        errorRate: 0.002,
        details: "Points and rewards endpoints nominal. API v3.2.1.",
      },
    };

    if (args.vendor) {
      const key = args.vendor.toLowerCase();
      const result = vendors[key];
      return result ? [result] : [{ vendor: args.vendor, status: "down", latencyMs: 0, lastChecked: new Date().toISOString(), errorRate: 1, details: `Unknown vendor: ${args.vendor}` }];
    }

    return Object.values(vendors);
  },
});
