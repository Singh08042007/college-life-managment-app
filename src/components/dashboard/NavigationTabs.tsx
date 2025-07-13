
import React from 'react';
import { TrendingUp, Timer, Target, BookOpen, Wallet, Settings } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationTabs = ({ activeTab, onTabChange }: NavigationTabsProps) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'pomodoro', label: 'Timer', icon: Timer },
    { id: 'tasks', label: 'Tasks', icon: Target },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto padding-responsive">
        <nav className="flex gap-responsive overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 rounded-t-lg touch-target ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/10 shadow-lg'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground hover:bg-muted/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavigationTabs;
