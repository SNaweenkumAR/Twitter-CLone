// const express = require('express');
import express from 'express'
const app = express();

import dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT

import authRoute from './routes/auth.route.js'
import connectDB from './db/connectDB.js';

app.use(express.json());

app.use('/api/auth', authRoute)







app.listen(PORT,() => {console.log(`Server Running at localhost:${PORT}`)
  connectDB()
})          