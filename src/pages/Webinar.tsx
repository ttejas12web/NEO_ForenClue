import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Clock, Sparkles, ArrowLeft, Calendar, User, 
  Linkedin, Play, ExternalLink, Star, MessageSquare, Send, Check,
  ChevronLeft, ChevronRight, ThumbsUp, Radio, Youtube, Pin
} from 'lucide-react';
import { SEO } from '@/components/layout/SEO';
import { SEOManager } from '@/components/layout/SEOManager';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

interface Feedback {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  pinned?: boolean;
}

interface WebinarEvent {
  id: string;
  sequence: number;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  description: string;
  fullDetails: string;
  youtubeId?: string;
  isUpcoming?: boolean;
  speaker: {
    name: string;
    role: string;
    avatar: string;
    linkedin: string;
    bio: string;
  };
  poster: string;
  bannerImage?: string;
  thumbnail?: string;
  tags: string[];
  feedbacks: Feedback[];
  isFeedbackClosed?: boolean;
}

const WEBINARS_DATA: WebinarEvent[] = [
  {
    id: "forensic-toxicology",
    sequence: 4,
    title: "Forensic Toxicology Exclusive Webinar",
    subtitle: "Join our Forensic Toxicology Webinar to explore the role of toxicology in forensic investigations.",
    date: "October 04, 2026",
    time: "07:00 PM ONWARDS",
    description: "Exclusive masterclass on Forensic Toxicology exploring chemical analysis, genotoxicity, mutagenicity, and medico-legal investigative protocols.",
    fullDetails: "Forensic Toxicology Exclusive Webinar with speaker Mr. Rajat Pithadia.\n\nJoin our Forensic Toxicology Webinar to explore the critical role of toxicology in forensic investigations, chemical detection, and judicial evidence.\n\nKey Highlights & What You Will Gain:\n• Fundamentals & Advanced Workflows of Forensic Toxicology\n• Chemical Analysis, Genotoxicity & Mutagenicity\n• Toxicological Evidence in Postmortem & Legal Cases\n• Pharmacology & Analytical Instrumentation\n• Live Interactive Q&A Session\n\nPlatform: Google Meet (Online) & YouTube Live\nSchedule: 4 OCT 2026 | 07:00 PM ONWARDS\nPerks: Free E-Certificates to All Active Participants | No Entry Fee Required",
    youtubeId: "J7cUbmKdR9M",
    isUpcoming: false,
    isFeedbackClosed: false,
    speaker: {
      name: "Mr. Rajat Pithadia",
      role: "UGC.NET, GSET Qualified | Asst. Professor Parul University | Wiley Author | PhD Scholar Genotoxicity & Mutagenicity M.Sc.(Forensic Chemistry, Toxicology & Pharmacology)",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEiseuO8LFJ74UtogyoZLu5orh44gH7WVqDM4oinlMLhD3u4grQKoinTCZYk-OfKJrXJjV8E9EZHoPbhefI60LoXmqO623wQXiv-4hXumhYmBrBJCh4HYvYk9ifZ4nSccrYe5qyJHQXAQvW_8Zgkdq3T7vCycYqiJy0aUSZYzhmqc8M12jhhUq3X1GoORws",
      linkedin: "https://www.linkedin.com/in/rajatresearch",
      bio: "UGC.NET, GSET Qualified | Asst. Professor Parul University | Wiley Author | PhD Scholar Genotoxicity & Mutagenicity M.Sc.(Forensic Chemistry, Toxicology & Pharmacology)"
    },
    poster: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgpYn8CExwzqv9CrcbHqeYMI9TX0iOypg6BM_HeSUPn52oz5KJIzP-9746Z3Fp6O3-wtS-Y8ejm32Izylt2rMctCIQKklo1KH-7YdHHA1YSYQyzIYSV2zxny9OxxdkEXnA8fnliEjalVfGxwslh6ej-b14Ub6IzQj-lO7XUgXjHjO32NRLgjuqpHenbnEM/s1600/Forensic%20toxicology2.png",
    tags: ["Forensic Toxicology", "Toxicology", "Parul University", "Genotoxicity", "Pharmacology", "Recent Event"],
    feedbacks: []
  },
  {
    id: "autopsy-the-silent-witness",
    sequence: 3,
    title: "Autopsy – The Silent Witness",
    subtitle: "Discover the silent truths the body holds. A deep dive into the science, process, and medico-legal significance of autopsy.",
    date: "August 25, 2026",
    time: "07:00 PM IST",
    description: "ForenClue Master Concept Series session on autopsy purpose, process, medico-legal importance, and postmortem documentation.",
    fullDetails: "ForenClue Master Concept Series: Autopsy – The Silent Witness.\n\nDiscover the silent truths the body holds in this comprehensive deep dive into the science, process, and medico-legal significance of autopsy with speaker Sheenal Sharma.\n\nKey Highlights & What You Will Gain:\n• Autopsy – Purpose, Process & Types\n• Medico-Legal Importance & Judicial Relevance\n• Postmortem Findings & Documentation Protocols\n• Real-Life Case Insights\n• Interactive Q&A Session\n\nPlatform: Google Meet & YouTube Live (@forenclue)\nPerks: Free E-Certificate | Open For All",
    youtubeId: "knZ3cFEJExI",
    isUpcoming: false,
    isFeedbackClosed: false,
    speaker: {
      name: "Sheenal Sharma",
      role: "Forensic Sciences Enthusiast & Researcher",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEidAAeAg6jc08x9t83IfZ2oSvO-7cRgvZDN2wwC1zXXSNX0VzHRvyZnszcuc0z8TXnVGPDQbsOkXAm4daUgNvNjoiiODnVPTnM11LDaGZ2l-4jH51Ph415zlMpB_a6dPaVHXApbe78UiSTEg2q4whJ2XPMb8ABm9TqoseJRZxqQSd5luqJUteIqNDOO0Uw",
      linkedin: "https://www.linkedin.com/in/sheenal-sharma-4171a3356/",
      bio: "Forensic Sciences Enthusiast | Passionate Learner | Exploring the world of forensics with curiosity and dedication."
    },
    poster: "https://blogger.googleusercontent.com/img/a/AVvXsEiBKWNypvNgSN-Sf049jnxGMgJ3PFjJexB5xfMXeLs_Ck_Vrcg4s2exKP1jPYPc36Slmu93Vc-GwmG_AegwTVP44MMsIL_vsanEsrhk8CHPHBUpXJ3svgRRiKDmcNjGSQO92XETaIKyxDU6GGaRzodKZ4JP353wHel2hOjt1hsH-ATbqEpQ2ABX3xAOn4s",
    tags: ["Autopsy", "Forensic Pathology", "Medico-Legal", "Master Concept Series", "Recent Event"],
    feedbacks: []
  },
  {
    id: "beyond-the-smiles",
    sequence: 2,
    title: "Beyond The Smiles",
    subtitle: "Insights into Forensic Odontology and Criminal Profiling with Dr. Angela Mathew.",
    date: "August 01, 2026",
    time: "08:00 PM IST",
    description: "Session on Forensic Odontology and Criminal Profiling by renowned expert Dr. Angela Mathew.",
    fullDetails: "Session Details: 'Beyond The Smiles'. Join Dr. Angela Mathew as she delves into Forensic Odontology, Criminal Profiling, and Investigative Psychology.",
    youtubeId: "-UjiJuK6pkI",
    isFeedbackClosed: true,
    speaker: {
      name: "Dr. Angela Mathew",
      role: "Forensic Odontologist | Dental Surgeon | Certified Professional in Criminal Profiling",
      avatar: "https://blogger.googleusercontent.com/img/a/AVvXsEgMhEwp4wb0YPNtt3Waxbp44M4TcXqP6YMSqSHBOs_urx6jeljIKME5NJAwCdsAToUl-hZ7I_BhUrkYKLteZAOIoGgbF32UPTrQCpHv7nDqG8_IRU-jj9k5MKzbefVFsEjBE0e5Ii3Vgcg5pRtw-IMZmzHLYEB51Q6dDv6t178TKUKE_k4uOO1xj5xlTN8",
      linkedin: "https://www.linkedin.com/in/dr-angela-mathew/",
      bio: "Forensic Odontologist | Dental Surgeon | Certified Professional in Criminal Profiling , Forensic & Investigative Psychology | Gold Medalist(2022-2024) | Member - IDA| Fellow-Pierre Fauchard Academy, USA( Asia at Large)"
    },
    poster: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjC8OssiOJ4AHrnFMj8XrEz4-2WzvQqBvhsg4ztM5HnSlunwKoH6ZIAnDh8eL9wCjiWXy5tT7CwKs9HSrZUzE2l9ph6oefi97nIraWGguJ5L-aMsDEmadDi3LpiBiUir1xgBr8xyrrAGQrElx1Szy-x7Ob4NO_iEiWmFpuAJFBb5ihvG0_HRXC58Gujzzo/s1524/Forensic%20Odontologist%20%20Dental%20Surgeon%20%20Certified%20Professional%20in%20Criminal%20Profiling,%20Forensic%20&%20Investigative%20Psychology%20%20Gold%20Medalist%20(2022-2024)%20%20Member%20-%20IDA%20Fellow-Pierre%20Fauchard%20Academy,%20US.png",
    tags: ["Forensic Odontology", "Criminal Profiling", "Recent Event"],
    feedbacks: []
  },
  {
    id: "cybersecurity-career-pathways",
    sequence: 1,
    title: "Interactive Session on Career Pathways in Cybersecurity & Digital Forensics",
    subtitle: "Delhi Police Crime Branch Digital Forensic Professional Mr. Ashutosh Singh details career roles, learning roadmaps, and transition guide in forensics.",
    date: "July 15, 2026",
    time: "2:00 PM IST",
    description: "Explore incident response frameworks, cyber laws, state agency investigation workflows, and a concrete roadmap to land high-impact digital forensic roles in India.",
    fullDetails: "In this high-impact masterclass, Mr. Ashutosh Singh, a serving Digital Forensic Professional with the Delhi Police Crime Branch, shares critical industry insights, professional methodologies, and structural frameworks.\n\nLearn how public security investigations utilize cellular tracking, packet inspection, registry manipulation logs, and memory forensics to construct reliable judicial evidence. He lays out actionable steps to kickstart your cybersecurity and digital forensics career in India, covering necessary certifications (CEH, CHFI), hands-on lab projects, and internship pipelines.",
    youtubeId: "_mP2hfptGao", 
    isFeedbackClosed: true,
    speaker: {
      name: "Mr. Ashutosh Singh",
      role: "Delhi Police Crime Branch Digital Forensic Professional",
      avatar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjtLXAx3JA_GV_s7QEAbL8YK43XS7e-5FrJngYv7szTZAs192ppvSo4zXQxX_0sNHnoDZ-rirNR8U6BGTwSPK9kAYRdR6YWVMLUCFLvs5Cbwy81gDHxep6XWIPhdynzKvZUMnai51-QoDEPYvkn0ObkO7K33ImRdWP3yPhV0FFkEA-zMP85DXlT3EOtoCE/s1024/1783083591880.png",
      linkedin: "https://www.linkedin.com/in/ashutosh-singh-817b63237",
      bio: "Digital Forensic Professional Crime Branch,Delhi Police | Researcher| Cyber Security| SOC| Threat Intelligence | OSINT | Financial crime and Investigation |ISO-27001| Information security | Ex-FSL| NFSU-MHA|"
    },
    poster: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgiJ2oOCQiw2cxeNN6p5b40F-AKZdIkdSRRZ9V14gvIgg2MOymbNvpD2_QcaQ8gB9UxMzmp1l3iafah8Tdz2GChCInBXR8HeRIr3x_-N7a3zrpUejvhRpRhN_8UrEcvMxKN46sAl322fuGSgE3WRyeURXB0MiRstqFsk7jPALV8r3Vx8TyN_eWEPULmX0w/s1492/Mr.%20Ashutosh%20Singh.png",
    tags: ["Cybersecurity", "roadmap", "guidance", "Career Pathways"],
    feedbacks: [
      {
        id: "fb-new-1",
        name: "Akshay Mahindrakar",
        role: "MIT WPU, Pune",
        rating: 5,
        text: "Thank you so much, ForenClue Team, for today's amazing podcast! A special thanks to Ashutosh Singh, Cyber Forensic Expert, Crime Branch Delhi, for sharing such valuable insights. Heartfelt thanks to Tejas Tapse and the entire ForenClue team for organizing this wonderful session. We learned so many new things about Digital Forensics and Cyber Security. It was truly an informative and inspiring experience. Once again, thank you so much, ForenClue Team! 🙏💙",
        date: "July 18, 2026",
        verified: true
      },
      {
        id: "fb-new-2",
        name: "Mahima",
        role: "Nims University",
        rating: 5,
        text: "Session was amazing and very informative .I request Forensic clue team to create more such events series on cyber security and digital Forensic from basics to advance. On student friendly or free if possible",
        date: "July 18, 2026",
        verified: true
      },
      {
        id: "fb-new-3",
        name: "Prashant Goswami",
        role: "Guru Ghasidas Vishwavidyalaya",
        rating: 5,
        text: "The session on \"Career Pathways in Cybersecurity for Forensic Science Students & Professionals\" provided highly insightful, practical guidance that seamlessly connected forensic science concepts with the evolving landscape of digital security.",
        date: "July 18, 2026",
        verified: true
      },
      {
        id: "fb-new-4",
        name: "Ashmita Mondal",
        role: "Adamas University",
        rating: 5,
        text: "It was a good session. I just want to say that if the interaction could a bit better between sir and us , it would have been much more engaging. Except for that the overall organizing team did a great job. Looking forward to attend more such sessions in the future.",
        date: "July 18, 2026",
        verified: true
      },
      {
        id: "fb-new-5",
        name: "Aksh Tyagi",
        role: "Tecnia institute of advanced Studies",
        rating: 5,
        text: "Thanks for the session I learnt a alot",
        date: "July 18, 2026",
        verified: true
      },
      {
        id: "fb-1",
        name: "Shreya Iyer",
        role: "Amity University Forensic Student",
        rating: 5,
        text: "The session by Mr. Ashutosh was eye-opening! His explanation of Delhi Police case studies on cell tower analysis and packet inspection gave us practical insights we never get in textbooks.",
        date: "July 16, 2026",
        verified: true
      },
      {
        id: "fb-2",
        name: "Karthik Nair",
        role: "Associate Incident Responder",
        rating: 5,
        text: "The live demonstration of carving deleted headers from disk images was spectacular. Highly recommended for any cybersecurity aspirant!",
        date: "July 16, 2026",
        verified: true
      },
      {
        id: "fb-3",
        name: "Ananya Deshmukh",
        role: "M.Sc. Digital Forensics Student",
        rating: 5,
        text: "Very clear explanation on roadmaps and certifications. I finally know whether to go for CEH or CHFI first.",
        date: "July 17, 2026",
        verified: true
      }
    ]
  }
];

