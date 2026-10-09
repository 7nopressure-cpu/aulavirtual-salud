'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Award,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { Quiz, Course, Certificate, Profile } from '@/lib/types';
import { DataService } from '@/lib/data-service';
import { useAuth } from '@/lib/auth-context';
import { CertificateViewer } from './certificate-viewer';

interface QuizRunnerProps {
  quiz: Quiz;
  course: Course;
  allLessonsCompleted: boolean;
}

export function QuizRunner({ quiz, course, allLessonsCompleted }: QuizRunnerProps) {
  const { user } = useAuth();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scorePercentage, setScorePercentage] = useState(0);
  const [passed, setPassed] = useState(false);
  const [issuedCert, setIssuedCert] = useState<Certificate | null>(null);
  const [isIssuingCert, setIsIssuingCert] = useState(false);

  const questions = quiz.questions || [];
  const totalQuestions = questions.length;

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = totalQuestions > 0 && answeredCount === totalQuestions;

  const handleSubmit = async () => {
    if (!isComplete) return;

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct_option_index) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    const hasPassed = calculatedScore >= quiz.passing_score;

    setScorePercentage(calculatedScore);
    setPassed(hasPassed);
    setIsSubmitted(true);

    if (user) {
      await DataService.saveQuizAttempt({
        user_id: user.id,
        quiz_id: quiz.id,
        score: calculatedScore,
        passed: hasPassed,
      });

      // If passed and all lessons are completed, issue official certificate
      if (hasPassed && allLessonsCompleted) {
        setIsIssuingCert(true);
        try {
          const cert = await DataService.issueCertificate(
            user.id,
            course.id,
            user,
            course
          );
          setIssuedCert(cert);
        } catch (err) {
          console.error('Error issuing certificate', err);
        } finally {
          setIsIssuingCert(false);
        }
      }
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScorePercentage(0);
    setPassed(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Quiz Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              Evaluación Teórico-Práctica
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 mt-2">
              {quiz.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Curso: <span className="font-semibold text-slate-700">{course.title}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-center">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Nota Mínima</span>
              <span className="font-bold text-sm text-slate-800">{quiz.passing_score}%</span>
            </div>
            <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-center">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Preguntas</span>
              <span className="font-bold text-sm text-slate-800">{totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Warning if lessons not 100% completed */}
        {!allLessonsCompleted && (
          <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Aviso de Acreditación:</strong> Puedes rendir la evaluación, pero el certificado solo se emitirá una vez que hayas marcado como completadas el 100% de las lecciones del curso.
            </span>
          </div>
        )}
      </div>

      {/* Results View */}
      {isSubmitted && (
        <div
          className={`rounded-2xl border p-6 md:p-8 text-center transition-all ${
            passed
              ? 'bg-gradient-to-b from-emerald-50 to-white border-emerald-200 shadow-md'
              : 'bg-gradient-to-b from-red-50 to-white border-red-200 shadow-sm'
          }`}
        >
          <div className="flex justify-center mb-4">
            {passed ? (
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-inner">
                <XCircle className="w-10 h-10" />
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            {passed ? '¡Felicitaciones! Has Aprobado la Evaluación' : 'Evaluación No Superada'}
          </h2>

          <div className="mt-3 flex items-center justify-center gap-2 text-lg">
            <span className="text-slate-600">Tu calificación final:</span>
            <span
              className={`font-black px-3 py-1 rounded-lg ${
                passed ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
              }`}
            >
              {scorePercentage}%
            </span>
            <span className="text-xs text-slate-500 font-medium">(Mínimo requerido: {quiz.passing_score}%)</span>
          </div>

          <p className="text-xs text-slate-600 max-w-lg mx-auto mt-2">
            {passed
              ? allLessonsCompleted
                ? 'Has cumplido con todos los requisitos curriculares y de evaluación clínica. Tu certificado oficial de acreditación ya está disponible.'
                : 'Aprobaste el examen, pero aún tienes lecciones pendientes en el visor. Complétalas para desbloquear tu certificado.'
              : 'No alcanzaste la nota mínima de aprobación. Revisa la retroalimentación médica de cada pregunta y vuelve a intentarlo.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {!passed && (
              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                Reintentar Evaluación
              </button>
            )}

            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Volver al Curso
            </Link>
          </div>
        </div>
      )}

      {/* Render Issued Certificate if passed and 100% completed */}
      {isSubmitted && passed && allLessonsCompleted && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg border-b border-slate-200 pb-2">
            <Award className="w-6 h-6 text-amber-500" />
            <h3>Tu Certificado Oficial de Capacitación</h3>
          </div>

          {issuedCert ? (
            <CertificateViewer certificate={issuedCert} allowDownload={true} />
          ) : (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Generando registro y código de acreditación...</p>
            </div>
          )}
        </div>
      )}

      {/* Question Cards List */}
      <div className="space-y-6">
        {questions.map((question, qIdx) => {
          const isCorrect = isSubmitted && selectedAnswers[qIdx] === question.correct_option_index;
          const isIncorrect = isSubmitted && selectedAnswers[qIdx] !== question.correct_option_index;

          return (
            <div
              key={question.id || qIdx}
              className={`bg-white rounded-2xl border p-6 transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20 shadow-xs'
                    : 'border-red-300 bg-red-50/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  Pregunta {qIdx + 1} de {totalQuestions}
                </span>

                {isSubmitted && (
                  <span
                    className={`text-xs font-bold flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correcta (+1)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Incorrecta
                      </>
                    )}
                  </span>
                )}
              </div>

              <h3 className="text-sm md:text-base font-semibold text-slate-900 leading-snug mb-4">
                {question.question_text}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {question.options.map((optText, optIdx) => {
                  const isSelected = selectedAnswers[qIdx] === optIdx;
                  const isOptionCorrect = optIdx === question.correct_option_index;

                  let optStyles = 'border-slate-200 bg-white hover:border-blue-400 text-slate-700';

                  if (isSelected && !isSubmitted) {
                    optStyles = 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20';
                  }

                  if (isSubmitted) {
                    if (isOptionCorrect) {
                      optStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                    } else if (isSelected && !isOptionCorrect) {
                      optStyles = 'border-red-400 bg-red-50 text-red-950';
                    } else {
                      optStyles = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-start gap-3 ${optStyles}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300 text-slate-500'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="leading-snug">{optText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Pedagogical Explanation for Medical Training */}
              {isSubmitted && question.explanation && (
                <div className="mt-4 pt-3 border-t border-slate-200/70 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Justificación y Criterio Clínico:</span>
                  </div>
                  <p className="leading-relaxed text-slate-600">{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button Bar */}
      {!isSubmitted && (
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur border border-slate-200 p-4 rounded-2xl shadow-lg flex items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            Preguntas respondidas:{' '}
            <strong className="text-blue-700 font-bold">
              {answeredCount} de {totalQuestions}
            </strong>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            Finalizar y Calificar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
