"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Sparkles,
  Calendar,
  ArrowRight,
  BookOpen,
  Zap,
  Star,
} from "lucide-react";

export default function Research() {
  const featuredReport = {
    title: "Q1 2026 Market Outlook",
    icon: TrendingUp,
    date: "March 2026",
    excerpt:
      "Comprehensive analysis of market trends, economic indicators, and investment opportunities for Q1 2026.",
    topics: ["AI Sector", "Tech Stocks", "Market Trends"],
  };

  const reports = [
    {
      title: "Sector Performance Analysis",
      icon: BarChart3,
      date: "February 2026",
      excerpt:
        "Detailed breakdown of sector performance across technology, finance, healthcare, and consumer sectors.",
      topics: ["Technology", "Finance", "Healthcare"],
    },
    {
      title: "Portfolio Allocation Strategy",
      icon: PieChart,
      date: "January 2026",
      excerpt:
        "Strategic asset allocation recommendations based on current market conditions and risk profiles.",
      topics: ["Asset Allocation", "Risk Management", "Diversification"],
    },
    {
      title: "Cryptocurrency Market Review",
      icon: BarChart3,
      date: "December 2025",
      excerpt:
        "Analysis of cryptocurrency market dynamics, emerging opportunities, and regulatory landscape.",
      topics: ["Crypto", "Blockchain", "Digital Assets"],
    },
    {
      title: "Global Economic Indicators",
      icon: TrendingUp,
      date: "November 2025",
      excerpt:
        "Key economic metrics including GDP growth, inflation rates, and employment trends worldwide.",
      topics: ["Economics", "Global Markets", "Indicators"],
    },
  ];

  const FeaturedIcon = featuredReport.icon;

  return (
    <div className="bg-[#070d1a] min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-12 sm:pb-14 md:pb-16 lg:pb-20 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-widest">
              Market Intelligence
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
            Research Reports
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">
            In-depth market analysis and investment insights from our team of
            expert analysts
          </p>
        </div>
      </div>

      <div className="px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          {/* Featured Report - Full Width */}
          <div className="mb-16 sm:mb-24">
            <div className="bg-linear-to-br from-slate-800/60 to-slate-900/80 border border-cyan-500/30 rounded-xl p-8 sm:p-10 md:p-12 relative overflow-hidden group">
              {/* Background Decoration */}
              <div className="absolute -right-40 -top-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl group-hover:blur-2xl transition-all" />
              <div className="absolute -left-40 bottom-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
                  {/* Left Content */}
                  <div className="md:col-span-2 flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 sm:p-4 bg-linear-to-br from-cyan-500/30 to-teal-600/20 rounded-xl border border-cyan-500/40 shrink-0 group-hover:scale-110 transition-transform">
                        <FeaturedIcon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Star
                          size={16}
                          className="text-cyan-400 fill-cyan-400"
                        />
                        <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest">
                          Featured Report
                        </span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-cyan-300/80 mb-6">
                      <Calendar size={16} />
                      <span className="font-medium">{featuredReport.date}</span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
                      {featuredReport.excerpt}
                    </p>

                    {/* Topics */}
                    <div className="space-y-4">
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                        Key Topics
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {featuredReport.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="px-3 py-2 bg-cyan-500/15 text-cyan-300 text-xs font-bold rounded-lg border border-cyan-500/30 uppercase tracking-wider hover:bg-cyan-500/25 transition-colors"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Title + CTA */}
                  <div className="md:col-span-1 flex flex-col justify-between gap-6">
                    {/* Title Section */}
                    <div>
                      <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-white leading-tight group-hover:text-cyan-300 transition-colors">
                        {featuredReport.title}
                      </h2>
                    </div>

                    {/* CTA Box */}
                    <div className="bg-linear-to-br from-cyan-500/10 to-teal-500/5 border border-cyan-500/20 rounded-lg p-6 backdrop-blur-sm">
                      <div className="text-sm text-slate-400 mb-3 font-medium">
                        Get Full Access
                      </div>
                      <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                        Dive deep into comprehensive market analysis, economic
                        indicators, and investment opportunities.
                      </p>
                      <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-linear-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-900 font-semibold rounded-lg transition-all text-sm">
                        Read Report
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          <div className="mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
              Latest Reports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {reports.map((report, i) => {
                const Icon = report.icon;
                const colorSchemes = [
                  {
                    icon: "text-cyan-400",
                    border: "border-cyan-500/20 hover:border-cyan-500/40",
                    bg: "bg-cyan-500/10 hover:bg-cyan-500/15",
                  },
                  {
                    icon: "text-orange-400",
                    border: "border-orange-500/20 hover:border-orange-500/40",
                    bg: "bg-orange-500/10 hover:bg-orange-500/15",
                  },
                  {
                    icon: "text-violet-400",
                    border: "border-violet-500/20 hover:border-violet-500/40",
                    bg: "bg-violet-500/10 hover:bg-violet-500/15",
                  },
                  {
                    icon: "text-pink-400",
                    border: "border-pink-500/20 hover:border-pink-500/40",
                    bg: "bg-pink-500/10 hover:bg-pink-500/15",
                  },
                ];
                const scheme = colorSchemes[i % colorSchemes.length];

                return (
                  <div
                    key={i}
                    className={`bg-slate-900/40 border ${scheme.border} rounded-lg p-6 sm:p-7 transition-all group hover:shadow-lg backdrop-blur-sm flex flex-col`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg ${scheme.bg} border ${scheme.border.split(" ")[0]}`}
                      >
                        <Icon size={20} className={scheme.icon} />
                      </div>
                      <span className="text-xs text-slate-500 shrink-0">
                        {i + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors">
                      {report.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                      <Calendar size={14} />
                      <span>{report.date}</span>
                    </div>

                    <p className="text-sm text-slate-400 mb-6 flex-1 leading-relaxed">
                      {report.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6 pt-4 border-t border-slate-700/50">
                      {report.topics.map((topic, j) => (
                        <span
                          key={j}
                          className="text-xs bg-slate-800/60 text-slate-300 px-2 py-1 rounded border border-slate-700/40 font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    <button className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors group/btn">
                      Read Report
                      <ArrowRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-linear-to-br from-emerald-500/15 to-teal-600/10 border border-emerald-500/30 rounded-xl p-8 sm:p-10 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:blur-2xl transition-all" />
            <div className="absolute -left-20 bottom-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left Content */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={18} className="text-emerald-400" />
                    <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">
                      Exclusive Insights
                    </span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
                    Never Miss a Market Move
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base mb-2 leading-relaxed">
                    Get exclusive research reports delivered weekly. Our team of
                    expert analysts provides sector analysis, market insights,
                    and personalized investment recommendations.
                  </p>
                  <p className="text-xs text-slate-500">
                    Free access for 2 weeks, then $29/month. Cancel anytime.
                  </p>
                </div>

                {/* Right CTA */}
                <div className="flex flex-col items-start md:items-end gap-4">
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-900 font-bold rounded-lg transition-all text-base shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 whitespace-nowrap">
                    <BookOpen size={20} />
                    Subscribe Now
                  </button>
                  <div className="hidden md:block text-xs text-slate-500 text-right max-w-xs">
                    Join 15K+ investors receiving weekly market insights
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
