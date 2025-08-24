import { ReadingTest } from "../models/ReadingTest.js";
export async function createTest(req, res) {
    const { level, passages, isPublished } = req.body;
    const test = await ReadingTest.create({ level, passages, isPublished });
    res.status(201).json({ id: test._id });
}
export async function listTests(_req, res) {
    const tests = await ReadingTest.find().lean();
    const mapped = tests.map((t) => ({
        ...t,
        totalQuestions: (t.passages || []).reduce((s, p) => s + (p.questions?.length || 0), 0),
    }));
    res.json(mapped);
}
export async function getTest(req, res) {
    const { id } = req.params;
    const test = await ReadingTest.findById(id);
    if (!test)
        return res.status(404).json({ message: "Not found" });
    res.json(test);
}
export async function updateTest(req, res) {
    const { id } = req.params;
    const { level, passages, isPublished } = req.body;
    const test = await ReadingTest.findByIdAndUpdate(id, { level, passages, isPublished }, { new: true });
    if (!test)
        return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated" });
}
export async function deleteTest(req, res) {
    const { id } = req.params;
    await ReadingTest.findByIdAndDelete(id);
    res.json({ message: "Deleted" });
}
export async function nextTest(req, res) {
    const { level } = req.query;
    const filter = { isPublished: true };
    if (level)
        filter.level = level;
    const tests = await ReadingTest.aggregate([
        { $match: filter },
        { $sample: { size: 1 } },
    ]);
    if (!tests.length)
        return res.status(404).json({ message: "No tests available" });
    res.json(tests[0]);
}
// New: return a sanitized test for a user (no correct answers)
export async function startTest(req, res) {
    const { id } = req.params;
    const test = await ReadingTest.findById(id).lean();
    if (!test)
        return res.status(404).json({ message: "Test not found" });
    // sanitize questions - remove correctAnswer
    const sanitized = {
        _id: test._id,
        level: test.level,
        passages: test.passages.map((p) => ({
            _id: p._id,
            text: p.text,
            questions: (p.questions || []).map((q) => ({
                _id: q._id,
                type: q.type,
                text: q.text,
                options: q.options || undefined,
            })),
        })),
    };
    res.json(sanitized);
}
