export type UserRole = 'admin' | 'student';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  profession?: string;
  national_id?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  duration_hours: number;
  category: string;
  target_audience: string;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  order_index: number;
  created_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content_markdown: string;
  video_url?: string;
  order_index: number;
  duration_minutes: number;
  created_at: string;
  is_completed?: boolean;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  status: 'in_progress' | 'completed';
  enrolled_at: string;
  completed_at?: string | null;
  course?: Course;
  progress_percentage?: number;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  updated_at: string;
}

export interface Quiz {
  id: string;
  course_id: string;
  title: string;
  passing_score: number; // e.g. 75 or 80 (%)
  created_at: string;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
  explanation?: string;
  order_index: number;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  passed: boolean;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  certificate_code: string;
  issued_at: string;
  verification_url: string;
  profile?: Profile;
  course?: Course;
}
