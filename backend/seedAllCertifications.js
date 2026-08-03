require('dotenv').config();
const mongoose = require('mongoose');
const Certification = require('./models/Certification');
const CertModule = require('./models/CertModule');
const CertLesson = require('./models/CertLesson');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piyushdhara';

const extraCertifications = [
  {
    title: 'CSS3 & Modern Responsive Layouts (Flexbox, Grid & Tailored Animations)',
    subtitle: 'Master CSS3 Flexbox, CSS Grid, Custom Properties, Responsive Design & Performance Keyframe Animations',
    slug: 'css3-modern-responsive-layouts',
    description: 'Learn modern CSS from foundational selectors to advanced CSS Grid, Flexbox, custom properties, responsive breakpoints, fluid typography, glassmorphic UI design, and GPU-accelerated keyframe animations.',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    category: 'Web Development',
    difficulty: 'Intermediate',
    estimatedDuration: '18 Hours',
    language: 'English & Nepali',
    instructor: {
      name: 'Pankaj Baduwal',
      designation: 'Lead Educator & Engineer',
      photo: '/pankaj-baduwal.jpg',
      bio: 'Lead computer science educator and engineer at PiyushDhara Prep Portal.'
    },
    prerequisites: [
      'Basic knowledge of HTML tags and structure.',
      'A text editor like VS Code installed on your computer.'
    ],
    learningOutcomes: [
      'Master CSS selectors, specificity, inheritance, and the cascade engine',
      'Build responsive layouts using CSS Flexbox and CSS Grid layout algorithms',
      'Design fluid UI typography and container queries across mobile, tablet, and desktop',
      'Utilize CSS Custom Properties (CSS Variables) for clean theme switching',
      'Create high-performance GPU-accelerated micro-interactions & CSS keyframe animations'
    ],
    skillsGained: ['CSS3', 'CSS Flexbox', 'CSS Grid', 'Responsive Design', 'Web Animations', 'UI/UX Styling'],
    status: 'published',
    enrolledCount: 1420,
    rating: 4.9,
    reviewsCount: 94,
    finalExam: {
      title: 'CSS3 Certification Assessment',
      instructions: 'Complete all 10 questions. Minimum 70% required to pass.',
      timeLimitMinutes: 20,
      questions: [
        {
          questionText: 'Which CSS Grid property specifies equal column widths across a container?',
          type: 'mcq',
          options: ['grid-template-columns: repeat(3, 1fr);', 'grid-columns: 1fr 1fr 1fr;', 'display: flex-grid;', 'grid-auto-flow: columns;'],
          correctAnswers: ['grid-template-columns: repeat(3, 1fr);'],
          explanation: 'The repeat(3, 1fr) CSS Grid function creates 3 equal flexible columns.',
          points: 10
        },
        {
          questionText: 'Which property moves an element to a hardware-accelerated layer for smooth animations?',
          type: 'mcq',
          options: ['transform: translate3d(0,0,0);', 'margin-left: 10px;', 'position: absolute;', 'float: left;'],
          correctAnswers: ['transform: translate3d(0,0,0);'],
          explanation: '3D transforms trigger GPU acceleration layer creation in modern browser rendering engines.',
          points: 10
        }
      ]
    }
  },
  {
    title: 'JavaScript Engine & Modern ES6+ Architecture Mastery',
    subtitle: 'Deep-dive into Event Loops, Closures, Promises, Async/Await, Prototypes & Functional JS',
    slug: 'javascript-engine-es6-architecture',
    description: 'Master the JavaScript programming language from fundamentals to deep internal concepts: V8 execution context, call stack, event loop, closures, prototypal inheritance, ES6+ modules, Promises, async/await, and DOM manipulation.',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    category: 'Programming',
    difficulty: 'Intermediate',
    estimatedDuration: '30 Hours',
    language: 'English & Nepali',
    instructor: {
      name: 'Pankaj Baduwal',
      designation: 'Lead Educator & Engineer',
      photo: '/pankaj-baduwal.jpg',
      bio: 'Lead computer science educator and engineer at PiyushDhara Prep Portal.'
    },
    prerequisites: [
      'Basic HTML & CSS knowledge.',
      'Understanding of basic programming constructs (variables, conditionals, loops).'
    ],
    learningOutcomes: [
      'Understand how the JS engine (V8) parses, compiles, and executes code',
      'Master Closures, Lexical Scope, Hoisting, and the `this` keyword binding rules',
      'Handle asynchronous programming cleanly using Promises, Async/Await, and Fetch API',
      'Implement object-oriented programming with ES6 classes and prototypal chain',
      'Manage browser DOM events, bubbling, capturing, and delegation techniques'
    ],
    skillsGained: ['JavaScript ES6+', 'Asynchronous JS', 'Promises & Async/Await', 'DOM API', 'V8 Engine Internals', 'OOP in JS'],
    status: 'published',
    enrolledCount: 2350,
    rating: 4.9,
    reviewsCount: 210,
    finalExam: {
      title: 'JavaScript Professional Certification Exam',
      instructions: 'Complete all questions within 30 minutes. Passing score is 70%.',
      timeLimitMinutes: 30,
      questions: [
        {
          questionText: 'What is the output of `console.log(typeof typeof 1)` in JavaScript?',
          type: 'mcq',
          options: ['"string"', '"number"', '"undefined"', '"object"'],
          correctAnswers: ['"string"'],
          explanation: '`typeof 1` evaluates to `"number"`. Then `typeof "number"` evaluates to `"string"`.',
          points: 10
        },
        {
          questionText: 'Which microtask queue priority handles resolved Promises in the JS Event Loop?',
          type: 'mcq',
          options: ['Microtask Queue', 'Macrotask Queue', 'Timer Queue', 'Render Queue'],
          correctAnswers: ['Microtask Queue'],
          explanation: 'Promise callbacks (.then/catch/finally and async/await) execute in the Microtask Queue before the next Macrotask tick.',
          points: 10
        }
      ]
    }
  },
  {
    title: 'React.js 18 & Full-Stack Web Application Architecture',
    subtitle: 'Build Scalable Web Apps with React Hooks, Context API, Redux Toolkit, React Router & SSR',
    slug: 'reactjs-18-fullstack-architecture',
    description: 'Learn modern React.js from ground up: JSX syntax, component lifecycle, custom hooks, state management with Context & Redux Toolkit, routing, performance optimization with useMemo/useCallback, Fiber reconciler, and API integrations.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    category: 'Web Development',
    difficulty: 'Advanced',
    estimatedDuration: '32 Hours',
    language: 'English & Nepali',
    instructor: {
      name: 'Pankaj Baduwal',
      designation: 'Lead Educator & Engineer',
      photo: '/pankaj-baduwal.jpg',
      bio: 'Lead computer science educator and engineer at PiyushDhara Prep Portal.'
    },
    prerequisites: [
      'Strong understanding of JavaScript ES6+ (Arrow functions, Destructuring, Promises, Array methods).'
    ],
    learningOutcomes: [
      'Master React 18 Concurrent rendering, useTransition, and useDeferredValue hooks',
      'Architect modular components using functional patterns and custom hooks',
      'Manage global state with Context API and Redux Toolkit slices',
      'Implement secure client-side routing with React Router v6 loader & action pipelines',
      'Optimize React performance using Memoization, lazy loading, and Virtual DOM profiling'
    ],
    skillsGained: ['React.js 18', 'React Hooks', 'Redux Toolkit', 'React Router v6', 'State Management', 'Frontend Architecture'],
    status: 'published',
    enrolledCount: 1890,
    rating: 5.0,
    reviewsCount: 175,
    finalExam: {
      title: 'React.js Professional Certification Assessment',
      instructions: 'Complete all questions. Minimum 70% required to issue your certificate.',
      timeLimitMinutes: 25,
      questions: [
        {
          questionText: 'What key benefit does React 18 Concurrent Rendering provide?',
          type: 'mcq',
          options: [
            'Allows rendering to be paused and resumed to keep UI responsive during heavy state updates',
            'Replaces HTML DOM entirely with Canvas elements',
            'Disables state updates when user scrolls',
            'Enforces class components over functional components'
          ],
          correctAnswers: ['Allows rendering to be paused and resumed to keep UI responsive during heavy state updates'],
          explanation: 'Concurrent Mode allows React to interrupt urgent updates (like typing in an input) over non-urgent background render passes.',
          points: 10
        }
      ]
    }
  },
  {
    title: 'Python Programming & Data Structures Certification',
    subtitle: 'From Fundamentals to Object-Oriented Programming, File Handling & Algorithmic Problem Solving',
    slug: 'python-programming-data-structures',
    description: 'Master Python 3 from core syntax to data structures (Lists, Tuples, Dictionaries, Sets, Stacks, Queues), Object-Oriented Programming (OOP), exception handling, file I/O operations, and algorithmic efficiency (Big-O analysis).',
    thumbnail: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?auto=format&fit=crop&w=800&q=80',
    banner: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    category: 'Programming',
    difficulty: 'Beginner',
    estimatedDuration: '26 Hours',
    language: 'English & Nepali',
    instructor: {
      name: 'Pankaj Baduwal',
      designation: 'Lead Educator & Engineer',
      photo: '/pankaj-baduwal.jpg',
      bio: 'Lead computer science educator and engineer at PiyushDhara Prep Portal.'
    },
    prerequisites: [
      'No prior programming knowledge required.',
      'Basic math skills and computer operation abilities.'
    ],
    learningOutcomes: [
      'Write clean, idiomatic Python code adhering to PEP 8 standards',
      'Utilize built-in data structures: lists, tuples, dictionaries, sets, and comprehensions',
      'Implement Object-Oriented Programming (Classes, Inheritance, Encapsulation, Polymorphism)',
      'Perform file reading/writing, JSON processing, and exception handling',
      'Solve algorithmic puzzles using recursion, sorting, and searching algorithms'
    ],
    skillsGained: ['Python 3', 'Data Structures', 'OOP in Python', 'Algorithms', 'File Handling', 'Problem Solving'],
    status: 'published',
    enrolledCount: 3100,
    rating: 4.9,
    reviewsCount: 260,
    finalExam: {
      title: 'Python Certification Examination',
      instructions: 'Complete all questions. Passing score is 70%.',
      timeLimitMinutes: 25,
      questions: [
        {
          questionText: 'What is the time complexity of looking up a key in a Python dictionary?',
          type: 'mcq',
          options: ['O(1) Average', 'O(N) Average', 'O(N log N)', 'O(N^2)'],
          correctAnswers: ['O(1) Average'],
          explanation: 'Python dictionaries are implemented as hash tables, providing O(1) average time complexity for key lookups.',
          points: 10
        }
      ]
    }
  }
];

