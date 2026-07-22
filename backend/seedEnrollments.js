require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');

const sampleStudentsData = [
  { name: 'Aarav Shrestha', school: 'St. Xavier College', phone: '+977-9841234567', email: 'aarav.s@gmail.com' },
  { name: 'Bipana Thapa', school: 'Trinity International College', phone: '+977-9807654321', email: 'bipana.t@gmail.com' },
  { name: 'Rohan Sharma', school: 'Pulchowk Campus IOE', phone: '+977-9812345678', email: 'rohan.s@gmail.com' },
  { name: 'Pooja Karki', school: 'Kathmandu Model College', phone: '+977-9865432109', email: 'pooja.k@gmail.com' },
  { name: 'Siddharth Joshi', school: 'Apex College Kathmandu', phone: '+977-9823456789', email: 'siddharth.j@gmail.com' },
  { name: 'Ananya Adhikari', school: 'Prasadi Academy', phone: '+977-9851122334', email: 'ananya.a@gmail.com' },
  { name: 'Kushal Gautam', school: 'Global College of Management', phone: '+977-9803344556', email: 'kushal.g@gmail.com' },
  { name: 'Nisha Bista', school: 'St. Mary High School', phone: '+977-9819988776', email: 'nisha.b@gmail.com' },
  { name: 'Bibek Poudel', school: 'Little Angels College', phone: '+977-9849900112', email: 'bibek.p@gmail.com' },
  { name: 'Smriti Dahal', school: 'KMC Lalitpur', phone: '+977-9861122334', email: 'smriti.d@gmail.com' }
];

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piyushdhara';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding sample enrollments...');

    const courses = await Course.find();
    console.log(`Found ${courses.length} courses in database.`);

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      // Insert 2-3 sample enrollments per course
      const countToInsert = 3;
      for (let j = 0; j < countToInsert; j++) {
        const studentIndex = (i * countToInsert + j) % sampleStudentsData.length;
        const student = sampleStudentsData[studentIndex];

        // Check if student already enrolled in course
        const existing = await Enrollment.findOne({ email: student.email, course: course._id });
        if (!existing) {
          await Enrollment.create({
            name: student.name,
            school: student.school,
            phone: student.phone,
            email: student.email,
            course: course._id
          });
          console.log(`Enrolled ${student.name} into batch "${course.title}"`);
        }
      }
    }

    console.log('Sample enrollments successfully seeded into MongoDB!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seed();
