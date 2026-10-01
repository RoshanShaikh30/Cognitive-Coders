import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SakuraCustomCursor } from './components/cinematic/SakuraCustomCursor';
import { Navbar } from './components/navigation/Navbar';
import { HeroSection } from './components/landing/HeroSection';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { ParentDashboard } from './components/dashboards/ParentDashboard';
import { FacultyDashboard } from './components/dashboards/FacultyDashboard';
import { OrgAdminDashboard } from './components/dashboards/OrgAdminDashboard';
import { SuperAdminDashboard } from './components/dashboards/SuperAdminDashboard';
import { AttendAICopilot } from './components/copilot/AttendAICopilot';
import { AuthScreen } from './components/auth/AuthScreen';
import { sound } from './services/soundService';

const MainApp: React.FC = () => {
  const { isAuthenticated, currentUser, currentOrg, toastMessage, showToast } = useAuth();

  const [activeView, setActiveView] = useState<'landing' | 'dashboard'>('landing');
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; view: 'login' | 'signup' }>({
    isOpen: false,
    view: 'login',
  });

  // Protected route handler: Ensure no unauthenticated user can access the dashboard
  const handleEnterApp = () => {
    if (!isAuthenticated) {
      sound.playClick();
      setAuthModalState({ isOpen: true, view: 'login' });
      showToast('Authentication required. Please sign in to access your institutional console.');
    } else {
      setActiveView('dashboard');
    }
  };

  const handleOpenAuth = (view: 'login' | 'signup') => {
    setAuthModalState({ isOpen: true, view });
  };

  const handleAuthSuccess = () => {
    setAuthModalState({ isOpen: false, view: 'login' });
    setActiveView('dashboard');
  };

  // Role-Based Access Control: Selects verified dashboard
  const renderDashboardForRole = () => {
    if (!isAuthenticated || !currentUser) {
      return null;
    }

    switch (currentUser.role) {
      case 'student':
        return <StudentDashboard />;
      case 'parent':
        return <ParentDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'org_admin':
        return <OrgAdminDashboard />;
      case 'super_admin':
        return <SuperAdminDashboard />;
      default:
        return <FacultyDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#1c1917] flex flex-col relative selection:bg-[#c83a4b] selection:text-white">
      {/* Delicate ink-print custom cursor */}
      <SakuraCustomCursor />

      {/* Global Navigation Header */}
      <Navbar
        activeView={activeView}
        setActiveView={(v) => {
          if (v === 'dashboard' && !isAuthenticated) {
            handleEnterApp();
          } else {
            setActiveView(v);
          }
        }}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Viewport */}
      <main className="flex-1">
        {/* PUBLIC LANDING PAGE (Default for all unauthenticated visitors) */}
        {activeView === 'landing' || !isAuthenticated ? (
          <HeroSection
            onEnterApp={handleEnterApp}
            onOpenAuth={handleOpenAuth}
            isAuthenticated={isAuthenticated}
          />
        ) : (
          /* PROTECTED INSTITUTIONAL DASHBOARD (Strictly guarded by authentication) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {renderDashboardForRole()}
          </div>
        )}
      </main>

      {/* AttendAI Copilot (Available on dashboard for verified users) */}
      {isAuthenticated && (
        <AttendAICopilot
          onTriggerDashboardAction={(act, payload) => {
            sound.playSuccessChime();
            showToast(`Copilot executed: ${act} (${payload})`);
          }}
        />
      )}

      {/* Real SaaS Authentication & Verification Flow */}
      {authModalState.isOpen && (
        <AuthScreen
          initialView={authModalState.view}
          onSuccess={handleAuthSuccess}
          onCancel={() => setAuthModalState({ isOpen: false, view: 'login' })}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 px-4 py-3 rounded-2xl washi-panel-dark text-xs text-white shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-2 h-2 rounded-full bg-[#c83a4b] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-[#2b2523]/10 bg-[#fbf9f5] py-8 text-xs text-[#78716c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1c1917] font-display">AttendSphere AI</span>
            <span>·</span>
            <span>Multi-Organization Smart Attendance & Analytics Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Authentication: Supabase RBAC</span>
            <span>·</span>
            <span className="text-[#b48728]">Gemini 3.8 Flash Engine</span>
            <span>·</span>
            <span>Subtle Sakura Design</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
