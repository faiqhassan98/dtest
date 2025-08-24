// src/lib/types.ts
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface TestQuestion {
  _id: string;
  type: 'mcq' | 'tf';
  text: string;
  options?: string[];
  correctAnswer?: string | boolean;
}

export interface TestPassage {
  _id: string;
  text: string;
  questions: TestQuestion[];
}

export interface Test {
  _id: string;
  level: string;
  passages: TestPassage[];
}

export interface TestAttemptResponse {
  score: number;
}

export interface TestAttempt {
  _id: string;
  score: number;
  createdAt: string;
  testId?: string;
}

export interface Overview {
  reading: { totalAttempts: number; avgScore: number; };
  users: { totalUsers: number; totalLogins: number; };
}

export interface UserPerformance {
  totalTests: number;
  avgScore: number;
  // add other fields returned by your backend
}