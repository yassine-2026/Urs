import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3000;

app.use(express.json());

// Memory store
const store = {
  sessions: new Map(),
  providerConfig: {
    provider: 'now.gg',
    clientId: '',
    appId: '',
    apiKey: '',
    gameUrl: '',
    environment: 'test'
  }
};

// API: Config
app.get('/api/admin/config', (req, res) => {
  res.json(store.providerConfig);
});

app.post('/api/admin/config', (req, res) => {
  store.providerConfig = { ...store.providerConfig, ...req.body };
  res.json({ success: true, config: store.providerConfig });
});

// API: Sessions
app.get('/api/admin/stats', (req, res) => {
  res.json({
    activeSessions: Array.from(store.sessions.values()).filter(s => s.state !== 'STOPPED').length,
    totalSessions: store.sessions.size,
    sessions: Array.from(store.sessions.values())
  });
});

app.post('/api/session/create', (req, res) => {
  const { providerConfig } = store;
  if (!providerConfig.clientId && providerConfig.provider === 'now.gg') {
    return res.status(400).json({ error: 'CLOUD_PROVIDER_NOT_CONFIGURED', message: 'لم يتم إعداد مزود Cloud Gaming.' });
  }

  const sessionId = `ff_${uuidv4().substring(0, 8)}`;
  const session = {
    id: sessionId,
    state: 'CREATING',
    createdAt: new Date().toISOString(),
    provider: providerConfig.provider,
    url: providerConfig.gameUrl || 'now.gg/play/garena/114/free-fire'
  };

  store.sessions.set(sessionId, session);
  
  // Simulate session provisioning
  setTimeout(() => {
    if (store.sessions.has(sessionId)) {
      const s = store.sessions.get(sessionId);
      if (s.state === 'CREATING') {
        s.state = 'RUNNING';
        store.sessions.set(sessionId, s);
      }
    }
  }, 2000);

  res.json({ sessionId, session });
});

app.get('/api/session/:id', (req, res) => {
  const session = store.sessions.get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Not found' });
  res.json(session);
});

app.post('/api/session/:id/stop', (req, res) => {
  const session = store.sessions.get(req.params.id);
  if (session) {
    session.state = 'STOPPED';
    store.sessions.set(req.params.id, session);
  }
  res.json({ success: true });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
