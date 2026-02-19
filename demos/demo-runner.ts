/**
 * Demo Runner — RetailAPIGuardian
 *
 * Simulates the agent interactive session with realistic output
 * and timing delays for screen recording.
 *
 * Run: npx tsx demos/demo-runner.ts
 */

// ── ANSI color helpers ──────────────────────────────────────────────

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  white: "\x1b[37m",
  bgCyan: "\x1b[46m",
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
};

// ── Utility functions ───────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeText(text: string, delayMs = 50): Promise<void> {
  for (const ch of text) {
    process.stdout.write(ch);
    await sleep(delayMs);
  }
  process.stdout.write("\n");
}

function print(text: string): void {
  console.log(text);
}

function printAgent(text: string): void {
  console.log(`${C.cyan}${text}${C.reset}`);
}

function printUser(text: string): void {
  process.stdout.write(`${C.green}${C.bold}guardian> ${C.reset}${C.green}`);
  // Return promise is intentionally not awaited here; callers await typeCommand instead
  void Promise.resolve();
}

async function typeCommand(cmd: string): Promise<void> {
  process.stdout.write(`${C.green}${C.bold}guardian> ${C.reset}${C.green}`);
  await typeText(cmd, 50);
  process.stdout.write(C.reset);
}

function divider(): void {
  print(`${C.dim}${"─".repeat(60)}${C.reset}`);
}

function sectionHeader(title: string): void {
  print("");
  print(`${C.bold}${C.magenta}▸ ${title}${C.reset}`);
  divider();
}

// ── Banner ──────────────────────────────────────────────────────────

function printBanner(): void {
  print("");
  print(`${C.cyan}${C.bold}╔══════════════════════════════════════════════════════════╗${C.reset}`);
  print(`${C.cyan}${C.bold}║                                                          ║${C.reset}`);
  print(`${C.cyan}${C.bold}║   🛡️  RetailAPIGuardian — Enterprise API Agent            ║${C.reset}`);
  print(`${C.cyan}${C.bold}║   Powered by GitHub Copilot SDK + Azure                   ║${C.reset}`);
  print(`${C.cyan}${C.bold}║                                                          ║${C.reset}`);
  print(`${C.cyan}${C.bold}╚══════════════════════════════════════════════════════════╝${C.reset}`);
  print("");
  print(`${C.dim}  Tools: health · changes · fix · test · deploy${C.reset}`);
  print(`${C.dim}  Vendors: Stripe · Shippo · LoyaltyAPI${C.reset}`);
  print("");
}

// ── Demo sections ───────────────────────────────────────────────────

async function demoHealth(): Promise<void> {
  sectionHeader("Act 2 — Health Check");
  await typeCommand("health");
  await sleep(800);

  printAgent("🛡️ Guardian: I'll check the health of all vendor API integrations.");
  print("");
  await sleep(500);

  print(`${C.cyan}╔════════════════════════════════════════════════════════════╗${C.reset}`);
  print(`${C.cyan}║              Vendor Integration Health                      ║${C.reset}`);
  print(`${C.cyan}╠════════════════════════════════════════════════════════════╣${C.reset}`);
  print(`${C.cyan}║ Vendor       │ Status      │ Latency │ Error Rate │ Last  ║${C.reset}`);
  print(`${C.cyan}╠════════════════════════════════════════════════════════════╣${C.reset}`);
  await sleep(300);
  print(`${C.cyan}║${C.reset} Stripe       │ ${C.green}✅ Healthy${C.reset}  │  ${C.green}45ms${C.reset}   │   ${C.green}0.1%${C.reset}     │ now   ${C.cyan}║${C.reset}`);
  await sleep(300);
  print(`${C.cyan}║${C.reset} Shippo       │ ${C.yellow}⚠️  Degraded${C.reset}│ ${C.yellow}320ms${C.reset}   │   ${C.yellow}5.0%${C.reset}     │ now   ${C.cyan}║${C.reset}`);
  await sleep(300);
  print(`${C.cyan}║${C.reset} LoyaltyAPI   │ ${C.green}✅ Healthy${C.reset}  │  ${C.green}78ms${C.reset}   │   ${C.green}0.2%${C.reset}     │ now   ${C.cyan}║${C.reset}`);
  print(`${C.cyan}╚════════════════════════════════════════════════════════════╝${C.reset}`);
  print("");
  printAgent(
    "Summary: 2/3 vendors healthy. Shippo showing elevated latency —"
  );
  printAgent("recommend monitoring. No immediate action required.");
  await sleep(2500);
}

