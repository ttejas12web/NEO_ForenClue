import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy, limit, arrayUnion, arrayRemove, setDoc 
} from 'firebase/firestore';
import { Quiz, QuizAttempt, LeaderboardEntry, QuizRegistration, EnrolledParticipant } from '@/types/quiz';
import { CHEILOSCOPY_QUESTIONS } from '@/data/cheiloscopyQuestions';
import { BLOOD_STAIN_QUESTIONS } from '@/data/bloodStainQuestions';

const QUIZZES_COLLECTION = 'quizzes';
const ATTEMPTS_COLLECTION = 'quizAttempts';
const REGISTRATIONS_COLLECTION = 'quizRegistrations';

// Initial sample quizzes for seed fallback
export const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: 'practice-bpa-1',
    title: 'Bloodstain Pattern Identification: 15 Beginner Questions',
    description: 'Identify bloodstains from 15 original teaching diagrams. Beginner questions on drips, pools, flow, transfer, swipe, wipe, cast-off, voids, direction and blood properties, including two short cases. 15 minutes, 150 points, with explanations and optional study clues.',
    category: 'Bloodstain Pattern Analysis (BPA)',
    isWeeklyChallenge: false,
    durationMinutes: 15,
    totalPoints: 150,
    passingScore: 90,
    enrolledUserIds: [],
    createdBy: 'ForenClue Serology & BPA Division',
    createdAt: new Date().toISOString(),
    thumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    coverImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200',
    bannerImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
    questions: BLOOD_STAIN_QUESTIONS
  },
  {
    id: 'weekly-challenge-cheiloscopy',
    title: 'Weekly Challenge: Cheiloscopy & Forensic Lip Print Analysis',
    description: 'Comprehensive 30-question forensic assessment on Cheiloscopy (lip print analysis) based on scientific classification systems (Suzuki & Tsuchihashi, Martin Santos, Renaud), anatomical morphology of sulci labiorum, latent print development with lysochrome dyes, identical twin studies, chemical lipstick chromatography, and judicial admissibility standards.',
    category: 'Forensic Odontology & Biometrics',
    isWeeklyChallenge: true,
    scheduledStartTime: new Date(Date.now() - 300000).toISOString(), // Started 5 minutes ago (Live)
    scheduledEndTime: new Date(Date.now() + 30 * 60000).toISOString(), // 35 minutes total duration
    durationMinutes: 35,
    totalPoints: 300,
    passingScore: 210,
    enrolledUserIds: [],
    isEnrollmentOpen: true,
    createdBy: 'ForenClue Odontology Division',
    createdAt: new Date().toISOString(),
    thumbnail: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    coverImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200',
    bannerImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    questions: CHEILOSCOPY_QUESTIONS
  },
  {
    id: 'weekly-challenge-1',
    title: 'Weekly Challenge #1: Fingerprint Analysis & Friction Ridge Patterns',
    description: 'Test your expertise in loop, whorl, and arch pattern classification, minutiae identification, and AFIS database matching under timed challenge conditions!',
    category: 'Forensic Identification',
    isWeeklyChallenge: true,
    scheduledStartTime: new Date(Date.now() + 86400000 * 2).toISOString(), // Starts in 2 days
    scheduledEndTime: new Date(Date.now() + 86400000 * 5).toISOString(), // Active for 3 days
    durationMinutes: 10,
    totalPoints: 100,
    passingScore: 70,
    enrolledUserIds: [],
    createdBy: 'ForenClue Team',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        question: 'Which of the following fingerprint ridge patterns is the most common in the human population?',
        options: ['Arches (5%)', 'Loops (60-65%)', 'Whorls (30-35%)', 'Accidental (1%)'],
        correctAnswerIndex: 1,
        explanation: 'Loop patterns account for approximately 60-65% of all human fingerprints, making them the most prevalent ridge pattern.',
        points: 20
      },
      {
        id: 'q2',
        question: 'What term describes individual ridge characteristics such as bifurcations, ridge endings, and dots used for identification?',
        options: ['Luminol', 'Minutiae', 'Striations', 'Agglutination'],
        correctAnswerIndex: 1,
        explanation: 'Minutiae are the major ridge characteristics used in friction ridge analysis to establish individual identity.',
        points: 20
      },
      {
        id: 'q3',
        question: 'Cyanoacrylate ester fuming (Superglue) is most effective for developing latent prints on which surface type?',
        options: ['Porous paper', 'Untreated wood', 'Non-porous surfaces like glass and plastic', 'Raw leather'],
        correctAnswerIndex: 2,
        explanation: 'Cyanoacrylate ester reacts with amino acids and water in latent print residues on non-porous surfaces to form a durable white polymer.',
        points: 20
      },
      {
        id: 'q4',
        question: 'In Henry Classification system, value numbers are assigned to finger pairs based on the presence of which pattern?',
        options: ['Radial Loops', 'Whorls', 'Plain Arches', 'Tented Arches'],
        correctAnswerIndex: 1,
        explanation: 'The Henry Classification system assigns numerical primary values exclusively to fingers containing whorl patterns.',
        points: 20
      },
      {
        id: 'q5',
        question: 'AFIS stands for which automated criminal investigation system?',
        options: ['Automated Forensic Identification System', 'Automated Fingerprint Identification System', 'Advanced Friction Image System', 'Automated Footwear Identification System'],
        correctAnswerIndex: 1,
        explanation: 'AFIS stands for Automated Fingerprint Identification System, used worldwide by law enforcement agencies.',
        points: 20
      }
    ]
  },
  {
    id: 'weekly-challenge-2',
    title: 'Weekly Challenge #2: Forensic Serology & DNA Profiling',
    description: 'Upcoming high-stakes quiz on STR profiling, Kastle-Meyer presumptive testing, and capillary electrophoresis analysis.',
    category: 'Forensic Biology',
    isWeeklyChallenge: true,
    scheduledStartTime: new Date(Date.now() + 86400000 * 2).toISOString(), // Starts in 2 days
    scheduledEndTime: new Date(Date.now() + 86400000 * 5).toISOString(),
    durationMinutes: 15,
    totalPoints: 100,
    passingScore: 75,
    enrolledUserIds: [],
    createdBy: 'Dr. A. Gaikwad',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'q1',
        question: 'What enzyme present in red blood cells causes the rapid oxidation of phenolphthalein in the Kastle-Meyer test?',
        options: ['Amylase', 'Peroxidase activity of hemoglobin', 'Acid phosphatase', 'Creatine kinase'],
        correctAnswerIndex: 1,
        explanation: 'Hemoglobin exhibits peroxidase-like activity, catalyzing the breakdown of hydrogen peroxide to turn reduced phenolphthalein bright pink.',
        points: 25
      },
      {
        id: 'q2',
        question: 'Which loci type is primarily analyzed in standard CODIS forensic human DNA profiling?',
        options: ['Single Nucleotide Polymorphisms (SNPs)', 'Short Tandem Repeats (STRs)', 'Mitochondrial D-Loop', 'Restriction Fragment Length Polymorphisms (RFLPs)'],
        correctAnswerIndex: 1,
        explanation: 'CODIS core loci rely on STRs (Short Tandem Repeats) due to high variability and suitability for degraded DNA samples.',
        points: 25
      },
      {
        id: 'q3',
        question: 'Amelogenin gene analysis in DNA profiling is specifically used to determine:',
        options: ['Age of individual', 'Biological sex', 'Geographic ancestry', 'Eye color'],
        correctAnswerIndex: 1,
        explanation: 'The Amelogenin gene yields a 106 bp fragment for X and 112 bp fragment for Y chromosome, revealing biological sex.',
        points: 25
      },
      {
        id: 'q4',
        question: 'Which presumpive test for semen detects the presence of prostatic acid phosphatase enzyme?',
        options: ['Takayama Test', 'AP (Acid Phosphatase) Test', 'Teichmann Test', 'Leucomalachite Green Test'],
        correctAnswerIndex: 1,
        explanation: 'The Acid Phosphatase (AP) test uses alpha-naphthyl phosphate and Fast Blue B dye to produce a deep purple color reaction.',
        points: 25
      }
    ]
  },
  {
    id: 'weekly-challenge-0',
    title: 'Weekly Challenge #0: Forensic Ballistics & Firearms Identification',
    description: 'Concluded weekly challenge covering striation pattern comparison, gunshot residue (GSR) analysis, and caliber measurements. Available now for self-paced practice!',
    category: 'Forensic Ballistics',
    isWeeklyChallenge: true,
    scheduledStartTime: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
    scheduledEndTime: new Date(Date.now() - 86400000 * 3).toISOString(), // Ended 3 days ago
    durationMinutes: 12,
    totalPoints: 100,
    passingScore: 70,
    enrolledUserIds: [],
    createdBy: 'ForenClue Team',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    questions: [
      {
        id: 'b1',
        question: 'What microscopic instrument is essential for comparing striations on two fired bullets side-by-side?',
        options: ['Scanning Electron Microscope', 'Comparison Microscope', 'Stereo Microscope', 'Polarizing Light Microscope'],
        correctAnswerIndex: 1,
        explanation: 'A comparison microscope consists of two microscopes linked by an optical bridge, allowing side-by-side comparison of lands and grooves.',
        points: 25
      },
      {
        id: 'b2',
        question: 'Which elements are primarily tested for in chemical analysis of Gunshot Residue (GSR)?',
        options: ['Lead, Barium, Antimony', 'Iron, Copper, Zinc', 'Sodium, Potassium, Chloride', 'Carbon, Hydrogen, Oxygen'],
        correctAnswerIndex: 0,
        explanation: 'GSR primers typically contain Lead (Pb), Barium (Ba), and Antimony (Sb), detected via SEM-EDS or ICP-MS.',
        points: 25
      },
      {
        id: 'b3',
        question: 'The spiral grooves cut into the interior barrel of a firearm to impart spin on a bullet are known as:',
        options: ['Caliber', 'Rifling (Lands & Grooves)', 'Bore gauge', 'Firing pin impression'],
        correctAnswerIndex: 1,
        explanation: 'Rifling consists of helical lands and grooves cut inside the barrel to stabilize the bullet in flight.',
        points: 25
      },
      {
        id: 'b4',
        question: 'What automated database is used by firearm examiners to compare digitized bullet and cartridge casing impressions?',
        options: ['CODIS', 'NIBIN (National Integrated Ballistic Information Network)', 'AFIS', 'NCIC'],
        correctAnswerIndex: 1,
        explanation: 'NIBIN is the national database system maintained for ballistics evidence matching.',
        points: 25
      }
    ]
  },
  {
    id: 'quiz-general-1',
    title: 'Crime Scene Investigation Fundamentals',
    description: 'Standard practice quiz covering chain of custody, crime scene perimeter securing, 7 S\'s of CSI, and evidence collection protocol.',
    category: 'Crime Scene Investigation',
    isWeeklyChallenge: false,
    durationMinutes: 12,
    totalPoints: 100,
    passingScore: 60,
    enrolledUserIds: [],
    createdBy: 'ForenClue Admin',
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: 'g1',
        question: 'Who is responsible for securing the crime scene first upon arrival?',
        options: ['Lead Forensic Detective', 'First Responding Officer', 'Medical Examiner', 'Media Relations Specialist'],
        correctAnswerIndex: 1,
        explanation: 'The first responding law enforcement officer is responsible for preserving life and securing the perimeter of the scene.',
        points: 25
      },
      {
        id: 'g2',
        question: 'Why must biological evidence such as bloodstained clothing never be packaged in airtight plastic bags?',
        options: ['Plastic reacts with DNA', 'Trapped moisture causes mold growth that destroys biological material', 'Plastic absorbs bloodstain patterns', 'Plastic increases UV degradation'],
        correctAnswerIndex: 1,
        explanation: 'Moisture in sealed plastic causes rapid bacterial and fungal growth, degrading DNA evidence. Breathable paper bags must be used.',
        points: 25
      },
      {
        id: 'g3',
        question: 'What document establishes every individual who held, transferred, or analyzed physical evidence from collection to court?',
        options: ['Search Warrant', 'Chain of Custody', 'Affidavit of Probable Cause', 'Subpoena duces tecum'],
        correctAnswerIndex: 1,
        explanation: 'The Chain of Custody log documents the chronological paper trail verifying evidence integrity in legal proceedings.',
        points: 25
      },
      {
        id: 'g4',
        question: 'Which of Locard\'s fundamental principles states that every contact leaves a trace?',
        options: ['Locard\'s Exchange Principle', 'Frye Standard', 'Daubert Standard', 'Individualization Postulate'],
        correctAnswerIndex: 0,
        explanation: 'Locard\'s Exchange Principle asserts that whenever two objects come into contact, a mutual transfer of material occurs.',
        points: 25
      }
    ]
  }
];

