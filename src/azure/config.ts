/**
 * Azure Configuration — RetailAPIGuardian
 *
 * Reads Azure service configuration from environment variables with
 * sensible defaults. Supports demo mode when Azure resources aren't
 * provisioned — modules fall back to in-memory or console-based behavior.
 */

export interface AzureConfig {
  cosmos: {
    endpoint: string;
    key: string;
    database: string;
  };
  eventGrid: {
    endpoint: string;
    key: string;
  };
  keyVault: {
    url: string;
  };
  monitor: {
    workspaceId: string;
  };
  apim: {
    subscriptionId: string;
    resourceGroup: string;
    serviceName: string;
  };
}

export function loadAzureConfig(): AzureConfig {
  return {
    cosmos: {
      endpoint: process.env.AZURE_COSMOS_ENDPOINT ?? "",
      key: process.env.AZURE_COSMOS_KEY ?? "",
      database: process.env.AZURE_COSMOS_DATABASE ?? "retail-api-guardian",
    },
    eventGrid: {
      endpoint: process.env.AZURE_EVENTGRID_ENDPOINT ?? "",
      key: process.env.AZURE_EVENTGRID_KEY ?? "",
    },
    keyVault: {
      url: process.env.AZURE_KEYVAULT_URL ?? "",
    },
    monitor: {
      workspaceId: process.env.AZURE_MONITOR_WORKSPACE_ID ?? "",
    },
    apim: {
      subscriptionId: process.env.AZURE_APIM_SUBSCRIPTION_ID ?? "",
      resourceGroup: process.env.AZURE_APIM_RESOURCE_GROUP ?? "",
      serviceName: process.env.AZURE_APIM_SERVICE_NAME ?? "",
    },
  };
}

/** Returns true when the minimum Azure configuration (Cosmos endpoint) is set. */
export function isAzureConfigured(): boolean {
  return Boolean(process.env.AZURE_COSMOS_ENDPOINT);
}

export const azureConfig = loadAzureConfig();
