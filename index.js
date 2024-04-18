const express = require("express");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 8080;

mongoose.connect('mongodb://127.0.0.1/monterassignment', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use(express.json());

app.listen(port, (req, res) => {
    console.log("Listening to requests on port 8080");
});