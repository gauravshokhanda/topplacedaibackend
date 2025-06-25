import { Request, Response } from "express";
import Interview from "../models/interview.model";
import transcribeAudio from "../services/whisper.service";
import evaluateAnswer from "../services/gpt.service";
import axios from "axios";
import dotenv from "dotenv";

export const evaluateInterview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // console.log("✅ /evaluate route hit");
    console.log("📦 File received:", req.file);
    const filePath = req.file?.path;
    if (!filePath) {
      res.status(400).json({ error: "Audio file missing" });
      return;
    }

    const transcript = await transcribeAudio(filePath);
    const evaluation = await evaluateAnswer(transcript);
    console.log("Transcript:");
    console.log("Evaluation:", evaluation);
    await Interview.create({
      userId: req.body.userId || "guest", // Update as per auth logic
      transcript,
      evaluation,
    });

    res.json({ transcript, evaluation });
  } catch (error) {
    // console.error("Evaluation error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const testOpenAIConnection = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "Is the OpenAI API connection working?",
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      status: "success",
      message: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("❌ OpenAI connection test failed:", error);
    res.status(500).json({ error: "Failed to connect to OpenAI API" });
  }
};
