const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoHandler = require('./routeHandler/todoHandler');
const userHandler = require('./routeHandler/userHandler');

const app = express();
dotenv.config();
app.use(express.json());

// Database connect with mongos
mongoose.connect('mongodb://localhost/todo').then(
    () => {
        console.log('connect successfully');
    },
    (err) => {
        console.log(err);
    },
);

// Application route
app.use('/todo', todoHandler);
app.use('/user', userHandler);

// Default error handler
const errorHandler = (err, req, res, next) => {
    if (res.headerSent) {
        next(err);
    }
    res.status(500).json({ error: err });
};
app.use(errorHandler);

app.listen(3000, () => {});
