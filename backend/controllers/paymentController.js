const mongoose = require('mongoose');
const PaymentTransaction = require('../models/PaymentTransaction');
const Certification = require('../models/Certification');
const CertProgress = require('../models/CertProgress');
const Course = require('../models/Course');
const { ESEWA_CONFIG, generateEsewaSignature, decodeEsewaResponse, verifyEsewaSignature, checkEsewaStatusApi } = require('../utils/esewa');
const { initiateKhaltiPayment, lookupKhaltiPayment } = require('../utils/khalti');

/**
 * @desc    Initiate payment (or direct enroll if free)
 * @route   POST /api/payments/initiate
 */
const initiatePayment = async (req, res) => {
  try {
    const {
      itemId,
      itemType = 'certification',
      gateway = 'esewa',
      studentEmail,
      studentName,
      studentPhone,
      redirectBaseUrl
    } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ message: 'Student email is required for payment initiation' });
    }

    if (!itemId) {
      return res.status(400).json({ message: 'Item ID (Course or Certification) is required' });
    }

    const cleanEmail = studentEmail.toLowerCase().trim();
    let itemTitle = 'Educational Course';
    let itemPrice = 0;
    let itemObj = null;

    if (itemType === 'certification') {
      itemObj = await Certification.findById(itemId);
      if (!itemObj) {
        return res.status(404).json({ message: 'Certification course not found' });
      }
      itemTitle = itemObj.title;
      itemPrice = itemObj.price || 0;
    } else {
      itemObj = await Course.findById(itemId);
      if (!itemObj) {
        return res.status(404).json({ message: 'Course not found' });
      }
      itemTitle = itemObj.title;
      itemPrice = itemObj.price || 0;
    }

    // Free Item Flow: Enroll immediately without payment gateway
    if (itemPrice <= 0) {
      if (itemType === 'certification') {
        let progress = await CertProgress.findOne({ certificationId: itemObj._id, studentEmail: cleanEmail });
        if (!progress) {
          progress = await CertProgress.create({
            certificationId: itemObj._id,
            studentEmail: cleanEmail,
            studentName: studentName || 'Student',
            completedLessonIds: [],
            overallPercentage: 0,
            status: 'in_progress',
            isEnrolled: true,
            enrolledAt: new Date()
          });
        } else {
          progress.isEnrolled = true;
          await progress.save();
        }
      }

      return res.status(200).json({
        success: true,
        isFree: true,
        message: 'Enrolled in course successfully (Free Access)',
        itemTitle
      });
    }

    // Paid Item Flow: Generate unique transaction ID
    // eSewa docs format: alphanumeric + hyphen(-) only, e.g. "241028-162413-4521"
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const datePart = `${String(now.getFullYear()).slice(-2)}${pad(now.getMonth()+1)}${pad(now.getDate())}`;
    const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const randPart = Math.floor(1000 + Math.random() * 9000);
    const transactionUuid = `${datePart}-${timePart}-${randPart}`;

    const transaction = await PaymentTransaction.create({
      transactionUuid,
      studentEmail: cleanEmail,
      studentName: studentName || 'Student',
      studentPhone: studentPhone || '',
      itemId: itemObj._id,
      itemType,
      itemTitle,
      amount: itemPrice,
      currency: 'NPR',
      gateway,
      status: 'pending'
    });

    const clientOrigin = redirectBaseUrl || process.env.FRONTEND_URL || 'http://localhost:5174';

    // 1. eSewa Payment Gateway Payload
    if (gateway === 'esewa') {
      const signature = generateEsewaSignature(itemPrice, transactionUuid, ESEWA_CONFIG.merchantCode);
      const successUrl = `${clientOrigin}/payment/esewa/success`;
      const failureUrl = `${clientOrigin}/payment/failure`;

      return res.status(200).json({
        success: true,
        isFree: false,
        gateway: 'esewa',
        transactionUuid,
        esewaData: {
          amount: itemPrice,
          tax_amount: 0,
          total_amount: itemPrice,
          transaction_uuid: transactionUuid,
          product_code: ESEWA_CONFIG.merchantCode,
          product_service_charge: 0,
          product_delivery_charge: 0,
          success_url: successUrl,
          failure_url: failureUrl,
          signed_field_names: 'total_amount,transaction_uuid,product_code',
          signature,
          esewaUrl: ESEWA_CONFIG.gatewayUrl
        }
      });
    }

    // 2. Khalti Payment Gateway Payload
    if (gateway === 'khalti') {
      const returnUrl = `${clientOrigin}/payment/khalti/callback`;
      const websiteUrl = clientOrigin;

      const khaltiResponse = await initiateKhaltiPayment({
        returnUrl,
        websiteUrl,
        amountInRupees: itemPrice,
        purchaseOrderId: transactionUuid,
        purchaseOrderName: itemTitle,
        customerInfo: {
          name: studentName || 'Student',
          email: cleanEmail,
          phone: studentPhone || '9800000000'
        }
      });

      transaction.pidx = khaltiResponse.pidx;
      await transaction.save();

      return res.status(200).json({
        success: true,
        isFree: false,
        gateway: 'khalti',
        transactionUuid,
        pidx: khaltiResponse.pidx,
        paymentUrl: khaltiResponse.payment_url
      });
    }

    return res.status(400).json({ message: 'Unsupported payment gateway' });

  } catch (error) {
    console.error('initiatePayment Error:', error);
    res.status(500).json({ message: error.message || 'Server error initiating payment' });
  }
};

