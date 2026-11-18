import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, ExternalLink, Award, CheckCircle2 } from 'lucide-react';

export interface EditorialAuthorInfo {
  name: string;
  role: string;
  credentials: string;
  bio: string;
  image?: string;
  linkedin?: string;
  profilePath?: string;
}

export interface EditorialReviewerInfo {
  name: string;
  role: string;
  credentials: string;
  linkedin?: string;
}

interface EditorialAuthorCardProps {
  author?: EditorialAuthorInfo;
  reviewer?: EditorialReviewerInfo;
  publishedDate?: string;
  updatedDate?: string;
  contextLabel?: string;
}

export const DEFAULT_EDITORIAL_AUTHOR: EditorialAuthorInfo = {
  name: 'Rajat Pithadia',
  role: 'Academic Mentor & Senior Forensic Science Editor',
  credentials: 'M.Sc. (Forensic Chemistry, Toxicology & Pharmacology) • UGC-NET & GSET Qualified • Ph.D. Scholar • Assistant Professor, Parul University',
  bio: 'Rajat Pithadia is an Assistant Professor of Forensic Science, published Wiley author, and Ph.D. researcher specializing in analytical toxicology, genotoxicity, and instrumental criminalistics. He oversees curriculum accuracy and laboratory protocol validation at ForenClue.',
  image: 'https://blogger.googleusercontent.com/img/a/AVvXsEiseuO8LFJ74UtogyoZLu5orh44gH7WVqDM4oinlMLhD3u4grQKoinTCZYk-OfKJrXJjV8E9EZHoPbhefI60LoXmqO623wQXiv-4hXumhYmBrBJCh4HYvYk9ifZ4nSccrYe5qyJHQXAQvW_8Zgkdq3T7vCycYqiJy0aUSZYzhmqc8M12jhhUq3X1GoORws',
  linkedin: 'https://www.linkedin.com/in/rajatresearch',
  profilePath: '/about#rajat-pithadia',
};

export const DEFAULT_EDITORIAL_REVIEWER: EditorialReviewerInfo = {
  name: 'Tejas Tapse',
  role: 'Founder & CEO, ForenClue Ventures',
  credentials: 'Forensic Science & Cybersecurity Educator • MSME Udyam Registered Platform Lead (Pune, India)',
  linkedin: 'https://www.linkedin.com/in/ttapse12/',
};

export function EditorialAuthorCard({
  author = DEFAULT_EDITORIAL_AUTHOR,
  reviewer = DEFAULT_EDITORIAL_REVIEWER,
  publishedDate = 'January 15, 2026',
  updatedDate = 'March 20, 2026',
  contextLabel = 'Academic & Editorial Review Dossier',
}: EditorialAuthorCardProps) {
  return (
    <aside
      aria-label="Author credentials and editorial review disclosure"
      className="mt-12 rounded-2xl border border-black/10 dark:border-white/10 bg-surface p-6 sm:p-8 text-left shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-warning font-bold">
          <ShieldCheck size={16} className="text-warning shrink-0" />
          <span>{contextLabel}</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted font-mono tabular-nums">
          <span>Published: <time>{publishedDate}</time></span>
          <span>•</span>
          <span>Reviewed & Updated: <time>{updatedDate}</time></span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {author.image && (
          <img
            src={author.image}
            alt={author.name}
            loading="lazy"
            className="w-20 h-20 rounded-2xl object-cover object-top border border-warning/30 shrink-0 bg-base"
          />
        )}
        <div className="space-y-2.5 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-text-muted block">
                Primary Author & Subject Matter Specialist
              </span>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-text-main">
                {author.name}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-base text-xs font-semibold text-text-main hover:border-warning/40 hover:text-warning transition-colors"
                >
                  <span>Verified Profile</span>
                  <ExternalLink size={12} />
                </a>
              )}
              <Link
                to={author.profilePath || '/about'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-warning/30 bg-warning/10 text-xs font-semibold text-warning hover:bg-warning hover:text-crust transition-colors"
              >
                <BookOpen size={12} />
                <span>Editorial Board</span>
              </Link>
            </div>
          </div>

          <p className="text-xs font-semibold text-warning leading-snug">
            {author.role} — {author.credentials}
          </p>

          <p className="text-sm text-text-muted leading-relaxed">
            {author.bio}
          </p>
        </div>
      </div>

      {reviewer && (
        <div className="mt-6 pt-5 border-t border-black/10 dark:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-text-muted">
          <div className="flex items-start gap-2.5">
            <Award size={16} className="text-warning shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-text-main block">
                Editorial Verification: {reviewer.name} ({reviewer.role})
              </span>
              <span>{reviewer.credentials}</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-text-main block">
                ForenClue Academic Integrity Standard
              </span>
              <span>
                Compiled strictly for university-level forensic science, criminalistics, and legal education using peer-reviewed literature, DFSS manuals, and appellate judicial records.
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
