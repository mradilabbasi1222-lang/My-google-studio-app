import React, { useState } from 'react';
import {
  X,
  Download,
  Star,
  FileText,
  Sparkles,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Copy,
  Check,
  BrainCircuit,
  MessageSquare,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { StudyMaterial, QuizQuestion } from '../types';
import { downloadStudyDocument, formatCount } from '../utils/helpers';

interface DocumentViewerModalProps {
  material: StudyMaterial | null;
  onClose: () => void;
  onRateMaterial: (mat: StudyMaterial) => void;
  onIncrementDownload: (id: string) => void;
  onDirectAskAI: (prompt: string, contextSubject: string, contextClass: string) => void;
  languageMode: 'en' | 'roman';
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  material,
  onClose,
  onRateMaterial,
  onIncrementDownload,
  onDirectAskAI,
  languageMode,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'content' | 'ai_summary' | 'quiz' | 'reviews'>('content');
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizLoading, setQuizLoading] = useState<boolean>(false);

  if (!material) return null;

  const handleDownload = () => {
    onIncrementDownload(material.id);
    downloadStudyDocument(
      material.fileName,
      material.title,
      material.sampleContent,
      material.uploaderName,
      material.className,
      material.subject
    );
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(material.sampleContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Fetch AI explanation from server-side Gemini API
  const handleGenerateAISummary = async () => {
    if (aiSummary) {
      setActiveTab('ai_summary');
      return;
    }

    setActiveTab('ai_summary');
    setAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch('/api/gemini/explain-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: material.title,
          subject: material.subject,
          className: material.className,
          content: material.sampleContent,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate AI explanation');
      }

      const data = await res.json();
      setAiSummary(data.explanation);
    } catch (err: any) {
      setAiError(err.message || 'Could not fetch explanation from AI Tutor');
    } finally {
      setAiLoading(false);
    }
  };

  // Generate interactive practice quiz
  const handleGenerateQuiz = async () => {
    if (quizQuestions) {
      setActiveTab('quiz');
      return;
    }

    setActiveTab('quiz');
    setQuizLoading(true);
    try {
      const res = await fetch('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: material.title,
          subject: material.subject,
          className: material.className,
        }),
      });

      if (!res.ok) throw new Error('Quiz generation failed');
      const data = await res.json();
      setQuizQuestions(data.quiz || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {material.className}
                </span>
                <span aria-hidden="true">·</span>
                <span>{material.subject}</span>
                <span aria-hidden="true">·</span>
                <span>{material.type}</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                {material.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Nav Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'content'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Document Reader
            </button>
            <button
              onClick={handleGenerateAISummary}
              className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'ai_summary'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Summary & Formulas</span>
            </button>
            <button
              onClick={handleGenerateQuiz}
              className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'quiz'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-indigo-500" />
              <span>Practice Quiz</span>
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-1.5 px-3 py-1 font-medium rounded-md transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Reviews ({material.totalRatings})</span>
            </button>
          </div>

          {/* Reader Zoom & Copy Tools */}
          {activeTab === 'content' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Copy note text to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded p-0.5">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1 tabular-nums font-mono text-[11px] text-slate-500">
                  {zoomLevel}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(160, z + 10))}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Main Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70 dark:bg-slate-950">
          {activeTab === 'content' && (
            <div
              className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6 sm:p-10 transition-all"
              style={{ fontSize: `${(zoomLevel / 100) * 15}px` }}
            >
              {/* Document Sheet Header */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>TalibIlm Academic Archive · Page 1 of {material.pageCount}</span>
                  <span className="font-mono">{material.fileSize}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
                  {material.title}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Uploaded by <span className="font-semibold text-slate-700 dark:text-slate-300">{material.uploaderName}</span> {material.uploaderCollege && `(${material.uploaderCollege})`} on {material.uploadDate}
                </p>
              </div>

              {/* Document Text Body */}
              <pre className="font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed tracking-normal overflow-x-auto">
                {material.sampleContent}
              </pre>

              {/* Bottom Document Notice */}
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Verified Curriculum Reference Material</span>
                <button
                  onClick={handleDownload}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Complete File ({material.fileSize})</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai_summary' && (
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    TalibIlm AI Note Breakdown & Exam Predictions
                  </h3>
                </div>
                <button
                  onClick={() =>
                    onDirectAskAI(
                      `Explain key derivations from: ${material.title}`,
                      material.subject,
                      material.className
                    )
                  }
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Ask further in AI Chat →
                </button>
              </div>

              {aiLoading ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Analyzing chapter concepts, extracting formulas, and predicting board questions...
                  </p>
                </div>
              ) : aiError ? (
                <div className="p-4 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-semibold">Unable to analyze note right now</p>
                    <p className="text-xs mt-1">{aiError}</p>
                    <button
                      onClick={handleGenerateAISummary}
                      className="mt-2 text-xs font-bold underline"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {aiSummary}
                </div>
              )}
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Self-Assessment Quiz on this Topic
                  </h3>
                </div>
                <button
                  onClick={handleGenerateQuiz}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Regenerate Quiz
                </button>
              </div>

              {quizLoading ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Formulating exam-style multiple choice questions...
                  </p>
                </div>
              ) : !quizQuestions || quizQuestions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500">
                    Click "Practice Quiz" to generate automated MCQs for this material.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {quizQuestions.map((q, qIndex) => {
                    const isAnswered = selectedAnswers[q.id] !== undefined;
                    const userAnswer = selectedAnswers[q.id];
                    const isCorrect = userAnswer === q.correctIndex;

                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                      >
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                          {qIndex + 1}. {q.question}
                        </h4>

                        <div className="space-y-2">
                          {q.options.map((opt, optIndex) => {
                            let optionClass =
                              'w-full text-left p-2.5 rounded-lg text-xs font-medium border transition-all ';

                            if (quizSubmitted) {
                              if (optIndex === q.correctIndex) {
                                optionClass +=
                                  'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold';
                              } else if (userAnswer === optIndex) {
                                optionClass +=
                                  'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200';
                              } else {
                                optionClass +=
                                  'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 opacity-60';
                              }
                            } else {
                              if (userAnswer === optIndex) {
                                optionClass +=
                                  'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300';
                              } else {
                                optionClass +=
                                  'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300';
                              }
                            }

                            return (
                              <button
                                key={optIndex}
                                disabled={quizSubmitted}
                                onClick={() =>
                                  setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIndex }))
                                }
                                className={optionClass}
                              >
                                <span className="inline-block w-5 font-bold uppercase text-slate-400">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="mt-3 p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              Explanation:
                            </span>{' '}
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-xs text-slate-500">
                      Answered {Object.keys(selectedAnswers).length} of {quizQuestions.length}
                    </span>
                    {!quizSubmitted ? (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        disabled={Object.keys(selectedAnswers).length === 0}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white shadow-sm transition-colors"
                      >
                        Submit Quiz & Check Answers
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedAnswers({});
                          setQuizSubmitted(false);
                        }}
                        className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition-colors"
                      >
                        Retry Quiz
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                    {material.rating.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(material.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 tabular-nums">
                      Based on {material.totalRatings} student ratings
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRateMaterial(material)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
                >
                  Rate this Material
                </button>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {material.reviews.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">
                    No written reviews yet. Be the first to share your review!
                  </p>
                ) : (
                  material.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {rev.userName}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold tabular-nums">
                            {rev.rating}.0
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">{rev.date}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>{material.fileName}</span>
            <span aria-hidden="true">·</span>
            <span>{material.downloads} students downloaded</span>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
