import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Circle, RotateCcw, Volume2, Music, Check, Sparkles } from 'lucide-react';
import { KIT_PADS } from '../data/kitConfig';
import { drumAudio } from '../audio/drumSynth';
import { DrumInstrument, DrumRecording } from '../types';

interface VirtualKitProps {
  recordings: DrumRecording[];
  onSaveRecording: (rec: DrumRecording) => void;
  onDeleteRecording: (id: string) => void;
}

export const VirtualKitPage: React.FC<VirtualKitProps> = ({
  recordings,
  onSaveRecording,
  onDeleteRecording,
}) => {
  const [activePadId, setActivePadId] = useState<DrumInstrument | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordStartTime, setRecordStartTime] = useState<number | null>(null);
  const [recordedEvents, setRecordedEvents] = useState<DrumRecording['events']>([]);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [recordingName, setRecordingName] = useState('');
  const [lastHitName, setLastHitName] = useState<string>('Ready to play');
  const [hitCount, setHitCount] = useState<number>(0);

  const playbackTimeouts = useRef<NodeJS.Timeout[]>([]);

  // Trigger drum hit
  const triggerDrum = (instrumentId: DrumInstrument, velocity = 1.0) => {
    switch (instrumentId) {
      case 'kick':
        drumAudio.playKick(velocity);
        break;
      case 'snare':
        drumAudio.playSnare(velocity, false);
        break;
      case 'snareRim':
        drumAudio.playSnare(velocity, true);
        break;
      case 'crossStick':
        drumAudio.playCrossStick(velocity);
        break;
      case 'hihatClosed':
        drumAudio.playHiHatClosed(velocity);
        break;
      case 'hihatOpen':
        drumAudio.playHiHatOpen(velocity);
        break;
      case 'hihatPedal':
        drumAudio.playHiHatPedal(velocity);
        break;
      case 'tomHigh':
        drumAudio.playTom('high', velocity);
        break;
      case 'tomMid':
        drumAudio.playTom('mid', velocity);
        break;
      case 'tomFloor':
        drumAudio.playTom('floor', velocity);
        break;
      case 'crash':
        drumAudio.playCrash(velocity);
        break;
      case 'ride':
        drumAudio.playRide(false, velocity);
        break;
      case 'rideBell':
        drumAudio.playRide(true, velocity);
        break;
      case 'cowbell':
        drumAudio.playCowbell(velocity);
        break;
    }

    // Visual trigger
    setActivePadId(instrumentId);
    setTimeout(() => setActivePadId(null), 120);

    const pad = KIT_PADS.find((p) => p.id === instrumentId);
    if (pad) {
      setLastHitName(pad.name);
    }
    setHitCount((c) => c + 1);

    // Recording capture
    if (isRecording && recordStartTime !== null) {
      const now = performance.now();
      const offset = Math.round(now - recordStartTime);
      setRecordedEvents((prev) => [
        ...prev,
        { drum: instrumentId, timeOffsetMs: offset, velocity },
      ]);
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.repeat) return; // Prevent key bounce

      // Space or B for Kick
      if (e.code === 'Space' || e.code === 'KeyB') {
        e.preventDefault();
        triggerDrum('kick', 1.0);
        return;
      }

      const match = KIT_PADS.find(
        (pad) => pad.keyCode.toLowerCase() === e.code.toLowerCase()
      );
      if (match) {
        e.preventDefault();
        triggerDrum(match.id, 1.0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecording, recordStartTime]);

  // Start / Stop Recording
  const startRecording = () => {
    setRecordedEvents([]);
    setRecordStartTime(performance.now());
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (!isRecording) return;
    setIsRecording(false);
    if (recordStartTime && recordedEvents.length > 0) {
      const duration = Math.max(
        1,
        Math.round((performance.now() - recordStartTime) / 1000)
      );
      const newRec: DrumRecording = {
        id: 'rec-' + Date.now(),
        name: recordingName.trim() || `Groove Take #${recordings.length + 1}`,
        timestamp: Date.now(),
        durationSeconds: duration,
        events: recordedEvents,
      };
      onSaveRecording(newRec);
      setRecordingName('');
    }
  };

  // Playback saved recording
  const playRecording = (recording: DrumRecording) => {
    // Clear any active timeouts
    playbackTimeouts.current.forEach((t) => clearTimeout(t));
    playbackTimeouts.current = [];
    setIsPlayingRecording(true);

    recording.events.forEach((event) => {
      const timer = setTimeout(() => {
        triggerDrum(event.drum, event.velocity);
      }, event.timeOffsetMs);
      playbackTimeouts.current.push(timer);
    });

    const finishTimer = setTimeout(() => {
      setIsPlayingRecording(false);
    }, recording.durationSeconds * 1000 + 200);
    playbackTimeouts.current.push(finishTimer);
  };

  const stopPlayback = () => {
    playbackTimeouts.current.forEach((t) => clearTimeout(t));
    playbackTimeouts.current = [];
    setIsPlayingRecording(false);
  };

  // Presets demo beats
  const playDemoGroove = (grooveType: 'rock' | 'funk' | 'fill') => {
    playbackTimeouts.current.forEach((t) => clearTimeout(t));
    playbackTimeouts.current = [];
    setIsPlayingRecording(true);

    const stepMs = 150; // 100 BPM 16th notes
    let steps: { drum: DrumInstrument; step: number; vel?: number }[] = [];

    if (grooveType === 'rock') {
      // 2 bars of classic rock pocket
      for (let bar = 0; bar < 2; bar++) {
        const offset = bar * 16;
        // 8th note hihats
        for (let i = 0; i < 16; i += 2) {
          steps.push({ drum: 'hihatClosed', step: offset + i, vel: 0.8 });
        }
        // Kicks on 1, 3
        steps.push({ drum: 'kick', step: offset + 0, vel: 1.0 });
        steps.push({ drum: 'kick', step: offset + 8, vel: 1.0 });
        steps.push({ drum: 'kick', step: offset + 10, vel: 0.8 }); // subtle syncopation
        // Snares on 2, 4
        steps.push({ drum: 'snare', step: offset + 4, vel: 1.0 });
        steps.push({ drum: 'snare', step: offset + 12, vel: 1.0 });
      }
      // Add opening crash
      steps.unshift({ drum: 'crash', step: 0, vel: 0.9 });
    } else if (grooveType === 'funk') {
      for (let bar = 0; bar < 2; bar++) {
        const offset = bar * 16;
        for (let i = 0; i < 16; i += 2) {
          steps.push({ drum: 'hihatClosed', step: offset + i, vel: 0.7 });
        }
        steps.push({ drum: 'kick', step: offset + 0, vel: 1.0 });
        steps.push({ drum: 'snare', step: offset + 4, vel: 1.0 });
        steps.push({ drum: 'snare', step: offset + 7, vel: 0.4 }); // ghost note
        steps.push({ drum: 'kick', step: offset + 10, vel: 0.9 });
        steps.push({ drum: 'snare', step: offset + 12, vel: 1.0 });
        steps.push({ drum: 'hihatOpen', step: offset + 14, vel: 0.8 });
      }
    } else {
      // Dynamic Tom fill
      steps = [
        { drum: 'snare', step: 0, vel: 0.9 },
        { drum: 'snare', step: 1, vel: 0.9 },
        { drum: 'snare', step: 2, vel: 0.9 },
        { drum: 'snare', step: 3, vel: 0.9 },
        { drum: 'tomHigh', step: 4, vel: 0.95 },
        { drum: 'tomHigh', step: 5, vel: 0.95 },
        { drum: 'tomHigh', step: 6, vel: 0.95 },
        { drum: 'tomHigh', step: 7, vel: 0.95 },
        { drum: 'tomMid', step: 8, vel: 1.0 },
        { drum: 'tomMid', step: 9, vel: 1.0 },
        { drum: 'tomFloor', step: 10, vel: 1.0 },
        { drum: 'tomFloor', step: 11, vel: 1.0 },
        { drum: 'kick', step: 12, vel: 1.1 },
        { drum: 'kick', step: 13, vel: 1.1 },
        { drum: 'crash', step: 14, vel: 1.1 },
        { drum: 'kick', step: 14, vel: 1.1 },
      ];
    }

    steps.forEach((s) => {
      const t = setTimeout(() => {
        triggerDrum(s.drum, s.vel ?? 1.0);
      }, s.step * stepMs);
      playbackTimeouts.current.push(t);
    });

    const maxStep = Math.max(...steps.map((s) => s.step));
    const finish = setTimeout(() => {
      setIsPlayingRecording(false);
    }, (maxStep + 2) * stepMs);
    playbackTimeouts.current.push(finish);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-16">
      {/* Studio Header Bar */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>STUDIO LIVE STAGE · LOW-LATENCY SYNTHESIS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Virtual Drum Kit
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              Click drum pads or trigger via keyboard shortcuts. Every acoustic shell and bronze cymbal is synthesized live.
            </p>
          </div>

          {/* Quick Recorder Deck */}
          <div className="flex flex-wrap items-center gap-2.5 bg-zinc-900/90 border border-zinc-800 p-2 rounded-xl">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Circle className="w-3.5 h-3.5 fill-white" />
                <span>REC Take</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-red-400 text-xs font-semibold shadow-sm transition-all border border-red-500/40"
              >
                <Square className="w-3.5 h-3.5 fill-red-400" />
                <span>Stop ({recordedEvents.length} hits)</span>
              </button>
            )}

            {/* Demo Groove buttons */}
            <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-zinc-800">
              <span className="text-xs text-zinc-500 mr-1 font-mono">Demo:</span>
              <button
                onClick={() => playDemoGroove('rock')}
                disabled={isPlayingRecording}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
              >
                Rock Groove
              </button>
              <button
                onClick={() => playDemoGroove('funk')}
                disabled={isPlayingRecording}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
              >
                Funk Pocket
              </button>
              <button
                onClick={() => playDemoGroove('fill')}
                disabled={isPlayingRecording}
                className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
              >
                Tom Fill
              </button>
              {isPlayingRecording && (
                <button
                  onClick={stopPlayback}
                  className="px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-800 text-xs font-medium"
                >
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Kit Canvas Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Active Feedback Bar */}
        <div className="flex items-center justify-between text-xs text-zinc-400 mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 font-mono">LAST HIT:</span>
            <span className="text-amber-400 font-semibold">{lastHitName}</span>
          </div>
          <div className="flex items-center gap-4 font-mono">
            <span>TOTAL STRIKES: <strong className="text-zinc-200">{hitCount}</strong></span>
            <span className="hidden sm:inline text-zinc-600">|</span>
            <span className="hidden sm:inline text-zinc-400">Keyboard shortcuts active</span>
          </div>
        </div>

        {/* Visual Kit Stage Container */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800/90 bg-gradient-to-b from-[#12141d] via-[#0d0e14] to-[#08090d] shadow-2xl p-4 sm:p-8 min-h-[560px] flex flex-col justify-between">
          
          {/* Subtle Stage Ambient Lighting */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-600/5 blur-[90px] pointer-events-none rounded-full" />

          {/* Top Row: Cymbals and Rack Toms */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10">
            {/* Crash Cymbal */}
            <DrumPadCard
              pad={KIT_PADS.find((p) => p.id === 'crash')!}
              isActive={activePadId === 'crash'}
              onTrigger={() => triggerDrum('crash', 1.0)}
              variant="cymbal-gold"
            />
            {/* Hi-Hat Closed */}
            <DrumPadCard
              pad={KIT_PADS.find((p) => p.id === 'hihatClosed')!}
              isActive={activePadId === 'hihatClosed'}
              onTrigger={() => triggerDrum('hihatClosed', 0.85)}
              variant="cymbal-bronze"
            />
            {/* High Tom */}
            <DrumPadCard
              pad={KIT_PADS.find((p) => p.id === 'tomHigh')!}
              isActive={activePadId === 'tomHigh'}
              onTrigger={() => triggerDrum('tomHigh', 1.0)}
              variant="drum-wood"
            />
            {/* Mid Tom */}
            <DrumPadCard
              pad={KIT_PADS.find((p) => p.id === 'tomMid')!}
              isActive={activePadId === 'tomMid'}
              onTrigger={() => triggerDrum('tomMid', 1.0)}
              variant="drum-wood"
            />
            {/* Ride Bell */}
            <DrumPadCard
              pad={KIT_PADS.find((p) => p.id === 'rideBell')!}
              isActive={activePadId === 'rideBell'}
              onTrigger={() => triggerDrum('rideBell', 1.0)}
              variant="cymbal-bright"
            />
            {/* Ride Cymbal */}
            <DrumPadCard
              pad={KIT_PADS.find((p) => p.id === 'ride')!}
              isActive={activePadId === 'ride'}
              onTrigger={() => triggerDrum('ride', 0.9)}
              variant="cymbal-gold"
            />
          </div>

          {/* Center Stage: Snare, Kick Drum, Floor Tom, Open Hat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6 sm:my-8 relative z-10">
            {/* Snare Drum Center */}
            <div className="flex flex-col gap-2.5">
              <DrumPadCard
                pad={KIT_PADS.find((p) => p.id === 'snare')!}
                isActive={activePadId === 'snare'}
                onTrigger={() => triggerDrum('snare', 1.0)}
                variant="drum-snare"
                isHero
              />
              <div className="grid grid-cols-2 gap-2">
                <DrumPadCard
                  pad={KIT_PADS.find((p) => p.id === 'snareRim')!}
                  isActive={activePadId === 'snareRim'}
                  onTrigger={() => triggerDrum('snareRim', 1.1)}
                  variant="drum-utility"
                />
                <DrumPadCard
                  pad={KIT_PADS.find((p) => p.id === 'crossStick')!}
                  isActive={activePadId === 'crossStick'}
                  onTrigger={() => triggerDrum('crossStick', 0.85)}
                  variant="drum-utility"
                />
              </div>
            </div>

            {/* Bass Drum (Kick) - Giant Centerpiece */}
            <div className="lg:col-span-2 flex flex-col justify-end">
              <button
                onClick={() => triggerDrum('kick', 1.15)}
                className={`relative group w-full h-44 sm:h-56 rounded-2xl flex flex-col items-center justify-center p-6 border transition-all duration-100 focus:outline-none select-none ${
                  activePadId === 'kick'
                    ? 'border-amber-400 bg-amber-500/20 scale-[0.98] shadow-[0_0_35px_rgba(245,158,11,0.6)]'
                    : 'border-zinc-700/80 bg-gradient-to-b from-zinc-800/90 to-zinc-900/95 hover:border-amber-500/50 shadow-xl'
                }`}
              >
                {/* Visual Kick Resonant Head graphic */}
                <div className="absolute inset-4 rounded-xl border border-zinc-700/50 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-24 rounded-full border border-zinc-600/40 flex items-center justify-center bg-zinc-950/60">
                    <span className="text-zinc-500 text-[10px] tracking-widest font-mono uppercase">
                      MENDEL
                    </span>
                  </div>
                </div>

                <div className="relative z-10 text-center">
                  <span className="text-xl sm:text-2xl font-black text-white tracking-wide font-display">
                    BASS DRUM 22&quot;
                  </span>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-950/80 border border-zinc-700/80 text-amber-400 text-xs font-mono font-bold">
                    <span>KEY: SPACE / B</span>
                  </div>
                  <span className="block text-[11px] text-zinc-400 mt-1.5">
                    Deep sub-bass punch &amp; beater click
                  </span>
                </div>
              </button>
            </div>

            {/* Floor Tom & Hi-Hat Open */}
            <div className="flex flex-col gap-2.5">
              <DrumPadCard
                pad={KIT_PADS.find((p) => p.id === 'tomFloor')!}
                isActive={activePadId === 'tomFloor'}
                onTrigger={() => triggerDrum('tomFloor', 1.0)}
                variant="drum-wood"
                isHero
              />
              <div className="grid grid-cols-2 gap-2">
                <DrumPadCard
                  pad={KIT_PADS.find((p) => p.id === 'hihatOpen')!}
                  isActive={activePadId === 'hihatOpen'}
                  onTrigger={() => triggerDrum('hihatOpen', 0.9)}
                  variant="cymbal-bronze"
                />
                <DrumPadCard
                  pad={KIT_PADS.find((p) => p.id === 'hihatPedal')!}
                  isActive={activePadId === 'hihatPedal'}
                  onTrigger={() => triggerDrum('hihatPedal', 0.75)}
                  variant="drum-utility"
                />
              </div>
            </div>
          </div>

          {/* Bottom Row: Cowbell & Accessories */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <DrumPadCard
                pad={KIT_PADS.find((p) => p.id === 'cowbell')!}
                isActive={activePadId === 'cowbell'}
                onTrigger={() => triggerDrum('cowbell', 0.95)}
                variant="cymbal-bright"
                compact
              />
              <span className="hidden md:inline text-zinc-500">
                Percussion accessory · Latin &amp; Rock accent
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-500">PRO TIP:</span>
              <span className="text-zinc-300">
                Hold <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono text-[11px]">Space</kbd> for Kick, <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono text-[11px]">S</kbd> for Snare, and <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400 font-mono text-[11px]">H</kbd> for Hi-Hat.
              </span>
            </div>
          </div>
        </div>

        {/* Saved Recordings Section */}
        {recordings.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Music className="w-4 h-4 text-amber-400" />
              <span>Your Recorded Takes</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recordings.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-zinc-200 truncate">
                      {rec.name}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                      {rec.durationSeconds}s · {rec.events.length} hits
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => playRecording(rec)}
                      disabled={isPlayingRecording}
                      className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors"
                      title="Play take"
                    >
                      <Play className="w-3.5 h-3.5 fill-amber-300" />
                    </button>
                    <button
                      onClick={() => onDeleteRecording(rec.id)}
                      className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-red-400 transition-colors text-xs"
                      title="Delete take"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface DrumPadCardProps {
  pad: typeof KIT_PADS[0];
  isActive: boolean;
  onTrigger: () => void;
  variant: 'cymbal-gold' | 'cymbal-bronze' | 'cymbal-bright' | 'drum-wood' | 'drum-snare' | 'drum-utility';
  isHero?: boolean;
  compact?: boolean;
}

const DrumPadCard: React.FC<DrumPadCardProps> = ({
  pad,
  isActive,
  onTrigger,
  variant,
  isHero,
  compact,
}) => {
  let styleClasses = 'bg-zinc-900/90 border-zinc-800 text-zinc-300';
  let badgeClasses = 'bg-zinc-950 border-zinc-700 text-zinc-300';

  if (variant === 'cymbal-gold') {
    styleClasses = 'bg-gradient-to-b from-amber-950/40 to-zinc-900/90 border-amber-600/30 text-amber-100 hover:border-amber-500/60';
    badgeClasses = 'bg-amber-950/80 border-amber-600/50 text-amber-300';
  } else if (variant === 'cymbal-bronze') {
    styleClasses = 'bg-gradient-to-b from-yellow-950/30 to-zinc-900/90 border-yellow-700/30 text-yellow-100 hover:border-yellow-500/60';
    badgeClasses = 'bg-yellow-950/80 border-yellow-700/50 text-yellow-300';
  } else if (variant === 'cymbal-bright') {
    styleClasses = 'bg-gradient-to-b from-amber-900/30 to-zinc-900/90 border-amber-500/40 text-amber-200 hover:border-amber-400/70';
    badgeClasses = 'bg-amber-900/80 border-amber-500/60 text-amber-200';
  } else if (variant === 'drum-snare') {
    styleClasses = 'bg-gradient-to-b from-zinc-800/90 to-zinc-900/90 border-zinc-600/50 text-white hover:border-amber-500/60';
    badgeClasses = 'bg-zinc-950 border-zinc-600 text-amber-300';
  } else if (variant === 'drum-wood') {
    styleClasses = 'bg-gradient-to-b from-zinc-800/80 to-zinc-900/90 border-zinc-700/60 text-zinc-200 hover:border-amber-500/50';
    badgeClasses = 'bg-zinc-950 border-zinc-700 text-zinc-300';
  }

  const heightClass = compact
    ? 'h-14 px-3'
    : isHero
    ? 'h-36 sm:h-40 p-4'
    : 'h-28 sm:h-32 p-3';

  return (
    <button
      onClick={onTrigger}
      className={`relative group rounded-xl border flex flex-col justify-between text-left transition-all duration-75 select-none focus:outline-none ${heightClass} ${styleClasses} ${
        isActive
          ? 'scale-[0.96] border-amber-400 bg-amber-500/25 shadow-[0_0_24px_rgba(245,158,11,0.7)]'
          : 'shadow-md hover:scale-[1.01]'
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span className="text-xs font-semibold tracking-tight text-white group-hover:text-amber-300 transition-colors truncate">
          {pad.name}
        </span>
        <span
          className={`shrink-0 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${badgeClasses}`}
        >
          {pad.keyLabel}
        </span>
      </div>

      <div className="flex items-end justify-between w-full">
        <span className="text-[10px] text-zinc-500 font-mono capitalize">
          {pad.category}
        </span>
        <div
          className={`w-2 h-2 rounded-full transition-all ${
            isActive ? 'bg-amber-400 scale-150 shadow-[0_0_8px_#f59e0b]' : 'bg-zinc-700'
          }`}
        />
      </div>
    </button>
  );
};
