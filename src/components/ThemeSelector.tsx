
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Palette, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const colorThemes = [
  { value: 'default', label: 'Default', color: 'bg-blue-500' },
  { value: 'blue', label: 'Ocean Blue', color: 'bg-blue-600' },
  { value: 'green', label: 'Forest Green', color: 'bg-green-600' },
  { value: 'purple', label: 'Royal Purple', color: 'bg-purple-600' },
  { value: 'orange', label: 'Sunset Orange', color: 'bg-orange-600' },
];

const ThemeSelector = () => {
  const { theme, colorTheme, toggleTheme, setColorTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center space-x-2">
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

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative overflow-hidden p-1.5 md:p-2"
          >
            <Palette className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Color Themes</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {colorThemes.map((themeOption) => (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setColorTheme(themeOption.value as any)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${themeOption.color}`} />
                <span>{themeOption.label}</span>
              </div>
              {colorTheme === themeOption.value && (
                <Check className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeSelector;
