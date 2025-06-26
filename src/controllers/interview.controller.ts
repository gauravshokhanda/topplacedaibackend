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
    const filePath = req.file?.path;
    if (!filePath) {
      res.status(400).json({ error: "Audio file missing" });
      return;
    }

    const transcript = await transcribeAudio(filePath);
    const evaluation = await evaluateAnswer(transcript);

    // ⭐ NEW: Scorecard prompt for evaluating AI response
    const scorePrompt = `
Rate the following AI response on a scale of 1 to 10 for the following parameters:

1. Confidence
2. Clarity
3. Relevance

Response:
"${evaluation}"

Return the result in this JSON format:
{
  "confidence": <1-10>,
  "clarity": <1-10>,
  "relevance": <1-10>
}
`;

    // 🧠 GPT call to score the evaluation
    const scoreResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a strict evaluator scoring AI responses.",
          },
          { role: "user", content: scorePrompt },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let scorecard = {};
    try {
      const raw = scoreResponse.data.choices[0].message.content;
      const cleaned = raw.replace(/```json|```/g, "").trim();
      scorecard = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ Failed to parse scorecard:", err);
    }

    // Save in DB
    await Interview.create({
      userId: req.body.userId || "guest",
      transcript,
      evaluation,
      scorecard,
      audioPath: filePath,
    });

    res.json({ transcript, evaluation, scorecard });
  } catch (error) {
    console.error("Evaluation error:", error);
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
