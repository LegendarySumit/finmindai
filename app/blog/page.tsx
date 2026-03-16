import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Calendar, User, ChevronRight, Sparkles, TrendingUp, Zap } from 'lucide-react';

export default function Blog() {
  const featuredPost = {
    title: 'Market Rally: What Drives Tech Stocks Higher?',
    author: 'Sarah Chen',
    date: 'March 8, 2026',
    category: 'Market Analysis',
    excerpt: 'An in-depth look at the factors driving the recent surge in technology stocks and what it means for investors.',
    image: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800',
    readTime: '8 min read'
  };

  const posts = [
    {
      title: 'AI Revolution: Investment Opportunities in 2026',
      author: 'James Patterson',
      date: 'March 5, 2026',
      category: 'Sector Focus',
      excerpt: 'Exploring the most promising AI-related investment opportunities as the sector continues to evolve.',
      image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '10 min read'
    },
    {
      title: 'Portfolio Rebalancing: When and How',
      author: 'Emily Rodriguez',
      date: 'February 28, 2026',
      category: 'Strategy',
      excerpt: 'Understanding the importance of portfolio rebalancing and practical strategies for maintaining optimal asset allocation.',
      image: 'https://images.pexels.com/photos/3962286/pexels-photo-3962286.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '7 min read'
    },
    {
      title: 'Cryptocurrency Market Insights',
      author: 'Michael Davis',
      date: 'February 25, 2026',
      category: 'Crypto',
      excerpt: 'Latest trends in the cryptocurrency market and emerging opportunities for digital asset investors.',
      image: 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '9 min read'
    },
    {
      title: 'Economic Indicators to Watch This Quarter',
      author: 'Lisa Thompson',
      date: 'February 20, 2026',
      category: 'Macro',
      excerpt: 'Key economic indicators that could impact market performance in the coming months.',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '6 min read'
    },
    {
      title: 'Dividend Stocks for Passive Income',
      author: 'Robert Wilson',
      date: 'February 15, 2026',
      category: 'Income',
      excerpt: 'Building a dividend-focused portfolio for consistent passive income streams.',
      image: 'https://images.pexels.com/photos/3532557/pexels-photo-3532557.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '8 min read'
    },
    {
      title: 'Risk Management Strategies for 2026',
      author: 'Jennifer Lee',
      date: 'February 10, 2026',
      category: 'Risk',
      excerpt: 'Essential techniques and strategies to protect your portfolio in volatile market conditions.',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
      readTime: '7 min read'
    }
  ];

  const categories = [
    { name: 'All', count: posts.length + 1 },
    { name: 'Market Analysis', count: 2 },
    { name: 'Strategy', count: 2 },
    { name: 'Sector Focus', count: 1 },
    { name: 'Crypto', count: 1 }
  ];

  return (
    <div className="bg-finance-darker min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 pb-8 sm:pb-10 md:pb-12 lg:pb-16 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 bg-linear-to-b from-finance-dark/50 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-finance-gold" />
            <span className="text-finance-gold font-semibold text-sm uppercase tracking-widest">Latest from FinMindAI</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">Industry News & Insights</h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl">Expert analysis, market trends, and investment strategies from FinMindAI&apos;s team of seasoned analysts</p>
        </div>
      </div>

      <div className="px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          
          {/* Featured Post */}
          <div className="mb-16 sm:mb-20">
            <div className="bg-linear-to-br from-finance-card to-finance-card/50 border border-finance-gold/30 rounded-xl overflow-hidden hover:border-finance-gold transition-all duration-300 group">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative h-80 md:h-full overflow-hidden bg-linear-to-br from-finance-gold/20 to-amber-600/10">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-finance-dark/40 to-transparent"></div>
                </div>
                <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-linear-to-r from-finance-gold/30 to-amber-600/30 text-finance-gold text-xs font-bold rounded-full border border-finance-gold/50 uppercase tracking-wider">
                      Featured
                    </span>
                    <span className="text-slate-500 text-xs">
                      ⭐ Editor&apos;s Pick
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-finance-gold transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-4 mb-6 text-xs sm:text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-finance-gold" />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-finance-gold" />
                      {featuredPost.author}
                    </div>
                    <div className="text-finance-gold">•</div>
                    <span className="text-finance-gold/70">{featuredPost.readTime}</span>
                  </div>
                  <button className="flex items-center gap-2 text-finance-gold font-bold hover:gap-3 transition-all text-sm sm:text-base group/btn">
                    Read Full Article <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="mb-12 sm:mb-16">
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Filter by Category</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all border ${
                    i === 0
                      ? 'bg-finance-gold/20 text-finance-gold border-finance-gold/50'
                      : 'bg-finance-card text-slate-400 border-finance-border hover:border-finance-gold'
                  }`}
                >
                  {cat.name} <span className="opacity-70">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
            {posts.map((post, i) => (
              <article
                key={i}
                className="bg-finance-card border border-finance-border rounded-lg overflow-hidden hover:border-finance-gold hover:shadow-lg hover:shadow-finance-gold/10 transition-all duration-300 group flex flex-col"
              >
                <div className="relative h-48 sm:h-56 overflow-hidden bg-linear-to-br from-finance-gold/20 to-amber-600/10">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-finance-dark/60 to-transparent"></div>
                </div>
                
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <div className="mb-3">
                    <span className="px-2.5 py-1 bg-finance-gold/10 text-finance-gold text-xs font-bold rounded-full border border-finance-gold/20 uppercase tracking-wider inline-block">
                      {post.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-finance-gold transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2 flex-1">{post.excerpt}</p>
                  
                  <div className="space-y-3 pt-3 border-t border-finance-border">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-finance-gold/50" />
                        {post.date}
                      </div>
                      <div className="w-1 h-1 bg-finance-border rounded-full"></div>
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-finance-gold/50" />
                        {post.author}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-finance-gold/70 font-medium">{post.readTime}</span>
                      <button className="flex items-center gap-1 text-finance-gold font-semibold text-xs hover:gap-2 transition-all">
                        Read <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Section */}
          <div className="bg-linear-to-r from-finance-gold/20 via-amber-600/10 to-finance-gold/20 border border-finance-gold/40 rounded-xl p-8 sm:p-10 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-finance-gold" />
                <span className="text-finance-gold font-bold text-sm uppercase tracking-widest">Weekly Newsletter</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Stay Updated</h2>
              <p className="text-slate-400 text-sm sm:text-base mb-8">
                Subscribe to our newsletter for the latest market analysis, investment insights, and trading strategies delivered every week.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-finance-darker/50 border border-finance-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-finance-gold focus:ring-1 focus:ring-finance-gold/20 transition-all text-sm sm:text-base"
                />
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-linear-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-900 font-bold rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all whitespace-nowrap text-sm sm:text-base">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-4">We respect your privacy. Unsubscribe anytime.</p>
            </div>
          </div>

          {/* Load More */}
          <div className="mt-16 sm:mt-20 text-center">
            <button className="px-8 py-3 border border-finance-gold text-finance-gold font-bold rounded-lg hover:bg-finance-gold/10 transition-all">
              Load More Articles
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
