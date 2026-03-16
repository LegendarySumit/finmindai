# FinMindAI - AI-Powered Finance Education Platform

🚀 **A comprehensive full-stack web platform integrating financial education with real-time market intelligence and AI-powered advisory.**

---

## 🌟 Overview

FinMindAI is an innovative platform designed to democratize financial education through AI-powered insights, real-time market data, and interactive learning experiences. Built with Next.js, TypeScript, and WebSocket technology for seamless real-time updates.

## ✨ Features

### Core Modules

1. **📚 Interactive Learning Hub**
   - Gamified financial education lessons
   - Quizzes and real-world case studies
   - Progress tracking and assessments

2. **📈 Stock Prediction Playground**
   - Man vs AI prediction challenges
   - Risk-free practice environment
   - Interactive stock price predictions

3. **📰 Market Intelligence (Real-time)**
   - Live news feed with WebSocket updates
   - AI-powered sentiment analysis
   - Impact scoring for market-moving events
   - Filter by sentiment: positive, negative, neutral

4. **💼 Portfolio Analyzer** (Coming Soon)
   - AI-driven portfolio insights
   - Risk assessment
   - Optimization suggestions

5. **🤖 AI Strategy Advisor** (Coming Soon)
   - Personalized investment strategies
   - Risk tolerance analysis
   - Market condition adaptations

6. **👥 Community Chat** (Coming Soon)
   - Real-time discussions
   - Collaborative learning
   - Expert Q&A sessions

### Technical Highlights

- ✅ **Next.js 16** with App Router
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS v4** with custom theme
- ✅ **Framer Motion** for smooth animations
- ✅ **WebSocket Integration** for real-time updates
- ✅ **Custom Next.js Server** with integrated WebSocket support
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Lucide React Icons** - Modern icon library

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4.2+
- **Animations**: Framer Motion 12.34.3
- **Icons**: Lucide React 0.575.0
- **Font**: Inter (Google Fonts)

### Backend
- **Server**: Custom Node.js server with Next.js
- **WebSocket**: ws library (8.19.0)
- **Real-time**: WebSocket protocol for live data

### Development Tools
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript
- **Build Tool**: Next.js built-in bundler

---

## 📁 Project Structure

```
finmindai/
├── app/
│   ├── globals.css          # Global styles & Tailwind config
│   ├── layout.tsx            # Root layout with Inter font
│   └── page.tsx              # Main home page
├── components/
│   ├── Header.tsx            # Navigation header
│   ├── Hero.tsx              # Hero section with mock portfolio
│   ├── Features.tsx          # Feature cards grid
│   ├── StockPlayground.tsx   # Interactive stock prediction game
│   ├── MarketIntelligence.tsx           # Static news feed
│   ├── MarketIntelligenceReal.tsx       # Real-time WebSocket news
│   ├── CTA.tsx               # Call-to-action section
│   └── Footer.tsx            # Footer with links & contact
├── hooks/
│   └── useWebSocket.ts       # Custom WebSocket hook
├── public/                   # Static assets
├── server.js                 # Custom server with WebSocket
├── package.json              # Dependencies & scripts
├── tsconfig.json             # TypeScript configuration
├── next.config.ts            # Next.js configuration
├── postcss.config.mjs        # PostCSS with Tailwind
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd d:/WEBD/finmindai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3000
   ```

### Firebase Auth + Firestore Setup

The project now uses Firebase for:
- Google sign in/up
- Email sign in/up
- Firestore user profile storage
- MetaMask wallet authentication via Firebase custom tokens

1. **Create Firebase project**
   - Go to Firebase Console and create/select a project.

2. **Enable Authentication providers**
   - Authentication > Sign-in method
   - Enable `Google`
   - Enable `Email/Password`

3. **Create Web App credentials**
   - Project settings > Your apps > Web app
   - Copy config values into `finmindai/.env.local` using `finmindai/.env.local.example`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

4. **Enable Firestore**
   - Firestore Database > Create database
   - Create in production or test mode as needed

