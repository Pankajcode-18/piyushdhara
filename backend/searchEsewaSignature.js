const crypto = require('crypto');

async function testParams(paramsObj, secretKey, desc) {
  const fieldNames = paramsObj.signed_field_names.split(',');
  const parts = fieldNames.map(f => `${f}=${paramsObj[f]}`);
  const dataString = parts.join(',');

  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(dataString);
  const signature = hmac.digest('base64');

  const fullBody = new URLSearchParams({ ...paramsObj, signature });

  try {
    const res = await fetch('https://rc-epay.esewa.com.np/api/epay/main/v2/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: fullBody.toString()
    });

    const text = await res.text();
    if (res.status === 200) {
      console.log(`\n🔥🔥🔥 SUCCESS 200 OK! 🔥🔥🔥`);
      console.log('Desc:', desc);
      console.log('SecretKey:', secretKey);
      console.log('dataString:', dataString);
      console.log('Signature:', signature);
      console.log('Response HTML length:', text.length);
      return true;
    }
  } catch (e) {
    // silent
  }
  return false;
}

async function run() {
  const keys = [
    '8gBmpyAbg6H8cMSt',
    '8gBm/:&EnhH.1/q(',
    '8gBm/:&EnhH.1/q',
    '8gBmpyAbg6H8cMSt\n',
    'EPAYTEST'
  ];

  const uuids = ['241028', 'TXN-123456', '241028-100'];

  for (const key of keys) {
    for (const uuid of uuids) {
      const baseParams = {
        amount: "299",
        tax_amount: "0",
        total_amount: "299",
        transaction_uuid: uuid,
        product_code: "EPAYTEST",
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: "http://localhost:5173/payment/esewa/success",
        failure_url: "http://localhost:5173/payment/failure",
        signed_field_names: "total_amount,transaction_uuid,product_code"
      };

      if (await testParams(baseParams, key, `Standard 299 with uuid ${uuid}`)) return;

      // Try total_amount,transaction_uuid,product_code in signed_field_names
      const altParams = {
        ...baseParams,
        signed_field_names: "total_amount,transaction_uuid,product_code"
      };
      if (await testParams(altParams, key, `Alt params with uuid ${uuid}`)) return;
    }
  }
  console.log('Search finished.');
}

run();
