/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { WebSocketServer } = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = Number(process.env.PORT || 3000);

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const handleUpgrade = app.getUpgradeHandler();

  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  });

  // Create WebSocket server and explicitly route upgrade requests.
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    const { pathname } = parse(req.url || '', true);

    if (pathname === '/ws') {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
      return;
    }

    handleUpgrade(req, socket, head);
  });

  // Mock stock data generator
  const stocks = ['TSLA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META'];
  const basePrice = {
    TSLA: 245.67,
    AAPL: 178.32,
    MSFT: 415.89,
    GOOGL: 142.56,
    AMZN: 168.45,
    NVDA: 875.23,
    META: 485.67,
  };

  function generateStockUpdate() {
    const stock = stocks[Math.floor(Math.random() * stocks.length)];
    const change = (Math.random() - 0.5) * 5;
    const price = basePrice[stock] + change;
    const percentChange = ((change / basePrice[stock]) * 100).toFixed(2);

    return {
      type: 'stock_update',
      data: {
        symbol: stock,
        price: price.toFixed(2),
        change: change.toFixed(2),
        percentChange: percentChange,
        timestamp: new Date().toISOString(),
      },
    };
  }
  
  function generateNewsUpdate() {
    const newsTemplates = [
      { template: '{subject} {action} {object} {context}', sentiment: 'positive' },
      { template: '{subject} {action} {object} {context}', sentiment: 'negative' },
      { template: '{subject} {action} {object} {context}', sentiment: 'neutral' },
    ];

    const subjects = ['Apple', 'Tesla', 'Nvidia', 'Bitcoin', 'The Fed', 'Oil Prices', 'Goldman Sachs', 'Google'];
    const actions = ['surges after', 'plunges due to', 'announces', 'reveals plans for', 'warns about', 'secures deal with'];
    const objects = ['record earnings', 'supply chain crisis', 'AI breakthrough', 'regulatory crackdown', 'interest rate hike', 'merger talks'];
    const contexts = ['amidst market volatility', 'cheering investors', 'sparking sell-off', 'defying expectations', 'in early trading'];

    const sources = ['Bloomberg', 'Reuters', 'CNBC', 'Financial Times', 'WSJ'];
    const categories = ['Stocks', 'Crypto', 'Macro', 'Commodities', 'Tech'];

    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const object = objects[Math.floor(Math.random() * objects.length)];
    const context = contexts[Math.floor(Math.random() * contexts.length)];
    
    // Simple sentiment logic based on keywords
    let sentiment = 'neutral';
    if (action.includes('surges') || action.includes('secures') || object.includes('record') || object.includes('breakthrough')) sentiment = 'positive';
    if (action.includes('plunges') || action.includes('warns') || object.includes('crisis') || object.includes('crackdown')) sentiment = 'negative';

    const title = `${subject} ${action} ${object} ${context}`;
    const source = sources[Math.floor(Math.random() * sources.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];

    return {
      type: 'news_update',
      data: {
        id: Date.now(),
        title,
        sentiment,
        source,
        category,
        timestamp: new Date().toISOString(),
        impactScore: (Math.random() * 10).toFixed(1),
        aiInsight: `AI analysis suggests ${sentiment === 'positive' ? 'bullish' : sentiment === 'negative' ? 'bearish' : 'neutral'} momentum for ${subject}. Trading volume is expected to ${sentiment === 'positive' ? 'increase' : 'fluctuate'}.`,
      },
    };
  }

  // Connection handler
  wss.on('connection', (ws) => {
    console.log('🔗 New WebSocket client connected');

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to FinMindAI WebSocket Server',
      timestamp: new Date().toISOString(),
    }));

    // Send stock updates every 3 seconds
    const stockInterval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(generateStockUpdate()));
      }
    }, 3000);

    // Send news updates every 10 seconds
    const newsInterval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(generateNewsUpdate()));
      }
    }, 10000);

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log('📨 Received:', data);

        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
        }

        // Broadcast to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({
              type: 'broadcast',
              data: data,
              timestamp: new Date().toISOString(),
            }));
          }
        });
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    // Handle disconnection
    ws.on('close', () => {
      console.log('❌ Client disconnected');
      clearInterval(stockInterval);
      clearInterval(newsInterval);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  server.once('error', (err) => {
    console.error(err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`✅ Server ready on http://${hostname}:${port}`);
    console.log(`🔌 WebSocket server running on ws://${hostname}:${port}/ws`);
  });
});
