import React from 'react';
import { Volume2, VolumeX, Menu, X, Disc3 } from 'lucide-react';
import { drumAudio } from '../audio/drumSynth';

interface NavbarProps {
  activeTab: 'home' | 'academy' | 'kit' | 'metronome' | 'rudiments' | 'tracker';
  setActiveTab: (tab: 'home' | 'academy' | 'kit' | 'metronome' | 'rudiments' | 'tracker') => void;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    drumAudio.setMuted(nextMuted);
    setIsMuted(nextMuted);
  };

  const navLinks: { id: NavbarProps['activeTab']; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'academy', label: 'Lessons' },
    { id: 'kit', label: 'Virtual Kit' },
    { id: 'metronome', label: 'Metronome' },
    { id: 'rudiments', label: 'Rudiments' },
    { id: 'tracker', label: 'Journal' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
            <Disc3 className="w-4 h-4 animate-[spin_8s_linear_infinite]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white font-display">
            MENDEL <span className="text-amber-400">DRUMZ</span>
          </span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`transition-colors relative py-1 focus:outline-none ${
                  isActive
                    ? 'text-amber-400 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          {/* Audio volume toggle */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Quick Play Kit CTA */}
          <button
            onClick={() => setActiveTab('kit')}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition-all hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-amber-400 whitespace-nowrap"
          >
            Play Kit
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950/98 px-4 pt-2 pb-4 space-y-1 backdrop-blur-xl">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
