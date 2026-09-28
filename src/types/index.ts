export type DrumInstrument =
  | 'kick'
  | 'snare'
  | 'snareRim'
  | 'crossStick'
  | 'hihatClosed'
  | 'hihatOpen'
  | 'hihatPedal'
  | 'tomHigh'
  | 'tomMid'
  | 'tomFloor'
  | 'crash'
  | 'ride'
  | 'rideBell'
  | 'cowbell';

export interface DrumPadConfig {
  id: DrumInstrument;
  name: string;
  keyLabel: string;
  keyCode: string;
  category: 'cymbals' | 'drums' | 'percussion';
  xPercent: number; // for visual kit layout
  yPercent: number;
  size: 'small' | 'medium' | 'large' | 'huge';
  color: string;
}

export interface BeatStep {
  step: number; // 0 to 15 (16th notes in 4/4)
  drum: DrumInstrument;
  accent?: boolean;
}

export interface LessonNote {
  step: number;
  drum: DrumInstrument;
  count: string;
  accent?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  module: string;
  moduleIndex: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  tempoTarget: number;
  summary: string;
  keyTakeaway: string;
  stickingPattern?: string;
  patternSteps: BeatStep[];
  subdivisionCountText: string;
  stepsBreakdown: {
    title: string;
    description: string;
  }[];
  commonMistakes: string[];
  proTip: string;
  practiceGoals: string[];
}

export interface Rudiment {
  id: string;
  name: string;
  category: 'Rolls' | 'Diddles' | 'Flams' | 'Drags';
  sticking: string;
  description: string;
  subdivision: string;
  pattern: {
    hand: 'R' | 'L';
    accent?: boolean;
    flam?: boolean;
    drag?: boolean;
  }[];
  tempoTiers: {
    bronze: number;
    silver: number;
    gold: number;
    diamond: number;
  };
}

export interface PracticeSession {
  id: string;
  date: string;
  durationMinutes: number;
  category: 'Rudiments' | 'Grooves' | 'Limb Independence' | 'Song Play-Along' | 'Speed & Endurance';
  notes: string;
  bpmAchieved: number;
}

export interface DrumRecording {
  id: string;
  name: string;
  timestamp: number;
  durationSeconds: number;
  events: {
    drum: DrumInstrument;
    timeOffsetMs: number;
    velocity: number;
  }[];
}

export interface UserStats {
  streakDays: number;
  totalPracticeMinutes: number;
  completedLessonIds: string[];
  masteredRudimentIds: string[];
  currentGoalMinutes: number;
  targetBpm: number;
  joinedDate: string;
}