async function seedAll() {
  try {
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for seeding extra certification courses...');

    for (const certData of extraCertifications) {
      let existing = await Certification.findOne({ slug: certData.slug });
      if (!existing) {
        const createdCert = await Certification.create(certData);
        console.log(`✅ Created Certification: ${createdCert.title}`);

        // Create sample module
        const createdModule = await CertModule.create({
          certificationId: createdCert._id,
          title: `Module 1: Fundamentals of ${createdCert.title.split(' ')[0]}`,
          description: `Core concepts and foundational principles for ${createdCert.title}.`,
          order: 1
        });

        // Create sample lesson
        await CertLesson.create({
          certificationId: createdCert._id,
          moduleId: createdModule._id,
          title: `Lesson 1.1: Getting Started with ${createdCert.title.split(' ')[0]}`,
          contentType: 'video',
          contentHtml: `<p>Welcome to <strong>${createdCert.title}</strong>. In this module, we will explore the fundamental concepts, prerequisites, and real-world application architectures.</p>`,
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          durationMinutes: 15,
          textSummary: `Welcome to ${createdCert.title}. In this lesson, we cover the core concepts, prerequisites, and development setup required to master this course.`,
          order: 1
        });
      } else {
        console.log(`ℹ️ Certification already exists: ${existing.title}`);
      }
    }

    console.log('🎉 Certification catalog seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding certification catalog:', err);
    process.exit(1);
  }
}

seedAll();
