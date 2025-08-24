'use client';

import { useEffect, useState } from 'react';
import { getOverview } from '@/lib/api';

interface Overview {
  reading: {
    totalAttempts: number;
    avgScore: number;
  };
  users: {
    totalUsers: number;
    totalLogins: number;
  };
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const data: Overview = await getOverview();
    setOverview(data);
  }

  if (!overview) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Admin — Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <div className="text-sm text-muted-foreground">Reading Attempts</div>
          <div className="text-2xl font-bold">{overview.reading.totalAttempts}</div>
          <div className="text-sm">Avg score: {overview.reading.avgScore}%</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-muted-foreground">Users</div>
          <div className="text-2xl font-bold">{overview.users.totalUsers}</div>
          <div className="text-sm">Total logins: {overview.users.totalLogins}</div>
        </div>
      </div>
    </div>
  );
}