// Helper to check if a weekly challenge has completed/passed its scheduled date and time
export function isWeeklyChallengeExpired(quiz: Quiz): boolean {
  if (!quiz.isWeeklyChallenge) return false;
  if (!quiz.scheduledStartTime && !quiz.scheduledEndTime) return false;

  const now = Date.now();
  if (quiz.scheduledEndTime) {
    return now > new Date(quiz.scheduledEndTime).getTime();
  }
  if (quiz.scheduledStartTime) {
    const start = new Date(quiz.scheduledStartTime).getTime();
    const durationMs = (quiz.durationMinutes || 15) * 60000;
    return now > (start + durationMs);
  }
  return false;
}

// Helper to force sample challenges to have scheduled times if missing
function applyQuizOverrides(quiz: Quiz): Quiz {
  if (quiz.id === 'weekly-challenge-cheiloscopy') {
    quiz.durationMinutes = 35;
    if (!quiz.scheduledStartTime) {
      quiz.scheduledStartTime = new Date(Date.now() - 300000).toISOString();
    }
    const startMs = new Date(quiz.scheduledStartTime).getTime();
    quiz.scheduledEndTime = new Date(startMs + 35 * 60000).toISOString();
    quiz.isEnrollmentOpen = true;
    quiz.isWeeklyChallenge = true;
  } else if (quiz.id === 'weekly-challenge-1') {
    if (!quiz.scheduledStartTime) {
      quiz.scheduledStartTime = new Date(Date.now() + 86400000 * 2).toISOString();
      quiz.scheduledEndTime = new Date(Date.now() + 86400000 * 5).toISOString();
    }
    quiz.isEnrollmentOpen = true;
  } else if (quiz.id === 'weekly-challenge-2') {
    if (!quiz.scheduledStartTime) {
      quiz.scheduledStartTime = new Date(Date.now() + 86400000 * 4).toISOString();
      quiz.scheduledEndTime = new Date(Date.now() + 86400000 * 7).toISOString();
    }
    quiz.isEnrollmentOpen = false;
  } else if (quiz.id === 'weekly-challenge-0') {
    if (!quiz.scheduledStartTime) {
      quiz.scheduledStartTime = new Date(Date.now() - 86400000 * 7).toISOString();
      quiz.scheduledEndTime = new Date(Date.now() - 86400000 * 3).toISOString();
    }
    quiz.isEnrollmentOpen = false;
  } else if (quiz.id === 'practice-bpa-1') {
    // This authored practice bank is maintained in code. Do not serve stale database questions.
    // No database records or previous attempts are changed here.
    quiz.isWeeklyChallenge = false;
    quiz.title = 'Bloodstain Pattern Identification: 15 Beginner Questions';
    quiz.description = 'Identify bloodstains from 15 original teaching diagrams. Beginner questions on drips, pools, flow, transfer, swipe, wipe, cast-off, voids, direction and blood properties, including two short cases. 15 minutes, 150 points, with explanations and optional study clues.';
    quiz.category = 'Bloodstain Pattern Analysis (BPA)';
    quiz.durationMinutes = 15;
    quiz.totalPoints = 150;
    quiz.passingScore = 90;
    quiz.questions = BLOOD_STAIN_QUESTIONS;
  }
  return quiz;
}

