import React, { useState } from 'react';
import {
  X,
  Settings,
  Palette,
  Globe,
  Bell,
  Sparkles,
  Trash2,
  Check,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Laptop,
  BookOpen,
  RotateCcw,
  Sliders,
  Award,
} from 'lucide-react';
import { AppSettings, AccentColor, AppLanguage, TargetBoard, ExplanationDepth } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearChatHistory?: () => void;
  onResetLibrary?: () => void;
}

const ACCENT_OPTIONS: { id: AccentColor; name: string; bgClass: string; borderClass: string }[] = [
  { id: 'indigo', name: 'Royal Indigo', bgClass: 'bg-indigo-600', borderClass: 'border-indigo-600' },
  { id: 'emerald', name: 'Emerald Green', bgClass: 'bg-emerald-600', borderClass: 'border-emerald-600' },
  { id: 'rose', name: 'Rose Crimson', bgClass: 'bg-rose-600', borderClass: 'border-rose-600' },
  { id: 'violet', name: 'Deep Violet', bgClass: 'bg-violet-600', borderClass: 'border-violet-600' },
  { id: 'cyan', name: 'Ocean Cyan', bgClass: 'bg-cyan-600', borderClass: 'border-cyan-600' },
  { id: 'amber', name: 'Amber Gold', bgClass: 'bg-amber-600', borderClass: 'border-amber-600' },
];

