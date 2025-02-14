import dotenv from 'dotenv';
import express from 'express';
import errorHandler from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import storyRoutes from './routes/storyRoutes';
import userRoutes from './routes/userRoute';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API is working!');
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
