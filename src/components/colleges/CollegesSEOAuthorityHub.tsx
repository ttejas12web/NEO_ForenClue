import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  GraduationCap,
  IndianRupee,
  ShieldCheck,
  Award,
  ChevronRight,
  ChevronDown,
  Search,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { College } from '@/types/college';
import { cn } from '@/lib/utils';

export interface ActiveCollegeFilters {
  searchQuery: string;
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
  selectedType: string;
  selectedDegree: string;
  selectedFeeRange: string;
  featuredOnly: boolean;
}

export interface CollegesSEOAuthorityHubProps {
  colleges: College[];
  filteredColleges: College[];
  activeFilters: ActiveCollegeFilters;
  parseNumericMinFee: (college: College) => number;
  formatFee: (feeStr?: string, country?: string) => string;
  getDisplayInstitutionType: (college: College) => string;
  onApplyPreset: (preset: Partial<ActiveCollegeFilters>) => void;
  onSelectCollege: (college: College) => void;
}

const isMscCourse = (name: string, level: string) =>
  level.toLowerCase() === 'master' ||
  /\bm\.?\s*sc\b|\bm\.?\s*tech\b|\bm\.?\s*a\b|\bmaster/i.test(name);

const isBscCourse = (name: string, level: string) =>
  level.toLowerCase() === 'bachelor' ||
  /\bb\.?\s*sc\b|\bb\.?\s*tech\b|\bbachelor|integrated/i.test(name);

const isDelhiNcrCollege = (c: College) => {
  const hay = `${c.city || ''} ${c.state || ''} ${c.address || ''} ${c.name || ''}`.toLowerCase();
  return (
    hay.includes('delhi') ||
    hay.includes('rohini') ||
    hay.includes('noida') ||
    hay.includes('gurugram') ||
    hay.includes('gurgaon') ||
    hay.includes('faridabad') ||
    hay.includes('ghaziabad') ||
    hay.includes('ncr')
  );
};

