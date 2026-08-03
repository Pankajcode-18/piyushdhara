require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('./models/Quiz');
const QuizSubmission = require('./models/QuizSubmission');

const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piyushdhara';

async function seedQuizzes() {
  try {
    await mongoose.connect(mongoUri);
    console.log('🌱 Connected to MongoDB for Quiz Seeding...');

    // Clear existing sample quizzes
    await Quiz.deleteMany({});
    await QuizSubmission.deleteMany({});
    console.log('🗑️ Cleared existing quiz data & submissions.');

    // 1. WEEKLY QUIZ
    const weeklyQuiz = await Quiz.create({
      title: 'Weekly Quiz #1: Modern HTML5 & Web Fundamentals',
      slug: 'weekly-quiz-1-modern-html5-web-fundamentals',
      description: 'Test your understanding of HTML5 semantic tags, document boilerplate, meta tags, and web accessibility standards.',
      instructions: 'This is a timed weekly assessment. Answer all 5 questions. Each correct answer carries 10 points. Auto-submission will trigger when the 15-minute timer expires.',
      type: 'weekly',
      category: 'Web Development',
      subject: 'Computer Science',
      difficulty: 'Beginner',
      durationMinutes: 15,
      attemptsAllowed: 'unlimited',
      passingPercentage: 70,
      settings: {
        randomizeQuestions: true,
        showTimer: true,
        showScoreImmediately: true,
        showAnswersPostQuiz: true,
        showLeaderboard: true,
        detectTabSwitch: true,
        disableCopyPaste: true
      },
      questions: [
        {
          questionText: 'What is the primary function of the <!DOCTYPE html> declaration at the top of a document?',
          type: 'mcq_single',
          options: [
            'Instructs the browser to render the document using standard HTML5 specification',
            'Connects the webpage to a backend database server',
            'Sets the background color of the webpage',
            'It is obsolete and optional in modern web browsers'
          ],
          correctAnswers: ['Instructs the browser to render the document using standard HTML5 specification'],
          explanation: '<!DOCTYPE html> forces modern browsers into standards mode rather than quirks mode.',
          points: 10
        },
        {
          questionText: 'Which HTML5 element represents self-contained content intended to be independently reusable or distributable (e.g. blog post)?',
          type: 'mcq_single',
          options: ['<article>', '<section>', '<div>', '<aside>'],
          correctAnswers: ['<article>'],
          explanation: '<article> is designed for standalone content that makes sense on its own.',
          points: 10
        },
        {
          questionText: 'Which attribute provides alternate textual descriptions for screen readers and when images fail to load?',
          type: 'mcq_single',
          options: ['alt', 'title', 'src', 'desc'],
          correctAnswers: ['alt'],
          explanation: 'The alt attribute is mandatory for web accessibility (a11y).',
          points: 10
        },
        {
          questionText: 'True or False: The <head> section of an HTML document contains visible page elements rendered in the browser viewport.',
          type: 'true_false',
          options: ['True', 'False'],
          correctAnswers: ['False'],
          explanation: 'The <head> section contains document metadata, titles, scripts, and stylesheets. Visible elements belong inside <body>.',
          points: 10
        },
        {
          questionText: 'Select ALL native HTML5 form input types from the options below:',
          type: 'mcq_multi',
          options: ['email', 'color', 'number', 'database'],
          correctAnswers: ['email', 'color', 'number'],
          explanation: 'email, color, and number are native HTML5 input types.',
          points: 10
        }
      ],
      status: 'published'
    });

    // 2. MONTHLY MOCK TEST
    const mockTest = await Quiz.create({
      title: 'Monthly Grand Mock Test: Full-Stack Web Architecture',
      slug: 'monthly-grand-mock-test-full-stack-web-architecture',
      description: 'Comprehensive competitive examination covering HTML5, CSS3, JavaScript ES6+, MERN Stack, and Web Security.',
      instructions: 'This high-stakes mock examination contains 5 questions with negative marking (-2 for incorrect answers). Tab switching will trigger anti-cheating warnings.',
      type: 'mock',
      category: 'Competitive Exams',
      subject: 'Computer Science',
      difficulty: 'Intermediate',
      durationMinutes: 30,
      attemptsAllowed: 'one',
      maxAttempts: 1,
      passingPercentage: 70,
      settings: {
        randomizeQuestions: true,
        showTimer: true,
        showScoreImmediately: true,
        showAnswersPostQuiz: true,
        showLeaderboard: true,
        detectTabSwitch: true,
        maxTabSwitchesAllowed: 2,
        disableCopyPaste: true,
        enableNegativeMarking: true
      },
      questions: [
        {
          questionText: 'Which HTTP status code signifies that a requested resource was successfully created on the server?',
          type: 'mcq_single',
          options: ['201 Created', '200 OK', '304 Not Modified', '404 Not Found'],
          correctAnswers: ['201 Created'],
          explanation: '201 Created is the standard HTTP success status code for resource creation.',
          points: 20,
          negativePoints: 5
        },
        {
          questionText: 'In JavaScript ES6, what is the key difference between const and let?',
          type: 'mcq_single',
          options: [
            'const identifiers cannot be reassigned after initialization, whereas let identifiers can be reassigned',
            'const is function-scoped while let is block-scoped',
            'let creates immutable constants while const creates global variables',
            'There is no functional difference between const and let'
          ],
          correctAnswers: ['const identifiers cannot be reassigned after initialization, whereas let identifiers can be reassigned'],
          explanation: 'const prevents variable re-assignment; let permits re-assignment.',
          points: 20,
          negativePoints: 5
        },
        {
          questionText: 'Which Web API object stores key-value data persistently in the browser even after restarting the computer?',
          type: 'mcq_single',
          options: ['localStorage', 'sessionStorage', 'cookieStorage', 'tempStorage'],
          correctAnswers: ['localStorage'],
          explanation: 'localStorage persists until explicitly cleared by the user or script.',
          points: 20,
          negativePoints: 5
        },
        {
          questionText: 'What does CSS Box Model consist of? (Order from inside out)',
          type: 'mcq_single',
          options: [
            'Content, Padding, Border, Margin',
            'Content, Margin, Border, Padding',
            'Padding, Border, Content, Margin',
            'Margin, Padding, Content, Border'
          ],
          correctAnswers: ['Content, Padding, Border, Margin'],
          explanation: 'The box model layers from inside out: Content -> Padding -> Border -> Margin.',
          points: 20,
          negativePoints: 5
        },
        {
          questionText: 'Which HTTP header provides protection against Cross-Site Scripting (XSS) attacks in modern web applications?',
          type: 'mcq_single',
          options: [
            'Content-Security-Policy',
            'Access-Control-Allow-Origin',
            'Cache-Control',
            'Strict-Transport-Security'
          ],
          correctAnswers: ['Content-Security-Policy'],
          explanation: 'Content-Security-Policy restricts trusted executable script sources.',
          points: 20,
          negativePoints: 5
        }
      ],
      status: 'published'
    });

    // 3. PRACTICAL CODING ASSIGNMENT
    const codingAssignment = await Quiz.create({
      title: 'Practical Assignment: Responsive Registration Form with HTML5 Validation',
      slug: 'practical-assignment-responsive-registration-form',
      description: 'Hands-on practical code submission. Build a user registration form containing inputs for Full Name, Email, Password, Gender, and Course Selection.',
      instructions: 'Write clean HTML5 code inside the interactive editor. Make sure to use appropriate label elements, input types, and required validation attributes.',
      type: 'assignment',
      category: 'Web Development',
      subject: 'Practical Coding',
      difficulty: 'Intermediate',
      durationMinutes: 45,
      attemptsAllowed: 'unlimited',
      passingPercentage: 70,
      settings: {
        showTimer: true,
        showScoreImmediately: false,
        showAnswersPostQuiz: false,
        showLeaderboard: false
      },
      assignmentDetails: {
        maxMarks: 100,
        rubricNotes: 'Graded on: 1. Proper semantic tags (20%), 2. Explicit label associations (20%), 3. Native validation (30%), 4. Code cleanliness (30%).'
      },
      questions: [
        {
          questionText: 'Write the complete HTML code for a user registration form with Full Name, Email, Password, Gender (radio), Course (select), and Submit button.',
          type: 'code',
          codeLanguage: 'html',
          codeSnippet: `<!-- Write your HTML form submission below -->\n<form action="/api/register" method="POST">\n\n</form>`,
          explanation: 'Standard registration form template with input validation.',
          points: 100
        }
      ],
      status: 'published'
    });

    // Seed Sample Leaderboard Submissions
    const sampleStudents = [
      { email: 'baduwalpankaj@gmail.com', name: 'Er. Pankaj Baduwal', score: 50, pct: 100, time: 240, passed: true },
      { email: 'rohan.shrestha@gmail.com', name: 'Rohan Shrestha', score: 40, pct: 80, time: 310, passed: true },
      { email: 'smarika.karki@gmail.com', name: 'Smarika Karki', score: 40, pct: 80, time: 380, passed: true },
      { email: 'anup.thapa@gmail.com', name: 'Anup Thapa', score: 30, pct: 60, time: 420, passed: false }
    ];

    for (let idx = 0; idx < sampleStudents.length; idx++) {
      const s = sampleStudents[idx];
      await QuizSubmission.create({
        submissionId: `SUB-SAMPLE-${idx + 1}`,
        quizId: weeklyQuiz._id,
        quizTitle: weeklyQuiz.title,
        quizType: weeklyQuiz.type,
        studentEmail: s.email,
        studentName: s.name,
        answers: [],
        totalQuestions: 5,
        correctCount: s.pct / 20,
        incorrectCount: 5 - (s.pct / 20),
        unansweredCount: 0,
        totalMarks: 50,
        scoreObtained: s.score,
        percentage: s.pct,
        grade: s.pct >= 90 ? 'A+' : s.pct >= 80 ? 'A' : s.pct >= 70 ? 'B' : s.pct >= 60 ? 'C' : 'F',
        passed: s.passed,
        timeTakenSeconds: s.time,
        attemptNumber: 1,
        evaluationStatus: 'auto_graded'
      });
    }

    console.log('🎉 Sample Quizzes & Leaderboard Submissions seeded successfully!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Quiz Seeding Error:', err);
    process.exit(1);
  }
}

seedQuizzes();
