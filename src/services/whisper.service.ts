import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import path from "path";
import dotenv from "dotenv";
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from "fluent-ffmpeg";

dotenv.config();

// Set ffmpeg binary path
ffmpeg.setFfmpegPath(ffmpegPath.path);

const transcribeAudio = async (filePath: string): Promise<string> => {
  const fixedPath = filePath.replace(/(\.\w+)?$/, "_fixed.mp3");

  // Convert the audio to proper mp3 format
  await new Promise((resolve, reject) => {
    ffmpeg(filePath)
      .audioCodec("libmp3lame")
      .audioBitrate(128)
      .audioFrequency(44100)
      .toFormat("mp3")
      .on("end", () => resolve(true))
      .on("error", (err) => reject(err))
      .save(fixedPath);
  });

  const formData = new FormData();
  formData.append("file", fs.createReadStream(fixedPath));
  formData.append("model", "whisper-1");

  const response = await axios.post("https://api.openai.com/v1/audio/transcriptions", formData, {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  });

  // Clean up fixed file
  fs.unlinkSync(fixedPath);

  return response.data.text;
};

export default transcribeAudio;
