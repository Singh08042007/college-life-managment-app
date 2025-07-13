
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

const ThemeSelector = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative overflow-hidden p-1.5 md:p-2"
    >
      {theme === 'light' ? (
        <Moon className="h-3 w-3 md:h-4 md:w-4" />
      ) : (
        <Sun className="h-3 w-3 md:h-4 md:w-4" />
      )}
    </Button>
  );
};

export default ThemeSelector;
