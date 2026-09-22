import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Mail, Key, LayoutGrid, BookOpen, Plus, Trash2, 
  Settings, CheckCircle2, AlertCircle, FileText, Upload, 
  ExternalLink, LogOut, Loader2, Sparkles, HelpCircle, 
  Globe, Edit3, MessageSquare, Radio, Award,
  Users, RefreshCw, ShieldCheck, Database, Fingerprint, ClipboardList,
  Star, Building2, MapPin, Eye, EyeOff, Wrench, Power, Clock, ShieldAlert, AlertTriangle,
  Trophy, CreditCard, Copy, Check, Shuffle, Search, Filter, Zap,
  X, Download, UserX, UserCheck, Calendar, Image as ImageIcon, Lightbulb, RotateCcw
} from 'lucide-react';
import { db, storage, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ResilientImage, uploadFileResilient, deleteFileResilient, resolveFileUrl } from '@/lib/localFileStore';
import { cn } from '@/lib/utils';
import { Quiz, QuizQuestion, QuizRegistration, LeaderboardEntry, EnrolledParticipant } from '@/types/quiz';
import { 
  fetchAdminQuizzes, 
  saveQuiz, 
  deleteQuiz,
  updateQuizStatus,
  fetchQuizRegistrations,
  approveQuizRegistration,
  rejectQuizRegistration,
  syncApprovedRegistrations,
  fetchLeaderboard,
  fetchEnrolledParticipantsForQuiz,
  unenrollUserFromQuiz,
  resetAllQuizEnrollments,
  isPaidQuiz
} from '@/services/quizService';
import { CRIME_SCENE_DOCUMENTATION_QUESTIONS } from '@/data/crimeSceneQuestions';
import { College, CollegeCourse } from '@/types/college';
import { fetchColleges as fetchAdminColleges, saveCollege as saveAdminCollege, deleteCollege as deleteAdminCollege } from '@/services/collegeService';
import { 
  MaintenanceConfig, 
  getDefaultIst1230Target, 
  saveMaintenanceConfig, 
  subscribeMaintenanceConfig, 
  calculateRemainingTime, 
  formatIstDisplay, 
  getCachedMaintenanceConfig 
} from '@/services/maintenanceService';


const getLocalDatetimeString = (dateObj: Date | string | number) => {
  const d = new Date(dateObj);
  if (isNaN(d.getTime())) return '';
  return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
};

