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

Recent backend hardening introduced standardized API response envelopes, centralized security headers, WebSocket auth enforcement, and production CI/CD improvements for safer releases.

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
- ✅ Hardened backend API responses and security headers
- ✅ Authenticated WebSocket upgrades with Firebase token checks
- ✅ Dockerized runtime and GitHub Actions deployment pipeline
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

### DevOps and Deployment

| Technology | Purpose |
|---|---|
| GitHub Actions | Test, security, build, and deploy automation |
| Docker + Buildx | Containerized build and image publish flow |
| GHCR | Container image registry |
| Render Web Service | Production deployment orchestration |

---

## 📁 Project Structure

```text
finmindai/
|- app/
|- .github/
|  |- workflows/
|  |  |- test.yml
|  |  |- security.yml
|  |  |- deploy.yml
|  |- api/
|  |  |- auth/
|  |  |- docs/
|  |  |- health/
|  |  |- news/
|  |  |- stock/
|  |- globals.css
|  |- layout.tsx
|  |- page.tsx
|- lib/
|  |- apiResponse.ts
|  |- auth.ts
|  |- emailVerification.ts
|  |- env.ts
|  |- firebaseAdmin.ts
|  |- rateLimit.ts
|  |- securityHeaders.ts
|  |- validation.ts
|- public/
|- server.js
|- proxy.ts
|- Dockerfile
|- docker-compose.yml
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

Production run:

```bash
npm run build
npm start
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
FINNHUB_API_KEY=
```

Production deployment secrets (GitHub Actions):

```env
RENDER_DEPLOY_HOOK_URL=
```

### Firebase Setup Checklist

1. Create or select a Firebase project.
2. Enable Google and Email/Password providers in Authentication.
3. Create Firestore database.
4. Add project web credentials to .env.local.
5. Add FIREBASE_SERVICE_ACCOUNT_BASE64 for wallet verify flow.
6. Restart dev server after env updates.

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

WebSocket authentication:

- Include Firebase ID token in the `Authorization` header as `Bearer <token>`.
- Alternative for browser clients: `ws://localhost:3000/ws?token=<firebase_id_token>`.
- Unauthenticated upgrade requests are rejected with HTTP 401.

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

## 🧭 Production Operations

- Deployment, rollback, backup, and monitoring guidance are consolidated below.

### Required launch checks

1. `npm run lint`
2. `npm run test:ci`
3. `npm run build`
4. Verify `/api/health` and authenticated `/ws` after deployment

### Pre-Deploy Checklist

1. Ensure required env vars are set in deployment platform.
2. Confirm Firebase Admin credentials are valid.
3. Confirm GitHub Actions secrets are configured.
4. Run local gates:
  - `npm install`
  - `npm run lint`
  - `npm run test:ci`
  - `npm run build`

### Deploy Sequence

1. Push to `master` or `main`.
2. Wait for CI workflow test job to pass.
3. Wait for deploy workflow to finish.

### Current CI/CD Implementation

1. `test.yml` runs lint, type checks, tests, and build verification.
2. `security.yml` runs dependency audit, secret scan, SAST, container scan, and SARIF upload.
3. `deploy.yml` runs Trivy scan, Docker build/publish path, and triggers a Render deploy hook.

### Docker Deployment

```bash
docker build -t finmindai:latest .
docker run -p 3000:3000 --env-file .env.local finmindai:latest
```

### Post-Deploy Smoke Checks

1. `GET /api/health` returns `success: true`.
2. `GET /api/news` returns `success: true`.
3. `GET /api/stock?symbol=AAPL` returns `success: true`.
4. `POST /api/auth/wallet-nonce` works and returns rate-limit headers when stressed.
5. `/ws` rejects unauthenticated upgrades with HTTP 401.
6. `/ws` accepts authenticated Firebase ID token.

### Rollback

1. Re-deploy previous stable image/commit.
2. Re-run smoke checks.
3. If auth is impacted, rotate Firebase service account key.

### Incident Handling

1. Declare incident severity (`SEV-1`, `SEV-2`, `SEV-3`).
2. Freeze deployments for `SEV-1` and `SEV-2`.
3. Capture logs for failing route and timeframe.
4. Mitigate with feature flag or rollback.
5. Publish post-incident summary with root cause and prevention action.

### Backup and Recovery

1. Back up Firestore data exports daily.
2. Keep deployment env snapshots (without plaintext secret dumps).
3. Retain 30 daily backups and 12 monthly backups.
4. Restore procedure:
  - Identify restore point.
  - Import into staging first.
  - Validate integrity.
  - Apply to production after sign-off.
5. Targets:
  - `RPO`: 24 hours
  - `RTO`: 2 hours

### Monitoring and Alerting

1. Track core metrics:
  - API success rate
  - API p95 latency (`/api/news`, `/api/stock`, `/api/news/deep-analysis`)
  - WebSocket active connections and auth failure count
  - `401/403/429/5xx` rates
2. Alert thresholds:
  - API `5xx > 2%` for 5 minutes
  - `/api/health` unhealthy for 2 consecutive checks
  - WebSocket unauthorized upgrades > 100 in 10 minutes
  - Deep-analysis failures > 10% in 10 minutes
3. Logging rules:
  - JSON structured logs with route, status, duration, correlation id
  - Never log raw secrets or ID tokens
  - Redact sensitive user identifiers where feasible

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
| Render deploy not triggered in CI | Missing or invalid deploy hook | Set `RENDER_DEPLOY_HOOK_URL` in GitHub secrets |

---

## 🔮 Future Enhancements

- [ ] Portfolio Analyzer with AI-driven recommendations
- [ ] AI Strategy Advisor with personalization
- [ ] Community Chat with expert-led channels
- [ ] Paper trading simulation mode
- [ ] Advanced charting integration
- [x] Production deployment and observability pipeline baseline

---

## 📄 License

This project is licensed under the MIT License. See `LICENSE` for full text.

---

## 👨‍💻 Author

**LegendarySumit**

- GitHub: [@LegendarySumit](https://github.com/LegendarySumit)
- Project: [finmindai](https://github.com/LegendarySumit/finmindai)
- Live Demo: [finmindai demo](https://finmindai.onrender.com/) (if deployed)

---

<div align="center">

**🎯 Learn Finance Smarter, React to Markets Faster**

*FinMindAI • Real-time market learning powered by AI*

---

**⭐ Star this repo if you find it helpful!**

</div>