// Fetch all Quizzes (Public - only published)
export async function fetchQuizzes(): Promise<Quiz[]> {
  try {
    const all = await fetchAdminQuizzes();
    return all.filter(q => q.status !== 'draft');
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, QUIZZES_COLLECTION);
    return SAMPLE_QUIZZES.map(applyQuizOverrides).filter(q => q.status !== 'draft');
  }
}

// Fetch all Quizzes for Admin (includes both drafts and published)
export async function fetchAdminQuizzes(): Promise<Quiz[]> {
  try {
    const qSnap = await getDocs(collection(db, QUIZZES_COLLECTION));
    if (qSnap.empty) {
      // Seed initial sample quizzes if DB is empty
      console.log("Seeding sample quizzes into Firestore...");
      for (const quiz of SAMPLE_QUIZZES) {
        await setDoc(doc(db, QUIZZES_COLLECTION, quiz.id), { ...quiz, status: quiz.status || 'published' });
      }
      return SAMPLE_QUIZZES.map(applyQuizOverrides);
    }
    const quizzes: Quiz[] = [];
    const dbQuizIds = new Set<string>();
    qSnap.forEach((docSnap) => {
      dbQuizIds.add(docSnap.id);
      const data = { id: docSnap.id, ...docSnap.data() } as Quiz;
      if (!data.questions || data.questions.length === 0) {
        const sample = SAMPLE_QUIZZES.find(q => q.id === docSnap.id);
        if (sample?.questions) {
          data.questions = sample.questions;
        }
      }
      quizzes.push(applyQuizOverrides(data));
    });

    // Ensure built-in challenges (like Cheiloscopy) are included if not yet in Firestore
    for (const sample of SAMPLE_QUIZZES) {
      if (!dbQuizIds.has(sample.id)) {
        quizzes.unshift(applyQuizOverrides({ ...sample, status: sample.status || 'published' }));
        // Non-blocking sync to Firestore
        setDoc(doc(db, QUIZZES_COLLECTION, sample.id), { ...sample, status: sample.status || 'published' }).catch(e => {
          console.warn("Could not sync sample quiz to Firestore:", e);
        });
      }
    }

    return quizzes;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, QUIZZES_COLLECTION);
    return SAMPLE_QUIZZES.map(applyQuizOverrides);
  }
}

