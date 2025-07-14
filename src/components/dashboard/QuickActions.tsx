
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, BookOpen, Wallet, Settings, Star } from 'lucide-react';

interface QuickActionsProps {
  onTabChange: (tab: string) => void;
}

const QuickActions = ({ onTabChange }: QuickActionsProps) => {
  const actions = [
    {
      id: 'tasks',
      label: 'Add Task',
      icon: Plus,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'courses',
      label: 'Add Course',
      icon: BookOpen,
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'budget',
      label: 'Manage Budget',
      icon: Wallet,
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 'profile',
      label: 'Settings',
      icon: Settings,
      gradient: 'from-gray-500 to-slate-600'
    }
  ];

  return (
    <Card className="glass-card hover-lift interactive-card relative overflow-hidden border-0 shadow-lg">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-5 rounded-full blur-3xl"></div>
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-3 text-responsive-lg">
          <div className="relative group">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg hover-glow">
              <Star className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-xl blur-lg animate-pulse-glow"></div>
          </div>
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
            Quick Actions
          </span>
        </CardTitle>
        <CardDescription className="text-responsive">
          Jump into your most common activities with ease
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-28 flex flex-col gap-3 glass-card hover-lift bg-white/60 dark:bg-slate-800/60 border-2 border-transparent hover:border-primary/30 hover-glow group touch-target relative overflow-hidden"
              onClick={() => onTabChange(action.id)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Button background effect */}
              <div className="absolute inset-0 bg-gradient-subtle opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className={`relative p-3 bg-gradient-to-br ${action.gradient} rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg hover-glow`}>
                <action.icon className="h-6 w-6 text-white" />
                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <span className="font-semibold text-sm group-hover:text-primary transition-colors duration-300 relative z-10">
                {action.label}
              </span>
              
              {/* Ripple effect on click */}
              <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-active:opacity-100 transition-opacity duration-100"></div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
