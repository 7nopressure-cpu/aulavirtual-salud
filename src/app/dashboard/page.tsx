'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Award,
  BookOpen,
  Clock,
  ArrowRight,
  Download,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { DataService } from '@/lib/data-service';
import { Enrollment, Certificate, Course } from '@/lib/types';
import { CourseCard } from '@/components/course-card';
import { CertificateViewer } from '@/components/certificate-viewer';

export default function DashboardPage() {
  const { user, role } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [selectedCertForModal, setSelectedCertForModal] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const [userEnrollments, userCertificates, allCourses] = await Promise.all([
          DataService.getUserEnrollments(user.id),
          DataService.getUserCertificates(user.id),
          DataService.getCourses(),
        ]);
        setEnrollments(userEnrollments);
        setCertificates(userCertificates);
        setAvailableCourses(allCourses);
      } catch (err) {
        console.error('Error loading dashboard data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (!user && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Por favor inicia sesión</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">Debes ingresar para acceder a tu panel de alumno.</p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-700 text-white font-semibold text-sm"
        >
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  const inProgressCourses = enrollments.filter((e) => e.status === 'in_progress');
  const completedCourses = enrollments.filter((e) => e.status === 'completed');

  const totalHoursCompleted = certificates.reduce(
    (sum, cert) => sum + (cert.course?.duration_hours || 0),
    0
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <GraduationCap className="w-4 h-4" />
                <span>Expediente Académico y Aula Virtual</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Bienvenido/a, {user?.full_name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {user?.profession} {user?.national_id ? `• ${user.national_id}` : ''}
              </p>
            </div>

            {role === 'admin' && (
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Ir al Panel de Administrador
                </Link>
              </div>
            )}
          </div>

          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-300 uppercase block">
                Cursos en Progreso
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {inProgressCourses.length}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-300 uppercase block">
                Cursos Aprobados
              </span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">
                {completedCourses.length}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-300 uppercase block">
                Certificados Acreditados
              </span>
              <span className="text-2xl font-black text-cyan-400 mt-1 block">
                {certificates.length}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-4">
              <span className="text-[11px] font-semibold text-slate-300 uppercase block">
                Horas Pedagógicas
              </span>
              <span className="text-2xl font-black text-amber-400 mt-1 block">
                {totalHoursCompleted} hrs
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* Section 1: Active Enrollments */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-700" />
              <h2 className="text-lg font-bold text-slate-900">
                Mis Cursos en Curso ({inProgressCourses.length})
              </h2>
            </div>
            <Link
              href="/#cursos"
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              Explorar más cursos <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {inProgressCourses.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No tienes cursos activos en este momento</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Inscríbete en un programa clínico para comenzar.</p>
              <Link
                href="/#cursos"
                className="px-4 py-2 rounded-xl bg-blue-700 text-white text-xs font-semibold inline-block"
              >
                Ver Catálogo de Cursos
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressCourses.map((enr) => {
                if (!enr.course) return null;
                return (
                  <CourseCard
                    key={enr.id}
                    course={enr.course}
                    isEnrolled={true}
                    progressPercentage={enr.progress_percentage || 60}
                    isCompleted={false}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* Section 2: Completed Certificates */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Mis Certificados de Acreditación ({certificates.length})
              </h2>
            </div>
          </div>

          {certificates.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Aún no has generado certificados</p>
              <p className="text-xs text-slate-400 mt-1">
                Completa el 100% de las lecciones de tus cursos y aprueba el examen final para descargar tu acreditación.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {cert.certificate_code}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {new Date(cert.issued_at).toLocaleDateString('es-ES')}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 leading-snug mb-1">
                      {cert.course?.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-3">
                      Horas acreditadas: <strong>{cert.course?.duration_hours} hrs pedagógicas</strong>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Link
                      href={`/verify/${cert.certificate_code}`}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Validación Pública
                    </Link>

                    <button
                      onClick={() => setSelectedCertForModal(cert)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Ver / Descargar PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 3: Recommended Courses */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Programas Clínicos Recomendados
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </div>

      {/* Modal for full certificate view and PDF export */}
      {selectedCertForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                Visualizador de Certificado Oficial
              </h3>
              <button
                onClick={() => setSelectedCertForModal(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <CertificateViewer certificate={selectedCertForModal} allowDownload={true} />
          </div>
        </div>
      )}
    </div>
  );
}
