/**
 * Khalti ePayment v2 Utilities
 */
const KHALTI_CONFIG = {
  secretKey: process.env.KHALTI_SECRET_KEY || 'Key 80007a1158574161b478297dff7fc35b',
  initiateUrl: process.env.KHALTI_INITIATE_URL || 'https://a.khalti.com/api/v2/epayment/initiate/',
  lookupUrl: process.env.KHALTI_LOOKUP_URL || 'https://a.khalti.com/api/v2/epayment/lookup/',
};

// Ensure Secret Key starts with 'Key ' format
const getAuthHeader = () => {
  const key = KHALTI_CONFIG.secretKey;
  return key.startsWith('Key ') || key.startsWith('key ') ? key : `Key ${key}`;
};

/**
 * Initiate Khalti Payment via Native Fetch API
 */
const initiateKhaltiPayment = async ({
  returnUrl,
  websiteUrl,
  amountInRupees,
  purchaseOrderId,
  purchaseOrderName,
  customerInfo = {}
}) => {
  try {
    const amountInPaisa = Math.round(amountInRupees * 100);

    const payload = {
      return_url: returnUrl,
      website_url: websiteUrl,
      amount: amountInPaisa,
      purchase_order_id: purchaseOrderId,
      purchase_order_name: purchaseOrderName,
      customer_info: {
        name: customerInfo.name || 'Student',
        email: customerInfo.email || 'student@piyushdhara.com',
        phone: customerInfo.phone || '9800000000'
      }
    };

    const response = await fetch(KHALTI_CONFIG.initiateUrl, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Khalti initiate response error:', data);
      throw new Error(data.detail || data.message || 'Khalti payment initiation failed');
    }

    return data; // returns { pidx, payment_url, expires_at, expires_in }
  } catch (err) {
    console.error('initiateKhaltiPayment Error:', err.message);
    throw err;
  }
};

/**
 * Lookup / Verify Khalti Payment Status via pidx
 */
const lookupKhaltiPayment = async (pidx) => {
  try {
    const response = await fetch(KHALTI_CONFIG.lookupUrl, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pidx })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Khalti lookup response error:', data);
      throw new Error(data.detail || data.message || 'Khalti payment verification lookup failed');
    }

    return data; // returns { pidx, status, transaction_id, total_amount, fee, refunded }
  } catch (err) {
    console.error('lookupKhaltiPayment Error:', err.message);
    throw err;
  }
};

module.exports = {
  KHALTI_CONFIG,
  initiateKhaltiPayment,
  lookupKhaltiPayment
};
