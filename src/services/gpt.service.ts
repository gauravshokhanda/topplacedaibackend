import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const evaluateAnswer = async (transcript: string): Promise<string> => {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Evaluate the candidate’s answer for clarity, correctness, and depth.",
        },
        {
          role: "user",
          content: transcript,
        },
      ],
      temperature: 0.7,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  return response.data.choices[0].message.content;
};

export default evaluateAnswer;
