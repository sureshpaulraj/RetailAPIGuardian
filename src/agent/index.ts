import { CopilotClient } from "@github/copilot-sdk";
import * as readline from "readline";

import { RETAIL_SYSTEM_PROMPT } from "./prompts/system.js";
import { checkApiHealth } from "./tools/health-checker.js";
import { monitorApiChanges } from "./tools/api-monitor.js";
import { generateAdapterCode } from "./tools/code-generator.js";
import { runIntegrationTests } from "./tools/test-runner.js";
import { deployChanges } from "./tools/deployer.js";

async function main() {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║          🛡️  RetailAPIGuardian Agent                     ║");
  console.log("║   Omnichannel Retail API Integration Management         ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log();

  const client = new CopilotClient();
  const session = await client.createSession({
    model: "gpt-4.1",
    streaming: true,
    systemMessage: { content: RETAIL_SYSTEM_PROMPT },
    tools: [
      checkApiHealth,
      monitorApiChanges,
      generateAdapterCode,
      runIntegrationTests,
      deployChanges,
    ],
  });

  // Stream assistant responses
  session.on("assistant.message_delta", (event) => {
    process.stdout.write(event.data.deltaContent);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Available commands:");
  console.log("  • 'health'   — Check all vendor API integration health");
  console.log("  • 'changes'  — Scan for upcoming API changes");
  console.log("  • 'fix'      — Analyze & generate code fixes for changes");
  console.log("  • 'test'     — Run integration tests");
  console.log("  • 'deploy'   — Deploy validated changes");
  console.log("  • Or ask anything about your retail integrations!");
  console.log("  • 'exit'     — Quit\n");

  const prompt = () => {
    rl.question("You: ", async (input) => {
      const trimmed = input.trim().toLowerCase();

      if (trimmed === "exit") {
        console.log("\n🛡️  RetailAPIGuardian signing off. Stay integrated!");
        await client.stop();
        rl.close();
        return;
      }

      // Shortcut commands map to natural language prompts
      const shortcuts: Record<string, string> = {
        health:
          "Check the health of all vendor API integrations and give me a summary.",
        changes:
          "Scan all vendors for upcoming API changes, breaking changes, and deprecations. Prioritize by severity.",
        fix: "Analyze all detected API changes and generate updated adapter code for the most critical ones. Show me what changed.",
        test: "Run integration tests for all vendors that have pending code changes and report the results.",
        deploy:
          "Deploy all validated adapter changes to staging using a canary strategy. Show me the deployment plan.",
      };

      const userPrompt = shortcuts[trimmed] ?? input;

      process.stdout.write("\n🛡️ Guardian: ");
      await session.sendAndWait({ prompt: userPrompt });
      console.log("\n");
      prompt();
    });
  };

  prompt();
}

main().catch(console.error);
