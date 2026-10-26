import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: Number(process.env.MONGO_CONNECT_TIMEOUT_MS || 10000),
  });

  console.log("MongoDB connected successfully");
};

export default connectDB;