async function demoChanges(): Promise<void> {
  sectionHeader("Act 3 — Change Detection");
  await typeCommand("changes");
  await sleep(800);

  printAgent(
    "🛡️ Guardian: Scanning vendor changelogs and OpenAPI spec diffs..."
  );
  print("");
  await sleep(600);

  // Critical
  print(
    `${C.red}${C.bold}  ● CRITICAL${C.reset}  ${C.white}Stripe v2025-03-01${C.reset}`
  );
  print(
    `    ${C.red}Breaking:${C.reset} \`source\` parameter removed → use \`payment_method\``
  );
  print(`    ${C.dim}Deadline: April 1, 2025 · Affects: payment adapter${C.reset}`);
  print("");
  await sleep(400);

  // High
  print(
    `${C.yellow}${C.bold}  ● HIGH${C.reset}      ${C.white}Shippo v2025-02-15${C.reset}`
  );
  print(
    `    ${C.yellow}Deprecation:${C.reset} \`/v1/rates\` endpoint → use \`/v2/rates\``
  );
  print(
    `    ${C.dim}Deadline: June 30, 2025 · Affects: shipping adapter${C.reset}`
  );
  print("");
  await sleep(400);

  // Medium
  print(
    `${C.yellow}  ● MEDIUM${C.reset}    ${C.white}LoyaltyAPI v3.2.0${C.reset}`
  );
  print(
    `    ${C.yellow}New field:${C.reset} \`tier_expiry\` added to member response`
  );
  print(
    `    ${C.dim}Optional · Affects: loyalty adapter${C.reset}`
  );
  print("");
  await sleep(400);

  // Low
  print(
    `${C.green}  ● LOW${C.reset}       ${C.white}Stripe v2025-02-20${C.reset}`
  );
  print(
    `    ${C.green}Enhancement:${C.reset} New \`metadata\` field on PaymentIntent`
  );
  print(`    ${C.dim}Additive · No action required${C.reset}`);
  print("");

  printAgent("Found 4 changes across 3 vendors. 1 critical change requires");
  printAgent("immediate action — Stripe payment_method migration.");
  await sleep(2500);
}

async function demoFix(): Promise<void> {
  sectionHeader("Act 4a — Auto-Fix (Code Generation)");
  await typeCommand("fix");
  await sleep(800);

  printAgent(
    "🛡️ Guardian: Generating updated adapter for Stripe payment_method migration..."
  );
  print("");
  await sleep(600);

  print(`${C.dim}── src/integrations/stripe/adapter.ts ──${C.reset}`);
  print("");
  print(`${C.cyan}export async function createPayment(${C.reset}`);
  print(`${C.cyan}  amount: number,${C.reset}`);
  print(`${C.cyan}  currency: string,${C.reset}`);
  print(`${C.cyan}  paymentMethodId: string,${C.reset}`);
  print(`${C.cyan}  options?: PaymentOptions${C.reset}`);
  print(`${C.cyan}): Promise<PaymentResult> {${C.reset}`);
  print(
    `${C.green}+   // Migrated: source → payment_method (Stripe v2025-03-01)${C.reset}`
  );
  print(`${C.green}+   const intent = await retryWithBackoff(async () => {${C.reset}`);
  print(`${C.green}+     return stripe.paymentIntents.create({${C.reset}`);
  print(`${C.green}+       amount,${C.reset}`);
  print(`${C.green}+       currency,${C.reset}`);
  print(
    `${C.green}+       payment_method: paymentMethodId,  // was: source${C.reset}`
  );
  print(`${C.green}+       confirm: true,${C.reset}`);
  print(`${C.green}+       ...options,${C.reset}`);
  print(`${C.green}+     });${C.reset}`);
  print(`${C.green}+   }, { maxRetries: 3, baseDelay: 1000 });${C.reset}`);
  print(`${C.cyan}${C.reset}`);
  print(
    `${C.green}+   logger.info('Payment created', {${C.reset}`
  );
  print(
    `${C.green}+     intentId: intent.id, amount, currency${C.reset}`
  );
  print(`${C.green}+   });${C.reset}`);
  print(`${C.green}+   return mapToPaymentResult(intent);${C.reset}`);
  print(`${C.cyan}}${C.reset}`);
  print("");

  await sleep(500);
  print(`${C.bold}Changes Summary:${C.reset}`);
  print(`  • Replaced \`source\` with \`payment_method\` parameter`);
  print(`  • Added retry with exponential backoff (3 retries, 1s base)`);
  print(`  • Added structured logging for audit trail`);
  print(`  • Updated TypeScript types for PaymentIntent v2025-03-01`);
  print("");
  printAgent("Adapter code generated. Run 'test' to validate against sandbox.");
  await sleep(2500);
}

