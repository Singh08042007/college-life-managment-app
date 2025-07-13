
import React, { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Target, 
  Settings, 
  LogOut,
  Plus,
  Bell,
  TrendingUp,
  Clock,
  Star,
  GraduationCap,
  Wallet,
  DollarSign,
  Sparkles,
  Menu
} from 'lucide-react';
import { toast } from 'sonner';
import TaskManager from './TaskManager';
import ProfileManager from './ProfileManager';
import CourseManager from './CourseManager';
import BudgetManager from './BudgetManager';
import ThemeSelector from './ThemeSelector';

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const renderOverview = () => (
    <div className="space-y-6 md:space-y-8">
      {/* Enhanced Welcome Header - Mobile Responsive */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl md:rounded-3xl p-4 md:p-8 text-white overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-pink-600/90 to-blue-600/90"></div>
        <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 h-16 w-16 md:h-32 md:w-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 md:-bottom-8 md:-left-8 h-20 w-20 md:h-40 md:w-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-1.5 md:p-2 bg-white/20 rounded-lg md:rounded-xl backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 md:h-6 md:w-6" />
                </div>
                <span className="text-xs md:text-sm font-medium opacity-90 bg-white/20 px-2 md:px-3 py-1 rounded-full backdrop-blur-sm">
                  Welcome back!
                </span>
              </div>
              <h2 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text">
                {profile?.full_name || user.email?.split('@')[0]}
              </h2>
              <p className="opacity-90 text-sm md:text-lg font-light">Ready to make today productive?</p>
            </div>
            <div className="text-left md:text-right">
              <div className="text-xs md:text-sm opacity-90 bg-white/20 px-3 md:px-4 py-2 rounded-lg md:rounded-xl backdrop-blur-sm">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid - Mobile Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-6">
        <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-blue-950 dark:via-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
          <CardContent className="p-3 md:p-6 relative">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="p-2 md:p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl md:rounded-2xl shadow-lg self-start">
                <Target className="h-4 w-4 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <p className="text-xl md:text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalTasks}</p>
                <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-green-50 via-green-100 to-green-200 dark:from-green-950 dark:via-green-900 dark:to-green-800 border-green-200 dark:border-green-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5"></div>
          <CardContent className="p-3 md:p-6 relative">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="p-2 md:p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl md:rounded-2xl shadow-lg self-start">
                <TrendingUp className="h-4 w-4 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <p className="text-xl md:text-3xl font-bold text-green-900 dark:text-green-100">{stats.completedTasks}</p>
                <p className="text-xs md:text-sm text-green-600 dark:text-green-400 font-medium">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 dark:from-purple-950 dark:via-purple-900 dark:to-purple-800 border-purple-200 dark:border-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5"></div>
          <CardContent className="p-3 md:p-6 relative">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="p-2 md:p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl md:rounded-2xl shadow-lg self-start">
                <BookOpen className="h-4 w-4 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <p className="text-xl md:text-3xl font-bold text-purple-900 dark:text-purple-100">{stats.totalCourses}</p>
                <p className="text-xs md:text-sm text-purple-600 dark:text-purple-400 font-medium">Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 dark:from-orange-950 dark:via-orange-900 dark:to-orange-800 border-orange-200 dark:border-orange-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/5 to-red-600/5"></div>
          <CardContent className="p-3 md:p-6 relative">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="p-2 md:p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl md:rounded-2xl shadow-lg self-start">
                <Clock className="h-4 w-4 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <p className="text-xl md:text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.upcomingDeadlines}</p>
                <p className="text-xs md:text-sm text-orange-600 dark:text-orange-400 font-medium">Due Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-teal-50 via-teal-100 to-teal-200 dark:from-teal-950 dark:via-teal-900 dark:to-teal-800 border-teal-200 dark:border-teal-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 to-cyan-600/5"></div>
          <CardContent className="p-3 md:p-6 relative">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="p-2 md:p-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl md:rounded-2xl shadow-lg self-start">
                <Wallet className="h-4 w-4 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <p className="text-xl md:text-3xl font-bold text-teal-900 dark:text-teal-100">₹{stats.totalBudget.toFixed(0)}</p>
                <p className="text-xs md:text-sm text-teal-600 dark:text-teal-400 font-medium">Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-red-50 via-red-100 to-red-200 dark:from-red-950 dark:via-red-900 dark:to-red-800 border-red-200 dark:border-red-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-pink-600/5"></div>
          <CardContent className="p-3 md:p-6 relative">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <div className="p-2 md:p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl md:rounded-2xl shadow-lg self-start">
                <DollarSign className="h-4 w-4 md:h-7 md:w-7 text-white" />
              </div>
              <div>
                <p className="text-xl md:text-3xl font-bold text-red-900 dark:text-red-100">₹{stats.totalExpenses.toFixed(0)}</p>
                <p className="text-xs md:text-sm text-red-600 dark:text-red-400 font-medium">Expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Actions - Mobile Responsive */}
      <Card className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 border-slate-200 dark:border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
              <Star className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            Quick Actions
          </CardTitle>
          <CardDescription className="text-sm md:text-base">Jump into your most common activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Button
              variant="outline"
              className="h-20 md:h-28 flex flex-col gap-2 md:gap-3 hover:scale-110 transition-all duration-300 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 border-2 hover:border-primary/50 hover:shadow-xl group"
              onClick={() => setActiveTab('tasks')}
            >
              <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform">
                <Plus className="h-5 w-5 md:h-8 md:w-8 text-white" />
              </div>
              <span className="font-semibold text-xs md:text-sm">Add Task</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 md:h-28 flex flex-col gap-2 md:gap-3 hover:scale-110 transition-all duration-300 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 border-2 hover:border-primary/50 hover:shadow-xl group"
              onClick={() => setActiveTab('courses')}
            >
              <div className="p-2 md:p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform">
                <BookOpen className="h-5 w-5 md:h-8 md:w-8 text-white" />
              </div>
              <span className="font-semibold text-xs md:text-sm">Add Course</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 md:h-28 flex flex-col gap-2 md:gap-3 hover:scale-110 transition-all duration-300 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 border-2 hover:border-primary/50 hover:shadow-xl group"
              onClick={() => setActiveTab('budget')}
            >
              <div className="p-2 md:p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform">
                <Wallet className="h-5 w-5 md:h-8 md:w-8 text-white" />
              </div>
              <span className="font-semibold text-xs md:text-sm">Manage Budget</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 md:h-28 flex flex-col gap-2 md:gap-3 hover:scale-110 transition-all duration-300 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 border-2 hover:border-primary/50 hover:shadow-xl group"
              onClick={() => setActiveTab('profile')}
            >
              <div className="p-2 md:p-3 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform">
                <Settings className="h-5 w-5 md:h-8 md:w-8 text-white" />
              </div>
              <span className="font-semibold text-xs md:text-sm">Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 transition-colors duration-300">
      {/* Enhanced Header - Mobile Responsive */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-1.5 md:p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg md:rounded-xl shadow-lg">
                  <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-white" />
                </div>
                <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Campus Life
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <ThemeSelector />
              
              <Button variant="ghost" size="sm" className="relative hover:bg-slate-100 dark:hover:bg-slate-800 hidden md:flex">
                <Bell className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-7 w-7 md:h-8 md:w-8 ring-2 ring-purple-200 dark:ring-purple-800 transition-all hover:ring-4">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs md:text-sm font-medium">
                    {profile?.full_name ? getInitials(profile.full_name) : getInitials(user.email || 'U')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut} 
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hidden md:flex"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-white/20 dark:border-slate-700/50">
          <div className="px-4 py-2 space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Navigation Tabs - Mobile Responsive */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 md:space-x-8 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'tasks', label: 'Tasks', icon: Target },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'budget', label: 'Budget', icon: Wallet },
              { id: 'profile', label: 'Profile', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 md:py-4 px-3 md:px-4 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap transition-all duration-300 rounded-t-lg ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/50 shadow-lg'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-gray-800/50'
                }`}
              >
                <tab.icon className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content - Mobile Responsive */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'tasks' && <TaskManager userId={user.id} onStatsUpdate={fetchStats} />}
        {activeTab === 'courses' && <CourseManager userId={user.id} onStatsUpdate={fetchStats} />}
        {activeTab === 'budget' && <BudgetManager userId={user.id} onStatsUpdate={fetchStats} />}
        {activeTab === 'profile' && <ProfileManager user={user} onProfileUpdate={fetchProfile} />}
      </main>
    </div>
  );
};

export default Dashboard;
