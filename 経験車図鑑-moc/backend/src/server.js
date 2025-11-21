import express from 'express';
import cors from 'cors';
import db from './db/index.js';
import makersRouter from './routes/makers.js';
import modelsRouter from './routes/models.js';
import experienceRouter from './routes/experience.js';
import scoreRouter from './routes/score.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/makers', makersRouter);
app.use('/api/models', modelsRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/score', scoreRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '経験車図鑑 API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
