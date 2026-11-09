import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  User,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  BrainCircuit,
  FileQuestion,
  Lightbulb,
  ArrowRight,
  Download,
  AlertCircle,
  Palette,
  Image as ImageIcon,
  Calendar,
  FileText,
  Printer,
  Clock,
  Award,
} from 'lucide-react';
import { AcademicClass, AcademicSubject, QuizQuestion, AppSettings, TargetBoard } from '../types';
import { DiagramRenderer, parseMessageContent } from './DiagramRenderer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AiStudyAssistantProps {
  initialPrompt?: string;
  initialSubject?: AcademicSubject;
  initialClass?: AcademicClass;
  languageMode: 'en' | 'roman';
  settings?: AppSettings;
}

const PRESET_PROMPTS = [
  {
    label: '🫀 Draw Heart on Paper (Image)',
    prompt: 'MUJHE DIAGRAM BANA KE DO HEART KA IMAGE PAPER PE OR USKE FUNTION BHI LIKHNA HANDWIRTING HO BANAO IMAGE',
    subject: 'Biology',
    className: 'Class 11',
  },
  {
    label: '🎨 Draw Plant Cell',
    prompt: 'Plant Cell ka complete labeled scientific diagram bana ke do with cell wall, nucleus, vacuole and chloroplast.',
    subject: 'Biology',
    className: 'Class 9',
  },
  {
    label: '🎨 Draw Benzene Ring',
    prompt: 'Benzene ring ka chemical structure aur alternating double bonds ka visual diagram draw karo with explanation.',
    subject: 'Chemistry',
    className: 'Class 12',
  },
  {
    label: 'Math: Solve Quadratic Eq',
    prompt: 'Please solve 2x² - 7x + 3 = 0 step-by-step using the quadratic formula with the discriminant.',
    subject: 'Mathematics',
    className: 'Class 10',
  },
  {
    label: 'Physics: Projectile Motion',
    prompt: 'Derive the maximum horizontal range formula for projectile motion and explain why θ = 45° gives maximum distance.',
    subject: 'Physics',
    className: 'Class 11',
  },
  {
    label: 'Biology: Mitosis vs Meiosis',
    prompt: 'Give a comprehensive comparison table between Mitosis and Meiosis, highlighting Anaphase I and crossing over.',
    subject: 'Biology',
    className: 'MDCAT / Pre-Med',
  },
  {
    label: 'CS: Binary Search vs Linear',
    prompt: 'Explain Binary Search algorithm in C++ with time complexity O(log N) and when it fails on unsorted arrays.',
    subject: 'Computer Science',
    className: 'Class 12',
  },
];

const PRESET_DIAGRAMS = [
  {
    title: '🫀 Human Heart on Ruled Paper',
    topic: 'Human Heart anatomy on ruled notebook paper with handwritten labels and functions of all 4 chambers and valves',
    subject: 'Biology',
    className: 'Class 11',
  },
  {
    title: 'Plant Cell Structure',
    topic: 'Plant cell with labeled cell wall, cell membrane, large central vacuole, nucleus, and chloroplasts',
    subject: 'Biology',
    className: 'Class 9',
  },
  {
    title: 'Benzene Structure & Resonance',
    topic: 'Benzene hexagonal ring with alternating double bonds and delocalized electron pi-cloud',
    subject: 'Chemistry',
    className: 'Class 12',
  },
  {
    title: 'Neuron & Synapse Structure',
    topic: 'Motor neuron anatomy showing dendrites, cell body soma, axon with myelin sheath, and synaptic terminal',
    subject: 'Biology',
    className: 'MDCAT / Pre-Med',
  },
  {
    title: 'Projectile Motion Trajectory',
    topic: 'Parabolic trajectory curve showing launch angle theta, velocity components Vx and Vy, maximum height H, and range R',
    subject: 'Physics',
    className: 'Class 11',
  },
  {
    title: 'Resistors in Series & Parallel',
    topic: 'Electric circuit showing battery connected to two resistors in series and two resistors in parallel with current flow arrows',
    subject: 'Physics',
    className: 'Class 10',
  },
  {
    title: 'Binary Search Tree (BST)',
    topic: 'Binary search tree data structure showing root node 50, left subtree smaller values, and right subtree larger values',
    subject: 'Computer Science',
    className: 'Class 12',
  },
];

