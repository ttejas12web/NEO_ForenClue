export interface CaseSource {
  title: string;
  url: string;
}

const CASE_SOURCES_BY_TITLE: Record<string, CaseSource[]> = {
  'burari deaths (2018)': [
    {
      title: 'NDTV / PTI (14 September 2018): psychological autopsy findings',
      url: 'https://www.ndtv.com/delhi-news/delhis-burari-deaths-not-suicide-but-an-accident-psychological-autopsy-report-1916739',
    },
    {
      title: 'Times of India (21 October 2021): police closure report',
      url: 'https://timesofindia.indiatimes.com/city/delhi/burari-deaths-police-closure-report-mentions-no-foul-play/articleshow/87169901.cms',
    },
  ],
  'burari case study (2018): psychological autopsy & crime scene reconstruction': [
    {
      title: 'NDTV / PTI (14 September 2018): psychological autopsy findings',
      url: 'https://www.ndtv.com/delhi-news/delhis-burari-deaths-not-suicide-but-an-accident-psychological-autopsy-report-1916739',
    },
    {
      title: 'Times of India (21 October 2021): police closure report',
      url: 'https://timesofindia.indiatimes.com/city/delhi/burari-deaths-police-closure-report-mentions-no-foul-play/articleshow/87169901.cms',
    },
  ],
  'priyadarshini mattoo case': [
    {
      title: 'Supreme Court judgment: Santosh Kumar Singh v. State through CBI',
      url: 'https://www.legaldeskai.in/case-law/in/sc/judgment/santosh-kumar-singh-versus-state-thr-cbi-2010-13-901-956',
    },
    {
      title: 'Indian Express report on the Supreme Court decision',
      url: 'https://indianexpress.com/article/india/crime/priyadarshini-mattoo-killer-escapes-death-gets-life/',
    },
  ],
  'the jason rohde murder case': [
    {
      title: 'Supreme Court of Appeal of South Africa: Rohde v The State',
      url: 'https://www.saflii.org/za/cases/ZASCA/2021/134.html',
    },
  ],
  'geeta chopra and sanjay chopra double murder kidnapping cass': [
    {
      title: 'Supreme Court judgment: Kuljeet Singh @ Ranga v. Union of India',
      url: 'https://indiankanoon.org/doc/582949/',
    },
  ],
  'geeta chopra and sanjay chopra double murder kidnapping case': [
    {
      title: 'Supreme Court judgment: Kuljeet Singh @ Ranga v. Union of India',
      url: 'https://indiankanoon.org/doc/582949/',
    },
  ],
  'geeta chopra and sanjay chopra case': [
    {
      title: 'Supreme Court judgment: Kuljeet Singh @ Ranga v. Union of India',
      url: 'https://indiankanoon.org/doc/582949/',
    },
  ],
  'mysuru-bengaluru highway cases': [
    {
      title: 'Karnataka High Court hearing report on the underage-driving case',
      url: 'https://www.livelaw.in/high-court/karnataka-high-court/karnataka-high-court-slams-underage-driving-hearing-father-plea-546476',
    },
  ],
  'r.g kar medical college rape and murder case': [
    {
      title: 'Sealdah Sessions Court judgment',
      url: 'https://images.assettype.com/barandbench/2025-01-20/eob14cyw/RG_Kar_Case___Judgment.pdf',
    },
    {
      title: 'DD News report on conviction and sentence',
      url: 'https://ddnews.gov.in/en/sanjay-roy-sentenced-to-life-imprisonment-in-rg-kar-rape-and-murder-case/',
    },
  ],
  'citibank–mphasis call center fraud case': [
    {
      title: 'Institute of Company Secretaries of India case-study material',
      url: 'https://www.icsi.edu/media/webmodules/Academics/Elective_Paper_AIDA_CS.pdf',
    },
    {
      title: 'Economic Times contemporaneous report',
      url: 'https://economictimes.indiatimes.com/mphasis-call-centre-fraud-net-widens/articleshow/1077097.cms',
    },
  ],
  'jessica murder': [
    {
      title: 'Supreme Court judgment: Sidhartha Vashisht @ Manu Sharma v. State',
      url: 'https://indiankanoon.org/doc/1515299/',
    },
  ],
  'the nithari serial murders': [
    {
      title: 'Supreme Court acquittal analysis and judgment summary',
      url: 'https://www.scconline.com/blog/post/2025/11/12/supreme-court-acquits-nithari-killings-accused-surendra-koli/',
    },
  ],
  'amravati sex scandal': [
    {
      title: 'Indian Express report citing Amravati Police and Child Welfare Committee',
      url: 'https://indianexpress.com/article/cities/mumbai/amravati-minor-girls-video-case-cops-suspended-ayan-ahmed-rumors-fact-check-10643682/',
    },
    {
      title: 'Indian Express follow-up on arrests and seized material',
      url: 'https://indianexpress.com/article/cities/mumbai/amravati-obscene-videos-more-held-accused-house-razed-10638347/',
    },
  ],
  'blue drum case': [
    {
      title: 'Hindustan Times report on the police chargesheet and forensic evidence',
      url: 'https://www.hindustantimes.com/cities/lucknow-news/meerut-murder-case-69-days-later-1-000-page-chargesheet-names-victim-s-wife-lover-cites-34-witnesses-101747064061635.html',
    },
  ],
  'the sheena bora murder case': [
    {
      title: 'National Judicial Academy: forensic evidence and DNA profiling',
      url: 'https://www.nja.gov.in/Concluded_Programmes/2017-18/P-1077_PPTs/3.Forensic%20Evidence%20in%20Civil%20%26%20Criminal%20Trials%2C%20DNA%20PROFILING.pdf',
    },
    {
      title: 'Bureau of Police Research and Development forensic reference',
      url: 'https://bprd.nic.in/uploads/pdf/1725273999_10c3ed6ede64b4c3cf6b.pdf',
    },
  ],
  'the satyam computer services scandal': [
    {
      title: 'SEBI order in the matter of Satyam Computer Services',
      url: 'https://www.sebi.gov.in/sebi_data/docfiles/28591_t.html',
    },
    {
      title: 'U.S. SEC enforcement release on the Satyam financial fraud',
      url: 'https://www.sec.gov/newsroom/press-releases/2011-81',
    },
  ],
  'tandoor murder case': [
    {
      title: 'Supreme Court judgment: Sushil Sharma v. State (NCT of Delhi)',
      url: 'https://indiankanoon.org/doc/119404246/',
    },
  ],
};

