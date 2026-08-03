const mongoose = require('mongoose');
const Certification = require('../models/Certification');
const CertModule = require('../models/CertModule');
const CertLesson = require('../models/CertLesson');
const CertSubmission = require('../models/CertSubmission');
const CertProgress = require('../models/CertProgress');
const Certificate = require('../models/Certificate');
const crypto = require('crypto');

/**
 * Helper to generate unique certificate ID (e.g. CERT-2026-HTML-A8B9)
 */
const generateCertificateId = (courseSlug) => {
  const shortSlug = (courseSlug || 'LMS').substring(0, 4).toUpperCase();
  const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase();
  const year = new Date().getFullYear();
  return `CERT-${year}-${shortSlug}-${randomHex}`;
};

/**
 * Helper to calculate student progress percentage
 */
const recalculateProgress = async (progress, totalLessonsCount) => {
  if (!totalLessonsCount || totalLessonsCount === 0) return 0;
  const completedCount = progress.completedLessonIds ? progress.completedLessonIds.length : 0;
  let pct = Math.round((completedCount / totalLessonsCount) * 100);
  if (pct > 100) pct = 100;
  
  progress.overallPercentage = pct;
  if (pct >= 100 && progress.finalExam && progress.finalExam.passed) {
    progress.status = 'completed';
  } else {
    progress.status = 'in_progress';
  }
  await progress.save();
  return pct;
};

// ============================================================================
// PUBLIC / STUDENT CONTROLLERS
// ============================================================================

/**
 * @desc    Get all certifications (Public/Student)
 * @route   GET /api/certifications
 */
const getCertifications = async (req, res) => {
  try {
    const { category, difficulty, search, studentEmail } = req.query;
    let query = { status: 'published' };

    if (category && category !== 'All' && category !== 'undefined') {
      query.category = category;
    }
    if (difficulty && difficulty !== 'All' && difficulty !== 'undefined') {
      query.difficulty = difficulty;
    }
    if (search && search.trim() && search.trim() !== 'undefined') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { skillsGained: { $elemMatch: { $regex: search.trim(), $options: 'i' } } }
      ];
    }

    const certifications = await Certification.find(query).sort({ createdAt: -1 });

    // Attach student progress if email is provided
    let results = [];
    for (let cert of certifications) {
      const certObj = cert.toObject();
      const modules = await CertModule.find({ certificationId: cert._id });
      const moduleIds = modules.map(m => m._id);
      const totalLessons = await CertLesson.countDocuments({ moduleId: { $in: moduleIds } });
      const totalQuizzes = await CertLesson.countDocuments({ moduleId: { $in: moduleIds }, hasQuiz: true });

      certObj.totalLessons = totalLessons;
      certObj.totalQuizzes = totalQuizzes;

      if (studentEmail) {
        const progress = await CertProgress.findOne({
          certificationId: cert._id,
          studentEmail: studentEmail.toLowerCase().trim()
        });
        certObj.userProgress = progress ? {
          percentage: progress.overallPercentage,
          status: progress.status,
          certificateIssued: progress.certificateIssued,
          certificateId: progress.certificateId
        } : null;
      }

      results.push(certObj);
    }

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error('getCertifications Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching certifications' });
  }
};

/**
 * @desc    Get certification overview page details by slug or ID
 * @route   GET /api/certifications/:identifier
 */
const getCertificationDetails = async (req, res) => {
  try {
    const { identifier } = req.params;
    const { studentEmail } = req.query;

    let cert = await Certification.findOne({
      $or: [
        { slug: identifier },
        { _id: mongoose.Types.ObjectId.isValid(identifier) ? identifier : null }
      ]
    });

    if (!cert) {
      return res.status(404).json({ message: 'Certification course not found' });
    }

    const modules = await CertModule.find({ certificationId: cert._id }).sort({ order: 1 });
    const moduleIds = modules.map(m => m._id);
    const lessons = await CertLesson.find({ moduleId: { $in: moduleIds } }).sort({ order: 1 });

    const totalLessons = lessons.length;
    const totalQuizzes = lessons.filter(l => l.hasQuiz).length;
    const totalAssignments = lessons.filter(l => l.hasAssignment).length;

    let userProgress = null;
    let certificate = null;

    if (studentEmail) {
      userProgress = await CertProgress.findOne({
        certificationId: cert._id,
        studentEmail: studentEmail.toLowerCase().trim()
      });

      if (userProgress && userProgress.certificateId) {
        certificate = await Certificate.findOne({ certificateId: userProgress.certificateId });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...cert.toObject(),
        totalLessons,
        totalQuizzes,
        totalAssignments,
        modules,
        userProgress,
        certificate
      }
    });

  } catch (error) {
    console.error('getCertificationDetails Error:', error);
    res.status(500).json({ message: error.message || 'Server error loading certification details' });
  }
};

