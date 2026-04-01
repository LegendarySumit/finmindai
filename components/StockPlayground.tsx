'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import {
    TrendingUp, TrendingDown, RefreshCcw, Brain, CheckCircle, AlertTriangle,
    Trophy, Activity, Target, ChevronUp, ChevronDown,
    BarChart2, Cpu, Flame, Crosshair, Eye, Radio
} from 'lucide-react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, PointElement, LineElement,
    BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

/* ─── Motion helpers ──────────────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } } };
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

/* ─── Types ─────────────────────────────────────────────────────────── */
type Sym   = { id: string; label: string; base: number; color: string };
type Entry = { rank: number; name: string; wins: number; rate: number; streak: number; badge: string; isUser?: boolean };

/* ─── Data ──────────────────────────────────────────────────────────── */
const SYMBOLS: Sym[] = [
    { id: 'TSLA',    label: 'Tesla',    base: 245.67,  color: '#fbbf24' },
    { id: 'AAPL',    label: 'Apple',    base: 189.30,  color: '#3b82f6' },
    { id: 'NVDA',    label: 'NVIDIA',   base: 875.40,  color: '#10b981' },
    { id: 'NIFTY',   label: 'Nifty 50', base: 22850.0, color: '#8b5cf6' },
    { id: 'BTC/USD', label: 'Bitcoin',  base: 67420.0, color: '#f97316' },
];

const LEADERBOARD: Entry[] = [
    { rank: 1, name: 'AlphaTrader99', wins: 148, rate: 82.2, streak: 9, badge: '\u{1F3C6}' },
    { rank: 2, name: 'QuantWhiz',     wins: 132, rate: 78.6, streak: 7, badge: '\u{1F948}' },
    { rank: 3, name: 'NiftyNinja',    wins: 119, rate: 77.1, streak: 5, badge: '\u{1F949}' },
    { rank: 4, name: 'BullSignal_K',  wins: 104, rate: 73.4, streak: 4, badge: '' },
    { rank: 5, name: 'You',           wins: 0,   rate: 0,    streak: 0, badge: '\u26A1', isUser: true },
];

const AI_SIGNALS = [
    { sym: 'TSLA',    dir: 'BUY',  conf: 73, reason: 'Breakout above resistance at $244' },
    { sym: 'NIFTY',   dir: 'HOLD', conf: 55, reason: 'Consolidation near 200-DMA' },
    { sym: 'NVDA',    dir: 'BUY',  conf: 88, reason: 'Strong earnings momentum, AI tailwind' },
    { sym: 'BTC/USD', dir: 'SELL', conf: 61, reason: 'RSI overbought at 74, volume declining' },
    { sym: 'AAPL',    dir: 'BUY',  conf: 69, reason: 'Services revenue beat, buyback signal' },
];

function genPrices(base: number, n = 48): number[] {
    const arr: number[] = [base];
    for (let i = 1; i < n; i++) {
        const drift = (Math.random() - 0.48) * (base * 0.008);
        const noise = (Math.random() - 0.5) * (base * 0.003);
        arr.push(Math.max(arr[i - 1] + drift + noise, base * 0.85));
    }
    return arr;
}

/* ─── Sub-components ─────────────────────────────────────────────── */

const StatCard = ({ icon: Icon, label, value, sub, color = 'text-amber-400' }:
    { icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string }) => (
    <motion.div variants={fadeUp}
        className="bg-[#0b1120] border border-slate-800/60 rounded-2xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 hover:border-slate-700 transition-all">
        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-800/60 shrink-0">
            <Icon size={15} className={color} />
        </div>
        <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 mb-0.5 truncate">{label}</div>
            <div className="text-base sm:text-xl font-black text-white">{value}</div>
            {sub && <div className="text-[9px] sm:text-[10px] text-slate-600">{sub}</div>}
        </div>
    </motion.div>
);

