import React, { useState } from 'react';
import { Check, X, Clock, AlertCircle, Download, CheckCheck, Search } from 'lucide-react';
import { StudentRecord, AttendanceStatus } from '../../types';
import { sound } from '../../services/soundService';

interface AttendanceMarkerProps {
  students: StudentRecord[];
  classNameTitle: string;
  subjectTitle: string;
  onUpdateStatus: (studentId: string, status: AttendanceStatus) => void;
}

export const AttendanceMarker: React.FC<AttendanceMarkerProps> = ({
  students,
  classNameTitle,
  subjectTitle,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAtRisk, setFilterAtRisk] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
    onUpdateStatus(studentId, status);
    if (status === 'present') sound.playClick();
    else if (status === 'absent') sound.playAlert();
    else sound.playHover();
  };

  const markAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      updated[s.id] = 'present';
      onUpdateStatus(s.id, 'present');
    });
    setAttendanceMap(updated);
    sound.playSuccessChime();
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentIdNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = filterAtRisk ? s.overallAttendance < 75 : true;
    return matchesSearch && matchesRisk;
  });

  const exportCSV = () => {
    sound.playClick();
    const headers = 'Student ID,Name,Class,Subject,Status,Cumulative Attendance\n';
    const rows = students
      .map(
        (s) =>
          `"${s.studentIdNumber}","${s.name}","${classNameTitle}","${subjectTitle}","${
            attendanceMap[s.id] || 'unmarked'
          }","${s.overallAttendance.toFixed(1)}%"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attendance_${classNameTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const presentCount = Object.values(attendanceMap).filter((s) => s === 'present').length;
  const absentCount = Object.values(attendanceMap).filter((s) => s === 'absent').length;
  const lateCount = Object.values(attendanceMap).filter((s) => s === 'late').length;
  const sessionTurnout = students.length > 0 ? (presentCount / students.length) * 100 : 0;

  return (
    <div className="washi-card-elevated rounded-2xl p-6 border border-[#2b2523]/10 relative shadow-sm">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#2b2523]/10">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#b48728] font-bold font-mono">
            Active Lecture Session Roll Call
          </span>
          <h3 className="text-lg font-bold text-[#1c1917] font-display mt-0.5">
            {classNameTitle}
          </h3>
          <p className="text-xs text-[#78716c] mt-0.5">
            Subject: {subjectTitle} · Session Date: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={markAllPresent}
            disabled={students.length === 0}
            className="px-3.5 py-1.5 rounded-lg bg-[#c83a4b] hover:bg-[#b92434] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Present
          </button>
          <button
            onClick={exportCSV}
            disabled={students.length === 0}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#ede8dc] text-[#1c1917] text-xs font-medium border border-[#2b2523]/15 flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[#2b2523]/10">
        <div>
          <span className="text-[11px] text-[#78716c] block">Today's Turnout</span>
          <span className="text-xl font-bold font-mono text-[#c83a4b]">
            {sessionTurnout.toFixed(1)}%
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#78716c] block">Present</span>
          <span className="text-xl font-bold font-mono text-[#626c59]">
            {presentCount} <span className="text-xs font-normal text-[#78716c]">/ {students.length}</span>
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#78716c] block">Absent</span>
          <span className="text-xl font-bold font-mono text-[#b92434]">
            {absentCount}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-[#78716c] block">Late</span>
          <span className="text-xl font-bold font-mono text-[#b48728]">
            {lateCount}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#2b2523]/15 rounded-lg text-xs text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#c83a4b]"
          />
        </div>

        <button
          onClick={() => {
            setFilterAtRisk(!filterAtRisk);
            sound.playClick();
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
            filterAtRisk
              ? 'bg-[#c83a4b]/15 border-[#c83a4b] text-[#c83a4b]'
              : 'bg-white border-[#2b2523]/15 text-[#78716c] hover:text-[#1c1917]'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          {filterAtRisk ? 'Showing At-Risk Students Only' : 'Filter At-Risk (<75%)'}
        </button>
      </div>

      {/* Student Attendance Roster Table */}
      {filteredStudents.length === 0 ? (
        <div className="py-8 text-center text-[#78716c] text-xs">
          No students found matching current search criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#2b2523]/10 text-[#78716c] uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2 font-medium">Student Name</th>
                <th className="pb-3 font-medium">ID Number</th>
                <th className="pb-3 font-medium">Historical Rate</th>
                <th className="pb-3 text-right pr-2 font-medium">Session Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b2523]/5">
              {filteredStudents.map((s) => {
                const currentStatus = attendanceMap[s.id] || 'present';
                const isRisk = s.totalLectures > 0 && s.overallAttendance < 75;

                return (
                  <tr key={s.id} className="hover:bg-black/[0.01]">
                    <td className="py-3 pl-2">
                      <div className="font-semibold text-[#1c1917] flex items-center gap-1.5">
                        {s.name}
                        {isRisk && (
                          <span className="text-[10px] text-[#b92434] border border-[#b92434]/40 px-1 rounded font-mono">
                            &lt;75%
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#78716c]">{s.email}</span>
                    </td>

                    <td className="py-3 font-mono text-[#57534e]">{s.studentIdNumber}</td>

                    <td className="py-3">
                      <span className="font-mono font-bold text-[#1c1917]">
                        {s.totalLectures > 0 ? `${s.overallAttendance.toFixed(1)}%` : 'New'}
                      </span>
                    </td>

                    <td className="py-3 pr-2 text-right">
                      <div className="inline-flex items-center gap-1 bg-[#ede8dc]/80 p-1 rounded-xl border border-[#2b2523]/10">
                        <button
                          onClick={() => handleStatusChange(s.id, 'present')}
                          className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                            currentStatus === 'present'
                              ? 'bg-[#626c59] text-white font-bold shadow-sm'
                              : 'text-[#78716c] hover:text-[#1c1917]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px]">Present</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(s.id, 'absent')}
                          className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                            currentStatus === 'absent'
                              ? 'bg-[#b92434] text-white font-bold shadow-sm'
                              : 'text-[#78716c] hover:text-[#1c1917]'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px]">Absent</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(s.id, 'late')}
                          className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                            currentStatus === 'late'
                              ? 'bg-[#b48728] text-white font-bold shadow-sm'
                              : 'text-[#78716c] hover:text-[#1c1917]'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px]">Late</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
