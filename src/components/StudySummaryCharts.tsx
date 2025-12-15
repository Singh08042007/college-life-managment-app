import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, getDay, isWithinInterval } from 'date-fns';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Clock } from 'lucide-react';

interface StudySession {
  id: string;
  date: string;
  duration_minutes: number;
  notes: string | null;
  created_at: string | null;
}

interface StudySummaryChartsProps {
  sessions: StudySession[];
}

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

const StudySummaryCharts = ({ sessions }: StudySummaryChartsProps) => {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');

  // Weekly data - last 7 days
  const weeklyData = useMemo(() => {
    const today = new Date();
    const days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today
    });

    return days.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const dayMinutes = sessions
        .filter(s => s.date === dateKey)
        .reduce((sum, s) => sum + s.duration_minutes, 0);
      
      return {
        name: format(day, 'EEE'),
        fullDate: format(day, 'MMM d'),
        minutes: dayMinutes,
        hours: Math.round(dayMinutes / 60 * 10) / 10
      };
    });
  }, [sessions]);

  // Monthly data - last 4 weeks
  const monthlyData = useMemo(() => {
    const today = new Date();
    const weeks = eachWeekOfInterval({
      start: subDays(today, 27),
      end: today
    }, { weekStartsOn: 1 });

    return weeks.map((weekStart, index) => {
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
      const weekMinutes = sessions
        .filter(s => {
          const sessionDate = new Date(s.date);
          return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd });
        })
        .reduce((sum, s) => sum + s.duration_minutes, 0);

      return {
        name: `Week ${index + 1}`,
        range: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`,
        minutes: weekMinutes,
        hours: Math.round(weekMinutes / 60 * 10) / 10
      };
    });
  }, [sessions]);

  // Day of week distribution
  const dayDistribution = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const distribution = Array(7).fill(0);

    sessions.forEach(s => {
      const dayIndex = getDay(new Date(s.date));
      distribution[dayIndex] += s.duration_minutes;
    });

    return days.map((name, index) => ({
      name,
      minutes: distribution[index],
      hours: Math.round(distribution[index] / 60 * 10) / 10
    }));
  }, [sessions]);

  // Weekly stats
  const weeklyStats = useMemo(() => {
    const totalMinutes = weeklyData.reduce((sum, d) => sum + d.minutes, 0);
    const avgPerDay = Math.round(totalMinutes / 7);
    const maxDay = weeklyData.reduce((max, d) => d.minutes > max.minutes ? d : max, weeklyData[0]);
    const studyDays = weeklyData.filter(d => d.minutes > 0).length;
    
    return { totalMinutes, avgPerDay, maxDay, studyDays };
  }, [weeklyData]);

  // Monthly stats
  const monthlyStats = useMemo(() => {
    const totalMinutes = monthlyData.reduce((sum, d) => sum + d.minutes, 0);
    const avgPerWeek = Math.round(totalMinutes / monthlyData.length);
    const maxWeek = monthlyData.reduce((max, d) => d.minutes > max.minutes ? d : max, monthlyData[0]);
    const trend = monthlyData.length > 1 
      ? monthlyData[monthlyData.length - 1].minutes - monthlyData[0].minutes 
      : 0;
    
    return { totalMinutes, avgPerWeek, maxWeek, trend };
  }, [monthlyData]);

  const formatMinutes = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
          <p className="font-medium text-foreground">{payload[0].payload.fullDate || payload[0].payload.range || label}</p>
          <p className="text-primary font-bold">{formatMinutes(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card border-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 text-white">
            <BarChart3 className="h-5 w-5" />
          </div>
          Study Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        <Tabs value={view} onValueChange={(v) => setView(v as 'weekly' | 'monthly')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="weekly" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              Weekly View
            </TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white">
              Monthly View
            </TabsTrigger>
          </TabsList>

          {/* Weekly View */}
          <TabsContent value="weekly" className="space-y-6 animate-fade-in">
            {/* Weekly Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total', value: formatMinutes(weeklyStats.totalMinutes), color: 'from-violet-500 to-purple-500' },
                { label: 'Daily Avg', value: formatMinutes(weeklyStats.avgPerDay), color: 'from-cyan-500 to-blue-500' },
                { label: 'Best Day', value: weeklyStats.maxDay?.name || '-', color: 'from-emerald-500 to-green-500' },
                { label: 'Study Days', value: `${weeklyStats.studyDays}/7`, color: 'from-amber-500 to-orange-500' },
              ].map((stat, i) => (
                <div key={i} className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                  <p className="text-xs opacity-80">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Daily Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="minutes" 
                    fill="url(#weeklyGradient)" 
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Monthly View */}
          <TabsContent value="monthly" className="space-y-6 animate-fade-in">
            {/* Monthly Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total', value: formatMinutes(monthlyStats.totalMinutes), color: 'from-cyan-500 to-blue-500' },
                { label: 'Weekly Avg', value: formatMinutes(monthlyStats.avgPerWeek), color: 'from-violet-500 to-purple-500' },
                { label: 'Best Week', value: monthlyStats.maxWeek?.name || '-', color: 'from-emerald-500 to-green-500' },
                { label: 'Trend', value: monthlyStats.trend >= 0 ? `+${formatMinutes(monthlyStats.trend)}` : `-${formatMinutes(Math.abs(monthlyStats.trend))}`, color: monthlyStats.trend >= 0 ? 'from-emerald-500 to-green-500' : 'from-red-500 to-rose-500' },
              ].map((stat, i) => (
                <div key={i} className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                  <p className="text-xs opacity-80">{stat.label}</p>
                  <p className="text-lg font-bold">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Weekly Area Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="#06b6d4" 
                    fill="url(#monthlyGradient)"
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Day of Week Distribution */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Study Pattern by Day
                </h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dayDistribution.filter(d => d.minutes > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="minutes"
                      >
                        {dayDistribution.filter(d => d.minutes > 0).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Daily Breakdown
                </h4>
                <div className="space-y-2">
                  {dayDistribution.map((day, i) => (
                    <div key={day.name} className="flex items-center gap-2">
                      <span className="text-xs w-8">{day.name}</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min(100, (day.minutes / Math.max(...dayDistribution.map(d => d.minutes), 1)) * 100)}%`,
                            background: `linear-gradient(to right, ${COLORS[i]}, ${COLORS[(i + 1) % COLORS.length]})`
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-12 text-right">{formatMinutes(day.minutes)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StudySummaryCharts;
