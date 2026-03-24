import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', game: 'Sky Hopper' });
});

app.get('/api/game-config', (req, res) => {
  res.json({
    title: 'Sky Hopper',
    tapHint: 'Tap anywhere to flap',
    theme: 'sunny-sky',
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(process.env.PORT || 3001, () => {
  console.log('Server listening on port 3001');
});
