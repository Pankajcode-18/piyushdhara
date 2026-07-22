import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [studyMode, setStudyMode] = useState(() => {
    return localStorage.getItem('piyushdhara_study_mode') === 'true';
  });

  const toggleStudyMode = () => {
    setStudyMode((prev) => {
      const next = !prev;
      localStorage.setItem('piyushdhara_study_mode', String(next));
      return next;
    });
  };

  const applyThemeForRoute = (pathname) => {
    if (pathname.startsWith('/watch')) {
      document.documentElement.setAttribute('data-theme', studyMode ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
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
