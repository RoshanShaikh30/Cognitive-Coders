import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../services/soundService';
import {
  Volume2,
  VolumeX,
  Building,
  User,
  LogOut,
  ShieldCheck,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (view: 'login' | 'signup') => void;
  activeView: 'landing' | 'dashboard';
  setActiveView: (view: 'landing' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  activeView,
  setActiveView,
}) => {
  const {
    isAuthenticated,
    currentUser,
    currentOrg,
    signOut,
    soundMuted,
    toggleSound,
  } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fbf9f5]/90 backdrop-blur-xl border-b border-[#2b2523]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Crest & Inscription */}
        <div
          onClick={() => {
            setActiveView('landing');
            sound.playHover();
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#c83a4b] text-white flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
            <span className="font-display">AS</span>
          </div>

          <div>
            <span className="text-sm font-bold text-[#1c1917] tracking-tight font-display flex items-center gap-1.5">
              AttendSphere <span className="text-[#c83a4b] font-normal">AI</span>
            </span>
            <span className="text-[10px] text-[#78716c] tracking-wider block font-mono">
              Smart Attendance Platform
            </span>
          </div>
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-[#ede8dc]/80 p-1 rounded-xl border border-[#2b2523]/10 text-xs">
          <button
            onClick={() => {
              setActiveView('landing');
              sound.playClick();
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeView === 'landing'
                ? 'bg-white text-[#1c1917] font-semibold shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            Overview & Design
          </button>
          {isAuthenticated && (
            <button
              onClick={() => {
                setActiveView('dashboard');
                sound.playClick();
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                activeView === 'dashboard'
                  ? 'bg-[#c83a4b] text-white font-semibold shadow-sm'
                  : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              Campus Console
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundMuted ? 'Unmute acoustics' : 'Mute acoustics'}
            className="p-2 rounded-xl bg-white hover:bg-[#ede8dc] text-[#78716c] hover:text-[#1c1917] border border-[#2b2523]/10 transition-colors shadow-sm"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-[#c83a4b]" /> : <Volume2 className="w-4 h-4 text-[#b48728]" />}
          </button>

          {/* If NOT Authenticated: Sign In & Sign Up Buttons */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenAuth('login');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#ede8dc] text-[#1c1917] text-xs font-semibold border border-[#2b2523]/15 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#c83a4b]" />
                <span>Sign In</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenAuth('signup');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#c83a4b] hover:bg-[#b92434] text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </div>
          ) : (
            /* If Authenticated: User Badge and Sign Out */
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-[#1c1917] flex items-center justify-end gap-1">
                  {currentUser?.name}
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#c83a4b]/10 text-[#c83a4b] border border-[#c83a4b]/20">
                    {currentUser?.role.replace('_', ' ')}
                  </span>
                </span>
                <span className="text-[11px] text-[#78716c] truncate max-w-[180px]">
                  {currentOrg?.name || 'Academic Console'}
                </span>
              </div>

              <button
                onClick={async () => {
                  await signOut();
                  setActiveView('landing');
                }}
                title="Secure Sign Out"
                className="p-2 rounded-xl bg-white hover:bg-[#ede8dc] text-[#78716c] hover:text-[#c83a4b] border border-[#2b2523]/10 transition-colors shadow-sm"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
