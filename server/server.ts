import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateWireframe } from './routes/generate.js';
import { generateWithKey } from './routes/generate-with-key.js';
import { validateApiKey } from './routes/validate-key.js';
import { getModels } from './routes/models.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.post('/api/generate-wireframe', generateWireframe);
app.post('/api/generate-with-key', generateWithKey);
app.post('/api/validate-key', validateApiKey);
app.get('/api/models', getModels);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Figma AI Wireframer server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});