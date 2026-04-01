'use client';

import { useEffect, useState } from 'react';
import CoursePlayer from './CoursePlayer';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import {
    BookOpen, PlayCircle, CheckCircle, Lock, ChevronRight, ChevronDown,
    Star, Trophy, Zap, TrendingUp, BarChart2, Shield, Globe, DollarSign,
    PieChart, Activity, Target, ArrowRight, Clock, Users, Award, Lightbulb,
    Calculator, BookMarked, GraduationCap, Layers, Flame
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

/* ─── Data ──────────────────────────────────────────────────────────── */

const TRACKS = [
    {
        id: 'beginner',
        label: 'Beginner',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/20',
        badge: 'bg-emerald-500/20 text-emerald-400',
        icon: Lightbulb,
        desc: 'Zero to basics — start your financial journey',
        modules: 6,
        hours: '4h 30m',
    },
    {
        id: 'intermediate',
        label: 'Intermediate',
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border-blue-500/20',
        badge: 'bg-blue-500/20 text-blue-400',
        icon: Layers,
        desc: 'Deepen your understanding of markets and instruments',
        modules: 8,
        hours: '7h 15m',
    },
    {
        id: 'advanced',
        label: 'Advanced',
        color: 'text-violet-400',
        bg: 'bg-violet-500/10 border-violet-500/20',
        badge: 'bg-violet-500/20 text-violet-400',
        icon: Flame,
        desc: 'Options, derivatives, macro & global markets',
        modules: 7,
        hours: '9h 00m',
    },
];

type TrackId = 'beginner' | 'intermediate' | 'advanced';

const COURSES: Record<TrackId, {
    id: string; title: string; desc: string; lessons: number; duration: string;
    icon: React.ElementType; color: string; locked: boolean; progress: number;
    tags: string[];
}[]> = {
    beginner: [
        { id: 'b1', title: 'What is the Stock Market?', desc: 'Understand how stock markets work, who the participants are, and why stock prices move.', lessons: 5, duration: '35m', icon: BarChart2, color: 'text-emerald-400', locked: false, progress: 100, tags: ['Stocks', 'Basics'] },
        { id: 'b2', title: 'How to Read a Stock Quote', desc: 'Bid, ask, volume, 52-week highs — decode every number on a stock ticker.', lessons: 4, duration: '28m', icon: Activity, color: 'text-emerald-400', locked: false, progress: 75, tags: ['Stocks', 'Reading Data'] },
        { id: 'b3', title: 'Investing vs Trading', desc: 'Learn the key differences, risk profiles, and time horizons of investing and trading.', lessons: 4, duration: '30m', icon: Target, color: 'text-emerald-400', locked: false, progress: 40, tags: ['Strategy', 'Basics'] },
        { id: 'b4', title: 'Understanding Mutual Funds & ETFs', desc: 'Discover how to invest in baskets of stocks and bonds with a single click.', lessons: 6, duration: '42m', icon: PieChart, color: 'text-emerald-400', locked: false, progress: 0, tags: ['Funds', 'Diversification'] },
        { id: 'b5', title: 'Risk & Reward Basics', desc: 'How to think about risk, what volatility means, and how to size your positions.', lessons: 5, duration: '38m', icon: Shield, color: 'text-emerald-400', locked: false, progress: 0, tags: ['Risk', 'Basics'] },
        { id: 'b6', title: 'Opening Your First Account', desc: 'Step-by-step — choosing a broker, KYC, account types, and placing your first order.', lessons: 4, duration: '27m', icon: DollarSign, color: 'text-emerald-400', locked: false, progress: 0, tags: ['Practical', 'Basics'] },
    ],
    intermediate: [
        { id: 'i1', title: 'Technical Analysis 101', desc: 'Support, resistance, chart patterns, and how to use them to time entries and exits.', lessons: 8, duration: '65m', icon: TrendingUp, color: 'text-blue-400', locked: false, progress: 60, tags: ['Technical', 'Charts'] },
        { id: 'i2', title: 'Candlestick Patterns Deep Dive', desc: 'Doji, hammer, engulfing — 20 key candlestick formations traders rely on daily.', lessons: 7, duration: '55m', icon: BarChart2, color: 'text-blue-400', locked: false, progress: 0, tags: ['Technical', 'Patterns'] },
        { id: 'i3', title: 'Fundamental Analysis', desc: 'Reading P&L statements, balance sheets, and key ratios: P/E, EPS, ROE, D/E.', lessons: 9, duration: '72m', icon: BookMarked, color: 'text-blue-400', locked: false, progress: 0, tags: ['Fundamental', 'Valuation'] },
        { id: 'i4', title: 'Moving Averages & Momentum', desc: 'SMA, EMA, MACD, RSI — the indicators every active trader must master.', lessons: 6, duration: '50m', icon: Activity, color: 'text-blue-400', locked: true, progress: 0, tags: ['Indicators', 'Technical'] },
        { id: 'i5', title: 'Portfolio Construction', desc: 'Modern Portfolio Theory, correlation, asset allocation, and diversification strategies.', lessons: 7, duration: '58m', icon: PieChart, color: 'text-blue-400', locked: true, progress: 0, tags: ['Portfolio', 'Strategy'] },
        { id: 'i6', title: 'Understanding Bonds & Fixed Income', desc: 'Yield curves, duration, credit ratings — and why bonds move opposite to rates.', lessons: 6, duration: '48m', icon: Shield, color: 'text-blue-400', locked: true, progress: 0, tags: ['Bonds', 'Fixed Income'] },
        { id: 'i7', title: 'Forex & Currency Markets', desc: 'How currency pairs work, pip values, carry trade, and macroeconomic drivers.', lessons: 7, duration: '55m', icon: Globe, color: 'text-blue-400', locked: true, progress: 0, tags: ['Forex', 'Macro'] },
        { id: 'i8', title: 'Tax Efficiency in Investing', desc: 'LTCG, STCG, tax-loss harvesting — keep more of what you earn.', lessons: 5, duration: '38m', icon: Calculator, color: 'text-blue-400', locked: true, progress: 0, tags: ['Tax', 'Practical'] },
    ],
    advanced: [
        { id: 'a1', title: 'Options — Calls & Puts', desc: 'Understand premiums, strike prices, expiry, and the Greeks: Delta, Gamma, Theta, Vega.', lessons: 10, duration: '85m', icon: Zap, color: 'text-violet-400', locked: true, progress: 0, tags: ['Options', 'Derivatives'] },
        { id: 'a2', title: 'Options Strategies', desc: 'Covered calls, straddles, strangles, iron condors — 12 strategies with real P&L diagrams.', lessons: 12, duration: '95m', icon: Target, color: 'text-violet-400', locked: true, progress: 0, tags: ['Options', 'Strategy'] },
        { id: 'a3', title: 'Futures & Commodities', desc: 'Crude oil, gold, index futures — how futures contracts work and who uses them.', lessons: 8, duration: '65m', icon: TrendingUp, color: 'text-violet-400', locked: true, progress: 0, tags: ['Futures', 'Commodities'] },
        { id: 'a4', title: 'Macro Economics for Traders', desc: 'GDP, inflation, interest rates, Central Bank policy — and how they move markets.', lessons: 9, duration: '78m', icon: Globe, color: 'text-violet-400', locked: true, progress: 0, tags: ['Macro', 'Economics'] },
        { id: 'a5', title: 'Quantitative Trading Foundations', desc: 'Backtesting, mean reversion, momentum strategies, and intro to algo trading.', lessons: 10, duration: '82m', icon: Calculator, color: 'text-violet-400', locked: true, progress: 0, tags: ['Quant', 'Algorithm'] },
        { id: 'a6', title: 'Risk Management Mastery', desc: 'Kelly Criterion, VaR, drawdown control, position sizing frameworks used by hedge funds.', lessons: 7, duration: '60m', icon: Shield, color: 'text-violet-400', locked: true, progress: 0, tags: ['Risk', 'Advanced'] },
        { id: 'a7', title: 'Crypto & DeFi Markets', desc: 'Bitcoin, Ethereum, stablecoins, on-chain analysis, and decentralised finance protocols.', lessons: 8, duration: '68m', icon: Activity, color: 'text-violet-400', locked: true, progress: 0, tags: ['Crypto', 'DeFi'] },
    ],
};

const GLOSSARY = [
    { term: 'Bull Market', def: 'A market condition where prices are rising or expected to rise, typically by 20%+ from recent lows.' },
    { term: 'Bear Market', def: 'A market condition where prices fall 20%+ from recent highs, often accompanied by widespread pessimism.' },
    { term: 'P/E Ratio', def: 'Price-to-Earnings ratio. Measures how much investors pay per ₹1 of earnings. Lower can mean undervalued.' },
    { term: 'Market Cap', def: 'Total market value of a company = share price × total shares outstanding.' },
    { term: 'Liquidity', def: 'How easily an asset can be bought or sold without affecting its price.' },
    { term: 'Volatility', def: 'The degree of price variation over time. High volatility = higher risk and potential reward.' },
    { term: 'Dividend Yield', def: 'Annual dividend per share divided by the share price, expressed as a percentage.' },
    { term: 'Short Selling', def: 'Borrowing and selling a stock you don\'t own, hoping to buy it back cheaper later.' },
    { term: 'Blue Chip', def: 'Shares of large, well-established, financially stable companies with a long track record.' },
    { term: 'IPO', def: 'Initial Public Offering — when a private company offers its shares to the public for the first time.' },
    { term: 'Circuit Breaker', def: 'A market mechanism that temporarily halts trading when prices fall too sharply (e.g., 5%, 10%).' },
    { term: 'CAGR', def: 'Compound Annual Growth Rate — the mean annual growth rate of an investment over a specified time.' },
];

const FAQS = [
    { q: 'How much money do I need to start investing?', a: 'You can start with as little as ₹500–₹1,000 using mutual funds or fractional shares. The key is to start early and invest consistently.' },
    { q: 'What is the safest investment for a beginner?', a: 'Index funds and large-cap ETFs are often recommended for beginners as they offer instant diversification with lower risk than individual stocks.' },
    { q: 'How long does it take to learn trading?', a: 'Grasping the basics takes a few weeks. Becoming consistently profitable typically requires 1–2 years of learning, paper trading, and real experience.' },
    { q: 'What is the difference between NSE and BSE?', a: 'NSE (National Stock Exchange) and BSE (Bombay Stock Exchange) are India\'s two main stock exchanges. NSE is higher in volume; both list the same major companies.' },
    { q: 'Is trading better than long-term investing?', a: 'Not necessarily — 90%+ of beginner traders lose money. Long-term investing in diversified portfolios historically outperforms most active trading strategies.' },
];

/* ─── Sub-components ────────────────────────────────────────────────── */

const ProgressRing = ({ pct, color }: { pct: number; color: string }) => {
    const r = 20, circ = 2 * Math.PI * r;
    return (
        <svg width="52" height="52" className="-rotate-90">
            <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4"
                strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
                strokeLinecap="round" className="transition-all duration-700" />
        </svg>
    );
};

const CourseCard = ({ course, trackColor, onClick }: { course: typeof COURSES['beginner'][0]; trackColor: string; onClick: () => void }) => {
    const Icon = course.icon;
    return (
        <motion.div variants={fadeUp} onClick={onClick}
            className={`relative flex gap-4 p-4 rounded-2xl bg-[#0b1120] border transition-all group cursor-pointer ${course.locked ? 'border-slate-800/40 opacity-70 hover:opacity-90' : 'border-slate-800/60 hover:border-slate-700'}`}>
            {course.locked && (
                <div className="absolute top-3 right-3">
                    <Lock size={13} className="text-slate-600" />
                </div>
            )}
            {/* Progress ring */}
            <div className="relative shrink-0 flex items-center justify-center">
                <ProgressRing pct={course.progress} color={trackColor} />
                <div className="absolute">
                    {course.progress === 100
                        ? <CheckCircle size={16} className="text-emerald-400" />
                        : <Icon size={14} className={course.color} />}
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-[13px] font-bold text-white leading-snug group-hover:text-amber-300 transition-colors">{course.title}</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-2 line-clamp-2">{course.desc}</p>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                    {course.tags.map(t => (
                        <span key={t} className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700/50">{t}</span>
                    ))}
                    <span className="text-[10px] text-slate-600 flex items-center gap-1"><Clock size={10} />{course.duration}</span>
                    <span className="text-[10px] text-slate-600 flex items-center gap-1"><BookOpen size={10} />{course.lessons}L</span>
                </div>
                {/* progress bar */}
                {!course.locked && course.progress > 0 && (
                    <div className="mt-2.5 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full"
                            style={{ background: trackColor }}
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

/* ─── Main Component ─────────────────────────────────────────────────── */

const LearningHub = () => {
    const { trackActivity } = useAuth();
    const [activeTrack, setActiveTrack] = useState<TrackId>('beginner');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [glossarySearch, setGlossarySearch] = useState('');
    const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

    useEffect(() => {
        void trackActivity('learning_track_viewed', { track: activeTrack });
    }, [activeTrack, trackActivity]);

    const handleCourseOpen = (courseId: string) => {
        setActiveCourseId(courseId);
        void trackActivity('learning_course_opened', { courseId, track: activeTrack });
    };

    // Show full course player when a course is selected
    if (activeCourseId) {
        const course = COURSES[activeTrack].find(c => c.id === activeCourseId);
        return (
            <CoursePlayer
                courseId={activeCourseId}
                initialProgress={course?.progress ?? 0}
                onBack={() => {
                    void trackActivity('learning_course_closed', { courseId: activeCourseId, track: activeTrack });
                    setActiveCourseId(null);
                }}
            />
        );
    }

    const trackCfg = TRACKS.find(t => t.id === activeTrack)!;
    const trackColorHex = activeTrack === 'beginner' ? '#10b981' : activeTrack === 'intermediate' ? '#3b82f6' : '#8b5cf6';
    const courses = COURSES[activeTrack];

    const filteredGlossary = GLOSSARY.filter(g =>
        g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        g.def.toLowerCase().includes(glossarySearch.toLowerCase())
    );

    return (
        <section className="min-h-screen bg-[#070d1a] relative overflow-hidden py-10 sm:py-14 md:py-20 lg:py-24 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
            {/* bg glows */}
            <div className="pointer-events-none absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
            <div className="pointer-events-none absolute bottom-0 right-1/4 w-[500px] h-[400px] rounded-full blur-3xl opacity-15" style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />

            <div className="w-full max-w-7xl mx-auto relative">

                {/* ── Hero ── */}
                <motion.div variants={stagger} initial="hidden" animate="show" className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16">
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                        <GraduationCap size={14} className="text-blue-400" />
                        <span className="text-[11px] font-black text-blue-400 uppercase tracking-widest">FinMind Learning Hub</span>
                    </motion.div>
                    <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 md:mb-5 leading-tight">
                        Master <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">Finance</span>
                        <br className="hidden md:block" /> from the Ground Up
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10">
                        Structured learning paths from absolute beginner to advanced trader — built for the Indian market, explained in plain English.
                    </motion.p>
                    {/* Stats strip */}
                    <motion.div variants={fadeUp} className="grid grid-cols-2 min-[420px]:grid-cols-4 justify-items-center gap-3 sm:gap-6">
                        {[
                            { icon: BookOpen,  val: '21',    label: 'Courses'      },
                            { icon: PlayCircle,val: '180+',  label: 'Video Lessons'},
                            { icon: Users,     val: '12,400',label: 'Learners'     },
                            { icon: Award,     val: '3',     label: 'Certificates' },
                        ].map(s => (
                            <div key={s.label} className="flex items-center gap-1.5 sm:gap-2">
                                <s.icon size={13} className="text-amber-400 shrink-0" />
                                <span className="text-white font-extrabold text-sm sm:text-base">{s.val}</span>
                                <span className="text-slate-500 text-xs sm:text-sm">{s.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* ── Track selector ── */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-8 sm:mb-10">
                    {TRACKS.map(t => {
                        const TIcon = t.icon;
                        const active = t.id === activeTrack;
                        return (
                            <button key={t.id} onClick={() => setActiveTrack(t.id as TrackId)}
                                className={`flex-1 flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl border transition-all text-left ${active ? t.bg + ' shadow-lg' : 'bg-[#0b1120] border-slate-800/50 hover:border-slate-700'}`}>
                                <div className={`p-2 sm:p-2.5 rounded-xl border shrink-0 ${active ? t.bg : 'bg-slate-800/40 border-slate-700/30'}`}>
                                    <TIcon size={14} className={active ? t.color : 'text-slate-500'} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className={`text-[11px] sm:text-[12px] font-black uppercase tracking-wider truncate ${active ? t.color : 'text-slate-400'}`}>{t.label}</div>
                                    <div className="text-[9px] sm:text-[10px] text-slate-600 mt-0.5">{t.modules} modules · {t.hours}</div>
                                </div>
                                {active && <ChevronRight size={12} className={`ml-auto shrink-0 ${t.color}`} />}
                            </button>
                        );
                    })}
                </div>

                {/* ── Course grid ── */}
                <motion.div key={activeTrack} variants={stagger} initial="hidden" animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-12 sm:mb-14 md:mb-16 lg:mb-20">
                    {courses.map(c => <CourseCard key={c.id} course={c} trackColor={trackColorHex} onClick={() => handleCourseOpen(c.id)} />)}
                </motion.div>

                {/* ── Financial Glossary ── */}
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="mb-16">
                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-white mb-1">Financial Glossary</h2>
                            <p className="text-slate-500 text-xs sm:text-sm">Quick-reference definitions for every term you&apos;ll encounter</p>
                        </div>
                        <input
                            placeholder="Search terms…"
                            value={glossarySearch}
                            onChange={e => setGlossarySearch(e.target.value)}
                            className="w-full sm:w-48 px-3 py-2 rounded-xl bg-[#0b1120] border border-slate-800 text-slate-300 text-[12px] placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                        />
                    </motion.div>
                    <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                        {filteredGlossary.map(g => (
                            <div key={g.term} className="p-4 rounded-2xl bg-[#0b1120] border border-slate-800/60 hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <Star size={11} className="text-amber-400 shrink-0" />
                                    <span className="text-[12px] font-black text-amber-300">{g.term}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed">{g.def}</p>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* ── FAQ ── */}
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} className="mb-16">
                    <motion.div variants={fadeUp} className="mb-6">
                        <h2 className="text-2xl font-black text-white mb-1">Frequently Asked Questions</h2>
                        <p className="text-slate-500 text-sm">Common questions from new investors and traders</p>
                    </motion.div>
                    <motion.div variants={fadeUp} className="space-y-3">
                        {FAQS.map((faq, i) => (
                            <div key={i}
                                className="rounded-2xl bg-[#0b1120] border border-slate-800/60 overflow-hidden">
                                <button
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <span className="text-[13px] font-semibold text-slate-200 pr-4">{faq.q}</span>
                                    <ChevronDown size={15} className={`shrink-0 text-slate-500 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence initial={false}>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="overflow-hidden">
                                            <p className="px-4 pb-4 text-[12px] text-slate-500 leading-relaxed border-t border-slate-800/60 pt-3">{faq.a}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* ── CTA ── */}
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="rounded-3xl p-5 sm:p-8 md:p-12 text-center border border-amber-500/20 overflow-hidden relative"
                    style={{ background: 'linear-gradient(135deg, #0d1a2e 0%, #0f1e35 50%, #101628 100%)' }}>
                    <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at center, #f59e0b 0%, transparent 65%)' }} />
                    <GraduationCap size={32} className="text-amber-400 mx-auto mb-3 sm:mb-4 relative" />
                    <h3 className="text-xl sm:text-3xl font-black text-white mb-2 sm:mb-3 relative">Ready to start learning?</h3>
                    <p className="text-slate-400 mb-5 sm:mb-6 max-w-md mx-auto text-xs sm:text-sm relative">Begin with the Beginner track — completely free. Unlock Intermediate and Advanced as you progress.</p>
                    <button
                        onClick={() => setActiveTrack('beginner')}
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }}>
                        Start Free Course <ArrowRight size={16} />
                    </button>
                </motion.div>

            </div>
        </section>
    );
};

export default LearningHub;
