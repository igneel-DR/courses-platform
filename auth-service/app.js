const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config(); 

const port = process.env.PORT;
const host = process.env.HOST;
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const authRoute = require('./Route/User'); 
app.use("/auth",authRoute) 

app.listen(port, () => {
    console.log(`Server running at http://${host}:${port}`);
});