import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  Stethoscope,
  Activity,
  ArrowRight,
  Sparkles,
  FileCheck2,
  Building2,
  Star,
} from 'lucide-react';
import { DataService } from '@/lib/data-service';
import { CourseCard } from '@/components/course-card';

export const revalidate = 60;

export default async function HomePage() {
  const courses = await DataService.getCourses();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white py-20 lg:py-28">
        {/* Subtle Background Glow and Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Proposition */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                <span>Consultora Especializada en Educación Médica Continua</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Formación Clínica de Vanguardia y{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Acreditación Oficial
                </span>{' '}
                para el Personal de Salud
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Diseñado exclusivamente para médicos, enfermeros, reanimadores y técnicos asistenciales. Cursos asincrónicos basados en medicina basada en evidencia, casos clínicos interactivos y certificados digitales verificables con código QR.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="#cursos"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  Explorar Cursos Clínicos
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/verify/MED-2026-IAAS-9482"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 backdrop-blur transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Portal de Verificación
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="block text-2xl font-black text-white">40 a 80</span>
                  <span className="text-xs text-slate-400">Horas Académicas</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-cyan-400">100%</span>
                  <span className="text-xs text-slate-400">Online y Asincrónico</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-emerald-400">QR Único</span>
                  <span className="text-xs text-slate-400">Validación Hospitalaria</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
                <div className="relative h-56 rounded-2xl overflow-hidden mb-5">
                  <Image
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
                    alt="Capacitación médica"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="bg-emerald-500/90 text-white font-bold px-2.5 py-1 rounded-md">
                      Programa Habilitante
                    </span>
                    <span className="bg-black/60 backdrop-blur text-slate-200 px-2 py-0.5 rounded font-mono text-[11px]">
                      Acreditado 2026
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                    <Award className="w-4 h-4" /> Certificación Inmediata
                  </div>
                  <h3 className="font-bold text-lg text-white leading-snug">
                    Soporte Vital Avanzado en Trauma y Cuidados Críticos
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Alineado a las últimas directrices de manejo prehospitalario y hospitalario del trauma severo.
                  </p>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-slate-400 ml-1 font-semibold text-[11px]">4.9 (840+)</span>
                    </div>

                    <Link
                      href="/courses/soporte-vital-avanzado-trauma"
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      Ver temario <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Highlights */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Acreditación Curricular</h4>
                <p className="text-xs text-slate-600 mt-0.5">Certificados con horas pedagógicas válidas para carrera funcionaria y concursos.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Verificación con QR</h4>
                <p className="text-xs text-slate-600 mt-0.5">Validación pública y en tiempo real para jefaturas y recursos humanos hospitalarios.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Casos Clínicos Reales</h4>
                <p className="text-xs text-slate-600 mt-0.5">Enfoque práctico con simulación, algoritmos interactivos y farmacocinética crítica.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Alianza Hospitalaria</h4>
                <p className="text-xs text-slate-600 mt-0.5">Capacitación continua adoptada por clínicas privadas y servicios de salud públicos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Catalog Section */}
      <section id="cursos" className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              Catálogo Académico
            </span>
            <h2 className="text-3xl font-black text-slate-900 mt-3 tracking-tight">
              Cursos Especializados para Personal de Salud
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Selecciona tu programa de formación. Estudia a tu propio ritmo desde cualquier dispositivo y obtén tu acreditación inmediatamente al aprobar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Testimonials */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Avalado por Profesionales de la Salud
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Médicos, enfermeros y técnicos de servicios de urgencia y cuidados intensivos comparten su experiencia en nuestra plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;El curso de Soporte Vital en Trauma superó con creces mis expectativas. Los casos clínicos y la retroalimentación inmediata en las evaluaciones son de altísimo nivel. El certificado con QR fue validado sin problemas en mi hospital.&rdquo;
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-200 text-blue-800 font-bold flex items-center justify-center text-xs">
                  CV
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Dra. Camila Valenzuela</h4>
                  <p className="text-[11px] text-slate-500">Médico de Urgencias Hospitalarias</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;Para el personal de enfermería en reanimación crítica, el curso de Farmacología en UCI es indispensable. Tablas de dilución claras, perfiles hemodinámicos y una plataforma ágil y limpia.&rdquo;
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-200 text-cyan-800 font-bold flex items-center justify-center text-xs">
                  JM
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Lic. Javier Morales R.</h4>
                  <p className="text-[11px] text-slate-500">Enfermero Reanimador SAMU</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;El curso de IAAS de 80 horas me permitió cumplir oportunamente con el requisito de acreditación ministerial. La descarga del certificado en PDF es instantánea y con un formato impecable.&rdquo;
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  CS
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Claudia Salinas T.</h4>
                  <p className="text-[11px] text-slate-500">Técnico en Enfermería (TENS)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Verification Callout */}
      <section className="py-14 bg-gradient-to-r from-blue-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <div className="w-12 h-12 bg-blue-800/80 rounded-2xl flex items-center justify-center mx-auto text-cyan-300">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            ¿Eres Jefe de Servicio o Evaluador de Recursos Humanos?
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Puedes verificar la autenticidad de cualquier certificado emitido por MedEduca ingresando el código alfanumérico o escaneando el código QR impreso en el documento.
          </p>
          <div className="pt-2">
            <Link
              href="/verify/MED-2026-IAAS-9482"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-white text-blue-950 hover:bg-slate-100 shadow-lg transition-all"
            >
              Comprobar Certificado de Muestra (MED-2026-IAAS-9482)
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
