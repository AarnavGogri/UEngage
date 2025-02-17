import express from 'express';
import cors from 'cors';
import clubsRouter from './routes/clubsRouter';
import eventsRouter from './routes/eventsRouter';
import usersRouter from './routes/usersRouter';
import authRouter from './routes/auth';
import clubsSearchRouter from './routes/clubsSearch';


const app = express();
app.use(cors());
app.use(express.json());

// Example usage:
app.use('/api/clubs', clubsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/clubs', clubsSearchRouter);


app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
