'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp, TrendingDown, Activity, Wallet, Shield, BrainCircuit,
    Zap, Trophy, BookOpen, BarChart3, PieChart, LineChart as LineChartIcon,
    ChevronRight, ArrowUpRight, ArrowDownRight, Globe,
    Swords, Newspaper, Vault, GraduationCap, CheckCircle2, Lock, RefreshCw,
    Sparkles, Radio, FlameKindling, BadgeDollarSign, CircleDot, Users,
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend, Filler, ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement);

/* ----------------------------------------------------------
   TYPES
---------------------------------------------------------- */

interface StockQuote {
    price: number;
    change: number;
    changePercent: number;
    loading: boolean;
    error: boolean;
}

interface WatchItem {
    symbol: string;
    name: string;
    price: string;
    pct: string;
    isPositive: boolean;
    exchange: string;
}

interface InsightItem {
    type: 'bullish' | 'bearish' | 'warning' | 'neutral';
    title: string;
    desc: string;
    time: string;
    confidence: number;
}

interface AcademyModule {
    title: string;
    progress: number;
    xpEarned: number;
    xpTotal: number;
    status: 'complete' | 'active' | 'locked';
    color: string;
}

interface IndexItem {
    label: string;
    value: string;
    change: string;
    isPositive: boolean;
}

type BetDirection = 'up' | 'down' | null;

interface OpenBet {
    id: number;
    symbol: string;
    direction: 'up' | 'down';
    stake: number;
    targetPct: number;
    entryPrice: number;
    expiry: string;
    odds: number;
    status: 'open' | 'won' | 'lost';
    placedAt: number;
}

const PREDICTION_SYMBOLS = ['TSLA', 'AAPL', 'NVDA', 'BTC/USD', 'NIFTY 50', 'MSFT'] as const;
type PredSymbol = typeof PREDICTION_SYMBOLS[number];

const PRED_PRICES: Record<PredSymbol, { price: number; currency: string }> = {
    'TSLA':    { price: 248.62, currency: '$' },
    'AAPL':    { price: 198.45, currency: '$' },
    'NVDA':    { price: 892.30, currency: '$' },
    'BTC/USD': { price: 87420,  currency: '$' },
    'NIFTY 50':{ price: 22641,  currency: '₹' },
    'MSFT':    { price: 415.89, currency: '$' },
};

const TV_SYMBOL_MAP: Record<PredSymbol, string> = {
    'TSLA':     'NASDAQ:TSLA',
    'AAPL':     'NASDAQ:AAPL',
    'NVDA':     'NASDAQ:NVDA',
    'BTC/USD':  'BINANCE:BTCUSDT',
    'NIFTY 50': 'NSE:NIFTY',
    'MSFT':     'NASDAQ:MSFT',
};

const PRED_STATS: Record<PredSymbol, { high52w: string; low52w: string; mktCap: string; avgVol: string; pe: string }> = {
    'TSLA':     { high52w: '$488.54', low52w: '$138.80', mktCap: '$797B',  avgVol: '112M',  pe: '89.4x'  },
    'AAPL':     { high52w: '$237.23', low52w: '$164.08', mktCap: '$3.01T', avgVol: '54.2M', pe: '31.2x'  },
    'NVDA':     { high52w: '$974.00', low52w: '$435.22', mktCap: '$2.19T', avgVol: '48.7M', pe: '52.8x'  },
    'BTC/USD':  { high52w: '$109K',   low52w: '$49.1K',  mktCap: '$1.72T', avgVol: '$58B',  pe: 'N/A'    },
    'NIFTY 50': { high52w: '₹26,277', low52w: '₹21,964', mktCap: '₹388T', avgVol: '320M',  pe: '22.1x'  },
    'MSFT':     { high52w: '$468.35', low52w: '$376.23', mktCap: '$3.09T', avgVol: '22.1M', pe: '34.7x'  },
};

// 14-bar OHLC-like dataset for prediction chart (last 14 sessions)
const PRED_CHART_DATA: Record<PredSymbol, { labels: string[]; close: number[]; volume: number[] }> = {
    'TSLA': {
        labels: ['Feb 19','Feb 20','Feb 21','Feb 24','Feb 25','Feb 26','Feb 27','Feb 28','Mar 3','Mar 4','Mar 5','Mar 6','Mar 7','Mar 8'],
        close:  [265.1,258.4,253.7,248.0,260.2,255.8,268.4,261.0,256.3,270.1,263.9,252.4,259.7,248.6],
        volume: [38,42,55,61,48,52,45,58,67,73,49,82,56,71],
    },
    'AAPL': {
        labels: ['Feb 19','Feb 20','Feb 21','Feb 24','Feb 25','Feb 26','Feb 27','Feb 28','Mar 3','Mar 4','Mar 5','Mar 6','Mar 7','Mar 8'],
        close:  [191.0,193.5,196.2,194.8,197.1,195.9,199.2,197.4,196.0,200.3,199.1,197.8,200.0,198.5],
        volume: [22,27,31,28,34,25,30,23,29,38,26,32,21,35],
    },
    'NVDA': {
        labels: ['Feb 19','Feb 20','Feb 21','Feb 24','Feb 25','Feb 26','Feb 27','Feb 28','Mar 3','Mar 4','Mar 5','Mar 6','Mar 7','Mar 8'],
        close:  [820,838,852,845,865,858,875,862,848,881,873,861,884,892],
        volume: [55,61,70,65,78,60,74,66,72,88,68,75,63,92],
    },
    'BTC/USD': {
        labels: ['Feb 19','Feb 20','Feb 21','Feb 24','Feb 25','Feb 26','Feb 27','Feb 28','Mar 3','Mar 4','Mar 5','Mar 6','Mar 7','Mar 8'],
        close:  [84200,85600,83400,86100,88200,85900,89400,87100,85800,90200,88700,86300,89100,87420],
        volume: [44,52,68,58,72,55,65,83,70,94,62,88,57,80],
    },
    'NIFTY 50': {
        labels: ['Feb 19','Feb 20','Feb 21','Feb 24','Feb 25','Feb 26','Feb 27','Feb 28','Mar 3','Mar 4','Mar 5','Mar 6','Mar 7','Mar 8'],
        close:  [22100,22350,22180,22420,22680,22510,22760,22590,22380,22810,22650,22490,22720,22641],
        volume: [18,22,28,24,31,20,26,19,25,34,22,29,17,32],
    },
    'MSFT': {
        labels: ['Feb 19','Feb 20','Feb 21','Feb 24','Feb 25','Feb 26','Feb 27','Feb 28','Mar 3','Mar 4','Mar 5','Mar 6','Mar 7','Mar 8'],
        close:  [405,409,412,407,415,411,418,413,410,420,417,414,419,416],
        volume: [15,18,21,17,24,16,22,15,20,28,19,23,14,26],
    },
};

const SAMPLE_OPEN_BETS: OpenBet[] = [
    { id: 1, symbol: 'AAPL',  direction: 'up',   stake: 500,  targetPct: 2.0, entryPrice: 198.45, expiry: 'EOD',    odds: 1.85, status: 'open', placedAt: Date.now() - 30000 },
    { id: 2, symbol: 'BTC/USD', direction: 'down', stake: 1000, targetPct: 3.5, entryPrice: 87420,  expiry: '24h',    odds: 2.10, status: 'open', placedAt: Date.now() - 25000 },
    { id: 3, symbol: 'NVDA',  direction: 'up',   stake: 750,  targetPct: 5.0, entryPrice: 892.30, expiry: '1 Week', odds: 2.40, status: 'won',  placedAt: Date.now() - 200000 },
    { id: 4, symbol: 'MSFT',  direction: 'down', stake: 400,  targetPct: 1.5, entryPrice: 415.89, expiry: 'EOD',    odds: 1.70, status: 'lost', placedAt: Date.now() - 180000 },
];

