import express from "express";
import cors from "cors";
import morgan from "morgan";
import interviewRoutes from "./routes/interview.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use("/api/interview", interviewRoutes);

export default app;
