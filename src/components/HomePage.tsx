import React from 'react';
import { Play, ArrowRight, Flame, Clock, Award, Disc3, Sparkles, Volume2, Music, CheckCircle } from 'lucide-react';
import { UserStats, Lesson } from '../types';
import { LESSONS_DATA } from '../data/lessonsData';
import { RUDIMENTS_DATA } from '../data/rudimentsData';
import { drumAudio } from '../audio/drumSynth';
import heroDrumKitImg from '../assets/images/hero_acoustic_drum_kit_1790617355244.jpg';
import studioLiveRoomImg from '../assets/images/studio_live_room_1790617379574.jpg';

interface HomePageProps {
  stats: UserStats;
  onNavigate: (tab: 'home' | 'academy' | 'kit' | 'metronome' | 'rudiments' | 'tracker') => void;
  onSelectLesson: (lesson: Lesson) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  stats,
  onNavigate,
  onSelectLesson,
}) => {
  // Find next uncompleted lesson or default to first
  const nextLesson =
    LESSONS_DATA.find((l) => !stats.completedLessonIds.includes(l.id)) ||
    LESSONS_DATA[0];

  const dailyRudiment = RUDIMENTS_DATA[2]; // Single Paradiddle

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] pb-20">
      
      {/* Hero Section with Cinematic Background & Measured Scrim */}
      <section className="relative w-full min-h-[620px] flex items-center justify-center overflow-hidden border-b border-zinc-800/80">
        
        {/* Background Image with Fallback and Dark Studio Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroDrumKitImg}
            alt="Professional acoustic drum kit in recording studio"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 opacity-35"
          />
          {/* Measured Dark Overlays to ensure 100% WCAG legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-[#090a0f]/85 to-[#090a0f]/75" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,10,15,0.9)_100%)]" />
        </div>

        {/* Ambient Amber Glow Spotlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          
          {/* Studio Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium mb-6 shadow-lg backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>PERSONAL DRUM LEARNING STUDIO</span>
          </div>

          {/* Large Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white font-display uppercase">
            MENDEL <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200">DRUMZ</span> 🥁
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-2xl text-amber-200/90 font-medium mt-3 tracking-wide font-display">
            “Learn. Practice. Play. Master the Rhythm.”
          </p>

          {/* Short Welcome Prose */}
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto mt-4 leading-relaxed">
            Welcome to your personal drumming sanctuary. Whether you are locking in your very first 4/4 rock groove, refining finger rebound on the practice pad, or internalizing complex syncopated ghost notes, MENDEL DRUMZ gives you the interactive tools to master timing, technique, and musical pocket.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <button
              onClick={() => onNavigate('academy')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold text-sm shadow-[0_4px_24px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Explore Lessons</span>
            </button>

            <button
              onClick={() => onNavigate('kit')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 font-semibold text-sm border border-zinc-700/80 hover:border-amber-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg backdrop-blur-md"
            >
              <Disc3 className="w-4 h-4 text-amber-400" />
              <span>Open Virtual Kit</span>
            </button>

            <button
              onClick={() => onNavigate('metronome')}
              className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium text-sm border border-zinc-800 transition-all"
            >
              <Clock className="w-4 h-4 text-zinc-400" />
              <span>Metronome &amp; Lab</span>
            </button>
          </div>

          {/* Quick-Play Live Interactive Strip */}
          <div className="mt-12 p-3 sm:p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 shadow-2xl backdrop-blur-xl max-w-3xl mx-auto">
            <div className="flex items-center justify-between px-2 pb-2 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5 text-amber-400/90 font-semibold">
                <Volume2 className="w-3.5 h-3.5" />
                INSTANT SOUND TEST (TAP TO PLAY)
              </span>
              <span className="hidden sm:inline text-zinc-500">
                Live Acoustic Web Audio Synth
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button
                onClick={() => drumAudio.playKick(1.1)}
                className="py-3 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-xs font-semibold text-zinc-200 transition-all active:scale-95 text-center"
              >
                <span className="block text-white font-bold">Kick</span>
                <span className="block text-[10px] text-zinc-500 font-mono mt-0.5">22&quot; Maple</span>
              </button>

              <button
                onClick={() => drumAudio.playSnare(1.1, false)}
                className="py-3 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-xs font-semibold text-zinc-200 transition-all active:scale-95 text-center"
              >
                <span className="block text-white font-bold">Snare</span>
                <span className="block text-[10px] text-zinc-500 font-mono mt-0.5">14&quot; Center</span>
              </button>

              <button
                onClick={() => drumAudio.playSnare(1.1, true)}
                className="py-3 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-xs font-semibold text-zinc-200 transition-all active:scale-95 text-center"
              >
                <span className="block text-white font-bold">Rimshot</span>
                <span className="block text-[10px] text-zinc-500 font-mono mt-0.5">Crack</span>
              </button>

              <button
                onClick={() => drumAudio.playHiHatClosed(0.9)}
                className="py-3 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-xs font-semibold text-amber-200 transition-all active:scale-95 text-center"
              >
                <span className="block text-amber-300 font-bold">Closed Hat</span>
                <span className="block text-[10px] text-zinc-500 font-mono mt-0.5">14&quot; Tight</span>
              </button>

              <button
                onClick={() => drumAudio.playTom('mid', 1.0)}
                className="py-3 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-xs font-semibold text-zinc-200 transition-all active:scale-95 text-center"
              >
                <span className="block text-white font-bold">Rack Tom</span>
                <span className="block text-[10px] text-zinc-500 font-mono mt-0.5">12&quot; Tuned</span>
              </button>

              <button
                onClick={() => drumAudio.playCrash(1.0)}
                className="py-3 px-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 text-xs font-semibold text-amber-300 transition-all active:scale-95 text-center"
              >
                <span className="block text-amber-300 font-bold">Crash</span>
                <span className="block text-[10px] text-zinc-500 font-mono mt-0.5">18&quot; Bronze</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Student Progress Overview Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-xl">
          
          <div className="p-3 text-center sm:text-left sm:border-r border-zinc-800">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-amber-400 font-mono">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>PRACTICE STREAK</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
              {stats.streakDays} Days
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Keep the groove burning
            </div>
          </div>

          <div className="p-3 text-center sm:text-left sm:border-r border-zinc-800">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-zinc-400 font-mono">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>TOTAL TIME</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
              {stats.totalPracticeMinutes} Mins
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Logged studio hours
            </div>
          </div>

          <div className="p-3 text-center sm:text-left sm:border-r border-zinc-800">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-zinc-400 font-mono">
              <CheckCircle className="w-4 h-4 text-amber-400" />
              <span>COMPLETED</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
              {stats.completedLessonIds.length} / {LESSONS_DATA.length}
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Academy modules done
            </div>
          </div>

          <div className="p-3 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-zinc-400 font-mono">
              <Award className="w-4 h-4 text-amber-400" />
              <span>RUDIMENT VAULT</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">
              {stats.masteredRudimentIds.length} Mastered
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              PAS standard rudiments
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jump-Ins: Next Lesson & Daily Rudiment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Next Lesson Spotlight (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-mono">
              <span className="text-amber-400 font-semibold">
                CONTINUE LEARNING · MODULE {nextLesson.moduleIndex}
              </span>
              <span>{nextLesson.duration}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {nextLesson.title}
            </h3>

            <p className="text-sm text-zinc-300 mt-3 leading-relaxed">
              {nextLesson.summary}
            </p>

            <div className="mt-5 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">Key Takeaway:</span>
                <span className="text-amber-400/90 font-semibold">{nextLesson.tempoTarget} BPM Target</span>
              </div>
              <p className="text-xs text-zinc-300 italic">
                &ldquo;{nextLesson.keyTakeaway}&rdquo;
              </p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-mono">
              Level: <strong className="text-zinc-300">{nextLesson.level}</strong>
            </span>

            <button
              onClick={() => {
                onNavigate('academy');
                onSelectLesson(nextLesson);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all shadow-sm"
            >
              <span>Resume Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Daily Rudiment Challenge (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>TODAY&apos;S RUDIMENT WORKOUT</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {dailyRudiment.name}
            </h3>

            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              {dailyRudiment.description}
            </p>

            {/* Sticking Badge Flow */}
            <div className="my-5 p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-center">
              <div className="text-2xl sm:text-3xl font-mono font-black text-amber-300 tracking-wider">
                {dailyRudiment.sticking}
              </div>
              <span className="text-[10px] font-mono text-zinc-500 mt-1 block">
                Subdivision: {dailyRudiment.subdivision}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-400">
              Gold Goal: <strong className="text-amber-400 font-bold">{dailyRudiment.tempoTiers.gold} BPM</strong>
            </span>

            <button
              onClick={() => onNavigate('rudiments')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline"
            >
              Open in Vault →
            </button>
          </div>
        </div>
      </section>

      {/* 4 Pillars Curriculum Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
            COMPREHENSIVE DRUM EDUCATION
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            The Mendel Drumz Curriculum
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            Structured into progressive tiers designed to build relaxed mechanics, musical timekeeping, and expressive freedom.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              num: '01',
              title: 'Foundations & The Pocket',
              desc: 'Grip balance, throne ergonomics, 8th-note money beats, and syncopated kick foot variations.',
              lessonsCount: '4 Modules',
              highlight: 'Beginner',
            },
            {
              num: '02',
              title: 'Rudiments & Technique',
              desc: 'The Moeller whip, single/double stroke roll dynamics, paradiddle grooves, and ghost notes.',
              lessonsCount: '5 Modules',
              highlight: 'Technique',
            },
            {
              num: '03',
              title: 'Groove & Musical Styles',
              desc: 'Funk dynamics, two-handed 16th hats, the Purdie half-time shuffle, and 4-way limb independence.',
              lessonsCount: '4 Modules',
              highlight: 'Intermediate',
            },
            {
              num: '04',
              title: 'Linear Chops & Soloing',
              desc: 'Gospel drum fills, hand-to-foot combinations, seamless transitions, and musical phrasing.',
              lessonsCount: '3 Modules',
              highlight: 'Advanced',
            },
          ].map((pillar) => (
            <div
              key={pillar.num}
              className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-amber-500/40 transition-all hover:bg-zinc-900/90 group"
            >
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-3">
                <span className="text-amber-400 font-bold">{pillar.num}</span>
                <span className="text-zinc-400">{pillar.highlight}</span>
              </div>
              <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                {pillar.title}
              </h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {pillar.desc}
              </p>
              <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-500">
                {pillar.lessonsCount}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Atmospheric Recording Studio Live Room Visual Rest Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute inset-0 z-0">
            <img
              src={studioLiveRoomImg}
              alt="Mendel Drumz recording studio live room"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent" />
          </div>

          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
              REAL STUDIO PRACTICE DISCIPLINE
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              Speed is a Byproduct of Control
            </h3>
            <p className="text-sm text-zinc-300 mt-3 leading-relaxed">
              Every drum legend from Buddy Rich and John Bonham to Steve Gadd and Vinnie Colaiuta started with relaxed stick rebound and honest metronome timekeeping. Turn on the click, relax your shoulders, and play every note with intent.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => onNavigate('tracker')}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold transition-all"
              >
                Log Today&apos;s Session
              </button>
              <button
                onClick={() => onNavigate('kit')}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold transition-all"
              >
                Play Drums Now
              </button>
            </div>
          </div>

          <div className="relative z-10 hidden md:block w-72 shrink-0 p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md">
            <div className="text-xs font-mono text-zinc-400 uppercase font-semibold mb-2">
              Drummer&apos;s Golden Rule
            </div>
            <p className="text-xs text-amber-200/90 leading-relaxed italic font-serif">
              &ldquo;If you can&apos;t play it slow, you won&apos;t play it fast. Groove begins in the space between the notes.&rdquo;
            </p>
            <div className="mt-3 text-[11px] font-mono text-zinc-500">
              — Mendel Drumz Studio
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
