import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'carbon' | 'nordic';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('clinova-theme');
    return (saved === 'carbon' ? 'carbon' : 'nordic') as Theme;
  });

  useEffect(() => {
    localStorage.setItem('clinova-theme', theme);
    if (theme === 'nordic') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'carbon' ? 'nordic' : 'carbon'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'carbon', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