const TARGET_BOARDS: TargetBoard[] = [
  'Punjab Board (BISE)',
  'Federal Board (FBISE)',
  'Sindh Board (BIEK)',
  'KPK Board',
  'Cambridge (O/A Level)',
  'MDCAT / PMC Scheme',
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onClearChatHistory,
  onResetLibrary,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'language' | 'ai' | 'audio' | 'data'>('appearance');
  const [resetConfirm, setResetConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 id="settings-title" className="text-base font-bold text-slate-900 dark:text-white">
                Website Settings & Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize appearance, theme colors, language, board curriculum, and AI tutor
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 bg-white dark:bg-slate-900 overflow-x-auto gap-2 py-2">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'appearance'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Colors & Theme</span>
          </button>

          <button
            onClick={() => setActiveTab('language')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'language'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Language & Board</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Tutor Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('audio')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'audio'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Audio & Alerts</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'data'
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Storage & Cache</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: APPEARANCE & THEME COLORS */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Theme Mode */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Display Mode (Light / Dark)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'light' })}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-medium transition-all ${
                      settings.theme === 'light'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Light Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'dark' })}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-medium transition-all ${
                      settings.theme === 'dark'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-500" />
                    <span>Dark Mode</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ theme: 'system' })}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-medium transition-all ${
                      settings.theme === 'system'
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Laptop className="w-4 h-4 text-slate-500" />
                    <span>Auto (System)</span>
                  </button>
                </div>
              </div>

              {/* Accent Color Palette */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Brand & Accent Color Palette
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ACCENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => onUpdateSettings({ accentColor: opt.id })}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        settings.accentColor === opt.id
                          ? 'border-slate-900 dark:border-white ring-2 ring-indigo-500/20 bg-slate-50 dark:bg-slate-800/60'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full ${opt.bgClass} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                        {settings.accentColor === opt.id && <Check className="w-3 h-3 stroke-[3]" />}
                      </span>
                      <span className="text-xs font-medium text-slate-900 dark:text-white">
                        {opt.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reading Font Size */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Reading Text & Note Viewer Font Size
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(
                    [
                      { id: 'compact', label: 'Compact (14px)', desc: 'Fit more formulas on screen' },
                      { id: 'normal', label: 'Standard (16px)', desc: 'Balanced comfortable reading' },
                      { id: 'large', label: 'Large (18px)', desc: 'Clear diagrams & derivations' },
                    ] as const
                  ).map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => onUpdateSettings({ fontSize: size.id })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        settings.fontSize === size.id
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {size.label}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {size.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LANGUAGE & CURRICULUM */}
          {activeTab === 'language' && (
            <div className="space-y-6">
              {/* Primary Language */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Website Language & Explanation Mode
                </label>
                <div className="space-y-2">
                  {(
                    [
                      {
                        id: 'roman',
                        title: 'Roman Urdu (Bilingual Urdu/English)',
                        desc: 'Asaan Roman Urdu me explanations, definitions, and study advice. Recommended for Pakistani students.',
                      },
                      {
                        id: 'en',
                        title: 'English (Academic Technical)',
                        desc: 'Pure English textbook terminology aligned with Cambridge O/A Levels & Federal Board exam papers.',
                      },
                      {
                        id: 'urdu',
                        title: 'اردو (Urdu Script Support)',
                        desc: 'Urdu Nastaliq academic terms for Islamiat, Mutalia Pakistan, and Urdu Lazmi syllabus.',
                      },
                    ] as const
                  ).map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => onUpdateSettings({ language: lang.id as AppLanguage })}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                        settings.language === lang.id
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          {lang.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {lang.desc}
                        </div>
                      </div>
                      {settings.language === lang.id && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Board Curriculum */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  Default Target Board Examination
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  The AI model paper generator and past questions will align strictly with this examination board.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TARGET_BOARDS.map((board) => (
                    <button
                      key={board}
                      type="button"
                      onClick={() => onUpdateSettings({ targetBoard: board })}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between ${
                        settings.targetBoard === board
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{board}</span>
                      {settings.targetBoard === board && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI TUTOR PREFERENCES */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                  AI Explanation Depth & Output Style
                </label>
                <div className="space-y-2.5">
                  {(
                    [
                      {
                        id: 'exam_focused',
                        title: '🎯 Board Exam Scoring (Marking Scheme & Headings)',
                        desc: 'Points structured specifically to score maximum marks in 4-mark and 8-mark board questions with diagrams.',
                      },
                      {
                        id: 'quick_summary',
                        title: '⚡ Rapid Revision & High-Yield Bullet Points',
                        desc: 'Ultra-concise key formulas, definitions, and one-liner facts for night-before-exam revision.',
                      },
                      {
                        id: 'in_depth',
                        title: '🔬 In-Depth First-Principles Concept & Derivations',
                        desc: 'Step-by-step mathematical breakdown, real-world analogies, and underlying physics/chemical mechanisms.',
                      },
                    ] as const
                  ).map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => onUpdateSettings({ explanationDepth: style.id as ExplanationDepth })}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start justify-between gap-3 ${
                        settings.explanationDepth === style.id
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white">
                          {style.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {style.desc}
                        </div>
                      </div>
                      {settings.explanationDepth === style.id && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Automatic Notes Offline Saving */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Auto-Save AI Generated Diagrams & Solutions
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Automatically keep SVG diagrams and solved derivations available in offline browser storage.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSaveDownloads}
                  onChange={(e) => onUpdateSettings({ autoSaveDownloads: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-700 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 4: AUDIO & ALERTS */}
          {activeTab === 'audio' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      In-App Sound Chimes & Audio Feedback
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Play pleasant audio chime when doubt answers arrive or ratings are submitted.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    settings.soundEnabled
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {settings.soundEnabled ? 'Enabled' : 'Muted'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                  💡 Notification Alerts Included
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                  <li>When a teacher or classmate answers your doubt</li>
                  <li>When someone likes or rates your uploaded notes</li>
                  <li>When an AI Model Paper or 30-Day Revision Timetable finishes generating</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 5: STORAGE & DATA RESET */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/10 space-y-4">
                <div className="flex items-start gap-3">
                  <Trash2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                      Clear Cache & Reset Study Library
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Clear your local AI chat session and saved bookmarks. This will not delete public forum questions.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {onClearChatHistory && (
                    <button
                      type="button"
                      onClick={() => {
                        onClearChatHistory();
                        alert('AI Tutor chat session has been cleared!');
                      }}
                      className="px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      Clear AI Tutor Messages
                    </button>
                  )}

                  {onResetLibrary && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Reset your saved notes bookmarks to default?')) {
                          onResetLibrary();
                        }
                      }}
                      className="px-3 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                    >
                      Reset Saved Bookmarks
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Changes are automatically saved to your browser session.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