/**
 * @desc    Enroll student in a certification course
 * @route   POST /api/certifications/:id/enroll
 */
const enrollCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentEmail, studentName } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ message: 'Student email is required for enrollment' });
    }

    const cert = await Certification.findById(id);
    if (!cert) {
      return res.status(404).json({ message: 'Certification course not found' });
    }

    const cleanEmail = studentEmail.toLowerCase().trim();
    let progress = await CertProgress.findOne({ certificationId: cert._id, studentEmail: cleanEmail });

    if (!progress) {
      progress = await CertProgress.create({
        certificationId: cert._id,
        studentEmail: cleanEmail,
        studentName: studentName || 'Student',
        completedLessonIds: [],
        overallPercentage: 0,
        status: 'in_progress',
        isEnrolled: true,
        enrolledAt: new Date()
      });
    } else {
      progress.isEnrolled = true;
      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in certification course',
      progress
    });
  } catch (error) {
    console.error('enrollCertification Error:', error);
    res.status(500).json({ message: error.message || 'Server error enrolling in certification' });
  }
};

/**
 * @desc    Get interactive learning interface data (Modules tree + lessons + locked status)
 * @route   GET /api/certifications/:id/learn
 */
const getCertificationLearnData = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentEmail } = req.query;

    if (!studentEmail) {
      return res.status(400).json({ message: 'Student email is required to access learning interface' });
    }

    const cert = await Certification.findById(id);
    if (!cert) {
      return res.status(404).json({ message: 'Certification not found' });
    }

    const cleanEmail = studentEmail.toLowerCase().trim();

    // Get or initialize student progress
    let progress = await CertProgress.findOne({ certificationId: cert._id, studentEmail: cleanEmail });
    if (!progress) {
      progress = await CertProgress.create({
        certificationId: cert._id,
        studentEmail: cleanEmail,
        completedLessonIds: [],
        overallPercentage: 0
      });
    }

    const modules = await CertModule.find({ certificationId: cert._id }).sort({ order: 1 });
    const moduleTree = [];
    let allLessonsFlat = [];

    for (let mod of modules) {
      const lessons = await CertLesson.find({ moduleId: mod._id }).sort({ order: 1 });
      allLessonsFlat = allLessonsFlat.concat(lessons);
      moduleTree.push({
        _id: mod._id,
        title: mod.title,
        description: mod.description,
        order: mod.order,
        lessons: lessons.map(l => ({
          _id: l._id,
          title: l.title,
          order: l.order,
          estimatedTimeMinutes: l.estimatedTimeMinutes,
          hasQuiz: l.hasQuiz,
          hasAssignment: l.hasAssignment
        }))
      });
    }

    // All lessons & modules are unlocked so students can freely navigate across modules without quiz blockers
    const completedSet = new Set((progress.completedLessonIds || []).map(id => id.toString()));

    const processedModules = moduleTree.map(mod => {
      const processedLessons = mod.lessons.map(les => {
        const isCompleted = completedSet.has(les._id.toString());
        return {
          ...les,
          isCompleted,
          isUnlocked: true // All lessons unlocked and navigable!
        };
      });

      return {
        ...mod,
        lessons: processedLessons
      };
    });

    // Determine current lesson
    let activeLessonId = req.query.lessonId;
    let activeLesson = null;

    if (activeLessonId) {
      activeLesson = await CertLesson.findById(activeLessonId);
    }

    if (!activeLesson && allLessonsFlat.length > 0) {
      // Pick first uncompleted unlocked lesson, or last lesson if all completed
      const firstUncompleted = allLessonsFlat.find(l => !completedSet.has(l._id.toString()));
      activeLesson = firstUncompleted || allLessonsFlat[0];
    }

    // Check if student has assignment submissions for active lesson
    let activeAssignmentSubmission = null;
    if (activeLesson && activeLesson.hasAssignment) {
      activeAssignmentSubmission = await CertSubmission.findOne({
        certificationId: cert._id,
        lessonId: activeLesson._id,
        studentEmail: cleanEmail
      });
    }

    // Recalculate progress pct
    await recalculateProgress(progress, allLessonsFlat.length);

    res.status(200).json({
      success: true,
      data: {
        certification: {
          _id: cert._id,
          title: cert.title,
          slug: cert.slug,
          category: cert.category,
          difficulty: cert.difficulty,
          assessmentRules: cert.assessmentRules,
          finalExam: cert.finalExam
        },
        progress,
        modules: processedModules,
        totalLessons: allLessonsFlat.length,
        activeLesson: activeLesson ? {
          ...activeLesson.toObject(),
          assignmentSubmission: activeAssignmentSubmission
        } : null
      }
    });

  } catch (error) {
    console.error('getCertificationLearnData Error:', error);
    res.status(500).json({ message: error.message || 'Server error loading learning workspace' });
  }
};

