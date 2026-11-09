import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { StudyMaterial, AcademicClass, AcademicSubject, MaterialType } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMaterial: (mat: StudyMaterial) => void;
  languageMode: 'en' | 'roman';
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAddMaterial,
  languageMode,
}) => {
  const [title, setTitle] = useState('');
  const [className, setClassName] = useState<AcademicClass>('Class 11');
  const [subject, setSubject] = useState<AcademicSubject>('Physics');
  const [type, setType] = useState<MaterialType>('Notes');
  const [description, setDescription] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [uploaderCollege, setUploaderCollege] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('2.4 MB');
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    setFileSize(`${sizeInMb} MB`);

    // Auto-fill title if empty
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }

    // Read text content if plain text/markdown
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setFileContent(content);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a title for your study material');
      return;
    }
    if (!uploaderName.trim()) {
      setError('Please provide your name or pen name');
      return;
    }

    const defaultNotesSample =
      fileContent.trim() ||
      `STUDY NOTES: ${title}
Class: ${className} | Subject: ${subject}
Shared by: ${uploaderName} (${uploaderCollege || 'Student Community'})

SUMMARY OVERVIEW:
${description || 'Key revision topics, derivations, formulas, and past questions.'}

CORE TOPICS & KEY POINTS:
1. Concept Foundations & Standard Definitions
2. Primary Governing Formulas & Unit Conversions
3. Solved Board/University Examples with Step-by-Step Derivations
4. High-Yield Revision Tips & Common Mistakes to Avoid`;

    const newMaterial: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title: title.trim(),
      description:
        description.trim() ||
        `High-yield academic ${type.toLowerCase()} for ${className} ${subject} shared by ${uploaderName}.`,
      className,
      subject,
      type: type === 'All Types' ? 'Notes' : type,
      uploaderName: uploaderName.trim(),
      uploaderCollege: uploaderCollege.trim() || undefined,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: fileSize || '3.2 MB',
      pageCount: Math.max(12, Math.floor(Math.random() * 40) + 10),
      rating: 5.0,
      totalRatings: 1,
      reviews: [
        {
          id: `rev-${Date.now()}`,
          userName: uploaderName.trim(),
          rating: 5,
          comment: 'Uploaded original complete notes verified against standard board syllabus.',
          date: new Date().toISOString().split('T')[0],
        },
      ],
      downloads: 0,
      fileName: fileName || `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      sampleContent: defaultNotesSample,
      tags: tagsInput
        ? tagsInput
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [subject, className, type],
      isVerified: true,
    };

    onAddMaterial(newMaterial);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {languageMode === 'roman'
                  ? 'Apne Notes, PDF ya Book Upload Karein'
                  : 'Upload Study Notes, PDF or Book'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Help fellow students and earn verified contributor reputation.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Material Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Class 11 Physics Ch 3-5 Complete Derivations & Past Solved Numericals"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Class, Subject & Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Class / Level *
              </label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value as AcademicClass)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="Class 9">Class 9 (Matric-I)</option>
                <option value="Class 10">Class 10 (Matric-II)</option>
                <option value="Class 11">Class 11 (FSc / ICS-I)</option>
                <option value="Class 12">Class 12 (FSc / ICS-II)</option>
                <option value="MDCAT / Pre-Med">MDCAT (Pre-Medical)</option>
                <option value="ECAT / Pre-Eng">ECAT (Pre-Engineering)</option>
                <option value="BS / University">BS / University</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as AcademicSubject)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="Physics">Physics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="English">English</option>
                <option value="Urdu / Pak Studies">Urdu / Pak Studies</option>
                <option value="Economics & Commerce">Economics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MaterialType)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="Notes">Handwritten Notes</option>
                <option value="Book">Complete Book / PDF</option>
                <option value="PDF">Chapter PDF</option>
                <option value="Past Paper">Solved Past Paper</option>
                <option value="Formula Sheet">Formula Sheet / Cheat Sheet</option>
              </select>
            </div>
          </div>

          {/* File Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Upload PDF / Document File
            </label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center hover:border-indigo-400 transition-colors bg-slate-50/50 dark:bg-slate-800/40">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                <FileText className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                {fileName ? (
                  <div className="text-xs">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {fileName}
                    </span>
                    <span className="text-slate-400 ml-2">({fileSize})</span>
                    <p className="text-[11px] text-slate-500 mt-1">Click to change file</p>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                      Click to choose PDF, DOC, or TXT
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Or drag and drop your study file here
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Description / Topics Covered
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Contains all 2020-2025 board exam solved questions with diagrams..."
              className="w-full px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Content / Notes text */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes Text / Excerpt for Document Reader & AI Assistant
            </label>
            <textarea
              rows={3}
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              placeholder="Paste note key formulas or chapter text here for live in-browser preview and AI tutoring..."
              className="w-full px-3.5 py-2 font-mono text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Author & College */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Name / Pen Name *
              </label>
              <input
                type="text"
                required
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder="e.g. Muhammad Bilal"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                School, College or University (Optional)
              </label>
              <input
                type="text"
                value={uploaderCollege}
                onChange={(e) => setUploaderCollege(e.target.value)}
                placeholder="e.g. Punjab College / GCU / NUST"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
            >
              Publish & Share Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
