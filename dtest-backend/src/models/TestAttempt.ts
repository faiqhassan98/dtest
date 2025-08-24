import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResponse {
  questionId: Types.ObjectId;
  answer: string | boolean;
  correct: boolean;
}

export interface ITestAttempt extends Document {
  userId: Types.ObjectId;
  testId: Types.ObjectId;
  responses: IResponse[];
  score: number;
  startedAt: Date;
  completedAt: Date;
}

const ResponseSchema = new Schema<IResponse>({
  questionId: { type: Schema.Types.ObjectId, required: true },
  answer: { type: Schema.Types.Mixed, required: true },
  correct: { type: Boolean, required: true },
});

const TestAttemptSchema = new Schema<ITestAttempt>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: Schema.Types.ObjectId, ref: 'ReadingTest', required: true },
  responses: { type: [ResponseSchema], default: [] },
  score: { type: Number, required: true },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const TestAttempt = mongoose.model<ITestAttempt>('TestAttempt', TestAttemptSchema);
