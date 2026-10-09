'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sliders,
  BookOpen,
  Award,
  Users,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Search,
  ExternalLink,
  Layers,
  HelpCircle,
  FileCheck,
  TrendingUp,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { DataService } from '@/lib/data-service';
import { Course, Certificate, Enrollment, Profile, Module, Quiz } from '@/lib/types';
import { CreateCourseModal } from '@/components/admin/create-course-modal';

type AdminTab = 'resumen' | 'cursos' | 'estudiantes' | 'certificados';

export default function AdminDashboardPage() {
  const { user, role, switchDemoRole } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('resumen');
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const loadAllAdminData = async () => {
    try {
      const [allCourses, allCerts] = await Promise.all([
        DataService.getCourses(),
        DataService.getUserCertificates('user-student-1'),
      ]);
      setCourses(allCourses);
      setCertificates(allCerts);
      const enrs = await DataService.getUserEnrollments('user-student-1');
      setEnrollments(enrs);
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleCreateCourse = async (newCourseData: Omit<Course, 'id' | 'created_at'>) => {
    const created = await DataService.createCourse(newCourseData);
    setCourses((prev) => [created, ...prev]);
  };

  const handleTogglePublished = async (courseId: string, currentStatus: boolean) => {
    await DataService.updateCourse(courseId, { is_published: !currentStatus });
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, is_published: !currentStatus } : c))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              <span>Panel de Control de la Consultora Académica</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Gestión Integral del LMS de Salud
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Administración de programas curriculares, alumnos matriculados y emisión de certificados acreditados.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {role !== 'admin' && (
              <button
                onClick={() => switchDemoRole('admin')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
              >
                Cambiar a Rol Administrador
              </button>
            )}
            <button
              onClick={() => setIsCreateCourseOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Nuevo Curso
            </button>
          </div>
        </div>
      </section>

      {/* Main Tabs Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
          <button
            onClick={() => setActiveTab('resumen')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'resumen'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Métricas y Resumen
          </button>
          <button
            onClick={() => setActiveTab('cursos')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'cursos'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Catálogo de Cursos ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('estudiantes')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'estudiantes'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Estudiantes y Avance
          </button>
          <button
            onClick={() => setActiveTab('certificados')}
            className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'certificados'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            Certificados Acreditados
          </button>
        </div>

        {/* Tab 1: Resumen & Métricas */}
        {activeTab === 'resumen' && (
          <div className="mt-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase">Cursos Registrados</span>
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-3xl font-black text-slate-900">{courses.length}</span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                  {courses.filter((c) => c.is_published).length} publicados actualmente
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase">Alumnos Acreditados</span>
                  <Users className="w-4 h-4 text-cyan-600" />
                </div>
                <span className="text-3xl font-black text-slate-900">124</span>
                <span className="text-[11px] text-slate-500 font-medium block mt-1">
                  Médicos, enfermeros y TENS
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase">Certificados Emitidos</span>
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-3xl font-black text-slate-900">89</span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                  100% verificables con código QR
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold uppercase">Tasa de Aprobación</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-3xl font-black text-emerald-600">94.8%</span>
                <span className="text-[11px] text-slate-500 font-medium block mt-1">
                  Promedio en exámenes finales
                </span>
              </div>
            </div>

            {/* Quick Action & Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Courses */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-4 flex items-center justify-between">
                  <span>Cursos en la Plataforma</span>
                  <Link href="#cursos" onClick={() => setActiveTab('cursos')} className="text-xs text-blue-700 hover:underline">
                    Ver todos
                  </Link>
                </h3>
                <div className="space-y-3">
                  {courses.slice(0, 3).map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{c.title}</h4>
                        <span className="text-[10px] text-slate-500">
                          {c.duration_hours} hrs • {c.category}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.is_published
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {c.is_published ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Certified Students */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="font-bold text-sm text-slate-900 mb-4">
                  Actividad Reciente de Estudiantes
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">Dra. Camila Valenzuela Méndez</p>
                      <span className="text-[10px] text-slate-500">Aprobó examen de IAAS (100%)</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      MED-2026-IAAS-9482
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">Lic. Javier Morales Rivas</p>
                      <span className="text-[10px] text-slate-500">Avance 67% en Trauma y Reanimación</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      En Curso
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cursos Manager */}
        {activeTab === 'cursos' && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Buscar curso por nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                />
              </div>

              <button
                onClick={() => setIsCreateCourseOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Crear Curso Clínico
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Curso / Título</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Carga Horaria</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courses
                      .filter((c) =>
                        c.title.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((course) => (
                        <tr key={course.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="p-4">
                            <span className="font-bold text-slate-900 block">{course.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              /courses/{course.slug}
                            </span>
                          </td>
                          <td className="p-4 text-slate-600">{course.category}</td>
                          <td className="p-4 font-semibold text-slate-700">
                            {course.duration_hours} hrs
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleTogglePublished(course.id, course.is_published)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                                course.is_published
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              }`}
                            >
                              {course.is_published ? (
                                <>
                                  <Eye className="w-3 h-3" /> Publicado
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3" /> Borrador
                                </>
                              )}
                            </button>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <Link
                              href={`/courses/${course.slug}`}
                              className="text-blue-700 hover:underline font-semibold"
                            >
                              Ver Curso
                            </Link>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Estudiantes y Progreso */}
        {activeTab === 'estudiantes' && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-xs sm:text-sm text-slate-800">
                  Profesionales Registrados en el Aula Virtual
                </h3>
                <span className="text-xs text-slate-500">2 estudiantes activos en demo</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Profesional</th>
                      <th className="p-4">Profesión / RUT</th>
                      <th className="p-4">Curso Inscrito</th>
                      <th className="p-4">Progreso</th>
                      <th className="p-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">Dra. Camila Valenzuela</span>
                        <span className="text-[10px] text-slate-400">c.valenzuela@hospital.med</span>
                      </td>
                      <td className="p-4 text-slate-600">
                        Médico Urgenciólogo
                        <span className="block text-[10px] text-slate-400">RUT: 18.492.381-4</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        IAAS y Bioseguridad Hospitalaria
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-emerald-600">100%</span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-emerald-500" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Aprobado
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50/50">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">Lic. Javier Morales Rivas</span>
                        <span className="text-[10px] text-slate-400">j.morales@salud.cl</span>
                      </td>
                      <td className="p-4 text-slate-600">
                        Enfermero Reanimador SAMU
                        <span className="block text-[10px] text-slate-400">RUT: 16.712.903-8</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        Soporte Vital Avanzado en Trauma
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600">67%</span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-blue-600" />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          En Progreso
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Certificados Emitidos */}
        {activeTab === 'certificados' && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-xs sm:text-sm text-slate-800">
                  Registro Oficial de Certificaciones Emitidas
                </h3>
                <span className="text-xs text-slate-500">Acreditaciones verificadas</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Código Único</th>
                      <th className="p-4">Profesional</th>
                      <th className="p-4">Programa</th>
                      <th className="p-4">Fecha Emisión</th>
                      <th className="p-4 text-right">Verificación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {certificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-slate-50/50">
                        <td className="p-4 font-mono font-bold text-emerald-800">
                          {cert.certificate_code}
                        </td>
                        <td className="p-4 font-bold text-slate-900">
                          {cert.profile?.full_name}
                        </td>
                        <td className="p-4 text-slate-700">
                          {cert.course?.title}
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(cert.issued_at).toLocaleDateString('es-ES')}
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/verify/${cert.certificate_code}`}
                            className="inline-flex items-center gap-1 text-blue-700 hover:underline font-bold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Verificar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Course Creation */}
      <CreateCourseModal
        isOpen={isCreateCourseOpen}
        onClose={() => setIsCreateCourseOpen(false)}
        onSave={handleCreateCourse}
      />
    </div>
  );
}
