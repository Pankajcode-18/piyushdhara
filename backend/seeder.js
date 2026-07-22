const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const Subject = require('./models/Subject');
const Chapter = require('./models/Chapter');
const Video = require('./models/Video');
const Note = require('./models/Note');
const User = require('./models/User');

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piyushdhara';

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected for advanced seeding'))
  .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
  });

const importData = async () => {
    try {
        await Course.deleteMany();
        await Subject.deleteMany();
        await Chapter.deleteMany();
        await Video.deleteMany();
        await Note.deleteMany();
        await User.deleteMany();

        console.log('Clearing old data...');

        // 1. Create Admin
        const adminUser = await User.create({
            name: 'Piyush Dhara Admin',
            email: 'admin@piyushdhara.com',
            password: 'password123',
            role: 'admin'
        });

        // 2. Create Courses (Mahabharath Math, Web Dev, IOE Entrance, Loksewa)
        const coursesData = [
            {
                title: 'Mahabharath Mathematics Series',
                description: 'Legendary mathematics speed trick series by Gaurav Sir. Learn L\'Hospital rule, trigonometry shortcuts, calculus tricks, and geometry proofs in seconds.',
                price: 0,
                isPublished: true,
                isFeatured: true,
                order: 1
            },
            {
                title: 'Web Development (Full-Stack MERN)',
                description: 'Master HTML5, CSS3, JavaScript, React.js, Node.js, and MongoDB with hands-on real-world projects and full portfolio building.',
                price: 1999,
                isPublished: true,
                isFeatured: true,
                order: 2
            },
            {
                title: 'IOE Entrance Preparation Course',
                description: 'Comprehensive entrance preparation for Pulchowk and other affiliate engineering colleges. Math, Physics, Chemistry, and English.',
                price: 2500,
                isPublished: true,
                isFeatured: true,
                order: 3
            },
            {
                title: 'Loksewa Tayari (GK & IQ Preparation)',
                description: 'General knowledge (GK) and IQ tests preparation for Loksewa Aayog examinations in Nepal.',
                price: 1500,
                isPublished: true,
                isFeatured: true,
                order: 4
            }
        ];

        const insertedCourses = await Course.insertMany(coursesData);
        console.log('Courses seeded!');

        // --- Class 10 Subjects ---
        const c10 = insertedCourses[0];
        const s10_science = await Subject.create({ title: 'Science & Technology', course: c10._id, order: 1 });
        const s10_math = await Subject.create({ title: 'Compulsory Mathematics', course: c10._id, order: 2 });

        // Chapters for Class 10 Science
        const ch10_force = await Chapter.create({ title: 'Force and Gravitation', subject: s10_science._id, order: 1 });
        const ch10_pressure = await Chapter.create({ title: 'Pressure', subject: s10_science._id, order: 2 });
        
        await Video.create({
            title: 'Newton\'s Law of Gravitation & Numerical Problems',
            description: 'In-depth explanation of Universal Law of Gravitation, gravity, and numerical values for Nepal SEE.',
            videoUrl: 'https://www.youtube.com/watch?v=x1PTN8w3vC8',
            duration: 1800,
            isFree: true,
            isPublished: true,
            chapter: ch10_force._id,
            order: 1
        });
        await Note.create({
            title: 'SEE Force & Gravitation PDF Handout',
            description: 'Handwritten formulas and definitions matching SEE marking scheme.',
            fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            isPublished: true,
            chapter: ch10_force._id,
            order: 1
        });

        // --- IOE Entrance Subjects ---
        const ioe = insertedCourses[3];
        const sioe_math = await Subject.create({ title: 'Entrance Mathematics', course: ioe._id, order: 1 });
        const sioe_phys = await Subject.create({ title: 'Entrance Physics', course: ioe._id, order: 2 });

        const ch_ioe_limits = await Chapter.create({ title: 'Limits & Continuity Shortcuts', subject: sioe_math._id, order: 1 });
        const ch_ioe_vectors = await Chapter.create({ title: 'Vector Analysis', subject: sioe_phys._id, order: 1 });

        await Video.create({
            title: 'L\'Hospital Rule & Limit Indeterminate Forms (Shortcuts)',
            description: 'Quick trick solutions for IOE math portion to solve complex limit questions in 10 seconds.',
            videoUrl: 'https://www.youtube.com/watch?v=x1PTN8w3vC8',
            duration: 900,
            isFree: true,
            isPublished: true,
            chapter: ch_ioe_limits._id,
            order: 1
        });
        await Video.create({
            title: 'Continuity & Differentiability past questions',
            description: 'Solving past IOE questions on continuity.',
            videoUrl: 'https://www.youtube.com/watch?v=x1PTN8w3vC8',
            duration: 1200,
            isFree: false, // Paid content
            isPublished: true,
            chapter: ch_ioe_limits._id,
            order: 2
        });

        console.log('All detailed Nepalese syllabus content seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

importData();
