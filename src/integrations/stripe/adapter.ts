/**
 * Stripe Payment Adapter — RetailAPIGuardian
 * Handles payment processing via Stripe's Payment Intents API.
 */

export interface PaymentRequest {
  amount: number;
  currency: string;
  paymentMethodId: string;
  customerId?: string;
  orderId: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  success: boolean;
  intentId: string;
  status: string;
  error?: string;
}

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

/**
 * Creates a payment intent using Stripe's latest API.
 * Uses payment_method (not deprecated 'source' parameter).
 */
export async function createPayment(
  apiKey: string,
  request: PaymentRequest
): Promise<PaymentResult> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch("https://api.stripe.com/v1/payment_intents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          amount: request.amount.toString(),
          currency: request.currency,
          payment_method: request.paymentMethodId,
          confirm: "true",
          "metadata[orderId]": request.orderId,
          ...(request.customerId && { customer: request.customerId }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message ?? `Stripe error: ${response.status}`);
      }

      return {
        success: data.status === "succeeded",
        intentId: data.id,
        status: data.status,
      };
    } catch (err) {
      lastError = err as Error;
      if (attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  return {
    success: false,
    intentId: "",
    status: "failed",
    error: lastError?.message ?? "Unknown error after retries",
  };
}
