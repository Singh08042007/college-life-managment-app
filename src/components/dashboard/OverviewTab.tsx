
import React from 'react';
import { Timer } from 'lucide-react';
import WelcomeHeader from './WelcomeHeader';
import StatsGrid from './StatsGrid';
import QuickActions from './QuickActions';
import PomodoroTimer from '../PomodoroTimer';

interface Stats {
  totalTasks: number;
  completedTasks: number;
  totalCourses: number;
  upcomingDeadlines: number;
  totalBudget: number;
  totalExpenses: number;
}

interface OverviewTabProps {
  userName: string;
  stats: Stats;
  onTabChange: (tab: string) => void;
}

const OverviewTab = ({ userName, stats, onTabChange }: OverviewTabProps) => {
  return (
    <div className="space-responsive">
      <WelcomeHeader userName={userName} />
      <StatsGrid stats={stats} />
      
      {/* Pomodoro Timer and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-responsive">
        {/* Pomodoro Timer */}
        <div className="space-y-4">
          <h2 className="text-responsive-lg font-semibold flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            Focus Timer
          </h2>
          <PomodoroTimer />
        </div>

        {/* Quick Actions */}
        <QuickActions onTabChange={onTabChange} />
      </div>
    </div>
  );
};

export default OverviewTab;
