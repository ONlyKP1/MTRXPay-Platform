import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'discreet';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDiscreet: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('mtrx-theme');
    return (stored === 'discreet' ? 'discreet' : 'light') as Theme;
  });

  useEffect(() => {
    localStorage.setItem('mtrx-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'discreet' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDiscreet: theme === 'discreet' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
