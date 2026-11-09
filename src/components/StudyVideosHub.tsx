import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Heart,
  Share2,
  Download,
  MessageCircle,
  Video,
  Upload,
  Search,
  CheckCircle2,
  Send,
  X,
  Volume2,
  VolumeX,
  Clock,
  Eye,
  Filter,
  Film,
  Sparkles,
  Tv,
} from 'lucide-react';
import { StudyVideo, VideoComment, AcademicClass, AcademicSubject } from '../types';

interface StudyVideosHubProps {
  videos: StudyVideo[];
  onUploadVideo: (video: StudyVideo) => void;
  onLikeVideo: (videoId: string) => void;
  onAddComment: (videoId: string, commentText: string, authorName: string, authorRole: 'Teacher' | 'Student') => void;
  onShareVideo: (video: StudyVideo) => void;
  onDownloadVideo: (video: StudyVideo) => void;
  languageMode: 'en' | 'roman';
}

const CLASS_OPTIONS: AcademicClass[] = [
  'All Classes',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
  'MDCAT / Pre-Med',
  'ECAT / Pre-Eng',
  'BS / University',
];

const SUBJECT_OPTIONS: AcademicSubject[] = [
  'All Subjects',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'Economics & Commerce',
];

export function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0&modestbranding=1`;
  }
  return null;
}

export const StudyVideosHub: React.FC<StudyVideosHubProps> = ({
  videos,
  onUploadVideo,
  onLikeVideo,
  onAddComment,
  onShareVideo,
  onDownloadVideo,
  languageMode,
}) => {
  const [selectedClass, setSelectedClass] = useState<AcademicClass>('All Classes');
  const [selectedSubject, setSelectedSubject] = useState<AcademicSubject>('All Subjects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'All' | 'Teacher' | 'Student'>('All');

  // Active Video Player Modal state
  const [activeVideo, setActiveVideo] = useState<StudyVideo | null>(null);

  // Comment input state
  const [newCommentText, setNewCommentText] = useState('');
  const [commenterName, setCommenterName] = useState('Ahmed Khan');
  const [commenterRole, setCommenterRole] = useState<'Student' | 'Teacher'>('Student');

  // Upload Video Modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadVideoUrl, setUploadVideoUrl] = useState('');
  const [uploadClass, setUploadClass] = useState<AcademicClass>('Class 11');
  const [uploadSubject, setUploadSubject] = useState<AcademicSubject>('Physics');
  const [uploadCreatorName, setUploadCreatorName] = useState('');
  const [uploadCreatorRole, setUploadCreatorRole] = useState<'Teacher' | 'Student'>('Teacher');
  const [uploadInstitution, setUploadInstitution] = useState('');
  const [uploadDuration, setUploadDuration] = useState('14:30');
  const [uploadTags, setUploadTags] = useState('Physics, Board Exam, Concepts');
  const [selectedFileNotice, setSelectedFileNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered videos
  const filteredVideos = videos.filter((v) => {
    const matchesClass = selectedClass === 'All Classes' || v.className === selectedClass;
    const matchesSubject = selectedSubject === 'All Subjects' || v.subject === selectedSubject;
    const matchesRole = selectedRoleFilter === 'All' || v.creatorRole === selectedRoleFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesClass && matchesSubject && matchesRole && matchesSearch;
  });

  const handleOpenPlayer = (video: StudyVideo) => {
    setActiveVideo(video);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVideo || !newCommentText.trim()) return;

    onAddComment(activeVideo.id, newCommentText.trim(), commenterName.trim() || 'Student', commenterRole);

    const newComment: VideoComment = {
      id: `vcomm-${Date.now()}`,
      videoId: activeVideo.id,
      authorName: commenterName.trim() || 'Student',
      authorRole: commenterRole,
      comment: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };

    setActiveVideo({
      ...activeVideo,
      comments: [newComment, ...activeVideo.comments],
    });

    setNewCommentText('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setUploadVideoUrl(blobUrl);
      setSelectedFileNotice(`Selected local file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleFormSubmitUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadCreatorName.trim()) return;

    const newVid: StudyVideo = {
      id: `vid-${Date.now()}`,
      title: uploadTitle.trim(),
      description: uploadDesc.trim() || 'Conceptual video lecture for board exam preparation.',
      videoUrl: uploadVideoUrl.trim() || 'https://www.youtube.com/watch?v=7XaftdE_h60',
      duration: uploadDuration.trim() || '15:00',
      className: uploadClass,
      subject: uploadSubject,
      creatorName: uploadCreatorName.trim(),
      creatorRole: uploadCreatorRole,
      creatorInstitution: uploadInstitution.trim() || (uploadCreatorRole === 'Teacher' ? 'College Lecturer' : 'Student Topper'),
      createdAt: 'Just now',
      views: 1,
      likes: 0,
      isLiked: false,
      downloads: 0,
      shares: 0,
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      tags: uploadTags.split(',').map((t) => t.trim()).filter(Boolean),
      isVerifiedTeacher: uploadCreatorRole === 'Teacher',
      comments: [],
    };

    onUploadVideo(newVid);
    setIsUploadModalOpen(false);
    // Reset form
    setUploadTitle('');
    setUploadDesc('');
    setUploadVideoUrl('');
    setUploadCreatorName('');
    setUploadInstitution('');
    setSelectedFileNotice(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header & Upload Video CTA */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 mb-1">
            <Tv className="w-4 h-4" />
            <span>PLAYABLE STUDY VIDEO HUB</span>
            <span aria-hidden="true">·</span>
            <span>TEACHER &amp; STUDENT LECTURES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white [text-wrap:balance]">
            {languageMode === 'roman'
              ? 'Study Video Lectures & Short Conceptual Explanations'
              : 'Academic Video Lectures & Concept Masterclasses'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {languageMode === 'roman'
              ? 'Kisi bhi lecture par click karein aur video foran chalegi! Video dekhein, like karein, comments me sawalat poochein, share karein aur offline download karein.'
              : 'Click any video lecture below to play instantly in HD! Comment questions, like, share with classmates, and download for offline revision.'}
          </p>
        </div>

        {/* Upload Video Button */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm shadow-rose-200 dark:shadow-none transition-all shrink-0 cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>{languageMode === 'roman' ? 'Study Video Upload Karein' : 'Upload Video Lecture'}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 mb-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lectures by topic, chapter, teacher, formula (e.g. Heart, Bernoulli, Benzene)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Role Filter Toggle (Teacher vs Student) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium shrink-0">
            <button
              onClick={() => setSelectedRoleFilter('All')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedRoleFilter === 'All'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Lectures
            </button>
            <button
              onClick={() => setSelectedRoleFilter('Teacher')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedRoleFilter === 'Teacher'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              👨‍🏫 By Teachers
            </button>
            <button
              onClick={() => setSelectedRoleFilter('Student')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedRoleFilter === 'Student'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              🎓 By Students
            </button>
          </div>
        </div>

        {/* Class and Subject Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Filter:
          </span>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value as AcademicClass)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            {CLASS_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as AcademicSubject)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            {SUBJECT_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <span className="ml-auto text-slate-400 text-[11px]">
            {filteredVideos.length} {filteredVideos.length === 1 ? 'Video' : 'Videos'} Ready to Play
          </span>
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Thumbnail Container */}
              <div
                onClick={() => handleOpenPlayer(video)}
                className="relative aspect-video bg-slate-950 overflow-hidden cursor-pointer"
              >
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 group-hover:opacity-95 transition-all duration-300"
                />

                {/* Duration Badge */}
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/85 text-white font-mono text-[11px] font-semibold flex items-center gap-1 backdrop-blur-xs">
                  <Clock className="w-3 h-3 text-rose-400" />
                  {video.duration}
                </span>

                {/* Class Badge */}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                  {video.className}
                </span>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-13 h-13 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl group-hover:scale-115 transition-transform group-hover:bg-rose-500">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Video Info Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-rose-600 dark:text-rose-400">
                      {video.subject}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {video.views.toLocaleString()} views
                    </span>
                  </div>

                  <h3
                    onClick={() => handleOpenPlayer(video)}
                    className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer leading-snug"
                  >
                    {video.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                {/* Creator Details */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {video.creatorName[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {video.creatorName}
                          </span>
                          {video.isVerifiedTeacher && (
                            <span title="Verified Teacher">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {video.creatorRole} · {video.creatorInstitution || 'Educator'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400">{video.createdAt}</span>
                  </div>

                  {/* Actions Bar (Like, Comment, Share, Download) */}
                  <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 pt-1">
                    {/* Like */}
                    <button
                      onClick={() => onLikeVideo(video.id)}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        video.isLiked
                          ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title="Like this video"
                    >
                      <Heart className={`w-3.5 h-3.5 ${video.isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span>{video.likes}</span>
                    </button>

                    {/* Comment */}
                    <button
                      onClick={() => handleOpenPlayer(video)}
                      className="flex items-center justify-center gap-1 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="View comments"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{video.comments.length}</span>
                    </button>

                    {/* Share */}
                    <button
                      onClick={() => onShareVideo(video)}
                      className="flex items-center justify-center gap-1 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Share lecture"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Share</span>
                    </button>

                    {/* Download */}
                    <button
                      onClick={() => onDownloadVideo(video)}
                      className="flex items-center justify-center gap-1 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 hover:text-rose-600 cursor-pointer"
                      title="Download video for offline viewing"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <Video className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Study Videos Found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Try choosing a different class or subject, or be the first to upload a video lecture!
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Upload Study Video
          </button>
        </div>
      )}

      {/* FULL REAL PLAYABLE VIDEO MODAL */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold">
                  {activeVideo.className}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {activeVideo.subject} · Video Lecture Player
                </span>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Scrollable */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
              {/* REAL VIDEO PLAYER (YOUTUBE EMBED OR HTML5 VIDEO) */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800">
                {(() => {
                  const youtubeEmbedUrl = getYouTubeEmbedUrl(activeVideo.videoUrl);

                  if (youtubeEmbedUrl) {
                    return (
                      <iframe
                        src={youtubeEmbedUrl}
                        title={activeVideo.title}
                        className="w-full h-full border-0 rounded-2xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    );
                  }

                  if (activeVideo.videoUrl && (activeVideo.videoUrl.startsWith('blob:') || activeVideo.videoUrl.endsWith('.mp4') || activeVideo.videoUrl.endsWith('.webm'))) {
                    return (
                      <video
                        src={activeVideo.videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-contain bg-black"
                        poster={activeVideo.thumbnailUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    );
                  }

                  // Default Fallback: Playable YouTube Educational Lecture
                  return (
                    <iframe
                      src="https://www.youtube-nocookie.com/embed/7XaftdE_h60?autoplay=1&rel=0&modestbranding=1"
                      title={activeVideo.title}
                      className="w-full h-full border-0 rounded-2xl"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                })()}
              </div>

              {/* Title & Core Video Controls Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {activeVideo.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {activeVideo.creatorName}
                    </span>
                    <span>·</span>
                    <span>{activeVideo.creatorRole}</span>
                    <span>·</span>
                    <span>{activeVideo.views.toLocaleString()} views</span>
                    <span>·</span>
                    <span>{activeVideo.createdAt}</span>
                  </div>
                </div>

                {/* Primary Interaction Buttons (Like, Share, Download) */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Like Button */}
                  <button
                    onClick={() => {
                      onLikeVideo(activeVideo.id);
                      setActiveVideo({
                        ...activeVideo,
                        likes: activeVideo.isLiked ? activeVideo.likes - 1 : activeVideo.likes + 1,
                        isLiked: !activeVideo.isLiked,
                      });
                    }}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      activeVideo.isLiked
                        ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${activeVideo.isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span>{activeVideo.likes} Likes</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => onShareVideo(activeVideo)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-emerald-500" />
                    <span>Share</span>
                  </button>

                  {/* Download Video Button */}
                  <button
                    onClick={() => onDownloadVideo(activeVideo)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Lecture</span>
                  </button>
                </div>
              </div>

              {/* Description & Tags */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Lecture Details &amp; Board Exam Takeaways:
                </span>
                <p className="leading-relaxed whitespace-pre-wrap">{activeVideo.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {activeVideo.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] text-slate-500 font-medium"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* COMMENTS SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-rose-500" />
                    <span>Student &amp; Teacher Discussions ({activeVideo.comments.length})</span>
                  </h4>
                  <span className="text-xs text-slate-400">Ask questions regarding this lecture</span>
                </div>

                {/* Add Comment Input */}
                <form
                  onSubmit={handlePostComment}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <input
                      type="text"
                      value={commenterName}
                      onChange={(e) => setCommenterName(e.target.value)}
                      placeholder="Your Name (e.g. Asad, Miss Nadia)"
                      className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none text-xs w-48"
                    />
                    <select
                      value={commenterRole}
                      onChange={(e) => setCommenterRole(e.target.value as 'Student' | 'Teacher')}
                      className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs cursor-pointer"
                    >
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher / Mentor</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Write your question, doubt, or review on this lecture..."
                      className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                    />
                    <button
                      type="submit"
                      disabled={!newCommentText.trim()}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-3">
                  {activeVideo.comments.length > 0 ? (
                    activeVideo.comments.map((comm) => (
                      <div
                        key={comm.id}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-3 shadow-2xs"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {comm.authorName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                {comm.authorName}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                                  comm.authorRole === 'Teacher' || comm.authorRole === 'Subject Expert'
                                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                                }`}
                              >
                                {comm.authorRole}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">{comm.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                            {comm.comment}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 py-3 text-center">
                      No comments yet. Be the first student or teacher to start the discussion!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD STUDY VIDEO MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative my-auto">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-rose-600 mb-1">
              <Video className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Teacher &amp; Student Portal</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {languageMode === 'roman' ? 'Study Video Lecture Upload Karein' : 'Upload Educational Video Lecture'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Share conceptual lessons, solved derivations, or board past paper masterclasses with fellow students across the country.
            </p>

            <form onSubmit={handleFormSubmitUpload} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Lecture Title:
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Class 11 Biology: Human Heart Complete Anatomy & Functions"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Video URL (YouTube or Direct MP4 link):
                </label>
                <input
                  type="text"
                  value={uploadVideoUrl}
                  onChange={(e) => setUploadVideoUrl(e.target.value)}
                  placeholder="e.g. https://www.youtube.com/watch?v=... or https://.../video.mp4"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Academic Class:
                  </label>
                  <select
                    value={uploadClass}
                    onChange={(e) => setUploadClass(e.target.value as AcademicClass)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none text-xs cursor-pointer"
                  >
                    {CLASS_OPTIONS.filter((c) => c !== 'All Classes').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Subject:
                  </label>
                  <select
                    value={uploadSubject}
                    onChange={(e) => setUploadSubject(e.target.value as AcademicSubject)}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none text-xs cursor-pointer"
                  >
                    {SUBJECT_OPTIONS.filter((s) => s !== 'All Subjects').map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Name / Channel:
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadCreatorName}
                    onChange={(e) => setUploadCreatorName(e.target.value)}
                    placeholder="e.g. Sir Asad / Bilal Student"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Role:
                  </label>
                  <select
                    value={uploadCreatorRole}
                    onChange={(e) => setUploadCreatorRole(e.target.value as 'Teacher' | 'Student')}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none text-xs cursor-pointer"
                  >
                    <option value="Teacher">👨‍🏫 Teacher / Lecturer</option>
                    <option value="Student">🎓 Student / Peer Mentor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  College / Academy / Institution Name:
                </label>
                <input
                  type="text"
                  value={uploadInstitution}
                  onChange={(e) => setUploadInstitution(e.target.value)}
                  placeholder="e.g. Punjab College Lahore, GCU, KIPS, APS"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Video Description &amp; Summary:
                </label>
                <textarea
                  rows={2}
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  placeholder="Key concepts explained in this video, board exam questions solved..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none text-xs"
                />
              </div>

              {/* Local File Picker */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Film className="w-6 h-6 text-rose-500 mx-auto mb-1" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                  {selectedFileNotice ? selectedFileNotice : 'Click to Select MP4 / Video File from Computer'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  Playable immediately in student video player (No YouTube required)
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  Publish Video Lecture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
