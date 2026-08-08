require('dotenv').config();
const crypto = require('crypto');
const mongoose = require('mongoose');
const PaymentTransaction = require('./models/PaymentTransaction');
const Certification = require('./models/Certification');
const CertProgress = require('./models/CertProgress');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piyushdhara';

async function testFullCallback() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas for Callback Testing...');

    // Find HTML certification
    const cert = await Certification.findOne({ slug: 'html-mastery-beginner-to-advanced' });
    if (!cert) throw new Error('HTML Certification not found');

    const studentEmail = 'baduwalpankaj@gmail.com';
    const transactionUuid = `TXN-TEST-${Date.now().toString().slice(-6)}`;
    const secretKey = '8gBm/:&EnhH.1/q';

    // 1. Create Pending Payment Transaction
    const pendingTx = await PaymentTransaction.create({
      transactionUuid,
      studentEmail,
      studentName: 'Pankaj Baduwal',
      studentPhone: '9800000000',
      itemId: cert._id,
      itemType: 'certification',
      itemTitle: cert.title,
      amount: 299,
      currency: 'NPR',
      gateway: 'esewa',
      status: 'pending'
    });

    console.log('1. Created Pending Transaction:', pendingTx.transactionUuid);

    // 2. Generate Valid eSewa Success Response Payload & Signature
    const transaction_code = `REF-${Math.floor(Math.random() * 900000 + 100000)}`;
    const status = 'COMPLETE';
    const total_amount = '299';
    const product_code = 'EPAYTEST';
    const signed_field_names = 'transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names';

    // Signature data string: transaction_code=REF-123456,status=COMPLETE,total_amount=299,transaction_uuid=TXN-TEST-123456,product_code=EPAYTEST,signed_field_names=transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names
    const dataString = `transaction_code=${transaction_code},status=${status},total_amount=${total_amount},transaction_uuid=${transactionUuid},product_code=${product_code},signed_field_names=${signed_field_names}`;

    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(dataString);
    const signature = hmac.digest('base64');

    const responsePayload = {
      transaction_code,
      status,
      total_amount,
      transaction_uuid: transactionUuid,
      product_code,
      signed_field_names,
      signature
    };

    const base64Data = Buffer.from(JSON.stringify(responsePayload)).toString('base64');

    console.log('2. Encoded Base64 Callback Payload generated.');

    // 3. Call Backend Verification API Endpoint
    const res = await fetch('http://localhost:5000/api/payments/esewa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: base64Data })
    });

    const resJson = await res.json();
    console.log('\n3. Verification API Response Status:', res.status);
    console.log('Verification Output:', resJson);

    // 4. Verify MongoDB Records
    const updatedTx = await PaymentTransaction.findOne({ transactionUuid });
    const progress = await CertProgress.findOne({ certificationId: cert._id, studentEmail });

    console.log('\n4. Verification Results:');
    console.log('- Transaction Status in DB:', updatedTx.status);
    console.log('- Transaction Ref Code:', updatedTx.transactionCode);
    console.log('- Student CertProgress Created/Enrolled?', progress ? `YES (isEnrolled: ${progress.isEnrolled})` : 'NO');

    process.exit(0);
  } catch (err) {
    console.error('Error in testFullCallback:', err);
    process.exit(1);
  }
}

testFullCallback();
