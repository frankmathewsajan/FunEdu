// Prisma model types based on schema
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  class?: string | null;
  contact?: string | null;
  organization?: string | null;
  avatar?: string | null;
  profilePicture?: string | null;
  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  passwordResetToken?: string | null;
  resetPasswordToken?: string | null;
  passwordResetTokenExpiry?: Date | null;
  refreshTokens?: string[];
  role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  id: string;
  userId: string;
  totalLectures: number;
  completedLectures: number;
  totalPoints: number;
  currentLevel: number;
  pointsToNextLevel: number;
  streakDays: number;
  lastActivityDate: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  thumbnail?: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  points: number;
  duration: number;
  videoUrl?: string | null;
  attachments?: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  isCompleted?: boolean;
  completedAt?: Date | null;
  lastAccessed: Date | null;
  enrolledAt: Date;
}

export interface Activity {
  id: string;
  userId: string;
  lessonId?: string | null;
  type: 'LESSON' | 'QUIZ' | 'ASSIGNMENT' | 'GAME' | 'PROJECT' | 'READING' | 'VIDEO' | 'EXERCISE';
  title: string;
  description?: string | null;
  points: number;
  isCompleted: boolean;
  completedAt?: Date | null;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt: Date;
  createdAt?: Date;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  maxPoints: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameScore {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  points: number;
  playedAt: Date;
}