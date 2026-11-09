import React, { useState } from 'react';
import { X, Star, CheckCircle } from 'lucide-react';
import { StudyMaterial, UserReview } from '../types';

interface RatingModalProps {
  material: StudyMaterial | null;
  onClose: () => void;
  onSubmitRating: (materialId: string, rating: number, reviewText: string, reviewerName: string) => void;
  languageMode: 'en' | 'roman';
}

export const RatingModal: React.FC<RatingModalProps> = ({
  material,
  onClose,
  onSubmitRating,
  languageMode,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!material) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRating(
      material.id,
      rating,
      reviewText.trim(),
      reviewerName.trim() || 'Student Contributor'
    );
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {languageMode === 'roman' ? 'Study Material ko Rate Karein' : 'Rate Study Material'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Shukriya! Your Rating was submitted.
            </h4>
            <p className="text-xs text-slate-500">
              Your feedback helps other students find the best notes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Rating for:</span>
              <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                {material.title}
              </p>
            </div>

            {/* Interactive Stars */}
            <div className="text-center py-2">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Select your rating:
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-slate-300 dark:text-slate-700 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1 inline-block">
                {rating === 5 && 'Outstanding & Highly Recommended (5/5)'}
                {rating === 4 && 'Very Good & Clear (4/5)'}
                {rating === 3 && 'Decent & Helpful (3/5)'}
                {rating === 2 && 'Needs Improvement (2/5)'}
                {rating === 1 && 'Incomplete or Low Quality (1/5)'}
              </span>
            </div>

            {/* Reviewer Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="e.g. Ayesha or Fellow Student"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Written Feedback / Review (Optional)
              </label>
              <textarea
                rows={3}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="How did these notes help you prepare? Any specific chapter advice?"
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
              >
                Submit Rating
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
