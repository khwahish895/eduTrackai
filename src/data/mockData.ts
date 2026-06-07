/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, LecturePeriod, Holiday, Note, Exam, StudentEnrollment, SystemNotification } from '../types';

export const mockSubjects: Subject[] = [
  {
    id: 'sub-01',
    name: 'Advanced Machine Learning',
    code: 'CS-401',
    teacherName: 'Dr. Evelyn Harris',
    attendancePct: 88,
    classesAttended: 22,
    totalClasses: 25,
    room: 'Lab 3, Tech Block',
    riskStatus: 'SAFE',
    recommendation: 'Excellent consistency. Keep submitting research papers ahead of the midterm.',
    absenceHistory: [
      { date: '2026-05-12', reason: 'Medical appointment', status: 'LATE' },
      { date: '2026-05-24', reason: 'Participating in Hackathon', status: 'ABSENT' }
    ]
  },
  {
    id: 'sub-02',
    name: 'Database Management Systems',
    code: 'CS-302',
    teacherName: 'Prof. Marcus Vance',
    attendancePct: 72,
    classesAttended: 18,
    totalClasses: 25,
    room: 'Room 402, Main Block',
    riskStatus: 'WARNING',
    recommendation: 'Your attendance is borderline. You must attend the next 4 lectures to push above the 75% safe threshold.',
    absenceHistory: [
      { date: '2026-05-10', reason: 'Overslept', status: 'ABSENT' },
      { date: '2026-05-18', reason: 'Transit delay', status: 'LATE' },
      { date: '2026-06-02', reason: 'Family event', status: 'ABSENT' }
    ]
  },
  {
    id: 'sub-03',
    name: 'Software Engineering',
    code: 'CS-305',
    teacherName: 'Dr. Sarah Jenkins',
    attendancePct: 96,
    classesAttended: 24,
    totalClasses: 25,
    room: 'Seminar Hall B',
    riskStatus: 'SAFE',
    recommendation: 'Outstanding commitment. Your team is on track for peak metrics in Agile sprints.',
    absenceHistory: [
      { date: '2026-05-15', reason: 'Late bus', status: 'LATE' }
    ]
  },
  {
    id: 'sub-04',
    name: 'Automata & Compiler Design',
    code: 'CS-405',
    teacherName: 'Prof. Gregory Chen',
    attendancePct: 60,
    classesAttended: 15,
    totalClasses: 25,
    room: 'Room 101, Eastern Wing',
    riskStatus: 'CRITICAL',
    recommendation: 'Urgent notice! Minimum 75% required to sit for University Examinations. Please book an academic advising session immediately.',
    absenceHistory: [
      { date: '2026-05-04', reason: 'Sick leave', status: 'ABSENT' },
      { date: '2026-05-11', reason: 'No explanation provided', status: 'ABSENT' },
      { date: '2026-05-18', reason: 'Fever', status: 'ABSENT' },
      { date: '2026-05-25', reason: 'Unverified medical issue', status: 'ABSENT' },
      { date: '2026-06-01', reason: 'Overslept', status: 'ABSENT' }
    ]
  },
  {
    id: 'sub-05',
    name: 'Computer Networks',
    code: 'CS-308',
    teacherName: 'Dr. Laura Vance',
    attendancePct: 84,
    classesAttended: 21,
    totalClasses: 25,
    room: 'CISCO Lab, Eastern Wing',
    riskStatus: 'SAFE',
    recommendation: 'Consistent record, keep it up. Complete the Subnetting project before Friday.',
    absenceHistory: [
      { date: '2026-05-08', reason: 'Heavy rains', status: 'LATE' },
      { date: '2026-05-22', reason: 'Internal workshop', status: 'ABSENT' }
    ]
  }
];

export const mockLecturePeriods: LecturePeriod[] = [
  // Monday
  { id: 'l1', subjectName: 'Advanced Machine Learning', code: 'CS-401', time: '09:00 AM - 10:30 AM', room: 'Lab 3', day: 'Monday' },
  { id: 'l2', subjectName: 'Database Management Systems', code: 'CS-302', time: '11:00 AM - 12:30 PM', room: 'Room 402', day: 'Monday' },
  // Tuesday
  { id: 'l3', subjectName: 'Software Engineering', code: 'CS-305', time: '09:00 AM - 10:30 AM', room: 'Seminar Hall B', day: 'Tuesday' },
  { id: 'l4', subjectName: 'Automata & Compiler Design', code: 'CS-405', time: '01:30 PM - 03:00 PM', room: 'Room 101', day: 'Tuesday' },
  // Wednesday
  { id: 'l5', subjectName: 'Computer Networks', code: 'CS-308', time: '10:30 AM - 12:00 PM', room: 'CISCO Lab', day: 'Wednesday' },
  { id: 'l6', subjectName: 'Advanced Machine Learning', code: 'CS-401', time: '01:30 PM - 03:00 PM', room: 'Lab 3', day: 'Wednesday' },
  // Thursday
  { id: 'l7', subjectName: 'Database Management Systems', code: 'CS-302', time: '09:00 AM - 10:30 AM', room: 'Room 402', day: 'Thursday' },
  { id: 'l8', subjectName: 'Software Engineering', code: 'CS-305', time: '11:00 AM - 12:30 PM', room: 'Seminar Hall B', day: 'Thursday' },
  // Friday
  { id: 'l9', subjectName: 'Automata & Compiler Design', code: 'CS-405', time: '09:00 AM - 10:30 AM', room: 'Room 101', day: 'Friday' },
  { id: 'l10', subjectName: 'Computer Networks', code: 'CS-308', time: '01:30 PM - 03:00 PM', room: 'CISCO Lab', day: 'Friday' }
];

