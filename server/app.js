import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db_con.js';
 import jobRoutes from './routes/jobRoutes.js';

dotenv.config();

const app = express();
connectDb();

app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json());

app.use('/api/jobs', jobRoutes);

app.get('/', (req, res) => {
  res.send('Job Importer Backend Running');
});

export default app;
