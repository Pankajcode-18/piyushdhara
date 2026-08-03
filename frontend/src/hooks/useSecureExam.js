import { useState, useEffect, useRef, useCallback } from 'react';
import { recordSecurityLogApi } from '../utils/api';

export const useSecureExam = ({
  examId,
  examTitle,
  examType = 'Quiz',
  attemptId,
  studentEmail,
  studentName,
  securityPolicy = { mode: 'Standard', enforceFullscreen: true, preventTabSwitch: true, preventReload: true, maxViolations: 3 },
  onAutoSubmit,
  isActive = false
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [violationsCount, setViolationsCount] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [securityStatus, setSecurityStatus] = useState('Clean');

  const mode = securityPolicy?.mode || 'Standard';
  const maxAllowed = mode === 'Strict' ? 1 : (securityPolicy?.maxViolations || 3);

  const awayStartTimeRef = useRef(null);
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  const violationsCountRef = useRef(violationsCount);
  violationsCountRef.current = violationsCount;

  const paramsRef = useRef({ examId, examTitle, examType, attemptId, studentEmail, studentName, mode, onAutoSubmit });
  paramsRef.current = { examId, examTitle, examType, attemptId, studentEmail, studentName, mode, onAutoSubmit };

  // Send Security Audit Log to Backend API
  const logEvent = useCallback(async (eventType, reason = '', durationAwaySeconds = 0, currentCount = violationsCountRef.current, subReason = 'Normal') => {
    const p = paramsRef.current;
    if (!p.examId || !p.attemptId) return;
    try {
      await recordSecurityLogApi({
        userId: p.studentEmail || 'student',
        studentEmail: p.studentEmail,
        studentName: p.studentName,
        examId: p.examId,
        examTitle: p.examTitle,
        examType: p.examType,
        attemptId: p.attemptId,
        securityPolicyMode: p.mode,
        eventType,
        reason,
        durationAwaySeconds,
        totalViolations: currentCount,
        submissionReason: subReason,
        browserInfo: navigator.userAgent
      });
    } catch (err) {
      console.error('Failed to record security audit log:', err);
    }
  }, []);

  // Request Browser Fullscreen
  const requestFullScreen = useCallback(async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        await elem.msRequestFullscreen();
      }
      setIsFullScreen(true);
      logEvent('Entered Full Screen', 'User accepted pre-exam rules');
      return true;
    } catch (err) {
      console.warn('Fullscreen request denied or not supported:', err);
      setIsFullScreen(false);
      return false;
    }
  }, [logEvent]);

  // Handle Security Violation Event
  const registerViolation = useCallback((reason, eventType) => {
    if (!isActiveRef.current) return;

    setViolationsCount(prev => {
      const nextCount = prev + 1;
      violationsCountRef.current = nextCount;

      let newStatus = 'Warning';
      let subReason = 'Normal';

      if (mode === 'Strict' || nextCount >= maxAllowed) {
        newStatus = 'Security Violation';
        subReason = 'Security Violation';
        setSecurityStatus(newStatus);
        setWarningMessage(`SECURITY VIOLATION DETECTED: ${reason}. Maximum security threshold exceeded. Automatically submitting exam.`);
        setShowWarningModal(true);

        logEvent(eventType, reason, 0, nextCount, subReason);

        setTimeout(() => {
          if (onAutoSubmit) {
            onAutoSubmit('Security Violation');
          }
        }, 1200);

      } else {
        setSecurityStatus('Warning');
        setWarningMessage(`SECURITY WARNING (${nextCount} / ${maxAllowed}): ${reason}. Please stay in full-screen and do not switch browser tabs.`);
        setShowWarningModal(true);

        logEvent(eventType, reason, 0, nextCount, subReason);
      }

      return nextCount;
    });
  }, [mode, maxAllowed, logEvent, onAutoSubmit]);

  // Listen to Fullscreen API Changes
  useEffect(() => {
    if (!isActive) return;

    const handleFullscreenChange = () => {
      const inFS = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      setIsFullScreen(inFS);

      if (!inFS && isActiveRef.current) {
        registerViolation('Exited Full Screen mode', 'Exited Full Screen');
      } else if (inFS && isActiveRef.current) {
        logEvent('Returned to Full Screen', 'User returned to Full Screen');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [isActive, registerViolation, logEvent]);

  // Listen to Page Visibility & Window Focus Changes
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        awayStartTimeRef.current = Date.now();
        registerViolation('Browser tab hidden / switched application', 'Tab Changed');
      } else {
        const awayDuration = awayStartTimeRef.current ? Math.round((Date.now() - awayStartTimeRef.current) / 1000) : 0;
        awayStartTimeRef.current = null;
        logEvent('Window Visible', 'Returned to exam window', awayDuration);
      }
    };

    const handleWindowBlur = () => {
      if (!document.hidden && isActiveRef.current) {
        registerViolation('Exam window lost focus', 'Window Hidden');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isActive, registerViolation, logEvent]);

  // Prevent Navigation / Page Reload
  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      logEvent('Page Reload Attempt', 'Student tried to reload or close tab');
      e.returnValue = 'You have an active examination. Leaving or reloading may automatically submit your answers.';
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive, logEvent]);

  return {
    isFullScreen,
    requestFullScreen,
    violationsCount,
    maxAllowed,
    warningMessage,
    showWarningModal,
    setShowWarningModal,
    securityStatus,
    logEvent
  };
};
