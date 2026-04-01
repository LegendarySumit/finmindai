'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, ArrowUpRight, ArrowDownRight, Activity, Clock,
         Wifi, WifiOff, Zap, Radio, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/lib/authContext';

type Sentiment = 'positive' | 'negative' | 'neutral';

interface NewsItem {
    id: number;
    title: string;
    summary: string;
    sentiment: Sentiment;
    time: string;
    impactedStocks: string[];
    impactScore: number;
    isNew?: boolean;
}

const SENTIMENT_CONFIG = {
    positive: {
        label: 'BULLISH',
        bar: 'bg-emerald-500',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        glow: 'hover:shadow-emerald-500/5 hover:border-emerald-500/30',
        stripe: 'from-emerald-500 to-emerald-400',
        icon: TrendingUp,
        dot: 'bg-emerald-400',
    },
    negative: {
        label: 'BEARISH',
        bar: 'bg-rose-500',
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        glow: 'hover:shadow-rose-500/5 hover:border-rose-500/30',
        stripe: 'from-rose-500 to-rose-400',
        icon: TrendingDown,
        dot: 'bg-rose-400',
    },
    neutral: {
        label: 'NEUTRAL',
        bar: 'bg-blue-400',
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        glow: 'hover:shadow-blue-500/5 hover:border-blue-500/30',
        stripe: 'from-blue-400 to-blue-300',
        icon: Activity,
        dot: 'bg-blue-400',
    },
};

const initialNews: NewsItem[] = [
    {
        id: 1,
        title: 'Federal Reserve Signals Rate Cuts Ahead',
        summary: 'Fed Chairman hints at potential rate reductions in Q2, boosting market sentiment across sectors. Bond yields drop sharply as traders price in two cuts for the second half of the year.',
        sentiment: 'positive',
        time: '5 mins ago',
        impactedStocks: ['SPY', 'QQQ', 'DIA'],
        impactScore: 8.5,
    },
    {
        id: 2,
        title: 'Tech Giants Report Record Earnings',
        summary: 'Major tech companies exceed expectations, driven by AI infrastructure investments. Cloud revenues surge 40% YoY as enterprise adoption accelerates.',
        sentiment: 'positive',
        time: '12 mins ago',
        impactedStocks: ['AAPL', 'MSFT', 'GOOGL'],
        impactScore: 9.2,
    },
    {
        id: 3,
        title: 'Oil Prices Surge Amid Supply Concerns',
        summary: 'Crude oil jumps 5% as OPEC announces production cuts, raising inflation fears. Energy sector outperforms as WTI crosses $90 threshold.',
        sentiment: 'negative',
        time: '25 mins ago',
        impactedStocks: ['XOM', 'CVX', 'USO'],
        impactScore: 7.8,
    },
    {
        id: 4,
        title: 'Crypto Market Rally on ETF Approval Rumors',
        summary: 'Bitcoin and Ethereum surge as sources suggest imminent SEC approval for spot ETFs. Altcoins follow with broad market rally.',
        sentiment: 'positive',
        time: '32 mins ago',
        impactedStocks: ['BTC', 'ETH', 'COIN'],
        impactScore: 8.9,
    },
    {
        id: 5,
        title: 'Retail Sector Faces Headwinds',
        summary: 'Consumer spending data shows unexpected decline, weighing on retail stocks. Holiday season forecasts revised downward.',
        sentiment: 'negative',
        time: '45 mins ago',
        impactedStocks: ['XRT', 'WMT', 'TGT'],
        impactScore: 6.5,
    },
    {
        id: 6,
        title: 'Semiconductor Demand Outpaces Supply',
        summary: 'Key chip manufacturers warn of extended lead times as AI demand skyrockets globally. TSMC capacity utilization hits 98%.',
        sentiment: 'neutral',
        time: '52 mins ago',
        impactedStocks: ['TSM', 'AMD', 'INTC'],
        impactScore: 7.2,
    },
];

// Mini impact bar
const ImpactBar = ({ score, sentiment }: { score: number; sentiment: Sentiment }) => {
    const cfg = SENTIMENT_CONFIG[sentiment];
    return (
        <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-600 uppercase tracking-widest w-16">Impact</span>
            <div className="flex-1 h-1 bg-finance-border/30 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${cfg.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score * 10}%` }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                />
            </div>
            <span className={`text-[10px] font-black tabular-nums ${
                sentiment === 'positive' ? 'text-emerald-400' :
                sentiment === 'negative' ? 'text-rose-400' : 'text-blue-400'
            }`}>{score}</span>
        </div>
    );
};

