import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  Clock,
  Users,
  Award,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  PlayCircle,
  HelpCircle,
  FileCheck2,
} from 'lucide-react';
import { DataService } from '@/lib/data-service';
import { CourseEnrollmentButton } from './enrollment-button';

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = await DataService.getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const modules = await DataService.getCourseModulesWithLessons(course.id);
  const quiz = await DataService.getQuizByCourseId(course.id);

  const totalLessons = modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0);
  const firstLessonId = modules[0]?.lessons?.[0]?.id || '';

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Course Hero Banner */}
      <section className="bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white py-14 lg:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-cyan-300 rounded-md border border-blue-400/30">
                  {course.category}
                </span>
                <span className="px-3 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-400/30">
                  Acreditación Vigente 2026
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span><strong>{course.duration_hours} Horas</strong> Pedagógicas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>{course.target_audience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>{totalLessons} Lecciones Clínicas</span>
                </div>
              </div>
            </div>

            {/* Right Action Card */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-slate-900 space-y-5">
                <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100">
                  <Image
                    src={course.image_url}
                    alt={course.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white font-bold">
                    <ShieldCheck className="w-4 h-4 text-cyan-300" />
                    <span>Certificado con QR Incluido</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-500 font-medium">Inscripción Institucional</span>
                    <span className="text-lg font-black text-emerald-600">Acceso Abierto</span>
                  </div>

                  {/* Client component for Enrollment Action */}
                  <CourseEnrollmentButton
                    courseId={course.id}
                    courseSlug={course.slug}
                    firstLessonId={firstLessonId}
                  />

                  <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Acceso inmediato e ilimitado 24/7</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Evaluación clínica con retroalimentación</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Certificado PDF descargable de alta calidad</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Syllabus / Curriculum */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Syllabus */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                Estructura Curricular del Programa
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                El programa se organiza en módulos sistemáticos diseñados por médicos especialistas en el área.
              </p>
            </div>

            <div className="space-y-4">
              {modules.map((mod, modIdx) => (
                <div
                  key={mod.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs"
                >
                  <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-blue-700 text-white font-bold text-xs flex items-center justify-center">
                        {modIdx + 1}
                      </span>
                      <h3 className="font-bold text-sm sm:text-base text-slate-900">
                        {mod.title}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {mod.lessons?.length || 0} lecciones
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {mod.lessons?.map((lesson, lIdx) => (
                      <div
                        key={lesson.id}
                        className="p-4 flex items-center justify-between hover:bg-blue-50/40 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <PlayCircle className="w-4 h-4 text-blue-600 shrink-0" />
                          <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                              {lesson.title}
                            </h4>
                            <span className="text-[11px] text-slate-400">
                              Duración estimada: {lesson.duration_minutes} min • Formato multimedia
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/courses/${course.slug}/learn/${lesson.id}`}
                          className="text-xs font-semibold text-blue-700 hover:text-blue-800 px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                          Ver
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quiz module card */}
              {quiz && (
                <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-2xl p-5 text-white shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-slate-300">
                        Examen final obligatorio para acreditación • Exigencia mínima: {quiz.passing_score}%
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/courses/${course.slug}/quiz`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
                  >
                    Rendir Examen
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Accreditation details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Acreditación y Requisitos
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div>
                  <strong className="block text-slate-900 mb-0.5">Requisitos de Aprobación:</strong>
                  Completar el 100% de las lecturas y cápsulas de video, y obtener una nota mínima de {quiz?.passing_score || 80}% en el examen final.
                </div>
                <div>
                  <strong className="block text-slate-900 mb-0.5">Emisión del Certificado:</strong>
                  Automática e inmediata al aprobar. Incluye código hash único y QR verificable en el Registro Nacional de Capacitaciones.
                </div>
                <div>
                  <strong className="block text-slate-900 mb-0.5">Validez Hospitalaria:</strong>
                  Válido para carrera funcionaria, concursos de especialidad médica (EDF/CONISS) y acreditación de calidad en salud.
                </div>
              </div>
            </div>

            {/* Academic Director Profile */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 mb-4">
                Dirección Académica del Programa
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-sm">
                  Dr. RS
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Dr. Rodrigo Soto Alvarado</h4>
                  <p className="text-[11px] text-slate-500">Director Médico & Consultor Clínico</p>
                  <p className="text-[10px] text-slate-400">Especialista en Medicina de Urgencia y Cuidados Críticos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
