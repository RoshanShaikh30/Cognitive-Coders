import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AttendanceTreeVisual } from '../3d/AttendanceTreeVisual';
import { AttendanceSimulator } from '../attendance/AttendanceSimulator';
import { sound } from '../../services/soundService';
import {
  Calendar,
  CheckCircle2,
  Mail,
  Send,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export const ParentDashboard: React.FC = () => {
  const { currentUser, currentOrg, students, showToast } = useAuth();

  // Find ward's student record
  const child = students.find((s) => s.studentIdNumber === currentUser?.childStudentIdRef);

  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [leaveDate, setLeaveDate] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccessChime();
    setLeaveSubmitted(true);
    showToast('Absence notice filed with the academic dean.');
    setTimeout(() => {
      setLeaveModalOpen(false);
      setLeaveSubmitted(false);
      setLeaveReason('');
    }, 1400);
  };

  const childRate = child?.overallAttendance || 0;
  const childTotal = child?.totalLectures || 0;
  const childAttended = child?.attendedLectures || 0;

  return (
    <div className="space-y-8">
      {/* Parent Header */}
      <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#b48728] font-bold font-mono block">
            Guardian Academic Portal · {currentUser?.name}
          </span>
          <h2 className="text-xl font-bold text-[#1c1917] font-display mt-0.5">
            Ward: {child ? child.name : currentUser?.childStudentIdRef || 'Enrolled Student'}
          </h2>
          <p className="text-xs text-[#78716c] mt-1">
            Institution: {currentOrg?.name || 'Academic Institution'} · Student ID: {currentUser?.childStudentIdRef || 'Pending ID'}
          </p>
        </div>

        <button
          onClick={() => {
            setLeaveModalOpen(true);
            sound.playClick();
          }}
          className="px-4 py-2.5 rounded-xl bg-[#c83a4b] hover:bg-[#b92434] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start md:self-auto"
        >
          <Calendar className="w-3.5 h-3.5" />
          Submit Absence Notice
        </button>
      </div>

      {/* Main Grid: Vitality Tree & Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <AttendanceTreeVisual
            percentage={childTotal > 0 ? childRate : 100}
            label={childTotal > 0 ? `${child?.name || 'Ward'}'s Vitality Tree` : 'Initial Academic Standing'}
            size="md"
          />
        </div>

        <div className="lg:col-span-7">
          <AttendanceSimulator
            initialAttended={childAttended}
            initialTotal={childTotal}
            subjectName={child?.className || 'Enrolled Academic Courses'}
          />
        </div>
      </div>

      {/* Empty State vs Child Records */}
      {childTotal === 0 && (
        <div className="washi-card rounded-2xl p-8 text-center border border-[#2b2523]/10">
          <Clock className="w-10 h-10 text-[#b48728] mx-auto mb-2 opacity-80" />
          <h4 className="text-sm font-bold text-[#1c1917] font-display">
            Awaiting Attendance Records
          </h4>
          <p className="text-xs text-[#57534e] mt-1 max-w-md mx-auto">
            Your ward's attendance percentage, risk warnings, and daily turnstile check-ins will update automatically once verified by instructors.
          </p>
        </div>
      )}

      {/* Absence Notice Modal */}
      {leaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141110]/60 backdrop-blur-md">
          <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/15 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-[#1c1917] font-display mb-1">
              Submit Medical or Excused Absence
            </h3>
            <p className="text-xs text-[#78716c] mb-4">
              Pre-authorized notices are factored into examination review panels.
            </p>

            {leaveSubmitted ? (
              <div className="py-8 text-center text-[#626c59] space-y-2">
                <CheckCircle2 className="w-12 h-12 mx-auto animate-bounce" />
                <p className="text-sm font-bold">Absence Notice Approved & Filed</p>
              </div>
            ) : (
              <form onSubmit={handleLeaveSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#44403c] mb-1 font-medium">Date of Absence</label>
                  <input
                    type="date"
                    required
                    value={leaveDate}
                    onChange={(e) => setLeaveDate(e.target.value)}
                    className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#44403c] mb-1 font-medium">Reason & Documentation</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Medical appointment, fever, family emergency..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none placeholder:text-[#a8a29e]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setLeaveModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#ede8dc] text-[#57534e]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-[#c83a4b] hover:bg-[#b92434] text-white font-medium flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Notice
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
