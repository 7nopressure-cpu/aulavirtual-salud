import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
import { Course } from '@/lib/types';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  progressPercentage?: number;
  isCompleted?: boolean;
}

export function CourseCard({
  course,
  isEnrolled = false,
  progressPercentage = 0,
  isCompleted = false,
}: CourseCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-200 overflow-hidden flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <Image
          src={course.image_url}
          alt={course.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase bg-white/95 backdrop-blur text-blue-900 rounded-md shadow-xs">
          {course.category}
        </span>

        {/* Status Badge */}
        {isCompleted && (
          <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-semibold bg-emerald-500 text-white rounded-full flex items-center gap-1 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5" /> Aprobado
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            {course.duration_hours} hrs académicas
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 truncate font-medium">
            <Users className="w-3.5 h-3.5 text-blue-600" />
            Personal Clínico
          </span>
        </div>

        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-2 leading-snug">
          {course.title}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed flex-1">
          {course.description}
        </p>

        {/* Progress bar if enrolled */}
        {isEnrolled && (
          <div className="mt-auto mb-4">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1">
              <span>Progreso del Curso</span>
              <span className="text-blue-700 font-bold">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <Link
            href={`/courses/${course.slug}`}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Ver Programa
          </Link>

          <Link
            href={isEnrolled ? `/courses/${course.slug}` : `/courses/${course.slug}`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isEnrolled
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'bg-blue-700 text-white hover:bg-blue-800 shadow-xs'
            }`}
          >
            {isEnrolled ? (
              <>
                <BookOpen className="w-3.5 h-3.5" />
                Continuar
              </>
            ) : (
              <>
                Inscribirme
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
