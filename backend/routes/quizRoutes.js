const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizSubmission = require('../models/QuizSubmission');
const crypto = require('crypto');

// Helper to generate unique submission ID
const generateSubmissionId = () => `SUB-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

// ── 1. GET ALL PUBLISHED QUIZZES (For Students) ────────────────
router.get('/', async (req, res) => {
  try {
    const { category, type, difficulty, studentEmail } = req.query;
    let query = { status: 'published' };

    if (category && category !== 'All') query.category = category;
    if (type && type !== 'All') query.type = type;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;

    const quizzes = await Quiz.find(query).sort({ createdAt: -1 });

    // Attach student attempt counts if email provided
    let quizList = quizzes.map(q => q.toObject());

    if (studentEmail) {
      const submissions = await QuizSubmission.find({ studentEmail: studentEmail.toLowerCase() });
      quizList = quizList.map(quiz => {
        const userSubs = submissions.filter(s => s.quizId && s.quizId.toString() === quiz._id.toString());
        const totalAttempts = userSubs.length;
        const bestSubmission = userSubs.sort((a, b) => b.scoreObtained - a.scoreObtained)[0];
        
        return {
          ...quiz,
          questionsCount: quiz.questions ? quiz.questions.length : 0,
          questions: undefined, // Hide questions from marketplace list
          userStats: {
            attemptsUsed: totalAttempts,
            isCompleted: totalAttempts > 0,
            bestScore: bestSubmission ? bestSubmission.scoreObtained : 0,
            bestPercentage: bestSubmission ? bestSubmission.percentage : 0,
            passed: bestSubmission ? bestSubmission.passed : false,
            latestSubmissionId: bestSubmission ? bestSubmission.submissionId : null
          }
        };
      });
    } else {
      quizList = quizList.map(quiz => ({
        ...quiz,
        questionsCount: quiz.questions ? quiz.questions.length : 0,
        questions: undefined
      }));
    }

    res.json({ success: true, quizzes: quizList });
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ success: false, message: 'Server error fetching quizzes' });
  }
});

// ── 2. GET SINGLE QUIZ OVERVIEW (By ID or Slug) ───────────────
router.get('/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    const { studentEmail } = req.query;

    const isObjectId = slugOrId.match(/^[0-9a-fA-F]{24}$/);
    const quiz = await (isObjectId ? Quiz.findById(slugOrId) : Quiz.findOne({ slug: slugOrId }));

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const quizObj = quiz.toObject();
    quizObj.totalQuestions = quiz.questions ? quiz.questions.length : 0;
    quizObj.totalMarks = quiz.questions ? quiz.questions.reduce((acc, q) => acc + (q.points || 5), 0) : 0;
    quizObj.questions = undefined; // Don't expose questions on overview page

    let userStats = null;
    if (studentEmail) {
      const subs = await QuizSubmission.find({ 
        quizId: quiz._id, 
        studentEmail: studentEmail.toLowerCase() 
      }).sort({ createdAt: -1 });

      const bestSub = [...subs].sort((a, b) => b.scoreObtained - a.scoreObtained)[0];

      userStats = {
        attemptsUsed: subs.length,
        attemptsRemaining: quiz.attemptsAllowed === 'unlimited' ? 'Unlimited' : Math.max(0, quiz.maxAttempts - subs.length),
        canTake: quiz.attemptsAllowed === 'unlimited' || subs.length < quiz.maxAttempts,
        submissions: subs.map(s => ({
          submissionId: s.submissionId,
          scoreObtained: s.scoreObtained,
          totalMarks: s.totalMarks,
          percentage: s.percentage,
          passed: s.passed,
          createdAt: s.createdAt
        })),
        bestSubmissionId: bestSub ? bestSub.submissionId : null
      };
    }

    res.json({ success: true, quiz: quizObj, userStats });
  } catch (err) {
    console.error('Error fetching quiz details:', err);
    res.status(500).json({ success: false, message: 'Server error fetching quiz' });
  }
});

// ── 3. START QUIZ ATTEMPT (Returns Questions Without Answers) ───
router.post('/:id/start', async (req, res) => {
  try {
    const { id } = req.params;
    const { studentEmail, studentName } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ success: false, message: 'Student email is required to start quiz' });
    }

    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const quiz = await (isObjectId ? Quiz.findById(id) : Quiz.findOne({ slug: id }));
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    if (quiz.status !== 'published') {
      return res.status(403).json({ success: false, message: 'This quiz is not currently published' });
    }

    // Check scheduling locks
    const now = new Date();
    if (quiz.startDate && new Date(quiz.startDate) > now) {
      return res.status(403).json({ success: false, message: `Quiz is scheduled to open on ${new Date(quiz.startDate).toLocaleString()}` });
    }
    if (quiz.endDate && new Date(quiz.endDate) < now) {
      return res.status(403).json({ success: false, message: 'Quiz submission deadline has expired' });
    }

    // Check attempts limit
    const existingSubs = await QuizSubmission.find({ 
      quizId: quiz._id, 
      studentEmail: studentEmail.toLowerCase() 
    });

    if (quiz.attemptsAllowed !== 'unlimited' && existingSubs.length >= quiz.maxAttempts) {
      return res.status(403).json({ success: false, message: `Maximum attempt limit reached (${quiz.maxAttempts} attempts allowed)` });
    }

    // Prepare questions for exam (hide correct answers & explanations)
    let safeQuestions = quiz.questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      type: q.type,
      options: q.options,
      points: q.points || 5,
      codeSnippet: q.codeSnippet,
      codeLanguage: q.codeLanguage,
      image: q.image
    }));

    if (quiz.settings && quiz.settings.randomizeQuestions) {
      safeQuestions = safeQuestions.sort(() => Math.random() - 0.5);
    }

    res.json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        type: quiz.type,
        instructions: quiz.instructions,
        durationMinutes: quiz.durationMinutes,
        settings: quiz.settings,
        totalQuestions: safeQuestions.length,
        totalMarks: safeQuestions.reduce((acc, q) => acc + q.points, 0),
        questions: safeQuestions,
        attemptNumber: existingSubs.length + 1
      }
    });

  } catch (err) {
    console.error('Error starting quiz:', err);
    res.status(500).json({ success: false, message: 'Server error starting quiz' });
  }
});

// ── 4. SUBMIT QUIZ & AUTO-GRADE ─────────────────────────────────
router.post('/:id/submit', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      studentEmail, 
      studentName, 
      answers, 
      timeTakenSeconds, 
      tabSwitchesCount, 
      copyPasteAttempts, 
      autoSubmittedOnTimeout 
    } = req.body;

    if (!studentEmail || !studentName) {
      return res.status(400).json({ success: false, message: 'Student information missing' });
    }

    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const quiz = await (isObjectId ? Quiz.findById(id) : Quiz.findOne({ slug: id }));
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    const existingSubs = await QuizSubmission.find({ quizId: quiz._id, studentEmail: studentEmail.toLowerCase() });
    const attemptNumber = existingSubs.length + 1;

    let scoreObtained = 0;
    let totalMarks = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let needsManualReview = false;

    const processedAnswers = quiz.questions.map(q => {
      const qIdStr = q._id.toString();
      const userAns = (answers && answers[qIdStr]) ? answers[qIdStr] : null;
      
      const maxPoints = q.points || 5;
      totalMarks += maxPoints;

      if (!userAns || (Array.isArray(userAns.selectedOptions) && userAns.selectedOptions.length === 0 && !userAns.textAnswer && !userAns.codeAnswer)) {
        unansweredCount++;
        return {
          questionId: qIdStr,
          selectedOptions: [],
          textAnswer: '',
          codeAnswer: '',
          isCorrect: false,
          marksObtained: 0,
          maxPoints,
          isMarkedForReview: userAns ? userAns.isMarkedForReview : false
        };
      }

      let isCorrect = false;
      let marksObtained = 0;

      // Objective grading
      if (q.type === 'mcq_single' || q.type === 'true_false') {
        const selected = Array.isArray(userAns.selectedOptions) ? userAns.selectedOptions[0] : userAns.selectedOptions;
        const correct = q.correctAnswers[0];
        if (selected && selected.trim().toLowerCase() === correct.trim().toLowerCase()) {
          isCorrect = true;
          marksObtained = maxPoints;
          correctCount++;
        } else {
          incorrectCount++;
          if (quiz.settings && quiz.settings.enableNegativeMarking && q.negativePoints > 0) {
            marksObtained = -q.negativePoints;
          }
        }
      } else if (q.type === 'mcq_multi') {
        const selected = userAns.selectedOptions || [];
        const correct = q.correctAnswers || [];
        const isMatch = selected.length === correct.length && selected.every(val => correct.includes(val));
        if (isMatch) {
          isCorrect = true;
          marksObtained = maxPoints;
          correctCount++;
        } else {
          incorrectCount++;
        }
      } else if (q.type === 'fill_blank') {
        const textVal = (userAns.textAnswer || '').trim().toLowerCase();
        const correctVal = (q.correctAnswers[0] || '').trim().toLowerCase();
        if (textVal === correctVal) {
          isCorrect = true;
          marksObtained = maxPoints;
          correctCount++;
        } else {
          incorrectCount++;
        }
      } else {
        // Short Answer / Coding Assignment requires manual review
        needsManualReview = true;
      }

      scoreObtained += marksObtained;

      return {
        questionId: qIdStr,
        selectedOptions: userAns.selectedOptions || [],
        textAnswer: userAns.textAnswer || '',
        codeAnswer: userAns.codeAnswer || '',
        isCorrect,
        marksObtained,
        maxPoints,
        isMarkedForReview: userAns.isMarkedForReview || false
      };
    });

    const percentage = totalMarks > 0 ? Math.round((Math.max(0, scoreObtained) / totalMarks) * 100) : 0;
    const passingPct = quiz.passingPercentage || 70;
    const passed = percentage >= passingPct;

    // Grade calculation
    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    const submissionId = generateSubmissionId();

    const submission = await QuizSubmission.create({
      submissionId,
      quizId: quiz._id,
      quizTitle: quiz.title,
      quizType: quiz.type,
      studentEmail: studentEmail.toLowerCase(),
      studentName,
      answers: processedAnswers,
      totalQuestions: quiz.questions.length,
      correctCount,
      incorrectCount,
      unansweredCount,
      totalMarks,
      scoreObtained: Math.max(0, scoreObtained),
      percentage,
      grade,
      passed,
      timeTakenSeconds: timeTakenSeconds || 0,
      attemptNumber,
      tabSwitchesCount: tabSwitchesCount || 0,
      copyPasteAttempts: copyPasteAttempts || 0,
      autoSubmittedOnTimeout: Boolean(autoSubmittedOnTimeout),
      evaluationStatus: needsManualReview ? 'pending_manual_review' : 'auto_graded'
    });

    res.json({
      success: true,
      submissionId: submission.submissionId,
      scoreObtained: submission.scoreObtained,
      totalMarks: submission.totalMarks,
      percentage: submission.percentage,
      grade: submission.grade,
      passed: submission.passed,
      evaluationStatus: submission.evaluationStatus
    });

  } catch (err) {
    console.error('Error submitting quiz:', err);
    res.status(500).json({ success: false, message: 'Server error submitting quiz' });
  }
});

// ── 5. GET DETAILED SUBMISSION RESULT WITH EXPLANATIONS ───────────
router.get('/:id/results/:submissionId', async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await QuizSubmission.findOne({ submissionId });
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    const quiz = await Quiz.findById(submission.quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Associated quiz not found' });
    }

    // Attach full question details and explanations to the submission answers
    const detailedAnswers = submission.answers.map(ans => {
      const originalQ = quiz.questions.id(ans.questionId) || quiz.questions.find(q => q._id.toString() === ans.questionId);
      
      return {
        questionId: ans.questionId,
        questionText: originalQ ? originalQ.questionText : 'Question text unavailable',
        type: originalQ ? originalQ.type : 'mcq_single',
        options: originalQ ? originalQ.options : [],
        codeSnippet: originalQ ? originalQ.codeSnippet : '',
        codeLanguage: originalQ ? originalQ.codeLanguage : '',
        correctAnswers: (quiz.settings && quiz.settings.showAnswersPostQuiz) ? (originalQ ? originalQ.correctAnswers : []) : [],
        explanation: (quiz.settings && quiz.settings.showAnswersPostQuiz) ? (originalQ ? originalQ.explanation : '') : '',
        selectedOptions: ans.selectedOptions,
        textAnswer: ans.textAnswer,
        codeAnswer: ans.codeAnswer,
        isCorrect: ans.isCorrect,
        marksObtained: ans.marksObtained,
        maxPoints: ans.maxPoints
      };
    });

    // Calculate Leaderboard Rank
    const allSubs = await QuizSubmission.find({ quizId: quiz._id })
      .sort({ scoreObtained: -1, timeTakenSeconds: 1, createdAt: 1 });
    
    const rank = allSubs.findIndex(s => s.submissionId === submissionId) + 1;

    res.json({
      success: true,
      submission: {
        ...submission.toObject(),
        rank: rank > 0 ? rank : 1,
        answers: detailedAnswers
      },
      quizTitle: quiz.title,
      quizSettings: quiz.settings
    });

  } catch (err) {
    console.error('Error fetching quiz result:', err);
    res.status(500).json({ success: false, message: 'Server error fetching quiz result' });
  }
});

// ── 6. GET QUIZ LEADERBOARD ─────────────────────────────────────
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    // Fetch best score per student for this quiz
    const submissions = await QuizSubmission.find({ quizId: id });
    
    // Group by studentEmail keeping the highest scoring submission
    const studentMap = {};
    submissions.forEach(sub => {
      const email = sub.studentEmail;
      if (!studentMap[email] || sub.scoreObtained > studentMap[email].scoreObtained || (sub.scoreObtained === studentMap[email].scoreObtained && sub.timeTakenSeconds < studentMap[email].timeTakenSeconds)) {
        studentMap[email] = sub;
      }
    });

    const leaderboard = Object.values(studentMap)
      .sort((a, b) => {
        if (b.scoreObtained !== a.scoreObtained) return b.scoreObtained - a.scoreObtained;
        if (a.timeTakenSeconds !== b.timeTakenSeconds) return a.timeTakenSeconds - b.timeTakenSeconds;
        return new Date(a.createdAt) - new Date(b.createdAt);
      })
      .slice(0, 50)
      .map((entry, index) => ({
        rank: index + 1,
        studentName: entry.studentName,
        studentEmail: entry.studentEmail,
        scoreObtained: entry.scoreObtained,
        totalMarks: entry.totalMarks,
        percentage: entry.percentage,
        timeTakenSeconds: entry.timeTakenSeconds,
        passed: entry.passed,
        submittedAt: entry.createdAt
      }));

    res.json({
      success: true,
      quizTitle: quiz.title,
      leaderboard
    });

  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    res.status(500).json({ success: false, message: 'Server error fetching leaderboard' });
  }
});

// ── 7. STUDENT: MY SUBMISSIONS / ATTEMPTS ───────────────────────
router.get('/student/my-attempts', async (req, res) => {
  try {
    const { studentEmail } = req.query;
    if (!studentEmail) {
      return res.status(400).json({ success: false, message: 'Student email parameter required' });
    }

    const submissions = await QuizSubmission.find({ studentEmail: studentEmail.toLowerCase() })
      .sort({ createdAt: -1 });

    res.json({ success: true, submissions });
  } catch (err) {
    console.error('Error fetching student attempts:', err);
    res.status(500).json({ success: false, message: 'Server error fetching attempts' });
  }
});

// ================================================================
// ── ADMIN ENDPOINTS ─────────────────────────────────────────────
// ================================================================

// ── 8. ADMIN: GET ALL QUIZZES ───────────────────────────────────
router.get('/admin/all', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    const submissions = await QuizSubmission.find();

    const quizzesWithStats = quizzes.map(q => {
      const quizSubs = submissions.filter(s => s.quizId && s.quizId.toString() === q._id.toString());
      const totalParticipants = new Set(quizSubs.map(s => s.studentEmail)).size;
      const avgScore = quizSubs.length > 0 ? Math.round(quizSubs.reduce((a, b) => a + b.percentage, 0) / quizSubs.length) : 0;
      
      return {
        ...q.toObject(),
        questionsCount: q.questions ? q.questions.length : 0,
        stats: {
          totalSubmissions: quizSubs.length,
          totalParticipants,
          avgPercentage: avgScore
        }
      };
    });

    res.json({ success: true, quizzes: quizzesWithStats });
  } catch (err) {
    console.error('Error fetching admin quizzes:', err);
    res.status(500).json({ success: false, message: 'Server error fetching admin quizzes' });
  }
});

// ── 9. ADMIN: CREATE NEW QUIZ OR ASSIGNMENT ─────────────────────
router.post('/admin/create', async (req, res) => {
  try {
    const quizData = req.body;

    if (!quizData.title) {
      return res.status(400).json({ success: false, message: 'Quiz title is required' });
    }

    // Auto-generate slug
    const baseSlug = quizData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const newQuiz = await Quiz.create({
      ...quizData,
      slug
    });

    res.json({ success: true, message: 'Quiz created successfully', quiz: newQuiz });
  } catch (err) {
    console.error('Error creating quiz:', err);
    res.status(500).json({ success: false, message: 'Server error creating quiz' });
  }
});

// ── 10. ADMIN: UPDATE QUIZ ──────────────────────────────────────
router.put('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedQuiz = await Quiz.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedQuiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.json({ success: true, message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (err) {
    console.error('Error updating quiz:', err);
    res.status(500).json({ success: false, message: 'Server error updating quiz' });
  }
});

// ── 11. ADMIN: DELETE QUIZ ──────────────────────────────────────
router.delete('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deletedQuiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found' });
    }

    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (err) {
    console.error('Error deleting quiz:', err);
    res.status(500).json({ success: false, message: 'Server error deleting quiz' });
  }
});

// ── 12. ADMIN: DUPLICATE QUIZ ───────────────────────────────────
router.post('/admin/:id/duplicate', async (req, res) => {
  try {
    const { id } = req.params;
    const sourceQuiz = await Quiz.findById(id);
    if (!sourceQuiz) {
      return res.status(404).json({ success: false, message: 'Source quiz not found' });
    }

    const quizObj = sourceQuiz.toObject();
    delete quizObj._id;
    delete quizObj.createdAt;
    delete quizObj.updatedAt;

    quizObj.title = `${quizObj.title} (Copy)`;
    quizObj.slug = `${quizObj.slug}-copy-${Date.now().toString(36)}`;
    quizObj.status = 'draft';

    const duplicatedQuiz = await Quiz.create(quizObj);

    res.json({ success: true, message: 'Quiz duplicated successfully', quiz: duplicatedQuiz });
  } catch (err) {
    console.error('Error duplicating quiz:', err);
    res.status(500).json({ success: false, message: 'Server error duplicating quiz' });
  }
});

// ── 13. ADMIN: GET ALL SUBMISSIONS FOR REVIEW & GRADING ──────────
router.get('/admin/submissions', async (req, res) => {
  try {
    const submissions = await QuizSubmission.find().sort({ createdAt: -1 });
    res.json({ success: true, submissions });
  } catch (err) {
    console.error('Error fetching admin submissions:', err);
    res.status(500).json({ success: false, message: 'Server error fetching submissions' });
  }
});

// ── 14. ADMIN: MANUALLY GRADE SUBMISSION (DESCRIPTIVE/CODE) ─────
router.post('/admin/grade-submission', async (req, res) => {
  try {
    const { submissionId, teacherFeedback, evaluatedBy, updatedMarks } = req.body;

    const submission = await QuizSubmission.findOne({ submissionId });
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    if (updatedMarks !== undefined) {
      submission.scoreObtained = updatedMarks;
      submission.percentage = Math.round((updatedMarks / submission.totalMarks) * 100);
      submission.passed = submission.percentage >= 70;
    }

    submission.teacherFeedback = teacherFeedback || submission.teacherFeedback;
    submission.evaluatedBy = evaluatedBy || 'Gaurav Sir & Technical Team';
    submission.evaluatedAt = new Date();
    submission.evaluationStatus = 'manually_graded';

    await submission.save();

    res.json({ success: true, message: 'Submission graded successfully', submission });
  } catch (err) {
    console.error('Error grading submission:', err);
    res.status(500).json({ success: false, message: 'Server error grading submission' });
  }
});

// ── 15. RECORD EXAM SECURITY AUDIT EVENT ──────────────────────
const ExamSecurityLog = require('../models/ExamSecurityLog');

router.post('/security-log', async (req, res) => {
  try {
    const {
      userId,
      studentEmail,
      studentName,
      examId,
      examTitle,
      examType,
      attemptId,
      securityPolicyMode,
      eventType,
      reason,
      durationAwaySeconds,
      browserInfo,
      totalViolations,
      submissionReason
    } = req.body;

    if (!attemptId || !examId) {
      return res.status(400).json({ success: false, message: 'Missing attemptId or examId' });
    }

    let securityLog = await ExamSecurityLog.findOne({ attemptId });

    if (!securityLog) {
      securityLog = new ExamSecurityLog({
        userId: userId || studentEmail || 'anonymous',
        studentEmail: studentEmail || 'student@piyushdhara.com',
        studentName: studentName || 'Student',
        examId,
        examTitle: examTitle || 'Examination',
        examType: examType || 'Quiz',
        attemptId,
        securityPolicyMode: securityPolicyMode || 'Standard',
        totalViolations: totalViolations || 0,
        submissionReason: submissionReason || 'Normal',
        events: []
      });
    }

    if (totalViolations !== undefined) {
      securityLog.totalViolations = totalViolations;
    }
    if (submissionReason) {
      securityLog.submissionReason = submissionReason;
    }

    if (eventType) {
      securityLog.events.push({
        timestamp: new Date(),
        eventType,
        reason: reason || '',
        durationAwaySeconds: durationAwaySeconds || 0,
        browserInfo: browserInfo || (req.headers['user-agent'] ? req.headers['user-agent'].substring(0, 100) : '')
      });
    }

    await securityLog.save();

    res.json({ success: true, message: 'Security event recorded', totalViolations: securityLog.totalViolations });
  } catch (err) {
    console.error('Error logging security event:', err);
    res.status(500).json({ success: false, message: 'Server error recording security event' });
  }
});

// ── 16. ADMIN: GET SECURITY AUDIT REPORTS ────────────────────
router.get('/admin/security-audit', async (req, res) => {
  try {
    const logs = await ExamSecurityLog.find().sort({ updatedAt: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (err) {
    console.error('Error fetching security audit logs:', err);
    res.status(500).json({ success: false, message: 'Server error fetching security audit logs' });
  }
});

module.exports = router;