export default function Admin() {
  const { user, isAdmin, isQuizOnlyAdmin, adminLogin, logout } = useAuth();
  const navigate = useNavigate();

  // Authentication Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Active Tab: 'overview' | 'courses' | 'ebooks' | 'texts' | 'doubts' | 'podcast' | 'certificates' | 'employees' | 'quizzes' | 'colleges' | 'inbox' | 'feedbacks' | 'maintenance'
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'ebooks' | 'texts' | 'doubts' | 'podcast' | 'certificates' | 'employees' | 'quizzes' | 'colleges' | 'inbox' | 'feedbacks' | 'maintenance'>('overview');

  // Maintenance Controls State
  const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceConfig>(getCachedMaintenanceConfig());
  const [isSavingMaintenance, setIsSavingMaintenance] = useState(false);
  const [maintenanceFeedback, setMaintenanceFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [maintenanceTitleInput, setMaintenanceTitleInput] = useState(() => getCachedMaintenanceConfig().title);
  const [maintenanceNoticeInput, setMaintenanceNoticeInput] = useState(() => getCachedMaintenanceConfig().notice);
  const [maintenanceTargetInput, setMaintenanceTargetInput] = useState(() => getLocalDatetimeString(getCachedMaintenanceConfig().targetEndTime));

  // Subscribe to real-time maintenance config updates in Admin
  useEffect(() => {
    const unsub = subscribeMaintenanceConfig((cfg) => {
      setMaintenanceConfig(cfg);
      setMaintenanceTitleInput(cfg.title);
      setMaintenanceNoticeInput(cfg.notice);
      setMaintenanceTargetInput(getLocalDatetimeString(cfg.targetEndTime));
    });
    return () => unsub();
  }, []);

  const handleToggleMaintenance = async (desiredState: boolean) => {
    setIsSavingMaintenance(true);
    setMaintenanceFeedback(null);
    try {
      await saveMaintenanceConfig({
        ...maintenanceConfig,
        isActive: desiredState
      }, user?.email || 'Admin');
      setMaintenanceFeedback({
        type: 'success',
        text: desiredState 
          ? 'Maintenance Mode has been engaged. Public users will now see the countdown page.' 
          : 'Maintenance Mode has been turned OFF. The website is now live for all visitors.'
      });
      setTimeout(() => setMaintenanceFeedback(null), 5000);
    } catch (err: any) {
      console.error(err);
      setMaintenanceFeedback({
        type: 'error',
        text: `Failed to update maintenance state: ${err.message || err}`
      });
    } finally {
      setIsSavingMaintenance(false);
    }
  };

  const handleSaveMaintenanceSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingMaintenance(true);
    setMaintenanceFeedback(null);
    try {
      const targetDate = maintenanceTargetInput ? new Date(maintenanceTargetInput).toISOString() : getDefaultIst1230Target();
      await saveMaintenanceConfig({
        ...maintenanceConfig,
        title: maintenanceTitleInput.trim() || 'Platform Maintenance in Progress',
        notice: maintenanceNoticeInput.trim() || 'We are performing scheduled improvements. ForenClue will be back online shortly.',
        targetEndTime: targetDate
      }, user?.email || 'Admin');

      setMaintenanceFeedback({
        type: 'success',
        text: 'Maintenance settings and countdown timer updated successfully across all servers!'
      });
      setTimeout(() => setMaintenanceFeedback(null), 5000);
    } catch (err: any) {
      console.error(err);
      setMaintenanceFeedback({
        type: 'error',
        text: `Failed to save maintenance settings: ${err.message || err}`
      });
    } finally {
      setIsSavingMaintenance(false);
    }
  };

  const handlePresetIst1230 = () => {
    const ist1230 = getDefaultIst1230Target();
    setMaintenanceTargetInput(getLocalDatetimeString(ist1230));
  };

  const handlePresetMinutes = (minutes: number) => {
    const target = new Date(Date.now() + minutes * 60 * 1000);
    setMaintenanceTargetInput(getLocalDatetimeString(target));
  };

  useEffect(() => {
    if (isQuizOnlyAdmin) {
      setActiveTab('quizzes');
    }
  }, [isQuizOnlyAdmin]);

  // Colleges Management State
  const [colleges, setColleges] = useState<College[]>([]);
  const [collegesLoading, setCollegesLoading] = useState(false);
  const [editingCollegeId, setEditingCollegeId] = useState<string | null>(null);
  const [deleteConfirmCollegeId, setDeleteConfirmCollegeId] = useState<string | null>(null);
  const [collegeSaveSuccess, setCollegeSaveSuccess] = useState('');

  const [collegeForm, setCollegeForm] = useState({
    name: '',
    shortName: '',
    country: 'India',
    state: '',
    city: '',
    type: 'Government' as College['type'],
    website: '',
    logo: '',
    bannerImage: '',
    description: '',
    feesRange: '',
    admissionProcess: '',
    accreditation: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    ranking: '',
    facilities: '',
    featured: false,
    coursesOffered: [
      {
        name: 'B.Sc. Forensic Science',
        degreeLevel: 'Bachelor' as CollegeCourse['degreeLevel'],
        duration: '3 Years',
        eligibility: '10+2 Science Stream (Min 50%)',
        estimatedFees: '₹40,000 / year',
        mode: 'Full-time' as CollegeCourse['mode'],
        specializations: ['Fingerprint Science', 'Toxicology']
      }
    ]
  });

  const [webinarFeedbacks, setWebinarFeedbacks] = useState<any[]>([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState(false);
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'pending' | 'approved'>('pending');

  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editingEbookId, setEditingEbookId] = useState<string | null>(null);
  const [editingPodcastId, setEditingPodcastId] = useState<string | null>(null);

  // Courses Management State
  const [courses, setCourses] = useState<any[]>([]);
  const [doubts, setDoubts] = useState<any[]>([]);
  const [podcastEpisodes, setPodcastEpisodes] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [podcastLoading, setPodcastLoading] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    instructor: 'Ayush Gaikwad',
    price: 0,
    originalPrice: 4999,
    level: 'Beginner',
    category: 'Forensic Science',
    duration: '12 Hours',
    description: '',
    thumbnail: '',
    instructorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    instructorBio: 'Lead Forensic Investigator & Cyber Analyst.',
    curriculumLines: '',
  });
  // Simple modules/lessons schema
  const [modules, setModules] = useState<any[]>([
    {
      id: 'm1',
      title: 'Module 1: Introduction to forensics',
      lessons: [
        { id: 'l1', title: 'Lesson 1.1: Core concept overview', duration: '15 mins', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
      ]
    }
  ]);

  // Ebooks state
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [ebookLoading, setEbookLoading] = useState(false);
  const [newEbook, setNewEbook] = useState({
    title: '',
    author: '',
    year: new Date().getFullYear(),
    category: 'Fundamentals',
    tabCategory: 'books', // 'books' | 'notes' | 'papers' | 'other'
    type: 'PDF',
    size: '12MB',
    image: '',
    pdfUrl: '',
    desc: '',
    uploadedBy: '',
    uploaderName: '',
    uploaderRole: 'Volunteer Contributor',
    uploaderPhoto: '',
    volunteerId: ''
  });

  // Podcast Episode dynamic state
  const [newEpisode, setNewEpisode] = useState({
    title: '',
    description: '',
    coverImage: '',
    audioUrl: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    duration: '30:00',
    durationSec: 1800
  });

  // Direct Storage Upload loading states
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [isUploadingPodcastCover, setIsUploadingPodcastCover] = useState(false);

  // Individual file upload feedback states
  const [pdfErrorText, setPdfErrorText] = useState('');
  const [pdfSuccessText, setPdfSuccessText] = useState('');
  const [coverErrorText, setCoverErrorText] = useState('');
  const [coverSuccessText, setCoverSuccessText] = useState('');
  const [thumbErrorText, setThumbErrorText] = useState('');
  const [thumbSuccessText, setThumbSuccessText] = useState('');
  const [audioErrorText, setAudioErrorText] = useState('');
  const [audioSuccessText, setAudioSuccessText] = useState('');
  const [podcastCoverErrorText, setPodcastCoverErrorText] = useState('');
  const [podcastCoverSuccessText, setPodcastCoverSuccessText] = useState('');

  // Website copy state
  const [copiedTexts, setCopiedTexts] = useState<any[]>([]);
  const [textKey, setTextKey] = useState('');
  const [textVal, setTextVal] = useState('');

  // Quizzes state
  const [adminQuizzes, setAdminQuizzes] = useState<Quiz[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);

  const [selectedQuizForEnrollment, setSelectedQuizForEnrollment] = useState<Quiz | null>(null);
  const [enrolledParticipants, setEnrolledParticipants] = useState<EnrolledParticipant[]>([]);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [enrolledSearchQuery, setEnrolledSearchQuery] = useState('');
  const [enrolledFilterTab, setEnrolledFilterTab] = useState<'all' | 'attempted' | 'not_attempted' | 'approved' | 'pending'>('all');
  const [copiedEmailsMsg, setCopiedEmailsMsg] = useState(false);
  const [copiedUtrMap, setCopiedUtrMap] = useState<Record<string, boolean>>({});
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  const handleViewEnrolledUsers = async (q: Quiz) => {
    setSelectedQuizForEnrollment(q);
    setIsUsersModalOpen(true);
    setFetchingUsers(true);
    setEnrolledSearchQuery('');
    setEnrolledFilterTab('all');
    try {
      const list = await fetchEnrolledParticipantsForQuiz(q);
      setEnrolledParticipants(list);
    } catch (err) {
      console.error("Error loading enrolled candidates:", err);
      setEnrolledParticipants([]);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleRefreshEnrolledUsers = async () => {
    if (!selectedQuizForEnrollment) return;
    setFetchingUsers(true);
    try {
      const list = await fetchEnrolledParticipantsForQuiz(selectedQuizForEnrollment);
      setEnrolledParticipants(list);
    } catch (err) {
      console.error("Error refreshing enrolled candidates:", err);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleUnenrollUser = async (participant: EnrolledParticipant) => {
    if (!selectedQuizForEnrollment) return;
    if (!window.confirm(`Unenroll candidate "${participant.userName}" (${participant.userEmail}) from "${selectedQuizForEnrollment.title}"?`)) return;
    setRemovingUserId(participant.userId);
    try {
      const ok = await unenrollUserFromQuiz(selectedQuizForEnrollment.id, participant.userId);
      if (ok) {
        setEnrolledParticipants(prev => prev.filter(p => p.userId !== participant.userId));
        setAdminQuizzes(prev => prev.map(q => {
          if (q.id === selectedQuizForEnrollment.id) {
            return {
              ...q,
              enrolledUserIds: (q.enrolledUserIds || []).filter(uid => uid !== participant.userId)
            };
          }
          return q;
        }));
      }
    } catch (e) {
      console.error("Error unenrolling candidate:", e);
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleResetAllEnrollments = async () => {
    if (!selectedQuizForEnrollment) return;
    if (!window.confirm(`Are you sure you want to RESET and CLEAR all enrolled participants from "${selectedQuizForEnrollment.title}"?\n\nThis will reset the challenge so all candidates (both old and new) must register/enroll anew. This action cannot be undone.`)) {
      return;
    }
    setFetchingUsers(true);
    try {
      const ok = await resetAllQuizEnrollments(selectedQuizForEnrollment.id);
      if (ok) {
        setEnrolledParticipants([]);
        setAdminQuizzes(prev => prev.map(q => {
          if (q.id === selectedQuizForEnrollment.id) {
            return { ...q, enrolledUserIds: [] };
          }
          return q;
        }));
        setSelectedQuizForEnrollment(prev => prev ? { ...prev, enrolledUserIds: [] } : null);
        setSuccessMsg(`All participant enrollments for "${selectedQuizForEnrollment.title}" have been successfully reset to 0. All users will now see fresh "Register / Enroll"!`);
        fetchCollections();
      }
    } catch (err: any) {
      setErrMsg(`Failed to reset enrollments: ${err.message}`);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleCopyEnrolledEmails = () => {
    const emails = enrolledParticipants
      .map(p => p.userEmail)
      .filter(e => e && e !== 'N/A' && e.includes('@'))
      .join(', ');
    if (emails) {
      navigator.clipboard.writeText(emails);
      setCopiedEmailsMsg(true);
      setTimeout(() => setCopiedEmailsMsg(false), 3000);
    }
  };

  const handleCopySingleUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtrMap(prev => ({ ...prev, [utr]: true }));
    setTimeout(() => {
      setCopiedUtrMap(prev => ({ ...prev, [utr]: false }));
    }, 2500);
  };

  const handleExportEnrolledCSV = () => {
    if (!selectedQuizForEnrollment || enrolledParticipants.length === 0) return;
    const headers = ['User ID', 'Candidate Name', 'Email', 'College/Institution', 'Enrollment Type', 'Status', 'UTR Number', 'Amount (INR)', 'Attempted', 'Score', 'Total Points', 'Accuracy %', 'Time Taken (s)', 'Completed At'];
    const rows = enrolledParticipants.map(p => [
      `"${p.userId}"`,
      `"${(p.userName || '').replace(/"/g, '""')}"`,
      `"${(p.userEmail || '').replace(/"/g, '""')}"`,
      `"${(p.college || '').replace(/"/g, '""')}"`,
      `"${p.enrollmentType === 'paid' ? 'Paid Challenge' : 'Free Enrollment'}"`,
      `"${p.registrationStatus || 'Approved'}"`,
      `"${p.utrNumber || 'N/A'}"`,
      `"${p.amountPaid || 0}"`,
      `"${p.hasAttempted ? 'YES' : 'NO'}"`,
      `"${p.score !== undefined ? p.score : 'N/A'}"`,
      `"${p.totalPoints || selectedQuizForEnrollment.totalPoints}"`,
      `"${p.accuracyPercentage !== undefined ? p.accuracyPercentage + '%' : 'N/A'}"`,
      `"${p.timeTakenSeconds !== undefined ? p.timeTakenSeconds : 'N/A'}"`,
      `"${p.completedAt ? new Date(p.completedAt).toLocaleString() : 'N/A'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Enrolled_${selectedQuizForEnrollment.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [newQuizForm, setNewQuizForm] = useState({
    title: '',
    description: '',
    category: 'Crime Scene Documentation',
    status: 'published' as 'draft' | 'published',
    isWeeklyChallenge: false,
    scheduledStartTime: '',
    durationMinutes: 30,
    totalPoints: 500,
    passingScore: 350,
    isPaid: false,
    price: 0,
    upiId: 'forenclue@okaxis',
    payeeName: 'ForenClue Forensic Services',
    upiQrUrl: '',
    firstPrize: 300,
    secondPrize: 200,
    thirdPrize: 100,
    registrationStartTime: '',
    registrationEndTime: '',
    shuffleQuestions: true,
    shuffleOptions: true,
    enableTabSwitchDetection: true
  });

  const [quizSubTab, setQuizSubTab] = useState<'editor' | 'approvals' | 'audit' | 'list'>('editor');
  const [quizRegistrations, setQuizRegistrations] = useState<QuizRegistration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [approvingRegId, setApprovingRegId] = useState<string | null>(null);
  const [regFilterStatus, setRegFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [regSearchTerm, setRegSearchTerm] = useState('');
  const [quizListFilter, setQuizListFilter] = useState<'all' | 'published' | 'drafts' | 'free' | 'paid'>('all');

  // Prize & Winner Audit State
  const [auditQuizId, setAuditQuizId] = useState<string>('');
  const [auditLeaderboard, setAuditLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const fetchRegistrationsList = async (targetQuizId?: string) => {
    setLoadingRegistrations(true);
    try {
      await syncApprovedRegistrations(targetQuizId);
      const data = await fetchQuizRegistrations(targetQuizId);
      setQuizRegistrations(data);
    } catch (e) {
      console.error("Failed to fetch registrations:", e);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleAuditQuiz = async (quizIdToAudit: string) => {
    setAuditQuizId(quizIdToAudit);
    const targetQuiz = adminQuizzes.find(q => q.id === quizIdToAudit);
    if (!targetQuiz) return;
    setLoadingAudit(true);
    try {
      const lb = await fetchLeaderboard(targetQuiz);
      setAuditLeaderboard(lb);
    } catch (e) {
      console.error("Failed to load leaderboard for audit:", e);
    } finally {
      setLoadingAudit(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'quizzes') {
      if (quizSubTab === 'approvals') {
        fetchRegistrationsList();
      } else if (quizSubTab === 'audit') {
        const firstPaidOrWeekly = adminQuizzes.find(q => q.isPaid || q.isWeeklyChallenge);
        if (firstPaidOrWeekly && !auditQuizId) {
          handleAuditQuiz(firstPaidOrWeekly.id);
        }
      }
    }
  }, [activeTab, quizSubTab, adminQuizzes]);

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(CRIME_SCENE_DOCUMENTATION_QUESTIONS);
  
  // Quiz Question Diagram & Image Direct R2 Upload States
  const [uploadingQuestionImages, setUploadingQuestionImages] = useState<Record<number, boolean>>({});
  const [questionImageUploadMsgs, setQuestionImageUploadMsgs] = useState<Record<number, string>>({});
  const [questionImageErrors, setQuestionImageErrors] = useState<Record<number, string>>({});

  const handleQuestionImageUploadDirect = async (qIdx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (!file.type.startsWith('image/')) {
      setQuestionImageErrors(prev => ({ ...prev, [qIdx]: 'Please select a valid image or diagram file (PNG, JPG, WEBP, SVG).' }));
      return;
    }

    setQuestionImageErrors(prev => ({ ...prev, [qIdx]: '' }));
    setUploadingQuestionImages(prev => ({ ...prev, [qIdx]: true }));
    setQuestionImageUploadMsgs(prev => ({ ...prev, [qIdx]: 'Connecting to Cloudflare R2 bucket...' }));

    try {
      const cleanName = `quiz-diagrams/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const uploadResult = await uploadFileResilient(file, cleanName, (msg) => {
        setQuestionImageUploadMsgs(prev => ({ ...prev, [qIdx]: msg }));
      });
      const downloadUrl = uploadResult.url;

      handleQuestionChange(qIdx, 'image', downloadUrl);
      setQuestionImageUploadMsgs(prev => ({
        ...prev,
        [qIdx]: uploadResult.isFallback
          ? '⚠️ Diagram stored locally in browser offline database (localdb).'
          : downloadUrl.startsWith('firestore-blob://')
            ? `✅ Diagram saved to Cloud Storage: ${file.name}`
            : `✅ Diagram uploaded to Cloudflare R2: ${file.name}`
      }));
      setQuestionImageErrors(prev => ({ ...prev, [qIdx]: '' }));
    } catch (err: any) {
      console.error('Quiz question image upload error:', err);
      setQuestionImageErrors(prev => ({ ...prev, [qIdx]: `Upload failed: ${err.message || err}` }));
      setQuestionImageUploadMsgs(prev => ({ ...prev, [qIdx]: '' }));
    } finally {
      setUploadingQuestionImages(prev => ({ ...prev, [qIdx]: false }));
      // Reset input element so re-uploading works smoothly
      e.target.value = '';
    }
  };

  const handleRemoveQuestionImage = async (qIdx: number) => {
    const currentUrl = quizQuestions[qIdx]?.image;
    if (!currentUrl) return;

    if (window.confirm("Remove this diagram from the question? (Associated file in Cloudflare R2 will be deleted)")) {
      try {
        await deleteAttachedFilesFromR2([currentUrl]);
      } catch (e) {
        console.warn("Could not delete from R2:", e);
      }
      handleQuestionChange(qIdx, 'image', '');
      handleQuestionChange(qIdx, 'imageCaption', '');
      setQuestionImageUploadMsgs(prev => ({ ...prev, [qIdx]: '' }));
      setQuestionImageErrors(prev => ({ ...prev, [qIdx]: '' }));
    }
  };

  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      question: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      explanation: '',
      points: 20
    };
    setQuizQuestions(prev => {
      const updated = [...prev, newQ];
      const sumPoints = updated.reduce((acc, curr) => acc + (Number(curr.points) || 0), 0);
      setNewQuizForm(f => ({ ...f, totalPoints: sumPoints }));
      return updated;
    });
  };

  const handleDuplicateQuestion = (index: number) => {
    const target = quizQuestions[index];
    if (!target) return;
    const duplicated: QuizQuestion = {
      ...target,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      question: `${target.question} (Copy)`
    };
    setQuizQuestions(prev => {
      const updated = [...prev];
      updated.splice(index + 1, 0, duplicated);
      const sumPoints = updated.reduce((acc, curr) => acc + (Number(curr.points) || 0), 0);
      setNewQuizForm(f => ({ ...f, totalPoints: sumPoints }));
      return updated;
    });
    setSuccessMsg(`Question #${index + 1} duplicated successfully!`);
  };

  const handleSetAllPoints = (pts: number) => {
    setQuizQuestions(prev => {
      const updated = prev.map(q => ({ ...q, points: pts }));
      const sumPoints = updated.length * pts;
      setNewQuizForm(f => ({ ...f, totalPoints: sumPoints }));
      return updated;
    });
    setSuccessMsg(`All ${quizQuestions.length} questions updated to ${pts} points each (Total: ${quizQuestions.length * pts} pts)`);
  };

  const handleApproveRegistrationAction = async (reg: QuizRegistration) => {
    if (!window.confirm(`Approve UTR #${reg.utrNumber} for ${reg.userName} (${reg.userEmail})? This will immediately unlock the challenge for them.`)) return;
    setApprovingRegId(reg.id);
    try {
      await approveQuizRegistration(reg.id, reg.quizId, reg.userId, user?.displayName || user?.email || 'Admin');
      setSuccessMsg(`Approved payment for ${reg.userName}! Challenge is now unlocked for them.`);
      await fetchRegistrationsList();
      await fetchCollections(); // refresh quiz enrolled counts
    } catch (e: any) {
      setErrMsg(`Failed to approve registration: ${e.message}`);
    } finally {
      setApprovingRegId(null);
    }
  };

  const handleRejectRegistrationAction = async (reg: QuizRegistration) => {
    const reason = window.prompt(`Enter rejection reason for UTR #${reg.utrNumber}:`, "UTR number not found in bank statement / transaction not received");
    if (reason === null) return;
    setApprovingRegId(reg.id);
    try {
      await rejectQuizRegistration(reg.id, reason, user?.displayName || user?.email || 'Admin', reg.quizId, reg.userId);
      setSuccessMsg(`Rejected registration for ${reg.userName}. Reason recorded.`);
      await fetchRegistrationsList();
      await fetchCollections();
    } catch (e: any) {
      setErrMsg(`Failed to reject registration: ${e.message}`);
    } finally {
      setApprovingRegId(null);
    }
  };

  const handleRemoveQuestion = (index: number) => {
    if (quizQuestions.length <= 1) {
      alert("A quiz must have at least 1 question.");
      return;
    }
    setQuizQuestions(prev => {
      const updated = prev.filter((_, i) => i !== index);
      const sumPoints = updated.reduce((acc, curr) => acc + (Number(curr.points) || 0), 0);
      setNewQuizForm(f => ({ ...f, totalPoints: sumPoints }));
      return updated;
    });
  };

  const handleQuestionChange = (index: number, field: keyof QuizQuestion, val: any) => {
    setQuizQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      if (field === 'points') {
        const sumPoints = updated.reduce((acc, curr) => acc + (Number(curr.points) || 0), 0);
        setNewQuizForm(f => ({ ...f, totalPoints: sumPoints }));
      }
      return updated;
    });
  };

  const handleOptionChange = (qIndex: number, optIndex: number, val: string) => {
    setQuizQuestions(prev => {
      const updated = [...prev];
      const opts = [...updated[qIndex].options];
      opts[optIndex] = val;
      updated[qIndex] = { ...updated[qIndex], options: opts };
      return updated;
    });
  };

  const handleAddOption = (qIndex: number) => {
    setQuizQuestions(prev => {
      const updated = [...prev];
      const opts = [...updated[qIndex].options, ''];
      updated[qIndex] = { ...updated[qIndex], options: opts };
      return updated;
    });
  };

  const handleRemoveOption = (qIndex: number, optIndex: number) => {
    setQuizQuestions(prev => {
      const updated = [...prev];
      if (updated[qIndex].options.length <= 2) {
        alert("A question must have at least 2 options.");
        return prev;
      }
      const opts = updated[qIndex].options.filter((_, i) => i !== optIndex);
      let newCorrect = updated[qIndex].correctAnswerIndex;
      if (newCorrect >= opts.length) {
        newCorrect = opts.length - 1;
      }
      updated[qIndex] = { ...updated[qIndex], options: opts, correctAnswerIndex: newCorrect };
      return updated;
    });
  };

  const handleEditQuiz = (q: Quiz) => {
    setEditingQuizId(q.id);
    setNewQuizForm({
      title: q.title || '',
      description: q.description || '',
      category: q.category || 'Crime Scene Documentation',
      status: q.status || 'published',
      isWeeklyChallenge: q.isWeeklyChallenge || false,
      scheduledStartTime: q.scheduledStartTime ? getLocalDatetimeString(q.scheduledStartTime) : '',
      durationMinutes: q.durationMinutes || 30,
      totalPoints: q.totalPoints || 500,
      passingScore: q.passingScore || 350,
      isPaid: isPaidQuiz(q),
      price: isPaidQuiz(q) ? (q.price || 49) : 0,
      upiId: q.upiId || 'forenclue@okaxis',
      payeeName: q.payeeName || 'ForenClue Forensic Services',
      upiQrUrl: q.upiQrUrl || '',
      firstPrize: q.prizes?.first ?? 300,
      secondPrize: q.prizes?.second ?? 200,
      thirdPrize: q.prizes?.third ?? 100,
      registrationStartTime: q.registrationStartTime ? getLocalDatetimeString(q.registrationStartTime) : '',
      registrationEndTime: q.registrationEndTime ? getLocalDatetimeString(q.registrationEndTime) : '',
      shuffleQuestions: q.shuffleQuestions !== undefined ? q.shuffleQuestions : true,
      shuffleOptions: q.shuffleOptions !== undefined ? q.shuffleOptions : true,
      enableTabSwitchDetection: q.enableTabSwitchDetection !== undefined ? q.enableTabSwitchDetection : true,
    });
    setQuizQuestions(q.questions && q.questions.length > 0 ? q.questions : [
      {
        id: 'q1',
        question: '',
        options: ['', ''],
        correctAnswerIndex: 0,
        explanation: '',
        points: 20
      }
    ]);
  };

  const handleResetQuizForm = () => {
    setEditingQuizId(null);
    setNewQuizForm({
      title: '',
      description: '',
      category: 'Crime Scene Documentation',
      status: 'published',
      isWeeklyChallenge: false,
      scheduledStartTime: '',
      durationMinutes: 30,
      totalPoints: 500,
      passingScore: 350,
      isPaid: false,
      price: 0,
      upiId: 'forenclue@okaxis',
      payeeName: 'ForenClue Forensic Services',
      upiQrUrl: '',
      firstPrize: 300,
      secondPrize: 200,
      thirdPrize: 100,
      registrationStartTime: '',
      registrationEndTime: '',
      shuffleQuestions: true,
      shuffleOptions: true,
      enableTabSwitchDetection: true
    });
    setQuizQuestions(CRIME_SCENE_DOCUMENTATION_QUESTIONS);
  };

  // Certificate states
  const [certificates, setCertificates] = useState<any[]>([]);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [editingCertificateId, setEditingCertificateId] = useState<string | null>(null);
  const [newCertificate, setNewCertificate] = useState({
    certificateNo: '',
    fullName: '',
    courseTitle: '',
    certificateType: 'Internship Completion',
    issueDate: new Date().toISOString().split('T')[0],
    imageUrl: '',
    pdfUrl: '',
    additionalDetails: ''
  });

  const [isUploadingCertImage, setIsUploadingCertImage] = useState(false);
  const [isUploadingCertPdf, setIsUploadingCertPdf] = useState(false);
  const [certImageErrorText, setCertImageErrorText] = useState('');
  const [certImageSuccessText, setCertImageSuccessText] = useState('');
  const [certPdfErrorText, setCertPdfErrorText] = useState('');
  const [certPdfSuccessText, setCertPdfSuccessText] = useState('');

  // Employees Management State
  const [adminEmployees, setAdminEmployees] = useState<any[]>([]);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<string | null>(null);
  
  const [employeeFormData, setEmployeeFormData] = useState({
    employeeId: '',
    fullName: '',
    position: '',
    department: 'Cybersecurity & Digital Forensics',
    joiningDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0],
    status: 'Active' as 'Active' | 'Suspended' | 'Expired',
    email: '',
    phone: '',
    skills: '',
    imageUrl: '',
    clearanceLevel: 'Level 1 - Employee'
  });

  const [isUploadingEmpPhoto, setIsUploadingEmpPhoto] = useState(false);
  const [empPhotoErrorText, setEmpPhotoErrorText] = useState('');
  const [empPhotoSuccessText, setEmpPhotoSuccessText] = useState('');

  // Seed Demo Employees & Certificates (Restore Databases)
  const seedDemoEmployees = async () => {
    setEmployeeLoading(true);
    setSuccessMsg('');
    setErrMsg('');
    try {
      const demoEmployees = [
        {
          employeeId: 'FC-EMP-102',
          fullName: 'Ashutosh Singh',
          position: 'Cyber Forensic Expert',
          department: 'Cybersecurity & Digital Forensics',
          joiningDate: '2024-01-12',
          expiryDate: '2029-01-12',
          status: 'Active' as const,
          email: 'ashutosh.forensics@forenclue.com',
          phone: '+91 99881 22334',
          skills: ['Incident Response', 'Malware Reverse Engineering', 'State Evidence Preservation'],
          imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtLXAx3JA_GV_s7QEAbL8YK43XS7e-5FrJngYv7szTZAs192ppvSo4zXQxX_0sNHnoDZ-rirNR8U6BGTwSPK9kAYRdR6YWVMLUCFLvs5Cbwy81gDHxep6XWIPhdynzKvZUMnai51-QoDEPYvkn0ObkO7K33ImRdWP3yPhV0FFkEA-zMP85DXlT3EOtoCE/s1024/1783083591880.png',
          clearanceLevel: 'Level 3 - Member',
          checksum: '8d4f20e98ab776c5dcd890a21cf3e6393b9d0b04a87c126d4efb7936746ef702',
          createdAt: new Date().toISOString()
        },
        {
          employeeId: 'FC-EMP-304',
          fullName: 'Ayush Gaikwad',
          position: 'Founder & Managing Director',
          department: 'Business Development & Partnerships',
          joiningDate: '2024-01-01',
          expiryDate: '2034-01-01',
          status: 'Active' as const,
          email: 'ayushgaikwad7050@gmail.com',
          phone: '+91 88776 65544',
          skills: ['Cyber Security Architecture', 'Digital Investigations', 'Threat Intelligence & SOC'],
          imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
          clearanceLevel: 'Level 3 - Member',
          checksum: '1a5e30c9df76b5c00a9d80cf20efd6394c8e7bd7c9ab1264cde89bf98e09f531',
          createdAt: new Date().toISOString()
        },
        {
          employeeId: 'FC-EMP-519',
          fullName: 'Tejas Tapse',
          position: 'Senior Security Analyst & Instructor',
          department: 'Cybersecurity & Digital Forensics',
          joiningDate: '2024-02-15',
          expiryDate: '2029-02-15',
          status: 'Active' as const,
          email: 'tejas.tapse@forenclue.com',
          phone: '+91 77665 44332',
          skills: ['Network Forensics', 'Mobile Malware Triaging', 'Security Operations'],
          imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
          clearanceLevel: 'Level 3 - Member',
          checksum: 'c2e8f1920acbb83e748d1b1dfcf9a228394b92c4f1c7bf9e8a93e3d9fdf196d4',
          createdAt: new Date().toISOString()
        },
        {
          employeeId: 'FC-EMP-708',
          fullName: 'Dr. Amit Sharma',
          position: 'Lead Forensic Researcher & Academic Scientist',
          department: 'Research & Development (R&D)',
          joiningDate: '2024-03-01',
          expiryDate: '2029-03-01',
          status: 'Active' as const,
          email: 'amit.sharma@forenclue.com',
          phone: '+91 98765 12345',
          skills: ['Toxicological Analysis', 'Chemical Profiling', 'Postmortem Interval Estimation', 'Academic Publishing'],
          imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
          clearanceLevel: 'Level 3 - Member',
          checksum: '9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
          createdAt: new Date().toISOString()
        }
      ];

      const demoCertificates = [
        {
          certificateNo: 'FC-1025-AB',
          fullName: 'Nikitha B',
          courseTitle: 'Cyber Security & Digital Forensics',
          certificateType: 'Internship Completion',
          issueDate: '2026-07-20',
          imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhofilNlkbJWvjAxFLk9i72sbgVT_2SwexBeXssxgZYH1EwiuEsAHceh5ESFONKrPOrvk1n7daXMe8lRVtXMpCtk20vWJC1BdHzG3V3sfQDuiBMD2E4WQYnge_a-ECnx6TSOjMB4s4ZFiEjPZM2WmCMhTeGN6mLT2Qjg333AwuyDoyapc3Vi8u_U6WcF4c/s1280/WhatsApp%20Image%202026-07-21%20at%2019.05.19.jpeg',
          pdfUrl: 'https://forenclue.in/sample_cert.pdf',
          additionalDetails: 'Successfully completed the intensive forensic analyst internship with distinction under direct academic and scientific mentorship.',
          createdAt: new Date().toISOString()
        },
        {
          certificateNo: 'FC-1026-CD',
          fullName: 'Ayush Gaikwad',
          courseTitle: 'Advanced Forensic DNA & Fingerprint Analysis',
          certificateType: 'Professional Certification',
          issueDate: '2024-05-15',
          imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
          pdfUrl: 'https://forenclue.in/sample_cert.pdf',
          additionalDetails: 'Credential verified and registered under official MSME guidelines by ForenClue expert board.',
          createdAt: new Date().toISOString()
        },
        {
          certificateNo: 'FC-1027-EF',
          fullName: 'Nikita Chauhan',
          courseTitle: 'Crime Scene Investigation & Reconstruction',
          certificateType: 'Internship Completion',
          issueDate: '2024-07-10',
          imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
          pdfUrl: 'https://forenclue.in/sample_cert.pdf',
          additionalDetails: 'Demonstrated outstanding aptitude in photographic log mapping, evidence indexing, and chain-of-custody preservation.',
          createdAt: new Date().toISOString()
        },
        {
          certificateNo: 'FC-1028-GH',
          fullName: 'Mayur Hengada',
          courseTitle: 'Digital Forensics & Malware Analysis Masterclass',
          certificateType: 'Professional Certification',
          issueDate: '2024-07-15',
          imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
          pdfUrl: 'https://forenclue.in/sample_cert.pdf',
          additionalDetails: 'Successfully completed advanced labs on volatile memory dumping, sandbox execution analysis, and reverse engineering.',
          createdAt: new Date().toISOString()
        }
      ];

      const demoCases = [
        {
          id: 'okq4BfBv5EEjsxvnn5dP',
          title: 'The RG Kar Medical College Tragedy: A Forensic Investigation',
          tag: 'Forensic Pathology',
          year: '2024',
          location: 'Kolkata, West Bengal',
          difficulty: 'Advanced',
          type: 'Homicide & Sexual Assault',
          image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000',
          summary: 'A comprehensive forensic analysis of the August 2024 RG Kar Medical College tragedy in Kolkata, detailing the autopsy findings, CBI investigation, digital evidence, and DNA profiling that unraveled the brutal rape and murder of a trainee doctor.',
          details: '## Case Background\nOn the morning of August 9, 2024, the body of a 31-year-old postgraduate trainee doctor (commonly referred to as "Abhaya") was discovered in the seminar hall of R. G. Kar Medical College and Hospital in Kolkata. She had been on a grueling 36-hour shift and had gone to the seminar hall to rest. The horrific nature of the crime—involving severe sexual assault and murder—sparked massive nationwide protests among the medical community, demanding justice and better workplace security. The case was eventually transferred to the Central Bureau of Investigation (CBI) by the Calcutta High Court due to concerns over the initial police handling.\n\n## The Crime Scene & Initial Response\nThe victim was found on the podium of the seminar hall, partially clothed with severe visible injuries. \nThe initial response by local authorities was heavily criticized for failing to secure the crime scene effectively, leading to allegations of evidence tampering. During a subsequent protest on August 14, a mob vandalized the hospital, further complicating the scene, though police claimed the seminar hall remained secure.\n\n## Forensic Pathology and Autopsy Findings\nThe autopsy, conducted under intense scrutiny, revealed the sheer brutality of the attack. Key findings included:\n1. **Cause of Death**: Manual strangulation (throttling) associated with smothering. The thyroid cartilage was fractured, confirming forceful compression of the neck.\n2. **Physical Trauma**: The victim sustained 14 distinct injuries. Deep wounds were documented on her face, eyes, neck, belly, lips, and limbs. A severe head injury was also noted, suggesting her head was repeatedly bashed against a hard surface (likely the floor or wall).\n3. **Sexual Assault**: The medical examination confirmed aggravated sexual assault, with significant genital trauma. Crucially, the presence of seminal fluid was documented, which became the cornerstone of the DNA evidence.\n4. **Time of Death**: Forensic experts estimated the time of death to be between 3:00 AM and 5:00 AM on August 9.\n\n## Digital and Trace Evidence\nThe CBI\'s investigation utilized modern digital forensics to pinpoint the suspect:\n1. **CCTV Analysis**: Footage from the hospital corridors captured the primary suspect, a civic volunteer named Sanjay Roy, entering the chest medicine department building at around 4:03 AM and leaving approximately 35 minutes later.\n2. **Digital Forensics (The Bluetooth Earphone)**: A crucial piece of evidence—a broken Bluetooth earphone—was found near the victim\'s body. Investigators matched the MAC address and pairing logs of this earphone directly to Sanjay Roy\'s mobile phone, placing him at the exact scene of the crime.\n3. **Pornographic Material**: Digital forensics on the suspect\'s seized mobile phone revealed a history of consuming violent pornography, establishing a potential psychological profile.\n\n## DNA and Biological Evidence\nThe Central Forensic Science Laboratory (CFSL) in New Delhi played a pivotal role in confirming the suspect\'s involvement:\n- **Seminal Fluid Match**: The DNA extracted from the seminal fluid recovered from the victim\'s body conclusively matched the DNA profile of Sanjay Roy.\n- **Trace Evidence on Suspect**: Swabs taken from the suspect\'s body revealed defensive scratch marks. DNA from the victim was found in the suspect\'s nail clippings, and the suspect\'s skin cells were found under the victim\'s fingernails, evidencing a violent struggle.\n- **Blood Stains**: The suspect\'s clothes and shoes, which he had allegedly washed, were subjected to luminol testing, revealing trace amounts of the victim\'s blood.\n\n## Investigation Conclusion and Impact\nThe integration of the forensic pathology report, irrefutable DNA evidence, and digital tracking (CCTV and Bluetooth logs) allowed the CBI to build a watertight charge sheet against the accused. The case remains a stark reminder of the critical importance of secure crime scene management, rapid evidence collection, and the power of multidisciplinary forensic science in delivering justice.',
          status: 'published',
          createdBy: 'forenclue@gmail.com',
          evidenceLabels: ['Autopsy Report', 'CCTV Corridors', 'Bluetooth Earphone Log', 'CFSL DNA Report', 'Luminol Blood Trace'],
          forensicTechniques: ['Forensic Pathology', 'DNA Profiling', 'Digital Forensics', 'Crime Scene Reconstruction'],
          contentImages: [
            {
              url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e024?auto=format&fit=crop&q=80&w=600',
              caption: 'Forensic Laboratory DNA Processing'
            },
            {
              url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600',
              caption: 'Medical Examination and Pathology Lab'
            },
            {
              url: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&q=80&w=600',
              caption: 'Digital Forensics: Device Pairing Analysis'
            }
          ],
          attachments: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'B1HNKkopZXlC8FNrhVh6',
          title: 'The Phantom Breach: APT-33 Ransomware Attack',
          tag: 'Digital Forensics',
          year: '2024',
          location: 'Bangalore IT Corridor',
          difficulty: 'Advanced',
          type: 'Cyber',
          image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000',
          summary: 'A multi-stage cyber forensic investigation tracing an Advanced Persistent Threat (APT) attack targeting critical manufacturing systems. Analysts traced the initial ingress to a compromised VPN endpoint.',
          details: '## Investigative Overview\\nIn January 2024, a major defense manufacturing plant in Bangalore suffered a total lockdown of its internal operations due to a highly sophisticated ransomware strain. All active workstations displayed a decryption fee demand of 45 BTC.\\n\\n## Digital Ingress Analysis\\n1. **Log Triaging**: Firewalls, active directory logs, and VPN server history were analyzed. A suspicious session was detected originating from a leased IP range in Eastern Europe.\\n2. **Registry and Malware Analysis**: Analysts extracted a memory dump from the compromised primary domain controller. Reverse engineering of the payload (`win_crypto_v4.dll`) revealed standard techniques to evade endpoint protection services.\\n3. **Decryption Vector**: The threat actors utilized a zero-day vulnerability in the SSL VPN appliance to bypass multi-factor authentication checks.\\n\\n## Forensic Insights\\nThe forensic team traced the cryptocurrency wallet address specified in the ransom note. By collaborating with international exchanges, they identified previous laundering paths linked to the infamous APT-33 group.\\n\\n## Lessons Learned\\n- Enforce complete network segmentation between administrative and active operational technology (OT) systems.\\n- Keep VPN firmware up to date with urgent patches.',
          status: 'published',
          createdBy: 'forenclue@gmail.com',
          evidenceLabels: ['Domain Controller Memory Dump', 'Malware Payload DLL', 'VPN Connection Logs'],
          forensicTechniques: ['Volatile Memory Analysis', 'PE Reverse Engineering', 'Network Log Correlation'],
          contentImages: [
            {
              url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
              caption: 'Cyber Security Operations Center monitoring real-time network traffic graphs'
            }
          ],
          attachments: ['https://forenclue.in/sample_cert.pdf'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'SeVvdBKSqEJKozwwgT83',
          title: 'The Forged Stamp of the Royal Land Registry',
          tag: 'Document Verification',
          year: '2023',
          location: 'Delhi High Court Forensic Laboratory',
          difficulty: 'Beginner',
          type: 'Forgery',
          image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000',
          summary: 'A historic property dispute solved by forensic document examiners under the Delhi High Court. Microscopic ink examination proved that the official government seal was falsified using modern inkjet printing.',
          details: '## Case Introduction\\nA highly contested inheritance claim hinged on a land transfer deed dated September 14, 1965. The deed featured the official signature of the registrar and an embossed rubber-stamp seal.\\n\\n## Physical and Chemical Examination\\n1. **Embossing Analysis**: True seals of that era produce distinct physical paper deformation (embossing). Oblique light examination revealed zero indentation on the disputed deed.\\n2. **Microscopic Ink Analysis**: Under high-resolution microscopy, the red stamp ink showed distinct CMYK droplet splatters characteristic of modern inkjet printers, rather than the oil-based stamp pads utilized in the 1960s.\\n3. **Paper Degradation**: Mass spectrometry of the paper cellulose fibers indicated a level of lignin decomposition consistent with wood-pulp paper manufactured after 1990.\\n\\n## Resolution\\nConfronted with the physical evidence report, the claimants admitted to forging the document using high-resolution flatbed scanning and artificial chemical aging techniques.\\n\\n## Scientific Significance\\nThis case demonstrates that physical and chemical properties of materials serve as infallible indicators of temporal anomalies in document fabrication.',
          status: 'published',
          createdBy: 'forenclue@gmail.com',
          evidenceLabels: ['Disputed 1965 Land Deed', 'Embossed Seal Microscopy Scan', 'Paper Cellulose Fragment'],
          forensicTechniques: ['Oblique Light Photography', 'High-Resolution Paper Microscopy', 'Spectrophotometry'],
          contentImages: [
            {
              url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=600',
              caption: 'High Resolution Document Examination Microscope with Oblique Lighting'
            }
          ],
          attachments: ['https://forenclue.in/sample_cert.pdf'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'TDc7giOcZULHX0MOKGSn',
          title: 'The Museum Heist: Trace Glass & Soil Analysis',
          tag: 'Trace Evidence',
          year: '2024',
          location: 'National Museum of India, Delhi',
          difficulty: 'Advanced',
          type: 'Theft',
          image: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?auto=format&fit=crop&q=80&w=1000',
          summary: 'An exquisite Mughal-era gold coin was stolen from a secure display. Soil trace minerals on a discarded glove and microscopic glass fracture analysis reconstructed the exact point of egress.',
          details: '## Case Background\\nOn March 14, 2024, security staff at the National Museum of India reported that a rare Mughal-era gold dinar had been replaced with a high-quality replica. The display case had been breached without triggering local laser tripwires.\\n\\n## Forensic Recovery\\nInvestigating officers recovered a discarded cotton work glove near the ventilation duct. Microscopic analysis of the display case glass window showed a localized edge fracture, indicating a precision mechanical glass cutter had been used. Soil particulates were extracted from the palm side of the recovered glove.\\n\\n## Laboratory Analysis\\n1. **Soil mineralogy**: X-ray diffraction (XRD) of the soil particulates showed high concentrations of kaolinite and specific quartz sand ratios matching a specific construction site located 2.4 kilometers away from the museum.\\n2. **Glass Fracture Refractive Index**: The glass fragments salvaged from the exhibit had a refractive index matching standard 4mm tempered architectural glass, showing clear trace markings from a diamond-tip circular cutter.\\n3. **Latent Prints**: Superglue fuming of the inner surface of the glove successfully yielded a partial latent print corresponding to a known repeat offender, Ajay Verma.\\n\\n## Break in the Case\\nAjay Verma was located at the identified construction site. A search warrant of his residence recovered the genuine gold dinar hidden inside a toolbox. The physical soil match and the latent print from the glove provided a watertight prosecution case.\\n\\n## Scientific Evidence and Conclusion\\nTrace geological mineral comparison and physical glass fracture matches provided irrefutable chemical and spatial evidence linking the suspect to both the crime scene and his arrest location.',
          status: 'published',
          createdBy: 'forenclue@gmail.com',
          evidenceLabels: ['Mughal Dinar Replica', 'Cotton Work Glove', 'Glass Fragment Edge Micro-fractures'],
          forensicTechniques: ['X-ray Diffraction (XRD)', 'Refractive Index Fluid Match', 'Cyanoacrylate Fuming'],
          contentImages: [
            {
              url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=600',
              caption: 'Mughal Exhibit Gallery Display Case under Cross-Polarized Forensic Light'
            }
          ],
          attachments: ['https://forenclue.in/sample_cert.pdf'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'a60XHfJd43eKVU7httCw',
          title: 'The Bones of Crimson Creek: Facial Reconstruction',
          tag: 'Forensic Anthropology',
          year: '2022',
          location: 'Crimson Creek Woods, Himachal Pradesh',
          difficulty: 'Expert',
          type: 'Cold Case',
          image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000',
          summary: 'Skeletal remains found in a shallow forest grave after 15 years. Forensic anthropologists reconstructed the skull and used 3D tissue depth mapping to identify the victim and solve a long-forgotten mystery.',
          details: '## Case Background\\nIn October 2022, hikers in Crimson Creek Woods discovered partial skeletal remains exposed due to heavy soil erosion. Initial autopsy indicated the individual had been buried for over a decade. Traditional identification methods like DNA profiling failed initially because no direct family references were available.\\n\\n## Anthropological Assessment\\nForensic anthropologists reconstructed the cranium and pelvis to determine biological profile:\\n1. **Sex**: Male, determined from subpubic angle and robust cranial features.\\n2. **Age**: 28-32 years at death, based on epiphyseal fusion and dental wear patterns.\\n3. **Ancestry**: South Asian.\\n4. **Stature**: Estimated at 178 cm using femur length formulas.\\n\\n## Laboratory Analysis & 3D Reconstruction\\n1. **3D Facial Reconstruction**: The skull was digitized using a high-precision structured light 3D scanner. Virtual tissue depth markers were placed on standard anatomical landmarks (e.g., nasion, glabella, gnathion) based on South Asian average databases.\\n2. **Isotope Analysis**: Carbon-13 and Nitrogen-15 isotope ratios from bone collagen suggested a diet rich in inland grains, placing the individual\'s childhood origin in northern rural agricultural zones.\\n3. **Facial Rendering**: An artist overlaid digital muscle groups and skin tissue to produce a high-fidelity facial portrait.\\n\\n## Break in the Case\\nThe reconstructed face was broadcast on regional news channels. It was recognized by a family in Shimla as Vikram Kapoor, who had mysteriously disappeared in 2007. Subsequent DNA comparison with Vikram\'s living siblings yielded a positive kinship match of 99.98% probability. Police investigation then focused on Vikram\'s former business partner, leading to a successful conviction for manslaughter.\\n\\n## Scientific Significance\\nThis case highlights the power of combining traditional osteology, 3D computerized facial rendering, and modern stable isotope analysis to give a face and a name to long-forgotten victims.',
          status: 'published',
          createdBy: 'forenclue@gmail.com',
          evidenceLabels: ['Reconstructed Cranium Specimen', 'Digitized 3D Tissue Map Grid', 'Femur Bone Fragments'],
          forensicTechniques: ['3D Laser Craniofacial Scanning', 'Osteobiographical Profiling', 'Stable Isotope Mass Spectrometry'],
          contentImages: [
            {
              url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600',
              caption: 'Digitized 3D Skull Model with Tissue-Depth Landmarks'
            }
          ],
          attachments: ['https://forenclue.in/sample_cert.pdf'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      // 1. Restore Employees
      for (const emp of demoEmployees) {
        const safeId = emp.employeeId.toUpperCase().trim().replace(/[\/\s]/g, '_');
        await setDoc(doc(db, 'employees', safeId), emp);
      }

      // 2. Restore Certificates
      for (const cert of demoCertificates) {
        const safeId = cert.certificateNo.toUpperCase().trim().replace(/[\/\s]/g, '_');
        await setDoc(doc(db, 'certificates', safeId), cert);
      }

      // 3. Restore Cases
      for (const c of demoCases) {
        const safeId = c.id;
        await setDoc(doc(db, 'cases', safeId), c);
      }

      setSuccessMsg('Employee, Certificate, and Case Study databases successfully restored and seeded directly via Client Console!');
      fetchCollections();
    } catch (err: any) {
      console.error('Error seeding demo data client-side:', err);
      setErrMsg(`Failed to restore databases: ${err.message}`);
    } finally {
      setEmployeeLoading(false);
    }
  };

  // Submit Employee Profile (Create or Edit)
  const handleEmployeeFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeFormData.employeeId.trim() || !employeeFormData.fullName.trim()) {
      setErrMsg('Employee ID and Full Name are required.');
      return;
    }

    setEmployeeLoading(true);
    setSuccessMsg('');
    setErrMsg('');

    const formattedId = employeeFormData.employeeId.toUpperCase().trim();
    const safeId = formattedId.replace(/[\/\s]/g, '_');

    // Split skills by commas and trim whitespace
    const skillsArray = employeeFormData.skills
      ? employeeFormData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    // Mock hash generation if new
    const finalChecksum = isEditingEmployee && editEmployeeId
      ? (adminEmployees.find(emp => emp.employeeId === editEmployeeId)?.checksum || Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''))
      : Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

    const payload: any = {
      employeeId: formattedId,
      fullName: employeeFormData.fullName.trim(),
      position: employeeFormData.position.trim(),
      department: employeeFormData.department,
      joiningDate: employeeFormData.joiningDate,
      expiryDate: employeeFormData.expiryDate,
      status: employeeFormData.status,
      skills: skillsArray,
      clearanceLevel: employeeFormData.clearanceLevel,
      checksum: finalChecksum,
      createdAt: isEditingEmployee && editEmployeeId
        ? (adminEmployees.find(emp => emp.employeeId === editEmployeeId)?.createdAt || new Date().toISOString())
        : new Date().toISOString()
    };

    if (employeeFormData.email.trim()) {
      payload.email = employeeFormData.email.trim();
    }
    if (employeeFormData.phone.trim()) {
      payload.phone = employeeFormData.phone.trim();
    }
    if (employeeFormData.imageUrl.trim()) {
      payload.imageUrl = employeeFormData.imageUrl.trim();
    }

    try {
      await setDoc(doc(db, 'employees', safeId), payload);
      setSuccessMsg(isEditingEmployee ? 'Employee profile updated successfully!' : 'New employee profile registered successfully!');
      
      // Reset form
      setEmployeeFormData({
        employeeId: '',
        fullName: '',
        position: '',
        department: 'Cybersecurity & Digital Forensics',
        joiningDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0],
        status: 'Active',
        email: '',
        phone: '',
        skills: '',
        imageUrl: '',
        clearanceLevel: 'Level 1 - Employee'
      });
      setIsEditingEmployee(false);
      setEditEmployeeId(null);
      setEmpPhotoSuccessText('');
      setEmpPhotoErrorText('');
      fetchCollections();
    } catch (err: any) {
      console.error('Error saving employee profile:', err);
      setErrMsg(`Failed to save record: ${err.message}`);
    } finally {
      setEmployeeLoading(false);
    }
  };

  const handleEmployeeEditInit = (emp: any) => {
    setIsEditingEmployee(true);
    setEditEmployeeId(emp.employeeId);
    setEmployeeFormData({
      employeeId: emp.employeeId,
      fullName: emp.fullName,
      position: emp.position,
      department: emp.department,
      joiningDate: emp.joiningDate,
      expiryDate: emp.expiryDate,
      status: emp.status,
      email: emp.email || '',
      phone: emp.phone || '',
      skills: emp.skills ? emp.skills.join(', ') : '',
      imageUrl: emp.imageUrl || '',
      clearanceLevel: emp.clearanceLevel || 'Level 1 - Employee'
    });
  };

  const deleteAttachedFilesFromR2 = async (urls: (string | undefined | null)[]): Promise<{ count: number; messages: string[] }> => {
    const validUrls = Array.from(new Set(urls.filter((u): u is string => typeof u === 'string' && u.trim().length > 0)));
    let deletedCount = 0;
    const messages: string[] = [];

    for (const url of validUrls) {
      try {
        const res = await deleteFileResilient(url);
        if (res.deletedFromR2) {
          deletedCount++;
          messages.push(`Deleted ${url.split('/').pop()} from Cloudflare R2 storage`);
        }
      } catch (e) {
        console.warn('Failed to delete file from R2:', url, e);
      }
    }

    return { count: deletedCount, messages };
  };

  const handleEmployeeDelete = async (id: string) => {
    const empRecord = adminEmployees.find((e: any) => e.employeeId === id || e.docId === id || e.id === id);
    const empName = empRecord?.fullName || id;

    if (!window.confirm(`Are you sure you want to revoke and delete credentials for Employee "${empName}" (${id})? Any profile photo in Cloudflare R2 storage will also be permanently deleted. This action cannot be undone.`)) return;

    setEmployeeLoading(true);
    setSuccessMsg('');
    setErrMsg('');
    try {
      const fileUrls = [empRecord?.imageUrl, empRecord?.avatarUrl];
      const { count } = await deleteAttachedFilesFromR2(fileUrls);

      const safeId = id.toUpperCase().trim().replace(/[\/\s]/g, '_');
      await deleteDoc(doc(db, 'employees', safeId));

      const r2Notice = count > 0 ? ` and removed profile photo from Cloudflare R2 storage.` : '.';
      setSuccessMsg(`Credentials for "${empName}" (${id}) successfully revoked and deleted${r2Notice}`);
      fetchCollections();
    } catch (err: any) {
      console.error('Error deleting record:', err);
      setErrMsg(`Failed to revoke credentials: ${err.message}`);
    } finally {
      setEmployeeLoading(false);
    }
  };

  // Notifications
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // Fetch Admin Collections
  const fetchCollections = async () => {
    if (!isAdmin) return;
    
    setCourseLoading(true);
    setEbookLoading(true);
    setPodcastLoading(true);
    setCertificateLoading(true);

    // 1. Courses
    try {
      const courseSnap = await getDocs(collection(db, 'courses'));
      const coursesList: any[] = [];
      courseSnap.forEach(docSnap => {
        coursesList.push({ docId: docSnap.id, ...docSnap.data() });
      });
      setCourses(coursesList);
    } catch (e) {
      console.error("Error fetching courses collection:", e);
      handleFirestoreError(e, OperationType.LIST, 'courses');
    } finally {
      setCourseLoading(false);
    }

    // 2. Ebooks
    try {
      const ebookSnap = await getDocs(collection(db, 'ebooks'));
      const ebooksList: any[] = [];
      ebookSnap.forEach(docSnap => {
        ebooksList.push({ docId: docSnap.id, ...docSnap.data() });
      });
      setEbooks(ebooksList);
    } catch (e) {
      console.error("Error fetching ebooks collection:", e);
      handleFirestoreError(e, OperationType.LIST, 'ebooks');
    } finally {
      setEbookLoading(false);
    }

    // 3. Website Texts
    try {
      const textSnap = await getDocs(collection(db, 'websiteTexts'));
      const textList: any[] = [];
      textSnap.forEach(docSnap => {
        textList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setCopiedTexts(textList);
    } catch (e) {
      console.error("Error fetching websiteTexts collection:", e);
      handleFirestoreError(e, OperationType.LIST, 'websiteTexts');
    }

    // 4. Doubts
    try {
      const doubtsSnap = await getDocs(collection(db, 'doubts'));
      const doubtsList: any[] = [];
      doubtsSnap.forEach(docSnap => {
        doubtsList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setDoubts(doubtsList);
    } catch (e) {
      console.error("Error fetching doubts collection:", e);
      handleFirestoreError(e, OperationType.LIST, 'doubts');
    }

    // 5. Podcast Episodes
    try {
      const podcastsSnap = await getDocs(collection(db, 'podcastEpisodes'));
      const podcastsList: any[] = [];
      podcastsSnap.forEach(docSnap => {
        podcastsList.push({ docId: docSnap.id, ...docSnap.data() });
      });
      // Sort podcasts by createdAt descending, if available
      podcastsList.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dbVal = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dbVal - da;
      });
      setPodcastEpisodes(podcastsList);
    } catch (e) {
      console.error("Error fetching podcastEpisodes collection:", e);
      handleFirestoreError(e, OperationType.LIST, 'podcastEpisodes');
    } finally {
      setPodcastLoading(false);
    }

    // 6. Certificates
    try {
      const certSnap = await getDocs(collection(db, 'certificates'));
      const certList: any[] = [];
      certSnap.forEach(docSnap => {
        certList.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort certificates by createdAt descending if possible
      certList.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dbVal = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dbVal - da;
      });
      // Deduplicate certificates by certificateNo to prevent double counting or listing
      const uniqueCertList: any[] = [];
      const seenNos = new Set<string>();
      certList.forEach(cert => {
        const certNo = cert.certificateNo || cert.id || '';
        const normalized = certNo.toUpperCase().trim().replace(/[\s\-_/]/g, '');
        if (normalized) {
          if (!seenNos.has(normalized)) {
            seenNos.add(normalized);
            uniqueCertList.push(cert);
          }
        } else {
          uniqueCertList.push(cert);
        }
      });
      setCertificates(uniqueCertList);
    } catch (e) {
      console.error("Error fetching certificates collection:", e);
    } finally {
      setCertificateLoading(false);
    }

    // 7. Employees
    setEmployeeLoading(true);
    try {
      const empSnap = await getDocs(collection(db, 'employees'));
      const empList: any[] = [];
      empSnap.forEach(docSnap => {
        empList.push(docSnap.data());
      });
      empList.sort((a, b) => (a.employeeId || '').localeCompare(b.employeeId || ''));
      setAdminEmployees(empList);
    } catch (e) {
      console.error("Error fetching employees collection:", e);
      handleFirestoreError(e, OperationType.LIST, 'employees');
    } finally {
      setEmployeeLoading(false);
    }

    // Contact Messages
    try {
      const msgsSnap = await getDocs(collection(db, 'contact_messages'));
      const msgsList: any[] = [];
      msgsSnap.forEach(docSnap => {
        msgsList.push({ docId: docSnap.id, ...docSnap.data() });
      });
      msgsList.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });
      setContactMessages(msgsList);
    } catch (e) {
      console.error("Error fetching contact messages:", e);
    }
    
    // 8. Quizzes & Challenges
    setQuizLoading(true);
    try {
      const qList = await fetchAdminQuizzes();
      setAdminQuizzes(qList);
    } catch (e) {
      console.error("Error fetching quizzes:", e);
    } finally {
      setQuizLoading(false);
    }

    // 9. Seminar / Webinar Feedbacks
    setFeedbacksLoading(true);
    try {
      const fbSnap = await getDocs(collection(db, 'webinar_feedbacks'));
      const fbList: any[] = [];
      fbSnap.forEach(docSnap => {
        fbList.push({ docId: docSnap.id, ...docSnap.data() });
      });
      fbList.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      setWebinarFeedbacks(fbList);
    } catch (e) {
      console.error("Error fetching webinar feedbacks:", e);
    } finally {
      setFeedbacksLoading(false);
    }

    // 10. Colleges & Universities
    setCollegesLoading(true);
    try {
      const colList = await fetchAdminColleges();
      setColleges(colList);
    } catch (e) {
      console.error("Error fetching colleges collection:", e);
    } finally {
      setCollegesLoading(false);
    }
  };

  // College Course Handlers for Admin Form
  const handleAddCollegeCourseRow = () => {
    setCollegeForm(prev => ({
      ...prev,
      coursesOffered: [
        ...prev.coursesOffered,
        {
          name: '',
          degreeLevel: 'Master',
          duration: '2 Years',
          eligibility: '',
          estimatedFees: '',
          mode: 'Full-time',
          specializations: []
        }
      ]
    }));
  };

  const handleRemoveCollegeCourseRow = (index: number) => {
    if (collegeForm.coursesOffered.length <= 1) {
      alert("At least one course offering is required for a college.");
      return;
    }
    setCollegeForm(prev => ({
      ...prev,
      coursesOffered: prev.coursesOffered.filter((_, i) => i !== index)
    }));
  };

  const handleCollegeCourseChange = (index: number, field: keyof CollegeCourse, value: any) => {
    setCollegeForm(prev => {
      const updated = [...prev.coursesOffered];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, coursesOffered: updated };
    });
  };

  const handleCollegeCourseSpecsChange = (index: number, specsString: string) => {
    const specs = specsString.split(',').map(s => s.trim()).filter(Boolean);
    setCollegeForm(prev => {
      const updated = [...prev.coursesOffered];
      updated[index] = { ...updated[index], specializations: specs };
      return { ...prev, coursesOffered: updated };
    });
  };

  const handleResetCollegeForm = () => {
    setEditingCollegeId(null);
    setCollegeForm({
      name: '',
      shortName: '',
      country: 'India',
      state: '',
      city: '',
      type: 'Government',
      website: '',
      logo: '',
      bannerImage: '',
      description: '',
      feesRange: '',
      admissionProcess: '',
      accreditation: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      ranking: '',
      facilities: '',
      featured: false,
      coursesOffered: [
        {
          name: 'B.Sc. Forensic Science',
          degreeLevel: 'Bachelor',
          duration: '3 Years',
          eligibility: '10+2 Science Stream (Min 50%)',
          estimatedFees: '₹40,000 / year',
          mode: 'Full-time',
          specializations: ['Fingerprint Science', 'Toxicology']
        }
      ]
    });
  };

  const handleAdminEditCollege = (col: College) => {
    setEditingCollegeId(col.id);
    setCollegeForm({
      name: col.name || '',
      shortName: col.shortName || '',
      country: col.country || 'India',
      state: col.state || '',
      city: col.city || '',
      type: col.type || 'Government',
      website: col.website || '',
      logo: col.logo || '',
      bannerImage: col.bannerImage || '',
      description: col.description || '',
      feesRange: col.feesRange || '',
      admissionProcess: col.admissionProcess || '',
      accreditation: col.accreditation || '',
      contactEmail: col.contactEmail || '',
      contactPhone: col.contactPhone || '',
      address: col.address || '',
      ranking: col.ranking || '',
      facilities: Array.isArray(col.facilities) ? col.facilities.join(', ') : '',
      featured: !!col.featured,
      coursesOffered: col.coursesOffered && col.coursesOffered.length > 0 ? col.coursesOffered.map(c => ({
        name: c.name || '',
        degreeLevel: c.degreeLevel || 'Bachelor',
        duration: c.duration || '',
        eligibility: c.eligibility || '',
        estimatedFees: c.estimatedFees || '',
        mode: c.mode || 'Full-time',
        specializations: c.specializations || []
      })) : [
        {
          name: 'B.Sc. Forensic Science',
          degreeLevel: 'Bachelor',
          duration: '3 Years',
          eligibility: '',
          estimatedFees: '',
          mode: 'Full-time',
          specializations: []
        }
      ]
    });
  };

  const handleAdminSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrMsg('');

    if (!collegeForm.name || !collegeForm.city || !collegeForm.country) {
      setErrMsg("Please provide College/University Name, City, and Country.");
      return;
    }

    try {
      const facilitiesList = collegeForm.facilities
        .split(',')
        .map(f => f.trim())
        .filter(Boolean);

      const payload: Partial<College> & { id?: string } = {
        name: collegeForm.name,
        shortName: collegeForm.shortName,
        country: collegeForm.country,
        state: collegeForm.state,
        city: collegeForm.city,
        type: collegeForm.type,
        website: collegeForm.website,
        logo: collegeForm.logo,
        bannerImage: collegeForm.bannerImage,
        description: collegeForm.description,
        feesRange: collegeForm.feesRange,
        admissionProcess: collegeForm.admissionProcess,
        accreditation: collegeForm.accreditation,
        contactEmail: collegeForm.contactEmail,
        contactPhone: collegeForm.contactPhone,
        address: collegeForm.address,
        ranking: collegeForm.ranking,
        facilities: facilitiesList,
        featured: collegeForm.featured,
        coursesOffered: collegeForm.coursesOffered
      };

      if (editingCollegeId) {
        payload.id = editingCollegeId;
      }

      await saveAdminCollege(payload);
      setSuccessMsg(editingCollegeId ? `College "${collegeForm.name}" updated successfully!` : `New College "${collegeForm.name}" published to directory!`);
      handleResetCollegeForm();
      fetchCollections();
    } catch (err: any) {
      setErrMsg(`Failed to save college record: ${err.message}`);
    }
  };

  const handleAdminDeleteCollege = async (id: string, name: string) => {
    const college = colleges.find((c: any) => c.id === id || c.docId === id);

    const firstConfirm = window.confirm(`WARNING: You are about to delete the college/university record for "${name}". Any associated logo/banner images will also be permanently deleted from Cloudflare R2 storage. Do you want to proceed?`);
    if (!firstConfirm) return;

    const secondConfirm = window.confirm(`DOUBLE CONFIRMATION: Are you absolutely sure you want to permanently delete "${name}"? This action cannot be undone.`);
    if (!secondConfirm) return;

    try {
      const fileUrls = [college?.logo, college?.bannerImage, (college as any)?.logoUrl, (college as any)?.imageUrl, (college as any)?.bannerUrl];
      const { count } = await deleteAttachedFilesFromR2(fileUrls);

      await deleteAdminCollege(id);
      const r2Notice = count > 0 ? ` and removed ${count} media file(s) from Cloudflare R2 storage.` : '.';
      setSuccessMsg(`College record "${name}" deleted from database${r2Notice}`);
      fetchCollections();
    } catch (err: any) {
      setErrMsg(`Failed to delete college: ${err.message}`);
    }
  };

  const handleApproveFeedback = async (docId: string) => {
    try {
      await setDoc(doc(db, 'webinar_feedbacks', docId), { approved: true, status: 'approved' }, { merge: true });
      setWebinarFeedbacks(prev => prev.map(f => f.docId === docId ? { ...f, approved: true, status: 'approved' } : f));
    } catch (e) {
      console.error("Error approving feedback:", e);
      alert("Failed to approve feedback.");
    }
  };

  const handleDeleteFeedback = async (docId: string, authorName: string) => {
    if (!window.confirm(`Are you sure you want to delete the session feedback submission from "${authorName}"?`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'webinar_feedbacks', docId));
      setWebinarFeedbacks(prev => prev.filter(f => f.docId !== docId));
    } catch (e) {
      console.error("Error deleting feedback:", e);
      alert("Failed to delete feedback.");
    }
  };

  const handleAdminSaveQuiz = async (e?: React.FormEvent, targetStatus: 'draft' | 'published' = 'published') => {
    if (e) e.preventDefault();
    setSuccessMsg('');
    setErrMsg('');

    if (targetStatus === 'draft') {
      // Draft mode: minimal validation to allow admins to save in-progress draft work at any moment
      if (!newQuizForm.title || !newQuizForm.title.trim()) {
        setErrMsg("Please enter at least a Title for the quiz to save as draft.");
        return;
      }
    } else {
      // Publish mode: strict validation before publishing to students
      if (!newQuizForm.title || !newQuizForm.title.trim() || !newQuizForm.description || !newQuizForm.description.trim()) {
        setErrMsg("Please fill in both Title and Description before publishing.");
        return;
      }

      if (!quizQuestions || quizQuestions.length === 0) {
        setErrMsg("Please add at least one question before publishing the quiz.");
        return;
      }

      // Validate manual questions
      for (let i = 0; i < quizQuestions.length; i++) {
        const q = quizQuestions[i];
        if (!q.question.trim()) {
          setErrMsg(`Question #${i + 1} text cannot be empty.`);
          return;
        }
        if (!q.options || q.options.length < 2) {
          setErrMsg(`Question #${i + 1} must have at least 2 options.`);
          return;
        }
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j].trim()) {
            setErrMsg(`Option #${j + 1} in Question #${i + 1} cannot be empty.`);
            return;
          }
        }
      }
    }

    const calculatedTotalPoints = quizQuestions.reduce((sum, q) => sum + (Number(q.points) || 0), 0);

    try {
      const payload: Partial<Quiz> = {
        title: newQuizForm.title.trim(),
        description: newQuizForm.description?.trim() || (targetStatus === 'draft' ? 'Draft in progress...' : ''),
        category: newQuizForm.category,
        status: targetStatus,
        isWeeklyChallenge: newQuizForm.isWeeklyChallenge,
        durationMinutes: Number(newQuizForm.durationMinutes),
        totalPoints: calculatedTotalPoints > 0 ? calculatedTotalPoints : Number(newQuizForm.totalPoints),
        passingScore: Number(newQuizForm.passingScore),
        questions: quizQuestions,
        createdBy: user?.email || 'Admin',
        isPaid: Boolean(newQuizForm.isPaid || (Number(newQuizForm.price) > 0)),
        price: (newQuizForm.isPaid || Number(newQuizForm.price) > 0) ? (Number(newQuizForm.price) > 0 ? Number(newQuizForm.price) : 49) : 0,
        upiId: newQuizForm.upiId || '',
        payeeName: newQuizForm.payeeName || '',
        upiQrUrl: newQuizForm.upiQrUrl || '',
        prizes: {
          first: Number(newQuizForm.firstPrize) || 0,
          second: Number(newQuizForm.secondPrize) || 0,
          third: Number(newQuizForm.thirdPrize) || 0,
          currency: '₹'
        },
        registrationStartTime: newQuizForm.registrationStartTime ? new Date(newQuizForm.registrationStartTime).toISOString() : '',
        registrationEndTime: newQuizForm.registrationEndTime ? new Date(newQuizForm.registrationEndTime).toISOString() : '',
        shuffleQuestions: Boolean(newQuizForm.shuffleQuestions),
        shuffleOptions: Boolean(newQuizForm.shuffleOptions),
        enableTabSwitchDetection: Boolean(newQuizForm.enableTabSwitchDetection)
      };

      if (newQuizForm.scheduledStartTime) {
        payload.scheduledStartTime = new Date(newQuizForm.scheduledStartTime).toISOString();
      } else {
        payload.scheduledStartTime = '';
      }

      if (editingQuizId) {
        payload.id = editingQuizId;
      }

      const savedId = await saveQuiz(payload);
      if (targetStatus === 'draft') {
        setEditingQuizId(savedId);
        setNewQuizForm(prev => ({ ...prev, status: 'draft' }));
        setSuccessMsg(`Quiz progress saved as Draft ("${newQuizForm.title}")! You can safely continue editing or return later.`);
      } else {
        setSuccessMsg(editingQuizId ? "Quiz updated & published successfully to students!" : "New Quiz / Weekly Challenge published successfully!");
        handleResetQuizForm();
      }
      fetchCollections();
    } catch (err: any) {
      setErrMsg(`Error saving quiz: ${err.message}`);
    }
  };

  const handleToggleQuizPublish = async (quiz: Quiz) => {
    const nextStatus = quiz.status === 'draft' ? 'published' : 'draft';
    try {
      await updateQuizStatus(quiz.id, nextStatus);
      setSuccessMsg(`Quiz "${quiz.title}" status updated to: ${nextStatus === 'published' ? '🚀 Published (Live for students)' : '📝 Draft (Unpublished)'}.`);
      fetchCollections();
    } catch (err: any) {
      setErrMsg(`Failed to update status: ${err.message}`);
    }
  };

  const handleAdminDeleteQuiz = async (id: string) => {
    const quiz = adminQuizzes.find((q: any) => q.id === id || q.docId === id);
    const quizTitle = quiz?.title || id;

    if (!window.confirm(`Are you sure you want to delete Quiz / Challenge "${quizTitle}"? Any attached question diagrams or images will also be permanently deleted from Cloudflare R2 storage. This action cannot be undone.`)) return;

    try {
      const questionImageUrls = (quiz?.questions || []).map((q: any) => q.image).filter(Boolean);
      const fileUrls = [
        (quiz as any)?.bannerUrl, 
        (quiz as any)?.imageUrl, 
        (quiz as any)?.coverUrl, 
        (quiz as any)?.thumbnail, 
        ...questionImageUrls
      ];
      const { count } = await deleteAttachedFilesFromR2(fileUrls);

      await deleteQuiz(id);
      const r2Notice = count > 0 ? ` and removed ${count} media file(s) from Cloudflare R2 storage.` : '.';
      setSuccessMsg(`Quiz "${quizTitle}" deleted successfully from database${r2Notice}`);
      fetchCollections();
    } catch (err: any) {
      setErrMsg(`Failed to delete quiz: ${err.message}`);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchCollections();
    }
  }, [isAdmin]);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setBtnLoading(true);

    if (!adminLogin) {
      setAuthError('Authentication Service is currently starting. Please retry in 3 seconds.');
      setBtnLoading(false);
      return;
    }

    const success = adminLogin(email, password);
    setBtnLoading(false);

    if (success) {
      setSuccessMsg('Forenclue Core Credentials approved! Elevating access.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setAuthError('Invalid credentials. Administrator role rejected.');
    }
  };

  // Add Course
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrMsg('');

    if (!newCourse.title || !newCourse.description) {
      setErrMsg('Please enter a course title and summary.');
      return;
    }

    try {
      const generatedId = editingCourseId || String(9000 + (courses.length + Math.floor(Math.random() * 1000)));
      const curriculum = newCourse.curriculumLines
        ? newCourse.curriculumLines.split('\n').filter(Boolean)
        : ['Fundamentals of analysis', 'Evidence collection techniques', 'Real world case audits'];

      const coursePayload = {
        id: Number(generatedId),
        title: newCourse.title,
        instructor: newCourse.instructor,
        price: Number(newCourse.price),
        originalPrice: Number(newCourse.originalPrice),
        level: newCourse.level,
        category: newCourse.category,
        duration: newCourse.duration,
        description: newCourse.description,
        thumbnail: newCourse.thumbnail || 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=600',
        instructorImage: newCourse.instructorImage,
        instructorBio: newCourse.instructorBio,
        curriculum,
        notices: [
          { id: 1, date: new Date().toLocaleDateString(), content: 'Investigation course published. Welcome to the workspace.' }
        ],
        modules: modules
      };

      // Create or Update document in firestore with ID as document name
      await setDoc(doc(db, 'courses', String(generatedId)), coursePayload);
      
      setSuccessMsg(editingCourseId ? `Investigation Course updated!` : `Investigation Course "${newCourse.title}" successfully compiled and listed!`);
      setEditingCourseId(null);
      setNewCourse({
        title: '',
        instructor: 'Ayush Gaikwad',
        price: 0,
        originalPrice: 4999,
        level: 'Beginner',
        category: 'Forensic Science',
        duration: '12 Hours',
        description: '',
        thumbnail: '',
        instructorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        instructorBio: 'Lead Forensic Investigator & Cyber Analyst.',
        curriculumLines: ''
      });
      fetchCollections();
    } catch (err: any) {
      console.error(err);
      setErrMsg(`Failed to submit: ${err.message}`);
    }
  };

  const handlePdfUploadDirect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPdfErrorText('');
    setPdfSuccessText('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setPdfErrorText('Please select a valid PDF document.');
        return;
      }
      setIsUploadingPdf(true);
      setPdfSuccessText('Processing eLibrary PDF...');
      try {
        const cleanName = `ebooks/pdfs/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const uploadResult = await uploadFileResilient(file, cleanName, (msg) => setPdfSuccessText(msg));
        const downloadUrl = uploadResult.url;
        
        // Calculate file size
        const bytes = file.size;
        const sizeStr = bytes > 1024 * 1024 
          ? `${(bytes / (1024 * 1024)).toFixed(1)}MB` 
          : `${Math.round(bytes / 1024)}KB`;

        setNewEbook(prev => ({
          ...prev,
          pdfUrl: downloadUrl,
          size: sizeStr
        }));
        setPdfSuccessText(uploadResult.isFallback 
          ? `⚠️ PDF saved to local browser offline storage only (localdb). Cloud upload unreachable.` 
          : downloadUrl.startsWith('firestore-blob://')
            ? `✅ PDF uploaded & synchronized across all devices via Cloud Storage: ${file.name}`
            : `✅ PDF uploaded to Cloudflare R2 storage successfully: ${file.name}`
        );
        setPdfErrorText('');
      } catch (err: any) {
        console.error(err);
        setPdfErrorText(`PDF upload failed: ${err.message || err}`);
        setPdfSuccessText('');
      } finally {
        setIsUploadingPdf(false);
      }
    }
  };

  const handleCoverUploadDirect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoverErrorText('');
    setCoverSuccessText('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setCoverErrorText('Please select a valid image file for the book cover.');
        return;
      }
      setIsUploadingCover(true);
      setCoverSuccessText('Processing cover image...');
      try {
        const cleanName = `ebooks/covers/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const uploadResult = await uploadFileResilient(file, cleanName, (msg) => setCoverSuccessText(msg));
        const downloadUrl = uploadResult.url;
        setNewEbook(prev => ({
          ...prev,
          image: downloadUrl
        }));
        setCoverSuccessText(uploadResult.isFallback
          ? `⚠️ Cover image saved to local offline storage only (localdb).`
          : `Cover image uploaded to R2 storage successfully: ${file.name}`
        );
        setCoverErrorText('');
      } catch (err: any) {
        console.error(err);
        setCoverErrorText(`Cover image upload failed: ${err.message || err}`);
        setCoverSuccessText('');
      } finally {
        setIsUploadingCover(false);
      }
    }
  };

  const handleThumbUploadDirect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbErrorText('');
    setThumbSuccessText('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setThumbErrorText('Please select a valid image file for the course thumbnail.');
        return;
      }
      setIsUploadingThumb(true);
      setThumbSuccessText('Processing course thumbnail...');
      try {
        const cleanName = `courses/thumbnails/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const uploadResult = await uploadFileResilient(file, cleanName, (msg) => setThumbSuccessText(msg));
        const downloadUrl = uploadResult.url;
        setNewCourse(prev => ({
          ...prev,
          thumbnail: downloadUrl
        }));
        setThumbSuccessText(uploadResult.isFallback
          ? `Course thumbnail saved offline successfully! (${file.name})`
          : `Course thumbnail uploaded successfully: ${file.name}`
        );
        setThumbErrorText('');
      } catch (err: any) {
        console.error(err);
        setThumbErrorText(`Course thumbnail upload failed: ${err.message || err}`);
        setThumbSuccessText('');
      } finally {
        setIsUploadingThumb(false);
      }
    }
  };

  // Add Ebook
  const handleCreateEbook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrMsg('');

    if (!newEbook.title || !newEbook.author.trim() || !newEbook.desc.trim() || !newEbook.pdfUrl || !newEbook.image) {
      setErrMsg('Please input the eBook title, real author, description, source PDF URL, and its real cover/first-page image.');
      return;
    }

    try {
      const ebookPayload = {
        title: newEbook.title,
        author: newEbook.author.trim(),
        year: Number(newEbook.year),
        category: newEbook.category,
        tabCategory: newEbook.tabCategory,
        type: newEbook.type,
        size: newEbook.size,
        image: newEbook.image,
        pdfUrl: newEbook.pdfUrl,
        desc: newEbook.desc.trim(),
        uploadedBy: newEbook.uploadedBy || newEbook.uploaderName || '',
        uploaderName: newEbook.uploaderName || newEbook.uploadedBy || '',
        uploaderRole: newEbook.uploaderRole || 'Volunteer Contributor',
        uploaderPhoto: newEbook.uploaderPhoto || '',
        volunteerId: newEbook.volunteerId || ''
      };

      if (editingEbookId) {
        await setDoc(doc(db, 'ebooks', editingEbookId), ebookPayload);
        setSuccessMsg(`eBook "${newEbook.title}" updated!`);
      } else {
        await addDoc(collection(db, 'ebooks'), ebookPayload);
        setSuccessMsg(`eBook "${newEbook.title}" added to E-Library!`);
      }
      setEditingEbookId(null);
      setNewEbook({
        title: '',
        author: '',
        year: new Date().getFullYear(),
        category: 'Fundamentals',
        tabCategory: 'books',
        type: 'PDF',
        size: '12MB',
        image: '',
        pdfUrl: '',
        desc: '',
        uploadedBy: '',
        uploaderName: '',
        uploaderRole: 'Volunteer Contributor',
        uploaderPhoto: '',
        volunteerId: ''
      });
      fetchCollections();
    } catch (err: any) {
      console.error(err);
      setErrMsg(`Failed to add ebook: ${err.message}`);
    }
  };

  // Edit / Add Website text general
  const handleUpdateWebsiteText = async (key: string, val: string) => {
    setSuccessMsg('');
    setErrMsg('');

    if (!key.trim() || !val.trim()) {
      setErrMsg('Please enter a valid key and paragraph text value.');
      return;
    }

    try {
      await setDoc(doc(db, 'websiteTexts', key.trim()), { text: val });
      setSuccessMsg(`Website Copy for "${key}" successfully saved live.`);
      setTextKey('');
      setTextVal('');
      fetchCollections();
    } catch (err: any) {
      console.error(err);
      setErrMsg(`Failed to save web copy: ${err.message}`);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId: string) => {
    const course = courses.find((c: any) => c.docId === courseId || c.id === courseId);
    const courseTitle = course?.title || courseId;

    if (!window.confirm(`Are you sure you want to delete course "${courseTitle}"? Any uploaded covers, thumbnails, or course documents will also be permanently deleted from Cloudflare R2 storage. This action cannot be undone.`)) return;

    setCourseLoading(true);
    setSuccessMsg('');
    setErrMsg('');
    try {
      const fileUrls = [course?.thumbnail, course?.thumbnailUrl, course?.imageUrl, course?.coverUrl, course?.pdfUrl, course?.instructorImage];
      const { count } = await deleteAttachedFilesFromR2(fileUrls);

      await deleteDoc(doc(db, 'courses', courseId));
      const r2Notice = count > 0 ? ` and removed ${count} media file(s) from Cloudflare R2 storage.` : '.';
      setSuccessMsg(`Course "${courseTitle}" successfully deleted from database${r2Notice}`);
      fetchCollections();
    } catch (err: any) {
      setErrMsg(`Purge failed: ${err.message}`);
    } finally {
      setCourseLoading(false);
    }
  };

  // Delete Ebook
  const handleDeleteEbook = async (ebookId: string) => {
    const ebook = ebooks.find((b: any) => b.docId === ebookId || b.id === ebookId);
    const ebookTitle = ebook?.title || ebookId;

    if (!window.confirm(`Are you sure you want to delete eBook "${ebookTitle}"? Its cover image and PDF document will also be permanently deleted from Cloudflare R2 storage. This action cannot be undone.`)) return;

    setEbookLoading(true);
    setSuccessMsg('');
    setErrMsg('');
    try {
      const fileUrls = [ebook?.coverUrl, ebook?.pdfUrl, ebook?.downloadUrl, ebook?.thumbnailUrl];
      const { count } = await deleteAttachedFilesFromR2(fileUrls);

      await deleteDoc(doc(db, 'ebooks', ebookId));
      const r2Notice = count > 0 ? ` and removed ${count} file(s) from Cloudflare R2 storage.` : '.';
      setSuccessMsg(`eBook "${ebookTitle}" successfully deleted from database${r2Notice}`);
      fetchCollections();
    } catch (err: any) {
      setErrMsg(`Resource deletion failed: ${err.message}`);
    } finally {
      setEbookLoading(false);
    }
  };

  // Delete Case
  const handleDeleteCase = async (caseId: string) => {
    let caseItem: any = null;
    try {
      const caseSnap = await getDoc(doc(db, 'cases', caseId));
      if (caseSnap.exists()) {
        caseItem = caseSnap.data();
      }
    } catch (e) {
      // ignore lookup error
    }

    const caseTitle = caseItem?.title || caseId;

    if (!window.confirm(`Are you sure you want to delete Case Study "${caseTitle}"? All attached evidence images and documents will also be permanently deleted from Cloudflare R2 storage. This action cannot be undone.`)) return;

    setSuccessMsg('');
    setErrMsg('');
    try {
      const mediaArray = Array.isArray(caseItem?.mediaUrls) ? caseItem.mediaUrls : [];
      const fileUrls = [caseItem?.imageUrl, caseItem?.pdfUrl, ...mediaArray];
      const { count } = await deleteAttachedFilesFromR2(fileUrls);

      await deleteDoc(doc(db, 'cases', caseId));
      const r2Notice = count > 0 ? ` and removed ${count} media file(s) from Cloudflare R2 storage.` : '.';
      setSuccessMsg(`Case Study "${caseTitle}" deleted successfully from database${r2Notice}`);
      fetchCollections();
    } catch(e: any) {
      setErrMsg(`Failed to delete case: ${e.message}`);
    }
  };

  // Create or Update Certificate
  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrMsg('');

    if (!newCertificate.certificateNo || !newCertificate.fullName || !newCertificate.courseTitle) {
      setErrMsg('Please enter a certificate number, full name, and course title.');
      return;
    }

    try {
      const normalizedNo = newCertificate.certificateNo.toUpperCase().trim();
      const safeDocId = normalizedNo.replace(/\//g, '_');
      const certificatePayload = {
        certificateNo: normalizedNo,
        fullName: newCertificate.fullName.trim(),
        courseTitle: newCertificate.courseTitle.trim(),
        certificateType: newCertificate.certificateType,
        issueDate: newCertificate.issueDate,
        imageUrl: newCertificate.imageUrl || '',
        pdfUrl: newCertificate.pdfUrl || '',
        additionalDetails: newCertificate.additionalDetails || '',
        createdAt: new Date().toISOString()
      };

      // Create or update document in certificates collection using a safe ID without slashes
      await setDoc(doc(db, 'certificates', safeDocId), certificatePayload);

      setSuccessMsg(editingCertificateId ? 'Certificate successfully updated!' : `Certificate "${normalizedNo}" issued and registered!`);
      setEditingCertificateId(null);
      setNewCertificate({
        certificateNo: '',
        fullName: '',
        courseTitle: '',
        certificateType: 'Internship Completion',
        issueDate: new Date().toISOString().split('T')[0],
        imageUrl: '',
        pdfUrl: '',
        additionalDetails: ''
      });
      fetchCollections();
    } catch (err: any) {
      console.error(err);
      setErrMsg(`Failed to submit certificate: ${err.message}`);
    }
  };

  // Delete Certificate
  const handleDeleteCertificate = async (id: string) => {
    const cert = certificates.find((c: any) => c.id === id || c.docId === id || c.certificateNo === id);
    const certNo = cert?.certificateNo || id;

    if (!window.confirm(`Are you sure you want to delete Certificate #${certNo}? The certificate visual image and PDF copy will also be permanently deleted from Cloudflare R2 storage. This action cannot be undone.`)) return;

    setCertificateLoading(true);
    setSuccessMsg('');
    setErrMsg('');
    try {
      const fileUrls = [cert?.imageUrl, cert?.pdfUrl];
      const { count } = await deleteAttachedFilesFromR2(fileUrls);

      await deleteDoc(doc(db, 'certificates', id));
      const r2Notice = count > 0 ? ` and removed ${count} document copy/copies from Cloudflare R2 storage.` : '.';
      setSuccessMsg(`Certificate #${certNo} successfully deleted from database${r2Notice}`);
      fetchCollections();
    } catch (err: any) {
      setErrMsg(`Delete failed: ${err.message}`);
    } finally {
      setCertificateLoading(false);
    }
  };

  // Upload Certificate Visual Image Copy
  const handleCertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertImageErrorText('');
    setCertImageSuccessText('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setCertImageErrorText('Please select a valid image file.');
        return;
      }
      setIsUploadingCertImage(true);
      setCertImageSuccessText('Uploading certificate image copy...');
      try {
        const cleanName = `certificates/images/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const uploadResult = await uploadFileResilient(file, cleanName, (msg) => setCertImageSuccessText(msg));
        setNewCertificate(prev => ({
          ...prev,
          imageUrl: uploadResult.url
        }));
        setCertImageSuccessText(uploadResult.isFallback
          ? `Certificate image saved offline successfully! (${file.name})`
          : `Certificate image uploaded successfully: ${file.name}`
        );
      } catch (err: any) {
        console.error(err);
        setCertImageErrorText(`Upload failed: ${err.message || err}`);
      } finally {
        setIsUploadingCertImage(false);
      }
    }
  };

  // Upload Certificate PDF copy
  const handleCertPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCertPdfErrorText('');
    setCertPdfSuccessText('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        setCertPdfErrorText('Please select a valid PDF file.');
        return;
      }
      setIsUploadingCertPdf(true);
      setCertPdfSuccessText('Uploading certificate PDF copy...');
      try {
        const cleanName = `certificates/pdfs/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const uploadResult = await uploadFileResilient(file, cleanName, (msg) => setCertPdfSuccessText(msg));
        setNewCertificate(prev => ({
          ...prev,
          pdfUrl: uploadResult.url
        }));
        setCertPdfSuccessText(uploadResult.isFallback
          ? `Certificate PDF saved offline successfully! (${file.name})`
          : `Certificate PDF uploaded successfully: ${file.name}`
        );
      } catch (err: any) {
        console.error(err);
        setCertPdfErrorText(`Upload failed: ${err.message || err}`);
      } finally {
        setIsUploadingCertPdf(false);
      }
    }
  };

  const handlePodcastCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPodcastCoverErrorText('');
    setPodcastCoverSuccessText('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setPodcastCoverErrorText('Please select a valid image file.');
        return;
      }
      setIsUploadingPodcastCover(true);
      setPodcastCoverSuccessText('Processing cover image...');
      try {
        const cleanName = `podcasts/covers/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const uploadResult = await uploadFileResilient(file, cleanName, (msg) => setPodcastCoverSuccessText(msg));
        setNewEpisode(prev => ({
          ...prev,
          coverImage: uploadResult.url
        }));
        setPodcastCoverSuccessText(uploadResult.isFallback
          ? `Cover saved offline successfully! (${file.name})`
          : `Cover uploaded successfully: ${file.name}`
        );
      } catch (err: any) {
        console.error(err);
        setPodcastCoverErrorText(`Cover upload failed: ${err.message || err}`);
      } finally {
        setIsUploadingPodcastCover(false);
      }
    }
  };

  const handleAudioUploadDirect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioErrorText('');
    setAudioSuccessText('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('audio/') && !file.name.endsWith('.mp3') && !file.name.endsWith('.wav') && !file.name.endsWith('.m4a') && !file.name.endsWith('.mp4') && !file.name.endsWith('.aac')) {
        setAudioErrorText('Please select a valid audio file (e.g., mp3, wav, m4a).');
        return;
      }
      setIsUploadingAudio(true);
      setAudioSuccessText('Processing audio file...');
      try {
        const cleanName = `podcasts/audio/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const uploadResult = await uploadFileResilient(file, cleanName, (msg) => setAudioSuccessText(msg));
        
        let durationStr = "30:00";
        let durationSecVal = 1800;
        try {
          const audio = new Audio();
          audio.src = URL.createObjectURL(file);
          await new Promise<void>((resolve) => {
            audio.addEventListener('loadedmetadata', () => {
              const totalSecs = Math.round(audio.duration);
              durationSecVal = totalSecs;
              const mins = Math.floor(totalSecs / 60);
              const secs = totalSecs % 60;
              durationStr = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
              resolve();
            });
            audio.addEventListener('error', () => {
              resolve();
            });
            setTimeout(resolve, 3000);
          });
        } catch (e1) {
          console.log("Could not measure duration automatically:", e1);
        }

        setNewEpisode(prev => ({
          ...prev,
          audioUrl: uploadResult.url,
          duration: durationStr,
          durationSec: durationSecVal
        }));
        
        setAudioSuccessText(uploadResult.isFallback
          ? `Audio saved offline successfully! (${file.name})`
          : `Audio uploaded successfully: ${file.name}`
        );
      } catch (err: any) {
        console.error(err);
        setAudioErrorText(`Audio upload failed: ${err.message || err}`);
      } finally {
        setIsUploadingAudio(false);
      }
    }
  };

  const handleEmployeePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmpPhotoErrorText('');
    setEmpPhotoSuccessText('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setEmpPhotoErrorText('Please select a valid image file (PNG, JPG, WEBP).');
        return;
      }
      setIsUploadingEmpPhoto(true);
      setEmpPhotoSuccessText('Uploading profile photo to R2 storage...');
      try {
        const cleanName = `employees/avatars/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const uploadResult = await uploadFileResilient(file, cleanName, (msg) => setEmpPhotoSuccessText(msg));
        setEmployeeFormData(prev => ({
          ...prev,
          imageUrl: uploadResult.url
        }));
        setEmpPhotoSuccessText(uploadResult.isFallback
          ? `Profile photo saved offline! (${file.name})`
          : `Profile photo uploaded to R2 successfully: ${file.name}`
        );
      } catch (err: any) {
        console.error('Error uploading employee photo:', err);
        setEmpPhotoErrorText(`Photo upload failed: ${err.message || err}`);
      } finally {
        setIsUploadingEmpPhoto(false);
      }
    }
  };

  const handleCreatePodcastEpisode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrMsg('');

    if (!newEpisode.title || !newEpisode.audioUrl) {
      setErrMsg('Please enter a podcast title and audio URL.');
      return;
    }

    try {
      const episodePayload = {
        title: newEpisode.title,
        description: newEpisode.description || 'Listen to this podcast episode by ForenClue.',
        coverImage: newEpisode.coverImage || 'https://www.dropbox.com/scl/fi/mcd47n75jiji29z8hyl9l/IMG_1221.png?rlkey=710x7h05bztk8kjcmxrvgpomj&st=hd2lg2mz&raw=1',
        audioUrl: newEpisode.audioUrl,
        date: newEpisode.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        duration: newEpisode.duration || '30:00',
        durationSec: Number(newEpisode.durationSec) || 1800,
        createdAt: new Date().toISOString()
      };

      if (editingPodcastId) {
        await setDoc(doc(db, 'podcastEpisodes', editingPodcastId), episodePayload);
        setSuccessMsg(`Podcast Episode "${newEpisode.title}" updated successfully!`);
      } else {
        await addDoc(collection(db, 'podcastEpisodes'), episodePayload);
        setSuccessMsg(`Podcast Episode "${newEpisode.title}" published successfully!`);
      }
      
      setEditingPodcastId(null);
      setNewEpisode({
        title: '',
        description: '',
        coverImage: '',
        audioUrl: '',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        duration: '30:00',
        durationSec: 1800
      });
      fetchCollections();
    } catch (err: any) {
      console.error(err);
      setErrMsg(`Failed to submit podcast episode: ${err.message}`);
    }
  };

  const handleDeletePodcastEpisode = async (episodeId: string) => {
    const episode = podcastEpisodes.find((ep: any) => ep.docId === episodeId || ep.id === episodeId);
    const epTitle = episode?.title || episodeId;

    if (!window.confirm(`Are you sure you want to delete Podcast Episode "${epTitle}"? Its audio MP3 file and cover image will also be permanently deleted from Cloudflare R2 storage. This action cannot be undone.`)) return;

    setPodcastLoading(true);
    setSuccessMsg('');
    setErrMsg('');
    try {
      const fileUrls = [episode?.coverUrl, episode?.audioUrl];
      const { count } = await deleteAttachedFilesFromR2(fileUrls);

      await deleteDoc(doc(db, 'podcastEpisodes', episodeId));
      const r2Notice = count > 0 ? ` and removed ${count} audio/cover file(s) from Cloudflare R2 storage.` : '.';
      setSuccessMsg(`Podcast Episode "${epTitle}" successfully deleted from database${r2Notice}`);
      fetchCollections();
    } catch (err: any) {
      setErrMsg(`Failed to delete podcast: ${err.message}`);
    } finally {
      setPodcastLoading(false);
    }
  };

  // Helper to add lesson to modules mock config
  const addLessonToModule = (modIdx: number) => {
    const updated = [...modules];
    const newLId = `l_${Date.now()}`;
    updated[modIdx].lessons.push({
      id: newLId,
      title: 'New Lesson Title',
      duration: '10 Mins',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    });
    setModules(updated);
  };

  const addModuleToCourse = () => {
    const newMId = `m_${Date.now()}`;
    setModules([
      ...modules,
      {
        id: newMId,
        title: `Module ${modules.length + 1}: Specimen investigation analysis`,
        lessons: [
          { id: `l_${Date.now()}`, title: 'Lesson 1: Introduction to Module Specimen', duration: '12 Mins', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' }
        ]
      }
    ]);
  };

  const handleLessonChange = (modIdx: number, lesIdx: number, field: string, val: string) => {
    const updated = [...modules];
    updated[modIdx].lessons[lesIdx] = {
      ...updated[modIdx].lessons[lesIdx],
      [field]: val
    };
    setModules(updated);
  };

  const handleModuleTitleChange = (modIdx: number, val: string) => {
    const updated = [...modules];
    updated[modIdx].title = val;
    setModules(updated);
  };

  return (
    <div className="pt-6 sm:pt-8 pb-16 min-h-screen bg-base relative overflow-hidden text-text-main">
      {/* Dynamic Background decor */}
      <div className="absolute top-0 left-0 w-full h-[36rem] bg-surface z-0 border-b border-black/10 dark:border-white/5 opacity-50">
        <div className="absolute inset-0 bg-grid-white/[0.015] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Alerts and triggers */}
        <AnimatePresence>
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-green-500/15 border border-green-500/30 text-green-400 rounded-xl flex items-center gap-3 font-medium text-sm"
            >
              <CheckCircle2 className="shrink-0" size={18} />
              <span>{successMsg}</span>
            </motion.div>
          )}
          {errMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-3 font-medium text-sm"
            >
              <AlertCircle className="shrink-0" size={18} />
              <span>{errMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NOT LOGGED IN CHALLENGE */}
        {!isAdmin ? (
          <div className="max-w-md mx-auto py-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-8 shadow-2xl relative"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-warning/10 border border-warning/20 text-warning rounded-full shadow-[0_0_20px_rgba(240,230,140,0.3)]">
                <Lock size={28} />
              </div>

              <div className="text-center mt-6 mb-8">
                <h1 className="text-2xl font-bold uppercase tracking-tight font-heading text-text-main">
                  Forenclue <span className="text-warning">Authorization</span> Setup
                </h1>
                <p className="text-xs text-text-muted mt-2 uppercase tracking-widest font-mono">
                  SECURE ADMINISTRATION PORTAL
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-500/15 border border-red-500/30 text-red-500 rounded-lg text-xs font-mono mb-4 text-center">
                  {authError}
                </div>
              )}

              <form onSubmit={handleManualLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-2 uppercase">Admin Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="forenclue@gmail.com"
                      className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-bold outline-none focus:border-warning/50 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-text-muted mb-2 uppercase">Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-3 pl-10 pr-10 text-xs font-bold outline-none focus:border-warning/50 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main cursor-pointer"
                      title={showPassword ? "Hide Password" : "Show Password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={btnLoading}
                  className="w-full bg-warning text-crust hover:bg-warning/90 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 mt-6 shadow-[0_4px_20px_rgba(240,230,140,0.15)]"
                >
                  {btnLoading ? <Loader2 className="animate-spin" size={14} /> : 'Authorize Workspace'}
                </button>
              </form>
            </motion.div>
          </div>
        ) : (
          
          /* LOGGED IN ACTIVE WORKSPACE */
          <div>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 border-b border-black/10 dark:border-white/5 pb-8">
              <div>
                <span className="text-[10px] bg-warning/10 text-warning px-3 py-1 font-mono uppercase tracking-widest rounded-full border border-warning/20">
                  Secure Administrative Station
                </span>
                <h1 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter mt-4 text-text-main flex items-center gap-4">
                  ForenClue <span className="text-warning">WorkSpace</span>
                  <span className="hidden sm:inline-block px-3 py-1 bg-warning/10 text-warning text-[12px] font-bold rounded-full animate-pulse tracking-widest border border-warning/20">LIVE STATUS</span>
                </h1>
                <p className="text-sm text-text-muted mt-3 font-mono uppercase tracking-widest flex items-center gap-2">
                  <Lock size={14} className="text-emerald-500" /> ROOT PRIVILEGES ACTIVE • SESSION ID: FC-{Math.random().toString(36).substring(2, 8).toUpperCase()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/cases')} 
                  className="px-4 py-2 border border-black/10 dark:border-white/10 rounded-xl text-xs font-bold hover:bg-surface transition-colors flex items-center gap-2 hover:border-warning/30 text-text-muted hover:text-text-main"
                >
                  <Globe size={14} /> View Case Studies
                </button>
                <button 
                  onClick={logout} 
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>

            {/* Dashboard Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Workspace Navigation Sidebar */}
              <div className="space-y-2">
                {isQuizOnlyAdmin ? (
                  <div>
                    <p className="text-[10px] font-mono text-warning uppercase tracking-widest px-3 mb-2 mt-2">Quiz Management Access</p>
                    <button 
                      onClick={() => setActiveTab('quizzes')}
                      className="w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors bg-warning text-crust shadow-md"
                    >
                      <Award size={16} /> Quizzes & Challenges
                    </button>
                    <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-2xl text-[11px] text-text-muted font-mono space-y-2">
                      <p className="font-bold text-warning uppercase tracking-wider flex items-center gap-1.5">
                        <Lock size={12} /> Restricted Sub-Admin Access
                      </p>
                      <p className="leading-relaxed">
                        Account <span className="text-text-main font-bold">purvabhawsar995@gmail.com</span> is granted administrative privileges strictly for creating, editing, and managing Quizzes & Weekly Challenges.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest px-3 mb-2 mt-6">Communications</p>
                    <button 
                      onClick={() => setActiveTab('inbox')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-between transition-colors ${activeTab === 'inbox' ? 'bg-warning text-crust' : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Mail size={16} /> Contact Inbox
                      </div>
                      {contactMessages.filter(m => !m.read).length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                          {contactMessages.filter(m => !m.read).length}
                        </span>
                      )}
                    </button>

                    <button 
                      onClick={() => setActiveTab('feedbacks')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-between transition-colors ${activeTab === 'feedbacks' ? 'bg-warning text-crust' : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare size={16} /> Seminar Feedbacks
                      </div>
                      {webinarFeedbacks.filter(f => !f.approved).length > 0 && (
                        <span className="bg-amber-500 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                          {webinarFeedbacks.filter(f => !f.approved).length} Pending
                        </span>
                      )}
                    </button>
                    <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest px-3 mb-2 mt-6">Systems Controls</p>

                    <button 
                      onClick={() => setActiveTab('overview')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${activeTab === 'overview' ? 'bg-warning text-crust' : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'}`}
                    >
                      <LayoutGrid size={16} /> Overview Reports
                    </button>
                    <button 
                      onClick={() => setActiveTab('courses')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${activeTab === 'courses' ? 'bg-warning text-crust' : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'}`}
                    >
                      <BookOpen size={16} /> Core Courses
                    </button>
                    <button 
                      onClick={() => setActiveTab('ebooks')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${activeTab === 'ebooks' ? 'bg-warning text-crust' : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'}`}
                    >
                      <FileText size={16} /> E-Library Books
                    </button>
                    <button 
                      onClick={() => setActiveTab('podcast')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${activeTab === 'podcast' ? 'bg-warning text-crust' : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'}`}
                    >
                      <Radio size={16} /> ForenClue Podcast
                    </button>
                    <button 
                      onClick={() => setActiveTab('doubts')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${activeTab === 'doubts' ? 'bg-warning text-crust' : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'}`}
                    >
                      <MessageSquare size={16} /> Community Doubts
                    </button>
                    <button 
                      onClick={() => setActiveTab('certificates')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${activeTab === 'certificates' ? 'bg-warning text-crust' : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'}`}
                    >
                      <Award size={16} /> Certificates Manager
                    </button>
                    <button 
                      onClick={() => setActiveTab('employees')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${activeTab === 'employees' ? 'bg-warning text-crust' : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'}`}
                    >
                      <Users size={16} /> Employee Manager
                    </button>
                    <button 
                      onClick={() => setActiveTab('quizzes')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${activeTab === 'quizzes' ? 'bg-warning text-crust' : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'}`}
                    >
                      <Award size={16} /> Quizzes & Challenges
                    </button>
                    <button 
                      onClick={() => setActiveTab('colleges')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors ${activeTab === 'colleges' ? 'bg-warning text-crust' : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'}`}
                    >
                      <Building2 size={16} /> Colleges Directory
                    </button>
                    <button 
                      onClick={() => setActiveTab('maintenance')}
                      className={`w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-between transition-colors ${activeTab === 'maintenance' ? 'bg-warning text-crust' : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text-main border border-black/5 dark:border-white/5'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Wrench size={16} className={maintenanceConfig.isActive ? "text-amber-500" : ""} /> Maintenance Mode
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${maintenanceConfig.isActive ? 'bg-amber-500 text-black animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {maintenanceConfig.isActive ? 'ACTIVE' : 'OFF'}
                      </span>
                    </button>
                    <Link 
                      to="/forms"
                      className="w-full text-left px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-3 transition-colors bg-surface hover:bg-surface/80 text-text-muted hover:text-warning border border-black/5 dark:border-white/5 cursor-pointer"
                    >
                      <ClipboardList size={16} /> Google Forms Portal
                    </Link>
                  </>
                )}
              </div>

              {/* Active Control Panel Canvas */}
              <div className="lg:col-span-3">
                
                {/* 1. OVERVIEW SYSTEM REPORT */}
                
                {/* INBOX SECTION */}
                {activeTab === 'inbox' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-black uppercase tracking-tight mb-4 flex items-center gap-2 text-text-main">
                        <Mail size={20} className="text-warning" /> Contact Messages Inbox
                      </h2>
                      <p className="text-sm text-text-muted mb-6">
                        Messages sent by users from the Contact page.
                      </p>

                      <div className="space-y-4">
                        {contactMessages.length === 0 ? (
                          <div className="text-center p-8 bg-base rounded-xl border border-black/5 dark:border-white/5 text-text-muted">
                            No messages received yet.
                          </div>
                        ) : (
                          contactMessages.map((msg: any) => (
                            <div key={msg.docId} className={`p-4 rounded-xl border ${msg.read ? 'bg-base border-black/5 dark:border-white/5' : 'bg-warning/5 border-warning/20'}`}>
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className="font-bold text-text-main">{msg.name}</div>
                                  <a href={`mailto:${msg.email}`} className="text-xs text-warning hover:underline">{msg.email}</a>
                                </div>
                                <div className="text-[10px] text-text-muted font-mono bg-black/5 dark:bg-white/5 px-2 py-1 rounded">
                                  {msg.createdAt?.toMillis ? new Date(msg.createdAt.toMillis()).toLocaleString() : 'Recent'}
                                </div>
                              </div>
                              <div className="text-sm text-text-main whitespace-pre-wrap mt-3 bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-black/5 dark:border-white/5">
                                {msg.message}
                              </div>
                              {!msg.read && (
                                <button 
                                  onClick={async () => {
                                    try {
                                      await setDoc(doc(db, 'contact_messages', msg.docId), { read: true }, { merge: true });
                                      setContactMessages(prev => prev.map(m => m.docId === msg.docId ? { ...m, read: true } : m));
                                    } catch(e) { console.error(e) }
                                  }}
                                  className="mt-4 px-3 py-1.5 bg-warning/10 text-warning text-xs font-bold uppercase tracking-wider rounded-md hover:bg-warning/20 transition-colors"
                                >
                                  Mark as Read
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SEMINAR FEEDBACKS APPROVAL SECTION */}
                {activeTab === 'feedbacks' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-black/10 dark:border-white/10">
                        <div>
                          <h2 className="text-xl font-heading font-black uppercase tracking-tight flex items-center gap-2 text-text-main">
                            <MessageSquare size={20} className="text-warning" /> Seminar Session Feedbacks Manager
                          </h2>
                          <p className="text-sm text-text-muted mt-1">
                            Review, verify, and approve participant feedbacks submitted from webinar / seminar pages.
                          </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center bg-base border border-black/10 dark:border-white/10 rounded-xl p-1 gap-1">
                          <button
                            onClick={() => setFeedbackFilter('pending')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                              feedbackFilter === 'pending' ? 'bg-warning text-crust' : 'text-text-muted hover:text-text-main'
                            }`}
                          >
                            Pending ({webinarFeedbacks.filter(f => !f.approved).length})
                          </button>
                          <button
                            onClick={() => setFeedbackFilter('approved')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                              feedbackFilter === 'approved' ? 'bg-warning text-crust' : 'text-text-muted hover:text-text-main'
                            }`}
                          >
                            Approved ({webinarFeedbacks.filter(f => f.approved).length})
                          </button>
                          <button
                            onClick={() => setFeedbackFilter('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                              feedbackFilter === 'all' ? 'bg-warning text-crust' : 'text-text-muted hover:text-text-main'
                            }`}
                          >
                            All ({webinarFeedbacks.length})
                          </button>
                        </div>
                      </div>

                      {/* Feedbacks List */}
                      <div className="space-y-4">
                        {feedbacksLoading ? (
                          <div className="text-center py-12 text-text-muted flex items-center justify-center gap-2 font-mono text-xs">
                            <Loader2 className="animate-spin text-warning" size={18} /> Loading seminar feedbacks...
                          </div>
                        ) : webinarFeedbacks.filter(f => {
                          if (feedbackFilter === 'pending') return !f.approved;
                          if (feedbackFilter === 'approved') return f.approved;
                          return true;
                        }).length === 0 ? (
                          <div className="text-center py-12 border border-dashed border-black/10 dark:border-white/10 rounded-xl text-text-muted font-mono text-xs">
                            No seminar feedbacks found for filter: <span className="text-warning font-bold uppercase">{feedbackFilter}</span>
                          </div>
                        ) : (
                          webinarFeedbacks
                            .filter(f => {
                              if (feedbackFilter === 'pending') return !f.approved;
                              if (feedbackFilter === 'approved') return f.approved;
                              return true;
                            })
                            .map((item) => (
                              <div 
                                key={item.docId} 
                                className={`p-5 rounded-2xl border transition-all ${
                                  !item.approved 
                                    ? 'bg-amber-500/5 border-amber-500/30 shadow-lg shadow-amber-500/5' 
                                    : 'bg-base border-black/5 dark:border-white/5'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-black/5 dark:border-white/5 pb-3">
                                  <div>
                                    <span className="text-[10px] font-mono font-bold uppercase bg-warning/10 text-warning px-2.5 py-0.5 rounded-md border border-warning/20">
                                      {item.eventName || `Session ${item.eventSequence || 'Webinar'}`}
                                    </span>
                                    <h4 className="font-extrabold text-sm text-text-main mt-1.5 flex items-center gap-2">
                                      {item.name}
                                      <span className="text-xs font-normal text-text-muted font-mono">
                                        &bull; {item.role || 'Participant'}
                                      </span>
                                    </h4>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    {/* Star Rating Display */}
                                    <div className="flex items-center gap-0.5 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          size={12}
                                          className={i < (item.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}
                                        />
                                      ))}
                                    </div>

                                    {/* Approval Status Badge */}
                                    {item.approved ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-md">
                                        <CheckCircle2 size={12} /> Approved & Live
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-md">
                                        <AlertCircle size={12} /> Pending Verification
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <p className="text-xs text-text-main leading-relaxed bg-surface/50 p-3.5 rounded-xl border border-black/5 dark:border-white/5">
                                  "{item.text}"
                                </p>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-2">
                                  <span className="text-[10px] font-mono text-text-muted">
                                    Submitted: {item.date || item.createdAt || 'Recently'}
                                  </span>

                                  <div className="flex items-center gap-2">
                                    {!item.approved && (
                                      <button
                                        onClick={() => handleApproveFeedback(item.docId)}
                                        className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                                      >
                                        <CheckCircle2 size={14} />
                                        <span>Approve & Publish</span>
                                      </button>
                                    )}

                                    <button
                                      onClick={() => handleDeleteFeedback(item.docId, item.name)}
                                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-xs uppercase tracking-wider rounded-lg transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                                    >
                                      <Trash2 size={13} />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'overview' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="space-y-6">
                      {/* Advanced Workspace Analytics */}
                      <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                           <LayoutGrid size={120} />
                        </div>
                        <h2 className="text-xl font-heading font-black uppercase tracking-tight mb-6 flex items-center gap-2">
                          <LayoutGrid size={20} className="text-warning" /> Workspace Analytics Overview
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                          <div className="bg-base border border-black/5 dark:border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-warning/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                              <BookOpen size={20} className="text-blue-500" />
                              <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-wider">Active</span>
                            </div>
                            <div>
                              <span className="text-3xl font-heading font-black text-text-main">{courses.length}</span>
                              <span className="text-[10px] uppercase tracking-wider text-text-muted block mt-1">Core Courses</span>
                            </div>
                          </div>

                          <div className="bg-base border border-black/5 dark:border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-warning/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                              <FileText size={20} className="text-emerald-500" />
                              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded uppercase tracking-wider">Resources</span>
                            </div>
                            <div>
                              <span className="text-3xl font-heading font-black text-text-main">{ebooks.length}</span>
                              <span className="text-[10px] uppercase tracking-wider text-text-muted block mt-1">E-Library</span>
                            </div>
                          </div>

                          <div className="bg-base border border-black/5 dark:border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-warning/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                              <Radio size={20} className="text-purple-500" />
                              <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded uppercase tracking-wider">Media</span>
                            </div>
                            <div>
                              <span className="text-3xl font-heading font-black text-text-main">{podcastEpisodes.length}</span>
                              <span className="text-[10px] uppercase tracking-wider text-text-muted block mt-1">Podcasts</span>
                            </div>
                          </div>

                          <div className="bg-base border border-black/5 dark:border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-warning/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                              <Award size={20} className="text-amber-500" />
                              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider">Issued</span>
                            </div>
                            <div>
                              <span className="text-3xl font-heading font-black text-text-main">{certificates.length}</span>
                              <span className="text-[10px] uppercase tracking-wider text-text-muted block mt-1">Certificates</span>
                            </div>
                          </div>

                          <div className="bg-base border border-black/5 dark:border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-warning/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                              <Users size={20} className="text-rose-500" />
                              <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded uppercase tracking-wider">Staff</span>
                            </div>
                            <div>
                              <span className="text-3xl font-heading font-black text-text-main">{adminEmployees.length}</span>
                              <span className="text-[10px] uppercase tracking-wider text-text-muted block mt-1">Employees</span>
                            </div>
                          </div>

                          <div className="bg-base border border-black/5 dark:border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-warning/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                              <HelpCircle size={20} className="text-cyan-500" />
                              <span className="text-[10px] font-bold text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded uppercase tracking-wider">Tests</span>
                            </div>
                            <div>
                              <span className="text-3xl font-heading font-black text-text-main">{adminQuizzes.length}</span>
                              <span className="text-[10px] uppercase tracking-wider text-text-muted block mt-1">Quizzes</span>
                            </div>
                          </div>
                          <div className="bg-base border border-black/5 dark:border-white/5 p-5 rounded-xl flex flex-col justify-between hover:border-warning/50 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                              <Mail size={20} className="text-blue-400" />
                              <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded uppercase tracking-wider">Inbox</span>
                            </div>
                            <div>
                              <span className="text-3xl font-heading font-black text-text-main">{contactMessages.length}</span>
                              <span className="text-[10px] uppercase tracking-wider text-text-muted block mt-1">Messages</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions Panel */}
                      <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                        <h2 className="text-lg font-heading font-black uppercase tracking-tight mb-4 text-text-main">
                          Dynamic Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <button onClick={() => setActiveTab('courses')} className="px-4 py-4 bg-base border border-black/5 dark:border-white/5 hover:border-warning/50 rounded-xl text-left transition flex flex-col gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <BookOpen size={16} />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-text-main block">New Course</span>
                              <span className="text-[10px] text-text-muted uppercase tracking-widest">Create Module</span>
                            </div>
                          </button>
                          
                          <button onClick={() => setActiveTab('quizzes')} className="px-4 py-4 bg-base border border-black/5 dark:border-white/5 hover:border-warning/50 rounded-xl text-left transition flex flex-col gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <CheckCircle2 size={16} />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-text-main block">New Quiz</span>
                              <span className="text-[10px] text-text-muted uppercase tracking-widest">Setup Challenge</span>
                            </div>
                          </button>
                          
                          <button onClick={() => setActiveTab('ebooks')} className="px-4 py-4 bg-base border border-black/5 dark:border-white/5 hover:border-warning/50 rounded-xl text-left transition flex flex-col gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <FileText size={16} />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-text-main block">Upload E-Book</span>
                              <span className="text-[10px] text-text-muted uppercase tracking-widest">Add Resource</span>
                            </div>
                          </button>
                          
                          <button onClick={() => setActiveTab('podcast')} className="px-4 py-4 bg-base border border-black/5 dark:border-white/5 hover:border-warning/50 rounded-xl text-left transition flex flex-col gap-3 group">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <Radio size={16} />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-text-main block">Publish Podcast</span>
                              <span className="text-[10px] text-text-muted uppercase tracking-widest">Release Episode</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* MAINTENANCE MODE QUICK CONTROLS CARD */}
                    <div className={cn(
                      "border rounded-2xl p-6 mb-6 transition-all",
                      maintenanceConfig.isActive 
                        ? "bg-amber-500/10 border-amber-500/30 shadow-lg shadow-amber-500/5" 
                        : "bg-surface border-black/10 dark:border-white/5"
                    )}>
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[10px] font-mono font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5",
                              maintenanceConfig.isActive 
                                ? "bg-amber-500 text-black animate-pulse" 
                                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            )}>
                              <span className={cn("w-1.5 h-1.5 rounded-full", maintenanceConfig.isActive ? "bg-black" : "bg-emerald-400")} />
                              {maintenanceConfig.isActive ? "MAINTENANCE MODE IS ON" : "WEBSITE IS LIVE"}
                            </span>
                            <span className="text-xs text-text-muted font-mono">
                              Target: <strong className="text-warning">{formatIstDisplay(maintenanceConfig.targetEndTime)}</strong>
                            </span>
                          </div>

                          <h3 className="text-base font-heading font-black text-text-main">
                            Global Platform Maintenance Switch
                          </h3>
                          <p className="text-xs text-text-muted max-w-xl">
                            {maintenanceConfig.isActive 
                              ? "Public visitors are currently seeing the minimalist countdown screen. You are logged in with staff bypass." 
                              : "The website is operating normally for all visitors worldwide."}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                          <button
                            onClick={() => handleToggleMaintenance(!maintenanceConfig.isActive)}
                            disabled={isSavingMaintenance}
                            className={cn(
                              "flex-1 md:flex-initial px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50",
                              maintenanceConfig.isActive
                                ? "bg-emerald-500 hover:bg-emerald-400 text-black"
                                : "bg-amber-500 hover:bg-amber-400 text-black"
                            )}
                          >
                            <Power size={14} />
                            <span>{maintenanceConfig.isActive ? "Turn OFF Maintenance" : "Turn ON Maintenance"}</span>
                          </button>

                          <button
                            onClick={() => setActiveTab('maintenance')}
                            className="px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 hover:bg-surface text-text-muted hover:text-text-main text-xs font-mono font-bold transition-all"
                          >
                            Configure Timer →
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* DATABASE RESTORATION ENGINE */}
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6 mb-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                          <h2 className="text-lg font-heading font-black uppercase tracking-tight text-warning flex items-center gap-2">
                            <Database size={18} className="text-warning animate-pulse" /> 
                            Database Restoration Engine
                          </h2>
                          <p className="text-xs text-text-muted max-w-2xl leading-relaxed">
                            If your verification systems are empty or cleared, click below to instantly seed and restore all official **ForenClue Employee Digital IDs** and **Course/Internship Verification Certificates** in the database.
                          </p>
                        </div>
                        <button
                          onClick={seedDemoEmployees}
                          disabled={employeeLoading}
                          className="w-full sm:w-auto px-5 py-3 bg-warning hover:bg-warning/90 disabled:opacity-50 text-crust font-black rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-warning/10"
                        >
                          <RefreshCw size={14} className={employeeLoading ? "animate-spin" : ""} />
                          <span>{employeeLoading ? "Restoring..." : "Restore Databases"}</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-black uppercase tracking-tight mb-4">Quick Shortcuts</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div 
                          onClick={() => setActiveTab('courses')}
                          className="p-4 bg-base hover:bg-black/10 dark:hover:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl cursor-pointer transition-colors"
                        >
                          <h3 className="font-bold text-sm text-warning mb-2 uppercase">Create Course Dossier</h3>
                          <p className="text-xs text-text-muted leading-relaxed">Submit syllabus, lectures, pricing tags, and noticeboards dynamically into Firestore.</p>
                        </div>
                        <div 
                          onClick={() => setActiveTab('podcast')}
                          className="p-4 bg-base hover:bg-black/10 dark:hover:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl cursor-pointer transition-colors"
                        >
                          <h3 className="font-bold text-sm text-warning mb-2 uppercase">Upload Podcast Episode</h3>
                          <p className="text-xs text-text-muted leading-relaxed">Publish new MP3 audio channels, dynamic titles, and podcast series covers directly.</p>
                        </div>
                        <div 
                          onClick={() => setActiveTab('certificates')}
                          className="p-4 bg-base hover:bg-black/10 dark:hover:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl cursor-pointer transition-colors"
                        >
                          <h3 className="font-bold text-sm text-warning mb-2 uppercase">Issue Verified Certificate</h3>
                          <p className="text-xs text-text-muted leading-relaxed">Register authentic Forenclue certificates with secure, verifiable verification codes.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. DYNAMIC COURSE BUILDING ENGINE */}
                {activeTab === 'courses' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Add Course form container */}
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-black uppercase tracking-tight mb-6">Build New Course Dossier</h2>
                      <form onSubmit={handleCreateCourse} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Course Title *</label>
                            <input 
                              type="text" 
                              value={newCourse.title} 
                              onChange={e => setNewCourse({...newCourse, title: e.target.value})} 
                              placeholder="e.g. Masterclass in Cyber Fingerprint Audits" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Instructor Name</label>
                            <input 
                              type="text" 
                              value={newCourse.instructor} 
                              onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} 
                              placeholder="Ayush Gaikwad" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Price (INR)</label>
                            <input 
                              type="number" 
                              value={newCourse.price} 
                              onChange={e => setNewCourse({...newCourse, price: Number(e.target.value)})} 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Original Price (INR)</label>
                            <input 
                              type="number" 
                              value={newCourse.originalPrice} 
                              onChange={e => setNewCourse({...newCourse, originalPrice: Number(e.target.value)})} 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Course Level</label>
                            <select 
                              value={newCourse.level} 
                              onChange={e => setNewCourse({...newCourse, level: e.target.value})} 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            >
                              <option value="Beginner">Beginner Phase</option>
                              <option value="Intermediate">Intermediate Phase</option>
                              <option value="Advanced">Advanced Phase</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Category</label>
                            <input 
                              type="text" 
                              value={newCourse.category} 
                              onChange={e => setNewCourse({...newCourse, category: e.target.value})} 
                              placeholder="Cyber, Ballistics, etc." 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Duration Block</label>
                            <input 
                              type="text" 
                              value={newCourse.duration} 
                              onChange={e => setNewCourse({...newCourse, duration: e.target.value})} 
                              placeholder="e.g. 14 Hours" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2.5 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                          <div className="bg-base/30 border border-black/5 dark:border-white/5 rounded-xl p-2.5 space-y-2">
                            <label className="block text-[10px] font-mono text-text-muted uppercase">Thumbnail (URL or Upload)</label>
                            <input 
                              type="text" 
                              value={newCourse.thumbnail} 
                              onChange={e => setNewCourse({...newCourse, thumbnail: e.target.value})} 
                              placeholder="URL or click below to upload" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-lg py-1.5 px-2 text-[11px] font-semibold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                            <div className="flex items-center gap-2">
                              <label className="flex-1 flex items-center justify-center gap-1.5 bg-warning/10 hover:bg-warning/15 border border-warning/20 hover:border-warning/30 text-warning px-2.5 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors">
                                <Upload size={12} />
                                <span>{isUploadingThumb ? 'Uploading...' : 'Upload Image'}</span>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={handleThumbUploadDirect} 
                                  className="hidden" 
                                  disabled={isUploadingThumb}
                                />
                              </label>
                              {newCourse.thumbnail && (
                                <ResilientImage src={newCourse.thumbnail} alt="Preview" className="w-6 h-6 rounded object-cover border border-black/10 dark:border-white/10" />
                              )}
                            </div>
                            {thumbSuccessText && (
                              <p className="text-[10px] font-mono text-green-500 mt-1.5 bg-green-500/5 px-2 py-1 rounded border border-green-500/10">{thumbSuccessText}</p>
                            )}
                            {thumbErrorText && (
                              <p className="text-[10px] font-mono text-red-500 mt-1.5 bg-red-500/5 px-2 py-1 rounded border border-red-500/10">{thumbErrorText}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Description summary *</label>
                          <textarea 
                            value={newCourse.description} 
                            onChange={e => setNewCourse({...newCourse, description: e.target.value})} 
                            rows={3}
                            placeholder="Detailed overview mapping core specimen forensics..." 
                            className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-sans outline-none text-text-main focus:border-warning/50 transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Curriculum Highlights (One bullet line per row)</label>
                          <textarea 
                            value={newCourse.curriculumLines} 
                            onChange={e => setNewCourse({...newCourse, curriculumLines: e.target.value})} 
                            rows={3}
                            placeholder="Specimen processing methods&#10;Ballistics testing systems&#10;Advanced chromatography audits" 
                            className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-mono outline-none text-text-main focus:border-warning/50 transition-colors"
                          />
                        </div>

                        {/* Modules Builder Section */}
                        <div className="border border-black/10 dark:border-white/5 rounded-xl p-4 bg-base/40 space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-black/10 dark:border-white/10">
                            <div>
                              <h3 className="text-xs font-black uppercase text-warning">Modules & Video Lectures Syllabus</h3>
                              <p className="text-[10px] text-text-muted leading-none mt-1">Populate learning steps and Youtube iframe keys.</p>
                            </div>
                            <button 
                              type="button" 
                              onClick={addModuleToCourse}
                              className="px-3 py-1 bg-warning/10 border border-warning/20 text-warning text-[10px] uppercase font-black tracking-widest rounded-md hover:bg-warning/20 transition-colors"
                            >
                              + Append Module
                            </button>
                          </div>

                          {modules.map((mod, modIdx) => (
                            <div key={mod.id} className="p-3 bg-surface border border-black/5 dark:border-white/5 rounded-lg space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-warning">M{modIdx + 1}:</span>
                                <input 
                                  type="text" 
                                  value={mod.title} 
                                  onChange={e => handleModuleTitleChange(modIdx, e.target.value)}
                                  className="flex-1 bg-base border border-black/5 dark:border-white/10 rounded-lg px-2 py-1 text-xs font-bold focus:border-warning outline-none text-text-main"
                                  placeholder="Module Heading Title"
                                />
                                <button 
                                  type="button" 
                                  onClick={() => addLessonToModule(modIdx)}
                                  className="text-[9px] text-warning bg-warning/5 border border-warning/10 px-2 py-1 rounded"
                                >
                                  + Append Lesson Video
                                </button>
                              </div>

                              <div className="pl-4 space-y-2">
                                {mod.lessons?.map((les: any, lesIdx: number) => (
                                  <div key={les.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-base/50 rounded border border-black/5 dark:border-white/5">
                                    <input 
                                      type="text" 
                                      value={les.title} 
                                      placeholder="Lesson Video Title"
                                      onChange={e => handleLessonChange(modIdx, lesIdx, 'title', e.target.value)}
                                      className="bg-surface border border-black/5 dark:border-white/10 rounded px-2 py-1 text-[11px] font-medium text-text-main"
                                    />
                                    <input 
                                      type="text" 
                                      value={les.duration} 
                                      placeholder="Duration (e.g. 15 Mins)"
                                      onChange={e => handleLessonChange(modIdx, lesIdx, 'duration', e.target.value)}
                                      className="bg-surface border border-black/5 dark:border-white/10 rounded px-2 py-1 text-[11px] font-medium text-text-main"
                                    />
                                    <input 
                                      type="text" 
                                      value={les.videoUrl} 
                                      placeholder="Youtube Embed URL"
                                      onChange={e => handleLessonChange(modIdx, lesIdx, 'videoUrl', e.target.value)}
                                      className="bg-surface border border-black/5 dark:border-white/10 rounded px-2 py-1 text-[11px] font-medium text-text-main"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                          <button 
                            type="submit" 
                            className="px-6 py-3 bg-warning text-crust font-black uppercase tracking-widest text-xs rounded-xl hover:bg-warning/90 transition-all flex items-center justify-center gap-2 flex-1"
                          >
                            <Sparkles size={14} /> {editingCourseId ? 'Update Course Live' : 'Submit Course Live'}
                          </button>
                          {editingCourseId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCourseId(null);
                                setNewCourse({
                                  title: '',
                                  instructor: 'Ayush Gaikwad',
                                  price: 0,
                                  originalPrice: 4999,
                                  level: 'Beginner',
                                  category: 'Forensic Science',
                                  duration: '12 Hours',
                                  description: '',
                                  thumbnail: '',
                                  instructorImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
                                  instructorBio: 'Lead Forensic Investigator & Cyber Analyst.',
                                  curriculumLines: ''
                                });
                                setModules([]);
                              }}
                              className="px-6 py-3 bg-red-500/10 text-red-500 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* Courses currently listed dynamic */}
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <h3 className="text-lg font-heading font-black uppercase tracking-tight mb-4">Administrated Investigations Courses</h3>
                      {courseLoading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-warning" /></div>
                      ) : courses.length === 0 ? (
                        <p className="text-xs text-text-muted py-4">No custom dynamic courses uploaded yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {courses.map((c) => (
                            <div key={c.docId} className="flex items-center justify-between p-3 bg-base border border-black/5 dark:border-white/5 rounded-xl">
                              <div className="flex items-center gap-4">
                                <ResilientImage src={c.thumbnail || ''} className="w-16 h-10 object-cover rounded-lg" alt={c.title || 'Course thumbnail'} />
                                <div className="text-left">
                                  <h4 className="text-xs font-black uppercase text-text-main leading-tight">{c.title}</h4>
                                  <span className="text-[10px] uppercase font-mono tracking-widest text-warning font-black">{c.level} PHASE • {c.price} INR</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    setEditingCourseId(c.docId);
                                    setNewCourse({
                                      title: c.title || '',
                                      instructor: c.instructor,
                                      price: c.price || 0,
                                      originalPrice: c.originalPrice || 0,
                                      level: c.level,
                                      category: c.category,
                                      duration: c.duration,
                                      description: c.description || '',
                                      thumbnail: c.thumbnail || '',
                                      instructorImage: c.instructorImage || '',
                                      instructorBio: c.instructorBio || '',
                                      curriculumLines: c.curriculum?.join('\n') || ''
                                    });
                                    setModules(c.modules || []);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="p-2 border border-blue-500/10 hover:border-blue-500/30 text-blue-400 bg-blue-400/5 hover:bg-blue-400/10 rounded-lg transition-all"
                                  title="Edit course"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteCourse(c.docId)}
                                  className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-lg transition-all"
                                  title="Purge course"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 3. E-LIBRARY PDF BUILDER */}
                {activeTab === 'ebooks' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-black uppercase tracking-tight mb-6">Incorporate resource into E-Library</h2>
                      <form onSubmit={handleCreateEbook} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Book / Document Title *</label>
                            <input 
                              type="text" 
                              value={newEbook.title} 
                              onChange={e => setNewEbook({...newEbook, title: e.target.value})} 
                              placeholder="e.g. Principals of Cyber Fingerprint Chromatography" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Author / Publisher Name</label>
                            <input 
                              type="text" 
                              value={newEbook.author} 
                              onChange={e => setNewEbook({...newEbook, author: e.target.value})} 
                              placeholder="e.g. Dr. Apurba Nandy" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Publishing Year</label>
                            <input 
                              type="number" 
                              value={newEbook.year} 
                              onChange={e => setNewEbook({...newEbook, year: Number(e.target.value)})} 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Subject Category</label>
                            <input 
                              type="text" 
                              value={newEbook.category} 
                              onChange={e => setNewEbook({...newEbook, category: e.target.value})} 
                              placeholder="Medicine, Ballistics, DNA" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">E-Library Tab Area</label>
                            <select 
                              value={newEbook.tabCategory} 
                              onChange={e => setNewEbook({...newEbook, tabCategory: e.target.value})} 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            >
                              <option value="books">Reference Books</option>
                              <option value="notes">Quick lecture Notes</option>
                              <option value="papers">Research Papers</option>
                              <option value="other">Other Stuff Checklist</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">File weight (Size)</label>
                            <input 
                              type="text" 
                              value={newEbook.size} 
                              onChange={e => setNewEbook({...newEbook, size: e.target.value})} 
                              placeholder="e.g. 15MB" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-base/30 border border-black/10 dark:border-white/5 rounded-2xl p-4">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Cover Image (URL or Upload)</label>
                            <div className="space-y-2">
                              <input 
                                type="text" 
                                value={newEbook.image} 
                                onChange={e => setNewEbook({...newEbook, image: e.target.value})} 
                                placeholder="e.g. Image URL" 
                                className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                              />
                              <div className="flex items-center gap-2">
                                <label className="flex-1 flex items-center justify-center gap-2 bg-warning/10 hover:bg-warning/15 border border-warning/20 hover:border-warning/30 text-warning px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                                  <Upload size={13} />
                                  <span>{isUploadingCover ? 'Uploading...' : 'Upload Local Image'}</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleCoverUploadDirect} 
                                    className="hidden" 
                                    disabled={isUploadingCover}
                                  />
                                </label>
                                {newEbook.image && (
                                  <ResilientImage src={newEbook.image} alt="Preview" className="w-8 h-8 rounded object-cover border border-black/10 dark:border-white/10" />
                                )}
                              </div>
                              {coverSuccessText && (
                                <p className="text-[10px] font-mono text-green-500 mt-1.5 bg-green-500/5 px-2 py-1 rounded border border-green-500/10">{coverSuccessText}</p>
                              )}
                              {coverErrorText && (
                                <p className="text-[10px] font-mono text-red-500 mt-1.5 bg-red-500/5 px-2 py-1 rounded border border-red-500/10">{coverErrorText}</p>
                              )}
                            </div>
                          </div>

                          <div className="bg-base/30 border border-black/10 dark:border-white/5 rounded-2xl p-4">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Document File (URL or Upload) *</label>
                            <div className="space-y-2">
                              <input 
                                type="text" 
                                value={newEbook.pdfUrl} 
                                onChange={e => setNewEbook({...newEbook, pdfUrl: e.target.value})} 
                                placeholder="e.g. PDF Download URL" 
                                className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                                required
                              />
                              <div className="flex items-center gap-2">
                                <label className="flex-1 flex items-center justify-center gap-2 bg-warning/10 hover:bg-warning/15 border border-warning/20 hover:border-warning/30 text-warning px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                                  <FileText size={13} />
                                  <span>{isUploadingPdf ? 'Uploading...' : 'Upload Local PDF'}</span>
                                  <input 
                                    type="file" 
                                    accept="application/pdf" 
                                    onChange={handlePdfUploadDirect} 
                                    className="hidden" 
                                    disabled={isUploadingPdf}
                                  />
                                </label>
                                {newEbook.pdfUrl && (
                                  <div className="text-xs font-mono text-green-400 bg-green-500/10 px-2 py-1.5 rounded-xl border border-green-500/20 truncate max-w-[150px]">
                                    Uploaded!
                                  </div>
                                )}
                              </div>
                              {pdfSuccessText && (
                                <p className="text-[10px] font-mono text-green-500 mt-1.5 bg-green-500/5 px-2 py-1 rounded border border-green-500/10">{pdfSuccessText}</p>
                              )}
                              {pdfErrorText && (
                                <p className="text-[10px] font-mono text-red-500 mt-1.5 bg-red-500/5 px-2 py-1 rounded border border-red-500/10">{pdfErrorText}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Brief Description</label>
                          <textarea 
                            value={newEbook.desc} 
                            onChange={e => setNewEbook({...newEbook, desc: e.target.value})} 
                            rows={2}
                            placeholder="Briefly describe the topics covered inside..." 
                            className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-sans outline-none text-text-main focus:border-warning/50 transition-colors"
                          />
                        </div>

                        {/* Volunteer & Member Recognition Section */}
                        <div className="p-4 bg-warning/5 border border-warning/20 rounded-2xl space-y-3">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-warning" />
                            <h4 className="text-xs font-extrabold uppercase tracking-wide text-text-main">
                              Volunteer / Member Recognition (Contributor Attribution)
                            </h4>
                          </div>
                          <p className="text-[10px] text-text-muted font-sans">
                            Connect this material to a verified volunteer or employee from the Employee Verification System. When site visitors click on the contributor profile, they will be redirected to their digital cryptographic ID card.
                          </p>

                          {/* Quick Selector from Employee Verification System */}
                          <div className="bg-base p-3 border border-black/10 dark:border-white/10 rounded-xl space-y-2">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <label className="text-[10px] font-mono font-bold text-text-main uppercase flex items-center gap-1.5">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <span>Link Verified Employee / Volunteer (Verification System)</span>
                              </label>
                              <span className="text-[9px] font-mono text-text-muted">
                                {adminEmployees.length} verified identities found
                              </span>
                            </div>

                            <select
                              value={newEbook.volunteerId || ''}
                              onChange={(e) => {
                                const selectedId = e.target.value;
                                if (!selectedId) {
                                  setNewEbook({
                                    ...newEbook,
                                    volunteerId: '',
                                    uploadedBy: '',
                                    uploaderName: '',
                                    uploaderRole: 'Volunteer Contributor',
                                    uploaderPhoto: ''
                                  });
                                  return;
                                }
                                const matchedEmp = adminEmployees.find(emp => emp.employeeId === selectedId);
                                if (matchedEmp) {
                                  setNewEbook({
                                    ...newEbook,
                                    volunteerId: matchedEmp.employeeId,
                                    uploadedBy: matchedEmp.fullName,
                                    uploaderName: matchedEmp.fullName,
                                    uploaderRole: `${matchedEmp.position || 'Volunteer'} (${matchedEmp.department || 'ForenClue'})`,
                                    uploaderPhoto: matchedEmp.imageUrl || ''
                                  });
                                }
                              }}
                              className="w-full bg-surface border border-black/15 dark:border-white/15 rounded-xl py-2 px-3 text-xs font-sans text-text-main focus:border-warning outline-none cursor-pointer"
                            >
                              <option value="">-- Select Volunteer / Employee ID from Verification System --</option>
                              {adminEmployees.map((emp) => (
                                <option key={emp.employeeId} value={emp.employeeId}>
                                  {emp.employeeId} - {emp.fullName} ({emp.position || emp.department})
                                </option>
                              ))}
                            </select>

                            {/* Active Connection Badge */}
                            {(newEbook.volunteerId || newEbook.uploadedBy) && (
                              <div className="pt-2 flex items-center justify-between gap-2 text-[10px] font-mono border-t border-black/5 dark:border-white/5 flex-wrap">
                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                                  <CheckCircle2 size={13} />
                                  <span>Connected ID: <strong>{newEbook.volunteerId || 'Manual ID'}</strong> &bull; {newEbook.uploaderName || newEbook.uploadedBy}</span>
                                </div>
                                {newEbook.volunteerId && (
                                  <a
                                    href={`/employees?id=${encodeURIComponent(newEbook.volunteerId)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-warning hover:underline font-bold flex items-center gap-1"
                                  >
                                    <span>Preview Digital ID Card</span>
                                    <ExternalLink size={11} />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Volunteer / Uploader Name</label>
                              <input 
                                type="text" 
                                value={newEbook.uploadedBy || newEbook.uploaderName} 
                                onChange={e => setNewEbook({...newEbook, uploadedBy: e.target.value, uploaderName: e.target.value})} 
                                placeholder="e.g. Rohan Verma" 
                                className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-sans outline-none text-text-main focus:border-warning/50 transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Volunteer / Member ID</label>
                              <input 
                                type="text" 
                                value={newEbook.volunteerId} 
                                onChange={e => setNewEbook({...newEbook, volunteerId: e.target.value})} 
                                placeholder="e.g. FC-VOL-2024-182" 
                                className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-sans outline-none text-text-main focus:border-warning/50 transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Contributor Role / Badge</label>
                              <input 
                                type="text" 
                                value={newEbook.uploaderRole} 
                                onChange={e => setNewEbook({...newEbook, uploaderRole: e.target.value})} 
                                placeholder="e.g. Senior Research Volunteer" 
                                className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-sans outline-none text-text-main focus:border-warning/50 transition-colors"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Profile Photo URL (Optional)</label>
                              <input 
                                type="text" 
                                value={newEbook.uploaderPhoto} 
                                onChange={e => setNewEbook({...newEbook, uploaderPhoto: e.target.value})} 
                                placeholder="https://..." 
                                className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-sans outline-none text-text-main focus:border-warning/50 transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                          <button 
                            type="submit" 
                            className="px-6 py-3 bg-warning text-crust font-black uppercase tracking-widest text-xs rounded-xl hover:bg-warning/90 transition-all flex items-center justify-center gap-2 flex-1"
                          >
                            <Plus size={14} /> {editingEbookId ? 'Update book metadata' : 'Incorporate book resources'}
                          </button>
                          {editingEbookId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingEbookId(null);
                                setNewEbook({
                                  title: '', author: '', year: new Date().getFullYear(),
                                  category: 'Fundamentals', tabCategory: 'books', type: 'PDF',
                                  size: '12MB', image: '', pdfUrl: '', desc: '',
                                  uploadedBy: '', uploaderName: '', uploaderRole: 'Volunteer Contributor', uploaderPhoto: '', volunteerId: ''
                                });
                              }}
                              className="px-6 py-3 bg-red-500/10 text-red-500 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-red-500/20 transition-all flex items-center justify-center"
                            >
                              Cancel Edit
                            </button>
                          )}
                        </div>
                      </form>
                    </div>

                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <h3 className="text-lg font-heading font-black uppercase tracking-tight mb-4">Dynamically Loaded Reference Ebooks</h3>
                      {ebookLoading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-warning" /></div>
                      ) : ebooks.length === 0 ? (
                        <p className="text-xs text-text-muted py-4">No custom library documents listed yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {ebooks.map((b) => (
                            <div key={b.docId} className="flex items-center justify-between p-3 bg-base border border-black/5 dark:border-white/5 rounded-xl">
                              <div className="flex items-center gap-4 text-left">
                                <ResilientImage src={b.image || b.coverImage || ''} className="w-10 h-14 object-contain bg-surface border border-black/5 rounded shadow" alt={b.title || 'eBook Cover'} />
                                <div>
                                  <h4 className="text-xs font-black uppercase text-text-main leading-tight line-clamp-1">{b.title}</h4>
                                  <span className="text-[10px] font-mono uppercase tracking-widest text-warning font-black">{b.tabCategory} • {b.author || 'Author unspecified'}</span>
                                  {(b.uploadedBy || b.uploaderName) && (
                                    <div className="text-[9px] font-mono text-emerald-400 mt-0.5">
                                      Volunteer: {b.uploaderName || b.uploadedBy} {b.volunteerId && `(${b.volunteerId})`}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    setEditingEbookId(b.docId);
                                    setNewEbook({
                                      title: b.title || '',
                                      author: b.author || '',
                                      year: b.year || new Date().getFullYear(),
                                      category: b.category || 'Fundamentals',
                                      tabCategory: b.tabCategory || 'books',
                                      type: b.type || 'PDF',
                                      size: b.size || '12MB',
                                      image: b.image || '',
                                      pdfUrl: b.pdfUrl || '',
                                      desc: b.desc || '',
                                      uploadedBy: b.uploadedBy || b.uploaderName || '',
                                      uploaderName: b.uploaderName || b.uploadedBy || '',
                                      uploaderRole: b.uploaderRole || 'Volunteer Contributor',
                                      uploaderPhoto: b.uploaderPhoto || '',
                                      volunteerId: b.volunteerId || ''
                                    });
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="p-2 border border-blue-500/10 hover:border-blue-500/30 text-blue-400 bg-blue-400/5 hover:bg-blue-400/10 rounded-lg transition-all"
                                  title="Edit eBook metadata"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button 
                                  onClick={() => handleDeleteEbook(b.docId)}
                                  className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-lg transition-all"
                                  title="Remove Document"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 5. PODCASTS MANAGEMENT */}
                {activeTab === 'podcast' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-black uppercase tracking-tight mb-6 flex items-center gap-2 text-warning">
                        <Radio size={20} className="text-warning animate-pulse" />
                        {editingPodcastId ? '🔧 Modify Podcast Episode' : '🎙️ Publish Podcast Episode'}
                      </h2>
                      
                      <form onSubmit={handleCreatePodcastEpisode} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-text-muted">Episode Title *</label>
                            <input
                              type="text"
                              value={newEpisode.title}
                              onChange={(e) => setNewEpisode(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="e.g., 5. Handwriting Analysis Secrets"
                              className="w-full bg-base border border-black/10 dark:border-white/5 rounded-lg px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-warning/50 text-text-main"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-text-muted">Publish Date</label>
                            <input
                              type="text"
                              value={newEpisode.date}
                              onChange={(e) => setNewEpisode(prev => ({ ...prev, date: e.target.value }))}
                              placeholder="e.g., Jun 21, 2026"
                              className="w-full bg-base border border-black/10 dark:border-white/5 rounded-lg px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-warning/50 text-text-main"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-text-muted">Short Description</label>
                          <textarea
                            value={newEpisode.description}
                            onChange={(e) => setNewEpisode(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Provide a clear, rich, brief summary of what forensics knowledge or test prep tips are covered in this episode."
                            rows={3}
                            className="w-full bg-base border border-black/10 dark:border-white/5 rounded-lg p-4 text-xs font-medium focus:outline-none focus:border-warning/50 text-text-main resize-none"
                          />
                        </div>

                        {/* Cover Art Configuration */}
                        <div className="bg-base border border-black/5 dark:border-white/5 p-4 rounded-xl space-y-3">
                          <span className="text-xs font-bold uppercase tracking-widest text-warning block">Cover Art Artwork</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium mb-1.5 text-text-muted">Direct Image URL upload (Optional)</label>
                              <input
                                type="text"
                                value={newEpisode.coverImage}
                                onChange={(e) => setNewEpisode(prev => ({ ...prev, coverImage: e.target.value }))}
                                placeholder="Paste cover image link here..."
                                className="w-full bg-surface border border-black/10 dark:border-white/5 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-warning/50 text-text-main"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1.5 text-text-muted">Or upload local cover JPG/PNG file</label>
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handlePodcastCoverUpload}
                                  id="podcast-cover-upload"
                                  className="hidden"
                                />
                                <label
                                  htmlFor="podcast-cover-upload"
                                  className="flex items-center justify-center gap-2 w-full bg-surface hover:bg-surface/80 border border-dashed border-black/20 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-bold cursor-pointer transition-colors text-text-main"
                                >
                                  {isUploadingPodcastCover ? (
                                    <>
                                      <Loader2 size={14} className="animate-spin text-warning" />
                                      <span>Uploading cover...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload size={14} />
                                      <span>Browse Cover Image</span>
                                    </>
                                  )}
                                </label>
                              </div>
                              {podcastCoverErrorText && <p className="text-[10px] text-red-400 mt-1">{podcastCoverErrorText}</p>}
                              {podcastCoverSuccessText && <p className="text-[10px] text-green-400 mt-1">{podcastCoverSuccessText}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Audio URL Configuration */}
                        <div className="bg-base border border-black/5 dark:border-white/5 p-4 rounded-xl space-y-3">
                          <span className="text-xs font-bold uppercase tracking-widest text-warning block">Acoustic Audio Channel *</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium mb-1.5 text-text-muted">Audio MP3 URL link *</label>
                              <input
                                type="text"
                                value={newEpisode.audioUrl}
                                onChange={(e) => setNewEpisode(prev => ({ ...prev, audioUrl: e.target.value }))}
                                placeholder="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                                className="w-full bg-surface border border-black/10 dark:border-white/5 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-warning/50 text-text-main"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1.5 text-text-muted">Or Upload standard audio MP3 file</label>
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="audio/*"
                                  onChange={handleAudioUploadDirect}
                                  id="podcast-audio-upload"
                                  className="hidden"
                                />
                                <label
                                  htmlFor="podcast-audio-upload"
                                  className="flex items-center justify-center gap-2 w-full bg-surface hover:bg-surface/80 border border-dashed border-black/20 dark:border-white/10 rounded-lg px-3 py-2 text-xs font-bold cursor-pointer transition-colors text-text-main"
                                >
                                  {isUploadingAudio ? (
                                    <>
                                      <Loader2 size={14} className="animate-spin text-warning" />
                                      <span>Uploading Audio...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload size={14} />
                                      <span>Browse Audio File</span>
                                    </>
                                  )}
                                </label>
                              </div>
                              {audioErrorText && <p className="text-[10px] text-red-400 mt-1">{audioErrorText}</p>}
                              {audioSuccessText && <p className="text-[10px] text-green-400 mt-1">{audioSuccessText}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Duration Override config fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-base border border-black/5 dark:border-white/5 p-4 rounded-xl">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-text-muted">Duration Display Tag</label>
                            <input
                              type="text"
                              value={newEpisode.duration}
                              onChange={(e) => setNewEpisode(prev => ({ ...prev, duration: e.target.value }))}
                              placeholder="e.g., 45 min 12 sec"
                              className="w-full bg-surface border border-black/10 dark:border-white/5 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-warning/50 text-text-main"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-text-muted">Duration (seconds)</label>
                            <input
                              type="number"
                              value={newEpisode.durationSec}
                              onChange={(e) => setNewEpisode(prev => ({ ...prev, durationSec: Number(e.target.value) }))}
                              placeholder="2712"
                              className="w-full bg-surface border border-black/10 dark:border-white/5 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-warning/50 text-text-main"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                          {editingPodcastId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPodcastId(null);
                                setNewEpisode({
                                  title: '',
                                  description: '',
                                  coverImage: '',
                                  audioUrl: '',
                                  date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                                  duration: '30:00',
                                  durationSec: 1800
                                });
                              }}
                              className="px-5 py-2.5 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold tracking-wider hover:bg-zinc-700 transition"
                            >
                              Cancel Edit
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={isUploadingAudio || isUploadingPodcastCover}
                            className={`px-6 py-2.5 bg-warning text-crust rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-warning/90 transition ${(isUploadingAudio || isUploadingPodcastCover) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {editingPodcastId ? 'Update Episode' : 'Broadcast Episode'}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Dynamic Published Episodes List */}
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-black uppercase tracking-tight mb-6">🎙️ Dynamic Episodes Index</h2>
                      
                      {podcastLoading ? (
                        <div className="flex justify-center items-center py-10 font-mono text-xs text-text-muted gap-2">
                          <Loader2 size={16} className="animate-spin text-warning" /> Loading episodes...
                        </div>
                      ) : podcastEpisodes.length === 0 ? (
                        <div className="text-center py-12 text-xs text-text-muted font-mono border border-dashed border-black/10 dark:border-white/5 rounded-xl">
                          No episodes in dynamic database indexes yet. Any published episodes will overwrite or extend standard podcast indexes.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {podcastEpisodes.map((ep) => (
                            <div 
                              key={ep.docId}
                              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-base border border-black/5 dark:border-white/5 rounded-xl gap-4 hover:border-warning/20 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={ep.coverImage || 'https://www.dropbox.com/scl/fi/mcd47n75jiji29z8hyl9l/IMG_1221.png?rlkey=710x7h05bztk8kjcmxrvgpomj&st=hd2lg2mz&raw=1'}
                                  alt={ep.title}
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded object-cover border border-black/10 dark:border-white/5 shrink-0"
                                />
                                <div>
                                  <h3 className="font-bold text-sm text-text-main group-hover:text-warning transition-colors">{ep.title}</h3>
                                  <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono mt-1">
                                    <span>{ep.date}</span>
                                    <span>•</span>
                                    <span>{ep.duration || '30:00'}</span>
                                  </div>
                                  <p className="text-xs text-text-muted line-clamp-1 mt-1 max-w-sm sm:max-w-md lg:max-w-xl">
                                    {ep.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                <button
                                  onClick={() => {
                                    setEditingPodcastId(ep.docId);
                                    setNewEpisode({
                                      title: ep.title || '',
                                      description: ep.description || '',
                                      coverImage: ep.coverImage || '',
                                      audioUrl: ep.audioUrl || '',
                                      date: ep.date || '',
                                      duration: ep.duration || '',
                                      durationSec: ep.durationSec || 1800
                                    });
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="p-2 border border-blue-500/10 hover:border-blue-500/30 text-blue-400 bg-blue-400/5 hover:bg-blue-400/10 rounded-lg transition-all"
                                  title="Edit Episode Metadata"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeletePodcastEpisode(ep.docId)}
                                  className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-lg transition-all"
                                  title="Remove Episode"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 4. DOUBTS MANAGEMENT */}
                {activeTab === 'doubts' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-black uppercase tracking-tight mb-4">Manage Community Doubts</h2>
                      {doubts.length === 0 ? (
                        <p className="text-xs text-text-muted py-4">No doubts reported yet.</p>
                      ) : (
                        <div className="space-y-3">
                          {doubts.map((doubt: any) => (
                            <div key={doubt.id} className="flex items-center justify-between p-3 bg-base border border-black/5 dark:border-white/5 rounded-xl">
                              <div>
                                <h4 className="text-xs font-black uppercase text-text-main leading-tight">{doubt.title}</h4>
                                <p className="text-[10px] text-text-muted truncate max-w-sm">{doubt.content}</p>
                                <span className="text-[10px] uppercase font-mono tracking-widest text-warning font-black">Author: {doubt.authorName}</span>
                              </div>
                              <button 
                                onClick={async () => {
                                  if (!window.confirm("Are you sure you want to delete this doubt?")) return;
                                  try {
                                    await deleteDoc(doc(db, 'doubts', doubt.id));
                                    setSuccessMsg("Doubt successfully purged.");
                                    fetchCollections();
                                  } catch (err: any) {
                                    setErrMsg(`Purge failed: ${err.message}`);
                                  }
                                }}
                                className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-lg transition-all"
                                title="Purge doubt"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 5. CERTIFICATES VERIFICATION SYSTEM */}
                {activeTab === 'certificates' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-black uppercase tracking-tight mb-6">
                        {editingCertificateId ? 'Modify Certificate Record' : 'Issue Verified Certificate'}
                      </h2>
                      <form onSubmit={handleCreateCertificate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Unique Certificate No. *</label>
                            <input 
                              type="text" 
                              value={newCertificate.certificateNo} 
                              onChange={e => setNewCertificate({...newCertificate, certificateNo: e.target.value})} 
                              placeholder="e.g. FC-1025-AB" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors uppercase"
                              required
                              disabled={!!editingCertificateId}
                            />
                            {editingCertificateId && <span className="text-[10px] text-text-muted font-mono mt-1 block">Certificate numbers cannot be altered after registration.</span>}
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Recipient Full Name *</label>
                            <input 
                              type="text" 
                              value={newCertificate.fullName} 
                              onChange={e => setNewCertificate({...newCertificate, fullName: e.target.value})} 
                              placeholder="e.g. Ayush Gaikwad" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Course or Internship Title *</label>
                            <input 
                              type="text" 
                              value={newCertificate.courseTitle} 
                              onChange={e => setNewCertificate({...newCertificate, courseTitle: e.target.value})} 
                              placeholder="e.g. Advanced Cybersecurity Audit" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Certificate Type</label>
                            <select 
                              value={newCertificate.certificateType} 
                              onChange={e => setNewCertificate({...newCertificate, certificateType: e.target.value})} 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            >
                              <option value="Internship Completion">Internship Completion</option>
                              <option value="Course Completion">Course Completion</option>
                              <option value="Merit Certificate">Merit Certificate</option>
                              <option value="Professional Excellence">Professional Excellence</option>
                              <option value="Certificate Of Participation">Certificate Of Participation</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Issue Date *</label>
                            <input 
                              type="date" 
                              value={newCertificate.issueDate} 
                              onChange={e => setNewCertificate({...newCertificate, issueDate: e.target.value})} 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Image Attachment */}
                          <div className="bg-base/30 border border-black/10 dark:border-white/5 rounded-2xl p-4">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Certificate Image Link (URL)</label>
                            <div className="space-y-2">
                              <input 
                                type="text" 
                                value={newCertificate.imageUrl} 
                                onChange={e => setNewCertificate({...newCertificate, imageUrl: e.target.value})} 
                                placeholder="e.g. https://forenclue.com/certificates/sample-image.png" 
                                className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                              />
                              <div className="flex items-center gap-2">
                                <label className="flex-1 flex items-center justify-center gap-2 bg-warning/10 hover:bg-warning/15 border border-warning/20 hover:border-warning/30 text-warning px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                                  <Upload size={13} />
                                  <span>{isUploadingCertImage ? 'Uploading Image...' : 'Upload Image to generate link'}</span>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleCertImageUpload} 
                                    className="hidden" 
                                    disabled={isUploadingCertImage}
                                  />
                                </label>
                                {newCertificate.imageUrl && (
                                  <ResilientImage src={newCertificate.imageUrl} alt="Preview" className="w-8 h-8 rounded object-cover border border-black/10 dark:border-white/10" />
                                )}
                              </div>
                              <p className="text-[9px] text-text-muted font-mono leading-relaxed">
                                Enter a direct web link to the certificate image, or upload a local file to host it on our servers.
                              </p>
                              {certImageSuccessText && (
                                <p className="text-[10px] font-mono text-green-500 mt-1.5 bg-green-500/5 px-2 py-1 rounded border border-green-500/10">{certImageSuccessText}</p>
                              )}
                              {certImageErrorText && (
                                <p className="text-[10px] font-mono text-red-500 mt-1.5 bg-red-500/5 px-2 py-1 rounded border border-red-500/10">{certImageErrorText}</p>
                              )}
                            </div>
                          </div>

                          {/* PDF Attachment */}
                          <div className="bg-base/30 border border-black/10 dark:border-white/5 rounded-2xl p-4">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Official Document (PDF URL or Upload)</label>
                            <div className="space-y-2">
                              <input 
                                type="text" 
                                value={newCertificate.pdfUrl} 
                                onChange={e => setNewCertificate({...newCertificate, pdfUrl: e.target.value})} 
                                placeholder="e.g. https://domain.com/cert.pdf" 
                                className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                              />
                              <div className="flex items-center gap-2">
                                <label className="flex-1 flex items-center justify-center gap-2 bg-warning/10 hover:bg-warning/15 border border-warning/20 hover:border-warning/30 text-warning px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                                  <FileText size={13} />
                                  <span>{isUploadingCertPdf ? 'Uploading PDF...' : 'Upload PDF Copy'}</span>
                                  <input 
                                    type="file" 
                                    accept="application/pdf" 
                                    onChange={handleCertPdfUpload} 
                                    className="hidden" 
                                    disabled={isUploadingCertPdf}
                                  />
                                </label>
                                {newCertificate.pdfUrl && (
                                  <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1.5 rounded-xl border border-emerald-500/20 truncate max-w-[150px]">
                                    PDF Ready
                                  </div>
                                )}
                              </div>
                              {certPdfSuccessText && (
                                <p className="text-[10px] font-mono text-green-500 mt-1.5 bg-green-500/5 px-2 py-1 rounded border border-green-500/10">{certPdfSuccessText}</p>
                              )}
                              {certPdfErrorText && (
                                <p className="text-[10px] font-mono text-red-500 mt-1.5 bg-red-500/5 px-2 py-1 rounded border border-red-500/10">{certPdfErrorText}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Additional Certificate Details</label>
                          <textarea 
                            value={newCertificate.additionalDetails} 
                            onChange={e => setNewCertificate({...newCertificate, additionalDetails: e.target.value})} 
                            rows={3}
                            placeholder="Add secondary information e.g. Special Roles, Score: 95%, Duration: 3 Months, Grade A+..." 
                            className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-sans outline-none text-text-main focus:border-warning/50 transition-colors"
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          {editingCertificateId && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCertificateId(null);
                                setNewCertificate({
                                  certificateNo: '',
                                  fullName: '',
                                  courseTitle: '',
                                  certificateType: 'Internship Completion',
                                  issueDate: new Date().toISOString().split('T')[0],
                                  imageUrl: '',
                                  pdfUrl: '',
                                  additionalDetails: ''
                                });
                              }}
                              className="px-4 py-2 border border-black/10 dark:border-white/10 text-xs font-bold uppercase rounded-xl transition hover:bg-surface"
                            >
                              Cancel Edit
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={isUploadingCertImage || isUploadingCertPdf}
                            className="px-6 py-2.5 bg-warning text-crust hover:bg-warning/90 disabled:opacity-50 font-black rounded-xl text-xs uppercase tracking-widest transition flex items-center gap-2"
                          >
                            {isUploadingCertImage || isUploadingCertPdf ? (
                              <>
                                <Loader2 size={13} className="animate-spin" />
                                <span>Uploading assets...</span>
                              </>
                            ) : (
                              <>
                                <Award size={13} />
                                <span>{editingCertificateId ? 'Update Certificate' : 'Issue Certificate'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <h2 className="text-xl font-heading font-black uppercase tracking-tight mb-6">Issued Credentials Index</h2>
                      
                      {certificateLoading ? (
                        <div className="flex justify-center items-center py-10 font-mono text-xs text-text-muted gap-2">
                          <Loader2 size={16} className="animate-spin text-warning" /> Loading certificates...
                        </div>
                      ) : certificates.length === 0 ? (
                        <div className="text-center py-12 text-xs text-text-muted font-mono border border-dashed border-black/10 dark:border-white/5 rounded-xl">
                          No certificates registered in the database yet.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {certificates.map((cert) => (
                            <div 
                              key={cert.id}
                              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-base border border-black/5 dark:border-white/5 rounded-xl gap-4 hover:border-warning/20 transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-warning/10 text-warning rounded-full flex items-center justify-center border border-warning/20">
                                  <Award size={20} />
                                </div>
                                <div>
                                  <h3 className="font-bold text-sm text-text-main group-hover:text-warning transition-colors uppercase">
                                    {cert.fullName}
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-text-muted font-mono mt-1">
                                    <span className="text-warning font-bold">{cert.id}</span>
                                    <span>•</span>
                                    <span>{cert.certificateType}</span>
                                    <span>•</span>
                                    <span>Issued: {cert.issueDate}</span>
                                  </div>
                                  <p className="text-xs text-text-muted line-clamp-1 mt-1 max-w-sm sm:max-w-md lg:max-w-xl">
                                    {cert.courseTitle} {cert.additionalDetails ? `(${cert.additionalDetails})` : ''}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 self-end sm:self-auto">
                                <button
                                  onClick={() => {
                                    setEditingCertificateId(cert.id);
                                    setNewCertificate({
                                      certificateNo: cert.certificateNo || cert.id,
                                      fullName: cert.fullName || '',
                                      courseTitle: cert.courseTitle || '',
                                      certificateType: cert.certificateType || 'Internship Completion',
                                      issueDate: cert.issueDate || '',
                                      imageUrl: cert.imageUrl || '',
                                      pdfUrl: cert.pdfUrl || '',
                                      additionalDetails: cert.additionalDetails || ''
                                    });
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="p-2 border border-blue-500/10 hover:border-blue-500/30 text-blue-400 bg-blue-400/5 hover:bg-blue-400/10 rounded-lg transition-all"
                                  title="Edit Certificate"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteCertificate(cert.id)}
                                  className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-lg transition-all"
                                  title="Delete Certificate"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'employees' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-heading font-black uppercase tracking-tight flex items-center gap-2">
                          <Users className="text-warning" /> 
                          {isEditingEmployee ? 'Edit Employee Identity' : 'Provision New Identity'}
                        </h2>
                        {adminEmployees.length === 0 && (
                          <button
                            onClick={seedDemoEmployees}
                            disabled={employeeLoading}
                            className="px-4 py-2 border border-black/10 dark:border-white/10 text-xs font-bold uppercase rounded-xl transition hover:bg-surface flex items-center gap-2"
                          >
                            <RefreshCw size={13} className={employeeLoading ? "animate-spin" : ""} /> Seed Demo Data
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleEmployeeFormSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Employee ID (Must be Unique)</label>
                            <input 
                              type="text" 
                              required 
                              disabled={isEditingEmployee}
                              value={employeeFormData.employeeId} 
                              onChange={e => setEmployeeFormData({...employeeFormData, employeeId: e.target.value.toUpperCase()})} 
                              placeholder="e.g. FC-EMP-001" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors disabled:opacity-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Full Name</label>
                            <input 
                              type="text" 
                              required 
                              value={employeeFormData.fullName} 
                              onChange={e => setEmployeeFormData({...employeeFormData, fullName: e.target.value})} 
                              placeholder="e.g. John Doe" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Position / Role</label>
                            <input 
                              type="text" 
                              required 
                              value={employeeFormData.position} 
                              onChange={e => setEmployeeFormData({...employeeFormData, position: e.target.value})} 
                              placeholder="e.g. Cybersecurity Analyst" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Department</label>
                            <select 
                              value={employeeFormData.department} 
                              onChange={e => setEmployeeFormData({...employeeFormData, department: e.target.value})} 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            >
                              <option>Research & Development (R&D)</option>
                              <option>Forensic Research & Academic Publications</option>
                              <option>Research & Intelligence</option>
                              <option>Forensic Case Studies & Publications</option>
                              <option>Business Development & Partnerships</option>
                              <option>Human Resources (HR)</option>
                              <option>Video Editing & Motion Graphics</option>
                              <option>Cybersecurity & Digital Forensics</option>
                              <option>Web Development</option>
                              <option>Marketing & Public Relations</option>
                              <option>Events & Operations</option>
                              <option>Social Media Management</option>
                              <option>Graphic Design & Branding</option>
                              <option>Content Writing & Editorial</option>
                              <option>Admin</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Joining Date</label>
                            <input 
                              type="date" 
                              required 
                              value={employeeFormData.joiningDate} 
                              onChange={e => setEmployeeFormData({...employeeFormData, joiningDate: e.target.value})} 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Valid Until</label>
                            <input 
                              type="date" 
                              required 
                              value={employeeFormData.expiryDate} 
                              onChange={e => setEmployeeFormData({...employeeFormData, expiryDate: e.target.value})} 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Status</label>
                            <select 
                              value={employeeFormData.status} 
                              onChange={e => setEmployeeFormData({...employeeFormData, status: e.target.value as any})} 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            >
                              <option value="Active">Active</option>
                              <option value="Suspended">Suspended</option>
                              <option value="Expired">Expired</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Security Clearance Level</label>
                            <select 
                              value={employeeFormData.clearanceLevel} 
                              onChange={e => setEmployeeFormData({...employeeFormData, clearanceLevel: e.target.value})} 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            >
                              <option>Level 1 - Employee</option>
                              <option>Level 2 - Intern</option>
                              <option>Level 3 - Member</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Email Address</label>
                            <input 
                              type="email" 
                              value={employeeFormData.email} 
                              onChange={e => setEmployeeFormData({...employeeFormData, email: e.target.value})} 
                              placeholder="e.g. name@forenclue.com" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Phone Number</label>
                            <input 
                              type="text" 
                              value={employeeFormData.phone} 
                              onChange={e => setEmployeeFormData({...employeeFormData, phone: e.target.value})} 
                              placeholder="e.g. +91 9988776655" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">Skills & Specializations (Comma Separated)</label>
                            <input 
                              type="text" 
                              value={employeeFormData.skills} 
                              onChange={e => setEmployeeFormData({...employeeFormData, skills: e.target.value})} 
                              placeholder="e.g. Threat Intelligence, Incident Response, Malware Analysis" 
                              className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">
                              Profile Photo (Upload from Local Storage to R2 or Paste URL)
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                              {employeeFormData.imageUrl && (
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-warning/50 shrink-0 bg-base flex items-center justify-center">
                                  <ResilientImage 
                                    src={employeeFormData.imageUrl} 
                                    alt="Employee avatar preview" 
                                    className="w-full h-full object-cover"
                                    fallbackText={employeeFormData.fullName ? employeeFormData.fullName.charAt(0) : "E"}
                                  />
                                </div>
                              )}
                              <div className="flex-1 w-full space-y-2">
                                <div className="flex gap-2 items-center">
                                  <input 
                                    type="text" 
                                    value={employeeFormData.imageUrl} 
                                    onChange={e => setEmployeeFormData({...employeeFormData, imageUrl: e.target.value})} 
                                    placeholder="e.g. https://forenclue.in/uploads/photo.jpg or upload from local device"
                                    className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl py-2 px-3 text-xs font-bold outline-none text-text-main focus:border-warning/50 transition-colors"
                                  />
                                  <label className={`cursor-pointer px-4 py-2 rounded-xl bg-warning/10 hover:bg-warning/20 border border-warning/30 text-warning text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-colors ${isUploadingEmpPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <Upload size={14} />
                                    <span>{isUploadingEmpPhoto ? 'Uploading...' : 'Upload Photo'}</span>
                                    <input 
                                      type="file" 
                                      accept="image/*" 
                                      onChange={handleEmployeePhotoUpload} 
                                      disabled={isUploadingEmpPhoto}
                                      className="hidden" 
                                    />
                                  </label>
                                </div>
                                {empPhotoSuccessText && (
                                  <p className="text-[11px] font-mono text-emerald-400 font-medium">
                                    {empPhotoSuccessText}
                                  </p>
                                )}
                                {empPhotoErrorText && (
                                  <p className="text-[11px] font-mono text-red-400 font-medium">
                                    {empPhotoErrorText}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          {isEditingEmployee && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsEditingEmployee(false);
                                setEditEmployeeId(null);
                                setEmployeeFormData({
                                  employeeId: '',
                                  fullName: '',
                                  position: '',
                                  department: 'Cybersecurity & Digital Forensics',
                                  joiningDate: new Date().toISOString().split('T')[0],
                                  expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0],
                                  status: 'Active',
                                  email: '',
                                  phone: '',
                                  skills: '',
                                  imageUrl: '',
                                  clearanceLevel: 'Level 1 - Employee'
                                });
                              }}
                              className="px-4 py-2 border border-black/10 dark:border-white/10 text-xs font-bold uppercase rounded-xl transition hover:bg-surface"
                            >
                              Cancel Edit
                            </button>
                          )}
                          <button
                            type="submit"
                            disabled={employeeLoading}
                            className="px-6 py-2.5 bg-warning text-crust hover:bg-warning/90 disabled:opacity-50 font-black rounded-xl text-xs uppercase tracking-widest transition flex items-center gap-2"
                          >
                            {employeeLoading ? (
                              <>
                                <Loader2 size={13} className="animate-spin" />
                                <span>Processing...</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck size={13} />
                                <span>{isEditingEmployee ? 'Update Identity' : 'Provision Identity'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-heading font-black uppercase tracking-tight">Active Directory</h2>
                        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-3 py-1 rounded-lg flex items-center gap-2">
                          <Database size={12} className="text-warning" />
                          <span className="text-[10px] font-mono text-text-muted">Total Identities: {adminEmployees.length}</span>
                        </div>
                      </div>
                      
                      {employeeLoading && !isEditingEmployee ? (
                        <div className="flex justify-center items-center py-10 font-mono text-xs text-text-muted gap-2">
                          <Loader2 size={16} className="animate-spin text-warning" /> Synchronizing directory...
                        </div>
                      ) : adminEmployees.length === 0 ? (
                        <div className="text-center py-12 text-xs text-text-muted font-mono border border-dashed border-black/10 dark:border-white/5 rounded-xl flex flex-col items-center justify-center">
                          <Users size={32} className="mb-3 opacity-20" />
                          <p>No identities registered in the network.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {adminEmployees.map((emp) => (
                            <div 
                              key={emp.employeeId}
                              className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-base border border-black/5 dark:border-white/5 rounded-xl gap-4 hover:border-warning/20 transition-all group"
                            >
                              <div className="flex items-center gap-4">
                                {emp.imageUrl ? (
                                  <img 
                                    src={emp.imageUrl} 
                                    alt={emp.fullName}
                                    className="w-12 h-12 rounded-lg object-cover border border-black/10 dark:border-white/10"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-black/5 dark:bg-white/5 text-text-muted rounded-lg flex items-center justify-center border border-black/10 dark:border-white/10">
                                    <Users size={20} />
                                  </div>
                                )}
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-sm text-text-main group-hover:text-warning transition-colors uppercase">
                                      {emp.fullName}
                                    </h3>
                                    <span className={cn(
                                      "text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider",
                                      emp.status === 'Active' ? "bg-green-500/10 text-green-500" :
                                      emp.status === 'Suspended' ? "bg-red-500/10 text-red-500" :
                                      "bg-orange-500/10 text-orange-500"
                                    )}>
                                      {emp.status}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-text-muted font-mono mt-0.5">
                                    <span className="text-warning">{emp.employeeId}</span> • {emp.position}
                                  </p>
                                  <p className="text-[10px] text-text-muted/60 flex items-center gap-1 mt-1 font-mono uppercase">
                                    <Fingerprint size={10} /> clearance: {emp.clearanceLevel.split(' - ')[0]}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-black/5 dark:border-white/5 pt-3 md:pt-0">
                                <button
                                  onClick={() => {
                                    handleEmployeeEditInit(emp);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="p-2 border border-blue-500/10 hover:border-blue-500/30 text-blue-400 bg-blue-400/5 hover:bg-blue-400/10 rounded-lg transition-all flex items-center gap-2 text-xs uppercase font-bold"
                                  title="Edit Identity"
                                >
                                  <Edit3 size={14} /> <span className="md:hidden">Edit</span>
                                </button>
                                <button
                                  onClick={() => handleEmployeeDelete(emp.employeeId)}
                                  className="p-2 border border-red-500/10 hover:border-red-500/30 text-red-400 bg-red-400/5 hover:bg-red-400/10 rounded-lg transition-all flex items-center gap-2 text-xs uppercase font-bold"
                                  title="Revoke Credentials"
                                >
                                  <Trash2 size={14} /> <span className="md:hidden">Revoke</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 8. QUIZZES & WEEKLY CHALLENGES MANAGER */}
                {activeTab === 'quizzes' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    {/* Header & Sub-Navigation */}
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-5">
                        <div>
                          <h2 className="text-xl font-heading font-black uppercase tracking-tight flex items-center gap-2 text-text-main">
                            <Trophy className="text-warning" size={24} /> Quizzes & Competitive Challenges Manager
                          </h2>
                          <p className="text-xs text-text-muted mt-1">
                            Create competitive challenges, set ₹300/₹200/₹100 cash prizes, review 12-digit student UTR payments, and audit winners.
                          </p>
                        </div>

                        {/* Sub-Tab Switcher */}
                        <div className="flex items-center gap-1.5 bg-base p-1.5 rounded-2xl border border-black/10 dark:border-white/10 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setQuizSubTab('editor')}
                            className={cn(
                              "px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                              quizSubTab === 'editor'
                                ? "bg-warning text-crust shadow-md font-black"
                                : "text-text-muted hover:text-text-main"
                            )}
                          >
                            <Edit3 size={14} /> Challenge Builder
                            {editingQuizId && (
                              <span className={cn(
                                "px-1.5 py-0.2 text-[9px] font-black rounded uppercase ml-1",
                                newQuizForm.status === 'draft' ? "bg-amber-500/30 text-amber-300" : "bg-emerald-500/30 text-emerald-300"
                              )}>
                                {newQuizForm.status === 'draft' ? 'Draft' : 'Editing'}
                              </span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setQuizSubTab('approvals')}
                            className={cn(
                              "px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative",
                              quizSubTab === 'approvals'
                                ? "bg-amber-500 text-black shadow-md font-black"
                                : "text-text-muted hover:text-text-main"
                            )}
                          >
                            <CreditCard size={14} /> UTR Approvals
                            {quizRegistrations.filter(r => r.status === 'pending').length > 0 && (
                              <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-rose-500 text-white animate-pulse">
                                {quizRegistrations.filter(r => r.status === 'pending').length}
                              </span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setQuizSubTab('audit')}
                            className={cn(
                              "px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                              quizSubTab === 'audit'
                                ? "bg-emerald-500 text-crust shadow-md font-black"
                                : "text-text-muted hover:text-text-main"
                            )}
                          >
                            <Award size={14} /> Prize & Winner Audit
                          </button>

                          <button
                            type="button"
                            onClick={() => setQuizSubTab('list')}
                            className={cn(
                              "px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                              quizSubTab === 'list'
                                ? "bg-surface border border-white/20 text-text-main shadow-md font-black"
                                : "text-text-muted hover:text-text-main"
                            )}
                          >
                            <ClipboardList size={14} /> Quizzes & Drafts ({adminQuizzes.length})
                            {adminQuizzes.filter(q => q.status === 'draft').length > 0 && (
                              <span className="px-1.5 py-0.2 text-[10px] font-black rounded-full bg-amber-500/30 text-amber-400 border border-amber-500/40">
                                {adminQuizzes.filter(q => q.status === 'draft').length} Drafts
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* SUBTAB 1: CHALLENGE & QUESTION BUILDER */}
                      {quizSubTab === 'editor' && (
                        <div className="pt-6 space-y-6">
                          {/* Draft / Publish Mode Banner */}
                          {editingQuizId ? (
                            newQuizForm.status === 'draft' ? (
                              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                                    <FileText size={20} />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                                        Editing Draft Quiz
                                      </span>
                                      <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300">
                                        Hidden from Students
                                      </span>
                                    </div>
                                    <p className="text-xs text-text-muted mt-0.5">
                                      This quiz is in draft state. Save your work as draft anytime, and click <strong>Publish</strong> whenever you are ready to make it live.
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleAdminSaveQuiz(undefined, 'draft')}
                                    className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                                  >
                                    <FileText size={14} /> Quick Save Draft
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleAdminSaveQuiz(undefined, 'published')}
                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-crust font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-md"
                                  >
                                    <Award size={14} /> Publish Now
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4 flex-wrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={20} />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                                        Editing Published Quiz
                                      </span>
                                      <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                                        Live for Students
                                      </span>
                                    </div>
                                    <p className="text-xs text-text-muted mt-0.5">
                                      This quiz is active. You can make revisions, save as draft to unpublish temporarily, or save updates to remain published.
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleAdminSaveQuiz(undefined, 'draft')}
                                  className="px-3.5 py-2 bg-base hover:bg-white/5 border border-black/10 dark:border-white/10 text-text-muted hover:text-amber-400 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                                  title="Unpublish and revert this quiz back into Draft mode"
                                >
                                  <FileText size={14} /> Revert to Draft
                                </button>
                              </div>
                            )
                          ) : (
                            <div className="p-3.5 rounded-2xl bg-base border border-black/5 dark:border-white/5 flex items-center justify-between gap-3 flex-wrap text-xs text-text-muted">
                              <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-warning shrink-0" />
                                <span>
                                  <strong>Draft & Publish:</strong> Click <strong>Save as Draft</strong> to safely preserve work in progress, or <strong>Publish</strong> when ready.
                                </span>
                              </div>
                            </div>
                          )}

                          <form onSubmit={(e) => handleAdminSaveQuiz(e, 'published')} className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Quiz / Challenge Title *</label>
                                <input
                                  type="text"
                                  value={newQuizForm.title}
                                  onChange={(e) => setNewQuizForm({ ...newQuizForm, title: e.target.value })}
                                  placeholder="Weekly Challenge: Crime Scene Documentation & Forensic Mapping"
                                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Category *</label>
                                <select
                                  value={newQuizForm.category}
                                  onChange={(e) => setNewQuizForm({ ...newQuizForm, category: e.target.value })}
                                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none"
                                >
                                  <option value="Crime Scene Documentation">Crime Scene Documentation</option>
                                  <option value="Crime Scene Investigation">Crime Scene Investigation</option>
                                  <option value="Forensic Identification">Forensic Identification</option>
                                  <option value="Forensic Biology">Forensic Biology</option>
                                  <option value="Digital Forensics">Digital Forensics</option>
                                  <option value="Forensic Chemistry">Forensic Chemistry</option>
                                  <option value="Forensic Toxicology">Forensic Toxicology</option>
                                  <option value="Forensic Ballistics">Forensic Ballistics</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Challenge Description *</label>
                              <textarea
                                value={newQuizForm.description}
                                onChange={(e) => setNewQuizForm({ ...newQuizForm, description: e.target.value })}
                                rows={2}
                                placeholder="Describe syllabus, topics covered (e.g. photography, triangulation, ABFO #2 scale, sketches), and rules..."
                                className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs text-text-main outline-none"
                                required
                              />
                            </div>

                            {/* Schedule & Timing Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-base/50 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                              <div className="flex items-center gap-2 pt-6">
                                <input
                                  type="checkbox"
                                  id="isWeeklyChallenge"
                                  checked={newQuizForm.isWeeklyChallenge}
                                  onChange={(e) => setNewQuizForm({ ...newQuizForm, isWeeklyChallenge: e.target.checked })}
                                  className="w-4 h-4 text-warning"
                                />
                                <label htmlFor="isWeeklyChallenge" className="text-xs font-bold uppercase text-text-main cursor-pointer">
                                  Weekly Challenge?
                                </label>
                              </div>

                              <div>
                                <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Live Start Date & Time</label>
                                <input
                                  type="datetime-local"
                                  value={newQuizForm.scheduledStartTime}
                                  onChange={(e) => setNewQuizForm({ ...newQuizForm, scheduledStartTime: e.target.value })}
                                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-2.5 text-xs text-text-main outline-none"
                                />
                                {newQuizForm.scheduledStartTime && (
                                  <p className="text-[10px] text-amber-500 font-mono mt-1 font-bold">
                                    IST: {(() => {
                                      try {
                                        return new Date(newQuizForm.scheduledStartTime).toLocaleString('en-IN', {
                                          timeZone: 'Asia/Kolkata',
                                          day: 'numeric',
                                          month: 'short',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit',
                                          hour12: true
                                        }) + ' IST';
                                      } catch (e) {
                                        return '';
                                      }
                                    })()}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Duration (Mins)</label>
                                <input
                                  type="number"
                                  value={newQuizForm.durationMinutes}
                                  onChange={(e) => setNewQuizForm({ ...newQuizForm, durationMinutes: Number(e.target.value) })}
                                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-2.5 text-xs font-bold text-text-main outline-none"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-mono text-text-muted mb-1 uppercase">Total Points (Sum: {quizQuestions.reduce((acc, q) => acc + (Number(q.points) || 0), 0)})</label>
                                <input
                                  type="number"
                                  value={newQuizForm.totalPoints}
                                  onChange={(e) => setNewQuizForm({ ...newQuizForm, totalPoints: Number(e.target.value) })}
                                  className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-2.5 text-xs font-bold text-warning font-mono outline-none"
                                  required
                                />
                              </div>
                            </div>

                            {/* PRICING & ACCESS MODEL: TWO CLEAR OPTIONS (FREE VS PAID) */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-mono uppercase tracking-wider text-text-muted flex items-center gap-1.5 font-bold">
                                  <CreditCard size={14} className="text-warning" /> Quiz & Challenge Pricing Model (Select One) *
                                </label>
                                <span className={cn(
                                  "text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-black uppercase tracking-wider",
                                  newQuizForm.isPaid 
                                    ? "bg-amber-500/15 text-amber-400 border-amber-500/30" 
                                    : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                )}>
                                  Mode: {newQuizForm.isPaid ? "Paid Challenge" : "100% Free Quiz"}
                                </span>
                              </div>

                              {/* Two Distinct Clickable Option Cards for Admin */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Option 1: FREE QUIZ / CHALLENGE */}
                                <div 
                                  onClick={() => setNewQuizForm({ ...newQuizForm, isPaid: false, price: 0 })}
                                  className={cn(
                                    "p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group select-none",
                                    !newQuizForm.isPaid
                                      ? "bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/30"
                                      : "bg-surface hover:bg-surface/80 border-black/10 dark:border-white/10 hover:border-emerald-500/40 opacity-80 hover:opacity-100"
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <div className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0",
                                        !newQuizForm.isPaid
                                          ? "bg-emerald-500 text-black shadow-md"
                                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                      )}>
                                        <Zap size={18} />
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <h4 className={cn(
                                            "text-sm font-black uppercase tracking-tight",
                                            !newQuizForm.isPaid ? "text-emerald-400" : "text-text-main"
                                          )}>
                                            Option 1: Free Quiz
                                          </h4>
                                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-black border border-emerald-500/30">
                                            100% FREE
                                          </span>
                                        </div>
                                        <p className="text-[11px] font-mono text-emerald-400/90 font-bold mt-0.5">
                                          Open Access for All Students
                                        </p>
                                      </div>
                                    </div>
                                    <div className={cn(
                                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 mt-0.5",
                                      !newQuizForm.isPaid
                                        ? "border-emerald-400 bg-emerald-500"
                                        : "border-black/30 dark:border-white/30"
                                    )}>
                                      {!newQuizForm.isPaid && <div className="w-2 h-2 rounded-full bg-black" />}
                                    </div>
                                  </div>

                                  <p className="text-xs text-text-muted leading-relaxed">
                                    Completely free for all students. No registration fee, UPI QR payment, or manual UTR approval required. Instant enrollment for practice or open challenge.
                                  </p>

                                  <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-mono">
                                    <span className="text-emerald-400 font-black">Entry Fee: ₹0 (Free)</span>
                                    <span className="text-text-muted">No UTR Verification Required</span>
                                  </div>
                                </div>

                                {/* Option 2: PAID CHALLENGE */}
                                <div 
                                  onClick={() => setNewQuizForm({ 
                                    ...newQuizForm, 
                                    isPaid: true, 
                                    price: newQuizForm.price > 0 ? newQuizForm.price : 49,
                                    upiId: newQuizForm.upiId || 'forenclue@okaxis',
                                    payeeName: newQuizForm.payeeName || 'ForenClue Forensic Services'
                                  })}
                                  className={cn(
                                    "p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group select-none",
                                    newQuizForm.isPaid
                                      ? "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/30"
                                      : "bg-surface hover:bg-surface/80 border-black/10 dark:border-white/10 hover:border-amber-500/40 opacity-80 hover:opacity-100"
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                      <div className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0",
                                        newQuizForm.isPaid
                                          ? "bg-amber-500 text-black shadow-md"
                                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                      )}>
                                        <Trophy size={18} />
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <h4 className={cn(
                                            "text-sm font-black uppercase tracking-tight",
                                            newQuizForm.isPaid ? "text-amber-400" : "text-text-main"
                                          )}>
                                            Option 2: Paid Challenge
                                          </h4>
                                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-black border border-amber-500/30">
                                            PAID & PRIZES
                                          </span>
                                        </div>
                                        <p className="text-[11px] font-mono text-amber-400/90 font-bold mt-0.5">
                                          Advance UPI Fee & UTR Approval
                                        </p>
                                      </div>
                                    </div>
                                    <div className={cn(
                                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 mt-0.5",
                                      newQuizForm.isPaid
                                        ? "border-amber-400 bg-amber-500"
                                        : "border-black/30 dark:border-white/30"
                                    )}>
                                      {newQuizForm.isPaid && <div className="w-2 h-2 rounded-full bg-black" />}
                                    </div>
                                  </div>

                                  <p className="text-xs text-text-muted leading-relaxed">
                                    Competitive challenge requiring advance candidate payment via dynamic UPI QR, 12-digit UTR submission, and admin approval with cash prize payouts.
                                  </p>

                                  <div className="pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-mono">
                                    <span className="text-amber-400 font-black">Entry Fee: ₹{newQuizForm.price || 49}</span>
                                    <span className="text-amber-400/90 font-black">Top 3 Cash Prizes</span>
                                  </div>
                                </div>
                              </div>

                              {/* FREE MODE CONFIRMATION BANNER */}
                              {!newQuizForm.isPaid && (
                                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                    <CheckCircle2 size={18} />
                                  </div>
                                  <div className="text-xs">
                                    <p className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                      <span>✓ Free Quiz Access Active</span>
                                      <span className="text-[10px] bg-emerald-500/15 px-2 py-0.2 rounded font-mono">No Fees</span>
                                    </p>
                                    <p className="text-text-muted mt-0.5 leading-relaxed">
                                      All candidates can enroll and attempt this quiz freely without paying any fee or submitting a UTR transaction number.
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* PAID CHALLENGE CONFIGURATION PANEL */}
                              {newQuizForm.isPaid && (
                                <div className="bg-amber-500/5 border border-amber-500/30 rounded-2xl p-5 space-y-4">
                                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                                    <div className="flex items-center gap-2">
                                      <Trophy size={16} className="text-amber-400" />
                                      <span className="text-xs font-black uppercase text-amber-400">
                                        Paid Challenge Setup & UPI Payout Details
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">
                                      Admin UTR Review Enabled
                                    </span>
                                  </div>

                                  <div className="space-y-4 pt-1">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                      <div>
                                        <label className="block text-[10px] font-mono text-amber-300 uppercase mb-1 font-bold">
                                          Candidate Entry Fee (INR ₹) *
                                        </label>
                                        <input
                                          type="number"
                                          min={1}
                                          value={newQuizForm.price}
                                          onChange={(e) => setNewQuizForm({ ...newQuizForm, price: Number(e.target.value) })}
                                          placeholder="49"
                                          className="w-full bg-base border border-amber-500/30 rounded-xl p-2.5 text-xs font-bold text-amber-400 outline-none"
                                          required={newQuizForm.isPaid}
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-mono text-amber-300 uppercase mb-1 font-bold">
                                          UPI ID for Candidate Payment *
                                        </label>
                                        <input
                                          type="text"
                                          value={newQuizForm.upiId}
                                          onChange={(e) => setNewQuizForm({ ...newQuizForm, upiId: e.target.value })}
                                          placeholder="forenclue@okaxis"
                                          className="w-full bg-base border border-amber-500/30 rounded-xl p-2.5 text-xs font-bold text-text-main outline-none"
                                          required={newQuizForm.isPaid}
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-mono text-amber-300 uppercase mb-1 font-bold">
                                          Payee Display Name *
                                        </label>
                                        <input
                                          type="text"
                                          value={newQuizForm.payeeName}
                                          onChange={(e) => setNewQuizForm({ ...newQuizForm, payeeName: e.target.value })}
                                          placeholder="ForenClue Forensic Services"
                                          className="w-full bg-base border border-amber-500/30 rounded-xl p-2.5 text-xs font-bold text-text-main outline-none"
                                          required={newQuizForm.isPaid}
                                        />
                                      </div>
                                    </div>

                                    {/* Cash Prize Pool Distribution */}
                                    <div className="bg-black/30 border border-amber-500/20 rounded-xl p-4 space-y-3">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase text-amber-400 flex items-center gap-1.5">
                                          <Award size={14} /> Leaderboard Cash Prize Distribution
                                        </span>
                                        <span className="text-xs font-mono font-black text-warning">
                                          Total Prize Pool: ₹{(Number(newQuizForm.firstPrize) || 0) + (Number(newQuizForm.secondPrize) || 0) + (Number(newQuizForm.thirdPrize) || 0)}
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="bg-surface/80 p-3 rounded-xl border border-amber-500/20">
                                          <label className="block text-[10px] font-mono text-amber-400 uppercase font-bold mb-1">
                                            🥇 1st Rank Prize (₹)
                                          </label>
                                          <input
                                            type="number"
                                            min={0}
                                            value={newQuizForm.firstPrize}
                                            onChange={(e) => setNewQuizForm({ ...newQuizForm, firstPrize: Number(e.target.value) })}
                                            placeholder="300"
                                            className="w-full bg-base border border-amber-500/30 rounded-lg p-2 text-xs font-black font-mono text-white outline-none"
                                          />
                                        </div>

                                        <div className="bg-surface/80 p-3 rounded-xl border border-amber-500/20">
                                          <label className="block text-[10px] font-mono text-slate-300 uppercase font-bold mb-1">
                                            🥈 2nd Rank Prize (₹)
                                          </label>
                                          <input
                                            type="number"
                                            min={0}
                                            value={newQuizForm.secondPrize}
                                            onChange={(e) => setNewQuizForm({ ...newQuizForm, secondPrize: Number(e.target.value) })}
                                            placeholder="200"
                                            className="w-full bg-base border border-white/20 rounded-lg p-2 text-xs font-black font-mono text-white outline-none"
                                          />
                                        </div>

                                        <div className="bg-surface/80 p-3 rounded-xl border border-amber-500/20">
                                          <label className="block text-[10px] font-mono text-amber-600 uppercase font-bold mb-1">
                                            🥉 3rd Rank Prize (₹)
                                          </label>
                                          <input
                                            type="number"
                                            min={0}
                                            value={newQuizForm.thirdPrize}
                                            onChange={(e) => setNewQuizForm({ ...newQuizForm, thirdPrize: Number(e.target.value) })}
                                            placeholder="100"
                                            className="w-full bg-base border border-amber-600/30 rounded-lg p-2 text-xs font-black font-mono text-white outline-none"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Registration Window Timing */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                      <div>
                                        <label className="block text-[10px] font-mono text-text-muted uppercase mb-1 font-bold">
                                          Registrations Open (e.g. 1 Week Advance)
                                        </label>
                                        <input
                                          type="datetime-local"
                                          value={newQuizForm.registrationStartTime}
                                          onChange={(e) => setNewQuizForm({ ...newQuizForm, registrationStartTime: e.target.value })}
                                          className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-2.5 text-xs text-text-main outline-none"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[10px] font-mono text-text-muted uppercase mb-1 font-bold">
                                          Registrations Close (e.g. 2 Hours Before Start)
                                        </label>
                                        <input
                                          type="datetime-local"
                                          value={newQuizForm.registrationEndTime}
                                          onChange={(e) => setNewQuizForm({ ...newQuizForm, registrationEndTime: e.target.value })}
                                          className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-2.5 text-xs text-text-main outline-none"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* ANTI-CHEAT & INTEGRITY CONTROLS */}
                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 space-y-3">
                              <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                                <ShieldCheck size={16} /> Anti-Cheat & Examination Integrity Settings
                              </h3>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                <label className="flex items-center gap-2 bg-surface/60 p-3 rounded-xl border border-white/5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={newQuizForm.shuffleQuestions}
                                    onChange={(e) => setNewQuizForm({ ...newQuizForm, shuffleQuestions: e.target.checked })}
                                    className="w-4 h-4 text-blue-500"
                                  />
                                  <div>
                                    <span className="text-xs font-bold text-text-main block">Shuffle Questions</span>
                                    <span className="text-[10px] text-text-muted">Randomizes order for every candidate</span>
                                  </div>
                                </label>

                                <label className="flex items-center gap-2 bg-surface/60 p-3 rounded-xl border border-white/5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={newQuizForm.shuffleOptions}
                                    onChange={(e) => setNewQuizForm({ ...newQuizForm, shuffleOptions: e.target.checked })}
                                    className="w-4 h-4 text-blue-500"
                                  />
                                  <div>
                                    <span className="text-xs font-bold text-text-main block">Shuffle Choices (A/B/C/D)</span>
                                    <span className="text-[10px] text-text-muted">Prevents adjacent-device copy cheating</span>
                                  </div>
                                </label>

                                <label className="flex items-center gap-2 bg-surface/60 p-3 rounded-xl border border-white/5 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={newQuizForm.enableTabSwitchDetection}
                                    onChange={(e) => setNewQuizForm({ ...newQuizForm, enableTabSwitchDetection: e.target.checked })}
                                    className="w-4 h-4 text-blue-500"
                                  />
                                  <div>
                                    <span className="text-xs font-bold text-text-main block">Tab-Switch Detection</span>
                                    <span className="text-[10px] text-text-muted">Auto-submits after 3 blur violations</span>
                                  </div>
                                </label>
                              </div>
                            </div>

                            {/* MANUAL QUESTIONS BUILDER SECTION */}
                            <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-6">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/50 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                                <div>
                                  <h3 className="text-sm font-heading font-black uppercase tracking-wider text-text-main flex items-center gap-2">
                                    <HelpCircle size={16} className="text-warning" /> Challenge Questions ({quizQuestions.length})
                                  </h3>
                                  <p className="text-[11px] text-text-muted mt-0.5">
                                    Total Points: <span className="font-mono font-bold text-warning">{quizQuestions.reduce((acc, q) => acc + (Number(q.points) || 0), 0)} pts</span>. Mark correct answers, attach crime scene diagrams, and provide rationales.
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleSetAllPoints(20)}
                                    className="px-3 py-1.5 bg-warning/10 hover:bg-warning/20 border border-warning/30 text-warning text-xs font-bold rounded-xl transition cursor-pointer"
                                  >
                                    Apply 20 Pts Each
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleAddQuestion}
                                    className="px-3 py-1.5 bg-warning text-crust text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <Plus size={14} /> Add Question
                                  </button>
                                </div>
                              </div>

                              <div className="space-y-6">
                                {quizQuestions.map((q, qIdx) => (
                                  <div key={q.id || qIdx} className="bg-base border border-black/10 dark:border-white/10 rounded-2xl p-5 relative shadow-sm">
                                    <div className="flex items-center justify-between mb-4 border-b border-black/5 dark:border-white/5 pb-3">
                                      <div className="flex items-center gap-2">
                                        <span className="w-7 h-7 rounded-full bg-warning/20 text-warning text-xs font-mono font-bold flex items-center justify-center">
                                          {qIdx + 1}
                                        </span>
                                        <span className="font-bold text-xs uppercase tracking-wider text-text-main">
                                          Question #{qIdx + 1}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-surface border border-black/10 dark:border-white/10 px-2.5 py-1 rounded-lg">
                                          <span className="text-[10px] text-text-muted font-mono uppercase">Points:</span>
                                          <input
                                            type="number"
                                            min={1}
                                            value={q.points || 20}
                                            onChange={(e) => handleQuestionChange(qIdx, 'points', Number(e.target.value))}
                                            className="w-12 bg-transparent text-xs font-bold font-mono text-warning outline-none text-right"
                                          />
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => handleDuplicateQuestion(qIdx)}
                                          className="p-1.5 text-text-muted hover:text-warning hover:bg-warning/10 rounded-lg transition"
                                          title="Duplicate this question"
                                        >
                                          <Copy size={14} />
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => handleRemoveQuestion(qIdx)}
                                          className="p-1.5 text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                          title="Remove Question"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </div>

                                    <div className="space-y-4">
                                      {/* Question Prompt */}
                                      <div>
                                        <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">
                                          Question Scenario / Statement *
                                        </label>
                                        <textarea
                                          value={q.question}
                                          onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                                          rows={2}
                                          placeholder="e.g. In crime scene photography, why must a photograph be taken with an ABFO #2 scale perpendicular to the plane of a bite mark?"
                                          className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                                          required
                                        />
                                      </div>

                                      {/* Crime Scene Diagram / Question Image (Direct Cloudflare R2 Bucket Upload) */}
                                      <div className="bg-surface/80 border border-black/10 dark:border-white/10 rounded-2xl p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                          <label className="text-[11px] font-mono font-bold text-text-main uppercase tracking-wider flex items-center gap-1.5">
                                            <ImageIcon size={14} className="text-warning" /> Crime Scene Diagram / Forensic Image
                                          </label>
                                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                                            <Sparkles size={10} /> R2 Bucket Storage
                                          </span>
                                        </div>

                                        {q.image ? (
                                          /* Attached Image Preview & Controls */
                                          <div className="space-y-3">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-base p-3 rounded-xl border border-black/10 dark:border-white/10">
                                              <div className="relative group shrink-0 w-32 h-24 sm:w-40 sm:h-28 bg-black/60 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 flex items-center justify-center">
                                                <ResilientImage 
                                                  src={q.image} 
                                                  alt={q.imageCaption || "Question diagram"} 
                                                  className="max-w-full max-h-full object-contain" 
                                                  fallbackText="Diagram Error"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={async () => {
                                                    const resolved = await resolveFileUrl(q.image);
                                                    if (resolved) {
                                                      window.open(resolved, '_blank');
                                                    }
                                                  }}
                                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-1 cursor-pointer backdrop-blur-[1px]"
                                                >
                                                  <Eye size={12} /> View Full
                                                </button>
                                              </div>

                                              <div className="flex-1 min-w-0 space-y-2 w-full">
                                                <div className="flex items-center justify-between gap-2">
                                                  <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1 truncate">
                                                    <CheckCircle2 size={13} className="shrink-0" />
                                                    {q.image.startsWith('localdb://')
                                                      ? 'Diagram Stored Locally'
                                                      : q.image.startsWith('firestore-blob://')
                                                        ? 'Diagram Stored in Cloud Storage'
                                                        : 'Diagram Stored in R2'}
                                                  </span>
                                                  <button
                                                    type="button"
                                                    onClick={() => handleRemoveQuestionImage(qIdx)}
                                                    className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                                                    title="Remove Diagram"
                                                  >
                                                    <Trash2 size={11} /> Remove
                                                  </button>
                                                </div>

                                                <div className="text-[10px] font-mono text-text-muted truncate bg-surface px-2.5 py-1.5 rounded-lg border border-black/5 dark:border-white/5 select-all">
                                                  {q.image}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                  {/* Replace file directly */}
                                                  <label className="cursor-pointer px-2.5 py-1 bg-warning/10 hover:bg-warning/20 border border-warning/30 text-warning rounded-lg text-[10px] font-bold transition flex items-center gap-1">
                                                    <Upload size={11} /> Replace in R2
                                                    <input
                                                      type="file"
                                                      accept="image/*"
                                                      onChange={(e) => handleQuestionImageUploadDirect(qIdx, e)}
                                                      disabled={uploadingQuestionImages[qIdx]}
                                                      className="hidden"
                                                    />
                                                  </label>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Diagram Caption */}
                                            <div>
                                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">
                                                Diagram Caption / Label (Optional - displayed under the image)
                                              </label>
                                              <input
                                                type="text"
                                                value={q.imageCaption || ''}
                                                onChange={(e) => handleQuestionChange(qIdx, 'imageCaption', e.target.value)}
                                                placeholder="e.g. Figure 1: 1:1 Scale comparison of fracture edges / friction ridges"
                                                className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-2.5 text-xs text-text-main outline-none focus:border-warning"
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          /* Direct R2 Upload Box & URL Option */
                                          <div className="space-y-3">
                                            <div className="border-2 border-dashed border-warning/30 hover:border-warning/60 bg-base/60 hover:bg-base rounded-xl p-4 text-center transition">
                                              <input
                                                type="file"
                                                id={`question-img-upload-${qIdx}`}
                                                accept="image/*"
                                                onChange={(e) => handleQuestionImageUploadDirect(qIdx, e)}
                                                disabled={uploadingQuestionImages[qIdx]}
                                                className="hidden"
                                              />
                                              <label 
                                                htmlFor={`question-img-upload-${qIdx}`}
                                                className="cursor-pointer flex flex-col items-center justify-center gap-2"
                                              >
                                                {uploadingQuestionImages[qIdx] ? (
                                                  <div className="flex items-center gap-2 text-warning text-xs font-bold py-2">
                                                    <Loader2 size={18} className="animate-spin" />
                                                    <span>{questionImageUploadMsgs[qIdx] || 'Uploading diagram to Cloudflare R2 bucket...'}</span>
                                                  </div>
                                                ) : (
                                                  <>
                                                    <div className="w-10 h-10 rounded-full bg-warning/15 text-warning flex items-center justify-center shadow-inner">
                                                      <Upload size={18} />
                                                    </div>
                                                    <div>
                                                      <span className="text-xs font-bold text-text-main block">
                                                        Upload Diagram / Photo to Cloudflare R2
                                                      </span>
                                                      <span className="text-[10px] text-text-muted">
                                                        Supports PNG, JPG, WEBP, SVG diagrams, photomacrographs, and evidence sketches
                                                      </span>
                                                    </div>
                                                  </>
                                                )}
                                              </label>
                                            </div>

                                            {questionImageUploadMsgs[qIdx] && !uploadingQuestionImages[qIdx] && (
                                              <p className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                                                {questionImageUploadMsgs[qIdx]}
                                              </p>
                                            )}
                                            {questionImageErrors[qIdx] && (
                                              <p className="text-[11px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg flex items-center gap-1.5">
                                                <AlertCircle size={13} /> {questionImageErrors[qIdx]}
                                              </p>
                                            )}

                                            {/* Direct URL input as alternative */}
                                            <div className="pt-1">
                                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">
                                                Or Enter Direct Image / Diagram URL:
                                              </label>
                                              <input
                                                type="url"
                                                value={q.image || ''}
                                                onChange={(e) => handleQuestionChange(qIdx, 'image', e.target.value)}
                                                placeholder="https://pub-...r2.dev/quiz-diagrams/... or https://..."
                                                className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-2.5 text-xs text-text-muted outline-none focus:text-text-main focus:border-warning"
                                              />
                                            </div>

                                            <div>
                                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">
                                                Diagram Caption / Label (Optional)
                                              </label>
                                              <input
                                                type="text"
                                                value={q.imageCaption || ''}
                                                onChange={(e) => handleQuestionChange(qIdx, 'imageCaption', e.target.value)}
                                                placeholder="e.g. Figure 1: ABFO Scale with bite mark indentation"
                                                className="w-full bg-base border border-black/10 dark:border-white/10 rounded-xl p-2.5 text-xs text-text-main outline-none focus:border-warning"
                                              />
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Answer Choices */}
                                      <div>
                                        <div className="flex items-center justify-between mb-2">
                                          <label className="text-[10px] font-mono text-text-muted uppercase">
                                            Answer Choices (Click letter icon to mark the scientifically correct answer)
                                          </label>
                                          <button
                                            type="button"
                                            onClick={() => handleAddOption(qIdx)}
                                            className="text-[10px] font-bold text-warning hover:underline flex items-center gap-1 cursor-pointer"
                                          >
                                            <Plus size={12} /> Add Choice
                                          </button>
                                        </div>

                                        <div className="space-y-2">
                                          {q.options.map((opt, optIdx) => {
                                            const isCorrect = q.correctAnswerIndex === optIdx;
                                            return (
                                              <div
                                                key={optIdx}
                                                className={cn(
                                                  "flex items-center gap-2 p-2 rounded-xl border transition-all",
                                                  isCorrect
                                                    ? "bg-emerald-500/10 border-emerald-500/40 text-text-main"
                                                    : "bg-surface border-black/10 dark:border-white/10"
                                                )}
                                              >
                                                <button
                                                  type="button"
                                                  onClick={() => handleQuestionChange(qIdx, 'correctAnswerIndex', optIdx)}
                                                  className={cn(
                                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black transition-all cursor-pointer",
                                                    isCorrect
                                                      ? "bg-emerald-500 text-crust shadow-sm"
                                                      : "border border-black/20 dark:border-white/20 text-text-muted hover:border-warning"
                                                  )}
                                                  title={isCorrect ? "Correct Answer" : "Click to set as Correct Answer"}
                                                >
                                                  {isCorrect ? <Check size={14} /> : String.fromCharCode(65 + optIdx)}
                                                </button>

                                                <input
                                                  type="text"
                                                  value={opt}
                                                  onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                                                  placeholder={`Option ${String.fromCharCode(65 + optIdx)}...`}
                                                  className="w-full bg-transparent text-xs font-medium text-text-main outline-none"
                                                  required
                                                />

                                                {isCorrect && (
                                                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                                                    Correct Answer
                                                  </span>
                                                )}

                                                {q.options.length > 2 && (
                                                  <button
                                                    type="button"
                                                    onClick={() => handleRemoveOption(qIdx, optIdx)}
                                                    className="p-1 text-text-muted hover:text-red-400 rounded transition shrink-0 cursor-pointer"
                                                    title="Remove Choice"
                                                  >
                                                    <Trash2 size={12} />
                                                  </button>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Explanation / Rationale */}
                                      <div>
                                        <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">
                                          Scientific Explanation / Forensic Rationale
                                        </label>
                                        <textarea
                                          value={q.explanation || ''}
                                          onChange={(e) => handleQuestionChange(qIdx, 'explanation', e.target.value)}
                                          rows={2}
                                          placeholder="e.g. Taking photos perpendicular to the scale prevents optical perspective distortion, enabling 1:1 forensic photomacrographic matching."
                                          className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl p-2.5 text-xs text-text-muted outline-none focus:text-text-main focus:border-warning"
                                        />
                                      </div>

                                      {/* Optional Guided Clue / Hint */}
                                      <div>
                                        <label className="block text-[10px] font-mono text-text-muted uppercase mb-1 flex items-center gap-1">
                                          <Lightbulb size={12} className="text-amber-400" /> Helpful Guided Clue / Hint (Optional)
                                        </label>
                                        <input
                                          type="text"
                                          value={q.hint || ''}
                                          onChange={(e) => handleQuestionChange(qIdx, 'hint', e.target.value)}
                                          placeholder="e.g. Focus on the scale alignment relative to the camera lens sensor plane."
                                          className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl p-2.5 text-xs text-text-muted outline-none focus:text-text-main focus:border-warning"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="flex items-center justify-center pt-2">
                                <button
                                  type="button"
                                  onClick={handleAddQuestion}
                                  className="w-full border-2 border-dashed border-warning/30 hover:border-warning/60 bg-warning/5 hover:bg-warning/10 p-3 rounded-2xl text-warning font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                  <Plus size={16} /> Add Another Question
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 pt-5 border-t border-black/10 dark:border-white/10 flex-wrap">
                              <div className="flex items-center gap-3 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => handleAdminSaveQuiz(undefined, 'draft')}
                                  className="px-5 py-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-400 font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-sm"
                                  title="Save in progress without publishing to students"
                                >
                                  <FileText size={16} /> Save as Draft
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleAdminSaveQuiz(undefined, 'published')}
                                  className="px-6 py-3 bg-warning text-crust hover:bg-warning/90 font-black rounded-xl text-xs uppercase tracking-widest transition flex items-center gap-2 cursor-pointer shadow-lg shadow-warning/10"
                                >
                                  <Award size={16} /> {editingQuizId && newQuizForm.status === 'published' ? "Update Published Challenge" : "Publish Quiz / Weekly Challenge"}
                                </button>
                              </div>

                              {editingQuizId && (
                                <button
                                  type="button"
                                  onClick={handleResetQuizForm}
                                  className="px-4 py-3 bg-base hover:bg-white/5 border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main font-bold rounded-xl text-xs uppercase tracking-widest transition cursor-pointer"
                                >
                                  Cancel Edit
                                </button>
                              )}
                            </div>
                          </form>
                        </div>
                      )}

                      {/* SUBTAB 2: UTR REGISTRATIONS & APPROVALS */}
                      {quizSubTab === 'approvals' && (
                        <div className="pt-6 space-y-6">
                          {/* Top Controls & Metrics */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-4 bg-base rounded-2xl border border-black/5 dark:border-white/5 text-center">
                              <span className="text-[10px] font-mono uppercase text-text-muted block">Total Registrations</span>
                              <span className="text-xl font-black text-text-main font-mono">{quizRegistrations.length}</span>
                            </div>
                            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-center">
                              <span className="text-[10px] font-mono uppercase text-amber-400 block font-bold">Pending Review</span>
                              <span className="text-xl font-black text-amber-400 font-mono">
                                {quizRegistrations.filter(r => r.status === 'pending').length}
                              </span>
                            </div>
                            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-center">
                              <span className="text-[10px] font-mono uppercase text-emerald-400 block font-bold">Approved</span>
                              <span className="text-xl font-black text-emerald-400 font-mono">
                                {quizRegistrations.filter(r => r.status === 'approved').length}
                              </span>
                            </div>
                            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-center">
                              <span className="text-[10px] font-mono uppercase text-rose-400 block font-bold">Rejected</span>
                              <span className="text-xl font-black text-rose-400 font-mono">
                                {quizRegistrations.filter(r => r.status === 'rejected').length}
                              </span>
                            </div>
                          </div>

                          {/* Filter & Search Bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-base p-3 rounded-2xl border border-black/5 dark:border-white/5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => setRegFilterStatus(st)}
                                  className={cn(
                                    "px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition cursor-pointer",
                                    regFilterStatus === st
                                      ? "bg-warning text-crust font-black"
                                      : "text-text-muted hover:text-text-main bg-surface/60"
                                  )}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="relative flex-1 sm:w-64">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                  type="text"
                                  value={regSearchTerm}
                                  onChange={(e) => setRegSearchTerm(e.target.value)}
                                  placeholder="Search UTR, student name, email..."
                                  className="w-full pl-9 pr-3 py-2 bg-surface border border-black/10 dark:border-white/10 rounded-xl text-xs text-text-main outline-none focus:border-warning"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => fetchRegistrationsList()}
                                className="p-2 bg-surface hover:bg-surface/80 border border-black/10 dark:border-white/10 rounded-xl text-text-muted hover:text-text-main transition"
                                title="Refresh registrations list"
                              >
                                <RefreshCw size={14} className={loadingRegistrations ? "animate-spin text-warning" : ""} />
                              </button>
                            </div>
                          </div>

                          {/* Registrations List */}
                          {loadingRegistrations ? (
                            <div className="py-12 text-center text-xs text-text-muted">Loading registrations...</div>
                          ) : (() => {
                            const filtered = quizRegistrations.filter(r => {
                              if (regFilterStatus !== 'all' && r.status !== regFilterStatus) return false;
                              if (regSearchTerm.trim()) {
                                const term = regSearchTerm.toLowerCase();
                                const matchUtr = r.utrNumber?.toLowerCase().includes(term);
                                const matchName = r.userName?.toLowerCase().includes(term);
                                const matchEmail = r.userEmail?.toLowerCase().includes(term);
                                const matchQuiz = r.quizTitle?.toLowerCase().includes(term);
                                if (!matchUtr && !matchName && !matchEmail && !matchQuiz) return false;
                              }
                              return true;
                            });

                            if (filtered.length === 0) {
                              return (
                                <div className="py-12 text-center bg-base rounded-2xl border border-black/5 dark:border-white/5 space-y-2">
                                  <CreditCard size={32} className="mx-auto text-text-muted/40" />
                                  <p className="text-xs text-text-muted font-bold">No registrations matching this filter.</p>
                                </div>
                              );
                            }

                            return (
                              <div className="space-y-3">
                                {filtered.map((reg) => (
                                  <div
                                    key={reg.id}
                                    className="bg-base border border-black/10 dark:border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-warning/30"
                                  >
                                    <div className="space-y-1.5 flex-1">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-black text-sm text-text-main">{reg.userName}</span>
                                        <span className="text-xs text-text-muted">({reg.userEmail})</span>
                                        <span className={cn(
                                          "text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-full",
                                          reg.status === 'approved'
                                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                            : reg.status === 'rejected'
                                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse"
                                        )}>
                                          {reg.status}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-3 text-xs text-text-muted flex-wrap">
                                        <span className="font-bold text-text-main">{reg.quizTitle}</span>
                                        <span>• Fee: <strong className="text-warning font-mono">₹{reg.amount}</strong></span>
                                        {reg.senderName && <span>• Sender: <strong>{reg.senderName}</strong></span>}
                                        <span>• Date: {new Date(reg.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                      </div>

                                      {/* UTR Pill with One-Click Copy */}
                                      <div className="pt-1 flex items-center gap-2">
                                        <span className="text-[10px] font-mono uppercase text-text-muted">12-Digit UTR:</span>
                                        <span className="font-mono font-bold text-xs bg-surface px-2.5 py-1 rounded-lg border border-black/10 dark:border-white/10 text-amber-400 tracking-wider">
                                          {reg.utrNumber}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            navigator.clipboard.writeText(reg.utrNumber);
                                            setSuccessMsg(`Copied UTR: ${reg.utrNumber}`);
                                          }}
                                          className="p-1 hover:text-warning text-text-muted transition cursor-pointer"
                                          title="Copy UTR Number"
                                        >
                                          <Copy size={13} />
                                        </button>
                                      </div>

                                      {reg.rejectReason && (
                                        <p className="text-[11px] text-rose-400 font-mono mt-1">
                                          Rejection Reason: {reg.rejectReason}
                                        </p>
                                      )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 shrink-0">
                                      {reg.status !== 'approved' && (
                                        <button
                                          type="button"
                                          disabled={approvingRegId === reg.id}
                                          onClick={() => handleApproveRegistrationAction(reg)}
                                          className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-crust font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
                                        >
                                          <CheckCircle2 size={14} /> Approve & Unlock
                                        </button>
                                      )}

                                      {reg.status === 'pending' && (
                                        <button
                                          type="button"
                                          disabled={approvingRegId === reg.id}
                                          onClick={() => handleRejectRegistrationAction(reg)}
                                          className="px-3 py-2 bg-surface hover:bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                                        >
                                          Reject
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {/* SUBTAB 3: PRIZE & WINNER AUDIT */}
                      {quizSubTab === 'audit' && (
                        <div className="pt-6 space-y-6">
                          {/* Quiz Selector */}
                          <div className="bg-base p-4 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <label className="block text-[10px] font-mono text-text-muted uppercase mb-1">
                                Select Challenge to Audit for Cash Prizes
                              </label>
                              <select
                                value={auditQuizId}
                                onChange={(e) => handleAuditQuiz(e.target.value)}
                                className="bg-surface border border-black/10 dark:border-white/10 rounded-xl p-2.5 text-xs font-bold text-text-main outline-none min-w-[280px]"
                              >
                                <option value="">-- Choose Quiz / Challenge --</option>
                                {adminQuizzes.map(q => (
                                  <option key={q.id} value={q.id}>
                                    {q.title} {q.isPaid ? '• [Paid]' : ''} ({q.questions?.length || 0} Qs)
                                  </option>
                                ))}
                              </select>
                            </div>

                            {auditQuizId && (
                              <button
                                type="button"
                                onClick={() => handleAuditQuiz(auditQuizId)}
                                className="px-3 py-2 bg-surface hover:bg-surface/80 border border-black/10 dark:border-white/10 rounded-xl text-xs font-bold text-text-main transition flex items-center gap-1.5"
                              >
                                <RefreshCw size={14} className={loadingAudit ? "animate-spin text-warning" : ""} /> Refresh Audit
                              </button>
                            )}
                          </div>

                          {/* Audit Leaderboard Display */}
                          {loadingAudit ? (
                            <div className="py-12 text-center text-xs text-text-muted">Loading candidate attempts & ranking for audit...</div>
                          ) : !auditQuizId ? (
                            <div className="py-12 text-center bg-base rounded-2xl border border-black/5 dark:border-white/5 space-y-2">
                              <Trophy size={32} className="mx-auto text-amber-400/40" />
                              <p className="text-xs text-text-muted font-bold">Select a challenge above to audit top 3 winners.</p>
                            </div>
                          ) : (
                            <div className="space-y-6">
                              {/* Top 3 Podium Winners Card */}
                              {(() => {
                                const selectedQuiz = adminQuizzes.find(q => q.id === auditQuizId);
                                const firstPrize = selectedQuiz?.prizes?.first ?? 300;
                                const secondPrize = selectedQuiz?.prizes?.second ?? 200;
                                const thirdPrize = selectedQuiz?.prizes?.third ?? 100;
                                const top3 = auditLeaderboard.slice(0, 3);

                                return (
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <h3 className="text-sm font-black uppercase tracking-wider text-text-main flex items-center gap-2">
                                        <Trophy size={16} className="text-amber-400" /> Official Winners & Cash Prize Awards
                                      </h3>
                                      <span className="text-xs font-mono font-bold text-amber-400">
                                        Total Prize Money: ₹{firstPrize + secondPrize + thirdPrize}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      {/* Rank 1 */}
                                      <div className="bg-gradient-to-b from-amber-500/10 to-surface border border-amber-500/40 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-lg">
                                        <div className="flex items-center justify-between">
                                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                            🥇 1st Rank Award
                                          </span>
                                          <span className="text-sm font-black font-mono text-warning">₹{firstPrize}</span>
                                        </div>
                                        {top3[0] ? (
                                          <div className="space-y-1">
                                            <p className="text-base font-black text-text-main">{top3[0].userName}</p>
                                            <p className="text-xs text-text-muted">{top3[0].userEmail}</p>
                                            <div className="pt-2 flex items-center justify-between text-xs border-t border-white/5 font-mono">
                                              <span className="text-warning font-bold">{top3[0].score} PTS</span>
                                              <span className="text-text-muted">{Math.floor(top3[0].timeTakenSeconds / 60)}m {top3[0].timeTakenSeconds % 60}s</span>
                                              <span className="text-emerald-400 font-bold">{top3[0].accuracyPercentage}% Acc</span>
                                            </div>
                                          </div>
                                        ) : (
                                          <p className="text-xs text-text-muted py-4">No completed attempt recorded yet.</p>
                                        )}
                                      </div>

                                      {/* Rank 2 */}
                                      <div className="bg-gradient-to-b from-slate-400/10 to-surface border border-slate-400/30 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-lg">
                                        <div className="flex items-center justify-between">
                                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-400/20 text-slate-300 border border-slate-400/30">
                                            🥈 2nd Rank Award
                                          </span>
                                          <span className="text-sm font-black font-mono text-slate-300">₹{secondPrize}</span>
                                        </div>
                                        {top3[1] ? (
                                          <div className="space-y-1">
                                            <p className="text-base font-black text-text-main">{top3[1].userName}</p>
                                            <p className="text-xs text-text-muted">{top3[1].userEmail}</p>
                                            <div className="pt-2 flex items-center justify-between text-xs border-t border-white/5 font-mono">
                                              <span className="text-warning font-bold">{top3[1].score} PTS</span>
                                              <span className="text-text-muted">{Math.floor(top3[1].timeTakenSeconds / 60)}m {top3[1].timeTakenSeconds % 60}s</span>
                                              <span className="text-emerald-400 font-bold">{top3[1].accuracyPercentage}% Acc</span>
                                            </div>
                                          </div>
                                        ) : (
                                          <p className="text-xs text-text-muted py-4">No completed attempt recorded yet.</p>
                                        )}
                                      </div>

                                      {/* Rank 3 */}
                                      <div className="bg-gradient-to-b from-amber-700/10 to-surface border border-amber-700/30 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-lg">
                                        <div className="flex items-center justify-between">
                                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-700/20 text-amber-500 border border-amber-700/30">
                                            🥉 3rd Rank Award
                                          </span>
                                          <span className="text-sm font-black font-mono text-amber-500">₹{thirdPrize}</span>
                                        </div>
                                        {top3[2] ? (
                                          <div className="space-y-1">
                                            <p className="text-base font-black text-text-main">{top3[2].userName}</p>
                                            <p className="text-xs text-text-muted">{top3[2].userEmail}</p>
                                            <div className="pt-2 flex items-center justify-between text-xs border-t border-white/5 font-mono">
                                              <span className="text-warning font-bold">{top3[2].score} PTS</span>
                                              <span className="text-text-muted">{Math.floor(top3[2].timeTakenSeconds / 60)}m {top3[2].timeTakenSeconds % 60}s</span>
                                              <span className="text-emerald-400 font-bold">{top3[2].accuracyPercentage}% Acc</span>
                                            </div>
                                          </div>
                                        ) : (
                                          <p className="text-xs text-text-muted py-4">No completed attempt recorded yet.</p>
                                        )}
                                      </div>
                                    </div>

                                    {/* Audit Guidelines Notice */}
                                    <div className="p-4 rounded-2xl bg-base border border-black/5 dark:border-white/5 text-xs text-text-muted space-y-1.5">
                                      <p className="font-bold text-text-main flex items-center gap-1.5">
                                        <ShieldCheck size={14} className="text-warning" /> Forensic Challenge Prize Audit Guidelines
                                      </p>
                                      <p className="text-[11px] leading-relaxed">
                                        1. Verify that completion time is realistic (&gt; 3–5 minutes for 25 questions).<br/>
                                        2. Ensure the candidate took the test in official live challenge mode rather than practice.<br/>
                                        3. Contact the top 3 winners directly at their registered email to disburse their ₹300, ₹200, and ₹100 cash prize payouts via UPI.
                                      </p>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      )}

                      {/* SUBTAB 4: ALL QUIZZES & DRAFTS LIST */}
                      {quizSubTab === 'list' && (
                        <div className="pt-6 space-y-4">
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <div>
                              <h3 className="text-sm font-black uppercase tracking-wider text-text-main flex items-center gap-2">
                                <ClipboardList size={16} className="text-warning" /> Quizzes & Drafts ({adminQuizzes.length})
                              </h3>
                              <p className="text-xs text-text-muted mt-0.5">
                                Manage published challenges and resume in-progress drafts.
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Filter buttons */}
                              <div className="flex items-center bg-base p-1 rounded-xl border border-black/10 dark:border-white/10 text-[11px] font-mono flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => setQuizListFilter('all')}
                                  className={cn(
                                    "px-2.5 py-1 rounded-lg font-bold transition",
                                    quizListFilter === 'all' ? "bg-surface text-text-main shadow-sm" : "text-text-muted hover:text-text-main"
                                  )}
                                >
                                  All ({adminQuizzes.length})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setQuizListFilter('published')}
                                  className={cn(
                                    "px-2.5 py-1 rounded-lg font-bold transition",
                                    quizListFilter === 'published' ? "bg-emerald-500/20 text-emerald-400 shadow-sm" : "text-text-muted hover:text-text-main"
                                  )}
                                >
                                  Published ({adminQuizzes.filter(q => q.status !== 'draft').length})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setQuizListFilter('drafts')}
                                  className={cn(
                                    "px-2.5 py-1 rounded-lg font-bold transition",
                                    quizListFilter === 'drafts' ? "bg-amber-500/20 text-amber-400 shadow-sm" : "text-text-muted hover:text-text-main"
                                  )}
                                >
                                  Drafts ({adminQuizzes.filter(q => q.status === 'draft').length})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setQuizListFilter('free')}
                                  className={cn(
                                    "px-2.5 py-1 rounded-lg font-bold transition",
                                    quizListFilter === 'free' ? "bg-emerald-500/20 text-emerald-400 shadow-sm" : "text-text-muted hover:text-text-main"
                                  )}
                                >
                                  Free ({adminQuizzes.filter(q => !q.isPaid).length})
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setQuizListFilter('paid')}
                                  className={cn(
                                    "px-2.5 py-1 rounded-lg font-bold transition",
                                    quizListFilter === 'paid' ? "bg-amber-500/20 text-amber-400 shadow-sm" : "text-text-muted hover:text-text-main"
                                  )}
                                >
                                  Paid ({adminQuizzes.filter(q => q.isPaid).length})
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  handleResetQuizForm();
                                  setQuizSubTab('editor');
                                }}
                                className="px-3 py-1.5 bg-warning text-crust font-black text-xs uppercase rounded-xl transition flex items-center gap-1 cursor-pointer"
                              >
                                <Plus size={14} /> Create New
                              </button>
                            </div>
                          </div>

                          {adminQuizzes.length === 0 ? (
                            <div className="py-8 text-center text-xs text-text-muted">No quizzes or drafts available in database.</div>
                          ) : (
                            <div className="space-y-3">
                              {adminQuizzes
                                .filter(q => {
                                  if (quizListFilter === 'published') return q.status !== 'draft';
                                  if (quizListFilter === 'drafts') return q.status === 'draft';
                                  if (quizListFilter === 'free') return !q.isPaid;
                                  if (quizListFilter === 'paid') return q.isPaid;
                                  return true;
                                })
                                .map((q) => (
                                <div key={q.id} className={cn(
                                  "p-4 bg-base border rounded-xl flex items-center justify-between gap-4 flex-wrap transition",
                                  q.status === 'draft' ? "border-amber-500/30 bg-amber-500/[0.03]" : "border-black/5 dark:border-white/5"
                                )}>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h3 className="font-bold text-sm text-text-main">{q.title}</h3>
                                      {q.status === 'draft' ? (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1 font-mono">
                                          <FileText size={10} /> Draft (In Progress)
                                        </span>
                                      ) : (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
                                          <CheckCircle2 size={10} /> Published
                                        </span>
                                      )}
                                      {q.isWeeklyChallenge && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/20 text-amber-400">
                                          Weekly Challenge
                                        </span>
                                      )}
                                      {q.isPaid ? (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-warning/20 text-warning font-mono border border-warning/30">
                                          ₹{q.price || 49} Paid Challenge
                                        </span>
                                      ) : (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">
                                          100% Free
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-xs text-text-muted flex-wrap">
                                      <span>{q.category}</span>
                                      <span>• {q.durationMinutes} mins</span>
                                      <span>• {q.questions?.length || 0} Questions</span>
                                      <span>• {q.totalPoints || 0} Points</span>
                                      {q.status !== 'draft' && (
                                        <button
                                          type="button"
                                          onClick={() => handleViewEnrolledUsers(q)}
                                          className="text-emerald-400 hover:text-emerald-300 font-mono font-bold flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-0.5 rounded-lg border border-emerald-500/20 transition cursor-pointer"
                                          title="Click to view enrolled candidates"
                                        >
                                          <Users size={12} /> {q.enrolledUserIds?.length || 0} Enrolled
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    {q.status === 'draft' ? (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleEditQuiz(q);
                                            setQuizSubTab('editor');
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                          }}
                                          className="px-3 py-2 border border-amber-500/40 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                                          title="Resume editing this draft"
                                        >
                                          <Edit3 size={14} /> Resume & Edit Draft
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleToggleQuizPublish(q)}
                                          className="px-3 py-2 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                                          title="Publish quiz immediately to students"
                                        >
                                          <Award size={14} /> Publish Now
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => handleViewEnrolledUsers(q)}
                                          className="p-2 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500/10 flex items-center gap-1.5 cursor-pointer transition"
                                          title="View enrolled candidates"
                                        >
                                          <Users size={14} /> Enrolled ({q.enrolledUserIds?.length || 0})
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setAuditQuizId(q.id);
                                            handleAuditQuiz(q.id);
                                            setQuizSubTab('audit');
                                          }}
                                          className="p-2 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-lg hover:bg-amber-500/10 flex items-center gap-1 cursor-pointer"
                                          title="Audit top 3 winners"
                                        >
                                          <Trophy size={14} /> Audit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            handleEditQuiz(q);
                                            setQuizSubTab('editor');
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                          }}
                                          className="p-2 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-500/10 flex items-center gap-1 cursor-pointer"
                                          title="Edit quiz"
                                        >
                                          <Edit3 size={14} /> Edit
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleToggleQuizPublish(q)}
                                          className="p-2 border border-black/10 dark:border-white/10 text-text-muted hover:text-amber-400 text-xs font-bold rounded-lg hover:bg-white/5 flex items-center gap-1 cursor-pointer"
                                          title="Unpublish and revert to Draft to make revisions privately"
                                        >
                                          <FileText size={14} /> Unpublish
                                        </button>
                                        <Link
                                          to={`/quizzes/${q.id}/leaderboard`}
                                          className="px-3 py-2 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-lg hover:bg-amber-500/10 flex items-center gap-1"
                                        >
                                          Leaderboard
                                        </Link>
                                      </>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => handleAdminDeleteQuiz(q.id)}
                                      className="p-2 border border-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/10 cursor-pointer"
                                      title="Delete Quiz"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* 10. COLLEGES & UNIVERSITIES DIRECTORY MANAGER */}
                {activeTab === 'colleges' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    
                    {/* Header */}
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-heading font-black uppercase tracking-tight text-text-main flex items-center gap-2">
                          <Building2 size={22} className="text-warning" /> Colleges & Universities Directory Manager
                        </h2>
                        <p className="text-xs text-text-muted mt-1">
                          Add, edit, or update forensic science colleges, universities, and courses offered across the globe.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {editingCollegeId && (
                          <button
                            onClick={handleResetCollegeForm}
                            className="px-4 py-2 border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main rounded-xl text-xs font-bold transition-colors"
                          >
                            Cancel Editing
                          </button>
                        )}
                        <button
                          onClick={fetchCollections}
                          className="px-4 py-2 bg-surface hover:bg-surface/80 text-text-main border border-black/10 dark:border-white/10 rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
                        >
                          <RefreshCw size={14} className={collegesLoading ? "animate-spin text-warning" : ""} /> Refresh List
                        </button>
                      </div>
                    </div>

                    {/* Add / Edit Form */}
                    <form onSubmit={handleAdminSaveCollege} className="bg-surface border border-warning/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-warning flex items-center gap-2">
                          <Plus size={16} /> {editingCollegeId ? `Edit College Record (${collegeForm.name})` : "Add New College / University"}
                        </h3>
                        {editingCollegeId && (
                          <span className="text-xs font-mono text-warning bg-warning/10 px-2.5 py-1 rounded-full border border-warning/20">
                            Editing ID: {editingCollegeId}
                          </span>
                        )}
                      </div>

                      {/* Form Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono uppercase text-text-muted">College / University Name *</label>
                          <input
                            type="text"
                            value={collegeForm.name}
                            onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
                            placeholder="e.g. National Forensic Sciences University"
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Short Name / Abbreviation</label>
                          <input
                            type="text"
                            value={collegeForm.shortName}
                            onChange={(e) => setCollegeForm({ ...collegeForm, shortName: e.target.value })}
                            placeholder="e.g. NFSU Gandhinagar"
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Country *</label>
                          <input
                            type="text"
                            value={collegeForm.country}
                            onChange={(e) => setCollegeForm({ ...collegeForm, country: e.target.value })}
                            placeholder="e.g. India, United States, United Kingdom"
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">State / Region</label>
                          <input
                            type="text"
                            value={collegeForm.state}
                            onChange={(e) => setCollegeForm({ ...collegeForm, state: e.target.value })}
                            placeholder="e.g. Gujarat, Delhi, California, Scotland"
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">City *</label>
                          <input
                            type="text"
                            value={collegeForm.city}
                            onChange={(e) => setCollegeForm({ ...collegeForm, city: e.target.value })}
                            placeholder="e.g. Gandhinagar, New Delhi, London"
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Institution Type</label>
                          <select
                            value={collegeForm.type}
                            onChange={(e) => setCollegeForm({ ...collegeForm, type: e.target.value as College['type'] })}
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          >
                            <option value="Government">Government / Public</option>
                            <option value="Institute of National Importance">Institute of National Importance</option>
                            <option value="Private">Private University</option>
                            <option value="Deemed University">Deemed University</option>
                            <option value="Autonomous">Autonomous Institute</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Official Website URL</label>
                          <input
                            type="url"
                            value={collegeForm.website}
                            onChange={(e) => setCollegeForm({ ...collegeForm, website: e.target.value })}
                            placeholder="https://nfsu.ac.in"
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Accreditation / Affiliation</label>
                          <input
                            type="text"
                            value={collegeForm.accreditation}
                            onChange={(e) => setCollegeForm({ ...collegeForm, accreditation: e.target.value })}
                            placeholder="e.g. NAAC A++ | UGC Approved | FEPAC"
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Estimated Fee Structure Range</label>
                          <input
                            type="text"
                            value={collegeForm.feesRange}
                            onChange={(e) => setCollegeForm({ ...collegeForm, feesRange: e.target.value })}
                            placeholder="e.g. ₹60,000 - ₹80,000 / semester"
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Ranking / Highlights</label>
                          <input
                            type="text"
                            value={collegeForm.ranking}
                            onChange={(e) => setCollegeForm({ ...collegeForm, ranking: e.target.value })}
                            placeholder="e.g. NIRF Top 50 | #1 Forensic Univ"
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-3">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Campus Facilities (Comma-separated)</label>
                          <input
                            type="text"
                            value={collegeForm.facilities}
                            onChange={(e) => setCollegeForm({ ...collegeForm, facilities: e.target.value })}
                            placeholder="e.g. Ballistics Range, DNA Fingerprinting Center, 3D Crime Scene Simulator, Cyber Lab, Library, Hostel"
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Campus Banner Image URL</label>
                          <input
                            type="url"
                            value={collegeForm.bannerImage}
                            onChange={(e) => setCollegeForm({ ...collegeForm, bannerImage: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Logo Image URL</label>
                          <input
                            type="url"
                            value={collegeForm.logo}
                            onChange={(e) => setCollegeForm({ ...collegeForm, logo: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>
                      </div>

                      {/* Description & Admissions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">College Overview & Description</label>
                          <textarea
                            rows={3}
                            value={collegeForm.description}
                            onChange={(e) => setCollegeForm({ ...collegeForm, description: e.target.value })}
                            placeholder="Detailed background about the institute, departments, and research infrastructure..."
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Admission Process & Entrance Exams</label>
                          <textarea
                            rows={3}
                            value={collegeForm.admissionProcess}
                            onChange={(e) => setCollegeForm({ ...collegeForm, admissionProcess: e.target.value })}
                            placeholder="e.g. National Forensic Admission Test (NFAT) conducted annually followed by counseling..."
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Contact Email</label>
                          <input
                            type="email"
                            value={collegeForm.contactEmail}
                            onChange={(e) => setCollegeForm({ ...collegeForm, contactEmail: e.target.value })}
                            placeholder="admissions@nfsu.ac.in"
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Contact Phone</label>
                          <input
                            type="text"
                            value={collegeForm.contactPhone}
                            onChange={(e) => setCollegeForm({ ...collegeForm, contactPhone: e.target.value })}
                            placeholder="+91 79 23977100"
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono uppercase text-text-muted">Campus Address</label>
                          <input
                            type="text"
                            value={collegeForm.address}
                            onChange={(e) => setCollegeForm({ ...collegeForm, address: e.target.value })}
                            placeholder="Sector 9, Gandhinagar, Gujarat 382007"
                            className="w-full bg-background border border-black/10 dark:border-white/10 rounded-xl p-3 text-xs font-bold text-text-main outline-none focus:border-warning"
                          />
                        </div>
                      </div>

                      {/* Featured Checkbox */}
                      <div className="pt-2">
                        <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-text-main">
                          <input
                            type="checkbox"
                            checked={collegeForm.featured}
                            onChange={(e) => setCollegeForm({ ...collegeForm, featured: e.target.checked })}
                            className="w-4 h-4 rounded text-warning focus:ring-warning border-black/20"
                          />
                          <span>Pin as Featured Premier College on Top of Directory</span>
                        </label>
                      </div>

                      {/* Dynamic Courses Manager */}
                      <div className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-black uppercase tracking-widest text-warning flex items-center gap-2">
                            <BookOpen size={16} /> Courses Offered ({collegeForm.coursesOffered.length})
                          </label>
                          <button
                            type="button"
                            onClick={handleAddCollegeCourseRow}
                            className="px-3 py-1.5 bg-warning/10 text-warning hover:bg-warning hover:text-crust rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                          >
                            <Plus size={14} /> Add Course Row
                          </button>
                        </div>

                        <div className="space-y-4">
                          {collegeForm.coursesOffered.map((course, cIdx) => (
                            <div key={cIdx} className="bg-background border border-black/10 dark:border-white/10 rounded-2xl p-4 space-y-3 relative">
                              <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
                                <span className="text-[10px] font-mono text-warning font-bold">Course Offering #{cIdx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveCollegeCourseRow(cIdx)}
                                  className="text-red-400 hover:text-red-500 text-xs font-bold flex items-center gap-1"
                                >
                                  <Trash2 size={13} /> Remove
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <div className="md:col-span-2">
                                  <label className="text-[9px] font-mono uppercase text-text-muted">Course Name</label>
                                  <input
                                    type="text"
                                    value={course.name}
                                    onChange={(e) => handleCollegeCourseChange(cIdx, 'name', e.target.value)}
                                    placeholder="e.g. B.Sc. Forensic Science"
                                    className="w-full bg-surface border border-black/10 rounded-lg p-2 text-xs font-bold text-text-main outline-none focus:border-warning"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="text-[9px] font-mono uppercase text-text-muted">Degree Level</label>
                                  <select
                                    value={course.degreeLevel}
                                    onChange={(e) => handleCollegeCourseChange(cIdx, 'degreeLevel', e.target.value)}
                                    className="w-full bg-surface border border-black/10 rounded-lg p-2 text-xs font-bold text-text-main outline-none focus:border-warning"
                                  >
                                    <option value="Bachelor">Bachelor</option>
                                    <option value="Master">Master</option>
                                    <option value="Doctorate">Doctorate</option>
                                    <option value="Diploma">Diploma</option>
                                    <option value="Certificate">Certificate</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[9px] font-mono uppercase text-text-muted">Duration</label>
                                  <input
                                    type="text"
                                    value={course.duration}
                                    onChange={(e) => handleCollegeCourseChange(cIdx, 'duration', e.target.value)}
                                    placeholder="e.g. 3 Years / 2 Years"
                                    className="w-full bg-surface border border-black/10 rounded-lg p-2 text-xs font-bold text-text-main outline-none focus:border-warning"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="text-[9px] font-mono uppercase text-text-muted">Eligibility Criteria</label>
                                  <input
                                    type="text"
                                    value={course.eligibility || ''}
                                    onChange={(e) => handleCollegeCourseChange(cIdx, 'eligibility', e.target.value)}
                                    placeholder="e.g. 10+2 with PCB/PCM (Min 60%)"
                                    className="w-full bg-surface border border-black/10 rounded-lg p-2 text-xs font-bold text-text-main outline-none focus:border-warning"
                                  />
                                </div>

                                <div>
                                  <label className="text-[9px] font-mono uppercase text-text-muted">Estimated Fees</label>
                                  <input
                                    type="text"
                                    value={course.estimatedFees || ''}
                                    onChange={(e) => handleCollegeCourseChange(cIdx, 'estimatedFees', e.target.value)}
                                    placeholder="e.g. ₹65,000 / semester"
                                    className="w-full bg-surface border border-black/10 rounded-lg p-2 text-xs font-bold text-text-main outline-none focus:border-warning"
                                  />
                                </div>

                                <div>
                                  <label className="text-[9px] font-mono uppercase text-text-muted">Study Mode</label>
                                  <select
                                    value={course.mode || 'Full-time'}
                                    onChange={(e) => handleCollegeCourseChange(cIdx, 'mode', e.target.value)}
                                    className="w-full bg-surface border border-black/10 rounded-lg p-2 text-xs font-bold text-text-main outline-none focus:border-warning"
                                  >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Distance / Online">Distance / Online</option>
                                    <option value="Hybrid">Hybrid</option>
                                  </select>
                                </div>

                                <div className="md:col-span-4">
                                  <label className="text-[9px] font-mono uppercase text-text-muted">Specializations (Comma-separated)</label>
                                  <input
                                    type="text"
                                    value={course.specializations ? course.specializations.join(', ') : ''}
                                    onChange={(e) => handleCollegeCourseSpecsChange(cIdx, e.target.value)}
                                    placeholder="e.g. Dactyloscopy, Fingerprint Science, DNA Profiling, Toxicology"
                                    className="w-full bg-surface border border-black/10 rounded-lg p-2 text-xs font-bold text-text-main outline-none focus:border-warning"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Submit Actions */}
                      <div className="pt-4 flex items-center justify-end gap-3 border-t border-black/10 dark:border-white/10">
                        <button
                          type="button"
                          onClick={handleResetCollegeForm}
                          className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main text-xs font-bold transition-colors"
                        >
                          Reset Form
                        </button>

                        <button
                          type="submit"
                          className="px-8 py-2.5 bg-warning text-crust font-black text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-warning/90 transition-all flex items-center gap-2"
                        >
                          <CheckCircle2 size={16} />
                          <span>{editingCollegeId ? "Update College Record" : "Publish College to Directory"}</span>
                        </button>
                      </div>
                    </form>

                    {/* Listed Colleges Directory */}
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
                      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
                        <div>
                          <h3 className="text-base font-black uppercase tracking-tight text-text-main">
                            Live College Directory Records ({colleges.length})
                          </h3>
                          <p className="text-xs text-text-muted">Currently active universities and institutes published in the database.</p>
                        </div>
                      </div>

                      {collegesLoading ? (
                        <div className="py-12 text-center text-xs text-text-muted flex justify-center items-center gap-2">
                          <Loader2 size={20} className="animate-spin text-warning" /> Loading directory records...
                        </div>
                      ) : colleges.length === 0 ? (
                        <div className="py-12 text-center text-xs text-text-muted bg-background rounded-2xl border border-black/5">
                          No colleges added yet. Use the form above to publish your first college.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {colleges.map((col) => (
                            <div
                              key={col.id}
                              className="bg-background border border-black/10 dark:border-white/10 rounded-2xl p-5 space-y-3 hover:border-warning/40 transition-colors relative"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2.5 py-0.5 rounded bg-warning/10 text-warning font-black text-[10px] uppercase">
                                      {col.type}
                                    </span>
                                    {col.featured && (
                                      <span className="px-2 py-0.5 rounded bg-warning text-crust font-black text-[9px] uppercase">
                                        Featured
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="text-sm font-black text-text-main mt-1">
                                    {col.name}
                                  </h4>
                                  <p className="text-xs text-warning font-bold flex items-center gap-1 mt-0.5">
                                    <MapPin size={12} /> {col.city}, {col.state ? `${col.state}, ` : ''}{col.country}
                                  </p>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    onClick={() => handleAdminEditCollege(col)}
                                    className="p-2 border border-black/10 dark:border-white/10 text-warning hover:bg-warning/10 rounded-lg text-xs font-bold transition-colors"
                                    title="Edit College Record"
                                  >
                                    <Edit3 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleAdminDeleteCollege(col.id, col.name)}
                                    className="p-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-bold transition-colors"
                                    title="Delete College Record (Double Confirm Security)"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>

                              <div className="text-xs text-text-muted pt-2 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-2 font-semibold">
                                <span>{col.coursesOffered.length} Courses Offered</span>
                                {col.website && (
                                  <a
                                    href={col.website.startsWith('http') ? col.website : `https://${col.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-warning hover:underline flex items-center gap-1"
                                  >
                                    <Globe size={12} /> Official Portal <ExternalLink size={10} />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* MAINTENANCE CONTROLS SECTION */}
                {activeTab === 'maintenance' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-black/10 dark:border-white/10">
                        <div>
                          <h2 className="text-xl font-heading font-black uppercase tracking-tight flex items-center gap-2 text-text-main">
                            <Wrench size={20} className="text-warning" /> Maintenance Mode & Countdown Manager
                          </h2>
                          <p className="text-sm text-text-muted mt-1">
                            Switch the platform into maintenance mode, configure the countdown target time (e.g. 12:30 PM IST), and broadcast custom notices.
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href="/maintenance"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-base hover:bg-surface border border-black/10 dark:border-white/10 rounded-xl text-xs font-mono font-bold text-text-muted hover:text-text-main transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <ExternalLink size={13} className="text-cyan-400" />
                            <span>Preview Notice Screen</span>
                          </a>
                        </div>
                      </div>

                      {/* Status Feedback Toast */}
                      {maintenanceFeedback && (
                        <div className={cn(
                          "p-4 rounded-xl mb-6 text-xs font-mono flex items-center gap-2 border",
                          maintenanceFeedback.type === 'success'
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                        )}>
                          {maintenanceFeedback.type === 'success' ? (
                            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                          ) : (
                            <AlertTriangle size={16} className="text-red-400 shrink-0" />
                          )}
                          <span>{maintenanceFeedback.text}</span>
                        </div>
                      )}

                      {/* MASTER TOGGLE CARD */}
                      <div className={cn(
                        "p-6 rounded-2xl border mb-6 transition-all",
                        maintenanceConfig.isActive
                          ? "bg-amber-500/10 border-amber-500/40 shadow-xl shadow-amber-500/5"
                          : "bg-base border-black/10 dark:border-white/10"
                      )}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-xs font-mono font-black uppercase px-3 py-1 rounded-full flex items-center gap-2",
                                maintenanceConfig.isActive
                                  ? "bg-amber-500 text-black animate-pulse"
                                  : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              )}>
                                <span className={cn("w-2 h-2 rounded-full", maintenanceConfig.isActive ? "bg-black" : "bg-emerald-400")} />
                                {maintenanceConfig.isActive ? "MAINTENANCE MODE IS ACTIVE" : "PLATFORM IS LIVE"}
                              </span>
                            </div>
                            <h3 className="text-lg font-heading font-black text-text-main">
                              Master Availability Switch
                            </h3>
                            <p className="text-xs text-text-muted max-w-lg leading-relaxed">
                              {maintenanceConfig.isActive
                                ? "Visitors to all forenclue.com routes are being redirected to the minimalist countdown maintenance screen. Authenticated staff can still access internal modules."
                                : "The website is completely public and live. Students and visitors can access courses, simulations, cases, and webinars freely."}
                            </p>
                          </div>

                          <div className="shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleMaintenance(!maintenanceConfig.isActive)}
                              disabled={isSavingMaintenance}
                              className={cn(
                                "px-6 py-3.5 rounded-xl font-mono text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2.5 shadow-lg active:scale-95 cursor-pointer disabled:opacity-50",
                                maintenanceConfig.isActive
                                  ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/10"
                                  : "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/10"
                              )}
                            >
                              <Power size={16} />
                              <span>{isSavingMaintenance ? "Updating..." : maintenanceConfig.isActive ? "Turn OFF Maintenance" : "Turn ON Maintenance"}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* COUNTDOWN TIMER & DURATION CONFIGURATION */}
                      <form onSubmit={handleSaveMaintenanceSettings} className="space-y-6">
                        <div className="bg-base border border-black/10 dark:border-white/10 rounded-2xl p-6 space-y-6">
                          <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                            <h3 className="text-sm font-heading font-black uppercase tracking-wider text-text-main flex items-center gap-2">
                              <Clock size={16} className="text-cyan-400" /> Countdown Timer & Target Time
                            </h3>
                            <span className="text-[11px] font-mono text-text-muted">
                              Current Display: <strong className="text-warning">{formatIstDisplay(maintenanceTargetInput || maintenanceConfig.targetEndTime)}</strong>
                            </span>
                          </div>

                          {/* Quick Presets */}
                          <div>
                            <label className="block text-[11px] font-mono uppercase text-text-muted mb-2 font-bold">
                              Quick Presets:
                            </label>
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                type="button"
                                onClick={handlePresetIst1230}
                                className="px-3 py-1.5 rounded-lg bg-warning/15 hover:bg-warning/25 text-warning border border-warning/30 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <Clock size={12} />
                                <span>12:30 PM IST (Today/Tomorrow)</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handlePresetMinutes(30)}
                                className="px-3 py-1.5 rounded-lg bg-surface hover:bg-black/10 dark:hover:bg-white/5 border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main text-xs font-mono transition-all cursor-pointer"
                              >
                                +30 Mins
                              </button>

                              <button
                                type="button"
                                onClick={() => handlePresetMinutes(60)}
                                className="px-3 py-1.5 rounded-lg bg-surface hover:bg-black/10 dark:hover:bg-white/5 border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main text-xs font-mono transition-all cursor-pointer"
                              >
                                +1 Hour
                              </button>

                              <button
                                type="button"
                                onClick={() => handlePresetMinutes(120)}
                                className="px-3 py-1.5 rounded-lg bg-surface hover:bg-black/10 dark:hover:bg-white/5 border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main text-xs font-mono transition-all cursor-pointer"
                              >
                                +2 Hours
                              </button>

                              <button
                                type="button"
                                onClick={() => handlePresetMinutes(360)}
                                className="px-3 py-1.5 rounded-lg bg-surface hover:bg-black/10 dark:hover:bg-white/5 border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main text-xs font-mono transition-all cursor-pointer"
                              >
                                +6 Hours
                              </button>

                              <button
                                type="button"
                                onClick={() => handlePresetMinutes(1440)}
                                className="px-3 py-1.5 rounded-lg bg-surface hover:bg-black/10 dark:hover:bg-white/5 border border-black/10 dark:border-white/10 text-text-muted hover:text-text-main text-xs font-mono transition-all cursor-pointer"
                              >
                                +24 Hours (1 Day)
                              </button>
                            </div>
                          </div>

                          {/* Target Datetime Input */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-mono text-text-muted uppercase mb-2 font-bold">
                                Target End Date & Time (Your Local Timezone)
                              </label>
                              <input
                                type="datetime-local"
                                value={maintenanceTargetInput}
                                onChange={(e) => setMaintenanceTargetInput(e.target.value)}
                                className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-text-main focus:outline-none focus:border-warning"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-mono text-text-muted uppercase mb-2 font-bold">
                                Live Remaining Preview
                              </label>
                              <div className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-text-main flex items-center justify-between">
                                {(() => {
                                  const rem = calculateRemainingTime(maintenanceTargetInput ? new Date(maintenanceTargetInput).toISOString() : maintenanceConfig.targetEndTime);
                                  if (rem.isExpired) {
                                    return <span className="text-amber-400 font-bold">Target time reached (Finalizing status)</span>;
                                  }
                                  return (
                                    <span className="font-bold text-cyan-400">
                                      {rem.days > 0 ? `${rem.days}d ` : ''}{rem.hours}h {rem.minutes}m remaining
                                    </span>
                                  );
                                })()}
                                <span className="text-[10px] text-text-muted uppercase">IST: {formatIstDisplay(maintenanceTargetInput ? new Date(maintenanceTargetInput).toISOString() : maintenanceConfig.targetEndTime)}</span>
                              </div>
                            </div>
                          </div>

                          {/* NOTICE CUSTOMIZATION */}
                          <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                            <div>
                              <label className="block text-xs font-mono text-text-muted uppercase mb-2 font-bold">
                                Maintenance Screen Headline
                              </label>
                              <input
                                type="text"
                                value={maintenanceTitleInput}
                                onChange={(e) => setMaintenanceTitleInput(e.target.value)}
                                placeholder="e.g. We'll Be Back Soon / Platform Upgrade in Progress"
                                className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-text-main focus:outline-none focus:border-warning"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-mono text-text-muted uppercase mb-2 font-bold">
                                Public Notice Description
                              </label>
                              <textarea
                                value={maintenanceNoticeInput}
                                onChange={(e) => setMaintenanceNoticeInput(e.target.value)}
                                rows={3}
                                placeholder="e.g. We are performing scheduled improvements to laboratory simulations and performance tuning. ForenClue will be back online shortly."
                                className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl p-4 text-xs text-text-main focus:outline-none focus:border-warning leading-relaxed"
                              />
                            </div>
                          </div>

                          {/* Save Button */}
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-[11px] text-text-muted font-mono">
                              Changes sync in real-time across all active user sessions via Firestore.
                            </span>

                            <button
                              type="submit"
                              disabled={isSavingMaintenance}
                              className="px-6 py-2.5 bg-warning hover:bg-warning/90 text-crust font-black font-mono text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                            >
                              {isSavingMaintenance ? (
                                <>
                                  <Loader2 size={14} className="animate-spin" />
                                  <span>Saving Settings...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 size={14} />
                                  <span>Save & Broadcast Settings</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Enrolled Candidates & Participants Modal */}
      <AnimatePresence>
        {isUsersModalOpen && selectedQuizForEnrollment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div 
              className="fixed inset-0 bg-background/80 backdrop-blur-md transition-opacity" 
              onClick={() => setIsUsersModalOpen(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-4xl bg-surface border border-emerald-500/30 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden z-10 my-auto"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-black/10 dark:border-white/10 bg-gradient-to-r from-emerald-500/10 via-surface to-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Users size={12} /> Enrolled Candidates
                    </span>
                    {selectedQuizForEnrollment.isWeeklyChallenge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        Weekly Challenge
                      </span>
                    )}
                    {selectedQuizForEnrollment.isPaid ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-warning/20 text-warning font-mono text-[10px] border border-warning/30">
                        ₹{selectedQuizForEnrollment.price || 49} Paid Entry
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
                        100% Free
                      </span>
                    )}
                    <span className="text-[11px] text-text-muted">
                      • {selectedQuizForEnrollment.category} • {selectedQuizForEnrollment.durationMinutes} mins • {selectedQuizForEnrollment.totalPoints} pts
                    </span>
                  </div>

                  <h3 className="text-xl font-heading font-black text-text-main flex items-center gap-2 mt-1">
                    {selectedQuizForEnrollment.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={handleRefreshEnrolledUsers}
                    disabled={fetchingUsers}
                    className="p-2.5 bg-surface hover:bg-surface/80 border border-black/10 dark:border-white/10 rounded-xl text-text-muted hover:text-text-main transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="Refresh participant list"
                  >
                    <RefreshCw size={15} className={fetchingUsers ? "animate-spin text-emerald-400" : ""} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsUsersModalOpen(false)}
                    className="p-2.5 bg-surface hover:bg-surface/80 border border-black/10 dark:border-white/10 rounded-xl text-text-muted hover:text-text-main transition cursor-pointer flex items-center justify-center"
                    title="Close"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Filter and Actions Bar */}
              <div className="p-4 sm:p-6 border-b border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/[0.02] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search candidates by name, email, college, or UTR..."
                      value={enrolledSearchQuery}
                      onChange={(e) => setEnrolledSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-surface border border-black/10 dark:border-white/10 rounded-xl text-xs text-text-main focus:outline-none focus:border-emerald-500 transition"
                    />
                    {enrolledSearchQuery && (
                      <button
                        onClick={() => setEnrolledSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Batch Action Buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleCopyEnrolledEmails}
                      disabled={enrolledParticipants.length === 0}
                      className="px-3.5 py-2 bg-surface hover:bg-surface/80 border border-black/10 dark:border-white/10 rounded-xl text-xs font-bold text-text-main hover:text-emerald-400 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {copiedEmailsMsg ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          <span className="text-emerald-400 font-black">Emails Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy All Emails ({enrolledParticipants.filter(p => p.userEmail && p.userEmail.includes('@')).length})</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleExportEnrolledCSV}
                      disabled={enrolledParticipants.length === 0}
                      className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-400 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Download size={14} />
                      <span>Export CSV</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetAllEnrollments}
                      disabled={fetchingUsers}
                      className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-xs font-bold text-rose-400 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      title="Reset all candidate enrollments to 0 for this challenge so everyone sees Enroll / Register anew"
                    >
                      <RotateCcw size={14} />
                      <span>Reset All Enrollments (Set to 0)</span>
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                {(() => {
                  const attemptedCount = enrolledParticipants.filter(p => p.hasAttempted).length;
                  const notAttemptedCount = enrolledParticipants.filter(p => !p.hasAttempted).length;
                  const approvedCount = enrolledParticipants.filter(p => p.registrationStatus === 'approved' || (!p.registrationStatus && p.enrollmentType === 'free')).length;
                  const pendingCount = enrolledParticipants.filter(p => p.registrationStatus === 'pending').length;

                  return (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                      <button
                        type="button"
                        onClick={() => setEnrolledFilterTab('all')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                          enrolledFilterTab === 'all'
                            ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-black"
                            : "bg-surface text-text-muted hover:text-text-main border border-black/10 dark:border-white/10"
                        )}
                      >
                        All Candidates ({enrolledParticipants.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setEnrolledFilterTab('attempted')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                          enrolledFilterTab === 'attempted'
                            ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-black"
                            : "bg-surface text-text-muted hover:text-text-main border border-black/10 dark:border-white/10"
                        )}
                      >
                        Attempted & Scored ({attemptedCount})
                      </button>

                      <button
                        type="button"
                        onClick={() => setEnrolledFilterTab('not_attempted')}
                        className={cn(
                          "px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                          enrolledFilterTab === 'not_attempted'
                            ? "bg-amber-500 text-black shadow-md shadow-amber-500/20 font-black"
                            : "bg-surface text-text-muted hover:text-text-main border border-black/10 dark:border-white/10"
                        )}
                      >
                        Awaiting Attempt ({notAttemptedCount})
                      </button>

                      {pendingCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setEnrolledFilterTab('pending')}
                          className={cn(
                            "px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                            enrolledFilterTab === 'pending'
                              ? "bg-amber-500 text-black shadow-md shadow-amber-500/20 font-black"
                              : "bg-surface text-amber-400 border border-amber-500/30"
                          )}
                        >
                          Pending Approval ({pendingCount})
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Candidates List Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {fetchingUsers ? (
                  <div className="py-16 text-center text-xs text-text-muted flex flex-col justify-center items-center gap-3">
                    <Loader2 size={24} className="animate-spin text-emerald-400" />
                    <span>Loading verified candidates from database...</span>
                  </div>
                ) : (() => {
                  const filtered = enrolledParticipants.filter(p => {
                    // Filter tab condition
                    if (enrolledFilterTab === 'attempted' && !p.hasAttempted) return false;
                    if (enrolledFilterTab === 'not_attempted' && p.hasAttempted) return false;
                    if (enrolledFilterTab === 'pending' && p.registrationStatus !== 'pending') return false;
                    if (enrolledFilterTab === 'approved' && p.registrationStatus !== 'approved' && !(p.enrollmentType === 'free')) return false;

                    // Search condition
                    if (enrolledSearchQuery.trim()) {
                      const q = enrolledSearchQuery.toLowerCase();
                      const matchName = (p.userName || '').toLowerCase().includes(q);
                      const matchEmail = (p.userEmail || '').toLowerCase().includes(q);
                      const matchCollege = (p.college || '').toLowerCase().includes(q);
                      const matchUtr = (p.utrNumber || '').toLowerCase().includes(q);
                      const matchId = (p.userId || '').toLowerCase().includes(q);
                      return matchName || matchEmail || matchCollege || matchUtr || matchId;
                    }
                    return true;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="py-16 text-center border border-dashed border-black/10 dark:border-white/10 rounded-2xl p-8">
                        <Users size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
                        <h4 className="text-sm font-bold text-text-main">No Candidates Found</h4>
                        <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                          {enrolledParticipants.length === 0 
                            ? "No users have enrolled in or attempted this quiz yet." 
                            : "No candidates match your current search query or filter tab."}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {filtered.map((participant, idx) => (
                        <div 
                          key={participant.userId || idx} 
                          className="bg-base/70 hover:bg-base border border-black/10 dark:border-white/10 hover:border-emerald-500/30 rounded-2xl p-4 transition duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          {/* Candidate Identity */}
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black uppercase text-sm shrink-0 overflow-hidden">
                              {participant.userPhoto ? (
                                <img 
                                  src={participant.userPhoto} 
                                  alt={participant.userName} 
                                  className="w-full h-full object-cover" 
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <span>{(participant.userName || 'U').charAt(0)}</span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-text-main">
                                  {participant.userName}
                                </span>
                                
                                {participant.enrollmentType === 'paid' ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-warning/15 text-warning border border-warning/30">
                                    Paid Challenge (₹{participant.amountPaid || selectedQuizForEnrollment.price || 49})
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                    Free
                                  </span>
                                )}

                                {participant.registrationStatus === 'approved' && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                                    <UserCheck size={11} /> Approved
                                  </span>
                                )}

                                {participant.registrationStatus === 'pending' && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 flex items-center gap-1">
                                    <Clock size={11} /> Verification Pending
                                  </span>
                                )}
                              </div>

                              <div className="text-xs text-text-muted mt-0.5 flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-text-main/90">{participant.userEmail}</span>
                                {participant.userEmail && participant.userEmail.includes('@') && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(participant.userEmail);
                                      setSuccessMsg(`Copied email for ${participant.userName}`);
                                    }}
                                    className="text-[10px] text-text-muted hover:text-emerald-400 transition"
                                    title="Copy email"
                                  >
                                    <Copy size={11} />
                                  </button>
                                )}
                                {participant.college && participant.college !== 'N/A' && (
                                  <span className="text-text-muted/80">• {participant.college}</span>
                                )}
                              </div>

                              {/* UTR and Payment Details */}
                              {participant.utrNumber && (
                                <div className="mt-2 flex items-center gap-2 text-xs bg-surface/80 px-2.5 py-1 rounded-lg border border-black/5 dark:border-white/5 w-fit">
                                  <span className="text-text-muted font-bold text-[11px]">UTR / Ref:</span>
                                  <span className="font-mono font-bold text-amber-400 text-[11px]">
                                    {participant.utrNumber}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopySingleUtr(participant.utrNumber!)}
                                    className="text-text-muted hover:text-amber-400 transition ml-1"
                                    title="Copy UTR number"
                                  >
                                    {copiedUtrMap[participant.utrNumber] ? (
                                      <Check size={12} className="text-emerald-400" />
                                    ) : (
                                      <Copy size={12} />
                                    )}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Attempt / Score Stats & Action */}
                          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                            {participant.hasAttempted ? (
                              <div className="bg-surface border border-emerald-500/20 p-2.5 rounded-xl text-right min-w-[140px]">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Trophy size={14} className="text-amber-400" />
                                  <span className="text-sm font-black font-mono text-emerald-400">
                                    {participant.score ?? 0}
                                  </span>
                                  <span className="text-[11px] font-mono text-text-muted">
                                    / {participant.totalPoints || selectedQuizForEnrollment.totalPoints} pts
                                  </span>
                                </div>
                                <div className="text-[10px] text-text-muted mt-0.5 flex items-center justify-end gap-2">
                                  {participant.accuracyPercentage !== undefined && (
                                    <span className="font-bold text-text-main">
                                      {participant.accuracyPercentage}% Acc
                                    </span>
                                  )}
                                  {participant.timeTakenSeconds !== undefined && (
                                    <span>
                                      {Math.floor(participant.timeTakenSeconds / 60)}m {participant.timeTakenSeconds % 60}s
                                    </span>
                                  )}
                                </div>
                                {participant.completedAt && (
                                  <div className="text-[9px] text-text-muted/70 mt-0.5">
                                    {new Date(participant.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="bg-surface/50 border border-black/10 dark:border-white/5 px-3 py-2 rounded-xl text-center min-w-[130px]">
                                <span className="text-[11px] font-bold text-amber-400/90 flex items-center justify-center gap-1">
                                  <Clock size={12} /> Awaiting Attempt
                                </span>
                                <span className="text-[9px] text-text-muted block mt-0.5">
                                  Registered / Enrolled
                                </span>
                              </div>
                            )}

                            {/* Unenroll / Remove Action */}
                            <button
                              type="button"
                              onClick={() => handleUnenrollUser(participant)}
                              disabled={removingUserId === participant.userId}
                              className="p-2.5 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-xl transition cursor-pointer text-xs font-bold disabled:opacity-50"
                              title="Unenroll participant from this quiz"
                            >
                              {removingUserId === participant.userId ? (
                                <Loader2 size={15} className="animate-spin text-red-400" />
                              ) : (
                                <UserX size={15} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-black/10 dark:border-white/10 bg-surface flex items-center justify-between text-xs text-text-muted">
                <span className="font-mono">
                  Showing {enrolledParticipants.length} total enrolled participant{enrolledParticipants.length === 1 ? '' : 's'}.
                </span>
                <button
                  type="button"
                  onClick={() => setIsUsersModalOpen(false)}
                  className="px-4 py-2 bg-surface hover:bg-surface/80 border border-black/10 dark:border-white/10 rounded-xl text-xs font-bold text-text-main transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
