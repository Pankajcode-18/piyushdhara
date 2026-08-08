const crypto = require('crypto');

async function testCombination(key, dataString, name) {
  const amount = "299";
  const tax_amount = "0";
  const total_amount = "299";
  const transaction_uuid = "241028";
  const product_code = "EPAYTEST";
  const product_service_charge = "0";
  const product_delivery_charge = "0";
  const success_url = "http://localhost:5173/payment/esewa/success";
  const failure_url = "http://localhost:5173/payment/failure";
  const signed_field_names = "total_amount,transaction_uuid,product_code";

  const hmac = crypto.createHmac('sha256', key);
  hmac.update(dataString);
  const signature = hmac.digest('base64');

  const params = new URLSearchParams({
    amount,
    tax_amount,
    total_amount,
    transaction_uuid,
    product_code,
    product_service_charge,
    product_delivery_charge,
    success_url,
    failure_url,
    signed_field_names,
    signature
  });

  try {
    const response = await fetch('https://rc-epay.esewa.com.np/api/epay/main/v2/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });

    const text = await response.text();
    if (response.status === 200) {
      console.log(`\n🎉 BINGO SUCCESS! Name: "${name}" | Key: "${key}" | DataString: "${dataString}"`);
      console.log('Response status:', response.status);
      return true;
    } else {
      console.log(`Failed [${response.status}]: ${name} -> ${text.slice(0, 100)}`);
      return false;
    }
  } catch (e) {
    console.error('Error:', e.message);
    return false;
  }
}

async function main() {
  const keys = ['8gBmpyAbg6H8cMSt', '8gBm/:&EnhH.1/q(', 'EPAYTEST'];
  const total_amount = "299";
  const transaction_uuid = "241028";
  const product_code = "EPAYTEST";

  const formats = [
    { name: "Format 1: total_amount=X,transaction_uuid=Y,product_code=Z", str: `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}` },
    { name: "Format 2: total_amount=X&transaction_uuid=Y&product_code=Z", str: `total_amount=${total_amount}&transaction_uuid=${transaction_uuid}&product_code=${product_code}` },
    { name: "Format 3: X,Y,Z", str: `${total_amount},${transaction_uuid},${product_code}` },
    { name: "Format 4: total_amount=X,transaction_uuid=Y,product_code=Z (key=value order)", str: `product_code=${product_code},total_amount=${total_amount},transaction_uuid=${transaction_uuid}` },
    { name: "Format 5: signed fields with values total_amount=299,transaction_uuid=241028,product_code=EPAYTEST,signed_field_names=total_amount,transaction_uuid,product_code", str: `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code},signed_field_names=total_amount,transaction_uuid,product_code` },
    { name: "Format 6: Uppercase HMAC total_amount=299,transaction_uuid=241028,product_code=EPAYTEST", str: `TOTAL_AMOUNT=${total_amount},TRANSACTION_UUID=${transaction_uuid},PRODUCT_CODE=${product_code}` }
  ];

  for (const k of keys) {
    for (const f of formats) {
      const ok = await testCombination(k, f.str, f.name);
      if (ok) return;
    }
  }
}

main();
