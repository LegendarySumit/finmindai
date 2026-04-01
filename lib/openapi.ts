export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'FinMindAI API',
    description: 'AI-powered financial analysis and portfolio management API',
    version: '1.0.0',
    contact: {
      name: 'FinMindAI Support',
      url: 'https://finmindai.com',
      email: 'support@finmindai.com',
    },
  },
  servers: [
    {
      url: 'https://api.finmindai.com',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Firebase ID token',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          code: { type: 'integer' },
          timestamp: { type: 'string', format: 'date-time' },
        },
        required: ['error', 'code'],
      },
      Stock: {
        type: 'object',
        properties: {
          symbol: { type: 'string' },
          price: { type: 'number' },
          change: { type: 'number' },
          changePercent: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
        },
        required: ['symbol', 'price', 'change', 'changePercent'],
      },
      News: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          url: { type: 'string', format: 'uri' },
          source: { type: 'string' },
          publishedAt: { type: 'string', format: 'date-time' },
          sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
        },
        required: ['id', 'title', 'url', 'source', 'publishedAt'],
      },
      WalletNonce: {
        type: 'object',
        properties: {
          nonce: { type: 'string' },
          expiresAt: { type: 'string', format: 'date-time' },
        },
        required: ['nonce', 'expiresAt'],
      },
    },
  },
  paths: {
    '/api/stock': {
      get: {
        summary: 'Get stock price',
        description: 'Retrieve current price and change data for a stock symbol',
        tags: ['Market Data'],
        parameters: [
          {
            name: 'symbol',
            in: 'query',
            required: true,
            schema: { type: 'string', pattern: '^[A-Z]{1,5}$' },
            description: 'Stock symbol (e.g., AAPL)',
            example: 'AAPL',
          },
        ],
        responses: {
          '200': {
            description: 'Stock data retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Stock' },
              },
            },
          },
          '400': {
            description: 'Invalid symbol format',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '429': {
            description: 'Rate limit exceeded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/news': {
      get: {
        summary: 'Get financial news',
        description: 'Retrieve latest financial news and market updates',
        tags: ['News'],
        parameters: [
          {
            name: 'query',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Search query for news',
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 10, maximum: 50 },
            description: 'Maximum number of results',
          },
        ],
        responses: {
          '200': {
            description: 'News articles retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    articles: { type: 'array', items: { $ref: '#/components/schemas/News' } },
                    total: { type: 'integer' },
                  },
                },
              },
            },
          },
          '429': {
            description: 'Rate limit exceeded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/news/deep-analysis': {
      post: {
        summary: 'Get AI-powered analysis',
        description: 'Retrieve deep AI analysis of market trends and stocks',
        tags: ['Analysis'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  query: { type: 'string' },
                  symbols: { type: 'array', items: { type: 'string' } },
                },
                required: ['query'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Analysis completed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    analysis: { type: 'string' },
                    confidence: { type: 'number' },
                    sources: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '429': {
            description: 'Rate limit exceeded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/auth/wallet-nonce': {
      post: {
        summary: 'Get wallet authentication nonce',
        description: 'Request a unique nonce for wallet signature verification',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  address: { type: 'string', pattern: '^0x[a-fA-F0-9]{40}$' },
                },
                required: ['address'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Nonce generated successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/WalletNonce' },
              },
            },
          },
          '400': {
            description: 'Invalid address format',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '429': {
            description: 'Rate limit exceeded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/api/auth/wallet-verify': {
      post: {
        summary: 'Verify wallet signature',
        description: 'Verify wallet signature and obtain authentication token',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  address: { type: 'string', pattern: '^0x[a-fA-F0-9]{40}$' },
                  signature: { type: 'string' },
                  nonce: { type: 'string' },
                },
                required: ['address', 'signature', 'nonce'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Signature verified successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    expiresIn: { type: 'integer' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid signature or nonce',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
          '429': {
            description: 'Rate limit exceeded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
  },
};
