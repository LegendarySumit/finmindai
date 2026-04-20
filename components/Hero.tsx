'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, TrendingUp, ShieldCheck, Zap, Activity } from 'lucide-react';

const TICKERS = [
    { symbol: 'TSLA', price: '245.67', change: '+3.2%', up: true },
    { symbol: 'AAPL', price: '178.32', change: '+1.8%', up: true },
    { symbol: 'NVDA', price: '875.23', change: '+5.4%', up: true },
    { symbol: 'MSFT', price: '415.89', change: '-0.6%', up: false },
    { symbol: 'GOOGL', price: '142.56', change: '+2.1%', up: true },
    { symbol: 'AMZN', price: '168.45', change: '-1.2%', up: false },
    { symbol: 'META', price: '485.67', change: '+4.7%', up: true },
    { symbol: 'BTC', price: '67,432', change: '+8.9%', up: true },
    { symbol: 'ETH', price: '3,241', change: '+6.1%', up: true },
    { symbol: 'SPY', price: '521.40', change: '+0.9%', up: true },
];

const Hero = () => {
    return (
        <section className="min-h-screen flex items-center justify-center bg-finance-darker relative overflow-hidden">
            {/* Animated grid */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(251,191,36,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.7) 1px, transparent 1px)`,
                    backgroundSize: '64px 64px',
                }}
            />

            {/* Pulsing orbs */}
            <motion.div
                className="absolute top-1/4 right-1/4 w-90 h-90 sm:w-140 sm:h-140 lg:w-175 lg:h-175 bg-finance-gold/8 rounded-full blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.18, 1], opacity: [0.06, 0.14, 0.06] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-80 h-80 sm:w-120 sm:h-120 lg:w-137.5 lg:h-137.5 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.22, 1], opacity: [0.05, 0.11, 0.05] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
            <motion.div
                className="absolute top-10 left-1/3 w-52 h-52 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-blue-600/6 rounded-full blur-3xl pointer-events-none"
                animate={{ scale: [1, 1.3, 1], opacity: [0.04, 0.09, 0.04] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            {/* Live scrolling ticker */}
            <div className="fixed top-12 sm:top-14 md:top-16 left-0 right-0 overflow-hidden backdrop-blur-sm py-1.5 sm:py-2 z-20 bg-finance-darker/80">
                <motion.div
                    className="flex gap-6 sm:gap-10 whitespace-nowrap"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 'max-content' }}
                >
                    {[...TICKERS, ...TICKERS].map((t, i) => (
                        <span key={i} className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold tracking-wide">
                            <span className="text-slate-500 text-[10px] sm:text-xs">{t.symbol}</span>
                            <span className="text-slate-300 text-[10px] sm:text-xs">${t.price}</span>
                            <span className={`${t.up ? 'text-emerald-400' : 'text-red-400'} text-[10px] sm:text-xs`}>
                                {t.up ? '▲' : '▼'} {t.change}
                            </span>
                            <span className="text-slate-700 ml-0.5 sm:ml-1">|</span>
                        </span>
                    ))}
                </motion.div>
            </div>

            <div className="w-full px-3 sm:px-3 md:px-4 lg:px-6 xl:px-8 py-14 sm:py-20 md:py-24 lg:py-28 relative pt-12 sm:pt-16 md:pt-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8 md:gap-10 lg:gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-3.5 sm:space-y-5 md:space-y-6 lg:space-y-7">
                            {/* Badge */}
                            <motion.div
                                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-finance-gold/10 border border-finance-gold/30 rounded-full"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <motion.span
                                    className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400 shrink-0"
                                    animate={{ opacity: [1, 0.2, 1] }}
                                    transition={{ duration: 1.2, repeat: Infinity }}
                                />
                                <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 text-finance-gold" />
                                <span className="text-[10px] sm:text-sm text-finance-gold font-bold uppercase tracking-wider">AI-Powered Intelligence</span>
                            </motion.div>

                            {/* Headline */}
                            <motion.h1
                                className="text-[2.35rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] sm:leading-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <span className="text-white">Master Finance</span>
                                <br />
                                <span className="text-slate-400 font-bold">with</span>
                                {' '}
                                <span className="relative inline-block text-finance-gold">
                                    AI Precision
                                    <motion.span
                                        className="absolute -inset-1.5 sm:-inset-2 bg-finance-gold/10 rounded-xl blur-lg"
                                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                                        transition={{ duration: 2.5, repeat: Infinity }}
                                    />
                                </span>
                            </motion.h1>

                            {/* Subtext */}
                            <motion.p
                                className="text-sm sm:text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed max-w-lg"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Deploy elite trading strategies, analyze institutional-grade market data, and outperform AI predictions.
                            </motion.p>

                            {/* Stats */}
                            <motion.div
                                className="grid grid-cols-3 gap-1.5 sm:gap-2.5 md:gap-3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                            >
                                {[
                                    { label: 'Active Traders', value: '12,847', color: 'text-finance-gold' },
                                    { label: 'AI Signals', value: '1,204', color: 'text-emerald-400' },
                                    { label: 'Win Rate', value: '68.4%', color: 'text-blue-400' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-finance-card/60 border border-finance-border rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-3 text-center backdrop-blur-sm min-w-0">
                                        <p className={`text-sm sm:text-sm md:text-base font-black ${s.color}`}>{s.value}</p>
                                        <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5 font-medium leading-tight">{s.label}</p>
                                    </div>
                                ))}
                            </motion.div>

                            {/* CTA Buttons */}
                            <motion.div
                                className="grid grid-cols-2 sm:flex items-center gap-2 sm:gap-3 md:gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <motion.button
                                    onClick={() => window.location.hash = '#war-room'}
                                    className="relative flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto px-3 sm:px-5 md:px-7 py-2 sm:py-3 md:py-3.5 bg-finance-gold hover:bg-finance-gold-bright rounded-lg text-slate-900 font-black uppercase tracking-wide overflow-hidden group text-xs sm:text-sm md:text-base"
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Zap className="w-3.5 sm:w-4 md:w-4 h-3.5 sm:h-4 md:h-4 relative z-10" />
                                    <span className="relative z-10">Launch</span>
                                </motion.button>

                                <motion.button
                                    onClick={() => window.location.hash = '#community'}
                                    className="flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto px-3 sm:px-5 md:px-7 py-2 sm:py-3 md:py-3.5 border-2 border-finance-gold/30 rounded-lg text-slate-300 font-black uppercase tracking-wide hover:bg-finance-card hover:border-finance-gold transition-all text-xs sm:text-sm md:text-base"
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <MessageSquare className="w-3.5 sm:w-4 md:w-4 h-3.5 sm:h-4 md:h-4" />
                                    <span>Join</span>
                                </motion.button>
                            </motion.div>

                            {/* Trust badges */}
                            <motion.div
                                className="flex items-center gap-2.5 sm:gap-4 lg:gap-6 text-[11px] sm:text-sm flex-wrap"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="flex items-center gap-1.5">
                                    <ShieldCheck className="w-4 h-4 text-finance-gold shrink-0" />
                                    <span className="text-slate-400 font-medium">Bank Security</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Activity className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span className="text-slate-400 font-medium">Real-time</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Content - Portfolio Card */}
                        <motion.div
                            className="relative hidden lg:block"
                            initial={{ opacity: 0, scale: 0.88, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.7 }}
                        >
                            {/* Glow ring */}
                            <motion.div
                                className="absolute -inset-3 bg-linear-to-br from-finance-gold/20 via-transparent to-emerald-500/10 rounded-3xl blur-xl pointer-events-none"
                                animate={{ opacity: [0.4, 0.9, 0.4] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />

                            <div className="relative bg-finance-card/90 backdrop-blur p-4 sm:p-6 md:p-8 rounded-2xl border border-finance-gold/20 shadow-2xl shadow-finance-gold/10">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-4 sm:mb-5 md:mb-6">
                                    <div>
                                        <p className="text-slate-400 text-xs mb-1 sm:mb-2 uppercase tracking-wider font-semibold">Portfolio Value</p>
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">$125,847.32</h2>
                                        <p className="text-emerald-400 text-xs sm:text-sm mt-1 flex items-center gap-1 font-semibold">
                                            <TrendingUp className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                                            +12.5% this month
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full shrink-0">
                                        <motion.span
                                            className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-400"
                                            animate={{ opacity: [1, 0.1, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        />
                                        <span className="text-emerald-400 text-xs font-bold tracking-widest">LIVE</span>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="h-24 sm:h-28 md:h-32 flex items-end gap-1.5 sm:gap-2 mb-4 sm:mb-5 md:mb-6">
                                    {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                                        <motion.div
                                            key={i}
                                            className="flex-1 rounded-t relative overflow-hidden"
                                            style={{ background: 'linear-gradient(to top, #fbbf24, #fcd34d)' }}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                                        />
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4 border-t border-finance-border">
                                    {[
                                        { label: 'Win Rate', value: '68%', color: 'text-finance-gold' },
                                        { label: 'Trades', value: '247', color: 'text-white' },
                                        { label: 'Return', value: '+8.3%', color: 'text-emerald-400' },
                                    ].map((s, i) => (
                                        <motion.div key={i} whileHover={{ scale: 1.06 }}>
                                            <p className="text-slate-500 text-xs uppercase tracking-wider">{s.label}</p>
                                            <p className={`font-bold text-sm sm:text-base md:text-lg ${s.color}`}>{s.value}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
