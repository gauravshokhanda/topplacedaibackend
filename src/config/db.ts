import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log("✅ MongoDB Connected to:", conn.connection.name);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ MongoDB connection error:", error.message);
    } else {
      console.error("❌ MongoDB connection error:", error);
    }
    process.exit(1);
  }
};

export default connectDB;
