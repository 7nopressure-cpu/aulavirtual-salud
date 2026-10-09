'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface VerifySearchBoxProps {
  initialCode: string;
}

export function VerifySearchBox({ initialCode }: VerifySearchBoxProps) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    router.push(`/verify/${code.trim().toUpperCase()}`);
  };

  return (
    <form onSubmit={handleSearch} className="max-w-md mx-auto flex items-center gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Ingresar código (ej: MED-2026-IAAS-9482)"
          className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono uppercase bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 shadow-xs"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
      >
        <Search className="w-3.5 h-3.5" />
        Consultar
      </button>
    </form>
  );
}
