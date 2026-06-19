"use client";

import { motion } from "framer-motion";
import type { ComponentType, CSSProperties } from "react";
import {
  BookOpen,
  TrendingUp,
  Newspaper,
  Users,
  ArrowUpRight,
} from "lucide-react";

// Mini SVG sparklines as decorative backgrounds
const Sparkline = ({ d, color }: { d: string; color: string }) => (
  <svg
    viewBox="0 0 120 40"
    className="w-full h-full"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.25" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d={d + " L120,40 L0,40 Z"} fill={`url(#sg-${color})`} />
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeOpacity="0.5"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

const SPARKLINES = {
  up: "M0,32 C15,28 25,18 40,15 C55,12 65,22 80,10 C95,0 110,8 120,5",
  wave: "M0,20 C10,10 20,30 35,20 C50,10 60,30 75,18 C90,8 105,25 120,15",
  surge: "M0,35 C20,32 35,28 50,20 C65,12 75,8 90,5 C100,3 110,6 120,4",
  flat: "M0,22 C15,20 30,24 50,18 C70,12 90,20 120,16",
};

type FeatureCard = {
  index: string;
  Icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  title: string;
  tag: string;
  description: string;
  accent: string;
  accentClass: string;
  borderHover: string;
  bgHover: string;
  metric: {
    label: string;
    value: string;
  };
  sparkline: string;
  span?: string;
  tall?: boolean;
  wide?: boolean;
  status: "LIVE" | "ACTIVE" | "BETA";
};

const features: FeatureCard[] = [
  {
    index: "01",
    Icon: BookOpen,
    title: "Academy",
    tag: "LEARNING ENGINE",
    description:
      "Master markets through adaptive AI-curated lessons, real-world case studies, and live simulations that evolve with your skill level.",
    accent: "#3b82f6",
    accentClass: "text-blue-400",
    borderHover: "hover:border-blue-500/50",
    bgHover: "group-hover:from-blue-600/10",
    metric: { label: "Active Learners", value: "12.4K" },
    sparkline: SPARKLINES.surge,
    span: "lg:col-span-2",
    tall: true,
    status: "LIVE",
  },
  {
    index: "02",
    Icon: TrendingUp,
    title: "War Room",
    tag: "STRATEGY ARENA",
    description:
      "Battle-test ideas in real-time prediction markets. Compete with AI opponents and climb global leaderboards.",
    accent: "#fbbf24",
    accentClass: "text-finance-gold",
    borderHover: "hover:border-finance-gold/50",
    bgHover: "group-hover:from-amber-500/10",
    metric: { label: "Win Rate", value: "68%" },
    sparkline: SPARKLINES.wave,
    span: "lg:col-span-1",
    status: "ACTIVE",
  },
  {
    index: "03",
    Icon: Newspaper,
    title: "News Intel",
    tag: "NEWS INTEL",
    description:
      "Real-time news analysis with AI sentiment scoring. Know what moves markets before it moves them.",
    accent: "#a855f7",
    accentClass: "text-purple-400",
    borderHover: "hover:border-purple-500/50",
    bgHover: "group-hover:from-purple-600/10",
    metric: { label: "Signals Today", value: "1,204" },
    sparkline: SPARKLINES.up,
    span: "lg:col-span-1",
    status: "LIVE",
  },
  {
    index: "04",
    Icon: BookOpen,
    title: "Learning Hub",
    tag: "EDUCATION HUB",
    description:
      "Master markets through structured lessons from beginner to advanced. Learn technical analysis, fundamentals, derivatives, options, and portfolio management strategies.",
    accent: "#3b82f6",
    accentClass: "text-blue-400",
    borderHover: "hover:border-blue-500/50",
    bgHover: "group-hover:from-blue-600/10",
    metric: { label: "Modules", value: "21" },
    sparkline: SPARKLINES.surge,
    span: "lg:col-span-1",
    status: "LIVE",
  },
  {
    index: "05",
    Icon: Users,
    title: "Community",
    tag: "TRADING FLOOR",
    description:
      "Connect with traders and analysts. Share market insights, discuss strategies, post stock picks, and learn from experienced traders in real-time discussions.",
    accent: "#06b6d4",
    accentClass: "text-cyan-400",
    borderHover: "hover:border-cyan-500/50",
    bgHover: "group-hover:from-cyan-600/10",
    metric: { label: "Active Posts", value: "248" },
    sparkline: SPARKLINES.wave,
    span: "lg:col-span-1",
    status: "LIVE",
  },
];

const statusColor: Record<string, string> = {
  LIVE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  ACTIVE: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  BETA: "bg-amber-500/15 text-amber-400 border-amber-500/30",
};

const Features = () => {
  // Map feature titles to their respective routes
  const featureRoutes: Record<string, string> = {
    Academy: "#dashboard",
    "War Room": "#war-room",
    "News Intel": "/market-intelligence",
    "Learning Hub": "#learning-hub",
    Community: "#community",
  };

  const handleFeatureClick = (title: string) => {
    const route = featureRoutes[title];
    if (route) {
      window.location.assign(route);
    }
  };

  return (
    <section
      id="features"
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-finance-darker relative overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,191,36,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.8) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-175 h-175 bg-finance-gold/5 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.1, 0.04] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 relative">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <motion.div
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 bg-finance-gold/10 border border-finance-gold/25 rounded-full mb-3 sm:mb-4 lg:mb-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-finance-gold"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.3, repeat: Infinity }}
            />
            <span className="text-xs sm:text-[10px] md:text-xs text-finance-gold font-bold uppercase tracking-wider sm:tracking-widest">
              Platform Modules
            </span>
          </motion.div>
          <motion.h2
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 lg:mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Everything You Need to{" "}
            <span className="text-finance-gold glow-gold">
              Dominate Markets
            </span>
          </motion.h2>
          <motion.p
            className="text-slate-400 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Institutional-grade tools designed for the next generation of
            strategic investors
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 auto-rows-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              onClick={() => handleFeatureClick(f.title)}
              className={`group relative bg-finance-card/60 backdrop-blur-sm border border-finance-border ${f.borderHover} rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${f.span ?? ""} ${f.tall ? "min-h-48 sm:min-h-60 lg:min-h-72" : ""}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              whileHover={{
                y: -4,
                boxShadow: `0 20px 60px -12px ${f.accent}33`,
              }}
            >
              {/* Gradient wash on hover */}
              <div
                className={`absolute inset-0 bg-linear-to-br ${f.bgHover} from-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
              />

              {/* Sparkline background */}
              <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <Sparkline d={f.sparkline} color={f.accent} />
              </div>

              {/* Faded index watermark */}
              <span className="absolute -top-3 -right-1 text-4xl sm:text-6xl lg:text-8xl font-black text-white/4 select-none leading-none pointer-events-none">
                {f.index}
              </span>

              <div
                className={`relative z-10 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col h-full gap-3 sm:gap-4 ${f.wide ? "md:flex-row md:items-center" : ""}`}
              >
                {/* Top row: tag + status */}
                <div className={`${f.wide ? "md:w-64 shrink-0" : ""}`}>
                  <div className="flex items-center justify-between mb-2.5 sm:mb-3 lg:mb-4">
                    <span
                      className={`text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-wider sm:tracking-[0.2em] uppercase ${f.accentClass} opacity-70`}
                    >
                      {f.tag}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-bold border ${statusColor[f.status]}`}
                    >
                      <motion.span
                        className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-current"
                        animate={{
                          opacity: f.status === "LIVE" ? [1, 0.2, 1] : 1,
                        }}
                        transition={{ duration: 1.1, repeat: Infinity }}
                      />
                      {f.status}
                    </span>
                  </div>

                  {/* Icon — hexagonal clip */}
                  <div className="relative w-10 sm:w-12 h-10 sm:h-12 mb-3 lg:mb-4">
                    <div
                      className="absolute inset-0 rounded-lg sm:rounded-xl rotate-6 opacity-30"
                      style={{ background: f.accent }}
                    />
                    <div
                      className="relative w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center"
                      style={{
                        background: `${f.accent}22`,
                        border: `1px solid ${f.accent}44`,
                      }}
                    >
                      <f.Icon
                        className="w-4 sm:w-5 h-4 sm:h-5"
                        style={{ color: f.accent }}
                      />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white mb-0.5 sm:mb-1 tracking-tight">
                    {f.title}
                  </h3>
                </div>

                <div
                  className={`flex flex-col justify-between flex-1 ${f.wide ? "md:border-l md:border-finance-border md:pl-6 lg:pl-8" : ""}`}
                >
                  <p className="text-slate-400 text-xs sm:text-sm md:text-[15px] lg:text-base leading-relaxed mb-4 sm:mb-5">
                    {f.description}
                  </p>

                  {/* Bottom: metric + launch */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] uppercase tracking-wider sm:tracking-widest text-slate-600 font-semibold mb-0.5">
                        {f.metric.label}
                      </p>
                      <p
                        className={`text-base sm:text-lg md:text-xl lg:text-2xl font-black ${f.accentClass}`}
                      >
                        {f.metric.value}
                      </p>
                    </div>
                    <motion.div
                      className="flex items-center gap-0.5 sm:gap-1 text-[7px] sm:text-xs md:text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                      style={{ color: f.accent }}
                    >
                      <span className="hidden sm:inline">Open Module</span>
                      <ArrowUpRight className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(90deg, transparent, ${f.accent}88, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
