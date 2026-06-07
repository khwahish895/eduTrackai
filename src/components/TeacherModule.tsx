/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, UserCheck, Calendar, BookOpen, Clock, QrCode, Search, 
  Sparkles, Check, AlertCircle, FileText, ChevronRight, BarChart2, 
  ArrowUpRight, Mail, Compass, HelpCircle, RefreshCw, Eye
} from 'lucide-react';
import { Subject, StudentEnrollment } from '../types';

interface TeacherModuleProps {
  initialStudents: StudentEnrollment[];
  subjects: Subject[];
}

export default function TeacherModule({
  initialStudents,
  subjects
}: TeacherModuleProps) {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'MARK_ATTENDANCE' | 'STUDENTS' | 'REPORTS'>('DASHBOARD');
  
  // Tab: Mark Attendance states
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0]?.name || '');
  const [scanningMethod, setScanningMethod] = useState<'MANUAL' | 'QR' | 'FACE'>('MANUAL');
  
  // Student States
  const [students, setStudents] = useState<StudentEnrollment[]>(
    initialStudents.map(s => ({ ...s, todayStatus: 'NOT_MARKED' }))
  );
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<StudentEnrollment | null>(null);

  // States for simulators
  const [qrScanning, setQrScanning] = useState<boolean>(false);
  const [facePointsDetected, setFacePointsDetected] = useState<boolean>(false);
  const [bulkConfirmed, setBulkConfirmed] = useState<boolean>(false);
  const [attendanceReportStatus, setAttendanceReportStatus] = useState<string | null>(null);

  // Trigger scanning steps
  const triggerQrSimulate = () => {
    setQrScanning(true);
    setTimeout(() => {
      // Mark 3 random NOT_MARKED students as PRESENT
      setStudents(prev => {
        let count = 0;
        return prev.map(s => {
          if (s.todayStatus === 'NOT_MARKED' && count < 3) {
            count++;
            return { ...s, todayStatus: 'PRESENT' };
          }
          return s;
        });
      });
      setQrScanning(false);
      alert('QR Code match completed. 3 employee check-ins verified.');
    }, 2000);
  };

  const triggerFaceVerifySimulate = () => {
    setFacePointsDetected(true);
    setTimeout(() => {
      // Mark 1 random student as LATE
      setStudents(prev => {
        let marked = false;
        return prev.map(s => {
          if (s.todayStatus === 'NOT_MARKED' && !marked) {
            marked = true;
            return { ...s, todayStatus: 'PRESENT' };
          }
          return s;
        });
      });
      setFacePointsDetected(false);
      alert('AI landmarks matched confidence criteria. Student verified.');
    }, 2200);
  };

  const handleStatusChange = (id: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, todayStatus: status } : s));
  };

  const applyBulkPresent = () => {
    setStudents(prev => prev.map(s => s.todayStatus === 'NOT_MARKED' ? { ...s, todayStatus: 'PRESENT' } : s));
    setBulkConfirmed(true);
    setTimeout(() => setBulkConfirmed(false), 2000);
  };

  const triggerExportReport = () => {
    setAttendanceReportStatus('Preparing custom spreadsheet formats (CSV, PDF)...');
    setTimeout(() => {
      setAttendanceReportStatus('Download starting! EduTrack_Attendance_W23.xlsx. ✅');
      setTimeout(() => setAttendanceReportStatus(null), 3000);
    }, 1500);
  };

  // Stats
  const markedCount = students.filter(s => s.todayStatus !== 'NOT_MARKED').length;
  const presentCount = students.filter(s => s.todayStatus === 'PRESENT').length;
  const lateCount = students.filter(s => s.todayStatus === 'LATE').length;
  const absentCount = students.filter(s => s.todayStatus === 'ABSENT').length;

  // Filter student registry
  const filteredRegistry = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.roleNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* Teacher Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#1E293B] pb-4">
        {[
          { id: 'DASHBOARD', name: 'Dashboard Overview', icon: Users },
          { id: 'MARK_ATTENDANCE', name: 'Register Attendance', icon: QrCode },
          { id: 'STUDENTS', name: 'Student Registry', icon: Search },
          { id: 'REPORTS', name: 'Syllabus Reports & Analytics', icon: BarChart2 }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-650/15'
                  : 'bg-[#11131A] text-slate-400 hover:text-slate-200 border border-[#1E293B] hover:bg-[#0A0B10]'
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.name}
            </button>
          );
        })}
      </div>

      {/* Main Screen Router */}
      <div className="min-h-[460px]">
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            
            {/* Top Stat row cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#11131A] border border-[#1E293B] p-5 rounded-3xl">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block font-mono">Assigned classes</span>
                <span className="text-2xl font-extrabold text-white font-mono block mt-1">4 Semesters</span>
                <p className="text-[10px] text-slate-500 mt-1">Syllabus CS-401 to CS-405</p>
              </div>
              <div className="bg-[#11131A] border border-[#1E293B] p-5 rounded-3xl">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block font-mono">Total Students Active</span>
                <span className="text-2xl font-extrabold text-[#38bdf8] font-mono block mt-1">{initialStudents.length} Students</span>
                <p className="text-[10px] text-slate-500 mt-1">B.Tech CS Undergraduates</p>
              </div>
              <div className="bg-[#11131A] border border-[#1E293B] p-5 rounded-3xl">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block font-mono">Avg Faculty attendance</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-mono block mt-1">82.4% Pct</span>
                <p className="text-[10px] text-slate-500 mt-1">Above target baseline limit (+7.4%)</p>
              </div>
              <div className="bg-[#11131A] border border-[#1E293B] p-5 rounded-3xl">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block font-mono">Critical Risk Alerts</span>
                <span className="text-2xl font-bold text-red-500 font-mono block mt-1">2 Risk Cases</span>
                <p className="text-[10px] text-slate-500 mt-1">Attendance records decline detected</p>
              </div>
            </div>

            {/* AI insights, upcoming classes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left AI performance tracker */}
              <div className="lg:col-span-2 bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-semibold tracking-wider text-indigo-300 uppercase">AI Instructor Insights</h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#0A0B10]/30 border border-[#1E293B] flex gap-3">
                    <span className="text-lg">📢</span>
                    <p className="text-slate-350 leading-relaxed font-sans">
                      Overall student enrollment attendance averages **80.0%**. However, **CS-405 Advanced Automata** exhibits borderline participation ratios. 5 students have skipped multiple weekly lab components.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-indigo-950/15 border border-indigo-900/30 flex gap-3">
                    <span className="text-lg">🎯</span>
                    <p className="text-indigo-250 leading-relaxed font-sans">
                      <strong>Intervention Recommendation:</strong> Automated trigger reports indicate alerting student families directly from admin console will improve roster rates by 14% over 2 semesters.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Upcoming Classes scheduler cards */}
              <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-sans">Classes Today</h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-[#0A0B10]/40 border border-[#1E293B] rounded-2xl block space-y-1">
                    <span className="text-[9px] font-mono font-bold bg-[#0A0B10] text-[#818CF8] px-2 py-0.5 rounded-md border border-[#1E293B]">09:00 AM</span>
                    <h4 className="text-xs font-bold text-white truncate">CS-401 Machine Learning</h4>
                    <p className="text-[10px] text-slate-400">22 / 25 Registered Present</p>
                  </div>
                  <div className="p-3 bg-[#0A0B10]/40 border border-[#1E293B] rounded-2xl block space-y-1 opacity-70">
                    <span className="text-[9px] font-mono font-bold bg-[#0A0B10] text-slate-450 px-2 py-0.5 rounded-md border border-[#1E293B]">11:00 AM</span>
                    <h4 className="text-xs font-bold text-slate-300 truncate">CS-302 Database Systems</h4>
                    <p className="text-[10px] text-slate-500">Scheduled in Tech Block 4</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Mark Attendance Portals */}
        {activeTab === 'MARK_ATTENDANCE' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Scanning Controls */}
            <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl space-y-6 h-fit font-sans">
              <div className="space-y-1 border-b border-[#1E293B] pb-3">
                <h3 className="text-sm font-semibold text-white uppercase font-sans">Attendance Methods</h3>
                <p className="text-[11px] text-slate-500 font-sans">Select scanning layout or manual roster sheet</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Select Course</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full bg-[#0A0B10] border border-[#1E293B] rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-colors font-sans"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>

                {/* Mode Selector */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider font-mono">Verification Channel</span>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'MANUAL', name: 'Manual Sheet', desc: 'Directly check names from student roll' },
                      { id: 'QR', name: 'QR Code Scan', desc: 'Auto-scan student mobile QR passes' },
                      { id: 'FACE', name: 'Face recognition biometric', desc: 'Verify facial points with camera' }
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setScanningMethod(m.id as any)}
                        className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                          scanningMethod === m.id
                            ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-md shadow-indigo-950/10'
                            : 'bg-[#11131A]/30 border-[#1E293B] hover:border-indigo-500/20 text-slate-400'
                        }`}
                      >
                        <div className="text-xs font-bold font-sans">{m.name}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5 font-sans">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Attendance Roster area */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Method screen layouts */}
              <AnimatePresence mode="wait">
                {scanningMethod === 'MANUAL' && (
                  <motion.div
                    key="manual"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl space-y-4 font-sans"
                  >
                    <div className="flex justify-between items-center sm:flex-row flex-col gap-2">
                      <div>
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider font-sans">Manual Student Roster Sheet</h3>
                        <p className="text-[11px] text-slate-500 font-sans">Checking: <strong className="text-slate-300">{selectedSubject}</strong></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={applyBulkPresent}
                          className="px-3.5 py-2 bg-[#0A0B10] border border-[#1E293B] text-slate-300 text-[10px] font-bold rounded-xl hover:border-indigo-500/20 transition-all cursor-pointer font-sans"
                        >
                          Mark Unmarked Present
                        </button>
                      </div>
                    </div>

                    {/* Registry list */}
                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                      {students.map((student) => (
                        <div
                          key={student.id}
                          className="p-3 bg-[#0A0B10]/30 border border-[#1E293B] rounded-2xl flex items-center justify-between hover:border-indigo-500/30 transition-colors"
                        >
                          <div>
                            <span className="text-[10px] text-slate-500 font-mono tracking-wider block">{student.roleNumber}</span>
                            <span className="text-xs font-bold text-white">{student.name}</span>
                          </div>

                          <div className="flex gap-1.5">
                            {[
                              { label: 'PRESENT', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
                              { label: 'LATE', color: 'bg-amber-500/15 text-amber-500 border-amber-500/20' },
                              { label: 'ABSENT', color: 'bg-red-500/15 text-red-500 border-red-500/20' }
                            ].map((st) => (
                              <button
                                key={st.label}
                                onClick={() => handleStatusChange(student.id, st.label as any)}
                                className={`px-2.5 py-1.5 rounded-xl text-[9px] font-extrabold border cursor-pointer transition-all ${
                                  student.todayStatus === st.label
                                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 font-black scale-102'
                                    : 'opacity-55 hover:opacity-85 ' + st.color
                                }`}
                              >
                                {st.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {scanningMethod === 'QR' && (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl text-center space-y-6 font-sans"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-white">Interactive QR scanner simulation</h3>
                      <p className="text-[11px] text-slate-500 mt-1">Replicates students scanning their college ID passes on tablet stations</p>
                    </div>

                    <div className="relative w-48 h-48 mx-auto bg-[#0A0B10] rounded-3xl border border-[#1E293B] p-6 flex flex-col items-center justify-center overflow-hidden">
                      {qrScanning ? (
                        <>
                          <div className="absolute inset-x-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-[#818CF8] to-transparent animate-[scan_2s_ease-in-out_infinite]" />
                          <QrCode className="w-24 h-24 text-slate-800 animate-pulse" />
                        </>
                      ) : (
                        <QrCode className="w-24 h-24 text-indigo-400" />
                      )}
                      <span className="text-[10px] text-slate-400 mt-4 font-mono">
                        {qrScanning ? 'COMMUNICATION VERIFY...' : 'STATION STANDBY'}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={triggerQrSimulate}
                        disabled={qrScanning}
                        className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-2xl cursor-pointer w-full"
                      >
                        {qrScanning ? 'Scanning incoming waves...' : 'Simulate student QR pass'}
                      </button>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans px-4">
                        This simulates an industrial pass scanner terminal. When students present the QR dynamic token, it runs client-side checking and reports logs automatically.
                      </p>
                    </div>
                  </motion.div>
                )}

                {scanningMethod === 'FACE' && (
                  <motion.div
                    key="face"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl text-center space-y-6 font-sans"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-white">AI Face Recognition point match</h3>
                      <p className="text-[11px] text-slate-500 mt-1">Simulates on-device camera biometrics checking with depth analysis</p>
                    </div>

                    <div className="relative w-56 h-56 mx-auto bg-[#0A0B10] rounded-full border-2 border-indigo-500/20 flex flex-col items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent" />
                      
                      {/* Face Landmark Boxes */}
                      <div className="relative w-32 h-36 border-2 border-indigo-500/40 rounded-t-full rounded-b-[40%] flex items-center justify-center">
                        {facePointsDetected && (
                          <div className="absolute inset-0 border border-emerald-400/80 rounded-t-full rounded-b-[40%] animate-ping" />
                        )}
                        <span className="text-4xl text-slate-400">🧑</span>
                      </div>

                      <span className="absolute bottom-4 text-[9px] uppercase font-bold text-indigo-450 tracking-wider font-mono">
                        {facePointsDetected ? 'matching landmark points...' : 'Ready face scan'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={triggerFaceVerifySimulate}
                        disabled={facePointsDetected}
                        className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-2xl cursor-pointer w-full"
                      >
                        {facePointsDetected ? 'Biometric check active...' : 'Detect & Verify Face'}
                      </button>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans px-4">
                        Performs facial geometry recognition and liveness checking. Matches facial features against stored structural templates. Prevents photo presentation attacks.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Roster Live Stats bar */}
              <div className="grid grid-cols-4 gap-2 bg-[#11131A] border border-[#1E293B] p-4 rounded-3xl text-center text-xs font-sans">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block font-mono">Marked</span>
                  <span className="text-sm font-mono mt-0.5 block text-slate-350">{markedCount}/{students.length}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block font-mono">Present</span>
                  <span className="text-sm font-mono mt-0.5 block text-emerald-400 font-extrabold">{presentCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block font-mono">Late</span>
                  <span className="text-sm font-mono mt-0.5 block text-amber-400 font-extrabold">{lateCount}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold block font-mono font-bold">Absent</span>
                  <span className="text-sm font-mono mt-0.5 block text-red-400 font-extrabold">{absentCount}</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Student Registry & Export operations */}
        {activeTab === 'STUDENTS' && (
          <div className="space-y-6 font-sans">
            <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
              <div>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Active Student Directory</h3>
                <p className="text-[11px] text-slate-500">Searching within Computer Science undergraduates department</p>
              </div>

              {/* Download trigger */}
              <div className="w-full md:w-auto">
                <button
                  onClick={triggerExportReport}
                  className="px-4 py-2.5 bg-[#11131A]/80 border border-[#1E293B] text-slate-200 text-xs font-semibold rounded-2xl flex items-center gap-2 hover:bg-[#0A0B10] cursor-pointer transition-all"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Excel / PDF Export Roster
                </button>
              </div>
            </div>

            {/* Notification Bar of download */}
            {attendanceReportStatus && (
              <div className="p-3 bg-indigo-950/20 border border-indigo-900 text-indigo-300 text-xs font-medium rounded-2xl flex items-center gap-2 animate-bounce">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                {attendanceReportStatus}
              </div>
            )}

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students directory by name or roll..."
                className="w-full pl-10 pr-4 py-3 bg-[#11131A] border border-[#1E293B] focus:border-indigo-500 transition-colors rounded-3xl text-sm text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="border border-[#1E293B] rounded-3xl overflow-hidden bg-[#11131A]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0A0B10]/70 border-b border-[#1E293B] text-slate-400 font-semibold uppercase tracking-wider text-[10px] font-mono">
                    <th className="p-4">Student Profile</th>
                    <th className="p-4">Roll Number</th>
                    <th className="p-4">Overall attendance</th>
                    <th className="p-4">Action Plan</th>
                    <th className="p-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistry.map((student) => (
                    <tr key={student.id} className="border-b border-[#1E293B]/70 hover:bg-[#0A0B10]/30 text-slate-300 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0A0B10] border border-[#1E293B] flex items-center justify-center font-bold text-[11px] text-slate-200">
                            {student.avatarUrl}
                          </div>
                          <span className="font-bold text-white">{student.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-slate-400">{student.roleNumber}</td>
                      <td className="p-4 space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <span className={`${
                            student.overallAttendance >= 75 ? 'text-emerald-400' : 'text-red-400'
                          }`}>{student.overallAttendance}%</span>
                        </div>
                        <div className="h-1.5 w-24 bg-[#0A0B10] rounded-full overflow-hidden border border-[#1E293B]/30">
                          <div
                            className={`h-full rounded-full ${
                              student.overallAttendance >= 75 ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${student.overallAttendance}%` }}
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        {student.overallAttendance >= 75 ? (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl font-sans block w-fit border border-emerald-500/10">
                            High Consistency
                          </span>
                        ) : (
                          <span className="text-[10px] text-red-500 font-bold bg-red-450/10 px-2.5 py-1 rounded-xl font-sans block w-fit border border-red-500/10">
                            Block Risk (Counsel)
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="p-2 rounded-xl bg-[#0A0B10] border border-[#1E293B] text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected Student profile sub modal */}
            {selectedStudent && (
              <div className="p-5 bg-[#0A0B10] border border-[#1E293B] rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="flex items-center gap-3 md:col-span-2">
                  <div className="w-12 h-12 rounded-3xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-sm">
                    {selectedStudent.avatarUrl}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{selectedStudent.name}</h4>
                    <p className="text-xs text-slate-400">Class Year 3, Roll: {selectedStudent.roleNumber}</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button className="px-3.5 py-2 rounded-xl bg-[#11131A] border border-[#1E293B] text-[11px] font-semibold text-slate-300 hover:text-white cursor-pointer transition-all">
                    Send Email alert
                  </button>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-2 rounded-xl bg-[#11131A] border border-[#1E293B] text-[11px] text-slate-450 hover:text-white transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Analytics & Reports tab */}
        {activeTab === 'REPORTS' && (
          <div className="space-y-6 font-sans">
            <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl text-center space-y-3">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#38bdf8] bg-[#38bdf8]/15 px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono">
                Syllabus performance audits summary
              </span>
              <h3 className="text-base font-bold text-white">Department Participation Rates</h3>
              <p className="text-xs text-slate-400 px-6 leading-relaxed">
                Audited monthly records for 2026 Semester combined classes. Computer networks and machine learning fields exhibit the most consistent check-in parameters.
              </p>

              <div className="h-44 flex items-end gap-3 max-w-lg mx-auto pt-4 relative">
                {/* Simulated vertical bar graphs */}
                {[
                  { label: 'Adv ML', value: 88, color: 'bg-emerald-500' },
                  { label: 'DB Systems', value: 72, color: 'bg-amber-500' },
                  { label: 'SE Design', value: 96, color: 'bg-indigo-500' },
                  { label: 'Automata', value: 60, color: 'bg-red-500' },
                  { label: 'Comp Net', value: 84, color: 'bg-indigo-400' }
                ].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative bg-[#0A0B10] rounded-xl overflow-hidden flex flex-col justify-end border border-[#1E293B]/60" style={{ height: '120px' }}>
                      <div className={`w-full rounded-b-none rounded-t-md hover:brightness-105 transition-all ${bar.color}`} style={{ height: `${bar.value}%` }} />
                      <span className="absolute inset-x-0 bottom-2 text-center text-[10px] font-bold text-white font-mono">
                        {bar.value}%
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400 font-mono">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
