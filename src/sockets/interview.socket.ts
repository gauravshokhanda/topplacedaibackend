import { Server, Socket } from "socket.io";
import fs from "fs";
import path from "path";
import transcribeAudio from "../services/whisper.service";
import evaluateAnswer from "../services/gpt.service";
import { getNextQuestion } from "../utils/interviewFlow.util";
import { finalScoreFromAnswers } from "../utils/scorecard.util";
import { generateSpeech } from "../services/tts.service";

interface InterviewSession {
  step: number;
  field: string;
  level: string;
  answers: {
    question: string;
    transcript: string;
    evaluation: string;
  }[];
}

const sessionMap = new Map<string, InterviewSession>();

export const interviewSocketHandler = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`🔗 User connected: ${socket.id}`);

    socket.on("start_config", async ({ field, level }) => {
      sessionMap.set(socket.id, {
        step: 0,
        field,
        level,
        answers: [],
      });

      const introMessage = `👋 Great! Let’s begin your ${field} interview. Before we begin, please introduce yourself.`;
      const introVoice = await generateSpeech(introMessage, `${socket.id}-intro`);

      socket.emit("ai_message", {
        text: introMessage,
        audio_base64: introVoice,
      });
    });

 socket.on("audio_message", async ({ audioBuffer }) => {
  const session = sessionMap.get(socket.id);
  if (!session) {
    socket.emit("ai_message", { text: "❌ Interview session not initialized." });
    return;
  }

  try {
    const buffer = Buffer.from(audioBuffer, "base64");
    const audioPath = path.join(__dirname, `../../uploads/${socket.id}-${Date.now()}.webm`);
    fs.writeFileSync(audioPath, buffer);

    const transcript = await transcribeAudio(audioPath);
    const evaluation = await evaluateAnswer(transcript);

    const isIntro = session.step === 0;
    const currentQuestion = isIntro
      ? "Please introduce yourself."
      : getNextQuestion(session.field, session.level, session.step - 1) ?? "No question available.";

    session.answers.push({
      question: currentQuestion,
      transcript,
      evaluation: evaluation.evaluation || "",
    });

    socket.emit("ai_feedback", { transcript, evaluation });

    session.step++; // Increase step here, but DO NOT send next question yet

    // ✅ Now decide what to do next
    if (isIntro) {
      // Just wait — no question yet
    } else {
      const nextQ = getNextQuestion(session.field, session.level, session.step - 1);
      if (nextQ) {
        const nextAudio = await generateSpeech(nextQ, `${socket.id}-q${session.step}`);
        socket.emit("ai_message", { text: nextQ, audio_base64: nextAudio });
      } else {
        const finalScore = await finalScoreFromAnswers(session.answers);

        const endMsg = "🎉 That's the end of your interview!";
        const scoreMsg = `📊 Final Scorecard:\n${JSON.stringify(finalScore, null, 2)}`;

        socket.emit("ai_message", {
          text: endMsg,
          audio_base64: await generateSpeech(endMsg, `${socket.id}-end`),
        });

        socket.emit("ai_message", {
          text: scoreMsg,
          audio_base64: await generateSpeech("Here is your final scorecard.", `${socket.id}-scorecard`),
        });

        sessionMap.delete(socket.id);
      }
    }
  } catch (err) {
    console.error("❌ Error:", err);
    socket.emit("ai_message", { text: "❌ Something went wrong while processing your voice." });
  }
});
;

    socket.on("disconnect", () => {
      sessionMap.delete(socket.id);
      console.log(`❌ Disconnected: ${socket.id}`);
    });
  });
};
