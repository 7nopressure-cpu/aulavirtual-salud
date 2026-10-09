import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Calendar,
  Clock,
  User,
  GraduationCap,
  Building,
  FileCheck,
  Search,
} from 'lucide-react';
import { DataService } from '@/lib/data-service';
import { CertificateViewer } from '@/components/certificate-viewer';
import { VerifySearchBox } from './verify-search-box';

interface VerifyPageProps {
  params: Promise<{ certificateCode: string }>;
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const { certificateCode } = await params;
  const certificate = await DataService.getCertificateByCode(certificateCode);

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Verification Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold tracking-wide uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Sistema Nacional de Verificación de Credenciales en Salud</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Validación Pública de Certificado Médico
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Consulta oficial y transparente para empleadores, hospitales, clínicas y comités de acreditación asistencial.
          </p>
        </div>

        {/* Search another code input */}
        <VerifySearchBox initialCode={certificateCode} />

        {certificate ? (
          <div className="space-y-8">
            {/* Legitimacy Alert Card */}
            <div className="bg-white rounded-3xl border-2 border-emerald-500/50 p-6 sm:p-8 shadow-lg shadow-emerald-500/5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-inner">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Certificado Auténtico y Vigente
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                      {certificate.profile?.full_name}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      {certificate.profile?.profession} {certificate.profile?.national_id ? `• ${certificate.profile.national_id}` : ''}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Código Registrado</span>
                  <span className="text-sm font-mono font-black text-blue-900 block">
                    {certificate.certificate_code}
                  </span>
                </div>
              </div>

              {/* Grid of Verified Academic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Programa de Formación</span>
                  <p className="font-bold text-sm text-slate-900">{certificate.course?.title}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Carga Horaria Acreditada</span>
                  <p className="font-bold text-sm text-slate-900">
                    {certificate.course?.duration_hours} Horas Pedagógicas Certificadas
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Fecha de Aprobación y Emisión</span>
                  <p className="font-bold text-sm text-slate-900">
                    {new Date(certificate.issued_at).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Institución Certificadora</span>
                  <p className="font-bold text-sm text-slate-900">
                    MedEduca Consultores en Salud • Registro Oficial Nº 842-CL
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Visual Certificate with download option */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-slate-900 text-center">
                Visualización del Certificado Original
              </h3>
              <CertificateViewer certificate={certificate} allowDownload={true} />
            </div>
          </div>
        ) : (
          /* Certificate Not Found */
          <div className="bg-white rounded-3xl border border-red-200 p-8 sm:p-12 text-center shadow-md space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Certificado No Encontrado</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              El código <code className="bg-red-50 text-red-700 px-2 py-0.5 rounded font-mono font-bold">{certificateCode}</code> no coincide con ningún registro emitido en nuestra base de datos.
            </p>
            <p className="text-xs text-slate-400">
              Verifique que el código haya sido escrito exactamente como figura en el documento o pruebe con el certificado de muestra:
            </p>
            <div className="pt-2">
              <Link
                href="/verify/MED-2026-IAAS-9482"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 transition-colors"
              >
                Cargar Certificado de Ejemplo (MED-2026-IAAS-9482)
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
