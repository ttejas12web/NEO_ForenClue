export interface CaseSource {
  title: string;
  url: string;
}

const CASE_SOURCES_BY_TITLE: Record<string, CaseSource[]> = {
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

export function normalizeCaseTitle(value: unknown): string {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function hasValidCaseSources(value: unknown): value is CaseSource[] {
  return Array.isArray(value) && value.length > 0 && value.every((source) => {
    if (!source || typeof source !== 'object') return false;
    const record = source as Record<string, unknown>;
    if (typeof record.title !== 'string' || !record.title.trim()) return false;
    if (typeof record.url !== 'string') return false;
    try {
      return new URL(record.url).protocol === 'https:';
    } catch {
      return false;
    }
  });
}

export function getCuratedCaseSources(title: unknown): CaseSource[] {
  return CASE_SOURCES_BY_TITLE[normalizeCaseTitle(title)]?.map((source) => ({ ...source })) || [];
}
