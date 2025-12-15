import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Play, Pause, Square, Clock, BookOpen, Target, TrendingUp, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';
import StudySummaryCharts from './StudySummaryCharts';
interface StudySession {
  id: string;
  date: string;
  duration_minutes: number;
  notes: string | null;
  created_at: string | null;
}

interface YearlyTrackerProps {
  userId: string;
}

const YearlyTracker = ({ userId }: YearlyTrackerProps) => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSessions, setSelectedSessions] = useState<StudySession[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    fetchSessions();
  }, [userId]);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now() - elapsedSeconds * 1000;
      intervalRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const fetchSessions = async () => {
    const oneYearAgo = format(subDays(new Date(), 365), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('date', oneYearAgo)
      .order('date', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching sessions', description: error.message, variant: 'destructive' });
    } else {
      setSessions(data || []);
    }
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    if (elapsedSeconds < 60) {
      toast({ title: 'Session too short', description: 'Study for at least 1 minute to save.', variant: 'destructive' });
      setIsRunning(false);
      setElapsedSeconds(0);
      return;
    }
    setIsRunning(false);
    setShowNotesModal(true);
  };

  const handleSaveSession = async () => {
    const durationMinutes = Math.floor(elapsedSeconds / 60);
    
    const { error } = await supabase.from('study_sessions').insert({
      user_id: userId,
      date: format(new Date(), 'yyyy-MM-dd'),
      duration_minutes: durationMinutes,
      notes: notes.trim() || null,
    });

    if (error) {
      toast({ title: 'Error saving session', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Session saved!', description: `${durationMinutes} minutes recorded.` });
      setElapsedSeconds(0);
      setNotes('');
      setShowNotesModal(false);
      fetchSessions();
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate heatmap data
  const generateHeatmapData = () => {
    const today = startOfDay(new Date());
    const oneYearAgo = subDays(today, 364);
    const days = eachDayOfInterval({ start: oneYearAgo, end: today });

    const sessionsByDate = sessions.reduce((acc, session) => {
      const dateKey = session.date;
      acc[dateKey] = (acc[dateKey] || 0) + session.duration_minutes;
      return acc;
    }, {} as Record<string, number>);

    const maxMinutes = Math.max(...Object.values(sessionsByDate), 1);

    return days.map(day => {
      const dateKey = format(day, 'yyyy-MM-dd');
      const minutes = sessionsByDate[dateKey] || 0;
      return {
        date: day,
        dateKey,
        minutes,
        level: minutes === 0 ? 0 : Math.ceil((minutes / maxMinutes) * 4),
      };
    });
  };

  const heatmapData = generateHeatmapData();
  const weeks: typeof heatmapData[] = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  const getHeatmapColor = (level: number) => {
    const colors = [
      'bg-muted/50 dark:bg-muted/30',
      'bg-emerald-200 dark:bg-emerald-900/60',
      'bg-emerald-400 dark:bg-emerald-700',
      'bg-emerald-500 dark:bg-emerald-600',
      'bg-emerald-600 dark:bg-emerald-500',
    ];
    return colors[level] || colors[0];
  };

  const handleDayClick = (day: typeof heatmapData[0]) => {
    const daySessions = sessions.filter(s => s.date === day.dateKey);
    setSelectedDate(day.date);
    setSelectedSessions(daySessions);
    setShowDetailsModal(true);
  };

  // Calculate stats
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_minutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const avgMinutesPerDay = sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0;
  const currentStreak = (() => {
    let streak = 0;
    const today = startOfDay(new Date());
    for (let i = 0; i <= 365; i++) {
      const checkDate = format(subDays(today, i), 'yyyy-MM-dd');
      if (sessions.some(s => s.date === checkDate)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  })();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Timer Section */}
      <Card className="glass-card border-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 pointer-events-none" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Clock className="h-5 w-5" />
            </div>
            Study Timer
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex flex-col items-center space-y-6">
            {/* Timer Display */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl" />
              <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-background to-muted flex items-center justify-center border-4 border-purple-500/30 shadow-lg">
                <div className="text-center">
                  <span className="text-4xl font-mono font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {formatTime(elapsedSeconds)}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isRunning ? 'Studying...' : 'Ready'}
                  </p>
                </div>
              </div>
              {isRunning && (
                <div className="absolute inset-0 rounded-full border-4 border-purple-500/50 animate-pulse" />
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4">
              {!isRunning ? (
                <Button
                  onClick={handleStart}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </Button>
              ) : (
                <Button
                  onClick={handlePause}
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
                >
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </Button>
              )}
              <Button
                onClick={handleStop}
                size="lg"
                variant="destructive"
                disabled={elapsedSeconds === 0}
                className="shadow-lg hover:shadow-red-500/25 transition-all duration-300"
              >
                <Square className="h-5 w-5 mr-2" />
                Stop & Save
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Hours', value: totalHours, icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
          { label: 'Sessions', value: sessions.length, icon: Target, color: 'from-purple-500 to-pink-500' },
          { label: 'Avg/Session', value: `${avgMinutesPerDay}m`, icon: TrendingUp, color: 'from-emerald-500 to-green-500' },
          { label: 'Current Streak', value: `${currentStreak}d`, icon: Calendar, color: 'from-amber-500 to-orange-500' },
        ].map((stat, i) => (
          <Card key={i} className="glass-card border-0 group hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} text-white group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Yearly Heatmap */}
      <Card className="glass-card border-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <Calendar className="h-5 w-5" />
            </div>
            Yearly Study Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-1 min-w-max">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <button
                      key={day.dateKey}
                      onClick={() => handleDayClick(day)}
                      className={`w-3 h-3 rounded-sm ${getHeatmapColor(day.level)} hover:ring-2 hover:ring-purple-500 hover:ring-offset-1 hover:ring-offset-background transition-all duration-200 cursor-pointer`}
                      title={`${format(day.date, 'MMM d, yyyy')}: ${day.minutes} minutes`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 mt-4 text-sm text-muted-foreground">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div key={level} className={`w-3 h-3 rounded-sm ${getHeatmapColor(level)}`} />
            ))}
            <span>More</span>
          </div>
        </CardContent>
      </Card>

      {/* Weekly/Monthly Summary Charts */}
      <StudySummaryCharts sessions={sessions} />

      {/* Notes Modal */}
      <Dialog open={showNotesModal} onOpenChange={setShowNotesModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-500" />
              Session Complete!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 text-center">
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {formatTime(elapsedSeconds)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {Math.floor(elapsedSeconds / 60)} minutes studied
              </p>
            </div>
            <Textarea
              placeholder="What did you study? Add notes about your progress..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowNotesModal(false); setElapsedSeconds(0); setNotes(''); }}>
              Discard
            </Button>
            <Button onClick={handleSaveSession} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Save Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Day Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-500" />
              {selectedDate && format(selectedDate, 'MMMM d, yyyy')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No study sessions on this day.</p>
            ) : (
              <>
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-center">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedSessions.reduce((sum, s) => sum + s.duration_minutes, 0)} min
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Total study time</p>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedSessions.map((session) => (
                    <div key={session.id} className="p-3 rounded-lg bg-muted/50 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{session.duration_minutes} minutes</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(session.created_at || session.date), 'h:mm a')}
                        </span>
                      </div>
                      {session.notes && (
                        <p className="text-sm text-muted-foreground">{session.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default YearlyTracker;
