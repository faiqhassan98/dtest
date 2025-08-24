import mongoose, { Schema, Document, Types } from 'mongoose';

export type Level = 'A1' | 'A2' | 'B1' | 'B2';
export type QType = 'mcq' | 'tf';

export interface IQuestion {
  _id: Types.ObjectId;
  type: QType;
  text: string;
  options?: string[];
  correctAnswer: string | boolean;
}

export interface IPassage {
  _id: Types.ObjectId;
  text: string;
  questions: IQuestion[];
}

export interface IReadingTest extends Document {
  level: Level;
  passages: IPassage[];
  isPublished: boolean;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  type: { type: String, enum: ['mcq', 'tf'], required: true },
  text: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Schema.Types.Mixed, required: true },
}, { _id: true });

const PassageSchema = new Schema<IPassage>({
  text: { type: String, required: true, maxlength: 1800 },
  questions: { type: [QuestionSchema], default: [] },
}, { _id: true });

const ReadingTestSchema = new Schema<IReadingTest>({
  level: { type: String, enum: ['A1','A2','B1','B2'], required: true },
  passages: { type: [PassageSchema], validate: [(v: IPassage[]) => v.length === 2, 'Exactly 2 passages required'] },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

export const ReadingTest = mongoose.model<IReadingTest>('ReadingTest', ReadingTestSchema);
