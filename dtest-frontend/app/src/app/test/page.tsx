"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { startTest, submitAttempt } from "@/lib/api";
import {
  Test,
  TestQuestion,
  TestPassage,
  TestAttemptResponse,
} from "@/lib/types";

interface Response {
  questionId: string;
  answer: string | boolean;
}

// Child component that uses useSearchParams
function TestContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});

  useEffect(() => {
    setId(sp.get("id"));
    setAttemptId(sp.get("attemptId"));
  }, [sp]);

  useEffect(() => {
    if (id) load(id);
    if (attemptId) {
      // Optionally fetch previous attempt result
    }
  }, [id, attemptId]);

  async function load(testId: string) {
    const t: Test = await startTest(testId);
    setTest(t);
  }

  async function submit() {
    if (!test) return;
    const responses: Response[] = Object.keys(answers).map((qid) => ({
      questionId: qid,
      answer: answers[qid],
    }));
    const res: TestAttemptResponse = await submitAttempt(test._id, responses);
    alert(`Score: ${res.score}%`);
    router.push("/user/dashboard");
  }

  if (!test) return <div>Loading test...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Reading Test ({test.level})
      </h2>
      {test.passages.map((p: TestPassage) => (
        <div key={p._id} className="mb-6">
          <div className="mb-2 p-4 border rounded bg-white">{p.text}</div>
          <div className="space-y-3 mt-2">
            {p.questions.map((q: TestQuestion) => (
              <div key={q._id} className="p-3 border rounded">
                <div className="font-medium">{q.text}</div>

                {q.type === "mcq" &&
                  (q.options || []).map((opt) => (
                    <label key={opt} className="block">
                      <input
                        type="radio"
                        name={q._id}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q._id]: opt }))
                        }
                      />{" "}
                      {opt}
                    </label>
                  ))}

                {q.type === "tf" && (
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={q._id}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q._id]: true }))
                        }
                      />{" "}
                      True
                    </label>
                    <label className="ml-4">
                      <input
                        type="radio"
                        name={q._id}
                        onChange={() =>
                          setAnswers((prev) => ({ ...prev, [q._id]: false }))
                        }
                      />{" "}
                      False
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button onClick={submit}>Submit</Button>
    </div>
  );
}

// Main page component
export default function TestPage() {
  return (
    <Suspense fallback={<div>Loading test page...</div>}>
      <TestContent />
    </Suspense>
  );
}