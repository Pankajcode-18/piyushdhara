const crypto = require('crypto');

// Official eSewa example parameters from documentation:
// total_amount=110,transaction_uuid=241028,product_code=EPAYTEST
// SecretKey: 8gBm/:&EnhH.1/q(
// Expected signature: i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME=

const dataString = 'total_amount=110,transaction_uuid=241028,product_code=EPAYTEST';
const secretKey = '8gBm/:&EnhH.1/q(';

const hmac = crypto.createHmac('sha256', secretKey);
hmac.update(dataString);
const sig = hmac.digest('base64');

console.log('Computed Signature:', sig);
console.log('Expected Signature: i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME=');
console.log('Match?', sig === 'i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME=');
