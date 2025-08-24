import mongoose, { Schema } from 'mongoose';
const ResponseSchema = new Schema({
    questionId: { type: Schema.Types.ObjectId, required: true },
    answer: { type: Schema.Types.Mixed, required: true },
    correct: { type: Boolean, required: true },
});
const TestAttemptSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    testId: { type: Schema.Types.ObjectId, ref: 'ReadingTest', required: true },
    responses: { type: [ResponseSchema], default: [] },
    score: { type: Number, required: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: Date.now },
}, { timestamps: true });
export const TestAttempt = mongoose.model('TestAttempt', TestAttemptSchema);