export const mockHolidays: Holiday[] = [
  { id: 'h1', name: 'Summer Solstice Inbound Break', date: '2026-06-21', type: 'ACADEMIC' },
  { id: 'h2', name: 'National Technology Day', date: '2026-05-11', type: 'PUBLIC' },
  { id: 'h3', name: 'University Innovation Fest', date: '2026-06-18', type: 'EVENT' },
  { id: 'h4', name: 'Independence Jubilee', date: '2026-07-04', type: 'PUBLIC' },
  { id: 'h5', name: 'Inter-Departmental Athletics Meet', date: '2026-06-25', type: 'EVENT' }
];

export const mockDefaultNotes: Note[] = [
  {
    id: 'n1',
    title: 'SVM Lagrange Multipliers formula',
    content: 'Review dual formulation for Quadratic Programming. Remember to optimize alpha constraints sum(alpha*y) = 0.',
    subjectId: 'sub-01',
    createdAt: '2026-06-03'
  },
  {
    id: 'n2',
    title: 'Database Normalization rules',
    content: '3NF vs BCNF. BCNF matches 3NF but requires every determinant to be a super key. Clean up transitive dependencies on functional mappings.',
    subjectId: 'sub-02',
    createdAt: '2026-06-05'
  },
  {
    id: 'n3',
    title: 'Agile vs Waterfall essay revision',
    content: 'Focus on scrum velocity metrics, pipeline story mapping, sprint retro checklists. Standard Software Architecture question.',
    subjectId: 'sub-03',
    createdAt: '2026-05-28'
  }
];

export const mockExams: Exam[] = [
  { id: 'e1', subjectName: 'Advanced Machine Learning', date: '2026-06-15', duration: '3 Hours', weight: 30, countdownDays: 8 },
  { id: 'e2', subjectName: 'Database Management Systems', date: '2026-06-17', duration: '2.5 Hours', weight: 25, countdownDays: 10 },
  { id: 'e3', subjectName: 'Software Engineering', date: '2026-06-20', duration: '3 Hours', weight: 30, countdownDays: 13 },
  { id: 'e4', subjectName: 'Automata & Compiler Design', date: '2026-06-24', duration: '3 Hours', weight: 40, countdownDays: 17 }
];

export const mockStudents: StudentEnrollment[] = [
  { id: 'st-01', name: 'Ravi Kumar', roleNumber: '2026CS1042', avatarUrl: 'RK', overallAttendance: 80, status: 'SAFE', grade: 'A' },
  { id: 'st-02', name: 'Ananya Sharma', roleNumber: '2026CS1011', avatarUrl: 'AS', overallAttendance: 92, status: 'SAFE', grade: 'A+' },
  { id: 'st-03', name: 'Arjun Mehra', roleNumber: '2026CS1009', avatarUrl: 'AM', overallAttendance: 74, status: 'WARNING', grade: 'B' },
  { id: 'st-04', name: 'Dev Patel', roleNumber: '2026CS1088', avatarUrl: 'DP', overallAttendance: 60, status: 'CRITICAL', grade: 'C' },
  { id: 'st-05', name: 'Neha Gupta', roleNumber: '2026CS1023', avatarUrl: 'NG', overallAttendance: 88, status: 'SAFE', grade: 'A' },
  { id: 'st-06', name: 'Rahul Sen', roleNumber: '2026CS1092', avatarUrl: 'RS', overallAttendance: 95, status: 'SAFE', grade: 'A+' },
  { id: 'st-07', name: 'Meera Deshmukh', roleNumber: '2026CS1045', avatarUrl: 'MD', overallAttendance: 78, status: 'SAFE', grade: 'B+' },
  { id: 'st-08', name: 'Vikram Singh', roleNumber: '2026CS1077', avatarUrl: 'VS', overallAttendance: 63, status: 'CRITICAL', grade: 'D' },
  { id: 'st-09', name: 'Pooja Iyer', roleNumber: '2026CS1015', avatarUrl: 'PI', overallAttendance: 83, status: 'SAFE', grade: 'B+' },
  { id: 'st-10', name: 'Rohan Verma', roleNumber: '2026CS1055', avatarUrl: 'RV', overallAttendance: 71, status: 'WARNING', grade: 'B-' }
];

export const mockNotifications: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Low Attendance Alert (Automata)',
    message: 'Your overall attendance in CS-405 has reached 60%. Please meet Prof. Gregory Chen on Wednesday.',
    time: '2 hours ago',
    type: 'WARNING',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Hackathon Attendance Pre-cleared',
    message: 'Absence logging for 24th May cleared by Dr. Evelyn Harris. Approved as external duty participation.',
    time: '1 day ago',
    type: 'SUCCESS',
    read: false
  },
  {
    id: 'notif-3',
    title: 'DBMS Threshold Warning',
    message: 'Your DBMS attendance is at 72%. Attend the upcoming lab session tomorrow to keep eligible.',
    time: '2 days ago',
    type: 'INFO',
    read: true
  }
];
