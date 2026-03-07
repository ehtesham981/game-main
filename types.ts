
export type TaskType = 'YouTube' | 'Websites' | 'Apps' | 'Social Media' | 'Content Writing' | 'Graphics Designing' | 'Blog Development' | 'SEO';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  reward: number;
  description: string;
  creatorId: string;
  totalWorkers: number;
  completedCount: number;
  status: 'active' | 'completed' | 'pending' | 'rejected';
  link?: string;
  dueDate?: string;
  createdAt?: string;
  requiredScreenshots?: number; // 1 or 2 screenshots required
}

export interface User {
  id: string;
  username: string; // Used as Full Name
  lastName?: string;
  nickName?: string;
  email: string;
  city?: string;
  country?: string;
  balance: number;
  depositBalance: number;
  completedTasks: string[];
  createdTasks: string[];
  claimedReferrals?: string[];
  isLoggedIn: boolean;
  isAdmin?: boolean;
  lastSpinTimestamp?: number;
  lastMathTimestamp?: number;
  dailySpinsCount?: number;
  status?: 'active' | 'banned';
  referredBy?: string;
  currentSessionId?: string;
  advertiseId?: string;
  freelanceId?: string;
  lastWeeklyBonusClaim?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  taskId?: string;
  username?: string;
  amount: number;
  type: 'deposit' | 'withdraw' | 'earn' | 'spend' | 'spin' | 'referral_claim' | 'math_reward' | 'weekly_bonus';
  method?: string;
  account?: string;
  proofImage?: string;
  proofImage2?: string; // Support for dual-verification
  message?: string; // User message/comment
  status: 'pending' | 'success' | 'failed';
  date: string;
}

export interface SEOConfig {
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
}
