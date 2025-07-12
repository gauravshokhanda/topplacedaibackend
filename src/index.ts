import express, { Request, Response } from "express";
import http from "http";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import { initSocket } from "./config/socket";
import { interviewSocketHandler } from "./sockets/interview.socket";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, "..", "public")));

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("✅ Backend + WebSocket is running");
});

// Start HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initSocket(server);
interviewSocketHandler(io);

// Connect DB and start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
