const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.mongo_url,{});

const connection = mongoose.connection;
connection.on('connected', () => {
    console.log('MongoDB connection established successfully');
});

