'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Target, Trophy, Brain, TrendingUp, ArrowRight, Zap, Shield, Crosshair, Activity, RefreshCw } from 'lucide-react';

interface StockData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
}

const LiveBars = ({ prices }: { prices: number[] }) => {
    // Normalise prices to a 0–100 height scale for display
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const heights = prices.map(p => 20 + ((p - min) / range) * 75);

    return (
        <div className="flex items-end gap-0.5 h-20 w-full">
            {heights.map((h, i) => (
                <motion.div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{ background: `rgba(251,191,36,${0.18 + (h / 100) * 0.55})` }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                />
            ))}
        </div>
    );
};

const SYMBOL = 'TSLA';
const POLL_INTERVAL = 15_000; // 15 seconds — stays within Finnhub free tier (60 req/min)

const WarRoomPreview = () => {
    const [stock, setStock] = useState<StockData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    // Rolling price history for the bar chart (last 12 ticks)
    const priceHistory = useRef<number[]>([]);

    const fetchStock = async () => {
        try {
            const res = await fetch(`/api/stock?symbol=${SYMBOL}`);
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err?.error?.message ?? err?.error ?? 'Failed to fetch');
            }
            const raw = await res.json();
            const payload = raw?.data ?? raw;
            const data: StockData = {
                symbol: typeof payload?.symbol === 'string' ? payload.symbol : SYMBOL,
                name: typeof payload?.name === 'string' ? payload.name : SYMBOL,
                price: Number(payload?.price),
                change: Number(payload?.change),
                changePercent: Number(payload?.changePercent),
                high: Number(payload?.high),
                low: Number(payload?.low),
            };

            if (!Number.isFinite(data.price) || !Number.isFinite(data.change) || !Number.isFinite(data.changePercent)) {
                throw new Error('Invalid stock response payload');
            }

            setStock(data);
            setError(null);
            setLastUpdated(new Date());
            // Append to price history, keep last 12 prices
            priceHistory.current = [...priceHistory.current, data.price].slice(-12);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStock();
        const id = setInterval(fetchStock, POLL_INTERVAL);
        return () => clearInterval(id);
    }, []);

    const quickStats = [
        { label: 'Active Traders', value: '1,247', icon: Trophy, color: '#fbbf24', border: 'border-yellow-500/20', bg: 'from-yellow-500/8 to-transparent' },
        { label: 'Predictions Today', value: '3,891', icon: Target, color: '#60a5fa', border: 'border-blue-500/20', bg: 'from-blue-500/8 to-transparent' },
        { label: 'AI Win Rate', value: '82.4%', icon: Brain, color: '#34d399', border: 'border-emerald-500/20', bg: 'from-emerald-500/8 to-transparent' },
        { label: 'Live Markets', value: '24', icon: Activity, color: '#a78bfa', border: 'border-purple-500/20', bg: 'from-purple-500/8 to-transparent' },
    ];

    const leaderboard = [
        { rank: 1, name: 'TraderX_99', rate: '91.2%', pnl: '+$4,820', color: '#fbbf24' },
        { rank: 2, name: 'AlgoKing', rate: '87.6%', pnl: '+$3,214', color: '#94a3b8' },
        { rank: 3, name: 'MarketWolf', rate: '84.3%', pnl: '+$2,891', color: '#cd7f32' },
        { rank: 4, name: 'You', rate: '73.2%', pnl: '+$1,240', color: '#a78bfa', highlight: true },
    ];

    return (
        <section id="playground" className="relative py-10 sm:py-14 md:py-20 lg:py-24 overflow-hidden bg-finance-darker px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(251,191,36,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.025) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }}
                />
                <motion.div
                    className="absolute -top-40 right-0 w-130 h-130 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.85, 0.5] }}
                    transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-0 -left-20 w-96 h-96 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 8, repeat: Infinity, delay: 2 }}
                />
            </div>

            <div className="max-w-7xl mx-auto relative">
                {/* Header */}
                <div className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 mb-6"
                    >
                        <motion.span
                            className="w-2 h-2 rounded-full bg-red-400"
                            animate={{ opacity: [1, 0.25, 1] }}
                            transition={{ duration: 1.1, repeat: Infinity }}
                        />
                        <Target className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-red-400">War Room</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 md:mb-5 leading-tight"
                    >
                        Prediction{' '}
                        <span className="relative inline-block">
                            <span className="text-finance-gold glow-gold">Arena</span>
                            <motion.span
                                className="absolute -bottom-1 left-0 h-0.75 w-full rounded-full"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.7 }}
                                style={{ transformOrigin: 'left', background: 'linear-gradient(90deg, #fbbf24, transparent)' }}
                            />
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-lg max-w-2xl mx-auto"
                    >
                        Test your market instincts against our AI. Battle-tested strategies. Real-time competition.
                    </motion.p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                    {quickStats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                                className={`relative overflow-hidden rounded-xl border ${stat.border} bg-finance-card/60 backdrop-blur p-5 group cursor-default`}
                            >
                                {/* hover bg */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: `radial-gradient(ellipse at top left, ${stat.color}14, transparent 70%)` }}
                                />
                                {/* watermark icon */}
                                <Icon
                                    className="absolute -right-3 -bottom-2 w-16 h-16 opacity-[0.05] transition-opacity group-hover:opacity-[0.1]"
                                    style={{ color: stat.color }}
                                />
                                <div className="relative">
                                    <Icon className="w-5 h-5 mb-3" style={{ color: stat.color }} />
                                    <p className="text-2xl font-black text-white mb-0.5">{stat.value}</p>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Main Battle Terminal */}
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="rounded-2xl border border-finance-border overflow-hidden shadow-2xl"
                    style={{ background: 'linear-gradient(135deg, rgba(13,17,30,0.97) 0%, rgba(10,14,24,0.99) 100%)' }}
                >
                    {/* Terminal chrome bar */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-finance-border/50 bg-finance-card/20">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                <div className="w-3 h-3 rounded-full bg-green-500/70" />
                            </div>
                            <span className="text-xs text-slate-600 font-mono hidden sm:inline">war-room.finmindai.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.span
                                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                            />
                            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Live Session</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-finance-border/30">
                        {/* Left — Info + CTA */}
                        <div className="lg:col-span-2 p-8 flex flex-col justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
                                    <Zap className="w-3 h-3 text-emerald-400" />
                                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Live Now</span>
                                </div>
                                <h3 className="text-2xl font-black text-white mb-3 leading-snug">
                                    Real-Time Market<br />Predictions
                                </h3>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                    Challenge our AI in live market prediction battles. Compete on leaderboards, and sharpen your trading instincts.
                                </p>
                                <div className="space-y-2.5">
                                    {[
                                        'Interactive price charts with Chart.js',
                                        'Live performance tracking & analytics',
                                        'AI vs. Human competition system',
                                        'Global leaderboard rankings',
                                    ].map((f) => (
                                        <div key={f} className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-finance-gold shrink-0" />
                                            <span className="text-sm text-slate-300">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <motion.a
                                href="#war-room"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                className="relative inline-flex items-center gap-2 px-6 py-3.5 bg-finance-gold text-slate-900 font-black rounded-xl overflow-hidden group w-fit"
                            >
                                <motion.span
                                    className="absolute inset-0 bg-white/20"
                                    initial={{ x: '-110%', skewX: '-20deg' }}
                                    whileHover={{ x: '220%' }}
                                    transition={{ duration: 0.45 }}
                                />
                                <Crosshair className="w-4 h-4 relative" />
                                <span className="relative">Enter War Room</span>
                                <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
                            </motion.a>
                        </div>

                        {/* Center — Live Chart + VS */}
                        <div className="lg:col-span-2 p-6 flex flex-col gap-4">
                            {/* Stock header */}
                            {loading ? (
                                <div className="flex items-center gap-3 animate-pulse">
                                    <div className="h-6 w-20 bg-finance-border/40 rounded" />
                                    <div className="h-4 w-12 bg-finance-border/30 rounded" />
                                    <div className="ml-auto h-7 w-24 bg-finance-border/40 rounded" />
                                </div>
                            ) : error ? (
                                <div className="flex items-center gap-2 text-red-400 text-xs">
                                    <RefreshCw className="w-3 h-3" />
                                    <span>{error} — add your FINNHUB_API_KEY in .env.local</span>
                                </div>
                            ) : stock && (
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-black text-white">{stock.symbol}</span>
                                            <span className="text-xs bg-finance-gold/10 border border-finance-gold/20 text-finance-gold px-2 py-0.5 rounded font-bold">NASDAQ</span>
                                        </div>
                                        <span className="text-xs text-slate-500">{stock.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <motion.p
                                            key={stock.price}
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-2xl font-black text-white"
                                        >
                                            ${stock.price.toFixed(2)}
                                        </motion.p>
                                        <div className={`flex items-center gap-1 justify-end ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                            <TrendingUp className={`w-3 h-3 ${stock.change < 0 ? 'rotate-180' : ''}`} />
                                            <span className="text-xs font-bold">
                                                {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Animated bars — driven by real price history */}
                            <div className="flex-1">
                                <LiveBars prices={priceHistory.current.length >= 2 ? priceHistory.current : [45, 52, 48, 65, 58, 72, 68, 75, 82, 78, 85, 92]} />
                            </div>
                            <div className="flex justify-between text-xs text-slate-600">
                                <span>Session start</span>
                                <span className={lastUpdated ? 'text-emerald-400' : 'text-slate-600'}>
                                    {lastUpdated ? `● ${lastUpdated.toLocaleTimeString()}` : '● Connecting…'}
                                </span>
                            </div>

                            {/* VS Battle card */}
                            <div className="rounded-xl border border-finance-border/50 p-4 bg-finance-darker/70">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Current Round</span>
                                    <span className="text-xs font-black text-finance-gold">Round 7 / 10</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 text-center">
                                        <div className="text-xl font-black text-purple-400">73.2%</div>
                                        <div className="text-xs text-slate-500 mt-0.5">You</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <Shield className="w-5 h-5 text-red-400" />
                                        <span className="text-xs font-black text-red-400 mt-1">VS</span>
                                    </div>
                                    <div className="flex-1 text-center">
                                        <div className="text-xl font-black text-emerald-400">82.4%</div>
                                        <div className="text-xs text-slate-500 mt-0.5">AI</div>
                                    </div>
                                </div>
                                {/* battle bar */}
                                <div className="mt-3 h-1.5 bg-finance-border/30 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.6, duration: 1.2, ease: 'easeOut' }}
                                        style={{ transformOrigin: 'left', background: 'linear-gradient(90deg, #a78bfa 0%, #ef4444 45%, #34d399 100%)' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right — Leaderboard */}
                        <div className="lg:col-span-1 p-5 flex flex-col">
                            <div className="flex items-center gap-2 mb-5">
                                <Trophy className="w-4 h-4 text-finance-gold" />
                                <span className="text-xs font-black text-white uppercase tracking-wider">Leaderboard</span>
                            </div>
                            <div className="space-y-2 flex-1">
                                {leaderboard.map((entry, i) => (
                                    <motion.div
                                        key={entry.rank}
                                        initial={{ opacity: 0, x: 14 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + i * 0.08 }}
                                        className={`rounded-lg p-2.5 border transition-colors ${
                                            (entry as typeof entry & { highlight?: boolean }).highlight
                                                ? 'bg-purple-500/10 border-purple-500/30'
                                                : 'bg-finance-card/40 border-finance-border/40 hover:border-finance-border'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black w-4" style={{ color: entry.color }}>
                                                #{entry.rank}
                                            </span>
                                            <span className={`text-xs font-bold flex-1 truncate ${(entry as typeof entry & { highlight?: boolean }).highlight ? 'text-purple-300' : 'text-slate-300'}`}>
                                                {entry.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-1 pl-6">
                                            <span className="text-[10px] text-slate-500">{entry.rate}</span>
                                            <span className="text-[10px] text-emerald-400 font-bold">{entry.pnl}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-finance-border/30">
                                <p className="text-[10px] text-slate-600 text-center uppercase tracking-wider">Live · updates every 15s</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default WarRoomPreview;
