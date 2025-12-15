
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import TaskManager from './TaskManager';
import ProfileManager from './ProfileManager';
import CourseManager from './CourseManager';
import BudgetManager from './BudgetManager';
import PomodoroTimer from './PomodoroTimer';
import YearlyTracker from './YearlyTracker';
import CGPACalculator from './CGPACalculator';
import DashboardHeader from './dashboard/DashboardHeader';
import NavigationTabs from './dashboard/NavigationTabs';
import OverviewTab from './dashboard/OverviewTab';

interface DashboardProps {
  user: User;
  session: Session;
}

const Dashboard = ({ user, session }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    totalCourses: 0,
    upcomingDeadlines: 0,
    totalBudget: 0,
    totalExpenses: 0
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, [user.id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch tasks stats
      const { data: tasks } = await supabase
        .from('tasks')
        .select('status')
        .eq('user_id', user.id);

      // Fetch courses stats
      const { data: courses } = await supabase
        .from('courses')
        .select('id')
        .eq('user_id', user.id);

      // Fetch upcoming deadlines
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const { data: upcomingTasks } = await supabase
        .from('tasks')
        .select('due_date')
        .eq('user_id', user.id)
        .gte('due_date', today.toISOString().split('T')[0])
        .lte('due_date', nextWeek.toISOString().split('T')[0]);

      // Fetch budget stats
      const { data: budgets } = await supabase
        .from('budgets')
        .select('amount')
        .eq('user_id', user.id);

      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id);

      setStats({
        totalTasks: tasks?.length || 0,
        completedTasks: tasks?.filter(task => task.status === 'completed').length || 0,
        totalCourses: courses?.length || 0,
        upcomingDeadlines: upcomingTasks?.length || 0,
        totalBudget: budgets?.reduce((sum, b) => sum + Number(b.amount), 0) || 0,
        totalExpenses: expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Error signing out');
      } else {
        toast.success('Signed out successfully');
      }
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const userName = profile?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/30 transition-colors duration-300">
      <DashboardHeader
        profile={profile}
        userEmail={user.email || ''}
        onSignOut={handleSignOut}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto padding-responsive py-8">
        {activeTab === 'overview' && (
          <OverviewTab 
            userName={userName}
            stats={stats}
            onTabChange={setActiveTab}
          />
        )}
        {activeTab === 'tracker' && (
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-responsive-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Yearly Study Tracker</h2>
              <p className="text-responsive text-muted-foreground">
                Track your daily study progress and visualize your yearly achievements
              </p>
            </div>
            <YearlyTracker userId={user.id} />
          </div>
        )}
        {activeTab === 'cgpa' && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-responsive-xl font-bold mb-2 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">CGPA Calculator</h2>
              <p className="text-responsive text-muted-foreground">
                Calculate your predicted CGPA based on your marks
              </p>
            </div>
            <CGPACalculator />
          </div>
        )}
        {activeTab === 'pomodoro' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-responsive-xl font-bold mb-2">Focus Timer</h2>
              <p className="text-responsive text-muted-foreground">
                Use the Pomodoro Technique to boost your productivity and maintain focus
              </p>
            </div>
            <PomodoroTimer />
          </div>
        )}
        {activeTab === 'tasks' && <TaskManager userId={user.id} onStatsUpdate={fetchStats} />}
        {activeTab === 'courses' && <CourseManager userId={user.id} onStatsUpdate={fetchStats} />}
        {activeTab === 'budget' && <BudgetManager userId={user.id} onStatsUpdate={fetchStats} />}
        {activeTab === 'profile' && <ProfileManager user={user} onProfileUpdate={fetchProfile} />}
      </main>
    </div>
  );
};

export default Dashboard;
