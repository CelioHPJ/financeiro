import 'dotenv/config';
import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { routes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ status: 'error', message: 'Internal server error' });
});

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
