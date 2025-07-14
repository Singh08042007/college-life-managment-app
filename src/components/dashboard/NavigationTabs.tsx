
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
    <div className="glass-card border-0 shadow-lg">
      <div className="max-w-7xl mx-auto padding-responsive">
        <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group relative flex items-center gap-3 py-4 px-6 font-medium text-sm whitespace-nowrap transition-all duration-300 rounded-xl touch-target ${
                activeTab === tab.id
                  ? 'bg-gradient-primary text-white shadow-lg hover-glow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-gradient-subtle border border-transparent hover:border-border/50'
              }`}
            >
              <div className={`relative ${activeTab === tab.id ? 'animate-pulse-glow' : ''}`}>
                <tab.icon className={`h-5 w-5 transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'text-white drop-shadow-sm' 
                    : 'group-hover:scale-110 group-hover:text-primary'
                }`} />
                {activeTab === tab.id && (
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
                )}
              </div>
              <span className={`hidden sm:inline transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'text-white font-semibold' 
                  : 'group-hover:font-medium'
              }`}>
                {tab.label}
              </span>
              
              {/* Active indicator */}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/50 rounded-full"></div>
              )}
              
              {/* Hover effect */}
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-white/10 to-transparent' 
                  : 'bg-gradient-subtle opacity-0 group-hover:opacity-100'
              }`}></div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default NavigationTabs;
