import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { connectToMongo } from './config/mongoClient'
import usersRoute from './routes/UserRoutes'
import ticketRoute from './routes/TicketRoutes'

// const express = require('express');
// const dotenv = require('dotenv');
// const { connectToMongo } = require('./config/mongoClient');
// const usersRoute = require('./routes/userRoutes');
// const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from React frontend
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // if you're using cookies or auth headers
}));
app.use(express.json());

app.use('/service/user', usersRoute);
app.use('/service/tickets', ticketRoute);

// Make sure server is running
app.get('/', (_req, res) => {
  res.send('Server is working!');
});

// Start server
app.listen(PORT, async () => {
  try {
    await connectToMongo();
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error('MongoDB connection failed', err);
  }
});