/**
 * @desc    Mark lesson completed & unlock next lesson
 * @route   POST /api/certifications/:id/lessons/:lessonId/complete
 */
const completeLesson = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const { studentEmail, studentName } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ message: 'Student email is required' });
    }

    const cleanEmail = studentEmail.toLowerCase().trim();
    const lesson = await CertLesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    let progress = await CertProgress.findOne({ certificationId: id, studentEmail: cleanEmail });
    if (!progress) {
      progress = await CertProgress.create({
        certificationId: id,
        studentEmail: cleanEmail,
        studentName: studentName || 'Student',
        completedLessonIds: []
      });
    }

    // Check if lesson requires quiz to pass (auto-create passing record if not completed)
    if (lesson.hasQuiz && lesson.quiz && lesson.quiz.questions.length > 0) {
      let quizRecord = (progress.quizScores || []).find(q => q.lessonId.toString() === lessonId);
      if (!quizRecord || !quizRecord.passed) {
        if (!progress.quizScores) progress.quizScores = [];
        progress.quizScores.push({
          lessonId,
          scorePercentage: 100,
          passed: true,
          completedAt: new Date()
        });
      }
    }

    // Check if lesson requires assignment to be submitted (auto-create assignment record if missing)
    if (lesson.hasAssignment) {
      let submission = await CertSubmission.findOne({ certificationId: id, lessonId, studentEmail: cleanEmail });
      if (!submission) {
        await CertSubmission.create({
          submissionId: `SUB-AUTO-${Date.now().toString(36)}`,
          certificationId: id,
          lessonId,
          studentEmail: cleanEmail,
          studentName: studentName || 'Student',
          submissionType: 'code',
          codeContent: '<!-- Auto Completed Submission -->',
          status: 'submitted'
        });
      }
    }

    // Add to completedLessonIds if not present
    if (!progress.completedLessonIds.some(lid => lid.toString() === lessonId)) {
      progress.completedLessonIds.push(lessonId);
    }

    const modules = await CertModule.find({ certificationId: id });
    const moduleIds = modules.map(m => m._id);
    const totalLessons = await CertLesson.countDocuments({ moduleId: { $in: moduleIds } });

    const pct = await recalculateProgress(progress, totalLessons);

    res.status(200).json({
      success: true,
      message: 'Lesson completed successfully!',
      progressPercentage: pct,
      completedCount: progress.completedLessonIds.length,
      totalLessons
    });

  } catch (error) {
    console.error('completeLesson Error:', error);
    res.status(500).json({ message: error.message || 'Server error marking lesson complete' });
  }
};

/**
 * @desc    Submit lesson checkpoint quiz
 * @route   POST /api/certifications/:id/lessons/:lessonId/quiz/submit
 */
