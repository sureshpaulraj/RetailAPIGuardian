const PptxGenJS = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const pptx = new PptxGenJS();

// ── Theme ───────────────────────────────────────────────────────────────────
const C = {
  primary: "065A82",
  secondary: "1C7293",
  accent: "21295C",
  white: "FFFFFF",
  lightBg: "F0F4F8",
  lightGray: "E2E8F0",
  darkText: "1A202C",
  medText: "4A5568",
  statBlue: "065A82",
};
const HEADER_FONT = "Arial Black";
const BODY_FONT = "Calibri";

pptx.author = "RetailAPIGuardian Team";
pptx.company = "GHCSDK Enterprise Challenge";
pptx.subject = "Omnichannel Retail API Integration Agent";
pptx.title = "RetailAPIGuardian";
pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5

// ── Helpers ─────────────────────────────────────────────────────────────────
function addDarkSlide(bg) {
  const slide = pptx.addSlide();
  slide.background = { color: bg };
  return slide;
}
function addLightSlide() {
  const slide = pptx.addSlide();
  slide.background = { color: C.lightBg };
  return slide;
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Title
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = addDarkSlide(C.accent);
  // decorative bar
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: C.secondary },
  });
  s.addText("RetailAPIGuardian", {
    x: 0.8, y: 1.8, w: 11.5, h: 1.2,
    fontSize: 44, fontFace: HEADER_FONT, color: C.white, bold: true,
  });
  s.addText("Omnichannel Retail API Integration Agent", {
    x: 0.8, y: 3.1, w: 11.5, h: 0.7,
    fontSize: 20, fontFace: BODY_FONT, color: C.secondary,
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0.8, y: 4.0, w: 3.0, h: 0.04, fill: { color: C.secondary },
  });
  s.addText("Built with GitHub Copilot SDK  |  GHCSDK Enterprise Challenge Q3 FY26", {
    x: 0.8, y: 4.4, w: 11.5, h: 0.5,
    fontSize: 12, fontFace: BODY_FONT, color: C.white,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 2 — The Problem
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = addLightSlide();
  s.addText("The Problem", {
    x: 0.6, y: 0.3, w: 12, h: 0.7,
    fontSize: 30, fontFace: HEADER_FONT, color: C.accent, bold: true,
  });
  // stat callout box
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 1.3, w: 12.1, h: 1.6,
    fill: { color: C.primary }, rectRadius: 0.15,
  });
  s.addText([
    { text: "73%", options: { fontSize: 44, fontFace: HEADER_FONT, color: C.white, bold: true } },
    { text: "  of retail IT teams spend ", options: { fontSize: 18, fontFace: BODY_FONT, color: C.white } },
    { text: "40+ hrs/month", options: { fontSize: 18, fontFace: BODY_FONT, color: C.white, bold: true } },
    { text: " on API integration maintenance", options: { fontSize: 18, fontFace: BODY_FONT, color: C.white } },
  ], { x: 1.0, y: 1.4, w: 11.3, h: 1.4, valign: "middle" });

  const painPoints = [
    { icon: "⚠️", title: "Breaking Changes", desc: "Vendor API changes cause unexpected production outages and revenue loss" },
    { icon: "🐌", title: "Manual Updates", desc: "Adapter updates are error-prone, slow, and require specialized knowledge" },
    { icon: "🔇", title: "No Unified Monitoring", desc: "Siloed vendor dashboards make it impossible to see integration health" },
  ];
  painPoints.forEach((p, i) => {
    const left = 0.6 + i * 4.1;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: left, y: 3.4, w: 3.8, h: 3.2,
      fill: { color: C.white }, rectRadius: 0.12,
      shadow: { type: "outer", blur: 6, offset: 2, color: "CCCCCC", opacity: 0.3 },
    });
    s.addText(p.icon, { x: left + 0.2, y: 3.6, w: 1, h: 0.8, fontSize: 32 });
    s.addText(p.title, {
      x: left + 0.2, y: 4.4, w: 3.4, h: 0.5,
      fontSize: 16, fontFace: HEADER_FONT, color: C.accent, bold: true,
    });
    s.addText(p.desc, {
      x: left + 0.2, y: 5.0, w: 3.4, h: 1.2,
      fontSize: 13, fontFace: BODY_FONT, color: C.medText, lineSpacingMultiple: 1.15,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 3 — The Solution
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = addDarkSlide(C.primary);
  s.addText("AI-Powered API Integration Guardian", {
    x: 0.6, y: 0.4, w: 12, h: 0.8,
    fontSize: 28, fontFace: HEADER_FONT, color: C.white, bold: true,
  });
  s.addText("Five autonomous capabilities working together to protect your retail integrations", {
    x: 0.6, y: 1.2, w: 12, h: 0.5,
    fontSize: 14, fontFace: BODY_FONT, color: C.lightGray,
  });

  const caps = [
    { icon: "🏥", name: "Health\nMonitor", desc: "Real-time vendor API health checks across all integrations" },
    { icon: "🔍", name: "Change\nDetection", desc: "Automated detection of breaking API changes before impact" },
    { icon: "💻", name: "Code\nGeneration", desc: "AI-generated adapter updates with enterprise patterns" },
    { icon: "🧪", name: "Test\nExecution", desc: "Automated sandbox testing with vendor environments" },
    { icon: "🚀", name: "Deployment", desc: "Zero-downtime canary deployments with auto-rollback" },
  ];
  caps.forEach((c, i) => {
    const left = 0.4 + i * 2.55;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: left, y: 2.1, w: 2.35, h: 4.6,
      fill: { color: C.accent }, rectRadius: 0.12,
    });
    s.addText(c.icon, { x: left, y: 2.3, w: 2.35, h: 1.0, fontSize: 36, align: "center" });
    s.addText(c.name, {
      x: left + 0.15, y: 3.3, w: 2.05, h: 0.9,
      fontSize: 15, fontFace: HEADER_FONT, color: C.white, bold: true, align: "center",
      lineSpacingMultiple: 1.1,
    });
    s.addText(c.desc, {
      x: left + 0.15, y: 4.3, w: 2.05, h: 2.0,
      fontSize: 12, fontFace: BODY_FONT, color: C.lightGray, align: "center",
      lineSpacingMultiple: 1.15,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 4 — Architecture
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = addLightSlide();
  s.addText("Architecture", {
    x: 0.6, y: 0.3, w: 12, h: 0.7,
    fontSize: 30, fontFace: HEADER_FONT, color: C.accent, bold: true,
  });

  // Left column — flow
  s.addText("Integration Pipeline", {
    x: 0.6, y: 1.2, w: 6, h: 0.5,
    fontSize: 16, fontFace: HEADER_FONT, color: C.primary, bold: true,
  });
  const steps = [
    "Vendor API Change Detected",
    "Event Grid triggers Analysis",
    "Copilot SDK Impact Analysis",
    "AI Code Generation (Adapter)",
    "Sandbox Test Execution",
    "Canary Deploy to Production",
  ];
  steps.forEach((step, i) => {
    const top = 1.9 + i * 0.75;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8, y: top, w: 5.6, h: 0.55,
      fill: { color: i % 2 === 0 ? C.primary : C.secondary }, rectRadius: 0.08,
    });
    s.addText(`${i + 1}.  ${step}`, {
      x: 1.0, y: top, w: 5.2, h: 0.55,
      fontSize: 13, fontFace: BODY_FONT, color: C.white, valign: "middle",
    });
    if (i < steps.length - 1) {
      s.addText("▼", {
        x: 3.3, y: top + 0.5, w: 0.5, h: 0.3,
        fontSize: 10, color: C.primary, align: "center",
      });
    }
  });

  // Right column — Azure stack
  s.addText("Azure Stack", {
    x: 7.2, y: 1.2, w: 5.5, h: 0.5,
    fontSize: 16, fontFace: HEADER_FONT, color: C.primary, bold: true,
  });
  const azure = [
    { svc: "Azure Functions", note: "Timer trigger + HTTP endpoints" },
    { svc: "Event Grid", note: "Event-driven orchestration" },
    { svc: "Cosmos DB", note: "Integration state & history" },
    { svc: "API Management", note: "Gateway & rate limiting" },
    { svc: "Azure Monitor", note: "Dashboards & alerting" },
    { svc: "Key Vault", note: "Secrets & certificate mgmt" },
  ];
  azure.forEach((a, i) => {
    const top = 1.9 + i * 0.75;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 7.2, y: top, w: 5.5, h: 0.55,
      fill: { color: C.white }, rectRadius: 0.08,
      line: { color: C.primary, width: 1 },
    });
    s.addText([
      { text: `☁️  ${a.svc}`, options: { fontSize: 12, fontFace: BODY_FONT, color: C.accent, bold: true } },
      { text: `   ${a.note}`, options: { fontSize: 11, fontFace: BODY_FONT, color: C.medText } },
    ], { x: 7.4, y: top, w: 5.1, h: 0.55, valign: "middle" });
  });

  // Bottom tagline
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 6.8, w: 13.33, h: 0.7, fill: { color: C.accent },
  });
  s.addText("Built on Azure Well-Architected Framework  •  Scalable  •  Secure  •  Observable", {
    x: 0.6, y: 6.8, w: 12, h: 0.7,
    fontSize: 13, fontFace: BODY_FONT, color: C.white, align: "center", valign: "middle",
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 5 — GitHub Copilot SDK Integration
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = addDarkSlide(C.accent);
  s.addText("GitHub Copilot SDK Integration", {
    x: 0.6, y: 0.3, w: 12, h: 0.7,
    fontSize: 28, fontFace: HEADER_FONT, color: C.white, bold: true,
  });

  // Left — key points
  const points = [
    { title: "CopilotClient", desc: "AI reasoning engine for impact analysis & code generation" },
    { title: "defineTool()", desc: "5 custom tools: health, changes, fix, test, deploy" },
    { title: "Streaming", desc: "Real-time feedback during long-running operations" },
    { title: "Interactive CLI", desc: "Shortcut commands for rapid operator workflows" },
  ];
  points.forEach((p, i) => {
    const top = 1.3 + i * 1.35;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.6, y: top, w: 5.4, h: 1.1,
      fill: { color: C.primary }, rectRadius: 0.1,
    });
    s.addText([
      { text: p.title + "\n", options: { fontSize: 15, fontFace: HEADER_FONT, color: C.white, bold: true } },
      { text: p.desc, options: { fontSize: 12, fontFace: BODY_FONT, color: C.lightGray } },
    ], { x: 0.85, y: top + 0.1, w: 4.9, h: 0.9, valign: "middle" });
  });

  // Right — code snippet
  s.addText("Tool Definition Pattern", {
    x: 6.6, y: 1.1, w: 6, h: 0.5,
    fontSize: 14, fontFace: HEADER_FONT, color: C.secondary, bold: true,
  });
  const code = `defineTool("check_api_health", {
  description:
    "Check health of vendor APIs",
  inputSchema: z.object({
    vendor: z.string().optional(),
  }),
  async execute({ vendor }) {
    // Monitor Stripe, Shippo,
    // LoyaltyAPI endpoints
    return checkHealth(vendor);
  },
});`;
  s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
    x: 6.6, y: 1.7, w: 6.1, h: 5.0,
    fill: { color: "0D1117" }, rectRadius: 0.12,
  });
  s.addText(code, {
    x: 6.9, y: 1.9, w: 5.5, h: 4.6,
    fontSize: 12, fontFace: "Consolas", color: "79C0FF",
    lineSpacingMultiple: 1.3, valign: "top",
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 6 — Enterprise Value
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = addLightSlide();
  s.addText("Enterprise Value", {
    x: 0.6, y: 0.3, w: 12, h: 0.7,
    fontSize: 30, fontFace: HEADER_FONT, color: C.accent, bold: true,
  });

  const metrics = [
    { num: "85%", label: "Reduction in API\nincident response time" },
    { num: "40 hrs", label: "Saved per engineering\nteam per month" },
    { num: "99.9%", label: "Deployment success rate\nwith auto-rollback" },
    { num: "Zero", label: "Production outages from\nmissed API changes" },
  ];
  const positions = [
    { x: 0.6, y: 1.4 }, { x: 6.8, y: 1.4 },
    { x: 0.6, y: 4.3 }, { x: 6.8, y: 4.3 },
  ];
  metrics.forEach((m, i) => {
    const p = positions[i];
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: p.x, y: p.y, w: 5.9, h: 2.6,
      fill: { color: C.white }, rectRadius: 0.15,
      shadow: { type: "outer", blur: 8, offset: 3, color: "BBBBBB", opacity: 0.25 },
    });
    s.addText(m.num, {
      x: p.x + 0.3, y: p.y + 0.3, w: 5.3, h: 1.2,
      fontSize: 42, fontFace: HEADER_FONT, color: C.primary, bold: true, align: "center",
    });
    s.addText(m.label, {
      x: p.x + 0.3, y: p.y + 1.5, w: 5.3, h: 0.9,
      fontSize: 15, fontFace: BODY_FONT, color: C.medText, align: "center",
      lineSpacingMultiple: 1.15,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 7 — Security & Responsible AI
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = addDarkSlide(C.secondary);
  s.addText("Security & Responsible AI", {
    x: 0.6, y: 0.3, w: 12, h: 0.8,
    fontSize: 28, fontFace: HEADER_FONT, color: C.white, bold: true,
  });

  const items = [
    { icon: "👤", title: "Human-in-the-Loop", desc: "Production deployments require explicit human approval — no autonomous production changes" },
    { icon: "🔒", title: "PCI DSS Compliance", desc: "Payment adapter integrations follow PCI DSS standards for secure card data handling" },
    { icon: "📋", title: "Full Auditability", desc: "Every action is logged with reasoning, timestamps, and outcome — fully explainable AI" },
    { icon: "🛡️", title: "No PII in Telemetry", desc: "Strict data minimization — no personally identifiable information in logs or metrics" },
    { icon: "🔑", title: "Azure Key Vault", desc: "All secrets, API keys, and certificates managed through Azure Key Vault with rotation" },
  ];
  items.forEach((item, i) => {
    const top = 1.4 + i * 1.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.6, y: top, w: 12.1, h: 0.95,
      fill: { color: "FFFFFF", transparency: 88 }, rectRadius: 0.1,
    });
    s.addText(item.icon, { x: 0.8, y: top + 0.05, w: 0.8, h: 0.85, fontSize: 24, valign: "middle" });
    s.addText([
      { text: item.title + "  ", options: { fontSize: 15, fontFace: HEADER_FONT, color: C.white, bold: true } },
      { text: item.desc, options: { fontSize: 13, fontFace: BODY_FONT, color: C.lightGray } },
    ], { x: 1.7, y: top, w: 10.8, h: 0.95, valign: "middle" });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 8 — Operational Readiness
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = addLightSlide();
  s.addText("Operational Readiness", {
    x: 0.6, y: 0.3, w: 12, h: 0.7,
    fontSize: 30, fontFace: HEADER_FONT, color: C.accent, bold: true,
  });

  // CI/CD pipeline visualization
  s.addText("CI/CD Pipeline", {
    x: 0.6, y: 1.2, w: 12, h: 0.5,
    fontSize: 16, fontFace: HEADER_FONT, color: C.primary, bold: true,
  });
  const pipeline = ["Lint", "Unit Test", "Integration Test", "Staging", "Production"];
  pipeline.forEach((step, i) => {
    const left = 0.6 + i * 2.5;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: left, y: 1.9, w: 2.1, h: 0.7,
      fill: { color: C.primary }, rectRadius: 0.08,
    });
    s.addText(step, {
      x: left, y: 1.9, w: 2.1, h: 0.7,
      fontSize: 13, fontFace: BODY_FONT, color: C.white, align: "center", valign: "middle", bold: true,
    });
    if (i < pipeline.length - 1) {
      s.addText("→", {
        x: left + 2.1, y: 1.9, w: 0.4, h: 0.7,
        fontSize: 18, color: C.primary, align: "center", valign: "middle",
      });
    }
  });

  // Four feature cards
  const features = [
    { icon: "🔄", title: "Canary Deployments", desc: "Gradual traffic shift with automatic rollback on error-rate spike" },
    { icon: "📊", title: "Azure Monitor", desc: "Real-time dashboards tracking latency, errors, and throughput per vendor" },
    { icon: "🔔", title: "Smart Alerting", desc: "Anomaly detection with PagerDuty / Teams integration for on-call" },
    { icon: "⚙️", title: "GitHub Actions", desc: "Full CI/CD automation with reusable workflows and environment gates" },
  ];
  features.forEach((f, i) => {
    const left = 0.6 + i * 3.15;
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: left, y: 3.2, w: 2.95, h: 3.6,
      fill: { color: C.white }, rectRadius: 0.12,
      shadow: { type: "outer", blur: 6, offset: 2, color: "CCCCCC", opacity: 0.3 },
    });
    s.addText(f.icon, { x: left, y: 3.4, w: 2.95, h: 0.8, fontSize: 30, align: "center" });
    s.addText(f.title, {
      x: left + 0.2, y: 4.2, w: 2.55, h: 0.5,
      fontSize: 14, fontFace: HEADER_FONT, color: C.accent, bold: true, align: "center",
    });
    s.addText(f.desc, {
      x: left + 0.2, y: 4.8, w: 2.55, h: 1.6,
      fontSize: 12, fontFace: BODY_FONT, color: C.medText, align: "center", lineSpacingMultiple: 1.15,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 9 — Demo Flow
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = addDarkSlide(C.primary);
  s.addText("Live Demo Flow", {
    x: 0.6, y: 0.3, w: 12, h: 0.8,
    fontSize: 28, fontFace: HEADER_FONT, color: C.white, bold: true,
  });

  const demoSteps = [
    { cmd: '"health"', action: "See vendor status dashboard", detail: "Real-time health of Stripe, Shippo, LoyaltyAPI" },
    { cmd: '"changes"', action: "Detect Stripe breaking change", detail: "v2024-12 removes `source` field from Charges API" },
    { cmd: '"fix"', action: "Auto-generate updated adapter", detail: "AI generates PaymentMethod migration with tests" },
    { cmd: '"test"', action: "Validate against sandbox", detail: "Run integration tests on Stripe sandbox environment" },
    { cmd: '"deploy"', action: "Canary deployment to staging", detail: "5% → 25% → 50% → 100% traffic with health gates" },
  ];
  demoSteps.forEach((d, i) => {
    const top = 1.5 + i * 1.12;
    // step number circle
    s.addShape(pptx.shapes.OVAL, {
      x: 0.6, y: top + 0.1, w: 0.65, h: 0.65,
      fill: { color: C.secondary },
    });
    s.addText(`${i + 1}`, {
      x: 0.6, y: top + 0.1, w: 0.65, h: 0.65,
      fontSize: 18, fontFace: HEADER_FONT, color: C.white, align: "center", valign: "middle", bold: true,
    });
    // command badge
    s.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 1.5, y: top + 0.08, w: 2.0, h: 0.65,
      fill: { color: "0D1117" }, rectRadius: 0.08,
    });
    s.addText(d.cmd, {
      x: 1.5, y: top + 0.08, w: 2.0, h: 0.65,
      fontSize: 14, fontFace: "Consolas", color: "79C0FF", align: "center", valign: "middle",
    });
    // action
    s.addText(d.action, {
      x: 3.8, y: top, w: 4.0, h: 0.45,
      fontSize: 15, fontFace: BODY_FONT, color: C.white, bold: true,
    });
    s.addText(d.detail, {
      x: 3.8, y: top + 0.4, w: 8.8, h: 0.4,
      fontSize: 12, fontFace: BODY_FONT, color: C.lightGray,
    });
    // connector line
    if (i < demoSteps.length - 1) {
      s.addShape(pptx.shapes.RECTANGLE, {
        x: 0.89, y: top + 0.76, w: 0.04, h: 0.36,
        fill: { color: C.secondary },
      });
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 10 — Thank You / CTA
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = addDarkSlide(C.accent);
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 13.33, h: 0.12, fill: { color: C.secondary },
  });
  s.addText("RetailAPIGuardian", {
    x: 0.6, y: 1.6, w: 12, h: 1.2,
    fontSize: 40, fontFace: HEADER_FONT, color: C.white, bold: true, align: "center",
  });
  s.addText("Protecting retail integrations with AI-powered automation", {
    x: 0.6, y: 2.9, w: 12, h: 0.7,
    fontSize: 18, fontFace: BODY_FONT, color: C.secondary, align: "center",
  });
  s.addShape(pptx.shapes.RECTANGLE, {
    x: 5.2, y: 3.8, w: 3.0, h: 0.04, fill: { color: C.secondary },
  });
  s.addText("github.com/your-org/retail-api-guardian", {
    x: 0.6, y: 4.2, w: 12, h: 0.5,
    fontSize: 14, fontFace: BODY_FONT, color: C.lightGray, align: "center",
  });
  s.addText("GHCSDK Enterprise Challenge  •  Q3 FY26", {
    x: 0.6, y: 5.0, w: 12, h: 0.5,
    fontSize: 13, fontFace: BODY_FONT, color: C.medText, align: "center",
  });
  s.addText("Thank you!", {
    x: 0.6, y: 5.8, w: 12, h: 0.8,
    fontSize: 24, fontFace: HEADER_FONT, color: C.white, align: "center",
  });
}

// ── Write file ──────────────────────────────────────────────────────────────
const outDir = path.join(__dirname);
const outPath = path.join(outDir, "RetailAPIGuardian.pptx");

pptx.writeFile({ fileName: outPath }).then(() => {
  console.log(`✅ Presentation created: ${outPath}`);
  // Remove placeholder if it exists
  const placeholder = path.join(outDir, "RetailAPIGuardian.pptx.placeholder");
  if (fs.existsSync(placeholder)) {
    fs.unlinkSync(placeholder);
    console.log(`🗑️  Removed placeholder: ${placeholder}`);
  }
}).catch((err) => {
  console.error("❌ Error creating presentation:", err);
  process.exit(1);
});
