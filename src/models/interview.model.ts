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
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IInterview>("Interview", InterviewSchema);
