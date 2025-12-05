import mongoose from "mongoose";
import {ENV} from "./env.js"

export const connectDB = async () => {
    try{
        if(!ENV.DB_URL){
            throw new Error("Please provide DB_URL in the environment variables")
        }
        const conn = await mongoose.connect(ENV.DB_URL)
        console.log("Connected to MongoDB", conn.connection.host)

    }

    catch (error){
        console.error("MongoDB connection error", error)
        process.exit(1)

    }
};
