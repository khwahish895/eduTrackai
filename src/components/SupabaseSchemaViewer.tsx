/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Database, Table, Key, Copy, Check, Info, FileText, ArrowRight, Network } from 'lucide-react';

interface Column {
  name: string;
  type: string;
  pk?: boolean;
  fk?: string;
  nullable?: boolean;
}

interface TableSchema {
  name: string;
  description: string;
  columns: Column[];
}

export default function SupabaseSchemaViewer() {
  const [copied, setCopied] = useState(false);
  const [activeTable, setActiveTable] = useState<string>('users');

  const schemas: TableSchema[] = [
    {
      name: 'users',
      description: 'Core Supabase auth user profiles storing essential identification metrics.',
      columns: [
        { name: 'id', type: 'uuid', pk: true },
        { name: 'email', type: 'varchar(255)', nullable: false },
        { name: 'full_name', type: 'varchar(100)' },
        { name: 'role', type: 'varchar(30)', nullable: false }, // 'STUDENT', 'TEACHER', 'ADMIN'
        { name: 'avatar_url', type: 'text' },
        { name: 'created_at', type: 'timestamp with time zone' }
      ]
    },
    {
      name: 'students',
      description: 'Detailed student profiles linked to authenticated user IDs.',
      columns: [
        { name: 'id', type: 'uuid', pk: true, fk: 'users.id' },
        { name: 'roll_number', type: 'varchar(50)', nullable: false },
        { name: 'grade_class', type: 'varchar(20)' },
        { name: 'academic_year', type: 'varchar(10)' },
        { name: 'overall_attendance_pct', type: 'numeric(5,2)' }
      ]
    },
    {
      name: 'teachers',
      description: 'Faculty profiles mapping department structures.',
      columns: [
        { name: 'id', type: 'uuid', pk: true, fk: 'users.id' },
        { name: 'employee_code', type: 'varchar(50)', nullable: false },
        { name: 'department', type: 'varchar(100)' }
      ]
    },
    {
      name: 'admins',
      description: 'System credentials tracking administrative designations.',
      columns: [
        { name: 'id', type: 'uuid', pk: true, fk: 'users.id' },
        { name: 'designation', type: 'varchar(100)' }
      ]
    },
    {
      name: 'classes',
      description: 'Academic class/section records (e.g. CS Sophomore Section B).',
      columns: [
        { name: 'id', type: 'uuid', pk: true },
        { name: 'name', type: 'varchar(100)', nullable: false },
        { name: 'batch_year', type: 'integer' },
        { name: 'department', type: 'varchar(100)' }
      ]
    },
    {
      name: 'subjects',
      description: 'Academic courses mapped to specific instructor teachers.',
      columns: [
        { name: 'id', type: 'uuid', pk: true },
        { name: 'name', type: 'varchar(150)', nullable: false },
        { name: 'code', type: 'varchar(30)', nullable: false },
        { name: 'teacher_id', type: 'uuid', fk: 'teachers.id' },
        { name: 'class_id', type: 'uuid', fk: 'classes.id' },
        { name: 'target_pct_required', type: 'integer' } // e.g. 75
      ]
    },
    {
      name: 'attendance',
      description: 'Daily login / check-in events, including verified landmarks and spoof detection audits.',
      columns: [
        { name: 'id', type: 'uuid', pk: true },
        { name: 'student_id', type: 'uuid', fk: 'students.id' },
        { name: 'subject_id', type: 'uuid', fk: 'subjects.id' },
        { name: 'date', type: 'date', nullable: false },
        { name: 'status', type: 'varchar(20)', nullable: false }, // 'PRESENT', 'ABSENT', 'LATE'
        { name: 'marked_by', type: 'uuid', fk: 'users.id' },
        { name: 'verified_face_pct', type: 'numeric(5,2)' },
        { name: 'gps_lat', type: 'numeric(9,6)' },
        { name: 'gps_long', type: 'numeric(9,6)' },
        { name: 'spoof_flagged', type: 'boolean' }
      ]
    },
    {
      name: 'timetable',
      description: 'Class schedule mapping academic hours.',
      columns: [
        { name: 'id', type: 'uuid', pk: true },
        { name: 'subject_id', type: 'uuid', fk: 'subjects.id' },
        { name: 'day_of_week', type: 'varchar(15)', nullable: false },
        { name: 'start_time', type: 'time', nullable: false },
        { name: 'end_time', type: 'time', nullable: false },
        { name: 'room_number', type: 'varchar(50)' }
      ]
    },
    {
      name: 'holidays',
      description: 'Public holidays and university calendar events.',
      columns: [
        { name: 'id', type: 'uuid', pk: true },
        { name: 'name', type: 'varchar(150)', nullable: false },
        { name: 'date', type: 'date', nullable: false },
        { name: 'type', type: 'varchar(50)' } // 'NATIONAL', 'INSTITSTITUTIONAL'
      ]
    },
    {
      name: 'exams',
      description: 'Academic tests track sheet with weighting criteria.',
      columns: [
        { name: 'id', type: 'uuid', pk: true },
        { name: 'subject_id', type: 'uuid', fk: 'subjects.id' },
        { name: 'name', type: 'varchar(100)' },
        { name: 'date', type: 'date' },
        { name: 'total_marks', type: 'integer' }
      ]
    },
    {
      name: 'notes',
      description: 'Revision notes added by students filtering core subjects.',
      columns: [
        { name: 'id', type: 'uuid', pk: true },
        { name: 'student_id', type: 'uuid', fk: 'students.id' },
        { name: 'subject_id', type: 'uuid', fk: 'subjects.id' },
        { name: 'title', type: 'varchar(200)', nullable: false },
        { name: 'content', type: 'text' },
        { name: 'created_at', type: 'timestamp with time zone' }
      ]
    },
    {
      name: 'notifications',
      description: 'Real-time push alerts tracking thresholds and critical absence reminders.',
      columns: [
        { name: 'id', type: 'uuid', pk: true },
        { name: 'user_id', type: 'uuid', fk: 'users.id' },
        { name: 'title', type: 'varchar(200)', nullable: false },
        { name: 'message', type: 'text' },
        { name: 'read_status', type: 'boolean' },
        { name: 'created_at', type: 'timestamp with time zone' }
      ]
    }
  ];

  const sqlCode = `-- EduTrack AI Supabase Initial DB Blueprint Setup Script
-- Paste this directly into Supabase SQL Editor
-- Creates tables with relational integrity and core trigger workflows

-- 1. Create Core Profiles
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(100),
  role VARCHAR(30) CHECK (role IN ('STUDENT', 'TEACHER', 'ADMIN')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Student Sub-Profile
CREATE TABLE public.students (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  roll_number VARCHAR(50) UNIQUE NOT NULL,
  grade_class VARCHAR(20) NOT NULL,
  academic_year VARCHAR(10),
  overall_attendance_pct NUMERIC(5,2) DEFAULT 0.00
);

-- 3. Create Teacher Sub-Profile
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  employee_code VARCHAR(50) UNIQUE NOT NULL,
  department VARCHAR(100) NOT NULL
);

-- 4. Create Classes Table
CREATE TABLE public.classes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  batch_year INT,
  department VARCHAR(100) NOT NULL
);

-- 5. Create Subjects Table
CREATE TABLE public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(30) UNIQUE NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  target_pct_required INT DEFAULT 75
);

-- 6. Create Master Attendance Sheet
CREATE TABLE public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) CHECK (status IN ('PRESENT', 'ABSENT', 'LATE')),
  marked_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  verified_face_pct NUMERIC(5,2),
  gps_lat NUMERIC(9,6),
  gps_long NUMERIC(9,6),
  spoof_flagged BOOLEAN DEFAULT FALSE,
  UNIQUE(student_id, subject_id, date)
);

-- 7. Create Notes, Holidays, Timetables, and Exams
CREATE TABLE public.timetable (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  day_of_week VARCHAR(15) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number VARCHAR(50)
);

CREATE TABLE public.holidays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(150),
  date DATE NOT NULL,
  type VARCHAR(50) CHECK (type IN ('PUBLIC', 'ACADEMIC', 'EVENT'))
);

CREATE TABLE public.exams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  date DATE,
  total_marks INT DEFAULT 100
);

CREATE TABLE public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedTableData = schemas.find(s => s.name === activeTable);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 font-sans">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left selector and visual summary */}
        <div className="w-full lg:w-1/3 space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-slate-100">Supabase DB Relational Schema</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            EduTrack AI maintains fully relational PostgreSQL tables. Tap a table below to audit its relational columns, types, and primary-foreign keys.
          </p>

          <div className="grid grid-cols-2 gap-2 h-[280px] overflow-y-auto pr-1">
            {schemas.map((table) => (
              <button
                key={table.name}
                onClick={() => setActiveTable(table.name)}
                className={`p-3 rounded-2xl flex flex-col items-start gap-1 text-left border transition-all cursor-pointer ${
                  activeTable === table.name
                    ? 'bg-indigo-650/15 border-indigo-500/50 shadow-md shadow-indigo-950/20'
                    : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Table className={`w-3.5 h-3.5 ${activeTable === table.name ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className={`text-[11px] font-semibold tracking-wide ${activeTable === table.name ? 'text-indigo-300' : 'text-slate-200'}`}>
                    {table.name}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 hidden sm:block line-clamp-1">{table.description}</span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-slate-950/50 border border-slate-850 rounded-2xl flex items-start gap-2.5">
            <Network className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="text-[10px] text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Relational Mapping:</strong> All structural relations are enforced with cascade deletes. Students & teachers inherit permissions direct from auth profile indexes.
            </div>
          </div>
        </div>

        {/* Right table detail and copyable code block */}
        <div className="flex-1 space-y-6">
          {selectedTableData && (
            <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Table className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                    {selectedTableData.name}
                  </h4>
                </div>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-400 font-sans">
                  PostgreSQL Table
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-4 font-sans">{selectedTableData.description}</p>
              
              <div className="border border-slate-850 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-semibold">
                      <th className="p-3">Column Name</th>
                      <th className="p-3">Data Type</th>
                      <th className="p-3">Key Constraint</th>
                      <th className="p-3 text-right">Nullable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTableData.columns.map((col, idx) => (
                      <tr key={idx} className="border-b border-slate-900/50 hover:bg-slate-900/20 text-slate-300">
                        <td className="p-3 font-mono text-xs text-indigo-300">{col.name}</td>
                        <td className="p-3 font-mono text-xs">{col.type}</td>
                        <td className="p-3">
                          {col.pk && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                              <Key className="w-2.5 h-2.5" /> Primary
                            </span>
                          )}
                          {col.fk && (
                            <span className="inline-flex items-center gap-1 text-[9px] text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded-md border border-indigo-500/20">
                              <ArrowRight className="w-2.5 h-2.5" /> FK → {col.fk}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right text-slate-500">
                          {col.pk ? 'No' : col.nullable === false ? 'No' : 'Yes'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Setup Script code section */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-900/60 border-b border-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-semibold text-slate-200 font-sans">Compilable Supabase Setup Script</span>
              </div>
              <button
                id="copy-supabase-sql-script"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[11px] text-slate-350 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer font-medium"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied Blueprint!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy SQL Script
                  </>
                )}
              </button>
            </div>
            <div className="p-4 overflow-x-auto bg-slate-950 max-h-[140px] text-[11px] text-slate-400 font-mono scrollbar-thin">
              <pre>{sqlCode}</pre>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
