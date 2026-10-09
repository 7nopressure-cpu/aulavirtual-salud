'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Download, CheckCircle2, ShieldCheck, QrCode as QrIcon, Copy, Check, ExternalLink, Award } from 'lucide-react';
import { Certificate } from '@/lib/types';
import { downloadCertificatePdf, generateQrDataUrl } from '@/lib/certificate-generator';

interface CertificateViewerProps {
  certificate: Certificate;
  allowDownload?: boolean;
}

export function CertificateViewer({ certificate, allowDownload = true }: CertificateViewerProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const certContainerRef = useRef<HTMLDivElement>(null);

  const certId = `cert-${certificate.certificate_code}`;
  const fullVerificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${certificate.certificate_code}`
    : `https://saludcapacita.com/verify/${certificate.certificate_code}`;

  useEffect(() => {
    generateQrDataUrl(fullVerificationUrl).then((url) => {
      setQrUrl(url);
    });
  }, [fullVerificationUrl]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const sanitizedName = (certificate.profile?.full_name || 'Certificado')
        .replace(/[^a-zA-Z0-9]/g, '_');
      await downloadCertificatePdf(certId, `Certificado_${sanitizedName}_${certificate.certificate_code}`);
    } catch (err) {
      console.error('Error generating PDF', err);
      alert('Hubo un error al generar el PDF. Por favor reintente.');
    } finally {
      setIsDownloading(false);
    }
  };

  const copyVerifyLink = () => {
    navigator.clipboard.writeText(fullVerificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formattedDate = new Date(certificate.issued_at).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full flex flex-col items-center">
      {/* Action Toolbar */}
      {allowDownload && (
        <div className="w-full max-w-4xl mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">
              Certificado Acreditado Oficialmente
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-semibold border border-emerald-200">
              {certificate.certificate_code}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyVerifyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '¡Enlace Copiado!' : 'Copiar Enlace'}
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-75 rounded-lg shadow-sm transition-all"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generando PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Descargar Certificado PDF
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Printable / Renderable Certificate Surface */}
      <div className="w-full overflow-x-auto pb-4 flex justify-center">
        <div
          id={certId}
          ref={certContainerRef}
          className="w-[960px] min-w-[960px] h-[670px] bg-gradient-to-br from-slate-50 via-white to-blue-50/40 text-slate-900 p-8 relative shadow-2xl border-[12px] border-double border-slate-800 select-none flex flex-col justify-between"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {/* Subtle Decorative Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <Award className="w-[500px] h-[500px] text-slate-900" />
          </div>

          {/* Inner Golden/Navy Border Frame */}
          <div className="absolute inset-2 border border-blue-900/20 pointer-events-none" />

          {/* Certificate Header */}
          <div className="text-center relative z-10 pt-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-6 h-6 text-cyan-300" />
              </div>
              <div className="text-left font-sans">
                <h1 className="text-lg font-black tracking-wider text-blue-950 uppercase">
                  MEDEDUCA CAPACITACIÓN CONTINUA
                </h1>
                <p className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold">
                  División de Formación y Acreditación del Personal de Salud
                </p>
              </div>
            </div>

            <div className="inline-block mt-1">
              <span className="text-xs uppercase tracking-[0.3em] font-sans font-bold text-blue-800 border-b border-blue-800 pb-1">
                Certificado Oficial de Aprobación Académica
              </span>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="text-center my-auto px-12 relative z-10">
            <p className="text-xs tracking-wider text-slate-600 font-sans uppercase mb-2">
              Se otorga la presente constancia y acreditación a:
            </p>

            <h2 className="text-3xl font-bold text-slate-900 tracking-wide underline decoration-blue-900/30 underline-offset-8">
              {certificate.profile?.full_name || 'Profesional de la Salud'}
            </h2>

            <p className="text-sm text-slate-600 mt-3 font-sans font-medium">
              {certificate.profile?.profession || 'Profesional Sanitario'}
              {certificate.profile?.national_id && ` • ${certificate.profile.national_id}`}
            </p>

            <p className="text-xs text-slate-600 font-sans mt-4 max-w-2xl mx-auto leading-relaxed">
              Por haber completado y aprobado con distinción los requisitos curriculares, evaluaciones clínicas y
              estándares de calidad asistencial del programa de formación continua:
            </p>

            <h3 className="text-xl font-bold text-blue-950 mt-3 max-w-3xl mx-auto leading-snug">
              &ldquo;{certificate.course?.title || 'Programa de Formación Médica'}&rdquo;
            </h3>

            <div className="mt-4 flex items-center justify-center gap-8 text-xs font-sans text-slate-700">
              <span className="inline-flex items-center gap-1.5 bg-blue-50/80 px-3 py-1 rounded-md border border-blue-200">
                <strong className="text-blue-900">Carga Horaria:</strong> {certificate.course?.duration_hours || 40} Horas Pedagógicas
              </span>
              <span className="inline-flex items-center gap-1.5 bg-emerald-50/80 px-3 py-1 rounded-md border border-emerald-200">
                <strong className="text-emerald-900">Modalidad:</strong> E-Learning Asincrónico y Casos Clínicos
              </span>
              <span className="inline-flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
                <strong className="text-slate-900">Fecha de Emisión:</strong> {formattedDate}
              </span>
            </div>
          </div>

          {/* Certificate Footer: Signatures and QR Code */}
          <div className="pt-2 border-t border-slate-200 relative z-10 font-sans">
            <div className="grid grid-cols-3 items-end">
              {/* Signature 1 */}
              <div className="text-center">
                <div className="h-14 flex items-end justify-center mb-1">
                  <div className="font-serif italic text-blue-950 text-xl font-bold tracking-tight border-b border-slate-800 pb-1 px-8">
                    Dr. Rodrigo Soto A.
                  </div>
                </div>
                <p className="text-[11px] font-bold text-slate-800">Dr. Rodrigo Soto Alvarado</p>
                <p className="text-[9px] text-slate-500">Director Académico • Especialista en Urgencias</p>
              </div>

              {/* Central Seal & Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full border-2 border-amber-600/70 bg-gradient-to-tr from-amber-100 to-amber-50 flex items-center justify-center shadow-inner mb-1">
                  <Award className="w-8 h-8 text-amber-700" />
                </div>
                <span className="text-[9px] font-mono font-bold tracking-widest text-slate-700">
                  CÓDIGO: {certificate.certificate_code}
                </span>
                <span className="text-[8px] text-emerald-700 font-semibold uppercase mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Acreditación Verificada
                </span>
              </div>

              {/* Signature 2 & QR */}
              <div className="flex items-center justify-end gap-3 text-right">
                <div>
                  <div className="h-14 flex items-end justify-end mb-1">
                    <div className="font-serif italic text-blue-950 text-xl font-bold tracking-tight border-b border-slate-800 pb-1 px-4">
                      Dra. Elena Morales F.
                    </div>
                  </div>
                  <p className="text-[11px] font-bold text-slate-800">Dra. Elena Morales Fuentes</p>
                  <p className="text-[9px] text-slate-500">Comité Científico de Acreditación</p>
                </div>

                {/* QR Code */}
                {qrUrl ? (
                  <div className="bg-white p-1 rounded-md border border-slate-200 shadow-sm flex flex-col items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrUrl} alt="QR Verificación" className="w-14 h-14" />
                    <span className="text-[7px] text-slate-500 font-mono mt-0.5">Validar QR</span>
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-slate-100 rounded border border-slate-200 flex items-center justify-center">
                    <QrIcon className="w-6 h-6 text-slate-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
