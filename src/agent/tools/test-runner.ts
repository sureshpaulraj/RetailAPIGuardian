import { defineTool } from "@github/copilot-sdk";

interface TestRunnerArgs {
  vendor: string;
  testType: "unit" | "integration" | "smoke";
  adapterPath?: string;
}

interface TestResult {
  vendor: string;
  testType: string;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  results: TestCaseResult[];
  summary: string;
}

interface TestCaseResult {
  name: string;
  status: "passed" | "failed" | "skipped";
  duration: string;
  error?: string;
}

/**
 * Tool: run_integration_tests
 * Runs integration tests against vendor sandbox environments.
 */
export const runIntegrationTests = defineTool("run_integration_tests", {
  description:
    "Run integration tests against vendor sandbox environments to validate adapter code changes. Supports unit, integration, and smoke test types.",
  parameters: {
    type: "object" as const,
    properties: {
      vendor: {
        type: "string",
        description: "Vendor to test (e.g., 'stripe', 'shippo').",
      },
      testType: {
        type: "string",
        description: "Type of test to run: 'unit', 'integration', or 'smoke'.",
      },
      adapterPath: {
        type: "string",
        description: "Optional path to the adapter file being tested.",
      },
    },
    required: ["vendor", "testType"],
  },
  handler: async (args: TestRunnerArgs): Promise<TestResult> => {
    const { vendor, testType } = args;

    // Simulated test results — in production, this would run actual test suites
    const testSuites: Record<string, TestResult> = {
      "stripe-unit": {
        vendor: "Stripe",
        testType: "unit",
        passed: 12,
        failed: 0,
        skipped: 1,
        duration: "2.3s",
        results: [
          { name: "createPayment with valid payment_method", status: "passed", duration: "120ms" },
          { name: "createPayment retry on transient error", status: "passed", duration: "350ms" },
          { name: "createPayment fails after max retries", status: "passed", duration: "450ms" },
          { name: "refundPayment full amount", status: "passed", duration: "90ms" },
          { name: "refundPayment partial amount", status: "passed", duration: "85ms" },
          { name: "getPaymentStatus returns correct status", status: "passed", duration: "60ms" },
          { name: "webhook signature verification", status: "passed", duration: "15ms" },
          { name: "idempotency key generation", status: "passed", duration: "5ms" },
          { name: "currency validation", status: "passed", duration: "10ms" },
          { name: "amount conversion to cents", status: "passed", duration: "8ms" },
          { name: "metadata sanitization", status: "passed", duration: "12ms" },
          { name: "error mapping to internal codes", status: "passed", duration: "20ms" },
          { name: "3D Secure flow (requires manual test)", status: "skipped", duration: "0ms" },
        ],
        summary: "All unit tests passed. 1 skipped (requires manual 3DS flow).",
      },
      "stripe-integration": {
        vendor: "Stripe",
        testType: "integration",
        passed: 5,
        failed: 0,
        skipped: 0,
        duration: "8.7s",
        results: [
          { name: "End-to-end payment with sandbox", status: "passed", duration: "1.2s" },
          { name: "Payment + refund cycle", status: "passed", duration: "2.1s" },
          { name: "Webhook delivery and processing", status: "passed", duration: "3.5s" },
          { name: "Concurrent payment handling", status: "passed", duration: "1.4s" },
          { name: "Error recovery and retry", status: "passed", duration: "0.5s" },
        ],
        summary: "All integration tests passed against Stripe sandbox.",
      },
      "shippo-unit": {
        vendor: "Shippo",
        testType: "unit",
        passed: 7,
        failed: 1,
        skipped: 0,
        duration: "1.8s",
        results: [
          { name: "getRates returns valid rates", status: "passed", duration: "200ms" },
          { name: "getRates with carrier filter", status: "passed", duration: "180ms" },
          { name: "createShipment with valid data", status: "passed", duration: "150ms" },
          { name: "trackPackage returns tracking events", status: "passed", duration: "120ms" },
          { name: "address validation", status: "passed", duration: "90ms" },
          { name: "v2 response schema parsing", status: "passed", duration: "45ms" },
          { name: "rate comparison sorting", status: "passed", duration: "30ms" },
          { name: "international shipping surcharge calculation", status: "failed", duration: "200ms", error: "Expected surcharge 15.00 but got 12.50 — v2 API changed surcharge structure" },
        ],
        summary: "7 passed, 1 failed. International surcharge calculation needs update for v2 schema.",
      },
    };

    const key = `${vendor.toLowerCase()}-${testType}`;
    if (testSuites[key]) {
      return testSuites[key]!;
    }

    return {
      vendor,
      testType,
      passed: 0,
      failed: 0,
      skipped: 0,
      duration: "0s",
      results: [],
      summary: `No ${testType} test suite found for ${vendor}. Create tests first.`,
    };
  },
});
