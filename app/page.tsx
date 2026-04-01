export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6">
      <div className="max-w-2xl rounded-xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
        <h1 className="text-3xl font-semibold mb-3">FinMindAI Backend Runtime</h1>
        <p className="text-slate-300 mb-6">
          This deployment is configured for production API and WebSocket workloads.
        </p>
        <ul className="space-y-2 text-slate-300">
          <li>Health: <code>/api/health</code></li>
          <li>Market news: <code>/api/news</code></li>
          <li>Stock quotes: <code>/api/stock?symbol=AAPL</code></li>
          <li>WebSocket: <code>/ws</code> (authenticated)</li>
        </ul>
      </div>
    </div>
  );
}