export function buildDynamicCollegesSEO(
  colleges: College[],
  filteredColleges: College[],
  filters: ActiveCollegeFilters,
  parseNumericMinFee: (college: College) => number,
  formatFee: (feeStr?: string, country?: string) => string
) {
  const {
    searchQuery,
    selectedCountry,
    selectedState,
    selectedCity,
    selectedType,
    selectedDegree,
    selectedFeeRange,
  } = filters;

  const qLower = searchQuery.trim().toLowerCase();

  // Compute real spotlight subsets from the actual database/service list
  const delhiColleges = colleges.filter(isDelhiNcrCollege);
  const privateMscColleges = colleges.filter(
    (c) =>
      (!c.country || c.country.toLowerCase() === 'india') &&
      (c.type === 'Private' || c.type === 'Deemed' || c.type === 'Deemed University') &&
      (c.coursesOffered || []).some((cr) => isMscCourse(cr.name, cr.degreeLevel))
  );
  const mscUnder50kColleges = colleges
    .filter(
      (c) =>
        (!c.country || c.country.toLowerCase() === 'india') &&
        (c.coursesOffered || []).some((cr) => isMscCourse(cr.name, cr.degreeLevel)) &&
        parseNumericMinFee(c) <= 50000
    )
    .sort((a, b) => parseNumericMinFee(a) - parseNumericMinFee(b));

  const govtColleges = colleges.filter(
    (c) =>
      (!c.country || c.country.toLowerCase() === 'india') &&
      ['Government', 'Central', 'State', 'Institute of National Importance'].includes(c.type)
  );

  // Dynamic Title & Description based on active search or filter intent
  let title =
    'Top Forensic Science Colleges in India (2026) – B.Sc & M.Sc Fees, Govt, Private & NFSU';
  let description = `Compare ${colleges.length || 120}+ verified B.Sc. & M.Sc. Forensic Science colleges in India (Delhi NCR, Mumbai, Bangalore, NFSU, Govt & Private). Check M.Sc. Forensic Science colleges under ₹50,000 fees, CUET-PG/NFAT eligibility & placements.`;

  if (
    selectedState.toLowerCase().includes('delhi') ||
    selectedCity.toLowerCase().includes('delhi') ||
    (qLower.includes('delhi') && qLower.includes('forensic'))
  ) {
    const names = delhiColleges
      .slice(0, 4)
      .map((c) => c.shortName || c.name)
      .join(', ');
    title = 'Top Forensic Science Colleges in Delhi NCR (2026) – NFSU, Govt & Private Fees';
    description = `Explore the top forensic science colleges in Delhi & NCR including ${
      names || 'NFSU Delhi Campus, LNJN NICFS Rohini, Amity Noida & Galgotias'
    }. Compare B.Sc. & M.Sc. Forensic Science fees, CUET/NFAT admission & eligibility.`;
  } else if (
    (selectedType === 'Private' && selectedDegree === 'Master') ||
    (qLower.includes('private') && qLower.includes('msc'))
  ) {
    const names = privateMscColleges
      .slice(0, 4)
      .map((c) => c.shortName || c.name)
      .join(', ');
    title = 'Best Private M.Sc. Forensic Science Colleges in India (2026) – Fees, NAAC & Placements';
    description = `Discover the best private M.Sc. Forensic Science colleges in India (${
      names || 'Jain University, Amity, Chandigarh University, LPU, Kristu Jayanti'
    }). Compare annual tuition fees, specializations, NAAC grades & direct admission.`;
  } else if (
    selectedFeeRange === 'under-50k' &&
    (selectedDegree === 'Master' || qLower.includes('msc'))
  ) {
    const names = mscUnder50kColleges
      .slice(0, 4)
      .map((c) => c.shortName || c.name)
      .join(', ');
    title = 'Best M.Sc. Forensic Science Colleges Under ₹50,000 in India – Low Fee Govt Universities';
    description = `Complete list of the best M.Sc. Forensic Science colleges under ₹50,000 annual fees in India including ${
      names || 'IFSC Mumbai, GIFS Nagpur, Osmania University, Punjabi University & Pondicherry University'
    }.`;
  } else if (selectedFeeRange === 'under-50k') {
    title = 'Best Forensic Science Colleges Under ₹50,000 Fees in India – B.Sc & M.Sc Govt Institutes';
    description =
      'Find affordable B.Sc. and M.Sc. Forensic Science colleges in India with annual tuition fees under ₹50,000 across central, state government, and autonomous universities.';
  } else if (selectedCity !== 'All' || selectedState !== 'All') {
    const loc = selectedCity !== 'All' ? `${selectedCity}, ${selectedState !== 'All' ? selectedState : 'India'}` : selectedState;
    const degLabel =
      selectedDegree === 'Master'
        ? 'M.Sc. '
        : selectedDegree === 'Bachelor'
        ? 'B.Sc. '
        : 'B.Sc. & M.Sc. ';
    title = `Top ${degLabel}Forensic Science Colleges in ${loc} (2026) – Fees, Courses & Admission`;
    description = `Explore ${filteredColleges.length} verified ${degLabel}Forensic Science colleges and universities in ${loc}. Compare government & private tuition fees, entrance exams, and eligibility criteria.`;
  } else if (selectedType !== 'All' || selectedDegree !== 'All') {
    const typeLabel = selectedType !== 'All' ? `${selectedType} ` : 'Top ';
    const degLabel =
      selectedDegree === 'Master'
        ? 'M.Sc. Forensic Science '
        : selectedDegree === 'Bachelor'
        ? 'B.Sc. Forensic Science '
        : 'Forensic Science ';
    const locLabel = selectedCountry !== 'All' ? selectedCountry : 'India';
    title = `Best ${typeLabel}${degLabel}Colleges in ${locLabel} (2026) – Fees & Eligibility`;
    description = `Compare ${filteredColleges.length} accredited ${typeLabel.toLowerCase()}${degLabel}colleges in ${locLabel}. Review annual tuition fees, course duration, NAAC accreditation, and admission process.`;
  }

  const keywords = [
    'top forensic science college in delhi',
    'top forensic science colleges in delhi ncr',
    'best private msc forensic science college in india',
    'best private msc forensic science colleges in india',
    'best msc forensic science college under 50,000',
    'best msc forensic science college under 50000',
    'msc forensic science colleges under 50k fees in india',
    'low fee msc forensic science colleges in india',
    'government forensic science colleges in india',
    'top bsc forensic science colleges in india',
    'best bsc forensic science college in delhi',
    'nfsu delhi admission fees',
    'national forensic sciences university campuses',
    'lnjn nicfs rohini delhi forensic science',
    'government institute of forensic science mumbai nagpur aurangabad',
    'cuet pg msc forensic science colleges list',
    'nfat exam colleges in india',
    'cyber forensics colleges in india',
    'forensic science colleges in maharashtra karnataka gujarat kerala tamil nadu',
    'forenclue colleges directory',
  ].join(', ');

  // Build data-backed FAQ answers using real colleges from the directory
  const delhiAnswerList =
    delhiColleges.length > 0
      ? delhiColleges
          .slice(0, 6)
          .map(
            (c) =>
              `${c.name} (${c.city} – ${c.type}, Fees: ${formatFee(c.feesRange, c.country) || 'Check campus'})`
          )
          .join('; ')
      : 'National Forensic Sciences University (NFSU) Delhi Campus (LNJN NICFS, Rohini), University of Delhi (Department of Anthropology), Amity University Noida, Galgotias University Greater Noida, Sharda University, and SGT University Gurugram';

  const privateMscAnswerList =
    privateMscColleges.length > 0
      ? privateMscColleges
          .slice(0, 7)
          .map(
            (c) =>
              `${c.name} (${c.city}, ${c.state} – Fees: ${formatFee(c.feesRange, c.country) || 'Contact institute'})`
          )
          .join('; ')
      : 'Jain (Deemed-to-be University) Bangalore, Amity University Noida, Chandigarh University Mohali, Lovely Professional University (LPU), Kristu Jayanti College Bengaluru, Galgotias University Greater Noida, and Parul University Vadodara';

  const under50kAnswerList =
    mscUnder50kColleges.length > 0
      ? mscUnder50kColleges
          .slice(0, 7)
          .map(
            (c) =>
              `${c.name} (${c.city}, ${c.state} – Annual Fee: ${formatFee(c.feesRange, c.country) || 'Under ₹50,000'})`
          )
          .join('; ')
      : 'Institute of Forensic Science Mumbai (₹6,000–₹15,000/yr), Government Institute of Forensic Science Nagpur & Chhatrapati Sambhajinagar (₹5,000–₹15,000/yr), Osmania University Hyderabad (₹15,000–₹35,000/yr), Punjabi University Patiala (₹25,000–₹45,000/yr), Pondicherry University (₹25,000–₹45,000/yr), and Gujarat University Ahmedabad (₹20,000–₹48,000/yr)';

  const govtAnswerList =
    govtColleges.length > 0
      ? govtColleges
          .slice(0, 7)
          .map((c) => `${c.name} (${c.city}, ${c.state})`)
          .join('; ')
      : 'National Forensic Sciences University (NFSU Gandhinagar, Delhi, Goa, Tripura, Bhopal, Pune, Dharwad, Guwahati), Rashtriya Raksha University (RRU), Banaras Hindu University (BHU), Dr. Harisingh Gour Vishwavidyalaya Sagar, and Government Institutes of Forensic Science (Mumbai, Nagpur, Aurangabad)';

  const faqs = [
    {
      question: 'Which is the top forensic science college in Delhi and Delhi NCR?',
      answer: `The top forensic science colleges in Delhi and Delhi NCR are: ${delhiAnswerList}. For government-accredited postgraduate and undergraduate education in Delhi, NFSU Delhi Campus (LNJN National Institute of Criminology and Forensic Science, Rohini) and University of Delhi are the premier public institutions, while Amity University Noida, Galgotias University, and SGT University are top private options in NCR.`,
    },
    {
      question: 'Which is the best private M.Sc. Forensic Science college in India?',
      answer: `The best private M.Sc. Forensic Science colleges in India with NAAC accreditation, dedicated crime scene labs, and placement support include: ${privateMscAnswerList}. Students can filter by "Private University" and "Master (M.Sc.)" on the ForenClue /colleges directory to compare exact tuition fees and specializations.`,
    },
    {
      question: 'Which is the best M.Sc. Forensic Science college under 50,000 fees in India?',
      answer: `The best M.Sc. Forensic Science colleges in India with annual tuition fees under ₹50,000 include top central and state government universities: ${under50kAnswerList}. You can select the "Under ₹50,000 / year" fee filter and "Master (M.Sc.)" degree filter on ForenClue to view all low-fee colleges.`,
    },
    {
      question: 'Which are the top Government B.Sc. and M.Sc. Forensic Science colleges in India?',
      answer: `India's top government forensic science universities and institutes include: ${govtAnswerList}. Admission to these government colleges is primarily through NFAT (National Forensic Admission Test), CUET-UG, CUET-PG, or state merit lists.`,
    },
    {
      question: 'What entrance exams are required for B.Sc. and M.Sc. Forensic Science admission in India?',
      answer:
        'For National Forensic Sciences University (NFSU) campuses, admission is conducted through NFAT (National Forensic Admission Test). Central and state universities such as BHU, Delhi University, Pondicherry University, and Dr. Harisingh Gour University accept CUET-PG and CUET-UG scores. Private universities accept AIFSET, CUET, or their own university entrance tests.',
    },
    {
      question: 'How can I compare forensic science college fees, courses, and city locations on ForenClue?',
      answer:
        'Use the ForenClue /colleges directory ("Your City, Your College") to filter institutions by State, City, Institution Type (Government, NFSU, Central, State, Private), Degree Level (B.Sc., M.Sc., Ph.D., PG Diploma), and Annual Fee Budget (Under ₹50,000, ₹50k–₹1L, ₹1L–₹2L), or click "Compare" on up to 4 colleges for a side-by-side matrix.',
    },
  ];

  const sourceList = filteredColleges.length > 0 ? filteredColleges : colleges;

  const customSchema = [
    {
      '@type': 'CollectionPage',
      '@id': 'https://forenclue.in/colleges#collectionpage',
      name: title,
      description,
      url: 'https://forenclue.in/colleges',
      about: [
        'Top Forensic Science College in Delhi',
        'Best Private M.Sc. Forensic Science College in India',
        'Best M.Sc. Forensic Science College Under 50,000',
        'Government Forensic Science Colleges in India',
        'NFSU Campuses Admission and Fees',
      ],
    },
    {
      '@type': 'ItemList',
      '@id': 'https://forenclue.in/colleges#directory-list',
      name: title,
      description,
      numberOfItems: sourceList.length,
      itemListElement: sourceList.slice(0, 40).map((c, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `https://forenclue.in/colleges/${c.id}`,
        name: c.name,
        item: {
          '@type': 'CollegeOrUniversity',
          '@id': `https://forenclue.in/colleges/${c.id}#college`,
          name: c.name,
          alternateName: c.shortName || undefined,
          url: `https://forenclue.in/colleges/${c.id}`,
          description: `${c.name} (${c.city}, ${c.state || c.country}) – ${c.type} offering ${(c.coursesOffered || [])
            .map((cr) => cr.name)
            .slice(0, 4)
            .join(', ')}. Annual Fee: ${formatFee(c.feesRange, c.country) || 'Contact University'}.`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: c.city,
            addressRegion: c.state,
            addressCountry: c.country || 'India',
          },
        },
      })),
    },
  ];

  return {
    title,
    description,
    keywords,
    faqs,
    customSchema,
    spotlights: {
      delhiColleges,
      privateMscColleges,
      mscUnder50kColleges,
      govtColleges,
    },
  };
}

