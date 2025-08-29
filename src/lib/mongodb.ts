// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    console.log("Using existing MongoDB connection");
    return cached.conn;
  }

  // Create new connection if not already in progress
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    console.log("Connecting to MongoDB...");

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ MongoDB connected successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
        cached.promise = null; // Reset promise on error
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export default connectDB;
