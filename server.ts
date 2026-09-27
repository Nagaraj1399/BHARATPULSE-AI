import dotenv from 'dotenv';
dotenv.config();

import { createServerApp } from './server/src/index';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import express from 'express';

const PORT = 3000;

async function startServer() {
  const app = createServerApp();
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Mount Vite dev server middlewares
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static build in production
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(`🇮🇳  BHARATPULSE AI - Server running on port ${PORT}`);
    console.log(`     India's AI Operating System for Future Cities`);
    console.log(`==================================================\n`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start BharatPulse server:', err);
  process.exit(1);
});
