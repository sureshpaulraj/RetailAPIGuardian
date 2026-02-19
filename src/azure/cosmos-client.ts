/**
 * Cosmos DB State Store — RetailAPIGuardian
 *
 * Persists change history, adapter versions, test results, and health
 * snapshots. Falls back to in-memory storage when Cosmos DB is not
 * configured so the demo runs without Azure resources.
 */

import { azureConfig, isAzureConfigured } from "./config.js";

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface ChangeRecord {
  id: string;
  vendor: string;
  changeType: string;
  severity: "low" | "medium" | "high" | "critical";
  summary: string;
  details: unknown;
  detectedAt: string;
}

export interface AdapterVersion {
  id: string;
  vendor: string;
  version: string;
  code: string;
  generatedAt: string;
  changeRecordId: string;
}

export interface TestResultRecord {
  id: string;
  vendor: string;
  adapterVersionId: string;
  passed: boolean;
  totalTests: number;
  failedTests: number;
  output: string;
  ranAt: string;
}

export interface HealthSnapshot {
  id: string;
  vendor: string;
  status: "healthy" | "degraded" | "down";
  latencyMs: number;
  checkedAt: string;
  details?: unknown;
}

// ---------------------------------------------------------------------------
// Container names
// ---------------------------------------------------------------------------

const CONTAINERS = {
  changes: "changes",
  adapters: "adapters",
  testResults: "test-results",
  health: "health",
} as const;

// ---------------------------------------------------------------------------
// In-memory fallback store
// ---------------------------------------------------------------------------

interface MemoryStore {
  changes: ChangeRecord[];
  adapters: AdapterVersion[];
  testResults: TestResultRecord[];
  health: HealthSnapshot[];
}

// ---------------------------------------------------------------------------
// StateStore class
// ---------------------------------------------------------------------------

export class StateStore {
  private cosmosClient: unknown | null = null;
  private database: unknown | null = null;
  private containers: Record<string, unknown> = {};
  private initialized = false;

  // Fallback storage used in demo mode
  private memory: MemoryStore = {
    changes: [],
    adapters: [],
    testResults: [],
    health: [],
  };

  /** Create database and containers. Safe to call multiple times. */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    if (!isAzureConfigured()) {
      console.warn(
        "[StateStore] Cosmos DB not configured — using in-memory fallback"
      );
      this.initialized = true;
      return;
    }

    try {
      // Dynamic import so the project compiles without @azure/cosmos installed
      const { CosmosClient } = await import("@azure/cosmos");
      this.cosmosClient = new CosmosClient({
        endpoint: azureConfig.cosmos.endpoint,
        key: azureConfig.cosmos.key,
      });

      const { database } = await (this.cosmosClient as any).databases.createIfNotExists({
        id: azureConfig.cosmos.database,
      });
      this.database = database;

      for (const name of Object.values(CONTAINERS)) {
        const { container } = await (database as any).containers.createIfNotExists({
          id: name,
          partitionKey: { paths: ["/vendor"] },
        });
        this.containers[name] = container;
      }

      console.log("[StateStore] Cosmos DB initialized");
    } catch (err) {
      console.warn(
        `[StateStore] Cosmos DB init failed — falling back to in-memory: ${(err as Error).message}`
      );
    }
    this.initialized = true;
  }

  // -----------------------------------------------------------------------
  // Change records
  // -----------------------------------------------------------------------

  async saveChange(change: ChangeRecord): Promise<void> {
    await this.initialize();
    if (this.containers[CONTAINERS.changes]) {
      await (this.containers[CONTAINERS.changes] as any).items.create(change);
    } else {
      this.memory.changes.push(change);
      console.log(`[StateStore][memory] Saved change ${change.id}`);
    }
  }

  async getChanges(vendor?: string): Promise<ChangeRecord[]> {
    await this.initialize();
    if (this.containers[CONTAINERS.changes]) {
      const query = vendor
        ? {
            query: "SELECT * FROM c WHERE c.vendor = @vendor ORDER BY c.detectedAt DESC",
            parameters: [{ name: "@vendor", value: vendor }],
          }
        : { query: "SELECT * FROM c ORDER BY c.detectedAt DESC" };
      const { resources } = await (this.containers[CONTAINERS.changes] as any)
        .items.query(query)
        .fetchAll();
      return resources as ChangeRecord[];
    }
    return vendor
      ? this.memory.changes.filter((c) => c.vendor === vendor)
      : [...this.memory.changes];
  }

  // -----------------------------------------------------------------------
  // Adapter versions
  // -----------------------------------------------------------------------

  async saveAdapterVersion(adapter: AdapterVersion): Promise<void> {
    await this.initialize();
    if (this.containers[CONTAINERS.adapters]) {
      await (this.containers[CONTAINERS.adapters] as any).items.create(adapter);
    } else {
      this.memory.adapters.push(adapter);
      console.log(`[StateStore][memory] Saved adapter version ${adapter.id}`);
    }
  }

  // -----------------------------------------------------------------------
  // Test results
  // -----------------------------------------------------------------------

  async saveTestResult(result: TestResultRecord): Promise<void> {
    await this.initialize();
    if (this.containers[CONTAINERS.testResults]) {
      await (this.containers[CONTAINERS.testResults] as any).items.create(result);
    } else {
      this.memory.testResults.push(result);
      console.log(`[StateStore][memory] Saved test result ${result.id}`);
    }
  }

  // -----------------------------------------------------------------------
  // Health snapshots
  // -----------------------------------------------------------------------

  async saveHealthSnapshot(snapshot: HealthSnapshot): Promise<void> {
    await this.initialize();
    if (this.containers[CONTAINERS.health]) {
      await (this.containers[CONTAINERS.health] as any).items.create(snapshot);
    } else {
      this.memory.health.push(snapshot);
      console.log(`[StateStore][memory] Saved health snapshot ${snapshot.id}`);
    }
  }

  /** Returns the most recent health snapshot per vendor. */
  async getLatestHealth(): Promise<HealthSnapshot[]> {
    await this.initialize();
    if (this.containers[CONTAINERS.health]) {
      const query = {
        query:
          "SELECT * FROM c WHERE c.checkedAt = (" +
          "SELECT VALUE MAX(h.checkedAt) FROM h IN c WHERE h.vendor = c.vendor" +
          ")",
      };
      const { resources } = await (this.containers[CONTAINERS.health] as any)
        .items.query(query)
        .fetchAll();
      return resources as HealthSnapshot[];
    }

    // In-memory: pick latest per vendor
    const latest = new Map<string, HealthSnapshot>();
    for (const s of this.memory.health) {
      const existing = latest.get(s.vendor);
      if (!existing || s.checkedAt > existing.checkedAt) {
        latest.set(s.vendor, s);
      }
    }
    return [...latest.values()];
  }
}
