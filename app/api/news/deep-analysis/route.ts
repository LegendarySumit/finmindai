import { NextRequest, NextResponse } from 'next/server';

type Sentiment = 'positive' | 'negative' | 'neutral';
type TradeBias = 'up' | 'down' | 'watch';

interface DeepAnalysisInput {
  news: {
    id?: number;
    title: string;
    source?: string;
    category?: string;
    sentiment: Sentiment;
    impactScore: number;
    aiInsight: string;
    timestamp?: string;
  };
  topSignals?: Array<{
    title: string;
    sentiment: Sentiment;
    impactScore: number;
    category?: string;
  }>;
}

interface StockIdea {
  symbol: string;
  bias: TradeBias;
  rationale: string;
  trigger: string;
  invalidation: string;
  price?: number | null;
  changePercent?: number | null;
}

interface ScenarioPlan {
  scenario: string;
  probability: number;
  expectedMove: string;
  plan: string;
}

interface DeepAnalysisResult {
  generatedAt: string;
  model: string;
  thesis: string;
  marketBias: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  immediateActions: string[];
  planByHorizon: {
    intraday: string[];
    swing: string[];
    position: string[];
  };
  stockIdeas: StockIdea[];
  riskRules: string[];
  scenarioMap: ScenarioPlan[];
  disclaimer: string;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

const CATEGORY_UNIVERSE: Record<string, string[]> = {
  Stocks: ['SPY', 'QQQ', 'DIA'],
  Tech: ['NVDA', 'MSFT', 'AAPL'],
  Crypto: ['COIN', 'MSTR', 'BTC-USD'],
  Macro: ['TLT', 'DXY', 'GLD'],
  Commodities: ['XLE', 'USO', 'GLD'],
};

function parseJsonLoose(text: string): unknown {
  const stripped = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
  return JSON.parse(stripped);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function toStringArray(value: unknown, maxItems = 8): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string').slice(0, maxItems);
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function toMarketBias(sentiment: Sentiment): 'bullish' | 'bearish' | 'neutral' {
  if (sentiment === 'positive') return 'bullish';
  if (sentiment === 'negative') return 'bearish';
  return 'neutral';
}

async function fetchQuote(symbol: string): Promise<{ price: number | null; changePercent: number | null }> {
  if (!FINNHUB_API_KEY || symbol.includes('-USD')) {
    return { price: null, changePercent: null };
  }

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`,
      { cache: 'no-store' }
    );
    if (!res.ok) {
      return { price: null, changePercent: null };
    }

    const data = await res.json();
    return {
      price: typeof data.c === 'number' && data.c > 0 ? data.c : null,
      changePercent: typeof data.dp === 'number' ? data.dp : null,
    };
  } catch {
    return { price: null, changePercent: null };
  }
}

function buildFallback(input: DeepAnalysisInput): DeepAnalysisResult {
  const category = input.news.category || 'Stocks';
  const universe = CATEGORY_UNIVERSE[category] || CATEGORY_UNIVERSE.Stocks;
  const marketBias = toMarketBias(input.news.sentiment);
  const bias: TradeBias =
    input.news.sentiment === 'positive' ? 'up' : input.news.sentiment === 'negative' ? 'down' : 'watch';

  const confidenceBase = input.news.impactScore * 8;
  const confidence = clamp(Math.round(confidenceBase + (input.news.sentiment === 'neutral' ? 2 : 8)), 45, 92);

  const actionVerb =
    input.news.sentiment === 'positive'
      ? 'look for long setups on strength'
      : input.news.sentiment === 'negative'
        ? 'prioritize defensive positioning or short setups'
        : 'wait for confirmation before directional exposure';

  const stockIdeas: StockIdea[] = universe.slice(0, 3).map((symbol, idx) => ({
    symbol,
    bias,
    rationale: `This ticker is closely tied to ${category.toLowerCase()} flow and should react if this headline trend persists.`,
    trigger:
      input.news.sentiment === 'positive'
        ? 'Enter only if price reclaims intraday resistance with rising volume.'
        : input.news.sentiment === 'negative'
          ? 'Enter only if price loses support with broad market weakness.'
          : 'Wait for breakout or breakdown confirmation before entry.',
    invalidation: idx === 0 ? 'Exit if momentum fades and market breadth diverges.' : 'Exit on failed follow-through after entry.',
  }));

  return {
    generatedAt: new Date().toISOString(),
    model: 'heuristic-fallback',
    thesis: `The headline suggests a ${marketBias} tilt for ${category.toLowerCase()} risk assets. Focus on disciplined execution rather than prediction certainty.`,
    marketBias,
    confidence,
    immediateActions: [
      `Re-check macro calendar and upcoming catalysts before entry.`,
      `Use smaller position size until volatility regime is clear.`,
      `For this signal, ${actionVerb}.`,
    ],
    planByHorizon: {
      intraday: [
        'Trade only A+ setups during high liquidity windows.',
        'Set hard stop before entry and never widen it.',
      ],
      swing: [
        'Build positions in tranches; avoid all-in entries.',
        'Track sector-relative strength vs index benchmark.',
      ],
      position: [
        'Rotate gradually as narrative confirmation accumulates.',
        'Reassess weekly against earnings, rates, and macro data.',
      ],
    },
    stockIdeas,
    riskRules: [
      'Risk max 1% capital per trade.',
      'Maximum 3 correlated positions at once.',
      'No averaging down on thesis-invalidating moves.',
    ],
    scenarioMap: [
      {
        scenario: 'Base case',
        probability: 55,
        expectedMove: marketBias === 'bullish' ? 'gradual upside continuation' : marketBias === 'bearish' ? 'controlled downside drift' : 'range-bound chop',
        plan: 'Follow trend only after confirmation candle closes.',
      },
      {
        scenario: 'Bull case',
        probability: marketBias === 'bullish' ? 30 : 20,
        expectedMove: 'momentum expansion with sector leadership',
        plan: 'Add on pullbacks to prior breakout level.',
      },
      {
        scenario: 'Bear case',
        probability: marketBias === 'bearish' ? 30 : 25,
        expectedMove: 'sharp volatility spike and failed rebounds',
        plan: 'Reduce exposure, raise cash, and hedge beta risk.',
      },
    ],
    disclaimer: 'Educational analysis only. Not financial advice. Always do your own research.',
  };
}

function coerceGeminiResult(raw: unknown, fallback: DeepAnalysisResult): DeepAnalysisResult {
  const rawRecord = asRecord(raw);
  if (!rawRecord) {
    return fallback;
  }

  const stockIdeas: StockIdea[] = Array.isArray(rawRecord.stockIdeas)
    ? rawRecord.stockIdeas
        .map((item) => asRecord(item))
        .filter((item): item is Record<string, unknown> => !!item && typeof item.symbol === 'string')
        .slice(0, 6)
        .map((item) => ({
          symbol: String(item.symbol).toUpperCase(),
          bias: item.bias === 'up' || item.bias === 'down' || item.bias === 'watch' ? item.bias : 'watch',
          rationale: typeof item.rationale === 'string' ? item.rationale : 'Watch reaction around key levels.',
          trigger: typeof item.trigger === 'string' ? item.trigger : 'Wait for confirmation before entry.',
          invalidation: typeof item.invalidation === 'string' ? item.invalidation : 'Exit if setup invalidates.',
        }))
    : fallback.stockIdeas;

  const scenarioMap: ScenarioPlan[] = Array.isArray(rawRecord.scenarioMap)
    ? rawRecord.scenarioMap
        .map((item) => asRecord(item))
        .filter((item): item is Record<string, unknown> => !!item && typeof item.scenario === 'string')
        .slice(0, 4)
        .map((item) => ({
          scenario: String(item.scenario),
          probability: clamp(Number(item.probability) || 0, 0, 100),
          expectedMove: typeof item.expectedMove === 'string' ? item.expectedMove : 'N/A',
          plan: typeof item.plan === 'string' ? item.plan : 'Stay adaptive to price action.',
        }))
    : fallback.scenarioMap;

  const rawPlanByHorizon = asRecord(rawRecord.planByHorizon);

  return {
    generatedAt: new Date().toISOString(),
    model: 'gemini-2.0-flash',
    thesis: typeof rawRecord.thesis === 'string' && rawRecord.thesis.trim() ? rawRecord.thesis.trim() : fallback.thesis,
    marketBias:
      rawRecord.marketBias === 'bullish' || rawRecord.marketBias === 'bearish' || rawRecord.marketBias === 'neutral'
        ? rawRecord.marketBias
        : fallback.marketBias,
    confidence: clamp(Number(rawRecord.confidence) || fallback.confidence, 1, 99),
    immediateActions: toStringArray(rawRecord.immediateActions).length ? toStringArray(rawRecord.immediateActions) : fallback.immediateActions,
    planByHorizon: {
      intraday:
        toStringArray(rawPlanByHorizon?.intraday).length
          ? toStringArray(rawPlanByHorizon?.intraday)
          : fallback.planByHorizon.intraday,
      swing:
        toStringArray(rawPlanByHorizon?.swing).length
          ? toStringArray(rawPlanByHorizon?.swing)
          : fallback.planByHorizon.swing,
      position:
        toStringArray(rawPlanByHorizon?.position).length
          ? toStringArray(rawPlanByHorizon?.position)
          : fallback.planByHorizon.position,
    },
    stockIdeas: stockIdeas.length ? stockIdeas : fallback.stockIdeas,
    riskRules: toStringArray(rawRecord.riskRules).length ? toStringArray(rawRecord.riskRules) : fallback.riskRules,
    scenarioMap: scenarioMap.length ? scenarioMap : fallback.scenarioMap,
    disclaimer: typeof rawRecord.disclaimer === 'string' ? rawRecord.disclaimer : fallback.disclaimer,
  };
}

async function generateWithGemini(input: DeepAnalysisInput): Promise<DeepAnalysisResult | null> {
  if (!GEMINI_API_KEY) return null;

  const prompt = [
    'You are a financial market analyst assistant.',
    'Return ONLY valid JSON (no markdown).',
    'Objective: provide actionable guidance from a single news signal with practical trading plan.',
    'Required schema:',
    '{',
    '  "thesis": string,',
    '  "marketBias": "bullish"|"bearish"|"neutral",',
    '  "confidence": number (1-99),',
    '  "immediateActions": string[],',
    '  "planByHorizon": { "intraday": string[], "swing": string[], "position": string[] },',
    '  "stockIdeas": [{ "symbol": string, "bias": "up"|"down"|"watch", "rationale": string, "trigger": string, "invalidation": string }],',
    '  "riskRules": string[],',
    '  "scenarioMap": [{ "scenario": string, "probability": number, "expectedMove": string, "plan": string }],',
    '  "disclaimer": string',
    '}',
    '',
    'Use this input news + context:',
    JSON.stringify(input),
    '',
    'Constraints:',
    '- Keep guidance specific and practical.',
    '- Mention both upside and downside scenarios.',
    '- Do not guarantee returns.',
    '- Maximum 6 stockIdeas and 4 scenarios.',
  ].join('\n');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.25,
          responseMimeType: 'application/json',
        },
      }),
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== 'string') {
    return null;
  }

  try {
    return parseJsonLoose(text) as DeepAnalysisResult;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DeepAnalysisInput;

    if (!body?.news?.title || !body?.news?.aiInsight || !body?.news?.sentiment) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const fallback = buildFallback(body);

    let merged = fallback;
    const geminiRaw = await generateWithGemini(body);
    if (geminiRaw) {
      merged = coerceGeminiResult(geminiRaw, fallback);
    }

    // Enrich stock ideas with live quote snapshot when available.
    const enrichedIdeas = await Promise.all(
      merged.stockIdeas.map(async (idea) => {
        const quote = await fetchQuote(idea.symbol);
        return {
          ...idea,
          price: quote.price,
          changePercent: quote.changePercent,
        };
      })
    );

    return NextResponse.json({
      analysis: {
        ...merged,
        stockIdeas: enrichedIdeas,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to generate deep analysis' }, { status: 500 });
  }
}