export function CollegesSEOAuthorityHub({
  colleges,
  filteredColleges,
  activeFilters,
  parseNumericMinFee,
  formatFee,
}: CollegesSEOAuthorityHubProps) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const seoBundle = useMemo(
    () =>
      buildDynamicCollegesSEO(
        colleges,
        filteredColleges,
        activeFilters,
        parseNumericMinFee,
        formatFee
      ),
    [colleges, filteredColleges, activeFilters, parseNumericMinFee, formatFee]
  );

  if (colleges.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="seo-faq-heading"
      className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-10 sm:pt-14"
    >
      {/* Structured FAQ Section (Synced with FAQPage JSON-LD Schema for Rich Google Snippets) */}
      <div className="bg-surface border border-black/10 dark:border-white/10 rounded-3xl p-5 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-warning block">
              Verified Academic Counseling FAQ
            </span>
            <h2
              id="seo-faq-heading"
              className="text-lg sm:text-2xl font-black text-text-main"
            >
              Frequently Asked Questions on Forensic Science Colleges in India
            </h2>
          </div>
          <span className="text-xs font-bold text-text-muted">
            Updated for 2026–2027 Admissions ({colleges.length} Campuses Indexed)
          </span>
        </div>

        <div className="space-y-3">
          {seoBundle.faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-background border border-black/10 dark:border-white/10 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full px-4 sm:px-6 py-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-surface/60 transition-colors"
                >
                  <h3 className="text-xs sm:text-sm font-black text-text-main leading-snug">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'text-warning shrink-0 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-6 pb-4 pt-1 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-black/5 dark:border-white/5">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
