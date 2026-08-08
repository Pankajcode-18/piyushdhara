const crypto = require('crypto');

async function testForm(secretKey) {
  const amount = "299";
  const tax_amount = "0";
  const total_amount = "299";
  const transaction_uuid = `TXN-${Date.now().toString().slice(-6)}`;
  const product_code = "EPAYTEST";
  const product_service_charge = "0";
  const product_delivery_charge = "0";
  const success_url = "http://localhost:5173/payment/esewa/success";
  const failure_url = "http://localhost:5173/payment/failure";
  const signed_field_names = "total_amount,transaction_uuid,product_code";

  // Signature string: total_amount=299,transaction_uuid=TXN-123456,product_code=EPAYTEST
  const dataString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(dataString);
  const signature = hmac.digest('base64');

  console.log('\n--- Testing with Secret Key:', secretKey, '---');
  console.log('dataString:', dataString);
  console.log('signature:', signature);

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

  const response = await fetch('https://rc-epay.esewa.com.np/api/epay/main/v2/form', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });

  const text = await response.text();
  console.log('Response Status:', response.status);
  console.log('Response Body Snippet:', text.slice(0, 300));
}

async function run() {
  await testForm('8gBmpyAbg6H8cMSt');
  await testForm('8gBm/:&EnhH.1/q(');
}

run();