const submitLessonQuiz = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const { studentEmail, answers } = req.body; // answers = { [questionIndex]: selectedAnswersArray }

    if (!studentEmail || !answers) {
      return res.status(400).json({ message: 'Student email and answers are required' });
    }

    const cleanEmail = studentEmail.toLowerCase().trim();
    const lesson = await CertLesson.findById(lessonId);
    if (!lesson || !lesson.hasQuiz || !lesson.quiz) {
      return res.status(404).json({ message: 'Quiz not found for this lesson' });
    }

    const questions = lesson.quiz.questions;
    let correctCount = 0;
    const feedback = [];

    questions.forEach((q, idx) => {
      const userAns = answers[idx] || [];
      const correctAns = q.correctAnswers || [];

      // Check if user answer matches correct answers array
      const isCorrect = Array.isArray(userAns)
        ? userAns.length === correctAns.length && userAns.every(val => correctAns.includes(val.toString()))
        : correctAns.includes(userAns.toString());

      if (isCorrect) correctCount++;

      feedback.push({
        questionIndex: idx,
        isCorrect,
        correctAnswers: correctAns,
        explanation: q.explanation || ''
      });
    });

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const passed = scorePercentage >= (lesson.quiz.passingPercentage || 70);

    let progress = await CertProgress.findOne({ certificationId: id, studentEmail: cleanEmail });
    if (!progress) {
      progress = await CertProgress.create({ certificationId: id, studentEmail: cleanEmail });
    }

    // Update quizScores array
    const existingIndex = progress.quizScores.findIndex(q => q.lessonId.toString() === lessonId);
    const scoreItem = {
      lessonId,
      score: scorePercentage,
      total: 100,
      passed,
      attemptedAt: new Date()
    };

    if (existingIndex > -1) {
      progress.quizScores[existingIndex] = scoreItem;
    } else {
      progress.quizScores.push(scoreItem);
    }

    await progress.save();

    res.status(200).json({
      success: true,
      scorePercentage,
      passed,
      correctCount,
      totalQuestions: questions.length,
      passingPercentage: lesson.quiz.passingPercentage || 70,
      feedback
    });

  } catch (error) {
    console.error('submitLessonQuiz Error:', error);
    res.status(500).json({ message: error.message || 'Server error evaluating quiz' });
  }
};

/**
 * @desc    Submit practical assignment for a lesson
 * @route   POST /api/certifications/:id/lessons/:lessonId/assignment/submit
 */
const submitAssignment = async (req, res) => {
  try {
    const { id, lessonId } = req.params;
    const { studentEmail, studentName, submissionType, codeContent, textContent, fileUrl } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ message: 'Student email is required' });
    }

    const cleanEmail = studentEmail.toLowerCase().trim();
    const lesson = await CertLesson.findById(lessonId);

    if (!lesson || !lesson.hasAssignment) {
      return res.status(404).json({ message: 'Assignment not found for this lesson' });
    }

    let submission = await CertSubmission.findOne({ certificationId: id, lessonId, studentEmail: cleanEmail });

    if (!submission) {
      submission = await CertSubmission.create({
        certificationId: id,
        lessonId,
        studentEmail: cleanEmail,
        studentName: studentName || 'Student',
        submissionType: submissionType || 'code',
        codeContent: codeContent || '',
        textContent: textContent || '',
        fileUrl: fileUrl || '',
        status: 'pending',
        maxMarks: lesson.assignment.maxMarks || 20
      });
    } else {
      submission.submissionType = submissionType || submission.submissionType;
      submission.codeContent = codeContent !== undefined ? codeContent : submission.codeContent;
      submission.textContent = textContent !== undefined ? textContent : submission.textContent;
      submission.fileUrl = fileUrl || submission.fileUrl;
      submission.status = 'pending';
      submission.updatedAt = new Date();
      await submission.save();
    }

    // Attach to progress
    let progress = await CertProgress.findOne({ certificationId: id, studentEmail: cleanEmail });
    if (progress && !progress.assignmentSubmissions.includes(submission._id)) {
      progress.assignmentSubmissions.push(submission._id);
      await progress.save();
    }

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully for review!',
      submission
    });

  } catch (error) {
    console.error('submitAssignment Error:', error);
    res.status(500).json({ message: error.message || 'Server error submitting assignment' });
  }
};

/**
 * @desc    Submit Final Assessment Exam & Generate Certificate if passed
 * @route   POST /api/certifications/:id/final-assessment/submit
 */
const submitFinalAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentEmail, studentName, answers } = req.body;

    if (!studentEmail || !answers) {
      return res.status(400).json({ message: 'Student email and exam answers are required' });
    }

    const cleanEmail = studentEmail.toLowerCase().trim();
    const cert = await Certification.findById(id);

    if (!cert || !cert.finalExam || !cert.finalExam.questions.length) {
      return res.status(404).json({ message: 'Final assessment exam not configured for this certification' });
    }

    let progress = await CertProgress.findOne({ certificationId: id, studentEmail: cleanEmail });
    
    const modules = await CertModule.find({ certificationId: id });
    const moduleIds = modules.map(m => m._id);
    const allLessons = await CertLesson.find({ moduleId: { $in: moduleIds } });
    const totalLessons = allLessons.length;
    const allLessonIds = allLessons.map(l => l._id);

    if (!progress) {
      progress = await CertProgress.create({
        certificationId: id,
        studentEmail: cleanEmail,
        studentName: studentName || 'Student',
        completedLessonIds: allLessonIds,
        overallPercentage: 100
      });
    } else {
      // Ensure all lessons are marked completed upon taking final exam
      progress.completedLessonIds = Array.from(new Set([
        ...(progress.completedLessonIds || []).map(id => id.toString()),
        ...allLessonIds.map(id => id.toString())
      ]));
      progress.overallPercentage = 100;
      await progress.save();
    }

    // Evaluate exam
    const questions = cert.finalExam.questions;
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach((q, idx) => {
      const points = q.points || 10;
      totalPoints += points;

      const userAns = answers[idx] || [];
      const correctAns = q.correctAnswers || [];

      const isCorrect = Array.isArray(userAns)
        ? userAns.length === correctAns.length && userAns.every(val => correctAns.includes(val.toString()))
        : correctAns.includes(userAns.toString());

      if (isCorrect) earnedPoints += points;
    });

    const scorePercentage = Math.round((earnedPoints / totalPoints) * 100);
    const passingPct = cert.assessmentRules.passingPercentage || 70;
    const passed = scorePercentage >= passingPct;

    progress.finalExam = {
      attempted: true,
      passed,
      scorePercentage,
      marksObtained: earnedPoints,
      totalMarks: totalPoints,
      attemptedAt: new Date()
    };

    let issuedCert = null;

    if (passed) {
      progress.status = 'completed';
      progress.overallPercentage = 100;
      progress.certificateIssued = true;

      // Check if certificate already generated
      if (!progress.certificateId) {
        const certId = generateCertificateId(cert.slug);
        const host = req.get('host') || 'localhost:5173';
        const protocol = req.protocol || 'http';
        const verificationUrl = `${protocol}://${host}/certificates/${certId}`;

        issuedCert = await Certificate.create({
          certificateId: certId,
          certificationId: cert._id,
          certificationTitle: cert.title,
          studentEmail: cleanEmail,
          studentName: studentName || progress.studentName || 'Graduated Student',
          issueDate: new Date(),
          scorePercentage,
          instructorName: cert.instructor.name || 'Gaurav Sir & Team',
          platformName: 'PiyushDhara Learning Platform',
          verificationUrl
        });

        progress.certificateId = certId;
      } else {
        issuedCert = await Certificate.findOne({ certificateId: progress.certificateId });
      }
    } else {
      progress.status = 'failed';
    }

    await progress.save();

    res.status(200).json({
      success: true,
      passed,
      scorePercentage,
      passingPercentage: passingPct,
      earnedPoints,
      totalPoints,
      certificate: issuedCert,
      message: passed ? 'Congratulations! You passed the final assessment and earned your verified certificate.' : 'You did not reach the 70% passing threshold. Review the lessons and try again.'
    });

  } catch (error) {
    console.error('submitFinalAssessment Error:', error);
    res.status(500).json({ message: error.message || 'Server error evaluating final assessment' });
  }
};

/**
 * @desc    Public Certificate Verification Endpoint
 * @route   GET /api/certifications/certificates/:certificateId
 */
const getCertificateById = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const cert = await Certificate.findOne({ certificateId: certificateId.trim().toUpperCase() });

    if (!cert) {
      return res.status(404).json({ message: 'Certificate verification failed: Invalid Certificate ID.' });
    }

    // Increment download count if requested
    if (req.query.download === 'true') {
      cert.downloadsCount += 1;
      await cert.save();
    }

    res.status(200).json({ success: true, certificate: cert });
  } catch (error) {
    console.error('getCertificateById Error:', error);
    res.status(500).json({ message: error.message || 'Server error verifying certificate' });
  }
};

/**
 * @desc    Get all Student Certifications (Completed, In-Progress, Issued Certificates)
 * @route   GET /api/certifications/my-certifications
 */
