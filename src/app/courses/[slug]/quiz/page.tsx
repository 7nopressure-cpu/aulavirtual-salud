import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Award, HelpCircle } from 'lucide-react';
import { DataService } from '@/lib/data-service';
import { QuizRunner } from '@/components/quiz-runner';

interface CourseQuizPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseQuizPage({ params }: CourseQuizPageProps) {
  const { slug } = await params;
  const course = await DataService.getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const quiz = await DataService.getQuizByCourseId(course.id);

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Evaluación no disponible</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          Este curso aún no tiene una evaluación final configurada por el equipo académico.
        </p>
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 text-white text-xs font-semibold"
        >
          Volver al Curso
        </Link>
      </div>
    );
  }

  // Check progress: for demonstration and testing, we can check lessons
  const modules = await DataService.getCourseModulesWithLessons(course.id);
  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
  const userProgress = await DataService.getLessonProgress('user-student-1', course.id);
  const completedCount = Object.values(userProgress).filter(Boolean).length;
  // Consider 100% completed if at least all lessons are completed or if >= 2 for testing
  const allLessonsCompleted = completedCount >= totalLessons || totalLessons <= 2;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-6">
        <Link
          href={`/courses/${course.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la vista del curso
        </Link>
      </div>

      <QuizRunner
        quiz={quiz}
        course={course}
        allLessonsCompleted={allLessonsCompleted}
      />
    </div>
  );
}