// Featured (large) card
const FeaturedCard = ({ news }: { news: NewsItem }) => {
    const cfg = SENTIMENT_CONFIG[news.sentiment];
    const Icon = cfg.icon;
    
    const handleClick = () => {
        window.location.href = '/market-intelligence';
    };
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleClick}
            className={`relative overflow-hidden rounded-2xl border border-finance-border bg-finance-card/60 backdrop-blur group cursor-pointer h-full flex flex-col transition-all duration-300 ${cfg.glow} hover:shadow-xl`}
        >
            {/* Gradient stripe top */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${cfg.stripe}`} />
            {/* Hover shimmer */}
            <div className="absolute inset-0 bg-linear-to-br from-white/0 via-white/2 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="p-7 flex flex-col flex-1">
                {/* Top row */}
                <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${cfg.badge}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                        </span>
                        {news.impactScore >= 8.5 && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-finance-gold/10 border border-finance-gold/20 text-[10px] font-black text-finance-gold uppercase tracking-widest">
                                <Zap className="w-2.5 h-2.5" />
                                HIGH SIGNAL
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                        <Clock className="w-3 h-3" />
                        <span>{news.time}</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-white mb-3 leading-tight group-hover:text-finance-gold transition-colors duration-200">
                    {news.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                    {news.summary}
                </p>

                {/* Stocks */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {news.impactedStocks.map((s) => (
                        <span key={s} className="px-2.5 py-1 bg-finance-darker/80 border border-finance-border/40 rounded-lg text-[10px] font-mono font-bold text-slate-300 group-hover:border-finance-border transition-colors">
                            ${s}
                        </span>
                    ))}
                </div>

                {/* Impact bar */}
                <ImpactBar score={news.impactScore} sentiment={news.sentiment} />

                {/* Analyze CTA */}
                <div className="flex items-center justify-end mt-5">
                    <motion.button
                        whileHover={{ x: 3 }}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                            news.sentiment === 'positive' ? 'text-emerald-400' :
                            news.sentiment === 'negative' ? 'text-rose-400' : 'text-blue-400'
                        }`}
                    >
                        Full Analysis <ExternalLink className="w-3 h-3" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// Compact card for grid
