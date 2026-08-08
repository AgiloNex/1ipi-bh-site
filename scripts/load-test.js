#!/usr/bin/env node

/**
 * Load test script — simula cenários de escalabilidade.
 *
 * Uso:
 *   node scripts/load-test.js [opções]
 *
 * Opções:
 *   --concurrent N   Número de requisições simultâneas (default: 10)
 *   --total N        Total de requisições (default: 100)
 *   --endpoint URL   URL do formulário a testar (default: usa Supabase REST)
 *   --type contact|prayer  Tipo de formulário (default: contact)
 *
 * Exemplos:
 *   node scripts/load-test.js --concurrent 20 --total 200
 *   node scripts/load-test.js --concurrent 50 --total 500 --type prayer
 *
 * @security Este script demonstra o impacto da ausência de rate limiting.
 *           Use APENAS em ambiente de desenvolvimento/teste.
 */

const SUPABASE_URL = "https://rzlacnuwrzxvlprwfohm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bGFjbnV3cnp4dmxwcndmb2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5ODc4MTksImV4cCI6MjA4ODU2MzgxOX0.Bp_j6X77ed8ey8QcaSGT7TYvz4KyiPOICQ2lp_N7EZQ";

const args = process.argv.slice(2);
const parseArg = (flag, defaultVal) => {
  const idx = args.indexOf(flag);
  return idx >= 0 ? args[idx + 1] : defaultVal;
};

const CONCURRENT = parseInt(parseArg("--concurrent", "10"), 10);
const TOTAL = parseInt(parseArg("--total", "100"), 10);
const TYPE = parseArg("--type", "contact");

const TABLE = TYPE === "prayer" ? "pedidos_oracao" : "contatos";
const ENDPOINT = `${SUPABASE_URL}/rest/v1/${TABLE}`;

function generatePayload() {
  if (TYPE === "prayer") {
    return {
      nome: `Test User ${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      pedido: `Test prayer request for load testing purposes. ${Math.random().toString(36).repeat(5).slice(0, 50)}`,
    };
  }
  return {
    nome: `Load Test ${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    email: `loadtest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@test.com`,
    interesse: "Outro",
    mensagem: `Load test message. ${Math.random().toString(36).repeat(10).slice(0, 80)}`,
  };
}

async function sendRequest() {
  const payload = generatePayload();
  const start = Date.now();

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const duration = Date.now() - start;
    const status = response.status;

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      return { success: false, status, duration, error: body.slice(0, 200) };
    }

    return { success: true, status, duration };
  } catch (err) {
    return { success: false, status: 0, duration: Date.now() - start, error: err.message };
  }
}

async function runBatch(requests) {
  return Promise.all(requests.map(() => sendRequest()));
}

async function main() {
  console.log(`\n🔧 Load Test Config:`);
  console.log(`   Table:      ${TABLE}`);
  console.log(`   Endpoint:   ${ENDPOINT}`);
  console.log(`   Concurrent: ${CONCURRENT}`);
  console.log(`   Total:      ${TOTAL}`);
  console.log(`\n🚀 Starting load test...\n`);

  const results = [];
  const batches = Math.ceil(TOTAL / CONCURRENT);
  const startTime = Date.now();

  for (let batch = 0; batch < batches; batch++) {
    const remaining = Math.min(CONCURRENT, TOTAL - batch * CONCURRENT);
    const batchResults = await runBatch(Array(remaining).fill(null));
    results.push(...batchResults);

    const succeeded = batchResults.filter((r) => r.success).length;
    const failed = batchResults.filter((r) => !r.success).length;
    const avgDuration = batchResults.reduce((s, r) => s + r.duration, 0) / batchResults.length;

    process.stdout.write(
      `   Batch ${batch + 1}/${batches}: ${succeeded} ok, ${failed} failed, avg ${avgDuration.toFixed(0)}ms\n`,
    );
  }

  const totalDuration = Date.now() - startTime;
  const totalSuccess = results.filter((r) => r.success).length;
  const totalFailed = results.filter((r) => !r.success).length;
  const durations = results.map((r) => r.duration).sort((a, b) => a - b);
  const p50 = durations[Math.floor(durations.length * 0.5)];
  const p95 = durations[Math.floor(durations.length * 0.95)];
  const p99 = durations[Math.floor(durations.length * 0.99)];

  console.log(`\n📊 Results:`);
  console.log(`   Total time:  ${(totalDuration / 1000).toFixed(1)}s`);
  console.log(`   Throughput:  ${(TOTAL / (totalDuration / 1000)).toFixed(1)} req/s`);
  console.log(`   Success:     ${totalSuccess}/${TOTAL}`);
  console.log(`   Failed:      ${totalFailed}/${TOTAL}`);
  console.log(`   p50 latency: ${p50}ms`);
  console.log(`   p95 latency: ${p95}ms`);
  console.log(`   p99 latency: ${p99}ms`);

  if (totalFailed > 0) {
    const sampleErrors = results.filter((r) => !r.success).slice(0, 3);
    console.log(`\n⚠️  Sample errors:`);
    for (const err of sampleErrors) {
      console.log(`   [${err.status}] ${err.error || "unknown error"}`);
    }
  }

  // Analysis
  console.log(`\n🔍 Analysis:`);
  if (totalSuccess === TOTAL) {
    console.log(`   ❌ No rate limiting detected — all ${TOTAL} requests succeeded.`);
    console.log(`   ⚠️  An attacker can trivially flood this endpoint.`);
  } else if (totalFailed > 0 && totalFailed < TOTAL * 0.5) {
    console.log(`   ⚠️  Partial rate limiting detected — ${totalFailed} requests were rejected.`);
  } else {
    console.log(`   ✅ Rate limiting appears to be active — ${totalFailed} requests were rejected.`);
  }

  if (p99 > 5000) {
    console.log(`   ⚠️  p99 latency of ${p99}ms indicates the database is struggling under load.`);
  }

  console.log();
}

main().catch(console.error);