const getStudentCertifications = async (req, res) => {
  try {
    const { studentEmail } = req.query;
    if (!studentEmail) {
      return res.status(400).json({ message: 'Student email is required' });
    }

    const cleanEmail = studentEmail.toLowerCase().trim();
    const progressRecords = await CertProgress.find({ studentEmail: cleanEmail }).populate('certificationId');
    const certificates = await Certificate.find({ studentEmail: cleanEmail }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      progressRecords,
      certificates
    });
  } catch (error) {
    console.error('getStudentCertifications Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching student certifications' });
  }
};


// ============================================================================
// ADMIN / TEACHER LMS MANAGEMENT CONTROLLERS
// ============================================================================

/**
 * @desc    Admin Create Certification Course
 * @route   POST /api/certifications/admin/create
 */
const adminCreateCertification = async (req, res) => {
  try {
    const certData = req.body;
    if (!certData.title || !certData.description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const slug = certData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let existing = await Certification.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    const newCert = await Certification.create({
      ...certData,
      slug: finalSlug
    });

    res.status(201).json({ success: true, message: 'Certification created successfully!', certification: newCert });
  } catch (error) {
    console.error('adminCreateCertification Error:', error);
    res.status(500).json({ message: error.message || 'Server error creating certification' });
  }
};

/**
 * @desc    Admin Add Module to Certification
 * @route   POST /api/certifications/admin/:id/modules
 */
const adminCreateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, order } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Module title is required' });
    }

    const count = await CertModule.countDocuments({ certificationId: id });
    const newModule = await CertModule.create({
      certificationId: id,
      title,
      description: description || '',
      order: order || (count + 1)
    });

    res.status(201).json({ success: true, message: 'Module added!', module: newModule });
  } catch (error) {
    console.error('adminCreateModule Error:', error);
    res.status(500).json({ message: error.message || 'Server error creating module' });
  }
};

/**
 * @desc    Admin Add Lesson to Module
 * @route   POST /api/certifications/admin/modules/:moduleId/lessons
 */
const adminCreateLesson = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const lessonData = req.body;

    const moduleDoc = await CertModule.findById(moduleId);
    if (!moduleDoc) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const count = await CertLesson.countDocuments({ moduleId });
    const newLesson = await CertLesson.create({
      ...lessonData,
      certificationId: moduleDoc.certificationId,
      moduleId,
      order: lessonData.order || (count + 1)
    });

    res.status(201).json({ success: true, message: 'Lesson added!', lesson: newLesson });
  } catch (error) {
    console.error('adminCreateLesson Error:', error);
    res.status(500).json({ message: error.message || 'Server error creating lesson' });
  }
};

/**
 * @desc    Admin Grade Student Assignment Submission
 * @route   POST /api/certifications/admin/submissions/:submissionId/grade
 */
const adminGradeAssignment = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { status, marksObtained, feedback, gradedBy } = req.body;

    const submission = await CertSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    submission.status = status || 'graded';
    submission.marksObtained = marksObtained !== undefined ? marksObtained : submission.marksObtained;
    submission.feedback = feedback || submission.feedback;
    submission.gradedBy = gradedBy || 'Admin';
    submission.gradedAt = new Date();
    await submission.save();

    res.status(200).json({ success: true, message: 'Assignment graded successfully!', submission });
  } catch (error) {
    console.error('adminGradeAssignment Error:', error);
    res.status(500).json({ message: error.message || 'Server error grading assignment' });
  }
};

/**
 * @desc    Admin Get Analytics Report for Certifications
 * @route   GET /api/certifications/admin/analytics
 */
const adminGetAnalytics = async (req, res) => {
  try {
    const totalCertifications = await Certification.countDocuments();
    const totalProgressRecords = await CertProgress.countDocuments();
    const totalCertificatesIssued = await Certificate.countDocuments();
    const totalSubmissions = await CertSubmission.countDocuments();
    const pendingSubmissions = await CertSubmission.countDocuments({ status: 'pending' });

    const recentCertificates = await Certificate.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      analytics: {
        totalCertifications,
        totalProgressRecords,
        totalCertificatesIssued,
        totalSubmissions,
        pendingSubmissions,
        recentCertificates
      }
    });
  } catch (error) {
    console.error('adminGetAnalytics Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching analytics' });
  }
};

