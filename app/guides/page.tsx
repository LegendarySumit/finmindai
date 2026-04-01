'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { BookOpen, Zap, Target, TrendingUp, Shield, ArrowRight, Sparkles } from 'lucide-react';

export default function Guides() {


  const guides = [
    {
      icon: BookOpen,
      title: 'Beginner Investor Guide',
      description: 'Learn the fundamentals of investing, from understanding markets to opening your first account.',
      lessons: 6,
      color: 'emerald'
    },
    {
      icon: TrendingUp,
      title: 'Technical Analysis Mastery',
      description: 'Master chart patterns, indicators, and trading signals for making informed trading decisions.',
      lessons: 8,
      color: 'blue'
    },
    {
      icon: Target,
      title: 'Options Trading Strategies',
      description: 'Advanced strategies for hedging, income generation, and complex trading scenarios.',
      lessons: 12,
      color: 'violet'
    },
  ];

  return (
    <div className="bg-[#070d1a] min-h-screen">
      <Header />

      {/* Hero Section */}
      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-12 sm:pb-14 md:pb-16 lg:pb-20 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span className="text-amber-400 font-semibold text-sm uppercase tracking-widest">Strategy Guides</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Master Trading & Investing</h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">Explore our structured learning guides to develop your trading skills, from beginner fundamentals to advanced strategies</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          
          {/* Featured Guides */}
          <div className="mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Featured Learning Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
              {guides.map((guide, i) => {
                const Icon = guide.icon;
                const colorStyles = {
                  emerald: 'border-emerald-500/20 hover:border-emerald-500/40',
                  blue: 'border-blue-500/20 hover:border-blue-500/40',
                  violet: 'border-violet-500/20 hover:border-violet-500/40',
                };
                
                const textStyles = {
                  emerald: 'text-emerald-400',
                  blue: 'text-blue-400',
                  violet: 'text-violet-400',
                };

                return (
                  <div
                    key={i}
                    className={`p-6 sm:p-7 rounded-lg bg-slate-900/50 border transition-all ${colorStyles[guide.color as keyof typeof colorStyles]} hover:shadow-lg`}
                  >
                    <div className="mb-4">
                      <Icon size={28} className={textStyles[guide.color as keyof typeof textStyles]} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{guide.title}</h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{guide.description}</p>
                    <div className="text-xs text-slate-500 mb-4">
                      {guide.lessons} lessons included
                    </div>
                    <Link href="/#learning-hub">
                      <button className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors">
                        Learn More
                        <ArrowRight size={14} />
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info Section */}
          <div className="mb-16 sm:mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              {/* Main CTA Card */}
              <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-amber-500/30 rounded-xl p-8 sm:p-10 relative overflow-hidden group">
                <div className="absolute -right-32 -top-32 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:blur-2xl transition-all" />
                <div className="relative z-10">
                  <span className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-4">
                    <Zap size={16} /> Ready to Master Trading?
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                    Unlock Your Full Potential
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base mb-8 leading-relaxed max-w-xl">
                    Access our complete Learning Hub with structured courses, video lessons, interactive modules, and real-world examples designed for every skill level.
                  </p>
                  <Link href="/#learning-hub">
                    <button className="group/btn inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-semibold rounded-lg transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50">
                      Start Learning Now
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-5 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">21</div>
                  <div className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">Complete Courses</div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-5 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-blue-400 mb-1">180+</div>
                  <div className="text-xs uppercase tracking-widest text-blue-300 font-semibold">Video Lessons</div>
                </div>
                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-5 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-violet-400 mb-1">Beginner → Advanced</div>
                  <div className="text-xs uppercase tracking-widest text-violet-300 font-semibold">3 Learning Paths</div>
                </div>
              </div>
            </div>
          </div>

          {/* Topics Section */}
          <div className="mb-0">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Explore By Topic</h2>
              <p className="text-slate-500 text-sm">Jump directly to subjects that interest you</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                { label: 'Stock Basics', icon: BookOpen, color: 'emerald' },
                { label: 'Technical', icon: TrendingUp, color: 'blue' },
                { label: 'Risk Mgmt', icon: Shield, color: 'amber' },
                { label: 'Portfolio', icon: Target, color: 'violet' },
                { label: 'Options', icon: Zap, color: 'orange' },
                { label: 'Fundamentals', icon: BookOpen, color: 'cyan' },
              ].map((topic, i) => {
                const Icon = topic.icon;
                const colorMap = {
                  emerald: 'text-emerald-400 border-emerald-500/20 hover:border-emerald-400/50 hover:bg-emerald-500/10',
                  blue: 'text-blue-400 border-blue-500/20 hover:border-blue-400/50 hover:bg-blue-500/10',
                  amber: 'text-amber-400 border-amber-500/20 hover:border-amber-400/50 hover:bg-amber-500/10',
                  violet: 'text-violet-400 border-violet-500/20 hover:border-violet-400/50 hover:bg-violet-500/10',
                  orange: 'text-orange-400 border-orange-500/20 hover:border-orange-400/50 hover:bg-orange-500/10',
                  cyan: 'text-cyan-400 border-cyan-500/20 hover:border-cyan-400/50 hover:bg-cyan-500/10',
                };
                
                return (
                  <Link href="/#learning-hub" key={i}>
                    <button className={`w-full p-3 sm:p-4 text-center bg-slate-900/40 border ${colorMap[topic.color as keyof typeof colorMap]} rounded-lg transition-all flex flex-col items-center gap-2.5 group backdrop-blur-sm hover:shadow-lg hover:shadow-${topic.color === 'emerald' ? 'emerald' : topic.color === 'blue' ? 'blue' : topic.color === 'amber' ? 'amber' : topic.color === 'violet' ? 'violet' : topic.color === 'orange' ? 'orange' : 'cyan'}-500/20`}>
                      <Icon size={20} className={colorMap[topic.color as keyof typeof colorMap].split(' ')[0]} />
                      <span className="text-slate-200 group-hover:text-white transition-colors font-medium text-xs sm:text-sm">{topic.label}</span>
                    </button>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
