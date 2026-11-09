import React from 'react';
import { Search, BookOpen, Users, Sparkles, Star, ArrowRight, Video } from 'lucide-react';
import { AcademicClass, AcademicSubject } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedClass: AcademicClass;
  setSelectedClass: (c: AcademicClass) => void;
  selectedSubject: AcademicSubject;
  setSelectedSubject: (s: AcademicSubject) => void;
  onOpenUpload: () => void;
  onGoToAI: () => void;
  onGoToVideos: () => void;
  languageMode: 'en' | 'roman';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedClass,
  setSelectedClass,
  selectedSubject,
  setSelectedSubject,
  onOpenUpload,
  onGoToAI,
  onGoToVideos,
  languageMode,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6 border border-slate-800">
      {/* Background Image Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_student_library_1793802988776.jpg"
          alt="Students studying in library"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25 filter brightness-75 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-5xl px-6 py-12 sm:px-12 sm:py-16">
        {/* Kicker */}
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-3 tracking-wide">
          <span>ALL-IN-ONE ACADEMIC REPOSITORY</span>
          <span aria-hidden="true">·</span>
          <span>CLASS 9 TO UNIVERSITY & ENTRY TESTS</span>
        </div>

        {/* Hero Title with text-wrap: balance */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-3xl font-display leading-[1.15] [text-wrap:balance]">
          {languageMode === 'roman'
            ? 'Apni Class or Subject ke Notes, PDFs & Books Download Karein'
            : 'Download Verified Notes, PDFs, and Books for Your Class & Subject'}
        </h1>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          {languageMode === 'roman'
            ? 'Har student ke liye muft study materials, solved past papers, video lectures aur 24/7 AI Study Tutor se fori rehnumai.'
            : 'Access high-quality peer notes, solved past papers, formula roadmaps, video lectures, and 24/7 AI study assistance.'}
        </p>

        {/* Interactive Search & Quick Filter Deck */}
        <div className="mt-8 p-3 sm:p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 max-w-3xl shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  languageMode === 'roman'
                    ? 'Search notes (e.g. Physics derivations, Organic chemistry)'
                    : 'Search notes, chapters, topics, formulas...'
                }
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl placeholder-slate-400 border border-transparent focus:border-indigo-400 focus:outline-none shadow-inner"
              />
            </div>

            {/* Class Selector */}
            <div className="sm:col-span-4">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value as AcademicClass)}
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-transparent focus:border-indigo-400 focus:outline-none cursor-pointer"
              >
                <option value="All Classes">All Classes / Grades</option>
                <option value="Class 9">Class 9 (Matric-I)</option>
                <option value="Class 10">Class 10 (Matric-II)</option>
                <option value="Class 11">Class 11 (FSc / ICS-I)</option>
                <option value="Class 12">Class 12 (FSc / ICS-II)</option>
                <option value="MDCAT / Pre-Med">MDCAT (Pre-Medical)</option>
                <option value="ECAT / Pre-Eng">ECAT (Pre-Engineering)</option>
                <option value="BS / University">BS / University Degree</option>
              </select>
            </div>

            {/* Subject Selector */}
            <div className="sm:col-span-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as AcademicSubject)}
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-transparent focus:border-indigo-400 focus:outline-none cursor-pointer"
              >
                <option value="All Subjects">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Computer Science">Computer Science</option>
                <option value="English">English</option>
                <option value="Urdu / Pak Studies">Urdu / Pak Studies</option>
                <option value="Economics & Commerce">Economics</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Action CTAs & Unboxed Proof Metrics */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>Upload Your Notes & Books</span>
            </button>
            <button
              onClick={onGoToVideos}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <Video className="w-4 h-4 text-rose-400" />
              <span>Watch Video Lectures</span>
            </button>
            <button
              onClick={onGoToAI}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Chat with AI Tutor</span>
            </button>
          </div>

          {/* Quiet Unboxed Metrics */}
          <div className="flex items-center gap-4 text-xs text-slate-300 tabular-nums">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-white">4.9/5</span>
              <span className="text-slate-400">Rating</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div>
              <span className="font-semibold text-white">14.2k+</span>
              <span className="text-slate-400 ml-1">Downloads</span>
            </div>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <div>
              <span className="font-semibold text-white">100%</span>
              <span className="text-slate-400 ml-1">Free Access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
