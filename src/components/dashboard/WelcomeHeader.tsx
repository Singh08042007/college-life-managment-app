
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface WelcomeHeaderProps {
  userName: string;
}

const WelcomeHeader = ({ userName }: WelcomeHeaderProps) => {
  return (
    <Card className="relative overflow-hidden glass-card border-0 shadow-xl hover-lift interactive-card">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-50"></div>
      <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 h-24 w-24 md:h-32 md:w-32 bg-gradient-primary opacity-20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 h-32 w-32 md:h-40 md:w-40 bg-gradient-secondary opacity-20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-primary opacity-5 rounded-full blur-3xl animate-pulse"></div>
      
      <CardContent className="relative z-10 padding-responsive">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="p-4 bg-gradient-primary rounded-2xl shadow-lg hover-glow">
                  <Sparkles className="h-7 w-7 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-2xl blur-xl animate-pulse-glow"></div>
              </div>
              <Badge variant="secondary" className="text-sm font-semibold bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover-scale">
                ✨ Welcome back!
              </Badge>
            </div>
            
            <div>
              <h1 className="text-responsive-xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent mb-2">
                Hello, {userName}! 👋
              </h1>
              <p className="text-responsive text-muted-foreground leading-relaxed">
                Ready to make today productive and focused? Let's achieve your goals together.
              </p>
            </div>
            
            {/* Progress bar for daily goals */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-muted-foreground">Daily Progress</span>
                <span className="font-semibold text-primary">72%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary rounded-full transition-all duration-1000 shimmer" 
                  style={{ width: '72%' }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <Card className="glass-card bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/30 dark:border-slate-700/30 hover-glow">
              <CardContent className="p-5">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Today</p>
                  <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Active Session</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeHeader;
