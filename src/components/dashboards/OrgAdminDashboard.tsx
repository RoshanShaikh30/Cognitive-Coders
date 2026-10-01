import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AttendanceTreeVisual } from '../3d/AttendanceTreeVisual';
import { AttendanceHeatmap } from '../attendance/AttendanceHeatmap';
import { AttendancePredictionCard } from '../attendance/AttendancePredictionCard';
import { ReportExportModal } from '../reports/ReportExportModal';
import { generateInitialHeatmapData } from '../../data/initialData';
import { sound } from '../../services/soundService';
import {
  Users,
  GraduationCap,
  Building,
  BookOpen,
  Plus,
  UserPlus,
  FolderPlus,
  Camera,
  CheckCircle,
  Download,
  TrendingUp,
} from 'lucide-react';

export const OrgAdminDashboard: React.FC = () => {
  const { currentOrg, classes, students, createClassCohort, enrollStudent } = useAuth();

  const [activeTab, setActiveTab] = useState<'students' | 'classes' | 'predictions'>('students');
  const [addClassModalOpen, setAddClassModalOpen] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // New Class Form
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [classDept, setClassDept] = useState('Department of Computer Science');

  // New Student Form
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');

  const heatmapData = React.useMemo(() => generateInitialHeatmapData(), []);

  const totalStudents = students.length;
  const avgAttendance =
    totalStudents > 0
      ? students.reduce((acc, s) => acc + s.overallAttendance, 0) / totalStudents
      : 0;

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) return;
    createClassCohort({
      name: className.trim(),
      code: classCode.trim() || 'COH-101',
      department: classDept.trim(),
      semester: 'Current Semester',
      advisorName: 'Dean of Academic Affairs',
    });
    setAddClassModalOpen(false);
    setClassName('');
    setClassCode('');
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentId.trim()) return;
    enrollStudent({
      name: studentName.trim(),
      studentIdNumber: studentId.trim(),
    });
    setEnrollModalOpen(false);
    setStudentName('');
    setStudentId('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#b48728] font-bold font-mono block">
            Institutional Administration Console
          </span>
          <h2 className="text-xl font-bold text-[#1c1917] font-display mt-0.5">
            {currentOrg?.name || 'Academic Campus'}
          </h2>
          <p className="text-xs text-[#78716c] mt-1">
            Institutional Code: {currentOrg?.code || 'PENDING'} · Location: {currentOrg?.city ? `${currentOrg.city}, ${currentOrg.country || 'Global'}` : 'Main Academic Campus'}
          </p>
        </div>

        {/* Global Counter Strip */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-[#2b2523]/10 shadow-sm">
            <span className="text-[10px] text-[#78716c] block">ENROLLED</span>
            <span className="text-sm font-bold text-[#1c1917]">{totalStudents}</span>
          </div>
          <div className="bg-white px-3.5 py-2 rounded-xl border border-[#2b2523]/10 shadow-sm">
            <span className="text-[10px] text-[#78716c] block">COHORTS</span>
            <span className="text-sm font-bold text-[#b48728]">{classes.length}</span>
          </div>
          <div className="bg-white px-3.5 py-2 rounded-xl border border-[#2b2523]/10 shadow-sm">
            <span className="text-[10px] text-[#78716c] block">INSTITUTION RATE</span>
            <span className="text-sm font-bold text-[#c83a4b]">
              {totalStudents > 0 ? `${avgAttendance.toFixed(1)}%` : 'Pending'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Vitality Tree & 90-Day Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <AttendanceTreeVisual
            percentage={totalStudents > 0 ? avgAttendance : 100}
            label="Institutional Vitality Tree"
            size="md"
          />
        </div>
        <div className="lg:col-span-7">
          <AttendanceHeatmap
            data={heatmapData}
            title={`${currentOrg?.code || 'Campus'} Activity Matrix`}
            subtitle="Campus-wide continuous attendance logs"
          />
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center justify-between border-b border-[#2b2523]/10 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('students');
              sound.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'students'
                ? 'bg-[#c83a4b] text-white shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917] hover:bg-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Students Roster ({students.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('classes');
              sound.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'classes'
                ? 'bg-[#b48728] text-white shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917] hover:bg-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Class Cohorts ({classes.length})
          </button>

          <button
            onClick={() => {
              setActiveTab('predictions');
              sound.playClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'predictions'
                ? 'bg-[#626c59] text-white shadow-sm'
                : 'text-[#78716c] hover:text-[#1c1917] hover:bg-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Attendance Risk Telemetry</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setExportModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#ede8dc] text-[#1c1917] text-xs font-semibold border border-[#2b2523]/15 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#c83a4b]" />
            <span>Export Audit Dossier</span>
          </button>

          <button
            onClick={() => {
              setEnrollModalOpen(true);
              sound.playClick();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#ede8dc] text-[#1c1917] text-xs font-semibold border border-[#2b2523]/15 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#c83a4b]" />
            Enroll Student
          </button>
          <button
            onClick={() => {
              setAddClassModalOpen(true);
              sound.playClick();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#c83a4b] hover:bg-[#b92434] text-white text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Cohort
          </button>
        </div>
      </div>

      {/* Tab Content: Students */}
      {activeTab === 'students' && (
        <div className="washi-card rounded-2xl p-6 border border-[#2b2523]/10">
          {students.length === 0 ? (
            <div className="py-12 text-center">
              <UserPlus className="w-10 h-10 text-[#78716c] mx-auto mb-2 opacity-50" />
              <h4 className="text-sm font-bold text-[#1c1917] font-display">
                No Students Enrolled Yet
              </h4>
              <p className="text-xs text-[#78716c] mt-1 max-w-sm mx-auto">
                Click "Enroll Student" above or invite learners to sign up using your institution code: <strong>{currentOrg?.code}</strong>.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#2b2523]/10 text-[#78716c] uppercase tracking-wider text-[10px]">
                    <th className="pb-3 pl-2 font-medium">Student Name</th>
                    <th className="pb-3 font-medium">ID Number</th>
                    <th className="pb-3 font-medium">Class Cohort</th>
                    <th className="pb-3 font-medium">Biometric Face Status</th>
                    <th className="pb-3 text-right pr-2 font-medium">Attendance Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2b2523]/5">
                  {students.map((s) => (
                    <tr key={s.id} className="hover:bg-black/[0.01]">
                      <td className="py-3 pl-2 font-semibold text-[#1c1917]">{s.name}</td>
                      <td className="py-3 font-mono text-[#57534e]">{s.studentIdNumber}</td>
                      <td className="py-3 text-[#57534e]">{s.className}</td>
                      <td className="py-3">
                        {s.biometricRegistered ? (
                          <span className="text-[#626c59] font-mono text-[11px] font-bold">Registered</span>
                        ) : (
                          <span className="text-[#a8a29e] font-mono text-[11px]">Unregistered</span>
                        )}
                      </td>
                      <td className="py-3 text-right pr-2 font-mono font-bold text-[#c83a4b]">
                        {s.overallAttendance.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Classes */}
      {activeTab === 'classes' && (
        <div className="washi-card rounded-2xl p-6 border border-[#2b2523]/10">
          {classes.length === 0 ? (
            <div className="py-12 text-center">
              <FolderPlus className="w-10 h-10 text-[#78716c] mx-auto mb-2 opacity-50" />
              <h4 className="text-sm font-bold text-[#1c1917] font-display">
                No Academic Classes Registered
              </h4>
              <p className="text-xs text-[#78716c] mt-1 max-w-sm mx-auto">
                Create courses and cohorts for your faculty members to manage.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classes.map((cls) => (
                <div key={cls.id} className="p-4 rounded-xl bg-white border border-[#2b2523]/10 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-[#b48728]">{cls.code}</span>
                    <span className="text-xs text-[#78716c]">{cls.semester}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1c1917]">{cls.name}</h4>
                  <p className="text-xs text-[#78716c]">{cls.department}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Institutional Predictions & Risk Analysis */}
      {activeTab === 'predictions' && (
        <AttendancePredictionCard
          attended={students.reduce((acc, s) => acc + s.attendedLectures, 0)}
          total={students.reduce((acc, s) => acc + s.totalLectures, 0)}
          subjectOrClassName={currentOrg?.name || 'Institution-Wide'}
          studentName={`${currentOrg?.name || 'Institutional'} Aggregate`}
        />
      )}

      {/* Add Class Modal */}
      {addClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141110]/60 backdrop-blur-md">
          <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/15 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-[#1c1917] font-display mb-3">
              Add Cohort to Institution
            </h3>
            <form onSubmit={handleAddClass} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#44403c] mb-1 font-medium">Cohort Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cognitive Systems & Robotics"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#44403c] mb-1 font-medium">Cohort Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ROB-301"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddClassModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#ede8dc] text-[#57534e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#c83a4b] hover:bg-[#b92434] text-white font-medium"
                >
                  Create Cohort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Student Modal */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141110]/60 backdrop-blur-md">
          <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/15 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-[#1c1917] font-display mb-3">
              Enroll Student
            </h3>
            <form onSubmit={handleEnroll} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#44403c] mb-1 font-medium">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maya Chen"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#44403c] mb-1 font-medium">Student ID Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ST-2026-902"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEnrollModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#ede8dc] text-[#57534e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#c83a4b] hover:bg-[#b92434] text-white font-medium"
                >
                  Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Institutional Audit Report Export Modal */}
      <ReportExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        defaultType="organization_wise"
      />
    </div>
  );
};