/**
 * Policy-safe academic title mapping for documented forensic case studies.
 * Fixes typos (e.g. "CASS" -> "Case") and converts sensational/graphic headlines
 * into formal forensic science and legal case-study titles.
 */
const ACADEMIC_CASE_TITLE_MAP: Record<string, string> = {
  'geeta chopra and sanjay chopra double murder kidnapping cass':
    'Geeta Chopra and Sanjay Chopra Case (1978): Forensic Trace, Fingerprint & Medical Evidence Analysis',
  'geeta chopra and sanjay chopra double murder kidnapping case':
    'Geeta Chopra and Sanjay Chopra Case (1978): Forensic Trace, Fingerprint & Medical Evidence Analysis',
  'burari deaths (2018)':
    'Burari Case Study (2018): Psychological Autopsy & Scene Reconstruction Methodology',
  'priyadarshini mattoo case':
    'Priyadarshini Mattoo Case: Autosomal DNA Profiling & Appellate Evidentiary Review',
  'the jason rohde murder case':
    'State v. Jason Rohde Case: Staged Scene Reconstruction & Medico-Legal Pathology',
  'mysuru-bengaluru highway cases':
    'Mysuru–Bengaluru Highway Case: Vehicular Forensics & Collision Kinematics',
  'r.g kar medical college rape and murder case':
    'R.G. Kar Medical College Case: Biological Trace Evidence & Digital Timeline Verification',
  'citibank–mphasis call center fraud case':
    'Citibank–MphasiS Call Center Case: Cyber Forensics & IT Act Section 43/66 Investigation',
  'jessica murder':
    'Jessica Lal Case (1999): Firearms Ballistics & Cartridge Breechface Comparison',
  'the nithari serial murders':
    'Nithari Case Study: Forensic Anthropology, Skeletal Recovery & Evidentiary Standards',
  'amravati sex scandal':
    'Amravati Digital Evidence Case: Electronic Device Seizure Protocols & Cyber Forensics',
  'blue drum case':
    'Meerut Forensic Case Study: Postmortem Reconstruction & Physical Evidence Chain of Custody',
  'the sheena bora murder case':
    'Sheena Bora Case: Skeletal Identification, Craniofacial Superimposition & DNA Profiling',
  'the satyam computer services scandal':
    'Satyam Computer Services Case: Forensic Accounting & Digital Audit Trail Reconstruction',
  'tandoor murder case':
    'State v. Sushil Sharma (1995): DNA Paternity Identification & Forensic Pathology',
};

