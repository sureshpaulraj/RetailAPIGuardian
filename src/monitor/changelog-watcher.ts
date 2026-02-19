/**
 * Changelog Watcher — RetailAPIGuardian
 *
 * Azure Functions timer-triggered module that polls vendor API changelogs
 * and OpenAPI specs for changes. In production, this runs on a 15-minute
 * schedule via Azure Functions Timer Trigger.
 *
 * For the challenge demo, change data is simulated in the agent tools.
 * This module provides the production architecture pattern.
 */

export interface ChangelogSource {
  vendor: string;
  type: "rss" | "json" | "openapi-diff" | "github-releases";
  url: string;
  pollingIntervalMinutes: number;
}

export interface DetectedChange {
  vendor: string;
  source: string;
  rawContent: string;
  detectedAt: string;
  parsed: boolean;
}

// Vendor changelog sources — production configuration
const CHANGELOG_SOURCES: ChangelogSource[] = [
  {
    vendor: "Stripe",
    type: "json",
    url: "https://stripe.com/docs/changelog/feed",
    pollingIntervalMinutes: 15,
  },
  {
    vendor: "Shippo",
    type: "github-releases",
    url: "https://api.github.com/repos/goshippo/shippo-node-client/releases",
    pollingIntervalMinutes: 60,
  },
  {
    vendor: "LoyaltyAPI",
    type: "openapi-diff",
    url: "https://api.loyalty-platform.example.com/v3/openapi.json",
    pollingIntervalMinutes: 30,
  },
];

/**
 * Poll a single changelog source for new entries.
 * In production, this would fetch the URL and diff against the last known state.
 */
export async function pollChangelog(
  source: ChangelogSource
): Promise<DetectedChange[]> {
  // Production implementation would:
  // 1. Fetch the changelog URL
  // 2. Compare against last-known state in Cosmos DB
  // 3. Parse new entries into DetectedChange objects
  // 4. Publish to Azure Event Grid for routing to the agent

  console.log(
    `[ChangelogWatcher] Polling ${source.vendor} (${source.type}) at ${source.url}`
  );

  // Simulated — no actual HTTP calls for demo
  return [];
}

/**
 * Azure Functions timer trigger handler.
 * Runs on schedule to poll all vendor changelog sources.
 *
 * Example Azure Functions binding (function.json):
 * {
 *   "bindings": [{
 *     "name": "timer",
 *     "type": "timerTrigger",
 *     "direction": "in",
 *     "schedule": "0 *\/15 * * * *"
 *   }]
 * }
 */
export async function timerTrigger(): Promise<void> {
  console.log(
    `[ChangelogWatcher] Timer triggered at ${new Date().toISOString()}`
  );

  const allChanges: DetectedChange[] = [];

  for (const source of CHANGELOG_SOURCES) {
    try {
      const changes = await pollChangelog(source);
      allChanges.push(...changes);
    } catch (err) {
      console.error(
        `[ChangelogWatcher] Error polling ${source.vendor}: ${(err as Error).message}`
      );
    }
  }

  if (allChanges.length > 0) {
    console.log(
      `[ChangelogWatcher] Detected ${allChanges.length} new changes. Publishing to Event Grid.`
    );
    // In production: publish to Azure Event Grid
  } else {
    console.log("[ChangelogWatcher] No new changes detected.");
  }
}

export { CHANGELOG_SOURCES };
