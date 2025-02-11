import dotenv from 'dotenv';
import express from 'express';
import userRoutes from './routes/userRoute';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API is working!');
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