/* ----------------------------------------------------------
   STATIC DATA
---------------------------------------------------------- */

const TIMEFRAME_DATA: Record<string, { labels: string[]; values: number[] }> = {
    '1D': {
        labels: ['9:30','10:00','10:30','11:00','11:30','12:00','12:30','1:00','1:30','2:00','2:30','3:00','3:30','4:00'],
        values: [2450000,2463200,2455800,2473100,2488400,2479600,2491200,2485500,2497800,2502300,2511000,2508400,2519200,2524700],
    },
    '1W': {
        labels: ['Mon','Tue','Wed','Thu','Fri','Today'],
        values: [2410000,2438000,2422000,2455000,2489000,2524700],
    },
    '1M': {
        labels: ['Feb 7','Feb 14','Feb 21','Feb 28','Mar 7'],
        values: [2330000,2368000,2405000,2452000,2524700],
    },
    '1Y': {
        labels: ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],
        values: [1920000,2010000,2080000,2150000,2230000,2180000,2290000,2340000,2280000,2370000,2450000,2524700],
    },
    'ALL': {
        labels: ['2022','2023','2024','2025','2026'],
        values: [1250000,1580000,1830000,2180000,2524700],
    },
};

const WATCHLIST_STATIC: WatchItem[] = [
    { symbol: 'AAPL',  name: 'Apple Inc.',          price: '$198.45',  pct: '+0.62%', isPositive: true,  exchange: 'NASDAQ' },
    { symbol: 'NVDA',  name: 'NVIDIA Corporation',  price: '$892.30',  pct: '+4.72%', isPositive: true,  exchange: 'NASDAQ' },
    { symbol: 'MSFT',  name: 'Microsoft Corp.',     price: '$415.89',  pct: '-0.50%', isPositive: false, exchange: 'NASDAQ' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.',       price: '$187.45',  pct: '+1.69%', isPositive: true,  exchange: 'NASDAQ' },
    { symbol: 'AMZN',  name: 'Amazon.com Inc.',     price: '$232.10',  pct: '-0.80%', isPositive: false, exchange: 'NASDAQ' },
    { symbol: 'INFY',  name: 'Infosys Ltd.',        price: '₹1,892', pct: '+0.87%', isPositive: true, exchange: 'NSE' },
];

const MARKET_INDICES: IndexItem[] = [
    { label: 'S&P 500',   value: '5,824.32',  change: '+0.72%', isPositive: true  },
    { label: 'NASDAQ',    value: '18,430.1',  change: '+1.04%', isPositive: true  },
    { label: 'NIFTY 50',  value: '22,641.8',  change: '-0.31%', isPositive: false },
    { label: 'BTC/USD',   value: '$87,420',   change: '+2.87%', isPositive: true  },
    { label: 'GOLD',      value: '$2,913',    change: '+0.42%', isPositive: true  },
    { label: 'DXY',       value: '104.23',    change: '-0.18%', isPositive: false },
];

const AI_INSIGHTS: InsightItem[] = [
    { type: 'bullish',  title: 'NVDA Breakout Confirmed',        desc: 'Cup-and-handle on 4H with rising OBV. All-time high retest likely. Target: $960.', time: '4m ago',  confidence: 91 },
    { type: 'warning',  title: 'Portfolio Overweight: Tech',     desc: 'Tech exposure at 54%, above the 45% strategic threshold. Rotate 10-15% to Energy.', time: '31m ago', confidence: 83 },
    { type: 'bearish',  title: 'BTC Triple-Top at $97K',        desc: 'Three rejections at $97K. Fibonacci retracement projects $88,400 as next support.', time: '1h ago',  confidence: 74 },
    { type: 'bullish',  title: 'RBI Cut: NIFTY Rate Catalyst',  desc: 'Expected 25bps cut Thursday. Banking & NBFC indices historically +3-5% in 7 days.', time: '2h ago',  confidence: 87 },
    { type: 'neutral',  title: 'CPI Print \u2014 Thursday 8:30 ET', desc: 'Core CPI est. 3.1% YoY. Surprise in either direction may swing NASDAQ \u00B12%.', time: '3h ago',  confidence: 78 },
];

const ACADEMY_MODULES: AcademyModule[] = [
    { title: 'Technical Analysis 101',  progress: 100, xpEarned: 500,  xpTotal: 500,  status: 'complete', color: '#10b981' },
    { title: 'Options Strategy Basics', progress: 68,  xpEarned: 680,  xpTotal: 1000, status: 'active',   color: '#3b82f6' },
    { title: 'Macro Economics Deep',    progress: 12,  xpEarned: 144,  xpTotal: 1200, status: 'locked',   color: '#8b5cf6' },
];

const ALLOCATION_LABELS = ['Technology', 'Financials', 'Energy', 'Crypto', 'Cash'];
const ALLOCATION_VALUES = [37, 22, 18, 15, 8];
const ALLOCATION_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

const PLATFORM_MODULES = [
    { label: 'War Room',     icon: Swords,        colorCls: 'text-amber-400',   bgCls: 'bg-amber-500/10 border-amber-500/20',   desc: 'Live Stock Analysis',  hash: '#war-room'  },
    { label: 'Market Intel', icon: Newspaper,     colorCls: 'text-purple-400',  bgCls: 'bg-purple-500/10 border-purple-500/20', desc: 'Live AI Insights',     hash: '#news'      },
    { label: 'Learning Hub', icon: GraduationCap, colorCls: 'text-blue-400',    bgCls: 'bg-blue-500/10 border-blue-500/20',     desc: 'Courses & Quizzes',    hash: '#learning'  },
    { label: 'Portfolio',    icon: Vault,         colorCls: 'text-emerald-400', bgCls: 'bg-emerald-500/10 border-emerald-500/20', desc: 'Track & Analyze',   hash: '#playground'},
];

const LIVE_ACTIVITY = [
    { type: 'buy',     msg: 'S&P 500 index fund rebalanced \u2014 +1.2% drift corrected', time: '3m',  pos: null  },
    { type: 'signal',  msg: 'FinMind AI: MSFT bullish flag pattern \u2014 91% confidence',   time: '6m',  pos: true  },
    { type: 'alert',   msg: 'Portfolio beta exceeded 1.3 \u2014 risk threshold triggered',   time: '14m', pos: false },
    { type: 'close',   msg: 'TSLA covered call expired worthless \u2014 premium kept',        time: '22m', pos: true  },
    { type: 'news',    msg: 'Fed holds rates: 10Y treasury yield drops 8bps',               time: '31m', pos: null  },
];

/* ----------------------------------------------------------
   ANIMATION VARIANTS
---------------------------------------------------------- */

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const fadeUp = {
    hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
    show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.65, ease: EXPO } },
};
const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

/* ----------------------------------------------------------
   SUB-COMPONENTS
---------------------------------------------------------- */

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`relative bg-[#0f172a]/70 backdrop-blur-xl border border-slate-800/60 rounded-2xl overflow-hidden ${className}`}>
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-700/50 to-transparent" />
        {children}
    </div>
);

interface KPIProps {
    title: string; value: string; change: string; isPositive: boolean;
    icon: React.ElementType; accentBg: string; accentColor: string; sub?: string;
}
const KPICard = ({ title, value, change, isPositive, icon: Icon, accentBg, accentColor, sub }: KPIProps) => (
    <motion.div variants={fadeUp}>
        <Card className="p-4 sm:p-5 hover:border-slate-700/80 transition-colors group cursor-default h-full">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2.5 rounded-xl border ${accentBg} ${accentColor} group-hover:scale-110 transition-transform`}>
                    <Icon size={17} />
                </div>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    isPositive
                        ? 'bg-emerald-500/8 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/8 text-rose-400 border-rose-500/20'
                }`}>
                    {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {change}
                </span>
            </div>
            <p className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-[0.12em] sm:tracking-[0.15em] mb-1">{title}</p>
            <p className="text-xl min-[360px]:text-2xl font-extrabold text-white tracking-tight leading-none wrap-break-word">{value}</p>
            {sub && <p className="text-[10px] text-slate-700 mt-1.5">{sub}</p>}
        </Card>
    </motion.div>
);

