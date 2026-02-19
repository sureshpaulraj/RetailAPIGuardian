/**
 * Shippo Shipping Adapter — RetailAPIGuardian
 * Handles shipping rate retrieval and shipment creation via Shippo v2 API.
 */

export interface Address {
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Parcel {
  length: number;
  width: number;
  height: number;
  weight: number;
  unit: "in" | "cm";
  weightUnit: "lb" | "kg";
}

export interface ShippingRateRequest {
  fromAddress: Address;
  toAddress: Address;
  parcel: Parcel;
  carrier?: string;
}

export interface ShippingRate {
  carrier: string;
  service: string;
  amount: number;
  currency: string;
  estimatedDays: number;
}

const SHIPPO_API_BASE = "https://api.goshippo.com/v2"; // Migrated from v1

/**
 * Fetches shipping rates from Shippo's v2 rates endpoint.
 */
export async function getRates(
  apiKey: string,
  request: ShippingRateRequest
): Promise<ShippingRate[]> {
  const response = await fetch(`${SHIPPO_API_BASE}/rates`, {
    method: "POST",
    headers: {
      Authorization: `ShippoToken ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address_from: request.fromAddress,
      address_to: request.toAddress,
      parcel: request.parcel,
      ...(request.carrier && { carrier_account: request.carrier }),
    }),
  });

  if (!response.ok) {
    throw new Error(`Shippo API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  // v2 uses 'results' instead of 'rates'
  return (data.results ?? []).map((r: any) => ({
    carrier: r.provider,
    service: r.servicelevel?.name ?? r.service,
    amount: parseFloat(r.amount),
    currency: r.currency,
    estimatedDays: r.estimated_days ?? r.days,
  }));
}
