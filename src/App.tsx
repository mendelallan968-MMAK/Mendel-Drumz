/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { AcademyPage } from './components/AcademyPage';
import { VirtualKitPage } from './components/VirtualKitPage';
import { MetronomePage } from './components/MetronomePage';
import { RudimentsPage } from './components/RudimentsPage';
import { PracticeTrackerPage } from './components/PracticeTrackerPage';
import {
  getInitialStats,
  saveStats,
  getInitialSessions,
  saveSessions,
  getInitialRecordings,
  saveRecordings,
} from './utils/storage';
import { UserStats, PracticeSession, DrumRecording, Lesson } from './types';
import { drumAudio } from './audio/drumSynth';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'home' | 'academy' | 'kit' | 'metronome' | 'rudiments' | 'tracker'
  >('home');

  const [stats, setStats] = useState<UserStats>(getInitialStats);
  const [sessions, setSessions] = useState<PracticeSession[]>(getInitialSessions);
  const [recordings, setRecordings] = useState<DrumRecording[]>(getInitialRecordings);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Sync state changes to localStorage
  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    saveRecordings(recordings);
  }, [recordings]);

  // Handlers
  const handleToggleLessonComplete = (lessonId: string) => {
    setStats((prev) => {
      const exists = prev.completedLessonIds.includes(lessonId);
      const nextCompleted = exists
        ? prev.completedLessonIds.filter((id) => id !== lessonId)
        : [...prev.completedLessonIds, lessonId];

      return {
        ...prev,
        completedLessonIds: nextCompleted,
      };
    });
  };

  const handleToggleMasteredRudiment = (rudimentId: string) => {
    setStats((prev) => {
      const exists = prev.masteredRudimentIds.includes(rudimentId);
      const nextMastered = exists
        ? prev.masteredRudimentIds.filter((id) => id !== rudimentId)
        : [...prev.masteredRudimentIds, rudimentId];

      return {
        ...prev,
        masteredRudimentIds: nextMastered,
      };
    });
  };

  const handleAddSession = (newSession: PracticeSession) => {
    setSessions((prev) => [newSession, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalPracticeMinutes: prev.totalPracticeMinutes + newSession.durationMinutes,
      streakDays: prev.streakDays + 1,
    }));
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  const handleUpdateGoal = (minutes: number) => {
    setStats((prev) => ({
      ...prev,
      currentGoalMinutes: Math.max(5, Math.min(240, minutes)),
    }));
  };

  const handleSaveRecording = (rec: DrumRecording) => {
    setRecordings((prev) => [rec, ...prev]);
  };

  const handleDeleteRecording = (id: string) => {
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSelectLesson = (_lesson: Lesson) => {
    setActiveTab('academy');
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            stats={stats}
            onNavigate={setActiveTab}
            onSelectLesson={handleSelectLesson}
          />
        )}

        {activeTab === 'academy' && (
          <AcademyPage
            completedLessonIds={stats.completedLessonIds}
            onToggleLessonComplete={handleToggleLessonComplete}
          />
        )}

        {activeTab === 'kit' && (
          <VirtualKitPage
            recordings={recordings}
            onSaveRecording={handleSaveRecording}
            onDeleteRecording={handleDeleteRecording}
          />
        )}

        {activeTab === 'metronome' && <MetronomePage />}

        {activeTab === 'rudiments' && (
          <RudimentsPage
            masteredRudimentIds={stats.masteredRudimentIds}
            onToggleMastered={handleToggleMasteredRudiment}
          />
        )}

        {activeTab === 'tracker' && (
          <PracticeTrackerPage
            stats={stats}
            sessions={sessions}
            onAddSession={handleAddSession}
            onDeleteSession={handleDeleteSession}
            onUpdateGoal={handleUpdateGoal}
          />
        )}
      </main>

      {/* Professional Dark Studio Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold tracking-tight font-display text-sm">
              MENDEL <span className="text-amber-400">DRUMZ</span>
            </span>
            <span>·</span>
            <span>Learn. Practice. Play. Master the Rhythm.</span>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <button
              onClick={() => setActiveTab('home')}
              className="hover:text-amber-400 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('academy')}
              className="hover:text-amber-400 transition-colors"
            >
              Curriculum
            </button>
            <button
              onClick={() => setActiveTab('kit')}
              className="hover:text-amber-400 transition-colors"
            >
              Virtual Kit
            </button>
            <button
              onClick={() => setActiveTab('metronome')}
              className="hover:text-amber-400 transition-colors"
            >
              Metronome Lab
            </button>
            <button
              onClick={() => setActiveTab('rudiments')}
              className="hover:text-amber-400 transition-colors"
            >
              Rudiment Vault
            </button>
            <button
              onClick={() => setActiveTab('tracker')}
              className="hover:text-amber-400 transition-colors"
            >
              Practice Journal
            </button>
          </div>

          <div className="text-zinc-600">
            © {new Date().getFullYear()} Mendel Drumz Studio. Pure Web Audio Engine.
          </div>
        </div>
      </footer>
    </div>
  );
}
