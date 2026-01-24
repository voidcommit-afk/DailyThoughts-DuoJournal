'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CalendarPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const formatDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase();
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    return (
        <>
            <header className="flex-none sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md px-6 py-4 border-b border-slate-800">
                <h2 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">{formatDate()}</h2>
                <Link href="/dashboard" className="block focus:outline-none hover:opacity-80 transition-opacity">
                    <h1 className="font-serif text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">DailyThoughts</h1>
                </Link>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-40 lg:pb-12 no-scrollbar">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="glass-panel rounded-[32px] p-6 sm:p-8"
                >
                    <div className="flex justify-between items-center mb-6">
                        <span className="font-serif text-xl font-bold">{monthYear}</span>
                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={goToPreviousMonth}
                                className="p-2 rounded-lg hover:bg-slate-800 transition"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={goToNextMonth}
                                className="p-2 rounded-lg hover:bg-slate-800 transition"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </motion.button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-3 mb-6">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <div key={i} className="text-center text-[10px] font-bold text-slate-400 uppercase">{day}</div>
                        ))}

                        {days.map((day, i) => (
                            <div key={i} className="aspect-square">
                                {day ? (
                                    <div
                                        className={`w-full h-full rounded-xl flex items-center justify-center font-handwriting text-lg transition cursor-pointer ${day === 2 ? 'day-user hover:scale-110' :
                                            day === 3 ? 'day-partner hover:scale-110' :
                                                day === 4 ? 'day-both hover:scale-110' :
                                                    'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            }`}
                                    >
                                        {day}
                                    </div>
                                ) : (
                                    <div className="w-full h-full" />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-rose-900" />
                            You
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-indigo-900" />
                            Partner
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-900 to-indigo-900" />
                            Both
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .glass-panel {
                    background: rgba(15, 23, 42, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .font-handwriting {
                    font-family: 'Caveat', cursive;
                }
                .day-user {
                    background-color: #881337;
                    color: #ffe4e6;
                }
                .day-partner {
                    background-color: #312e81;
                    color: #e0e7ff;
                }
                .day-both {
                    background: linear-gradient(135deg, #881337 50%, #312e81 50%);
                    color: #fff;
                }
            `}</style>
        </>
    );
}
