/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, Sparkles, X, ChevronRight, User, HelpCircle } from 'lucide-react';
import { Subject } from '../types';

interface AiChatCompanionProps {
  currentSubjects?: Subject[];
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function AiChatCompanion({ currentSubjects = [], role }: AiChatCompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init-1',
      sender: 'assistant',
      text: `Hello! I am EduTrack's AI Assistant. Accessing current academic metrics for user context. How can I help you support attendance target goals today?`,
      timestamp: '17:08 PM'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const getQuickPrompts = () => {
    if (role === 'STUDENT') {
      return [
        'How many leaves can I take in Machine Learning?',
        'Am I safe from compiler exam attendance block?',
        'Predict attendance after attending next 5 DBMS classes',
        'Generate study & attendance balance recovery plan'
      ];
    } else if (role === 'TEACHER') {
      return [
        'Who are high risk students in CS-405 Advanced Automata?',
        'Show attendance trends for Advanced Machine Learning',
        'Draft auto-email alert for students below 75%',
        'Identify students with high recovery potential'
      ];
    } else {
      return [
        'Predict next week overall department average',
        'Analyze any anomalous GPS check-in logs',
        'Summarize active attendance risk flags',
        'Optimize scheduling classes for high absenteeism'
      ];
    }
  };

  const getResponseForQuery = (query: string): string => {
    const q = query.toLowerCase();
    
    if (role === 'STUDENT') {
      if (q.includes('leave') || q.includes('how many')) {
        return `Based on Advanced Machine Learning (88%), you can stay absent for up to **2 more lectures** and still remain above the 75% limit. However, for Automata (60%), you must attend **at least 6 classes in a row** without a single leave to clear the academic restriction.`;
      }
      if (q.includes('compiler') || q.includes('automata') || q.includes('block')) {
        return `⚠️ **Automata & Compiler (CS-405)** attendance is at **60%** (15/25 lectures). The medical certificate you provided for June 1st is still pending check. You currently need to attend **all upcoming classes** this month to escape exam disqualification.`;
      }
      if (q.includes('predict') || q.includes('next 5')) {
        return `If you attend the next **5 consecutive Database classes**, your DBMS metric increases from **72% to 76.6%** (23/30 classes), shifting your status from **WARNING (borderline)** to **SAFE**. Highly recommended!`;
      }
      if (q.includes('recovery') || q.includes('plan')) {
        return `📊 **AI Recovery Plan for CS-405 Automata**:\n1. **Attend consecutive list**: No absences allowed for next 14 academic days.\n2. **Academic Support sessions**: Join Prof Gregory's Thursday peer clinic.\n3. **Substitute points**: Submit Assignment 3 extra-credit paper on automata theory to substitute 1 excused late check-in.`;
      }
      return `I analyzed your portfolio! Your overall campus attendance is 80%. You have excellent scores in Software Engineering (96%) but CS-405 Automata remains your primary bottleneck. Let me know if you would like me to map out a safe study-leave forecast spreadsheet.`;
    } else if (role === 'TEACHER') {
      if (q.includes('risk') || q.includes('who are')) {
        return `🚨 **High Risk Students (CS-405 Automata)**:\n• **Dev Patel (60%)** - Missing 5 consecutive lectures without active certificate. Recommended action: Request student-advisor counseling.\n• **Vikram Singh (63%)** - Borderline decline over past 3 weeks.\n• **Arjun Mehra (74%)** - Needs 1 more attendance to shift clear.`;
      }
      if (q.includes('trend')) {
        return `📈 **Machine Learning Trends**:\nOverall attendance is highly optimal at **88%** average. There is an minor absenteeism spike on Friday mornings (approx. 12% lower attendance). I recommend shifting weekly coding sprints peer-pair work to Friday morning sessions.`;
      }
      if (q.includes('email') || q.includes('draft')) {
        return `📝 **Draft Alert Template generated**:\n"Dear Student, This is an automated academic advisor alert. Our records indicate your attendance in CS-405 has reached critical levels (<75%). Accessing examination credentials requires immediate attendance recovery. Please contact Dr. Sarah's office."`;
      }
      return `AI analysis complete for your 10 active students! Average attendance is **81.2%**. Dev Patel exhibits high recovery potential if 1-on-1 tutoring is initiated before Friday midterms.`;
    } else {
      // ADMIN
      if (q.includes('anomal') || q.includes('gps') || q.includes('spoof')) {
        return `📍 **GPS Geo-fence Anomalies detected**:\n• Dev Patel logged check-in at 09:10 AM from coordinates 3.2km outside designated office circle.\n• Rahul S. logged 3 separate scans from distinct Wi-Fi nodes inside 2 hours. Potential VPN spoof flag. Recommended action: Audit face recognition landmarks.`;
      }
      if (q.includes('predict') || q.includes('average')) {
        return `🔮 **Forecast Summary**:\nCampus-wide attendance is predicted to rise **2.1%** next week due to post-exam project submissions. However, high absenteeism corresponds to wet weather forecasts for Thursday morning. Dynamic schedules sent to bus operators.`;
      }
      return `Super Admin statistics: Total enrolled 265, present today 247, average arrival time 08:47 AM, active anomalies flagged: 2. Smart optimization systems online.`;
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = {
      id: `m-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      const response = getResponseForQuery(text);
      setMessages(prev => [...prev, {
        id: `m-bot-${Date.now()}`,
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 600);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  return (
    <>
      {/* Floating Sparkle Button */}
      <motion.button
        id="ai-assistant-toggle"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-2xl shadow-xl shadow-indigo-650/15 font-medium cursor-pointer border border-indigo-500/20"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="text-sm tracking-wide font-sans">EduTrack AI Companion</span>
      </motion.button>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

            <motion.div
              id="ai-assistant-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-[#11131A] border-l border-[#1E293B] flex flex-col shadow-2xl z-10"
            >
              {/* Header */}
              <div className="p-4 border-b border-[#1E293B] bg-[#0A0B10] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-650/10">
                    <Sparkles className="w-5 h-5 text-indigo-150" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 font-sans">
                      EduTrack AI Engine
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal font-mono">Active</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 capitalize font-sans">Real-time {role.toLowerCase()} consulting</p>
                  </div>
                </div>
                <button
                  id="close-ai-assistant"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-[#11131A] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A0B10]/20">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender !== 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400 text-xs font-sans">
                        🤖
                      </div>
                    )}
                    <div className="max-w-[80%]">
                      <div
                        className={`p-3 rounded-2xl text-xs leading-relaxed font-sans ${
                          m.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-[#0A0B10] text-slate-300 border border-[#1E293B]/60 rounded-tl-none pr-4'
                        }`}
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {m.text}
                      </div>
                      <span className="text-[9px] text-slate-500 mt-1 block px-1 text-right font-mono">
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions Area */}
              <div className="p-3 bg-[#0A0B10]/40 border-t border-[#1E293B]">
                <p className="text-[10px] text-slate-400 font-semibold mb-2 flex items-center gap-1 font-sans">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  Quick queries:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {getQuickPrompts().map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(p)}
                      className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/15 px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer font-sans block w-full truncate relative group"
                    >
                      <span className="flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                        {p}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Input */}
              <form
                id="ai-chat-input-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputVal);
                }}
                className="p-4 bg-[#0A0B10] border-t border-[#1E293B] flex gap-2"
              >
                <input
                  id="ai-chat-text-input"
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask about attendance forecasts, safe leaves..."
                  className="flex-1 bg-[#11131A] border border-[#1E293B] rounded-xl px-3 py-2.5 text-xs text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-600 transition-colors font-sans"
                />
                <button
                  id="submit-ai-chat"
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md cursor-pointer disabled:opacity-40 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
