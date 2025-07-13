
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface WelcomeHeaderProps {
  userName: string;
}

const WelcomeHeader = ({ userName }: WelcomeHeaderProps) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 border-0 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10"></div>
      <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 h-24 w-24 md:h-32 md:w-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 h-32 w-32 md:h-40 md:w-40 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl"></div>
      <CardContent className="relative z-10 padding-responsive">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="text-sm font-medium">
                Welcome back!
              </Badge>
            </div>
            <div>
              <h1 className="text-responsive-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Hello, {userName}!
              </h1>
              <p className="text-responsive text-muted-foreground mt-2">
                Ready to make today productive and focused?
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <Card className="bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground">Today</p>
                <p className="text-lg font-semibold">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeHeader;
