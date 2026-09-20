export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  points: number;
  image?: string;
  imageCaption?: string;
  hint?: string;
}

export interface QuizPrizePool {
  first?: number;
  second?: number;
  third?: number;
  currency?: string; // default '₹'
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  isWeeklyChallenge: boolean;
  scheduledStartTime?: string; // ISO string
  scheduledEndTime?: string;   // ISO string
  durationMinutes: number;    // e.g. 15 mins
  totalPoints: number;
  passingScore: number;
  enrolledUserIds?: string[];  // Array of user UIDs who enrolled
  isEnrollmentOpen?: boolean;  // Whether users can enroll
  questions: QuizQuestion[];
  createdAt?: string;
  createdBy?: string;
  thumbnail?: string;
  coverImage?: string;
  bannerImage?: string;
  image?: string;
  status?: 'draft' | 'published';

  // Paid Challenge & Cash Prize Extensions
  isPaid?: boolean;
  price?: number;               // Entry fee in INR (e.g. 49)
  upiId?: string;               // Admin UPI VPA (e.g. 'forenclue@okaxis')
  payeeName?: string;           // Payee Name (e.g. 'ForenClue Admin')
  upiQrUrl?: string;            // Optional custom QR image URL
  prizes?: QuizPrizePool;       // 1st, 2nd, 3rd cash prizes
  registrationStartTime?: string; // ISO string when registrations open (e.g. 1 week prior)
  registrationEndTime?: string;   // ISO string when registrations cut off (e.g. 2 hrs prior)
  shuffleQuestions?: boolean;   // Anti-cheat: randomize question order
  shuffleOptions?: boolean;     // Anti-cheat: randomize option choices
  enableTabSwitchDetection?: boolean; // Anti-cheat: monitor tab unfocus
}

export interface QuizRegistration {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string;
  userEmail: string;
  userName: string;
  utrNumber: string;
  senderName?: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface QuizAttempt {
  id?: string;
  quizId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhoto?: string;
  score: number;
  totalPoints: number;
  timeTakenSeconds: number;
  completedAt: string;
  answers: Record<string, number>; // questionId -> selectedIndex
  isPractice?: boolean; // True if attempt was taken in practice mode / after challenge concluded / reattempt
}

export interface LeaderboardEntry extends QuizAttempt {
  rank: number;
  accuracyPercentage: number;
}

export interface EnrolledParticipant {
  userId: string;
  userName: string;
  userEmail: string;
  userPhoto?: string;
  college?: string;
  enrolledAt?: string;
  enrollmentType: 'free' | 'paid';
  registrationStatus?: 'approved' | 'pending' | 'rejected' | 'direct';
  utrNumber?: string;
  amountPaid?: number;
  hasAttempted: boolean;
  score?: number;
  totalPoints?: number;
  timeTakenSeconds?: number;
  completedAt?: string;
  isPractice?: boolean;
  accuracyPercentage?: number;
}
