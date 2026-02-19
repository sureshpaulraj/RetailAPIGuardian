/**
 * Work IQ Integration Barrel — RetailAPIGuardian
 *
 * Re-exports all Work IQ modules and provides a lazy-initialized singleton.
 */

export { workiqConfig, isWorkIQConfigured, loadWorkIQConfig } from "./config.js";
export type { WorkIQConfig } from "./config.js";

export {
  createChangeDetectedCard,
  createDeploymentCard,
  createHealthAlertCard,
  createDailyDigestCard,
} from "./adaptive-cards.js";
export type {
  DeploymentStep,
  HealthSummary,
  ChangesSummary,
  DeploymentsSummary,
} from "./adaptive-cards.js";

export { NotificationService } from "./notification-service.js";

// ---------------------------------------------------------------------------
// Singleton factory
// ---------------------------------------------------------------------------

import { NotificationService } from "./notification-service.js";

let _notificationService: NotificationService | null = null;

export function getNotificationService(): NotificationService {
  if (!_notificationService) {
    _notificationService = new NotificationService();
  }
  return _notificationService;
}
