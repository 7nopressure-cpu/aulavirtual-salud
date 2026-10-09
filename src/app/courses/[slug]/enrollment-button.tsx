'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { DataService } from '@/lib/data-service';

interface CourseEnrollmentButtonProps {
  courseId: string;
  courseSlug: string;
  firstLessonId: string;
}

export function CourseEnrollmentButton({
  courseId,
  courseSlug,
  firstLessonId,
}: CourseEnrollmentButtonProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function checkEnrollment() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const enrollments = await DataService.getUserEnrollments(user.id);
        const match = enrollments.find((e) => e.course_id === courseId);
        setIsEnrolled(Boolean(match));
      } catch (err) {
        console.error('Error checking enrollment', err);
      } finally {
        setLoading(false);
      }
    }
    checkEnrollment();
  }, [user, courseId]);

  const handleEnrollOrContinue = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (isEnrolled) {
      if (firstLessonId) {
        router.push(`/courses/${courseSlug}/learn/${firstLessonId}`);
      } else {
        router.push(`/courses/${courseSlug}/quiz`);
      }
      return;
    }

    setActionLoading(true);
    try {
      await DataService.enrollInCourse(user.id, courseId);
      setIsEnrolled(true);
      if (firstLessonId) {
        router.push(`/courses/${courseSlug}/learn/${firstLessonId}`);
      } else {
        router.push(`/dashboard`);
      }
    } catch (err) {
      console.error('Error enrolling', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <button
      onClick={handleEnrollOrContinue}
      disabled={actionLoading || loading}
      className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
        isEnrolled
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
          : 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-500/20'
      }`}
    >
      {actionLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : isEnrolled ? (
        <>
          <BookOpen className="w-4 h-4" />
          Continuar Aula Virtual
          <ArrowRight className="w-4 h-4" />
        </>
      ) : (
        <>
          Inscribirme en el Curso
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
