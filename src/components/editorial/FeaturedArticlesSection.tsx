import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, ChevronRight, ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { FORENSIC_ARTICLES } from '@/data/forensicArticles';

export function FeaturedArticlesSection() {
  const leadArticle = FORENSIC_ARTICLES[0];
  const secondaryArticles = FORENSIC_ARTICLES.slice(1, 5);

  return (
    <section
      aria-labelledby="home-editorial-guides-heading"
      className="py-16 sm:py-20 bg-base border-b border-black/10 dark:border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/10 dark:border-white/10 pb-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-warning font-bold">
              <BookOpen size={14} />
              <span>Peer-Reviewed Forensic Science & Cybersecurity Publication</span>
            </div>
            <h2
              id="home-editorial-guides-heading"
              className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tight text-text-main"
            >
              Featured <span className="text-warning">Forensic Guides</span> & Research Methodology
            </h2>
            <p className="text-sm sm:text-base text-text-muted leading-relaxed">
              Study comprehensive, citation-backed laboratory manuals and statutory guides authored by UGC-NET qualified forensic faculty, odontologists, and digital forensics specialists.
            </p>
          </div>

          <Link
            to="/articles"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-warning text-crust font-black uppercase tracking-wider text-xs shrink-0 hover:bg-warning-dark transition-colors"
          >
            <span>Browse All {FORENSIC_ARTICLES.length} Editorial Guides</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Asymmetric Editorial Layout: Lead Monograph + 4 Structured Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Lead Monograph (Left 7 cols) */}
          <article className="lg:col-span-7 rounded-2xl border border-black/10 dark:border-white/10 bg-surface p-6 sm:p-8 flex flex-col justify-between hover:border-warning/40 transition-all shadow-sm">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-warning/15 border border-warning/30 text-warning font-bold uppercase">
                  {leadArticle.category}
                </span>
                <span className="text-text-muted inline-flex items-center gap-1 tabular-nums">
                  <Clock size={12} className="text-warning" />
                  {leadArticle.readingTimeMinutes} min read (~{leadArticle.wordCountEstimate} words)
                </span>
                <span className="text-text-muted tabular-nums">
                  Updated <time dateTime={leadArticle.updatedDate}>{leadArticle.updatedDate}</time>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-text-main leading-snug hover:text-warning transition-colors">
                <Link to={`/articles/${leadArticle.slug}`}>
                  {leadArticle.title}
                </Link>
              </h3>

              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                {leadArticle.abstract}
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-text-muted font-bold block">
                  Core Topics Covered:
                </span>
                <ul className="space-y-1.5">
                  {leadArticle.learningObjectives.slice(0, 3).map((obj, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-text-main flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs">
                {leadArticle.author.image && (
                  <img
                    src={leadArticle.author.image}
                    alt={leadArticle.author.name}
                    loading="lazy"
                    className="w-9 h-9 rounded-full object-cover object-top border border-warning/40"
                  />
                )}
                <div>
                  <span className="font-bold text-text-main block">
                    {leadArticle.author.name} ({leadArticle.author.role})
                  </span>
                  <span className="text-text-muted inline-flex items-center gap-1">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    Peer-Reviewed by {leadArticle.reviewer.name}
                  </span>
                </div>
              </div>

              <Link
                to={`/articles/${leadArticle.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-warning hover:underline"
              >
                <span>Read Complete Guide</span>
                <ChevronRight size={15} />
              </Link>
            </div>
          </article>

          {/* Secondary Editorial Stack (Right 5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            {secondaryArticles.map((article) => (
              <article
                key={article.slug}
                className="rounded-2xl border border-black/10 dark:border-white/10 bg-surface p-5 hover:border-warning/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                    <span className="text-warning font-bold uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="text-text-muted tabular-nums">
                      {article.readingTimeMinutes} min read • {article.updatedDate}
                    </span>
                  </div>

                  <h3 className="text-base font-heading font-bold text-text-main hover:text-warning transition-colors leading-snug">
                    <Link to={`/articles/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                    {article.abstract}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs">
                  <span className="text-text-muted font-medium">
                    By <strong className="text-text-main">{article.author.name}</strong>
                  </span>
                  <Link
                    to={`/articles/${article.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-warning hover:underline"
                  >
                    <span>Read Article</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
