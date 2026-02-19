/**
 * Fabric IQ Configuration
 *
 * Manages Microsoft Fabric connectivity settings for the
 * RetailAPIGuardian analytics dashboard.
 */

export interface FabricIQConfig {
  workspaceId: string;
  workspaceName: string;
  lakehouseId: string;
  tenantId: string;
  clientId: string;
  clientSecret: string;
  enabled: boolean;
}

export function loadFabricConfig(): FabricIQConfig {
  const config: FabricIQConfig = {
    workspaceId: process.env.FABRIC_WORKSPACE_ID ?? "",
    workspaceName:
      process.env.FABRIC_WORKSPACE_NAME ?? "democapacity4fabric",
    lakehouseId: process.env.FABRIC_LAKEHOUSE_ID ?? "",
    tenantId:
      process.env.FABRIC_TENANT_ID ??
      "5d0245d3-4d99-44f5-82d3-28c83aeda726",
    clientId: process.env.FABRIC_CLIENT_ID ?? "",
    clientSecret: process.env.FABRIC_CLIENT_SECRET ?? "",
    enabled: false,
  };
  config.enabled = isFabricConfigured(config);
  return config;
}

export function isFabricConfigured(
  config?: FabricIQConfig
): boolean {
  const c = config ?? loadFabricConfig();
  return !!(
    c.workspaceId &&
    c.lakehouseId &&
    c.clientId &&
    c.clientSecret &&
    c.tenantId
  );
}
