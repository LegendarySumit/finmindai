"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/authContext";
import {
  Users,
  MessageSquare,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Flame,
  Star,
  Trophy,
  ChevronUp,
  ChevronDown,
  Pin,
  Share2,
  BookOpen,
  BarChart2,
  ArrowRight,
  Search,
  Zap,
  Shield,
  Globe,
  Hash,
  Send,
  Award,
  Target,
  PieChart,
  Activity,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

/* ── Types ─────────────────────────────────────────────────────────── */
type Post = {
  id: number;
  author: string;
  avatar: string;
  role: string;
  roleColor: string;
  time: string;
  title: string;
  body: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  replies: number;
  views: number;
  pinned?: boolean;
  flair?: string;
  flairColor?: string;
  userVote: "up" | "down" | null;
};
type Reply = {
  author: string;
  avatar: string;
  role: string;
  roleColor: string;
  time: string;
  body: string;
  upvotes: number;
};

/* ── Static Data ─────────────────────────────────────────────────────── */
const CATEGORIES = [
  { id: "all", label: "All Posts", Icon: Globe, count: 248 },
  { id: "analysis", label: "Market Analysis", Icon: BarChart2, count: 84 },
  { id: "learning", label: "Learn Together", Icon: BookOpen, count: 63 },
  { id: "picks", label: "Stock Picks", Icon: Target, count: 57 },
  { id: "strategy", label: "Strategies", Icon: PieChart, count: 44 },
];

const POSTS: Post[] = [
  {
    id: 1,
    pinned: true,
    author: "AlphaTrader99",
    avatar: "🦅",
    role: "Elite Trader",
    roleColor: "text-amber-400",
    time: "2h ago",
    flair: "Analysis",
    flairColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    title: "Nifty at 22,800 — Is the bounce real or a bull trap?",
    body: "After Friday's 1.4% recovery, I've been watching price action carefully. The 22,750 level held as support with decent volume. However, FII data shows continued selling (~₹2,100cr yesterday). My read: we see one more leg up to 23,200 before a proper retest of 22,400. Watch the 200 EMA on the daily — that'll be the key decision zone.",
    tags: ["Nifty50", "Technical", "FII Data"],
    upvotes: 312,
    downvotes: 18,
    replies: 47,
    views: 2840,
    userVote: null,
  },
  {
    id: 2,
    author: "QuantWhiz",
    avatar: "🤖",
    role: "Quant Analyst",
    roleColor: "text-blue-400",
    time: "5h ago",
    flair: "Strategy",
    flairColor: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    title:
      "My momentum screener flagged 4 stocks this week — sharing the setup",
    body: "Running a simple dual-momentum model (12-1 month, market-cap weighted) on NSE 500. This week's signals: TATA ELXSI (strong), COFORGE (strong), PERSISTENT (mod.), LTTS (weak/watch). All have RSI > 60 and are trading above 50-EMA. Not financial advice — backtest shows 19.2% CAGR vs 13.4% for Nifty 500 over 2014–2024.",
    tags: ["Momentum", "Screener", "IT Sector"],
    upvotes: 218,
    downvotes: 9,
    replies: 32,
    views: 1620,
    userVote: null,
  },
  {
    id: 3,
    author: "NiftyNinja",
    avatar: "⚡",
    role: "Options Expert",
    roleColor: "text-emerald-400",
    time: "8h ago",
    flair: "Education",
    flairColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    title: "Explained: Why theta decay accelerates in the final week of expiry",
    body: "New options traders always wonder why their OTM options suddenly become worthless even when the stock barely moved. Here's the simple math: theta (time decay) is NOT linear. For a 30-day option, you lose ~1/30 per day. But for a 7-day option, ~1/7. And for a 1-day option, ~1/1. The decay curve is exponential. This is why option sellers love the last 4–5 days before expiry.",
    tags: ["Options", "Theta", "Beginners"],
    upvotes: 445,
    downvotes: 4,
    replies: 68,
    views: 5210,
    userVote: null,
  },
  {
    id: 4,
    author: "BullSignal_K",
    avatar: "📊",
    role: "Senior Member",
    roleColor: "text-slate-400",
    time: "12h ago",
    flair: "Analysis",
    flairColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    title: "HDFC Bank Q3 results deep dive — what the market is missing",
    body: "The street punished HDFC Bank (-3.2%) on NIM compression, but look at the loan growth: 110.7% YoY (yes, because of merger base). Adjusted NIM compression is just 7bps — well within guidance. The headline looks bad; the underlying numbers are fine. CD ratio improving to 87% next Q is the key lever. I'm accumulating on weakness below ₹1,620.",
    tags: ["HDFC Bank", "Fundamental", "Banking"],
    upvotes: 174,
    downvotes: 31,
    replies: 29,
    views: 1890,
    userVote: null,
  },
  {
    id: 5,
    author: "DeepikaTrades",
    avatar: "🌿",
    role: "Rising Star",
    roleColor: "text-emerald-300",
    time: "1d ago",
    flair: "Learn Together",
    flairColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    title:
      "Beginner question: why does a stock gap up and then immediately fall?",
    body: 'I bought ZOMATO at market open after strong results and it gapped up 6%, then fell 4% within the first 30 minutes. I sold at a small loss. Now I understand — this is classic "buy the rumour, sell the news." The gap up was already pricing in the expected good results. Institutional sellers used the gap to exit. Lesson learned: never buy at the open after a catalyst.',
    tags: ["Beginners", "Gap Up", "Psychology"],
    upvotes: 198,
    downvotes: 2,
    replies: 41,
    views: 2140,
    userVote: null,
  },
  {
    id: 6,
    author: "SectorRotator",
    avatar: "🔄",
    role: "Senior Member",
    roleColor: "text-slate-400",
    time: "1d ago",
    flair: "Strategy",
    flairColor: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    title: "Defensive rotation incoming? Pharma + FMCG showing strength",
    body: "Last 10 trading sessions: Nifty Pharma +4.1%, Nifty FMCG +2.8%, Nifty IT -1.9%, Nifty Bank flat. Classic late-cycle defensive rotation. When money moves out of growth sectors into defensives, it usually precedes broader market weakness by 4–6 weeks. Not a crash call — just risk-off positioning makes sense here.",
    tags: ["Sector Rotation", "Macro", "Strategy"],
    upvotes: 145,
    downvotes: 22,
    replies: 18,
    views: 1340,
    userVote: null,
  },
];

const MOCK_REPLIES: Reply[] = [
  {
    author: "TrendFollower",
    avatar: "📈",
    role: "Member",
    roleColor: "text-slate-400",
    time: "1h ago",
    body: "Agree on the 200 EMA watch. I'd also keep an eye on the India VIX — if it drops below 14, that's a strong signal the fear is dissipating and the bounce has legs.",
    upvotes: 42,
  },
  {
    author: "ShortTermSam",
    avatar: "⚡",
    role: "Active Trader",
    roleColor: "text-blue-400",
    time: "45m ago",
    body: "I'm less bullish. PCR jumped to 1.4 — option sellers are positioned for further downside. The FII selling trend has been consistent for 6 weeks. I think 22,400 hits before 23,200.",
    upvotes: 28,
  },
  {
    author: "LongTermLisa",
    avatar: "🌱",
    role: "Investor",
    roleColor: "text-emerald-400",
    time: "30m ago",
    body: "SIP investors shouldn't be watching charts daily. This volatility is a gift — stick to your allocation, don't switch to cash waiting for the \"bottom.\"",
    upvotes: 67,
  },
];

const TOP_MEMBERS = [
  {
    name: "AlphaTrader99",
    avatar: "🦅",
    role: "Elite Trader",
    posts: 1240,
    likes: 8920,
    badge: "🥇",
  },
  {
    name: "NiftyNinja",
    avatar: "⚡",
    role: "Options Expert",
    posts: 890,
    likes: 6740,
    badge: "🥈",
  },
  {
    name: "QuantWhiz",
    avatar: "🤖",
    role: "Quant Analyst",
    posts: 640,
    likes: 4810,
    badge: "🥉",
  },
  {
    name: "BullSignal_K",
    avatar: "📊",
    role: "Senior Member",
    posts: 412,
    likes: 3120,
    badge: "4",
  },
  {
    name: "DeepikaTrades",
    avatar: "🌿",
    role: "Rising Star",
    posts: 98,
    likes: 1890,
    badge: "5",
  },
];

const TRENDING_TAGS = [
  "Nifty50",
  "Options",
  "Banking",
  "IT Sector",
  "Budget2026",
  "RSI",
  "HDFC Bank",
  "Momentum",
  "SIP",
  "FII Data",
];

const STATS = [
  { Icon: Users, val: "14,200+", label: "Members" },
  { Icon: MessageSquare, val: "48,000+", label: "Discussions" },
  { Icon: TrendingUp, val: "92%", label: "Signal Accuracy" },
  { Icon: Flame, val: "340", label: "Active Today" },
];

/* ── Post Reply Modal ───────────────────────────────────────────────── */
const PostDetail = ({ post, onClose }: { post: Post; onClose: () => void }) => {
  const { trackActivity } = useAuth();
  const [votes, setVotes] = useState({
    up: post.upvotes,
    down: post.downvotes,
    vote: post.userVote,
  });
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<Reply[]>(MOCK_REPLIES);

  const handleVote = (dir: "up" | "down") => {
    setVotes((v) => {
      if (v.vote === dir)
        return { up: post.upvotes, down: post.downvotes, vote: null };
      return {
        up: dir === "up" ? post.upvotes + 1 : post.upvotes,
        down: dir === "down" ? post.downvotes + 1 : post.downvotes,
        vote: dir,
      };
    });
    void trackActivity("community_post_vote", {
      postId: post.id,
      direction: dir,
    });
  };

  const submitReply = () => {
    if (!replyText.trim()) return;
    const nextReply = replyText.trim();
    setReplies((r) => [
      {
        author: "You",
        avatar: "👤",
        role: "Member",
        roleColor: "text-amber-400",
        time: "just now",
        body: nextReply,
        upvotes: 0,
      },
      ...r,
    ]);
    setReplyText("");
    void trackActivity("community_reply_created", {
      postId: post.id,
      replyLength: nextReply.length,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 pt-18 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        className="bg-[#0b1120] border border-slate-800/60 rounded-2xl w-full max-w-[95vw] sm:max-w-lg md:max-w-2xl overflow-hidden"
      >
        {/* Close */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-800/60">
          <div className="flex items-center gap-2 min-w-0">
            {post.flair && (
              <span
                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${post.flairColor}`}
              >
                {post.flair}
              </span>
            )}
            <span className="text-[10px] sm:text-[11px] text-slate-500 truncate">
              {post.replies} replies · {post.views.toLocaleString()} views
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-xs sm:text-sm transition-colors px-2 py-1 rounded hover:bg-slate-800 shrink-0 ml-2"
          >
            ✕ Close
          </button>
        </div>

        <div className="p-3 sm:p-5">
          {/* Author */}
          <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-lg sm:text-xl shrink-0">
              {post.avatar}
            </div>
            <div className="min-w-0">
              <div className={`text-sm font-black truncate ${post.roleColor}`}>
                {post.author}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-600 whitespace-nowrap">
                {post.role} · {post.time}
              </div>
            </div>
            {post.pinned && (
              <div className="ml-auto flex items-center gap-1 text-[10px] sm:text-xs text-amber-500 shrink-0">
                <Pin size={11} /> Pinned
              </div>
            )}
          </div>

          <h2 className="text-base sm:text-xl font-black text-white mb-2 sm:mb-3 leading-snug">
            {post.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-3 sm:mb-4">
            {post.body}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {post.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700/50 flex items-center gap-1"
              >
                <Hash size={9} />
                {t}
              </span>
            ))}
          </div>

          {/* Votes + actions */}
          <div className="flex items-center gap-2 sm:gap-3 pb-4 sm:pb-5 border-b border-slate-800/60">
            <button
              onClick={() => handleVote("up")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-[10px] sm:text-[11px] font-bold transition-all ${votes.vote === "up" ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" : "border-slate-800 text-slate-500 hover:text-emerald-400 hover:border-emerald-500/30"}`}
            >
              <ChevronUp size={12} /> {votes.up}
            </button>
            <button
              onClick={() => handleVote("down")}
              className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-[10px] sm:text-[11px] font-bold transition-all ${votes.vote === "down" ? "bg-red-500/15 border-red-500/40 text-red-400" : "border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/30"}`}
            >
              <ChevronDown size={12} /> {votes.down}
            </button>
            <button className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-800 text-slate-500 hover:text-slate-300 text-[10px] sm:text-[11px] font-bold transition-all">
              <Share2 size={11} /> Share
            </button>
          </div>

          {/* Reply box */}
          <div className="mt-3 sm:mt-4 mb-4 sm:mb-5">
            <div className="flex gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-xs sm:text-sm shrink-0">
                👤
              </div>
              <div className="flex-1 flex gap-1.5 sm:gap-2 min-w-0">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && submitReply()
                  }
                  placeholder="Share your analysis…"
                  className="flex-1 min-w-0 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-xs sm:text-sm placeholder-slate-600 focus:outline-none focus:border-amber-500/40"
                />
                <button
                  onClick={submitReply}
                  className="px-2.5 sm:px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 transition-all shrink-0"
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Replies */}
          <div className="space-y-2.5 sm:space-y-3">
            {replies.map((r, i) => (
              <div
                key={i}
                className="flex gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-slate-900/40 border border-slate-800/40"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs sm:text-sm shrink-0">
                  {r.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5 mb-1.5">
                    <span
                      className={`text-xs font-black whitespace-nowrap ${r.roleColor}`}
                    >
                      {r.author}
                    </span>
                    <span className="text-[10px] text-slate-600 whitespace-nowrap">
                      {r.role}
                    </span>
                    <span className="text-[10px] text-slate-700 whitespace-nowrap ml-auto">
                      {r.time}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                    {r.body}
                  </p>
                  <button className="mt-1.5 flex items-center gap-1 text-[10px] text-slate-600 hover:text-emerald-400 transition-colors">
                    <ThumbsUp size={11} /> {r.upvotes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Post Card ───────────────────────────────────────────────────────── */
const PostCard = ({ post, onClick }: { post: Post; onClick: () => void }) => {
  const [votes, setVotes] = useState({ up: post.upvotes, vote: post.userVote });

  const handleVote = (e: React.MouseEvent, dir: "up" | "down") => {
    e.stopPropagation();
    if (dir === "up")
      setVotes((v) =>
        v.vote === "up"
          ? { up: post.upvotes, vote: null }
          : { up: post.upvotes + 1, vote: "up" },
      );
  };

  return (
    <motion.div
      variants={fadeUp}
      onClick={onClick}
      className="bg-[#0b1120] border border-slate-800/60 rounded-2xl p-3 sm:p-5 hover:border-slate-700 transition-all cursor-pointer group"
    >
      {/* Row 1: meta */}
      <div className="flex items-start min-[420px]:items-center gap-x-2 gap-y-1.5 mb-3 flex-wrap">
        {post.pinned && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
            <Pin size={11} /> Pinned
          </span>
        )}
        {post.flair && (
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${post.flairColor}`}
          >
            {post.flair}
          </span>
        )}
        <div className="flex items-center gap-1.5 min-w-0 min-[420px]:ml-auto">
          <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">
            {post.avatar}
          </div>
          <span className={`text-xs font-bold truncate ${post.roleColor}`}>
            {post.author}
          </span>
          <span className="text-[10px] text-slate-600 whitespace-nowrap">
            · {post.time}
          </span>
        </div>
      </div>

      {/* Title & body */}
      <h3 className="text-sm font-black text-white mb-1.5 leading-snug group-hover:text-amber-300 transition-colors">
        {post.title}
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
        {post.body}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.tags.map((t) => (
          <span
            key={t}
            className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-600 border border-slate-700/50 flex items-center gap-1"
          >
            <Hash size={9} />
            {t}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
        <button
          onClick={(e) => handleVote(e, "up")}
          className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${votes.vote === "up" ? "text-emerald-400" : "text-slate-500 hover:text-emerald-400"}`}
        >
          <ChevronUp size={14} /> {votes.up}
        </button>
        <span className="text-xs text-slate-600 flex items-center gap-1">
          <ThumbsDown size={11} /> {post.downvotes}
        </span>
        <span className="text-xs text-slate-600 flex items-center gap-1">
          <MessageSquare size={11} /> {post.replies} replies
        </span>
        <span className="text-xs text-slate-600 flex items-center gap-1 min-[420px]:ml-auto">
          <Activity size={11} /> {post.views.toLocaleString()} views
        </span>
      </div>
    </motion.div>
  );
};

/* ── New Post Modal ─────────────────────────────────────────────────── */
const NewPostModal = ({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (post: Post) => void;
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [flair, setFlair] = useState("Analysis");

  const flairs = [
    {
      label: "Analysis",
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      label: "Strategy",
      color: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    },
    {
      label: "Education",
      color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      label: "Learn Together",
      color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    },
    {
      label: "Discussion",
      color: "bg-slate-700/60 text-slate-300 border-slate-700",
    },
  ];

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) return;
    const flairEntry = flairs.find((f) => f.label === flair)!;
    onSubmit({
      id: Date.now(),
      author: "You",
      avatar: "👤",
      role: "Member",
      roleColor: "text-amber-400",
      time: "just now",
      title: title.trim(),
      body: body.trim(),
      tags: [],
      upvotes: 0,
      downvotes: 0,
      replies: 0,
      views: 0,
      flair,
      flairColor: flairEntry.color,
      userVote: null,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 pt-18"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-[#0b1120] border border-slate-800/60 rounded-2xl w-full max-w-[95vw] sm:max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
          <span className="text-[13px] font-black text-white">New Post</span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white text-sm transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Flair picker */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {flairs.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setFlair(f.label)}
                  className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded border transition-all ${flair === f.label ? f.color : "border-slate-800 text-slate-600 bg-slate-900/40 hover:border-slate-700"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your take or question?"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-white text-[13px] placeholder-slate-600 focus:outline-none focus:border-amber-500/40"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="Share your analysis, idea, or question in detail…"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 text-[12px] placeholder-slate-600 focus:outline-none focus:border-amber-500/40 resize-none"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !body.trim()}
            className="w-full py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
          >
            Post to Community
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── Main Component ──────────────────────────────────────────────────── */
const Community = () => {
  const { trackActivity } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top">("hot");
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);

  const filtered = posts.filter((p) => {
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.body.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      activeCategory === "all" ||
      (activeCategory === "analysis" && p.flair === "Analysis") ||
      (activeCategory === "learning" &&
        (p.flair === "Education" || p.flair === "Learn Together")) ||
      (activeCategory === "picks" &&
        p.tags.some((t) => ["Banking", "IT Sector", "Nifty50"].includes(t))) ||
      (activeCategory === "strategy" && p.flair === "Strategy");
    return matchSearch && matchCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "hot")
      return (
        b.upvotes -
        b.downvotes +
        b.replies * 5 -
        (a.upvotes - a.downvotes + a.replies * 5)
      );
    if (sortBy === "new") return b.id - a.id;
    return b.upvotes - a.upvotes;
  });

  const handleNewPost = (post: Post) => {
    setPosts((p) => [post, ...p]);
    void trackActivity("community_post_created", {
      postId: post.id,
      title: post.title,
      flair: post.flair || null,
    });
  };

  const openComposer = (source: string) => {
    setShowNewPost(true);
    void trackActivity("community_composer_opened", { source });
  };

  const openPost = (post: Post) => {
    setSelectedPost(post);
    void trackActivity("community_post_opened", {
      postId: post.id,
      title: post.title,
      author: post.author,
    });
  };

  return (
    <section className="min-h-screen bg-finance-darker relative overflow-hidden pt-12 sm:pt-14 md:pt-16 pb-10 sm:pb-14 md:pb-20 lg:pb-24 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
      {/* Glow orbs */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-150 h-125 rounded-full blur-3xl opacity-15"
        style={{
          background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-125 h-100 rounded-full blur-3xl opacity-10"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative">
        {/* ── Hero ── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="text-center pt-6 sm:pt-8 md:pt-10 mb-8 sm:mb-12"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4 sm:mb-6"
          >
            <Users size={14} className="text-amber-400" />
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
              FinMind Community
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4 md:mb-5 leading-tight"
          >
            Trade Smarter,{" "}
            <span className="bg-linear-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
              Together
            </span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-xs sm:text-base md:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-5 sm:mb-8 md:mb-10"
          >
            Discuss market analysis, share trade ideas, and learn from
            India&apos;s most active community of traders and investors.
          </motion.p>
          {/* Stats strip */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 min-[420px]:grid-cols-4 justify-items-center gap-3 sm:gap-6 mb-6 sm:mb-8"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <s.Icon size={13} className="text-amber-400 shrink-0" />
                <span className="text-white font-extrabold text-sm sm:text-lg">
                  {s.val}
                </span>
                <span className="text-slate-500 text-xs sm:text-base">
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
          <motion.button
            variants={fadeUp}
            onClick={() => openComposer("hero")}
            className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-bold text-sm text-black transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-500/20"
            style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
          >
            <MessageSquare size={14} /> Start a Discussion
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-start">
          {/* ── LEFT: Category Sidebar ── */}
          <div className="xl:col-span-1 space-y-4 xl:sticky xl:top-24">
            {/* Categories */}
            <div className="bg-[#0b1120] border border-slate-800/60 rounded-2xl p-4">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
                Browse
              </p>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const CIcon = cat.Icon;
                  const active = cat.id === activeCategory;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${active ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"}`}
                    >
                      <CIcon
                        size={13}
                        className={active ? "text-amber-400" : ""}
                      />
                      <span className="flex-1 text-sm font-semibold">
                        {cat.label}
                      </span>
                      <span
                        className={`text-xs ${active ? "text-amber-500" : "text-slate-700"}`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trending Tags */}
            <div className="bg-[#0b1120] border border-slate-800/60 rounded-2xl p-4">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Flame size={13} className="text-amber-400" /> Trending Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TRENDING_TAGS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSearchQuery(t)}
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition-all flex items-center gap-1"
                  >
                    <Hash size={8} />
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Community Rules */}
            <div className="bg-[#0b1120] border border-slate-800/60 rounded-2xl p-4">
              <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Shield size={13} className="text-slate-500" /> Community Rules
              </p>
              <ol className="space-y-2">
                {[
                  "No financial advice — share ideas, not directives",
                  "Always back claims with data or reasoning",
                  "No pump-and-dump or paid promotion",
                  "Be respectful — debate ideas, not people",
                  "No SEBI-prohibited activities",
                ].map((rule, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[10px] font-black text-slate-600 mt-0.5 shrink-0">
                      {i + 1}.
                    </span>
                    <span className="text-xs text-slate-500 leading-snug">
                      {rule}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* ── CENTER: Feed ── */}
          <div className="lg:col-span-2 xl:col-span-2 flex flex-col gap-4">
            {/* Scrollable Posts */}
            <div className="flex flex-col gap-4 max-h-none xl:max-h-[calc(100vh-5rem)] overflow-y-auto pr-1 [scrollbar-thin] [scrollbar-color:#334155_transparent]">
              {/* Toolbar */}
              <div className="flex items-center gap-2 flex-wrap sticky top-0 bg-[#070d1a] z-10 pb-2">
                <div className="relative flex-1 min-w-0">
                  <Search
                    size={12}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                  />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search discussions…"
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#0b1120] border border-slate-800 text-slate-300 text-xs sm:text-sm placeholder-slate-600 focus:outline-none focus:border-amber-500/40"
                  />
                </div>
                <div className="flex gap-1 bg-[#0b1120] border border-slate-800 rounded-xl p-1 shrink-0">
                  {(["hot", "new", "top"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSortBy(s)}
                      className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${sortBy === s ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      {s === "hot" ? "🔥" : s === "new" ? "🆕" : "⭐"} {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Post list */}
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {sorted.length > 0 ? (
                  sorted.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onClick={() => openPost(post)}
                    />
                  ))
                ) : (
                  <div className="text-center py-16 text-slate-600">
                    <MessageSquare
                      size={32}
                      className="mx-auto mb-3 opacity-40"
                    />
                    <p className="text-sm">
                      No posts found. Be the first to start a discussion!
                    </p>
                  </div>
                )}
              </motion.div>
            </div>

            <button
              onClick={() => openComposer("feed-footer")}
              className="mt-2 w-full py-3 rounded-2xl border-2 border-dashed border-slate-800 text-slate-600 text-sm font-bold hover:border-amber-500/30 hover:text-amber-500 transition-all flex items-center justify-center gap-2"
            >
              <MessageSquare size={16} /> Share your market view
            </button>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="xl:col-span-1 space-y-4 xl:sticky xl:top-24">
            {/* Top Members */}
            <div className="bg-[#0b1120] border border-slate-800/60 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={15} className="text-amber-400" />
                <p className="text-xs font-black text-white uppercase tracking-wider">
                  Top Contributors
                </p>
              </div>
              <div className="space-y-3">
                {TOP_MEMBERS.map((m) => (
                  <div key={m.name} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm">
                      {m.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-300 truncate">
                        {m.name}
                      </div>
                      <div className="text-[10px] text-slate-600">
                        {m.posts} posts · {m.likes.toLocaleString()} likes
                      </div>
                    </div>
                    <span className="text-sm">
                      {isNaN(Number(m.badge)) ? m.badge : `#${m.badge}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Insight */}
            <div
              className="bg-[#0b1120] border border-amber-500/20 rounded-2xl p-4"
              style={{
                background: "linear-gradient(135deg, #0d1a2e 0%, #0f1e35 100%)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Star size={15} className="text-amber-400" />
                <p className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  This Week&apos;s Insight
                </p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-2">
                &ldquo;The market punishes impatience severely and rewards
                discipline generously. The best trade is often no trade.&rdquo;
              </p>
              <p className="text-xs text-slate-600">
                — Shared by AlphaTrader99
              </p>
            </div>

            {/* Daily Challenge */}
            <div className="bg-[#0b1120] border border-slate-800/60 rounded-2xl p-5 mt-auto">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-amber-400" />
                <p className="text-xs font-black text-white uppercase tracking-wider">
                  Daily Challenge
                </p>
              </div>
              <p className="text-base text-slate-300 mb-3 leading-snug font-semibold">
                Name one sector outperforming Nifty 50 today and explain why in
                3 sentences or less.
              </p>
              <div className="flex items-center gap-2 mb-3">
                <Award size={14} className="text-amber-400" />
                <span className="text-xs text-slate-500">
                  84 answers · Ends in 6h
                </span>
              </div>
              <button
                onClick={() => openComposer("daily-challenge")}
                className="mt-3 w-full py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <ArrowRight size={12} /> Answer Challenge
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedPost && (
          <PostDetail
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showNewPost && (
          <NewPostModal
            onClose={() => setShowNewPost(false)}
            onSubmit={handleNewPost}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Community;
