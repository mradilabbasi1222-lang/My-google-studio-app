import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { NotesExplorer } from './components/NotesExplorer';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { UploadModal } from './components/UploadModal';
import { RatingModal } from './components/RatingModal';
import { DiscussionForum } from './components/DiscussionForum';
import { AiStudyAssistant } from './components/AiStudyAssistant';
import { StudyVideosHub } from './components/StudyVideosHub';
import { SettingsModal } from './components/SettingsModal';
import {
  StudyMaterial,
  DoubtQuestion,
  DoubtAnswer,
  InAppNotification,
  AcademicClass,
  AcademicSubject,
  MaterialType,
  StudyVideo,
  AppSettings,
} from './types';
import {
  INITIAL_STUDY_MATERIALS,
  INITIAL_DOUBTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_STUDY_VIDEOS,
} from './data/mockData';
import { playNotificationChime } from './utils/helpers';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: 'indigo',
  fontSize: 'normal',
  language: 'roman',
  targetBoard: 'Punjab Board (BISE)',
  soundEnabled: true,
  explanationDepth: 'exam_focused',
  autoSaveDownloads: true,
};

export default function App() {
  // Settings state
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('talibilm_settings');
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return (
      localStorage.getItem('talibilm_theme') === 'dark' ||
      (!('talibilm_theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  });

  // Language helper state ('en' or 'roman' Urdu)
  const [languageMode, setLanguageMode] = useState<'en' | 'roman'>('roman');

  // Sound chime toggle
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'notes' | 'forum' | 'ai' | 'videos'>('notes');

  // Core data states with localStorage persistence
  const [videos, setVideos] = useState<StudyVideo[]>(() => {
    const saved = localStorage.getItem('talibilm_study_videos');
    if (saved) {
      try {
        const parsed: StudyVideo[] = JSON.parse(saved);
        return parsed.map((item) => {
          if (!item.videoUrl) {
            const match = INITIAL_STUDY_VIDEOS.find((iv) => iv.id === item.id);
            if (match?.videoUrl) {
              return { ...item, videoUrl: match.videoUrl };
            }
          }
          return item;
        });
      } catch {
        return INITIAL_STUDY_VIDEOS;
      }
    }
    return INITIAL_STUDY_VIDEOS;
  });

  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('talibilm_materials');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_MATERIALS;
  });

  const [doubts, setDoubts] = useState<DoubtQuestion[]>(() => {
    const saved = localStorage.getItem('talibilm_doubts');
    return saved ? JSON.parse(saved) : INITIAL_DOUBTS;
  });

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem('talibilm_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [savedMaterialIds, setSavedMaterialIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('talibilm_saved_ids');
    return saved ? JSON.parse(saved) : ['mat-1', 'mat-3'];
  });

  // Filters state
  const [selectedClass, setSelectedClass] = useState<AcademicClass>('All Classes');
  const [selectedSubject, setSelectedSubject] = useState<AcademicSubject>('All Subjects');
  const [selectedType, setSelectedType] = useState<MaterialType>('All Types');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null);
  const [ratingMaterial, setRatingMaterial] = useState<StudyMaterial | null>(null);

  // AI Chat Prefill Context
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>();
  const [aiInitialSubject, setAiInitialSubject] = useState<AcademicSubject>('Physics');
  const [aiInitialClass, setAiInitialClass] = useState<AcademicClass>('Class 11');

  // Toast banner state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('talibilm_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('talibilm_theme', 'light');
    }
  }, [isDarkMode]);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('talibilm_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('talibilm_doubts', JSON.stringify(doubts));
  }, [doubts]);

  useEffect(() => {
    localStorage.setItem('talibilm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('talibilm_saved_ids', JSON.stringify(savedMaterialIds));
  }, [savedMaterialIds]);

  useEffect(() => {
    localStorage.setItem('talibilm_study_videos', JSON.stringify(videos));
  }, [videos]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Video Lectures Handlers
  const handleUploadVideo = (newVid: StudyVideo) => {
    setVideos((prev) => [newVid, ...prev]);
    showToast(`Video lecture "${newVid.title}" published successfully!`);

    const newNotif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Video Lecture Published',
      message: `"${newVid.title}" is now available for ${newVid.className} students.`,
      timestamp: 'Just now',
      type: 'download',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    if (soundEnabled) playNotificationChime();
  };

  const handleLikeVideo = (videoId: string) => {
    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const nextLiked = !v.isLiked;
          return {
            ...v,
            isLiked: nextLiked,
            likes: nextLiked ? v.likes + 1 : Math.max(0, v.likes - 1),
          };
        }
        return v;
      })
    );
  };

  const handleAddVideoComment = (
    videoId: string,
    commentText: string,
    authorName: string,
    authorRole: 'Teacher' | 'Student'
  ) => {
    const newComment = {
      id: `vcomm-${Date.now()}`,
      videoId,
      authorName,
      authorRole,
      comment: commentText,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };

    setVideos((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          return {
            ...v,
            comments: [newComment, ...v.comments],
          };
        }
        return v;
      })
    );
    showToast('Your comment was posted!');
  };

  const handleShareVideo = (video: StudyVideo) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#video-${video.id}`);
      showToast(`Link copied for "${video.title}"! Share with classmates or WhatsApp.`);
    } else {
      showToast(`Shared "${video.title}" with study group!`);
    }
    setVideos((prev) =>
      prev.map((v) => (v.id === video.id ? { ...v, shares: v.shares + 1 } : v))
    );
  };

  const handleDownloadVideo = (video: StudyVideo) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === video.id ? { ...v, downloads: v.downloads + 1 } : v))
    );
    showToast(`Downloading "${video.title}" for offline revision...`);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const toggleLanguageMode = () => {
    setLanguageMode((prev) => (prev === 'en' ? 'roman' : 'en'));
    showToast(
      languageMode === 'en'
        ? 'Roman Urdu mode enabled: Asaan zaban me study guide.'
        : 'English academic terminology mode active.'
    );
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      if (next) playNotificationChime();
      return next;
    });
  };

  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('talibilm_settings', JSON.stringify(updated));

      if (newSettings.theme) {
        if (newSettings.theme === 'dark') setIsDarkMode(true);
        else if (newSettings.theme === 'light') setIsDarkMode(false);
        else setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
      if (newSettings.language) {
        setLanguageMode(newSettings.language === 'en' ? 'en' : 'roman');
      }
      if (typeof newSettings.soundEnabled === 'boolean') {
        setSoundEnabled(newSettings.soundEnabled);
      }
      return updated;
    });
    showToast('Settings updated & applied!');
  };

  const handleClearChatHistory = () => {
    localStorage.removeItem('talibilm_chat_history');
    showToast('AI Tutor history cleared.');
  };

  const handleResetLibrary = () => {
    setSavedMaterialIds(['mat-1', 'mat-3']);
    showToast('Saved bookmarks restored to default.');
  };

  // Add study material (Upload Notes)
  const handleAddMaterial = (newMat: StudyMaterial) => {
    setMaterials((prev) => [newMat, ...prev]);
    showToast(`"${newMat.title}" has been published to the repository!`);

    // Add in-app notification
    const newNotif: InAppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Material Published',
      message: `Your notes "${newMat.title}" are now available for students of ${newMat.className}.`,
      timestamp: 'Just now',
      type: 'download',
      read: false,
      targetTab: 'notes',
    };
    setNotifications((prev) => [newNotif, ...prev]);
    if (soundEnabled) playNotificationChime();
  };

  // Submit Rating & Review
  const handleSubmitRating = (
    materialId: string,
    newRating: number,
    reviewText: string,
    reviewerName: string
  ) => {
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === materialId) {
          const updatedTotalRatings = m.totalRatings + 1;
          const updatedRating = (m.rating * m.totalRatings + newRating) / updatedTotalRatings;
          const newReview = {
            id: `rev-${Date.now()}`,
            userName: reviewerName,
            rating: newRating,
            comment: reviewText || 'Rated by student',
            date: new Date().toISOString().split('T')[0],
          };
          return {
            ...m,
            rating: updatedRating,
            totalRatings: updatedTotalRatings,
            reviews: [newReview, ...m.reviews],
          };
        }
        return m;
      })
    );

    showToast(`Thank you! Your ${newRating}★ rating has been registered.`);
  };

  // Increment download counter
  const handleIncrementDownload = (id: string) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, downloads: m.downloads + 1 } : m))
    );
  };

  // Toggle bookmark saved note
  const handleToggleSaveMaterial = (id: string) => {
    setSavedMaterialIds((prev) => {
      if (prev.includes(id)) {
        showToast('Removed from saved library.');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved to your study library!');
        return [...prev, id];
      }
    });
  };

  // Doubt forum handlers
  const handleAddDoubt = (newDoubt: DoubtQuestion) => {
    setDoubts((prev) => [newDoubt, ...prev]);
    showToast('Your doubt was published to the student forum!');
  };

  const handleAddAnswer = (questionId: string, answer: DoubtAnswer) => {
    setDoubts((prev) =>
      prev.map((d) => {
        if (d.id === questionId) {
          // If question has reply notifications enabled, generate an in-app alert!
          if (d.notifyReplies) {
            const notif: InAppNotification = {
              id: `notif-${Date.now()}`,
              title: 'New Reply Received',
              message: `${answer.authorName} answered: "${d.title}"`,
              timestamp: 'Just now',
              type: 'reply',
              read: false,
              targetId: d.id,
              targetTab: 'forum',
            };
            setNotifications((n) => [notif, ...n]);
            if (soundEnabled) playNotificationChime();
          }

          return {
            ...d,
            answers: [...d.answers, answer],
          };
        }
        return d;
      })
    );
  };

  const handleToggleUpvoteDoubt = (questionId: string) => {
    setDoubts((prev) =>
      prev.map((d) => {
        if (d.id === questionId) {
          const isUpvoted = !d.isUpvoted;
          return {
            ...d,
            isUpvoted,
            upvotes: isUpvoted ? d.upvotes + 1 : d.upvotes - 1,
          };
        }
        return d;
      })
    );
  };

  const handleToggleUpvoteAnswer = (questionId: string, answerId: string) => {
    setDoubts((prev) =>
      prev.map((d) => {
        if (d.id === questionId) {
          return {
            ...d,
            answers: d.answers.map((a) => {
              if (a.id === answerId) {
                const isUpvoted = !a.isUpvoted;
                return {
                  ...a,
                  isUpvoted,
                  upvotes: isUpvoted ? a.upvotes + 1 : a.upvotes - 1,
                };
              }
              return a;
            }),
          };
        }
        return d;
      })
    );
  };

  const handleMarkAcceptedAnswer = (questionId: string, answerId: string) => {
    setDoubts((prev) =>
      prev.map((d) => {
        if (d.id === questionId) {
          return {
            ...d,
            isSolved: true,
            acceptedAnswerId: answerId,
            answers: d.answers.map((a) => ({
              ...a,
              isAccepted: a.id === answerId,
            })),
          };
        }
        return d;
      })
    );
    showToast('Marked as accepted solution!');
  };

  // Toggle notification preference for a specific doubt (User requested feature!)
  const handleToggleNotification = (questionId: string) => {
    setDoubts((prev) =>
      prev.map((d) => {
        if (d.id === questionId) {
          const next = !d.notifyReplies;
          showToast(
            next
              ? 'Reply notifications turned ON for this doubt.'
              : 'Reply notifications muted for this doubt.'
          );
          return { ...d, notifyReplies: next };
        }
        return d;
      })
    );
  };

  // Notification management
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  // Contextual AI routing
  const handleAskAIAboutNote = (mat: StudyMaterial) => {
    setAiInitialPrompt(
      `Please provide an executive summary, key formulas, and 3 board exam questions for "${mat.title}" for ${mat.className} (${mat.subject}).`
    );
    setAiInitialSubject(mat.subject as AcademicSubject);
    setAiInitialClass(mat.className as AcademicClass);
    setActiveTab('ai');
  };

  const handleDirectAskAI = (prompt: string, contextSubject: string, contextClass: string) => {
    setAiInitialPrompt(prompt);
    setAiInitialSubject(contextSubject as AcademicSubject);
    setAiInitialClass(contextClass as AcademicClass);
    setPreviewMaterial(null);
    setActiveTab('ai');
  };

  const savedMaterialsList = materials.filter((m) => savedMaterialIds.includes(m.id));

  return (
    <div
      data-accent={settings.accentColor}
      className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors ${
        settings.fontSize === 'compact' ? 'text-[13px]' : settings.fontSize === 'large' ? 'text-[15px]' : ''
      }`}
    >
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-xl border border-white/10 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={() => setIsUploadOpen(true)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearAllNotifications={handleClearAllNotifications}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        languageMode={languageMode}
        toggleLanguageMode={toggleLanguageMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'notes' && (
          <>
            <HeroSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              onOpenUpload={() => setIsUploadOpen(true)}
              onGoToAI={() => setActiveTab('ai')}
              onGoToVideos={() => setActiveTab('videos')}
              languageMode={languageMode}
            />

            <NotesExplorer
              materials={materials}
              selectedClass={selectedClass}
              setSelectedClass={setSelectedClass}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onPreviewMaterial={(mat) => setPreviewMaterial(mat)}
              onRateMaterial={(mat) => setRatingMaterial(mat)}
              onAskAIAboutNote={handleAskAIAboutNote}
              onIncrementDownload={handleIncrementDownload}
              savedMaterialIds={savedMaterialIds}
              onToggleSaveMaterial={handleToggleSaveMaterial}
              languageMode={languageMode}
            />
          </>
        )}

        {activeTab === 'forum' && (
          <DiscussionForum
            doubts={doubts}
            onAddDoubt={handleAddDoubt}
            onAddAnswer={handleAddAnswer}
            onToggleUpvoteDoubt={handleToggleUpvoteDoubt}
            onToggleUpvoteAnswer={handleToggleUpvoteAnswer}
            onMarkAcceptedAnswer={handleMarkAcceptedAnswer}
            onToggleNotification={handleToggleNotification}
            soundEnabled={soundEnabled}
            languageMode={languageMode}
          />
        )}

        {activeTab === 'ai' && (
          <AiStudyAssistant
            initialPrompt={aiInitialPrompt}
            initialSubject={aiInitialSubject}
            initialClass={aiInitialClass}
            languageMode={languageMode}
            settings={settings}
          />
        )}

        {activeTab === 'videos' && (
          <StudyVideosHub
            videos={videos}
            onUploadVideo={handleUploadVideo}
            onLikeVideo={handleLikeVideo}
            onAddComment={handleAddVideoComment}
            onShareVideo={handleShareVideo}
            onDownloadVideo={handleDownloadVideo}
            languageMode={languageMode}
          />
        )}
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAddMaterial={handleAddMaterial}
        languageMode={languageMode}
      />

      <DocumentViewerModal
        material={previewMaterial}
        onClose={() => setPreviewMaterial(null)}
        onRateMaterial={(mat) => {
          setPreviewMaterial(null);
          setRatingMaterial(mat);
        }}
        onIncrementDownload={handleIncrementDownload}
        onDirectAskAI={handleDirectAskAI}
        languageMode={languageMode}
      />

      <RatingModal
        material={ratingMaterial}
        onClose={() => setRatingMaterial(null)}
        onSubmitRating={handleSubmitRating}
        languageMode={languageMode}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onClearChatHistory={handleClearChatHistory}
        onResetLibrary={handleResetLibrary}
      />

      {/* Clean Academic Footer (No pseudo telemetry or fake stats) */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white font-display">
              TalibIlm
            </span>
            <span aria-hidden="true">·</span>
            <span>Academic Peer Knowledge Sharing Platform</span>
            <span aria-hidden="true">·</span>
            <span>Class 9 to University</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Free Student Access</span>
            <span aria-hidden="true">·</span>
            <span>Board Curriculum Aligned</span>
            <span aria-hidden="true">·</span>
            <span>© 2026 TalibIlm</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
