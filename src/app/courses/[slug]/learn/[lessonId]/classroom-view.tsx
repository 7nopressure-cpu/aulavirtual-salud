'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  FileText,
  Award,
  Check,
  ArrowLeft,
  Menu,
  X,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Course, Module, Lesson } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { DataService } from '@/lib/data-service';
import { MarkdownRenderer } from '@/components/markdown-renderer';

interface ClassroomViewProps {
  course: Course;
  modules: Module[];
  currentLesson: Lesson;
  initialProgress: Record<string, boolean>;
}

export function ClassroomView({
  course,
  modules,
  currentLesson,
  initialProgress,
}: ClassroomViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, boolean>>(initialProgress);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Flatten all lessons to calculate sequence and progress
  const allLessons: Lesson[] = [];
  modules.forEach((m) => {
    (m.lessons || []).forEach((l) => allLessons.push(l));
  });

  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const totalLessons = allLessons.length;
  const completedLessonsCount = allLessons.filter((l) => progress[l.id]).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const isCurrentCompleted = Boolean(progress[currentLesson.id]);

  const toggleLessonComplete = async () => {
    if (!user) return;
    setIsUpdating(true);
    const newStatus = !isCurrentCompleted;

    try {
      await DataService.markLessonProgress(user.id, currentLesson.id, newStatus);
      setProgress((prev) => ({
        ...prev,
        [currentLesson.id]: newStatus,
      }));
    } catch (err) {
      console.error('Error updating progress', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCompleteAndNext = async () => {
    if (user && !isCurrentCompleted) {
      setIsUpdating(true);
      await DataService.markLessonProgress(user.id, currentLesson.id, true);
      setProgress((prev) => ({
        ...prev,
        [currentLesson.id]: true,
      }));
      setIsUpdating(false);
    }

    if (nextLesson) {
      router.push(`/courses/${course.slug}/learn/${nextLesson.id}`);
    } else {
      router.push(`/courses/${course.slug}/quiz`);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-900 text-slate-100">
      {/* Top Header */}
      <header className="h-14 border-b border-slate-800 bg-slate-950 px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver al curso</span>
          </Link>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <h1 className="text-xs sm:text-sm font-bold text-slate-200 truncate max-w-xs md:max-w-md">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span>Progreso:</span>
            <span className="text-cyan-400 font-bold">{progressPercent}%</span>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Toggle sidebar button on mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Classroom Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left / Main Content Pane */}
        <div className="flex-1 overflow-y-auto bg-white text-slate-900 p-4 sm:p-8 lg:p-12">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Lesson Title Header */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
                <PlayCircle className="w-4 h-4" />
                <span>Lección {currentIndex + 1} de {totalLessons}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {currentLesson.duration_minutes} min
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {currentLesson.title}
              </h2>
            </div>

            {/* Video Player Box (YouTube / Embed format) */}
            {currentLesson.video_url && (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-lg border border-slate-200">
                <iframe
                  src={currentLesson.video_url}
                  title={currentLesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Clinical Content / Notes */}
            <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
              <MarkdownRenderer content={currentLesson.content_markdown || ''} />
            </div>

            {/* Bottom Lesson Navigation Bar */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                {prevLesson ? (
                  <Link
                    href={`/courses/${course.slug}/learn/${prevLesson.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Lección Anterior
                  </Link>
                ) : (
                  <div />
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleLessonComplete}
                  disabled={isUpdating}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    isCurrentCompleted
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {isCurrentCompleted ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      Completada
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-slate-400" />
                      Marcar como completada
                    </>
                  )}
                </button>

                <button
                  onClick={handleCompleteAndNext}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-md shadow-blue-500/20 transition-all"
                >
                  {nextLesson ? (
                    <>
                      {isCurrentCompleted ? 'Siguiente Lección' : 'Completar y Continuar'}
                      <ChevronRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Ir al Examen Final
                      <Award className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right / Content Sidebar */}
        <aside
          className={`w-80 sm:w-96 bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 transition-all duration-300 z-20 absolute lg:relative inset-y-0 right-0 ${
            sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Temario del Curso
            </h3>
            <p className="text-xs font-semibold text-slate-200 truncate">
              {course.title}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{completedLessonsCount} de {totalLessons} completadas</span>
              <span className="font-bold text-cyan-400">{progressPercent}%</span>
            </div>
          </div>

          {/* Module & Lessons Scrollable Tree */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-4">
            {modules.map((mod, modIdx) => (
              <div key={mod.id} className="pt-2">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                  {mod.title}
                </div>

                <div className="space-y-1 mt-1">
                  {mod.lessons?.map((lesson) => {
                    const isSelected = lesson.id === currentLesson.id;
                    const isCompleted = Boolean(progress[lesson.id]);

                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${course.slug}/learn/${lesson.id}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs transition-colors flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-blue-600/20 text-cyan-300 font-bold border border-blue-500/30'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1 leading-snug">
                          <span>{lesson.title}</span>
                          <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                            {lesson.duration_minutes} min
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Assessment Link in Sidebar */}
            <div className="p-3 pt-4">
              <Link
                href={`/courses/${course.slug}/quiz`}
                className="w-full flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <div className="leading-snug">
                  <span>Evaluación Final (Quiz)</span>
                  <span className="block text-[10px] text-amber-400/80 font-normal">
                    Requerido para Acreditación
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
