import Header from '@/components/Header';
import NewsIntelligenceDashboard from '@/components/NewsIntelligenceDashboard';

export default function MarketIntelligencePage() {
  return (
    <div className="bg-finance-darker min-h-screen w-full overflow-x-hidden relative flex flex-col">
      <Header />
      <div className="flex-1 w-full pt-12 sm:pt-14 md:pt-16 pb-2 sm:pb-4 px-2 sm:px-4 overflow-visible lg:overflow-hidden relative z-0">
        <div className="w-full min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4.25rem)] md:min-h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)] rounded-xl sm:rounded-2xl overflow-visible lg:overflow-hidden border border-slate-800 shadow-2xl relative bg-[#0a0f1c]">
            <NewsIntelligenceDashboard />
        </div>
      </div>
    </div>
  );
}
