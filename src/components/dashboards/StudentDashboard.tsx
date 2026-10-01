import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AttendanceTreeVisual } from '../3d/AttendanceTreeVisual';
import { AttendanceSimulator } from '../attendance/AttendanceSimulator';
import { AttendanceHeatmap } from '../attendance/AttendanceHeatmap';
import { AttendancePredictionCard } from '../attendance/AttendancePredictionCard';
import { QRAttendanceStudentScanner } from '../attendance/QRAttendanceStudentScanner';
import { ReportExportModal } from '../reports/ReportExportModal';
import { generateInitialHeatmapData } from '../../data/initialData';
import {
  ShieldCheck,
  AlertTriangle,
  BookOpen,
  Clock,
  Calendar,
  CheckCircle,
  Download,
  QrCode,
  TrendingUp,
} from 'lucide-react';
import { sound } from '../../services/soundService';

export const StudentDashboard: React.FC = () => {
  const { currentUser, currentOrg, students, attendanceRecords } = useAuth();

  // Find this student's record
  const student = students.find(
    (s) => s.email === currentUser?.email || s.studentIdNumber === currentUser?.studentIdRef
  );

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'qr_checkin' | 'prediction' | 'heatmap'>('overview');

  const heatmapData = React.useMemo(() => generateInitialHeatmapData(), []);

  const overallRate = student?.overallAttendance || 0;
  const attendedCount = student?.attendedLectures || 0;
  const totalCount = student?.totalLectures || 0;
  const isAtRisk = totalCount > 0 && overallRate < 75;

  return (
    <div className="space-y-8">
      {/* Student Welcome Banner */}
      <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative shadow-sm">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#b48728] font-bold font-mono block">
            Student Academic Standing Portal
          </span>
          <h2 className="text-xl font-bold text-[#1c1917] font-display flex items-center gap-2 mt-0.5">
            {currentUser?.name || 'Student Portal'}
            {isAtRisk && (
              <span className="text-[10px] font-mono px-2 py-0.5 bg-[#c83a4b]/15 text-[#c83a4b] border border-[#c83a4b]/30 rounded">
                DEBARMENT WARNING (&lt;75%)
              </span>
            )}
          </h2>
          <p className="text-xs text-[#78716c] mt-1">
            Institution: {currentOrg?.name || 'Academic Institution'} · ID:{' '}
            {currentUser?.studentIdRef || student?.studentIdNumber || 'N/A'} · Cohort:{' '}
            {student?.className || 'Undergraduate Cohort'}
          </p>
        </div>

        {/* Action Controls & Standing */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-[#78716c] block font-mono">
              Cumulative Standing
            </span>
            <div className="text-2xl font-extrabold font-mono text-[#1c1917] mt-0.5">
              {totalCount > 0 ? `${overallRate.toFixed(1)}%` : 'Pending'}
            </div>
            <span className="text-[11px] text-[#78716c]">
              {attendedCount} / {totalCount} sessions attended
            </span>
          </div>

          <div
            className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-bold text-lg shadow-sm ${
              totalCount === 0
                ? 'bg-[#ede8dc] border-[#2b2523]/15 text-[#78716c]'
                : overallRate >= 75
                ? 'bg-[#626c59]/15 border-[#626c59]/30 text-[#626c59]'
                : 'bg-[#c83a4b]/15 border-[#c83a4b]/30 text-[#c83a4b]'
            }`}
          >
            {totalCount === 0 ? (
              <Clock className="w-6 h-6" />
            ) : overallRate >= 75 ? (
              <ShieldCheck className="w-7 h-7" />
            ) : (
              <AlertTriangle className="w-7 h-7" />
            )}
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setExportModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#ede8dc] border border-[#2b2523]/15 text-xs font-semibold text-[#1c1917] flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#c83a4b]" />
            <span>Export My Dossier</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#2b2523]/10 pb-2">
        <button
          onClick={() => {
            setActiveTab('overview');
            sound.playClick();
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#c83a4b] text-white shadow-sm'
              : 'text-[#78716c] hover:text-[#1c1917] hover:bg-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Overview & Vitality</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('qr_checkin');
            sound.playClick();
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'qr_checkin'
              ? 'bg-[#c83a4b] text-white shadow-sm'
              : 'text-[#78716c] hover:text-[#1c1917] hover:bg-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>Mobile QR Check-In</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('prediction');
            sound.playClick();
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'prediction'
              ? 'bg-[#b48728] text-white shadow-sm'
              : 'text-[#78716c] hover:text-[#1c1917] hover:bg-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Prediction Engine</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('heatmap');
            sound.playClick();
          }}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'heatmap'
              ? 'bg-[#626c59] text-white shadow-sm'
              : 'text-[#78716c] hover:text-[#1c1917] hover:bg-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Telemetry Heatmap</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & VITALITY */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <AttendanceTreeVisual
                percentage={totalCount > 0 ? overallRate : 100}
                label={totalCount > 0 ? 'Personal Vitality Index' : 'Initial Vitality State'}
                size="md"
              />
            </div>

            <div className="lg:col-span-7">
              <AttendanceSimulator
                initialAttended={attendedCount || 0}
                initialTotal={totalCount || 0}
                subjectName={student?.className || 'Academic Semester'}
              />
            </div>
          </div>

          {/* Quick Prediction Horizon Card Preview */}
          <AttendancePredictionCard
            attended={attendedCount || 0}
            total={totalCount || 1}
            subjectOrClassName={student?.className || 'Core Modules'}
            studentName={currentUser?.name || 'Student'}
          />
        </div>
      )}

      {/* TAB 2: MOBILE QR SCANNER CHECK-IN */}
      {activeTab === 'qr_checkin' && student && (
        <QRAttendanceStudentScanner
          student={student}
          onCheckInSuccess={() => {
            sound.playSuccessChime();
          }}
        />
      )}

      {/* TAB 3: DEDICATED PREDICTION ENGINE */}
      {activeTab === 'prediction' && (
        <AttendancePredictionCard
          attended={attendedCount || 0}
          total={totalCount || 1}
          subjectOrClassName={student?.className || 'Core Modules'}
          studentName={currentUser?.name || 'Student'}
        />
      )}

      {/* TAB 4: TELEMETRY HEATMAP */}
      {activeTab === 'heatmap' && (
        totalCount === 0 ? (
          <div className="washi-card rounded-2xl p-8 text-center border border-[#2b2523]/10">
            <Calendar className="w-10 h-10 text-[#b48728] mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-[#1c1917] font-display">
              Awaiting First Attendance Session
            </h4>
            <p className="text-xs text-[#57534e] mt-1 max-w-md mx-auto">
              Your attendance logs will appear here once your instructors record lecture roll calls or turnstile biometric scans.
            </p>
          </div>
        ) : (
          <AttendanceHeatmap
            data={heatmapData}
            title="Student Activity Telemetry"
            subtitle="90-Day Attendance Records"
          />
        )
      )}

      {/* Report Export System Modal */}
      <ReportExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        defaultType="student_wise"
        defaultStudentId={student?.id}
      />
    </div>
  );
};