export default function Webinar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedEventId = searchParams.get('event');
  const { user } = useAuth();
  
  const [localEvents, setLocalEvents] = useState<WebinarEvent[]>(WEBINARS_DATA);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);
  
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };
  
  // Custom feedback state
  const [newFeedback, setNewFeedback] = useState({
    name: '',
    role: '',
    rating: 5,
    text: ''
  });
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Active event mapping
  const currentEvent = localEvents.find(e => e.id === selectedEventId);

  // Auto-fill user name when available
  useEffect(() => {
    if (user?.displayName && !newFeedback.name) {
      setNewFeedback(prev => ({ ...prev, name: user.displayName || '' }));
    }
  }, [user]);

  // Load Firestore feedbacks for current event on change (Approved Feedbacks Only)
  useEffect(() => {
    if (!currentEvent) return;

    const fetchFirestoreFeedbacks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'webinar_feedbacks'));
        const dbFeedbacks: Feedback[] = [];
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const matchesEvent = data.eventId === currentEvent.id ||
            (data.eventSequence && Number(data.eventSequence) === Number(currentEvent.sequence)) ||
            (data.eventName && data.eventName.toLowerCase().includes(currentEvent.title.toLowerCase().slice(0, 15)));

          // Only display approved feedbacks publicly
          if (matchesEvent && (data.approved === true || data.status === 'approved')) {
            dbFeedbacks.push({
              id: docSnap.id,
              name: data.name || 'Anonymous Participant',
              role: data.role || 'Verified Participant',
              rating: Number(data.rating) || 5,
              text: data.text || '',
              date: data.date || 'Recently',
              verified: true,
              pinned: Boolean(data.pinned)
            });
          }
        });

        setLocalEvents(prevEvents => prevEvents.map(ev => {
          if (ev.id === currentEvent.id) {
            const initialFeedbacks = WEBINARS_DATA.find(w => w.id === currentEvent.id)?.feedbacks || [];
            const existingIds = new Set(initialFeedbacks.map(f => f.id));
            const newFromDb = dbFeedbacks.filter(f => !existingIds.has(f.id));
            const combined = [...newFromDb, ...initialFeedbacks];
            // Sort: Pinned comments strictly prioritized to the top
            combined.sort((a, b) => {
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;
              return 0;
            });
            return {
              ...ev,
              feedbacks: combined
            };
          }
          return ev;
        }));
      } catch (err) {
        console.warn('Could not fetch Firestore webinar feedbacks:', err);
      }
    };

    fetchFirestoreFeedbacks();
  }, [currentEvent?.id]);

  // Auto-scrolling and page title coordination
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFeedbackSuccess(false);
    setNewFeedback({
      name: user?.displayName || '',
      role: '',
      rating: 5,
      text: ''
    });
  }, [selectedEventId]);

  const selectEvent = (eventId: string | null) => {
    if (eventId) {
      setSearchParams({ event: eventId });
    } else {
      setSearchParams({});
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEvent?.isFeedbackClosed || !newFeedback.name.trim() || !newFeedback.text.trim() || !currentEvent) return;

    setSubmittingFeedback(true);

    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const feedbackObj: Feedback = {
      id: `fb-user-${Date.now()}`,
      name: newFeedback.name,
      role: newFeedback.role || 'Verified Participant',
      rating: newFeedback.rating,
      text: newFeedback.text,
      date: dateStr,
      verified: true
    };

    // Save to Firestore for Admin Review & Approval
    try {
      await addDoc(collection(db, 'webinar_feedbacks'), {
        eventId: currentEvent.id,
        eventSequence: currentEvent.sequence,
        eventName: currentEvent.title,
        name: newFeedback.name,
        role: newFeedback.role || 'Verified Participant',
        rating: newFeedback.rating,
        text: newFeedback.text,
        createdAt: new Date().toISOString(),
        date: dateStr,
        approved: false,
        status: 'pending',
        verified: true
      });
    } catch (err) {
      console.warn('Failed to persist feedback to Firestore:', err);
    }

    setFeedbackSuccess(true);
    setNewFeedback({
      name: user?.displayName || '',
      role: '',
      rating: 5,
      text: ''
    });
    setSubmittingFeedback(false);

    // Success fadeout timer
    setTimeout(() => {
      setFeedbackSuccess(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50/90 dark:bg-base py-6 sm:py-16 px-3.5 sm:px-6 relative overflow-hidden text-slate-900 dark:text-text-main">
      {/* Subtle top atmospheric wash for light and dark mode */}
      <div className="absolute inset-x-0 top-0 h-[32rem] bg-gradient-to-b from-sky-100/60 via-slate-100/40 to-transparent dark:from-cyan-950/20 dark:via-transparent dark:to-transparent pointer-events-none -z-10" />

      {/* Decorative cyber grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-20 pointer-events-none -z-10" />

      {/* Ambient background lights */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-sky-400/12 dark:bg-warning/5 rounded-full blur-[140px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-amber-400/12 dark:bg-amber-500/5 rounded-full blur-[140px] -z-10 animate-pulse" />

      <AnimatePresence mode="wait">
        {currentEvent ? (
          /* ========================================================================= */
          /* DETAILED SINGLE WEBINAR SCREEN                                           */
          /* ========================================================================= */
          <motion.div
            key={`detail-${currentEvent.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="w-full max-w-5xl mx-auto space-y-6 sm:space-y-8 relative z-10"
            id={`webinar-screen-${currentEvent.id}`}
          >
            <SEOManager 
              collectionName="webinars"
              docId={currentEvent?.id}
              initialData={currentEvent}
              fallbackTitle={`Webinar: ${currentEvent.title}`}
              fallbackDescription={`${currentEvent.subtitle || ''} Direct video capture, speaker credentials, and student feedbacks.`}
              keywords={`${(currentEvent.tags || []).join(', ')}, forenclue, digital forensics webinar`}
              canonicalPath={`/webinar?id=${currentEvent.id}`}
              fallbackImage={currentEvent?.bannerImage || currentEvent?.poster || currentEvent?.thumbnail || "/images/og/webinars.png"}
              breadcrumbs={[
                { name: 'Home', path: '/' },
                { name: 'Webinars', path: '/webinar' },
                { name: currentEvent.title, path: `/webinar?id=${currentEvent.id}` }
              ]}
            />

            {/* Premium Sticky-Ready Header Nav bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 dark:border-white/10 pb-4 sm:pb-6">
              <button
                onClick={() => selectEvent(null)}
                className="inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-sky-800 dark:text-warning hover:text-white dark:hover:text-crust bg-white dark:bg-surface hover:bg-sky-700 dark:hover:bg-warning border border-sky-300 dark:border-warning/30 hover:border-sky-700 dark:hover:border-warning px-3.5 py-2.5 rounded-xl cursor-pointer shadow-sm active:scale-95 transition-all w-full sm:w-auto"
              >
                <ArrowLeft size={14} />
                <span>Return to Webinars</span>
              </button>

              <div className="flex flex-wrap items-center justify-between sm:justify-end gap-2.5 sm:gap-3 w-full sm:w-auto">
                <a
                  href="#session-feedback-form"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('session-feedback-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-black uppercase tracking-wider text-white dark:text-black bg-sky-700 hover:bg-sky-800 dark:bg-warning dark:hover:bg-warning-dark px-3.5 py-2.5 rounded-xl cursor-pointer shadow-md shadow-sky-700/15 dark:shadow-warning/15 active:scale-95 transition-all flex-1 sm:flex-initial"
                >
                  <MessageSquare size={14} />
                  <span>Give Session Feedback</span>
                </a>

                <span className="text-[10px] font-mono bg-sky-100 dark:bg-warning/10 border border-sky-300 dark:border-warning/30 text-sky-900 dark:text-warning px-3 py-2 rounded-xl sm:rounded-full font-extrabold uppercase tracking-wider text-center shadow-2xs">
                  Session {currentEvent.sequence}
                </span>
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Left Column Area: YouTube & General description (2/3 width) */}
              <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                
                {/* Webinar Narrative Details */}
                <div className="bg-white dark:bg-crust border border-slate-200/95 dark:border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 sm:space-y-5 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.07)] dark:shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {currentEvent.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] sm:text-[10px] font-mono font-extrabold uppercase bg-sky-50 dark:bg-surface border border-sky-200/90 dark:border-white/10 px-2.5 py-1 rounded-lg text-sky-900 dark:text-text-muted"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-sky-800 dark:text-warning bg-sky-50/90 dark:bg-warning/10 border border-sky-200 dark:border-warning/20 px-2.5 py-1 rounded-lg">
                      <Calendar size={11} />
                      <span>{currentEvent.date} &bull; {currentEvent.time}</span>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-text-main uppercase tracking-tight leading-snug break-words">
                      Webinar {currentEvent.sequence}: {currentEvent.title}
                    </h1>
                    {currentEvent.subtitle && (
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-text-muted font-medium leading-relaxed">
                        {currentEvent.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Widescreen YouTube Video Player with Custom Border Accent */}
                <div className="bg-white dark:bg-crust border border-slate-200/95 dark:border-warning/20 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-[0_8px_30px_-4px_rgba(15,23,42,0.09)] dark:shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-600 via-amber-500 to-sky-600 dark:from-warning dark:via-amber-500 dark:to-warning" />
                  
                  {/* YouTube Embed Container or Poster */}
                  <div className={`w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 relative border border-slate-200 dark:border-black/30 flex items-center justify-center group ${
                    currentEvent.youtubeId 
                      ? 'aspect-video' 
                      : 'min-h-[460px] sm:min-h-[380px] sm:aspect-video'
                  }`}>
                    {currentEvent.youtubeId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${currentEvent.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                        title={`ForenClue Webinar: ${currentEvent.title}`}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : currentEvent.isUpcoming ? (
                      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950 min-h-[460px] sm:min-h-[380px]">
                        <img 
                          src={currentEvent.poster} 
                          alt={`Upcoming ForenClue Webinar: ${currentEvent.title}`} 
                          className="w-full h-full object-cover opacity-30 filter blur-[3px] scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/75 flex flex-col items-center justify-center p-4 sm:p-6 text-center space-y-3.5 sm:space-y-4 overflow-y-auto">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.15em] text-red-400 font-black shadow-lg animate-pulse">
                            <Radio size={12} className="text-red-400 animate-pulse" />
                            Upcoming Live Session
                          </span>

                          <div className="space-y-1.5 max-w-lg px-2">
                            <h3 className="text-base sm:text-2xl font-black text-white uppercase tracking-tight font-heading leading-snug">
                              {currentEvent.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-cyan-400 font-mono font-semibold">
                              {currentEvent.date} &bull; {currentEvent.time}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 w-full px-2 pt-1">
                            <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-950/80 border border-red-500/40 text-red-100 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-950/50">
                              <Youtube size={15} className="text-red-500 animate-pulse shrink-0" />
                              <span>YouTube Link: <span className="text-amber-400 font-mono font-black ml-1">Coming Soon</span></span>
                            </div>
                            <a
                              href="https://www.youtube.com/@forenclue"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/15 transition-all active:scale-95"
                            >
                              <Play size={12} className="fill-white shrink-0" />
                              <span>YouTube Channel</span>
                              <ExternalLink size={11} className="shrink-0" />
                            </a>
                            <span className="w-full sm:w-auto inline-flex items-center justify-center text-[10px] sm:text-[11px] font-mono text-zinc-200 bg-white/10 border border-white/15 px-3 py-2 rounded-xl">
                              Google Meet & Online
                            </span>
                          </div>

                          <p className="text-[10px] sm:text-xs text-zinc-300 font-mono tracking-wide max-w-md px-2 leading-relaxed">
                            🔴 Live stream & recording access will be enabled right here during broadcast.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img 
                          src={currentEvent.poster} 
                          alt={`ForenClue Webinar: ${currentEvent.title}`} 
                          className="w-full h-full object-cover opacity-95 dark:opacity-80"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="bg-sky-700 dark:bg-warning text-white dark:text-crust font-bold px-4 py-2 rounded-lg text-sm uppercase tracking-wider shadow-md">
                            Recent Event
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Operational strip banner */}
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 bg-slate-50 dark:bg-transparent border border-slate-200/80 dark:border-transparent rounded-xl text-[10px] font-mono text-slate-700 dark:text-text-muted tracking-widest uppercase">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full animate-pulse shrink-0 ${currentEvent.isUpcoming ? 'bg-amber-500' : 'bg-emerald-600 dark:bg-emerald-500'}`}></span>
                      <span className="truncate font-bold text-slate-800 dark:text-text-muted">
                        {currentEvent.isUpcoming 
                          ? 'Status: Live Stream Scheduled • YouTube Link: Coming Soon' 
                          : 'Status: High Definition Playback Enabled'}
                      </span>
                    </span>
                    <div className="flex items-center gap-3 shrink-0">
                      {currentEvent.youtubeId && (
                        <a
                          href={`https://youtu.be/${currentEvent.youtubeId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-extrabold transition-colors uppercase py-1 px-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 rounded-lg shadow-2xs"
                        >
                          <Youtube size={12} className="text-red-600 dark:text-red-500" />
                          <span>Watch on YouTube</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                      <span className="shrink-0 font-extrabold text-sky-800 dark:text-text-muted">Session {currentEvent.sequence}</span>
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE SESSION FEEDBACK SUBMISSION FORM */}
                <div id="session-feedback-form" className="bg-white dark:bg-crust border border-slate-200/95 dark:border-warning/30 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.07)] dark:shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-black uppercase text-slate-900 dark:text-text-main tracking-tight">
                        Session Feedback
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-text-muted font-medium">
                        Have you attended or watched "{currentEvent.title}"?
                      </p>
                    </div>
                  </div>

                  {currentEvent.isFeedbackClosed ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 sm:p-6 bg-slate-50/90 dark:bg-surface/80 border border-slate-200 dark:border-white/10 rounded-2xl text-center space-y-3"
                    >
                      <div className="w-12 h-12 bg-sky-100 dark:bg-warning/15 text-sky-700 dark:text-warning border border-sky-200 dark:border-transparent rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <Clock size={24} />
                      </div>
                      <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-text-main uppercase tracking-wider">
                        Session Feedback Form Closed
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-text-muted max-w-md mx-auto leading-relaxed font-medium">
                        Feedback submissions for "{currentEvent.title}" (Session {currentEvent.sequence}) are now closed. Thank you to all participants who submitted their feedback!
                      </p>
                    </motion.div>
                  ) : feedbackSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-5 sm:p-6 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-2xl text-center space-y-3"
                    >
                      <div className="w-12 h-12 bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                        <Check size={24} />
                      </div>
                      <h4 className="font-extrabold text-sm sm:text-base text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                        Thank You! Feedback Submitted for Review
                      </h4>
                      <p className="text-xs text-slate-700 dark:text-text-muted max-w-md mx-auto font-medium">
                        Your review for "{currentEvent.title}" has been submitted to the admin team. It will appear publicly on this page once verified and approved.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4 sm:space-y-5">
                      {/* Interactive Rating Selector */}
                      <div className="space-y-2">
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-text-muted">
                          Rate This Session <span className="text-sky-700 dark:text-warning">*</span>
                        </label>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer touch-manipulation"
                              title={`${star} Star${star > 1 ? 's' : ''}`}
                            >
                              <Star 
                                size={24} 
                                className={
                                  star <= (hoverRating || newFeedback.rating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-300 dark:text-zinc-600"
                                } 
                              />
                            </button>
                          ))}
                          <span className="text-xs font-mono text-sky-800 dark:text-warning font-bold ml-2 bg-sky-50 dark:bg-transparent border border-sky-200 dark:border-transparent px-2.5 py-0.5 rounded-md">
                            {hoverRating || newFeedback.rating} / 5 Stars
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* Full Name */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-text-muted">
                            Full Name <span className="text-sky-700 dark:text-warning">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={newFeedback.name}
                            onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })}
                            placeholder="e.g. Dr. Priya Sharma"
                            className="w-full bg-slate-50/90 focus:bg-white dark:bg-surface border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-text-main placeholder:text-slate-400 dark:placeholder:text-text-muted/60 focus:border-sky-600 dark:focus:border-warning focus:ring-2 focus:ring-sky-500/15 dark:focus:ring-0 focus:outline-none transition-all"
                          />
                        </div>

                        {/* College / Organization */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-text-muted">
                            University / Organization / Role
                          </label>
                          <input
                            type="text"
                            value={newFeedback.role}
                            onChange={(e) => setNewFeedback({ ...newFeedback, role: e.target.value })}
                            placeholder="e.g. NFSU Gandhinagar / Student"
                            className="w-full bg-slate-50/90 focus:bg-white dark:bg-surface border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-text-main placeholder:text-slate-400 dark:placeholder:text-text-muted/60 focus:border-sky-600 dark:focus:border-warning focus:ring-2 focus:ring-sky-500/15 dark:focus:ring-0 focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Feedback Comment */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-800 dark:text-text-muted">
                          Your Session Feedback & Takeaways <span className="text-sky-700 dark:text-warning">*</span>
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={newFeedback.text}
                          onChange={(e) => setNewFeedback({ ...newFeedback, text: e.target.value })}
                          placeholder="Share your thoughts on speaker insights, key learnings, or feedback on this masterclass..."
                          className="w-full bg-slate-50/90 focus:bg-white dark:bg-surface border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-text-main placeholder:text-slate-400 dark:placeholder:text-text-muted/60 focus:border-sky-600 dark:focus:border-warning focus:ring-2 focus:ring-sky-500/15 dark:focus:ring-0 focus:outline-none transition-all resize-none leading-relaxed"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                        <span className="text-[10px] text-slate-600 dark:text-text-muted font-mono font-medium">
                          * Submissions are verified and displayed publicly.
                        </span>
                        <button
                          type="submit"
                          disabled={submittingFeedback}
                          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-sky-700 hover:bg-sky-800 dark:bg-warning dark:hover:bg-warning-dark disabled:opacity-50 text-white dark:text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-sky-700/15 dark:shadow-warning/15 cursor-pointer"
                        >
                          <Send size={14} />
                          <span>{submittingFeedback ? 'Submitting...' : 'Submit Session Feedback'}</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* FEEDBACKS AND TESTIMONIALS SECTION */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3 sm:pb-4">
                    <MessageSquare className="text-sky-700 dark:text-warning w-5 h-5 shrink-0" />
                    <h2 className="text-sm sm:text-base font-black uppercase text-slate-900 dark:text-text-main tracking-wider">
                      Participant Feedbacks & Reviews ({currentEvent.feedbacks.length})
                    </h2>
                  </div>

                  {/* Reviews List - Horizontal Modern Slider */}
                  <div className="relative space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-600 dark:text-text-muted uppercase tracking-widest font-bold">
                        Slide or swipe to read reviews
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={scrollLeft}
                          className="p-2 sm:p-1.5 rounded-lg bg-white hover:bg-sky-50 dark:bg-surface dark:hover:bg-warning/10 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-text-main hover:text-sky-700 dark:hover:text-warning transition-colors active:scale-95 cursor-pointer touch-manipulation shadow-xs"
                          aria-label="Previous Review"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={scrollRight}
                          className="p-2 sm:p-1.5 rounded-lg bg-white hover:bg-sky-50 dark:bg-surface dark:hover:bg-warning/10 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-text-main hover:text-sky-700 dark:hover:text-warning transition-colors active:scale-95 cursor-pointer touch-manipulation shadow-xs"
                          aria-label="Next Review"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>

                    <div 
                      ref={sliderRef}
                      className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth -mx-3.5 px-3.5 sm:-mx-2 sm:px-2 touch-pan-x"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {currentEvent.feedbacks.map((item) => (
                        <div 
                          key={item.id}
                          className={`w-[82vw] max-w-[320px] sm:w-[350px] shrink-0 snap-start bg-white dark:bg-crust rounded-2xl p-4 sm:p-5 space-y-3 sm:space-y-4 relative overflow-hidden flex flex-col justify-between transition-all shadow-md dark:shadow-lg ${
                            item.pinned 
                              ? 'border-2 border-sky-600/80 dark:border-warning/80 bg-gradient-to-b from-sky-50/90 via-white to-white dark:from-warning/10 dark:via-crust dark:to-crust shadow-sky-600/10 dark:shadow-warning/10 ring-1 ring-sky-500/20 dark:ring-warning/30' 
                              : 'border border-slate-200/95 dark:border-white/5 hover:border-sky-400 dark:hover:border-warning/40'
                          }`}
                        >
                          {/* Pinned Tag */}
                          {item.pinned && (
                            <div className="absolute top-0 right-0 bg-sky-700 dark:bg-warning text-white dark:text-crust px-2.5 py-0.5 rounded-bl-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                              <Pin size={10} className="fill-current" />
                              <span>Pinned</span>
                            </div>
                          )}

                          {/* Top part: details */}
                          <div className="space-y-2.5 sm:space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className={`space-y-0.5 min-w-0 ${item.pinned ? 'pr-14' : ''}`}>
                                <h4 className="text-xs font-black text-slate-900 dark:text-text-main uppercase line-clamp-1">{item.name}</h4>
                                <p className="text-[10px] font-mono text-sky-700 dark:text-warning font-bold line-clamp-1">{item.role}</p>
                              </div>
                              {item.verified && (
                                <span className="text-[8px] tracking-wider font-mono bg-emerald-100/80 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/25 text-emerald-800 dark:text-emerald-400 px-1.5 py-0.5 rounded font-extrabold uppercase shrink-0">
                                  VERIFIED
                                </span>
                              )}
                            </div>

                            {/* Star display */}
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star 
                                  key={idx} 
                                  size={11} 
                                  className={idx < item.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-zinc-600"} 
                                />
                              ))}
                            </div>

                            <p className="text-xs text-slate-700 dark:text-text-muted leading-relaxed font-sans italic line-clamp-5">
                              "{item.text}"
                            </p>
                          </div>

                          {/* Footer details: Date */}
                          <div className="flex justify-between items-center border-t border-slate-200/80 dark:border-white/5 pt-3 text-[9px] font-mono text-slate-600 dark:text-text-muted font-semibold">
                            <span>Participant Feedback</span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Right Column: Poster Box & Host Bio (1/3 width) */}
              <div className="space-y-6 sm:space-y-8">
                
                {/* Distinguished Speaker Details */}
                <div className="bg-white dark:bg-crust border border-slate-200/95 dark:border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.07)] dark:shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-400/15 dark:bg-warning/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="text-center space-y-3 sm:space-y-4">
                    <span className="inline-block text-[9px] font-mono bg-sky-100 dark:bg-warning/10 border border-sky-300 dark:border-warning/25 text-sky-900 dark:text-warning px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest">
                      Speaker Profile
                    </span>

                    {/* Speaker Avatar */}
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-2xl overflow-hidden border-2 border-sky-500/40 dark:border-warning/30 bg-slate-100 dark:bg-surface shadow-md">
                      <img
                        src={currentEvent.speaker.avatar}
                        alt={currentEvent.speaker.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-text-main uppercase break-words">
                        {currentEvent.speaker.name}
                      </h4>
                      <p className="text-[11px] font-mono text-sky-700 dark:text-warning font-bold leading-snug break-words">
                        {currentEvent.speaker.role}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-text-muted leading-relaxed font-sans text-center italic border-t border-slate-200 dark:border-white/5 pt-4 font-medium">
                    "{currentEvent.speaker.bio}"
                  </p>

                  {/* LinkedIn social handle only */}
                  <div className="pt-1 sm:pt-2">
                    <a
                      href={currentEvent.speaker.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#0a66c2] hover:bg-[#004182] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Linkedin size={14} className="fill-white stroke-none" />
                      <span>LinkedIn Handle</span>
                      <ExternalLink size={12} className="opacity-80" />
                    </a>
                  </div>
                </div>

                {/* Visual Cover Poster Thumbnail */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono text-slate-700 dark:text-text-muted uppercase tracking-widest font-bold">
                    Official Session Poster
                  </span>
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200/95 dark:border-warning/20 bg-white dark:bg-black/40 shadow-md dark:shadow-xl">
                    <img 
                      src={currentEvent.poster} 
                      alt={`${currentEvent.title} Promotional Poster`}
                      className="w-full h-auto block"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

              </div>

            </div>

            {/* Quick Explore Navigation Footer to other webinars */}
            {localEvents.filter(ev => ev.id !== currentEvent.id).length > 0 && (
              <div className="space-y-4 pt-6 sm:pt-8 border-t border-slate-200 dark:border-white/10">
                <h3 className="text-xs font-mono uppercase tracking-widest text-sky-800 dark:text-warning font-black">
                  Explore Other Recorded Masterclasses
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {localEvents.filter(ev => ev.id !== currentEvent.id).map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => selectEvent(ev.id)}
                      className="bg-white dark:bg-crust border border-slate-200/95 dark:border-white/10 rounded-2xl p-5 hover:border-sky-500/60 dark:hover:border-warning/50 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between shadow-sm"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 text-[10px] font-mono text-sky-700 dark:text-warning font-bold">
                          <span className="bg-sky-50 dark:bg-transparent border border-sky-200 dark:border-transparent px-2 py-0.5 dark:p-0 rounded font-extrabold">WEBINAR {ev.sequence}</span>
                          <span className="text-slate-600 dark:text-warning">{ev.date}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-text-main uppercase group-hover:text-sky-700 dark:group-hover:text-warning transition-colors line-clamp-1">
                          {ev.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-text-muted line-clamp-2 leading-relaxed font-medium">
                          {ev.description}
                        </p>
                      </div>

                      <div className="border-t border-slate-200/80 dark:border-white/5 pt-3 mt-4 flex items-center justify-between">
                        <span className="text-[10px] text-slate-700 dark:text-text-muted font-mono font-semibold">
                          Host: {ev.speaker.name}
                        </span>
                        <span className="text-[10px] font-black text-sky-700 dark:text-warning uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Explore <Play size={10} className="fill-sky-700 dark:fill-warning" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        ) : (
          /* ========================================================================= */
          /* MAIN GRID LIST VIEW (ALL WEBINARS STRUCTURED)                             */
          /* ========================================================================= */
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-5xl mx-auto space-y-10 sm:space-y-12 relative z-10"
          >
            <SEOManager 
              collectionName="webinars"
              fallbackTitle="Webinars & Virtual Training Masterclasses"
              fallbackDescription="Register for live forensic workshops, browse professional video lectures, and master legal investigation frameworks directly from verified practitioners."
              keywords="Delhi Police forensics, finger print analysis webinars, forensics genetic lectures, cybersecurity events, forenclue webinars"
              canonicalPath="/webinar"
              fallbackImage="/images/og/webinars.png"
              breadcrumbs={[
                { name: 'Home', path: '/' },
                { name: 'Webinars', path: '/webinar' }
              ]}
              faqs={[
                { question: "How can I attend ForenClue webinars?", answer: "Register directly from our Webinars tab to receive stream access keys, interactive slides, and live Q&A entry codes." },
                { question: "Are webinars recorded for later playback?", answer: "Yes, registered students gain immediate playback access to the entire recorded session alongside reference PDF resources." }
              ]}
            />

            {/* Interactive Webinar Hub - Premium Hero Design */}
            <div className="relative text-center w-full max-w-5xl mx-auto pt-0 pb-0 px-4 flex flex-col items-center">
              
              {/* Main HEADING with glowing text and audio wave visualizer graphics on sides */}
              <div className="relative flex items-center justify-center gap-4 sm:gap-8 w-full max-w-3xl mb-4">
                
                {/* Left Sound Wave Graphic */}
                <div className="hidden md:flex items-end gap-1.5 h-16 opacity-95 dark:opacity-60">
                  <span className="w-[3.5px] h-4 bg-sky-600/60 dark:bg-cyan-500/40 rounded-full animate-pulse"></span>
                  <span className="w-[3.5px] h-8 bg-sky-600/85 dark:bg-cyan-500/60 rounded-full animate-pulse delay-75"></span>
                  <span className="w-[3.5px] h-14 bg-sky-700 dark:bg-cyan-400 rounded-full animate-pulse delay-150"></span>
                  <span className="w-[3.5px] h-8 bg-sky-600/85 dark:bg-cyan-500/60 rounded-full animate-pulse delay-300"></span>
                  <span className="w-[3.5px] h-4 bg-sky-600/60 dark:bg-cyan-500/40 rounded-full animate-pulse delay-500"></span>
                </div>

                {/* WEBINARS text with ultra-high-contrast gradient in light mode and neon glow in dark mode */}
                <h1 className="text-3xl min-[420px]:text-4xl sm:text-7xl md:text-8xl font-black tracking-wider sm:tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-slate-950 via-slate-900 to-sky-700 dark:from-white dark:via-cyan-100 dark:to-cyan-300 select-none relative z-10 drop-shadow-[0_2px_10px_rgba(2,132,199,0.16)] dark:drop-shadow-[0_0_20px_rgba(6,182,212,0.2)] font-sans">
                  WEBINARS
                </h1>

                {/* Right Sound Wave Graphic */}
                <div className="hidden md:flex items-end gap-1.5 h-16 opacity-95 dark:opacity-60">
                  <span className="w-[3.5px] h-4 bg-sky-600/60 dark:bg-cyan-500/40 rounded-full animate-pulse delay-500"></span>
                  <span className="w-[3.5px] h-8 bg-sky-600/85 dark:bg-cyan-500/60 rounded-full animate-pulse delay-300"></span>
                  <span className="w-[3.5px] h-14 bg-sky-700 dark:bg-cyan-400 rounded-full animate-pulse delay-150"></span>
                  <span className="w-[3.5px] h-8 bg-sky-600/85 dark:bg-cyan-500/60 rounded-full animate-pulse delay-75"></span>
                  <span className="w-[3.5px] h-4 bg-sky-600/60 dark:bg-cyan-500/40 rounded-full animate-pulse"></span>
                </div>
                
                {/* Subtle blue light flare behind the heading */}
                <div className="absolute inset-0 bg-sky-500/12 dark:bg-cyan-500/10 blur-3xl rounded-full -z-10 w-2/3 mx-auto"></div>
              </div>

              {/* Thin accent separator */}
              <div className="w-full max-w-xs sm:max-w-xl h-[2px] bg-gradient-to-r from-transparent via-sky-600/80 dark:via-cyan-500/50 to-transparent relative mb-6 sm:mb-8">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-sky-600 dark:bg-cyan-400 rounded-full blur-[5px]" />
              </div>

              {/* Sleek Horizontal Category Liner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl mb-2 border border-slate-200/95 dark:border-x-0 dark:border-y dark:border-cyan-500/10 py-4 sm:py-6 bg-white dark:bg-cyan-950/5 backdrop-blur-sm px-4 sm:px-6 rounded-2xl shadow-[0_6px_24px_-4px_rgba(15,23,42,0.06)] dark:shadow-none">
                
                {/* SESSIONS */}
                <div className="flex items-start gap-3 sm:gap-3.5 text-left group">
                  <div className="relative p-2.5 rounded-xl bg-sky-100/80 dark:bg-cyan-950/30 border border-sky-200 dark:border-cyan-500/20 shadow-2xs dark:shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:bg-sky-600 group-hover:border-sky-600 dark:group-hover:bg-cyan-950/50 dark:group-hover:border-cyan-400/40 shrink-0 transition-all">
                    <Play className="relative text-sky-700 group-hover:text-white dark:text-cyan-400 dark:group-hover:text-cyan-400 w-4 h-4 fill-sky-700/20 group-hover:fill-white/30 dark:fill-cyan-400/20 transition-colors" />
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-cyan-400 transition-colors">
                      Sessions
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-700 dark:text-zinc-400 leading-relaxed font-sans font-medium">
                      Live expert sessions covering industry insights, case studies, and emerging trends.
                    </p>
                  </div>
                </div>

                {/* WORKSHOPS */}
                <div className="flex items-start gap-3 sm:gap-3.5 text-left group border-t md:border-t-0 md:border-x border-slate-200 dark:border-cyan-500/10 pt-3.5 md:pt-0 md:px-6">
                  <div className="relative p-2.5 rounded-xl bg-sky-100/80 dark:bg-cyan-950/30 border border-sky-200 dark:border-cyan-500/20 shadow-2xs dark:shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:bg-sky-600 group-hover:border-sky-600 dark:group-hover:bg-cyan-950/50 dark:group-hover:border-cyan-400/40 shrink-0 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-700 group-hover:text-white dark:text-cyan-400 dark:group-hover:text-cyan-400 animate-[spin_15s_linear_infinite] transition-colors">
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-cyan-400 transition-colors">
                      Workshops
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-700 dark:text-zinc-400 leading-relaxed font-sans font-medium">
                      Hands-on interactive workshops designed to build practical skills and real-world expertise.
                    </p>
                  </div>
                </div>

                {/* SEMINARS */}
                <div className="flex items-start gap-3 sm:gap-3.5 text-left group border-t md:border-t-0 border-slate-200 dark:border-cyan-500/10 pt-3.5 md:pt-0">
                  <div className="relative p-2.5 rounded-xl bg-sky-100/80 dark:bg-cyan-950/30 border border-sky-200 dark:border-cyan-500/20 shadow-2xs dark:shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:bg-sky-600 group-hover:border-sky-600 dark:group-hover:bg-cyan-950/50 dark:group-hover:border-cyan-400/40 shrink-0 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-sky-700 group-hover:text-white dark:text-cyan-400 dark:group-hover:text-cyan-400 transition-colors">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-cyan-400 transition-colors">
                      Seminars
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-700 dark:text-zinc-400 leading-relaxed font-sans font-medium">
                      In-depth seminars on forensic science, technology, and professional development.
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* structured webinars listing card blocks */}
            <div className="space-y-6 sm:space-y-8" id="webinars-listing-block">
              {/* Redesigned grid with exact Webinar numbering formatting */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {localEvents.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectEvent(item.id)}
                    className="bg-white dark:bg-crust border border-slate-200/95 dark:border-white/10 rounded-2xl p-4 sm:p-5 hover:border-sky-500/70 dark:hover:border-warning/50 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.07)] hover:shadow-[0_14px_32px_-4px_rgba(2,132,199,0.16)] dark:shadow-none dark:hover:shadow-warning/[0.02] transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-3.5 sm:space-y-4">
                      
                      {/* Image Thumbnail inside grid card */}
                      <div className="aspect-[16/10] w-full bg-slate-100 dark:bg-surface rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 relative flex items-center justify-center">
                        <img 
                          src={item.poster}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-100 dark:opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent dark:from-black/75 dark:via-transparent dark:to-transparent" />

                        {/* Webinar Sequence Number Overlay & Upcoming Badge */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                          <span className="text-[9px] font-mono font-black uppercase bg-sky-700 dark:bg-warning text-white dark:text-crust px-2.5 py-1 rounded-md shadow-md">
                            WEBINAR {item.sequence}
                          </span>
                          {item.isUpcoming && (
                            <span className="text-[9px] font-mono font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded-md shadow flex items-center gap-1 animate-pulse">
                              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                              UPCOMING LIVE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info text block */}
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-sky-800 dark:text-warning font-bold bg-sky-50 dark:bg-transparent border border-sky-200/80 dark:border-transparent px-2.5 py-1 dark:p-0 rounded-md">
                          <Calendar size={11} className="text-sky-700 dark:text-warning shrink-0" />
                          <span>{item.date}</span>
                          <span className="text-slate-400 dark:text-text-muted">&bull;</span>
                          <span>{item.time}</span>
                        </div>

                        <h3 className="text-sm sm:text-[15px] font-extrabold text-slate-900 dark:text-text-main group-hover:text-sky-700 dark:group-hover:text-warning transition-colors uppercase line-clamp-2 leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-text-muted line-clamp-2 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      </div>

                    </div>

                    {/* Footer strip details inside card */}
                    <div className="border-t border-slate-200/90 dark:border-white/5 pt-3.5 mt-4 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <User size={12} className="text-sky-700 dark:text-text-muted shrink-0" />
                        <span className="text-[11px] text-slate-700 dark:text-text-muted font-mono font-semibold truncate max-w-[120px] sm:max-w-[150px]">
                          {item.speaker.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.isUpcoming && (
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border border-amber-200 dark:border-amber-400/20 px-2 py-0.5 rounded flex items-center gap-1">
                            <Youtube size={10} className="text-red-500" />
                            Coming Soon
                          </span>
                        )}
                        <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 group-hover:text-white bg-sky-50 group-hover:bg-sky-700 dark:bg-transparent dark:group-hover:bg-transparent dark:text-warning dark:group-hover:text-warning border border-sky-200 group-hover:border-sky-700 dark:border-transparent px-2.5 py-1 dark:p-0 rounded-lg flex items-center gap-1 transition-all">
                          Explore <Play size={10} className="fill-current" />
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
