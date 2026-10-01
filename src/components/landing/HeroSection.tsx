import React, { useState } from 'react';
import { SubtleSakuraAtmosphere } from '../cinematic/SubtleSakuraAtmosphere';
import { sound } from '../../services/soundService';
import {
  ShieldCheck,
  Camera,
  Cpu,
  ArrowRight,
  Building,
  GraduationCap,
  Users,
  LogIn,
  UserPlus,
  QrCode,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  BarChart3,
  Bell,
  HeartHandshake,
} from 'lucide-react';

interface HeroSectionProps {
  onEnterApp: () => void;
  onOpenAuth: (view: 'login' | 'signup') => void;
  isAuthenticated: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onEnterApp,
  onOpenAuth,
  isAuthenticated,
}) => {
  // Interactive Product Feature Showcase State
  const [activeFeatureTab, setActiveFeatureTab] = useState<'qr' | 'face' | 'prediction' | 'insights'>('qr');

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#faf8f5]">
      {/* Subtle, restrained falling petals background — decorative only, zero visual clutter */}
      <SubtleSakuraAtmosphere />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 flex flex-col items-center text-center">
        {/* Modern Platform Identifier Badge */}
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#c83a4b] tracking-wider uppercase mb-5 py-1.5 px-4 rounded-full bg-white border border-[#2b2523]/10 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#c83a4b]" />
          <span>AttendSphere AI · Unified Academic Attendance Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1c1917] font-display tracking-tight leading-[1.12] max-w-4xl">
          Multi-Organization Smart Attendance &{' '}
          <span className="text-[#c83a4b]">Predictive Analytics</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-[#57534e] max-w-3xl leading-relaxed">
          The intelligent attendance ecosystem engineered for schools, universities, colleges, and training institutions.
          Combines dynamic QR check-ins, biometric facial recognition radar, and Google Gemini AI predictive risk modeling.
        </p>

        {/* Primary Call to Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={() => {
                sound.playSuccessChime();
                onEnterApp();
              }}
              className="px-7 py-3.5 rounded-2xl bg-[#c83a4b] hover:bg-[#b92434] text-white font-semibold text-sm flex items-center gap-2.5 shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Go to Institutional Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenAuth('login');
                }}
                className="px-7 py-3.5 rounded-2xl bg-[#c83a4b] hover:bg-[#b92434] text-white font-semibold text-sm flex items-center gap-2.5 shadow-md transition-all hover:scale-[1.02] cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Your Institution</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenAuth('signup');
                }}
                className="px-7 py-3.5 rounded-2xl bg-white hover:bg-[#f5f1e8] text-[#1c1917] border border-[#2b2523]/15 text-sm font-semibold flex items-center gap-2 shadow-xs transition-all hover:border-[#c83a4b] cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-[#c83a4b]" />
                <span>Register Educational Institution</span>
              </button>
            </>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* INTERACTIVE PRODUCT CAPABILITY SHOWCASE (The Product in Action) */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-14 w-full max-w-4xl washi-card-elevated rounded-3xl p-6 sm:p-8 border border-[#2b2523]/10 shadow-lg text-left">
          {/* Showcase Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#2b2523]/10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#b48728] font-bold block">
                Live Interactive Product Simulator
              </span>
              <h3 className="text-base font-bold text-[#1c1917] font-display">
                Experience Core Platform Engines
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 bg-[#f4efe4] p-1 rounded-xl border border-[#2b2523]/10">
              <button
                onClick={() => {
                  setActiveFeatureTab('qr');
                  sound.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeFeatureTab === 'qr'
                    ? 'bg-white text-[#c83a4b] shadow-xs'
                    : 'text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR Attendance</span>
              </button>

              <button
                onClick={() => {
                  setActiveFeatureTab('face');
                  sound.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeFeatureTab === 'face'
                    ? 'bg-white text-[#b48728] shadow-xs'
                    : 'text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Face Radar</span>
              </button>

              <button
                onClick={() => {
                  setActiveFeatureTab('prediction');
                  sound.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeFeatureTab === 'prediction'
                    ? 'bg-white text-[#626c59] shadow-xs'
                    : 'text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Prediction Engine</span>
              </button>

              <button
                onClick={() => {
                  setActiveFeatureTab('insights');
                  sound.playClick();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeFeatureTab === 'insights'
                    ? 'bg-white text-[#c83a4b] shadow-xs'
                    : 'text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Insights</span>
              </button>
            </div>
          </div>

          {/* Interactive Feature Panel 1: QR ATTENDANCE */}
          {activeFeatureTab === 'qr' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 bg-white p-5 rounded-2xl border border-[#2b2523]/10 text-center shadow-xs">
                <div className="w-24 h-24 mx-auto bg-[#faf8f5] p-2 rounded-xl border border-[#2b2523]/10 flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-[#1c1917]" />
                </div>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#626c59] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#626c59] animate-pulse" />
                  <span>TOKEN: SEC-2026-X9</span>
                </div>
                <span className="text-[10px] text-[#78716c] mt-0.5 block">
                  Expires in 08:42 · Geofence Verified
                </span>
              </div>

              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-[#c83a4b]/10 text-[#c83a4b]">
                    Feature 01 · Lecture QR Turnstile
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#1c1917] font-display">
                  Dynamic Anti-Replay QR Verification
                </h4>
                <p className="text-xs text-[#57534e] leading-relaxed">
                  Faculty generate an encrypted QR code projected overhead. Students scan with mobile cameras to confirm attendance instantaneously. Time-delimited tokens prevent screenshot sharing, while location coordinates enforce on-campus verification.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-white border border-[#2b2523]/10">
                    <span className="text-[#78716c] block text-[9px]">EXCLUSIVITY</span>
                    <span className="font-bold text-[#1c1917]">Unique / Lecture</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#2b2523]/10">
                    <span className="text-[#78716c] block text-[9px]">DUPLICATES</span>
                    <span className="font-bold text-[#626c59]">Auto-Rejected</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#2b2523]/10">
                    <span className="text-[#78716c] block text-[9px]">TIMESTAMPS</span>
                    <span className="font-bold text-[#b48728]">Sub-Second</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Feature Panel 2: FACE RADAR */}
          {activeFeatureTab === 'face' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 bg-[#1c1917] p-5 rounded-2xl text-center shadow-xs text-white relative overflow-hidden">
                <div className="w-20 h-20 mx-auto rounded-full border-2 border-dashed border-[#b48728] flex items-center justify-center relative">
                  <Camera className="w-10 h-10 text-[#b48728] animate-pulse" />
                  <div className="absolute inset-0 rounded-full border border-[#c83a4b]/40 animate-ping" />
                </div>
                <div className="mt-3 text-[11px] font-mono text-[#b48728] font-bold">
                  MATCH: 99.4% CONFIDENCE
                </div>
                <span className="text-[10px] text-[#a8a29e] mt-0.5 block">
                  SHA-256: 4f8a...c92b
                </span>
              </div>

              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-[#b48728]/15 text-[#b48728]">
                    Feature 02 · Biometric Recognition Radar
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#1c1917] font-display">
                  Sub-Second Optical Face Verification
                </h4>
                <p className="text-xs text-[#57534e] leading-relaxed">
                  Optical camera verification scans students seamlessly at classroom entrances. Matches enrolled student profiles, writes verified attendance records to the isolated tenant database, and prevents proxy attendance.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-white border border-[#2b2523]/10">
                    <span className="text-[#78716c] block text-[9px]">LATENCY</span>
                    <span className="font-bold text-[#1c1917]">&lt; 350ms</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#2b2523]/10">
                    <span className="text-[#78716c] block text-[9px]">ENCRYPTION</span>
                    <span className="font-bold text-[#626c59]">SHA-256 Audit</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#2b2523]/10">
                    <span className="text-[#78716c] block text-[9px]">PRIVACY</span>
                    <span className="font-bold text-[#b48728]">Local Enclave</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Feature Panel 3: PREDICTION ENGINE */}
          {activeFeatureTab === 'prediction' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-[#2b2523]/10 shadow-xs space-y-2.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#78716c]">Current Attendance:</span>
                  <span className="font-bold text-[#c83a4b]">78.0%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#c83a4b]/10 border border-[#c83a4b]/20 text-xs text-[#c83a4b]">
                  <span className="font-bold block">Prediction Horizon:</span>
                  Likely to drop below 75% in 2 weeks
                </div>
                <div className="p-2.5 rounded-xl bg-[#626c59]/10 border border-[#626c59]/20 text-xs text-[#626c59]">
                  <span className="font-bold block">Recovery Plan:</span>
                  Attend next 4 classes to recover
                </div>
              </div>

              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-[#626c59]/15 text-[#626c59]">
                    Feature 03 · Mathematical Trend Forecast
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#1c1917] font-display">
                  Remediation & Debarment Risk Radar
                </h4>
                <p className="text-xs text-[#57534e] leading-relaxed">
                  Instead of looking backward at historical logs, the prediction engine calculates forward trajectories. Automatically informs students and faculty of the exact number of consecutive sessions needed to retain statutory examination clearance.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-white border border-[#2b2523]/10">
                    <span className="text-[#78716c] block text-[9px]">HORIZONS</span>
                    <span className="font-bold text-[#1c1917]">2 & 4 Weeks</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#2b2523]/10">
                    <span className="text-[#78716c] block text-[9px]">THRESHOLD</span>
                    <span className="font-bold text-[#c83a4b]">75.0% Quota</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#2b2523]/10">
                    <span className="text-[#78716c] block text-[9px]">SIMULATOR</span>
                    <span className="font-bold text-[#626c59]">Interactive</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Feature Panel 4: AI INSIGHTS */}
          {activeFeatureTab === 'insights' && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-[#2b2523]/10 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#b48728] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini 3.8 Flash Diagnostic</span>
                </div>
                <p className="text-xs text-[#57534e] leading-relaxed italic">
                  "Cohort attendance drops by 14% on Friday laboratory sessions. Automated parental advisories prepared for 3 at-risk students."
                </p>
                <span className="text-[10px] font-mono text-[#626c59] block pt-1">
                  Confidence Score: 98.2% · Real-time
                </span>
              </div>

              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-[#c83a4b]/10 text-[#c83a4b]">
                    Feature 04 · AttendAI Copilot
                  </span>
                </div>
                <h4 className="text-base font-bold text-[#1c1917] font-display">
                  Proactive Institutional Intelligence
                </h4>
                <p className="text-xs text-[#57534e] leading-relaxed">
                  Natural language telemetry agent powered by Google Gemini. Instantly answers queries like <em>"Show students below 75%"</em>, drafts parental notification emails, and identifies departmental absenteeism trends.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-white border border-[#2b2523]/10">
                    <span className="text-[#78716c] block text-[9px]">COPILOT</span>
                    <span className="font-bold text-[#1c1917]">Draggable UI</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#2b2523]/10">
                    <span className="text-[#78716c] block text-[9px]">DIAGNOSTICS</span>
                    <span className="font-bold text-[#626c59]">Automated</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-[#2b2523]/10">
                    <span className="text-[#78716c] block text-[9px]">REPORTS</span>
                    <span className="font-bold text-[#b48728]">PDF & Excel</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* NINE CORE ARCHITECTURAL PILLARS (Requested Explicitly) */}
        {/* ------------------------------------------------------------- */}
        <div className="mt-14 w-full">
          <div className="text-center mb-8">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#b48728] font-bold">
              Comprehensive Platform Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1917] font-display mt-1">
              Nine Core Attendance Capabilities
            </h2>
            <p className="text-xs text-[#78716c] mt-1 max-w-xl mx-auto">
              Everything required to manage attendance at scale across thousands of students and multiple campuses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {/* 1. Multi-Organization Management */}
            <div className="p-5 rounded-2xl washi-card border border-[#2b2523]/10">
              <div className="w-9 h-9 rounded-xl bg-[#c83a4b]/10 text-[#c83a4b] flex items-center justify-center mb-3">
                <Building className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1c1917] font-display mb-1">
                1. Multi-Organization Management
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Strict multi-tenant database isolation. Each school, university, or coaching institute operates independently with private users, cohorts, and logs.
              </p>
            </div>

            {/* 2. QR Attendance */}
            <div className="p-5 rounded-2xl washi-card border border-[#2b2523]/10">
              <div className="w-9 h-9 rounded-xl bg-[#b48728]/15 text-[#b48728] flex items-center justify-center mb-3">
                <QrCode className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1c1917] font-display mb-1">
                2. Dynamic QR Attendance
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Faculty generate unique QR codes for each lecture with configurable expiration timers, geofence radius checks, and duplicate rejection.
              </p>
            </div>

            {/* 3. Face Recognition Attendance */}
            <div className="p-5 rounded-2xl washi-card border border-[#2b2523]/10">
              <div className="w-9 h-9 rounded-xl bg-[#626c59]/15 text-[#626c59] flex items-center justify-center mb-3">
                <Camera className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1c1917] font-display mb-1">
                3. Face Recognition Turnstile
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Sub-second camera biometric verification detecting facial landmarks. Automatically marks attendance and writes cryptographic SHA-256 audit hashes.
              </p>
            </div>

            {/* 4. Attendance Prediction */}
            <div className="p-5 rounded-2xl washi-card border border-[#2b2523]/10">
              <div className="w-9 h-9 rounded-xl bg-[#c83a4b]/10 text-[#c83a4b] flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1c1917] font-display mb-1">
                4. Attendance Prediction Engine
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Uses historical data to project 2-week and 4-week risk horizons. Computes the exact number of consecutive sessions needed to recover above 75%.
              </p>
            </div>

            {/* 5. AI Insights */}
            <div className="p-5 rounded-2xl washi-card border border-[#2b2523]/10">
              <div className="w-9 h-9 rounded-xl bg-[#b48728]/15 text-[#b48728] flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1c1917] font-display mb-1">
                5. Proactive AI Insights
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Powered by Google Gemini 3.8 Flash. Highlights day-of-week absence spikes, department variances, and high-risk debarment clusters automatically.
              </p>
            </div>

            {/* 6. Smart Alerts */}
            <div className="p-5 rounded-2xl washi-card border border-[#2b2523]/10">
              <div className="w-9 h-9 rounded-xl bg-[#626c59]/15 text-[#626c59] flex items-center justify-center mb-3">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1c1917] font-display mb-1">
                6. Smart Real-Time Alerts
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Automated threshold warnings notifying students when nearing 75%, alerting advisors to consecutive absences, and generating parent bulletins.
              </p>
            </div>

            {/* 7. Parent Dashboard */}
            <div className="p-5 rounded-2xl washi-card border border-[#2b2523]/10">
              <div className="w-9 h-9 rounded-xl bg-[#c83a4b]/10 text-[#c83a4b] flex items-center justify-center mb-3">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1c1917] font-display mb-1">
                7. Parent Academic Portal
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Dedicated parent console providing live child attendance verification, trend graphs, AI progress summaries, and direct teacher communication.
              </p>
            </div>

            {/* 8. Faculty Dashboard */}
            <div className="p-5 rounded-2xl washi-card border border-[#2b2523]/10">
              <div className="w-9 h-9 rounded-xl bg-[#b48728]/15 text-[#b48728] flex items-center justify-center mb-3">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1c1917] font-display mb-1">
                8. Faculty Command Console
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Enables teachers and professors to launch QR sessions, conduct manual or biometric roll calls, enroll students, and monitor cohort standing.
              </p>
            </div>

            {/* 9. Analytics Dashboard */}
            <div className="p-5 rounded-2xl washi-card border border-[#2b2523]/10">
              <div className="w-9 h-9 rounded-xl bg-[#626c59]/15 text-[#626c59] flex items-center justify-center mb-3">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#1c1917] font-display mb-1">
                9. Analytics & Export Engine
              </h3>
              <p className="text-xs text-[#57534e] leading-relaxed">
                90-day attendance heatmaps, institutional standing matrices, and professional 1-click export of formal Excel (.xlsx) and PDF audit dossiers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
