const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// connect to db
mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true,
    useUnifiedTopology: true},
    ()=>{console.log('Connected to Mongo DB.');});


// Middleware
app.use(express.json());

// Import Routes
const authRoute = require('./routes/auth');

// Route Middlewares
app.use('/api/user', authRoute);


app.listen(3000, () =>{console.log("The server is up and running.");});