/**
 * @desc    Admin Get Full Certification Hierarchy (Modules + Lessons) for Editing
 * @route   GET /api/certifications/admin/:id/full
 */
const adminGetFullCertificationForEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const cert = await Certification.findById(id);
    if (!cert) return res.status(404).json({ message: 'Certification not found' });

    const modules = await CertModule.find({ certificationId: cert._id }).sort({ order: 1 }).lean();
    for (let mod of modules) {
      mod.lessons = await CertLesson.find({ moduleId: mod._id }).sort({ order: 1 });
    }

    res.status(200).json({ success: true, certification: cert, modules });
  } catch (error) {
    console.error('adminGetFullCertificationForEdit Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching certification' });
  }
};

/**
 * @desc    Admin Update Certification Course
 * @route   PUT /api/certifications/admin/:id
 */
const adminUpdateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Certification.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Certification not found' });
    res.status(200).json({ success: true, message: 'Certification updated!', certification: updated });
  } catch (error) {
    console.error('adminUpdateCertification Error:', error);
    res.status(500).json({ message: error.message || 'Server error updating certification' });
  }
};

/**
 * @desc    Admin Delete Certification Course & All Children
 * @route   DELETE /api/certifications/admin/:id
 */
const adminDeleteCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const modules = await CertModule.find({ certificationId: id });
    const moduleIds = modules.map(m => m._id);

    await CertLesson.deleteMany({ moduleId: { $in: moduleIds } });
    await CertModule.deleteMany({ certificationId: id });
    await Certification.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Certification deleted successfully!' });
  } catch (error) {
    console.error('adminDeleteCertification Error:', error);
    res.status(500).json({ message: error.message || 'Server error deleting certification' });
  }
};

/**
 * @desc    Admin Update Lesson (including Quizzes & Assignments)
 * @route   PUT /api/certifications/admin/lessons/:lessonId
 */
const adminUpdateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const updated = await CertLesson.findByIdAndUpdate(lessonId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Lesson not found' });
    res.status(200).json({ success: true, message: 'Lesson updated!', lesson: updated });
  } catch (error) {
    console.error('adminUpdateLesson Error:', error);
    res.status(500).json({ message: error.message || 'Server error updating lesson' });
  }
};

/**
 * @desc    Admin Delete Module & its Lessons
 * @route   DELETE /api/certifications/admin/modules/:moduleId
 */
const adminDeleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    await CertLesson.deleteMany({ moduleId });
    await CertModule.findByIdAndDelete(moduleId);
    res.status(200).json({ success: true, message: 'Module deleted!' });
  } catch (error) {
    console.error('adminDeleteModule Error:', error);
    res.status(500).json({ message: error.message || 'Server error deleting module' });
  }
};

/**
 * @desc    Admin Delete Lesson
 * @route   DELETE /api/certifications/admin/lessons/:lessonId
 */
const adminDeleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    await CertLesson.findByIdAndDelete(lessonId);
    res.status(200).json({ success: true, message: 'Lesson deleted!' });
  } catch (error) {
    console.error('adminDeleteLesson Error:', error);
    res.status(500).json({ message: error.message || 'Server error deleting lesson' });
  }
};

/**
 * @desc    Admin Get Student Submissions
 * @route   GET /api/certifications/admin/submissions
 */
const adminGetSubmissions = async (req, res) => {
  try {
    const submissions = await CertSubmission.find().sort({ submittedAt: -1 });
    res.status(200).json({ success: true, submissions });
  } catch (error) {
    console.error('adminGetSubmissions Error:', error);
    res.status(500).json({ message: error.message || 'Server error fetching submissions' });
  }
};

module.exports = {
  getCertifications,
  getCertificationDetails,
  enrollCertification,
  getCertificationLearnData,
  completeLesson,
  submitLessonQuiz,
  submitAssignment,
  submitFinalAssessment,
  getCertificateById,
  getStudentCertifications,
  adminCreateCertification,
  adminCreateModule,
  adminCreateLesson,
  adminGradeAssignment,
  adminGetAnalytics,
  adminGetFullCertificationForEdit,
  adminUpdateCertification,
  adminDeleteCertification,
  adminUpdateLesson,
  adminDeleteModule,
  adminDeleteLesson,
  adminGetSubmissions
};
