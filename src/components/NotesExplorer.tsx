import React, { useState } from 'react';
import {
  Download,
  Eye,
  Star,
  FileText,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Filter,
  ArrowUpDown,
  BookMarked,
  Share2,
} from 'lucide-react';
import { StudyMaterial, AcademicClass, AcademicSubject, MaterialType } from '../types';
import { downloadStudyDocument, formatCount } from '../utils/helpers';

interface NotesExplorerProps {
  materials: StudyMaterial[];
  selectedClass: AcademicClass;
  setSelectedClass: (c: AcademicClass) => void;
  selectedSubject: AcademicSubject;
  setSelectedSubject: (s: AcademicSubject) => void;
  selectedType: MaterialType;
  setSelectedType: (t: MaterialType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onPreviewMaterial: (mat: StudyMaterial) => void;
  onRateMaterial: (mat: StudyMaterial) => void;
  onAskAIAboutNote: (mat: StudyMaterial) => void;
  onIncrementDownload: (id: string) => void;
  savedMaterialIds: string[];
  onToggleSaveMaterial: (id: string) => void;
  languageMode: 'en' | 'roman';
}

const CLASS_LIST: AcademicClass[] = [
  'All Classes',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
  'MDCAT / Pre-Med',
  'ECAT / Pre-Eng',
  'BS / University',
];

const SUBJECT_LIST: AcademicSubject[] = [
  'All Subjects',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English',
  'Urdu / Pak Studies',
  'Economics & Commerce',
];

const TYPE_LIST: MaterialType[] = [
  'All Types',
  'Notes',
  'Book',
  'PDF',
  'Past Paper',
  'Formula Sheet',
];

export const NotesExplorer: React.FC<NotesExplorerProps> = ({
  materials,
  selectedClass,
  setSelectedClass,
  selectedSubject,
  setSelectedSubject,
  selectedType,
  setSelectedType,
  searchQuery,
  setSearchQuery,
  onPreviewMaterial,
  onRateMaterial,
  onAskAIAboutNote,
  onIncrementDownload,
  savedMaterialIds,
  onToggleSaveMaterial,
  languageMode,
}) => {
  const [sortBy, setSortBy] = useState<'rating' | 'downloads' | 'newest'>('rating');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter logic
  const filteredMaterials = materials
    .filter((m) => {
      const matchClass = selectedClass === 'All Classes' || m.className === selectedClass;
      const matchSubject = selectedSubject === 'All Subjects' || m.subject === selectedSubject;
      const matchType = selectedType === 'All Types' || m.type === selectedType;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.subject.toLowerCase().includes(query) ||
        m.className.toLowerCase().includes(query) ||
        m.tags.some((t) => t.toLowerCase().includes(query));

      return matchClass && matchSubject && matchType && matchQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    });

  const handleDownload = (e: React.MouseEvent, mat: StudyMaterial) => {
    e.stopPropagation();
    onIncrementDownload(mat.id);
    downloadStudyDocument(
      mat.fileName,
      mat.title,
      mat.sampleContent,
      mat.uploaderName,
      mat.className,
      mat.subject
    );
  };

  const handleShare = (e: React.MouseEvent, mat: StudyMaterial) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `TalibIlm Study Material: ${mat.title} for ${mat.className} (${mat.subject}). Free download on TalibIlm Hub!`
      );
      setCopiedId(mat.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Class Segmented Filter Bar (Horizontal scroll on mobile) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {languageMode === 'roman' ? 'Apna Class / Level Choose Karein' : 'Select Academic Level'}
          </span>
          <span className="text-xs text-slate-400 tabular-nums">
            {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materials'} available
          </span>
        </div>
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto scrollbar-none border border-slate-200/60 dark:border-slate-700/60">
          {CLASS_LIST.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                selectedClass === cls
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Filter & Sort Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mb-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Subject Filter Dropdown */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as AcademicSubject)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {SUBJECT_LIST.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Material Type Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as MaterialType)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {TYPE_LIST.map((typ) => (
              <option key={typ} value={typ}>
                {typ}
              </option>
            ))}
          </select>

          {(selectedClass !== 'All Classes' ||
            selectedSubject !== 'All Subjects' ||
            selectedType !== 'All Types' ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedClass('All Classes');
                setSelectedSubject('All Subjects');
                setSelectedType('All Types');
                setSearchQuery('');
              }}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline px-2 py-1"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="rating">Highest Rated ★</option>
            <option value="downloads">Most Downloaded</option>
            <option value="newest">Recently Uploaded</option>
          </select>
        </div>
      </div>

      {/* Materials Cards Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            No study materials found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Try adjusting your class or subject filter, or be the first student to upload notes for this subject!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((mat) => {
            const isSaved = savedMaterialIds.includes(mat.id);

            return (
              <div
                key={mat.id}
                onClick={() => onPreviewMaterial(mat)}
                className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-indigo-300 dark:hover:border-indigo-700/60 hover:shadow-lg transition-all cursor-pointer"
              >
                <div>
                  {/* Card Header: Zero-pill metadata */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                        {mat.className}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{mat.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{mat.type}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveMaterial(mat.id);
                      }}
                      className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-1"
                      title={isSaved ? 'Remove from saved' : 'Save for offline'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                    {mat.title}
                  </h3>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>

                  {/* Uploader & verification marker */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span>By {mat.uploaderName}</span>
                    {mat.isVerified && (
                      <span title="Verified by faculty/moderators">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline shrink-0" />
                      </span>
                    )}
                    {mat.uploaderCollege && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate max-w-[150px]">{mat.uploaderCollege}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Footer: Rating, Downloads & Action Bar */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3 tabular-nums">
                    {/* Rating Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRateMaterial(mat);
                      }}
                      className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title="Click to submit a rating"
                    >
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {mat.rating.toFixed(1)}
                      </span>
                      <span>({mat.totalRatings})</span>
                    </button>

                    <div className="flex items-center gap-2 text-slate-400">
                      <span>{mat.fileSize}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatCount(mat.downloads)} downloads</span>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="grid grid-cols-12 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewMaterial(mat);
                      }}
                      className="col-span-5 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={(e) => handleDownload(e, mat)}
                      className="col-span-5 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
                      title={`Download ${mat.fileName}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskAIAboutNote(mat);
                      }}
                      className="col-span-2 flex items-center justify-center p-2 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 transition-colors"
                      title="Explain this note with AI Tutor"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
