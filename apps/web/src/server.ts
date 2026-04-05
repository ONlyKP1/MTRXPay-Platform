import express from 'express';
import orchestrateRoute from './routes/orchestrate';

const app = express();
const PORT = 3001;

app.use(express.json());

app.use('/api', orchestrateRoute);

app.get('/health', (_, res) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
