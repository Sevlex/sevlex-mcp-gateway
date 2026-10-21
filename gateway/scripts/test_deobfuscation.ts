import { inspectToolParameters } from "../src/toolguard.js";

console.log("=================================================================");
console.log("  SEVLEX TOOLGUARD™ DE-OBFUSCATION & EVASION DEFENSE VERIFIER     ");
console.log("=================================================================");

// Test 1: Base64 encoded rm -rf /
const b64Payload = "echo cm0gLXJmIC8= | base64 -d | sh";
const res1 = inspectToolParameters("bash_execute", { command: b64Payload });
console.log("[1] Base64 Encoded Destruction:", res1.passed ? "❌ FAILED" : `✔ BLOCKED -> ${res1.violation?.reason}`);

// Test 2: Shell quote evasion r""m -r""f /
const quotePayload = 'r""m -r""f /';
const res2 = inspectToolParameters("bash_execute", { command: quotePayload });
console.log("[2] Shell Quote Interleaving:", res2.passed ? "❌ FAILED" : `✔ BLOCKED -> ${res2.violation?.reason}`);

// Test 3: SQL comment interleaving DROP/**/TABLE
const sqlPayload = "DROP/**/TABLE users;";
const res3 = inspectToolParameters("postgres_query", { query: sqlPayload });
console.log("[3] SQL Comment Interleaving:", res3.passed ? "❌ FAILED" : `✔ BLOCKED -> ${res3.violation?.reason}`);

// Test 4: Dynamic JS concatenation "pro" + "cess"
const jsPayload = 'const e = globalThis["pro" + "cess"]["en" + "v"];';
const res4 = inspectToolParameters("codemode_execute", { code: jsPayload });
console.log("[4] JavaScript Token Concatenation:", res4.passed ? "❌ FAILED" : `✔ BLOCKED -> ${res4.violation?.reason}`);

// Test 5: Hex encoding \x72\x6d\x20\x2d\x72\x66\x20\x2f
const hexPayload = "\\x72\\x6d\\x20\\x2d\\x72\\x66\\x20\\x2f";
const res5 = inspectToolParameters("bash_execute", { command: hexPayload });
console.log("[5] Hex Escape Sequence:", res5.passed ? "❌ FAILED" : `✔ BLOCKED -> ${res5.violation?.reason}`);

const allBlocked = !res1.passed && !res2.passed && !res3.passed && !res4.passed && !res5.passed;
console.log("\nVERDICT:", allBlocked ? "🎯 100% OF ADVANCED OBFUSCATIONS INTERCEPTED!" : "⚠️ SOME EVASIONS PASSED");
process.exit(allBlocked ? 0 : 1);
