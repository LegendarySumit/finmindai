import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { ComponentType } from 'react';
import { Code, Zap, Sparkles, ChevronRight, Terminal, Wifi, Library, ArrowRight } from 'lucide-react';

type SectionColor = 'cyan' | 'teal' | 'blue' | 'violet';

type Section = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
  items: string[];
  featured: boolean;
  color: SectionColor;
};

export default function Documentation() {
  const sections: Section[] = [
    {
      icon: Zap,
      title: 'Getting Started',
      description: 'Set up your development environment and make your first API call in minutes.',
      items: ['Installation & Setup', 'Authentication', 'Your First Request'],
      featured: true,
      color: 'cyan'
    },
    {
      icon: Wifi,
      title: 'WebSocket API',
      description: 'Real-time streaming data for market updates and trading signals.',
      items: ['Connection Management', 'Real-time Data Streams', 'Event Handling'],
      featured: true,
      color: 'teal'
    },
    {
      icon: Code,
      title: 'REST API',
      description: 'Traditional HTTP endpoints for querying market data and analysis.',
      items: ['Endpoints Reference', 'Request/Response Format', 'Error Handling'],
      featured: false,
      color: 'blue'
    },
    {
      icon: Library,
      title: 'SDKs & Libraries',
      description: 'Official SDKs for popular programming languages and frameworks.',
      items: ['JavaScript/TypeScript', 'Python', 'Go & More'],
      featured: false,
      color: 'violet'
    }
  ];

  const colorSchemes: Record<SectionColor, {
    border: string;
    bg: string;
    icon: string;
    title: string;
    badge: string;
    dot: string;
    shadow: string;
    blobStrong: string;
    blobSoft: string;
    button: string;
    listDotSolid: string;
  }> = {
    cyan: {
      border: 'border-cyan-500/30 hover:border-cyan-500/50',
      bg: 'bg-linear-to-br from-cyan-500/15 to-cyan-600/5',
      icon: 'text-cyan-400',
      title: 'text-cyan-300',
      badge: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300',
      dot: 'from-cyan-400 to-cyan-600',
      shadow: 'hover:shadow-cyan-500/10',
      blobStrong: 'bg-cyan-500/10',
      blobSoft: 'bg-cyan-500/5',
      button: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-500/50',
      listDotSolid: 'bg-cyan-500/60',
    },
    teal: {
      border: 'border-teal-500/30 hover:border-teal-500/50',
      bg: 'bg-linear-to-br from-teal-500/15 to-teal-600/5',
      icon: 'text-teal-400',
      title: 'text-teal-300',
      badge: 'bg-teal-500/20 border-teal-500/30 text-teal-300',
      dot: 'from-teal-400 to-teal-600',
      shadow: 'hover:shadow-teal-500/10',
      blobStrong: 'bg-teal-500/10',
      blobSoft: 'bg-teal-500/5',
      button: 'bg-teal-500/15 border-teal-500/30 text-teal-300 hover:bg-teal-500/25 hover:border-teal-500/50',
      listDotSolid: 'bg-teal-500/60',
    },
    blue: {
      border: 'border-blue-500/30 hover:border-blue-500/50',
      bg: 'bg-linear-to-br from-blue-500/15 to-blue-600/5',
      icon: 'text-blue-400',
      title: 'text-blue-300',
      badge: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
      dot: 'from-blue-400 to-blue-600',
      shadow: 'hover:shadow-blue-500/10',
      blobStrong: 'bg-blue-500/10',
      blobSoft: 'bg-blue-500/5',
      button: 'bg-blue-500/15 border-blue-500/30 text-blue-300 hover:bg-blue-500/25 hover:border-blue-500/50',
      listDotSolid: 'bg-blue-500/60',
    },
    violet: {
      border: 'border-violet-500/30 hover:border-violet-500/50',
      bg: 'bg-linear-to-br from-violet-500/15 to-violet-600/5',
      icon: 'text-violet-400',
      title: 'text-violet-300',
      badge: 'bg-violet-500/20 border-violet-500/30 text-violet-300',
      dot: 'from-violet-400 to-violet-600',
      shadow: 'hover:shadow-violet-500/10',
      blobStrong: 'bg-violet-500/10',
      blobSoft: 'bg-violet-500/5',
      button: 'bg-violet-500/15 border-violet-500/30 text-violet-300 hover:bg-violet-500/25 hover:border-violet-500/50',
      listDotSolid: 'bg-violet-500/60',
    }
  };

  return (
    <div className="bg-[#070d1a] min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-12 sm:pb-14 md:pb-16 lg:pb-20 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-widest">Developer Center</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">API Documentation</h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">Complete guide to integrate FinMindAI into your applications with real-time market data and advanced analytics</p>
        </div>
      </div>

      <div className="px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          
          {/* Featured Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 mb-16 sm:mb-24">
            {sections.filter(s => s.featured).map((section, i) => {
              const Icon = section.icon;
              const colors = colorSchemes[section.color];
              return (
                <div
                  key={i}
                  className={`bg-linear-to-br from-slate-800/60 to-slate-900/80 border ${colors.border} rounded-xl p-8 sm:p-10 overflow-hidden group relative transition-all hover:shadow-lg ${colors.shadow}`}
                >
                  {/* Background Decoration */}
                  <div className={`absolute -right-20 -top-20 w-64 h-64 ${colors.blobStrong} rounded-full blur-3xl group-hover:blur-2xl transition-all opacity-50`} />
                  <div className={`absolute -left-20 bottom-0 w-48 h-48 ${colors.blobSoft} rounded-full blur-3xl`} />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`p-4 ${colors.bg} rounded-xl border ${colors.border} shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.icon}`} />
                      </div>
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className={`text-2xl sm:text-3xl font-bold text-white mb-3 ${colors.title} transition-colors`}>
                      {section.title}
                    </h3>
                    <p className="text-slate-300 text-sm sm:text-base mb-8 flex-1 leading-relaxed">
                      {section.description}
                    </p>
                    
                    {/* Items List */}
                    <div className="space-y-3 mb-8 pt-6 border-t border-slate-700/50">
                      {section.items.map((item, j) => (
                        <div key={j} className="flex items-center gap-3 text-slate-300 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full bg-linear-to-r ${colors.dot}`}></div>
                          {item}
                        </div>
                      ))}
                    </div>
                    
                    {/* CTA Button */}
                    <button className={`inline-flex items-center gap-2 font-semibold text-sm py-2 px-4 rounded-lg border transition-all group/btn w-fit ${colors.button}`}>
                      View Details
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* All Sections Grid */}
          <div className="mb-16 sm:mb-24">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">More Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {sections.filter(s => !s.featured).map((section, i) => {
                const Icon = section.icon;
                const colors = colorSchemes[section.color];
                return (
                  <div
                    key={i}
                    className={`bg-slate-900/40 border ${colors.border} rounded-xl p-8 sm:p-10 overflow-hidden group relative transition-all hover:shadow-lg`}
                  >
                    {/* Background Decoration */}
                    <div className={`absolute -right-20 -top-20 w-48 h-48 ${colors.blobSoft} rounded-full blur-3xl opacity-30`} />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className={`p-3 ${colors.bg} rounded-lg border ${colors.border} w-fit mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${colors.icon}`} />
                      </div>
                      
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-slate-400 text-sm sm:text-base mb-6 flex-1 leading-relaxed">
                        {section.description}
                      </p>
                      
                      <div className="space-y-2 mb-6">
                        {section.items.map((item, j) => (
                          <div key={j} className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                            <div className={`w-1 h-1 rounded-full ${colors.listDotSolid}`}></div>
                            {item}
                          </div>
                        ))}
                      </div>
                      
                      <button className={`inline-flex items-center gap-2 font-semibold text-sm ${colors.icon} hover:gap-3 transition-all group/btn w-fit`}>
                        Learn More
                        <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Code Examples Section */}
          <div className="bg-linear-to-br from-slate-800/60 to-slate-900/80 border border-emerald-500/30 rounded-xl p-8 sm:p-10 md:p-12 relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute -right-32 -top-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:blur-2xl transition-all" />
            <div className="absolute -left-32 bottom-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/15 rounded-lg border border-emerald-500/30">
                  <Terminal className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Code Examples</h2>
              </div>
              
              <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-2xl leading-relaxed">
                Ready to start integrating? Explore our comprehensive code examples covering real-time data, market sentiment analysis, trading signals, and portfolio management.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { label: 'Real-time Stock Updates', icon: '📈', color: 'emerald' },
                  { label: 'Market Sentiment', icon: '📊', color: 'emerald' },
                  { label: 'Trading Signals', icon: '⚡', color: 'emerald' },
                  { label: 'Portfolio Management', icon: '💼', color: 'emerald' }
                ].map((example, i) => (
                  <div key={i} className="p-5 sm:p-6 bg-linear-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-lg hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition-all cursor-pointer group/item">
                    <p className="text-white font-semibold text-sm sm:text-base flex items-center gap-3">
                      <span className="text-xl">{example.icon}</span>
                      {example.label}
                    </p>
                  </div>
                ))}
              </div>
              
              <button className="inline-flex items-center gap-2 px-7 py-3 sm:py-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/40 transition-all text-sm sm:text-base group/btn">
                Explore Examples
                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
