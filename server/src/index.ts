import express, { Request, Response, NextFunction } from 'express';
import { incidentsRouter } from './routes/incidents';
import { agentRouter } from './routes/agent';
import { voiceWebhookRouter } from './elevenlabs/webhook';
import { demoRouter } from './routes/demo';
import { civicStore } from './firebase/admin';

export function createServerApp() {
  const app = express();

  // Support JSON payloads including base64 photos
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'BharatPulse AI',
      tagline: "India's AI Operating System for Future Cities",
      version: '1.0.0',
      city: 'Bengaluru, India',
      timestamp: new Date().toISOString(),
      services: {
        gemini: !!process.env.GEMINI_API_KEY,
        elevenlabs: !!process.env.ELEVENLABS_API_KEY,
        googleMaps: !!process.env.GOOGLE_MAPS_API_KEY,
        firebase: !!process.env.FIREBASE_PROJECT_ID,
      },
    });
  });

  // Mount API Routers
  app.use('/api/incidents', incidentsRouter);
  app.use('/api/agent', agentRouter);
  app.use('/api/voice', voiceWebhookRouter);
  app.use('/api/demo', demoRouter);

  // Additional data endpoints
  app.get('/api/teams', (_req: Request, res: Response) => {
    res.json(civicStore.getTeams());
  });

  app.get('/api/critical-facilities', (_req: Request, res: Response) => {
    res.json(civicStore.getFacilities());
  });

  app.get('/api/risk-zones', (_req: Request, res: Response) => {
    res.json(civicStore.getRiskZones());
  });

  // Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
