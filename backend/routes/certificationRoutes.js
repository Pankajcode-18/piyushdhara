const express = require('express');
const router = express.Router();

const {
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
} = require('../controllers/certificationController');

// Public & Student Endpoints
router.get('/', getCertifications);
router.get('/my-certifications', getStudentCertifications);
router.get('/certificates/:certificateId', getCertificateById);
router.get('/:identifier', getCertificationDetails);
router.post('/:id/enroll', enrollCertification);
router.get('/:id/learn', getCertificationLearnData);

router.post('/:id/lessons/:lessonId/complete', completeLesson);
router.post('/:id/lessons/:lessonId/quiz/submit', submitLessonQuiz);
router.post('/:id/lessons/:lessonId/assignment/submit', submitAssignment);
router.post('/:id/final-assessment/submit', submitFinalAssessment);

// Admin Endpoints
router.post('/admin/create', adminCreateCertification);
router.get('/admin/analytics', adminGetAnalytics);
router.get('/admin/submissions', adminGetSubmissions);
router.get('/admin/:id/full', adminGetFullCertificationForEdit);
router.put('/admin/:id', adminUpdateCertification);
router.delete('/admin/:id', adminDeleteCertification);

router.post('/admin/:id/modules', adminCreateModule);
router.delete('/admin/modules/:moduleId', adminDeleteModule);

router.post('/admin/modules/:moduleId/lessons', adminCreateLesson);
router.put('/admin/lessons/:lessonId', adminUpdateLesson);
router.delete('/admin/lessons/:lessonId', adminDeleteLesson);

router.post('/admin/submissions/:submissionId/grade', adminGradeAssignment);

module.exports = router;
