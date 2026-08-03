import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [studyMode, setStudyMode] = useState(() => {
    return localStorage.getItem('piyushdhara_study_mode') === 'true';
  });

  useEffect(() => {
    const theme = studyMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (studyMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [studyMode]);

  const toggleStudyMode = () => {
    setStudyMode((prev) => {
      const next = !prev;
      localStorage.setItem('piyushdhara_study_mode', String(next));
      const theme = next ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const applyThemeForRoute = (pathname) => {
    const isLectureRoom = pathname && (pathname.startsWith('/watch') || pathname.startsWith('/lecture'));
    if (isLectureRoom) {
      const theme = studyMode ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
      if (studyMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ studyMode, toggleStudyMode, isDark: studyMode, applyThemeForRoute }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
