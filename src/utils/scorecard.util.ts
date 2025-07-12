import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const finalScoreFromAnswers = async (
  answers: { question: string; transcript: string; evaluation: string }[]
): Promise<any> => {
  const prompt = `
You are a strict interviewer. Evaluate the candidate's full interview session and provide a final score (1–10) for:
- Confidence
- Clarity
- Relevance

Here is the transcript and evaluation of each answer:

${answers.map(
  (a, i) =>
    `Q${i + 1}: ${a.question}\nAnswer: ${a.transcript}\nEvaluation: ${a.evaluation}\n`
).join("\n")}

Return JSON like:
{
  "confidence": 1-10,
  "clarity": 1-10,
  "relevance": 1-10
}
`;

  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a strict technical interviewer." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const raw = res.data.choices[0].message.content;
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch (err) {
    console.error("❌ Failed to generate final score:", err);
    return { confidence: 0, clarity: 0, relevance: 0 };
  }
};
