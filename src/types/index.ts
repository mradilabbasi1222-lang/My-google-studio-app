export type AcademicClass =
  | 'All Classes'
  | 'Class 9'
  | 'Class 10'
  | 'Class 11'
  | 'Class 12'
  | 'MDCAT / Pre-Med'
  | 'ECAT / Pre-Eng'
  | 'BS / University';

export type AcademicSubject =
  | 'All Subjects'
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Computer Science'
  | 'English'
  | 'Urdu / Pak Studies'
  | 'Economics & Commerce';

export type MaterialType =
  | 'All Types'
  | 'Notes'
  | 'Book'
  | 'PDF'
  | 'Past Paper'
  | 'Formula Sheet';

export interface UserReview {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  className: string;
  subject: string;
  type: 'Notes' | 'Book' | 'PDF' | 'Past Paper' | 'Formula Sheet';
  uploaderName: string;
  uploaderCollege?: string;
  uploadDate: string;
  fileSize: string;
  pageCount: number;
  rating: number;
  totalRatings: number;
  reviews: UserReview[];
  downloads: number;
  fileName: string;
  sampleContent: string;
  tags: string[];
  isVerified: boolean;
}

export interface DoubtAnswer {
  id: string;
  questionId: string;
  authorName: string;
  authorRole: 'Student' | 'Peer Tutor' | 'Subject Topper' | 'AI Tutor';
  createdAt: string;
  content: string;
  upvotes: number;
  isUpvoted?: boolean;
  isAccepted: boolean;
}

export interface DoubtQuestion {
  id: string;
  title: string;
  details: string;
  className: string;
  subject: string;
  authorName: string;
  createdAt: string;
  upvotes: number;
  isUpvoted?: boolean;
  notifyReplies: boolean; // Notification toggle requested by user
  isSolved: boolean;
  acceptedAnswerId?: string;
  answers: DoubtAnswer[];
  tags: string[];
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'reply' | 'rating' | 'doubt_solved' | 'download' | 'study_reminder';
  read: boolean;
  targetId?: string;
  targetTab?: 'notes' | 'forum' | 'ai';
}

export interface Flashcard {
  id: string;
  subject: string;
  className: string;
  category: string;
  question: string;
  answer: string;
  hint?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface VideoComment {
  id: string;
  videoId: string;
  authorName: string;
  authorRole: 'Teacher' | 'Student' | 'Subject Expert' | 'Top Contributor';
  comment: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface StudyVideo {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  thumbnailUrl: string;
  duration: string;
  className: string;
  subject: string;
  creatorName: string;
  creatorRole: 'Teacher' | 'Student' | 'Professor' | 'Topper';
  creatorInstitution?: string;
  createdAt: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  downloads: number;
  shares: number;
  comments: VideoComment[];
  tags: string[];
  isVerifiedTeacher?: boolean;
}

export type AccentColor = 'indigo' | 'rose' | 'emerald' | 'cyan' | 'violet' | 'amber';
export type AppLanguage = 'roman' | 'en' | 'urdu';
export type TargetBoard =
  | 'Punjab Board (BISE)'
  | 'Federal Board (FBISE)'
  | 'Sindh Board (BIEK)'
  | 'KPK Board'
  | 'Cambridge (O/A Level)'
  | 'MDCAT / PMC Scheme';
export type ExplanationDepth = 'exam_focused' | 'quick_summary' | 'in_depth';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: AccentColor;
  fontSize: 'compact' | 'normal' | 'large';
  language: AppLanguage;
  targetBoard: TargetBoard;
  soundEnabled: boolean;
  explanationDepth: ExplanationDepth;
  autoSaveDownloads: boolean;
}

