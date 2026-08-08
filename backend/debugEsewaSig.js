const crypto = require('crypto');

const expected = 'i94zsd3oXF6ZsSr/kGqT4sSzYQzjj1W/waxjWyRwaME=';

const keys = [
  '8gBm/:&EnhH.1/q(',
  '8gBmpyAbg6H8cMSt',
  'BwMCBxUDFhUYExQRExUWAw==',
  'EPAYTEST'
];

const stringFormats = [
  'total_amount=110,transaction_uuid=241028,product_code=EPAYTEST',
  'total_amount=110.0,transaction_uuid=241028,product_code=EPAYTEST',
  'total_amount=110,transaction_uuid=241028,product_code=EPAYTEST,signed_field_names=total_amount,transaction_uuid,product_code',
  '110,241028,EPAYTEST',
  'total_amount=110&transaction_uuid=241028&product_code=EPAYTEST',
  'amount=100,tax_amount=10,total_amount=110,transaction_uuid=241028,product_code=EPAYTEST',
  'total_amount=110&transaction_uuid=241028&product_code=EPAYTEST',
];

for (const key of keys) {
  for (const fmt of stringFormats) {
    const hmac = crypto.createHmac('sha256', key);
    hmac.update(fmt);
    const sig = hmac.digest('base64');
    if (sig === expected) {
      console.log(`🎉 MATCH FOUND! Key: "${key}" | Format: "${fmt}"`);
    } else {
      console.log(`Key: "${key}" | Format: "${fmt}" -> ${sig}`);
    }
  }
}
