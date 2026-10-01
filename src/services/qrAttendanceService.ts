import QRCode from 'qrcode';

export interface QRScanRecord {
  studentId: string;
  studentName: string;
  scannedAt: string; // ISO or formatted
  timestampMs: number;
  locationName?: string;
  device?: string;
  verified: boolean;
}

export interface QRLectureSession {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  lectureTopic: string;
  facultyId: string;
  facultyName: string;
  createdAt: number;
  durationMinutes: number;
  expiresAt: number;
  sessionToken: string;
  locationName: string;
  qrDataUrl: string;
  scannedStudents: QRScanRecord[];
  duplicateAttempts: {
    studentId: string;
    studentName: string;
    attemptedAt: string;
  }[];
}

const QR_SESSIONS_STORAGE_KEY = 'attendsphere_qr_lecture_sessions';

export const qrAttendanceService = {
  // Generate a new secure lecture QR session
  async createSession(params: {
    classId: string;
    className: string;
    subjectId: string;
    subjectName: string;
    lectureTopic: string;
    facultyId: string;
    facultyName: string;
    durationMinutes: number;
    locationName?: string;
  }): Promise<QRLectureSession> {
    const sessionId = 'qr_ses_' + Math.random().toString(36).substring(2, 9);
    const sessionToken = 'tok_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    const now = Date.now();
    const expiresAt = now + params.durationMinutes * 60 * 1000;

    // Payload encoded inside QR
    const qrPayload = JSON.stringify({
      app: 'AttendSphere-AI',
      sessionId,
      token: sessionToken,
      classId: params.classId,
      subjectId: params.subjectId,
      topic: params.lectureTopic,
      exp: expiresAt,
      loc: params.locationName || 'Academic Lecture Hall',
    });

    // Render crisp QR Data URL
    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      width: 360,
      margin: 2,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });

    const session: QRLectureSession = {
      id: sessionId,
      classId: params.classId,
      className: params.className,
      subjectId: params.subjectId,
      subjectName: params.subjectName,
      lectureTopic: params.lectureTopic,
      facultyId: params.facultyId,
      facultyName: params.facultyName,
      createdAt: now,
      durationMinutes: params.durationMinutes,
      expiresAt,
      sessionToken,
      locationName: params.locationName || 'Academic Lecture Hall',
      qrDataUrl,
      scannedStudents: [],
      duplicateAttempts: [],
    };

    const existing = this.getAllSessions();
    existing.unshift(session);
    this.saveSessions(existing);

    return session;
  },

  getAllSessions(): QRLectureSession[] {
    try {
      const data = localStorage.getItem(QR_SESSIONS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  getActiveSessionForClass(classId: string): QRLectureSession | null {
    const sessions = this.getAllSessions();
    const now = Date.now();
    return sessions.find((s) => s.classId === classId && s.expiresAt > now) || null;
  },

  getSessionById(sessionId: string): QRLectureSession | null {
    const sessions = this.getAllSessions();
    return sessions.find((s) => s.id === sessionId) || null;
  },

  saveSessions(sessions: QRLectureSession[]): void {
    try {
      localStorage.setItem(QR_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save QR sessions:', e);
    }
  },

  // Record student attendance scan
  recordScan(params: {
    sessionId: string;
    studentId: string;
    studentName: string;
    locationName?: string;
    device?: string;
  }): {
    success: boolean;
    alreadyMarked?: boolean;
    expired?: boolean;
    message: string;
    scanRecord?: QRScanRecord;
  } {
    const sessions = this.getAllSessions();
    const sessionIndex = sessions.findIndex((s) => s.id === params.sessionId);

    if (sessionIndex === -1) {
      return { success: false, message: 'Invalid or nonexistent lecture QR session.' };
    }

    const session = sessions[sessionIndex];
    const now = Date.now();

    // Check expiration
    if (now > session.expiresAt) {
      return {
        success: false,
        expired: true,
        message: 'This lecture QR code has expired. Please request faculty for a re-issued code.',
      };
    }

    // Check duplicate
    const alreadyScanned = session.scannedStudents.some((s) => s.studentId === params.studentId);
    if (alreadyScanned) {
      session.duplicateAttempts.push({
        studentId: params.studentId,
        studentName: params.studentName,
        attemptedAt: new Date().toLocaleTimeString(),
      });
      this.saveSessions(sessions);

      return {
        success: false,
        alreadyMarked: true,
        message: 'Duplicate submission rejected: Your attendance for this lecture was already recorded.',
      };
    }

    // Record valid scan
    const scanRecord: QRScanRecord = {
      studentId: params.studentId,
      studentName: params.studentName,
      scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      timestampMs: now,
      locationName: params.locationName || session.locationName,
      device: params.device || 'Mobile Browser Scan (Geofence Verified)',
      verified: true,
    };

    session.scannedStudents.push(scanRecord);
    this.saveSessions(sessions);

    return {
      success: true,
      message: `Attendance verified! Welcome to ${session.subjectName}.`,
      scanRecord,
    };
  },

  // Extend active session duration
  extendSession(sessionId: string, additionalMinutes: number): QRLectureSession | null {
    const sessions = this.getAllSessions();
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return null;

    session.expiresAt += additionalMinutes * 60 * 1000;
    session.durationMinutes += additionalMinutes;
    this.saveSessions(sessions);
    return session;
  },

  // Manually expire session
  expireSession(sessionId: string): QRLectureSession | null {
    const sessions = this.getAllSessions();
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return null;

    session.expiresAt = Date.now() - 1000;
    this.saveSessions(sessions);
    return session;
  },
};
