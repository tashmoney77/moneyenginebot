export interface User {
  id: string;
  email: string;
  name: string;
  role: 'founder' | 'admin';
  tier: 'free' | 'pro' | 'premium';
  questionsAnswered: number;
  experimentsCreated: number;
  joinedAt: string;
  summary?: string;
  summaryDate?: string;
  lastLoginDate?: string;
  dailyLogins?: { date: string; count: number }[];
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot' | 'admin';
  timestamp: string;
  type?: 'question' | 'response' | 'summary' | 'suggestion';
}

export interface Experiment {
  id: string;
  userId: string;
  title: string;
  description: string;
  hypothesis: string;
  status: 'planning' | 'running' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  metrics: {
    name: string;
    value: number;
    target: number;
    unit: string;
  }[];
  createdAt: string;
}

export interface AdminInsight {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface KPI {
  name: string;
  value: number;
  change: number;
  unit: string;
  color: string;
}