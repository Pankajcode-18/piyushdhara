const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const Subject = require('./models/Subject');
const Chapter = require('./models/Chapter');
const Video = require('./models/Video');
const Note = require('./models/Note');
const User = require('./models/User');

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb+srv://23it040_db_user:QrbJXgXeItdIJbjE@cluster0.f74agq9.mongodb.net/piyushdhara?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('MongoDB connected to cloud Atlas cluster!');
    await importData();
  })
  .catch((err) => {
      console.error('MongoDB Atlas connection error:', err.message);
      console.error('Tip: Make sure 0.0.0.0/0 (Allow Access from Anywhere) is whitelisted in your MongoDB Atlas Network Access tab!');
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

        // --- Course 0: Mahabharath Mathematics Series ---
        const c_math = insertedCourses[0];
        const s_math_comp = await Subject.create({ title: 'Compulsory Mathematics', course: c_math._id, order: 1 });
        const s_math_sci = await Subject.create({ title: 'Science & Technology', course: c_math._id, order: 2 });

        const ch_trig = await Chapter.create({ title: 'Trigonometric Identities & Proofs', subject: s_math_comp._id, order: 1 });
        const ch_force = await Chapter.create({ title: 'Force and Gravitation', subject: s_math_sci._id, order: 1 });
        const ch_pressure = await Chapter.create({ title: 'Pressure & Hydraulics', subject: s_math_sci._id, order: 2 });

        await Video.create({
            title: 'Newton\'s Law of Gravitation & Numerical Problems',
            description: 'In-depth explanation of Universal Law of Gravitation, gravity, and numerical values for Nepal SEE.',
            videoUrl: 'https://www.youtube.com/watch?v=x1PTN8w3vC8',
            duration: 1800,
            isFree: true,
            isPublished: true,
            chapter: ch_force._id,
            order: 1
        });
        await Video.create({
            title: 'Pascal\'s Law & Hydraulic Press Problems',
            description: 'Step-by-step breakdown of Pascal\'s principle, liquid pressure, and atmospheric pressure.',
            videoUrl: 'https://www.youtube.com/watch?v=x1PTN8w3vC8',
            duration: 1500,
            isFree: true,
            isPublished: true,
            chapter: ch_pressure._id,
            order: 1
        });
        await Note.create({
            title: 'SEE Force & Gravitation PDF Handout',
            description: 'Handwritten formulas and definitions matching SEE marking scheme.',
            fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            isPublished: true,
            chapter: ch_force._id,
            order: 1
        });

        // --- Course 1: Web Development (Full-Stack MERN) ---
        const c_web = insertedCourses[1];
        const s_web_front = await Subject.create({ title: 'Frontend Development (React.js)', course: c_web._id, order: 1 });
        const s_web_back = await Subject.create({ title: 'Backend Development (Node & Express)', course: c_web._id, order: 2 });

        const ch_react = await Chapter.create({ title: 'React 19 & State Management', subject: s_web_front._id, order: 1 });
        const ch_node = await Chapter.create({ title: 'REST API Development & Express.js', subject: s_web_back._id, order: 1 });

        await Video.create({
            title: 'Building Interactive Web Applications with React',
            description: 'Learn JSX, React Hooks, State Management, and Component Architecture.',
            videoUrl: 'https://www.youtube.com/watch?v=x1PTN8w3vC8',
            duration: 2400,
            isFree: true,
            isPublished: true,
            chapter: ch_react._id,
            order: 1
        });
        await Note.create({
            title: 'React Hooks & Props Cheat Sheet',
            description: 'Complete guide to useState, useEffect, and component composition in React.',
            fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            isPublished: true,
            chapter: ch_react._id,
            order: 1
        });

        // --- Course 2: IOE Entrance Preparation Course ---
        const c_ioe = insertedCourses[2];
        const s_ioe_math = await Subject.create({ title: 'Entrance Mathematics', course: c_ioe._id, order: 1 });
        const s_ioe_phys = await Subject.create({ title: 'Entrance Physics', course: c_ioe._id, order: 2 });

        const ch_ioe_limits = await Chapter.create({ title: 'Limits & Continuity Shortcuts', subject: s_ioe_math._id, order: 1 });
        const ch_ioe_vectors = await Chapter.create({ title: 'Vector Analysis', subject: s_ioe_phys._id, order: 1 });

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
            title: 'Continuity & Differentiability Past Questions',
            description: 'Solving past IOE questions on continuity.',
            videoUrl: 'https://www.youtube.com/watch?v=x1PTN8w3vC8',
            duration: 1200,
            isFree: false,
            isPublished: true,
            chapter: ch_ioe_limits._id,
            order: 2
        });
        await Note.create({
            title: 'IOE Mathematics Formula Cheat Sheet',
            description: 'Essential speed calculation techniques for IOE entrance examination.',
            fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            isPublished: true,
            chapter: ch_ioe_limits._id,
            order: 1
        });

        // --- Course 3: Loksewa Tayari (GK & IQ Preparation) ---
        const c_lok = insertedCourses[3];
        const s_lok_gk = await Subject.create({ title: 'General Knowledge (GK)', course: c_lok._id, order: 1 });
        const s_lok_iq = await Subject.create({ title: 'Logical Reasoning & IQ', course: c_lok._id, order: 2 });

        const ch_lok_geo = await Chapter.create({ title: 'Geography & History of Nepal', subject: s_lok_gk._id, order: 1 });
        const ch_lok_iq = await Chapter.create({ title: 'Numerical Reasoning & Series', subject: s_lok_iq._id, order: 1 });

        await Video.create({
            title: 'Nepal Geography, Rivers & Mountain Ranges',
            description: 'Important facts and memory tricks for Loksewa GK examination.',
            videoUrl: 'https://www.youtube.com/watch?v=x1PTN8w3vC8',
            duration: 1600,
            isFree: true,
            isPublished: true,
            chapter: ch_lok_geo._id,
            order: 1
        });
        await Note.create({
            title: 'Loksewa GK & IQ Handout PDF',
            description: 'Comprehensive summary notes for Loksewa Aayog preparation.',
            fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            isPublished: true,
            chapter: ch_lok_geo._id,
            order: 1
        });

        console.log('All detailed Nepalese syllabus content seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};
