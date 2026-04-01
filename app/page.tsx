export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              💹 FinMindAI
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm">
            <a href="#features" className="hover:text-blue-400 transition">Features</a>
            <a href="#api" className="hover:text-blue-400 transition">API</a>
            <a href="#docs" className="hover:text-blue-400 transition">Docs</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            AI-Powered Finance
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Real-Time Intelligence
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Learn finance smarter with real-time market intelligence, AI-driven insights, and interactive challenges. Production-ready backend with WebSocket support.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <a 
              href="/api/health"
              target="_blank"
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
            >
              Check Health
            </a>
            <a 
              href="https://github.com/LegendarySumit/finmindai"
              target="_blank"
              className="px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-500 font-medium transition"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800/50">
        <h2 className="text-3xl font-bold mb-12">Core Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: '🎓', title: 'Interactive Learning', desc: 'Structured finance lessons and concepts' },
            { icon: '📊', title: 'Real-Time Markets', desc: 'Live market data and sentiment analysis' },
            { icon: '🎮', title: 'Stock Prediction', desc: 'User vs AI prediction challenges' },
            { icon: '🔐', title: 'Secure Auth', desc: 'Firebase Auth + Wallet verification' },
            { icon: '⚡', title: 'WebSocket Live Feed', desc: 'Authenticated real-time updates' },
            { icon: '🚀', title: 'Production Ready', desc: 'Hardened backend with CI/CD' },
          ].map((feature, idx) => (
            <div key={idx} className="rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 p-6 transition">
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* API Endpoints Section */}
      <section id="api" className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800/50">
        <h2 className="text-3xl font-bold mb-12">API Endpoints</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { method: 'GET', path: '/api/health', desc: 'Health check & deployment info' },
            { method: 'GET', path: '/api/news', desc: 'Market news & sentiment feed' },
            { method: 'GET', path: '/api/stock?symbol=AAPL', desc: 'Stock quotes & analysis' },
            { method: 'POST', path: '/api/auth/wallet-nonce', desc: 'Wallet auth challenge' },
            { method: 'POST', path: '/api/auth/wallet-verify', desc: 'Verify wallet signature' },
            { method: 'WS', path: '/ws (authenticated)', desc: 'Real-time market updates' },
          ].map((endpoint, idx) => (
            <div key={idx} className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:bg-slate-800/50 transition">
              <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-500/30 text-blue-300">
                  {endpoint.method}
                </span>
              </div>
              <code className="text-sm text-blue-300 block mb-2">{endpoint.path}</code>
              <p className="text-sm text-slate-400">{endpoint.desc}</p>
              {endpoint.method !== 'WS' && (
                <a 
                  href={endpoint.path}
                  target="_blank"
                  className="text-xs text-slate-400 hover:text-blue-400 mt-3 inline-block transition"
                >
                  Try it →
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800/50">
        <h2 className="text-3xl font-bold mb-12">Built With</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            'Next.js 16.1.6',
            'TypeScript 5.x',
            'Firebase Auth',
            'Firestore',
            'Node.js Server',
            'WebSocket (ws)',
            'Tailwind CSS 4.x',
            'Docker & Vercel',
          ].map((tech, idx) => (
            <div key={idx} className="rounded-lg border border-slate-700/50 bg-slate-800/20 px-4 py-3 text-center text-sm font-medium">
              {tech}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-800/50 text-center text-slate-400">
        <p className="mb-4">FinMindAI - AI-powered Finance Education Platform</p>
        <p className="text-sm">
          Built by <a href="https://github.com/LegendarySumit" target="_blank" className="text-blue-400 hover:text-blue-300">LegendarySumit</a> • 
          <a href="https://github.com/LegendarySumit/finmindai" target="_blank" className="text-blue-400 hover:text-blue-300 ml-1">GitHub</a>
        </p>
      </footer>
    </div>
  );
}