async function demoTest(): Promise<void> {
  sectionHeader("Act 4b — Integration Testing");
  await typeCommand("test");
  await sleep(800);

  printAgent(
    "🛡️ Guardian: Running integration tests against Stripe sandbox..."
  );
  print("");
  await sleep(600);

  const tests = [
    { name: "createPayment — valid card", status: "passed" },
    { name: "createPayment — insufficient funds", status: "passed" },
    { name: "createPayment — invalid payment_method", status: "passed" },
    { name: "createPayment — network timeout + retry", status: "passed" },
    { name: "createPayment — idempotency key", status: "passed" },
    { name: "refundPayment — full refund", status: "passed" },
    { name: "refundPayment — partial refund", status: "passed" },
    { name: "getPaymentStatus — success", status: "passed" },
    { name: "getPaymentStatus — not found", status: "passed" },
    { name: "webhook — payment_intent.succeeded", status: "passed" },
    { name: "webhook — payment_intent.failed", status: "passed" },
    { name: "rate limiting — circuit breaker", status: "skipped" },
  ];

  for (const t of tests) {
    await sleep(150);
    if (t.status === "passed") {
      print(`  ${C.green}✔${C.reset}  ${t.name}`);
    } else {
      print(`  ${C.yellow}⊘${C.reset}  ${C.dim}${t.name} (sandbox unavailable)${C.reset}`);
    }
  }

  print("");
  print(
    `${C.bold}Results:${C.reset}  ${C.green}11 passed${C.reset}  ·  ${C.red}0 failed${C.reset}  ·  ${C.yellow}1 skipped${C.reset}  ·  suite: stripe-unit`
  );
  print("");
  printAgent("All critical tests passed. Adapter is validated for deployment.");
  await sleep(2500);
}

async function demoDeploy(): Promise<void> {
  sectionHeader("Act 5 — Safe Deployment");
  await typeCommand("deploy");
  await sleep(800);

  printAgent(
    "🛡️ Guardian: Initiating canary deployment to staging..."
  );
  print("");
  await sleep(600);

  const steps: Array<{
    icon: string;
    label: string;
    delay: number;
    color: string;
  }> = [
    { icon: "📦", label: "Building adapter bundle...", delay: 800, color: C.white },
    { icon: "🔍", label: "Running pre-deploy validation...", delay: 600, color: C.white },
    { icon: "🔐", label: "Fetching secrets from Azure Key Vault...", delay: 500, color: C.white },
    { icon: "🚀", label: "Deploying to staging (canary 10%)...", delay: 1200, color: C.cyan },
    { icon: "📊", label: "Monitoring error rates (30s window)...", delay: 1500, color: C.cyan },
    { icon: "✅", label: "Canary healthy — promoting to 50%...", delay: 1000, color: C.green },
    { icon: "📊", label: "Monitoring error rates (30s window)...", delay: 1200, color: C.cyan },
    { icon: "✅", label: "Canary healthy — promoting to 100% staging...", delay: 800, color: C.green },
  ];

  for (const step of steps) {
    print(`  ${step.icon}  ${step.color}${step.label}${C.reset}`);
    await sleep(step.delay);
  }

  print("");
  print(
    `${C.bgGreen}${C.bold} STAGING COMPLETE ${C.reset}  Stripe adapter v2025-03-01 deployed to staging`
  );
  print("");
  print(
    `${C.yellow}${C.bold}  ⏸  Production deployment requires human approval.${C.reset}`
  );
  print(
    `${C.dim}     Approve via: GitHub Actions → Deploy Pipeline → Review${C.reset}`
  );
  print(
    `${C.dim}     Rollback: automatic on error-rate > 1% in 5-minute window${C.reset}`
  );
  print("");

  printAgent(
    "Staging deployment complete. Awaiting human approval for production."
  );
  printAgent("Responsible AI: production changes always require sign-off.");
  await sleep(2500);
}

// ── Main ────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const startTime = Date.now();

  printBanner();
  await sleep(2000);

  // Act 1 — intro narration
  sectionHeader("Act 1 — The Problem");
  print(
    `${C.dim}Retail teams spend 40+ hours/month on API integration maintenance.${C.reset}`
  );
  print(
    `${C.dim}RetailAPIGuardian automates the full lifecycle: detect → fix → test → deploy.${C.reset}`
  );
  await sleep(3000);

  await demoHealth();
  await demoChanges();
  await demoFix();
  await demoTest();
  await demoDeploy();

  // Wrap-up
  sectionHeader("Act 6 — Wrap-Up");
  print(
    `${C.bold}RetailAPIGuardian${C.reset}: from detection to deployment in minutes, not days.`
  );
  print("");
  print(`  ${C.cyan}▸${C.reset} GitHub Copilot SDK — 5 tools via defineTool()`);
  print(`  ${C.cyan}▸${C.reset} Azure — Functions, Event Grid, Cosmos DB, Key Vault`);
  print(`  ${C.cyan}▸${C.reset} Enterprise — retry, circuit breaker, human-in-the-loop`);
  print(`  ${C.cyan}▸${C.reset} Responsible AI — approval gates, full audit trail`);
  print("");

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  print(`${C.dim}Demo completed in ${elapsed}s${C.reset}`);
  print("");
}

main().catch(console.error);
