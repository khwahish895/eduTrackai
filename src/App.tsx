/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, Sparkles, LogOut, CheckCircle, Smartphone, 
  HelpCircle, Laptop, Bell, Landmark, User, Shield, GraduationCap 
} from 'lucide-react';

import { UserRole } from './types';
import { 
  mockSubjects, 
  mockLecturePeriods, 
  mockHolidays, 
  mockDefaultNotes, 
  mockExams, 
  mockStudents, 
  mockNotifications 
} from './data/mockData';

import StudentModule from './components/StudentModule';
import TeacherModule from './components/TeacherModule';
import AdminModule from './components/AdminModule';
import AiChatCompanion from './components/AiChatCompanion';

export default function App() {
  // Session Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);
  
  // Login input states
  const [emailText, setEmailText] = useState<string>('');
  const [passwordText, setPasswordText] = useState<string>('');
  const [biometricSetupActive, setBiometricSetupActive] = useState<boolean>(false);
  const [biometricSuccess, setBiometricSuccess] = useState<boolean>(false);
  
  // Interactive notifications state
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifPanel, setShowNotifPanel] = useState<boolean>(false);

  const getUnreadNotifCount = () => notifications.filter(n => !n.read).length;

  const markAllNotifRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleBiometricLogin = () => {
    setBiometricSetupActive(true);
    setTimeout(() => {
      setBiometricSuccess(true);
      setTimeout(() => {
        setIsAuthenticated(true);
        setBiometricSetupActive(false);
        setBiometricSuccess(false);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0B10] text-[#E2E8F0] flex flex-col font-sans transition-all duration-350 select-none antialiased">
      
      {/* Background radial effects */}
      <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-[#131130] to-transparent opacity-40 pointer-events-none" />
      <div className="absolute top-[20%] left-[20%] w-[250px] h-[250px] rounded-full bg-indigo-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute top-[50%] right-[10%] w-[350px] h-[350px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

      {/* Main App Bar - Visible only when logged in */}
      {isAuthenticated && (
        <header className="relative z-10 border-b border-[#1E293B] bg-[#11131A]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-650 flex items-center justify-center font-bold text-lg text-slate-100 shadow-md shadow-indigo-900/30">
                🤖
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
                  EduTrack AI
                  <span className="text-[10px] bg-indigo-500/10 border border-[#1E293B] text-indigo-400 rounded-full px-2.5 py-0.5 font-normal select-none">v1.2</span>
                </h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold font-mono">attendance platform</p>
              </div>
            </div>

            {/* Quick Portal Switcher & Account details */}
            <div className="flex items-center gap-4">
              
              {/* Role Quick Switcher badge */}
              <div className="bg-[#11131A]/60 p-1 rounded-2xl border border-[#1E293B] hidden sm:flex items-center gap-1">
                {[
                  { role: UserRole.STUDENT, label: 'Student', icon: GraduationCap },
                  { role: UserRole.TEACHER, label: 'Teacher', icon: User },
                  { role: UserRole.ADMIN, label: 'Super Admin', icon: Shield }
                ].map(r => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.role}
                      onClick={() => setSelectedRole(r.role)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
                        selectedRole === r.role
                          ? 'bg-indigo-600 text-[#E2E8F0]'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {r.label}
                    </button>
                  );
                })}
              </div>

              {/* Notification Popover Icon */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifPanel(!showNotifPanel)}
                  className="p-2.5 rounded-xl bg-[#11131A] border border-[#1E293B] hover:bg-slate-800/50 hover:text-white transition-colors cursor-pointer relative"
                >
                  <Bell className="w-4 h-4 text-slate-300" />
                  {getUnreadNotifCount() > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                  )}
                </button>

                {/* Dropdown panel */}
                <AnimatePresence>
                  {showNotifPanel && (
                    <div className="absolute right-0 mt-2 w-80 bg-[#11131A]/95 border border-[#1E293B] rounded-2xl p-4 shadow-xl shadow-slate-950/50 z-50 space-y-3 font-sans">
                      <div className="flex justify-between items-center border-b border-[#1E293B] pb-2.5">
                        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Alert Notifications</span>
                        <button
                          onClick={markAllNotifRead}
                          className="text-[10px] text-indigo-400 font-semibold hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      </div>
                      
                      <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl border text-[11px] leading-relaxed transition-all ${
                              n.read 
                                ? 'bg-[#0A0B10]/20 border-[#1E293B]/60 text-slate-400' 
                                : 'bg-indigo-950/15 border-indigo-900/30 text-slate-300'
                            }`}
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span>{n.title}</span>
                              <span className="text-[9px] font-mono font-normal text-slate-500">{n.time}</span>
                            </div>
                            <p className="mt-0.5 text-slate-400 font-normal">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Log out option */}
              <button
                onClick={() => setIsAuthenticated(false)}
                className="p-2.5 rounded-xl bg-[#11131A] border border-[#1E293B] text-slate-400 hover:text-red-400 hover:bg-slate-800/50 transition-colors cursor-pointer"
                title="Log out Session"
              >
                <LogOut className="w-4 h-4" />
              </button>

            </div>

          </div>
        </header>
      )}

      {/* Main Layout Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 flex flex-col justify-center">
        {!isAuthenticated ? (
          
          /* Authentication Screen Module (Mobile Style Frame) */
          <div className="max-w-md w-full mx-auto space-y-4">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-indigo-650 flex items-center justify-center font-bold text-2xl text-slate-100 shadow-lg shadow-indigo-950/50">
                🤖
              </div>
              <h2 className="text-xl font-extrabold text-white">AttendAI Login Securely</h2>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Smart Attendance Management System</p>
            </div>

            <div className="bg-[#11131A] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md space-y-6">
              
              {/* Role Selection Tabs */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-500 block tracking-wider font-mono">Select Access Role Profile</span>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0A0B10] border border-[#1E293B] rounded-2xl text-xs">
                  {[
                    { role: UserRole.STUDENT, name: 'Student' },
                    { role: UserRole.TEACHER, name: 'Teacher' },
                    { role: UserRole.ADMIN, name: 'Admin Portal' }
                  ].map(r => (
                    <button
                      key={r.role}
                      onClick={() => setSelectedRole(r.role)}
                      className={`py-2 rounded-xl text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
                        selectedRole === r.role
                          ? 'bg-indigo-600 border border-indigo-400 shadow-sm text-slate-100'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form entries */}
              <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Email Address</label>
                  <input
                    type="email"
                    value={emailText}
                    onChange={(e) => setEmailText(e.target.value)}
                    placeholder={
                      selectedRole === UserRole.STUDENT 
                        ? 'ravikumar@university.edu' 
                        : selectedRole === UserRole.TEACHER 
                        ? 'evelyn.harris@university.edu' 
                        : 'root.admin@university.edu'
                    }
                    className="w-full bg-[#0A0B10] border border-[#1E293B] rounded-2xl p-3 text-xs text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">Access PIN / Password</label>
                  <input
                    type="password"
                    value={passwordText}
                    onChange={(e) => setPasswordText(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0A0B10] border border-[#1E293B] rounded-2xl p-3 text-xs text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs tracking-wide rounded-2xl hover:scale-[1.01] transition-transform cursor-pointer shadow-lg shadow-indigo-950/20"
                  >
                    Enter Campus Portal
                  </button>
                </div>

                {/* Biometric trigger simulator */}
                <div className="relative border-t border-[#1E293B] pt-4 flex flex-col items-center gap-3">
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase font-mono">— OR —</span>
                  
                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    disabled={biometricSetupActive}
                    className="flex items-center gap-2 text-[11px] text-indigo-400 bg-indigo-500/10 hover:bg-slate-800 border border-indigo-500/20 px-4 py-2 rounded-xl transition-all cursor-pointer font-bold select-none disabled:opacity-50"
                  >
                    <Smartphone className="w-4 h-4 shrink-0 animate-pulse" />
                    Biometrics faceID login mock
                  </button>

                  {biometricSetupActive && (
                    <span className="text-[10px] text-indigo-400 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                      {biometricSuccess ? 'Verified Landmark matching! Redirecting...' : 'Scanning facial points biometrics (ArcFace v3)...'}
                    </span>
                  )}
                </div>

              </form>

            </div>
          </div>

        ) : (
          
          /* Dashboard Layout Views */
          <div className="space-y-6">
            
            {/* Header info bar */}
            <div className="bg-[#11131A] border border-[#1E293B] p-4 rounded-3xl flex justify-between items-center sm:flex-row flex-col gap-2 relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <span className="text-[11px] text-slate-400 flex items-center gap-1.5 uppercase font-bold tracking-widest leading-none font-mono">
                  Syllabus Session: active 2026 Quarter 2
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold">
                User: {selectedRole === UserRole.STUDENT ? 'Ravi Kumar (Student)' : selectedRole === UserRole.TEACHER ? 'Dr. Evelyn Harris (Faculty)' : 'Sarah Admin (Super Admin)'}
              </div>
            </div>

            {/* Sub router */}
            {selectedRole === UserRole.STUDENT && (
              <StudentModule
                subjects={mockSubjects}
                timetable={mockLecturePeriods}
                holidays={mockHolidays}
                initialNotes={mockDefaultNotes}
                exams={mockExams}
              />
            )}

            {selectedRole === UserRole.TEACHER && (
              <TeacherModule
                initialStudents={mockStudents}
                subjects={mockSubjects}
              />
            )}

            {selectedRole === UserRole.ADMIN && (
              <AdminModule
                initialStudents={mockStudents}
              />
            )}

          </div>
        )}
      </main>

      {/* Persistent Floating AI Assistant */}
      {isAuthenticated && (
        <AiChatCompanion 
          role={selectedRole} 
          currentSubjects={mockSubjects} 
        />
      )}

      {/* Footer System Credits */}
      <footer className="py-6 text-center border-t border-[#1E293B] relative z-10 text-[10px] text-slate-400 font-mono tracking-widest select-none uppercase">
        EduTrack AI · Built with Sleek Interface Theme
      </footer>

    </div>
  );
}
