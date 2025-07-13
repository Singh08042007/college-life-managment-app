
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
    <Card className="hover-lift bg-gradient-to-br from-slate-50/50 to-blue-50/50 dark:from-slate-900/50 dark:to-blue-950/50 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-responsive-lg">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
            <Star className="h-5 w-5 text-white" />
          </div>
          Quick Actions
        </CardTitle>
        <CardDescription className="text-responsive">Jump into your most common activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-24 flex flex-col gap-2 hover-lift bg-white/80 dark:bg-slate-800/80 border-2 hover:border-primary/50 hover:shadow-xl group touch-target"
              onClick={() => onTabChange(action.id)}
            >
              <div className={`p-2 bg-gradient-to-br ${action.gradient} rounded-xl group-hover:scale-110 transition-transform shadow-lg`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-sm">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
