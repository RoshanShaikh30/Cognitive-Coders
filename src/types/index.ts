export type UserRole = 'super_admin' | 'org_admin' | 'faculty' | 'student' | 'parent';

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  code: string;
  city: string;
  country: string;
  logoText: string;
  type: 'University' | 'School' | 'Institute' | 'College';
  tier: 'Enterprise' | 'Pro' | 'Premier';
  studentCount: number;
  facultyCount: number;
  activeClasses: number;
  averageAttendance: number;
  status: 'active' | 'suspended';
  founded: number;
  brandAccent: string;
}

export interface UserProfile {
  id: string;
  orgId: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  title?: string;
  studentIdRef?: string;
  childStudentIdRef?: string;
  phone?: string;
}

export interface Subject {
  id: string;
  orgId: string;
  code: string;
  name: string;
  department: string;
  instructorName: string;
  totalLecturesHeld: number;
  minimumRequired: number; // e.g. 75%
  credits: number;
}

export interface ClassCohort {
  id: string;
  orgId: string;
  name: string;
  code: string;
  department: string;
  semester: string;
  advisorName: string;
  totalStudents: number;
  averageAttendance: number;
  subjectIds: string[];
}

export interface StudentRecord {
  id: string;
  orgId: string;
  studentIdNumber: string;
  name: string;
  email: string;
  classId: string;
  className: string;
  department: string;
  avatar: string;
  overallAttendance: number;
  totalLectures: number;
  attendedLectures: number;
  consecutiveAbsences: number;
  isAtRisk: boolean;
  biometricRegistered: boolean;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  subjectAttendance: {
    subjectId: string;
    subjectCode: string;
    subjectName: string;
    attended: number;
    total: number;
    percentage: number;
  }[];
}

export interface AttendanceRecord {
  id: string;
  orgId: string;
  classId: string;
  subjectId: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  method: 'manual' | 'biometric_face' | 'qr_code' | 'beacon';
  markedAt: string;
  markedByName: string;
  notes?: string;
}

export interface SmartAlert {
  id: string;
  orgId: string;
  recipientRole: UserRole | 'all';
  type: 'critical_risk' | 'consecutive_absence' | 'improvement' | 'parent_notice' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: 'high' | 'medium' | 'low';
  studentName?: string;
  subjectName?: string;
}

export interface AIInsight {
  id: string;
  type: 'risk' | 'trend' | 'achievement' | 'pattern';
  title: string;
  summary: string;
  impact: string;
  recommendation: string;
  confidence: number;
}

export interface HeatmapCell {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0-6
  attendanceRate: number; // 0-100
  totalLectures: number;
  level: 0 | 1 | 2 | 3 | 4; // 0: none, 1: <75% (deep brown), 2: 75-84% (terracotta), 3: 85-94% (burnt orange), 4: 95-100% (soft gold)
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionTag?: {
    type: string;
    payload: string;
  };
}
