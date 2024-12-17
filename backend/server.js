// const express = require('express');
import express from 'express'
const app = express();

import dotenv from 'dotenv'
dotenv.config();
const PORT = process.env.PORT

import authRoute from './routes/auth.route.js'
import connectDB from './db/connectDB.js';

import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js'

app.use(cookieParser())

app.use(express.json());

app.use('/api/auth', authRoute)
app.use('/api/users',userRoute)






app.listen(PORT,() => {console.log(`Server Running at localhost:${PORT}`)
  connectDB()
})          