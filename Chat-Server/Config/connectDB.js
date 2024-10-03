const mongoose = require('mongoose');

async function connectDB() {
    try {
        //  MongoDB URL is loaded
        // console.log("MongoDB URL:", process.env.MONGODB_URL);
        
        // Attempt to connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URL);

        // Get the connection instance
        const connection = mongoose.connection;
        
        // Debugging the connection object
        // console.log("Value of connection:", connection);

        connection.on('connected', () => {
            console.log('Connected to MongoDB');
        });

        connection.on('error', (err) => {
            console.error('Error connecting', err);
        });

        connection.on('disconnected', () => {
            console.log('MongoDB connection disconnected');
        });

        if (connection.readyState === 1) {
            console.log("Mongoose connection is open.");
        } else {
            console.log("Mongoose connection is not open.");
        }

    } catch (error) {
        console.error("Something went wrong with Mongo", error);
    }
}

module.exports = connectDB;
