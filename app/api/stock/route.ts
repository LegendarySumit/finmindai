import { NextRequest, NextResponse } from 'next/server';

// GET /api/stock?symbol=TSLA
export async function GET(req: NextRequest) {
    const symbol = req.nextUrl.searchParams.get('symbol');
    if (!symbol) {
        return NextResponse.json({ error: 'symbol is required' }, { status: 400 });
    }

    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: 'FINNHUB_API_KEY not configured' }, { status: 500 });
    }

    const [quoteRes, profileRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`, { next: { revalidate: 15 } }),
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`, { next: { revalidate: 3600 } }),
    ]);

    if (!quoteRes.ok) {
        return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 502 });
    }

    const quote = await quoteRes.json();
    const profile = profileRes.ok ? await profileRes.json() : {};

    // Finnhub quote fields: c=current, d=change, dp=change%, h=high, l=low, o=open, pc=prev close
    return NextResponse.json({
        symbol,
        name: profile.name ?? symbol,
        price: quote.c,
        change: quote.d,
        changePercent: quote.dp,
        high: quote.h,
        low: quote.l,
        open: quote.o,
        prevClose: quote.pc,
        timestamp: quote.t,
    });
}
