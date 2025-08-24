import { 
  LoginResponse, Test, TestAttempt, TestAttemptResponse, User, Overview, 
  UserPerformance
} from './types';

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? '/api';

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('dtest_token') : null;
  const headers: Record<string,string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body.message || res.statusText);
  }
  return res.json();
}

// Auth
export const login = (email: string, password: string): Promise<LoginResponse> =>
  request<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });

// Tests
export const fetchNextTest = (level?: string): Promise<Test> =>
  request<Test>(`/tests/next${level ? `?level=${level}` : ''}`);

export const startTest = (id: string): Promise<Test> =>
  request<Test>(`/tests/${id}/start`);

export const submitAttempt = (testId: string, responses: { questionId: string; answer: string | boolean }[]): Promise<TestAttemptResponse> =>
  request<TestAttemptResponse>(`/attempts/${testId}/submit`, { method: 'POST', body: JSON.stringify({ responses }) });

export const getMyResults = (): Promise<TestAttempt[]> =>
  request<TestAttempt[]>('/attempts/me');

// Admin users
export const listUsers = (): Promise<User[]> => request<User[]>('/users');

export const createUser = (payload: Omit<User, '_id'>): Promise<User> =>
  request<User>('/users', { method: 'POST', body: JSON.stringify(payload) });

export const updateUser = (id:string, payload: Partial<User>): Promise<User> =>
  request<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const deleteUser = (id:string): Promise<{ success: boolean }> =>
  request<{ success: boolean }>(`/users/${id}`, { method: 'DELETE' });

// Admin tests
export const listTests = (): Promise<Test[]> => request<Test[]>('/tests');

export const createTest = (payload: Omit<Test, '_id'>): Promise<Test> =>
  request<Test>('/tests', { method: 'POST', body: JSON.stringify(payload) });

export const updateTest = (id:string, payload: Partial<Test>): Promise<Test> =>
  request<Test>(`/tests/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });

export const deleteTest = (id:string): Promise<{ success: boolean }> =>
  request<{ success: boolean }>(`/tests/${id}`, { method: 'DELETE' });

// Stats
export const getOverview = (): Promise<Overview> => request<Overview>('/stats/overview');

export const getUserPerformance = (userId: string): Promise<UserPerformance> =>
  request<UserPerformance>(`/stats/user/${userId}`);
