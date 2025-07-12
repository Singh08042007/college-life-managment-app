
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/useTheme';
import { Palette, Sun, Moon, Waves, Sunset, Trees, Crown, Sparkles } from 'lucide-react';

const colorThemes = [
  { 
    id: 'default', 
    name: 'Classic Blue', 
    icon: Sparkles,
    description: 'Clean and professional',
    preview: 'bg-gradient-to-r from-blue-500 to-purple-600'
  },
  { 
    id: 'ocean', 
    name: 'Ocean Breeze', 
    icon: Waves,
    description: 'Calm and refreshing',
    preview: 'bg-gradient-to-r from-teal-400 to-blue-500'
  },
  { 
    id: 'sunset', 
    name: 'Sunset Glow', 
    icon: Sunset,
    description: 'Warm and energetic',
    preview: 'bg-gradient-to-r from-orange-400 to-pink-500'
  },
  { 
    id: 'forest', 
    name: 'Forest Green', 
    icon: Trees,
    description: 'Natural and grounding',
    preview: 'bg-gradient-to-r from-green-400 to-emerald-600'
  },
  { 
    id: 'purple', 
    name: 'Royal Purple', 
    icon: Crown,
    description: 'Elegant and luxurious',
    preview: 'bg-gradient-to-r from-purple-500 to-indigo-600'
  }
];

const ThemeSelector = () => {
  const { theme, colorTheme, toggleTheme, setColorTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="relative overflow-hidden"
      >
        {theme === 'light' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Palette className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Choose Your Theme
            </DialogTitle>
            <DialogDescription>
              Select a color theme that matches your style
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {colorThemes.map((themeOption) => {
              const IconComponent = themeOption.icon;
              const isSelected = colorTheme === themeOption.id;
              
              return (
                <Card 
                  key={themeOption.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => setColorTheme(themeOption.id as any)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5" />
                        <CardTitle className="text-sm">{themeOption.name}</CardTitle>
                      </div>
                      {isSelected && (
                        <Badge variant="default" className="text-xs">Active</Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      {themeOption.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`h-16 w-full rounded-lg ${themeOption.preview}`} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ThemeSelector;
