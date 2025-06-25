import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const transcribeAudio = async (filePath: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", fs.createReadStream(filePath));
  formData.append("model", "whisper-1");

  const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  });

  return response.data.text;
};

export default transcribeAudio;