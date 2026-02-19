/**
 * Work IQ (Microsoft 365) Configuration — RetailAPIGuardian
 *
 * Reads Work IQ integration settings from environment variables.
 * Falls back to console logging when Microsoft Graph isn't configured.
 */

export interface WorkIQConfig {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  teamId: string;
  channelId: string;
  webhookUrl: string;
  emailRecipients: string[];
  enabled: boolean;
}

export function loadWorkIQConfig(): WorkIQConfig {
  const enabled = process.env.WORKIQ_ENABLED !== "false";
  const recipients = process.env.WORKIQ_EMAIL_RECIPIENTS ?? "";

  return {
    tenantId:
      process.env.WORKIQ_TENANT_ID ??
      "5d0245d3-4d99-44f5-82d3-28c83aeda726",
    clientId: process.env.WORKIQ_CLIENT_ID ?? "",
    clientSecret: process.env.WORKIQ_CLIENT_SECRET ?? "",
    teamId: process.env.WORKIQ_TEAM_ID ?? "",
    channelId: process.env.WORKIQ_CHANNEL_ID ?? "",
    webhookUrl: process.env.WORKIQ_WEBHOOK_URL ?? "",
    emailRecipients: recipients
      ? recipients.split(",").map((e) => e.trim())
      : [],
    enabled,
  };
}

/** Returns true when at least the webhook URL or Graph client credentials are set. */
export function isWorkIQConfigured(): boolean {
  return Boolean(
    process.env.WORKIQ_WEBHOOK_URL || process.env.WORKIQ_CLIENT_ID,
  );
}

export const workiqConfig = loadWorkIQConfig();
