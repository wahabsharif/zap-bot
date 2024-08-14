import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/yourdatabase";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cachedClient: mongoose.Mongoose | null = null;

const connectMongo = async () => {
  if (cachedClient) return cachedClient;

  try {
    const client = await mongoose.connect(MONGODB_URI, {});
    cachedClient = client;
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
};

export default connectMongo;