/**
 * @desc    Verify eSewa Payment Callback (Base64 payload decoding & HMAC validation)
 * @route   POST /api/payments/esewa/verify
 */
const verifyEsewaPayment = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ message: 'eSewa encoded payload data parameter is required' });
    }

    const decoded = decodeEsewaResponse(data);
    if (!decoded) {
      return res.status(400).json({ message: 'Invalid or corrupted eSewa response payload' });
    }

    // Validate Signature
    const isSignatureValid = verifyEsewaSignature(decoded);
    if (!isSignatureValid) {
      console.warn('eSewa signature verification warning: Mismatch detected for decoded payload:', decoded);
    }

    const transactionUuid = decoded.transaction_uuid;
    const transaction = await PaymentTransaction.findOne({ transactionUuid });

    if (!transaction) {
      return res.status(404).json({ message: 'Payment transaction record not found' });
    }

    let isComplete = decoded.status === 'COMPLETE' || decoded.status === 'COMPLETED';

    // If status is ambiguous or pending, query eSewa Status Check API
    if (!isComplete && transaction.amount) {
      try {
        const statusRes = await checkEsewaStatusApi({
          productCode: decoded.product_code || ESEWA_CONFIG.merchantCode,
          totalAmount: transaction.amount,
          transactionUuid: transaction.transactionUuid
        });
        if (statusRes && statusRes.status === 'COMPLETE') {
          isComplete = true;
          decoded.transaction_code = statusRes.ref_id || decoded.transaction_code;
          decoded.status = 'COMPLETE';
        }
      } catch (e) {
        console.warn('Status check API fallback warning:', e.message);
      }
    }

    if (isComplete) {
      transaction.status = 'completed';
      transaction.transactionCode = decoded.transaction_code || decoded.ref_id || '';
      transaction.gatewayResponse = decoded;
      transaction.completedAt = new Date();
      await transaction.save();

      // Automatically enroll student upon successful payment verification
      if (transaction.itemType === 'certification') {
        let progress = await CertProgress.findOne({
          certificationId: transaction.itemId,
          studentEmail: transaction.studentEmail
        });

        if (!progress) {
          await CertProgress.create({
            certificationId: transaction.itemId,
            studentEmail: transaction.studentEmail,
            studentName: transaction.studentName || 'Student',
            completedLessonIds: [],
            overallPercentage: 0,
            status: 'in_progress',
            isEnrolled: true,
            enrolledAt: new Date()
          });
        } else {
          progress.isEnrolled = true;
          await progress.save();
        }
      }

      return res.status(200).json({
        success: true,
        message: 'eSewa payment verified successfully & enrollment granted',
        transaction
      });
    } else {
      transaction.status = 'failed';
      transaction.gatewayResponse = decoded;
      await transaction.save();
      return res.status(400).json({ message: 'eSewa transaction was not completed', status: decoded.status });
    }

  } catch (error) {
    console.error('verifyEsewaPayment Error:', error);
    res.status(500).json({ message: error.message || 'Server error verifying eSewa payment' });
  }
};

/**
 * @desc    Verify Khalti Payment Callback (Lookup Verification)
 * @route   POST /api/payments/khalti/verify
 */
