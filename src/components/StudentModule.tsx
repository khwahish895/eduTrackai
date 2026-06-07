/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PieChart, BookOpen, Calendar, Calculator, Clock, MapPin, 
  Book, Sparkles, Plus, Search, Trash2, CheckCircle, AlertTriangle, 
  XCircle, Filter, FileText, Gift, Milestone, User, UserCheck, HelpCircle
} from 'lucide-react';
import { Subject, LecturePeriod, Holiday, Note, Exam, SystemNotification } from '../types';

interface StudentModuleProps {
  subjects: Subject[];
  timetable: LecturePeriod[];
  holidays: Holiday[];
  initialNotes: Note[];
  exams: Exam[];
}

export default function StudentModule({
  subjects,
  timetable,
  holidays,
  initialNotes,
  exams
}: StudentModuleProps) {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'CALCULATOR' | 'TIMETABLE' | 'NOTES' | 'EXAMS' | 'PROFILE'>('DASHBOARD');
  
  // States
  const [calculatorSubjectId, setCalculatorSubjectId] = useState<string>(subjects[0]?.id || '');
  const [attendNext, setAttendNext] = useState<number>(5);
  const [missNext, setMissNext] = useState<number>(0);
  
  const [timetableDay, setTimetableDay] = useState<string>('Monday');
  
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [noteSearch, setNoteSearch] = useState<string>('');
  const [noteSubjectId, setNoteSubjectId] = useState<string>('all');
  const [newNoteTitle, setNewNoteTitle] = useState<string>('');
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [newNoteSubjectId, setNewNoteSubjectId] = useState<string>(subjects[0]?.id || '');

  // Mock Calendar Attendance Map
  // Present = Green, Absent = Red, Late = Orange
  const calendarDays = [
    { day: 1, status: 'PRESENT' }, { day: 2, status: 'PRESENT' }, { day: 3, status: 'LATE' },
    { day: 4, status: 'PRESENT' }, { day: 5, status: 'ABSENT' }, { day: 6, status: 'WEEKEND' }, { day: 7, status: 'WEEKEND' },
    { day: 8, status: 'PRESENT' }, { day: 9, status: 'PRESENT' }, { day: 10, status: 'PRESENT' },
    { day: 11, status: 'PRESENT' }, { day: 12, status: 'LATE' }, { day: 13, status: 'WEEKEND' }, { day: 14, status: 'WEEKEND' },
    { day: 15, status: 'PRESENT' }, { day: 16, status: 'ABSENT' }, { day: 17, status: 'PRESENT' },
    { day: 18, status: 'PRESENT' }, { day: 19, status: 'LATE' }, { day: 20, status: 'WEEKEND' }, { day: 21, status: 'WEEKEND' },
    { day: 22, status: 'PRESENT' }, { day: 23, status: 'PRESENT' }, { day: 24, status: 'PRESENT' },
    { day: 25, status: 'PRESENT' }, { day: 26, status: 'ABSENT' }, { day: 27, status: 'WEEKEND' }, { day: 28, status: 'WEEKEND' },
    { day: 29, status: 'PRESENT' }, { day: 30, status: 'PRESENT' }
  ];

  // Overall Attendance Calculation
  const totalClasses = subjects.reduce((sum, s) => sum + s.totalClasses, 0);
  const attendedClasses = subjects.reduce((sum, s) => sum + s.classesAttended, 0);
  const overallPct = Math.round((attendedClasses / totalClasses) * 100);

  // Leave Calculator Output
  const calcSubject = subjects.find(s => s.id === calculatorSubjectId);
  const simulateAttendance = () => {
    if (!calcSubject) return { current: 0, projected: 0, status: 'SAFE', classesNeeded: 0 };
    const simulatedAttended = calcSubject.classesAttended + attendNext;
    const simulatedTotal = calcSubject.totalClasses + attendNext + missNext;
    const projected = Math.round((simulatedAttended / simulatedTotal) * 100);
    
    // Calculate consecutive classes needed to touch 75%
    let classesNeeded = 0;
    let tempAttended = calcSubject.classesAttended;
    let tempTotal = calcSubject.totalClasses;
    while ((tempAttended / tempTotal) < 0.75 && classesNeeded < 50) {
      tempAttended++;
      tempTotal++;
      classesNeeded++;
    }

    return {
      current: calcSubject.attendancePct,
      projected,
      status: projected >= 75 ? 'SAFE' : projected >= 65 ? 'WARNING' : 'CRITICAL',
      classesNeeded
    };
  };

  const simulation = simulateAttendance();

  // Notes filtering
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(noteSearch.toLowerCase()) || 
                          note.content.toLowerCase().includes(noteSearch.toLowerCase());
    const matchesSubject = noteSubjectId === 'all' || note.subjectId === noteSubjectId;
    return matchesSearch && matchesSubject;
  });

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent,
      subjectId: newNoteSubjectId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setNotes(prev => [newNote, ...prev]);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6">
      
      {/* Student Nav Bar */}
      <div className="flex flex-wrap gap-2 border-b border-[#1E293B] pb-4 font-sans">
        {[
          { id: 'DASHBOARD', name: 'Student Dashboard', icon: PieChart },
          { id: 'CALCULATOR', name: 'Attendance Calculator', icon: Calculator },
          { id: 'TIMETABLE', name: 'My Schedule', icon: Clock },
          { id: 'NOTES', name: 'Subject Revision Notes', icon: BookOpen },
          { id: 'EXAMS', name: 'Exam Tracker', icon: Milestone },
          { id: 'PROFILE', name: 'Student Profile', icon: User }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              id={`student-nav-btn-${t.id}`}
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

      {/* Main Container */}
      <div className="min-h-[460px]">
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            
            {/* Top overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
              
              {/* Circular Attendance Gauge */}
              <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl flex items-center gap-6">
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="10"/>
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="url(#indigoGrad)" strokeWidth="10"
                      strokeDasharray="264"
                      strokeDashoffset={Math.max(0, 264 - (264 * overallPct) / 100)}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                    <span className="text-2xl font-extrabold text-white font-mono tracking-tight">{overallPct}%</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Overall</span>
                  </div>
                </div>
                <div className="space-y-1.5 font-sans">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
                    Academic Standing
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                  </h4>
                  <p className="text-xs text-slate-400 font-normal leading-relaxed font-sans">
                    You have attended <strong className="text-indigo-400 font-mono">{attendedClasses}</strong> out of <strong className="text-slate-300 font-mono">{totalClasses}</strong> lectures compiled campus-wide this semester.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                    <CheckCircle className="w-3.5 h-3.5" /> High Standing
                  </span>
                </div>
              </div>

              {/* Attendance Status list summary */}
              <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl grid grid-cols-3 gap-2 text-center h-full">
                <div className="flex flex-col justify-center bg-[#0A0B10]/40 border border-[#1E293B]/50 rounded-2xl p-3">
                  <span className="text-xl font-bold font-mono text-emerald-400">{subjects.filter(s => s.riskStatus === 'SAFE').length}</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">Safe courses</span>
                </div>
                <div className="flex flex-col justify-center bg-[#0A0B10]/40 border border-[#1E293B]/50 rounded-2xl p-3">
                  <span className="text-xl font-bold font-mono text-amber-400">{subjects.filter(s => s.riskStatus === 'WARNING').length}</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">Borderline</span>
                </div>
                <div className="flex flex-col justify-center bg-[#0A0B10]/40 border border-[#1E293B]/50 rounded-2xl p-3">
                  <span className="text-xl font-bold font-mono text-red-400">{subjects.filter(s => s.riskStatus === 'CRITICAL').length}</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold mt-1">Critical</span>
                </div>
              </div>

              {/* Mini countdown / next lecture info */}
              <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl flex flex-col justify-between font-sans">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">COMING UP NEXT</span>
                  <p className="text-sm font-bold text-white mt-1 flex items-center gap-1">
                    Advanced Machine Learning
                  </p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    09:00 AM - 10:30 AM · Lab 3
                  </p>
                </div>
                <div className="pt-2 border-t border-[#1E293B] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">AI Face Scan Verified Zone</span>
                </div>
              </div>

            </div>

            {/* Subject Wise breakdown */}
            <div className="bg-[#11131A] border border-[#1E293B] rounded-3xl p-6 font-sans">
              <h3 className="text-sm font-semibold tracking-wide text-white mb-4 uppercase font-sans">Subject Attendance Breakdown</h3>
              <div className="space-y-4">
                {subjects.map((sub) => (
                  <div
                    key={sub.name}
                    className="p-4 bg-[#0A0B10]/40 rounded-2xl border border-[#1E293B] hover:border-indigo-500/50 transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center font-sans"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-md bg-[#0A0B10] border border-[#1E293B] text-indigo-300 font-mono font-bold">
                          {sub.code}
                        </span>
                        <h4 className="text-xs font-bold text-white font-sans">{sub.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-sans">
                        <span>Instructor: <strong className="text-slate-300 font-medium font-sans">{sub.teacherName}</strong></span>
                        <span>·</span>
                        <span>Hours: <strong className="text-slate-300 font-mono font-medium">{sub.classesAttended}/{sub.totalClasses}</strong></span>
                        <span>·</span>
                        <span className="text-indigo-400 font-semibold font-sans">{sub.room}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full md:w-1/3 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-semibold">
                        <span className="text-slate-400">Attendance Rank</span>
                        <span className={`font-mono ${
                          sub.attendancePct >= 75 ? 'text-emerald-400' : sub.attendancePct >= 65 ? 'text-amber-400' : 'text-red-400'
                        }`}>{sub.attendancePct}%</span>
                      </div>
                      <div className="h-2 bg-[#0A0B10] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            sub.attendancePct >= 75 ? 'bg-emerald-500' : sub.attendancePct >= 65 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${sub.attendancePct}%` }}
                        />
                      </div>
                    </div>

                    {/* Status badges / recommendations expander */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {sub.riskStatus === 'SAFE' && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-emerald-500/20 font-mono uppercase">
                          <CheckCircle className="w-3.5 h-3.5" /> High Standing
                        </span>
                      )}
                      {sub.riskStatus === 'WARNING' && (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-amber-500/20 font-mono uppercase">
                          <AlertTriangle className="w-3.5 h-3.5" /> Under Threshold
                        </span>
                      )}
                      {sub.riskStatus === 'CRITICAL' && (
                        <span className="text-[10px] font-bold text-red-400 bg-red-400/15 px-2.5 py-1 rounded-xl flex items-center gap-1 border border-red-500/25 font-mono uppercase">
                          <XCircle className="w-3.5 h-3.5" /> Block Warning
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Attendance Calculator */}
        {activeTab === 'CALCULATOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-sans">
            <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl space-y-6 font-sans">
              <div className="flex items-center gap-1.5 border-b border-[#1E293B] pb-3">
                <Calculator className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">AI Predictive Calculator</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider block font-mono">Select subject to simulated query</label>
                  <select
                    value={calculatorSubjectId}
                    onChange={(e) => setCalculatorSubjectId(e.target.value)}
                    className="w-full bg-[#0A0B10] border border-[#1E293B] rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-colors font-sans"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} ({sub.code}) — Current: {sub.attendancePct}%
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider block font-mono">Classes to Attend consecutive</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={attendNext}
                      onChange={(e) => setAttendNext(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#0A0B10] border border-[#1E293B] rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-colors font-sans"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider block font-mono">Planned Leaves / Absent Lectures</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={missNext}
                      onChange={(e) => setMissNext(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#0A0B10] border border-[#1E293B] rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-colors font-sans"
                    />
                  </div>
                </div>

                {/* Simulated Metrics Card */}
                <div className="p-4 rounded-2xl border border-[#1E293B] bg-[#0A0B10]/50 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] font-mono">Projected Outcome:</span>
                    <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-extrabold font-sans ${
                      simulation.projected >= 75 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {simulation.projected >= 75 ? 'ELgible for Exams' : 'Exam Disqualify Risk'}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 justify-around py-2">
                    <div className="text-center">
                      <span className="text-[9px] uppercase text-slate-500 font-semibold tracking-wider font-mono">Current Pct</span>
                      <div className="text-lg font-bold font-mono text-slate-400 mt-0.5">{simulation.current}%</div>
                    </div>
                    <ArrowForwardIcon className="w-5 h-5 text-indigo-400 animate-pulse shrink-0" />
                    <div className="text-center">
                      <span className="text-[9px] uppercase text-slate-500 font-semibold tracking-wider font-mono">Simulated Pct</span>
                      <div className={`text-2xl font-black font-mono mt-0.5 ${
                        simulation.projected >= 75 ? 'text-emerald-400' : 'text-red-400'
                      }`}>{simulation.projected}%</div>
                    </div>
                  </div>

                  {calcSubject && calcSubject.attendancePct < 75 && (
                    <div className="text-[11px] p-2.5 bg-indigo-900/15 text-indigo-300 rounded-xl border border-indigo-500/20 leading-relaxed font-sans">
                      💡 **Recovery Suggestion**: Your current attendance is {calcSubject.attendancePct}%. You need to attend **{simulation.classesNeeded}** check-in lectures back-to-back without leaving to reach the target 75% limit.
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Attendance Track Heatmap View */}
            <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl space-y-4">
              <div>
                <h3 className="text-sm font-semibold tracking-wide text-white font-sans">Attend status Heatmap</h3>
                <p className="text-[11px] text-slate-500 mt-1 font-sans">Simulated history of last 30 classes combined across CS syllabus</p>
              </div>

              <div className="grid grid-cols-7 gap-2 font-mono">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, index) => (
                  <div key={index} className="text-center text-[9px] text-slate-500 font-bold uppercase py-1 font-mono">{d}</div>
                ))}
                
                {calendarDays.map((d, index) => {
                  let colorClass = 'bg-[#0A0B10] border border-[#1E293B] text-slate-550';
                  if (d.status === 'PRESENT') colorClass = 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400';
                  if (d.status === 'ABSENT') colorClass = 'bg-red-500/15 border border-red-500/30 text-red-400';
                  if (d.status === 'LATE') colorClass = 'bg-amber-500/15 border border-amber-500/30 text-amber-450';

                  return (
                    <div
                      key={index}
                      className={`aspect-square max-w-[40px] flex items-center justify-center rounded-xl text-[10px] font-bold font-mono transition-transform hover:scale-105 ${colorClass}`}
                      title={`${d.status}`}
                    >
                      {d.day}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#1E293B] text-[9px] font-bold text-slate-400 uppercase font-sans">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-md bg-emerald-500/20 border border-emerald-500/40" /> Present (80%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-md bg-amber-500/15 border border-amber-500/30" /> Late arrived (10%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-md bg-red-500/15 border border-red-500/30" /> Absent (10%)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Timetable view */}
        {activeTab === 'TIMETABLE' && (
          <div className="space-y-6 font-sans">
            <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <button
                  key={day}
                  onClick={() => setTimetableDay(day)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                    timetableDay === day
                      ? 'bg-indigo-600 text-white font-extrabold shadow-lg shadow-indigo-650/15'
                      : 'bg-[#11131A] border border-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-[#0A0B10]'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="bg-[#11131A] border border-[#1E293B] rounded-3xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Clock className="w-4 h-4 text-indigo-400" /> Lectures on {timetableDay}
              </h3>

              <div className="space-y-4">
                {timetable.filter(p => p.day === timetableDay).length > 0 ? (
                  timetable.filter(p => p.day === timetableDay).map((p) => {
                    const mappedSubject = subjects.find(s => s.name === p.subjectName);
                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl bg-[#0A0B10]/40 border border-[#1E293B] hover:border-indigo-500/45 transition-all flex justify-between items-center"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold bg-[#0A0B10] text-indigo-300 px-2 py-0.5 rounded-md border border-[#1E293B] font-mono">
                              {p.code}
                            </span>
                            <span className="text-sm font-bold text-white">{p.subjectName}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" /> {p.time}
                            </span>
                            <span>·</span>
                            <span className="text-indigo-400 font-medium">Room {p.room}</span>
                          </div>
                        </div>

                        {/* Attendance level warning in this class */}
                        {mappedSubject && (
                          <div className="text-right">
                            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider font-mono">Attendance Pct</span>
                            <span className={`text-base font-bold font-mono ${
                              mappedSubject.attendancePct >= 75 ? 'text-emerald-400' : 'text-amber-400'
                            }`}>{mappedSubject.attendancePct}%</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 text-[#64748B] text-xs">No lectures scheduled today. Study session forecast.</div>
                )}
              </div>
            </div>

            {/* Holiday list card */}
            <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl">
              <h3 className="text-sm font-semibold tracking-wider text-white mb-3 uppercase">Upcoming Holidays & University Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {holidays.map((h) => (
                  <div key={h.id} className="p-3 bg-[#0A0B10]/30 border border-[#1E293B] rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{h.name}</h4>
                      <span className="text-[10px] font-mono text-slate-500">{h.date}</span>
                    </div>
                    <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-lg ${
                      h.type === 'PUBLIC' ? 'bg-indigo-500/10 text-indigo-300' : h.type === 'ACADEMIC' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-450'
                    }`}>
                      {h.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Notes Module */}
        {activeTab === 'NOTES' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
            
            {/* Create note card */}
            <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl space-y-4">
              <h3 className="text-sm font-semibold tracking-wide text-white uppercase">ADD REVISION NOTE</h3>
              <form onSubmit={handleCreateNote} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">Note Title</label>
                  <input
                    type="text"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    placeholder="e.g. SVM Formulas"
                    className="w-full bg-[#0A0B10] border border-[#1E293B] rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">Related Course Source</label>
                  <select
                    value={newNoteSubjectId}
                    onChange={(e) => setNewNoteSubjectId(e.target.value)}
                    className="w-full bg-[#0A0B10] border border-[#1E293B] rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-colors font-sans"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">Content Summary</label>
                  <textarea
                    rows={4}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Optimize equations before Thursday examination limits..."
                    className="w-full bg-[#0A0B10] border border-[#1E293B] rounded-2xl p-3 text-xs text-slate-200 outline-none resize-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  Create Revision Note
                </button>
              </form>
            </div>

            {/* Notes explorer list */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col md:flex-row gap-2 justify-between items-start md:items-center">
                <div className="relative w-full md:w-1/2">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={noteSearch}
                    onChange={(e) => setNoteSearch(e.target.value)}
                    placeholder="Search note tags..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#11131A] border border-[#1E293B] rounded-2xl text-xs text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={noteSubjectId}
                    onChange={(e) => setNoteSubjectId(e.target.value)}
                    className="bg-[#11131A] border border-[#1E293B] rounded-2xl p-2.5 text-xs text-slate-350 outline-none w-full focus:border-indigo-500 transition-colors"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid content list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => {
                    const relatedSubject = subjects.find(s => s.id === note.subjectId);
                    return (
                      <div
                        key={note.id}
                        className="p-4 bg-[#11131A] border border-[#1E293B] hover:border-indigo-500/40 rounded-2xl flex flex-col justify-between h-[180px] hover:shadow-lg hover:shadow-indigo-950/15 transition-all"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-indigo-450 uppercase font-mono tracking-wide">
                              {relatedSubject ? relatedSubject.code : 'UNMAPPED'}
                            </span>
                            <button
                              id={`delete-note-btn-${note.id}`}
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1 rounded-md text-slate-400 hover:bg-[#0A0B10] hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h4 className="text-xs font-extrabold text-white uppercase tracking-wide line-clamp-1">{note.title}</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3 font-sans">{note.content}</p>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono mt-2 block">{note.createdAt}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center py-10 text-slate-400 text-xs font-sans">No matching notes found. Try adjusting filter attributes.</div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Exams Screen */}
        {activeTab === 'EXAMS' && (
          <div className="space-y-6 font-sans">
            <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
                  <AlertTriangle className="w-4 h-4" /> Mitigating Circumstances Period
                </span>
                <h3 className="text-base font-bold text-white uppercase tracking-wide">Mid-Term Exams Looming</h3>
                <p className="text-xs text-slate-450 leading-relaxed">
                  Verify you meet the 75% baseline in all courses by Wednesday before roll rosters lock. Low attendance is flagged directly to proctors.
                </p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-center space-y-1">
                <span className="text-lg font-bold font-mono text-red-400">CS-405 Block Risk</span>
                <p className="text-[10px] text-slate-400">Automata (60%) is currently not eligible for paper registration.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {exams.map((exam) => (
                <div key={exam.id} className="p-4 bg-[#11131A] border border-[#1E293B] rounded-3xl flex flex-col justify-between h-[180px] hover:border-indigo-500/30 transition-colors">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-medium tracking-widest text-indigo-400 uppercase font-mono">UNIV WRITTEN EXAM</span>
                    <h4 className="text-xs font-bold text-white truncate">{exam.subjectName}</h4>
                    <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                      <div>Date: {exam.date}</div>
                      <div>Duration: {exam.duration}</div>
                      <div>Weightage: {exam.weight}% overall</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#1E293B] pt-3 mt-3">
                    <span className="text-[10px] text-slate-450 font-bold uppercase font-mono">Days Left</span>
                    <span className="text-2xl font-black font-mono text-amber-400">{exam.countdownDays}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Details */}
        {activeTab === 'PROFILE' && (
          <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl max-w-xl mx-auto space-y-6 font-sans">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-650/20">
                RK
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-white">Ravi Kumar</h4>
                <p className="text-xs text-slate-400">Section B, Computer Science Department</p>
                <span className="text-[11px] text-indigo-400 font-mono">Roll-number: 2026CS1042</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-[#1E293B] pt-4 text-xs">
              <div className="space-y-1 bg-[#0A0B10]/40 border border-[#1E293B] p-3 rounded-2xl">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold font-mono">Email address</span>
                <span className="text-slate-350 block font-mono">ravikumar@university.edu</span>
              </div>
              <div className="space-y-1 bg-[#0A0B10]/40 border border-[#1E293B] p-3 rounded-2xl">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold font-mono">Primary Contact</span>
                <span className="text-slate-350 block font-mono">+91 98765 04221</span>
              </div>
              <div className="space-y-1 bg-[#0A0B10]/40 border border-[#1E293B] p-3 rounded-2xl">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold font-mono">Local Auth Pin</span>
                <span className="text-slate-350 block font-mono">1042_VERIFIED_F_ID</span>
              </div>
              <div className="space-y-1 bg-[#0A0B10]/40 border border-[#1E293B] p-3 rounded-2xl">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold font-mono">Registration State</span>
                <span className="text-emerald-400 block font-bold font-sans">Autonomous Active Enrollment</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// Micro arrow component
function ArrowForwardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
