
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GraduationCap, LogOut, Menu } from 'lucide-react';
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
      <header className="bg-gradient-to-r from-white/90 via-white/95 to-white/90 dark:from-slate-900/90 dark:via-slate-900/95 dark:to-slate-900/90 backdrop-blur-xl shadow-lg border-b border-gradient-to-r from-purple-200/30 via-pink-200/30 to-purple-200/30 dark:from-purple-800/30 dark:via-pink-800/30 dark:to-purple-800/30 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 group">
                <div className="relative p-2 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-600 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 group-hover:rotate-3">
                  <GraduationCap className="h-5 w-5 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent transition-all duration-300 hover:from-purple-500 hover:to-pink-500">
                    Campus Life
                  </h1>
                  <div className="h-0.5 w-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <ThemeSelector />
              
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <Avatar className="h-9 w-9 ring-2 ring-purple-200/50 dark:ring-purple-700/50 hover:ring-purple-300/70 dark:hover:ring-purple-600/70 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/20">
                    <AvatarImage src={profile?.avatar_url} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 text-white text-sm font-semibold shadow-inner">
                      {profile?.full_name ? getInitials(profile.full_name) : getInitials(userEmail || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-0 group-hover:opacity-20 blur transition-all duration-300"></div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onSignOut} 
                  className="text-muted-foreground hover:text-foreground hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800 hidden md:flex touch-target transition-all duration-300 rounded-lg border border-transparent"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMobileMenuToggle}
                  className="md:hidden touch-target hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-300 rounded-lg"
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
        <div className="md:hidden bg-gradient-to-r from-white/95 via-white/98 to-white/95 dark:from-slate-900/95 dark:via-slate-900/98 dark:to-slate-900/95 backdrop-blur-lg border-b border-purple-200/20 dark:border-purple-800/20 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onSignOut} 
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-red-50 dark:hover:bg-red-950/20 touch-target transition-all duration-300 rounded-lg group"
            >
              <LogOut className="h-4 w-4 mr-3 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">Sign Out</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHeader;
