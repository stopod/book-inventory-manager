import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { config } from 'dotenv';
import { apiRouter } from './presentation/api/router';

// Load environment variables
config();

const app = new Hono();

// Middleware - 単純なロガーとシンプルなCORS設定
app.use('*', logger());
app.use('*', cors());

// API Routes
app.route('/api', apiRouter);

// Health check
app.get('/', (c) => c.json({ status: 'ok', message: 'Book Inventory API is running' }));

// Not found handler
app.notFound((c) => {
  return c.json(
    {
      status: 404,
      message: 'Not Found',
    },
    404
  );
});

// Error handler
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json(
    {
      status: 500,
      message: 'Internal Server Error',
    },
    500
  );
});

// Start server
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
