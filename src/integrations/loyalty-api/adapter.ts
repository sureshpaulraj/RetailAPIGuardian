/**
 * Loyalty API Adapter — RetailAPIGuardian
 * Handles loyalty points, rewards, and member management.
 * Updated to use OAuth2 authentication (API key auth deprecated).
 */

export interface LoyaltyMember {
  memberId: string;
  email: string;
  points: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
}

export interface RewardRedemption {
  memberId: string;
  rewardId: string;
  pointsCost: number;
  success: boolean;
  transactionId: string;
}

interface OAuthToken {
  accessToken: string;
  expiresAt: number;
}

let cachedToken: OAuthToken | null = null;

/**
 * Gets an OAuth2 access token (replaces deprecated API key auth).
 */
async function getAccessToken(
  clientId: string,
  clientSecret: string,
  tokenUrl: string
): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.accessToken;
  }

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(`OAuth token error: ${response.status}`);
  }

  const data = await response.json();
  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - 60000, // Buffer 1 min
  };

  return cachedToken.accessToken;
}

/**
 * Retrieves loyalty member information.
 */
export async function getMember(
  baseUrl: string,
  credentials: { clientId: string; clientSecret: string; tokenUrl: string },
  memberId: string
): Promise<LoyaltyMember> {
  const token = await getAccessToken(
    credentials.clientId,
    credentials.clientSecret,
    credentials.tokenUrl
  );

  const response = await fetch(`${baseUrl}/v3/members/${memberId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`Loyalty API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Redeems a reward for a loyalty member.
 */
export async function redeemReward(
  baseUrl: string,
  credentials: { clientId: string; clientSecret: string; tokenUrl: string },
  memberId: string,
  rewardId: string
): Promise<RewardRedemption> {
  const token = await getAccessToken(
    credentials.clientId,
    credentials.clientSecret,
    credentials.tokenUrl
  );

  const response = await fetch(`${baseUrl}/v3/members/${memberId}/redeem`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reward_id: rewardId }),
  });

  if (!response.ok) {
    throw new Error(`Loyalty API redeem error: ${response.status}`);
  }

  return response.json();
}