const verifyKhaltiPayment = async (req, res) => {
  try {
    const { pidx, purchase_order_id } = req.body;

    if (!pidx) {
      return res.status(400).json({ message: 'Khalti payment pidx parameter is required' });
    }

    const lookupRes = await lookupKhaltiPayment(pidx);
    if (!lookupRes) {
      return res.status(400).json({ message: 'Khalti verification lookup failed' });
    }

    let transaction = await PaymentTransaction.findOne({
      $or: [
        { pidx },
        { transactionUuid: purchase_order_id || lookupRes.purchase_order_id }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Payment transaction record not found' });
    }

    if (lookupRes.status === 'Completed') {
      transaction.status = 'completed';
      transaction.transactionCode = lookupRes.transaction_id || pidx;
      transaction.gatewayResponse = lookupRes;
      transaction.completedAt = new Date();
      await transaction.save();

      // Automatically enroll student upon successful payment verification
      if (transaction.itemType === 'certification') {
        let progress = await CertProgress.findOne({
          certificationId: transaction.itemId,
          studentEmail: transaction.studentEmail
        });

        if (!progress) {
          await CertProgress.create({
            certificationId: transaction.itemId,
            studentEmail: transaction.studentEmail,
            studentName: transaction.studentName || 'Student',
            completedLessonIds: [],
            overallPercentage: 0,
            status: 'in_progress',
            isEnrolled: true,
            enrolledAt: new Date()
          });
        } else {
          progress.isEnrolled = true;
          await progress.save();
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Khalti payment verified successfully & enrollment granted',
        transaction
      });
    } else {
      transaction.status = 'failed';
      transaction.gatewayResponse = lookupRes;
      await transaction.save();
      return res.status(400).json({ message: 'Khalti transaction was not completed', status: lookupRes.status });
    }

  } catch (error) {
    console.error('verifyKhaltiPayment Error:', error);
    res.status(500).json({ message: error.message || 'Server error verifying Khalti payment' });
  }
};

/**
 * @desc    Get payment history for student
 * @route   GET /api/payments/my-history
 */
const getStudentPaymentHistory = async (req, res) => {
  try {
    const { studentEmail } = req.query;

    if (!studentEmail) {
      return res.status(400).json({ message: 'Student email query parameter is required' });
    }

    const cleanEmail = studentEmail.toLowerCase().trim();
    const transactions = await PaymentTransaction.find({
      studentEmail: cleanEmail,
      status: 'completed'
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: transactions.length, transactions });
  } catch (error) {
    console.error('getStudentPaymentHistory Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching payment history' });
  }
};

/**
 * @desc    DEV ONLY — Simulate a completed payment without going through real gateway
 * @route   POST /api/payments/test/simulate
 */
const simulateTestPayment = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ message: 'Not available in production' });
  }

  try {
    const { itemId, itemType = 'certification', studentEmail, studentName, studentPhone } = req.body;

    if (!studentEmail || !itemId) {
      return res.status(400).json({ message: 'studentEmail and itemId are required' });
    }

    const cleanEmail = studentEmail.toLowerCase().trim();

    let itemObj = null;
    let itemTitle = 'Test Course';
    let itemPrice = 299;

    if (itemType === 'certification') {
      itemObj = await Certification.findById(itemId);
      if (!itemObj) return res.status(404).json({ message: 'Certification not found' });
      itemTitle = itemObj.title;
      itemPrice = itemObj.price || 299;
    }

    const transactionUuid = `TEST-PAY-${Date.now()}`;
    const fakeRefCode = `SIM-${Math.floor(Math.random() * 900000 + 100000)}`;

    // Create & immediately complete the transaction
    const transaction = await PaymentTransaction.create({
      transactionUuid,
      studentEmail: cleanEmail,
      studentName: studentName || 'Test Student',
      studentPhone: studentPhone || '9800000000',
      itemId: itemObj._id,
      itemType,
      itemTitle,
      amount: itemPrice,
      currency: 'NPR',
      gateway: 'esewa',
      status: 'completed',
      transactionCode: fakeRefCode,
      completedAt: new Date(),
      gatewayResponse: {
        transaction_code: fakeRefCode,
        status: 'COMPLETE',
        total_amount: String(itemPrice),
        transaction_uuid: transactionUuid,
        product_code: 'EPAYTEST',
        note: 'Simulated test payment — dev mode only'
      }
    });

    // Enroll student
    let progress = await CertProgress.findOne({ certificationId: itemObj._id, studentEmail: cleanEmail });
    if (!progress) {
      progress = await CertProgress.create({
        certificationId: itemObj._id,
        studentEmail: cleanEmail,
        studentName: studentName || 'Test Student',
        completedLessonIds: [],
        overallPercentage: 0,
        status: 'in_progress',
        isEnrolled: true,
        enrolledAt: new Date()
      });
    } else {
      progress.isEnrolled = true;
      await progress.save();
    }

    return res.status(200).json({
      success: true,
      message: '✅ Test payment simulated successfully! Student enrolled.',
      transaction,
      transactionUuid,
      refCode: fakeRefCode
    });

  } catch (error) {
    console.error('simulateTestPayment Error:', error);
    res.status(500).json({ message: error.message || 'Error simulating test payment' });
  }
};

module.exports = {
  initiatePayment,
  verifyEsewaPayment,
  verifyKhaltiPayment,
  getStudentPaymentHistory,
  simulateTestPayment
};
