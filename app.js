import express from 'express';
import dotenv from 'dotenv';
import statusRouter from './routes/status.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/fulfill/status', statusRouter);

app.get('/', (req, res) => {
  res.send('Health Score Mock Service is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
