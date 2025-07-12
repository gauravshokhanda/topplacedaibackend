import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function evaluateAnswer(transcript: string) {
  const prompt = `
You are an AI interviewer assistant.

Given the following candidate introduction:
"${transcript}"

1. Extract the candidate's **name** (if any).
2. Extract total **experience** (in years, if mentioned).
3. Summarize their work background briefly.
4. Then, evaluate their introduction in terms of:
   - Clarity
   - Correctness
   - Depth

Format your response like this JSON:

{
  "name": "Gaurav",
  "experience": "4 years",
  "summary": "Full-time developer at Leapfrog, worked on real estate and dashboard projects.",
  "evaluation": "Your intro was clear and informative, though more specific details would help..."
}
`;

  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful and precise AI evaluator." },
      { role: "user", content: prompt },
    ],
  });

  const raw = chatResponse.choices[0]?.message?.content || "{}";
  return JSON.parse(raw);
}
