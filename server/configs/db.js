import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not set. Add it to server/.env");
    }

    mongoose.connection.on('connected', () => console.log('Database connected'))

    try {
        // dbName keeps using the same "quickshow" database, and works even if the
        // URI has query parameters (the old `${uri}/quickshow` concatenation did not).
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'quickshow',
            serverSelectionTimeoutMS: 10000,
        })
    } catch (error) {
        console.error('Database connection failed:', error.message);
        // Never keep the API running without a database
        throw error;
    }
}

export default connectDB;