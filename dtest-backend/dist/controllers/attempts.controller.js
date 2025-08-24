import { ReadingTest } from '../models/ReadingTest.js';
import { TestAttempt } from '../models/TestAttempt.js';
import { Types } from 'mongoose';
export async function submitAttempt(req, res) {
    const { id } = req.params; // testId
    const { responses } = req.body;
    const userId = req.user.id;
    const test = await ReadingTest.findById(id).lean();
    if (!test)
        return res.status(404).json({ message: 'Test not found' });
    const map = new Map();
    for (const p of test.passages) {
        for (const q of p.questions) {
            map.set(String(q._id), q.correctAnswer);
        }
    }
    let correct = 0;
    const evaluated = responses.map(r => {
        const correctAnswer = map.get(r.questionId);
        const isCorrect = correctAnswer === r.answer;
        if (isCorrect)
            correct++;
        return { questionId: new Types.ObjectId(r.questionId), answer: r.answer, correct: isCorrect };
    });
    const total = map.size || 1;
    const score = Math.round((correct / total) * 100);
    const attempt = await TestAttempt.create({
        userId: new Types.ObjectId(userId),
        testId: new Types.ObjectId(id),
        responses: evaluated,
        score
    });
    res.json({ score, attemptId: attempt._id });
}
export async function myResults(req, res) {
    const userId = req.user.id;
    const results = await TestAttempt.find({ userId }).sort({ createdAt: -1 });
    res.json(results);
}
