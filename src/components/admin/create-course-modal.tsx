'use client';

import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Course } from '@/lib/types';

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, 'id' | 'created_at'>) => void;
}

export function CreateCourseModal({ isOpen, onClose, onSave }: CreateCourseModalProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80');
  const [durationHours, setDurationHours] = useState(40);
  const [category, setCategory] = useState('Urgencias y Cuidados Críticos');
  const [targetAudience, setTargetAudience] = useState('Médicos Cirujanos, Enfermeros de Reanimación, TENS');
  const [isPublished, setIsPublished] = useState(true);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    // Auto-generate slug
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generatedSlug);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    onSave({
      title,
      slug,
      description,
      image_url: imageUrl,
      duration_hours: Number(durationHours),
      category,
      target_audience: targetAudience,
      is_published: isPublished,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <h3 className="font-bold text-lg text-slate-900">
            Crear Nuevo Curso Clínico
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Título del Curso
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ej: Manejo Integral del Paro Cardiorrespiratorio y RCP Avanzado"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Slug (identificador URL)
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="rcp-avanzado-urgencias"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Carga Horaria (Horas Pedagógicas)
              </label>
              <input
                type="number"
                min={1}
                max={200}
                required
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Categoría Académica
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="Urgencias y Cuidados Críticos">Urgencias y Cuidados Críticos</option>
                <option value="Medicina Crítica e Intensiva">Medicina Crítica e Intensiva</option>
                <option value="Calidad Asistencial y Epidemiología">Calidad Asistencial y Epidemiología</option>
                <option value="Cardiología y Urgencias">Cardiología y Urgencias</option>
                <option value="Pediatría y Neonatología">Pediatría y Neonatología</option>
                <option value="Pabellón y Cirugía">Pabellón y Cirugía</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Público Objetivo
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Médicos, Enfermeros, TENS..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Descripción Breve
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Resumen de objetivos y competencias clínicas acreditadas..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              URL Imagen de Portada
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_published"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <label htmlFor="is_published" className="font-semibold text-slate-700">
              Publicar curso inmediatamente en el catálogo
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800 transition-colors shadow-sm"
            >
              Guardar Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
