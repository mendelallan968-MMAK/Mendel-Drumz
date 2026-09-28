import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Plus, Minus, Volume2, Sparkles, Activity, Clock, Zap } from 'lucide-react';
import { drumAudio } from '../audio/drumSynth';

export const MetronomePage: React.FC = () => {
  const [bpm, setBpm] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [timeSignature, setTimeSignature] = useState<{ beats: number; noteValue: number }>({
    beats: 4,
    noteValue: 4,
  });
  const [subdivision, setSubdivision] = useState<'quarter' | 'eighth' | 'sixteenth' | 'triplet'>('quarter');
  const [soundProfile, setSoundProfile] = useState<'studio' | 'wood' | 'bell'>('studio');
  const [currentBeat, setCurrentBeat] = useState<number>(0);
  const [currentSub, setCurrentSub] = useState<number>(0);

  // Speed trainer & Gap click
  const [gapClickMode, setGapClickMode] = useState<boolean>(false);
  const [autoSpeedMode, setAutoSpeedMode] = useState<boolean>(false);
  const [barsElapsed, setBarsElapsed] = useState<number>(0);

  // Tap tempo tracking
  const tapTimesRef = useRef<number[]>([]);

  // Web Audio clock scheduling references
  const timerWorkerRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const current16thNoteRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const bpmRef = useRef<number>(bpm);
  const timeSigRef = useRef(timeSignature);
  const subRef = useRef(subdivision);
  const soundRef = useRef(soundProfile);
  const gapClickRef = useRef(gapClickMode);
  const autoSpeedRef = useRef(autoSpeedMode);
  const barsElapsedRef = useRef(0);

  // Synchronize refs
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);
  useEffect(() => {
    timeSigRef.current = timeSignature;
  }, [timeSignature]);
  useEffect(() => {
    subRef.current = subdivision;
  }, [subdivision]);
  useEffect(() => {
    soundRef.current = soundProfile;
  }, [soundProfile]);
  useEffect(() => {
    gapClickRef.current = gapClickMode;
  }, [gapClickMode]);
  useEffect(() => {
    autoSpeedRef.current = autoSpeedMode;
  }, [autoSpeedMode]);

  // Rhythm Timing Test Game
  const [timingTestActive, setTimingTestActive] = useState<boolean>(false);
  const [tapOffsets, setTapOffsets] = useState<number[]>([]);
  const [lastAccuracyFeedback, setLastAccuracyFeedback] = useState<string>('Tap "SPACE" on the click');

  // Lookahead audio scheduler
  const scheduleNote = (beatNumber: number, subIndex: number, time: number) => {
    const isAccent = beatNumber === 0 && subIndex === 0;
    const isMainBeat = subIndex === 0;

    // Check gap click: mute every 4th bar
    const currentBar = Math.floor(barsElapsedRef.current);
    const isMutedBar = gapClickRef.current && (currentBar % 4 === 3);

    if (!isMutedBar) {
      if (isAccent) {
        drumAudio.playMetronomeClick('accent', soundRef.current, time);
      } else if (isMainBeat) {
        drumAudio.playMetronomeClick('regular', soundRef.current, time);
      } else {
        drumAudio.playMetronomeClick('subdivision', soundRef.current, time);
      }
    }

    // Schedule UI update roughly on time
    const delay = Math.max(0, (time - drumAudio.getCurrentTime()) * 1000);
    setTimeout(() => {
      if (!isPlayingRef.current) return;
      setCurrentBeat(beatNumber);
      setCurrentSub(subIndex);
    }, delay);
  };

  const nextNote = () => {
    const secondsPerBeat = 60.0 / bpmRef.current;
    let subFactor = 1;
    if (subRef.current === 'eighth') subFactor = 2;
    else if (subRef.current === 'sixteenth') subFactor = 4;
    else if (subRef.current === 'triplet') subFactor = 3;

    nextNoteTimeRef.current += secondsPerBeat / subFactor;
    current16thNoteRef.current++;

    const totalSubsPerBar = timeSigRef.current.beats * subFactor;
    if (current16thNoteRef.current >= totalSubsPerBar) {
      current16thNoteRef.current = 0;
      barsElapsedRef.current += 1;
      setBarsElapsed(barsElapsedRef.current);

      // Auto speed up every 4 bars
      if (autoSpeedRef.current && barsElapsedRef.current % 4 === 0) {
        setBpm((prev) => Math.min(260, prev + 2));
      }
    }
  };

  const scheduler = () => {
    const lookahead = 0.05; // seconds
    const scheduleAheadTime = 0.1; // seconds

    while (
      nextNoteTimeRef.current <
      drumAudio.getCurrentTime() + scheduleAheadTime
    ) {
      let subFactor = 1;
      if (subRef.current === 'eighth') subFactor = 2;
      else if (subRef.current === 'sixteenth') subFactor = 4;
      else if (subRef.current === 'triplet') subFactor = 3;

      const beatIndex = Math.floor(current16thNoteRef.current / subFactor);
      const subIndex = current16thNoteRef.current % subFactor;

      scheduleNote(beatIndex, subIndex, nextNoteTimeRef.current);
      nextNote();
    }
  };

  const startMetronome = () => {
    isPlayingRef.current = true;
    setIsPlaying(true);
    current16thNoteRef.current = 0;
    barsElapsedRef.current = 0;
    setBarsElapsed(0);
    nextNoteTimeRef.current = drumAudio.getCurrentTime() + 0.05;

    timerWorkerRef.current = window.setInterval(scheduler, 25);
  };

  const stopMetronome = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (timerWorkerRef.current) {
      clearInterval(timerWorkerRef.current);
      timerWorkerRef.current = null;
    }
    setCurrentBeat(0);
    setCurrentSub(0);
  };

  // Clean up
  useEffect(() => {
    return () => {
      if (timerWorkerRef.current) {
        clearInterval(timerWorkerRef.current);
      }
    };
  }, []);

  // Tap Tempo Logic
  const handleTap = () => {
    const now = performance.now();
    const taps = tapTimesRef.current;

    // Reset if gap is longer than 2.5s
    if (taps.length > 0 && now - taps[taps.length - 1] > 2500) {
      tapTimesRef.current = [now];
      return;
    }

    taps.push(now);
    if (taps.length > 5) taps.shift();

    if (taps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      if (calculatedBpm >= 30 && calculatedBpm <= 280) {
        setBpm(calculatedBpm);
      }
    }
  };

  // Timing Accuracy Test
  const handleTimingTestTap = () => {
    if (!isPlaying) {
      setLastAccuracyFeedback('Start metronome first to test precision');
      return;
    }

    // Calculate nearest beat time in current audio context
    const currentTime = drumAudio.getCurrentTime();
    const secondsPerBeat = 60.0 / bpm;
    // Difference between click and tap in ms
    const diff = (currentTime % secondsPerBeat);
    const offsetMs = diff > secondsPerBeat / 2 ? Math.round((diff - secondsPerBeat) * 1000) : Math.round(diff * 1000);

    setTapOffsets((prev) => [...prev.slice(-15), offsetMs]);

    const absOffset = Math.abs(offsetMs);
    if (absOffset <= 12) {
      setLastAccuracyFeedback(`🔥 DEAD POCKET! ${offsetMs > 0 ? '+' : ''}${offsetMs}ms`);
    } else if (absOffset <= 28) {
      setLastAccuracyFeedback(`✅ GREAT! ${offsetMs > 0 ? 'Dragging +' : 'Rushing '}${offsetMs}ms`);
    } else {
      setLastAccuracyFeedback(`⚠️ ${offsetMs < 0 ? 'Rushing' : 'Dragging'} by ${offsetMs}ms`);
    }
  };

  // Listen to spacebar for timing test when tab active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && timingTestActive) {
        e.preventDefault();
        handleTimingTestTap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [timingTestActive, isPlaying, bpm]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-16">
      {/* Header */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>PRECISION AUDIO ENGINE · ZERO CLOCK JITTER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Rhythm Lab &amp; Metronome
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              Dial in exact tempos, internalize subdivisions, and test your pocket timing with gap click drills.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { label: 'Ballad', bpm: 60 },
              { label: 'Groove', bpm: 85 },
              { label: 'Medium', bpm: 100 },
              { label: 'Up-Tempo', bpm: 125 },
              { label: 'Blaze', bpm: 155 },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => setBpm(p.bpm)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors border ${
                  bpm === p.bpm
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                {p.label} ({p.bpm})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Metronome Control Deck (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl relative overflow-hidden">
            
            {/* Visual Beat Indicator Lights */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
              {Array.from({ length: timeSignature.beats }).map((_, index) => {
                const isActive = isPlaying && currentBeat === index;
                const isAccent = index === 0;

                return (
                  <div
                    key={index}
                    className={`flex-1 max-w-[80px] h-12 rounded-xl border flex flex-col items-center justify-center transition-all duration-75 ${
                      isActive
                        ? isAccent
                          ? 'bg-amber-400 border-amber-300 text-zinc-950 scale-110 shadow-[0_0_25px_rgba(245,158,11,0.9)]'
                          : 'bg-zinc-200 border-white text-zinc-950 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.7)]'
                        : 'bg-zinc-950/80 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <span className="text-sm font-extrabold font-mono">
                      {index + 1}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-mono opacity-80">
                      {isAccent ? 'Accent' : 'Beat'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Huge BPM Display */}
            <div className="text-center my-6">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setBpm((b) => Math.max(30, b - 5))}
                  className="p-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700/60"
                  title="-5 BPM"
                >
                  <Minus className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center">
                  <span className="text-6xl sm:text-7xl font-black text-white font-mono tracking-tight tabular-nums">
                    {bpm}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-mono mt-1 font-semibold">
                    BEATS PER MINUTE
                  </span>
                </div>

                <button
                  onClick={() => setBpm((b) => Math.min(280, b + 5))}
                  className="p-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700/60"
                  title="+5 BPM"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Slider */}
              <div className="max-w-md mx-auto mt-6 px-4">
                <input
                  type="range"
                  min="30"
                  max="280"
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[11px] font-mono text-zinc-500 mt-2">
                  <span>30 Slow</span>
                  <span>100 Med</span>
                  <span>160 Fast</span>
                  <span>280 Speed</span>
                </div>
              </div>
            </div>

            {/* Play & Tap Buttons */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={isPlaying ? stopMetronome : startMetronome}
                className={`flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg focus:outline-none ${
                  isPlaying
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/40'
                    : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 shadow-amber-500/20'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Square className="w-5 h-5 fill-current" />
                    <span>STOP CLICK</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>START METRONOME</span>
                  </>
                )}
              </button>

              <button
                onClick={handleTap}
                className="px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-sm font-semibold transition-colors shadow-sm"
              >
                TAP TEMPO
              </button>
            </div>
          </div>

          {/* Time Signature & Subdivision Controls */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                Time Signature
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { beats: 4, noteValue: 4, label: '4/4 Common' },
                  { beats: 3, noteValue: 4, label: '3/4 Waltz' },
                  { beats: 2, noteValue: 4, label: '2/4 March' },
                  { beats: 6, noteValue: 8, label: '6/8 Slow' },
                  { beats: 7, noteValue: 8, label: '7/8 Odd' },
                  { beats: 12, noteValue: 8, label: '12/8 Blues' },
                ].map((sig) => {
                  const isCurrent =
                    timeSignature.beats === sig.beats &&
                    timeSignature.noteValue === sig.noteValue;
                  return (
                    <button
                      key={sig.label}
                      onClick={() => setTimeSignature({ beats: sig.beats, noteValue: sig.noteValue })}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isCurrent
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="block text-sm font-mono">{sig.beats}/{sig.noteValue}</span>
                      <span className="block text-[10px] text-zinc-500 truncate">{sig.label.split(' ')[1]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                Subdivision Grid
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'quarter', label: 'Quarter Notes', count: '1  2  3  4' },
                  { id: 'eighth', label: '8th Notes', count: '1 & 2 & 3 & 4 &' },
                  { id: 'sixteenth', label: '16th Notes', count: '1 e & a 2 e & a' },
                  { id: 'triplet', label: '8th Triplets', count: '1 - la - li 2 - la' },
                ].map((sub) => {
                  const isCurrent = subdivision === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSubdivision(sub.id as typeof subdivision)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-medium'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="block text-xs font-semibold text-zinc-200">{sub.label}</span>
                      <span className="block text-[10px] text-zinc-500 font-mono mt-0.5 truncate">{sub.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 font-mono">
                Click Audio Profile
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'studio', label: 'Studio Precision' },
                  { id: 'wood', label: 'Acoustic Woodblock' },
                  { id: 'bell', label: 'Mechanical Bell' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSoundProfile(s.id as typeof soundProfile)}
                    className={`p-2.5 rounded-xl border text-center text-xs transition-colors ${
                      soundProfile === s.id
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Training Drills & Precision Tapper (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Advanced Training Modes */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Drummer Workout Modes</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Advanced metronome features used by touring professionals.
            </p>

            <div className="space-y-3">
              {/* Gap Click Switch */}
              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-200">
                    Gap Click (Internal Pulse Test)
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Mutes every 4th bar to see if you rush or drag.
                  </div>
                </div>
                <button
                  onClick={() => setGapClickMode(!gapClickMode)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                    gapClickMode ? 'bg-amber-500' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      gapClickMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Auto Speed-up Switch */}
              <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-zinc-200">
                    Speed Ladder (+2 BPM / 4 Bars)
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Build endurance and speed automatically.
                  </div>
                </div>
                <button
                  onClick={() => setAutoSpeedMode(!autoSpeedMode)}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                    autoSpeedMode ? 'bg-amber-500' : 'bg-zinc-800'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      autoSpeedMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Current Bars Tracker */}
              {isPlaying && (
                <div className="text-xs text-zinc-400 font-mono text-center pt-2">
                  BARS COMPLETED: <span className="text-amber-400 font-bold">{barsElapsed}</span>
                  {gapClickMode && (
                    <span className="ml-2 text-zinc-500">
                      (Next mute on bar {Math.ceil((barsElapsed + 1) / 4) * 4})
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Rhythm Accuracy Tapper */}
          <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                <span>Pocket Timing Test</span>
              </h3>
              <button
                onClick={() => setTimingTestActive(!timingTestActive)}
                className={`text-xs px-2.5 py-1 rounded-md font-mono ${
                  timingTestActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {timingTestActive ? 'Active' : 'Enable'}
              </button>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Tap the button or press <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono text-[10px]">SPACE</kbd> dead on each metronome beat to measure millisecond deviation.
            </p>

            <div className="text-center py-4 bg-zinc-950/80 rounded-xl border border-zinc-800/80 mb-4">
              <div className="text-lg font-mono font-bold text-amber-300">
                {lastAccuracyFeedback}
              </div>
              <div className="text-xs text-zinc-500 mt-1 font-mono">
                {tapOffsets.length > 0
                  ? `Avg deviation: ±${Math.round(
                      tapOffsets.reduce((a, b) => a + Math.abs(b), 0) / tapOffsets.length
                    )}ms over ${tapOffsets.length} taps`
                  : 'Awaiting your taps...'}
              </div>
            </div>

            <button
              onClick={handleTimingTestTap}
              disabled={!isPlaying}
              className={`w-full py-4 rounded-xl border font-bold text-sm tracking-wide transition-all ${
                isPlaying
                  ? 'bg-gradient-to-r from-zinc-800 to-zinc-700 hover:from-amber-500/30 hover:to-amber-500/20 border-zinc-700 text-white active:scale-95'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              TAP ON CLICK (SPACEBAR)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
