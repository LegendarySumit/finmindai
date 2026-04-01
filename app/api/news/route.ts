import { NextRequest } from 'next/server';
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rateLimit';
import { errorResponse, successResponse } from '@/lib/apiResponse';

const FINNHUB_KEY = process.env.FINNHUB_API_KEY;

type Sentiment = 'positive' | 'negative' | 'neutral';

interface FinnhubNewsItem {
    id?: number;
    headline?: string;
    summary?: string;
    source?: string;
    datetime?: number;
    url?: string;
}

const BULLISH = ['surge', 'rally', 'gain', 'rise', 'bull', 'growth', 'profit', 'beat', 'record', 'boost', 'jump', 'soar', 'strong', 'recover', 'approval', 'upgrade', 'outperform', 'acquisition', 'partnership', 'launch', 'revenue'];
const BEARISH = ['drop', 'fall', 'decline', 'bear', 'loss', 'down', 'crash', 'plunge', 'concern', 'risk', 'cut', 'miss', 'weak', 'downgrade', 'layoff', 'fine', 'lawsuit', 'ban', 'warning', 'inflation', 'recall', 'breach'];

function deriveSentiment(text: string): Sentiment {
    const lower = text.toLowerCase();
    const bull = BULLISH.filter(w => lower.includes(w)).length;
    const bear = BEARISH.filter(w => lower.includes(w)).length;
    if (bull > bear) return 'positive';
    if (bear > bull) return 'negative';
    return 'neutral';
}

function deriveCategory(text: string): string {
    const lower = text.toLowerCase();
    if (/bitcoin|ethereum|crypto|blockchain|defi|nft|btc|eth|solana/.test(lower)) return 'Crypto';
    if (/oil|gold|commodity|commodities|wheat|copper|silver|crude|metal|energy/.test(lower)) return 'Commodities';
    if (/fed|federal reserve|inflation|gdp|macro|interest rate|economy|treasury|cpi|fomc|recession/.test(lower)) return 'Macro';
    if (/apple|amazon|google|alphabet|microsoft|meta|nvidia|tesla|openai|ai |artificial intelligence|software|semiconductor|chip/.test(lower)) return 'Tech';
    return 'Stocks';
}

function deriveImpact(text: string, sentiment: Sentiment): number {
    const lower = text.toLowerCase();
    const heavy = ['fed', 'rate', 'inflation', 'crash', 'surge', 'record', 'crisis', 'ban', 'sec', 'billion', 'trillion', 'earnings', 'guidance', 'merger', 'acquisition', 'ipo', 'bankruptcy'];
    const hits = heavy.filter(w => lower.includes(w)).length;
    const base = sentiment === 'neutral' ? 4.5 : 5.5;
    return Math.min(10, parseFloat((base + hits * 0.45 + Math.random() * 1.2).toFixed(1)));
}

export async function GET(req: NextRequest) {
    // Rate limiting (public endpoint - generous limits)
    const ip = getClientIP(req);
    const limit = checkRateLimit(ip, RATE_LIMITS.read.maxRequests, RATE_LIMITS.read.windowMs);
    if (!limit.allowed) {
        const retryAfter = Math.ceil((limit.resetTime - Date.now()) / 1000);
        return errorResponse('RATE_LIMITED', `Rate limit exceeded. Retry after ${retryAfter}s`, {
            status: 429,
            headers: { 'Retry-After': String(retryAfter) },
        });
    }

    if (!FINNHUB_KEY) {
        return errorResponse('CONFIG_ERROR', 'FINNHUB_API_KEY not configured', { status: 500 });
    }

    try {
        const res = await fetch(
            `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_KEY}`,
            { next: { revalidate: 90 } }
        );

        if (!res.ok) throw new Error(`Finnhub ${res.status}`);

        const raw = (await res.json()) as FinnhubNewsItem[];

        const items = raw
            .filter((item): item is Required<Pick<FinnhubNewsItem, 'headline' | 'summary' | 'datetime'>> & FinnhubNewsItem =>
                typeof item.headline === 'string' &&
                typeof item.summary === 'string' &&
                item.headline.length > 20 &&
                typeof item.datetime === 'number'
            )
            .slice(0, 30)
            .map((item, i) => {
                const text = `${item.headline} ${item.summary}`;
                const sentiment = deriveSentiment(text);
                const category = deriveCategory(text);
                return {
                    id: item.id || (Date.now() + i),
                    title: item.headline,
                    source: item.source || 'MarketWire',
                    category,
                    sentiment,
                    timestamp: new Date(item.datetime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    rawTimestamp: item.datetime * 1000,
                    impactScore: deriveImpact(text, sentiment),
                    aiInsight: item.summary.length > 220 ? item.summary.slice(0, 220) + '...' : item.summary,
                    url: item.url,
                };
            });

        return successResponse({ items, lastUpdated: Date.now() }, { message: 'News feed fetched successfully' });
    } catch {
        return errorResponse('UPSTREAM_ERROR', 'Failed to fetch news feed', { status: 502 });
    }
}
