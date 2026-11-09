import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Bell,
  BellOff,
  Plus,
  Send,
  Sparkles,
  HelpCircle,
  Filter,
  Check,
  User,
  ArrowRight,
  ShieldCheck,
  X,
  Volume2,
} from 'lucide-react';
import { DoubtQuestion, DoubtAnswer, AcademicClass, AcademicSubject } from '../types';
import { playNotificationChime } from '../utils/helpers';

interface DiscussionForumProps {
  doubts: DoubtQuestion[];
  onAddDoubt: (doubt: DoubtQuestion) => void;
  onAddAnswer: (questionId: string, answer: DoubtAnswer) => void;
  onToggleUpvoteDoubt: (questionId: string) => void;
  onToggleUpvoteAnswer: (questionId: string, answerId: string) => void;
  onMarkAcceptedAnswer: (questionId: string, answerId: string) => void;
  onToggleNotification: (questionId: string) => void;
  soundEnabled: boolean;
  languageMode: 'en' | 'roman';
}

export const DiscussionForum: React.FC<DiscussionForumProps> = ({
  doubts,
  onAddDoubt,
  onAddAnswer,
  onToggleUpvoteDoubt,
  onToggleUpvoteAnswer,
  onMarkAcceptedAnswer,
  onToggleNotification,
  soundEnabled,
  languageMode,
}) => {
  const [selectedClass, setSelectedClass] = useState<AcademicClass>('All Classes');
  const [selectedSubject, setSelectedSubject] = useState<AcademicSubject>('All Subjects');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unsolved' | 'solved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [activeThread, setActiveThread] = useState<DoubtQuestion | null>(null);

  // New doubt form state
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newClass, setNewClass] = useState<AcademicClass>('Class 10');
  const [newSubject, setNewSubject] = useState<AcademicSubject>('Mathematics');
  const [newAuthor, setNewAuthor] = useState('');
  const [newNotify, setNewNotify] = useState(true);

  // New answer form state
  const [answerText, setAnswerText] = useState('');
  const [answerAuthor, setAnswerAuthor] = useState('');
  const [aiSolving, setAiSolving] = useState(false);

  // Filter doubts
  const filteredDoubts = doubts.filter((d) => {
    const matchClass = selectedClass === 'All Classes' || d.className === selectedClass;
    const matchSubject = selectedSubject === 'All Subjects' || d.subject === selectedSubject;
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'solved' && d.isSolved) ||
      (filterStatus === 'unsolved' && !d.isSolved);
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      d.title.toLowerCase().includes(q) ||
      d.details.toLowerCase().includes(q) ||
      d.subject.toLowerCase().includes(q) ||
      d.className.toLowerCase().includes(q);

    return matchClass && matchSubject && matchStatus && matchQuery;
  });

  const handleCreateDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDetails.trim() || !newAuthor.trim()) return;

    const newQuestion: DoubtQuestion = {
      id: `doubt-${Date.now()}`,
      title: newTitle.trim(),
      details: newDetails.trim(),
      className: newClass,
      subject: newSubject,
      authorName: newAuthor.trim(),
      createdAt: 'Just now',
      upvotes: 1,
      isUpvoted: true,
      notifyReplies: newNotify, // Specifically requested toggle
      isSolved: false,
      tags: [newSubject, newClass],
      answers: [],
    };

    onAddDoubt(newQuestion);
    setIsAskModalOpen(false);
    setNewTitle('');
    setNewDetails('');
    setNewAuthor('');
  };

  const handlePostAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !answerText.trim()) return;

    const newAnswer: DoubtAnswer = {
      id: `ans-${Date.now()}`,
      questionId: activeThread.id,
      authorName: answerAuthor.trim() || 'Student Contributor',
      authorRole: 'Peer Tutor',
      createdAt: 'Just now',
      content: answerText.trim(),
      upvotes: 1,
      isAccepted: false,
    };

    onAddAnswer(activeThread.id, newAnswer);

    // Update locally active thread view
    setActiveThread((prev) =>
      prev
        ? {
            ...prev,
            answers: [...prev.answers, newAnswer],
          }
        : null
    );

    setAnswerText('');

    if (activeThread.notifyReplies && soundEnabled) {
      playNotificationChime();
    }
  };

  // AI Instant Doubt Solver
  const handleSolveWithAI = async () => {
    if (!activeThread) return;
    setAiSolving(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentContext: {
            className: activeThread.className,
            subject: activeThread.subject,
            mode: 'doubt_solver',
          },
          messages: [
            {
              role: 'user',
              content: `Please solve this student's doubt with step-by-step clarity:
Title: ${activeThread.title}
Academic Level: ${activeThread.className}
Subject: ${activeThread.subject}
Details / Problem:
${activeThread.details}`,
            },
          ],
        }),
      });

      if (!res.ok) throw new Error('Failed to solve doubt with AI');
      const data = await res.json();

      const aiAnswer: DoubtAnswer = {
        id: `ans-ai-${Date.now()}`,
        questionId: activeThread.id,
        authorName: 'TalibIlm AI Tutor',
        authorRole: 'AI Tutor',
        createdAt: 'Just now',
        content: data.reply,
        upvotes: 5,
        isAccepted: false,
      };

      onAddAnswer(activeThread.id, aiAnswer);

      setActiveThread((prev) =>
        prev ? { ...prev, answers: [...prev.answers, aiAnswer] } : null
      );

      if (activeThread.notifyReplies && soundEnabled) {
        playNotificationChime();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiSolving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Forum Community Spotlight Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 rounded-2xl border border-slate-800 p-6 sm:p-8 mb-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
              <MessageSquare className="w-4 h-4" />
              <span>STUDENT DOUBT CLEARANCE FORUM</span>
              <span aria-hidden="true">·</span>
              <span>PEER HELP & VERIFIED ANSWERS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white [text-wrap:balance]">
              {languageMode === 'roman'
                ? 'Koi Sawal Ya Doubt Samajh Nahi Aa Raha? Yahan Poochein'
                : 'Stuck on a Formula, Concept or Homework Problem? Ask Here'}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {languageMode === 'roman'
                ? 'Apni class or subject ke mutabiq doubt post karein. Students ek doosre ki madad karte hain aur replies notification toggle se aapko foran alert milta hai!'
                : 'Post your doubts with subjects and class tags. Receive peer explanations, vote on the best solutions, and toggle instant reply alerts.'}
            </p>
          </div>

          <button
            onClick={() => setIsAskModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-lg shadow-emerald-600/30 transition-all whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{languageMode === 'roman' ? 'Ask a New Doubt' : 'Ask a Question'}</span>
          </button>
        </div>
      </div>

      {/* Forum Filters & Search Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value as AcademicClass)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="All Classes">All Classes</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
            <option value="MDCAT / Pre-Med">MDCAT</option>
            <option value="ECAT / Pre-Eng">ECAT</option>
            <option value="BS / University">BS / University</option>
          </select>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as AcademicSubject)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="All Subjects">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Computer Science">Computer Science</option>
            <option value="English">English</option>
          </select>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All Doubts
            </button>
            <button
              onClick={() => setFilterStatus('unsolved')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterStatus === 'unsolved'
                  ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Needs Answer
            </button>
            <button
              onClick={() => setFilterStatus('solved')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                filterStatus === 'solved'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Solved
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search doubts or topics..."
          className="text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none w-48 sm:w-64"
        />
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredDoubts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              No questions found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Be the first student to post a doubt in this subject category!
            </p>
            <button
              onClick={() => setIsAskModalOpen(true)}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
            >
              Ask a Doubt
            </button>
          </div>
        ) : (
          filteredDoubts.map((doubt) => (
            <div
              key={doubt.id}
              onClick={() => setActiveThread(doubt)}
              className="group flex items-start gap-4 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer shadow-sm"
            >
              {/* Upvote Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleUpvoteDoubt(doubt.id);
                }}
                className={`flex flex-col items-center justify-center min-w-[44px] h-[52px] rounded-xl border transition-colors ${
                  doubt.isUpvoted
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-400 text-indigo-700 dark:text-indigo-300'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                }`}
                title="Upvote if this doubt is helpful or relevant"
              >
                <ThumbsUp className="w-4 h-4 mb-0.5" />
                <span className="text-xs font-bold tabular-nums">{doubt.upvotes}</span>
              </button>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                {/* Unboxed Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {doubt.className}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{doubt.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span>By {doubt.authorName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{doubt.createdAt}</span>

                  {/* Solved Status */}
                  {doubt.isSolved ? (
                    <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 ml-auto">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Solved</span>
                    </span>
                  ) : (
                    <span className="font-semibold text-amber-600 dark:text-amber-400 ml-auto">
                      Needs Answer
                    </span>
                  )}
                </div>

                {/* Question Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                  {doubt.title}
                </h3>

                {/* Details snippet */}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {doubt.details}
                </p>

                {/* Bottom Bar: Answers Count & Notification Toggle Button */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{doubt.answers.length} {doubt.answers.length === 1 ? 'answer' : 'answers'}</span>
                    </span>
                  </div>

                  {/* Notification Toggle Button requested by user */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleNotification(doubt.id);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                      doubt.notifyReplies
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800'
                    }`}
                    title="Toggle notifications for new replies"
                  >
                    {doubt.notifyReplies ? (
                      <>
                        <Bell className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        <span>Reply Alerts: On</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="w-3 h-3 text-slate-400" />
                        <span>Reply Alerts: Off</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ask a Doubt Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Ask a Question / Post Doubt
                </h3>
              </div>
              <button
                onClick={() => setIsAskModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoubt} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Question / Doubt Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Why is work done in a uniform circular orbit zero?"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Class / Grade *
                  </label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value as AcademicClass)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="MDCAT / Pre-Med">MDCAT</option>
                    <option value="ECAT / Pre-Eng">ECAT</option>
                    <option value="BS / University">BS / University</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject *
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as AcademicSubject)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="English">English</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Details / What have you tried so far? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Explain your confusion, formula steps you tried, or what textbook rule isn't making sense..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Your Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Daniyal Khan"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Notification Toggle for Replies (User Requested) */}
              <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      Reply Notifications
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Get instant alerts when someone answers your doubt.
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={newNotify}
                  onChange={(e) => setNewNotify(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAskModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Thread Detail Modal */}
      {activeThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
            {/* Thread Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {activeThread.className}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeThread.subject}</span>
                <span aria-hidden="true">·</span>
                <span>Asked by {activeThread.authorName}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* Reply Notification Toggle in Header */}
                <button
                  onClick={() => onToggleNotification(activeThread.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                    activeThread.notifyReplies
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                  title="Toggle notifications for this discussion"
                >
                  {activeThread.notifyReplies ? (
                    <>
                      <Bell className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span>Notifications: ON</span>
                    </>
                  ) : (
                    <>
                      <BellOff className="w-3.5 h-3.5 text-slate-400" />
                      <span>Notifications: OFF</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setActiveThread(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thread Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Question Box */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeThread.title}
                </h2>
                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {activeThread.details}
                </p>

                {/* Instant AI Solve Trigger */}
                <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <ThumbsUp className="w-4 h-4 text-indigo-600" />
                    <span>{activeThread.upvotes} students found this helpful</span>
                  </div>

                  <button
                    onClick={handleSolveWithAI}
                    disabled={aiSolving}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{aiSolving ? 'TalibIlm AI is formulating solution...' : 'Ask AI to Solve This Doubt'}</span>
                  </button>
                </div>
              </div>

              {/* Answers Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-emerald-500" />
                    <span>{activeThread.answers.length} Answers from Peers & Tutors</span>
                  </h3>
                </div>

                <div className="space-y-4">
                  {activeThread.answers.length === 0 ? (
                    <p className="text-xs text-slate-500 py-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      No answers posted yet. Click "Ask AI to Solve" or be the first classmate to answer!
                    </p>
                  ) : (
                    activeThread.answers.map((ans) => (
                      <div
                        key={ans.id}
                        className={`p-4 sm:p-5 rounded-xl border transition-all ${
                          ans.isAccepted
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-400 dark:border-emerald-700 ring-1 ring-emerald-400'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {/* Answer Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              {ans.authorName}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                ans.authorRole === 'AI Tutor'
                                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                                  : ans.authorRole === 'Subject Topper'
                                  ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              {ans.authorRole}
                            </span>
                            <span className="text-[10px] text-slate-400 tabular-nums">
                              {ans.createdAt}
                            </span>
                          </div>

                          {/* Upvote & Accepted Solution Tag */}
                          <div className="flex items-center gap-2">
                            {ans.isAccepted ? (
                              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Accepted Solution</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => onMarkAcceptedAnswer(activeThread.id, ans.id)}
                                className="text-xs text-slate-400 hover:text-emerald-600 transition-colors"
                                title="Mark as accepted solution"
                              >
                                Mark as Solved
                              </button>
                            )}

                            <button
                              onClick={() => onToggleUpvoteAnswer(activeThread.id, ans.id)}
                              className="flex items-center gap-1 px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span className="tabular-nums font-semibold">{ans.upvotes}</span>
                            </button>
                          </div>
                        </div>

                        {/* Answer Body */}
                        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-mono sm:font-sans whitespace-pre-wrap leading-relaxed">
                          {ans.content}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Post Answer Form */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                  Post Your Answer or Explanation:
                </h4>
                <form onSubmit={handlePostAnswer} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={answerAuthor}
                      onChange={(e) => setAnswerAuthor(e.target.value)}
                      placeholder="Your name / pseudonym (e.g. Farhan FSc-II)"
                      className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <textarea
                    required
                    rows={3}
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Write detailed explanation, step-by-step formula or reasoning to help this student..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 font-mono sm:font-sans"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Markdown and math formulas supported
                    </span>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Answer</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