export function normalizeCaseTitle(value: unknown): string {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function formatPolicySafeCaseTitle(rawTitle: unknown): string {
  const raw = String(rawTitle || '').trim();
  if (!raw) return 'Forensic Investigation Case Study';

  const normalized = normalizeCaseTitle(raw);
  if (ACADEMIC_CASE_TITLE_MAP[normalized]) {
    return ACADEMIC_CASE_TITLE_MAP[normalized];
  }

  // Fix "CASS" -> "Case" typo and sanitize overly graphic terms into formal academic framing
  let cleaned = raw.replace(/\bCASS\b/gi, 'Case');
  cleaned = cleaned
    .replace(/\bdouble murder kidnapping\b/gi, 'Forensic Investigation')
    .replace(/\brape and murder\b/gi, 'Medico-Legal & Forensic')
    .replace(/\bserial murders\b/gi, 'Forensic Anthropology Case')
    .replace(/\bsex scandal\b/gi, 'Digital Evidence Case')
    .replace(/\bmurder case\b/gi, 'Forensic Case Study')
    .replace(/\bmurder\b/gi, 'Forensic Case Study');

  // If the string was ALL CAPS, convert to clean Title Case
  if (cleaned === cleaned.toUpperCase() && cleaned.length > 6) {
    cleaned = cleaned
      .toLowerCase()
      .replace(/\b\w/g, (ch) => ch.toUpperCase());
  }

  return cleaned;
}

export function formatPolicySafeCaseCategory(rawType: unknown): string {
  const t = String(rawType || '').trim();
  if (!t) return 'Criminalistics';
  const lower = t.toLowerCase();
  if (lower === 'homicide') return 'Medico-Legal Criminalistics';
  if (lower === 'death investigation') return 'Forensic Pathology & Reconstruction';
  if (lower === 'cyber') return 'Digital & Cyber Forensics';
  if (lower === 'cold case') return 'Archival Evidence Review';
  return t;
}

export function hasValidCaseSources(value: unknown): value is CaseSource[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((source) => {
      if (!source || typeof source !== 'object') return false;
      const record = source as Record<string, unknown>;
      if (typeof record.title !== 'string' || !record.title.trim()) return false;
      if (typeof record.url !== 'string') return false;
      try {
        return new URL(record.url).protocol === 'https:';
      } catch {
        return false;
      }
    })
  );
}

export function getCuratedCaseSources(title: unknown): CaseSource[] {
  const norm = normalizeCaseTitle(title);
  if (CASE_SOURCES_BY_TITLE[norm]) {
    return CASE_SOURCES_BY_TITLE[norm].map((source) => ({ ...source }));
  }
  const fixedTypo = norm.replace(/\bcass\b/g, 'case');
  if (CASE_SOURCES_BY_TITLE[fixedTypo]) {
    return CASE_SOURCES_BY_TITLE[fixedTypo].map((source) => ({ ...source }));
  }
  return [];
}

export function ensureCaseSources(title: unknown, existingSources?: unknown): CaseSource[] {
  if (hasValidCaseSources(existingSources)) {
    return existingSources;
  }
  const curated = getCuratedCaseSources(title);
  if (curated.length > 0) {
    return curated;
  }
  const safeTitle = formatPolicySafeCaseTitle(title);
  return [
    {
      title: `${safeTitle} - Forensic Investigation Archive & Reference`,
      url: 'https://forenclue.in',
    },
  ];
}
