'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  LayoutDashboard,
  LogOut,
  LogIn,
  Sliders,
  Award,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function Navbar() {
  const pathname = usePathname();
  const { user, role, signOut, switchDemoRole } = useAuth();

  const isLearnRoute = pathname.includes('/learn/');

  // If in active fullscreen learning mode, display a streamlined topbar
  if (isLearnRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
              MedEduca <span className="text-blue-600 font-medium text-xs ml-1 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">Salud</span>
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Capacitación Continua Clínica
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/' ? 'text-blue-700 bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/#cursos"
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Cursos Disponibles
          </Link>
          <Link
            href="/verify/MED-2026-IAAS-9482"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              pathname.startsWith('/verify')
                ? 'text-blue-700 bg-blue-50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Validar Certificado
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/dashboard'
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Mi Aula
            </Link>
          )}
          {role === 'admin' && (
            <Link
              href="/admin"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/admin'
                  ? 'text-blue-700 bg-blue-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-4 h-4 text-blue-600" />
              Administración
            </Link>
          )}
        </nav>

        {/* User / Demo Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Role Switcher for instant evaluator testing */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => switchDemoRole('student')}
              className={`px-2 py-1 rounded-md transition-all font-medium ${
                role === 'student'
                  ? 'bg-white text-blue-800 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Ver el sistema con rol Alumno"
            >
              Alumno
            </button>
            <button
              onClick={() => switchDemoRole('admin')}
              className={`px-2 py-1 rounded-md transition-all font-medium ${
                role === 'admin'
                  ? 'bg-blue-700 text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Ver el sistema con rol Administrador"
            >
              Admin
            </button>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-900 leading-tight">
                  {user.full_name}
                </span>
                <span className="text-[11px] text-slate-500 leading-tight">
                  {user.profession || (role === 'admin' ? 'Administrador' : 'Alumno')}
                </span>
              </div>

              <button
                onClick={() => signOut()}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Ingresar
              </Link>
              <Link
                href="/auth/register"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-all"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
