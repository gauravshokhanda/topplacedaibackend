import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db";
import app from "./src/app";

dotenv.config();
// const app = express();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
app.get("/", (req, res) => {
  res.send("backend is running");
});
