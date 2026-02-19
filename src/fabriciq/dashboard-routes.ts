/**
 * Fabric IQ Dashboard Routes
 *
 * Express router that serves the analytics API and embedded HTML dashboard.
 */

import { Router } from "express";
import { getAnalyticsEngine } from "./index.js";

export function createDashboardRouter(): Router {
  const router = Router();

  // ── JSON API endpoints ────────────────────────────────────────

  router.get("/api/dashboard/summary", (_req, res) => {
    res.json(getAnalyticsEngine().computeDashboard());
  });

  router.get("/api/dashboard/health-trends", (_req, res) => {
    res.json(getAnalyticsEngine().getHealthTrends());
  });

  router.get("/api/dashboard/changes", (_req, res) => {
    res.json(getAnalyticsEngine().getChangeMetrics());
  });

  router.get("/api/dashboard/deployments", (_req, res) => {
    res.json(getAnalyticsEngine().getDeploymentMetrics());
  });

  router.get("/api/dashboard/cost-savings", (_req, res) => {
    res.json(getAnalyticsEngine().getCostSavings());
  });

  // ── Embedded HTML dashboard ───────────────────────────────────

  router.get("/dashboard", (_req, res) => {
    res.type("html").send(dashboardHTML());
  });

  return router;
}

// ── HTML template ───────────────────────────────────────────────

function dashboardHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>RetailAPIGuardian — Fabric IQ Dashboard</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#0b1120;--surface:#111b2e;--card:#162236;--border:#1e3252;--primary:#065A82;--accent:#21295C;--accent-light:#3a4a8a;--green:#34d399;--yellow:#fbbf24;--red:#f87171;--text:#e2e8f0;--muted:#94a3b8;--white:#fff}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.header{background:linear-gradient(135deg,var(--accent) 0%,var(--primary) 100%);padding:24px 32px;display:flex;align-items:center;gap:16px;box-shadow:0 4px 24px rgba(0,0,0,.4)}
.header svg{width:36px;height:36px;fill:var(--white)}
.header h1{font-size:1.4rem;font-weight:700;color:var(--white);letter-spacing:.5px}
.header .badge{background:rgba(255,255,255,.15);padding:4px 12px;border-radius:20px;font-size:.75rem;color:var(--green);font-weight:600}
.container{max-width:1280px;margin:0 auto;padding:24px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:28px}
.kpi{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 24px;position:relative;overflow:hidden}
.kpi::before{content:'';position:absolute;top:0;left:0;width:4px;height:100%;border-radius:4px 0 0 4px}
.kpi.blue::before{background:var(--primary)}
.kpi.green::before{background:var(--green)}
.kpi.yellow::before{background:var(--yellow)}
.kpi.red::before{background:var(--red)}
.kpi-label{font-size:.75rem;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:6px}
.kpi-value{font-size:2rem;font-weight:800;color:var(--white)}
.kpi-sub{font-size:.8rem;color:var(--muted);margin-top:4px}
.section{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:24px;margin-bottom:24px}
.section h2{font-size:1.05rem;font-weight:700;color:var(--white);margin-bottom:16px;display:flex;align-items:center;gap:8px}
.section h2 span{font-size:.7rem;background:var(--accent-light);padding:2px 10px;border-radius:10px;color:var(--green)}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:.7rem;text-transform:uppercase;letter-spacing:1px;color:var(--muted);padding:8px 12px;border-bottom:1px solid var(--border)}
td{padding:10px 12px;border-bottom:1px solid var(--border);font-size:.9rem}
tr:last-child td{border-bottom:none}
.status{display:inline-block;padding:2px 10px;border-radius:20px;font-size:.75rem;font-weight:600}
.status.healthy{background:rgba(52,211,153,.15);color:var(--green)}
.status.degraded{background:rgba(251,191,36,.15);color:var(--yellow)}
.status.down{background:rgba(248,113,113,.15);color:var(--red)}
.sev{display:inline-block;padding:2px 10px;border-radius:20px;font-size:.7rem;font-weight:700;text-transform:uppercase}
.sev.low{background:rgba(52,211,153,.12);color:var(--green)}
.sev.medium{background:rgba(251,191,36,.12);color:var(--yellow)}
.sev.high{background:rgba(248,113,113,.12);color:var(--red)}
.sev.critical{background:rgba(248,113,113,.25);color:#fca5a5}
.score-bar{height:6px;border-radius:3px;background:var(--border);overflow:hidden;width:120px;display:inline-block;vertical-align:middle;margin-left:8px}
.score-fill{height:100%;border-radius:3px}
.footer{text-align:center;padding:24px;color:var(--muted);font-size:.75rem;border-top:1px solid var(--border)}
.footer strong{color:var(--primary)}
.loading{color:var(--muted);font-style:italic;padding:20px;text-align:center}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:24px}
@media(max-width:800px){.two-col{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="header">
<svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
<h1>RetailAPIGuardian — Fabric IQ Dashboard</h1>
<span class="badge">● LIVE</span>
</div>

<div class="container">
  <!-- KPIs -->
  <div class="kpis" id="kpis"><div class="loading">Loading analytics…</div></div>

  <div class="two-col">
    <!-- Vendor Health -->
    <div class="section" id="vendor-section">
      <h2>Vendor Health <span>real-time</span></h2>
      <div id="vendor-table" class="loading">Loading…</div>
    </div>

    <!-- Recent Changes -->
    <div class="section" id="changes-section">
      <h2>Recent API Changes <span>last 30 days</span></h2>
      <div id="changes-table" class="loading">Loading…</div>
    </div>
  </div>

  <!-- Deployments -->
  <div class="section">
    <h2>Recent Deployments</h2>
    <div id="deploy-table" class="loading">Loading…</div>
  </div>

  <!-- Cost Savings -->
  <div class="section">
    <h2>Cost Savings Summary</h2>
    <div id="savings-table" class="loading">Loading…</div>
  </div>
</div>

<div class="footer">
  Powered by <strong>Microsoft Fabric</strong> | Data refreshed every 15 minutes
</div>

<script>
(async function(){
  const [summary, changes, deploys, savings] = await Promise.all([
    fetch('/api/dashboard/summary').then(r=>r.json()),
    fetch('/api/dashboard/changes').then(r=>r.json()),
    fetch('/api/dashboard/deployments').then(r=>r.json()),
    fetch('/api/dashboard/cost-savings').then(r=>r.json()),
  ]);

  // ── KPIs ──
  document.getElementById('kpis').innerHTML = \`
    <div class="kpi blue">
      <div class="kpi-label">Overall Health Score</div>
      <div class="kpi-value">\${summary.overallReliabilityPercent.toFixed(1)}%</div>
      <div class="kpi-sub">\${summary.vendorScores.length} vendors monitored</div>
    </div>
    <div class="kpi yellow">
      <div class="kpi-label">Changes Detected</div>
      <div class="kpi-value">\${summary.totalChangesDetected}</div>
      <div class="kpi-sub">MTTD \${summary.mttdMinutes} min · MTTF \${summary.mttfMinutes} min</div>
    </div>
    <div class="kpi green">
      <div class="kpi-label">Deployment Success Rate</div>
      <div class="kpi-value">\${summary.deploymentSuccessRate}%</div>
      <div class="kpi-sub">\${summary.totalDeployments} deploys · \${summary.totalRollbacks} rollbacks</div>
    </div>
    <div class="kpi blue">
      <div class="kpi-label">Monthly Savings</div>
      <div class="kpi-value">$\${summary.monthlySavingsUSD.toLocaleString()}</div>
      <div class="kpi-sub">Total $\${summary.totalCostSavingsUSD.toLocaleString()} saved</div>
    </div>
  \`;

  // ── Vendor table ──
  const vRows = summary.vendorScores.map(v=>{
    const color = v.score>=90?'var(--green)':v.score>=70?'var(--yellow)':'var(--red)';
    return \`<tr>
      <td><strong>\${v.vendor}</strong></td>
      <td><span class="status \${v.status}">\${v.status}</span></td>
      <td>\${v.score}<span class="score-bar"><span class="score-fill" style="width:\${v.score}%;background:\${color}"></span></span></td>
      <td>\${v.avgLatencyMs} ms</td>
      <td>\${v.uptimePercent}%</td>
    </tr>\`;
  }).join('');
  document.getElementById('vendor-table').innerHTML=\`<table><thead><tr><th>Vendor</th><th>Status</th><th>Score</th><th>Latency</th><th>Uptime</th></tr></thead><tbody>\${vRows}</tbody></table>\`;

  // ── Changes table ──
  const cRows = changes.slice(-8).reverse().map(c=>\`<tr>
    <td>\${new Date(c.timestamp).toLocaleDateString()}</td>
    <td>\${c.vendor}</td>
    <td><span class="sev \${c.severity}">\${c.severity}</span></td>
    <td>\${c.changeType}</td>
    <td>\${c.automated?'✅ Auto':'🔧 Manual'}</td>
    <td>\${c.detectionTimeMinutes}m / \${c.resolutionTimeMinutes}m</td>
  </tr>\`).join('');
  document.getElementById('changes-table').innerHTML=\`<table><thead><tr><th>Date</th><th>Vendor</th><th>Severity</th><th>Type</th><th>Fix</th><th>Detect / Resolve</th></tr></thead><tbody>\${cRows}</tbody></table>\`;

  // ── Deployments table ──
  const dRows = deploys.slice(-10).reverse().map(d=>\`<tr>
    <td>\${new Date(d.timestamp).toLocaleDateString()}</td>
    <td>\${d.vendor}</td>
    <td>\${d.environment}</td>
    <td>\${d.strategy}</td>
    <td><span class="status \${d.success?'healthy':'down'}">\${d.success?'success':'failed'}</span></td>
    <td>\${d.rolledBack?'⚠️ Yes':'—'}</td>
    <td>\${d.durationMinutes}m</td>
  </tr>\`).join('');
  document.getElementById('deploy-table').innerHTML=\`<table><thead><tr><th>Date</th><th>Vendor</th><th>Env</th><th>Strategy</th><th>Status</th><th>Rollback</th><th>Duration</th></tr></thead><tbody>\${dRows}</tbody></table>\`;

  // ── Cost savings table ──
  const sRows = savings.map(s=>\`<tr>
    <td>\${s.period}</td>
    <td>\${s.manualHoursAvoided}h</td>
    <td>\${s.automatedFixCount}</td>
    <td>\${s.incidentsPreventedCount}</td>
    <td><strong>$\${s.estimatedSavingsUSD.toLocaleString()}</strong></td>
  </tr>\`).join('');
  document.getElementById('savings-table').innerHTML=\`<table><thead><tr><th>Period</th><th>Hours Saved</th><th>Auto Fixes</th><th>Incidents Prevented</th><th>Savings</th></tr></thead><tbody>\${sRows}</tbody></table>\`;
})();
</script>
</body>
</html>`;
}
