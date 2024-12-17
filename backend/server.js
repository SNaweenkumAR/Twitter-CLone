// const express = require('express');
import express from 'express'
const app = express();

import dotenv from 'dotenv'


import authRoute from './routes/auth.route.js'
import connectDB from './db/connectDB.js';

import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js'
import cloudinary from "cloudinary"

cloudinary.config({
      cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
      api_key:process.env.CLOUDINARY_API_KEY  ,
      api_secret: process.env.CLOUDINARY_API_SECRET_KEY 
});

dotenv.config();
const PORT = process.env.PORT

app.use(cookieParser())
app.use(express.json());

app.use('/api/auth', authRoute)
app.use('/api/users',userRoute)






app.listen(PORT,() => {console.log(`Server Running at localhost:${PORT}`)
  connectDB()
})          