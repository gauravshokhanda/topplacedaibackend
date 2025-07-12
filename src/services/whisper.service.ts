import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const transcribeAudio = async (filePath: string): Promise<string> => {
  const form = new FormData();
  form.append("file", fs.createReadStream(path.resolve(filePath)));
  form.append("model", "whisper-1");
  form.append("language", "en");

  const headers = {
    ...form.getHeaders(),
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      form,
      { headers }
    );

    return response.data.text;
  } catch (error: any) {
    console.error("❌ Whisper transcription failed:", error?.response?.data || error);
    return "Could not transcribe audio.";
  }
};

export default transcribeAudio;
