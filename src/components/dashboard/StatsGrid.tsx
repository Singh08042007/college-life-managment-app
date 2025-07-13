
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, TrendingUp, BookOpen, Clock, Wallet, DollarSign } from 'lucide-react';

interface Stats {
  totalTasks: number;
  completedTasks: number;
  totalCourses: number;
  upcomingDeadlines: number;
  totalBudget: number;
  totalExpenses: number;
}

interface StatsGridProps {
  stats: Stats;
}

const StatsGrid = ({ stats }: StatsGridProps) => {
  const statsData = [
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: Target,
      gradient: 'from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
      border: 'border-blue-200 dark:border-blue-800',
      iconBg: 'from-blue-500 to-blue-600',
      textColor: 'text-blue-700 dark:text-blue-300',
      subTextColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Completed',
      value: stats.completedTasks,
      icon: TrendingUp,
      gradient: 'from-green-50 to-green-100 dark:from-green-950 dark:to-green-900',
      border: 'border-green-200 dark:border-green-800',
      iconBg: 'from-green-500 to-green-600',
      textColor: 'text-green-700 dark:text-green-300',
      subTextColor: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      gradient: 'from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900',
      border: 'border-purple-200 dark:border-purple-800',
      iconBg: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-700 dark:text-purple-300',
      subTextColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      label: 'Due Soon',
      value: stats.upcomingDeadlines,
      icon: Clock,
      gradient: 'from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900',
      border: 'border-orange-200 dark:border-orange-800',
      iconBg: 'from-orange-500 to-orange-600',
      textColor: 'text-orange-700 dark:text-orange-300',
      subTextColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      label: 'Budget',
      value: `₹${stats.totalBudget.toFixed(0)}`,
      icon: Wallet,
      gradient: 'from-teal-50 to-teal-100 dark:from-teal-950 dark:to-teal-900',
      border: 'border-teal-200 dark:border-teal-800',
      iconBg: 'from-teal-500 to-teal-600',
      textColor: 'text-teal-700 dark:text-teal-300',
      subTextColor: 'text-teal-600 dark:text-teal-400'
    },
    {
      label: 'Expenses',
      value: `₹${stats.totalExpenses.toFixed(0)}`,
      icon: DollarSign,
      gradient: 'from-red-50 to-red-100 dark:from-red-950 dark:to-red-900',
      border: 'border-red-200 dark:border-red-800',
      iconBg: 'from-red-500 to-red-600',
      textColor: 'text-red-700 dark:text-red-300',
      subTextColor: 'text-red-600 dark:text-red-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-responsive">
      {statsData.map((stat, index) => (
        <Card key={index} className={`hover-lift hover-glow bg-gradient-to-br ${stat.gradient} ${stat.border}`}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className={`p-3 bg-gradient-to-br ${stat.iconBg} rounded-xl shadow-lg`}>
                <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <p className={`text-2xl md:text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                <p className={`text-xs md:text-sm ${stat.subTextColor} font-medium`}>{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
