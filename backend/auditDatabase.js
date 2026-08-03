require('dotenv').config();
const mongoose = require('mongoose');

// Import Models
const Student = require('./models/Student');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Course = require('./models/Course');
const Chapter = require('./models/Chapter');
const Video = require('./models/Video');
const Enrollment = require('./models/Enrollment');
const Note = require('./models/Note');
const Certification = require('./models/Certification');
const CertModule = require('./models/CertModule');
const CertLesson = require('./models/CertLesson');
const CertProgress = require('./models/CertProgress');
const Certificate = require('./models/Certificate');
const CertSubmission = require('./models/CertSubmission');
const Quiz = require('./models/Quiz');
const QuizSubmission = require('./models/QuizSubmission');
const ExamSecurityLog = require('./models/ExamSecurityLog');
const CommunityPost = require('./models/CommunityPost');
const CommunityAnswer = require('./models/CommunityAnswer');
const CommunityComment = require('./models/CommunityComment');
const CommunityReaction = require('./models/CommunityReaction');
const CommunityPollVote = require('./models/CommunityPollVote');
const CommunitySavedPost = require('./models/CommunitySavedPost');
const CommunityNotification = require('./models/CommunityNotification');
const Feedback = require('./models/Feedback');
const PlatformConfig = require('./models/PlatformConfig');

const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/piyushdhara';
const fallbackUri = 'mongodb://127.0.0.1:27017/piyushdhara';

async function runAudit() {
  console.log('🔍 Starting Full MongoDB & Feature Integration Audit...\n');

  let activeUri = primaryUri;
  let connectedDB = 'Atlas Cloud';

  try {
    await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB Cloud Atlas successfully!');
  } catch (err) {
    console.warn('⚠️ Atlas connection timed out/failed, switching to Local MongoDB:', err.message);
    activeUri = fallbackUri;
    connectedDB = 'Local MongoDB';
    await mongoose.connect(fallbackUri);
    console.log('✅ Connected to Local MongoDB successfully!');
  }

  console.log(`\n📊 DATABASE MODEL AUDIT REPORT [${connectedDB}]:`);
  console.log('=' .repeat(55));

  const collections = [
    { name: 'Students', model: Student },
    { name: 'Users (Admin)', model: User },
    { name: 'Teachers', model: Teacher },
    { name: 'Courses / Batches', model: Course },
    { name: 'Chapters', model: Chapter },
    { name: 'Videos', model: Video },
    { name: 'Enrollments', model: Enrollment },
    { name: 'Free Notes & PDFs', model: Note },
    { name: 'Certifications', model: Certification },
    { name: 'Cert Modules', model: CertModule },
    { name: 'Cert Lessons', model: CertLesson },
    { name: 'Cert Progress Records', model: CertProgress },
    { name: 'Issued Certificates', model: Certificate },
    { name: 'Cert Submissions', model: CertSubmission },
    { name: 'Quizzes & Exams', model: Quiz },
    { name: 'Quiz Submissions', model: QuizSubmission },
    { name: 'Exam Security Logs', model: ExamSecurityLog },
    { name: 'Community Posts (Doubts/Polls)', model: CommunityPost },
    { name: 'Community Answers', model: CommunityAnswer },
    { name: 'Community Comments', model: CommunityComment },
    { name: 'Community Reactions', model: CommunityReaction },
    { name: 'Community Poll Votes', model: CommunityPollVote },
    { name: 'Community Saved Posts', model: CommunitySavedPost },
    { name: 'Community Notifications', model: CommunityNotification },
    { name: 'Feedbacks & Support', model: Feedback },
    { name: 'Platform Config', model: PlatformConfig },
  ];

  let totalRecords = 0;
  for (const item of collections) {
    try {
      const count = await item.model.countDocuments();
      totalRecords += count;
      const statusIcon = count > 0 ? '🟢' : '⚪';
      console.log(`${statusIcon} ${item.name.padEnd(30)} : ${count} documents stored`);
    } catch (e) {
      console.log(`🔴 ${item.name.padEnd(30)} : Error (${e.message})`);
    }
  }

  console.log('=' .repeat(55));
  console.log(`✨ TOTAL STORED DOCUMENTS ACROSS ALL COLLECTIONS: ${totalRecords}\n`);

  // Verify write test (storing data)
  console.log('🧪 Testing Live Data Store Operation (Write Test)...');
  try {
    const testLog = await ExamSecurityLog.create({
      userId: new mongoose.Types.ObjectId(),
      studentEmail: 'system_audit@piyushdhara.com',
      userEmail: 'system_audit@piyushdhara.com',
      userName: 'System Integration Audit',
      userRole: 'student',
      examId: new mongoose.Types.ObjectId(),
      attemptId: new mongoose.Types.ObjectId(),
      examTitle: 'System Audit Check',
      examType: 'Quiz',
      eventType: 'tab_switch',
      eventSeverity: 'low',
      details: 'Automated integration check'
    });
    console.log('✅ Write Test Passed! Created & Stored ExamSecurityLog ID:', testLog._id);
    await ExamSecurityLog.deleteOne({ _id: testLog._id });
    console.log('✅ Cleanup Passed! Deleted test audit record.');
  } catch (writeErr) {
    console.error('❌ Write Test Failed:', writeErr.message);
  }

  await mongoose.disconnect();
  console.log('\n🏁 Audit Finished Successfully!');
  process.exit(0);
}

runAudit();
