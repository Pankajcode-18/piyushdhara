require('dotenv').config();
const mongoose = require('mongoose');

const Student = require('./models/Student');
const User = require('./models/User');
const CommunityPost = require('./models/CommunityPost');
const CommunityAnswer = require('./models/CommunityAnswer');
const CommunityComment = require('./models/CommunityComment');
const CommunityReaction = require('./models/CommunityReaction');
const CommunityPollVote = require('./models/CommunityPollVote');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piyushdhara';
    console.log('Connecting to MongoDB for seeding community data...');
    await mongoose.connect(mongoUri);

    console.log('Clearing existing community posts, answers, and comments...');
    await CommunityPost.deleteMany({});
    await CommunityAnswer.deleteMany({});
    await CommunityComment.deleteMany({});
    await CommunityReaction.deleteMany({});
    await CommunityPollVote.deleteMany({});

    // 1. Create/Ensure Sample Students
    const sampleStudentsData = [
      {
        studentId: 'PD-STD-001',
        name: 'Aayush Sharma',
        email: 'aayush.sharma@piyushdhara.com',
        firebaseUID: 'seed_uid_aayush_001',
        photo: '/gaurov.jpeg',
        school: 'Pulchowk Campus, IOE',
        grade: 'B.E. Computer'
      },
      {
        studentId: 'PD-STD-002',
        name: 'Priya Adhikari',
        email: 'priya.adhikari@piyushdhara.com',
        firebaseUID: 'seed_uid_priya_002',
        photo: '',
        school: 'Kathmandu University',
        grade: 'B.Sc. CSIT'
      },
      {
        studentId: 'PD-STD-003',
        name: 'Rohan Shrestha',
        email: 'rohan.shrestha@piyushdhara.com',
        firebaseUID: 'seed_uid_rohan_003',
        photo: '',
        school: 'St. Xavier\'s College',
        grade: 'Grade 12 Physics'
      },
      {
        studentId: 'PD-STD-004',
        name: 'Sneha Karki',
        email: 'sneha.karki@piyushdhara.com',
        firebaseUID: 'seed_uid_sneha_004',
        photo: '',
        school: 'Patan Multiple Campus',
        grade: 'B.C.A.'
      }
    ];

    const students = [];
    for (const sData of sampleStudentsData) {
      let s = await Student.findOne({ email: sData.email });
      if (!s) {
        s = await Student.create(sData);
      }
      students.push(s);
    }

    const [aayush, priya, rohan, sneha] = students;

    console.log('Seeding sample Academic Doubts, Polls, and Discussions...');

    // ── SAMPLE POST 1: ACADEMIC DOUBT (React 18 Fiber & Virtual DOM) ─────────
    const doubt1 = await CommunityPost.create({
      postType: 'doubt',
      title: 'How does the Fiber Reconciler work in React 18 for concurrent rendering?',
      content: 'I am building a large-scale real-time dashboard and noticed performance hiccups when state updates occur frequently. Can someone explain how React 18 Fiber architecture prioritizes urgent updates (like typing in an input) over non-urgent updates (like filtering a 10,000 row table)? Code examples would be appreciated!',
      author: rohan._id,
      authorModel: 'Student',
      isAnonymous: false,
      category: 'Academic Doubts',
      subject: 'Computer Science / Coding',
      difficulty: 'Hard',
      tags: ['react', 'javascript', 'frontend', 'webdev', 'performance'],
      viewsCount: 142,
      trendingScore: 85,
      isFeatured: true
    });

    // Answer for Doubt 1
    const ans1 = await CommunityAnswer.create({
      post: doubt1._id,
      author: aayush._id,
      authorModel: 'Student',
      isAnonymous: false,
      content: 'React 18 Fiber breaks rendering work into incremental units called fibers. It uses two main concurrent features:\n1. useTransition Hook: Marks state updates as non-urgent transitions so React can interrupt them if user interactions occur.\n2. useDeferredValue Hook: Defers updating a non-critical UI part until main updates finish.\n\nHere is how you implement it:',
      codeSnippets: [{
        language: 'javascript',
        code: `import { useState, useTransition } from 'react';

function Dashboard() {
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState('');

  const handleChange = (e) => {
    // Urgent update: typing feedback
    const text = e.target.value;
    
    // Non-urgent update: filtering expensive dataset
    startTransition(() => {
      setFilter(text);
    });
  };

  return <input onChange={handleChange} />;
}`
      }],
      upvotes: [priya._id, rohan._id, sneha._id],
      netUpvotes: 3,
      isBestAnswer: true
    });

    doubt1.bestAnswer = ans1._id;
    doubt1.answersCount = 1;
    await doubt1.save();

    // ── SAMPLE POST 2: INTERACTIVE POLL (Programming Languages) ──────────────
    const poll1 = await CommunityPost.create({
      postType: 'poll',
      title: 'Which Programming Language should beginners focus on for IOE Entrance & Web Architecture in 2026?',
      content: 'Vote for your primary programming language recommendation for students entering tech and engineering programs in Nepal.',
      author: priya._id,
      authorModel: 'Student',
      isAnonymous: false,
      category: 'General Discussion',
      subject: 'Computer Science / Coding',
      difficulty: 'N/A',
      tags: ['poll', 'programming', 'career', 'coding'],
      poll: {
        question: 'Which Programming Language should beginners focus on?',
        options: [
          { optionId: 'opt_c_cpp', text: 'C / C++ (Foundations & IOE Curriculum)', votesCount: 28 },
          { optionId: 'opt_javascript', text: 'JavaScript / TypeScript (Full-Stack & React)', votesCount: 45 },
          { optionId: 'opt_python', text: 'Python (Data Science, AI & Automation)', votesCount: 32 },
          { optionId: 'opt_java', text: 'Java / Kotlin (Object Oriented & Android)', votesCount: 12 }
        ],
        durationDays: 7,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        allowMultiple: false,
        isAnonymous: false,
        isClosed: false,
        totalVotes: 117
      },
      viewsCount: 230,
      trendingScore: 120,
      isPinned: true
    });

    // ── SAMPLE POST 3: STUDY TIPS & NOTES (IOE Physics Roadmap) ──────────────
    const discussion1 = await CommunityPost.create({
      postType: 'discussion',
      title: 'Complete IOE Entrance Physics & Mathematics Preparation Roadmap (Score 80+ Marks)',
      content: 'Hello fellow engineers! After securing a top rank in the IOE Entrance Examination, I have compiled a comprehensive 60-day study strategy:\n\n1. Physics Mechanics & Thermodynamics: Focus 40% of time on Numerical Problem Solving in Rotational Motion and Wave Optics.\n2. Mathematics Calculus & Vectors: Master Derivatives, Definite Integration, and 3D Vector Geometry.\n3. Daily Mock Tests: Practice at least 1 timed quiz daily on PiyushDhara Quizzes section to build speed and accuracy.\n\nAttached below are my handwritten formula notes in PDF format. Feel free to ask any questions in comments!',
      author: aayush._id,
      authorModel: 'Student',
      isAnonymous: false,
      category: 'Study Tips & Notes',
      subject: 'Physics & Applied Mechanics',
      difficulty: 'Medium',
      tags: ['ioe', 'entrance', 'physics', 'notes', 'roadmap'],
      reactionsCount: { like: 12, love: 8, celebrate: 5, helpful: 14, appreciate: 9, funny: 0 },
      viewsCount: 310,
      trendingScore: 195,
      isFeatured: true
    });

    // Comments on Discussion 1
    const comm1 = await CommunityComment.create({
      targetType: 'post',
      targetId: discussion1._id,
      author: sneha._id,
      authorModel: 'Student',
      isAnonymous: false,
      content: 'This roadmap is super clear! How many hours per day did you dedicate to solving vector calculus problems?',
      reactionsCount: { like: 4 }
    });

    await CommunityComment.create({
      targetType: 'post',
      targetId: discussion1._id,
      parentId: comm1._id,
      depth: 1,
      author: aayush._id,
      authorModel: 'Student',
      isAnonymous: false,
      content: 'I spent around 2.5 hours every morning specifically on Calculus problem sets before moving to Physics numericals!',
      reactionsCount: { appreciate: 3 }
    });

    // ── SAMPLE POST 4: INTERNSHIP EXPERIENCE (Placement & Career) ────────────
    const discussion2 = await CommunityPost.create({
      postType: 'discussion',
      title: 'My Journey Securing a Full-Stack Developer Internship: Key Lessons & Interview Questions',
      content: 'Sharing my recent interview experience for a Remote Software Engineer Internship:\n\nRound 1 (DSA & Problem Solving): 2 LeetCode Medium questions on Array Manipulation and HashMaps.\nRound 2 (System Architecture): Explain REST API authentication, JWT token refresh cycles, and MongoDB schema design.\nRound 3 (Behavioral & HR): Discussing teamwork, conflict resolution, and project portfolio.\n\nKey Takeaway: Build 2 solid full-stack projects using React and Node.js rather than 10 tutorial clones!',
      author: sneha._id,
      authorModel: 'Student',
      isAnonymous: false,
      category: 'Placement & Internships',
      subject: 'Computer Science / Coding',
      difficulty: 'Medium',
      tags: ['internship', 'interview', 'webdev', 'fullstack', 'career'],
      reactionsCount: { like: 15, love: 11, celebrate: 8, helpful: 18, appreciate: 7, funny: 1 },
      viewsCount: 280,
      trendingScore: 160
    });

    // ── SAMPLE POST 5: INTERACTIVE POLL (Daily Study Hours) ──────────────────
    const poll2 = await CommunityPost.create({
      postType: 'poll',
      title: 'How many hours of daily self-study are you dedicating for upcoming examinations?',
      content: 'Vote for your average daily self-study routine outside of regular college lectures.',
      author: rohan._id,
      authorModel: 'Student',
      isAnonymous: false,
      category: 'General Discussion',
      subject: 'General',
      tags: ['poll', 'studyhabits', 'routine'],
      poll: {
        question: 'Daily self-study hours outside college:',
        options: [
          { optionId: 'opt_2_4', text: '2 to 4 Hours (Consistent Daily Review)', votesCount: 18 },
          { optionId: 'opt_4_6', text: '4 to 6 Hours (Standard Exam Prep)', votesCount: 38 },
          { optionId: 'opt_6_8', text: '6 to 8 Hours (Intensive Entrance Prep)', votesCount: 26 },
          { optionId: 'opt_8_plus', text: '8+ Hours (Full-Time Grind)', votesCount: 14 }
        ],
        durationDays: 7,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        allowMultiple: false,
        isAnonymous: false,
        isClosed: false,
        totalVotes: 96
      },
      viewsCount: 185,
      trendingScore: 90
    });

    console.log('✅ Community Hub sample data seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding community data:', error);
    process.exit(1);
  }
};

seedData();
