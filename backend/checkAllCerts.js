require('dotenv').config();
const mongoose = require('mongoose');
const Certification = require('./models/Certification');
const CertModule = require('./models/CertModule');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piyushdhara';

async function check() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const certs = await Certification.find({});
    console.log(`Found ${certs.length} certifications in DB:`);

    for (const cert of certs) {
      const moduleCount = await CertModule.countDocuments({ certificationId: cert._id });
      console.log(`- [${cert._id}] "${cert.title}" | Slug: "${cert.slug}" | Price: Rs. ${cert.price || 0} (${cert.isPaid ? 'Paid' : 'Free'}) | Status: ${cert.status} | Modules: ${moduleCount}`);
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