export const AiStudyAssistant: React.FC<AiStudyAssistantProps> = ({
  initialPrompt,
  initialSubject = 'Physics',
  initialClass = 'Class 11',
  languageMode,
  settings,
}) => {
  const [selectedClass, setSelectedClass] = useState<AcademicClass>(initialClass);
  const [selectedSubject, setSelectedSubject] = useState<AcademicSubject>(initialSubject);
  const [activeMode, setActiveMode] = useState<'chat' | 'diagram' | 'quiz' | 'summarizer' | 'timetable' | 'paper'>('chat');

  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Assalam-o-Alaikum! Main aapka **TalibIlm AI Study Tutor & Visualizer** hoon.
Aap mujhse:
- **🎨 Visual Diagrams & Structures:** Biology cells, Chemistry organic structures (Benzene rings, bonds), Physics circuits aur optical ray diagrams banwa sakte hain (jinhe aap **Image / PNG form me foran download** bhi kar sakte hain!)
- **📐 Step-by-Step Problem Solving:** Math derivations aur numerical solutions
- **📝 Exam Practice:** Automated practice quizzes aur formula sheets

Aap kis topic ka diagram ya question poochna chahte hain?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Diagram Generator state
  const [diagramTopic, setDiagramTopic] = useState('Plant cell structure with labeled cell wall, vacuole, chloroplast and nucleus');
  const [diagramLoading, setDiagramLoading] = useState(false);
  const [generatedDiagram, setGeneratedDiagram] = useState<{
    topic: string;
    svg: string | null;
    fullExplanation: string;
  } | null>(null);

  // Quiz Mode state
  const [quizTopic, setQuizTopic] = useState('Newton\'s Laws of Motion');
  const [quizLoading, setQuizLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[] | null>(null);
  const [userQuizAnswers, setUserQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizChecked, setQuizChecked] = useState(false);

  // Summarizer state
  const [summaryInput, setSummaryInput] = useState('');
  const [summaryResult, setSummaryResult] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Timetable & Revision Planner state
  const [planDays, setPlanDays] = useState<number>(30);
  const [planWeakAreas, setPlanWeakAreas] = useState<string>('Core derivations, numericals, and diagram labeling');
  const [planTargetGrade, setPlanTargetGrade] = useState<string>('A+');
  const [planResult, setPlanResult] = useState<string | null>(null);
  const [planLoading, setPlanLoading] = useState(false);

  // Model Examination Paper state
  const [paperTopic, setPaperTopic] = useState('Full Book / Mid-Term Syllabus');
  const [paperBoard, setPaperBoard] = useState(settings?.targetBoard || 'Punjab Board (BISE)');
  const [paperResult, setPaperResult] = useState<string | null>(null);
  const [paperLoading, setPaperLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt) {
      setInputPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentContext: {
            className: selectedClass,
            subject: selectedSubject,
            mode: 'tutor',
          },
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!data || !data.reply) {
        throw new Error(data?.error || `Unable to load response (Status ${response.status})`);
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ ${error.message || 'Unable to connect to AI study service'}. Click below to retry.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetryLastMessage = () => {
    // Find the last user message
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      // Remove the last error message if present
      setMessages((prev) => prev.filter((m) => !m.id.startsWith('bot-err-')));
      handleSendMessage(lastUser.content);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `Assalam-o-Alaikum! Main aapka **TalibIlm AI Study Tutor** hoon.
Main ${selectedClass} ke ${selectedSubject} aur digar subjects me aapki madad ke liye tayyar hoon. Aap apna sawal, numerical ya formula likhein!`,
        timestamp: 'Just now',
      },
    ]);
  };

  const handleCopyMessage = (id: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Generate Interactive Practice Quiz
  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim() || quizLoading) return;
    setQuizLoading(true);
    setQuizChecked(false);
    setUserQuizAnswers({});

    try {
      const res = await fetch('/api/gemini/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizTopic,
          subject: selectedSubject,
          className: selectedClass,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate quiz');
      const data = await res.json();
      setGeneratedQuiz(data.quiz || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setQuizLoading(false);
    }
  };

  // Generate Dedicated Visual Diagram
  const handleGenerateDiagram = async (customTopic?: string) => {
    const topicToUse = customTopic || diagramTopic;
    if (!topicToUse.trim() || diagramLoading) return;

    setDiagramLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          subject: selectedSubject,
          className: selectedClass,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate diagram');
      const data = await res.json();
      setGeneratedDiagram(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setDiagramLoading(false);
    }
  };

  // Summarize Note / Chapter
  const handleSummarizeChapter = async () => {
    if (!summaryInput.trim() || summaryLoading) return;
    setSummaryLoading(true);

    try {
      const res = await fetch('/api/gemini/explain-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Student Chapter Excerpt',
          subject: selectedSubject,
          className: selectedClass,
          content: summaryInput,
        }),
      });

      if (!res.ok) throw new Error('Failed to summarize text');
      const data = await res.json();
      setSummaryResult(data.explanation || '');
    } catch (err: any) {
      console.error(err);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Generate 30-Day Exam Timetable & Revision Strategy
  const handleGenerateExamPlan = async () => {
    if (planLoading) return;
    setPlanLoading(true);

    try {
      const res = await fetch('/api/gemini/exam-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: selectedClass,
          subject: selectedSubject,
          daysUntilExam: planDays,
          weakAreas: planWeakAreas,
          targetGrade: planTargetGrade,
          language: languageMode,
        }),
      });

      const data = await res.json().catch(() => null);
      if (data?.plan) {
        setPlanResult(data.plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPlanLoading(false);
    }
  };

  // Generate Board Pattern Model Paper
  const handleGeneratePaper = async () => {
    if (paperLoading) return;
    setPaperLoading(true);

    try {
      const res = await fetch('/api/gemini/generate-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          className: selectedClass,
          subject: selectedSubject,
          topic: paperTopic,
          targetBoard: paperBoard || settings?.targetBoard || 'Punjab Board (BISE)',
        }),
      });

      const data = await res.json().catch(() => null);
      if (data?.paper) {
        setPaperResult(data.paper);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPaperLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Controls: Mode Tabs & Compact Academic Context */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6 p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Feature Mode Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveMode('chat')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeMode === 'chat'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Study Chat &amp; Doubt Solver</span>
          </button>
          <button
            onClick={() => setActiveMode('diagram')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeMode === 'diagram'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>🎨 Diagram &amp; Structure Creator (with Image Download)</span>
          </button>
          <button
            onClick={() => setActiveMode('quiz')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeMode === 'quiz'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Generate Practice Quiz</span>
          </button>
          <button
            onClick={() => setActiveMode('summarizer')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeMode === 'summarizer'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Chapter Summarizer &amp; Formulas</span>
          </button>
          <button
            onClick={() => setActiveMode('timetable')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeMode === 'timetable'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>📅 AI Revision Timetable</span>
          </button>
          <button
            onClick={() => setActiveMode('paper')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeMode === 'paper'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>📝 Board Model Paper 2026</span>
          </button>
        </div>

        {/* Compact Academic Context Selectors */}
        <div className="flex items-center gap-2 shrink-0 px-2 py-1 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden lg:inline">
            Class &amp; Subject:
          </span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value as AcademicClass)}
            className="text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer font-medium"
          >
            <option value="Class 9">Class 9 (Matric-I)</option>
            <option value="Class 10">Class 10 (Matric-II)</option>
            <option value="Class 11">Class 11 (FSc-I)</option>
            <option value="Class 12">Class 12 (FSc-II)</option>
            <option value="MDCAT / Pre-Med">MDCAT Prep</option>
            <option value="ECAT / Pre-Eng">ECAT Prep</option>
            <option value="BS / University">BS / University</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as AcademicSubject)}
            className="text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer font-medium"
          >
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="English">English</option>
            <option value="Economics & Commerce">Economics</option>
          </select>
        </div>
      </div>

      {/* MODE 1: CHAT & DOUBT SOLVER */}
      {activeMode === 'chat' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Quick Preset Prompts Bar */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="font-semibold text-slate-500 shrink-0">Quick Ask:</span>
              {PRESET_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSubject(p.subject as AcademicSubject);
                    setSelectedClass(p.className as AcademicClass);
                    handleSendMessage(p.prompt);
                  }}
                  className="px-2.5 py-1 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors whitespace-nowrap shrink-0 font-medium"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleClearChat}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 whitespace-nowrap shrink-0 px-2 py-1"
              title="Reset conversation"
            >
              Clear Chat
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white ${
                    msg.role === 'user'
                      ? 'bg-indigo-600'
                      : 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xs'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <BrainCircuit className="w-4 h-4 text-white" />
                  )}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span
                      className={`text-[10px] font-semibold ${
                        msg.role === 'user' ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'
                      }`}
                    >
                      {msg.role === 'user' ? 'You' : `TalibIlm AI (${selectedClass} · ${selectedSubject})`}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] opacity-60 tabular-nums">{msg.timestamp}</span>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="opacity-70 hover:opacity-100 transition-opacity p-0.5"
                          title="Copy explanation"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="prose dark:prose-invert max-w-none font-sans">
                    {parseMessageContent(msg.content).parts.map((part, pIdx) => {
                      if (part.type === 'svg') {
                        return (
                          <DiagramRenderer
                            key={pIdx}
                            svgContent={part.content}
                            title="Scientific Visual Diagram"
                          />
                        );
                      }
                      return (
                        <div key={pIdx} className="whitespace-pre-wrap leading-relaxed my-1">
                          {part.content}
                        </div>
                      );
                    })}
                  </div>

                  {msg.id.startsWith('bot-err-') && (
                    <button
                      onClick={handleRetryLastMessage}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Question</span>
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 max-w-3xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shrink-0 text-white shadow-xs">
                  <BrainCircuit className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span>Thinking & formulating step-by-step solution...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder={`Ask any question for ${selectedClass} ${selectedSubject} (e.g. Solve quadratic formula, derive Bernoulli eq)...`}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || loading}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODE 2: VISUAL DIAGRAM & STRUCTURE CREATOR */}
      {activeMode === 'diagram' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-400 mb-1.5">
              <Palette className="w-4 h-4" />
              <span>ACADEMIC VECTOR & IMAGE DIAGRAM GENERATOR</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              AI Scientific Diagram & Structure Creator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Generate labeled Biology cells, Chemistry organic structures, Physics electric circuits, or Computer Science trees. Every diagram can be inspected and <strong>downloaded directly as an image (PNG)</strong> for your exam notes!
            </p>

            {/* Quick Presets */}
            <div className="mt-4">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Popular Board Exam Diagrams (Click to Generate):
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_DIAGRAMS.map((diag, dIdx) => (
                  <button
                    key={dIdx}
                    onClick={() => {
                      setDiagramTopic(diag.topic);
                      setSelectedSubject(diag.subject as AcademicSubject);
                      setSelectedClass(diag.className as AcademicClass);
                      handleGenerateDiagram(diag.topic);
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-pink-50 hover:text-pink-700 dark:hover:bg-pink-950/60 dark:hover:text-pink-300 border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    {diag.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Diagram Input Form */}
            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={diagramTopic}
                onChange={(e) => setDiagramTopic(e.target.value)}
                placeholder="Describe any diagram (e.g. Chloroplast with thylakoids, Wheatstone bridge circuit, DNA double helix)..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-pink-500"
              />
              <button
                onClick={() => handleGenerateDiagram()}
                disabled={diagramLoading || !diagramTopic.trim()}
                className="px-5 py-2.5 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                <Palette className="w-4 h-4" />
                <span>{diagramLoading ? 'Drawing Diagram...' : 'Generate Diagram'}</span>
              </button>
            </div>
          </div>

          {/* Diagram Loading State */}
          {diagramLoading && (
            <div className="py-16 text-center space-y-3 border-t border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                TalibIlm AI is formulating scientific vectors, labeled parts & color schemes...
              </p>
              <p className="text-xs text-slate-400">
                Preparing high-resolution diagram with Image (PNG) download support.
              </p>
            </div>
          )}

          {/* Generated Diagram Display */}
          {!diagramLoading && generatedDiagram && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6">
              {/* Visual Diagram with Image PNG Download Button */}
              {generatedDiagram.svg ? (
                <DiagramRenderer
                  svgContent={generatedDiagram.svg}
                  title={generatedDiagram.topic}
                />
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-xs text-amber-800 dark:text-amber-200">
                  Diagram rendered in text format. See explanation below.
                </div>
              )}

              {/* Explanations & Exam Drawing Advice */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Scientific Breakdown & Exam Drawing Guide:</span>
                </h4>
                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
                  {generatedDiagram.fullExplanation.replace(/```(?:xml|svg)?\s*<svg[\s\S]*?<\/svg>\s*```/gi, '').trim()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: INTERACTIVE PRACTICE QUIZ */}
      {activeMode === 'quiz' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="max-w-2xl mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              AI Exam Practice Quiz Generator
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter any syllabus chapter or concept, and TalibIlm AI will formulate board-standard multiple choice questions with explanations.
            </p>

            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                placeholder="Topic: e.g. Electromagnetism, Cell Division, Quadratic Equations"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                onClick={handleGenerateQuiz}
                disabled={quizLoading || !quizTopic.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl shrink-0"
              >
                {quizLoading ? 'Generating...' : 'Create 4 MCQs'}
              </button>
            </div>
          </div>

          {generatedQuiz && generatedQuiz.length > 0 && (
            <div className="space-y-5 border-t border-slate-200 dark:border-slate-800 pt-6">
              {generatedQuiz.map((q, idx) => {
                const userChoice = userQuizAnswers[q.id];

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                  >
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                      Q{idx + 1}: {q.question}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle =
                          'p-2.5 rounded-lg text-xs font-medium border text-left transition-all ';

                        if (quizChecked) {
                          if (optIdx === q.correctIndex) {
                            btnStyle +=
                              'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                          } else if (userChoice === optIdx) {
                            btnStyle +=
                              'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200';
                          } else {
                            btnStyle +=
                              'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60';
                          }
                        } else {
                          if (userChoice === optIdx) {
                            btnStyle +=
                              'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300';
                          } else {
                            btnStyle +=
                              'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-indigo-300';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={quizChecked}
                            onClick={() =>
                              setUserQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                            }
                            className={btnStyle}
                          >
                            <span className="font-bold text-slate-400 mr-1.5 uppercase">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizChecked && (
                      <div className="mt-3 p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          Explanation:
                        </span>{' '}
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-slate-500">
                  {Object.keys(userQuizAnswers).length} of {generatedQuiz.length} answered
                </span>
                {!quizChecked ? (
                  <button
                    onClick={() => setQuizChecked(true)}
                    disabled={Object.keys(userQuizAnswers).length === 0}
                    className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl"
                  >
                    Check My Answers
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setUserQuizAnswers({});
                      setQuizChecked(false);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: CHAPTER SUMMARIZER & FORMULA EXTRACTOR */}
      {activeMode === 'summarizer' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            AI Chapter Summarizer & Formula Roadmap
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Paste any long paragraph, chapter notes, or syllabus text. TalibIlm AI will condense it into executive bullet points, key formulas, and probable board questions.
          </p>

          <textarea
            rows={5}
            value={summaryInput}
            onChange={(e) => setSummaryInput(e.target.value)}
            placeholder="Paste your lecture notes, textbook excerpt, or topic summary here..."
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 mb-3"
          />

          <button
            onClick={handleSummarizeChapter}
            disabled={summaryLoading || !summaryInput.trim()}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{summaryLoading ? 'Analyzing & Extracting...' : 'Generate Executive Breakdown'}</span>
          </button>

          {summaryResult && (
            <div className="mt-6 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3 uppercase tracking-wide">
                AI Synthesis & Key Takeaways:
              </h4>
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
                {summaryResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 4: AI REVISION TIMETABLE & STRATEGY PLANNER */}
      {activeMode === 'timetable' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1.5">
              <Calendar className="w-4 h-4" />
              <span>AI EXAM TIMETABLE & SMART REVISION ROADMAP</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              Smart Study Timetable & Target Score Strategist
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Personalized 4-phase revision schedule, daily 3-hour study blocks (Morning/Afternoon/Night), high-yield chapters, and board exam presentation tips tailored for {selectedClass} {selectedSubject}.
            </p>
          </div>

          {/* Configuration Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Days Until Exam:
              </label>
              <div className="flex gap-2">
                {[15, 30, 45, 60].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setPlanDays(d)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      planDays === d
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Score Goal:
              </label>
              <select
                value={planTargetGrade}
                onChange={(e) => setPlanTargetGrade(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold"
              >
                <option value="A+ (90%+ Topper)">A+ (90%+ Topper)</option>
                <option value="A Grade (80-89%)">A Grade (80-89%)</option>
                <option value="Solid 70%+ Pass">Solid 70%+ Pass</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Weak Areas to Target:
              </label>
              <input
                type="text"
                value={planWeakAreas}
                onChange={(e) => setPlanWeakAreas(e.target.value)}
                placeholder="e.g. Numericals, formulas, ray diagrams"
                className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateExamPlan}
            disabled={planLoading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
          >
            {planLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Formulating Your Revision Plan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate {planDays}-Day Timetable &amp; Revision Strategy</span>
              </>
            )}
          </button>

          {planResult && (
            <div className="mt-6 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20">
              <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-blue-100 dark:border-blue-900/50">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedClass} {selectedSubject} · {planDays}-Day AI Master Timetable
                  </h4>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(planResult);
                    alert('Revision timetable copied to clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Timetable</span>
                </button>
              </div>

              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
                {planResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 5: AI BOARD MODEL QUESTION PAPER 2026 GENERATOR */}
      {activeMode === 'paper' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1.5">
              <FileText className="w-4 h-4" />
              <span>OFFICIAL BOARD PATTERN EXAMINATION GENERATOR</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              AI Board Model Question Paper 2026
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Generates complete board question papers according to official scheme: Section A (MCQs), Section B (Short Questions with choice), and Section C (Theory + Numerical Long Questions) with chief examiner marking advice.
            </p>
          </div>

          {/* Form options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Examination Board:
              </label>
              <select
                value={paperBoard}
                onChange={(e) => setPaperBoard(e.target.value as TargetBoard)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold"
              >
                <option value="Punjab Board (BISE)">Punjab Board (BISE Lahore, Rawalpindi, Multan)</option>
                <option value="Federal Board (FBISE)">Federal Board (FBISE Islamabad - SLO Based)</option>
                <option value="Sindh Board (BIEK)">Sindh Board (BIEK Karachi & Hyderabad)</option>
                <option value="KPK Board">KPK Board (Peshawar & Abbottabad)</option>
                <option value="Cambridge (O/A Level)">Cambridge (CAIE O/A Level Scheme)</option>
                <option value="MDCAT / PMC Scheme">MDCAT / PMC Medical College Entrance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Syllabus Scope / Topic Coverage:
              </label>
              <input
                type="text"
                value={paperTopic}
                onChange={(e) => setPaperTopic(e.target.value)}
                placeholder="e.g. Full Book, or Chapters 1 to 5, or Mechanics & Heat"
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            onClick={handleGeneratePaper}
            disabled={paperLoading}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
          >
            {paperLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Assembling Board Standard Paper...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate {paperBoard} Model Paper</span>
              </>
            )}
          </button>

          {paperResult && (
            <div className="mt-6 p-6 rounded-2xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/20 dark:bg-purple-950/20">
              <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-purple-100 dark:border-purple-900/50">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {paperBoard} · {selectedClass} {selectedSubject}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(paperResult);
                      alert('Model paper copied to clipboard!');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Paper</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Paper</span>
                  </button>
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200 font-mono">
                {paperResult}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
