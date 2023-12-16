const mongoose = require('mongoose');
require('dotenv').config()

const dbUrl = process.env.DATABASE_URL;

const connectToDatabase = () => {
    mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
        console.log('Connected to the database');
    });
}

const closeDatabaseConnection = () => {
    mongoose.connection.close(() => {
        console.log('Database connection closed');
    });
};

module.exports = {
    connectToDatabase,
    closeDatabaseConnection,
};