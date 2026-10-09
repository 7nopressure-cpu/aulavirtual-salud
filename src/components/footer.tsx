import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Mail, Phone, MapPin, Award, CheckCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Accreditation */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">MedEduca Salud</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consultora líder en formación continua, acreditación de competencias y educación médica para personal clínico y hospitalario.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Acreditación Académica y Registro Único</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio y Presentación
                </Link>
              </li>
              <li>
                <Link href="/#cursos" className="hover:text-white transition-colors">
                  Catálogo de Cursos Clínicos
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Aula Virtual del Alumno
                </Link>
              </li>
              <li>
                <Link href="/verify/MED-2026-IAAS-9482" className="hover:text-white transition-colors">
                  Verificación de Certificados
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Áreas de Especialidad</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Urgencias Médicas y Reanimación Crítica</li>
              <li>Cuidados Intensivos y Farmacología UCI</li>
              <li>Prevención y Control de IAAS Hospitalarias</li>
              <li>Electrocardiografía y Arritmias Complejas</li>
              <li>Gestión y Seguridad del Paciente Quirúrgico</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Consultoría y Soporte</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                contacto@mededucasalud.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                +56 9 8234 1100 / +54 11 4821 9900
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                Centro de Simulación Clínica y Educación Médica
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} MedEduca Salud. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Válido ante instituciones hospitalarias públicas y privadas
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
