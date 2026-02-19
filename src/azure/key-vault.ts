/**
 * Key Vault Secret Manager — RetailAPIGuardian
 *
 * Provides secure access to vendor API keys and other secrets via Azure
 * Key Vault. Falls back to process.env when Key Vault is not configured,
 * enabling demo mode without Azure resources.
 */

import { azureConfig } from "./config.js";

export class SecretManager {
  private client: unknown | null = null;
  private initialized = false;

  private async ensureClient(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    if (!azureConfig.keyVault.url) {
      console.warn(
        "[SecretManager] Key Vault not configured — falling back to process.env"
      );
      return;
    }

    try {
      const { SecretClient } = await import("@azure/keyvault-secrets");
      const { DefaultAzureCredential } = await import("@azure/identity");
      this.client = new SecretClient(
        azureConfig.keyVault.url,
        new DefaultAzureCredential()
      );
      console.log("[SecretManager] Key Vault client initialized");
    } catch (err) {
      console.warn(
        `[SecretManager] Key Vault init failed — using process.env fallback: ${(err as Error).message}`
      );
    }
  }

  /** Retrieve a secret by name. Falls back to process.env[name]. */
  async getSecret(name: string): Promise<string | undefined> {
    await this.ensureClient();

    if (this.client) {
      try {
        const secret = await (this.client as any).getSecret(name);
        return secret.value;
      } catch (err) {
        console.warn(
          `[SecretManager] Failed to get secret "${name}": ${(err as Error).message}`
        );
      }
    }

    // Fallback: environment variable (convert kebab-case to UPPER_SNAKE_CASE)
    const envKey = name.toUpperCase().replace(/-/g, "_");
    return process.env[envKey];
  }

  /** Store a secret. No-op in demo mode. */
  async setSecret(name: string, value: string): Promise<void> {
    await this.ensureClient();

    if (this.client) {
      await (this.client as any).setSecret(name, value);
      console.log(`[SecretManager] Secret "${name}" saved`);
    } else {
      console.log(
        `[SecretManager][demo] setSecret("${name}") — skipped (no Key Vault)`
      );
    }
  }

  /** Convenience method to fetch a vendor API key by convention: "<vendor>-api-key". */
  async getVendorApiKey(vendor: string): Promise<string | undefined> {
    return this.getSecret(`${vendor.toLowerCase()}-api-key`);
  }
}
