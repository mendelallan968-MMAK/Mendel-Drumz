import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Award, CheckCircle, Flame, Sparkles, FastForward } from 'lucide-react';
import { RUDIMENTS_DATA } from '../data/rudimentsData';
import { Rudiment } from '../types';
import { drumAudio } from '../audio/drumSynth';

interface RudimentsPageProps {
  masteredRudimentIds: string[];
  onToggleMastered: (id: string) => void;
}

export const RudimentsPage: React.FC<RudimentsPageProps> = ({
  masteredRudimentIds,
  onToggleMastered,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeRudimentId, setActiveRudimentId] = useState<string>(RUDIMENTS_DATA[0].id);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [tempo, setTempo] = useState<number>(80);
  const [isHalfSpeed, setIsHalfSpeed] = useState<boolean>(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number>(-1);

  const playbackTimerRef = useRef<number | null>(null);
  const noteIndexRef = useRef<number>(0);

  const categories = ['All', 'Rolls', 'Diddles', 'Flams', 'Drags'];

  const filteredRudiments = RUDIMENTS_DATA.filter(
    (r) => selectedCategory === 'All' || r.category === selectedCategory
  );

  const currentRudiment =
    RUDIMENTS_DATA.find((r) => r.id === activeRudimentId) || RUDIMENTS_DATA[0];

  const stopPlayback = () => {
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    setIsPlaying(false);
    setActiveNoteIndex(-1);
    noteIndexRef.current = 0;
  };

  const startPlayback = (rudiment: Rudiment) => {
    if (isPlaying) {
      stopPlayback();
      return;
    }

    setIsPlaying(true);
    noteIndexRef.current = 0;
    setActiveNoteIndex(0);

    const actualBpm = isHalfSpeed ? tempo * 0.5 : tempo;
    // 16th note subdivision delay
    const noteIntervalMs = (60 / actualBpm / 4) * 1000;

    playbackTimerRef.current = window.setInterval(() => {
      const idx = noteIndexRef.current;
      const note = rudiment.pattern[idx];

      if (note) {
        if (note.flam) {
          // Play grace note then primary accent
          drumAudio.playSnare(0.35, false);
          setTimeout(() => {
            drumAudio.playSnare(1.15, note.hand === 'R');
          }, 25);
        } else if (note.drag) {
          drumAudio.playSnare(0.3, false);
          setTimeout(() => drumAudio.playSnare(0.3, false), 18);
          setTimeout(() => drumAudio.playSnare(1.1, true), 38);
        } else {
          drumAudio.playSnare(note.accent ? 1.15 : 0.65, note.accent && note.hand === 'R');
        }
      }

      setActiveNoteIndex(idx);
      noteIndexRef.current = (idx + 1) % rudiment.pattern.length;
    }, noteIntervalMs);
  };

  useEffect(() => {
    return () => {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
    };
  }, []);

  // Restart if tempo or half-speed changes during playback
  useEffect(() => {
    if (isPlaying) {
      stopPlayback();
      startPlayback(currentRudiment);
    }
  }, [tempo, isHalfSpeed]);

  const selectRudiment = (r: Rudiment) => {
    stopPlayback();
    setActiveRudimentId(r.id);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-16">
      {/* Header */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>PERCUSSIVE ARTS SOCIETY (PAS) · 40 STANDARD RUDIMENTS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Rudiment Vault
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              The vocabulary of drumming. Practice alternating stickings, grace notes, and diddle mechanics.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 px-4 py-2 rounded-xl">
            <Award className="w-5 h-5 text-amber-400" />
            <div className="text-xs">
              <span className="text-zinc-400 block font-mono">Mastery Badges</span>
              <strong className="text-white font-mono font-bold">
                {masteredRudimentIds.length} of {RUDIMENTS_DATA.length} Unlocked
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-2 pb-4 border-b border-zinc-800/80 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                selectedCategory === cat
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-semibold'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* Left Column: Rudiment Selector List (4 Cols) */}
          <div className="lg:col-span-4 space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredRudiments.map((rud) => {
              const isSelected = rud.id === currentRudiment.id;
              const isMastered = masteredRudimentIds.includes(rud.id);

              return (
                <button
                  key={rud.id}
                  onClick={() => selectRudiment(rud)}
                  className={`w-full p-4 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-zinc-900 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-zinc-950/60 border-zinc-800 hover:bg-zinc-900/60 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
                      {rud.category}
                    </span>
                    {isMastered && (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    {rud.name}
                  </h4>
                  <div className="text-xs font-mono text-zinc-400 mt-2 bg-zinc-950 px-2 py-1 rounded border border-zinc-800/80 inline-block">
                    {rud.sticking}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Sticking Visualizer & Player (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
                <div>
                  <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
                    {currentRudiment.category} · {currentRudiment.subdivision}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {currentRudiment.name}
                  </h2>
                  <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                    {currentRudiment.description}
                  </p>
                </div>

                <button
                  onClick={() => onToggleMastered(currentRudiment.id)}
                  className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    masteredRudimentIds.includes(currentRudiment.id)
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {masteredRudimentIds.includes(currentRudiment.id)
                      ? 'Mastered'
                      : 'Mark Mastered'}
                  </span>
                </button>
              </div>

              {/* Dynamic Animated Sticking Nodes */}
              <div className="my-8">
                <div className="text-xs font-mono text-zinc-500 mb-3 uppercase tracking-wider">
                  Real-time Sticking Pattern (Amber = Right Hand, Silver = Left Hand)
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 min-h-[140px]">
                  {currentRudiment.pattern.map((p, idx) => {
                    const isCurrent = isPlaying && activeNoteIndex === idx;
                    const isRight = p.hand === 'R';

                    return (
                      <div
                        key={idx}
                        className={`relative flex flex-col items-center justify-center w-12 sm:w-14 h-16 sm:h-18 rounded-xl border transition-all duration-75 ${
                          isCurrent
                            ? isRight
                              ? 'scale-115 border-amber-400 bg-amber-500/30 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.8)]'
                              : 'scale-115 border-zinc-200 bg-zinc-200/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.7)]'
                            : isRight
                            ? 'bg-amber-950/20 border-amber-500/30 text-amber-400'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                        }`}
                      >
                        {/* Grace note marker (flam/drag) */}
                        {p.flam && (
                          <span className="text-[10px] text-amber-400 font-mono -mt-1 font-bold">
                            flam
                          </span>
                        )}
                        {p.drag && (
                          <span className="text-[10px] text-amber-400 font-mono -mt-1 font-bold">
                            drag
                          </span>
                        )}

                        <span className="text-xl sm:text-2xl font-black font-mono">
                          {p.hand}
                        </span>

                        {p.accent && (
                          <span className="text-[10px] text-amber-400 font-bold -mt-0.5">
                            &gt;
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Player Controls Deck */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => startPlayback(currentRudiment)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md ${
                      isPlaying
                        ? 'bg-red-600 hover:bg-red-500 text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-zinc-950'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Square className="w-4 h-4 fill-current" />
                        <span>STOP</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>PLAY AUDIBLE STICKING</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsHalfSpeed(!isHalfSpeed)}
                    className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-colors border ${
                      isHalfSpeed
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
                    }`}
                    title="0.5x Slow Motion Study"
                  >
                    0.5x Slow-Mo
                  </button>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs text-zinc-400">
                  <span>TEMPO:</span>
                  <input
                    type="range"
                    min="40"
                    max="160"
                    value={tempo}
                    onChange={(e) => setTempo(Number(e.target.value))}
                    className="w-28 sm:w-36 accent-amber-500"
                  />
                  <span className="text-amber-400 font-bold w-12 text-right">
                    {isHalfSpeed ? Math.round(tempo * 0.5) : tempo} BPM
                  </span>
                </div>
              </div>

              {/* Target Speed Tiers */}
              <div className="mt-8 pt-6 border-t border-zinc-800">
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">
                  Mastery Speed Milestones
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-center">
                    <span className="block text-[10px] font-mono text-amber-400 uppercase font-semibold">
                      🥉 Bronze
                    </span>
                    <span className="text-lg font-black font-mono text-white mt-1">
                      {currentRudiment.tempoTiers.bronze} BPM
                    </span>
                    <span className="block text-[10px] text-zinc-500 mt-0.5">Control</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/50 text-center">
                    <span className="block text-[10px] font-mono text-zinc-300 uppercase font-semibold">
                      🥈 Silver
                    </span>
                    <span className="text-lg font-black font-mono text-white mt-1">
                      {currentRudiment.tempoTiers.silver} BPM
                    </span>
                    <span className="block text-[10px] text-zinc-500 mt-0.5">Solid Pocket</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                    <span className="block text-[10px] font-mono text-amber-300 uppercase font-semibold">
                      🥇 Gold
                    </span>
                    <span className="text-lg font-black font-mono text-amber-300 mt-1">
                      {currentRudiment.tempoTiers.gold} BPM
                    </span>
                    <span className="block text-[10px] text-zinc-500 mt-0.5">Pro Speed</span>
                  </div>

                  <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-center">
                    <span className="block text-[10px] font-mono text-cyan-300 uppercase font-semibold">
                      💎 Diamond
                    </span>
                    <span className="text-lg font-black font-mono text-cyan-200 mt-1">
                      {currentRudiment.tempoTiers.diamond} BPM
                    </span>
                    <span className="block text-[10px] text-zinc-500 mt-0.5">Virtuoso</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
