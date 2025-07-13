
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GraduationCap, Bell, LogOut, Menu } from 'lucide-react';
import ThemeSelector from '../ThemeSelector';

interface DashboardHeaderProps {
  profile: any;
  userEmail: string;
  onSignOut: () => void;
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

const DashboardHeader = ({ 
  profile, 
  userEmail, 
  onSignOut, 
  mobileMenuOpen, 
  onMobileMenuToggle 
}: DashboardHeaderProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
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
                    {profile?.full_name ? getInitials(profile.full_name) : getInitials(userEmail || 'U')}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onSignOut} 
                  className="text-muted-foreground hover:text-foreground hidden md:flex touch-target"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMobileMenuToggle}
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
            <Button variant="ghost" size="sm" onClick={onSignOut} className="w-full justify-start text-muted-foreground hover:text-foreground touch-target">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHeader;
