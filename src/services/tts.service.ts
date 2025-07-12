import fs from "fs";
import path from "path";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const VOICE_ID = process.env.ELEVEN_LABS_VOICE_ID || "EXAVITQu4vr4xnSDxMaL"; // Default voice

export const generateSpeech = async (text: string, fileLabel: string): Promise<string> => {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const outputFile = path.join(__dirname, `../../public/${fileLabel}.mp3`);

  try {
    const response = await axios.post(
      url,
      {
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        responseType: "arraybuffer",
        headers: {
          "xi-api-key": ELEVEN_LABS_API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
      }
    );

    // Save to file
    fs.writeFileSync(outputFile, Buffer.from(response.data));

    // Convert to base64
    const audioBuffer = fs.readFileSync(outputFile);
    const base64Audio = `data:audio/mpeg;base64,${audioBuffer.toString("base64")}`;

    return base64Audio;
  } catch (error) {
    console.error("🛑 TTS generation failed:", error);
    return ""; // Or return a fallback base64 sound
  }
};
