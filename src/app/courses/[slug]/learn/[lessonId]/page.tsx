import React from 'react';
import { notFound } from 'next/navigation';
import { DataService } from '@/lib/data-service';
import { ClassroomView } from './classroom-view';

interface LearnPageProps {
  params: Promise<{ slug: string; lessonId: string }>;
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { slug, lessonId } = await params;
  const course = await DataService.getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const modules = await DataService.getCourseModulesWithLessons(course.id);
  const currentLesson = await DataService.getLessonById(lessonId);

  if (!currentLesson) {
    notFound();
  }

  // Load baseline progress
  const initialProgress = await DataService.getLessonProgress('user-student-1', course.id);

  return (
    <ClassroomView
      course={course}
      modules={modules}
      currentLesson={currentLesson}
      initialProgress={initialProgress}
    />
  );
}
