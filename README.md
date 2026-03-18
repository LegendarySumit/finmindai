<div align="center">

# 💹 FinMindAI

**AI-powered finance education platform with real-time market intelligence**

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-ws-4FC08D?logo=socketdotio&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?logo=firebase&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.34.3-0055FF?logo=framer&logoColor=white)

*Financial Learning • Real-time Intelligence • AI-enhanced Decision Support*

[Live Demo](#) • [Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack)

</div>

---

## 📖 About

FinMindAI is a full-stack educational platform that combines finance learning content, real-time market updates, and AI-driven insight workflows into a single interactive experience. It is built for learners and aspiring investors who want to understand market behavior in a practical, hands-on format.

The platform uses a Next.js App Router frontend with a custom Node.js server and WebSocket support for live market intelligence feeds. It also integrates Firebase Authentication and Firestore to support secure user identity, wallet-assisted authentication flows, and per-user activity tracking.

FinMindAI is designed to grow into a complete advisory ecosystem with portfolio analysis, strategy recommendations, and collaborative learning features.

---

## ✨ Features

- ✅ Interactive Learning Hub with structured finance lessons
- ✅ Stock Prediction Playground for user vs AI challenge flows
- ✅ Real-time Market Intelligence feed via WebSocket updates
- ✅ Sentiment analysis with positive, negative, and neutral filtering
- ✅ Impact scoring for market-moving events
- ✅ Firebase Auth (Google, Email/Password, wallet custom-token flow)
- ✅ Firestore-backed user profile and activity timeline tracking
- 🚧 Portfolio Analyzer (planned)
- 🚧 AI Strategy Advisor (planned)
- 🚧 Community Chat (planned)

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.1.6 | App framework and routing |
| React | 19.2.3 | UI rendering |
| TypeScript | 5.x | Type safety and maintainability |
| Tailwind CSS | 4.x | Utility-first styling |
| Framer Motion | 12.34.3 | UI animations |
| Lucide React | 0.575.0 | Icon system |

### Backend and Real-time

| Technology | Version | Purpose |
|---|---|---|
| Node.js Custom Server | - | Hosts Next app and WebSocket endpoint |
| ws | 8.19.0 | WebSocket server and client events |
| Socket.io and Client | 4.8.3 | Realtime utilities and compatibility |

### Data and Auth

| Technology | Version | Purpose |
|---|---|---|
| Firebase | 12.10.0 | Client auth and app services |
| Firebase Admin | 13.7.0 | Secure server-side token workflows |
| Firestore | - | User profiles and activity logs |

---

## 📁 Project Structure

```text
finmindai/
|- app/
|  |- globals.css
|  |- layout.tsx
|  |- page.tsx
|- components/
|  |- Header.tsx
|  |- Hero.tsx
|  |- Features.tsx
|  |- StockPlayground.tsx
|  |- MarketIntelligence.tsx
|  |- MarketIntelligenceReal.tsx
|  |- CTA.tsx
|  |- Footer.tsx
|- hooks/
|  |- useWebSocket.ts
|- lib/
|- public/
|- server.js
|- package.json
|- tsconfig.json
|- next.config.ts
|- postcss.config.mjs
|- .env.local.example
|- README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm

### Installation and Run

```bash
cd d:/WEBD/finmindai
npm install
npm run dev
```

Open in browser:

```text
http://localhost:3000
```

---

## ⚙️ Configuration

Create a file named .env.local from .env.local.example and set these values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
FIREBASE_SERVICE_ACCOUNT_BASE64=
```

### Firebase Setup Checklist

1. Create or select a Firebase project.
2. Enable Google and Email/Password providers in Authentication.
3. Create Firestore database.
4. Add project web credentials to .env.local.
5. Add FIREBASE_SERVICE_ACCOUNT_BASE64 for wallet verify flow.
6. Deploy secure Firestore rules and keep wallet_nonces locked from client access.
7. Restart dev server after env updates.

---

## 📚 Usage

1. Start the app with npm run dev.
2. Register or sign in with Google, email/password, or wallet flow.
3. Explore learning and prediction modules.
4. View live market feed updates and sentiment categories.
5. Track engagement and actions through Firestore activity logs.

WebSocket endpoint:

```text
ws://localhost:3000/ws
```

---

## 🔌 API Endpoints

### Auth and Wallet Flow

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /api/auth/wallet-nonce | Generate and store wallet challenge nonce |
| POST | /api/auth/wallet-verify | Verify signature and issue Firebase custom token |

### Example

```bash
curl -X POST http://localhost:3000/api/auth/wallet-nonce \
  -H "Content-Type: application/json" \
  -d "{\"walletAddress\":\"0xYourWallet\"}"
```

---

## 📊 Project Statistics

| Metric | Value |
|---|---|
| Framework | Next.js 16.1.6 |
| Language | TypeScript 5.x |
| Realtime Layer | WebSocket (ws) |
| Auth Layer | Firebase Auth + Custom Wallet Token |
| Data Layer | Firestore |
| Major Modules | 6+ (learning, prediction, market intelligence, auth, analytics, activity tracking) |

---

## 🐛 Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| App fails to start | Missing env values | Populate .env.local and restart |
| Firebase auth error | Provider not enabled | Enable provider in Firebase Console |
| Wallet login fails | Missing FIREBASE_SERVICE_ACCOUNT_BASE64 | Add encoded service account JSON |
| Realtime feed not updating | WebSocket disconnected | Ensure npm run dev starts custom server.js |
| Port conflict on 3000 | Another process using port | Stop conflicting process or reconfigure port |

---

## 🔮 Future Enhancements

- [ ] Portfolio Analyzer with AI-driven recommendations
- [ ] AI Strategy Advisor with personalization
- [ ] Community Chat with expert-led channels
- [ ] Paper trading simulation mode
- [ ] Advanced charting integration
- [ ] Production deployment and observability pipeline

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 👨‍💻 Author

**LegendarySumit**

- GitHub: [@LegendarySumit](https://github.com/LegendarySumit)
- Project: [finmindai](https://github.com/LegendarySumit/finmindai)
- Live Demo: [finmindai demo]([https://legendarysumit.github.io/finmindai/](https://finmindai.up.railway.app/)) (if deployed)

---

<div align="center">

**🎯 Learn Finance Smarter, React to Markets Faster**

*FinMindAI • Real-time market learning powered by AI*

---

**⭐ Star this repo if you find it helpful!**

</div>
