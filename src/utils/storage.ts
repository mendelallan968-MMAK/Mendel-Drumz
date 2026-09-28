import { PracticeSession, DrumRecording, UserStats } from '../types';

const STATS_KEY = 'mendel_drumz_stats_v1';
const SESSIONS_KEY = 'mendel_drumz_sessions_v1';
const RECORDINGS_KEY = 'mendel_drumz_recordings_v1';

export const getInitialStats = (): UserStats => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return {
    streakDays: 4,
    totalPracticeMinutes: 145,
    completedLessonIds: ['lesson-1-1'],
    masteredRudimentIds: ['single-stroke-roll', 'double-stroke-roll'],
    currentGoalMinutes: 30,
    targetBpm: 85,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  };
};

export const saveStats = (stats: UserStats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
};

export const getInitialSessions = (): PracticeSession[] => {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [
    {
      id: 'session-1',
      date: new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10),
      durationMinutes: 30,
      category: 'Rudiments',
      notes: 'Focused on single paradiddle dynamics. Reached 90 BPM with clean accents.',
      bpmAchieved: 90
    },
    {
      id: 'session-2',
      date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
      durationMinutes: 45,
      category: 'Grooves',
      notes: 'Worked through The Money Beat variations. Locked kick on beat 1 & 3 with metronome.',
      bpmAchieved: 80
    },
    {
      id: 'session-3',
      date: new Date().toISOString().slice(0, 10),
      durationMinutes: 25,
      category: 'Limb Independence',
      notes: 'Syncopated kick exercise. Offbeat kicks felt solid after 10 mins of slow repetition.',
      bpmAchieved: 85
    }
  ];
};

export const saveSessions = (sessions: PracticeSession[]) => {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // ignore
  }
};

export const getInitialRecordings = (): DrumRecording[] => {
  try {
    const raw = localStorage.getItem(RECORDINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
};

export const saveRecordings = (recordings: DrumRecording[]) => {
  try {
    localStorage.setItem(RECORDINGS_KEY, JSON.stringify(recordings));
  } catch {
    // ignore
  }
};
