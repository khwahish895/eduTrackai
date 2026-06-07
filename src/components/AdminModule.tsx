/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert, Settings, Database, Plus, MailOpen, UserCheck, 
  Trash2, Sliders, CheckCircle, Info, Landmark, HelpCircle, 
  Building, Shield, Users, RefreshCw
} from 'lucide-react';
import { StudentEnrollment } from '../types';
import SupabaseSchemaViewer from './SupabaseSchemaViewer';

interface AdminModuleProps {
  initialStudents: StudentEnrollment[];
}

interface TeacherRecord {
  id: string;
  name: string;
  employeeCode: string;
  department: string;
  email: string;
}

export default function AdminModule({
  initialStudents
}: AdminModuleProps) {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'USERS' | 'DEPARTMENTS' | 'DATABASE_DESIGN'>('DASHBOARD');
  
  // States
  const [students, setStudents] = useState<StudentEnrollment[]>(initialStudents);
  const [teachers, setTeachers] = useState<TeacherRecord[]>([
    { id: 't-1', name: 'Dr. Evelyn Harris', employeeCode: 'EMP_ML_101', department: 'CS & AI', email: 'evelyn.harris@university.edu' },
    { id: 't-2', name: 'Prof. Marcus Vance', employeeCode: 'EMP_DB_404', department: 'Information Systems', email: 'marcus.vance@university.edu' },
    { id: 't-3', name: 'Dr. Sarah Jenkins', employeeCode: 'EMP_SE_302', department: 'CS Engineering', email: 'sarah.jenkins@university.edu' }
  ]);

  // System Config thresholds
  const [minAttendanceThreshold, setMinAttendanceThreshold] = useState<number>(75);
  const [autoEmailAlerts, setAutoEmailAlerts] = useState<boolean>(true);
  const [twoFactorBiometrics, setTwoFactorBiometrics] = useState<boolean>(false);

  // Users add states
  const [newUserRole, setNewUserRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserCode, setNewUserCode] = useState<string>('');
  const [newDepartment, setNewDepartment] = useState<string>('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserCode.trim()) return;

    if (newUserRole === 'STUDENT') {
      const newStud: StudentEnrollment = {
        id: `st-${Date.now()}`,
        name: newUserName,
        roleNumber: newUserCode,
        avatarUrl: newUserName.split(' ').map(n => n[0]).join(''),
        overallAttendance: 85,
        status: 'SAFE',
        grade: 'A'
      };
      setStudents(prev => [newStud, ...prev]);
    } else {
      const newTeach: TeacherRecord = {
        id: `t-${Date.now()}`,
        name: newUserName,
        employeeCode: newUserCode,
        department: newDepartment || 'CS Engineering',
        email: `${newUserName.toLowerCase().replace(/\s+/g, '')}@university.edu`
      };
      setTeachers(prev => [newTeach, ...prev]);
    }

    setNewUserName('');
    setNewUserCode('');
    setNewDepartment('');
    alert('User created successfully in database.');
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleDeleteTeacher = (id: string) => {
    setTeachers(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Admin Nav Section */}
      <div className="flex flex-wrap gap-2 border-b border-[#1E293B] pb-4">
        {[
          { id: 'DASHBOARD', name: 'Systems Dashboard', icon: Shield },
          { id: 'USERS', name: 'Manage Directory Profiles', icon: Users },
          { id: 'DEPARTMENTS', name: 'Policy Threshold Rules', icon: Sliders },
          { id: 'DATABASE_DESIGN', name: 'Database SQL Blueprint', icon: Database }
        ].map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-indigo-600 text-[#E2E8F0] shadow-md shadow-indigo-950/20'
                  : 'bg-[#11131A] text-slate-400 hover:text-white border border-[#1E293B] hover:bg-slate-800/50'
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
            
            {/* Admin Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#11131A] border border-[#1E293B] p-5 rounded-3xl text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Total Enrolled Nodes</span>
                <span className="text-3xl font-extrabold font-mono text-white">{students.length + teachers.length}</span>
                <p className="text-[10px] text-slate-400">{students.length} Students · {teachers.length} Instructors</p>
              </div>
              <div className="bg-[#11131A] border border-[#1E293B] p-5 rounded-3xl text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Present Today Ratios</span>
                <span className="text-3xl font-extrabold font-mono text-indigo-400">92.4%</span>
                <p className="text-[10px] text-slate-400">Average across CS branch cohorts</p>
              </div>
              <div className="bg-[#11131A] border border-[#1E293B] p-5 rounded-3xl text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Avg Check-In Speed</span>
                <span className="text-3xl font-extrabold font-mono text-[#10B981]">182ms</span>
                <p className="text-[10px] text-slate-400">Local Face Recognition latency</p>
              </div>
              <div className="bg-[#11131A] border border-[#1E293B] p-5 rounded-3xl text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">Critical Warnings</span>
                <span className="text-3xl font-extrabold font-mono text-red-500">2 Block Risks</span>
                <p className="text-[10px] text-slate-400">Rosters marked low in examinations roster</p>
              </div>
            </div>

            {/* Warnings list */}
            <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse" />
                <h3 className="text-sm font-semibold tracking-wide text-amber-500 uppercase">Active Campus Security alerts</h3>
              </div>

              <div className="space-y-3.5 text-xs font-sans">
                <div className="p-3 bg-red-400/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-300">
                  <span>🚨</span>
                  <div>
                    <strong>GPS Spoof Attempt Blocked:</strong> Student roll CS1088 (Dev Patel) submitted check-in coordinates from a physical zone mismatch (3.2km difference). Bounded biometric canceled.
                  </div>
                </div>
                <div className="p-3 bg-[#0A0B10]/60 border border-[#1E293B] rounded-2xl flex gap-3 text-slate-300">
                  <span>📢</span>
                  <div>
                    <strong>Audit Complete:</strong> Overall campus databases synchronized successfully. No anomalies reported over the last 24h backup cycle.
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* User profile lists and creator tool */}
        {activeTab === 'USERS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Create form */}
            <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl space-y-4 h-fit font-sans">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide">ADD DIRECTORY PROFILE</h3>
              
              <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">Classification Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full bg-[#0A0B10] border border-[#1E293B] rounded-2xl p-3 text-xs text-slate-200 font-sans outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="STUDENT">Student Profile</option>
                    <option value="TEACHER">Teacher Profile</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">Full Name</label>
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="e.g. Dr. Jane Finch"
                    className="w-full bg-[#0A0B10] border border-[#1E293B] rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">
                    {newUserRole === 'STUDENT' ? 'Roll Number / Code' : 'Employee Registration Code'}
                  </label>
                  <input
                    type="text"
                    value={newUserCode}
                    onChange={(e) => setNewUserCode(e.target.value)}
                    placeholder="e.g. 2026CS1099"
                    className="w-full bg-[#0A0B10] border border-[#1E293B] rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>
                
                {newUserRole === 'TEACHER' && (
                  <div className="space-y-1 block">
                    <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">Department Assignment</label>
                    <input
                      type="text"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      placeholder="e.g. AI & Robotics Systems"
                      className="w-full bg-[#0A0B10] border border-[#1E293B] rounded-2xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs tracking-wide rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer"
                >
                  Create Profile
                </button>
              </form>
            </div>

            {/* List area split columns */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Students directory */}
              <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-sans">Student Directory</h3>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {students.map(s => (
                    <div key={s.id} className="p-3 bg-[#0A0B10]/40 border border-[#1E293B] rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[11px] text-slate-300">
                          {s.avatarUrl}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-200 block font-sans">{s.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{s.roleNumber}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-indigo-400">{s.overallAttendance}% Pct</span>
                        <button
                          onClick={() => handleDeleteStudent(s.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teachers directory */}
              <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl space-y-4">
                <h3 className="text-sm font-semibold tracking-wide text-white uppercase font-sans">Instructors Directory</h3>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {teachers.map(t => (
                    <div key={t.id} className="p-3 bg-[#0A0B10]/40 border border-[#1E293B] rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-200 block font-sans">{t.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{t.employeeCode} · {t.department}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDeleteTeacher(t.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Configurations thresholds settings */}
        {activeTab === 'DEPARTMENTS' && (
          <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl max-w-xl mx-auto space-y-6 animate-fade-in">
            <div className="space-y-1 border-b border-[#1E293B] pb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white uppercase font-sans">Global Campus Policy Rules</h3>
            </div>

            <div className="space-y-5 text-xs font-sans">
              
              {/* Slider for attendance minimum limit */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Minimum Attendance Threshold Required</label>
                  <span className="text-sm font-bold font-mono text-indigo-400">{minAttendanceThreshold}% Target</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="90"
                  value={minAttendanceThreshold}
                  onChange={(e) => setMinAttendanceThreshold(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">
                  The criteria target sets is standard boundary. Students below this value are flagged borderline warning; students under threshold block registration rules.
                </p>
              </div>

              {/* Auto email checks config toggle */}
              <div className="p-4 rounded-2xl border border-[#1E293B] bg-[#0A0B10]/40 space-y-4 font-sans">
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200">Auto Advisor Warning alerts</span>
                    <p className="text-[10px] text-slate-500 font-sans">E-mail warning is triggered to student profiles when attendance drops below the threshold limit.</p>
                  </div>
                  <button
                    onClick={() => setAutoEmailAlerts(!autoEmailAlerts)}
                    className={`w-10 h-6 rounded-full relative p-1 transition-colors cursor-pointer ${
                      autoEmailAlerts ? 'bg-indigo-600' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all ${
                      autoEmailAlerts ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between border-t border-[#1E293B] pt-4">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200">Strict Dual-Biometric Verification</span>
                    <p className="text-[10px] text-slate-500 font-sans">Requires successful Face recognition match BEFORE check-in GPS validation inside active geo-zones.</p>
                  </div>
                  <button
                    onClick={() => setTwoFactorBiometrics(!twoFactorBiometrics)}
                    className={`w-10 h-6 rounded-full relative p-1 transition-colors cursor-pointer ${
                      twoFactorBiometrics ? 'bg-indigo-600' : 'bg-slate-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all ${
                      twoFactorBiometrics ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

              </div>
              
              <div className="p-3.5 bg-indigo-900/15 border border-indigo-500/20 text-indigo-300 rounded-xl leading-relaxed">
                ℹ️ **Policies Deployment Notice**: Altering thresholds dynamically adjusts warning markers inside both Students and Faculty calendars instantly. Policy rule pushes to database logs completed.
              </div>

            </div>
          </div>
        )}

        {/* Supabase Schema Database Blueprint section */}
        {activeTab === 'DATABASE_DESIGN' && (
          <div className="space-y-4">
            <div className="bg-[#11131A] border border-[#1E293B] p-6 rounded-3xl space-y-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                <Database className="w-4 h-4 text-amber-500" /> Relational SQL Schema Setup
              </span>
              <h3 className="text-base font-bold text-slate-200">Supabase Backend Database Blueprint</h3>
              <p className="text-xs text-slate-450 leading-relaxed font-sans font-sans">
                Below is the structured tables schema specified for EduTrack AI. You can audit relational profiles, search dependencies, and copy the unified compilable PostgreSQL script directly to execute inside your Supabase queries editor!
              </p>
            </div>
            
            <SupabaseSchemaViewer />
          </div>
        )}
      </div>

    </div>
  );
}
