require('dotenv').config();
const mongoose = require('mongoose');
const Certification = require('./models/Certification');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piyushdhara';

async function updatePrices() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas');

    const certs = await Certification.find({});
    console.log(`Found ${certs.length} certifications`);

    for (let i = 0; i < certs.length; i++) {
      const cert = certs[i];
      // Keep first certification free, set price for others
      if (i === 0 || cert.slug === 'html-mastery-beginner-to-advanced') {
        cert.price = 0;
        cert.isPaid = false;
      } else if (i === 1 || cert.slug === 'css3-modern-responsive-layouts') {
        cert.price = 1499;
        cert.isPaid = true;
      } else {
        cert.price = 1999;
        cert.isPaid = true;
      }
      await cert.save();
      console.log(`Updated "${cert.title}" -> Price: Rs. ${cert.price} (${cert.isPaid ? 'Paid' : 'Free'})`);
    }

    console.log('All certification prices updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Update prices error:', err);
    process.exit(1);
  }
}

updatePrices();
