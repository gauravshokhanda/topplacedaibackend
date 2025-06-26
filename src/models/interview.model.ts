import mongoose, { Document, Schema } from "mongoose";

export interface IInterview extends Document {
  userId: string;
  transcript: string;
  evaluation: string;
  createdAt: Date;
}

const InterviewSchema: Schema = new Schema({
  userId: { type: String, required: true },
  transcript: { type: String, required: true },
  evaluation: { type: String, required: true },
  scorecard: {
    confidence: { type: Number, default: 0 },
    clarity: { type: Number, default: 0 },
    relevance: { type: Number, default: 0 },
  },
  audioPath: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IInterview>("Interview", InterviewSchema);
