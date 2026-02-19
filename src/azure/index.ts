/**
 * Azure Integration Barrel — RetailAPIGuardian
 *
 * Re-exports all Azure modules and provides lazy-initialized singletons.
 */

export { azureConfig, isAzureConfigured, loadAzureConfig } from "./config.js";
export type { AzureConfig } from "./config.js";

export { StateStore } from "./cosmos-client.js";
export type {
  ChangeRecord,
  AdapterVersion,
  TestResultRecord,
  HealthSnapshot,
} from "./cosmos-client.js";

export { EventPublisher } from "./event-grid.js";
export type { RetailApiEvent } from "./event-grid.js";

export { Telemetry } from "./monitor.js";

export { SecretManager } from "./key-vault.js";

// ---------------------------------------------------------------------------
// Singleton factories
// ---------------------------------------------------------------------------

import { StateStore } from "./cosmos-client.js";
import { EventPublisher } from "./event-grid.js";
import { Telemetry } from "./monitor.js";
import { SecretManager } from "./key-vault.js";

let _stateStore: StateStore | null = null;
let _eventPublisher: EventPublisher | null = null;
let _telemetry: Telemetry | null = null;
let _secretManager: SecretManager | null = null;

export function getStateStore(): StateStore {
  if (!_stateStore) _stateStore = new StateStore();
  return _stateStore;
}

export function getEventPublisher(): EventPublisher {
  if (!_eventPublisher) _eventPublisher = new EventPublisher();
  return _eventPublisher;
}

export function getTelemetry(): Telemetry {
  if (!_telemetry) _telemetry = new Telemetry();
  return _telemetry;
}

export function getSecretManager(): SecretManager {
  if (!_secretManager) _secretManager = new SecretManager();
  return _secretManager;
}