const CompactCard = ({ news, delay = 0, onSelect }: { news: NewsItem; delay?: number; onSelect: (news: NewsItem) => void }) => {
    const cfg = SENTIMENT_CONFIG[news.sentiment];
    const Icon = cfg.icon;
    
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, delay }}
            onClick={() => onSelect(news)}
            className={`relative overflow-hidden rounded-xl border border-finance-border bg-finance-card/50 backdrop-blur group cursor-pointer flex flex-col h-full transition-all duration-300 ${cfg.glow} hover:shadow-lg`}
        >
            {/* Left sentiment stripe */}
            <div className={`absolute top-0 left-0 bottom-0 w-0.5 bg-linear-to-b ${cfg.stripe} opacity-60 group-hover:opacity-100 transition-opacity`} />

            <div className="p-5 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-center justify-between mb-3 pl-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${cfg.badge}`}>
                        <span className={`w-1 h-1 rounded-full ${cfg.dot} ${news.isNew ? 'animate-ping' : ''}`} />
                        {cfg.label}
                    </span>
                    <span className="text-[10px] text-slate-600 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {news.time}
                    </span>
                </div>

                {/* Title + summary */}
                <div className="pl-2 flex-1 mb-4">
                    <h3 className="text-sm font-bold text-white mb-1.5 leading-snug group-hover:text-finance-gold transition-colors line-clamp-2">
                        {news.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed group-hover:text-slate-400 transition-colors">
                        {news.summary}
                    </p>
                </div>

                {/* Stocks row */}
                <div className="flex gap-1 pl-2 mb-4 flex-wrap">
                    {news.impactedStocks.slice(0, 3).map((s) => (
                        <span key={s} className="px-2 py-0.5 bg-finance-darker border border-finance-border/40 rounded text-[9px] font-mono font-bold text-slate-400">
                            ${s}
                        </span>
                    ))}
                </div>

                {/* Impact bar + analyze */}
                <div className="pl-2 space-y-3 mt-auto">
                    <ImpactBar score={news.impactScore} sentiment={news.sentiment} />
                    <div className="flex items-center justify-between pt-2 border-t border-finance-border/20">
                        <div className="flex items-center gap-1.5">
                            <Icon className={`w-3 h-3 ${
                                news.sentiment === 'positive' ? 'text-emerald-400' :
                                news.sentiment === 'negative' ? 'text-rose-400' : 'text-blue-400'
                            }`} />
                            <span className="text-[9px] text-slate-600 uppercase tracking-wider">
                                {news.sentiment === 'positive' ? 'Bullish signal' :
                                 news.sentiment === 'negative' ? 'Bearish signal' : 'Watch signal'}
                            </span>
                        </div>
                        <motion.span
                            whileHover={{ x: 2 }}
                            className="text-[10px] text-finance-gold font-bold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            Analyze <ArrowUpRight className="w-2.5 h-2.5" />
                        </motion.span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const MarketIntelligenceReal = () => {
    const MAX_HOME_NEWS = 6;
    const [sentimentFilter, setSentimentFilter] = useState<Sentiment | 'all'>('all');
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [showDeepAnalysis, setShowDeepAnalysis] = useState(false);
    const { user } = useAuth();
    const { isConnected, lastMessage } = useWebSocket('/ws', {
        token: user?.token ?? null,
        enabled: Boolean(user?.token),
    });
    const [newsFeed, setNewsFeed] = useState<NewsItem[]>(initialNews);

    useEffect(() => {
        if (lastMessage && lastMessage.type === 'news_update') {
            const d = lastMessage.data;
            if (!d || typeof d !== 'object') return;

            const payload = d as Record<string, unknown>;
            const title = typeof payload.title === 'string' ? payload.title : 'Market update';
            const sentimentRaw = payload.sentiment;
            const sentiment: Sentiment =
                sentimentRaw === 'positive' || sentimentRaw === 'negative' || sentimentRaw === 'neutral'
                    ? sentimentRaw
                    : 'neutral';
            const impactScore = Number(payload.impactScore);

            const timer = setTimeout(() => {
                setNewsFeed(prev => [{
                    id: Date.now(),
                    title,
                    summary: 'Real-time update from market feed.',
                    sentiment,
                    time: 'just now',
                    impactedStocks: ['LIVE'],
                    impactScore: Number.isFinite(impactScore) ? impactScore : 5,
                    isNew: true,
                }, ...prev.slice(0, 9)]);
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [lastMessage]);

    const filtered = sentimentFilter === 'all' ? newsFeed : newsFeed.filter(n => n.sentiment === sentimentFilter);
    const previewNews = filtered.slice(0, MAX_HOME_NEWS);
    const hasMoreNews = filtered.length > MAX_HOME_NEWS;
    const counts = {
        all: newsFeed.length,
        positive: newsFeed.filter(n => n.sentiment === 'positive').length,
        negative: newsFeed.filter(n => n.sentiment === 'negative').length,
        neutral: newsFeed.filter(n => n.sentiment === 'neutral').length,
    };

    const redirectToNewsIntel = () => {
        window.location.href = '/market-intelligence';
    };

    return (
        <section id="news" className="py-10 sm:py-14 md:py-20 lg:py-24 bg-finance-dark relative overflow-hidden px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
            {/* Background orbs */}
            <motion.div
                className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 9, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 7, repeat: Infinity, delay: 2 }}
            />
            {/* Grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(251,191,36,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.02) 1px, transparent 1px)',
                    backgroundSize: '56px 56px',
                }}
            />

            <div className="max-w-7xl mx-auto relative">

                {/* â”€â”€ Header â”€â”€ */}
                <div className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-3 mb-6 flex-wrap"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-finance-gold/10 border border-finance-gold/20 rounded-full">
                            <Radio className="w-4 h-4 text-finance-gold" />
                            <span className="text-xs text-finance-gold font-black uppercase tracking-[0.2em]">Market Intel</span>
                        </div>

                        {/* Live/offline pill */}
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold border ${
                            isConnected
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                            {isConnected ? (
                                <>
                                    <motion.span
                                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                                        animate={{ opacity: [1, 0.2, 1] }}
                                        transition={{ duration: 1.1, repeat: Infinity }}
                                    />
                                    <Wifi className="w-3.5 h-3.5" /> LIVE FEED
                                </>
                            ) : (
                                <>
                                    <WifiOff className="w-3.5 h-3.5" /> OFFLINE
                                </>
                            )}
                        </div>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 md:mb-5 leading-tight"
                    >
                        Real-Time{' '}
                        <span className="relative inline-block">
                            <span className="text-finance-gold glow-gold">Intelligence</span>
                            <motion.span
                                className="absolute -bottom-1 left-0 h-0.75 w-full rounded-full"
                                style={{ transformOrigin: 'left', background: 'linear-gradient(90deg, #fbbf24, transparent)' }}
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.7 }}
                            />
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-lg"
                    >
                        AI-powered sentiment analysis on breaking market news
                    </motion.p>
                </div>

                {/* â”€â”€ Scrolling ticker strip â”€â”€ */}
                <div className="mb-10 overflow-hidden rounded-xl border border-finance-border/30 bg-finance-card/30 backdrop-blur h-9 flex items-center relative">
                    <div className="shrink-0 px-4 h-full bg-finance-gold flex items-center z-10">
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                            <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 0.9, repeat: Infinity }}>
                                {"\u25CF"}
                            </motion.span>
                            LIVE
                        </span>
                    </div>
                    <div className="overflow-hidden flex-1">
                        <motion.div
                            className="flex items-center gap-10 whitespace-nowrap pl-6"
                            animate={{ x: ['0%', '-50%'] }}
                            transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
                        >
                            {[...newsFeed, ...newsFeed].map((n, i) => (
                                <span key={i} className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                                    <span className={`w-1.5 h-1.5 rounded-full ${SENTIMENT_CONFIG[n.sentiment].dot}`} />
                                    <span className="text-slate-300 font-medium">{n.title}</span>
                                    <span className="text-slate-600">{"\u2022"}</span>
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* â”€â”€ Filter tabs â”€â”€ */}
                <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
                    {(['all', 'positive', 'negative', 'neutral'] as const).map((f) => {
                        const icons = {
                            all: Newspaper,
                            positive: TrendingUp,
                            negative: TrendingDown,
                            neutral: Activity,
                        };
                        const FilterIcon = icons[f];
                        const isActive = sentimentFilter === f;
                        return (
                            <motion.button
                                key={f}
                                onClick={() => setSentimentFilter(f)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className={`relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all duration-200 ${
                                    isActive
                                        ? 'bg-finance-gold text-slate-900 border-finance-gold shadow-lg shadow-finance-gold/20'
                                        : 'bg-finance-card/50 text-slate-400 border-finance-border hover:border-finance-border hover:text-white hover:bg-finance-card'
                                }`}
                            >
                                <FilterIcon className="w-3.5 h-3.5" />
                                {f}
                                <span className={`ml-0.5 text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                                    isActive ? 'bg-slate-900/20 text-slate-900' : 'bg-finance-darker text-slate-500'
                                }`}>
                                    {counts[f]}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* â”€â”€ News grid â”€â”€ */}
                <AnimatePresence mode="popLayout">
                    {filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-20 border-2 border-dashed border-finance-border/30 rounded-2xl"
                        >
                            <Newspaper className="w-12 h-12 text-finance-gold/20 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No signals for this filter</p>
                        </motion.div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
                            {previewNews.map((n, i) => (
                                <CompactCard key={n.id} news={n} delay={i * 0.05} onSelect={redirectToNewsIntel} />
                            ))}
                        </div>
                    )}
                </AnimatePresence>

                {filtered.length > 0 && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={redirectToNewsIntel}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-finance-gold/30 bg-finance-gold/10 text-finance-gold text-xs font-black uppercase tracking-widest hover:bg-finance-gold/20 transition-all"
                        >
                            View All News Intel
                            <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        {hasMoreNews && (
                            <p className="text-xs text-slate-500 mt-3">
                                Showing top {MAX_HOME_NEWS} signals here. Open News Intel for the full feed.
                            </p>
                        )}
                    </div>
                )}

                {/* Deep Analysis Modal */}
                {selectedNews && showDeepAnalysis && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDeepAnalysis(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-finance-darker border border-finance-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-finance-border/30 bg-linear-to-r from-finance-card/50 to-transparent">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-finance-gold" />
                                        <div>
                                            <h2 className="text-xl font-black text-white">Deep Analysis</h2>
                                            <p className="text-xs text-slate-400 mt-1">AI-powered market intelligence</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={() => setShowDeepAnalysis(false)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-9 h-9 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
                                    >
                                        ✕
                                    </motion.button>
                                </div>
                                <h3 className="text-lg font-bold text-white line-clamp-2">{selectedNews.title}</h3>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Summary</h4>
                                    <p className="text-slate-400 leading-relaxed">{selectedNews.summary}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Potentially Affected Assets</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedNews.impactedStocks.map((stock, idx) => (
                                            <motion.span
                                                key={stock}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="px-4 py-2 rounded-lg bg-finance-card border border-finance-border text-sm font-bold text-finance-gold"
                                            >
                                                ${stock}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Market Impact Analysis</h4>
                                    {[
                                        { label: 'Sentiment Direction', value: selectedNews.sentiment === 'positive' ? '↑ BULLISH' : selectedNews.sentiment === 'negative' ? '↓ BEARISH' : '→ NEUTRAL' },
                                        { label: 'Impact Score', value: `${selectedNews.impactScore}/10` },
                                        { label: 'Market Reaction', value: selectedNews.impactScore >= 8 ? 'HIGH VOLATILITY' : selectedNews.impactScore >= 6 ? 'MODERATE VOLATILITY' : 'LOW VOLATILITY' },
                                        { label: 'Recommendation', value: selectedNews.sentiment === 'positive' ? 'FAVORABLE CONDITIONS' : selectedNews.sentiment === 'negative' ? 'CAUTION ADVISED' : 'NEUTRAL STANCE' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-finance-card/50 border border-finance-border/30">
                                            <span className="text-xs font-bold text-slate-400 uppercase">{item.label}</span>
                                            <span className={`text-sm font-black ${selectedNews.sentiment === 'positive' ? 'text-emerald-400' : selectedNews.sentiment === 'negative' ? 'text-rose-400' : 'text-blue-400'}`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Risk Level</h4>
                                    <div className="h-2 bg-finance-card rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${selectedNews.impactScore * 10}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            className={`h-full rounded-full ${selectedNews.sentiment === 'positive' ? 'bg-emerald-500' : selectedNews.sentiment === 'negative' ? 'bg-rose-500' : 'bg-blue-500'}`}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Risk indicator based on impact score and volatility</p>
                                </div>

                                <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-900/30 border border-slate-800/30">
                                    <Clock className="w-4 h-4 text-slate-500" />
                                    <span className="text-xs text-slate-400">Last updated: <span className="text-slate-300 font-semibold">{selectedNews.time}</span></span>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-4 border-t border-finance-border/30 bg-finance-card/30 flex gap-3">
                                <motion.button
                                    onClick={() => setShowDeepAnalysis(false)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-1 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
                                >
                                    Close
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-1 py-2.5 px-4 rounded-lg bg-linear-to-r from-finance-gold to-yellow-400 text-slate-900 font-bold text-sm hover:shadow-lg hover:shadow-finance-gold/40 transition-all"
                                >
                                    Action on Insight
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Selected News Detail Panel */}
                {selectedNews && !showDeepAnalysis && (
                    <motion.div
                        initial={{ opacity: 0, x: 400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 400 }}
                        className="fixed right-0 top-0 bottom-0 w-100 max-w-[90vw] bg-finance-darker border-l border-finance-border overflow-hidden flex flex-col z-40 shadow-lg"
                    >
                        <motion.button
                            onClick={() => setSelectedNews(null)}
                            whileHover={{ scale: 1.1 }}
                            className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center z-10 text-lg"
                        >
                            ✕
                        </motion.button>

                        <div className="p-6 pb-4 border-b border-finance-border/30">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${SENTIMENT_CONFIG[selectedNews.sentiment].badge}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${SENTIMENT_CONFIG[selectedNews.sentiment].dot}`} />
                                    {SENTIMENT_CONFIG[selectedNews.sentiment].label}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white leading-tight line-clamp-3">{selectedNews.title}</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div>
                                <p className="text-sm text-slate-400 leading-relaxed">{selectedNews.summary}</p>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Impact Score</span>
                                    <span className="text-lg font-black text-finance-gold">{selectedNews.impactScore}/10</span>
                                </div>
                                <div className="h-2 bg-finance-card rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${selectedNews.impactScore * 10}%` }}
                                        transition={{ duration: 0.6 }}
                                        className={`h-full rounded-full ${SENTIMENT_CONFIG[selectedNews.sentiment].bar}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Affected Assets</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedNews.impactedStocks.map((stock) => (
                                        <span key={stock} className="px-2.5 py-1 bg-finance-card border border-finance-border rounded-lg text-[10px] font-bold text-slate-300">${stock}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-3 rounded-lg bg-finance-card/50 border border-finance-border/30">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Category</div>
                                <div className="text-sm font-bold text-white">Market Moving</div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-finance-border/30 bg-finance-card/50">
                            <motion.button
                                onClick={() => setShowDeepAnalysis(true)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-3 rounded-lg bg-linear-to-r from-finance-gold to-yellow-400 text-slate-900 font-black uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-finance-gold/40 transition-all"
                            >
                                → Deep Analysis
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
};


export default MarketIntelligenceReal;
