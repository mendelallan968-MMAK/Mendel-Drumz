import React, { useState, useEffect } from 'react';
import { Play, Square, Pause, RotateCcw, Clock, Flame, Award, Calendar, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { PracticeSession, UserStats } from '../types';

interface PracticeTrackerProps {
  stats: UserStats;
  sessions: PracticeSession[];
  onAddSession: (session: PracticeSession) => void;
  onDeleteSession: (id: string) => void;
  onUpdateGoal: (minutes: number) => void;
}

export const PracticeTrackerPage: React.FC<PracticeTrackerProps> = ({
  stats,
  sessions,
  onAddSession,
  onDeleteSession,
  onUpdateGoal,
}) => {
  // Stopwatch state
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [sessionCategory, setSessionCategory] = useState<PracticeSession['category']>('Grooves');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [achievedBpm, setAchievedBpm] = useState<number>(85);
  const [showGoalModal, setShowGoalModal] = useState<boolean>(false);
  const [tempGoal, setTempGoal] = useState<number>(stats.currentGoalMinutes);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatStopwatch = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveSession = () => {
    const durationMinutes = Math.max(1, Math.round(seconds / 60));
    const newSession: PracticeSession = {
      id: 'session-' + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      durationMinutes,
      category: sessionCategory,
      notes: sessionNotes.trim() || `Practiced ${sessionCategory} at ${achievedBpm} BPM.`,
      bpmAchieved: achievedBpm,
    };
    onAddSession(newSession);
    setSeconds(0);
    setIsTimerRunning(false);
    setSessionNotes('');
  };

  // Calculate today's practice minutes
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMinutes = sessions
    .filter((s) => s.date === todayStr)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);

  const goalPercent = Math.min(100, Math.round((todayMinutes / stats.currentGoalMinutes) * 100));

  const badges = [
    {
      title: 'First Strike',
      desc: 'Logged first official practice session',
      unlocked: sessions.length >= 1,
    },
    {
      title: 'Pocket Keeper',
      desc: 'Maintain a 4+ day practice streak',
      unlocked: stats.streakDays >= 4,
    },
    {
      title: 'Rudiment Pioneer',
      desc: 'Mastered 2+ rudiments in the Vault',
      unlocked: stats.masteredRudimentIds.length >= 2,
    },
    {
      title: 'Tempo Titan',
      desc: 'Achieved 100+ BPM on grooves',
      unlocked: sessions.some((s) => s.bpmAchieved >= 100),
    },
    {
      title: 'Century Club',
      desc: 'Over 100 total practice minutes',
      unlocked: stats.totalPracticeMinutes >= 100,
    },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-16">
      {/* Header */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>STUDENT PROGRESS LOG · CONSISTENCY OVER SPEED</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Practice Journal &amp; Tracker
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              Time your sessions, record tempo breakthroughs, and build your drummer streak.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{stats.streakDays} Day Streak</span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs">
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>{stats.totalPracticeMinutes} Total Mins</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Live Stopwatch & Quick Session Logger (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Live Practice Stopwatch</span>
              </h3>
              <span className="text-xs font-mono text-zinc-500">
                {isTimerRunning ? '● SESSION IN PROGRESS' : 'IDLE'}
              </span>
            </div>

            {/* Big Stopwatch Display */}
            <div className="py-8 my-2 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-center">
              <span className="text-6xl sm:text-7xl font-mono font-black text-white tracking-tight tabular-nums">
                {formatStopwatch(seconds)}
              </span>
              <span className="block text-xs font-mono text-zinc-500 mt-2 uppercase tracking-widest">
                ELAPSED TIME
              </span>
            </div>

            {/* Stopwatch Buttons */}
            <div className="flex items-center justify-center gap-3 my-6">
              {!isTimerRunning ? (
                <button
                  onClick={() => setIsTimerRunning(true)}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs tracking-wide shadow-md transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>START TIMER</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsTimerRunning(false)}
                  className="flex items-center gap-2 px-7 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs tracking-wide transition-all"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>PAUSE TIMER</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setSeconds(0);
                }}
                className="p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                title="Reset stopwatch"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Session Logging Details Form */}
            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase font-semibold mb-2">
                  Session Focus Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Rudiments', 'Grooves', 'Limb Independence', 'Song Play-Along', 'Speed & Endurance'] as const).map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setSessionCategory(cat)}
                        className={`p-2 rounded-lg text-xs font-medium border text-left truncate transition-colors ${
                          sessionCategory === cat
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                            : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase font-semibold mb-1">
                    BPM Reached
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="280"
                    value={achievedBpm}
                    onChange={(e) => setAchievedBpm(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase font-semibold mb-1">
                    Log Duration (mins)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={Math.max(1, Math.round(seconds / 60))}
                    onChange={(e) => setSeconds(Number(e.target.value) * 60)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase font-semibold mb-1">
                  Session Notes &amp; Reflections
                </label>
                <textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="e.g. Worked on single paradiddle accents. Right hand felt relaxed; left hand needed more rebound focus."
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={handleSaveSession}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs tracking-wide transition-all shadow-md"
              >
                SAVE SESSION TO JOURNAL
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Daily Goal & Session History (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Daily Goal Card */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
                  Today&apos;s Target
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">
                  {todayMinutes} / {stats.currentGoalMinutes} Minutes Practiced
                </h4>
              </div>

              <button
                onClick={() => setShowGoalModal(true)}
                className="text-xs font-mono text-amber-400 hover:text-amber-300 underline"
              >
                Change Goal
              </button>
            </div>

            <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden p-0.5 border border-zinc-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${goalPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 mt-2 font-mono">
              <span>{goalPercent}% Achieved Today</span>
              <span>{Math.max(0, stats.currentGoalMinutes - todayMinutes)} mins remaining</span>
            </div>
          </div>

          {/* Drummer Milestone Badges */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Drummer Milestone Badges</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {badges.map((b) => (
                <div
                  key={b.title}
                  className={`p-3 rounded-xl border transition-all ${
                    b.unlocked
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                      : 'bg-zinc-950/40 border-zinc-800/80 text-zinc-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        b.unlocked ? 'text-amber-400' : 'text-zinc-600'
                      }`}
                    />
                    <span className="text-xs font-bold text-white font-display">
                      {b.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Past Practice Sessions Log */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Recent Practice Sessions</span>
              </h4>
              <span className="text-xs font-mono text-zinc-500">
                {sessions.length} logged
              </span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-400 font-semibold">
                        {sess.category}
                      </span>
                      <span className="text-zinc-600">·</span>
                      <span className="font-mono text-zinc-400">{sess.durationMinutes} mins</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-zinc-500">{sess.date}</span>
                      <button
                        onClick={() => onDeleteSession(sess.id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 mt-1.5 line-clamp-2">
                    {sess.notes}
                  </p>

                  <div className="mt-2 text-[10px] font-mono text-zinc-500">
                    Max Speed: <strong className="text-zinc-300">{sess.bpmAchieved} BPM</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Goal Edit Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Set Daily Practice Goal</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Consistency is key. 20-30 minutes daily yields greater muscle memory than 3 hours once a week.
            </p>
            <div className="flex items-center gap-3 my-4">
              <input
                type="number"
                min="5"
                max="240"
                value={tempGoal}
                onChange={(e) => setTempGoal(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-white font-mono text-lg"
              />
              <span className="text-xs font-mono text-zinc-400">MINUTES</span>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowGoalModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateGoal(tempGoal);
                  setShowGoalModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-amber-400 text-zinc-950 text-xs font-bold"
              >
                Save Target
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
