import mongoose, { Schema } from 'mongoose';
const QuestionSchema = new Schema({
    type: { type: String, enum: ['mcq', 'tf'], required: true },
    text: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed, required: true },
}, { _id: true });
const PassageSchema = new Schema({
    text: { type: String, required: true, maxlength: 1800 },
    questions: { type: [QuestionSchema], default: [] },
}, { _id: true });
const ReadingTestSchema = new Schema({
    level: { type: String, enum: ['A1', 'A2', 'B1', 'B2'], required: true },
    passages: { type: [PassageSchema], validate: [(v) => v.length === 2, 'Exactly 2 passages required'] },
    isPublished: { type: Boolean, default: true },
}, { timestamps: true });
export const ReadingTest = mongoose.model('ReadingTest', ReadingTestSchema);
