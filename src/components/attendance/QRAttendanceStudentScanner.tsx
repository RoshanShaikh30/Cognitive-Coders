import React, { useState } from 'react';
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { qrAttendanceService, QRLectureSession } from '../../services/qrAttendanceService';
import { StudentRecord } from '../../types';
import { sound } from '../../services/soundService';

interface QRAttendanceStudentScannerProps {
  student: StudentRecord;
  onCheckInSuccess: () => void;
}

export const QRAttendanceStudentScanner: React.FC<QRAttendanceStudentScannerProps> = ({
  student,
  onCheckInSuccess,
}) => {
  const [activeSession, setActiveSession] = useState<QRLectureSession | null>(() => {
    return student.classId ? qrAttendanceService.getActiveSessionForClass(student.classId) : null;
  });

  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'duplicate' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [scannedAtTime, setScannedAtTime] = useState<string>('');

  const refreshSession = () => {
    if (student.classId) {
      const ses = qrAttendanceService.getActiveSessionForClass(student.classId);
      setActiveSession(ses);
    }
  };

  const isAlreadyMarked = activeSession?.scannedStudents.some((s) => s.studentId === student.id);

  const handleStartScan = () => {
    if (!activeSession) {
      setStatusMessage('No active QR broadcast found for your registered cohort.');
      return;
    }

    sound.playClick();
    setScanState('scanning');

    // Simulate optical scan acquisition (1.2 seconds)
    setTimeout(() => {
      const res = qrAttendanceService.recordScan({
        sessionId: activeSession.id,
        studentId: student.id,
        studentName: student.name,
        locationName: activeSession.locationName,
        device: 'Student Mobile Scanner · GPS Geofence (35.7090° N, 139.7320° E)',
      });

      if (res.success) {
        sound.playSuccessChime();
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#c83a4b', '#b48728', '#626c59'],
        });
        setScanState('success');
        setStatusMessage(res.message);
        setScannedAtTime(new Date().toLocaleTimeString());
        onCheckInSuccess();
      } else if (res.alreadyMarked) {
        sound.playDebarmentGong();
        setScanState('duplicate');
        setStatusMessage(res.message);
      } else {
        sound.playDebarmentGong();
        setScanState('error');
        setStatusMessage(res.message);
      }
    }, 1300);
  };

  return (
    <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2b2523]/10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#b48728] font-bold">
            Mobile QR Attendance Terminal
          </span>
          <h3 className="text-base font-bold text-[#1c1917] font-display mt-0.5">
            Classroom Optical Check-In
          </h3>
          <p className="text-xs text-[#78716c] mt-0.5">
            Scan your instructor's lecture screen QR to automatically record attendance with timestamp and geofence.
          </p>
        </div>

        <button
          onClick={refreshSession}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#ede8dc] border border-[#2b2523]/15 text-xs font-semibold text-[#1c1917] flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#78716c]" />
          <span>Refresh Broadcast</span>
        </button>
      </div>

      {/* When NO active lecture session is currently broadcasting */}
      {!activeSession ? (
        <div className="py-8 text-center text-[#78716c]">
          <div className="w-12 h-12 rounded-2xl bg-[#f4efe4] border border-[#2b2523]/10 flex items-center justify-center text-[#78716c] mx-auto mb-3">
            <QrCode className="w-6 h-6 opacity-60" />
          </div>
          <h4 className="text-sm font-bold text-[#1c1917] font-display">
            No Active Lecture QR Session
          </h4>
          <p className="text-xs text-[#57534e] mt-1 max-w-md mx-auto">
            Your instructor has not opened a QR check-in window for <strong>{student.className || 'your cohort'}</strong> yet. This screen will automatically update when roll call begins.
          </p>
        </div>
      ) : (
        /* Active session exists */
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl bg-[#f4efe4]/80 border border-[#2b2523]/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#626c59]/15 text-[#626c59] border border-[#626c59]/30 text-[10px] font-mono font-bold uppercase">
                  Lecture Open
                </span>
                <span className="text-xs font-mono text-[#78716c]">
                  Expires in {Math.max(0, Math.round((activeSession.expiresAt - Date.now()) / 60000))} min
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#1c1917] font-display mt-1">
                {activeSession.lectureTopic}
              </h4>
              <p className="text-xs text-[#78716c] flex items-center gap-3 mt-0.5">
                <span>{activeSession.subjectName}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#b48728]" />
                  {activeSession.locationName}
                </span>
              </p>
            </div>

            {/* Check-In CTA or Status */}
            <div>
              {isAlreadyMarked || scanState === 'success' ? (
                <div className="px-4 py-2 rounded-xl bg-[#626c59]/15 border border-[#626c59]/30 text-[#626c59] text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Attendance Verified · {scannedAtTime || 'Recorded'}</span>
                </div>
              ) : scanState === 'scanning' ? (
                <div className="px-4 py-2 rounded-xl bg-[#b48728]/15 border border-[#b48728]/30 text-[#b48728] text-xs font-semibold flex items-center gap-2 animate-pulse">
                  <Camera className="w-4 h-4 animate-spin" />
                  <span>Aligning Optical Frame...</span>
                </div>
              ) : (
                <button
                  onClick={handleStartScan}
                  className="px-5 py-2.5 rounded-xl bg-[#c83a4b] hover:bg-[#b92434] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan & Verify My Presence</span>
                </button>
              )}
            </div>
          </div>

          {/* Feedback banners */}
          {scanState === 'duplicate' && (
            <div className="p-3 rounded-xl bg-[#c83a4b]/10 border border-[#c83a4b]/30 flex items-start gap-2.5 text-xs text-[#c83a4b]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{statusMessage}</div>
            </div>
          )}

          {scanState === 'success' && (
            <div className="p-3 rounded-xl bg-[#626c59]/10 border border-[#626c59]/30 flex items-start gap-2.5 text-xs text-[#626c59]">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{statusMessage}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
