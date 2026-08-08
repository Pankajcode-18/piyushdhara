const crypto = require('crypto');

/**
 * eSewa ePay v2 Official Utilities
 */
const ESEWA_CONFIG = {
  merchantCode: process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST',
  secretKey: process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q',
  gatewayUrl: process.env.ESEWA_GATEWAY_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
  statusUrl: process.env.ESEWA_STATUS_URL || 'https://rc.esewa.com.np/api/epay/transaction/status/',
};

// Fallback UAT Secret Keys for eSewa Sandbox Testing
const UAT_SECRET_KEYS = [
  ESEWA_CONFIG.secretKey,
  '8gBm/:&EnhH.1/q',
  '8gBmpyAbg6H8cMSt'
];

/**
 * Generate HMAC-SHA256 Signature for eSewa v2 Payment Request
 * Field format: total_amount,transaction_uuid,product_code
 * String format: total_amount=100,transaction_uuid=11-201-13,product_code=EPAYTEST
 */
const generateEsewaSignature = (totalAmount, transactionUuid, productCode = ESEWA_CONFIG.merchantCode, secretKey = ESEWA_CONFIG.secretKey) => {
  const dataString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(dataString);
  return hmac.digest('base64');
};

/**
 * Decode Base64 Response Payload from eSewa Callback
 */
const decodeEsewaResponse = (base64String) => {
  try {
    const decodedBuffer = Buffer.from(base64String, 'base64');
    const jsonString = decodedBuffer.toString('utf-8');
    return JSON.parse(jsonString);
  } catch (err) {
    console.error('decodeEsewaResponse Error:', err.message);
    return null;
  }
};

/**
 * Verify eSewa Callback Signature using configured & fallback UAT keys
 */
const verifyEsewaSignature = (decodedPayload) => {
  try {
    if (!decodedPayload || !decodedPayload.signed_field_names || !decodedPayload.signature) {
      return false;
    }

    const fieldNames = decodedPayload.signed_field_names.split(',');
    const messageParts = fieldNames.map(fieldName => `${fieldName}=${decodedPayload[fieldName]}`);
    const dataString = messageParts.join(',');

    // Check against primary and fallback secret keys
    for (const key of UAT_SECRET_KEYS) {
      const hmac = crypto.createHmac('sha256', key);
      hmac.update(dataString);
      const expectedSignature = hmac.digest('base64');

      if (expectedSignature === decodedPayload.signature) {
        return true;
      }
    }

    return false;
  } catch (err) {
    console.error('verifyEsewaSignature Error:', err.message);
    return false;
  }
};

/**
 * Query eSewa Status Check API for transaction status verification
 * Endpoint: https://rc.esewa.com.np/api/epay/transaction/status/?product_code=EPAYTEST&total_amount=100&transaction_uuid=123
 */
const checkEsewaStatusApi = async ({ productCode = ESEWA_CONFIG.merchantCode, totalAmount, transactionUuid }) => {
  try {
    const url = `${ESEWA_CONFIG.statusUrl}?product_code=${encodeURIComponent(productCode)}&total_amount=${encodeURIComponent(totalAmount)}&transaction_uuid=${encodeURIComponent(transactionUuid)}`;
    
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();

    if (!response.ok) {
      console.error('eSewa Status Check API response error:', data);
      throw new Error(data.error_message || 'eSewa Status Check failed');
    }

    return data; // Returns { product_code, transaction_uuid, total_amount, status: 'COMPLETE'|'PENDING'|'CANCELED', ref_id }
  } catch (err) {
    console.error('checkEsewaStatusApi Error:', err.message);
    throw err;
  }
};

module.exports = {
  ESEWA_CONFIG,
  generateEsewaSignature,
  decodeEsewaResponse,
  verifyEsewaSignature,
  checkEsewaStatusApi
};
