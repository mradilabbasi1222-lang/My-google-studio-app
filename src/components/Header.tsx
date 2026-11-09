import React, { useState } from 'react';
import {
  GraduationCap,
  Bell,
  Sun,
  Moon,
  Upload,
  BookOpen,
  MessageSquare,
  Sparkles,
  BrainCircuit,
  Volume2,
  VolumeX,
  Check,
  ExternalLink,
  Video,
  Settings,
} from 'lucide-react';
import { InAppNotification } from '../types';

interface HeaderProps {
  activeTab: 'notes' | 'forum' | 'ai' | 'videos';
  setActiveTab: (tab: 'notes' | 'forum' | 'ai' | 'videos') => void;
  onOpenUpload: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  notifications: InAppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  languageMode: 'en' | 'roman';
  toggleLanguageMode: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
  isDarkMode,
  toggleDarkMode,
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications,
  soundEnabled,
  toggleSound,
  languageMode,
  toggleLanguageMode,
  onOpenSettings,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single Brand Wordmark */}
          <button
            onClick={() => setActiveTab('notes')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm shadow-indigo-200 dark:shadow-none group-hover:bg-indigo-700 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap font-display">
                Talib<span className="text-indigo-600 dark:text-indigo-400">Ilm</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 font-medium">
                Student Study Hub
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (single-line whitespace-nowrap) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'notes'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>{languageMode === 'roman' ? 'Notes & Books' : 'Study Notes'}</span>
            </button>

            <button
              onClick={() => setActiveTab('forum')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'forum'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>{languageMode === 'roman' ? 'Doubt Forum' : 'Discussion Forum'}</span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'ai'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BrainCircuit className="w-4 h-4 text-indigo-500" />
              <span>{languageMode === 'roman' ? 'AI Study Tutor' : 'AI Assistant'}</span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'videos'
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Video className="w-4 h-4 text-rose-500" />
              <span>{languageMode === 'roman' ? 'Video Lectures' : 'Study Videos'}</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Utility Toggles */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Mode Toggle (English / Roman Urdu) */}
            <button
              onClick={toggleLanguageMode}
              title={languageMode === 'en' ? 'Switch to Roman Urdu notes helper' : 'Switch to English'}
              className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {languageMode === 'en' ? 'EN' : 'اردو / Roman'}
            </button>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        Notifications
                      </h4>
                      {unreadCount > 0 && (
                        <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleSound}
                        title={soundEnabled ? 'Mute notification sound' : 'Enable notification chime'}
                        className="p-1 rounded text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                      >
                        {soundEnabled ? (
                          <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      {unreadCount > 0 && (
                        <button
                          onClick={onClearAllNotifications}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
                        No notifications yet. You will get alerts when students answer your doubts or rate your notes.
                      </p>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            onMarkNotificationRead(item.id);
                            if (item.targetTab) setActiveTab(item.targetTab);
                            setShowNotifications(false);
                          }}
                          className={`p-2.5 rounded-lg text-left cursor-pointer transition-colors border ${
                            item.read
                              ? 'bg-slate-50 dark:bg-slate-800/40 border-transparent opacity-75'
                              : 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40'
                          } hover:bg-slate-100 dark:hover:bg-slate-800`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white">
                              {item.title}
                            </span>
                            <span className="text-[10px] text-slate-400 tabular-nums">
                              {item.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                            {item.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Settings Modal Button */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                title="Website Settings & Colors"
                aria-label="Open settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}

            {/* Upload Notes CTA Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm shadow-indigo-200 dark:shadow-none transition-colors whitespace-nowrap shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>{languageMode === 'roman' ? 'Upload Notes / Book' : 'Upload Notes'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'notes'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'forum'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Doubt Forum
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            AI Tutor
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === 'videos'
                ? 'bg-rose-50 dark:bg-rose-950 text-rose-600 font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Videos
          </button>
        </div>
      </div>
    </header>
  );
};
