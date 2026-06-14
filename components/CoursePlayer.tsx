"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/authContext";
import {
  CheckCircle,
  Lock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  XCircle,
  Star,
  Lightbulb,
  Trophy,
  Clock,
  Award,
} from "lucide-react";

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

/* ── Types ─────────────────────────────────────────────────────────── */

type Quiz = { q: string; opts: string[]; ans: number };
type Lesson = {
  id: string;
  title: string;
  duration: string;
  content: string[];
  keyPoints: string[];
  quiz: Quiz[];
};
type CourseData = {
  id: string;
  title: string;
  desc: string;
  trackColor: string;
  locked: boolean;
  lessons: Lesson[];
};

/* ── Full Lesson Content (Unlocked courses) ─────────────────────────── */
const COURSES: Record<string, CourseData> = {
  /* ── BEGINNER TRACK ──────────────────────────────────────────────── */
  b1: {
    id: "b1",
    title: "What is the Stock Market?",
    desc: "Understand how stock markets work, who the participants are, and why stock prices move.",
    trackColor: "#10b981",
    locked: false,
    lessons: [
      {
        id: "b1-l1",
        title: "What is a Stock?",
        duration: "7m",
        keyPoints: [
          "A stock = partial ownership in a company",
          "Companies issue stock to raise capital via IPO",
          "Common stock gives voting rights + eligibility for dividends",
          "Indian stocks list on BSE & NSE, regulated by SEBI",
        ],
        content: [
          "A stock (or share) represents a small ownership stake in a company. When you buy one share of Reliance Industries, you literally become a part-owner — entitled to a proportion of its profits and assets.",
          "Companies issue stocks to raise capital. Instead of borrowing from a bank, they sell ownership to thousands of investors through an IPO (Initial Public Offering). The funds raised are used to expand the business, repay debt, or fund product development.",
          "In India, stocks trade on the BSE (Bombay Stock Exchange, est. 1875 — Asia's oldest) and NSE (National Stock Exchange, est. 1992 — larger by daily volume). Both are overseen by SEBI (Securities and Exchange Board of India), which protects investor interests.",
        ],
        quiz: [
          {
            q: "Buying 1 share of a company is equivalent to:",
            opts: [
              "Giving it a loan",
              "Becoming a partial owner",
              "Opening a fixed deposit",
              "Buying a bond",
            ],
            ans: 1,
          },
          {
            q: "Which body regulates Indian stock markets?",
            opts: ["RBI", "Finance Ministry", "SEBI", "NABARD"],
            ans: 2,
          },
        ],
      },
      {
        id: "b1-l2",
        title: "How Stock Exchanges Work",
        duration: "8m",
        keyPoints: [
          "Electronic order matching — buyer meets seller in microseconds",
          "NSE & BSE open 9:15 AM – 3:30 PM, Mon–Fri",
          "Sensex (30 cos.) and Nifty 50 are India's key market indices",
          "Circuit breakers halt trading at 5%, 10%, 15% swings",
        ],
        content: [
          "A stock exchange is a digital marketplace where buy and sell orders are matched automatically. When you place a buy order at ₹500, the system finds a seller at ₹500 and executes the trade in microseconds.",
          'The Sensex tracks 30 of India\'s largest companies on BSE; the Nifty 50 tracks the top 50 on NSE. These indices act as the "pulse" of the market — rising indices mean market optimism, falling means pessimism.',
          "Circuit breakers are safety valves that pause trading if the market moves too sharply (5%, 10%, or 15% in a day). They give investors time to think instead of panic-selling, preventing cascading crashes.",
        ],
        quiz: [
          {
            q: "The Nifty 50 is:",
            opts: [
              "50 cheapest NSE stocks",
              "Top 50 companies tracked on NSE",
              "A mutual fund product",
              "NSE's settlement system",
            ],
            ans: 1,
          },
          {
            q: "Indian stock market trading session ends at:",
            opts: ["2:00 PM", "3:00 PM", "3:30 PM", "4:00 PM"],
            ans: 2,
          },
        ],
      },
      {
        id: "b1-l3",
        title: "Who Are the Market Participants?",
        duration: "6m",
        keyPoints: [
          "Retail investors: individuals like you trading personal funds",
          "FIIs: foreign funds — their flows heavily influence Indian markets",
          "Institutions: mutual funds, insurance companies, pension funds",
          "Market makers ensure there is always a buyer and seller",
        ],
        content: [
          "Stock markets have many types of participants. Retail investors (like you) buy and sell for personal wealth. Institutional investors — mutual funds, insurance firms, pension funds — manage money on behalf of millions and trade in crores.",
          'Foreign Institutional Investors (FIIs) are overseas funds investing in India. When FIIs buy aggressively, Indian indices usually rise; when they "sell and exit" (FII outflow), markets often fall. You\'ll see this reported daily in financial news.',
          "Market makers stand ready to buy or sell at any time, ensuring liquidity. Without them, you might not be able to exit a position when you want. Speculators and arbitrageurs round out the ecosystem, adding price discovery and efficiency.",
        ],
        quiz: [
          {
            q: '"FII outflow" typically causes Indian markets to:',
            opts: [
              "Rise sharply",
              "Fall",
              "Have no impact",
              "Only affect IT sector",
            ],
            ans: 1,
          },
          {
            q: "The primary role of market makers is:",
            opts: [
              "To regulate prices",
              "To provide liquidity",
              "To advise retail investors",
              "To collect taxes",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b1-l4",
        title: "How Stock Prices Move",
        duration: "7m",
        keyPoints: [
          "Supply > Demand → price rises; Supply < Demand → price falls",
          "Earnings beats and misses cause immediate price reactions",
          "P/E ratio: investors pay ₹X per ₹1 of earnings — signals expectations",
          "Short-term prices = emotion (fear/greed); long-term = business fundamentals",
        ],
        content: [
          "Stock prices obey the law of supply and demand. More buyers than sellers → price rises. More sellers than buyers → price falls. But what drives demand? Primarily company earnings, growth expectations, news, sector trends, and overall market sentiment.",
          "The P/E (Price-to-Earnings) ratio is one of the most watched metrics. A P/E of 25 means investors pay ₹25 for every ₹1 of earnings. High P/E signals high growth expectations; low P/E may signal undervaluation or slow growth.",
          'Warren Buffett famously said: "In the short run, the market is a voting machine; in the long run, it is a weighing machine." Short-term moves are driven by emotion — fear and greed. Over years, prices track actual business performance.',
        ],
        quiz: [
          {
            q: "A company's P/E is 40 vs sector average of 15. This most likely means:",
            opts: [
              "The stock is definitely overvalued",
              "Investors have high growth expectations",
              "The company has low profits",
              "The stock is very cheap",
            ],
            ans: 1,
          },
          {
            q: "A company beats quarterly earnings by 35%. The stock will typically:",
            opts: [
              "Fall sharply",
              "Have no reaction",
              "Likely rise",
              "Be suspended by SEBI",
            ],
            ans: 2,
          },
        ],
      },
      {
        id: "b1-l5",
        title: "SEBI & Market Regulation",
        duration: "7m",
        keyPoints: [
          "SEBI (est. 1988, statutory power 1992) is India's capital market regulator",
          "All brokers, mutual funds, and listed companies must comply with SEBI rules",
          "Insider trading — using non-public info to trade — is illegal",
          "SCORES portal: file investor complaints against any market participant",
        ],
        content: [
          "SEBI (Securities and Exchange Board of India) regulates everything in the capital markets: stock exchanges, brokers, mutual funds, portfolio managers, credit rating agencies, and all listed companies. Companies must disclose quarterly results and any material events within 24 hours.",
          "Insider trading means buying or selling a stock based on non-public, price-sensitive information. If a company executive knows results are terrible before announcement and sells his shares — that's insider trading. SEBI investigates and penalises heavily.",
          "As an investor, SEBI protects you: all brokers must be SEBI-registered, client funds are kept separate from broker funds, and you can file complaints on the SCORES portal (scores.gov.in) against any market participant.",
        ],
        quiz: [
          {
            q: "Insider trading means:",
            opts: [
              "Trading only during market hours",
              "Trading on non-public price-sensitive information",
              "Trading with a borrowed amount",
              "Investing in your own employer's stock (always legal)",
            ],
            ans: 1,
          },
          {
            q: "Where can Indian investors file complaints against brokers?",
            opts: [
              "RBI portal",
              "SEBI SCORES portal",
              "NSE website",
              "Finance Ministry helpline",
            ],
            ans: 1,
          },
        ],
      },
    ],
  },

  b2: {
    id: "b2",
    title: "How to Read a Stock Quote",
    desc: "Bid, ask, volume, 52-week highs — decode every number on a stock ticker.",
    trackColor: "#10b981",
    locked: false,
    lessons: [
      {
        id: "b2-l1",
        title: "Reading a Stock Ticker",
        duration: "7m",
        keyPoints: [
          "Every company has a unique ticker (RELIANCE, INFY, TCS)",
          "CMP / LTP = current trading price, updates in real time",
          "Market Cap = share price × total outstanding shares",
          "Green = up from previous close; Red = down",
        ],
        content: [
          "A stock ticker is the shorthand identifier for a company. RELIANCE = Reliance Industries, INFY = Infosys, TCS = Tata Consultancy Services. Every company has a unique ticker on each exchange it is listed on.",
          "The quote shows CMP (Current Market Price) or LTP (Last Traded Price) — the price of the most recent transaction. This updates live during market hours. You also see % change from the previous day's close — green means up, red means down.",
          "Market Capitalisation (Market Cap) = share price × total outstanding shares. It tells you the total market value of the company. Large-cap: >₹20,000 crore; Mid-cap: ₹5,000–₹20,000 crore; Small-cap: <₹5,000 crore.",
        ],
        quiz: [
          {
            q: "Market Capitalisation is calculated as:",
            opts: [
              "Total revenue × P/E ratio",
              "Share price × total outstanding shares",
              "Share price × daily volume",
              "Total assets − total liabilities",
            ],
            ans: 1,
          },
          {
            q: "TCS shows −2.3% on your screen. This means:",
            opts: [
              "TCS fell 2.3% this year",
              "TCS fell 2.3% from yesterday's close",
              "TCS has 2.3% less volume today",
              "TCS fell ₹2.3 per share only today",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b2-l2",
        title: "Bid, Ask & the Spread",
        duration: "6m",
        keyPoints: [
          "Bid = highest price a buyer will pay; Ask = lowest a seller will accept",
          "You always buy at the Ask and sell at the Bid",
          "Narrow spread = high liquidity (large-caps); wide spread = illiquid",
          "Market order: instant execution; Limit order: execute only at your price",
        ],
        content: [
          "For any stock, there are always two prices: the Bid (highest buy price available) and the Ask (lowest sell price available). You buy at the Ask and sell at the Bid. The difference is the Bid-Ask spread — a hidden transaction cost.",
          "For liquid large-caps like HDFC Bank or Infosys, spreads are 1–2 paise. For illiquid small-caps, spreads can be ₹1–₹10. High spreads mean it's harder to enter and exit without moving the price — avoid illiquid stocks when starting out.",
          "A Market Order executes immediately at the best available price. A Limit Order lets you specify your price — it only fills if someone is willing to trade at that level. Use limit orders to control what you pay or receive.",
        ],
        quiz: [
          {
            q: "Bid = ₹500, Ask = ₹502. What is the spread?",
            opts: ["₹500", "₹2", "₹502", "₹0.5"],
            ans: 1,
          },
          {
            q: "You want to buy a stock at exactly ₹250, not a paisa more. Which order?",
            opts: [
              "Market order",
              "Stop-loss order",
              "Limit buy order at ₹250",
              "After-market order",
            ],
            ans: 2,
          },
        ],
      },
      {
        id: "b2-l3",
        title: "Volume & Delivery %",
        duration: "7m",
        keyPoints: [
          "Volume = total shares traded today",
          "High volume on a price move gives it credibility",
          "Volume spike (3–5× ADV) = big news or institutional activity",
          "Delivery % > 50% = genuine buying interest, not just intraday",
        ],
        content: [
          "Volume is the number of shares traded during a session. High volume on a price move gives it credibility — a stock up 5% on 10× its average daily volume (ADV) is far more significant than the same move on thin volume.",
          "Float is the number of shares available for public trading (total shares minus promoter holdings and locked-in shares). Low-float stocks can be very volatile — even moderate buying can spike the price dramatically.",
          "Delivery percentage shows what % of today's volume resulted in actual delivery to demat accounts vs. intraday trades squared off before close. A delivery % above 60% suggests genuine long-term buying — investors intend to hold.",
        ],
        quiz: [
          {
            q: "A stock rises 8% on 12× its average volume. This suggests:",
            opts: [
              "The price rise is unreliable",
              "Strong conviction — likely significant news",
              "The stock will fall tomorrow",
              "Short sellers are active",
            ],
            ans: 1,
          },
          {
            q: "A 70% delivery percentage indicates:",
            opts: [
              "70% of trades were short-sells",
              "Most buyers intend to hold the stock",
              "70% of float was traded",
              "Low liquidity",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b2-l4",
        title: "52-Week High & Low",
        duration: "8m",
        keyPoints: [
          "52W High acts as resistance — sellers who bought at peak want to exit",
          "Breaking above 52W High with high volume = strong bullish signal",
          "52W Low acts as support — careful study needed before buying",
          "Always investigate WHY a stock is near its 52-week low",
        ],
        content: [
          'The 52-week high is the highest price in the past year; the 52-week low is the lowest. These are powerful psychological reference points. Stocks approaching 52W highs often face selling pressure from investors eager to "break even."',
          "A stock breaking above its 52-week high with strong volume is a classic bullish breakout signal — it means there are no longer any sellers trapped above. Institutions often enter on 52W high breakouts.",
          'The 52-week low can signal value — but a stock can always get cheaper. Before buying a 52W low stock, research why it fell: bad earnings, regulatory trouble, sector decline? "Catching a falling knife" is a common beginner mistake.',
        ],
        quiz: [
          {
            q: "A stock breaks above its 52-week high on massive volume. This is typically:",
            opts: [
              "A selling opportunity",
              "A bullish breakout signal",
              "A sign of overvaluation",
              "A neutral event",
            ],
            ans: 1,
          },
          {
            q: "A stock at ₹120 down from a 52W high of ₹680. What to do first?",
            opts: [
              "Buy immediately — it's cheap",
              "Investigate the reason for the decline",
              "Short the stock",
              "Ignore it — too risky to ever consider",
            ],
            ans: 1,
          },
        ],
      },
    ],
  },

  b3: {
    id: "b3",
    title: "Investing vs Trading",
    desc: "Learn the key differences, risk profiles, and time horizons of investing and trading.",
    trackColor: "#10b981",
    locked: false,
    lessons: [
      {
        id: "b3-l1",
        title: "What is Investing?",
        duration: "7m",
        keyPoints: [
          "Investing = wealth creation through business growth + compounding",
          "Time horizon: typically 5–30+ years",
          "Focus on ROE, EPS growth, business quality, and management",
          '"Buy wonderful companies at fair prices" — Warren Buffett',
        ],
        content: [
          "Investing means putting your money to work with the expectation it grows over time through business profits, dividends, and compounding. ₹1 lakh invested in quality Indian equities in 2000 would have grown to ₹20–50 lakh by 2024 — through market crashes, recessions, and all.",
          "The compounding effect is extraordinary. ₹10,000/month invested at 12% CAGR for 30 years = ₹3.5 crore+. The same amount for just 20 years = ₹99 lakh. Those extra 10 years almost triple your wealth — starting early is everything.",
          "Key metrics for investors: Return on Equity (ROE) — how efficiently does management use shareholder money? EPS growth — is profit per share rising year on year? Debt-to-Equity — is the balance sheet healthy? Dividend yield — does it generate cash income?",
        ],
        quiz: [
          {
            q: "Which best describes long-term investing?",
            opts: [
              "Buying and selling within a day",
              "Buying quality companies and holding for years",
              "Making 50+ trades per month",
              "Buying only government bonds",
            ],
            ans: 1,
          },
          {
            q: "ROE measures:",
            opts: [
              "Revenue growth year-on-year",
              "How profitably management uses shareholder equity",
              "Stock price return over 1 year",
              "Dividend payment frequency",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b3-l2",
        title: "What is Trading?",
        duration: "8m",
        keyPoints: [
          "Trading = profiting from short-term price fluctuations, not business value",
          "Types: Day trader (close by 3:30 PM), Swing trader (days–weeks), Position trader (weeks–months)",
          "80–90% of new traders lose money in the first year",
          "Leverage amplifies both gains AND losses — treat it with extreme respect",
        ],
        content: [
          "Trading means buying and selling financial instruments over short periods — from seconds (scalping) to weeks — to profit from price movements, not underlying business value. A day trader doesn't care if Infosys is a great company; they care if it will move 2% today.",
          "Types of traders: Day traders close all positions before 3:30 PM (no overnight risk). Swing traders hold for days to weeks, capturing medium-term price trends. Position traders hold weeks to months using both technical and fundamental analysis.",
          "Studies consistently show 80–90% of new day traders lose money in year one. The survivors develop strict rules: maximum loss per trade (1–2% of capital), maximum daily loss (5%), and weekly loss limits. Without these rules, emotion destroys accounts.",
        ],
        quiz: [
          {
            q: "A day trader by definition:",
            opts: [
              "Holds stocks for exactly 1 day",
              "Closes all positions before market close",
              "Only trades index stocks",
              "Trades with minimum ₹10 lakh capital",
            ],
            ans: 1,
          },
          {
            q: "10× leverage on ₹1 lakh. A 10% adverse move would:",
            opts: [
              "Lose ₹10,000",
              "Wipe out your entire ₹1 lakh capital",
              "Lose only ₹50,000",
              "Have no impact — leverage protects downside",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b3-l3",
        title: "Risk Profiles & Time Horizons",
        duration: "7m",
        keyPoints: [
          "Risk profile = capacity + willingness to handle losses",
          "Age, income stability, obligations, and goals determine your profile",
          "Conservative (FDs/bonds) → Moderate (balanced) → Aggressive (equity/derivatives)",
          '"100 minus age" is a simple equity allocation starting point',
        ],
        content: [
          "Your risk profile is your personal capacity and willingness to tolerate loss. It depends on: age (younger = more time to recover), income stability, existing financial obligations (EMIs, dependents), investment purpose, and your psychological resilience under loss.",
          "Time horizon is how long you can leave money invested without needing it. Longer horizon = more volatility tolerable = higher equity allocation appropriate. Money needed in 1 year shouldn't be in stocks at all.",
          "A rule of thumb: equity allocation % ≈ 100 − your age. A 25-year-old: ~75% equity. A 55-year-old approaching retirement: ~45% equity. This is simplified but captures the core principle — reduce risk exposure as you approach your goal date.",
        ],
        quiz: [
          {
            q: "A 28-year-old, stable income, no loans, 20-year investment goal should be:",
            opts: [
              "100% FDs — safest choice",
              "Aggressive — high equity allocation",
              "Not investing — too young",
              "Only in gold",
            ],
            ans: 1,
          },
          {
            q: 'Using "100 minus age" rule: a 40-year-old\'s equity allocation should be approximately:',
            opts: ["40%", "60%", "80%", "100%"],
            ans: 1,
          },
        ],
      },
      {
        id: "b3-l4",
        title: "Which is Right for You?",
        duration: "8m",
        keyPoints: [
          "No single answer — align with your goals, personality, and situation",
          "Prerequisites before trading: emergency fund, zero high-interest debt, insurance sorted",
          "Nifty 50 index fund outperforms most active traders long-term after costs",
          "Paper trade for 3–6 months before risking real money",
        ],
        content: [
          'There is no universally "right" approach — it depends entirely on your financial goals, personality, and situation. Many wealth builders combine both: a core long-term portfolio (80–90% of capital) with a small trading account (10–20%) using only "risk capital."',
          "Before trading, ensure these are in place: 6 months of expenses as an emergency fund, zero high-interest debt (personal loans, credit card balances), adequate health and life insurance, and long-term investments (PPF, NPS, index funds) sorted. Trade only with money you can lose entirely.",
          "For most beginners, a Nifty 50 index fund through monthly SIP beats active trading after costs, taxes, and emotional errors. It requires zero daily attention, charges ~0.05–0.2% fees, and delivers 12–14% CAGR historically in India.",
        ],
        quiz: [
          {
            q: '"Paper trading" means:',
            opts: [
              "Trading physical paper commodities",
              "Keeping trading records in a notebook",
              "Simulated trading with virtual money",
              "Trading only government securities",
            ],
            ans: 2,
          },
          {
            q: "Before starting to trade with real money, you should first have:",
            opts: [
              "A 3-monitor trading setup",
              "Emergency fund + insurance + zero high-interest debt",
              "At least ₹10 lakh capital",
              "A Bloomberg terminal subscription",
            ],
            ans: 1,
          },
        ],
      },
    ],
  },

  b4: {
    id: "b4",
    title: "Understanding Mutual Funds & ETFs",
    desc: "Discover how to invest in baskets of stocks and bonds with a single click.",
    trackColor: "#10b981",
    locked: false,
    lessons: [
      {
        id: "b4-l1",
        title: "What is a Mutual Fund?",
        duration: "7m",
        keyPoints: [
          "Pools money from thousands of investors into one portfolio",
          "NAV = total assets ÷ total units outstanding",
          "Professional fund manager makes investment decisions",
          "Open-ended: buy/sell anytime; Closed-ended: trade on exchange",
        ],
        content: [
          "A mutual fund pools money from thousands of investors and invests it in stocks, bonds, or other assets based on a defined mandate. A professional fund manager handles all decisions — you just invest and track performance.",
          "NAV (Net Asset Value) is the per-unit price. If a fund has ₹500 crore in assets and 5 crore units outstanding, NAV = ₹100. Investing ₹10,000 at NAV ₹100 gives you 100 units. As the portfolio grows, NAV rises.",
          "Mutual funds give instant diversification. ₹5,000 in a Nifty 50 index fund means you own a tiny fraction of all 50 large Indian companies — impossible to replicate individually with such small capital.",
        ],
        quiz: [
          {
            q: "NAV of a fund is ₹50. You invest ₹10,000. How many units do you get?",
            opts: ["50 units", "100 units", "200 units", "500 units"],
            ans: 2,
          },
          {
            q: "The key advantage of a mutual fund over buying individual stocks is:",
            opts: [
              "Guaranteed higher returns",
              "Instant diversification with small amounts",
              "No fees or charges",
              "Tax-free income always",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b4-l2",
        title: "ETFs Explained",
        duration: "8m",
        keyPoints: [
          "ETF = mutual fund that trades on stock exchange throughout the day",
          "Index ETFs passively track an index — no fund manager decisions",
          "Typically much lower expense ratios than active funds",
          "Gold ETFs and International ETFs give easy diversification",
        ],
        content: [
          "An ETF (Exchange-Traded Fund) is like a mutual fund but trades on a stock exchange continuously during market hours at live market prices. You buy/sell ETF units through your demat account like buying any stock.",
          "Most popular ETFs in India track indices: Nifty 50 ETF, Nifty Bank ETF, Nifty Next 50 ETF. They hold the same stocks as the underlying index in the exact same proportions — completely passive, lower cost.",
          "Expense ratio matters enormously over time. A Nifty 50 ETF charges ~0.05% per year. An actively managed large-cap fund charges 1–1.5%. On ₹10 lakh over 20 years, that fee difference compounding amounts to lakhs.",
        ],
        quiz: [
          {
            q: "Key difference between a mutual fund and an ETF:",
            opts: [
              "ETFs always have higher returns",
              "ETFs trade on exchanges throughout the day",
              "Mutual funds are always safer",
              "ETFs only invest in bonds",
            ],
            ans: 1,
          },
          {
            q: "Nifty 50 ETF (0.05% expense ratio) vs Active Large-Cap Fund (1.5%). Annual fee difference on ₹1 lakh:",
            opts: ["₹50", "₹1,450", "₹1,000", "₹0 — same cost"],
            ans: 1,
          },
        ],
      },
      {
        id: "b4-l3",
        title: "SIP — Power of Regular Investing",
        duration: "6m",
        keyPoints: [
          "SIP = fixed amount invested every month, automated",
          "Rupee cost averaging: you buy more units when markets fall",
          "₹5,000/month for 30 years at 12% CAGR = ₹1.76 crore+",
          "Step-up SIP: increase by 10-15% per year as income grows",
        ],
        content: [
          "A SIP (Systematic Investment Plan) means investing a fixed amount in a mutual fund every month, regardless of market levels. ₹5,000/month, set up once, runs automatically on a chosen date.",
          "The magic of SIP is rupee cost averaging. When markets fall, ₹5,000 buys more units. When markets rise, it buys fewer. Over time, your average cost per unit is lower than the average market price — you profit from volatility.",
          "Starting early is everything. ₹5,000/month from age 25 for 35 years at 12% = ~₹3.2 crore. Starting at 35 for 25 years = ~₹94 lakh. The extra 10 years is worth ₹2.26 crore. Time in the market beats timing the market.",
        ],
        quiz: [
          {
            q: "What is the main benefit of SIP's rupee cost averaging?",
            opts: [
              "You always buy at the lowest price",
              "You automatically buy more units when prices fall",
              "You avoid market risk entirely",
              "You get guaranteed 12% returns",
            ],
            ans: 1,
          },
          {
            q: "Investing ₹5,000/month from age 25 vs starting at age 35 (at 12% CAGR). The early starter gains approximately:",
            opts: [
              "Same amount",
              "15-20% more",
              "Double",
              "Over 3× more corpus",
            ],
            ans: 3,
          },
        ],
      },
      {
        id: "b4-l4",
        title: "Fund Categories & Choosing Right",
        duration: "9m",
        keyPoints: [
          "SEBI categories: Equity, Debt, Hybrid, Solution-oriented, Others",
          "Equity: Large-cap (lower risk) → Mid-cap → Small-cap (highest risk/reward)",
          "Debt funds are not risk-free — credit risk & interest rate risk exist",
          "Match fund category to your time horizon",
        ],
        content: [
          "SEBI classifies mutual funds into 5 broad categories: Equity (stocks), Debt (bonds/money market), Hybrid (both), Solution-oriented (retirement/children's funds), and Others (index, funds-of-funds). Each has strict sub-categories.",
          "For equity: Large-cap funds invest in top 100 companies (lower risk/returns), Mid-cap in next 150 (moderate), Small-cap beyond top 250 (highest risk and potential return). Flexi-cap and Multi-cap funds blend across all three.",
          "Match to goal: Money in 1 year → Liquid Fund (near-zero risk). 3–5 years → Balanced or Hybrid Fund. 10+ years → Equity large-cap or index fund. Never put short-term money in small-cap or sectoral funds.",
        ],
        quiz: [
          {
            q: "You need money in 18 months to buy a car. Best fund type:",
            opts: [
              "Small-cap equity fund",
              "Liquid / Ultra-short duration debt fund",
              "Mid-cap fund",
              "International equity fund",
            ],
            ans: 1,
          },
          {
            q: "Highest potential return AND risk among equity categories:",
            opts: [
              "Large-cap fund",
              "Multi-cap fund",
              "Small-cap fund",
              "Index fund",
            ],
            ans: 2,
          },
        ],
      },
      {
        id: "b4-l5",
        title: "Costs, Taxes & Common Mistakes",
        duration: "7m",
        keyPoints: [
          "Expense ratio: annual fee deducted from NAV daily",
          "Equity LTCG (>1 yr): 10% above ₹1 lakh; STCG (<1 yr): 15%",
          "Exit load: penalty for redeeming early (typically 1% within 1 year)",
          "Don't switch funds based on 1-year performance",
        ],
        content: [
          "The expense ratio is the annual percentage fee charged to manage the fund. A 1% ratio on ₹1 lakh = ₹1,000/year charged. Over 20 years of compounding, the gap between a 0.1% index fund and a 1.5% active fund can be 30–40% of your final corpus.",
          "Tax on equity mutual funds: profits on holdings > 1 year are Long Term Capital Gains (LTCG) taxed at 10% above ₹1 lakh profit per year. Sold under 1 year (Short Term Capital Gains / STCG): 15%. Debt funds are taxed at your income slab.",
          "Common mistakes: chasing last year's top performer (returns mean-revert), switching funds every 1–2 years (triggers exit loads + taxes + restarts compounding), holding 15+ funds that all overlap in Nifty 50 stocks, and panic-selling during corrections.",
        ],
        quiz: [
          {
            q: "Equity fund profit: ₹80,000 after holding 2 years. LTCG tax owed:",
            opts: [
              "₹8,000 (10% of ₹80,000)",
              "₹0 (profit under ₹1 lakh threshold)",
              "₹12,000 (15%)",
              "₹40,000 (50%)",
            ],
            ans: 1,
          },
          {
            q: "A fund returned 48% last year. You should:",
            opts: [
              "Invest everything immediately",
              "Evaluate over 3–5 year rolling returns, not 1-year",
              "Avoid — past returns never repeat",
              "Invest only if in top 3 funds by 1-year return",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b4-l6",
        title: "Building Your First Portfolio",
        duration: "7m",
        keyPoints: [
          "Simple 3-fund portfolio covers most needs effectively",
          "Rebalance annually to restore target allocation",
          '4–5 funds is optimal — 15+ creates overlapping "di-worsification"',
          "Benchmark active funds against the Nifty 50 over 5+ year rolling periods",
        ],
        content: [
          "A simple, powerful beginner portfolio: 60% Nifty 50 Index Fund (core), 20% Nifty Next 50 or Mid-cap Index Fund (growth), 20% Short Duration Debt Fund (stability buffer). Review annually.",
          'Rebalancing is essential. If equity rises from 60% to 75% after a bull run, sell some equity and buy more debt to restore 60/40. This automatically enforces "sell high, buy low" without emotional decision-making.',
          "Don't collect funds. Four to five well-chosen, non-overlapping funds cover every need. Holding 15 large-cap funds just replicates the Nifty 50 while charging you 15× the fees. Simplicity wins in long-term wealth building.",
        ],
        quiz: [
          {
            q: "Your portfolio target is 60% equity. After a bull run it's now 75%. You should:",
            opts: [
              "Add even more equity",
              "Sell some equity, buy debt — rebalance",
              "Do nothing — let it run",
              "Exit equity entirely",
            ],
            ans: 1,
          },
          {
            q: "Holding 15 large-cap mutual funds likely means:",
            opts: [
              "You're perfectly diversified",
              "Significant overlap + paying 15× fees unnecessarily",
              "Lower risk than 5 funds",
              "Guaranteed outperformance",
            ],
            ans: 1,
          },
        ],
      },
    ],
  },

  b5: {
    id: "b5",
    title: "Risk & Reward Basics",
    desc: "How to think about risk, what volatility means, and how to size your positions.",
    trackColor: "#10b981",
    locked: false,
    lessons: [
      {
        id: "b5-l1",
        title: "What is Risk?",
        duration: "7m",
        keyPoints: [
          "Risk = actual return differs from expected (including total loss)",
          "Market risk affects ALL stocks simultaneously",
          "Company risk is specific to one business",
          "India VIX (Fear Index): >25 = high turbulence; <15 = complacency",
        ],
        content: [
          "Investment risk is the possibility that your actual return differs from your expected return — including the possibility of losing everything. The key insight: risk cuts both ways. Higher risk = higher potential gain AND loss.",
          "Types of risk: Systematic (market) risk affects all stocks simultaneously — a global recession, war, pandemic. Unsystematic (company) risk is specific to one company — bad earnings, fraud, CEO scandal. Diversification removes unsystematic risk but not systematic.",
          "India VIX, derived from Nifty 50 options prices, measures market-wide fear and expected volatility over the next 30 days. VIX above 25 = market nervous, expect choppiness. VIX below 15 = complacency, all may seem calm. Experienced investors watch this daily.",
        ],
        quiz: [
          {
            q: "Which type of risk affects ALL stocks simultaneously?",
            opts: [
              "Company-specific risk",
              "Systematic / market risk",
              "Liquidity risk",
              "Currency risk",
            ],
            ans: 1,
          },
          {
            q: "India VIX at 35 indicates:",
            opts: [
              "Very calm markets",
              "High fear and expected market turbulence",
              "Confirmed bull market",
              "Low trading volumes",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b5-l2",
        title: "Risk vs. Reward",
        duration: "8m",
        keyPoints: [
          "Higher potential return always requires accepting higher risk",
          "Sharpe Ratio = (Portfolio Return − Risk-Free Rate) ÷ Std Deviation",
          "Risk premium = extra return investors demand for holding risky assets",
          "Never take more risk than you can emotionally handle",
        ],
        content: [
          "The fundamental trade-off: higher potential returns come with higher risk. FDs offer ~6–7% with near-zero risk. Nifty 50 delivers ~12–14% historically — but can fall 30–50% in a crash (2008, 2020). You earn the extra return as compensation for tolerating that pain.",
          "The Sharpe Ratio measures how much return you earn per unit of risk taken. Formula: (Fund Return − Risk-Free Rate) ÷ Standard Deviation. A Sharpe of 1.5 is excellent. Comparing Sharpe ratios is more meaningful than comparing raw returns.",
          "Never take more risk than you can handle emotionally. If you'd panic-sell your portfolio when it drops 30%, you're overexposed — even if math says you should be fine. An investor who sells at the bottom locks in losses permanently.",
        ],
        quiz: [
          {
            q: "Fund A: 18% return, Sharpe 0.8 | Fund B: 14% return, Sharpe 1.6. Better risk-adjusted choice:",
            opts: [
              "Fund A — higher absolute return",
              "Fund B — better return per unit of risk",
              "Both identical",
              "Cannot be determined",
            ],
            ans: 1,
          },
          {
            q: "The risk premium on equities over bonds exists because:",
            opts: [
              "Stocks pay dividends, bonds don't",
              "Investors demand extra return for higher risk",
              "Bond companies are always less profitable",
              "Stock regulation is stricter",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b5-l3",
        title: "Diversification",
        duration: "7m",
        keyPoints: [
          "Diversification removes unsystematic (company-specific) risk",
          "Combine assets with low/negative correlation to smooth returns",
          "Sector + asset class + geography diversification all matter",
          "Over-concentration in one stock = catastrophic company-specific risk",
        ],
        content: [
          "\"Don't put all eggs in one basket\" — this is diversification. Spreading investments across companies, sectors, and asset classes means one bad event doesn't destroy your entire portfolio.",
          "Correlation is key. Assets with low or negative correlation to each other move independently. Gold often rises when equity falls (flight to safety). Adding gold or debt to an equity portfolio reduces overall volatility without sacrificing much return.",
          "Practical example: holding only IT stocks gives you zero protection when the IT sector faces headwinds. A diversified portfolio including banking, FMCG, pharma, and gold experiences far smoother returns through market cycles.",
        ],
        quiz: [
          {
            q: "70% of your portfolio is in one stock. Your biggest risk is:",
            opts: [
              "Market / systematic risk",
              "Company-specific unsystematic risk",
              "Currency risk",
              "Inflation risk",
            ],
            ans: 1,
          },
          {
            q: "Nifty 50 index fund + Gold ETF combination helps because:",
            opts: [
              "Both always rise together",
              "Gold often rises when equity falls — low correlation",
              "Both pay high dividends",
              "Gold index funds are required by SEBI",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b5-l4",
        title: "Position Sizing",
        duration: "8m",
        keyPoints: [
          "Position sizing is the most important trading skill — not stock picking",
          "1% rule: never risk > 1% of total capital per trade",
          "Stop-loss distance determines how large your position can be",
          "Formula: Position size = Risk Amount ÷ (Entry − Stop) per share",
        ],
        content: [
          "Position sizing determines how much capital you allocate per trade. Most beginners focus on stock selection — professionals know that how much you bet on each trade determines your survival and long-term profitability.",
          "The 1% rule: never risk more than 1% of total capital per trade. With ₹5 lakh capital, max loss per trade = ₹5,000. This means you can lose 20 consecutive trades and still have 80% of your capital. Bankroll management is everything.",
          "If you buy a stock at ₹100 with a stop-loss at ₹95 (₹5 risk per share), and your max risk is ₹5,000: position size = ₹5,000 ÷ ₹5 = 1,000 shares (₹1 lakh position). This keeps every trade loss within your pre-set limit.",
        ],
        quiz: [
          {
            q: "Capital ₹10 lakh, 1% risk per trade, stop 4% from entry. Max position size:",
            opts: ["₹1 lakh", "₹2.5 lakh", "₹10 lakh", "₹4 lakh"],
            ans: 1,
          },
          {
            q: "The primary purpose of the 1% rule in trading is:",
            opts: [
              "To guarantee profits",
              "To survive prolonged losing streaks",
              "To maximise returns",
              "To reduce brokerage fees",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b5-l5",
        title: "Behavioural Biases in Investing",
        duration: "8m",
        keyPoints: [
          "Loss aversion: pain of loss ~2× stronger than pleasure of equivalent gain",
          "Confirmation bias: seeking info that confirms your existing view",
          "Recency bias: extrapolating recent trends into the future",
          "Contrarian thinking often outperforms crowd thinking at extremes",
        ],
        content: [
          "Our brains evolved for survival, not optimal investing. Behavioural finance catalogues the systematic errors human investors consistently make — knowing these biases helps you design systems to avoid them.",
          "Loss aversion: losing ₹10,000 feels roughly twice as painful as gaining ₹10,000 feels good. This causes investors to hold losing stocks too long (hope of recovery) and sell winning stocks too early (fear of giving back gains). Both are suboptimal.",
          "Recency bias makes us project recent performance into the future. After a crash, everyone thinks it will keep falling. After a bull run, everyone says markets will rise forever. Disciplined investors do the opposite — get cautious when others are greedy, and get interested when others are fearful.",
        ],
        quiz: [
          {
            q: "You hold a stock down 45% and refuse to sell, expecting recovery. This is most likely:",
            opts: [
              "Smart patience",
              "Loss aversion bias at work",
              "Confirmation bias",
              "Always the correct strategy",
            ],
            ans: 1,
          },
          {
            q: 'Everyone is euphoric saying "markets only go up." A disciplined investor should:',
            opts: [
              "Invest more aggressively to not miss out",
              "Be cautious and possibly reduce equity exposure",
              "Switch entirely to cash",
              "Short the entire market immediately",
            ],
            ans: 1,
          },
        ],
      },
    ],
  },

  b6: {
    id: "b6",
    title: "Opening Your First Account",
    desc: "Step-by-step — choosing a broker, KYC, account types, and placing your first order.",
    trackColor: "#10b981",
    locked: false,
    lessons: [
      {
        id: "b6-l1",
        title: "Choosing the Right Broker",
        duration: "7m",
        keyPoints: [
          "Full-service brokers: research + advisory, higher fees (ICICI Direct, Kotak Securities)",
          "Discount brokers: low cost, self-service (Zerodha, Groww, Upstox)",
          "Most discount brokers: ₹20/order flat or zero on equity delivery",
          "Always verify SEBI registration at sebi.gov.in before opening any account",
        ],
        content: [
          "In India you need a SEBI-registered broker to buy and sell stocks. Full-service brokers (ICICI Direct, Kotak Securities, HDFC Securities) offer research, advisory, and relationship managers — but charge higher brokerage (0.3–0.5% per trade).",
          "Discount brokers (Zerodha, Groww, Upstox, Angel One) offer flat ₹20 per order for intraday and F&O, with zero brokerage on equity delivery (buying stocks to hold overnight). They are self-service with excellent mobile apps — ideal for beginners.",
          'Before opening any account: verify the broker is SEBI-registered. Go to sebi.gov.in → Intermediaries → Registered Brokers. Beware of unregistered "brokers" on Instagram/Telegram promising guaranteed returns — these are frauds.',
        ],
        quiz: [
          {
            q: "Main advantage of discount brokers over full-service brokers:",
            opts: [
              "Better research reports",
              "Lower fees and self-service model",
              "Higher guaranteed returns",
              "More trading hours",
            ],
            ans: 1,
          },
          {
            q: "How to verify a broker's legitimacy before opening an account:",
            opts: [
              "Check Instagram follower count",
              "Verify SEBI registration at sebi.gov.in",
              "Ask friends only",
              "Check if they have a physical office",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b6-l2",
        title: "KYC & Account Opening",
        duration: "6m",
        keyPoints: [
          "KYC mandatory — requires PAN card + Aadhaar + bank details",
          "Demat account holds shares electronically; Trading account places orders",
          "Fully online process takes 24–48 hours",
          "Annual Demat AMC: ₹300–₹600 (some brokers waive first year)",
        ],
        content: [
          "KYC (Know Your Customer) is mandatory for all financial accounts in India. Documents needed: PAN card (mandatory for all financial transactions), Aadhaar card (identity + address), bank account details for fund transfers, and a photograph.",
          "You need two linked accounts: a Demat account (holds your shares electronically, like a bank account for stocks — maintained by NSDL or CDSL) and a Trading account (used to place buy/sell orders). Most brokers open both together.",
          "The entire process is now paperless and online. Fill the form → upload KYC documents → complete video KYC or Aadhaar e-KYC → link bank account → activated in 24–48 hours. Annual Demat AMC is ₹300–₹600.",
        ],
        quiz: [
          {
            q: "A Demat account holds:",
            opts: [
              "Your trading cash",
              "Your shares in electronic form",
              "Your mutual fund SIPs",
              "Your broker's licenses",
            ],
            ans: 1,
          },
          {
            q: "Two mandatory documents for KYC in India:",
            opts: [
              "Passport + Voter ID",
              "PAN Card + Aadhaar Card",
              "Driving License + Bank Statement",
              "Birth Certificate + Address Proof",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b6-l3",
        title: "Types of Orders",
        duration: "7m",
        keyPoints: [
          "Market order: immediate execution at best available price",
          "Limit order: execute only at your specified price or better",
          "Stop-Loss order: automatic sell triggered at your stop price",
          "Always set a stop-loss before entering any trade",
        ],
        content: [
          "Market Order: executes immediately at the best available price. Fast and reliable for very liquid stocks (Reliance, HDFC, Infosys) where the spread is just 1–2 paise. You sacrifice exact price for speed of execution.",
          "Limit Order: you specify the exact price at which you want to buy or sell. The order only fills if the market reaches your price. You buy at ₹500 or cheaper; you won't accidentally pay ₹510. Essential for illiquid or volatile stocks.",
          "Stop-Loss Order: automatically sells your stock if the price falls to your pre-set stop. You bought at ₹200, set stop at ₹185 — if price hits ₹185, the exchange automatically sells, limiting your loss to ₹15/share. Non-negotiable for risk management.",
        ],
        quiz: [
          {
            q: "You want HDFC Bank only if it drops to ₹1,500. Which order?",
            opts: [
              "Market order",
              "Limit buy at ₹1,500",
              "Stop-loss sell at ₹1,500",
              "Bracket order",
            ],
            ans: 1,
          },
          {
            q: "You bought at ₹200. Want to limit loss to ₹20/share. Place:",
            opts: [
              "Limit sell at ₹180",
              "Stop-loss sell at ₹180",
              "Market sell immediately",
              "Limit buy at ₹160",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "b6-l4",
        title: "Your First Trade — Step by Step",
        duration: "8m",
        keyPoints: [
          "Fund account first — NEFT/UPI from linked bank, takes 30 min–few hours",
          "Know entry price, stop-loss, and target BEFORE placing an order",
          "Check liquidity — minimum ADV ₹50 lakh for a beginner's first trades",
          "Shares settle in T+1 (next business day) under India's settlement system",
        ],
        content: [
          "Before placing your first trade: ensure your account is funded (NEFT/UPI transfer takes 30 min), you've researched the stock, you know your entry price, your stop-loss level, and your profit target. Never enter a trade without knowing your exit plan.",
          "Open the app → search ticker → check CMP, bid-ask spread, and today's volume. Place a Limit Buy order slightly above current price for immediate fill. Set quantity based on your position sizing rule (5–10% of portfolio max in one stock for beginners).",
          "After execution, your shares appear in your Demat account on T+1 (next business day). Track the stock, respect your stop-loss absolutely — never move it lower just because you don't want to accept a loss. The stop exists for a reason.",
        ],
        quiz: [
          {
            q: "After buying a stock, shares appear in your Demat when?",
            opts: [
              "Immediately",
              "T+1 (next business day)",
              "T+3 (3 days later)",
              "T+7 (1 week later)",
            ],
            ans: 1,
          },
          {
            q: "For a beginner with ₹1 lakh, maximum single-stock position should be:",
            opts: [
              "100% in one great stock",
              "50% max",
              "5–10% (₹5,000–₹10,000)",
              "No limit if well-researched",
            ],
            ans: 2,
          },
        ],
      },
    ],
  },

  /* ── INTERMEDIATE TRACK (Locked - show syllabus only) ─────────────── */
  i1: {
    id: "i1",
    title: "Technical Analysis 101",
    desc: "Support, resistance, chart patterns, and how to use them to time entries and exits.",
    trackColor: "#3b82f6",
    locked: false,
    lessons: [
      {
        id: "i1-l1",
        title: "What is Technical Analysis?",
        duration: "8m",
        keyPoints: [
          "Price discounts everything — past data predicts future",
          "TA studies price + volume patterns, not business fundamentals",
          "Works across all timeframes and all markets",
          "Combines art and data science",
        ],
        content: [
          "Technical analysis (TA) is the study of historical price and volume data to forecast future price movements. The core assumption: all known information is already reflected in the price — the chart tells the complete story of supply and demand.",
          "Unlike fundamental analysis (which studies company financials), TA focuses purely on market behaviour. The same principles work on Nifty 50 index charts, individual stocks, currencies, commodities, and even cryptocurrencies.",
          "TA is used by short-term traders (minutes to weeks) and long-term investors who use it to time their entries and exits around fundamentally strong stocks. The best practitioners combine both disciplines.",
        ],
        quiz: [
          {
            q: "The core assumption of technical analysis is:",
            opts: [
              "Company earnings determine all price moves",
              "All known information is already reflected in the price",
              "Only institutional traders can predict prices",
              "Past price has no relation to future price",
            ],
            ans: 1,
          },
          {
            q: "Technical analysis can be applied to:",
            opts: [
              "Only Indian stocks",
              "Only commodities",
              "All liquid markets — stocks, forex, crypto, indices",
              "Only intraday trading",
            ],
            ans: 2,
          },
        ],
      },
      {
        id: "i1-l2",
        title: "Support & Resistance",
        duration: "9m",
        keyPoints: [
          "Support: price floor where buying emerges",
          "Resistance: price ceiling where selling emerges",
          "Broken resistance becomes new support (and vice versa)",
          "Multiple touches = stronger level",
        ],
        content: [
          "Support is a price level where buying interest is strong enough to prevent further decline. Resistance is a level where selling interest consistently halts price advances. These levels form the foundation of chart analysis.",
          "The more times a price level has been tested and held, the more significant it is. A support level tested 4 times and held is far more reliable than one tested once. High volume at support/resistance confirms the level's strength.",
          'When a resistance level is broken convincingly (ideally with high volume), it often "flips" to become new support. This concept — support and resistance role reversal — is one of the most powerful and repeatable patterns in markets.',
        ],
        quiz: [
          {
            q: "A price level that was previously resistance but is now acting as a floor is called:",
            opts: [
              "A new resistance",
              "A role reversal — resistance turned support",
              "A circuit breaker",
              "A floor order",
            ],
            ans: 1,
          },
          {
            q: "A support level tested 5 times and held each time is:",
            opts: [
              "Weakening — likely to break soon",
              "Stronger — more buyers confirmed at that level",
              "Irrelevant to trading decisions",
              "Only useful for intraday traders",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "i1-l3",
        title: "Candlestick Basics",
        duration: "7m",
        keyPoints: [
          "Candlestick = Open, High, Low, Close in one visual",
          "Body = Open to Close; Wicks = trading range extremes",
          "Green/White candle = closed higher; Red/Black = closed lower",
          "Single candle tells story of that session's battle between buyers/sellers",
        ],
        content: [
          "A candlestick represents four data points: Open (first trade), High (highest trade), Low (lowest trade), and Close (last trade). The body shows Open-to-Close; the wicks (shadows) show the full range.",
          "A tall green body with small wicks = buyers dominated the session from start to finish. A small body with long upper and lower wicks = indecision — neither buyers nor sellers won decisively.",
          "Candlestick patterns are most useful when they appear at key support/resistance levels. A bullish reversal candle at support is more meaningful than the same candle in the middle of a range.",
        ],
        quiz: [
          {
            q: "A candlestick with a long upper wick, long lower wick, and tiny body indicates:",
            opts: [
              "Strong buyer dominance",
              "Strong seller dominance",
              "Indecision — neither side won",
              "A gap opening",
            ],
            ans: 2,
          },
          {
            q: "Candlestick patterns are most reliable when they appear:",
            opts: [
              "In the middle of a trend",
              "At key support or resistance levels",
              "Only during earnings season",
              "On 1-minute charts",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "i1-l4",
        title: "Trend Lines & Channels",
        duration: "8m",
        keyPoints: [
          "Uptrend: series of higher highs and higher lows",
          "Downtrend: series of lower highs and lower lows",
          "Trend line connects swing lows (uptrend) or swing highs (downtrend)",
          "Channels: parallel lines containing price action",
        ],
        content: [
          "A trend is simply a series of higher highs and higher lows (uptrend) or lower highs and lower lows (downtrend). The trend line is drawn connecting the swing lows in an uptrend or swing highs in a downtrend.",
          "Price channels are formed when price oscillates between two parallel trend lines — an upward sloping channel of higher highs and higher lows. Buying near the lower channel line and selling near the upper is a classic channel trading strategy.",
          '"The trend is your friend" — trading in the direction of the trend significantly improves your probability of success. Counter-trend trades require much higher precision and are best left to experienced traders.',
        ],
        quiz: [
          {
            q: "An uptrend is defined as:",
            opts: [
              "20% rise from recent lows",
              "Series of higher highs and higher lows",
              "Any day the market is up",
              "Nifty 50 above 200-day MA",
            ],
            ans: 1,
          },
          {
            q: "In a trend channel, the most common strategy is:",
            opts: [
              "Always sell at the bottom channel line",
              "Buy near lower channel line, sell near upper",
              "Buy breakouts only",
              "Ignore channels — use only indicators",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "i1-l5",
        title: "Chart Patterns",
        duration: "10m",
        keyPoints: [
          "Continuation patterns: flag, pennant, triangle (trend likely continues)",
          "Reversal patterns: head & shoulders, double top/bottom (trend likely reverses)",
          "Volume confirmation: patterns are more reliable with supporting volume",
          "Target measurement: most patterns have a mathematical price target",
        ],
        content: [
          "Chart patterns are recurring formations that have predictive value. They fall into two categories: continuation patterns (the trend is just pausing before resuming) and reversal patterns (the trend is ending and reversing).",
          "Head and Shoulders is the most famous reversal pattern: three peaks with the middle peak (head) higher than the two shoulders. Breaking the neckline (connecting the two troughs) with volume confirms the pattern. Price target = head-to-neckline distance projected downward.",
          "Flags and pennants are continuation patterns formed after a sharp directional move. They represent brief consolidation (tight range) before the trend resumes. Trading the breakout in the direction of the prior move is the standard approach.",
        ],
        quiz: [
          {
            q: "A Head & Shoulders pattern signals:",
            opts: [
              "Trend continuation upward",
              "Trend exhaustion and likely reversal",
              "Sideways consolidation indefinitely",
              "High volatility but no direction",
            ],
            ans: 1,
          },
          {
            q: "A bullish flag pattern (after a sharp rise, then tight consolidation) suggests:",
            opts: [
              "The uptrend has ended",
              "A short opportunity",
              "The uptrend will likely resume on breakout",
              "Sideways movement for 3 months",
            ],
            ans: 2,
          },
        ],
      },
      {
        id: "i1-l6",
        title: "Volume Analysis",
        duration: "9m",
        keyPoints: [
          "Volume is the fuel of price moves",
          "Price up + high volume = confirmed bullish move",
          "Price up + low volume = weak move, potential reversal",
          "Volume divergence (price rises but volume falls) = warning signal",
        ],
        content: [
          'Volume is the number of shares traded in a period. It provides the "weight of evidence" behind a price move. Price action with volume is like choosing between two opinions — one from a single person and another confirmed by thousands.',
          "Climax volume — an extreme volume spike, often 5–10× normal — can signal the end of a move. Buying climax: price spikes up on massive volume, then reverses. Selling climax: price plunges on extreme volume, then reverses. These extremes exhaust the prevailing trend.",
          "On-Balance Volume (OBV) is a running total that adds volume on up days and subtracts on down days. When OBV makes new highs while price hasn't — bullish divergence. When price makes new highs but OBV doesn't — bearish divergence, watch for reversal.",
        ],
        quiz: [
          {
            q: "Price rises 3% today but volume is at 30% of average. This suggests:",
            opts: [
              "Very strong bullish signal",
              "Weak move — lack of conviction",
              "Guaranteed further upside",
              "Short immediately",
            ],
            ans: 1,
          },
          {
            q: "Price makes a new high but OBV does not. This is called:",
            opts: [
              "A bullish confirmation",
              "A bearish divergence — potential warning",
              "Normal price action",
              "A volume climax",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "i1-l7",
        title: "Building a Trade Plan",
        duration: "11m",
        keyPoints: [
          "Trade plan: entry trigger, stop-loss, target, position size — defined BEFORE entry",
          "Risk:Reward minimum 1:2 (risk ₹1 to make ₹2)",
          "If setup doesn't match plan exactly, don't take it",
          "Journal every trade — patterns in mistakes become visible over time",
        ],
        content: [
          "A trade plan documents every condition under which you will enter, exit, and manage a trade — written before you place a single order. Trading without a plan is gambling; trading with a plan is a business.",
          "Risk:Reward (R:R) ratio is fundamental. If you risk ₹5,000 per trade and target ₹10,000+, your R:R is at least 1:2. Even if you're right only 40% of the time, you profit with a 1:2 R:R. This math is why R:R matters more than win rate alone.",
          "A trading journal is your most valuable tool for improvement. Record every trade: setup reason, entry, stop, target, actual result, and what you felt emotionally. After 50–100 trades, patterns emerge — your best setups, your most costly errors, and the emotions that preceded bad decisions.",
        ],
        quiz: [
          {
            q: "Minimum acceptable Risk:Reward ratio for most professional traders:",
            opts: ["1:0.5", "1:1", "1:2", "1:5 only"],
            ans: 2,
          },
          {
            q: "Primary purpose of a trading journal:",
            opts: [
              "To avoid paying taxes",
              "To identify patterns in your wins, losses, and decision-making",
              "To track broker fees",
              "Required by SEBI for all retail traders",
            ],
            ans: 1,
          },
        ],
      },
      {
        id: "i1-l8",
        title: "Backtesting Your Strategy",
        duration: "8m",
        keyPoints: [
          "Backtesting = applying your rules to historical data to see how they performed",
          "Forward testing (paper trading) validates backtest results in live markets",
          "Past performance does not guarantee future results — but it provides statistical edge data",
          "Minimum 100–200 trades needed for statistically meaningful backtest results",
        ],
        content: [
          'Backtesting means applying your exact trading rules to historical price data and calculating the results as if you had traded them. It answers: "Would this strategy have been profitable in the past, and what were the drawdowns?"',
          "Tools for backtesting Indian stocks: TradingView (Pine Script), Streak (NSE/BSE data, no coding required), Amibroker (professional, AFL coding). Always backtest on out-of-sample data — test on 2015–2020 data, validate on 2021–2024.",
          "Key metrics to evaluate: Win rate, Average win/loss ratio, Maximum drawdown (worst peak-to-trough), Profit factor (gross profit ÷ gross loss), and Sharpe ratio. A strategy with 45% win rate but 2.5× avg win:loss ratio is highly profitable.",
        ],
        quiz: [
          {
            q: "A strategy backtested on 2015–2022 data should be validated on:",
            opts: [
              "The same 2015–2022 data again",
              "Completely different out-of-sample period (e.g., 2023–2024)",
              "Theoretical models only",
              "Options data instead",
            ],
            ans: 1,
          },
          {
            q: "Minimum number of trades needed for a statistically meaningful backtest:",
            opts: [
              "10–20 trades",
              "50 trades",
              "100–200 trades minimum",
              "500+ trades always",
            ],
            ans: 2,
          },
        ],
      },
    ],
  },

  i2: {
    id: "i2",
    title: "Candlestick Patterns Deep Dive",
    desc: "Doji, hammer, engulfing — 20 key candlestick formations traders rely on daily.",
    trackColor: "#3b82f6",
    locked: true,
    lessons: [
      {
        id: "i2-l1",
        title: "Doji & Spinning Top",
        duration: "8m",
        keyPoints: ["Premium Content"],
        content: [],
        quiz: [],
      },
      {
        id: "i2-l2",
        title: "Hammer & Hanging Man",
        duration: "7m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i2-l3",
        title: "Engulfing Patterns (Bullish & Bearish)",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i2-l4",
        title: "Morning Star & Evening Star",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i2-l5",
        title: "Three White Soldiers & Three Black Crows",
        duration: "7m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i2-l6",
        title: "Harami, Shooting Star & Inverted Hammer",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i2-l7",
        title: "Combining Patterns with Volume & S/R",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },
  i3: {
    id: "i3",
    title: "Fundamental Analysis",
    desc: "Reading P&L statements, balance sheets, and key ratios: P/E, EPS, ROE, D/E.",
    trackColor: "#3b82f6",
    locked: true,
    lessons: [
      {
        id: "i3-l1",
        title: "Reading a Profit & Loss Statement",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i3-l2",
        title: "Understanding the Balance Sheet",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i3-l3",
        title: "Cash Flow Statement",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i3-l4",
        title: "P/E, P/B & EV/EBITDA Ratios",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i3-l5",
        title: "ROE, ROCE & Capital Efficiency",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i3-l6",
        title: "Debt Ratios & Dividend Analysis",
        duration: "7m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i3-l7",
        title: "Comparing Companies Within a Sector",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i3-l8",
        title: "Building a Stock Watchlist from Fundamentals",
        duration: "12m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i3-l9",
        title: "Common Fundamental Mistakes to Avoid",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },
  i4: {
    id: "i4",
    title: "Moving Averages & Momentum",
    desc: "SMA, EMA, MACD, RSI — the indicators every active trader must master.",
    trackColor: "#3b82f6",
    locked: true,
    lessons: [
      {
        id: "i4-l1",
        title: "Simple Moving Average (SMA)",
        duration: "7m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i4-l2",
        title: "Exponential Moving Average (EMA)",
        duration: "7m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i4-l3",
        title: "50-Day & 200-Day MA — Golden & Death Cross",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i4-l4",
        title: "RSI — Overbought, Oversold & Divergence",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i4-l5",
        title: "MACD — The Trend-Following Momentum Indicator",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i4-l6",
        title: "Combining Multiple Indicators",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },
  i5: {
    id: "i5",
    title: "Portfolio Construction",
    desc: "Modern Portfolio Theory, correlation, asset allocation, and diversification strategies.",
    trackColor: "#3b82f6",
    locked: true,
    lessons: [
      {
        id: "i5-l1",
        title: "Modern Portfolio Theory Basics",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i5-l2",
        title: "Efficient Frontier & Risk-Return Tradeoff",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i5-l3",
        title: "Correlation & Diversification Mathematically",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i5-l4",
        title: "Asset Allocation Strategies",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i5-l5",
        title: "Rebalancing Methods & Tax Efficiency",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i5-l6",
        title: "Factor Investing: Value, Momentum, Quality",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i5-l7",
        title: "Building & Monitoring a 5-Year Portfolio",
        duration: "6m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },
  i6: {
    id: "i6",
    title: "Understanding Bonds & Fixed Income",
    desc: "Yield curves, duration, credit ratings — and why bonds move opposite to rates.",
    trackColor: "#3b82f6",
    locked: true,
    lessons: [
      {
        id: "i6-l1",
        title: "What are Bonds?",
        duration: "7m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i6-l2",
        title: "Yield, Price & the Inverse Relationship",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i6-l3",
        title: "Yield Curve & What it Signals",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i6-l4",
        title: "Credit Ratings & Default Risk",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i6-l5",
        title: "G-Secs, Corporate Bonds & Debentures in India",
        duration: "7m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i6-l6",
        title: "Duration, Convexity & Interest Rate Risk",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },
  i7: {
    id: "i7",
    title: "Forex & Currency Markets",
    desc: "How currency pairs work, pip values, carry trade, and macroeconomic drivers.",
    trackColor: "#3b82f6",
    locked: true,
    lessons: [
      {
        id: "i7-l1",
        title: "How Currency Pairs Work",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i7-l2",
        title: "USD-INR: What Drives the Rupee",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i7-l3",
        title: "Carry Trade Strategy",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i7-l4",
        title: "Forex Impact on Indian Equity Markets",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i7-l5",
        title: "Currency Derivatives on NSE",
        duration: "6m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i7-l6",
        title: "Global Currency Market Structure",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i7-l7",
        title: "Hedging Currency Risk",
        duration: "7m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },
  i8: {
    id: "i8",
    title: "Tax Efficiency in Investing",
    desc: "LTCG, STCG, tax-loss harvesting — keep more of what you earn.",
    trackColor: "#3b82f6",
    locked: true,
    lessons: [
      {
        id: "i8-l1",
        title: "LTCG & STCG on Equity",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i8-l2",
        title: "Debt Fund Taxation",
        duration: "7m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i8-l3",
        title: "STT, Brokerage & Hidden Transaction Costs",
        duration: "7m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i8-l4",
        title: "Tax-Loss Harvesting Strategy",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "i8-l5",
        title: "ELSS: Tax Saving with Equity",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },

  /* ── ADVANCED TRACK (All Locked) ───────────────────────────────────── */
  a1: {
    id: "a1",
    title: "Options — Calls & Puts",
    desc: "Understand premiums, strike prices, expiry, and the Greeks: Delta, Gamma, Theta, Vega.",
    trackColor: "#8b5cf6",
    locked: true,
    lessons: [
      {
        id: "a1-l1",
        title: "What is an Options Contract?",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a1-l2",
        title: "Call Options: Rights Without Obligation",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a1-l3",
        title: "Put Options: Profiting from Declines",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a1-l4",
        title: "Intrinsic Value & Time Value",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a1-l5",
        title: "Delta — Rate of Price Change",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a1-l6",
        title: "Gamma, Theta (Time Decay) & Vega",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a1-l7",
        title: "Option Chains — Reading & Using Them",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a1-l8",
        title: "IV (Implied Volatility) & Its Impact",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a1-l9",
        title: "Weekly vs Monthly Expiry Dynamics",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a1-l10",
        title: "Buying vs Writing Options: Risk Profiles",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },
  a2: {
    id: "a2",
    title: "Options Strategies",
    desc: "Covered calls, straddles, strangles, iron condors — 12 strategies with real P&L diagrams.",
    trackColor: "#8b5cf6",
    locked: true,
    lessons: [
      {
        id: "a2-l1",
        title: "Covered Call: Income on Holdings",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a2-l2",
        title: "Protective Put: Portfolio Insurance",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a2-l3",
        title: "Bull Call & Bear Put Spreads",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a2-l4",
        title: "Long Straddle & Long Strangle",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a2-l5",
        title: "Short Straddle & Short Strangle",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a2-l6",
        title: "Iron Condor: Profiting in Sideways Markets",
        duration: "10m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a2-l7",
        title: "Butterfly & Calendar Spreads",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a2-l8",
        title: "Rolling Options Positions",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a2-l9",
        title: "Adjusting Losing Positions",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a2-l10",
        title: "Backtesting Options Strategies",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a2-l11",
        title: "Weekly Options — 0DTE Strategies",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a2-l12",
        title: "Building a Complete Options Strategy",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },
  a3: {
    id: "a3",
    title: "Futures & Commodities",
    desc: "Crude oil, gold, index futures — how futures contracts work and who uses them.",
    trackColor: "#8b5cf6",
    locked: true,
    lessons: [
      {
        id: "a3-l1",
        title: "What is a Futures Contract?",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a3-l2",
        title: "Index Futures: Nifty & Bank Nifty",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a3-l3",
        title: "Crude Oil & Energy Futures",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a3-l4",
        title: "Gold & Precious Metals Futures",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a3-l5",
        title: "Futures Margin & Leverage",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a3-l6",
        title: "Basis, Rollover & Expiry",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a3-l7",
        title: "Hedging with Futures",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a3-l8",
        title: "Building a Commodity Trading Plan",
        duration: "7m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },
  a4: {
    id: "a4",
    title: "Macro Economics for Traders",
    desc: "GDP, inflation, interest rates, Central Bank policy — and how they move markets.",
    trackColor: "#8b5cf6",
    locked: true,
    lessons: [
      {
        id: "a4-l1",
        title: "GDP, Growth Cycles & Markets",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a4-l2",
        title: "Inflation: CPI, WPI & Their Impact",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a4-l3",
        title: "RBI & Monetary Policy (Repo Rate)",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a4-l4",
        title: "US Fed & Global Market Linkages",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a4-l5",
        title: "Sector Rotation Across Economic Cycles",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a4-l6",
        title: "FII Flows, DXY & Emerging Markets",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a4-l7",
        title: "Using Macro Data in Your Investing",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a4-l8",
        title: "Building a Macro-Informed Portfolio",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a4-l9",
        title: "Reading Economic Calendars",
        duration: "7m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },
  a5: {
    id: "a5",
    title: "Quantitative Trading Foundations",
    desc: "Backtesting, mean reversion, momentum strategies, and intro to algo trading.",
    trackColor: "#8b5cf6",
    locked: true,
    lessons: [
      {
        id: "a5-l1",
        title: "Introduction to Quant Finance",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a5-l2",
        title: "Mean Reversion Strategies",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a5-l3",
        title: "Momentum Strategies",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a5-l4",
        title: "Statistical Arbitrage Basics",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a5-l5",
        title: "Python for Backtesting (Intro)",
        duration: "10m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a5-l6",
        title: "Risk-Adjusted Performance Metrics",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a5-l7",
        title: "Avoiding Overfitting in Strategy Design",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a5-l8",
        title: "Intro to Algo Trading Infrastructure (India)",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a5-l9",
        title: "Building Your First Algo Strategy",
        duration: "10m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a5-l10",
        title: "Live Deployment & Monitoring",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },
  a6: {
    id: "a6",
    title: "Risk Management Mastery",
    desc: "Kelly Criterion, VaR, drawdown control, position sizing frameworks used by hedge funds.",
    trackColor: "#8b5cf6",
    locked: true,
    lessons: [
      {
        id: "a6-l1",
        title: "Kelly Criterion Deep Dive",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a6-l2",
        title: "Value at Risk (VaR)",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a6-l3",
        title: "Maximum Drawdown Control",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a6-l4",
        title: "Portfolio-level Risk Management",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a6-l5",
        title: "Correlation & Concentration Risk",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a6-l6",
        title: "Hedge Fund Risk Frameworks",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a6-l7",
        title: "Building Your Personal Risk Charter",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },
  a7: {
    id: "a7",
    title: "Crypto & DeFi Markets",
    desc: "Bitcoin, Ethereum, stablecoins, on-chain analysis, and decentralised finance protocols.",
    trackColor: "#8b5cf6",
    locked: true,
    lessons: [
      {
        id: "a7-l1",
        title: "Bitcoin & Blockchain Fundamentals",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a7-l2",
        title: "Ethereum, Smart Contracts & Gas",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a7-l3",
        title: "Stablecoins & Their Mechanisms",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a7-l4",
        title: "On-Chain Analysis & Metrics",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a7-l5",
        title: "DeFi: DEXs, Lending & Liquidity Mining",
        duration: "9m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a7-l6",
        title: "Crypto Risk Management & Tax (India)",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a7-l7",
        title: "Integrating Crypto into a Diversified Portfolio",
        duration: "7m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
      {
        id: "a7-l8",
        title: "Future of Web3 & DeFi",
        duration: "8m",
        keyPoints: [],
        content: [],
        quiz: [],
      },
    ],
  },
};

/* ── Locked Screen ──────────────────────────────────────────────────── */
const LockedScreen = ({
  course,
  onBack,
}: {
  course: CourseData;
  onBack: () => void;
}) => (
  <div className="min-h-screen bg-[#070d1a] flex flex-col">
    <div className="max-w-5xl mx-auto px-4 py-8 w-full flex-1 flex flex-col">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors w-fit"
      >
        <ArrowLeft size={16} /> Back to Learning Hub
      </button>
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/40 mb-6">
          <Lock size={36} className="text-slate-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">{course.title}</h2>
        <p className="text-slate-500 text-sm max-w-md mb-8">{course.desc}</p>
        <div className="bg-[#0b1120] border border-slate-800/60 rounded-2xl p-6 w-full max-w-md mb-8">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4">
            Course Syllabus — {course.lessons.length} Lessons
          </p>
          <div className="space-y-2 text-left max-h-64 overflow-y-auto pr-1">
            {course.lessons.map((l, i) => (
              <div
                key={l.id}
                className="flex items-center gap-3 py-2 border-b border-slate-800/40 last:border-0"
              >
                <span className="text-[10px] font-black text-slate-600 w-5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[12px] text-slate-400">{l.title}</span>
                <span className="ml-auto text-[10px] text-slate-600 flex items-center gap-1 shrink-0">
                  <Clock size={9} />
                  {l.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <button
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-black transition-all hover:scale-105 hover:shadow-xl hover:shadow-amber-500/25"
            style={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}
          >
            <Award size={16} /> Unlock with Premium
          </button>
          <p className="text-[11px] text-slate-600">
            Complete the Beginner track first to unlock Intermediate
          </p>
        </div>
      </div>
    </div>
  </div>
);

/* ── Quiz Panel ─────────────────────────────────────────────────────── */
const QuizPanel = ({
  quiz,
  onComplete,
}: {
  quiz: Quiz[];
  onComplete: (score: number) => void;
}) => {
  const [answers, setAnswers] = useState<(number | null)[]>(
    quiz.map(() => null),
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qi: number, oi: number) => {
    if (submitted) return;
    setAnswers((a) => {
      const n = [...a];
      n[qi] = oi;
      return n;
    });
  };

  const handleSubmit = () => {
    if (answers.some((a) => a === null)) return;
    const score = answers.filter((a, i) => a === quiz[i].ans).length;
    setSubmitted(true);
    setTimeout(() => onComplete(score), 1800);
  };

  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="show"
      className="mt-8 pt-6 border-t border-slate-800/60"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/20">
          <Star size={13} className="text-amber-400" />
        </div>
        <span className="text-[12px] font-black text-white uppercase tracking-wider">
          Quick Check
        </span>
      </div>
      <div className="space-y-6">
        {quiz.map((q, qi) => (
          <div key={qi}>
            <p className="text-[13px] font-semibold text-slate-200 mb-3 leading-snug">
              {q.q}
            </p>
            <div className="space-y-2">
              {q.opts.map((opt, oi) => {
                const selected = answers[qi] === oi;
                const isCorrect = oi === q.ans;
                let cls =
                  "border-slate-800/60 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white";
                if (submitted) {
                  if (isCorrect)
                    cls =
                      "border-emerald-500/50 bg-emerald-500/10 text-emerald-300";
                  else if (selected && !isCorrect)
                    cls = "border-red-500/50 bg-red-500/10 text-red-400";
                  else
                    cls = "border-slate-800/40 bg-slate-900/20 text-slate-600";
                } else if (selected) {
                  cls = "border-amber-500/50 bg-amber-500/10 text-amber-300";
                }
                return (
                  <button
                    key={oi}
                    onClick={() => handleSelect(qi, oi)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left text-[12px] transition-all ${cls} ${!submitted ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[10px] font-black">
                      {submitted && isCorrect ? (
                        <CheckCircle size={14} />
                      ) : submitted && selected && !isCorrect ? (
                        <XCircle size={14} />
                      ) : (
                        String.fromCharCode(65 + oi)
                      )}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={answers.some((a) => a === null)}
          className="mt-6 w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: answers.some((a) => a === null)
              ? undefined
              : "linear-gradient(135deg, #f59e0b, #fbbf24)",
            color: answers.some((a) => a === null) ? undefined : "#000",
          }}
        >
          {answers.some((a) => a === null)
            ? "Select all answers to continue"
            : "Submit Answers"}
        </button>
      )}
      {submitted && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center"
        >
          <p className="text-emerald-400 font-black text-sm">
            {answers.filter((a, i) => a === quiz[i].ans).length}/{quiz.length}{" "}
            correct —{" "}
            {answers.every((a, i) => a === quiz[i].ans)
              ? "Perfect! ✨"
              : "Good effort! Moving on…"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

/* ── Lesson Content Panel ───────────────────────────────────────────── */
const LessonContent = ({
  lesson,
  lessonIdx,
  totalLessons,
  onComplete,
  onPrev,
  onNext,
  isCompleted,
}: {
  lesson: Lesson;
  lessonIdx: number;
  totalLessons: number;
  onComplete: (score: number) => void;
  onPrev: () => void;
  onNext: () => void;
  isCompleted: boolean;
}) => {
  const [quizDone, setQuizDone] = useState(isCompleted);

  const handleQuizComplete = (score: number) => {
    setQuizDone(true);
    onComplete(score);
  };

  return (
    <motion.div
      key={lesson.id}
      variants={fade}
      initial="hidden"
      animate="show"
      className="flex-1 min-w-0"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">
          Lesson {lessonIdx + 1} of {totalLessons}
        </span>
        {isCompleted && <CheckCircle size={12} className="text-emerald-400" />}
      </div>
      <h2 className="text-lg sm:text-xl font-black text-white mb-1">
        {lesson.title}
      </h2>
      <div className="flex items-center gap-3 mb-6">
        <span className="flex items-center gap-1 text-[11px] text-slate-500">
          <Clock size={10} />
          {lesson.duration}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-slate-500">
          <BookOpen size={10} />
          Reading
        </span>
      </div>

      {/* Key Points */}
      <div className="bg-amber-500/6 border border-amber-500/20 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={13} className="text-amber-400" />
          <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
            Key Takeaways
          </span>
        </div>
        <ul className="space-y-2">
          {lesson.keyPoints.map((kp, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="text-amber-500 mt-0.5 shrink-0">›</span>
              <span className="text-[12px] text-slate-300 leading-snug">
                {kp}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="space-y-4 mb-2">
        {lesson.content.map((para, i) => (
          <p key={i} className="text-[13px] text-slate-400 leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* Quiz */}
      {!quizDone && lesson.quiz.length > 0 && (
        <QuizPanel quiz={lesson.quiz} onComplete={handleQuizComplete} />
      )}

      {/* Navigation */}
      {(quizDone || lesson.quiz.length === 0) && (
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          className="mt-8 flex flex-wrap items-center justify-between gap-2 sm:gap-3"
        >
          <button
            onClick={onPrev}
            disabled={lessonIdx === 0}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-slate-800 text-slate-400 text-xs sm:text-sm font-semibold hover:border-slate-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={13} /> Previous
          </button>
          {lessonIdx < totalLessons - 1 ? (
            <button
              onClick={onNext}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-black transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
              }}
            >
              Next Lesson <ChevronRight size={13} />
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm text-black transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #10b981, #34d399)",
              }}
            >
              <Trophy size={13} /> Complete Course
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

/* ── Course Completion Screen ───────────────────────────────────────── */
const CompletionScreen = ({
  course,
  totalScore,
  maxScore,
  onBack,
}: {
  course: CourseData;
  totalScore: number;
  maxScore: number;
  onBack: () => void;
}) => (
  <motion.div
    variants={fade}
    initial="hidden"
    animate="show"
    className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10 sm:py-16"
  >
    <div className="mb-6">
      <div
        className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4"
        style={{
          borderColor: course.trackColor,
          background: course.trackColor + "15",
        }}
      >
        <Trophy
          size={28}
          className="sm:w-10 sm:h-10"
          style={{ color: course.trackColor }}
        />
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
        Course Complete!
      </h2>
      <p className="text-slate-400 text-sm">
        You finished{" "}
        <span className="text-white font-bold">{course.title}</span>
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 w-full max-w-xs sm:max-w-sm">
      <div className="p-3 sm:p-4 rounded-2xl bg-[#0b1120] border border-slate-800/60 text-center">
        <div className="text-xl sm:text-2xl font-black text-white mb-1">
          {course.lessons.length}
        </div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wide">
          Lessons Done
        </div>
      </div>
      <div className="p-3 sm:p-4 rounded-2xl bg-[#0b1120] border border-slate-800/60 text-center">
        <div
          className="text-xl sm:text-2xl font-black"
          style={{ color: course.trackColor }}
        >
          {maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 100}%
        </div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wide">
          Quiz Score
        </div>
      </div>
    </div>
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border font-black text-sm"
        style={{
          borderColor: course.trackColor + "40",
          background: course.trackColor + "10",
          color: course.trackColor,
        }}
      >
        <Award size={15} /> Certificate Earned
      </div>
      <button
        onClick={onBack}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm font-bold hover:bg-slate-700 transition-all"
      >
        <ArrowLeft size={14} /> Back to Learning Hub
      </button>
    </div>
  </motion.div>
);

/* ── Main CoursePlayer ──────────────────────────────────────────────── */
interface CoursePlayerProps {
  courseId: string;
  initialProgress?: number;
  onBack: () => void;
}

const CoursePlayerContent = ({
  courseId,
  initialProgress = 0,
  onBack,
  course,
}: CoursePlayerProps & { course: CourseData }) => {
  const { trackActivity } = useAuth();

  const totalLessons = course.lessons.length;
  const startLesson = Math.min(
    Math.floor((initialProgress / 100) * totalLessons),
    totalLessons - 1,
  );

  const [currentIdx, setCurrentIdx] = useState(startLesson);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    const completed = new Set<string>();
    const count = Math.floor((initialProgress / 100) * totalLessons);
    for (let i = 0; i < count; i++) completed.add(course.lessons[i].id);
    return completed;
  });
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});
  const [courseComplete, setCourseComplete] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentLesson = course.lessons[currentIdx];
  const totalScore = Object.values(quizScores).reduce((a, b) => a + b, 0);
  const maxScore = course.lessons.reduce((acc, l) => acc + l.quiz.length, 0);
  const progressPct = Math.round((completedLessons.size / totalLessons) * 100);

  useEffect(() => {
    void trackActivity("learning_lesson_viewed", {
      courseId,
      lessonId: currentLesson.id,
      lessonTitle: currentLesson.title,
      lessonIndex: currentIdx,
    });
  }, [
    courseId,
    currentIdx,
    currentLesson.id,
    currentLesson.title,
    trackActivity,
  ]);

  const handleComplete = (score: number) => {
    setCompletedLessons((p) => {
      const n = new Set(p);
      n.add(currentLesson.id);
      return n;
    });
    setQuizScores((p) => ({ ...p, [currentLesson.id]: score }));
    void trackActivity("learning_lesson_completed", {
      courseId,
      lessonId: currentLesson.id,
      lessonTitle: currentLesson.title,
      score,
    });
  };

  const handleNext = () => {
    if (currentIdx < totalLessons - 1) {
      setCurrentIdx((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      void trackActivity("learning_course_completed", {
        courseId,
        totalLessons,
        totalScore,
        maxScore,
      });
      setCourseComplete(true);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#070d1a]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-[#070d1a]/95 backdrop-blur border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors shrink-0"
          >
            <ArrowLeft size={15} /> Hub
          </button>
          <div className="flex-1 mx-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-white truncate max-w-[50vw]">
                {course.title}
              </span>
              <span className="text-[10px] text-slate-500 shrink-0">
                {progressPct}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: course.trackColor }}
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="sm:hidden flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors shrink-0"
          >
            <BookOpen size={15} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 flex gap-4 sm:gap-6">
        {/* Desktop Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden sm:block w-64 lg:w-72 shrink-0"
        >
          <div className="bg-[#0b1120] border border-slate-800/60 rounded-2xl overflow-hidden sticky top-20">
            <div className="p-4 border-b border-slate-800/60">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                Course Content
              </p>
              <p className="text-[11px] text-slate-400">
                {completedLessons.size}/{totalLessons} lessons completed
              </p>
            </div>
            <div className="max-h-[55vh] sm:max-h-[calc(100vh-200px)] overflow-y-auto">
              {course.lessons.map((l, i) => {
                const done = completedLessons.has(l.id);
                const active = i === currentIdx;
                return (
                  <button
                    key={l.id}
                    onClick={() => setCurrentIdx(i)}
                    className={`w-full flex items-start gap-3 p-3.5 text-left border-b border-slate-800/40 last:border-0 transition-all hover:bg-white/3 ${active ? "bg-white/4" : ""}`}
                  >
                    <div
                      className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border text-[9px] font-black ${
                        done
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                          : active
                            ? "border-amber-500/60 text-amber-400"
                            : "border-slate-700 text-slate-600"
                      }`}
                    >
                      {done ? <CheckCircle size={11} /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[11px] font-semibold truncate leading-snug ${active ? "text-white" : done ? "text-slate-400" : "text-slate-500"}`}
                      >
                        {l.title}
                      </p>
                      <p className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                        <Clock size={9} />
                        {l.duration}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.aside>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sm:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            >
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="absolute left-0 top-0 h-full w-[85vw] max-w-xs bg-[#0b1120] border-r border-slate-800/70"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">
                        Course Content
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {completedLessons.size}/{totalLessons} lessons completed
                      </p>
                    </div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="text-slate-500 hover:text-white transition-colors"
                    >
                      <XCircle size={20} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {course.lessons.map((l, i) => {
                      const done = completedLessons.has(l.id);
                      const active = i === currentIdx;
                      return (
                        <button
                          key={l.id}
                          onClick={() => {
                            setCurrentIdx(i);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-start gap-3 p-3.5 text-left border-b border-slate-800/40 last:border-0 transition-all ${active ? "bg-white/4" : ""}`}
                        >
                          <div
                            className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border text-[9px] font-black ${
                              done
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                                : active
                                  ? "border-amber-500/60 text-amber-400"
                                  : "border-slate-700 text-slate-600"
                            }`}
                          >
                            {done ? <CheckCircle size={11} /> : i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-[11px] font-semibold truncate leading-snug ${active ? "text-white" : done ? "text-slate-400" : "text-slate-500"}`}
                            >
                              {l.title}
                            </p>
                            <p className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                              <Clock size={9} />
                              {l.duration}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col">
          {courseComplete ? (
            <CompletionScreen
              course={course}
              totalScore={totalScore}
              maxScore={maxScore}
              onBack={onBack}
            />
          ) : (
            <div className="bg-[#0b1120] border border-slate-800/60 rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col">
              <LessonContent
                key={currentLesson.id}
                lesson={currentLesson}
                lessonIdx={currentIdx}
                totalLessons={totalLessons}
                onComplete={handleComplete}
                onPrev={handlePrev}
                onNext={handleNext}
                isCompleted={completedLessons.has(currentLesson.id)}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const CoursePlayer = ({
  courseId,
  initialProgress = 0,
  onBack,
}: CoursePlayerProps) => {
  const course = COURSES[courseId];

  if (!course) return null;
  if (course.locked) return <LockedScreen course={course} onBack={onBack} />;

  return (
    <CoursePlayerContent
      courseId={courseId}
      initialProgress={initialProgress}
      onBack={onBack}
      course={course}
    />
  );
};

export default CoursePlayer;
