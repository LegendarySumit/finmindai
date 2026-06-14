"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Newspaper,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Clock,
} from "lucide-react";

type Sentiment = "positive" | "negative" | "neutral";

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  sentiment: Sentiment;
  time: string;
  impactedStocks: string[];
  impactScore: number;
}

const MarketIntelligence = () => {
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment | "all">(
    "all",
  );

  const newsData: NewsItem[] = [
    {
      id: 1,
      title: "Federal Reserve Signals Rate Cuts Ahead",
      summary:
        "Fed Chairman hints at potential rate reductions in Q2, boosting market sentiment across sectors.",
      sentiment: "positive",
      time: "5 mins ago",
      impactedStocks: ["SPY", "QQQ", "DIA"],
      impactScore: 8.5,
    },
    {
      id: 2,
      title: "Tech Giants Report Record Earnings",
      summary:
        "Major tech companies exceed expectations, driven by AI infrastructure investments.",
      sentiment: "positive",
      time: "12 mins ago",
      impactedStocks: ["AAPL", "MSFT", "GOOGL"],
      impactScore: 9.2,
    },
    {
      id: 3,
      title: "Oil Prices Surge Amid Supply Concerns",
      summary:
        "Crude oil jumps 5% as OPEC announces production cuts, raising inflation fears.",
      sentiment: "negative",
      time: "25 mins ago",
      impactedStocks: ["XOM", "CVX", "USO"],
      impactScore: 7.8,
    },
    {
      id: 4,
      title: "EV Market Competition Intensifies",
      summary:
        "New players enter electric vehicle space, pressuring established manufacturers.",
      sentiment: "neutral",
      time: "1 hour ago",
      impactedStocks: ["TSLA", "RIVN", "F"],
      impactScore: 6.5,
    },
    {
      id: 5,
      title: "Banking Sector Faces Regulatory Scrutiny",
      summary:
        "New regulations proposed for regional banks following recent failures.",
      sentiment: "negative",
      time: "2 hours ago",
      impactedStocks: ["BAC", "JPM", "WFC"],
      impactScore: 8.0,
    },
    {
      id: 6,
      title: "Renewable Energy Sector Sees Investment Surge",
      summary:
        "Green energy companies attract record funding as sustainability goals accelerate.",
      sentiment: "positive",
      time: "3 hours ago",
      impactedStocks: ["ENPH", "SEDG", "ICLN"],
      impactScore: 7.5,
    },
  ];

  const filteredNews =
    sentimentFilter === "all"
      ? newsData
      : newsData.filter((news) => news.sentiment === sentimentFilter);

  const NewsCard = ({ news }: { news: NewsItem }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-2 h-2 rounded-full ${
                news.sentiment === "positive"
                  ? "bg-emerald-500"
                  : news.sentiment === "negative"
                    ? "bg-red-500"
                    : "bg-yellow-500"
              }`}
            />
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {news.time}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {news.title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            {news.summary}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {news.sentiment === "positive" ? (
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
          ) : news.sentiment === "negative" ? (
            <ArrowDownRight className="w-5 h-5 text-red-500" />
          ) : (
            <Activity className="w-5 h-5 text-yellow-500" />
          )}
          <div className="text-right">
            <p className="text-xs text-slate-500">Impact</p>
            <p className="text-sm font-bold text-white">
              {news.impactScore}/10
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800">
        {news.impactedStocks.map((stock) => (
          <span
            key={stock}
            className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-400 font-medium"
          >
            {stock}
          </span>
        ))}
      </div>
    </motion.div>
  );

  return (
    <section id="news" className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Market{" "}
            <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h2>
          <p className="text-slate-400 text-lg">
            Real-time news with AI-powered sentiment analysis
          </p>
        </div>

        {/* Sentiment Filter */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {(["all", "positive", "negative", "neutral"] as const).map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setSentimentFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sentimentFilter === filter
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                }`}
              >
                {filter === "all" && (
                  <Newspaper className="w-4 h-4 inline mr-2" />
                )}
                {filter === "positive" && (
                  <ArrowUpRight className="w-4 h-4 inline mr-2" />
                )}
                {filter === "negative" && (
                  <ArrowDownRight className="w-4 h-4 inline mr-2" />
                )}
                {filter === "neutral" && (
                  <Activity className="w-4 h-4 inline mr-2" />
                )}
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ),
          )}
        </div>

        {/* News Feed */}
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </AnimatePresence>
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">
              No news matching this sentiment filter
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MarketIntelligence;
