import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'obsidian' | 'nordic';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('medtutor-theme');
    return (saved === 'nordic' ? 'nordic' : 'obsidian') as Theme;
  });

  useEffect(() => {
    localStorage.setItem('medtutor-theme', theme);
    if (theme === 'nordic') {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    } else {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'obsidian' ? 'nordic' : 'obsidian'));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'obsidian', toggleTheme }}>
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
