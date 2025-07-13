
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Focus,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PomodoroSettings {
  workTime: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
}

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [settings, setSettings] = useState<PomodoroSettings>({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = 0.5;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    playNotificationSound();
    
    if (mode === 'work') {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);
      
      if (newSessionsCompleted % settings.longBreakInterval === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreak * 60);
        toast.success(`Work session complete! Time for a long break (${settings.longBreak} minutes)`);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreak * 60);
        toast.success(`Work session complete! Time for a short break (${settings.shortBreak} minutes)`);
      }
    } else {
      setMode('work');
      setTimeLeft(settings.workTime * 60);
      toast.success(`Break time over! Ready for another work session (${settings.workTime} minutes)`);
    }
  };

  const playNotificationSound = () => {
    if (soundEnabled && audioRef.current) {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    const currentModeTime = mode === 'work' ? settings.workTime : 
                           mode === 'shortBreak' ? settings.shortBreak : settings.longBreak;
    setTimeLeft(currentModeTime * 60);
  };

  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    const newTime = newMode === 'work' ? settings.workTime : 
                   newMode === 'shortBreak' ? settings.shortBreak : settings.longBreak;
    setTimeLeft(newTime * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentModeTime = () => {
    return mode === 'work' ? settings.workTime * 60 : 
           mode === 'shortBreak' ? settings.shortBreak * 60 : settings.longBreak * 60;
  };

  const getProgress = () => {
    const totalTime = getCurrentModeTime();
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'work': return <Focus className="h-4 w-4" />;
      case 'shortBreak': return <Coffee className="h-4 w-4" />;
      case 'longBreak': return <Coffee className="h-4 w-4" />;
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'work': return 'Focus Time';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'work': return 'bg-red-500';
      case 'shortBreak': return 'bg-green-500';
      case 'longBreak': return 'bg-blue-500';
    }
  };

  const updateSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    setSettingsOpen(false);
    // Reset timer with new settings
    const currentModeTime = mode === 'work' ? newSettings.workTime : 
                           mode === 'shortBreak' ? newSettings.shortBreak : newSettings.longBreak;
    setTimeLeft(currentModeTime * 60);
    setIsActive(false);
    toast.success('Settings updated successfully!');
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-background to-muted/20 border-2 shadow-2xl">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xl">
            {getModeIcon()}
            Pomodoro Timer
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Timer Settings</DialogTitle>
                  <DialogDescription>
                    Customize your Pomodoro timer intervals (in minutes)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="workTime">Work Time</Label>
                    <Input
                      id="workTime"
                      type="number"
                      min="1"
                      max="60"
                      defaultValue={settings.workTime}
                      onChange={(e) => setSettings({...settings, workTime: parseInt(e.target.value) || 25})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shortBreak">Short Break</Label>
                    <Input
                      id="shortBreak"
                      type="number"
                      min="1"
                      max="30"
                      defaultValue={settings.shortBreak}
                      onChange={(e) => setSettings({...settings, shortBreak: parseInt(e.target.value) || 5})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longBreak">Long Break</Label>
                    <Input
                      id="longBreak"
                      type="number"
                      min="1"
                      max="60"
                      defaultValue={settings.longBreak}
                      onChange={(e) => setSettings({...settings, longBreak: parseInt(e.target.value) || 15})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longBreakInterval">Long Break Interval</Label>
                    <Input
                      id="longBreakInterval"
                      type="number"
                      min="2"
                      max="10"
                      defaultValue={settings.longBreakInterval}
                      onChange={(e) => setSettings({...settings, longBreakInterval: parseInt(e.target.value) || 4})}
                    />
                  </div>
                  <Button 
                    onClick={() => updateSettings(settings)} 
                    className="w-full"
                  >
                    Save Settings
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            {getModeIcon()}
            {getModeLabel()}
          </Badge>
          <Badge variant="secondary">
            Sessions: {sessionsCompleted}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="text-6xl font-mono font-bold tracking-wider text-primary">
            {formatTime(timeLeft)}
          </div>
          <Progress 
            value={getProgress()} 
            className="h-3"
          />
        </div>

        {/* Mode Switcher */}
        <div className="flex gap-2 justify-center">
          <Button
            variant={mode === 'work' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchMode('work')}
            className="flex items-center gap-1"
          >
            <Focus className="h-3 w-3" />
            Work
          </Button>
          <Button
            variant={mode === 'shortBreak' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchMode('shortBreak')}
            className="flex items-center gap-1"
          >
            <Coffee className="h-3 w-3" />
            Short
          </Button>
          <Button
            variant={mode === 'longBreak' ? 'default' : 'outline'}
            size="sm"
            onClick={() => switchMode('longBreak')}
            className="flex items-center gap-1"
          >
            <Coffee className="h-3 w-3" />
            Long
          </Button>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={toggleTimer}
            size="lg"
            className="flex items-center gap-2 px-8"
          >
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Status */}
        <div className="text-center text-sm text-muted-foreground">
          {isActive ? (
            <div className="flex items-center justify-center gap-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${getModeColor()}`} />
              Timer is running...
            </div>
          ) : (
            'Timer is paused'
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
