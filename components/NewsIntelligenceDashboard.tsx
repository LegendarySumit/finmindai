"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  BarChart3,
  Filter,
  Search,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Bookmark,
  ArrowRight,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  Radio,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Newspaper,
} from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useAuth } from "@/lib/authContext";

ChartJS.register(ArcElement, Tooltip, Legend);

type Sentiment = "positive" | "negative" | "neutral";

interface NewsItem {
  id: number;
  title: string;
  source: string;
  category: string;
  sentiment: Sentiment;
  timestamp: string;
  rawTimestamp: number;
  impactScore: number;
  aiInsight: string;
  url?: string;
}

interface StockIdea {
  symbol: string;
  bias: "up" | "down" | "watch";
  rationale: string;
  trigger: string;
  invalidation: string;
  price?: number | null;
  changePercent?: number | null;
}

interface ScenarioPlan {
  scenario: string;
  probability: number;
  expectedMove: string;
  plan: string;
}

interface DeepAnalysisResult {
  generatedAt: string;
  model: string;
  thesis: string;
  marketBias: "bullish" | "bearish" | "neutral";
  confidence: number;
  immediateActions: string[];
  planByHorizon: {
    intraday: string[];
    swing: string[];
    position: string[];
  };
  stockIdeas: StockIdea[];
  riskRules: string[];
  scenarioMap: ScenarioPlan[];
  disclaimer: string;
}

const SENTIMENT = {
  positive: {
    label: "BULLISH",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    bar: "from-emerald-600 to-emerald-400",
    text: "text-emerald-400",
    icon: TrendingUp,
  },
  negative: {
    label: "BEARISH",
    dot: "bg-rose-400",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    bar: "from-rose-600 to-rose-400",
    text: "text-rose-400",
    icon: TrendingDown,
  },
  neutral: {
    label: "NEUTRAL",
    dot: "bg-blue-400",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    bar: "from-blue-600 to-blue-400",
    text: "text-blue-400",
    icon: Activity,
  },
};

const CATEGORIES = ["All", "Stocks", "Crypto", "Macro", "Commodities", "Tech"];

const SkeletonCard = ({ i }: { i: number }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: i * 0.05 }}
    className="bg-[#0d1320] border border-slate-800/60 rounded-xl p-4 animate-pulse"
  >
    <div className="flex gap-3 mb-3">
      <div className="h-5 w-20 bg-slate-800 rounded-md" />
      <div className="h-5 w-28 bg-slate-800/70 rounded-md" />
    </div>
    <div className="h-4 w-full bg-slate-800 rounded mb-2" />
    <div className="h-4 w-4/5 bg-slate-800 rounded mb-3" />
    <div className="h-3 w-full bg-slate-800/50 rounded mb-1.5" />
    <div className="h-3 w-3/4 bg-slate-800/50 rounded" />
  </motion.div>
);

const NewsIntelligenceDashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [newsFeed, setNewsFeed] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sentimentFilter, setSentimentFilter] = useState<"all" | Sentiment>(
    "all",
  );
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [newItemIds, setNewItemIds] = useState<Set<number>>(new Set());
  const [analysisByNewsId, setAnalysisByNewsId] = useState<
    Record<number, DeepAnalysisResult>
  >({});
  const [analysisLoadingId, setAnalysisLoadingId] = useState<number | null>(
    null,
  );
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const analysisPanelRef = useRef<HTMLElement | null>(null);

  const fetchNews = useCallback(async (forceRefresh: boolean = false) => {
    if (forceRefresh) setIsLoading(true);
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("fetch failed");
      const payload = await res.json();
      const items = (payload?.data?.items ??
        payload?.items ??
        []) as NewsItem[];

      if (!Array.isArray(items)) {
        throw new Error("Invalid news payload");
      }

      const fresh = new Set<number>();
      setNewsFeed((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const incoming = items.filter((n) => !existingIds.has(n.id));
        incoming.forEach((n) => fresh.add(n.id));
        return [...incoming, ...prev].slice(0, 100);
      });
      if (fresh.size > 0) {
        setNewItemIds(fresh);
        setTimeout(() => setNewItemIds(new Set()), 5000);
      }
      setLastFetched(new Date());
      setFetchError(false);
    } catch {
      setFetchError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and polling setup
  useEffect(() => {
    // Fetch immediately on mount
    let isMounted = true;
    (async () => {
      if (isMounted) {
        await fetchNews();
      }
    })();

    // Setup polling interval
    const interval = setInterval(() => {
      if (!isPaused && isMounted) {
        fetchNews();
      }
    }, 90_000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isPaused, fetchNews]);

  useEffect(() => {
    if (!selectedNews || typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 1279px)").matches) return;

    const timer = window.setTimeout(() => {
      analysisPanelRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [selectedNews]);

  // Analysis error is cleared when news is selected (see onClick handlers below)

  const generateDeepAnalysis = useCallback(async () => {
    if (!selectedNews) return;

    if (!isAuthenticated) {
      setAnalysisError("Sign in is required to generate deep analysis.");
      return;
    }

    if (!user?.token) {
      setAnalysisError(
        "Authentication token not available. Please sign in again.",
      );
      return;
    }

    const targetNews = selectedNews;
    setAnalysisError(null);
    setAnalysisLoadingId(targetNews.id);

    try {
      const res = await fetch("/api/news/deep-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          news: {
            id: targetNews.id,
            title: targetNews.title,
            source: targetNews.source,
            category: targetNews.category,
            sentiment: targetNews.sentiment,
            impactScore: targetNews.impactScore,
            aiInsight: targetNews.aiInsight,
            timestamp: targetNews.timestamp,
          },
          topSignals: newsFeed.slice(0, 8).map((n) => ({
            title: n.title,
            sentiment: n.sentiment,
            impactScore: n.impactScore,
            category: n.category,
          })),
        }),
      });

      const payload = await res.json();

      if (!res.ok) {
        throw new Error(
          payload?.error?.message ||
            payload?.error ||
            "Failed to generate deep analysis",
        );
      }

      const analysis = (payload?.data?.analysis ?? payload?.analysis) as
        | DeepAnalysisResult
        | undefined;
      if (!analysis) {
        throw new Error("No analysis returned");
      }

      setAnalysisByNewsId((prev) => ({
        ...prev,
        [targetNews.id]: analysis,
      }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to generate deep analysis";
      setAnalysisError(message);
    } finally {
      setAnalysisLoadingId(null);
    }
  }, [selectedNews, newsFeed, isAuthenticated, user]);

  const sentimentStats = useMemo(() => {
    const s = { positive: 0, negative: 0, neutral: 0 };
    newsFeed.forEach((n) => {
      s[n.sentiment]++;
    });
    return s;
  }, [newsFeed]);

  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = { All: newsFeed.length };
    CATEGORIES.slice(1).forEach((cat) => {
      c[cat] = newsFeed.filter((n) => n.category === cat).length;
    });
    return c;
  }, [newsFeed]);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return newsFeed.filter(
      (n) =>
        (!q ||
          n.title.toLowerCase().includes(q) ||
          n.aiInsight.toLowerCase().includes(q) ||
          n.source.toLowerCase().includes(q)) &&
        (selectedCategory === "All" || n.category === selectedCategory) &&
        (sentimentFilter === "all" || n.sentiment === sentimentFilter),
    );
  }, [newsFeed, searchQuery, selectedCategory, sentimentFilter]);

  const activeAnalysis = selectedNews
    ? analysisByNewsId[selectedNews.id]
    : null;
  const isGeneratingAnalysis =
    !!selectedNews && analysisLoadingId === selectedNews.id;

  const doughnutData = {
    labels: ["Bullish", "Bearish", "Neutral"],
    datasets: [
      {
        data: [
          sentimentStats.positive,
          sentimentStats.negative,
          sentimentStats.neutral,
        ],
        backgroundColor: ["#10b981", "#f43f5e", "#3b82f6"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "78%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        bodyColor: "#e2e8f0",
        borderColor: "#334155",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
  } as const;

  return (
    <div className="flex flex-col min-h-full lg:h-full bg-[#060b14] text-slate-200 overflow-visible lg:overflow-hidden font-sans">
      {/* LIVE TICKER */}
      <div className="bg-[#0a0f1c] border-b border-slate-800/60 h-9 flex items-center overflow-hidden whitespace-nowrap relative z-30 shrink-0">
        <div className="shrink-0 bg-amber-500 text-slate-950 px-2.5 sm:px-3 h-full flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
          >
            {"\u25CF"}
          </motion.span>
          LIVE WIRE
        </div>
        <div className="overflow-hidden flex-1 relative">
          {newsFeed.length > 0 ? (
            <motion.div
              className="flex items-center gap-6 sm:gap-10 whitespace-nowrap pl-3 sm:pl-6 py-1"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 50, ease: "linear", repeat: Infinity }}
            >
              {[...newsFeed.slice(0, 10), ...newsFeed.slice(0, 10)].map(
                (n, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-slate-500 shrink-0"
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${SENTIMENT[n.sentiment].dot}`}
                    />
                    <span className="font-bold text-slate-600 font-mono text-[8px] sm:text-[9px] uppercase">
                      [{n.source}]
                    </span>
                    <span className="text-slate-300 max-w-35 sm:max-w-none truncate">
                      {n.title}
                    </span>
                    <span className="text-slate-700 mx-1">{"\u2022"}</span>
                  </span>
                ),
              )}
            </motion.div>
          ) : (
            <span className="text-[11px] text-slate-600 pl-4 italic">
              Fetching live market intelligence...
            </span>
          )}
        </div>
        {lastFetched && (
          <div className="hidden min-[360px]:block shrink-0 px-4 text-[10px] text-slate-600 font-mono border-l border-slate-800">
            {lastFetched.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-visible lg:overflow-hidden relative">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(251,191,36,0.03) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)",
          }}
        />

        {/* LEFT SIDEBAR */}
        <aside className="w-full lg:w-72 lg:shrink-0 bg-[#0a0f1c]/90 border-b lg:border-b-0 lg:border-r border-slate-800/60 flex flex-col overflow-visible lg:overflow-y-auto custom-scrollbar z-20 max-h-none">
          <div className="p-4 sm:p-5 border-b border-slate-800/50">
            <h1 className="text-base font-black text-white flex items-center gap-2.5 mb-2">
              <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <Radio className="text-amber-500" size={14} />
              </div>
              FinMind Intel
            </h1>
            <div className="flex items-center gap-2 text-xs">
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute h-full w-full rounded-full opacity-75 ${fetchError ? "bg-rose-500" : "bg-emerald-500"}`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${fetchError ? "bg-rose-500" : "bg-emerald-500"}`}
                />
              </span>
              <span
                className={
                  fetchError
                    ? "text-rose-400"
                    : isLoading
                      ? "text-amber-400"
                      : "text-emerald-400"
                }
              >
                {fetchError
                  ? "Feed error — retrying..."
                  : isLoading
                    ? "Fetching signals..."
                    : `${newsFeed.length} signals loaded`}
              </span>
            </div>
          </div>

          {/* Doughnut */}
          <div className="p-4 sm:p-5 border-b border-slate-800/50">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={11} className="text-slate-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Market Sentiment
              </span>
            </div>
            <div className="bg-[#111827] rounded-2xl p-4 border border-slate-800">
              <div className="h-32 sm:h-36 relative flex items-center justify-center">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-white">
                    {newsFeed.length}
                  </span>
                  <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">
                    signals
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800">
                {(["positive", "negative", "neutral"] as Sentiment[]).map(
                  (s) => {
                    const cfg = SENTIMENT[s];
                    const isActive = sentimentFilter === s;
                    return (
                      <button
                        key={s}
                        onClick={() => setSentimentFilter(isActive ? "all" : s)}
                        className={`text-center p-2 rounded-xl border transition-all ${
                          isActive
                            ? s === "positive"
                              ? "bg-emerald-950/40 border-emerald-500/40"
                              : s === "negative"
                                ? "bg-rose-950/40 border-rose-500/40"
                                : "bg-blue-950/40 border-blue-500/40"
                            : "bg-slate-900/50 border-slate-800/50 hover:border-slate-700"
                        }`}
                      >
                        <div
                          className={`font-black text-base leading-none mb-1 ${cfg.text}`}
                        >
                          {sentimentStats[s]}
                        </div>
                        <div
                          className={`text-[9px] font-black uppercase ${cfg.text} opacity-60`}
                        >
                          {cfg.label.slice(0, 4)}
                        </div>
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="p-4 sm:p-5 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={11} className="text-slate-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Categories
              </span>
            </div>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    selectedCategory === cat
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/40 border-transparent hover:border-slate-800"
                  }`}
                >
                  <span className="uppercase tracking-wider">{cat}</span>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                      selectedCategory === cat
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-slate-800 text-slate-600"
                    }`}
                  >
                    {categoryCounts[cat] ?? 0}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-800/50">
            <div className="text-[9px] text-slate-700 font-mono text-center space-y-1">
              <div>Source: Finnhub Market Intelligence</div>
              <div>
                Auto-refresh: <span className="text-amber-700">every 90s</span>
              </div>
              <div>
                Status:{" "}
                <span
                  className={fetchError ? "text-rose-600" : "text-emerald-700"}
                >
                  {fetchError ? "DEGRADED" : "OPERATIONAL"}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className="flex-1 flex flex-col min-w-0 overflow-visible lg:overflow-hidden">
          <header className="px-3 sm:px-5 py-3 border-b border-slate-800/60 flex flex-wrap items-center gap-2 sm:gap-3 bg-[#060b14]/80 backdrop-blur shrink-0 z-10">
            <div className="relative flex-1 min-w-0 max-w-full lg:max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
              <input
                type="text"
                placeholder="Search headlines, tickers, sources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-[#111827] border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white text-sm"
                >
                  {"\u2715"}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              {filtered.length > 0 && (
                <span className="text-[10px] text-slate-600 font-mono hidden xl:block">
                  {filtered.length} signals
                </span>
              )}
              <button
                onClick={() => fetchNews(true)}
                disabled={isLoading}
                className="p-2.5 rounded-xl bg-[#111827] border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 disabled:opacity-40 transition-all"
                title="Refresh now"
              >
                <RefreshCw
                  size={15}
                  className={isLoading ? "animate-spin" : ""}
                />
              </button>
              <button
                onClick={() => setIsPaused((p) => !p)}
                className={`p-2.5 rounded-xl border transition-all ${
                  isPaused
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                    : "bg-[#111827] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
                title={isPaused ? "Resume feed" : "Pause feed"}
              >
                {isPaused ? (
                  <Play size={15} fill="currentColor" />
                ) : (
                  <Pause size={15} fill="currentColor" />
                )}
              </button>
              <button
                onClick={() => {
                  setNewsFeed([]);
                  setSelectedNews(null);
                  fetchNews(true);
                }}
                className="p-2.5 rounded-xl bg-[#111827] border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/20 transition-all"
                title="Clear and reload"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-visible lg:overflow-y-auto p-3 sm:p-4 space-y-2.5 custom-scrollbar">
            <AnimatePresence initial={false} mode="popLayout">
              {isLoading && newsFeed.length === 0 ? (
                <div key="skeletons" className="space-y-2.5">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <SkeletonCard key={i} i={i} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-[40vh] sm:h-[55vh] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-800/40 text-center p-6 sm:p-8"
                >
                  <Newspaper size={48} className="text-slate-700 mb-4" />
                  <p className="text-base font-bold text-slate-500 mb-1">
                    {newsFeed.length === 0
                      ? "Awaiting Intelligence Feed"
                      : "No matching signals"}
                  </p>
                  <p className="text-xs text-slate-700 mb-6">
                    {newsFeed.length === 0
                      ? "Connecting to live market data..."
                      : "Try adjusting your filters"}
                  </p>
                  {newsFeed.length === 0 && (
                    <button
                      onClick={() => fetchNews(true)}
                      className="px-6 py-2.5 bg-amber-500 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-400 transition-colors"
                    >
                      Force Refresh
                    </button>
                  )}
                </motion.div>
              ) : (
                filtered.map((news) => {
                  const cfg = SENTIMENT[news.sentiment];
                  const SentIcon = cfg.icon;
                  const isNew = newItemIds.has(news.id);
                  const isSelected = selectedNews?.id === news.id;
                  return (
                    <motion.div
                      key={news.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.22 }}
                      onClick={() => {
                        setSelectedNews(isSelected ? null : news);
                        setAnalysisError(null);
                      }}
                      className={`group relative bg-[#0d1320] border rounded-xl p-4 cursor-pointer transition-all duration-200 overflow-hidden ${
                        isSelected
                          ? "border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.06)] ring-1 ring-amber-500/20"
                          : isNew
                            ? "border-emerald-500/25 ring-1 ring-emerald-500/15 hover:border-emerald-500/40"
                            : "border-slate-800/70 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20"
                      }`}
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/2 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 pointer-events-none" />
                      {isNew && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">
                            New
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${cfg.badge}`}
                        >
                          <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                        <span className="text-[10px] text-slate-600 font-medium">
                          {news.source}
                        </span>
                        <span className="ml-auto text-[10px] text-slate-700 flex items-center gap-1 shrink-0">
                          <Clock size={9} /> {news.timestamp}
                        </span>
                      </div>
                      <div className="pl-3 border-l-2 border-slate-800/60 group-hover:border-amber-500/30 transition-colors mb-3">
                        <h3 className="text-sm font-bold text-slate-200 leading-snug mb-1.5 group-hover:text-white transition-colors line-clamp-2 pr-8">
                          {news.title}
                        </h3>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed group-hover:text-slate-500 transition-colors">
                          {news.aiInsight}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-[9px] text-slate-700 uppercase shrink-0">
                            Impact
                          </span>
                          <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-linear-to-r ${cfg.bar}`}
                              style={{ width: `${news.impactScore * 10}%` }}
                            />
                          </div>
                          <span
                            className={`text-[10px] font-black shrink-0 ${cfg.text}`}
                          >
                            {news.impactScore}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[9px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-500 font-bold">
                            {news.category}
                          </span>
                          <SentIcon
                            size={11}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity ${cfg.text}`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* RIGHT PANEL */}
        <aside
          ref={analysisPanelRef}
          className="w-full xl:w-96 xl:shrink-0 bg-[#0a0f1c]/90 border-t xl:border-t-0 xl:border-l border-slate-800/60 flex flex-col overflow-visible xl:overflow-hidden z-20 max-h-none"
        >
          <AnimatePresence mode="wait">
            {selectedNews ? (
              <motion.div
                key={`detail-${selectedNews.id}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col h-auto xl:h-full"
              >
                <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-slate-800/60 flex items-center justify-between shrink-0">
                  <button
                    onClick={() => {
                      setSelectedNews(null);
                      setAnalysisError(null);
                    }}
                    className="flex items-center gap-2 text-xs text-slate-500 hover:text-white font-bold uppercase tracking-wider transition-colors group"
                  >
                    <ArrowRight
                      size={12}
                      className="rotate-180 group-hover:-translate-x-0.5 transition-transform"
                    />
                    Back
                  </button>
                  <div className="flex gap-2">
                    <button className="p-1.5 sm:p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-500 hover:text-amber-400 border border-slate-700/40 hover:border-slate-700 transition-all">
                      <Bookmark size={13} />
                    </button>
                    <button className="p-1.5 sm:p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-500 hover:text-amber-400 border border-slate-700/40 hover:border-slate-700 transition-all">
                      <Share2 size={13} />
                    </button>
                    {selectedNews.url && (
                      <a
                        href={selectedNews.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 sm:p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-500 hover:text-amber-400 border border-slate-700/40 hover:border-slate-700 transition-all"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex-1 overflow-visible xl:overflow-y-auto p-3 sm:p-5 custom-scrollbar space-y-4 sm:space-y-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    {(() => {
                      const cfg = SENTIMENT[selectedNews.sentiment];
                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${cfg.badge}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                          />
                          {cfg.label}
                        </span>
                      );
                    })()}
                    <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      {selectedNews.source}
                    </span>
                    <span className="w-full min-[420px]:w-auto min-[420px]:ml-auto text-[11px] sm:text-xs text-slate-600">
                      {selectedNews.timestamp}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                    {selectedNews.title}
                  </h2>
                  <div className="bg-[#111827] border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none">
                      <Zap size={110} />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Zap size={11} className="text-amber-500" />
                      <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                        AI Market Context
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {selectedNews.aiInsight}
                    </p>
                    <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-800 grid grid-cols-1 min-[420px]:grid-cols-2 gap-3 sm:gap-5">
                      <div className="min-w-0">
                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-2">
                          Impact Score
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-white">
                          {selectedNews.impactScore}
                          <span className="text-sm text-slate-500 font-medium">
                            /10
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full mt-2.5 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-linear-to-r ${SENTIMENT[selectedNews.sentiment].bar}`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${selectedNews.impactScore * 10}%`,
                            }}
                            transition={{ duration: 0.9, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] text-slate-600 font-bold uppercase tracking-wider mb-2">
                          Category
                        </div>
                        <div className="text-base sm:text-xl font-black text-white wrap-break-word leading-tight">
                          {selectedNews.category}
                        </div>
                        <div className="text-[10px] text-slate-600 mt-2 flex items-center gap-1">
                          <CheckCircle2
                            size={10}
                            className="text-emerald-600"
                          />{" "}
                          Verified source
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#0d1320] border border-slate-800/50 rounded-xl p-3 sm:p-4">
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-wider mb-3">
                      Potentially Affected
                    </div>
                    <div className="space-y-1.5">
                      {(["AAPL", "NVDA", "MSFT"] as const).map((ticker, i) => (
                        <div
                          key={ticker}
                          className="flex items-center justify-between p-2 sm:p-2.5 hover:bg-slate-800/30 rounded-lg transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:border-slate-600 transition-colors">
                              {ticker[0]}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                                {ticker}
                              </div>
                              <div className="text-[9px] text-slate-600">
                                Tech Sector
                              </div>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-black font-mono ${i === 1 ? "text-rose-400" : "text-emerald-400"}`}
                          >
                            {i === 1 ? "-0.8%" : "+1.2%"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#0d1320] border border-slate-800/50 rounded-xl p-3 sm:p-4 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Zap size={12} className="text-amber-500" />
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider">
                          Deep Analysis Guide
                        </span>
                      </div>
                      {activeAnalysis && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {activeAnalysis.confidence}% conf
                        </span>
                      )}
                    </div>

                    {isGeneratingAnalysis && (
                      <div className="space-y-2 animate-pulse">
                        <div className="h-3 bg-slate-800 rounded w-3/4" />
                        <div className="h-3 bg-slate-800 rounded" />
                        <div className="h-3 bg-slate-800 rounded w-5/6" />
                      </div>
                    )}

                    {!isGeneratingAnalysis && analysisError && (
                      <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300">
                        {analysisError}
                      </div>
                    )}

                    {!isGeneratingAnalysis && activeAnalysis && (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {activeAnalysis.thesis}
                        </p>

                        <div>
                          <div className="text-[9px] font-black text-slate-600 uppercase tracking-wider mb-2">
                            Immediate Actions
                          </div>
                          <div className="space-y-1.5">
                            {activeAnalysis.immediateActions
                              .slice(0, 3)
                              .map((step, idx) => (
                                <div
                                  key={`${idx}-${step.slice(0, 16)}`}
                                  className="text-[11px] text-slate-400 bg-slate-900/40 border border-slate-800/60 rounded-lg p-2.5"
                                >
                                  {idx + 1}. {step}
                                </div>
                              ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] font-black text-slate-600 uppercase tracking-wider mb-2">
                            Stock Plan
                          </div>
                          <div className="space-y-2">
                            {activeAnalysis.stockIdeas
                              .slice(0, 3)
                              .map((idea) => (
                                <div
                                  key={idea.symbol}
                                  className="p-2.5 rounded-lg border border-slate-800/60 bg-slate-900/30"
                                >
                                  <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <span className="text-xs font-black text-white">
                                      {idea.symbol}
                                    </span>
                                    <span
                                      className={`text-[10px] font-black uppercase ${idea.bias === "up" ? "text-emerald-400" : idea.bias === "down" ? "text-rose-400" : "text-blue-400"}`}
                                    >
                                      {idea.bias}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    {idea.rationale}
                                  </div>
                                  {(idea.price ||
                                    idea.changePercent !== null) && (
                                    <div className="mt-1.5 text-[10px] text-slate-500 font-mono">
                                      {idea.price
                                        ? `$${idea.price.toFixed(2)}`
                                        : "N/A"}{" "}
                                      {typeof idea.changePercent === "number"
                                        ? `• ${idea.changePercent >= 0 ? "+" : ""}${idea.changePercent.toFixed(2)}%`
                                        : ""}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] font-black text-slate-600 uppercase tracking-wider mb-2">
                            Execution Horizon
                          </div>
                          <div className="grid grid-cols-1 gap-1.5">
                            <div className="text-[11px] text-slate-400 bg-slate-900/40 border border-slate-800/60 rounded-lg p-2.5">
                              <span className="text-slate-300 font-bold">
                                Intraday:
                              </span>{" "}
                              {activeAnalysis.planByHorizon.intraday[0] ||
                                "Wait for high-quality setups only."}
                            </div>
                            <div className="text-[11px] text-slate-400 bg-slate-900/40 border border-slate-800/60 rounded-lg p-2.5">
                              <span className="text-slate-300 font-bold">
                                Swing:
                              </span>{" "}
                              {activeAnalysis.planByHorizon.swing[0] ||
                                "Scale in gradually with confirmation."}
                            </div>
                            <div className="text-[11px] text-slate-400 bg-slate-900/40 border border-slate-800/60 rounded-lg p-2.5">
                              <span className="text-slate-300 font-bold">
                                Position:
                              </span>{" "}
                              {activeAnalysis.planByHorizon.position[0] ||
                                "Reassess thesis weekly against macro changes."}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] font-black text-slate-600 uppercase tracking-wider mb-2">
                            Scenario Outlook
                          </div>
                          <div className="space-y-1.5">
                            {activeAnalysis.scenarioMap
                              .slice(0, 2)
                              .map((scenario) => (
                                <div
                                  key={scenario.scenario}
                                  className="text-[11px] text-slate-400 bg-slate-900/40 border border-slate-800/60 rounded-lg p-2.5"
                                >
                                  <span className="text-slate-300 font-bold">
                                    {scenario.scenario}
                                  </span>{" "}
                                  ({scenario.probability}%):{" "}
                                  {scenario.expectedMove}
                                </div>
                              ))}
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] font-black text-slate-600 uppercase tracking-wider mb-2">
                            Risk Rules
                          </div>
                          <div className="space-y-1.5">
                            {activeAnalysis.riskRules
                              .slice(0, 3)
                              .map((rule, idx) => (
                                <div
                                  key={`${idx}-${rule.slice(0, 14)}`}
                                  className="text-[11px] text-slate-400 bg-slate-900/40 border border-slate-800/60 rounded-lg p-2.5"
                                >
                                  {idx + 1}. {rule}
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-500 border-t border-slate-800/60 pt-2">
                          {activeAnalysis.disclaimer}
                        </div>
                      </div>
                    )}

                    {!isGeneratingAnalysis &&
                      !activeAnalysis &&
                      !analysisError && (
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Generate a structured plan for this specific headline:
                          market bias, stock selection, scenarios, and risk
                          controls.
                        </p>
                      )}
                  </div>
                </div>
                <div className="p-3 sm:p-5 border-t border-slate-800/60 shrink-0">
                  <button
                    onClick={generateDeepAnalysis}
                    disabled={isGeneratingAnalysis || !isAuthenticated}
                    className="w-full py-2.5 sm:py-3 bg-linear-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 group"
                  >
                    {isGeneratingAnalysis
                      ? "Generating..."
                      : activeAnalysis
                        ? "Refresh Deep Analysis"
                        : "Generate Deep Analysis"}
                    <ArrowRight
                      size={13}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="panel-default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col h-auto xl:h-full"
              >
                <div className="px-5 py-4 border-b border-slate-800/60">
                  <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                    Intelligence Panel
                  </div>
                </div>
                <div className="p-4 grid grid-cols-3 gap-3 border-b border-slate-800/50">
                  {[
                    {
                      label: "Bullish",
                      count: sentimentStats.positive,
                      color: "text-emerald-400",
                      bg: "bg-emerald-950/30 border-emerald-500/10",
                    },
                    {
                      label: "Bearish",
                      count: sentimentStats.negative,
                      color: "text-rose-400",
                      bg: "bg-rose-950/30 border-rose-500/10",
                    },
                    {
                      label: "Neutral",
                      count: sentimentStats.neutral,
                      color: "text-blue-400",
                      bg: "bg-blue-950/30 border-blue-500/10",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className={`rounded-xl border p-3 text-center ${s.bg}`}
                    >
                      <div className={`text-xl font-black ${s.color}`}>
                        {s.count}
                      </div>
                      <div
                        className={`text-[9px] font-black uppercase ${s.color} opacity-60`}
                      >
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
                {newsFeed.length > 0 ? (
                  <div className="p-4 flex-1 overflow-visible xl:overflow-y-auto custom-scrollbar">
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">
                      Top Signals
                    </div>
                    <div className="space-y-1">
                      {[...newsFeed]
                        .sort((a, b) => b.impactScore - a.impactScore)
                        .slice(0, 8)
                        .map((news) => {
                          const cfg = SENTIMENT[news.sentiment];
                          return (
                            <button
                              key={news.id}
                              onClick={() => {
                                setSelectedNews(news);
                                setAnalysisError(null);
                              }}
                              className="w-full text-left flex items-start gap-3 p-3 rounded-xl hover:bg-slate-800/30 border border-transparent hover:border-slate-800 transition-all group"
                            >
                              <span
                                className={`mt-1 w-2 h-2 rounded-full ${cfg.dot} shrink-0`}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-slate-400 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                                  {news.title}
                                </p>
                                <span
                                  className={`text-[9px] font-bold mt-0.5 block ${cfg.text}`}
                                >
                                  {news.impactScore}/10 {"\u2022"} {news.source}
                                </span>
                              </div>
                              <ChevronRight
                                size={12}
                                className="text-slate-700 group-hover:text-amber-500 shrink-0 mt-0.5 transition-colors"
                              />
                            </button>
                          );
                        })}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center border border-slate-800 mb-5">
                      <Activity size={24} className="text-slate-700" />
                    </div>
                    <h3 className="text-sm font-black text-slate-500 mb-2">
                      Select a Signal
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Click a news card to view AI analysis, market impact, and
                      related assets.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.3);
        }
      `}</style>
    </div>
  );
};

export default NewsIntelligenceDashboard;
