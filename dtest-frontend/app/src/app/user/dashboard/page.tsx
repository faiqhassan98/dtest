'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyResults, fetchNextTest} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Test, TestAttempt } from '@/lib/types';
import { Protected } from '@/components/protected';

export default function Dashboard() {
  const [results, setResults] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res: TestAttempt[] = await getMyResults();
      setResults(res);
    } finally {
      setLoading(false);
    }
  }

  async function start(level?: string) {
    const t: Test = await fetchNextTest(level);
    window.location.href = `/test?id=${t._id}`;
  }

  return (
    <Protected>
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Dashboard</h2>

        <div className="mb-4 flex gap-2">
          <Button onClick={() => start('A1')}>Start A1</Button>
          <Button onClick={() => start('A2')}>Start A2</Button>
          <Button onClick={() => start('B1')}>Start B1</Button>
          <Button onClick={() => start('B2')}>Start B2</Button>
        </div>

        <h3 className="text-lg font-medium">Previous Results</h3>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2 mt-3">
            {results.map((r) => (
              <li key={r._id} className="p-3 border rounded">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">Score: {r.score}%</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <Link href={`/user/test?attemptId=${r._id}`}>View</Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Protected>
  );
}