const WatchlistRow = ({ symbol, name, price, pct, isPositive, exchange, loading = false }: WatchItem & { loading?: boolean }) => (
    <div className="group flex items-center gap-3 px-3.5 py-3 rounded-xl bg-[#0d1320]/90 border border-slate-800/50 hover:border-slate-700/80 hover:bg-[#0d1320] transition-all cursor-pointer relative overflow-hidden">
        <div className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl ${isPositive ? 'bg-emerald-500/70' : 'bg-rose-500/70'}`} />
        <div className="ml-1 flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[13px] text-white">{symbol}</span>
                    <span className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">{exchange}</span>
                </div>
                {loading
                    ? <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
                    : <span className="font-bold text-white font-mono text-[13px]">{price}</span>
                }
            </div>
            <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-600 truncate">{name}</span>
                {loading
                    ? <div className="h-3 w-10 bg-slate-800 rounded animate-pulse" />
                    : <span className={`text-[11px] font-bold flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                        {pct}
                      </span>
                }
            </div>
        </div>
    </div>
);

const InsightRow = ({ type, title, desc, time, confidence }: InsightItem) => {
    const map = {
        bullish: { dot: 'bg-emerald-500', text: 'text-emerald-400', label: 'BULL', ring: 'bg-emerald-500/8' },
        bearish: { dot: 'bg-rose-500',    text: 'text-rose-400',    label: 'BEAR', ring: 'bg-rose-500/8'    },
        warning: { dot: 'bg-amber-500',   text: 'text-amber-400',   label: 'WARN', ring: 'bg-amber-500/8'   },
        neutral: { dot: 'bg-blue-500',    text: 'text-blue-400',    label: 'INFO', ring: 'bg-blue-500/8'    },
    };
    const c = map[type];
    return (
        <div className={`flex gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl border border-slate-800/50 hover:border-slate-700 ${c.ring} cursor-pointer transition-all group`}>
            <div className="flex flex-col items-center gap-1 pt-1 shrink-0">
                <span className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${c.dot}`} />
                <div className="flex-1 w-px bg-slate-800/60" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-0.5 sm:mb-1">
                    <h4 className="text-xs sm:text-sm md:text-[13px] font-bold text-slate-200 group-hover:text-white transition-colors leading-snug">{title}</h4>
                    <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                        <span className={`text-[8px] sm:text-[9px] font-black ${c.text}`}>{confidence}%</span>
                        <span className="text-[9px] sm:text-[10px] text-slate-700">{time}</span>
                    </div>
                </div>
                <p className="text-xs sm:text-[11px] md:text-[12px] text-slate-600 leading-relaxed line-clamp-2">{desc}</p>
            </div>
        </div>
    );
};

const ModuleCard = ({ title, progress, xpEarned, xpTotal, status, color }: AcademyModule) => (
    <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl bg-[#0d1320]/80 border border-slate-800/50 hover:border-slate-700 transition-all group cursor-pointer">
        <div className="shrink-0">
            {status === 'complete'
                ? <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg sm:rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  </div>
                : status === 'locked'
                ? <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg sm:rounded-xl bg-slate-800/60 border border-slate-800 flex items-center justify-center">
                    <Lock size={13} className="text-slate-600" />
                  </div>
                : <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg sm:rounded-xl border border-slate-700/50 flex items-center justify-center" style={{ background: `${color}18` }}>
                    <BookOpen size={13} style={{ color }} />
                  </div>
            }
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-slate-300 group-hover:text-white transition-colors truncate">{title}</span>
                <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-slate-700 shrink-0 ml-1 sm:ml-2">{xpEarned}/{xpTotal} XP</span>
            </div>
            <div className="h-1 sm:h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progress}%`, background: status === 'complete' ? '#10b981' : color }} />
            </div>
        </div>
    </div>
);

