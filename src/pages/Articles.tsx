import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  Calendar,
  Search,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  FileText,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import { SEO } from '@/components/layout/SEO';
import {
  FORENSIC_ARTICLES,
  getForensicArticleBySlug,
  ForensicArticle,
} from '@/data/forensicArticles';
import { EditorialAuthorCard } from '@/components/editorial/EditorialAuthorCard';

const CATEGORIES = [
  'All',
  'Legal & Evidence Procedure',
  'Forensic Toxicology',
  'Trace & Optical Analysis',
  'Analytical Chemistry',
  'Forensic Odontology',
  'Digital Forensics & Cyber',
] as const;

export default function Articles() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeArticle: ForensicArticle | undefined = useMemo(
    () => getForensicArticleBySlug(slug),
    [slug]
  );

  const filteredArticles = useMemo(() => {
    return FORENSIC_ARTICLES.filter((article) => {
      const matchesCat =
        selectedCategory === 'All' || article.category === selectedCategory;
      if (!matchesCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        article.title.toLowerCase().includes(q) ||
        article.abstract.toLowerCase().includes(q) ||
        article.category.toLowerCase().includes(q) ||
        article.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  if (slug && !activeArticle) {
    return (
      <main className="min-h-[70vh] py-20 px-4 max-w-4xl mx-auto text-center">
        <SEO
          title="Forensic Editorial Guides & Research Articles"
          description="Explore peer-reviewed forensic science and cybersecurity guides, laboratory protocols, and legal admissibility articles on ForenClue."
          canonicalPath="/articles"
        />
        <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase text-text-main mb-4">
          Editorial Guide Not Found
        </h1>
        <p className="text-text-muted mb-8 max-w-xl mx-auto">
          The requested forensic guide could not be located. Browse our complete directory of peer-reviewed forensic science and cybersecurity articles below.
        </p>
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-warning text-crust font-bold uppercase tracking-wider text-xs"
        >
          <ArrowLeft size={16} />
          <span>View All Forensic Guides</span>
        </Link>
      </main>
    );
  }

  if (activeArticle) {
    const otherArticles = FORENSIC_ARTICLES.filter(
      (a) => a.slug !== activeArticle.slug
    ).slice(0, 3);

    return (
      <main className="min-h-screen bg-base py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-text-main">
        <SEO
          title={activeArticle.title}
          description={activeArticle.metaDescription}
          keywords={activeArticle.keywords.join(', ')}
          canonicalPath={`/articles/${activeArticle.slug}`}
          image={activeArticle.heroImage}
          type="article"
          authorName={activeArticle.author.name}
          publishDate={activeArticle.publishedDate}
          modifiedDate={activeArticle.updatedDate}
          breadcrumbs={[
            { name: 'Home', path: '/' },
            { name: 'Forensic Guides', path: '/articles' },
            { name: activeArticle.shortTitle, path: `/articles/${activeArticle.slug}` },
          ]}
          customSchema={[
            {
              '@type': 'ScholarlyArticle',
              '@id': `https://forenclue.in/articles/${activeArticle.slug}#article`,
              headline: activeArticle.title,
              description: activeArticle.metaDescription,
              datePublished: activeArticle.publishedDate,
              dateModified: activeArticle.updatedDate,
              wordCount: activeArticle.wordCountEstimate,
              articleSection: activeArticle.category,
              inLanguage: 'en-IN',
              author: {
                '@type': 'Person',
                name: activeArticle.author.name,
                jobTitle: activeArticle.author.role,
              },
              reviewedBy: {
                '@type': 'Person',
                name: activeArticle.reviewer.name,
                jobTitle: activeArticle.reviewer.role,
              },
              publisher: {
                '@id': 'https://forenclue.in/#organization',
              },
              mainEntityOfPage: `https://forenclue.in/articles/${activeArticle.slug}`,
            },
          ]}
        />

        <article className="max-w-4xl mx-auto">
          {/* Breadcrumb & Back Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-black/10 dark:border-white/10"
          >
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-warning transition-colors"
            >
              <ArrowLeft size={15} />
              <span>All Forensic Editorial Guides</span>
            </Link>
            <div className="flex items-center gap-2 text-xs text-text-muted font-mono">
              <Link to="/" className="hover:text-warning">Home</Link>
              <span>/</span>
              <Link to="/articles" className="hover:text-warning">Articles</Link>
              <span>/</span>
              <span className="text-warning font-semibold truncate max-w-[200px]">
                {activeArticle.shortTitle}
              </span>
            </div>
          </nav>

          {/* Article Header */}
          <header className="space-y-5 mb-10">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="px-3 py-1 rounded-md bg-warning/15 border border-warning/30 text-warning font-bold uppercase tracking-wider">
                {activeArticle.category}
              </span>
              <span className="inline-flex items-center gap-1.5 text-text-muted tabular-nums">
                <Calendar size={13} className="text-warning" />
                Published: <time dateTime={activeArticle.publishedDate}>{activeArticle.publishedDate}</time>
              </span>
              <span className="text-text-muted">•</span>
              <span className="inline-flex items-center gap-1.5 text-text-muted tabular-nums">
                Updated: <time dateTime={activeArticle.updatedDate}>{activeArticle.updatedDate}</time>
              </span>
              <span className="text-text-muted">•</span>
              <span className="inline-flex items-center gap-1.5 text-text-muted tabular-nums">
                <Clock size={13} className="text-warning" />
                {activeArticle.readingTimeMinutes} min read (~{activeArticle.wordCountEstimate} words)
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-text-main leading-tight tracking-tight">
              {activeArticle.title}
            </h1>

            <p className="text-base sm:text-lg text-text-muted leading-relaxed border-l-4 border-warning pl-4 py-1 bg-surface/50 rounded-r-xl">
              {activeArticle.abstract}
            </p>

            {/* Byline Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/10 dark:border-white/10 text-xs">
              <div className="flex items-center gap-3">
                {activeArticle.author.image && (
                  <img
                    src={activeArticle.author.image}
                    alt={activeArticle.author.name}
                    className="w-10 h-10 rounded-full object-cover object-top border border-warning/40"
                  />
                )}
                <div>
                  <span className="font-bold text-text-main block">
                    By {activeArticle.author.name}
                  </span>
                  <span className="text-text-muted">
                    {activeArticle.author.role}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                <ShieldCheck size={15} />
                <span>Peer-Reviewed by {activeArticle.reviewer.name}</span>
              </div>
            </div>
          </header>

          {/* Learning Objectives Box */}
          <section
            aria-label="Key Learning Objectives"
            className="mb-10 rounded-2xl border border-black/10 dark:border-white/10 bg-surface p-6 sm:p-8"
          >
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-warning font-bold mb-4">
              <GraduationCap size={16} />
              <span>Curriculum Learning Objectives & Core Competencies</span>
            </div>
            <ul className="space-y-3">
              {activeArticle.learningObjectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-text-main leading-relaxed">
                  <CheckCircle2 size={16} className="text-warning shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Table of Contents */}
          <nav
            aria-label="Table of Contents"
            className="mb-12 rounded-2xl border border-black/10 dark:border-white/10 bg-surface/60 p-6"
          >
            <h2 className="text-xs font-mono uppercase tracking-wider text-text-muted font-bold mb-3">
              Article Contents & Methodology Sections
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {activeArticle.sections.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className="text-text-main hover:text-warning transition-colors font-medium flex items-center gap-2"
                  >
                    <ChevronRight size={14} className="text-warning shrink-0" />
                    <span>{sec.heading}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#references-and-citations"
                  className="text-text-main hover:text-warning transition-colors font-medium flex items-center gap-2"
                >
                  <ChevronRight size={14} className="text-warning shrink-0" />
                  <span>References, Statutes & Peer-Reviewed Citations</span>
                </a>
              </li>
            </ol>
          </nav>

          {/* Main Long-Form Editorial Sections */}
          <div className="space-y-12">
            {activeArticle.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 space-y-5"
              >
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-text-main tracking-tight border-b border-black/10 dark:border-white/10 pb-3">
                  {section.heading}
                </h2>

                {section.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-base sm:text-[17px] text-text-muted leading-[1.8] font-normal"
                  >
                    {p}
                  </p>
                ))}

                {section.keyFormulaOrProtocol && (
                  <div className="my-6 rounded-xl border border-warning/30 bg-warning/5 p-5">
                    <span className="text-xs font-mono uppercase tracking-wider text-warning font-bold block mb-2">
                      {section.keyFormulaOrProtocol.label}
                    </span>
                    <pre className="text-xs sm:text-sm font-mono text-text-main whitespace-pre-wrap leading-relaxed overflow-x-auto">
                      {section.keyFormulaOrProtocol.content}
                    </pre>
                  </div>
                )}

                {section.subheadings &&
                  section.subheadings.map((sub, sIdx) => (
                    <div key={sIdx} className="pl-0 sm:pl-4 space-y-3 pt-2">
                      <h3 className="text-lg sm:text-xl font-heading font-bold text-text-main">
                        {sub.title}
                      </h3>
                      {sub.paragraphs.map((sp, spIdx) => (
                        <p
                          key={spIdx}
                          className="text-base text-text-muted leading-[1.8]"
                        >
                          {sp}
                        </p>
                      ))}
                    </div>
                  ))}

                {section.bulletPoints && section.bulletPoints.length > 0 && (
                  <ul className="space-y-3 bg-surface p-6 rounded-2xl border border-black/10 dark:border-white/10">
                    {section.bulletPoints.map((bp, bIdx) => (
                      <li
                        key={bIdx}
                        className="flex items-start gap-3 text-sm sm:text-base text-text-main leading-relaxed"
                      >
                        <span className="w-2 h-2 rounded-full bg-warning mt-2.5 shrink-0" />
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* References & Citations */}
          <section
            id="references-and-citations"
            className="mt-14 pt-10 border-t border-black/10 dark:border-white/10"
          >
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-text-main mb-5 flex items-center gap-2">
              <FileText size={20} className="text-warning" />
              <span>Academic References, Laboratory Manuals & Statutory Citations</span>
            </h2>
            <ol className="space-y-3 list-decimal list-inside text-sm text-text-muted bg-surface p-6 rounded-2xl border border-black/10 dark:border-white/10">
              {activeArticle.references.map((ref, idx) => (
                <li key={idx} className="leading-relaxed">
                  <span className="font-semibold text-text-main">{ref.authors}</span> ({ref.year}).{' '}
                  <em>{ref.title}</em>. {ref.publication}.{' '}
                  {ref.url && (
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-warning hover:underline ml-1 font-medium"
                    >
                      <span>Source Record</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </section>

          {/* Interactive Platform Cross-Links */}
          <section className="mt-10 p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-surface/70">
            <h3 className="text-xs font-mono uppercase tracking-wider text-text-muted font-bold mb-4">
              Apply This Methodology on ForenClue
            </h3>
            <div className="flex flex-wrap gap-3">
              {activeArticle.relatedPaths.map((rp, i) => (
                <Link
                  key={i}
                  to={rp.path}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-base border border-black/10 dark:border-white/10 text-xs font-bold text-text-main hover:border-warning hover:text-warning transition-colors"
                >
                  <span>{rp.label}</span>
                  <ChevronRight size={14} className="text-warning" />
                </Link>
              ))}
            </div>
          </section>

          {/* Author Bio & Editorial Review Card */}
          <EditorialAuthorCard
            author={activeArticle.author}
            reviewer={activeArticle.reviewer}
            publishedDate={activeArticle.publishedDate}
            updatedDate={activeArticle.updatedDate}
            contextLabel="ForenClue Peer-Reviewed Forensic Science Publication"
          />

          {/* Further Reading */}
          <section className="mt-16 pt-12 border-t border-black/10 dark:border-white/10">
            <h2 className="text-2xl font-heading font-bold text-text-main mb-6">
              More Forensic Science & Cybersecurity Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherArticles.map((art) => (
                <Link
                  key={art.slug}
                  to={`/articles/${art.slug}`}
                  className="group rounded-2xl border border-black/10 dark:border-white/10 bg-surface p-6 flex flex-col justify-between hover:border-warning/40 transition-all"
                >
                  <div className="space-y-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-warning font-bold block">
                      {art.category}
                    </span>
                    <h3 className="text-base font-heading font-bold text-text-main group-hover:text-warning transition-colors leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                      {art.abstract}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-warning">
                    <span>{art.readingTimeMinutes} min read</span>
                    <span className="inline-flex items-center gap-1">
                      Read Guide <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </main>
    );
  }

  // Index View (/articles)
  const leadArticle = filteredArticles[0] || FORENSIC_ARTICLES[0];
  const remainingArticles = filteredArticles.slice(1);

  return (
    <main className="min-h-screen bg-base py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-text-main">
      <SEO
        title="Forensic Science & Cybersecurity Editorial Guides, SOPs & Research Articles"
        description="Read comprehensive, peer-reviewed forensic science and cybersecurity articles covering chain of custody under BSA 2023, postmortem toxicology, optical microscopy, UV-Vis spectrophotometry, forensic odontology, and DFIR."
        keywords="forensic science articles, forensic toxicology guide, chain of custody bsa 2023, optical microscopy criminalistics, uv vis spectrophotometry beer lambert law, forensic odontology bite mark analysis, digital forensics dfir"
        canonicalPath="/articles"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Forensic Guides & Articles', path: '/articles' },
        ]}
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header */}
        <header className="border-b border-black/10 dark:border-white/10 pb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-warning font-bold">
              <BookOpen size={15} />
              <span>ForenClue Peer-Reviewed Knowledge Base • Pune, India</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black uppercase tracking-tight text-text-main leading-none">
              Forensic <span className="text-warning">Editorial Guides</span> & Lab Manuals
            </h1>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              In-depth, academic forensic science and cybersecurity publications authored and reviewed by UGC-NET qualified faculty, forensic odontologists, and digital investigation specialists. Designed for B.Sc./M.Sc. Forensic Science curricula, UGC-NET/FACT preparation, and medico-legal practitioners.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search toxicology, BSA 2023, microscopy..."
                aria-label="Search forensic articles"
                className="w-full bg-surface border border-black/10 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-medium text-text-main placeholder-text-muted focus:outline-none focus:border-warning"
              />
            </div>
          </div>
        </header>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-colors shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-warning text-crust border-warning'
                  : 'bg-surface text-text-muted border-black/10 dark:border-white/10 hover:text-text-main'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lead Featured Monograph */}
        {leadArticle && (
          <section aria-label="Featured Editorial Publication">
            <div
              onClick={() => navigate(`/articles/${leadArticle.slug}`)}
              className="group rounded-3xl border border-black/10 dark:border-white/10 bg-surface p-6 sm:p-10 hover:border-warning/50 transition-all cursor-pointer shadow-lg"
            >
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono mb-4">
                <span className="px-3 py-1 rounded-md bg-warning text-crust font-bold uppercase tracking-wider">
                  Featured Monograph • {leadArticle.category}
                </span>
                <span className="text-text-muted tabular-nums">
                  Updated <time dateTime={leadArticle.updatedDate}>{leadArticle.updatedDate}</time>
                </span>
                <span className="text-text-muted">•</span>
                <span className="text-text-muted tabular-nums">
                  {leadArticle.readingTimeMinutes} min read (~{leadArticle.wordCountEstimate} words)
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-heading font-black text-text-main group-hover:text-warning transition-colors leading-tight mb-4">
                {leadArticle.title}
              </h2>

              <p className="text-sm sm:text-base text-text-muted leading-relaxed mb-6 max-w-4xl">
                {leadArticle.abstract}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 bg-base/60 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                {leadArticle.learningObjectives.slice(0, 4).map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-text-muted">
                    <CheckCircle2 size={14} className="text-warning shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/10 dark:border-white/10">
                <div className="flex items-center gap-3 text-xs">
                  {leadArticle.author.image && (
                    <img
                      src={leadArticle.author.image}
                      alt={leadArticle.author.name}
                      className="w-9 h-9 rounded-full object-cover object-top border border-warning/40"
                    />
                  )}
                  <div>
                    <span className="font-bold text-text-main block">
                      {leadArticle.author.name}
                    </span>
                    <span className="text-text-muted">
                      {leadArticle.author.role} • Reviewed by {leadArticle.reviewer.name}
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-warning group-hover:translate-x-1 transition-transform">
                  <span>Read Full Publication</span>
                  <ChevronRight size={16} />
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Articles Grid */}
        <section aria-label="All Forensic Science Editorial Guides">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(remainingArticles.length > 0 ? remainingArticles : FORENSIC_ARTICLES).map(
              (article) => (
                <article
                  key={article.slug}
                  onClick={() => navigate(`/articles/${article.slug}`)}
                  className="group rounded-2xl border border-black/10 dark:border-white/10 bg-surface p-6 sm:p-7 flex flex-col justify-between hover:border-warning/40 transition-all cursor-pointer shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-warning font-bold uppercase tracking-wider">
                        {article.category}
                      </span>
                      <span className="text-text-muted tabular-nums">
                        {article.readingTimeMinutes} min read
                      </span>
                    </div>

                    <h2 className="text-xl font-heading font-bold text-text-main group-hover:text-warning transition-colors leading-snug">
                      <Link
                        to={`/articles/${article.slug}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-sm text-text-muted leading-relaxed line-clamp-4">
                      {article.abstract}
                    </p>
                  </div>

                  <div className="pt-5 mt-6 border-t border-black/10 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs text-text-muted">
                      <span className="font-semibold text-text-main">
                        {article.author.name}
                      </span>
                      <time dateTime={article.updatedDate} className="font-mono tabular-nums">
                        {article.updatedDate}
                      </time>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-warning">
                      <span>~{article.wordCountEstimate} Words • With Citations</span>
                      <ChevronRight
                        size={15}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        </section>

        {/* Editorial Standards & Peer Review Statement */}
        <EditorialAuthorCard
          contextLabel="ForenClue Editorial Board & Peer-Review Standards"
          publishedDate="January 2026"
          updatedDate="March 2026"
        />
      </div>
    </main>
  );
}
