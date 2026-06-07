/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  teacherName: string;
  attendancePct: number;
  classesAttended: number;
  totalClasses: number;
  room: string;
  riskStatus: 'SAFE' | 'WARNING' | 'CRITICAL';
  recommendation: string;
  absenceHistory: Array<{
    date: string;
    reason: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
  }>;
}

export interface LecturePeriod {
  id: string;
  subjectName: string;
  code: string;
  time: string;
  room: string;
  day: string; // 'Monday', 'Tuesday', etc.
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'PUBLIC' | 'ACADEMIC' | 'EVENT';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subjectId: string;
  createdAt: string;
}

export interface Exam {
  id: string;
  subjectName: string;
  date: string;
  duration: string;
  weight: number;
  score?: number;
  countdownDays: number;
}

export interface StudentEnrollment {
  id: string;
  name: string;
  roleNumber: string;
  avatarUrl: string;
  overallAttendance: number;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
  grade: string;
  selected?: boolean;
  todayStatus?: 'PRESENT' | 'ABSENT' | 'LATE' | 'NOT_MARKED';
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'WARNING' | 'INFO' | 'SUCCESS';
  read: boolean;
}