5. **Configure Firebase Admin (required for MetaMask flow)**
   - Firebase Console > Project settings > Service accounts > Generate new private key
   - Base64 encode the downloaded JSON and set:
   - `FIREBASE_SERVICE_ACCOUNT_BASE64`

6. **Apply Firestore security rules**
   - In Firebase Console: Firestore Database > Rules
   - Paste your published rules there and deploy
   - Keep these protections in the rules:
   - signed-in users can only access their own `users/{uid}` profile
   - signed-in users can only create/read their own `users/{uid}/activity/{activityId}` logs
   - client access to `wallet_nonces` should stay blocked

7. **Restart dev server after env changes**
   ```bash
   npm run dev
   ```

### MetaMask Flow (Implemented)

Wallet login now uses a secure challenge-response flow:
- `POST /api/auth/wallet-nonce` generates a nonce challenge and stores it in Firestore.
- Client signs the challenge via MetaMask.
- `POST /api/auth/wallet-verify` verifies signature and mints Firebase custom token.
- Client signs into Firebase Auth with `signInWithCustomToken`.

### Activity Tracking (Implemented)

Authenticated user behavior is stored in Firestore under `users/{uid}/activity`.

The app now logs these classes of events automatically:
- authentication lifecycle: email/google/wallet signup, login, logout
- navigation: session start, page view, section hash navigation, page visibility changes
- engagement: page engagement duration, scroll depth milestones
- UI behavior: button/link clicks, form submissions, field changes
- feature activity: learning hub, course player, stock playground, community interactions

Each activity document includes contextual metadata such as:
- `path` and `fullPath`
- `sessionId`
- `referrer`
- `language`
- `viewport` and `screen`
- feature-specific `metadata`

This gives you a per-user behavior timeline while keeping raw form values and secrets out of Firestore.

   **WebSocket endpoint:**
   ```
   ws://localhost:3000/ws
   ```

### Available Scripts

- `npm run dev` - Start development server with WebSocket (port 3000)
- `npm run dev:next` - Start standard Next.js dev server (without WebSocket)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

---

## 🔌 WebSocket Integration

### Server Implementation

The custom server (`server.js`) integrates WebSocket support with Next.js:

**Features:**
- Real-time stock price updates (every 3 seconds)
- Live news feed updates (every 10 seconds)
- Broadcast messaging to all connected clients
- Automatic reconnection handling
- Mock data generation for demo purposes

**WebSocket Events:**
```javascript
// Connection event
{ type: 'connection', message: '...', timestamp: '...' }

// Stock update
{ 
  type: 'stock_update', 
  data: { symbol, price, change, percentChange, timestamp }
}

// News update
{ 
  type: 'news_update', 
  data: { title, sentiment, timestamp, impactScore }
}

// Ping/Pong
{ type: 'ping' }  // Send
{ type: 'pong', timestamp: '...' }  // Receive
```

### Client Usage

The `useWebSocket` hook provides easy WebSocket integration:

```typescript
import { useWebSocket } from '@/hooks/useWebSocket';

const { isConnected, lastMessage, sendMessage } = useWebSocket('ws://localhost:3000/ws');

// Send message
sendMessage({ type: 'ping' });

// Listen to updates
useEffect(() => {
  if (lastMessage && lastMessage.type === 'stock_update') {
    console.log(lastMessage.data);
  }
}, [lastMessage]);
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Accent**: Emerald (#10b981)
- **Background**: Slate-950 (#0f172a)
- **Gold Accent**: #f59e0b

### Custom Tailwind Theme
```css
@theme {
  --color-finance-dark: #0f172a;
  --color-finance-primary: #3b82f6;
  --color-finance-accent: #10b981;
  --color-finance-gold: #f59e0b;
}
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, gradient effects
- **Body**: Slate-400 for secondary text

---

## 🔧 Configuration

