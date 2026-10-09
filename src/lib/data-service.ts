import { createClient } from './supabase/client';
import {
  INITIAL_COURSES,
  INITIAL_MODULES,
  INITIAL_LESSONS,
  INITIAL_QUIZZES,
  INITIAL_ENROLLMENTS,
  INITIAL_CERTIFICATES,
  INITIAL_PROFILES,
} from './mock-data';
import { Course, Module, Lesson, Quiz, Certificate, Enrollment, Profile, QuizAttempt } from './types';

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && !url.includes('placeholder') && !key.includes('placeholder'));
}

// Key for client-side storage persistence in demo mode
const STORAGE_KEYS = {
  COURSES: 'aulavirtual_courses',
  MODULES: 'aulavirtual_modules',
  LESSONS: 'aulavirtual_lessons',
  PROGRESS: 'aulavirtual_progress',
  ENROLLMENTS: 'aulavirtual_enrollments',
  CERTIFICATES: 'aulavirtual_certificates',
  ATTEMPTS: 'aulavirtual_quiz_attempts',
  QUIZZES: 'aulavirtual_quizzes',
};

function getLocalItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error saving to localStorage', err);
  }
}

export const DataService = {
  // COURSES
  async getCourses(): Promise<Course[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) return data as Course[];
      } catch (e) {
        console.warn('Fallback to local courses', e);
      }
    }
    return getLocalItem<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  },

  async getCourseBySlug(slug: string): Promise<Course | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('slug', slug)
          .single();

        if (!error && data) return data as Course;
      } catch (e) {
        console.warn('Fallback to local course slug', e);
      }
    }
    const courses = await this.getCourses();
    return courses.find((c) => c.slug === slug) || null;
  },

  async createCourse(course: Omit<Course, 'id' | 'created_at'>): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: 'course-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('courses')
          .insert([course])
          .select()
          .single();
        if (!error && data) return data as Course;
      } catch (e) {
        console.warn('Fallback saving course to local', e);
      }
    }

    const current = await this.getCourses();
    const updated = [newCourse, ...current];
    setLocalItem(STORAGE_KEYS.COURSES, updated);
    return newCourse;
  },

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('courses')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as Course;
      } catch (e) {
        console.warn('Fallback updating course in local', e);
      }
    }

    const current = await this.getCourses();
    const index = current.findIndex((c) => c.id === id);
    if (index === -1) return null;
    current[index] = { ...current[index], ...updates };
    setLocalItem(STORAGE_KEYS.COURSES, current);
    return current[index];
  },

  // MODULES & LESSONS
  async getCourseModulesWithLessons(courseId: string): Promise<Module[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('modules')
          .select('*, lessons(*)')
          .eq('course_id', courseId)
          .order('order_index', { ascending: true });

        if (!error && data && data.length > 0) {
          // Sort lessons within modules
          return data.map((mod: any) => ({
            ...mod,
            lessons: (mod.lessons || []).sort((a: Lesson, b: Lesson) => a.order_index - b.order_index),
          })) as Module[];
        }
      } catch (e) {
        console.warn('Fallback to local modules', e);
      }
    }

    const modules = INITIAL_MODULES[courseId] || [];
    return modules.map((m) => ({
      ...m,
      lessons: INITIAL_LESSONS[m.id] || [],
    }));
  },

  async getLessonById(lessonId: string): Promise<Lesson | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single();
        if (!error && data) return data as Lesson;
      } catch (e) {
        console.warn('Fallback to local lesson', e);
      }
    }

    // Search across all mock lessons
    for (const key of Object.keys(INITIAL_LESSONS)) {
      const found = INITIAL_LESSONS[key].find((l) => l.id === lessonId);
      if (found) return found;
    }
    return null;
  },

  // LESSON PROGRESS
  async getLessonProgress(userId: string, courseId: string): Promise<Record<string, boolean>> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('lesson_progress')
          .select('lesson_id, is_completed')
          .eq('user_id', userId);

        if (!error && data) {
          const map: Record<string, boolean> = {};
          data.forEach((p: any) => {
            map[p.lesson_id] = p.is_completed;
          });
          return map;
        }
      } catch (e) {
        console.warn('Fallback to local lesson progress', e);
      }
    }

    const allProgress = getLocalItem<Record<string, Record<string, boolean>>>(STORAGE_KEYS.PROGRESS, {
      'user-student-1': {
        'les-t1-1': true,
        'les-t1-2': true,
      },
    });

    return allProgress[userId] || {};
  },

  async markLessonProgress(userId: string, lessonId: string, isCompleted: boolean): Promise<boolean> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('lesson_progress')
          .upsert({
            user_id: userId,
            lesson_id: lessonId,
            is_completed: isCompleted,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,lesson_id' });
        if (!error) return true;
      } catch (e) {
        console.warn('Fallback saving lesson progress to local', e);
      }
    }

    const allProgress = getLocalItem<Record<string, Record<string, boolean>>>(STORAGE_KEYS.PROGRESS, {});
    if (!allProgress[userId]) {
      allProgress[userId] = {};
    }
    allProgress[userId][lessonId] = isCompleted;
    setLocalItem(STORAGE_KEYS.PROGRESS, allProgress);
    return true;
  },

  // ENROLLMENTS
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('enrollments')
          .select('*, courses(*)')
          .eq('user_id', userId);

        if (!error && data) {
          return data.map((d: any) => ({
            ...d,
            course: d.courses,
          })) as Enrollment[];
        }
      } catch (e) {
        console.warn('Fallback to local enrollments', e);
      }
    }

    const enrollments = getLocalItem<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    const userEnrollments = enrollments.filter((e) => e.user_id === userId);
    const courses = await this.getCourses();

    return userEnrollments.map((e) => ({
      ...e,
      course: courses.find((c) => c.id === e.course_id),
    }));
  },

  async enrollInCourse(userId: string, courseId: string): Promise<Enrollment> {
    const newEnrollment: Enrollment = {
      id: 'enr-' + Date.now(),
      user_id: userId,
      course_id: courseId,
      status: 'in_progress',
      enrolled_at: new Date().toISOString(),
      progress_percentage: 0,
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('enrollments')
          .insert([
            {
              user_id: userId,
              course_id: courseId,
              status: 'in_progress',
            },
          ])
          .select()
          .single();
        if (!error && data) return data as Enrollment;
      } catch (e) {
        console.warn('Fallback saving enrollment locally', e);
      }
    }

    const current = getLocalItem<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    const exists = current.find((e) => e.user_id === userId && e.course_id === courseId);
    if (exists) return exists;

    const updated = [newEnrollment, ...current];
    setLocalItem(STORAGE_KEYS.ENROLLMENTS, updated);
    return newEnrollment;
  },

  // QUIZ & QUESTIONS
  async getQuizByCourseId(courseId: string): Promise<Quiz | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data: quizData, error: quizError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('course_id', courseId)
          .single();

        if (!quizError && quizData) {
          const { data: questions } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('quiz_id', quizData.id)
            .order('order_index', { ascending: true });

          return {
            ...quizData,
            questions: questions || [],
          } as Quiz;
        }
      } catch (e) {
        console.warn('Fallback to local quiz', e);
      }
    }

    const localQuizzes = getLocalItem<Record<string, Quiz>>(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    return localQuizzes[courseId] || null;
  },

  async saveQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'created_at'>): Promise<QuizAttempt> {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: 'att-' + Date.now(),
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('quiz_attempts')
          .insert([attempt])
          .select()
          .single();
        if (!error && data) return data as QuizAttempt;
      } catch (e) {
        console.warn('Fallback saving quiz attempt locally', e);
      }
    }

    const attempts = getLocalItem<QuizAttempt[]>(STORAGE_KEYS.ATTEMPTS, []);
    setLocalItem(STORAGE_KEYS.ATTEMPTS, [newAttempt, ...attempts]);
    return newAttempt;
  },

  // CERTIFICATES
  async getCertificateByCode(code: string): Promise<Certificate | null> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('certificates')
          .select('*, profiles(*), courses(*)')
          .eq('certificate_code', code)
          .single();

        if (!error && data) {
          return {
            ...data,
            profile: data.profiles,
            course: data.courses,
          } as Certificate;
        }
      } catch (e) {
        console.warn('Fallback getting cert by code', e);
      }
    }

    const certs = getLocalItem<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    return certs.find((c) => c.certificate_code.toUpperCase() === code.toUpperCase()) || null;
  },

  async getUserCertificates(userId: string): Promise<Certificate[]> {
    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('certificates')
          .select('*, profiles(*), courses(*)')
          .eq('user_id', userId);

        if (!error && data) {
          return data.map((d: any) => ({
            ...d,
            profile: d.profiles,
            course: d.courses,
          })) as Certificate[];
        }
      } catch (e) {
        console.warn('Fallback getting user certs', e);
      }
    }

    const certs = getLocalItem<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    return certs.filter((c) => c.user_id === userId);
  },

  async issueCertificate(userId: string, courseId: string, profile: Profile, course: Course): Promise<Certificate> {
    // Generate unique verifiable medical certificate code: MED-YYYY-XXXXXX
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `MED-${new Date().getFullYear()}-${randomCode}`;
    const verificationUrl = `/verify/${code}`;

    const newCert: Certificate = {
      id: 'cert-' + Date.now(),
      user_id: userId,
      course_id: courseId,
      certificate_code: code,
      issued_at: new Date().toISOString(),
      verification_url: verificationUrl,
      profile,
      course,
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('certificates')
          .insert([
            {
              user_id: userId,
              course_id: courseId,
              certificate_code: code,
              verification_url: verificationUrl,
            },
          ])
          .select()
          .single();

        if (!error && data) {
          // Mark enrollment as completed
          await supabase
            .from('enrollments')
            .update({ status: 'completed', completed_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('course_id', courseId);

          return { ...newCert, id: data.id };
        }
      } catch (e) {
        console.warn('Fallback issuing certificate locally', e);
      }
    }

    // Local storage persistence
    const certs = getLocalItem<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const existing = certs.find((c) => c.user_id === userId && c.course_id === courseId);
    if (existing) return existing;

    const updated = [newCert, ...certs];
    setLocalItem(STORAGE_KEYS.CERTIFICATES, updated);

    // Update enrollment status to completed
    const enrollments = getLocalItem<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    const enrIndex = enrollments.findIndex((e) => e.user_id === userId && e.course_id === courseId);
    if (enrIndex !== -1) {
      enrollments[enrIndex].status = 'completed';
      enrollments[enrIndex].completed_at = new Date().toISOString();
      enrollments[enrIndex].progress_percentage = 100;
      setLocalItem(STORAGE_KEYS.ENROLLMENTS, enrollments);
    }

    return newCert;
  },

  // ALL ADMIN METRICS
  async getAdminMetrics() {
    const courses = await this.getCourses();
    const certs = getLocalItem<Certificate[]>(STORAGE_KEYS.CERTIFICATES, INITIAL_CERTIFICATES);
    const enrollments = getLocalItem<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    const students = INITIAL_PROFILES.filter((p) => p.role === 'student');

    return {
      totalCourses: courses.length,
      publishedCourses: courses.filter((c) => c.is_published).length,
      totalStudents: students.length + 120, // baseline plus demo
      totalCertificatesIssued: certs.length + 84,
      averagePassingRate: '94.2%',
      recentEnrollments: enrollments,
      recentCertificates: certs,
    };
  },
};
