'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Activity, AlertTriangle, Zap, Target, TrendingDown, BarChart3, Shield, Clock, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const CommandCenter = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const marketStatus: 'open' | 'closed' = currentTime.getHours() >= 9 && currentTime.getHours() < 16 ? 'open' : 'closed';

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => clearInterval(timer);
    }, []);

    const metrics = [
        {
            label: 'PORTFOLIO VALUE',
            value: '₹24,89,921',
            subValue: '.50',
            change: '+12.4%',
            changeLabel: 'this month',
            icon: TrendingUp,
            color: 'emerald',
            chart: [45, 52, 48, 65, 58, 72, 68, 80, 75, 88, 92, 85],
        },
        {
            label: 'ACTIVE PREDICTIONS',
            value: '17',
            subValue: '',
            change: '5 High-conf',
            changeLabel: 'running now',
            icon: Activity,
            color: 'amber',
            chart: [30, 45, 35, 50, 45, 60, 55, 65, 60, 70, 75, 65],
        },
        {
            label: 'PREDICTION WIN RATE',
            value: '73.2',
            subValue: '%',
            change: '+2.1%',
            changeLabel: 'vs last month',
            icon: Target,
            color: 'blue',
            chart: [60, 62, 65, 63, 68, 70, 69, 71, 72, 73, 74, 73],
        },
        {
            label: 'MARKET THREAT LEVEL',
            value: 'Moderate',
            subValue: '',
            change: 'VIX 18.2',
            changeLabel: 'mixed sentiment',
            icon: AlertTriangle,
            color: 'orange',
            chart: [15, 18, 20, 17, 19, 22, 20, 18, 19, 17, 18, 18],
        },
    ];

    const liveActivity = [
        { type: 'prediction', message: 'AAPL bullish — 85% confidence score', time: '2m ago', status: 'success' },
        { type: 'alert', message: 'Fed rate decision alert triggered', time: '5m ago', status: 'warning' },
        { type: 'trade', message: 'TSLA position closed — +8.2% return', time: '12m ago', status: 'success' },
        { type: 'news', message: 'Breaking: Tech sector rally continues', time: '18m ago', status: 'info' },
        { type: 'prediction', message: 'GOOGL bearish signal detected', time: '25m ago', status: 'error' },
    ];

    const quickActions = [
        { label: 'New Prediction', desc: 'Enter the War Room', icon: Zap },
        { label: 'Portfolio Scan', desc: 'Run AI analysis', icon: BarChart3 },
        { label: 'Risk Check', desc: 'Assess exposure', icon: Shield },
    ];

    return (
        <section id="dashboard" className="min-h-screen flex items-center justify-center bg-linear-to-br from-finance-darker via-finance-dark to-finance-darker pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                {/* Status Bar */}
                <motion.div
                    className="bg-finance-card/50 backdrop-blur border border-finance-border rounded-xl p-4 sm:p-6 mb-6 sm:mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${marketStatus === 'open' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
                                <span className="text-sm font-semibold text-white uppercase tracking-wider">
                                    {marketStatus === 'open' ? 'Markets Open' : 'Markets Closed'}
                                </span>
                                <span className="text-xs text-slate-500">NYSE</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Last sync: Just now</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm text-slate-400">Watching:</span>
                                <span className="text-sm font-bold text-white">42 assets</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-finance-gold" />
                                <span className="text-sm text-slate-400">Alerts active:</span>
                                <span className="text-sm font-bold text-finance-gold">8</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-finance-border">
                        <div className="flex items-center justify-center">
                            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-center leading-tight">
                                <span className="text-white">FinMindAI </span>
                                <span className="text-finance-gold glow-gold">Command Center</span>
                            </h1>
                        </div>
                        <p className="text-center text-slate-400 mt-2 text-xs sm:text-sm md:text-base">
                            Institutional-grade financial intelligence. Monitor portfolios, predict markets, analyze live news, and master the art of strategic wealth building.
                        </p>
                    </div>
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    {metrics.map((metric, i) => {
                        const Icon = metric.icon;
                        const colorClasses = {
                            emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                            amber: 'text-finance-gold bg-finance-gold/10 border-finance-gold/20',
                            blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
                            orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
                        };

                        return (
                            <motion.div
                                key={metric.label}
                                className="bg-finance-card/80 backdrop-blur border border-finance-border rounded-xl p-4 sm:p-6 hover:border-finance-gold/30 transition-all group relative overflow-hidden"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-linear-to-br from-finance-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{metric.label}</span>
                                        <div className={`w-8 h-8 rounded-lg ${colorClasses[metric.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{metric.value}</span>
                                        {metric.subValue && <span className="text-xl sm:text-2xl font-bold text-slate-500">{metric.subValue}</span>}
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`text-sm font-semibold ${metric.change.startsWith('+') ? 'text-emerald-500' : metric.change.startsWith('-') ? 'text-red-500' : 'text-finance-gold'}`}>
                                            {metric.change}
                                        </span>
                                        <span className="text-xs text-slate-500">{metric.changeLabel}</span>
                                    </div>

                                    {/* Mini Chart */}
                                    <div className="h-12 flex items-end gap-1">
                                        {metric.chart.map((height, idx) => (
                                            <motion.div
                                                key={idx}
                                                className={`flex-1 rounded-t ${
                                                    metric.color === 'emerald' ? 'bg-linear-to-t from-emerald-600 to-emerald-500' :
                                                    metric.color === 'amber' ? 'bg-linear-to-t from-finance-gold to-finance-gold-bright' :
                                                    metric.color === 'blue' ? 'bg-linear-to-t from-blue-600 to-blue-500' :
                                                    'bg-linear-to-t from-orange-600 to-orange-500'
                                                } opacity-70 hover:opacity-100 transition-opacity`}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${height}%` }}
                                                transition={{ delay: i * 0.1 + idx * 0.02 }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Section - Activity Feed & Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {/* Live Activity Feed */}
                    <motion.div
                        className="lg:col-span-2 bg-finance-card/80 backdrop-blur border border-finance-border rounded-xl p-6"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-finance-gold" />
                                <h3 className="text-lg font-bold text-white">LIVE ACTIVITY FEED</h3>
                            </div>
                            <button className="text-xs text-finance-gold hover:text-finance-gold-bright transition-colors">
                                View all →
                            </button>
                        </div>

                        <div className="space-y-3">
                            {liveActivity.map((activity, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-start gap-3 p-3 rounded-lg bg-finance-darker/50 border border-finance-border/50 hover:border-finance-gold/30 transition-all group"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + i * 0.05 }}
                                >
                                    <div className={`w-2 h-2 rounded-full mt-2 ${
                                        activity.status === 'success' ? 'bg-emerald-500' :
                                        activity.status === 'warning' ? 'bg-finance-gold' :
                                        activity.status === 'error' ? 'bg-red-500' :
                                        'bg-blue-500'
                                    }`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white group-hover:text-finance-gold transition-colors">{activity.message}</p>
                                        <span className="text-xs text-slate-500">{activity.time}</span>
                                    </div>
                                    {activity.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <motion.div
                        className="bg-finance-card/80 backdrop-blur border border-finance-border rounded-xl p-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <Zap className="w-5 h-5 text-finance-gold" />
                            <h3 className="text-lg font-bold text-white">QUICK ACTIONS</h3>
                        </div>

                        <div className="space-y-3">
                            {quickActions.map((action, i) => {
                                const Icon = action.icon;
                                return (
                                    <motion.button
                                        key={i}
                                        className="w-full flex items-center gap-4 p-4 rounded-lg bg-finance-darker/50 border border-finance-border hover:border-finance-gold hover:bg-finance-gold/5 transition-all group text-left"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 + i * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-finance-gold/10 border border-finance-gold/20 flex items-center justify-center group-hover:bg-finance-gold/20 transition-colors">
                                            <Icon className="w-5 h-5 text-finance-gold" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-white group-hover:text-finance-gold transition-colors">{action.label}</p>
                                            <p className="text-xs text-slate-500">{action.desc}</p>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        <motion.button
                            className="w-full mt-6 px-6 py-3 bg-finance-gold hover:bg-finance-gold-bright text-slate-900 font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-finance-gold/50"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Access Full Dashboard →
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default CommandCenter;
