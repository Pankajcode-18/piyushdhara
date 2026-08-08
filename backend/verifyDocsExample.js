const crypto = require('crypto');

// Official eSewa docs example:
// total_amount=110, transaction_uuid=241028, product_code=EPAYTEST
// Expected signature: i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME=

const tests = [
  { key: '8gBm/:&EnhH.1/q',  label: 'Key WITHOUT trailing (' },
  { key: '8gBm/:&EnhH.1/q(', label: 'Key WITH trailing (' },
];

const dataString = 'total_amount=110,transaction_uuid=241028,product_code=EPAYTEST';
const expected = 'i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME=';

console.log('Data String:', dataString);
console.log('Expected:   ', expected);
console.log('');

for (const t of tests) {
  const sig = crypto.createHmac('sha256', t.key).update(dataString).digest('base64');
  const match = sig === expected ? '✅ MATCH!' : '❌ No match';
  console.log(`${match} | ${t.label} -> ${sig}`);
}