const AISignalBadge = ({ dir }: { dir: string }) => {
    const cfg = dir === 'BUY'
        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
        : dir === 'SELL'
        ? 'bg-red-500/15 text-red-400 border-red-500/30'
        : 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    return <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${cfg}`}>{dir}</span>;
};

const ConfidenceBar = ({ pct, color }: { pct: number; color: string }) => (
    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }} />
    </div>
);

/* ─── Main ─────────────────────────────────────────────────────────── */

const StockPlayground = () => {
    const { trackActivity } = useAuth();
    const [activeSym, setActiveSym] = useState<Sym>(SYMBOLS[0]);
    const [prices, setPrices]       = useState<number[]>(() => genPrices(SYMBOLS[0].base));
    const [prediction, setPrediction] = useState<'up' | 'down' | null>(null);
    const [result, setResult]         = useState<{
        outcome: 'up' | 'down'; userCorrect: boolean; aiCorrect: boolean; newPrice: number;
    } | null>(null);
    const [loading, setLoading]     = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [stats, setStats] = useState({ wins: 12, losses: 5, aiWins: 14, streak: 3 });

    useEffect(() => {
        if (countdown <= 0) return;
        const t = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [countdown]);

    const livePrice  = prices.length ? prices[prices.length - 1] : activeSym.base;
    const prevPrice  = prices.length > 1 ? prices[prices.length - 2] : activeSym.base;
    const pricePct   = ((livePrice - activeSym.base) / activeSym.base) * 100;
    const priceUp    = livePrice >= prevPrice;
    const winRate    = stats.wins + stats.losses > 0
        ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1)
        : '0.0';
    const aiRate     = ((stats.aiWins / (stats.aiWins + 3)) * 100).toFixed(1);

    const board: Entry[] = LEADERBOARD.map(r =>
        r.isUser ? { ...r, wins: stats.wins, rate: parseFloat(winRate), streak: stats.streak } : r
    );

    const chartData = {
        labels: prices.map((_, i) => {
            const h = 9 + Math.floor(i / 6);
            const m = (i % 6) * 10;
            return `${h}:${m.toString().padStart(2, '0')}`;
        }),
        datasets: [{
            label: activeSym.id,
            data: prices,
            borderColor: activeSym.color,
            backgroundColor: activeSym.color + '18',
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 300 },
        interaction: { intersect: false, mode: 'index' as const },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0b1120', titleColor: activeSym.color,
                bodyColor: '#e2e8f0', borderColor: activeSym.color, borderWidth: 1,
                padding: 10, displayColors: false,
                callbacks: { label: (ctx: { raw: unknown }) => ` Price: ${typeof ctx.raw === 'number' ? ctx.raw.toFixed(2) : ctx.raw}` }
            }
        },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { size: 9 }, maxTicksLimit: 8 } },
            y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { size: 9 } } }
        }
    };

    const barData = {
        labels: ['You', 'AI Engine', 'Top Trader'],
        datasets: [{
            label: 'Win Rate %',
            data: [parseFloat(winRate), parseFloat(aiRate), 85.5],
            backgroundColor: ['#fbbf24', '#3b82f6', '#10b981'],
            borderRadius: 10,
            borderSkipped: false,
            maxBarThickness: 72,
        }]
    };

    const barOptions = {
        responsive: true, maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#0b1120', bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
                callbacks: { label: (ctx: { raw: unknown }) => ` ${ctx.raw}%` }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#6b7280', font: { size: 12 } },
            },
            y: {
                beginAtZero: true, max: 100,
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#475569', font: { size: 10 }, callback: (v: unknown) => `${v}%` }
            }
        }
    };

    const handlePredict = useCallback((dir: 'up' | 'down') => {
        if (loading || prediction) return;
        setPrediction(dir);
        setLoading(true);
        setCountdown(3);
        void trackActivity('stock_playground_prediction_started', {
            symbol: activeSym.id,
            direction: dir,
            livePrice: Number(livePrice.toFixed(2)),
        });

        setTimeout(() => {
            const outcome: 'up' | 'down' = Math.random() > 0.5 ? 'up' : 'down';
            const aiCorrect   = Math.random() > 0.35;
            const userCorrect = dir === outcome;
            const newPrice    = livePrice * (outcome === 'up' ? 1 + Math.random() * 0.015 : 1 - Math.random() * 0.015);

            setStats(prev => ({
                wins:   userCorrect ? prev.wins + 1 : prev.wins,
                losses: !userCorrect ? prev.losses + 1 : prev.losses,
                aiWins: aiCorrect ? prev.aiWins + 1 : prev.aiWins,
                streak: userCorrect ? prev.streak + 1 : 0,
            }));
            setPrices(prev => [...prev, newPrice]);
            setResult({ outcome, userCorrect, aiCorrect, newPrice });
            setLoading(false);
            setCountdown(0);
            void trackActivity('stock_playground_prediction_resolved', {
                symbol: activeSym.id,
                direction: dir,
                outcome,
                userCorrect,
                aiCorrect,
                newPrice: Number(newPrice.toFixed(2)),
            });
        }, 3000);
    }, [activeSym.id, livePrice, loading, prediction, trackActivity]);

    const resetRound = () => {
        setPrediction(null); setResult(null); setCountdown(0);
        void trackActivity('stock_playground_round_reset', { symbol: activeSym.id });
    };

    const handleSymbolSelect = (symbol: Sym) => {
        setActiveSym(symbol);
        setPrices(genPrices(symbol.base));
        setPrediction(null);
        setResult(null);
        setCountdown(0);
        void trackActivity('stock_playground_symbol_selected', { symbol: symbol.id });
    };

    return (
        <section className="min-h-screen bg-[#070d1a] relative overflow-hidden py-10 sm:py-14 md:py-20 lg:py-24 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
            <div className="pointer-events-none absolute top-0 right-0 w-96 sm:w-150 h-72 sm:h-125 rounded-full blur-3xl opacity-20"
                style={{ background: 'radial-gradient(circle, #fbbf24 0%, transparent 65%)' }} />
            <div className="pointer-events-none absolute bottom-0 left-0 w-80 sm:w-125 h-64 sm:h-100 rounded-full blur-3xl opacity-10"
                style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />

            <div className="w-full max-w-7xl mx-auto relative">

                {/* ── Hero ── */}
                <motion.div variants={stagger} initial="hidden" animate="show" className="text-center mb-8">
                    <motion.div variants={fadeUp}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-5">
                        <Radio size={12} className="text-red-400 animate-pulse" />
                        <span className="text-[11px] font-black text-red-400 uppercase tracking-widest">Live War Room</span>
                    </motion.div>
                    <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 md:mb-5 leading-tight">
                        Market
                        <span className="bg-linear-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent"> Battle Arena</span>
                    </motion.h1>
                    <motion.p variants={fadeUp} className="text-xs sm:text-sm md:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto">
                        Pit your market instincts against our AI engine in real-time. Track your edge. Climb the leaderboard.
                    </motion.p>
                </motion.div>

                {/* ── KPIs ── */}
                <motion.div variants={stagger} initial="hidden" animate="show"
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5 mb-6 sm:mb-8 md:mb-10">
                    <StatCard icon={Trophy}   label="Your Wins"  value={stats.wins}        sub={`${stats.losses} losses`}    color="text-amber-400" />
                    <StatCard icon={Flame}    label="Win Streak" value={`×${stats.streak}`} sub="current streak"            color="text-orange-400" />
                    <StatCard icon={Cpu}      label="AI Wins"    value={stats.aiWins}       sub={`${aiRate}% accuracy`}       color="text-blue-400" />
                    <StatCard icon={Activity} label="Your Rate"  value={`${winRate}%`}      sub="all-time win rate"           color="text-emerald-400" />
                </motion.div>

                {/* ── Chart + Signals ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">

                    <motion.div variants={fadeUp} initial="hidden" animate="show"
                        className="xl:col-span-2 bg-[#0b1120] border border-slate-800/60 rounded-2xl p-3 sm:p-5 hover:border-slate-700 transition-all flex flex-col">
                        <div className="flex flex-col gap-2 mb-3 sm:mb-4">
                            <div className="flex items-center justify-between gap-2">
                                <div className="overflow-x-auto no-scrollbar flex-1">
                                    <div className="flex gap-1.5 w-max">
                                        {SYMBOLS.map(s => (
                                            <button key={s.id} onClick={() => handleSymbolSelect(s)}
                                                className="px-2.5 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-bold transition-all border whitespace-nowrap"
                                                style={activeSym.id === s.id
                                                    ? { background: s.color + '25', borderColor: s.color + '40', color: s.color }
                                                    : { background: 'transparent', borderColor: 'rgba(51,65,85,0.5)', color: '#64748b' }}>
                                                {s.id}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <span className="text-base sm:text-xl font-black text-white">{livePrice.toFixed(2)}</span>
                                    <span className={`flex items-center gap-0.5 text-[11px] sm:text-[12px] font-bold px-1.5 sm:px-2 py-0.5 rounded-lg ${
                                        priceUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                                        {priceUp ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                        {Math.abs(pricePct).toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 min-h-70">
                            <Line data={chartData} options={chartOptions} />
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-[10px] text-slate-600">Intraday — 10-min candles</span>
                            <span className="text-[10px] text-slate-600 flex items-center gap-1">
                                <Eye size={10} /> Simulated live data
                            </span>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} initial="hidden" animate="show"
                        className="bg-[#0b1120] border border-slate-800/60 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <Cpu size={15} className="text-blue-400" />
                            <span className="text-[12px] font-black text-white uppercase tracking-wider">AI Signal Feed</span>
                            <span className="ml-auto flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                <Radio size={8} className="animate-pulse" /> LIVE
                            </span>
                        </div>
                        <div className="flex flex-col gap-3 flex-1">
                            {AI_SIGNALS.map((sig, i) => (
                                <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[12px] font-black text-white">{sig.sym}</span>
                                        <AISignalBadge dir={sig.dir} />
                                    </div>
                                    <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">{sig.reason}</p>
                                    <div className="flex items-center gap-2">
                                        <ConfidenceBar pct={sig.conf}
                                            color={sig.dir === 'BUY' ? '#10b981' : sig.dir === 'SELL' ? '#ef4444' : '#64748b'} />
                                        <span className="text-[10px] font-bold text-slate-400 shrink-0">{sig.conf}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* ── Prediction + Leaderboard ── */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-6">

                    <motion.div variants={fadeUp} initial="hidden" animate="show"
                        className="xl:col-span-2 bg-[#0b1120] border border-slate-800/60 rounded-2xl p-3 sm:p-6 hover:border-slate-700 transition-all">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                            <Crosshair size={15} className="text-amber-400 shrink-0" />
                            <h3 className="text-[12px] sm:text-[13px] font-black text-white uppercase tracking-wider">Prediction Battle</h3>
                            <span className="text-[10px] text-slate-500 min-[420px]:ml-auto">{activeSym.id} · next 10 min</span>
                        </div>

                        <AnimatePresence mode="wait">
                            {!prediction && !result && (
                                <motion.div key="idle"
                                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                                    className="flex flex-col items-center gap-3">
                                    <p className="text-slate-400 text-sm">
                                        Where will <span className="text-amber-300 font-bold">{activeSym.id}</span> move next?
                                    </p>
                                    <div className="flex gap-3 w-full max-w-sm">
                                        <button onClick={() => handlePredict('up')}
                                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25 hover:scale-105 transition-all active:scale-95">
                                            <TrendingUp size={18} /> UP
                                        </button>
                                        <button onClick={() => handlePredict('down')}
                                            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm bg-red-500/15 border-2 border-red-500/40 text-red-400 hover:bg-red-500/25 hover:scale-105 transition-all active:scale-95">
                                            <TrendingDown size={18} /> DOWN
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-600">AI scanning {activeSym.id} for signals…</p>
                                </motion.div>
                            )}

                            {loading && (
                                <motion.div key="loading"
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-4 py-4">
                                    <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-amber-400 animate-spin" />
                                    <div className="text-center">
                                        <p className="text-amber-400 font-black text-2xl mb-0.5">{countdown}s</p>
                                        <p className="text-slate-400 text-sm">Processing market data…</p>
                                        <p className="text-[11px] text-slate-600 mt-1">Your call:{' '}
                                            <span className={`font-bold ${prediction === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {prediction?.toUpperCase()}
                                            </span>
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {result && !loading && (
                                <motion.div key="result"
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                    className="flex flex-col items-center gap-4">
                                    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border font-black text-lg ${
                                        result.userCorrect
                                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                                            : 'bg-red-500/15 border-red-500/40 text-red-400'
                                    }`}>
                                        {result.userCorrect
                                            ? <><CheckCircle size={20} /> Correct! +1 Win</>
                                            : <><AlertTriangle size={20} /> Wrong — Market went {result.outcome.toUpperCase()}</>
                                        }
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-center">
                                        <div className={`p-3 rounded-xl border ${result.userCorrect ? 'bg-emerald-500/10 border-emerald-500/25' : 'bg-red-500/10 border-red-500/25'}`}>
                                            <Target size={16} className={`mx-auto mb-1 ${result.userCorrect ? 'text-emerald-400' : 'text-red-400'}`} />
                                            <div className="text-[10px] text-slate-500">You</div>
                                            <div className={`text-sm font-black ${result.userCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {result.userCorrect ? 'WIN' : 'LOSS'}
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-xl border ${result.aiCorrect ? 'bg-blue-500/10 border-blue-500/25' : 'bg-slate-800/60 border-slate-700/40'}`}>
                                            <Brain size={16} className={`mx-auto mb-1 ${result.aiCorrect ? 'text-blue-400' : 'text-slate-500'}`} />
                                            <div className="text-[10px] text-slate-500">AI Engine</div>
                                            <div className={`text-sm font-black ${result.aiCorrect ? 'text-blue-400' : 'text-slate-500'}`}>
                                                {result.aiCorrect ? 'WIN' : 'LOSS'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        New price: <span className="text-white font-bold">{result.newPrice.toFixed(2)}</span>
                                    </div>
                                    <button onClick={resetRound}
                                        className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-sm font-bold hover:bg-amber-500/25 transition-all">
                                        <RefreshCcw size={14} /> Next Round
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ── Session Stats Strip ── */}
                        <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-800/60">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">Your Session</p>
                            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
                                <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl py-2 px-1">
                                    <div className="text-base sm:text-lg font-black text-emerald-400">{stats.wins}</div>
                                    <div className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-wide">Wins</div>
                                </div>
                                <div className="bg-red-500/8 border border-red-500/20 rounded-xl py-2 px-1">
                                    <div className="text-base sm:text-lg font-black text-red-400">{stats.losses}</div>
                                    <div className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-wide">Losses</div>
                                </div>
                                <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl py-2 px-1">
                                    <div className="text-base sm:text-lg font-black text-amber-400">{stats.streak}🔥</div>
                                    <div className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-wide">Streak</div>
                                </div>
                                <div className="bg-blue-500/8 border border-blue-500/20 rounded-xl py-2 px-1">
                                    <div className="text-base sm:text-lg font-black text-blue-400">{winRate}%</div>
                                    <div className="text-[8px] sm:text-[9px] text-slate-500 uppercase tracking-wide">Win Rate</div>
                                </div>
                            </div>
                        </div>

                        {/* ── How it works ── */}
                        <div className="mt-4 pt-4 border-t border-slate-800/60">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">How It Works</p>
                            <div className="space-y-1.5">
                                {[
                                    { step: '01', text: 'Pick UP or DOWN for the next 10 min', color: 'text-amber-400' },
                                    { step: '02', text: 'AI Engine independently makes its call', color: 'text-blue-400' },
                                    { step: '03', text: 'Results auto-resolve — climb the board', color: 'text-emerald-400' },
                                ].map(({ step, text, color }) => (
                                    <div key={step} className="flex items-start gap-2.5">
                                        <span className={`text-[10px] font-black ${color} mt-0.5 shrink-0`}>{step}</span>
                                        <span className="text-[11px] text-slate-400 leading-snug">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeUp} initial="hidden" animate="show"
                        className="bg-[#0b1120] border border-slate-800/60 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy size={15} className="text-amber-400" />
                            <h3 className="text-[12px] font-black text-white uppercase tracking-wider">Leaderboard</h3>
                        </div>
                        <div className="flex-1 flex flex-col justify-between gap-2">
                            {board.map(r => (
                                <div key={r.rank}
                                    className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                                        r.isUser
                                            ? 'bg-[#1a1200] border-amber-500/20'
                                            : 'bg-slate-900/40 border-slate-800/40 hover:border-slate-700/60'
                                    }`}>
                                    <span className="text-[11px] w-5 text-center font-black text-slate-500">
                                        {r.badge || `#${r.rank}`}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-[11px] font-bold truncate ${r.isUser ? 'text-amber-300' : 'text-slate-300'}`}>
                                            {r.name}
                                        </div>
                                        <div className="text-[9px] text-slate-600">
                                            {r.wins}W · {r.streak > 0 ? `x${r.streak}` : '–'}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black ${r.rate >= 75 ? 'text-emerald-400' : r.rate >= 60 ? 'text-amber-400' : 'text-slate-500'}`}>
                                        {r.rate > 0 ? `${r.rate}%` : '–'}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[9px] text-slate-700 mt-4 text-center">Rankings update after each round</p>
                    </motion.div>
                </div>

                {/* ── Bar Chart ── */}
                <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                    className="bg-[#0b1120] border border-slate-800/60 rounded-2xl p-5 hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <BarChart2 size={15} className="text-amber-400" />
                            <h3 className="text-[12px] font-black text-white uppercase tracking-wider">Win Rate Comparison</h3>
                        </div>
                        <div className="flex gap-4 text-[10px]">
                            {[['#fbbf24', 'You'], ['#3b82f6', 'AI Engine'], ['#10b981', 'Top Trader']].map(([c, l]) => (
                                <span key={l} className="flex items-center gap-1.5 text-slate-400">
                                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{l}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="h-52">
                        <Bar data={barData} options={barOptions} />
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default StockPlayground;
