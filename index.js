import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import usersRouter from './routes/users.js';
import partiesRouter from './routes/parties.js';
import authRouter from './routes/auth.js';
import passwordRouter from './routes/password.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB Atlas connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://steven:Movil.123@miapp.dlaxdhg.mongodb.net/Gastos?retryWrites=true&w=majority&appName=miapp';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRouter);
app.use('/api/password', passwordRouter);
app.use('/api/users', usersRouter);
app.use('/api/parties', partiesRouter);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
