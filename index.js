const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');

require('dotenv').config();
const app = express();

const port = process.env.PORT || 8080;

//Routes import
const userRoutes = require('./routes/userRoutes');
const detailsRoute = require('./routes/detailsRoute');

//Middleware import
const { verifyUser } = require('./middlewares/verifyUser');

//open mongoDB connection
mongoose.connect('mongodb://127.0.0.1/monterassignment');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

//Working with cookies for JWT Auth. 
app.use(cookieParser());
app.use(express.json());

//Routes
app.use('/user', userRoutes);
app.use('/details', verifyUser, detailsRoute);

//Listening to the requests
app.listen(port, (req, res) => {
    console.log("Listening to requests on port 8080");
});