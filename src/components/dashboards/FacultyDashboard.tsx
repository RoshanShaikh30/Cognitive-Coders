import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AttendanceMarker } from '../attendance/AttendanceMarker';
import { FaceRecognitionScanner } from '../attendance/FaceRecognitionScanner';
import { AttendanceHeatmap } from '../attendance/AttendanceHeatmap';
import { AttendanceTreeVisual } from '../3d/AttendanceTreeVisual';
import { AIInsightsDrawer } from '../insights/AIInsightsDrawer';
import { QRAttendanceFaculty } from '../attendance/QRAttendanceFaculty';
import { AttendancePredictionCard } from '../attendance/AttendancePredictionCard';
import { ReportExportModal } from '../reports/ReportExportModal';
import { sound } from '../../services/soundService';
import {
  Users,
  Camera,
  Plus,
  BookOpen,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  CheckCircle,
  FolderPlus,
  UserPlus,
  QrCode,
  Download,
  TrendingUp,
} from 'lucide-react';

export const FacultyDashboard: React.FC = () => {
  const {
    currentUser,
    currentOrg,
    classes,
    students,
    createClassCohort,
    enrollStudent,
    recordAttendance,
    showToast,
  } = useAuth();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'marker' | 'qr' | 'biometric' | 'prediction' | 'analytics'>('marker');
  const [reportExportOpen, setReportExportOpen] = useState(false);

  // Add Class Modal State
  const [addClassModalOpen, setAddClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCode, setNewClassCode] = useState('');
  const [newClassDept, setNewClassDept] = useState(currentUser?.department || 'Department of Computer Science');
  const [newClassSemester, setNewClassSemester] = useState('Fall 2026');

  // Quick Enroll Student Modal State
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentIdNumber, setStudentIdNumber] = useState('');

  const activeClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Students in selected class
  const classStudents = activeClass
    ? students.filter((s) => s.classId === activeClass.id || !s.classId)
    : [];

  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const created = createClassCohort({
      name: newClassName.trim(),
      code: newClassCode.trim() || 'CLS-101',
      department: newClassDept.trim(),
      semester: newClassSemester.trim(),
      advisorName: currentUser?.name || 'Faculty Instructor',
    });

    setSelectedClassId(created.id);
    setAddClassModalOpen(false);
    setNewClassName('');
    setNewClassCode('');
  };

  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentIdNumber.trim()) return;

    enrollStudent({
      name: studentName.trim(),
      studentIdNumber: studentIdNumber.trim(),
      classId: activeClass?.id || '',
      className: activeClass?.name || 'Academic Cohort',
      department: activeClass?.department || currentUser?.department,
    });

    setEnrollModalOpen(false);
    setStudentName('');
    setStudentIdNumber('');
  };

  return (
    <div className="space-y-8">
      {/* Faculty Header & Cohort Selection */}
      <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#b48728] font-bold block font-mono">
            Faculty Command Terminal · {currentUser?.name}
          </span>
          <h2 className="text-xl font-bold text-[#1c1917] font-display mt-0.5">
            {activeClass ? activeClass.name : 'No Class Cohort Selected'}
          </h2>
          <p className="text-xs text-[#78716c] mt-1">
            Institution: {currentOrg?.name || 'Academic Institution'} · Enrolled: {classStudents.length} Students
          </p>
        </div>

        {/* Class Selection & Creation Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {classes.length > 0 && (
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#2b2523]/15 text-xs shadow-sm">
              <Layers className="w-3.5 h-3.5 text-[#c83a4b]" />
              <select
                value={selectedClassId}
                onChange={(e) => {
                  setSelectedClassId(e.target.value);
                  sound.playClick();
                }}
                className="bg-transparent text-[#1c1917] font-medium focus:outline-none cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => {
              setAddClassModalOpen(true);
              sound.playClick();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-[#c83a4b] hover:bg-[#b92434] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Class Cohort
          </button>

          {activeClass && (
            <button
              onClick={() => {
                setEnrollModalOpen(true);
                sound.playClick();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#ede8dc] text-[#1c1917] text-xs font-semibold border border-[#2b2523]/15 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#b48728]" />
              Enroll Student
            </button>
          )}

          <button
            onClick={() => {
              setReportExportOpen(true);
              sound.playClick();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#ede8dc] text-[#1c1917] text-xs font-semibold border border-[#2b2523]/15 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#c83a4b]" />
            <span>Export Reports</span>
          </button>
        </div>
      </div>

      {/* EMPTY STATE: When faculty has not created any classes yet */}
      {classes.length === 0 ? (
        <div className="washi-card rounded-3xl p-12 text-center border border-[#2b2523]/10 max-w-2xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#c83a4b]/10 border border-[#c83a4b]/20 flex items-center justify-center text-[#c83a4b] mx-auto mb-4">
            <FolderPlus className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#1c1917] font-display">
            No Class Cohorts Registered Yet
          </h3>
          <p className="text-xs text-[#57534e] mt-2 leading-relaxed max-w-md mx-auto">
            You are authenticated in <strong>{currentOrg?.name || 'your institution'}</strong>. Create your first academic class cohort to start enrolling students, conducting biometric attendance, and monitoring attendance trees.
          </p>
          <button
            onClick={() => {
              setAddClassModalOpen(true);
              sound.playClick();
            }}
            className="mt-6 px-5 py-2.5 rounded-xl bg-[#c83a4b] hover:bg-[#b92434] text-white text-xs font-semibold inline-flex items-center gap-2 shadow-md transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Class</span>
          </button>
        </div>
      ) : classStudents.length === 0 ? (
        /* EMPTY STATE: Class exists but no students enrolled yet */
        <div className="washi-card rounded-3xl p-10 text-center border border-[#2b2523]/10 max-w-xl mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-[#b48728]/10 border border-[#b48728]/20 flex items-center justify-center text-[#b48728] mx-auto mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#1c1917] font-display">
            No Students Enrolled in {activeClass.name}
          </h3>
          <p className="text-xs text-[#57534e] mt-1.5 leading-relaxed">
            Enroll students by registration ID to begin roll call or facial verification.
          </p>
          <button
            onClick={() => {
              setEnrollModalOpen(true);
              sound.playClick();
            }}
            className="mt-5 px-4 py-2 rounded-xl bg-[#c83a4b] hover:bg-[#b92434] text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Student into Cohort</span>
          </button>
        </div>
      ) : (
        /* ACTIVE CLASS WITH ENROLLED STUDENTS */
        <>
          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#2b2523]/10 pb-2">
            <button
              onClick={() => {
                setActiveTab('marker');
                sound.playClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'marker'
                  ? 'bg-[#c83a4b] text-white shadow-sm'
                  : 'text-[#78716c] hover:text-[#1c1917] hover:bg-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Roll Call Marker</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('qr');
                sound.playClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-[#c83a4b] text-white shadow-sm'
                  : 'text-[#78716c] hover:text-[#1c1917] hover:bg-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Attendance System</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('biometric');
                sound.playClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'biometric'
                  ? 'bg-[#b48728] text-white shadow-sm'
                  : 'text-[#78716c] hover:text-[#1c1917] hover:bg-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Biometric Radar</span>
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
                setActiveTab('analytics');
                sound.playClick();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#626c59] text-white shadow-sm'
                  : 'text-[#78716c] hover:text-[#1c1917] hover:bg-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Vitality Specimen</span>
            </button>
          </div>

          {/* Tab 1: Attendance Marker */}
          {activeTab === 'marker' && (
            <AttendanceMarker
              students={classStudents}
              classNameTitle={activeClass.name}
              subjectTitle={activeClass.department}
              onUpdateStatus={(studentId, status) => {
                const s = classStudents.find((item) => item.id === studentId);
                recordAttendance({
                  classId: activeClass.id,
                  subjectId: activeClass.id,
                  studentId,
                  studentName: s?.name || 'Student',
                  sessionDate: new Date().toISOString().split('T')[0],
                  status,
                  method: 'manual',
                });
              }}
            />
          )}

          {/* Tab 2: Dynamic QR Attendance System */}
          {activeTab === 'qr' && (
            <QRAttendanceFaculty
              currentClass={activeClass}
              enrolledStudents={classStudents}
              facultyName={currentUser?.name || 'Faculty Member'}
              onAttendanceMarked={(studentId) => {
                const s = classStudents.find((item) => item.id === studentId);
                recordAttendance({
                  classId: activeClass.id,
                  subjectId: activeClass.id,
                  studentId,
                  studentName: s?.name || 'Student',
                  sessionDate: new Date().toISOString().split('T')[0],
                  status: 'present',
                  method: 'qr_code',
                });
              }}
            />
          )}

          {/* Tab 3: Biometric Scanner */}
          {activeTab === 'biometric' && (
            <FaceRecognitionScanner
              students={classStudents}
              onAttendanceMarked={(studentId) => {
                const s = classStudents.find((item) => item.id === studentId);
                recordAttendance({
                  classId: activeClass.id,
                  subjectId: activeClass.id,
                  studentId,
                  studentName: s?.name || 'Student',
                  sessionDate: new Date().toISOString().split('T')[0],
                  status: 'present',
                  method: 'biometric_face',
                });
              }}
            />
          )}

          {/* Tab 4: Attendance Prediction Engine */}
          {activeTab === 'prediction' && (
            <AttendancePredictionCard
              attended={classStudents.reduce((acc, s) => acc + s.attendedLectures, 0)}
              total={classStudents.reduce((acc, s) => acc + s.totalLectures, 0)}
              subjectOrClassName={activeClass.name}
              studentName={`Cohort ${activeClass.name}`}
            />
          )}

          {/* Tab 3: Vitality Tree */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6">
                <AttendanceTreeVisual
                  percentage={
                    classStudents.reduce((acc, s) => acc + s.overallAttendance, 0) /
                    (classStudents.length || 1)
                  }
                  label={`${activeClass.name} Vitality Tree`}
                  size="md"
                />
              </div>
              <div className="lg:col-span-6 washi-card rounded-2xl p-6 border border-[#2b2523]/10">
                <h4 className="text-sm font-bold text-[#1c1917] font-display mb-2">
                  Cohort Summary
                </h4>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between py-2 border-b border-[#2b2523]/10">
                    <span className="text-[#78716c]">Total Enrolled:</span>
                    <span className="font-bold text-[#1c1917]">{classStudents.length} Students</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#2b2523]/10">
                    <span className="text-[#78716c]">Average Attendance:</span>
                    <span className="font-bold text-[#c83a4b]">
                      {(
                        classStudents.reduce((acc, s) => acc + s.overallAttendance, 0) /
                        (classStudents.length || 1)
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-[#78716c]">At-Risk Students (&lt;75%):</span>
                    <span className="font-bold text-[#b92434]">
                      {classStudents.filter((s) => s.overallAttendance < 75).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Class Modal */}
      {addClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141110]/60 backdrop-blur-md">
          <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/15 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-[#1c1917] font-display mb-1">
              Add Academic Class Cohort
            </h3>
            <p className="text-xs text-[#78716c] mb-4">
              Register a new academic class for {currentOrg?.name}.
            </p>

            <form onSubmit={handleAddClassSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#44403c] mb-1 font-medium">Cohort / Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Computing & Cloud Architecture"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#44403c] mb-1 font-medium">Cohort Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS-401"
                    value={newClassCode}
                    onChange={(e) => setNewClassCode(e.target.value)}
                    className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#44403c] mb-1 font-medium">Semester</label>
                  <input
                    type="text"
                    required
                    value={newClassSemester}
                    onChange={(e) => setNewClassSemester(e.target.value)}
                    className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#44403c] mb-1 font-medium">Department</label>
                <input
                  type="text"
                  required
                  value={newClassDept}
                  onChange={(e) => setNewClassDept(e.target.value)}
                  className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddClassModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#ede8dc] text-[#57534e] hover:text-[#1c1917]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#c83a4b] hover:bg-[#b92434] text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Save Cohort
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
            <h3 className="text-base font-bold text-[#1c1917] font-display mb-1">
              Enroll Student into {activeClass?.name}
            </h3>
            <p className="text-xs text-[#78716c] mb-4">
              Add a student profile to this academic cohort.
            </p>

            <form onSubmit={handleEnrollStudent} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#44403c] mb-1 font-medium">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Liam Henderson"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#44403c] mb-1 font-medium">Registration / Student ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ST-2026-104"
                  value={studentIdNumber}
                  onChange={(e) => setStudentIdNumber(e.target.value)}
                  className="w-full bg-white border border-[#2b2523]/15 rounded-lg p-2.5 text-[#1c1917] focus:border-[#c83a4b] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEnrollModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#ede8dc] text-[#57534e] hover:text-[#1c1917]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#c83a4b] hover:bg-[#b92434] text-white font-medium flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Professional Report Export System Modal */}
      <ReportExportModal
        isOpen={reportExportOpen}
        onClose={() => setReportExportOpen(false)}
        defaultClassId={activeClass?.id}
        defaultType="class_wise"
      />
    </div>
  );
};
