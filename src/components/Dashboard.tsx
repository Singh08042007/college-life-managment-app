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
  Menu,
  Timer
} from 'lucide-react';
import { toast } from 'sonner';
import TaskManager from './TaskManager';
import ProfileManager from './ProfileManager';
import CourseManager from './CourseManager';
import BudgetManager from './BudgetManager';
import PomodoroTimer from './PomodoroTimer';
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
    <div className="space-responsive">
      {/* Enhanced Welcome Header */}
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
                  Hello, {profile?.full_name || user.email?.split('@')[0]}!
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-responsive">
        <Card className="hover-lift hover-glow bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Target className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.totalTasks}</p>
                <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400 font-medium">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-300">{stats.completedTasks}</p>
                <p className="text-xs md:text-sm text-green-600 dark:text-green-400 font-medium">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        
        <Card className="hover-lift hover-glow bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.totalCourses}</p>
                <p className="text-xs md:text-sm text-purple-600 dark:text-purple-400 font-medium">Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg">
                <Clock className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-orange-700 dark:text-orange-300">{stats.upcomingDeadlines}</p>
                <p className="text-xs md:text-sm text-orange-600 dark:text-orange-400 font-medium">Due Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900 border-teal-200 dark:border-teal-800">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg">
                <Wallet className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-teal-700 dark:text-teal-300">₹{stats.totalBudget.toFixed(0)}</p>
                <p className="text-xs md:text-sm text-teal-600 dark:text-teal-400 font-medium">Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift hover-glow bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
                <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-red-700 dark:text-red-300">₹{stats.totalExpenses.toFixed(0)}</p>
                <p className="text-xs md:text-sm text-red-600 dark:text-red-400 font-medium">Expenses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 hover-lift bg-white/80 dark:bg-slate-800/80 border-2 hover:border-primary/50 hover:shadow-xl group touch-target"
                onClick={() => setActiveTab('tasks')}
              >
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-sm">Add Task</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 hover-lift bg-white/80 dark:bg-slate-800/80 border-2 hover:border-primary/50 hover:shadow-xl group touch-target"
                onClick={() => setActiveTab('courses')}
              >
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-sm">Add Course</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 hover-lift bg-white/80 dark:bg-slate-800/80 border-2 hover:border-primary/50 hover:shadow-xl group touch-target"
                onClick={() => setActiveTab('budget')}
              >
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-sm">Manage Budget</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2 hover-lift bg-white/80 dark:bg-slate-800/80 border-2 hover:border-primary/50 hover:shadow-xl group touch-target"
                onClick={() => setActiveTab('profile')}
              >
                <div className="p-2 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl group-hover:scale-110 transition-transform shadow-lg">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-sm">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:from-slate-950 dark:via-blue-950/30 dark:to-indigo-950/30 transition-colors duration-300">
      {/* Enhanced Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto padding-responsive">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg hover-lift">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-responsive-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Campus Life
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-responsive">
              <ThemeSelector />
              
              <Button variant="ghost" size="sm" className="relative hover-lift hidden md:flex touch-target">
                <Bell className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
              </Button>
              
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 ring-2 ring-purple-200 dark:ring-purple-800 hover-lift">
                  <AvatarImage src={profile?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium">
                    {profile?.full_name ? getInitials(profile.full_name) : getInitials(user.email || 'U')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut} 
                  className="text-muted-foreground hover:text-foreground hidden md:flex touch-target"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden touch-target"
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
          <div className="padding-responsive space-y-2">
            <Button variant="ghost" size="sm" className="w-full justify-start touch-target">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start text-muted-foreground hover:text-foreground touch-target">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}

      {/* Enhanced Navigation Tabs */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-b border-white/20 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto padding-responsive">
          <nav className="flex gap-responsive overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'pomodoro', label: 'Timer', icon: Timer },
              { id: 'tasks', label: 'Tasks', icon: Target },
              { id: 'courses', label: 'Courses', icon: BookOpen },
              { id: 'budget', label: 'Budget', icon: Wallet },
              { id: 'profile', label: 'Profile', icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto padding-responsive py-8">
        {activeTab === 'overview' && renderOverview()}
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
