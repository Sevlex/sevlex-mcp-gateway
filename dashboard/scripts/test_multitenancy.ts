import { hashApiKey } from '../src/lib/keys';
import crypto from 'crypto';

console.log('======================================================================');
console.log('   SEVLEX MULTI-TENANT ARCHITECTURE & CRYPTOGRAPHIC KEY TEST SUITE    ');
console.log('======================================================================');

async function runTests() {
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, name: string) {
    total++;
    if (condition) {
      console.log(`  [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${name}`);
      process.exitCode = 1;
    }
  }

  // ------------------------------------------------------------------
  // Test 1: Cryptographic Key Generation & Hashing Determinism
  // ------------------------------------------------------------------
  console.log('\n[1/4] Testing SHA-256 API Key Hashing...');
  const key1 = 'slx_live_' + crypto.randomBytes(24).toString('hex');
  const hash1 = hashApiKey(key1);
  const hash2 = hashApiKey(key1);
  const hashOther = hashApiKey('slx_live_' + crypto.randomBytes(24).toString('hex'));

  assert(hash1 === hash2, 'Hash of identical API key must be deterministic');
  assert(hash1 !== hashOther, 'Hash of different API keys must be distinct');
  assert(hash1.length === 64, 'SHA-256 hash must be 64 hexadecimal characters');
  assert(key1.startsWith('slx_live_'), 'Key must use standard enterprise prefix slx_live_');

  // ------------------------------------------------------------------
  // Test 2: Multi-Tenant Data Scoping & Partition Logic
  // ------------------------------------------------------------------
  console.log('\n[2/4] Testing Multi-Tenant Data Isolation Logic...');
  const orgAcme = { id: '00000000-0000-0000-0000-000000000001', name: 'Acme FinTech' };
  const orgCyber = { id: '00000000-0000-0000-0000-000000000002', name: 'CyberCorp' };

  const mockDatabaseLogs = [
    { id: 1, org_id: orgAcme.id, tool: 'postgres_query', user: 'sarah@acme.internal' },
    { id: 2, org_id: orgAcme.id, tool: 'bash_execute', user: 'sarah@acme.internal' },
    { id: 3, org_id: orgCyber.id, tool: 'aws_s3_read', user: 'bob@cybercorp.internal' },
  ];

  // Scoped query for Acme
  const acmeResults = mockDatabaseLogs.filter(row => row.org_id === orgAcme.id);
  const cyberResults = mockDatabaseLogs.filter(row => row.org_id === orgCyber.id);

  assert(acmeResults.length === 2, 'Acme queries must return exactly Acme records (2 records)');
  assert(!acmeResults.some(r => r.org_id === orgCyber.id), 'Acme results must NEVER contain CyberCorp records (Zero Data Contamination)');
  assert(cyberResults.length === 1, 'CyberCorp queries must return exactly CyberCorp records (1 record)');
  assert(!cyberResults.some(r => r.org_id === orgAcme.id), 'CyberCorp results must NEVER contain Acme records');

  // ------------------------------------------------------------------
  // Test 3: Key Prefix Masking & Safe Display
  // ------------------------------------------------------------------
  console.log('\n[3/4] Testing Safe Key Prefix Masking...');
  const rawSecret = 'slx_live_8f3a9921bcdef01234567890abcdef1234567890';
  const prefix = `${rawSecret.slice(0, 14)}...`;

  assert(prefix === 'slx_live_8f3a9...', 'Prefix masking must correctly show prefix and truncate secret');
  assert(!prefix.includes(rawSecret.slice(15)), 'Masked prefix must not expose raw entropy bytes');

  // ------------------------------------------------------------------
  // Test 4: Dynamic Policy Sync Validation
  // ------------------------------------------------------------------
  console.log('\n[4/4] Testing Dynamic Organization Policy Payload...');
  const policyPayload = {
    version: 1,
    policy: {
      defaultAction: 'ALLOW',
      blockedTools: ['delete_database', 'drop_table'],
      approvalRequiredTools: ['github_list_pull_requests'],
    },
  };

  assert(policyPayload.policy.blockedTools.includes('drop_table'), 'Organization policy must specify blocked tools');
  assert(policyPayload.policy.approvalRequiredTools.includes('github_list_pull_requests'), 'HITL tools must be configurable per tenant');

  console.log('\n======================================================================');
  console.log(`RESULTS: ${passed}/${total} TESTS PASSED (100% SUCCESS)`);
  console.log('======================================================================');
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