### Tailwind CSS v4
The project uses Tailwind CSS v4 with CSS-first configuration:
- No `tailwind.config.js` required
- CSS variables using `@theme` directive
- PostCSS integration via `@tailwindcss/postcss`

### TypeScript
Strict mode enabled with Next.js-specific configurations:
- Path aliases: `@/*` maps to root directory
- JSX: React
- Module: ESNext

---

## 📊 Components Overview

### MarketIntelligenceReal Component

Real-time news feed with WebSocket integration:

**Features:**
- Live connection status indicator
- Real-time news updates from WebSocket
- Sentiment filtering (all, positive, negative, neutral)
- Animated card transitions
- Impact scoring
- Stock ticker tags

**Usage:**
```tsx
import MarketIntelligenceReal from '@/components/MarketIntelligenceReal';

<MarketIntelligenceReal />
```

### StockPlayground Component

Interactive prediction game:

**Features:**
- Predict stock price movement (UP/DOWN)
- Compete against AI predictions
- Visual feedback with animations
- Mock real-time price updates
- Success/failure indicators

---

## 🌐 Deployment (Future)

### Recommended Platforms
- **Vercel** - Optimized for Next.js (requires WebSocket upgrade)
- **Railway** - Full control over Node.js server
- **Render** - Supports WebSocket out of the box
- **AWS EC2** - Complete infrastructure control

### Environment Variables (When deploying)
```env
NODE_ENV=production
NEXT_PUBLIC_WS_URL=wss://your-domain.com/ws
```

---

## 🛠️ Development Notes

### Migration from React + Vite

This project was migrated from React + Vite to Next.js to enable:
1. Server-side rendering capabilities
2. Integrated WebSocket server
3. Better SEO optimization
4. Built-in routing
5. API routes support

**Original Tech Stack:**
- React 19.2.0 + Vite 8.0.0-beta.15
- Tailwind CSS v4 with @tailwindcss/vite

**Current Tech Stack:**
- Next.js 16.1.6 with App Router
- Tailwind CSS v4 with @tailwindcss/postcss
- Custom Node.js server

### Known Issues

1. **Tailwind CSS v4 Warnings:**
   - `bg-gradient-to-*` classes should be updated to `bg-linear-to-*`
   - These are cosmetic warnings and don't affect functionality

2. **WebSocket Auto-reconnect:**
   - Implements 3-second delay for reconnection attempts
   - Works well for local development

---

## 🎯 Roadmap

### Phase 1: Foundation ✅
- [x] Next.js project setup
- [x] Component migration
- [x] WebSocket integration
- [x] Real-time market intelligence

### Phase 2: Core Features (In Progress)
- [ ] Learning Hub with lessons & quizzes
- [ ] Portfolio Analyzer with AI insights
- [ ] AI Strategy Advisor chatbot
- [ ] User authentication (Web3 + Traditional)

### Phase 3: Community & Social
- [ ] Real-time community chat
- [ ] User profiles & achievements
- [ ] Leaderboards
- [ ] Social sharing

### Phase 4: Advanced Features
- [ ] Live trading integration (paper trading)
- [ ] Advanced charting with TradingView
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations

### Phase 5: Production
- [ ] Backend API (separate service)
- [ ] Socket.io migration for scaling
- [ ] Database integration (PostgreSQL)
- [ ] Redis for caching
- [ ] Postman API documentation
- [ ] Live deployment

---

## 📝 License

This project is private and proprietary. All rights reserved.

---

## 🤝 Contributing

This is a personal/educational project. Contributions are not currently accepted.

---

## 📧 Contact

For questions or feedback:
- **Project**: FinMindAI
- **Location**: D:\WEBD\finmindai
- **Server**: http://localhost:3000
- **WebSocket**: ws://localhost:3000/ws

---

## 🎉 Acknowledgments

- **Next.js Team** - Amazing framework
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Lucide** - Beautiful icons
- **Vercel** - Hosting platform (future)

---

**Built with ❤️ using Next.js, TypeScript, and WebSocket technology**
