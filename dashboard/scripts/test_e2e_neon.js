const http = require('http');

const PORT = 3005;
const ADMIN_API_KEY = 'sevlex_secret_123';

function request(method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, data: parsed });
        });
      }
    );

    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runE2ETests() {
  console.log('======================================================================');
  console.log('   SEVLEX END-TO-END NEON POSTGRESQL CLOUD INTEGRATION TEST SUITE     ');
  console.log('======================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      process.exitCode = 1;
    }
  }

  // 1. Test /api/health
  console.log('[1/6] Testing /api/health with Neon PostgreSQL...');
  const healthRes = await request('GET', '/api/health');
  assert(healthRes.status === 200, `Health HTTP status is 200 (Got ${healthRes.status})`);
  assert(healthRes.data?.status === 'healthy', `System status is "healthy"`);
  assert(healthRes.data?.database?.type === 'postgres', `Database engine is "postgres" (Got "${healthRes.data?.database?.type}")`);
  assert(healthRes.data?.database?.status === 'connected', `Database connection status is "connected"`);

  // 2. Test /api/organizations
  console.log('\n[2/6] Testing /api/organizations list and tenant discovery in Neon...');
  const orgsRes = await request('GET', '/api/organizations', {
    Authorization: ADMIN_API_KEY,
  });
  assert(orgsRes.status === 200, `Organizations HTTP status is 200`);
  assert(Array.isArray(orgsRes.data?.organizations), `Returns an array of organizations`);
  assert(orgsRes.data?.organizations.length > 0, `At least one seeded organization exists in Neon`);
  const org = orgsRes.data?.organizations[0];
  console.log(`        Discovered Org: "${org.name}" (ID: ${org.id}, Slug: ${org.slug})`);

  // 3. Test /api/keys (Create API Key in Neon)
  console.log('\n[3/6] Testing /api/keys: Provisioning production slx_live_ key in Neon...');
  const keyCreateRes = await request('POST', '/api/keys', { Authorization: ADMIN_API_KEY }, {
    org_id: org.id,
    name: 'Neon E2E Verification Key',
  });
  assert(keyCreateRes.status === 200, `API Key creation HTTP status is 200 (Got ${keyCreateRes.status})`);
  assert(keyCreateRes.data?.key?.rawKey?.startsWith('slx_live_'), `Generated valid enterprise key prefix: ${keyCreateRes.data?.key?.keyPrefix}`);
  const liveApiKey = keyCreateRes.data?.key?.rawKey;

  // 4. Test /api/policy/sync using the new slx_live_ key
  console.log('\n[4/6] Testing /api/policy/sync authenticated with live Neon API key...');
  const policyRes = await request('GET', '/api/policy/sync', {
    Authorization: `Bearer ${liveApiKey}`,
  });
  assert(policyRes.status === 200, `Policy sync HTTP status is 200`);
  assert(policyRes.data?.org_id === org.id, `Policy scoped to correct organization ID (${org.id})`);
  assert(policyRes.data?.policy?.defaultAction === 'ALLOW', `Policy returned defaultAction ALLOW`);

  // 5. Test /api/ingest using the new slx_live_ key (Writing to Neon audit_logs)
  console.log('\n[5/6] Testing /api/ingest: Writing audit telemetry to Neon PostgreSQL...');
  const testPayload = {
    receipt: {
      userId: 'e2e-tester@sevlex.internal',
      toolName: 'neon_postgres_verify',
      status: 'ALLOWED',
      rawRequest: { query: 'SELECT * FROM enterprise_tenants', timestamp: new Date().toISOString() },
      rawResponse: { rowCount: 1, latencyMs: 0.08 },
    },
  };
  const ingestRes = await request('POST', '/api/ingest', {
    Authorization: `Bearer ${liveApiKey}`,
  }, testPayload);
  assert(ingestRes.status === 200, `Ingestion HTTP status is 200`);
  assert(ingestRes.data?.storage === 'postgres', `Audit log recorded to storage engine "postgres"`);
  assert(ingestRes.data?.org_id === org.id, `Audit log bound to tenant org ID`);

  // 6. Test /api/logs with the live tenant key (Reading from Neon audit_logs)
  console.log('\n[6/6] Testing /api/logs: Reading tenant-scoped telemetry back from Neon...');
  const logsRes = await request('GET', '/api/logs', {
    Authorization: `Bearer ${liveApiKey}`,
  });
  assert(logsRes.status === 200, `Audit logs HTTP status is 200`);
  assert(logsRes.data?.storage === 'postgres', `Logs retrieved from "postgres"`);
  assert(logsRes.data?.scoped_org_id === org.id, `Logs scoped strictly to tenant org ID`);
  const foundLog = logsRes.data?.logs?.find((l) => l.tool_name === 'neon_postgres_verify');
  assert(!!foundLog, `Ingested verification log successfully retrieved from Neon`);
  assert(foundLog?.user_id === 'e2e-tester@sevlex.internal', `User ID preserved in Neon audit record`);

  console.log('\n======================================================================');
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED (100% SUCCESS)`);
  console.log('======================================================================\n');
}

runE2ETests().catch((err) => {
  console.error('E2E Test execution failed:', err);
  process.exit(1);
});