// Fetch single quiz by ID
export async function fetchQuizById(quizId: string): Promise<Quiz | null> {
  try {
    const docRef = doc(db, QUIZZES_COLLECTION, quizId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Quiz;
      // If questions are missing in Firestore for sample quiz, populate from SAMPLE_QUIZZES
      if (!data.questions || data.questions.length === 0) {
        const sample = SAMPLE_QUIZZES.find(q => q.id === quizId);
        if (sample) {
          data.questions = sample.questions;
        }
      }
      return applyQuizOverrides({ id: docSnap.id, ...data });
    }
    // Fallback to sample array
    const sample = SAMPLE_QUIZZES.find(q => q.id === quizId);
    return sample ? applyQuizOverrides(sample) : null;
  } catch (err) {
    console.warn("Falling back to local sample quiz:", err);
    const sample = SAMPLE_QUIZZES.find(q => q.id === quizId);
    return sample ? applyQuizOverrides(sample) : null;
  }
}

// Enroll user in Weekly Challenge
export async function enrollInQuiz(quizId: string, userId: string): Promise<boolean> {
  try {
    const docRef = doc(db, QUIZZES_COLLECTION, quizId);
    await updateDoc(docRef, {
      enrolledUserIds: arrayUnion(userId)
    });
    return true;
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${QUIZZES_COLLECTION}/${quizId}`);
    return false;
  }
}

// Submit Quiz Attempt
export async function submitQuizAttempt(attempt: QuizAttempt): Promise<string> {
  const completedAt = attempt.completedAt || new Date().toISOString();
  let isPractice = attempt.isPractice || false;

  // Auto-detect if attempt should be marked as practice
  if (attempt.quizId) {
    try {
      const quiz = await fetchQuizById(attempt.quizId);
      if (quiz) {
        if (!quiz.isWeeklyChallenge || isWeeklyChallengeExpired(quiz)) {
          isPractice = true;
        } else {
          // Check if user has a prior live attempt for this weekly challenge
          const userAttempts = await fetchUserQuizAttempts(attempt.userId);
          const hasPriorAttempt = userAttempts.some(a => a.quizId === attempt.quizId && !a.isPractice);
          if (hasPriorAttempt) {
            isPractice = true;
          }
        }
      }
    } catch (e) {
      console.warn("Could not determine practice status for attempt:", e);
    }
  }

  const attemptWithTime: QuizAttempt = { ...attempt, completedAt, isPractice };

  // 1. Save to Local Storage Cache for instant retrieval
  if (attempt.userId) {
    const localKey = `forenclue_quiz_attempts_${attempt.userId}`;
    try {
      const existingRaw = localStorage.getItem(localKey);
      const existing: QuizAttempt[] = existingRaw ? JSON.parse(existingRaw) : [];
      existing.unshift(attemptWithTime);
      localStorage.setItem(localKey, JSON.stringify(existing));
    } catch (e) {
      console.warn("Failed to cache quiz attempt locally:", e);
    }

    // 2. Update user profile document in Firestore with total points and quiz history
    try {
      const userRef = doc(db, 'users', attempt.userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentPoints = userData.totalQuizPoints || 0;
        const currentHistory = userData.quizHistory || [];
        const existingQuizScores = userData.quizScores || {};
        const previousBest = existingQuizScores[attempt.quizId]?.bestScore || 0;
        
        await updateDoc(userRef, {
          totalQuizPoints: currentPoints + attempt.score,
          [`quizScores.${attempt.quizId}`]: {
            bestScore: Math.max(previousBest, attempt.score),
            lastScore: attempt.score,
            totalPoints: attempt.totalPoints,
            completedAt
          },
          quizHistory: [
            {
              quizId: attempt.quizId,
              score: attempt.score,
              totalPoints: attempt.totalPoints,
              timeTakenSeconds: attempt.timeTakenSeconds,
              completedAt
            },
            ...currentHistory
          ].slice(0, 50)
        });
      }
    } catch (e) {
      console.warn("Failed to update user profile with quiz points:", e);
    }
  }

  // 3. Save to Firestore attempts collection
  try {
    const docRef = await addDoc(collection(db, ATTEMPTS_COLLECTION), attemptWithTime);

    // Also auto-ensure user is in quiz.enrolledUserIds
    if (attempt.quizId && attempt.userId) {
      try {
        const quizRef = doc(db, QUIZZES_COLLECTION, attempt.quizId);
        await updateDoc(quizRef, {
          enrolledUserIds: arrayUnion(attempt.userId)
        });
      } catch (e) {
        // Non-blocking if sample quiz
      }
    }

    return docRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, ATTEMPTS_COLLECTION);
    return `local_${Date.now()}`;
  }
}

// Fetch all quiz attempts for a specific user
export async function fetchUserQuizAttempts(userId: string): Promise<QuizAttempt[]> {
  if (!userId) return [];

  const localKey = `forenclue_quiz_attempts_${userId}`;
  let localAttempts: QuizAttempt[] = [];
  try {
    const raw = localStorage.getItem(localKey);
    if (raw) localAttempts = JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to parse local quiz attempts", e);
  }

  try {
    const attemptsRef = collection(db, ATTEMPTS_COLLECTION);
    const q = query(attemptsRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    const remoteAttempts: QuizAttempt[] = [];
    snap.forEach((d) => {
      remoteAttempts.push({ id: d.id, ...d.data() } as QuizAttempt);
    });

    const mergedMap = new Map<string, QuizAttempt>();
    remoteAttempts.forEach(a => {
      const key = a.id || `${a.quizId}_${a.completedAt}`;
      mergedMap.set(key, a);
    });
    localAttempts.forEach(a => {
      const key = a.id || `${a.quizId}_${a.completedAt}`;
      if (!mergedMap.has(key)) {
        mergedMap.set(key, a);
      }
    });

    const combined = Array.from(mergedMap.values());
    combined.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

    try {
      localStorage.setItem(localKey, JSON.stringify(combined));
    } catch {}

    return combined;
  } catch (err) {
    console.warn("Falling back to local quiz attempts:", err);
    return localAttempts;
  }
}

// Fetch Top 10 Leaderboard for a quiz
export async function fetchLeaderboard(quiz: Quiz): Promise<LeaderboardEntry[]> {
  try {
    const attemptsRef = collection(db, ATTEMPTS_COLLECTION);
    const q = query(
      attemptsRef, 
      where('quizId', '==', quiz.id)
    );
    const snap = await getDocs(q);
    let attempts: QuizAttempt[] = [];
    
    snap.forEach((d) => {
      attempts.push({ id: d.id, ...d.data() } as QuizAttempt);
    });

    // Filter attempts based on challenge timeframe & practice status
    if (quiz.isWeeklyChallenge) {
      let startTime = 0;
      let endTime = Infinity;

      if (quiz.scheduledStartTime) {
        startTime = new Date(quiz.scheduledStartTime).getTime();
      }
      if (quiz.scheduledEndTime) {
        endTime = new Date(quiz.scheduledEndTime).getTime();
      } else if (startTime > 0) {
        endTime = startTime + (quiz.durationMinutes || 15) * 60000;
      }

      // 1. Exclude practice attempts and attempts submitted outside official challenge window
      attempts = attempts.filter(a => {
        if (a.isPractice) return false;
        if (!a.completedAt) return true; 

        const compTime = new Date(a.completedAt).getTime();
        if (startTime > 0 && compTime < startTime) return false;
        if (endTime < Infinity && compTime > endTime) return false;

        return true;
      });

      // 2. Keep only each user's FIRST (earliest) attempt taken during the live challenge
      const firstAttempts = new Map<string, QuizAttempt>();
      const sortedByTime = [...attempts].sort((a, b) => {
        const tA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const tB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return tA - tB;
      });

      for (const att of sortedByTime) {
        if (!firstAttempts.has(att.userId)) {
          firstAttempts.set(att.userId, att);
        }
      }
      attempts = Array.from(firstAttempts.values());
    } else {
      // For practice quizzes, keep each user's best attempt
      const bestAttempts = new Map<string, QuizAttempt>();
      for (const att of attempts) {
        const existing = bestAttempts.get(att.userId);
        if (!existing || att.score > existing.score || (att.score === existing.score && att.timeTakenSeconds < existing.timeTakenSeconds)) {
          bestAttempts.set(att.userId, att);
        }
      }
      attempts = Array.from(bestAttempts.values());
    }

    // Recalculate score from answers to fix legacy point calculation glitch
    attempts = attempts.map(att => {
      let trueScore = 0;
      if (att.answers && quiz.questions && (quiz.id !== 'practice-bpa-1' || quiz.questions.some(q => Object.prototype.hasOwnProperty.call(att.answers, q.id)))) {
        quiz.questions.forEach(q => {
          if (att.answers[q.id] !== undefined && att.answers[q.id] === q.correctAnswerIndex) {
            trueScore += q.points || 10;
          }
        });
      } else {
        trueScore = att.score;
      }
      return {
        ...att,
        score: Math.min(trueScore, att.totalPoints || 100)
      };
    });

    // Sort: score DESC, timeTakenSeconds ASC
    attempts.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.timeTakenSeconds - b.timeTakenSeconds;
    });

    // Top 10 entries only
    const top10 = attempts.slice(0, 10).map((att, idx) => ({
      ...att,
      rank: idx + 1,
      accuracyPercentage: Math.round((att.score / (att.totalPoints || 100)) * 100)
    }));

    return top10;
  } catch (err) {
    console.warn("Using leaderboard fallback/error state:", err);
    return [];
  }
}

// Admin API: Save or Update Quiz
export async function saveQuiz(quiz: Partial<Quiz>): Promise<string> {
  try {
    const dataToSave = {
      ...quiz,
      status: quiz.status || 'published'
    };
    if (quiz.id) {
      const docRef = doc(db, QUIZZES_COLLECTION, quiz.id);
      await setDoc(docRef, { ...dataToSave, updatedAt: new Date().toISOString() }, { merge: true });
      return quiz.id;
    } else {
      const docRef = await addDoc(collection(db, QUIZZES_COLLECTION), {
        ...dataToSave,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, QUIZZES_COLLECTION);
    throw err;
  }
}

// Admin API: Quick Update Quiz Status (draft <-> published)
export async function updateQuizStatus(quizId: string, status: 'draft' | 'published'): Promise<void> {
  try {
    const docRef = doc(db, QUIZZES_COLLECTION, quizId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `${QUIZZES_COLLECTION}/${quizId}`);
    throw err;
  }
}

// Admin API: Delete Quiz
export async function deleteQuiz(quizId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, QUIZZES_COLLECTION, quizId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `${QUIZZES_COLLECTION}/${quizId}`);
  }
}

// Submit Paid Quiz Registration with 12-digit UTR
export async function submitQuizRegistration(registration: Omit<QuizRegistration, 'id' | 'createdAt' | 'status'>): Promise<string> {
  try {
    // 1. Sanitize & Validate UTR
    const rawUtr = registration.utrNumber || '';
    const utrTrimmed = rawUtr.trim().replace(/\s+/g, '').toUpperCase();
    if (!utrTrimmed || utrTrimmed.length < 6) {
      throw new Error('Please provide a valid UTR / transaction reference number (typically 12 digits).');
    }

    if (!registration.userId) {
      throw new Error('User authentication required to submit registration.');
    }

    if (!registration.quizId) {
      throw new Error('Target challenge identifier is missing.');
    }

    // Deterministic registration Document ID: userId_quizId
    const deterministicId = `${registration.userId}_${registration.quizId}`;
    const regDocRef = doc(db, REGISTRATIONS_COLLECTION, deterministicId);

    // Check if deterministic document already exists
    const existingSnap = await getDoc(regDocRef);
    if (existingSnap.exists()) {
      const existingData = existingSnap.data() as QuizRegistration;
      if (existingData.status === 'approved') {
        throw new Error('Your registration for this challenge has already been approved!');
      }
    }

    const payload: Omit<QuizRegistration, 'id'> = {
      quizId: registration.quizId,
      quizTitle: registration.quizTitle || 'Quiz Challenge',
      userId: registration.userId,
      userName: (registration.userName || 'Candidate').trim(),
      userEmail: (registration.userEmail || '').trim(),
      utrNumber: utrTrimmed,
      senderName: (registration.senderName || registration.userName || 'Candidate').trim(),
      amount: Number(registration.amount) || 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      rejectReason: ''
    };

    // Save with deterministic doc ID
    await setDoc(regDocRef, payload, { merge: true });

    // Also check for any legacy random-ID documents for this user & quiz to keep state in sync
    try {
      const legacyQuery = query(
        collection(db, REGISTRATIONS_COLLECTION),
        where('userId', '==', registration.userId),
        where('quizId', '==', registration.quizId)
      );
      const legacySnap = await getDocs(legacyQuery);
      for (const legacyDoc of legacySnap.docs) {
        if (legacyDoc.id !== deterministicId) {
          await updateDoc(doc(db, REGISTRATIONS_COLLECTION, legacyDoc.id), {
            ...payload
          }).catch(() => {});
        }
      }
    } catch {
      // Non-blocking legacy cleanup
    }

    return deterministicId;
  } catch (err: any) {
    console.error('Error submitting quiz registration:', err);
    throw err;
  }
}

// Fetch user registration for a quiz
export async function getUserQuizRegistration(quizId: string, userId: string): Promise<QuizRegistration | null> {
  if (!quizId || !userId) return null;
  try {
    // 1. Direct deterministic document lookup (instant 1-doc read, 0 query overhead)
    const deterministicId = `${userId}_${quizId}`;
    const directDocRef = doc(db, REGISTRATIONS_COLLECTION, deterministicId);
    const directSnap = await getDoc(directDocRef);

    if (directSnap.exists()) {
      return { id: directSnap.id, ...directSnap.data() } as QuizRegistration;
    }

    // 2. Fallback query for legacy auto-generated document IDs
    const q = query(
      collection(db, REGISTRATIONS_COLLECTION),
      where('userId', '==', userId),
      where('quizId', '==', quizId)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;

    // Prefer approved status if multiple legacy records exist
    let bestDoc = snap.docs[0];
    for (const d of snap.docs) {
      const data = d.data() as QuizRegistration;
      if (data.status === 'approved') {
        bestDoc = d;
        break;
      }
    }

    return { id: bestDoc.id, ...bestDoc.data() } as QuizRegistration;
  } catch (err) {
    console.warn('Could not fetch user quiz registration:', err);
    return null;
  }
}

// Fetch all registrations (Admin)
export async function fetchQuizRegistrations(quizId?: string): Promise<QuizRegistration[]> {
  try {
    const regRef = collection(db, REGISTRATIONS_COLLECTION);
    let q = query(regRef);
    if (quizId) {
      q = query(regRef, where('quizId', '==', quizId));
    }
    const snap = await getDocs(q);
    const list: QuizRegistration[] = [];
    snap.forEach(docSnap => {
      list.push({ id: docSnap.id, ...docSnap.data() } as QuizRegistration);
    });
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (err) {
    console.warn('Could not fetch quiz registrations:', err);
    return [];
  }
}

// Admin: Approve Registration (Adds candidate to quiz.enrolledUserIds)
export async function approveQuizRegistration(registrationId: string, quizId: string, userId: string, reviewerName: string = 'Admin'): Promise<void> {
  try {
    // 1. Mark registration approved
    const regRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    await updateDoc(regRef, {
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerName
    });

    // 2. Add user to quiz enrolledUserIds
    const quizRef = doc(db, QUIZZES_COLLECTION, quizId);
    await updateDoc(quizRef, {
      enrolledUserIds: arrayUnion(userId)
    });
  } catch (err: any) {
    handleFirestoreError(err, OperationType.UPDATE, `${REGISTRATIONS_COLLECTION}/${registrationId}`);
    throw err;
  }
}

// Admin: Reject Registration
export async function rejectQuizRegistration(registrationId: string, reason: string = 'UTR verification failed', reviewerName: string = 'Admin'): Promise<void> {
  try {
    const regRef = doc(db, REGISTRATIONS_COLLECTION, registrationId);
    await updateDoc(regRef, {
      status: 'rejected',
      rejectReason: reason,
      reviewedAt: new Date().toISOString(),
      reviewedBy: reviewerName
    });
  } catch (err: any) {
    handleFirestoreError(err, OperationType.UPDATE, `${REGISTRATIONS_COLLECTION}/${registrationId}`);
    throw err;
  }
}

// Admin API: Unenroll a user from a quiz
export async function unenrollUserFromQuiz(quizId: string, userId: string): Promise<boolean> {
  try {
    const quizRef = doc(db, QUIZZES_COLLECTION, quizId);
    await updateDoc(quizRef, {
      enrolledUserIds: arrayRemove(userId)
    });
    return true;
  } catch (err) {
    console.error("Error unenrolling user:", err);
    return false;
  }
}

// Admin API: Fetch all enrolled participants for a published quiz or quiz challenge
export async function fetchEnrolledParticipantsForQuiz(quiz: Quiz): Promise<EnrolledParticipant[]> {
  try {
    const quizId = quiz.id;

    // 1. Fetch Registrations for this quiz (paid challenges, UTR submissions)
    let registrations: QuizRegistration[] = [];
    try {
      const regRef = collection(db, REGISTRATIONS_COLLECTION);
      const regSnap = await getDocs(query(regRef, where('quizId', '==', quizId)));
      regSnap.forEach(d => {
        registrations.push({ id: d.id, ...d.data() } as QuizRegistration);
      });
    } catch (e) {
      console.warn("Could not fetch quiz registrations:", e);
    }

    // 2. Fetch Attempts for this quiz (candidate scores, times, completions)
    let attempts: QuizAttempt[] = [];
    try {
      const attemptsRef = collection(db, ATTEMPTS_COLLECTION);
      const attSnap = await getDocs(query(attemptsRef, where('quizId', '==', quizId)));
      attSnap.forEach(d => {
        attempts.push({ id: d.id, ...d.data() } as QuizAttempt);
      });
    } catch (e) {
      console.warn("Could not fetch quiz attempts:", e);
    }

    // Map registrations by userId
    const regByUserId = new Map<string, QuizRegistration>();
    registrations.forEach(r => {
      const existing = regByUserId.get(r.userId);
      if (!existing || (r.status === 'approved' && existing.status !== 'approved') || new Date(r.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
        regByUserId.set(r.userId, r);
      }
    });

    // Map best attempts by userId
    const attemptByUserId = new Map<string, QuizAttempt>();
    attempts.forEach(a => {
      const existing = attemptByUserId.get(a.userId);
      if (!existing || a.score > existing.score || (a.score === existing.score && a.timeTakenSeconds < existing.timeTakenSeconds)) {
        attemptByUserId.set(a.userId, a);
      }
    });

    // Gather all candidate IDs from enrolledUserIds, registrations, and attempts
    const allUserIds = new Set<string>();
    (quiz.enrolledUserIds || []).forEach(uid => {
      if (uid) allUserIds.add(uid);
    });
    registrations.forEach(r => {
      if (r.userId) allUserIds.add(r.userId);
    });
    attempts.forEach(a => {
      if (a.userId) allUserIds.add(a.userId);
    });

    if (allUserIds.size === 0) {
      return [];
    }

    // Fetch user profiles for all candidate IDs
    const userDocPromises = Array.from(allUserIds).map(async (uid) => {
      let profile: any = null;
      try {
        const uSnap = await getDoc(doc(db, 'users', uid));
        if (uSnap.exists()) {
          profile = uSnap.data();
        }
      } catch (e) {
        // user document may not exist or offline
      }

      const reg = regByUserId.get(uid);
      const att = attemptByUserId.get(uid);

      const name = profile?.displayName || profile?.name || att?.userName || reg?.userName || reg?.senderName || 'Candidate';
      const email = profile?.email || att?.userEmail || reg?.userEmail || (uid.includes('@') ? uid : 'N/A');
      const photo = profile?.photoURL || profile?.avatar || att?.userPhoto || '';
      const college = profile?.college || profile?.university || 'Forensic Science Aspirant';

      const isPaid = quiz.isPaid || Boolean(reg);
      const regStatus = reg?.status || (quiz.enrolledUserIds?.includes(uid) ? 'approved' : 'approved');
      const enrolledAt = reg?.createdAt || att?.completedAt || profile?.createdAt || quiz.createdAt || new Date().toISOString();

      const participant: EnrolledParticipant = {
        userId: uid,
        userName: name,
        userEmail: email,
        userPhoto: photo,
        college: college,
        enrolledAt: enrolledAt,
        enrollmentType: isPaid ? 'paid' : 'free',
        registrationStatus: regStatus,
        utrNumber: reg?.utrNumber,
        amountPaid: reg?.amount || (isPaid ? (quiz.price || 49) : 0),
        hasAttempted: Boolean(att),
        score: att?.score,
        totalPoints: att?.totalPoints || quiz.totalPoints,
        timeTakenSeconds: att?.timeTakenSeconds,
        completedAt: att?.completedAt,
        isPractice: att?.isPractice,
        accuracyPercentage: att ? Math.round((att.score / (att.totalPoints || quiz.totalPoints || 100)) * 100) : undefined
      };

      return participant;
    });

    const participants = await Promise.all(userDocPromises);

    // Sort: Attempted candidates first (by score DESC), then by enrollment time DESC
    participants.sort((a, b) => {
      if (a.hasAttempted && !b.hasAttempted) return -1;
      if (!a.hasAttempted && b.hasAttempted) return 1;
      if (a.hasAttempted && b.hasAttempted) {
        if ((b.score ?? 0) !== (a.score ?? 0)) return (b.score ?? 0) - (a.score ?? 0);
        return (a.timeTakenSeconds ?? 0) - (b.timeTakenSeconds ?? 0);
      }
      return new Date(b.enrolledAt || 0).getTime() - new Date(a.enrolledAt || 0).getTime();
    });

    return participants;
  } catch (err) {
    console.error("Error fetching enrolled participants:", err);
    return [];
  }
}


