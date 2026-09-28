import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, CheckCircle, Clock, Award, BookOpen, ChevronRight, X, Sparkles, AlertCircle } from 'lucide-react';
import { LESSONS_DATA } from '../data/lessonsData';
import { Lesson, DrumInstrument } from '../types';
import { drumAudio } from '../audio/drumSynth';

interface AcademyPageProps {
  completedLessonIds: string[];
  onToggleLessonComplete: (lessonId: string) => void;
  onOpenKitWithLesson?: (lesson: Lesson) => void;
}

export const AcademyPage: React.FC<AcademyPageProps> = ({
  completedLessonIds,
  onToggleLessonComplete,
}) => {
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Lesson player state
  const [isPlayingPattern, setIsPlayingPattern] = useState<boolean>(false);
  const [currentPlayStep, setCurrentPlayStep] = useState<number>(0);
  const [playbackBpm, setPlaybackBpm] = useState<number>(80);

  const patternIntervalRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);

  // Filter lessons
  const filteredLessons = LESSONS_DATA.filter((lesson) => {
    const matchModule = selectedModule === 'All' || lesson.module === selectedModule;
    const matchLevel = selectedLevel === 'All' || lesson.level === selectedLevel;
    return matchModule && matchLevel;
  });

  const modules = ['All', 'Foundations & The Pocket', 'Rudiments & Hand Technique', 'Groove Mastery & Musical Styles', 'Fills, Timekeeping & Performance'];

  // Start / Stop pattern player
  const startPatternPlayback = (lesson: Lesson) => {
    if (isPlayingPattern) {
      stopPatternPlayback();
      return;
    }

    setIsPlayingPattern(true);
    stepRef.current = 0;
    setCurrentPlayStep(0);

    const stepDurationMs = (60 / playbackBpm / 4) * 1000; // 16th note step

    patternIntervalRef.current = window.setInterval(() => {
      const step = stepRef.current;

      // Find hits at this step
      const hits = lesson.patternSteps.filter((s) => s.step === step);
      hits.forEach((hit) => {
        const vel = hit.accent ? 1.15 : 0.8;
        switch (hit.drum) {
          case 'kick':
            drumAudio.playKick(vel);
            break;
          case 'snare':
            drumAudio.playSnare(vel, false);
            break;
          case 'hihatClosed':
            drumAudio.playHiHatClosed(vel);
            break;
          case 'hihatOpen':
            drumAudio.playHiHatOpen(vel);
            break;
          case 'tomHigh':
            drumAudio.playTom('high', vel);
            break;
          case 'tomMid':
            drumAudio.playTom('mid', vel);
            break;
          case 'tomFloor':
            drumAudio.playTom('floor', vel);
            break;
          case 'crash':
            drumAudio.playCrash(vel);
            break;
        }
      });

      setCurrentPlayStep(step);
      stepRef.current = (stepRef.current + 1) % 16;
    }, stepDurationMs);
  };

  const stopPatternPlayback = () => {
    if (patternIntervalRef.current) {
      clearInterval(patternIntervalRef.current);
      patternIntervalRef.current = null;
    }
    setIsPlayingPattern(false);
    setCurrentPlayStep(0);
    stepRef.current = 0;
  };

  // Clean up
  useEffect(() => {
    return () => {
      if (patternIntervalRef.current) {
        clearInterval(patternIntervalRef.current);
      }
    };
  }, []);

  // Update speed dynamically if BPM changes
  useEffect(() => {
    if (isPlayingPattern && activeLesson) {
      stopPatternPlayback();
      startPatternPlayback(activeLesson);
    }
  }, [playbackBpm]);

  const openLesson = (lesson: Lesson) => {
    stopPatternPlayback();
    setPlaybackBpm(lesson.tempoTarget);
    setActiveLesson(lesson);
  };

  const closeLesson = () => {
    stopPatternPlayback();
    setActiveLesson(null);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-16">
      {/* Academy Header */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>STRUCTURED CURRICULUM · INTERACTIVE SHEET VISUALIZER</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Drum Academy &amp; Lessons
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">
              From foundational grips and standard 4/4 beats to ghost-note funk and linear chops.
            </p>
          </div>

          {/* Academy Progress Tracker */}
          <div className="flex items-center gap-4 bg-zinc-900/90 border border-zinc-800 px-4 py-2.5 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">
                Lessons Completed
              </span>
              <span className="text-lg font-bold text-white font-mono">
                {completedLessonIds.length} / {LESSONS_DATA.length}
              </span>
            </div>
            <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round((completedLessonIds.length / LESSONS_DATA.length) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Module Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {modules.map((mod) => (
              <button
                key={mod}
                onClick={() => setSelectedModule(mod)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                  selectedModule === mod
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 font-semibold'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:text-white'
                }`}
              >
                {mod}
              </button>
            ))}
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800 p-1 rounded-lg">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {filteredLessons.map((lesson) => {
            const isCompleted = completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="group relative rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                <div>
                  {/* Card top row */}
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span className="font-mono text-amber-400/90 font-semibold">
                      Module {lesson.moduleIndex} · {lesson.level}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 font-mono text-zinc-500">
                        <Clock className="w-3.5 h-3.5" />
                        {lesson.duration}
                      </span>
                      {isCompleted && (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
                    {lesson.summary}
                  </p>

                  {/* Sticking / Count pill preview */}
                  <div className="mt-4 p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">Grid:</span>
                    <span className="text-zinc-300 font-bold truncate max-w-[180px]">
                      {lesson.subdivisionCountText}
                    </span>
                    <span className="text-amber-400/90 font-semibold">
                      {lesson.tempoTarget} BPM
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <button
                    onClick={() => onToggleLessonComplete(lesson.id)}
                    className={`text-xs flex items-center gap-1.5 transition-colors ${
                      isCompleted
                        ? 'text-emerald-400 hover:text-emerald-300'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
                  </button>

                  <button
                    onClick={() => openLesson(lesson)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all"
                  >
                    <span>Start Lesson</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Lesson Modal / Drawer */}
      {activeLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 sm:p-8 my-auto overflow-hidden">
            
            {/* Modal Close Button */}
            <button
              onClick={closeLesson}
              className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lesson Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                <span>{activeLesson.module.toUpperCase()}</span>
                <span>·</span>
                <span>{activeLesson.level.toUpperCase()}</span>
                <span>·</span>
                <span>{activeLesson.duration}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {activeLesson.title}
              </h2>
              <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                {activeLesson.summary}
              </p>
            </div>

            {/* Interactive 16-Step Drum Sequencer / Tab Player */}
            <div className="my-6 p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => startPatternPlayback(activeLesson)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md ${
                      isPlayingPattern
                        ? 'bg-red-600 hover:bg-red-500 text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-zinc-950'
                    }`}
                  >
                    {isPlayingPattern ? (
                      <>
                        <Square className="w-4 h-4 fill-current" />
                        <span>STOP PLAYBACK</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>PLAY PATTERN</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                    <span>TEMPO:</span>
                    <input
                      type="range"
                      min="40"
                      max="140"
                      value={playbackBpm}
                      onChange={(e) => setPlaybackBpm(Number(e.target.value))}
                      className="w-24 sm:w-32 accent-amber-500"
                    />
                    <strong className="text-amber-400 font-bold w-12 text-right">
                      {playbackBpm} BPM
                    </strong>
                  </div>
                </div>

                <div className="text-xs font-mono text-zinc-400">
                  COUNT: <span className="text-white font-bold">{activeLesson.subdivisionCountText}</span>
                </div>
              </div>

              {/* 16-Step Visual Matrix */}
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[620px] space-y-2">
                  {/* Step Numbers Top Header */}
                  <div className="grid grid-cols-16 gap-1 text-center font-mono text-[10px] text-zinc-500 pb-1 border-b border-zinc-800">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <span
                        key={i}
                        className={`transition-colors ${
                          isPlayingPattern && currentPlayStep === i
                            ? 'text-amber-400 font-bold'
                            : i % 4 === 0
                            ? 'text-zinc-300 font-semibold'
                            : ''
                        }`}
                      >
                        {i % 4 === 0 ? Math.floor(i / 4) + 1 : i % 2 === 0 ? '&' : '·'}
                      </span>
                    ))}
                  </div>

                  {/* Hi-Hat Row */}
                  <MatrixRow
                    label="Hi-Hat"
                    activeStep={isPlayingPattern ? currentPlayStep : -1}
                    steps={activeLesson.patternSteps.filter((s) => s.drum.includes('hihat'))}
                    rowColor="bg-amber-400"
                  />

                  {/* Snare Row */}
                  <MatrixRow
                    label="Snare"
                    activeStep={isPlayingPattern ? currentPlayStep : -1}
                    steps={activeLesson.patternSteps.filter((s) => s.drum === 'snare')}
                    rowColor="bg-zinc-200"
                  />

                  {/* Kick Row */}
                  <MatrixRow
                    label="Kick"
                    activeStep={isPlayingPattern ? currentPlayStep : -1}
                    steps={activeLesson.patternSteps.filter((s) => s.drum === 'kick')}
                    rowColor="bg-amber-500"
                  />

                  {/* Toms / Crash Row (if present) */}
                  {activeLesson.patternSteps.some((s) => s.drum.includes('tom') || s.drum === 'crash') && (
                    <MatrixRow
                      label="Toms/Crash"
                      activeStep={isPlayingPattern ? currentPlayStep : -1}
                      steps={activeLesson.patternSteps.filter((s) => s.drum.includes('tom') || s.drum === 'crash')}
                      rowColor="bg-yellow-300"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Step-by-Step Educational Breakdown */}
            <div className="space-y-6 mt-6">
              <div>
                <h3 className="text-base font-bold text-white mb-3">
                  Step-by-Step Execution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {activeLesson.stepsBreakdown.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80"
                    >
                      <div className="text-xs font-bold text-amber-400 font-mono mb-1">
                        0{idx + 1}. {step.title}
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tip & Common Pitfalls Callouts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Mendel&apos;s Pro Tip</span>
                  </div>
                  <p className="text-xs text-amber-100 leading-relaxed">
                    {activeLesson.proTip}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-300 mb-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>Watch Out For These Mistakes</span>
                  </div>
                  <ul className="text-xs text-red-200/90 space-y-1 list-disc list-inside">
                    {activeLesson.commonMistakes.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
                <div className="text-xs text-zinc-400">
                  Target Tempo: <strong className="text-amber-400 font-mono">{activeLesson.tempoTarget} BPM</strong>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      onToggleLessonComplete(activeLesson.id);
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all border ${
                      completedLessonIds.includes(activeLesson.id)
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {completedLessonIds.includes(activeLesson.id)
                        ? 'Lesson Completed'
                        : 'Mark Complete'}
                    </span>
                  </button>

                  <button
                    onClick={closeLesson}
                    className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface MatrixRowProps {
  label: string;
  activeStep: number;
  steps: { step: number; accent?: boolean }[];
  rowColor: string;
}

const MatrixRow: React.FC<MatrixRowProps> = ({
  label,
  activeStep,
  steps,
  rowColor,
}) => {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-xs font-mono text-zinc-400 truncate">
        {label}
      </span>
      <div className="grid grid-cols-16 gap-1 flex-1">
        {Array.from({ length: 16 }).map((_, stepIdx) => {
          const hit = steps.find((s) => s.step === stepIdx);
          const isPlayhead = activeStep === stepIdx;

          return (
            <div
              key={stepIdx}
              className={`h-7 rounded flex items-center justify-center transition-all ${
                isPlayhead
                  ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-zinc-950 scale-105'
                  : ''
              } ${
                hit
                  ? hit.accent
                    ? `${rowColor} text-zinc-950 font-black text-xs shadow-sm`
                    : `${rowColor} opacity-75 text-zinc-900 font-bold text-xs`
                  : 'bg-zinc-950/60 border border-zinc-800/60 text-zinc-600'
              }`}
            >
              {hit ? (hit.accent ? '●' : '•') : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
};
