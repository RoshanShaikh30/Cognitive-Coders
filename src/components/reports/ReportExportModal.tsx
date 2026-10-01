import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Download,
  X,
  CheckCircle2,
  Sparkles,
  Layers,
  User,
  BookOpen,
  Building,
  GraduationCap,
} from 'lucide-react';
import {
  reportExportService,
  ReportType,
  ExportFormat,
} from '../../services/reportExportService';
import { useAuth } from '../../context/AuthContext';
import { sound } from '../../services/soundService';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: ReportType;
  defaultClassId?: string;
  defaultStudentId?: string;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'class_wise',
  defaultClassId,
  defaultStudentId,
}) => {
  const { currentOrg, classes, students, attendanceRecords, currentUser } = useAuth();

  const [reportType, setReportType] = useState<ReportType>(defaultType);
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [selectedClassId, setSelectedClassId] = useState<string>(defaultClassId || classes[0]?.id || '');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultStudentId || students[0]?.id || '');
  const [selectedSubject, setSelectedSubject] = useState<string>('Advanced Computer Architecture');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    sound.playClick();
    setIsExporting(true);

    setTimeout(() => {
      reportExportService.exportReport({
        reportType,
        format,
        organization: currentOrg,
        classes,
        students,
        attendanceRecords,
        selectedClassId,
        selectedStudentId,
        selectedSubjectName: selectedSubject,
        facultyName: currentUser?.name || 'Faculty Member',
        aiInsightSummary: `AttendSphere AI Audit: Evaluated institutional rosters against the statutory 75.0% compliance requirement. Real-time predictive telemetry recommends prioritized academic advising for students approaching borderline deficit thresholds.`,
      });

      sound.playSuccessChime();
      setIsExporting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg washi-card-elevated rounded-3xl p-6 sm:p-8 border border-[#2b2523]/15 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede8dc] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 text-xs font-mono text-[#b48728] uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Report Export Engine</span>
        </div>

        <h3 className="text-xl font-bold text-[#1c1917] font-display">
          Generate Institutional Attendance Dossier
        </h3>
        <p className="text-xs text-[#57534e] mt-1 leading-relaxed">
          Produce professionally formatted attendance records complete with trend analytics, percentage metrics, and AI predictive insights.
        </p>

        {/* Form Options */}
        <div className="mt-6 space-y-5">
          {/* Report Type Selector */}
          <div>
            <label className="text-[11px] font-mono uppercase text-[#78716c] block mb-2 font-bold">
              1. Select Report Scope
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setReportType('class_wise')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  reportType === 'class_wise'
                    ? 'bg-[#c83a4b] text-white border-[#c83a4b] shadow-xs'
                    : 'bg-white text-[#1c1917] border-[#2b2523]/15 hover:bg-[#ede8dc]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>Class-Wise</span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('student_wise')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  reportType === 'student_wise'
                    ? 'bg-[#c83a4b] text-white border-[#c83a4b] shadow-xs'
                    : 'bg-white text-[#1c1917] border-[#2b2523]/15 hover:bg-[#ede8dc]'
                }`}
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Student-Wise</span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('subject_wise')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  reportType === 'subject_wise'
                    ? 'bg-[#c83a4b] text-white border-[#c83a4b] shadow-xs'
                    : 'bg-white text-[#1c1917] border-[#2b2523]/15 hover:bg-[#ede8dc]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span>Subject-Wise</span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('faculty_wise')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  reportType === 'faculty_wise'
                    ? 'bg-[#c83a4b] text-white border-[#c83a4b] shadow-xs'
                    : 'bg-white text-[#1c1917] border-[#2b2523]/15 hover:bg-[#ede8dc]'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                <span>Faculty Report</span>
              </button>

              <button
                type="button"
                onClick={() => setReportType('organization_wise')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer col-span-2 sm:col-span-2 ${
                  reportType === 'organization_wise'
                    ? 'bg-[#c83a4b] text-white border-[#c83a4b] shadow-xs'
                    : 'bg-white text-[#1c1917] border-[#2b2523]/15 hover:bg-[#ede8dc]'
                }`}
              >
                <Building className="w-3.5 h-3.5 shrink-0" />
                <span>Organization-Wide Master Audit</span>
              </button>
            </div>
          </div>

          {/* Conditional Target Filter */}
          {reportType === 'class_wise' && classes.length > 0 && (
            <div>
              <label className="text-[11px] font-mono uppercase text-[#78716c] block mb-1">
                Select Class Cohort
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#2b2523]/15 text-xs text-[#1c1917] focus:outline-none cursor-pointer"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code}) · {c.department}
                  </option>
                ))}
              </select>
            </div>
          )}

          {reportType === 'student_wise' && students.length > 0 && (
            <div>
              <label className="text-[11px] font-mono uppercase text-[#78716c] block mb-1">
                Select Enrolled Student
              </label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#2b2523]/15 text-xs text-[#1c1917] focus:outline-none cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.studentIdNumber}) · {s.overallAttendance.toFixed(1)}%
                  </option>
                ))}
              </select>
            </div>
          )}

          {reportType === 'subject_wise' && (
            <div>
              <label className="text-[11px] font-mono uppercase text-[#78716c] block mb-1">
                Subject Course Name
              </label>
              <input
                type="text"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                placeholder="e.g. Distributed Systems & Algorithms"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#2b2523]/15 text-xs text-[#1c1917] focus:outline-none"
              />
            </div>
          )}

          {/* Export Format Selector */}
          <div>
            <label className="text-[11px] font-mono uppercase text-[#78716c] block mb-2 font-bold">
              2. Choose File Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  format === 'pdf'
                    ? 'bg-[#c83a4b]/10 border-[#c83a4b] text-[#1c1917]'
                    : 'bg-white border-[#2b2523]/15 text-[#57534e] hover:bg-[#ede8dc]'
                }`}
              >
                <div className={`p-2 rounded-xl ${format === 'pdf' ? 'bg-[#c83a4b] text-white' : 'bg-[#ede8dc] text-[#78716c]'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold font-display block">
                    PDF Document (.pdf)
                  </span>
                  <span className="text-[10px] text-[#78716c]">
                    Confidential institutional audit letterhead, tables, seal & AI report.
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('xlsx')}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  format === 'xlsx'
                    ? 'bg-[#626c59]/10 border-[#626c59] text-[#1c1917]'
                    : 'bg-white border-[#2b2523]/15 text-[#57534e] hover:bg-[#ede8dc]'
                }`}
              >
                <div className={`p-2 rounded-xl ${format === 'xlsx' ? 'bg-[#626c59] text-white' : 'bg-[#ede8dc] text-[#78716c]'}`}>
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold font-display block">
                    Excel Workbook (.xlsx)
                  </span>
                  <span className="text-[10px] text-[#78716c]">
                    Multi-sheet spreadsheet with summary KPI, roster & trends.
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Export Action Button */}
        <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-[#2b2523]/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716c] hover:text-[#1c1917] hover:bg-[#ede8dc] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-xl bg-[#c83a4b] hover:bg-[#b92434] text-white text-xs font-semibold flex items-center gap-2 shadow-md transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Compiling Dossier...' : `Export ${format.toUpperCase()} Report`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
