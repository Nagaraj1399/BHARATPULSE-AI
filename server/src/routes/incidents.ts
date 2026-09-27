import { Router, Request, Response } from 'express';
import { incidentsDb } from '../firebase/incidents';
import { civicStore } from '../firebase/admin';
import { runAgentOrchestration } from '../agent/orchestrator';

export const incidentsRouter = Router();

// GET /api/incidents
incidentsRouter.get('/', (_req: Request, res: Response) => {
  const incidents = incidentsDb.getAll();
  res.json(incidents);
});

// GET /api/incidents/:id
incidentsRouter.get('/:id', (req: Request, res: Response) => {
  const incident = incidentsDb.getById(req.params.id);
  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' });
  }

  const actions = civicStore.getActions(incident.id);
  const notifications = civicStore.getNotifications(incident.id);

  res.json({
    ...incident,
    actions,
    notifications,
  });
});

// POST /api/incidents
incidentsRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { description, latitude, longitude, language, imageUrl, address } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const id = `BP-${Math.floor(2000 + Math.random() * 900)}`;
    const lat = typeof latitude === 'number' ? latitude : 12.9716;
    const lng = typeof longitude === 'number' ? longitude : 77.5946;

    const incident = incidentsDb.create({
      id,
      description,
      language: language || 'en',
      latitude: lat,
      longitude: lng,
      address: address || 'Bengaluru Urban District',
      imageUrl,
      status: 'RECEIVED',
    });

    // Auto-trigger autonomous coordination
    runAgentOrchestration(incident.id).catch((err) =>
      console.error('Agent orchestration background error:', err)
    );

    res.status(201).json(incident);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
