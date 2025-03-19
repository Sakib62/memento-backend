import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import errorHandler from './middlewares/errorHandler';
import authRoutes from './routes/authRoutes';
import searchRoutes from './routes/searchRoutes';
import storyRoutes from './routes/storyRoutes';
import userRoutes from './routes/userRoute';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/comments', commentRoutes);

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API is working!');
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