const IndexCard = ({ label, value, change, isPositive }: IndexItem) => (
    <div className="flex-1 min-w-20 sm:min-w-28 md:min-w-32 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl bg-[#0d1320]/80 border border-slate-800/50 hover:border-slate-700 transition-all group cursor-pointer">
        <div className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-slate-600 uppercase tracking-wider sm:tracking-widest mb-1 sm:mb-2 truncate">{label}</div>
        <div className="text-xs sm:text-sm md:text-base lg:text-lg font-extrabold text-white font-mono mb-1 sm:mb-1.5 truncate">{value}</div>
        <div className={`text-[9px] sm:text-[10px] md:text-xs font-bold flex items-center gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {change}
        </div>
    </div>
);

/* ----------------------------------------------------------
   MAIN DASHBOARD
---------------------------------------------------------- */

const Dashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [marketStatus, setMarketStatus] = useState<'open' | 'premarket' | 'closed'>('closed');
    const [activeTimeframe, setActiveTimeframe] = useState('1D');
    const [tsla, setTsla] = useState<StockQuote>({ price: 0, change: 0, changePercent: 0, loading: true, error: false });

    // Prediction arena state
    const [predSymbol, setPredSymbol] = useState<PredSymbol>('TSLA');
    const [betDir, setBetDir] = useState<BetDirection>(null);
    const [stake, setStake] = useState<string>('500');
    const [expiry, setExpiry] = useState<string>('EOD');
    const [betPlaced, setBetPlaced] = useState(false);
    const [openBets, setOpenBets] = useState<OpenBet[]>(SAMPLE_OPEN_BETS);
    const [showMarketModal, setShowMarketModal] = useState(false);
    const [isTinyScreen, setIsTinyScreen] = useState(false);
    const settlementTimersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

    useEffect(() => {
        const updateScreenSize = () => setIsTinyScreen(window.innerWidth < 360);
        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);
        return () => window.removeEventListener('resize', updateScreenSize);
    }, []);

    // Live clock + market status
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            setCurrentTime(now);
            // NYSE hours in EST (UTC-5 rough approximation)
            const estHour = now.getUTCHours() - 5;
            const estMin  = now.getUTCMinutes();
            const totalMin = estHour * 60 + estMin;
            if (totalMin >= 570 && totalMin < 960) setMarketStatus('open');
            else if (totalMin >= 540 && totalMin < 570) setMarketStatus('premarket');
            else setMarketStatus('closed');
        };
        tick();
        const t = setInterval(tick, 1000);
        return () => clearInterval(t);
    }, []);

    // TSLA live data
    const fetchTsla = useCallback(async () => {
        try {
            const res = await fetch('/api/stock?symbol=TSLA');
            if (!res.ok) throw new Error('fetch');
            const d = await res.json();
            const payload = d?.data ?? d;
            const price = Number(payload?.price);
            const change = Number(payload?.change);
            const changePercent = Number(payload?.changePercent);

            if (!Number.isFinite(price) || !Number.isFinite(change) || !Number.isFinite(changePercent)) {
                throw new Error('invalid stock payload');
            }

            setTsla({
                price,
                change,
                changePercent,
                loading: false,
                error: false,
            });
        } catch {
            setTsla(prev => ({ ...prev, loading: false, error: true }));
        }
    }, []);

    useEffect(() => {
        fetchTsla();
        const id = setInterval(fetchTsla, 15_000);
        return () => clearInterval(id);
    }, [fetchTsla]);

    const tslaPos = tsla.changePercent >= 0;

    // Prediction arena helpers
    const predData = PRED_CHART_DATA[predSymbol];
    const predPrice = PRED_PRICES[predSymbol];
    const predMin = Math.min(...predData.close);
    const predMax = Math.max(...predData.close);
    const predTrend = predData.close[predData.close.length - 1] >= predData.close[0];
    const upOdds = predTrend ? 1.75 : 2.20;
    const downOdds = predTrend ? 2.20 : 1.75;
    const activeOdds = betDir === 'up' ? upOdds : betDir === 'down' ? downOdds : 0;
    const potentialReturn = betDir ? (parseFloat(stake) || 0) * activeOdds : 0;
    const stakeNum = parseFloat(stake) || 0;

    const handlePlaceBet = () => {
        if (!betDir || stakeNum <= 0) return;
        const newBet: OpenBet = {
            id: Date.now(),
            symbol: predSymbol,
            direction: betDir,
            stake: stakeNum,
            targetPct: betDir === 'up' ? 2.5 : 2.5,
            entryPrice: predPrice.price,
            expiry,
            odds: activeOdds,
            status: 'open',
            placedAt: Date.now(),
        };
        setOpenBets(prev => [newBet, ...prev]);
        setBetPlaced(true);
        
        setTimeout(() => setBetPlaced(false), 2000);
        setBetDir(null);
        setStake('500');
    };

    const settleOpenBet = useCallback((betId: number) => {
        setOpenBets(prev => prev.map(b => {
            if (b.id !== betId || b.status !== 'open') return b;
            const won = Math.random() < 0.60;
            return { ...b, status: won ? 'won' : 'lost' };
        }));

        const timer = settlementTimersRef.current[betId];
        if (timer) {
            clearTimeout(timer);
            delete settlementTimersRef.current[betId];
        }
    }, []);

    const getSettlementDelay = (betExpiry: string) => {
        const baseDelayByExpiry: Record<string, number> = {
            '1h': 10000,
            '4h': 13000,
            'EOD': 16000,
            '24h': 19000,
            '1 Week': 24000,
        };
        const base = baseDelayByExpiry[betExpiry] ?? 15000;
        return base + Math.floor(Math.random() * 5000);
    };

    // Calculate performance metrics
    const totalBets = openBets.length;
    const wonBets = openBets.filter(b => b.status === 'won');
    const lostBets = openBets.filter(b => b.status === 'lost');
    const activeBets = openBets.filter(b => b.status === 'open');
    const totalWin = wonBets.reduce((sum, b) => sum + (b.stake * b.odds - b.stake), 0);
    const totalLoss = lostBets.reduce((sum, b) => sum + b.stake, 0);
    const netProfit = totalWin - totalLoss;
    const winRate = totalBets > 0 ? (wonBets.length / totalBets * 100).toFixed(1) : 0;

    // Keep all active bets moving into results over time in demo mode.
    useEffect(() => {
        activeBets.forEach((bet) => {
            if (settlementTimersRef.current[bet.id]) return;

            const elapsed = Date.now() - bet.placedAt;
            const delay = Math.max(1200, getSettlementDelay(bet.expiry) - elapsed);

            settlementTimersRef.current[bet.id] = setTimeout(() => {
                settleOpenBet(bet.id);
            }, delay);
        });
    }, [activeBets, settleOpenBet]);

    useEffect(() => {
        return () => {
            Object.values(settlementTimersRef.current).forEach((timer) => clearTimeout(timer));
            settlementTimersRef.current = {};
        };
    }, []);

    // Chart data & options
    const tf = TIMEFRAME_DATA[activeTimeframe];
    const chartData = {
        labels: tf.labels,
        datasets: [{
            label: 'Portfolio',
            data: tf.values,
            borderColor: '#10b981',
            backgroundColor: (ctx: { chart: { ctx: CanvasRenderingContext2D; height?: number } }) => {
                const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height ?? 280);
                gradient.addColorStop(0, 'rgba(16,185,129,0.18)');
                gradient.addColorStop(1, 'rgba(16,185,129,0)');
                return gradient;
            },
            tension: 0.42,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 5,
            borderWidth: 2,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: '#1e293b',
                titleColor: '#94a3b8',
                bodyColor: '#e2e8f0',
                borderColor: '#334155',
                borderWidth: 1,
                padding: 10,
                callbacks: { label: (c: { raw: unknown }) => `₹${((c.raw as number) / 100000).toFixed(2)}L` },
            },
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: '#475569', font: { size: 10 } as const } },
            y: { grid: { color: 'rgba(51,65,85,0.22)' }, ticks: { display: false } },
        },
        interaction: { mode: 'nearest' as const, axis: 'x' as const, intersect: false },
    };

    const doughnutData = {
        labels: ALLOCATION_LABELS,
        datasets: [{
            data: ALLOCATION_VALUES,
            backgroundColor: ALLOCATION_COLORS,
            borderWidth: 0,
            hoverOffset: 4,
        }],
    };

    const doughnutOptions = {
        cutout: '76%',
        plugins: {
            legend: { display: false },
            tooltip: { backgroundColor: '#1e293b', bodyColor: '#e2e8f0', borderColor: '#334155', borderWidth: 1 },
        },
    } as const;

    const marketStatusCfg = {
        open:      { label: 'MARKET OPEN',   color: 'text-emerald-400', dot: 'bg-emerald-400' },
        premarket: { label: 'PRE-MARKET',     color: 'text-amber-400',   dot: 'bg-amber-400'   },
        closed:    { label: 'AFTER HOURS',    color: 'text-slate-500',   dot: 'bg-slate-600'   },
    };
    const msCfg = marketStatusCfg[marketStatus];

    return (
        <section id="dashboard" className="min-h-screen bg-[#020617] text-slate-200 font-sans pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 relative overflow-x-hidden">

            {/* -- Ambient glows -- */}
            <div className="absolute top-0 right-0 w-96 sm:w-150 h-72 sm:h-125 rounded-full pointer-events-none blur-3xl opacity-40"
                style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 left-0 w-80 sm:w-125 h-80 sm:h-125 rounded-full pointer-events-none blur-3xl opacity-40"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)' }} />
            <div className="absolute top-1/3 left-1/2 w-96 sm:w-150 h-64 sm:h-100 rounded-full pointer-events-none blur-3xl opacity-30"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />

            <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-5 md:space-y-6 relative z-10">

                {/* --------------------------------------
                    HEADER
                -------------------------------------- */}
                <motion.div variants={stagger} initial="hidden" animate="show"
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 md:gap-5">
                    <motion.div variants={fadeUp}>
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                            <div className="p-1 sm:p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                <Radio size={10} className="text-amber-500" />
                            </div>
                            <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-amber-500 uppercase tracking-[0.15em] sm:tracking-[0.2em]">Live Interface</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
                            <span style={{ background: 'linear-gradient(90deg,#fbbf24,#f59e0b,#d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                Command Center
                            </span>
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-sm md:text-base mt-1 sm:mt-1.5">
                            FinMind AI &middot; Real-Time Portfolio Analytics &middot; Smart Compounding
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        {/* Clock + Status */}
                        <Card className="px-2 sm:px-4 py-2 sm:py-3 flex flex-col min-[360px]:flex-row items-start min-[360px]:items-center gap-2 sm:gap-4 flex-1 sm:flex-none">
                            <div>
                                <div className="text-[7px] sm:text-[8px] md:text-[9px] text-slate-600 font-bold uppercase tracking-widest">New York</div>
                                <div className="text-xs min-[360px]:text-sm sm:text-base md:text-lg font-mono font-extrabold text-white leading-none">
                                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </div>
                            </div>
                            <div className="hidden min-[360px]:block w-px h-6 sm:h-8 bg-slate-800" />
                            <div>
                                <div className="text-[7px] sm:text-[8px] md:text-[9px] text-slate-600 font-bold uppercase tracking-widest mb-0.5">NYSE</div>
                                <div className={`text-xs sm:text-sm md:text-[13px] font-black flex items-center gap-1 sm:gap-1.5 ${msCfg.color}`}>
                                    <span className={`w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full ${msCfg.dot} ${marketStatus === 'open' ? 'animate-pulse' : ''}`} />
                                    {msCfg.label}
                                </div>
                            </div>
                        </Card>
                        {/* Refresh TSLA */}
                        <button onClick={fetchTsla}
                            className="p-2 sm:p-3 rounded-xl bg-[#0f172a]/70 border border-slate-800/60 text-slate-500 hover:text-amber-400 hover:border-amber-500/30 transition-all backdrop-blur-xl">
                            <RefreshCw size={14} className={tsla.loading ? 'animate-spin' : ''} />
                        </button>
                    </motion.div>
                </motion.div>

                {/* --------------------------------------
                    KPI STRIP
                -------------------------------------- */}
                <motion.div variants={stagger} initial="hidden" animate="show"
                    className="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
                    <KPICard
                        title="Portfolio Value"
                        value="₹25.24L"
                        change="+12.4%"
                        isPositive={true}
                        icon={Wallet}
                        accentBg="bg-emerald-500/10 border-emerald-500/20"
                        accentColor="text-emerald-400"
                        sub="vs. opening ₹22.47L"
                    />
                    <KPICard
                        title="Today's P&L"
                        value="+₹12,450"
                        change="+0.50%"
                        isPositive={true}
                        icon={TrendingUp}
                        accentBg="bg-blue-500/10 border-blue-500/20"
                        accentColor="text-blue-400"
                        sub="7 trades executed"
                    />
                    <KPICard
                        title="AI Model Accuracy"
                        value="82.4%"
                        change="+4.2%"
                        isPositive={true}
                        icon={BrainCircuit}
                        accentBg="bg-amber-500/10 border-amber-500/20"
                        accentColor="text-amber-400"
                        sub="Last 30 signal predictions"
                    />
                    <KPICard
                        title="Risk Score"
                        value="Moderate"
                        change="-0.8 pts"
                        isPositive={true}
                        icon={Shield}
                        accentBg="bg-purple-500/10 border-purple-500/20"
                        accentColor="text-purple-400"
                        sub="Sharpe ratio: 1.84"
                    />
                </motion.div>

                {/* --------------------------------------
                    PRICE PREDICTION ARENA
                -------------------------------------- */}
                <motion.div variants={stagger} initial="hidden" animate="show"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

                    {/* Left: Chart + Symbol selector */}
                    <motion.div variants={fadeUp} className="lg:col-span-2">
                        <Card className="p-5 flex flex-col">
                            {/* Header */}
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                                        <BarChart3 size={12} className="text-violet-400" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Price Prediction Arena</span>
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 uppercase tracking-wider">BETA</span>
                                </div>
                                {/* Symbol tabs */}
                                <div className="w-full sm:w-auto overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none]">
                                    <div className="flex w-max gap-1">
                                        {PREDICTION_SYMBOLS.map(sym => (
                                            <button key={sym} onClick={() => { setPredSymbol(sym); setBetDir(null); }}
                                                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all whitespace-nowrap ${
                                                    predSymbol === sym
                                                        ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300'
                                                        : 'text-slate-600 hover:text-slate-400 border border-transparent hover:border-slate-800'
                                                }`}>{sym}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Price summary */}
                            <div className="flex flex-col min-[360px]:flex-row min-[360px]:items-baseline gap-x-3 gap-y-1 mb-4">
                                <span className="text-xl min-[360px]:text-2xl sm:text-3xl font-extrabold text-white font-mono">
                                    {predPrice.currency}{predPrice.price.toLocaleString()}
                                </span>
                                <span className={`text-xs sm:text-sm font-bold flex items-center gap-1 ${ predTrend ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {predTrend ? <ArrowUpRight size={13}/> : <ArrowDownRight size={13}/>}
                                    {predTrend ? '+' : ''}{((predData.close[predData.close.length-1] - predData.close[0]) / predData.close[0] * 100).toFixed(2)}%
                                    <span className="text-slate-600 font-normal text-xs">14-day</span>
                                </span>
                                <span className="w-full sm:w-auto sm:ml-auto text-[10px] text-slate-600 mt-1 sm:mt-0">Range: {predPrice.currency}{predMin.toLocaleString()} - {predPrice.currency}{predMax.toLocaleString()}</span>
                            </div>

                            {/* TradingView Live Chart */}
                            <div className="overflow-hidden rounded-xl h-60 min-[360px]:h-64 sm:h-80 md:h-96 lg:h-115">
                                <iframe
                                    key={predSymbol}
                                    src={`https://s.tradingview.com/widgetembed/?symbol=${TV_SYMBOL_MAP[predSymbol]}&interval=D&theme=dark&style=1&hidesidetoolbar=${isTinyScreen ? 1 : 0}&timezone=Asia%2FKolkata&hide_top_toolbar=${isTinyScreen ? 1 : 0}&save_image=0`}
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allowFullScreen
                                    className="h-full rounded-xl"
                                />
                            </div>

                            {/* Treasury Portfolio Section */}
                            <div className="mt-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <Vault size={14} className="text-finance-gold" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Treasury & Allocations</span>
                                </div>
                                
                                {/* Main Balance */}
                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    <div className="col-span-3 p-4 rounded-xl border border-finance-gold/30 bg-finance-gold/5 hover:border-finance-gold/50 transition-all">
                                        <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1.5">Total Portfolio Value</div>
                                        <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-baseline gap-1.5 min-[420px]:gap-2">
                                            <span className="text-xl min-[360px]:text-2xl font-black text-finance-gold">₹25,47,500</span>
                                            <span className="text-[11px] sm:text-xs text-emerald-400 font-bold flex items-center gap-1">
                                                <ArrowUpRight size={11} />+₹1,24,750 (5.14%)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Allocation Breakdown */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                    {[
                                        { label: 'Predictions', amount: '₹8,50,000', pct: 33.3, color: 'text-orange-400', bar: 'bg-orange-500', iconBg: 'bg-orange-500/15 border-orange-500/25' },
                                        { label: 'Day Trading', amount: '₹7,50,000', pct: 29.4, color: 'text-emerald-400', bar: 'bg-emerald-500', iconBg: 'bg-emerald-500/15 border-emerald-500/25' },
                                        { label: 'Long Term', amount: '₹5,20,000', pct: 20.4, color: 'text-blue-400', bar: 'bg-blue-500', iconBg: 'bg-blue-500/15 border-blue-500/25' },
                                        { label: 'Learning Fund', amount: '₹2,10,000', pct: 8.2, color: 'text-purple-400', bar: 'bg-purple-500', iconBg: 'bg-purple-500/15 border-purple-500/25' },
                                        { label: 'Risk Reserve', amount: '₹1,44,000', pct: 5.6, color: 'text-rose-400', bar: 'bg-rose-500', iconBg: 'bg-rose-500/15 border-rose-500/25' },
                                        { label: 'Cash Buffer', amount: '₹83,500', pct: 3.3, color: 'text-cyan-400', bar: 'bg-cyan-500', iconBg: 'bg-cyan-500/15 border-cyan-500/25' },
                                    ].map(alloc => (
                                        <div key={alloc.label} className="p-3.5 rounded-xl border border-slate-800/50 bg-[#0d1320]/90 hover:border-slate-700 transition-all group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className={`text-[11px] font-black ${alloc.color} uppercase tracking-widest`}>{alloc.label}</div>
                                                <div className={`text-[10px] font-bold ${alloc.color}`}>{alloc.pct.toFixed(1)}%</div>
                                            </div>
                                            <div className="mb-2.5">
                                                <div className="h-1.5 rounded-full bg-slate-900/60 overflow-hidden">
                                                    <motion.div
                                                        className={`h-full rounded-full ${alloc.bar}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${alloc.pct}%` }}
                                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold">{alloc.amount}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Active Predictions & Results History - Below Treasury */}
                            <div className="mt-4">
                                {/* Active Predictions - Full Width Below Treasury */}
                                <motion.div variants={fadeUp}>
                                    <Card className="p-5 h-88 flex flex-col">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Active Predictions ({activeBets.length})</span>
                                            </div>
                                        </div>

                                        {activeBets.length === 0 ? (
                                            <div className="flex flex-1 items-center justify-center">
                                                <div className="text-center">
                                                    <div className="text-sm font-black text-slate-300 uppercase tracking-wider mb-1">No current active predictions</div>
                                                    <div className="text-xs text-slate-500">Place a prediction to see it appear here.</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-1">
                                                {activeBets.map(bet => (
                                                    <motion.div key={bet.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-4 rounded-xl bg-[#0d1320] border border-amber-500/30 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-black border ${
                                                                    bet.direction === 'up' 
                                                                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                                                                        : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                                                                }`}>
                                                                    {bet.symbol.slice(0, 2)}
                                                                </div>
                                                                <div>
                                                                    <div className="text-[12px] font-black text-slate-100">{bet.symbol}</div>
                                                                    <div className={`text-[10px] font-bold tracking-wide ${bet.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                                        {bet.direction === 'up' ? '↑ LONG' : '↓ SHORT'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <motion.span
                                                                    animate={{ opacity: [1, 0.4, 1] }}
                                                                    transition={{ duration: 1.5, repeat: Infinity }}
                                                                    className="w-2 h-2 rounded-full bg-amber-500"
                                                                />
                                                                <span className="text-[9px] font-bold text-amber-400">Settling...</span>
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-3 text-[8px] text-slate-600 pt-3 border-t border-slate-800/50">
                                                            <div>
                                                                <div className="text-slate-500 font-bold uppercase text-[7px] tracking-wider mb-1">Stake</div>
                                                                <div className="text-slate-300 font-bold text-[10px]">₹{bet.stake.toLocaleString()}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-slate-500 font-bold uppercase text-[7px] tracking-wider mb-1">Odds</div>
                                                                <div className="text-slate-300 font-bold text-[10px]">{bet.odds.toFixed(2)}x</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-slate-500 font-bold uppercase text-[7px] tracking-wider mb-1">Expires</div>
                                                                <div className="text-slate-300 font-bold text-[10px]">{bet.expiry}</div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </Card>
                                </motion.div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Right: Bet panel + open positions */}
                    <motion.div variants={fadeUp} className="flex min-h-0 flex-col gap-4">

                        {/* Bet builder - Enhanced Interactive */}
                        <Card className="p-5 shrink-0">
                            <div className="flex items-center gap-2 mb-4">
                                <FlameKindling size={13} className="text-orange-400" />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Place Prediction</span>
                            </div>

                            {/* Company Selector - Connected to Chart */}
                            <div className="mb-4 p-3 rounded-xl bg-[#0d1320] border border-slate-800/50">
                                <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2.5">Select Company (From Chart Analysis)</div>
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {PREDICTION_SYMBOLS.map(sym => (
                                        <motion.button
                                            key={sym}
                                            onClick={() => setPredSymbol(sym)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`py-2.5 px-2.5 rounded-lg border transition-all text-center ${
                                                predSymbol === sym
                                                    ? 'border-finance-gold bg-finance-gold/10 shadow-lg shadow-finance-gold/20'
                                                    : 'border-slate-800 bg-[#0d1320] hover:border-slate-700 hover:bg-slate-800/30'
                                            }`}
                                        >
                                            <div className={`text-[11px] font-black ${predSymbol === sym ? 'text-finance-gold' : 'text-slate-300'}`}>{sym}</div>
                                            <div className="text-[9px] text-slate-500 mt-0.5">{PRED_PRICES[sym].currency}{PRED_PRICES[sym].price.toLocaleString()}</div>
                                        </motion.button>
                                    ))}
                                </div>
                                {/* Company Price Info */}
                                <div className="text-[10px] text-slate-400 p-2 rounded-lg bg-slate-900/40">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Current Price:</span>
                                        <span className="font-black text-slate-200">{PRED_PRICES[predSymbol].currency}{PRED_PRICES[predSymbol].price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Direction buttons - Enhanced with animations */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setBetDir(betDir === 'up' ? null : 'up')}
                                    className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-2 transition-all font-bold text-sm relative overflow-hidden ${
                                        betDir === 'up'
                                            ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/20'
                                            : 'border-slate-800 bg-[#0d1320] text-slate-500 hover:border-emerald-700 hover:text-emerald-400 hover:shadow-lg hover:shadow-emerald-500/10'
                                    }`}>
                                    {betDir === 'up' && <motion.div className="absolute inset-0 bg-linear-to-r from-transparent via-emerald-500/20 to-transparent" animate={{ x: ['100%', '-100%'] }} transition={{ duration: 1.5, repeat: Infinity }} />}
                                    <TrendingUp size={20} />
                                    <span>LONG</span>
                                    <motion.span 
                                        className="text-[10px] font-black text-emerald-400"
                                        animate={betDir === 'up' ? { scale: [1, 1.1, 1] } : {}}
                                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                                    >
                                        {upOdds.toFixed(2)}x
                                    </motion.span>
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setBetDir(betDir === 'down' ? null : 'down')}
                                    className={`flex flex-col items-center gap-1.5 py-3.5 rounded-xl border-2 transition-all font-bold text-sm relative overflow-hidden ${
                                        betDir === 'down'
                                            ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow-lg shadow-rose-500/20'
                                            : 'border-slate-800 bg-[#0d1320] text-slate-500 hover:border-rose-700 hover:text-rose-400 hover:shadow-lg hover:shadow-rose-500/10'
                                    }`}>
                                    {betDir === 'down' && <motion.div className="absolute inset-0 bg-linear-to-r from-transparent via-rose-500/20 to-transparent" animate={{ x: ['100%', '-100%'] }} transition={{ duration: 1.5, repeat: Infinity }} />}
                                    <TrendingDown size={20} />
                                    <span>SHORT</span>
                                    <motion.span 
                                        className="text-[10px] font-black text-rose-400"
                                        animate={betDir === 'down' ? { scale: [1, 1.1, 1] } : {}}
                                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                                    >
                                        {downOdds.toFixed(2)}x
                                    </motion.span>
                                </motion.button>
                            </div>

                            {/* Stake input - Enhanced */}
                            <div className="mb-3">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Stake (Virtual Currency)</label>
                                    {stakeNum > 0 && <span className="text-[8px] font-bold text-emerald-400">₹{stakeNum.toLocaleString()}</span>}
                                </div>
                                <div className="flex gap-1.5">
                                    <div className="flex-1 relative">
                                        <BadgeDollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                                        <motion.input
                                            type="number" 
                                            value={stake}
                                            onChange={e => setStake(e.target.value)}
                                            whileFocus={{ scale: 1.02 }}
                                            className="w-full bg-[#0d1320] border border-slate-800 rounded-xl pl-8 pr-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/20 transition-all"
                                            placeholder="Enter stake"
                                        />
                                    </div>
                                    {['500','1000','2500'].map(q => (
                                        <motion.button 
                                            key={q} 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setStake(q)}
                                            className={`px-2.5 py-2.5 text-[10px] font-bold rounded-xl border transition-all ${
                                                stake === q
                                                    ? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
                                                    : 'bg-[#0d1320] border-slate-800 text-slate-500 hover:border-violet-500/30 hover:text-slate-300'
                                            }`}>
                                            ₹{q}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Expiry - Enhanced */}
                            <div className="mb-4">
                                <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1.5">Expires</label>
                                <div className="grid grid-cols-4 gap-1.5">
                                    {['1h','4h','EOD','1 Week'].map(e => (
                                        <motion.button 
                                            key={e} 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setExpiry(e)}
                                            className={`py-2.5 text-[10px] font-bold rounded-lg border transition-all ${
                                                expiry === e
                                                    ? 'bg-violet-500/20 border-violet-500/40 text-violet-300 shadow-lg shadow-violet-500/10'
                                                    : 'bg-[#0d1320] border-slate-800 text-slate-600 hover:border-slate-700 hover:text-slate-400'
                                            }`}>{e}</motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Payout preview - Enhanced with progress */}
                            <motion.div 
                                className="p-3 rounded-xl bg-[#0d1320] border border-slate-800/60 mb-4"
                                animate={betDir ? { borderColor: betDir === 'up' ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)' } : {}}
                            >
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    <motion.div
                                        key={`odds-${betDir}-${activeOdds}`}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="text-[9px] text-slate-700 mb-0.5 uppercase tracking-wider">Odds</div>
                                        <motion.div 
                                            className={`text-sm font-extrabold ${betDir ? (betDir === 'up' ? 'text-emerald-400' : 'text-rose-400') : 'text-slate-600'}`}
                                            animate={betDir ? { scale: [1, 1.1, 1] } : {}}
                                            transition={{ duration: 0.4 }}
                                        >
                                            {betDir ? `${activeOdds.toFixed(2)}x` : '-'}
                                        </motion.div>
                                    </motion.div>
                                    <motion.div
                                        key={`potential-${potentialReturn}`}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="text-[9px] text-slate-700 mb-0.5 uppercase tracking-wider">Potential Return</div>
                                        <motion.div 
                                            className={`text-sm font-extrabold ${ potentialReturn > 0 ? 'text-emerald-400' : 'text-slate-600' }`}
                                            animate={potentialReturn > 0 ? { scale: [1, 1.1, 1] } : {}}
                                            transition={{ duration: 0.4 }}
                                        >
                                            {potentialReturn > 0 ? `₹${potentialReturn.toFixed(0)}` : '-'}
                                        </motion.div>
                                    </motion.div>
                                    <motion.div
                                        key={`profit-${potentialReturn - stakeNum}`}
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="text-[9px] text-slate-700 mb-0.5 uppercase tracking-wider">Your Profit</div>
                                        <motion.div 
                                            className={`text-sm font-extrabold ${ potentialReturn > 0 ? 'text-emerald-400' : 'text-slate-600' }`}
                                            animate={potentialReturn > 0 ? { scale: [1, 1.1, 1] } : {}}
                                            transition={{ duration: 0.4 }}
                                        >
                                            {potentialReturn > 0 ? `+₹${(potentialReturn - stakeNum).toFixed(0)}` : '-'}
                                        </motion.div>
                                    </motion.div>
                                </div>
                                {/* Return % bar */}
                                {potentialReturn > 0 && <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                    <motion.div 
                                        className={`h-full rounded-full ${betDir === 'up' ? 'bg-linear-to-r from-emerald-500 to-emerald-400' : 'bg-linear-to-r from-rose-500 to-rose-400'}`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(((potentialReturn - stakeNum) / stakeNum) * 100, 100)}%` }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                    />
                                </div>}
                            </motion.div>

                            {/* Place bet button - Enhanced */}
                            <motion.button
                                onClick={handlePlaceBet}
                                disabled={!betDir || stakeNum <= 0}
                                whileHover={betDir && stakeNum > 0 ? { scale: 1.02 } : {}}
                                whileTap={betDir && stakeNum > 0 ? { scale: 0.98 } : {}}
                                className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all relative overflow-hidden ${
                                    betPlaced
                                        ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                        : betDir && stakeNum > 0
                                        ? 'text-white hover:shadow-lg shadow-violet-500/30'
                                        : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                                }`}
                                style={betDir && stakeNum > 0 && !betPlaced ? { background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' } : undefined}>
                                {betPlaced && <motion.div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" animate={{ x: ['100%', '-100%'] }} transition={{ duration: 1.5, repeat: Infinity }} />}
                                <span className="relative z-10">
                                    {betPlaced ? '✓ Prediction Placed!' : betDir && stakeNum > 0 ? `Predict ${betDir === 'up' ? 'LONG ↑' : 'SHORT ↓'} on ${predSymbol}` : 'Select direction & stake'}
                                </span>
                            </motion.button>

                            {betDir && stakeNum > 0 && !betPlaced && <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[8px] text-emerald-400 text-center mt-2 font-semibold">
                                Ready to place • Click button to confirm prediction
                            </motion.p>}
                            <p className="text-[8px] text-slate-700 text-center mt-2">Virtual currency only • for educational simulation purposes</p>
                        </Card>

                        {/* Results History - Right side below Place Prediction */}
                        {(wonBets.length > 0 || lostBets.length > 0) && (
                            <motion.div variants={fadeUp}>
                                <Card className="p-5 h-140 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Results History</span>
                                        <span className="text-[9px] font-bold text-slate-700 bg-slate-800/50 px-2.5 py-1 rounded-lg">{wonBets.length + lostBets.length} settled</span>
                                    </div>
                                    <div className="space-y-2.5 overflow-y-auto custom-scrollbar pr-1 flex-1">
                                        {openBets.filter(b => b.status !== 'open').map(bet => (
                                            <motion.div 
                                                key={bet.id} 
                                                initial={{ opacity: 0, scale: 0.95 }} 
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={`p-3.5 rounded-xl border ${bet.status === 'won' ? 'bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50' : 'bg-rose-500/5 border-rose-500/30 hover:border-rose-500/50'} transition-all hover:shadow-lg`}>
                                                <div className="flex items-center justify-between mb-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black border ${
                                                            bet.direction === 'up' 
                                                                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                                                                : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                                                        }`}>
                                                            {bet.symbol.slice(0, 2)}
                                                        </div>
                                                        <div>
                                                            <div className="text-[11px] font-black text-slate-100">{bet.symbol}</div>
                                                            <div className={`text-[9px] font-bold tracking-wide ${bet.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                                {bet.direction === 'up' ? '↑ LONG' : '↓ SHORT'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-[9px] font-black mb-0.5 ${bet.status === 'won' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                            {bet.status === 'won' ? '✓ WON' : '✗ LOST'}
                                                        </div>
                                                        <div className={`text-[11px] font-black ${bet.status === 'won' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                            {bet.status === 'won' ? '+' : '-'}₹{Math.abs(bet.status === 'won' ? (bet.stake * bet.odds - bet.stake) : bet.stake).toFixed(0)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2.5 text-[7px] text-slate-600 border-t border-slate-800/50 pt-2.5">
                                                    <div>
                                                        <div className="text-slate-500 font-bold uppercase text-[7px] tracking-wider mb-1">Stake</div>
                                                        <div className="text-slate-300 font-semibold text-[9px]">₹{bet.stake.toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-slate-500 font-bold uppercase text-[7px] tracking-wider mb-1">Odds</div>
                                                        <div className="text-slate-300 font-semibold text-[9px]">{bet.odds.toFixed(2)}x</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-slate-500 font-bold uppercase text-[7px] tracking-wider mb-1">ROI</div>
                                                        <div className={`font-semibold text-[9px] ${bet.status === 'won' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                            {bet.status === 'won' ? '+' : '-'}{((Math.abs(bet.status === 'won' ? (bet.stake * bet.odds - bet.stake) : bet.stake) / bet.stake) * 100).toFixed(0)}%
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>

                {/* --------------------------------------
                    CHART + WATCHLIST
                -------------------------------------- */}
                <motion.div variants={stagger} initial="hidden" animate="show"
                    className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Portfolio Chart */}
                    <motion.div variants={fadeUp} className="lg:col-span-2">
                        <Card className="p-6 h-full flex flex-col">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <LineChartIcon size={13} className="text-emerald-500" />
                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Portfolio Performance</span>
                                    </div>
                                    <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-baseline gap-1.5 min-[420px]:gap-3">
                                        <span className="text-2xl sm:text-3xl font-extrabold text-white">₹25.24L</span>
                                        <span className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1">
                                            <ArrowUpRight size={14} /> +₹2,77,950
                                            <span className="text-slate-600 font-normal text-xs">&nbsp;YTD</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none]">
                                    <div className="flex items-center gap-1 bg-[#0d1320] border border-slate-800 rounded-xl p-1 min-w-max">
                                        {Object.keys(TIMEFRAME_DATA).map(t => (
                                            <button key={t} onClick={() => setActiveTimeframe(t)}
                                                className={`px-2.5 sm:px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                                                    activeTimeframe === t
                                                        ? 'bg-amber-500 text-slate-950'
                                                        : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
                                                }`}>
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1" style={{ minHeight: isTinyScreen ? '200px' : '240px' }}>
                                <Line data={chartData} options={chartOptions} />
                            </div>
                            {/* Mini stats below chart */}
                            <div className="grid grid-cols-2 min-[420px]:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/60">
                                {[
                                    { label: 'Open',   val: '₹22.47L' },
                                    { label: 'High',   val: '₹25.31L' },
                                    { label: 'Low',    val: '₹22.38L' },
                                    { label: 'Return', val: '+12.4%'      },
                                ].map(s => (
                                    <div key={s.label}>
                                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-0.5">{s.label}</div>
                                        <div className="text-sm font-bold text-slate-300 font-mono">{s.val}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Live Watchlist */}
                    <motion.div variants={fadeUp}>
                        <Card className="p-5 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Activity size={13} className="text-emerald-500" />
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Live Watchlist</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-bold text-emerald-600">LIVE</span>
                                </div>
                            </div>

                            {/* TSLA � real API data */}
                            <WatchlistRow
                                symbol="TSLA"
                                name="Tesla, Inc."
                                price={tsla.loading ? '...' : `$${tsla.price.toFixed(2)}`}
                                pct={tsla.loading ? '...' : `${tslaPos ? '+' : ''}${tsla.changePercent.toFixed(2)}%`}
                                isPositive={tslaPos}
                                exchange="NASDAQ"
                                loading={tsla.loading}
                            />

                            {/* Static entries */}
                            <div className="flex-1 space-y-2 mt-2 overflow-y-auto custom-scrollbar">
                                {WATCHLIST_STATIC.map(s => <WatchlistRow key={s.symbol} {...s} />)}
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-800/50">
                                <motion.button 
                                    onClick={() => setShowMarketModal(true)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0d1320] border border-slate-800 hover:border-amber-500/30 hover:text-amber-400 text-slate-500 rounded-xl text-xs font-bold transition-all group">
                                    Full Market View
                                    <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </motion.button>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* --------------------------------------
                    BOTTOM GRID: 3 columns
                -------------------------------------- */}
                <motion.div variants={stagger} initial="hidden" animate="show"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {/* -- Asset Allocation -- */}
                    <motion.div variants={fadeUp}>
                        <Card className="p-5 h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <PieChart size={13} className="text-blue-400" />
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Asset Allocation</span>
                            </div>
                            <div className="relative h-36 flex items-center justify-center mb-4">
                                <Doughnut data={doughnutData} options={doughnutOptions} />
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-extrabold text-white">5</span>
                                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">sectors</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {ALLOCATION_LABELS.map((label, i) => (
                                    <div key={label} className="flex items-center gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: ALLOCATION_COLORS[i] }} />
                                        <span className="text-[11px] text-slate-400 flex-1 truncate">{label}</span>
                                        <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden shrink-0">
                                            <div className="h-full rounded-full" style={{ width: `${ALLOCATION_VALUES[i]}%`, background: ALLOCATION_COLORS[i] }} />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-300 font-mono w-7 text-right">{ALLOCATION_VALUES[i]}%</span>
                                    </div>
                                ))}
                            </div>

                            {/* Portfolio Stats */}
                            <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Total Value',   value: '$84,320',  sub: 'Portfolio',      color: 'text-white'        },
                                    { label: "Today's P&L",   value: '+$1,240',  sub: '+1.49%',         color: 'text-emerald-400'  },
                                    { label: '30D Return',    value: '+12.4%',   sub: 'vs 8.1% bench',  color: 'text-blue-400'     },
                                ].map(s => (
                                    <div key={s.label} className="flex flex-col gap-0.5 p-3 rounded-xl bg-[#0d1320]/80 border border-slate-800/50">
                                        <span className="text-[9px] text-slate-600 uppercase tracking-wider font-bold">{s.label}</span>
                                        <span className={`text-[13px] font-extrabold font-mono ${s.color}`}>{s.value}</span>
                                        <span className="text-[9px] text-slate-600">{s.sub}</span>
                                    </div>
                                ))}
                            </div>

                            {/* AI Rebalance Suggestion */}
                            <div className="mt-3 flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
                                <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 shrink-0 mt-0.5">
                                    <BrainCircuit size={11} className="text-amber-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[10px] font-bold text-amber-400 mb-0.5">AI Rebalance Suggestion</div>
                                    <div className="text-[10px] text-slate-500 leading-relaxed">Tech overweight at 37% vs 30% target. Rotate 7% into Energy &amp; Financials to reduce concentration risk.</div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                                <span className="text-[9px] text-slate-700 font-mono">Last rebalanced: 3 days ago</span>
                                <button className="text-[9px] font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider">Rebalance Now</button>
                            </div>
                        </Card>
                    </motion.div>

                    {/* -- FinMind AI Signals -- */}
                    <motion.div variants={fadeUp}>
                        <Card className="p-5 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                        <Zap size={11} className="text-amber-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">FinMind AI Signals</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                    </span>
                                    <span className="text-[9px] font-bold text-emerald-600 uppercase">Live Feed</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                                {AI_INSIGHTS.map((item, i) => <InsightRow key={i} {...item} />)}
                            </div>
                            <div className="pt-3 mt-2 border-t border-slate-800/50">
                                <div className="text-[9px] text-slate-700 font-mono text-center">
                                    Powered by FinMind AI &middot; Signals updated in real-time
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                </motion.div>


            </div>

            {/* Full Market View Modal */}
            {showMarketModal && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowMarketModal(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={e => e.stopPropagation()}
                        className="bg-[#0a0e1a] border border-slate-800 rounded-2xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 sm:p-6 border-b border-slate-800/50 bg-linear-to-r from-slate-900/50 to-transparent">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Globe size={18} className="text-amber-500" />
                                    <div>
                                        <h2 className="text-xl font-black text-white">Full Market View</h2>
                                        <p className="text-xs text-slate-500 mt-0.5">Live watchlist with detailed analytics</p>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={() => setShowMarketModal(false)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-9 h-9 rounded-lg bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
                                >
                                    ✕
                                </motion.button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <div className="p-4 sm:p-6 space-y-3">
                                {WATCHLIST_STATIC.map((stock, idx) => (
                                    <motion.div
                                        key={stock.symbol}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-4 rounded-xl bg-[#0d1320] border border-slate-800/50 hover:border-slate-700 transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${
                                                    stock.isPositive 
                                                        ? 'bg-emerald-500/20 text-emerald-400' 
                                                        : 'bg-rose-500/20 text-rose-400'
                                                }`}>
                                                    {stock.symbol.slice(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{stock.symbol}</div>
                                                    <div className="text-xs text-slate-500">{stock.name}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-extrabold text-white">{stock.price}</div>
                                                <div className={`text-sm font-bold flex items-center justify-end gap-1 ${
                                                    stock.isPositive ? 'text-emerald-400' : 'text-rose-400'
                                                }`}>
                                                    {stock.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                    {stock.pct}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className="px-2.5 py-1 rounded-lg bg-slate-800/60 text-slate-400 font-semibold">{stock.exchange}</span>
                                            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${stock.isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                                    style={{ width: `${Math.random() * 80 + 20}%` }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-800/50 bg-slate-900/30 flex gap-3">
                            <motion.button
                                onClick={() => setShowMarketModal(false)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all"
                            >
                                Close
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 py-2.5 px-4 rounded-lg bg-linear-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-sm hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                            >
                                Refresh Data
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71,85,105,0.4); border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(71,85,105,0.6); }
            `}</style>
        </section>
    );
};

export default Dashboard;
