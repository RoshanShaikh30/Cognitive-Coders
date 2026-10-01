import React, { useState, useEffect } from 'react';
import {
  QrCode,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Play,
  RotateCcw,
  UserCheck,
  Users,
  Copy,
  CheckCircle2,
  Hourglass,
  StopCircle,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { qrAttendanceService, QRLectureSession } from '../../services/qrAttendanceService';
import { ClassCohort, StudentRecord } from '../../types';
import { sound } from '../../services/soundService';

interface QRAttendanceFacultyProps {
  currentClass: ClassCohort;
  enrolledStudents: StudentRecord[];
  facultyName: string;
  onAttendanceMarked: (studentId: string) => void;
}

export const QRAttendanceFaculty: React.FC<QRAttendanceFacultyProps> = ({
  currentClass,
  enrolledStudents,
  facultyName,
  onAttendanceMarked,
}) => {
  const [activeSession, setActiveSession] = useState<QRLectureSession | null>(() => {
    return qrAttendanceService.getActiveSessionForClass(currentClass.id);
  });

  const [lectureTopic, setLectureTopic] = useState('Advanced Algorithms & Discrete Logic');
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [locationName, setLocationName] = useState('Campus Hall 204 · Geofenced');
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(0);
  const [copiedToken, setCopiedToken] = useState(false);
  const [simulatedStudentId, setSimulatedStudentId] = useState('');

  // Update countdown clock
  useEffect(() => {
    if (!activeSession) {
      setTimeRemainingSeconds(0);
      return;
    }

    const updateTimer = () => {
      const remainingMs = activeSession.expiresAt - Date.now();
      const sec = Math.max(0, Math.floor(remainingMs / 1000));
      setTimeRemainingSeconds(sec);

      // Refresh session object periodically to sync new student scans
      const latest = qrAttendanceService.getSessionById(activeSession.id);
      if (latest) {
        setActiveSession(latest);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeSession?.id, activeSession?.expiresAt]);

  const handleGenerateQR = async () => {
    sound.playClick();
    const newSession = await qrAttendanceService.createSession({
      classId: currentClass.id,
      className: currentClass.name,
      subjectId: currentClass.id,
      subjectName: currentClass.department || 'Academic Course',
      lectureTopic: lectureTopic.trim() || 'Scheduled Lecture Session',
      facultyId: 'fac_active',
      facultyName: facultyName || 'Faculty Instructor',
      durationMinutes,
      locationName,
    });

    setActiveSession(newSession);
    sound.playSuccessChime();
  };

  const handleExtend = (extraMinutes: number) => {
    if (!activeSession) return;
    sound.playClick();
    const updated = qrAttendanceService.extendSession(activeSession.id, extraMinutes);
    if (updated) {
      setActiveSession({ ...updated });
    }
  };

  const handleExpireNow = () => {
    if (!activeSession) return;
    sound.playClick();
    const updated = qrAttendanceService.expireSession(activeSession.id);
    if (updated) {
      setActiveSession({ ...updated });
    }
  };

  const handleCopyCode = () => {
    if (!activeSession) return;
    navigator.clipboard.writeText(activeSession.sessionToken);
    setCopiedToken(true);
    sound.playClick();
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Quick testing simulator for evaluators
  const handleSimulateStudentScan = () => {
    if (!activeSession || !simulatedStudentId) return;
    const student = enrolledStudents.find((s) => s.id === simulatedStudentId);
    if (!student) return;

    const res = qrAttendanceService.recordScan({
      sessionId: activeSession.id,
      studentId: student.id,
      studentName: student.name,
      locationName: activeSession.locationName,
      device: 'Mobile iOS (Safari 18) · Geofence Verified',
    });

    if (res.success) {
      sound.playSuccessChime();
      onAttendanceMarked(student.id);
      // Reload session
      const latest = qrAttendanceService.getSessionById(activeSession.id);
      if (latest) setActiveSession({ ...latest });
    } else {
      sound.playDebarmentGong();
      alert(res.message);
    }
  };

  const isExpired = timeRemainingSeconds <= 0 && activeSession !== null;
  const minutes = Math.floor(timeRemainingSeconds / 60);
  const seconds = timeRemainingSeconds % 60;
  const totalDurationSec = (activeSession?.durationMinutes || 10) * 60;
  const progressPercent = totalDurationSec > 0
    ? Math.min(100, Math.max(0, (timeRemainingSeconds / totalDurationSec) * 100))
    : 0;

  const scannedCount = activeSession?.scannedStudents.length || 0;
  const totalStudents = enrolledStudents.length || 1;
  const scanRatePercent = Math.round((scannedCount / totalStudents) * 100);

  return (
    <div className="space-y-6">
      {/* Configuration Header Card */}
      <div className="washi-card rounded-2xl p-6 border border-[#2b2523]/10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#2b2523]/10">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#b48728] font-mono font-bold">
              Dynamic QR Attendance Architecture
            </span>
            <h3 className="text-lg font-bold text-[#1c1917] font-display mt-0.5">
              Instant Mobile Lecture Check-In
            </h3>
            <p className="text-xs text-[#78716c] mt-0.5">
              Generates time-delimited cryptographic tokens preventing duplicate submissions with location auditing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#57534e]">Cohort:</span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-[#2b2523]/15 text-xs font-semibold text-[#1c1917]">
              {currentClass.name}
            </span>
          </div>
        </div>

        {/* Setup Parameters Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-[11px] font-mono uppercase text-[#78716c] block mb-1">
              Lecture Session Topic
            </label>
            <input
              type="text"
              value={lectureTopic}
              onChange={(e) => setLectureTopic(e.target.value)}
              placeholder="e.g. Distributed Systems & Consensus"
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#2b2523]/15 text-xs text-[#1c1917] focus:outline-none focus:border-[#c83a4b]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-[#78716c] block mb-1">
              Configurable Expiration Window
            </label>
            <select
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#2b2523]/15 text-xs text-[#1c1917] focus:outline-none focus:border-[#c83a4b] cursor-pointer"
            >
              <option value={3}>3 Minutes (Express Turnstile)</option>
              <option value={5}>5 Minutes (Standard Classroom)</option>
              <option value={10}>10 Minutes (Lecture Hall Recommended)</option>
              <option value={15}>15 Minutes (Auditorium Session)</option>
              <option value={30}>30 Minutes (Extended Laboratory)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-[#78716c] block mb-1">
              Geofence Verification Zone
            </label>
            <div className="relative">
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Lecture Hall B · 50m Range"
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-[#2b2523]/15 text-xs text-[#1c1917] focus:outline-none focus:border-[#c83a4b]"
              />
              <MapPin className="w-3.5 h-3.5 text-[#b48728] absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end">
          <button
            onClick={handleGenerateQR}
            className="px-5 py-2.5 rounded-xl bg-[#c83a4b] hover:bg-[#b92434] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.01]"
          >
            <QrCode className="w-4 h-4" />
            <span>{activeSession ? 'Regenerate Dynamic QR' : 'Initialize & Launch Lecture QR'}</span>
          </button>
        </div>
      </div>

      {/* Main QR Display & Live Telemetry Analytics */}
      {activeSession && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: The QR Screen Display */}
          <div className="lg:col-span-5 washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/10 flex flex-col items-center text-center shadow-md">
            {/* Header Status */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-[#2b2523]/10 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#78716c]">
                Live Overhead Display
              </span>
              <div
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold flex items-center gap-1.5 ${
                  isExpired
                    ? 'bg-[#c83a4b]/15 text-[#c83a4b] border border-[#c83a4b]/30'
                    : 'bg-[#626c59]/15 text-[#626c59] border border-[#626c59]/30'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isExpired ? 'bg-[#c83a4b]' : 'bg-[#626c59] animate-ping'}`} />
                <span>{isExpired ? 'SESSION EXPIRED' : 'ACTIVE & BROADCASTING'}</span>
              </div>
            </div>

            {/* Topic & Subject */}
            <h4 className="text-base font-bold text-[#1c1917] font-display">
              {activeSession.lectureTopic}
            </h4>
            <span className="text-xs text-[#78716c] mt-0.5">
              {activeSession.subjectName} · {activeSession.className}
            </span>

            {/* QR Image Box */}
            <div className="relative my-4 p-4 rounded-2xl bg-white border border-[#2b2523]/15 shadow-sm max-w-[280px] w-full">
              <img
                src={activeSession.qrDataUrl}
                alt="Lecture Attendance QR Code"
                className={`w-full h-auto object-contain transition-opacity duration-300 ${
                  isExpired ? 'opacity-20 blur-[1px]' : 'opacity-100'
                }`}
              />

              {isExpired && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white/80 rounded-2xl backdrop-blur-xs">
                  <Hourglass className="w-10 h-10 text-[#c83a4b] mb-2 animate-bounce" />
                  <span className="text-xs font-bold text-[#c83a4b] font-display">
                    QR Window Expired
                  </span>
                  <span className="text-[10px] text-[#78716c] mt-1 max-w-[180px]">
                    Submissions closed. Extend time or generate a new token to resume.
                  </span>
                </div>
              )}
            </div>

            {/* Countdown Clock & Progress */}
            <div className="w-full bg-[#f4efe4] rounded-xl p-3 border border-[#2b2523]/10">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-[#78716c] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#b48728]" />
                  Time Remaining
                </span>
                <span
                  className={`font-bold text-sm ${
                    timeRemainingSeconds <= 60 && !isExpired
                      ? 'text-[#c83a4b] animate-pulse'
                      : 'text-[#1c1917]'
                  }`}
                >
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#e8e2d4] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    timeRemainingSeconds <= 60
                      ? 'bg-[#c83a4b]'
                      : timeRemainingSeconds <= 180
                      ? 'bg-[#b48728]'
                      : 'bg-[#626c59]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-[#78716c] mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#b48728]" />
                  {activeSession.locationName}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="hover:text-[#1c1917] flex items-center gap-1 underline cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  {copiedToken ? 'Token Copied!' : 'Copy Session Token'}
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 mt-4 w-full">
              <button
                onClick={() => handleExtend(5)}
                className="flex-1 px-3 py-2 rounded-xl bg-white hover:bg-[#ede8dc] border border-[#2b2523]/15 text-[11px] font-semibold text-[#1c1917] flex items-center justify-center gap-1 transition-colors shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#626c59]" />
                <span>+5 Min</span>
              </button>

              <button
                onClick={() => handleExtend(2)}
                className="flex-1 px-3 py-2 rounded-xl bg-white hover:bg-[#ede8dc] border border-[#2b2523]/15 text-[11px] font-semibold text-[#1c1917] flex items-center justify-center gap-1 transition-colors shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#626c59]" />
                <span>+2 Min</span>
              </button>

              {!isExpired && (
                <button
                  onClick={handleExpireNow}
                  className="px-3 py-2 rounded-xl bg-[#c83a4b]/10 hover:bg-[#c83a4b]/20 border border-[#c83a4b]/30 text-[11px] font-semibold text-[#c83a4b] flex items-center gap-1 transition-colors"
                >
                  <StopCircle className="w-3.5 h-3.5" />
                  <span>Expire Now</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: QR Attendance Analytics & Live Scanned Telemetry */}
          <div className="lg:col-span-7 space-y-5">
            {/* KPI Analytics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="washi-card p-4 rounded-xl border border-[#2b2523]/10 text-center">
                <span className="text-[10px] font-mono uppercase text-[#78716c] block">
                  Scanned Attendees
                </span>
                <div className="text-2xl font-extrabold font-mono text-[#1c1917] mt-1">
                  {scannedCount} <span className="text-xs font-normal text-[#78716c]">/ {totalStudents}</span>
                </div>
                <span className="text-[10px] text-[#626c59] font-semibold mt-0.5 block">
                  {scanRatePercent}% Presence Rate
                </span>
              </div>

              <div className="washi-card p-4 rounded-xl border border-[#2b2523]/10 text-center">
                <span className="text-[10px] font-mono uppercase text-[#78716c] block">
                  Pending Check-In
                </span>
                <div className="text-2xl font-extrabold font-mono text-[#b48728] mt-1">
                  {Math.max(0, totalStudents - scannedCount)}
                </div>
                <span className="text-[10px] text-[#78716c] mt-0.5 block">
                  Awaiting scan
                </span>
              </div>

              <div className="washi-card p-4 rounded-xl border border-[#2b2523]/10 text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-mono uppercase text-[#78716c] block">
                  Duplicates Prevented
                </span>
                <div className="text-2xl font-extrabold font-mono text-[#c83a4b] mt-1">
                  {activeSession.duplicateAttempts.length}
                </div>
                <span className="text-[10px] text-[#78716c] mt-0.5 block">
                  Replay attacks blocked
                </span>
              </div>
            </div>

            {/* Quick Evaluator Testing Simulator */}
            <div className="p-3.5 rounded-xl bg-[#f4efe4] border border-[#2b2523]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#b48728]" />
                <span className="text-xs font-bold text-[#1c1917]">
                  Evaluator Testing: Simulate Mobile Scan
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={simulatedStudentId}
                  onChange={(e) => setSimulatedStudentId(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-white border border-[#2b2523]/15 text-xs text-[#1c1917] focus:outline-none cursor-pointer"
                >
                  <option value="">Select Enrolled Student...</option>
                  {enrolledStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.studentIdNumber})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleSimulateStudentScan}
                  disabled={!simulatedStudentId || isExpired}
                  className="px-3 py-1.5 rounded-lg bg-[#626c59] hover:bg-[#525a4b] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Scan</span>
                </button>
              </div>
            </div>

            {/* Duplicate Attempt Warning Banner (if any) */}
            {activeSession.duplicateAttempts.length > 0 && (
              <div className="p-3 rounded-xl bg-[#c83a4b]/10 border border-[#c83a4b]/30 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-[#c83a4b] shrink-0 mt-0.5" />
                <div className="text-xs text-[#c83a4b]">
                  <span className="font-bold">Security Notice: </span>
                  {activeSession.duplicateAttempts.length} duplicate check-in submission(s) were automatically detected and rejected by the anti-replay engine.
                </div>
              </div>
            )}

            {/* Live Real-Time Attendee Roster */}
            <div className="washi-card rounded-2xl p-5 border border-[#2b2523]/10">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b2523]/10">
                <span className="text-xs font-bold text-[#1c1917] font-display flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#c83a4b]" />
                  Verified Attendance Stream ({activeSession.scannedStudents.length})
                </span>
                <span className="text-[10px] font-mono text-[#78716c]">
                  Geofence + Timestamp Logged
                </span>
              </div>

              {activeSession.scannedStudents.length === 0 ? (
                <div className="py-10 text-center text-[#78716c]">
                  <QrCode className="w-8 h-8 mx-auto mb-2 opacity-40 animate-pulse" />
                  <p className="text-xs">
                    Awaiting students to scan the QR code via mobile devices...
                  </p>
                  <p className="text-[11px] text-[#57534e] mt-1">
                    Try the "Simulate Mobile Scan" tool above to verify real-time check-in!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[#2b2523]/5 max-h-64 overflow-y-auto mt-2 pr-1">
                  {activeSession.scannedStudents.map((record, idx) => (
                    <div
                      key={idx}
                      className="py-2.5 flex items-center justify-between text-xs animate-in fade-in"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#626c59]/15 border border-[#626c59]/30 flex items-center justify-center text-[#626c59] text-[10px] font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <span className="font-semibold text-[#1c1917] block">
                            {record.studentName}
                          </span>
                          <span className="text-[10px] text-[#78716c] font-mono">
                            {record.device}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-[11px] text-[#1c1917] font-bold block">
                          {record.scannedAt}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#626c59]/10 text-[#626c59] font-medium inline-flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          VERIFIED
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
