const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getResponse(prompt) {
    const result = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }]
    });
    return result.choices[0].message.content.trim();
}

module.exports = getResponse;
