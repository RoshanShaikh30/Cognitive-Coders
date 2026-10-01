import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Organization,
  ClassCohort,
  StudentRecord,
  AttendanceRecord,
  SmartAlert,
  AIInsight,
  AttendanceStatus,
} from '../types';
import {
  authService,
  dbService,
  AuthSession,
  SignUpParams,
} from '../services/supabaseClient';
import { sound } from '../services/soundService';

interface AuthContextType {
  // Authentication State (Never auto-logged in by default!)
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  currentOrg: Organization | null;
  session: AuthSession | null;
  authLoading: boolean;

  // Real Auth Actions
  signUp: (params: SignUpParams) => Promise<{ success: boolean; verificationCode?: string; error?: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  resendVerification: (email: string) => Promise<{ verificationCode?: string; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;

  // Organization & Real DB state
  organizations: Organization[];
  classes: ClassCohort[];
  students: StudentRecord[];
  attendanceRecords: AttendanceRecord[];
  alerts: SmartAlert[];
  insights: AIInsight[];

  // Entity Creation Actions (Real SaaS operations)
  createOrganization: (orgData: Partial<Organization>) => Organization;
  createClassCohort: (classData: { name: string; code: string; department: string; semester: string; advisorName: string }) => ClassCohort;
  enrollStudent: (studentData: { name: string; studentIdNumber: string; classId?: string; className?: string; department?: string; guardianName?: string; guardianEmail?: string; guardianPhone?: string; biometricRegistered?: boolean }) => StudentRecord;
  recordAttendance: (recordData: { classId: string; subjectId: string; studentId: string; studentName: string; date?: string; sessionDate?: string; status: AttendanceStatus; method: AttendanceRecord['method']; notes?: string }) => AttendanceRecord;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Sound preference
  soundMuted: boolean;
  toggleSound: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Real Database entities
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [classes, setClasses] = useState<ClassCohort[]>([]);
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [soundMuted, setSoundMuted] = useState<boolean>(sound.getMuted());

  // Load active session from storage on launch (if user previously signed in)
  useEffect(() => {
    const existing = authService.getCurrentSession();
    if (existing) {
      setSession(existing);
      setCurrentUser(existing.user);
      setCurrentOrg(existing.organization);
      loadOrgData(existing.user.orgId);
    }
    setOrganizations(dbService.getOrganizations());
    setAuthLoading(false);
  }, []);

  const loadOrgData = (orgId: string) => {
    if (!orgId) return;
    setClasses(dbService.getClasses(orgId));
    setStudents(dbService.getStudents(orgId));
    setAttendanceRecords(dbService.getAttendanceRecords(orgId));
    setAlerts(dbService.getAlerts(orgId));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setSoundMuted(muted);
  };

  // 1. SIGN UP
  const signUp = async (params: SignUpParams) => {
    const res = await authService.signUp(params);
    if (res.error) {
      return { success: false, error: res.error };
    }
    setOrganizations(dbService.getOrganizations());
    return { success: true, verificationCode: res.verificationCode };
  };

  // 2. VERIFY EMAIL
  const verifyEmail = async (email: string, code: string) => {
    const res = await authService.verifyEmail(email, code);
    return res;
  };

  const resendVerification = async (email: string) => {
    return await authService.resendVerification(email);
  };

  // 3. SIGN IN
  const signIn = async (email: string, password: string) => {
    const res = await authService.signIn(email, password);
    if (res.error) {
      return { success: false, error: res.error };
    }

    if (res.session) {
      setSession(res.session);
      setCurrentUser(res.session.user);
      setCurrentOrg(res.session.organization);
      loadOrgData(res.session.user.orgId);
      sound.playSuccessChime();
      showToast(`Welcome back, ${res.session.user.name}. Authenticated as ${res.session.user.role.toUpperCase().replace('_', ' ')}.`);
      return { success: true };
    }
    return { success: false, error: 'Authentication failed.' };
  };

  // 4. SIGN OUT (Completely wipes session and closes dashboard access)
  const signOut = async () => {
    await authService.signOut();
    setSession(null);
    setCurrentUser(null);
    setCurrentOrg(null);
    setClasses([]);
    setStudents([]);
    setAttendanceRecords([]);
    sound.playClick();
    showToast('Signed out of AttendSphere AI.');
  };

  // REAL DATA ACTIONS
  const createOrganization = (orgData: Partial<Organization>) => {
    const created = dbService.createOrganization(orgData);
    setOrganizations(dbService.getOrganizations());
    if (currentUser && currentUser.role === 'org_admin') {
      setCurrentOrg(created);
    }
    sound.playSuccessChime();
    showToast(`Organization "${created.name}" established.`);
    return created;
  };

  const createClassCohort = (classData: { name: string; code: string; department: string; semester: string; advisorName: string }) => {
    if (!currentOrg) throw new Error('No active organization context');
    const created = dbService.createClass({ ...classData, orgId: currentOrg.id });
    setClasses(dbService.getClasses(currentOrg.id));
    sound.playSuccessChime();
    showToast(`Cohort "${created.name}" (${created.code}) created successfully.`);
    return created;
  };

  const enrollStudent = (studentData: { name: string; studentIdNumber: string; classId?: string; className?: string; department?: string; guardianName?: string; guardianEmail?: string; guardianPhone?: string; biometricRegistered?: boolean }) => {
    if (!currentOrg) throw new Error('No active organization context');
    const created = dbService.createStudent({ ...studentData, orgId: currentOrg.id });
    setStudents(dbService.getStudents(currentOrg.id));
    sound.playSuccessChime();
    showToast(`Student ${created.name} (${created.studentIdNumber}) enrolled.`);
    return created;
  };

  const recordAttendance = (recordData: { classId: string; subjectId: string; studentId: string; studentName: string; date?: string; sessionDate?: string; status: AttendanceStatus; method: AttendanceRecord['method']; notes?: string }) => {
    if (!currentOrg) throw new Error('No active organization context');
    const created = dbService.recordAttendance({
      classId: recordData.classId,
      subjectId: recordData.subjectId,
      studentId: recordData.studentId,
      studentName: recordData.studentName,
      date: recordData.date || recordData.sessionDate || new Date().toISOString().split('T')[0],
      status: recordData.status,
      method: recordData.method,
      notes: recordData.notes,
      orgId: currentOrg.id,
      markedByName: currentUser?.name || 'Authorized Instructor',
    });
    setAttendanceRecords(dbService.getAttendanceRecords(currentOrg.id));
    setStudents(dbService.getStudents(currentOrg.id));
    sound.playClick();
    return created;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(session && currentUser),
        currentUser,
        currentOrg,
        session,
        authLoading,
        signUp,
        verifyEmail,
        resendVerification,
        signIn,
        signOut,
        organizations,
        classes,
        students,
        attendanceRecords,
        alerts,
        insights,
        createOrganization,
        createClassCohort,
        enrollStudent,
        recordAttendance,
        toastMessage,
        showToast,
        soundMuted,
        toggleSound,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
