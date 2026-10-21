import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { 
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy, limit, setDoc, arrayUnion, arrayRemove 
} from 'firebase/firestore';
import { College } from '@/types/college';

const COLLEGES_COLLECTION = 'colleges';

export const SAMPLE_COLLEGES: College[] = [
  {
    id: 'geeta-university',
    name: 'Geeta University',
    shortName: 'Geeta University Panipat',
    country: 'India',
    state: 'Haryana',
    city: 'Panipat',
    type: 'Private',
    website: 'https://www.geetauniversity.edu.in',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1200',
    description: 'Geeta University is a premier multidisciplinary institution located in Panipat (Delhi-NCR), Haryana, established under the Haryana Private Universities Act. Its School of Allied Health & Forensic Sciences delivers comprehensive, NEP 2020-aligned education in forensic science, crime scene investigation, questioned document analysis, toxicology, and digital forensics with world-class laboratory infrastructure, dedicated mock crime scenes, and industry-focused mentorship.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: '10+2 with Physics, Chemistry, and Biology / Mathematics / Computer Science (Min 50-55% aggregate)',
        estimatedFees: '₹59,000 / semester (approx ₹1,18,000 / year)',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Reconstruction',
          'Forensic Toxicology & Chemical Profiling',
          'Questioned Documents & Fingerprint Examination',
          'Forensic Biology & DNA Serology',
          'Cyber Forensics & Digital Evidence'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or B.Sc. with Physics / Chemistry / Biology / Life Sciences / Biotechnology / MBBS / BDS / B.Pharm (Min 55% aggregate)',
        estimatedFees: '₹65,000 / semester (approx ₹1,30,000 / year)',
        mode: 'Full-time',
        specializations: [
          'Advanced Forensic Serology & DNA Profiling',
          'Digital Evidence, Incident Response & Cyber Forensics',
          'Forensic Chemistry, Narcotics & Toxicology'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master’s Degree in Forensic Science or allied Life / Physical Sciences with minimum 55% aggregate marks (5% relaxation for reserved categories)',
        estimatedFees: '₹55,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Instrumental Analysis',
          'Digital Forensics, Anti-Forensics & Malware Forensics',
          'Forensic Genetics & Molecular Identification'
        ]
      }
    ],
    feesRange: '₹85,000 - ₹1,30,000 / year',
    admissionProcess: 'Merit-based on 10+2 / Graduation scores or CUET UG scores or GUTS (Geeta University Test of Scholarship) followed by personal counseling.',
    accreditation: 'UGC Recognized | Haryana State Private Universities Act (Act 11 of 2022) | AIU Member',
    contactEmail: 'info@geetauniversity.edu.in',
    contactPhone: '+91 92787 68000',
    address: 'NH-71, Naultha, Panipat, Haryana 132145, India',
    ranking: 'Top Emerging Multidisciplinary University in Delhi-NCR & Haryana',
    facilities: [
      'Advanced Forensic Chemistry & Instrumental Toxicology Lab',
      'Simulated Crime Scene Reconstruction & Investigation Arena',
      'Questioned Documents & Latent Fingerprint Analysis Lab',
      'Digital Forensics & High-Performance Cyber Security Lab',
      'Comparison Microscopy & Ballistics Analysis Unit',
      'Central University Library with Forensics E-Research Subscriptions',
      'Air-Conditioned Smart Classrooms with Audio-Visual Aids',
      'Separate Boys & Girls Hostels with 24/7 Security & High-Speed Wi-Fi',
      'University Fleet Transportation across Panipat, Sonipat, Karnal & Delhi-NCR'
    ],
    featured: true
  },
  {
    id: 'chandigarh-university',
    name: 'Chandigarh University',
    shortName: 'Chandigarh University (CU Mohali)',
    country: 'India',
    state: 'Punjab',
    city: 'Mohali',
    type: 'Private',
    website: 'https://www.cuchd.in',
    logo: 'https://www.cuchd.in/home-assets/img/logo.png',
    bannerImage: 'https://www.cuchd.in/twitter-og-image.jpg',
    description: 'Chandigarh University (CU) is a premier NAAC A+ accredited multidisciplinary university located in Greater Mohali (Punjab) near Chandigarh. Recognized by the University Grants Commission (UGC) under Section 2(f) and ranked among Asia\'s top institutions in QS World University Rankings, its University Institute of Allied Health Sciences (UIAHS) and Department of Forensic Science deliver cutting-edge, NEP 2020-compliant education in forensic science, crime scene investigation, questioned document examination, latent fingerprint analysis, ballistics, forensic chemistry, DNA profiling, and digital forensics with world-class research laboratories, dedicated simulated crime scenes, and premier industry partnerships.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: '10+2 with Physics, Chemistry and Biology / Mathematics / Computer Science with minimum 50% aggregate marks (45% for SC/ST)',
        estimatedFees: '₹1,46,000 / year (approx ₹73,000 / semester)',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Reconstruction',
          'Forensic Toxicology & Chemical Profiling',
          'Questioned Documents & Fingerprint Examination',
          'Forensic Serology & DNA Profiling',
          'Cyber Forensics & Digital Investigation',
          'Forensic Ballistics & Trace Evidence'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in B.Sc. Forensic Science, Life Sciences, Chemistry, Physics, Medicine, Dentistry, Pharmacy, or allied sciences with minimum 50% marks from a recognized university',
        estimatedFees: '₹1,65,000 / year (approx ₹82,500 / semester)',
        mode: 'Full-time',
        specializations: [
          'Advanced Forensic Serology, DNA Profiling & Genetics',
          'Forensic Chemistry, Narcotics & Instrumental Toxicology',
          'Digital Forensics, Incident Response & Mobile Forensics',
          'Forensic Ballistics & Questioned Document Analysis',
          'Forensic Anthropology & Odontology'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s degree in Forensic Science or allied Physical/Biological sciences with minimum 55% marks (50% for SC/ST/OBC)',
        estimatedFees: '₹80,000 / year',
        mode: 'Full-time',
        specializations: [
          'Advanced Forensic Toxicology & Spectroscopic Profiling',
          'Cybercrime Investigation & Anti-Forensics Analysis',
          'Forensic Molecular Biology & DNA Technology'
        ]
      }
    ],
    feesRange: '₹1,46,000 - ₹1,65,000 / year',
    admissionProcess: 'CUCET (Chandigarh University Common Entrance Test) national scholarship-cum-entrance exam followed by merit counseling.',
    accreditation: 'NAAC A+ Accredited | UGC Recognized | Member of AIU | NIRF Top 20 Ranking Among Universities',
    contactEmail: 'admissions@cumail.in',
    contactPhone: '+91 1800 1212 88800',
    address: 'NH-05, Chandigarh-Ludhiana Highway, Mohali, Punjab 140413, India',
    ranking: 'NAAC A+ Grade (Score 3.28) | QS World University Rankings 2025 #1 Private University in India | NIRF Ranked',
    facilities: [
      'Advanced Forensic Science & Chromatography Instrumentation Lab',
      'Dedicated Crime Scene Reconstruction & Evidence Preservation Arena',
      'Questioned Documents, Handwriting & Latent Fingerprint Bureau',
      'High-End Digital Forensics, E-Discovery & Cybercrime Lab',
      'Forensic Ballistics, Comparison Microscopy & Trace Evidence Lab',
      'Central AC Library with Extensive Forensic Science Journals & IEEE/ScienceDirect Access',
      '200+ Acre Smart Wi-Fi Campus with Modern Hostel Residences',
      'Moot Court Hall for Forensic Evidence Presentation & Legal Mock Trials',
      'Fleet Transportation across Chandigarh, Mohali, Panchkula, Ambala & Ludhiana'
    ],
    featured: true
  },
  {
    id: 'lovely-professional-university',
    name: 'Lovely Professional University',
    shortName: 'LPU Phagwara',
    country: 'India',
    state: 'Punjab',
    city: 'Phagwara (Jalandhar)',
    type: 'Private',
    website: 'https://www.lpu.in',
    logo: 'https://www.lpu.in/images/logo/logo-media.png',
    bannerImage: 'https://www.lpu.in/lpu-assets/images/about-lpu/infrastructure/small/campus.webp',
    description: 'Lovely Professional University (LPU) is one of India\'s largest and top-ranked private universities, established in 2005 under the Lovely Professional University Act, 2005 (Punjab Act 25 of 2005) and accredited with the highest NAAC A++ Grade (CGPA 3.68/4.0). Located on a sprawling 600-acre campus on the Jalandhar-Delhi G.T. Road in Phagwara, Punjab, LPU\'s School of Bioengineering and Biosciences (Department of Forensic Science) offers industry-aligned, NEP 2020-compliant undergraduate, postgraduate, and doctoral programs in Forensic Science, Crime Scene Investigation, Forensic Toxicology, Questioned Documents, Fingerprint Analysis, DNA Profiling, and Cyber Forensics with advanced instrumentation and national/international research collaborations.',
    coursesOffered: [
      {
        name: 'B.Sc. (Forensic Sciences)',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: 'Pass with 60% aggregate marks in 10+2 (with English, Physics, Chemistry and Maths or Biology or Biotechnology) or equivalent, subject to qualifying LPUNEST',
        estimatedFees: '₹1,60,000 / year (₹80,000 / semester before LPUNEST scholarship)',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Criminalistics',
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents & Fingerprint Examination',
          'Forensic Physics, Ballistics & Cyber Forensics'
        ]
      },
      {
        name: 'M.Sc. (Forensic Sciences)',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Pass with 55% aggregate marks in B.Sc. (Forensic Science / Biology / Physics / Chemistry / Biochemistry / Microbiology / Biotechnology / Medical Lab Technology) or B.Pharm. / MBBS / BDS / BHMS / BAMS or equivalent, subject to qualifying LPUNEST',
        estimatedFees: '₹1,60,000 / year (₹80,000 / semester before LPUNEST scholarship)',
        mode: 'Full-time',
        specializations: [
          'Forensic Toxicology & Instrumental Chemical Analysis',
          'Questioned Document & Fingerprint Analysis',
          'Forensic Biology, Serology & DNA Fingerprinting',
          'Forensic Ballistics, Physics & Trace Evidence'
        ]
      },
      {
        name: 'Ph.D. in Forensic Sciences',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s degree in Forensic Science or allied Science discipline with minimum 55% aggregate marks + LPUNEST (Ph.D.) / UGC-NET / CSIR-NET / GATE + Interview',
        estimatedFees: '₹1,00,000 / year',
        mode: 'Full-time',
        specializations: [
          'Analytical Toxicology & Novel Psychoactive Substances',
          'Forensic DNA Typing, Body Fluid Identification & Serology',
          'Biometrics, Questioned Documents & Digital Forensics'
        ]
      }
    ],
    feesRange: '₹1,00,000 - ₹1,60,000 / year',
    admissionProcess: 'LPUNEST (Lovely Professional University National Entrance and Scholarship Test) / CUET score followed by online counselling and seat allocation.',
    accreditation: 'NAAC A++ Grade (Score 3.68/4.0) | UGC Recognized | NIRF Top 30 Universities in India | AIU & ACU Member',
    contactEmail: 'admissions@lpu.co.in',
    contactPhone: '+91 1824 517000',
    address: 'Jalandhar - Delhi G.T. Road, Phagwara, Punjab 144411, India',
    ranking: 'NAAC A++ (3.68) | NIRF #27 University in India | Times Higher Education (THE) World Ranked',
    facilities: [
      'Dedicated Forensic Science & Crime Scene Investigation Simulation Lab',
      'Central Instrumentation Facility (GC-MS, HPLC, FTIR, AAS, UV-Vis, SEM-EDS)',
      'Forensic Biology, Serology & PCR/DNA Profiling Laboratory',
      'Questioned Documents, Stereomicroscopy & Latent Fingerprint Bureau',
      'Forensic Ballistics, Anthropology & Odontology Lab',
      '9-Storey Dr. B.R. Ambedkar Central Library with Global Forensic Journals',
      '600-Acre Smart Campus with On-Campus Hospital, Indoor Sports Stadium & Residential Hostels'
    ],
    featured: true
  },
  {
    id: 'icfai-university',
    name: 'The ICFAI University',
    shortName: 'ICFAI University Jaipur',
    country: 'India',
    state: 'Rajasthan',
    city: 'Jaipur',
    type: 'Private',
    website: 'https://www.iujaipur.edu.in',
    logo: 'https://www.iujaipur.edu.in/assets/img/Logo.svg',
    bannerImage: 'https://www.iujaipur.edu.in/assets/img/HomePage/banner/Slider-1.jpg',
    description: 'The ICFAI University, Jaipur is a premier institution established under The ICFAI University, Jaipur Act, 2011 (Act No. 26 of 2011) passed by the Legislative Assembly of Rajasthan and recognized by the University Grants Commission (UGC) under Section 2(f). Part of the reputed ICFAI Group with a pan-India educational footprint, the university\'s Department of Forensic Science delivers contemporary, industry-aligned education in forensic science, crime scene management, fingerprint analysis, questioned documents, cyber forensics, and toxicology with specialized instrumentation laboratories, mock crime scene simulations, and strong academic mentorship.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: 'Pass in Class 10+2 with Science stream (Physics, Chemistry, and Biology / Mathematics / Computer Science) with minimum 50% aggregate marks',
        estimatedFees: '₹60,000 / year (approx ₹30,000 / semester)',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Reconstruction',
          'Forensic Toxicology & Chemical Analysis',
          'Fingerprint & Questioned Document Examination',
          'Forensic Serology & DNA Profiling',
          'Cyber Forensics & Digital Evidence'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in B.Sc. Forensic Science, Life Sciences, Chemistry, Physics, Medicine, Pharmacy, or allied biological/physical sciences with minimum 50% aggregate marks',
        estimatedFees: '₹70,000 / year (approx ₹35,000 / semester)',
        mode: 'Full-time',
        specializations: [
          'Cyber Forensics & Incident Response',
          'Crime Scene Management & Evidence Processing',
          'Forensic Chemistry, Narcotics & Toxicology',
          'Questioned Documents & Fingerprint Analysis'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s Degree in Forensic Science or allied disciplines with minimum 55% marks (50% for SC/ST/OBC)',
        estimatedFees: '₹60,000 / year',
        mode: 'Full-time',
        specializations: [
          'Advanced Digital & Multimedia Forensics',
          'Forensic Toxicology & Analytical Profiling',
          'DNA Typing & Molecular Identification'
        ]
      }
    ],
    feesRange: '₹60,000 - ₹70,000 / year',
    admissionProcess: 'Merit-based on qualifying examination (10+2 / Graduation) or national entrance scores (CUET) followed by personal interview and document verification.',
    accreditation: 'UGC Recognized | Member of AIU | Established under Rajasthan State Legislature Act | BCI & PCI Approved',
    contactEmail: 'admissions@iujaipur.edu.in',
    contactPhone: '1800 599 0767',
    address: 'Near Agra Road, Jamdoli, Jaipur, Rajasthan 302031, India',
    ranking: 'Top-Ranked Private University in Rajasthan | Established by The ICFAI Group',
    facilities: [
      'Dedicated Forensic Science & Physical Evidence Laboratory',
      'Simulated Crime Scene Investigation (CSI) Training Arena',
      'Questioned Documents & Latent Fingerprint Examination Unit',
      'High-Tech Cyber Forensics & Digital Investigation Lab',
      'Comparison Microscopy & Forensic Ballistics Unit',
      'Central NJ Yasaswy Memorial Library with Forensic Journals & Databases',
      'Spacious 40-Acre Wi-Fi Enabled Eco-Friendly Smart Campus',
      'Air-Conditioned Smart Classrooms with Audio-Visual Capabilities',
      'Separate Modern Hostels for Boys & Girls with 24/7 Security',
      'University Bus Transportation across Jaipur and Surrounding Areas',
      'Moot Court & Legal Simulation Hall for Forensic Jurisprudence'
    ],
    featured: true
  },
  {
    id: 'mangalayatan-university',
    name: 'Mangalayatan University',
    shortName: 'Mangalayatan University Aligarh',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Aligarh',
    type: 'Private',
    website: 'https://www.mangalayatan.in',
    logo: 'https://www.mangalayatan.in/admission-open/images/logo.webp',
    bannerImage: 'https://www.mangalayatan.in/images/home-sliders/naac-banner.webp',
    description: 'Mangalayatan University is a premier NAAC A+ accredited multidisciplinary university located in Aligarh (NCR), Uttar Pradesh, with prominent regional campuses including Jabalpur, Madhya Pradesh. Established under the Uttar Pradesh State Legislature and recognized by the University Grants Commission (UGC), the university\'s Institute of Applied Sciences delivers comprehensive, NEP 2020-aligned education in forensic science, crime scene investigation, forensic toxicology, cyber forensics, fingerprint examination, and questioned documents with high-tech research labs, mock crime scenes, and student-focused mentorship.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: '10+2 with Physics, Chemistry, and Biology / Mathematics (Min 50% aggregate marks; 5% relaxation for girl students and reserved categories)',
        estimatedFees: '₹70,000 / year (approx ₹35,000 / semester)',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Reconstruction',
          'Forensic Toxicology & Chemical Profiling',
          'Questioned Documents & Fingerprint Analysis',
          'Forensic Biology & DNA Serology',
          'Cyber Forensics & Digital Investigation'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or B.Sc. with Chemistry / Physics / Botany / Zoology / Life Sciences / Biochemistry / Biotechnology (Min 50% aggregate marks)',
        estimatedFees: '₹60,000 / year (approx ₹30,000 / semester)',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry, Narcotics & Toxicology',
          'Forensic Biology, Serology & Molecular Genetics',
          'Digital Forensics & Incident Response',
          'Questioned Documents & Forensic Ballistics'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master’s Degree in Forensic Science or allied Physical / Life Sciences with minimum 55% aggregate marks (50% for SC/ST/OBC)',
        estimatedFees: '₹60,000 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Toxicology & Analytical Instrumentation',
          'Advanced Cyber Forensics & Anti-Forensics Analysis',
          'Forensic Genetics & Molecular Identification'
        ]
      }
    ],
    feesRange: '₹60,000 - ₹70,000 / year',
    admissionProcess: 'Merit-based on qualifying exam (10+2 / Graduation) or National entrance scores (CUET UG/PG) followed by MU Entrance Test (MUEST) and personalized counseling.',
    accreditation: 'NAAC A+ Accredited | UGC Recognized | AIU Member | Approved by BCI, PCI & NCTE',
    contactEmail: 'info@mangalayatan.edu.in',
    contactPhone: '+91 70883 88888',
    address: 'Extended NCR, Mathura-Aligarh Highway, Beswan, Aligarh, Uttar Pradesh 202145, India',
    ranking: 'NAAC A+ Grade (Top Accreditation) | Ranked Among Top Emerging Universities in North India',
    facilities: [
      'Advanced Forensic Science & Chemical Profiling Laboratory',
      'Simulated Crime Scene Investigation & Evidence Reconstruction Arena',
      'Questioned Documents & Latent Fingerprint Examination Unit',
      'High-Performance Digital Forensics & Cyber Security Lab',
      'Ballistics Analysis & Comparison Microscopy Unit',
      'Central Chanakya Library with Comprehensive Forensic Journals & E-Resources',
      'Sprawling 70-Acre Wi-Fi Enabled Lush Green Smart Campus',
      'Air-Conditioned Smart Classrooms with Audio-Visual Equipment',
      'Separate Boys & Girls Hostels with 24/7 Security & Hygienic Mess',
      'University Fleet Transportation across Aligarh, Mathura, Hathras & Agra',
      'Moot Court & Legal Simulation Hall for Forensic Jurisprudence Training'
    ],
    featured: true
  },
  {
    id: 'subharti-university',
    name: 'Swami Vivekanand Subharti University (Subharti University)',
    shortName: 'Subharti University Meerut',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Meerut',
    type: 'Private',
    website: 'https://subharti.org',
    logo: 'https://subharti.org/favicon.png',
    bannerImage: 'https://subharti.org/images/banner/1_2026.webp',
    description: 'Swami Vivekanand Subharti University (SVSU), Meerut is a premier NAAC \'A\' Grade accredited private university established in 2008 under the Swami Vivekanand Subharti Vishwavidyalaya Uttar Pradesh Adhiniyam, 2008 (U.P. Act No. 29 of 2008) and recognized by the University Grants Commission (UGC) under Section 2(f). Located on a 250-acre green residential campus (Subhartipuram) on NH-58, Delhi-Haridwar Bypass Road in Meerut, its Keral Verma Subharti College of Science (Department of Forensic Science) and on-campus Chhatrapati Shivaji Subharti Hospital provide students with intensive practical training in Crime Scene Investigation, Forensic Toxicology, Serology & DNA Profiling, Questioned Documents, Fingerprint Analysis, Forensic Odontology, Medico-Legal Autopsy Exposure, and Cyber Forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: '10+2 (Intermediate) in Science stream (Physics, Chemistry, Biology / Mathematics) from a recognized board with minimum 45% aggregate marks (40% for SC/ST candidates) + SNET / Merit',
        estimatedFees: '₹42,000 / year',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Physical Evidence',
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents & Fingerprint Examination',
          'Forensic Physics, Ballistics & Cyber Forensics'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or B.Sc. with Physics, Chemistry, Zoology, Botany, Biochemistry, Microbiology, Biotechnology, or allied Medical/Dental/Pharmacy degree with minimum 50% aggregate marks + SNET / Merit',
        estimatedFees: '₹52,000 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Toxicology',
          'Questioned Document & Fingerprint Analysis',
          'Forensic Biology, Serology & DNA Fingerprinting',
          'Forensic Ballistics, Cyber Forensics & Medico-Legal Jurisprudence'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s degree in Forensic Science or allied Science discipline with minimum 55% aggregate marks + Subharti Research Entrance Test (SRET) / UGC-NET / CSIR-NET + Interview',
        estimatedFees: '₹85,000 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Toxicology & Instrumental Chemical Analysis',
          'Questioned Documents, Biometrics & Latent Fingerprints',
          'Forensic Biology, Anthropology & Odontology'
        ]
      }
    ],
    feesRange: '₹42,000 - ₹55,000 / year',
    admissionProcess: 'SNET (Subharti National Eligibility Test) / CUET score or direct merit-based admission based on qualifying examination percentage followed by university counselling.',
    accreditation: 'NAAC \'A\' Grade Accredited | UGC Recognized (Section 2(f)) | AIU Member | Government of Uttar Pradesh Act No. 29 of 2008',
    contactEmail: 'admission@subharti.org',
    contactPhone: '+91 96392 22288',
    address: 'Subhartipuram, NH-58, Delhi-Haridwar Bypass Road, Meerut, Uttar Pradesh 250005, India',
    ranking: 'NAAC \'A\' Grade | Top Multidisciplinary Private University in Uttar Pradesh (NCR)',
    facilities: [
      'Department of Forensic Science Crime Scene & Criminalistics Lab (Keral Verma Subharti College of Science)',
      'Forensic Chemistry, Toxicology & Analytical Instrumentation Lab',
      'Forensic Biology, Serology & Anthropology Laboratory',
      'Questioned Documents, Handwriting & Fingerprint Examination Lab',
      'Clinical & Medico-Legal Exposure via On-Campus 1100+ Bed Chhatrapati Shivaji Subharti Hospital',
      'Central University Library with E-Journals, DELNET & Forensic Reference Collection',
      '250-Acre Wi-Fi Enabled Campus with Separate Boys & Girls Hostels, Sports Complex & Bank'
    ],
    featured: true
  },
  {
    id: 'mgm-university',
    name: 'MGM University',
    shortName: 'MGM University Chhatrapati Sambhajinagar',
    country: 'India',
    state: 'Maharashtra',
    city: 'Chhatrapati Sambhajinagar',
    type: 'Private',
    website: 'https://mgmu.ac.in',
    logo: 'https://cdn.mgmtech.org/static/mgmu.ac.in/assets/images/LogoMGM.svg',
    bannerImage: 'https://cdn.mgmtech.org/static/mgmu.ac.in/assets/images/navigation/002.jpg',
    description: 'MGM University (Mahatma Gandhi Mission University) is a premier self-financed private state university established under the MGM University Act, 2019 (Maharashtra Act No. XXVI of 2019) and recognized by the University Grants Commission (UGC) under Section 2(f). Located in the historical education hub of Chhatrapati Sambhajinagar (Aurangabad), Maharashtra, its University Department of Basic and Applied Sciences (UDBAS) and Institute of Biosciences and Technology deliver comprehensive, NEP 2020-aligned education in forensic science, crime scene management, forensic chemistry, toxicology, questioned document examination, latent fingerprint analysis, cyber forensics, and forensic biology with modern laboratories, hands-on field investigations, and healthcare/medical jurisprudence collaborations.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: 'Pass in Higher Secondary Certificate (HSC / 10+2) examination in Science stream (Physics, Chemistry, Biology / Mathematics) with minimum 50% aggregate marks (45% for reserved categories from Maharashtra)',
        estimatedFees: '₹40,000 / year (approx ₹20,000 / semester)',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Reconstruction',
          'Forensic Chemistry & Instrumental Toxicology',
          'Questioned Documents & Fingerprint Bureau',
          'Forensic Biology, Serology & DNA Profiling',
          'Cyber Forensics & Digital Evidence Analysis'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s Degree in B.Sc. Forensic Science or B.Sc. with Chemistry, Physics, Botany, Zoology, Life Sciences, Biotechnology or allied physical/biological sciences with minimum 50% aggregate marks (45% for reserved categories)',
        estimatedFees: '₹40,000 / year (approx ₹20,000 / semester)',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry, Narcotics & Toxicology',
          'Digital & Cyber Forensics Investigation',
          'Forensic Biology, Serology & DNA Fingerprinting',
          'Questioned Documents & Fingerprint Examination'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science / Applied Sciences',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master’s Degree in Forensic Science or allied Biological/Chemical sciences with minimum 55% aggregate marks (50% for SC/ST/OBC)',
        estimatedFees: '₹50,000 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Toxicology & Analytical Profiling',
          'Cyber Forensics & Incident Response',
          'Forensic Genetics & Molecular Serology'
        ]
      }
    ],
    feesRange: '₹35,000 - ₹45,000 / year',
    admissionProcess: 'Merit-based on qualifying exam (10+2 / Graduation) or MGMU-CET entrance examination followed by document verification and counseling.',
    accreditation: 'UGC Recognized | Established under Maharashtra State Private Universities Act (Act XXVI of 2019) | AIU Member',
    contactEmail: 'admissions@mgmu.ac.in',
    contactPhone: '+91 240 2480490',
    address: 'MGM Campus, N-6, CIDCO, Chhatrapati Sambhajinagar (Aurangabad), Maharashtra 431003, India',
    ranking: 'Premier Multidisciplinary Private University in Marathwada & Western Maharashtra',
    facilities: [
      'Advanced Forensic Chemistry & Spectroscopy Laboratory',
      'Crime Scene Simulation & Evidence Reconstruction Arena',
      'Questioned Documents & Latent Fingerprint Bureau',
      'Cyber Forensics & High-Performance Computing Lab',
      'Molecular Biology & DNA Serology Research Unit',
      'Central Dr. A.P.J. Abdul Kalam Knowledge Resource Center & E-Library',
      'Wi-Fi Enabled Smart Campus with Academic Auditoriums',
      'Separate Residential Hostels for Boys & Girls with 24/7 Security',
      'On-Campus MGM Medical College & Hospital for Forensic Medicine Training'
    ],
    featured: true
  },
  {
    id: 'parul-university',
    name: 'Parul University',
    shortName: 'Parul University Vadodara',
    country: 'India',
    state: 'Gujarat',
    city: 'Vadodara',
    type: 'Private',
    website: 'https://paruluniversity.ac.in',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
    description: 'Parul University is one of India\'s leading multidisciplinary private universities located in Vadodara, Gujarat, accredited with the prestigious NAAC A++ grade. Its Department of Forensic Sciences under the Faculty of Applied Sciences provides advanced education in crime scene investigation, questioned documents, toxicology, fingerprint examination, forensic biology, and cyber forensics with world-class labs, mock crime scenes, and hands-on investigative training.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: '10+2 with Science stream (Physics, Chemistry, and Biology / Mathematics) from a recognized board (Min 45-50% aggregate)',
        estimatedFees: '₹1,15,000 / year (approx ₹57,500 / semester)',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Management & Reconstruction',
          'Forensic Toxicology & Chemical Profiling',
          'Questioned Documents & Fingerprint Examination',
          'Forensic Serology & DNA Analysis',
          'Cyber & Digital Forensics'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Life Sciences, Chemistry, Physics, or related Bachelor\'s degree with minimum 50% aggregate',
        estimatedFees: '₹1,15,000 - ₹1,30,000 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Criminology & Forensic Psychology',
          'Questioned Documents, Fingerprint & Forensic Photography',
          'Digital Forensics & Cybercrime Investigation',
          'Forensic Chemistry & Toxicology',
          'Forensic Biology & Serology'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master’s Degree in Forensic Science or allied Life / Physical Sciences with minimum 55% aggregate marks (5% relaxation for reserved categories)',
        estimatedFees: '₹50,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Toxicology & Chemical Profiling',
          'Digital Forensics & Incident Response',
          'Forensic Genetics & Molecular Identification'
        ]
      }
    ],
    feesRange: '₹1,15,000 - ₹1,30,000 / year',
    admissionProcess: 'Merit-based on qualifying exam (10+2 / Graduation) or national entrance scores (CUET) followed by counseling and document verification.',
    accreditation: 'NAAC A++ Accredited | UGC Recognized | State Private University | Member of AIU',
    contactEmail: 'info@paruluniversity.ac.in',
    contactPhone: '+91 2668 260300',
    address: 'P.O. Limda, Ta. Waghodia, Dist. Vadodara, Gujarat 391760, India',
    ranking: 'NAAC A++ Grade (Top 2% Universities Nationwide) | NIRF Innovation Ranked',
    facilities: [
      'Advanced Forensic Science & Toxicology Laboratories',
      'Simulated Crime Scene Investigation (CSI) Lab',
      'Questioned Documents, Forgery Detection & Latent Fingerprint Lab',
      'Dedicated Digital Forensics & Cyber Security Research Suite',
      'Ballistics, Comparison Microscopy & Trace Evidence Lab',
      'High-Tech Chromatography & Spectrophotometry Equipment',
      'Moot Court & Legal Procedures Simulation Hall',
      'Central AC Library with Online Forensic Journals & Research Databases',
      'Separate Boys & Girls Hostels with 24/7 Security & Wi-Fi',
      'Campus Hospital & Healthcare Support (Parul Sevashram Hospital)'
    ],
    featured: true
  },
  {
    id: 'usha-martin-university',
    name: 'Usha Martin University',
    shortName: 'UMU Ranchi',
    country: 'India',
    state: 'Jharkhand',
    city: 'Ranchi',
    type: 'Private',
    website: 'https://www.umu.ac.in',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
    description: 'Usha Martin University is a premier UGC-recognized state private university located in Ranchi, Jharkhand. Its Department of Forensic Science under the Faculty of Sciences provides comprehensive, hands-on academic training across crime scene management, forensic ballistics, toxicology, DNA profiling, questioned document examination, and digital forensics in state-of-the-art laboratory environments.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: '10+2 (Higher Secondary) with Science stream (Physics, Chemistry, and Biology / Mathematics / Computer Science) with min 50% aggregate marks',
        estimatedFees: '₹46,500 / semester (approx ₹93,000 / year)',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Evidence Handling',
          'Forensic Ballistics & Explosives',
          'Forensic Toxicology & Applied Chemistry',
          'DNA Forensics & Biological Evidence',
          'Fingerprint Science & Document Examination',
          'Cyber Forensics & Digital Investigation'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or B.Sc. with Chemistry / Physics / Botany / Zoology / Biochemistry / Biotechnology (Min 50% aggregate)',
        estimatedFees: '₹55,000 / semester (approx ₹1,10,000 / year)',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Instrumental Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Digital Forensics & Incident Response'
        ]
      }
    ],
    feesRange: '₹90,000 - ₹1,10,000 / year',
    admissionProcess: 'Merit-based on qualifying 10+2 / Graduation examination scores or CUET followed by university counseling and document verification.',
    accreditation: 'UGC Recognized | Established by Jharkhand State Legislature | Member of AIU | ISO 9001:2015 Certified',
    contactEmail: 'info@umu.ac.in',
    contactPhone: '+91 78273 06265',
    address: 'Village Narayansoso, Near Angara Block Office, Ranchi-Purulia Highway, Angara, Ranchi, Jharkhand 835103, India',
    ranking: 'Top Private University in Jharkhand | Excellence in Higher Education Award',
    facilities: [
      'Dedicated Forensic Science & Physical Evidence Laboratory',
      'Forensic Ballistics, Firearms & Comparison Microscopy Unit',
      'Analytical Chemistry & Forensic Toxicology Lab',
      'Latent Fingerprint & Questioned Documents Analysis Lab',
      'Cyber Forensics & Digital Evidence Investigation Lab',
      'Crime Scene Reconstruction Simulation Arena',
      'Eco-Friendly Modern Campus with High-Speed Wi-Fi Connectivity',
      'Central Library with Comprehensive Forensic Science Journals & E-Resources',
      'On-Campus Separate Hostels for Boys & Girls with 24/7 Security',
      'Dedicated University Bus Transportation across Ranchi City & Suburbs'
    ],
    featured: true
  },
  {
    id: 'vivekananda-global-university',
    name: 'Vivekananda Global University',
    shortName: 'VGU Jaipur',
    country: 'India',
    state: 'Rajasthan',
    city: 'Jaipur',
    type: 'Private',
    website: 'https://vgu.ac.in',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1200',
    description: 'Vivekananda Global University (VGU) is a premier multidisciplinary private university located in Jaipur, Rajasthan, accredited with the prestigious NAAC A+ grade. Its Department of Forensic Science under the Faculty of Basic & Applied Sciences offers advanced, research-oriented education encompassing crime scene investigation, DNA profiling, ballistics, forensic toxicology, questioned document examination, and cyber forensics in cutting-edge laboratory facilities.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: '10+2 with Science stream (Physics, Chemistry, and Mathematics / Biology / Biotechnology) with min 45-50% aggregate marks',
        estimatedFees: '₹1,10,000 - ₹1,30,000 / year (approx ₹55,000 / semester)',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Reconstruction',
          'Forensic Chemistry & Toxicology',
          'DNA Profiling & Forensic Biology',
          'Questioned Documents & Latent Fingerprints',
          'Forensic Ballistics',
          'Cyber & Digital Forensics'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or relevant Science discipline (Chemistry, Biology, Physics, Life Sciences) with min 50% aggregate marks',
        estimatedFees: '₹1,10,000 - ₹1,20,000 / year (approx ₹55,000 / semester)',
        mode: 'Full-time',
        specializations: [
          'Advanced DNA Profiling & Serology',
          'Forensic Toxicology & Chemical Profiling',
          'Cyber Forensics & Incident Response',
          'Bloodstain Pattern Analysis (BPA)',
          'Questioned Documents & Forensic Photography'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master’s Degree in Forensic Science or allied Life / Physical Sciences with minimum 55% aggregate marks (5% relaxation for reserved categories)',
        estimatedFees: '₹50,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Toxicology & Environmental Forensics',
          'Digital & Network Forensics',
          'Forensic Genetics & Molecular Biology'
        ]
      }
    ],
    feesRange: '₹1,10,000 - ₹1,30,000 / year',
    admissionProcess: 'Merit-based on 10+2 / Graduation scores, or entrance performance in VGUCET, CUET UG, or AIFSET (All India Forensic Science Entrance Test) followed by counseling.',
    accreditation: 'NAAC A+ Accredited | UGC Recognized | Member of AIU | BCI & PCI Approved Programs',
    contactEmail: 'info@vgu.ac.in',
    contactPhone: '+91 141 2851000',
    address: 'Sector 36, NRI Road, Sisyawas, Jagatpura, Jaipur, Rajasthan 303012, India',
    ranking: 'NAAC A+ Grade | Top Ranked Private University in Rajasthan & North India',
    facilities: [
      'Advanced Forensic Chemistry & Instrumental Toxicology Lab',
      'DNA Profiling, Forensic Biology & Serology Lab',
      'Simulated Crime Scene Reconstruction & Evidence Handling Arena',
      'Forensic Ballistics, Comparison Microscopy & Firearms Unit',
      'Questioned Documents, Forgery Detection & Latent Fingerprint Lab',
      'Digital Forensics & High-Performance Cyber Investigation Suite',
      'Bloodstain Pattern Analysis (BPA) Darkroom Setup',
      'Central AC University Library with Forensics Journals & E-Resources',
      'Air-Conditioned Smart Lecture Theatres with Audio-Visual Equipment',
      'Separate Boys & Girls Hostels with 24/7 Security & High-Speed Wi-Fi',
      'Dedicated University Bus Transportation across All Zones of Jaipur'
    ],
    featured: true
  },
  {
    id: 'sri-sri-university',
    name: 'Sri Sri University',
    shortName: 'SSU Cuttack',
    country: 'India',
    state: 'Odisha',
    city: 'Cuttack',
    type: 'Private',
    website: 'https://srisriuniversity.edu.in',
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
    description: 'Sri Sri University (SSU) is a premier UGC-recognized university situated on a serene 187-acre eco-friendly campus in Cuttack (near Bhubaneswar), Odisha. Its Department of Forensic Science under the Faculty of Science offers interdisciplinary, cutting-edge education in crime scene management, forensic chemistry, DNA serology, ballistics, and cyber forensics, blending rigorous scientific methodology with value-based ethics.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) Forensic Science (with Digital & Cyber Forensics)',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: '10+2 with Science stream (Physics, Chemistry, and Mathematics / Biology) with min 45-50% aggregate marks (5% relaxation for reserved categories)',
        estimatedFees: '₹60,000 / semester (approx ₹1,20,000 / year)',
        mode: 'Full-time',
        specializations: [
          'Digital & Cyber Forensics',
          'Crime Scene Management & Investigation',
          'Forensic Toxicology & Chemistry',
          'Fingerprint Science & Questioned Documents',
          'Forensic Biology & DNA Profiling',
          'Forensic Ballistics & Audio-Video Analysis'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or B.Sc. with Chemistry / Physics / Botany / Zoology / Biochemistry / Biotechnology (Min 50% aggregate)',
        estimatedFees: '₹60,000 / semester (approx ₹1,20,000 / year)',
        mode: 'Full-time',
        specializations: [
          'Forensic Biology, Serology & DNA Profiling',
          'Forensic Chemistry & Toxicology',
          'Questioned Documents, Fingerprint & Photography',
          'Criminology & Forensic Psychology'
        ]
      },
      {
        name: 'M.Sc. Cyber Security & Digital Forensics',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor’s degree in Computer Science / IT / BCA / B.Tech / B.Sc. Forensic Science with min 50% marks',
        estimatedFees: '₹65,000 / semester (approx ₹1,30,000 / year)',
        mode: 'Full-time',
        specializations: [
          'Incident Response & Malware Forensics',
          'Network Defense & Cryptography',
          'Cloud & IoT Forensics'
        ]
      }
    ],
    feesRange: '₹90,000 - ₹1,30,000 / year',
    admissionProcess: 'Merit-based on 10+2 / Graduation scores, or entrance performance in SSU CET, CUET UG, or AIFSET (All India Forensic Science Entrance Test) followed by counseling.',
    accreditation: 'UGC Recognized | Established under Sri Sri University Act | AIU Member | NAAC Accredited',
    contactEmail: 'info@srisriuniversity.edu.in',
    contactPhone: '+91 78944 24562',
    address: 'Sri Sri Vihar, Ward No. 3, Godisahi, Bidyadharpur, Cuttack, Odisha 754006, India',
    ranking: 'Top Private University in Eastern India | Award for Excellence in Holistic & Green Education',
    facilities: [
      'Advanced Forensic Chemistry & Instrumental Toxicology Lab',
      'DNA Extraction, Forensic Serology & Molecular Biology Lab',
      'Crime Scene Simulation & Physical Evidence Preservation Unit',
      'Questioned Documents, Latent Fingerprints & Forgery Lab',
      'Digital Forensics, Cyber Defense & Ethical Hacking Lab',
      'Ballistics, Tool Marks & Comparison Microscopy Suite',
      'Audio-Video Analysis & Biometrics Lab',
      'Central Multi-Storeyed University Library & E-Learning Portal',
      'Serene 187-Acre Eco-Friendly Green Campus with High-Speed Wi-Fi',
      'On-Campus Separate Hostels for Boys & Girls with 24/7 Security & Cafeteria',
      'University Bus Fleet Servicing Cuttack & Bhubaneswar Twin Cities'
    ],
    featured: true
  },
  {
    id: 'nfsu-gandhinagar',
    name: 'National Forensic Sciences University (NFSU) - Gandhinagar Campus (Headquarters)',
    shortName: 'NFSU Gandhinagar (HQ)',
    country: 'India',
    state: 'Gujarat',
    city: 'Gandhinagar',
    type: 'Central',
    website: 'https://gujarat.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://gujarat.nfsu.ac.in/img/facility/Arial_View.jpg',
    description: 'National Forensic Sciences University (NFSU), Gandhinagar is an Institution of National Importance established by the Parliament of India under the National Forensic Sciences University Act, 2020 under the Ministry of Home Affairs, Government of India (formerly Gujarat Forensic Sciences University, est. 2009). Serving as the global headquarters of the world\'s first and only university dedicated exclusively to Forensic, Behavioural, Cybersecurity, Digital Forensics, Law, Pharmacy, and Allied Sciences, the Gandhinagar campus houses 12 specialized schools and national Centres of Excellence.',
    coursesOffered: [
      {
        name: 'B.Sc. - M.Sc. Forensic Science (5-Year Integrated)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 (or equivalent) in Science stream with Physics, Chemistry, and Biology / Mathematics with minimum 60% aggregate marks (55% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents & Fingerprint Science',
          'Forensic Physics & Ballistics',
          'Digital & Cyber Forensics'
        ]
      },
      {
        name: 'M.Sc. Forensic Science / Forensic Biotechnology / Toxicology / Multimedia Forensics',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Engineering / Pharmacy with minimum 55% aggregate marks (50% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 - ₹75,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Science (Toxicology, Biology, Ballistics, Questioned Documents)',
          'M.Sc. Forensic Biotechnology & M.Sc. Forensic Nanotechnology',
          'M.Sc. Toxicology & M.Sc. Forensic Dentistry (Odontology)',
          'M.Sc. Multimedia Forensics & M.Sc. Forensic Nursing'
        ]
      },
      {
        name: 'B.Tech. - M.Tech. CSE (Cyber Security) / M.Tech. Cyber Security / M.Sc. Digital Forensics & Information Security',
        degreeLevel: 'Master',
        duration: '2 Years / 5 Years Integrated',
        eligibility: '10+2 with PCM (Min 60%) for B.Tech.-M.Tech. | B.E./B.Tech./M.Sc./MCA (Min 55%) for M.Tech./M.Sc. + NFAT / GATE',
        estimatedFees: '₹65,000 - ₹75,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Digital Forensics & Information Security (DFIS)',
          'Cyber Security, Incident Response & Malware Analysis',
          'AI & Data Science (Specialization in Cyber Security)',
          'Forensic Structural Engineering (M.Tech. Civil)'
        ]
      },
      {
        name: 'M.Sc. Forensic Psychology / Neuropsychology / M.A. Criminology / B.Sc. Criminology & Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years / 3 Years',
        eligibility: '10+2 for B.Sc. (3 Years) | Bachelor\'s degree in Psychology / Science / Arts with minimum 55% aggregate marks for Master\'s + NFAT',
        estimatedFees: '₹55,000 - ₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Psychology, Polygraph, BEOS & Narco-Analysis',
          'Clinical Psychology & Neuropsychology',
          'Criminology, Victimology & Homeland Security'
        ]
      },
      {
        name: 'MBA Forensic Accounting & Fraud Investigation / Cyber Security Management / B.Sc. LL.B. (Hons.) / LL.M.',
        degreeLevel: 'Master',
        duration: '2 Years / 5 Years Integrated / 1 Year',
        eligibility: 'Bachelor\'s degree with minimum 55% marks for MBA/LL.B./LL.M. or 10+2 for 5-Year Integrated BBA-MBA / B.Sc. LL.B. + NFAT / CLAT / CAT',
        estimatedFees: '₹60,000 - ₹75,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Accounting, Fraud Investigation & Fintech Forensics',
          'Cyber Security Management & Business Analytics',
          'Criminal Law, Cyber Law & Cyber Crime Investigation'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science, Cyber Security, Behavioural Forensics, Law & Pharmacy',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s degree in relevant discipline with minimum 55% aggregate marks + NFAT-Ph.D. / UGC-NET / CSIR-NET / GATE + Interview',
        estimatedFees: '₹30,000 - ₹40,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemical, Biological & Physical Sciences',
          'Cyber Security, Cryptography & Digital Forensics',
          'Behavioural Forensics, Forensic Pharmacy & Medico-Legal Studies'
        ]
      }
    ],
    feesRange: '₹55,000 - ₹75,000 / semester',
    admissionProcess: 'National Forensic Admission Test (NFAT) conducted annually by NFSU across India (and CLAT / JEE / GATE / CAT where applicable) followed by centralized merit counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | NAAC A Grade | UGC, BCI, PCI & RCI Recognized',
    contactEmail: 'director@nfsu.ac.in',
    contactPhone: '+91 79 23977100',
    address: 'National Forensic Sciences University, Sector 9, Near Police Bhavan, Gandhinagar, Gujarat 382007, India',
    ranking: '#1 World\'s First & Only Dedicated Forensic Sciences University | Institution of National Importance (MHA, Govt. of India)',
    facilities: [
      'Centre of Excellence for DNA Forensics, Narcotics Drugs & Psychotropic Substances (NDPS)',
      'Underground Ballistics Testing Range & Advanced Firearms Research Facility',
      'Centre of Excellence in Cyber Security, Digital Forensics & Semiconductor Security',
      'Brain Electrical Oscillation Signature (BEOS), Polygraph & Neuropsychology Laboratories',
      'Simulated Crime Scene House, Questioned Document (VSC-8000) & Fingerprint Bureaus',
      'Central Forensic Library, International Guest House, Auditorium & On-Campus Hostels'
    ],
    featured: true
  },
  {
    id: 'nfsu-delhi',
    name: 'National Forensic Sciences University (NFSU) - Delhi Campus (LNJN NICFS)',
    shortName: 'NFSU Delhi (LNJN NICFS)',
    country: 'India',
    state: 'Delhi',
    city: 'New Delhi',
    type: 'Central',
    website: 'https://delhi.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://delhi.nfsu.ac.in/img/delhi_banner.jpg',
    description: 'National Forensic Sciences University (NFSU) – Delhi Campus (formerly Lok Nayak Jayaprakash Narayan National Institute of Criminology and Forensic Science, LNJN NICFS, established in 1972 under the Ministry of Home Affairs, Government of India) is an Institution of National Importance located in Sector 3, Rohini, New Delhi. With over five decades of legacy training IPS officers, judges, prosecutors, and forensic scientists, the campus offers flagship integrated, postgraduate, diploma, and doctoral programs in Forensic Science, Criminology, Digital Forensics, Behavioural Forensics, Law, and Forensic Accounting.',
    coursesOffered: [
      {
        name: 'B.Sc. - M.Sc. Forensic Science (5-Year Integrated)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 in Science stream with Physics, Chemistry, and Biology / Mathematics (Min 60% marks, 55% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Physical Evidence',
          'Forensic Biology, Serology & DNA Profiling',
          'Forensic Chemistry & Toxicology',
          'Questioned Documents, Fingerprints & Forensic Ballistics'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or Bachelor\'s degree in Science / Medicine / Pharmacy with minimum 55% aggregate marks + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology & DNA Fingerprinting',
          'Questioned Document Examination & Fingerprint Science',
          'Forensic Physics & Ballistics'
        ]
      },
      {
        name: 'B.Tech. - M.Tech. CSE (Cyber Security) & M.Sc. Digital Forensics and Information Security',
        degreeLevel: 'Master',
        duration: '5 Years Integrated / 2 Years',
        eligibility: '10+2 with PCM (Min 60%) for B.Tech.-M.Tech. | B.E./B.Tech./B.Sc. (CS/IT)/BCA (Min 55%) for M.Sc. DFIS + NFAT',
        estimatedFees: '₹65,000 - ₹75,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Cyber Security, Network Forensics & Incident Response',
          'Digital Evidence Recovery, Mobile & Cloud Forensics'
        ]
      },
      {
        name: 'B.Sc. Criminology & Forensic Science / M.A. Criminology / M.Sc. Forensic Psychology / M.A. Clinical Psychology',
        degreeLevel: 'Master',
        duration: '3 Years / 2 Years',
        eligibility: '10+2 for B.Sc. (3 Years) | Bachelor\'s degree with minimum 55% aggregate marks for M.A./M.Sc. + NFAT',
        estimatedFees: '₹55,000 - ₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Criminology, Criminal Justice & Forensic Psychology',
          'Clinical Psychology & Behavioural Forensics'
        ]
      },
      {
        name: 'B.B.A. LL.B. (Hons.) / LL.M. (Criminal Law & Criminal Justice Administration) / BBA-MBA (Forensic Accounting)',
        degreeLevel: 'Master',
        duration: '5 Years Integrated / 1 Year',
        eligibility: '10+2 (Min 60%) + CLAT / NFAT for 5-Year Integrated programs | LL.B. (Min 55%) + CLAT PG / NFAT for LL.M.',
        estimatedFees: '₹60,000 - ₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Criminal Law, Forensic Justice & Policy Studies',
          'Forensic Accounting & Fraud Investigation'
        ]
      },
      {
        name: 'PG Professional Diplomas (Crime Scene Management / Fingerprint Science / Document Examination / Canine Forensics)',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year / 6 Months',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science or allied discipline with minimum 50% aggregate marks + NFAT',
        estimatedFees: '₹20,000 - ₹30,000 / semester',
        mode: 'Full-time',
        specializations: [
          'PG Diploma in Crime Scene Management',
          'PG Diploma in Fingerprint Science & Forensic Document Examination',
          'Professional Diploma in Canine Forensics (6 Months)'
        ]
      }
    ],
    feesRange: '₹55,000 - ₹75,000 / semester',
    admissionProcess: 'Admission through the National Forensic Admission Test (NFAT) conducted by NFSU (and CLAT for Law programs) followed by centralized counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | BCI & RCI Recognized',
    contactEmail: 'directoroffice_dc@nfsu.ac.in',
    contactPhone: '+91 11 27521091',
    address: 'LNJN-NICFS Campus, Near Jaipur Golden Hospital, Outer Ring Road, Institutional Area, Sector 3, Rohini, Delhi 110085, India',
    ranking: 'Premier National Capital Campus of NFSU (Est. 1972 as ICFS/NICFS under MHA)',
    facilities: [
      'Forensic Chemistry, Toxicology & Advanced GC-MS / FTIR Instrumentation Lab',
      'Forensic Biology, Serology & DNA Profiling Laboratory',
      'Questioned Document Examination, VSC & Fingerprint Science Laboratory',
      'Forensic Ballistics, Comparison Microscopy & Crime Scene Simulation Lab',
      'Cyber Security, Digital Forensics & Behavioural Forensics Laboratories',
      'National Criminology & Forensic Reference Library, Moot Court Hall & Executive Hostel Complex'
    ],
    featured: true
  },
  {
    id: 'nfsu-goa',
    name: 'National Forensic Sciences University (NFSU) - Goa Campus',
    shortName: 'NFSU Goa',
    country: 'India',
    state: 'Goa',
    city: 'Ponda',
    type: 'Central',
    website: 'https://goa.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://goa.nfsu.ac.in/img/goa_campus_banner.jpg',
    description: 'National Forensic Sciences University (NFSU) – Goa Campus, established in 2021 under the Ministry of Home Affairs, Government of India, is an Institution of National Importance located at Curti, Ponda, Goa. The campus houses specialized Departments of Forensic Sciences and Cyber Security & Digital Forensics, offering 5-Year Integrated B.Sc.-M.Sc. Forensic Science, M.Sc. Forensic Science, M.Sc. Cyber Security, M.Sc. Digital Forensics & Information Security, M.Tech. AI & Data Science (Cyber Security), and PG Diploma programs along with coastal, marine, and wildlife forensics research.',
    coursesOffered: [
      {
        name: 'B.Sc. - M.Sc. Forensic Science (5-Year Integrated)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 in Science stream with Physics, Chemistry, and Biology / Mathematics with minimum 60% aggregate marks (55% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry, Toxicology & Trace Evidence',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents, Fingerprints & Crime Scene Reconstruction'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Pharmacy with minimum 55% aggregate marks (50% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology & DNA Forensics',
          'Questioned Documents, Fingerprints & Ballistics'
        ]
      },
      {
        name: 'M.Sc. Cyber Security / M.Sc. Digital Forensics and Information Security',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.E./B.Tech. or B.Sc. in Computer Science / IT / Electronics / Forensic Science or BCA with minimum 55% aggregate marks + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Cyber Security, Vulnerability Assessment & Penetration Testing',
          'Digital Forensics, Incident Response & Network Security'
        ]
      },
      {
        name: 'M.Tech. Artificial Intelligence and Data Science (Specialization in Cyber Security)',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.E./B.Tech. in CSE / IT / AI / Data Science / ECE or MCA / M.Sc. (CS/IT) with minimum 55% aggregate marks + GATE / NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'AI-Driven Threat Intelligence & Cyber Security Analytics',
          'Machine Learning for Digital Forensics & Anomaly Detection'
        ]
      },
      {
        name: 'PG Professional Diploma in Crime Scene Management / PG Diploma in Cyber Security',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science / Engineering / Allied discipline from a recognized university with minimum 50% marks + NFAT',
        estimatedFees: '₹20,000 - ₹30,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Management & Evidence Preservation',
          'Applied Cyber Security & Digital Crime Investigation'
        ]
      }
    ],
    feesRange: '₹20,000 - ₹65,000 / semester',
    admissionProcess: 'National Forensic Admission Test (NFAT) conducted annually by NFSU (including Goa State Domicile Quota seats as per norms) followed by centralized counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | UGC Recognized',
    contactEmail: 'director_goa@nfsu.ac.in',
    contactPhone: '+91 832 2313036',
    address: 'National Forensic Sciences University – Goa Campus, Opposite Goa Dairy, Curti, Ponda, Goa 403401, India',
    ranking: 'Western & Coastal Regional Campus of NFSU (Institution of National Importance)',
    facilities: [
      'Forensic Chemistry, HPLC, Raman Spectroscopy & Analytical Toxicology Laboratory',
      'Forensic Biology, Serology & Atomic Force Microscopy (AFM) Research Facility',
      'Questioned Documents, Fingerprint Science & Crime Scene Investigation Lab',
      'Advanced Cyber Security, AI/Data Science & Digital Forensics Laboratory',
      'Campus Library, Smart Classrooms, Futsal Arena & Student Hostel Facilities'
    ],
    featured: true
  },
  {
    id: 'nfsu-tripura',
    name: 'National Forensic Sciences University (NFSU) - Tripura Campus',
    shortName: 'NFSU Tripura (Agartala)',
    country: 'India',
    state: 'Tripura',
    city: 'Agartala',
    type: 'Central',
    website: 'https://tripura.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://tripura.nfsu.ac.in/img/Tripura_banner.jpg',
    description: 'National Forensic Sciences University (NFSU) – Tripura Campus in Agartala, established in 2021 under the Ministry of Home Affairs, Government of India, is the first NFSU campus in Northeast India and an Institution of National Importance. Operating from its Radhanagar VIP Road campus in Agartala (with a permanent campus coming up at Srinagar, Agartala), it offers 5-Year Integrated B.Sc.-M.Sc. Forensic Science, 5-Year Integrated B.Tech.-M.Tech. CSE (Cyber Security), M.Sc. Forensic Science, and PG Professional Diploma in Crime Scene Management.',
    coursesOffered: [
      {
        name: 'B.Sc. - M.Sc. Forensic Science (5-Year Integrated)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 in Science stream with Physics, Chemistry, and Biology / Mathematics with minimum 60% aggregate marks (55% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Biology, Serology & DNA Profiling',
          'Forensic Chemistry, Toxicology & Narcotics Analysis',
          'Questioned Documents, Fingerprints & Forensic Ballistics'
        ]
      },
      {
        name: 'B.Tech. - M.Tech. Computer Science & Engineering (Cyber Security) (5-Year Integrated)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 with Physics, Mathematics, and Chemistry / Computer Science with minimum 60% aggregate marks (55% for SC/ST/PwD) + NFAT / JEE Main',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Cyber Security, Cryptography & Network Defense',
          'Digital Forensics, Incident Response & Secure Software Engineering'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Pharmacy with minimum 55% aggregate marks (50% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Toxicology',
          'Forensic Biology & Serology',
          'Forensic Physics, Ballistics & Questioned Documents'
        ]
      },
      {
        name: 'Post Graduate Professional Diploma in Crime Scene Management',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science or allied discipline from a recognized university with minimum 50% marks + NFAT',
        estimatedFees: '₹20,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Reconstruction, Evidence Collection & Chain of Custody',
          'Forensic Photography, Bloodstain Pattern & Impression Analysis'
        ]
      }
    ],
    feesRange: '₹20,000 - ₹65,000 / semester',
    admissionProcess: 'Admission through the National Forensic Admission Test (NFAT) conducted annually by NFSU followed by centralized university counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | UGC Recognized',
    contactEmail: 'director_tripura@nfsu.ac.in',
    contactPhone: '+91 381 2310009',
    address: 'National Forensic Sciences University – Tripura Campus, VIP Road, Radhanagar, Adjacent to Buddha Mandir, Agartala, Tripura (West) 799001, India',
    ranking: 'First Northeast India Campus of NFSU (Institution of National Importance)',
    facilities: [
      'Forensic Ballistics, Airgun Testing & Crime Scene Investigation Laboratory',
      'Forensic Chemistry, Toxicology & Biological Sciences Laboratory',
      'Questioned Documents & Fingerprint Examination Unit',
      'Cyber Security & Digital Forensics Computer Lab',
      'Campus Library, Auditorium, Administrative & Academic Blocks'
    ],
    featured: true
  },
  {
    id: 'nfsu-bhopal',
    name: 'National Forensic Sciences University (NFSU) - Bhopal Campus',
    shortName: 'NFSU Bhopal',
    country: 'India',
    state: 'Madhya Pradesh',
    city: 'Bhopal',
    type: 'Central',
    website: 'https://bhopal.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://bhopal.nfsu.ac.in/img/facility/bhopal/AcademicUnit.jpg',
    description: 'National Forensic Sciences University (NFSU) – Bhopal Campus, established in 2022 under the Ministry of Home Affairs, Government of India, is an Institution of National Importance operating alongside the Central Forensic Science Laboratory (CFSL) at Barkhera Bonder, Bhopal, Madhya Pradesh. It offers 5-Year Integrated B.Sc.-M.Sc. Forensic Science, M.Sc. Forensic Science, M.Sc. Cyber Security, M.Sc. Digital Forensics and Information Security, PG Diplomas in Crime Scene Management & Forensic Document Examination, and Doctoral research.',
    coursesOffered: [
      {
        name: 'B.Sc. - M.Sc. Forensic Science (5-Year Integrated)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 in Science stream with Physics, Chemistry, and Biology / Mathematics with minimum 60% aggregate marks (55% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry, Toxicology & Trace Evidence',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents, Fingerprints & Ballistics'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Pharmacy with minimum 55% aggregate marks (50% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Toxicology & Chemical Analysis',
          'Forensic Biology, Serology & Wildlife Forensics',
          'Questioned Document Examination, Fingerprints & Ballistics'
        ]
      },
      {
        name: 'M.Sc. Cyber Security / M.Sc. Digital Forensics and Information Security',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.E./B.Tech. or B.Sc. in CS / IT / Electronics / Forensic Science or BCA with minimum 55% aggregate marks + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Cyber Security, Network Defense & Threat Hunting',
          'Digital Forensics, Mobile Forensics & Information Security'
        ]
      },
      {
        name: 'PG Professional Diploma in Crime Scene Management / Forensic Document Examination',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science or allied discipline with minimum 50% aggregate marks + NFAT',
        estimatedFees: '₹20,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Post Graduate Professional Diploma in Crime Scene Management',
          'Post Graduate Professional Diploma in Forensic Document Examination'
        ]
      }
    ],
    feesRange: '₹20,000 - ₹65,000 / semester',
    admissionProcess: 'Admission through the National Forensic Admission Test (NFAT) conducted annually by NFSU followed by centralized counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | UGC Recognized',
    contactEmail: 'info_bhopal@nfsu.ac.in',
    contactPhone: '+91 81094 90595',
    address: 'National Forensic Sciences University – Bhopal Campus, C/O Central Forensic Science Laboratory (CFSL), Barkhera Bonder, P.O. Bairagarh Kalan, Bhopal, Madhya Pradesh 462030, India',
    ranking: 'Central India Regional Campus of NFSU co-located with CFSL Bhopal',
    facilities: [
      'Crime Scene Management & Reconstruction Laboratory',
      'Forensic Document Examination, Fingerprint & Criminalistics Lab',
      'Forensic Chemistry, Biology & Serology Laboratories',
      'Cyber Security & Digital Forensics Laboratory',
      'Co-located with CFSL Bhopal Campus, Conference Hall, Library & Cafeteria'
    ],
    featured: true
  },
  {
    id: 'nfsu-pune',
    name: 'National Forensic Sciences University (NFSU) - Pune Campus',
    shortName: 'NFSU Pune',
    country: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    type: 'Central',
    website: 'https://pune.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://pune.nfsu.ac.in/img/facility/Pune/Infrastructure.jpg',
    description: 'National Forensic Sciences University (NFSU) – Pune Campus, established in 2022 under the Ministry of Home Affairs, Government of India, is an Institution of National Importance operating at the Central Forensic Science Laboratory (CFSL) Campus in Nanoli Chakan, Talegaon MIDC, Maval, Pune, Maharashtra. Built in direct academic and laboratory synergy with CFSL Pune (DFSS, MHA), the campus specializes in intensive practical training in Crime Scene Management, Forensic Science, and Criminalistics.',
    coursesOffered: [
      {
        name: 'Post Graduate Professional Diploma in Crime Scene Management',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Allied discipline from a recognized university with minimum 50% aggregate marks + NFAT',
        estimatedFees: '₹20,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation, Reconstruction & Evidence Collection',
          'Forensic Photography, Bloodstain Pattern & Trace Evidence Analysis',
          'Fingerprints, Questioned Documents & Medico-Legal Evidence Handling'
        ]
      }
    ],
    feesRange: '₹20,000 - ₹65,000 / semester',
    admissionProcess: 'Admission through the National Forensic Admission Test (NFAT) / Merit conducted annually by NFSU followed by centralized counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | Co-located with CFSL Pune',
    contactEmail: 'info_pune@nfsu.ac.in',
    contactPhone: '+91 94284 64525',
    address: 'National Forensic Sciences University – Pune Campus, C/O Central Forensic Science Laboratory (CFSL), Gate No. 6, Nanoli Chakan, Talegaon MIDC, Near JCB Factory, Maval, Pune, Maharashtra 410507, India',
    ranking: 'Specialized CFSL-Integrated Campus of NFSU in Pune, Maharashtra',
    facilities: [
      'Crime Scene Management & Criminalistics Laboratory within CFSL Pune Premises',
      'Forensic Science Practical & Trace Evidence Examination Lab',
      'Smart Classrooms, Reference Library & CFSL Scientific Exposure'
    ],
    featured: true
  },
  {
    id: 'nfsu-guwahati',
    name: 'National Forensic Sciences University (NFSU) - Guwahati Campus',
    shortName: 'NFSU Guwahati',
    country: 'India',
    state: 'Assam',
    city: 'Guwahati',
    type: 'Central',
    website: 'https://guwahati.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://guwahati.nfsu.ac.in/img/facility/Guwahati/NFSU-Guwhatai-Campus.jpg',
    description: 'National Forensic Sciences University (NFSU) – Guwahati Campus, inaugurated in May 2023 under the Ministry of Home Affairs, Government of India, is an Institution of National Importance located at Narakasur Hilltop, Bhangagarh, Guwahati, Assam (with a 50-acre permanent campus at Changsari, Kamrup). Serving as a premier forensic and cybersecurity hub for Northeast India and ASEAN nations, the campus offers 5-Year Integrated B.Tech.-M.Tech. CSE (Cyber Security), M.Sc. Forensic Science, and PG Professional Diplomas in Crime Scene Management and Cyber Crime Investigation.',
    coursesOffered: [
      {
        name: 'B.Tech. - M.Tech. Computer Science & Engineering (Cyber Security) (5-Year Integrated)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 with Physics, Mathematics, and Chemistry / Computer Science with minimum 60% aggregate marks (55% for SC/ST/PwD) + NFAT / JEE Main',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Cyber Security, Network Defense & Cryptography',
          'Digital Forensics, Malware Analysis & Cloud Security'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Pharmacy with minimum 55% aggregate marks (50% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents, Fingerprints & Forensic Ballistics'
        ]
      },
      {
        name: 'PG Professional Diploma in Crime Scene Management / Cyber Crime Investigation',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science / Engineering / Allied discipline with minimum 50% aggregate marks + NFAT',
        estimatedFees: '₹20,000 - ₹30,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Post Graduate Professional Diploma in Crime Scene Management',
          'Post Graduate Professional Diploma in Cyber Crime Investigation'
        ]
      }
    ],
    feesRange: '₹20,000 - ₹65,000 / semester',
    admissionProcess: 'Admission through the National Forensic Admission Test (NFAT) conducted annually by NFSU followed by centralized counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | UGC Recognized',
    contactEmail: 'director_guwahati@nfsu.ac.in',
    contactPhone: '+91 361 2349915',
    address: 'National Forensic Sciences University – Guwahati Campus, Narakasur Hilltop, GMCH Road, Bhangagarh, Guwahati, Kamrup (M), Assam 781032, India',
    ranking: 'Premier Assam & Northeast Hub of NFSU (Institution of National Importance)',
    facilities: [
      'Department of Forensic Sciences Criminalistics, Biology & Chemistry Labs',
      'Department of Cyber Security & Digital Forensics High-Performance Lab',
      'Crime Scene Reconstruction & Investigation Training Facility',
      'Academic Wing, Seminar Hall, Library & Sports Facilities at Narakasur Hilltop'
    ],
    featured: true
  },
  {
    id: 'nfsu-manipur',
    name: 'National Forensic Sciences University (NFSU) - Manipur Campus',
    shortName: 'NFSU Manipur (Imphal)',
    country: 'India',
    state: 'Manipur',
    city: 'Imphal',
    type: 'Central',
    website: 'https://manipur.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://manipur.nfsu.ac.in/img/12.jpg',
    description: 'National Forensic Sciences University (NFSU) – Manipur Campus (Institute of Forensic Sciences for Training & Skilling) is an Institution of National Importance under the Ministry of Home Affairs, Government of India, located at the Manipur Police Training College (MPTC) Compound, Pangei, Imphal East, Manipur in collaboration with the Directorate of Forensic Sciences (DFS), Manipur. It offers specialized Postgraduate Professional Diplomas in Crime Scene Management, Cyber Crime Investigation, and Drug & Substance Abuse Law.',
    coursesOffered: [
      {
        name: 'Post Graduate Professional Diploma in Crime Scene Management',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science or allied discipline with minimum 50% aggregate marks + NFAT',
        estimatedFees: '₹20,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation, Physical Evidence Collection & Reconstruction',
          'Fingerprints, Questioned Documents & Trace Evidence Analysis'
        ]
      },
      {
        name: 'Post Graduate Professional Diploma in Cyber Crime Investigation',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science / Engineering / Computer Applications / IT with minimum 50% aggregate marks + NFAT',
        estimatedFees: '₹20,000 - ₹30,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Digital Evidence Acquisition, Network Forensics & Cyber Incident Response',
          'Mobile Forensics, OSINT & Cyber Law'
        ]
      },
      {
        name: 'Post Graduate Professional Diploma in Drug and Substance Abuse Law',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Law / Science / Forensic Science / Pharmacy or allied stream with minimum 50% aggregate marks + NFAT',
        estimatedFees: '₹20,000 / semester',
        mode: 'Full-time',
        specializations: [
          'NDPS Act Jurisprudence, Narcotics Investigation & Illicit Drug Seizure Protocols',
          'Forensic Narcotics Testing & Chain of Custody'
        ]
      }
    ],
    feesRange: '₹20,000 - ₹30,000 / semester',
    admissionProcess: 'Admission through the National Forensic Admission Test (NFAT) / Merit conducted by NFSU followed by counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India',
    contactEmail: 'admissions_manipur@nfsu.ac.in',
    contactPhone: '+91 92335 91616',
    address: 'National Forensic Sciences University – Manipur Campus, Southern Wing, MPTC Compound, C/O Director, DFS-Manipur, Pangei, Imphal East, Imphal, Manipur 795114, India',
    ranking: 'Specialized Training & Skilling Campus of NFSU at MPTC / DFS Manipur',
    facilities: [
      'Institute of Forensic Sciences for Training & Skilling Laboratories',
      'Collaboration with Directorate of Forensic Sciences (DFS) Manipur & MPTC Pangei',
      'Crime Scene Investigation, Cyber Crime & Narcotics Forensics Training Units'
    ],
    featured: true
  },
  {
    id: 'nfsu-dharwad',
    name: 'National Forensic Sciences University (NFSU) - Dharwad Campus',
    shortName: 'NFSU Dharwad (Karnataka)',
    country: 'India',
    state: 'Karnataka',
    city: 'Dharwad',
    type: 'Central',
    website: 'https://dharwad.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://dharwad.nfsu.ac.in/img/facility/Dharwad/Anthropology%20Lab.JPG',
    description: 'National Forensic Sciences University (NFSU) – Dharwad Campus in Hubballi-Dharwad, Karnataka, established in 2023 under the Ministry of Home Affairs, Government of India, is South India\'s flagship NFSU campus and an Institution of National Importance. Operating from the WALMI Campus near the High Court on PB Road, Dharwad (with a permanent campus coming up in Dharwad), it offers 5-Year Integrated B.Sc.-M.Sc. Forensic Science, 5-Year Integrated B.Tech.-M.Tech. CSE (Cyber Security), M.Sc. Forensic Science, M.Tech. Cyber Security, and M.Pharm. Forensic Pharmacy.',
    coursesOffered: [
      {
        name: 'B.Sc. - M.Sc. Forensic Science (5-Year Integrated)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 in Science stream with Physics, Chemistry, and Biology / Mathematics with minimum 60% aggregate marks (55% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Biology, Anthropology, Serology & DNA Profiling',
          'Forensic Chemistry, Toxicology & Questioned Documents',
          'Fingerprint Science, Forensic Physics & Crime Scene Investigation'
        ]
      },
      {
        name: 'B.Tech. - M.Tech. Computer Science & Engineering (Cyber Security) (5-Year Integrated)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 with Physics, Mathematics, and Chemistry / Computer Science with minimum 60% aggregate marks (55% for SC/ST/PwD) + NFAT / JEE Main',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Cyber Security, Ethical Hacking & Network Security',
          'Digital Forensics, Incident Response & Cloud Security'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Pharmacy with minimum 55% aggregate marks (50% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology & Anthropology',
          'Questioned Document Examination, Fingerprints & Ballistics'
        ]
      },
      {
        name: 'M.Tech. Cyber Security',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.E./B.Tech. in CSE / IT / ECE or MCA / M.Sc. (CS/IT) with minimum 55% aggregate marks + GATE / NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Advanced Cyber Defense, Vulnerability Assessment & Malware Analysis',
          'IoT Security, Cryptography & Digital Forensics'
        ]
      },
      {
        name: 'M.Pharm. Forensic Pharmacy',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Pharm. from a PCI-approved institution with minimum 55% aggregate marks (50% for SC/ST/PwD) + GPAT / NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Pharmaceutical Analysis, Counterfeit Drug Detection & NDPS Profiling',
          'Analytical Toxicology & Regulatory Forensics'
        ]
      }
    ],
    feesRange: '₹65,000 / semester',
    admissionProcess: 'Admission through the National Forensic Admission Test (NFAT) / JEE Main / GATE / GPAT conducted by NFSU followed by centralized counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | UGC Recognized',
    contactEmail: 'rajesh.c@nfsu.ac.in',
    contactPhone: '+91 94815 15684',
    address: 'National Forensic Sciences University – Dharwad Campus, WALMI Campus, Near High Court, PB Road, Belur Industrial Area, Dharwad, Karnataka 580011, India',
    ranking: 'Premier Karnataka & South India Campus of NFSU (Institution of National Importance)',
    facilities: [
      'Forensic Anthropology, Biology & Serology Laboratory',
      'Advanced Document Examination System & Fingerprint Laboratory',
      'Forensic Chemistry, Toxicology & Forensic Pharmacy Instrumentation Lab',
      'Cyber Security & Digital Forensics Computing Laboratory',
      'Academic & Admin Complex, Library & Campus Canteen at WALMI Campus'
    ],
    featured: true
  },
  {
    id: 'nfsu-uganda',
    name: 'National Forensic Sciences University (NFSU) - Uganda Campus (International)',
    shortName: 'NFSU Uganda (Jinja)',
    country: 'Uganda',
    state: 'Eastern Region',
    city: 'Jinja',
    type: 'Central',
    website: 'https://uganda.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://uganda.nfsu.ac.in/img/uganda_banner.jpg',
    description: 'National Forensic Sciences University (NFSU) – Uganda Campus in Jinja, inaugurated in April 2023 by the External Affairs Minister of India in partnership with the Government of the Republic of Uganda (UPDF), holds the historic distinction of being the first-ever overseas campus of a public university of India. Located at Jinja, Uganda, it serves students, law enforcement, and defence personnel across Africa with postgraduate and diploma programs in Forensic Science, Digital Forensics, Cyber Security, and Homeland Security.',
    coursesOffered: [
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Pharmacy or equivalent with minimum 55% aggregate marks',
        estimatedFees: '$1,000 - $1,500 / semester (International Tariff)',
        mode: 'Full-time',
        specializations: [
          'Forensic Biology, Serology & DNA Profiling',
          'Forensic Chemistry, Toxicology & Trace Evidence',
          'Questioned Documents, Fingerprints & Ballistics'
        ]
      },
      {
        name: 'M.Sc. Digital Forensics and Information Security',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Computer Science / IT / Engineering / Science with minimum 55% aggregate marks',
        estimatedFees: '$1,000 - $1,500 / semester (International Tariff)',
        mode: 'Full-time',
        specializations: [
          'Digital Evidence Analysis, Network & Mobile Forensics',
          'Information Security, Incident Response & Cyber Crime Investigation'
        ]
      },
      {
        name: 'PG Diploma in Crime Scene Management / Fingerprint & Questioned Documents',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science / Allied discipline from a recognized university',
        estimatedFees: '$750 - $1,000 / semester',
        mode: 'Full-time',
        specializations: [
          'PG Diploma in Crime Scene Management',
          'PG Diploma in Fingerprint & Questioned Documents'
        ]
      },
      {
        name: 'PG Diploma in Cyber Security / PG Diploma in Homeland Security',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in relevant discipline from a recognized university',
        estimatedFees: '$750 - $1,000 / semester',
        mode: 'Full-time',
        specializations: [
          'PG Diploma in Cyber Security',
          'PG Diploma in Homeland Security & Defence Studies'
        ]
      }
    ],
    feesRange: '$750 - $1,500 / semester',
    admissionProcess: 'Admission through NFSU International Admissions Portal (admission_uganda@nfsu.ac.in) and NFAT / Merit Evaluation.',
    accreditation: 'Institution of National Importance (Govt. of India) | Bilateral Partnership with Government of Uganda | NCHE Uganda Recognized',
    contactEmail: 'director_uganda@nfsu.ac.in',
    contactPhone: '+91 79 23977100',
    address: 'National Forensic Sciences University – International Campus, Gaddafi Barracks, P.O. Box 900690, Jinja, Republic of Uganda',
    ranking: 'First Overseas Campus of an Indian Public University | Premier Forensic Hub for East Africa',
    facilities: [
      'Forensic Science & Crime Scene Investigation Laboratories in Jinja',
      'Cyber Security & Digital Forensics Training Centre',
      'Fingerprint, Questioned Documents & Homeland Security Simulation Facilities',
      'International Residential & Academic Complex at Jinja Campus'
    ],
    featured: true
  },
  {
    id: 'nfsu-bhubaneswar',
    name: 'National Forensic Sciences University (NFSU) - Bhubaneswar Campus',
    shortName: 'NFSU Bhubaneswar',
    country: 'India',
    state: 'Odisha',
    city: 'Bhubaneswar',
    type: 'Central',
    website: 'https://bhubaneswar.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://bhubaneswar.nfsu.ac.in/img/Bhubaneswar_Banner.jpg',
    description: 'National Forensic Sciences University (NFSU) – Bhubaneswar Campus in Odisha is an Institution of National Importance under the Ministry of Home Affairs, Government of India. Operating from Sector A, Mancheswar Industrial Estate, Bhubaneswar (with a permanent campus coming up at Jatni near IIT Bhubaneswar), the campus houses Departments of Forensic Sciences, Cyber Security & Digital Forensics, and Law, Forensic Justice & Policy Studies.',
    coursesOffered: [
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Pharmacy with minimum 55% aggregate marks (50% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents, Fingerprints & Ballistics'
        ]
      },
      {
        name: 'M.Sc. Digital Forensics and Information Security',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.E./B.Tech. or B.Sc. in CS / IT / Electronics / Forensic Science or BCA with minimum 55% aggregate marks + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Digital Forensics, Incident Response & Malware Analysis',
          'Information Security, Network Defense & Cloud Forensics'
        ]
      },
      {
        name: 'LL.M. (Cyber Law and Cyber Crime Investigation)',
        degreeLevel: 'Master',
        duration: '1 Year',
        eligibility: 'Three-Year or Five-Year LL.B. degree from a recognized university with minimum 55% aggregate marks (50% for SC/ST/PwD) + CLAT PG / NFAT',
        estimatedFees: '₹60,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Cyber Law, Digital Evidence Admissibility & IT Act Jurisprudence',
          'Cyber Crime Investigation & Data Privacy Regulation'
        ]
      },
      {
        name: 'Post Graduate Professional Diploma in Crime Scene Management',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science or allied discipline with minimum 50% aggregate marks + NFAT',
        estimatedFees: '₹20,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation, Reconstruction & Physical Evidence Handling',
          'Forensic Photography & Impression Evidence'
        ]
      }
    ],
    feesRange: '₹20,000 - ₹65,000 / semester',
    admissionProcess: 'Admission through the National Forensic Admission Test (NFAT) / CLAT PG conducted annually by NFSU followed by centralized counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | UGC Recognized',
    contactEmail: 'admin_bbs@nfsu.ac.in',
    contactPhone: '+91 674 2627206',
    address: 'National Forensic Sciences University – Bhubaneswar Campus, Plot 145 & 146, Sector A, Mancheswar Industrial Estate, Bhubaneswar, Odisha 751010, India',
    ranking: 'Eastern India Regional Campus of NFSU in Bhubaneswar, Odisha',
    facilities: [
      'Department of Forensic Sciences Criminalistics, Chemistry & Biology Laboratories',
      'Department of Cyber Security & Digital Forensics Lab',
      'Department of Law, Forensic Justice & Policy Studies Academic Wing',
      'Campus Library, Smart Classrooms, Administrative Block & Cafeteria'
    ],
    featured: true
  },
  {
    id: 'nfsu-chennai',
    name: 'National Forensic Sciences University (NFSU) - Chennai Campus',
    shortName: 'NFSU Chennai',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Chennai',
    type: 'Central',
    website: 'https://chennai.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://chennai.nfsu.ac.in/img/chennai-campus.jpg',
    description: 'National Forensic Sciences University (NFSU) – Chennai Campus in Tamil Nadu is an Institution of National Importance under the Ministry of Home Affairs, Government of India. Located at Valasaravakkam, Chennai, the campus houses Departments of Forensic Sciences, Cyber Security & Digital Forensics, and Behavioural Forensics, offering B.Sc. Criminology and Forensic Science, M.Sc. Forensic Science, M.Sc. Cyber Security, and PG Professional Diploma in Crime Scene Management.',
    coursesOffered: [
      {
        name: 'B.Sc. Criminology and Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 Years',
        eligibility: '10+2 in Science / Arts / Commerce stream with minimum 55% aggregate marks (50% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹55,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Criminology, Penology, Victimology & Criminal Justice Administration',
          'Fundamentals of Forensic Science, Crime Scene Investigation & Behavioural Forensics'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Pharmacy with minimum 55% aggregate marks (50% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents, Fingerprints & Ballistics'
        ]
      },
      {
        name: 'M.Sc. Cyber Security',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.E./B.Tech. or B.Sc. in CS / IT / Electronics / Forensic Science or BCA with minimum 55% aggregate marks + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Cyber Security, Penetration Testing & Network Defense',
          'Digital Forensics, Incident Response & Cloud Security'
        ]
      },
      {
        name: 'Post Graduate Professional Diploma in Crime Scene Management',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science or allied discipline with minimum 50% aggregate marks + NFAT',
        estimatedFees: '₹20,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation, Reconstruction & Evidence Preservation',
          'Forensic Photography & Physical Evidence Analysis'
        ]
      }
    ],
    feesRange: '₹20,000 - ₹65,000 / semester',
    admissionProcess: 'Admission through the National Forensic Admission Test (NFAT) conducted annually by NFSU followed by centralized counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | UGC Recognized',
    contactEmail: 'academics_che@nfsu.ac.in',
    contactPhone: '+91 44 24763315',
    address: 'National Forensic Sciences University – Chennai Campus, Sri Devi Kuppam, Sri Lakshmi Nagar, 1st Main Road, Ashtalakshmi Nagar, Valasaravakkam, Chennai, Tamil Nadu 600087, India',
    ranking: 'Tamil Nadu & Southern Metropolitan Campus of NFSU (Institution of National Importance)',
    facilities: [
      'Department of Forensic Sciences Criminalistics, Chemistry & Biology Labs',
      'Department of Cyber Security & Digital Forensics Computing Lab',
      'Department of Behavioural Forensics & Criminology Academic Unit',
      'Smart Classrooms, Campus Library & Student Amenities in Valasaravakkam'
    ],
    featured: true
  },
  {
    id: 'nfsu-nagpur',
    name: 'National Forensic Sciences University (NFSU) - Nagpur Campus',
    shortName: 'NFSU Nagpur',
    country: 'India',
    state: 'Maharashtra',
    city: 'Nagpur',
    type: 'Central',
    website: 'https://nagpur.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://nagpur.nfsu.ac.in/img/nagpur_campus.jpg',
    description: 'National Forensic Sciences University (NFSU) – Nagpur Campus in Maharashtra is an Institution of National Importance under the Ministry of Home Affairs, Government of India. Operating from the IT Park on South Ambazari Road, Subhash Nagar, Nagpur (with a 50-acre permanent campus under development at Chincholi, Kamptee, Nagpur), the campus houses Departments of Forensic Sciences and Cyber Security & Digital Forensics, offering M.Sc. Forensic Science, M.Sc. Cyber Security, and PG Professional Diploma in Crime Scene Management.',
    coursesOffered: [
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Pharmacy with minimum 55% aggregate marks (50% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents, Fingerprints & Ballistics'
        ]
      },
      {
        name: 'M.Sc. Cyber Security',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.E./B.Tech. or B.Sc. in CS / IT / Electronics / Forensic Science or BCA with minimum 55% aggregate marks + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Cyber Security, Vulnerability Assessment & Threat Intelligence',
          'Digital Forensics, Incident Response & Network Defense'
        ]
      },
      {
        name: 'Post Graduate Professional Diploma in Crime Scene Management',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science or allied discipline with minimum 50% aggregate marks + NFAT',
        estimatedFees: '₹20,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Reconstruction, Evidence Collection & Chain of Custody',
          'Forensic Photography, Bloodstain Pattern & Trace Evidence Analysis'
        ]
      }
    ],
    feesRange: '₹20,000 - ₹65,000 / semester',
    admissionProcess: 'Admission through the National Forensic Admission Test (NFAT) conducted annually by NFSU followed by centralized counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | UGC Recognized',
    contactEmail: 'info_nagpur@nfsu.ac.in',
    contactPhone: '+91 712 2230050',
    address: 'National Forensic Sciences University – Nagpur Campus, IT Park, South Ambazari Road, Near BSNL Office, Subhash Nagar, Nagpur, Maharashtra 440022, India',
    ranking: 'Vidarbha & Central Maharashtra Campus of NFSU (Institution of National Importance)',
    facilities: [
      'Forensic Chemistry, Biology & Questioned Documents Laboratories',
      'Cyber Security & Digital Forensics High-Performance Lab at Nagpur IT Park',
      'Crime Scene Investigation & Simulation Facility',
      'Smart Classrooms, Digital Library & Campus Infrastructure'
    ],
    featured: true
  },
  {
    id: 'nfsu-jaipur',
    name: 'National Forensic Sciences University (NFSU) - Jaipur Campus',
    shortName: 'NFSU Jaipur',
    country: 'India',
    state: 'Rajasthan',
    city: 'Jaipur',
    type: 'Central',
    website: 'https://jaipur.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://jaipur.nfsu.ac.in/img/jaipur_campus.jpeg',
    description: 'National Forensic Sciences University (NFSU) – Jaipur Campus in Rajasthan is an Institution of National Importance under the Ministry of Home Affairs, Government of India. Located at Sector 16, Pratap Nagar (Haldighati Marg), Jaipur, the campus houses Departments of Forensic Sciences and Cyber Security & Digital Forensics, offering M.Sc. Forensic Science, M.Sc. Digital Forensics and Information Security, and PG Professional Diploma in Crime Scene Management.',
    coursesOffered: [
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Pharmacy with minimum 55% aggregate marks (50% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents, Fingerprints & Ballistics'
        ]
      },
      {
        name: 'M.Sc. Digital Forensics and Information Security',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.E./B.Tech. or B.Sc. in CS / IT / Electronics / Forensic Science or BCA with minimum 55% aggregate marks + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Digital Evidence Analysis, Mobile & Network Forensics',
          'Information Security, Cyber Incident Response & Malware Analysis'
        ]
      },
      {
        name: 'Post Graduate Professional Diploma in Crime Scene Management',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science or allied discipline with minimum 50% aggregate marks + NFAT',
        estimatedFees: '₹20,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation, Reconstruction & Physical Evidence Preservation',
          'Forensic Photography & Impression Evidence'
        ]
      }
    ],
    feesRange: '₹20,000 - ₹65,000 / semester',
    admissionProcess: 'Admission through the National Forensic Admission Test (NFAT) conducted annually by NFSU followed by centralized counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | UGC Recognized',
    contactEmail: 'info_jai@nfsu.ac.in',
    contactPhone: '+91 141 2755100',
    address: 'National Forensic Sciences University – Jaipur Campus, Tower No. 8, Coaching Hub, Sector 16, Pratap Nagar, Haldighati Marg, Jaipur, Rajasthan 302033, India',
    ranking: 'Rajasthan Regional Campus of NFSU (Institution of National Importance)',
    facilities: [
      'Digital Forensics and Cyber Security Laboratory',
      'Forensic Science, Biology, Chemistry & Crime Scene Investigation Labs',
      'Modern Smart Classrooms, Board Room & Reference Library at Pratap Nagar Hub',
      'Campus Transport & Student Support Facilities'
    ],
    featured: true
  },
  {
    id: 'nfsu-raipur',
    name: 'National Forensic Sciences University (NFSU) - Raipur Campus',
    shortName: 'NFSU Raipur',
    country: 'India',
    state: 'Chhattisgarh',
    city: 'Raipur',
    type: 'Central',
    website: 'https://raipur.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://raipur.nfsu.ac.in/img/raipur_banner.jpg',
    description: 'National Forensic Sciences University (NFSU) – Raipur Campus in Chhattisgarh is an Institution of National Importance under the Ministry of Home Affairs, Government of India. Operating from its transit campus at Block E, Government Engineering College (GEC) Campus, Sejbahar, Raipur (with a permanent campus coming up at Banjari, Nava Raipur Atal Nagar), it houses Departments of Forensic Sciences and Cyber Security & Digital Forensics, offering M.Sc. Forensic Science, M.Sc. Digital Forensics and Information Security, and PG Professional Diploma in Crime Scene Management.',
    coursesOffered: [
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Pharmacy with minimum 55% aggregate marks (50% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents, Fingerprints & Ballistics'
        ]
      },
      {
        name: 'M.Sc. Digital Forensics and Information Security',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.E./B.Tech. or B.Sc. in CS / IT / Electronics / Forensic Science or BCA with minimum 55% aggregate marks + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Digital Forensics, Cyber Crime Investigation & Incident Response',
          'Information Security, Network Forensics & Vulnerability Assessment'
        ]
      },
      {
        name: 'Post Graduate Professional Diploma in Crime Scene Management',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science or allied discipline with minimum 50% aggregate marks + NFAT',
        estimatedFees: '₹20,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Management, Evidence Collection & Reconstruction',
          'Forensic Photography & Physical Evidence Examination'
        ]
      }
    ],
    feesRange: '₹20,000 - ₹65,000 / semester',
    admissionProcess: 'Admission through the National Forensic Admission Test (NFAT) conducted annually by NFSU followed by centralized counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | UGC Recognized',
    contactEmail: 'academics_rai@nfsu.ac.in',
    contactPhone: '+91 771 2991940',
    address: 'National Forensic Sciences University – Raipur Campus, Block E, Government Engineering College Campus, Old Dhamtari Road, Sejbahar, Raipur, Chhattisgarh 492015, India',
    ranking: 'Chhattisgarh Regional Campus of NFSU (Institution of National Importance)',
    facilities: [
      'Forensic Science & Crime Scene Investigation Laboratories',
      'Digital Forensics & Information Security Computer Laboratory',
      'Campus Library, Smart Classrooms & Indoor Sports Complex at Sejbahar Campus'
    ],
    featured: true
  },
  {
    id: 'nfsu-varanasi',
    name: 'National Forensic Sciences University (NFSU) - Varanasi Campus',
    shortName: 'NFSU Varanasi',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Varanasi',
    type: 'Central',
    website: 'https://varanasi.nfsu.ac.in',
    logo: 'https://www.nfsu.ac.in/assets/img/NFSU_logo.png',
    bannerImage: 'https://varanasi.nfsu.ac.in/img/16.jpg',
    description: 'National Forensic Sciences University (NFSU) – Varanasi Campus in Uttar Pradesh is an Institution of National Importance under the Ministry of Home Affairs, Government of India. Located at Jalhupur, Varanasi, Uttar Pradesh, the campus houses the Department of Forensic Sciences and offers the 5-Year Integrated B.Sc.-M.Sc. Forensic Science and 2-Year M.Sc. Forensic Science programs to build specialized forensic investigative manpower in Uttar Pradesh and Northern India.',
    coursesOffered: [
      {
        name: 'B.Sc. - M.Sc. Forensic Science (5-Year Integrated)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 in Science stream with Physics, Chemistry, and Biology / Mathematics with minimum 60% aggregate marks (55% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry, Toxicology & Trace Evidence',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents, Fingerprints & Forensic Ballistics'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor\'s degree in Science / Forensic Science / Medicine / Pharmacy with minimum 55% aggregate marks (50% for SC/ST/PwD) + NFAT',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Document Examination, Fingerprints & Crime Scene Reconstruction'
        ]
      }
    ],
    feesRange: '₹65,000 / semester',
    admissionProcess: 'Admission through the National Forensic Admission Test (NFAT) conducted annually by NFSU followed by centralized counseling.',
    accreditation: 'Institution of National Importance (Act of Parliament, 2020) | Ministry of Home Affairs, Govt. of India | UGC Recognized',
    contactEmail: 'info@nfsu.ac.in',
    contactPhone: '+91 79 23977100',
    address: 'National Forensic Sciences University – Varanasi Campus, Nayi Basti, Jalhupur, Varanasi, Uttar Pradesh 221104, India',
    ranking: 'Uttar Pradesh Campus of NFSU (Institution of National Importance)',
    facilities: [
      'Department of Forensic Sciences Criminalistics, Biology & Chemistry Laboratories',
      'Crime Scene Investigation, Questioned Documents & Fingerprint Training Lab',
      'Smart Classrooms, Forensic Reference Library & Student Academic Facilities'
    ],
    featured: true
  },
  {
    id: 'amity-aifs',
    name: 'Amity Institute of Forensic Sciences (AIFS)',
    shortName: 'Amity AIFS Noida',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Noida',
    type: 'Private',
    website: 'https://amity.edu/aifs',
    logo: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
    description: 'Leading private institute in North India offering comprehensive hands-on training in forensic biology, questioned documents, and digital intelligence.',
    coursesOffered: [
      {
        name: 'B.Sc. (Honours) Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 Years',
        eligibility: '10+2 with PCB/PCM (Min 55%)',
        estimatedFees: '₹1,20,000 / year',
        mode: 'Full-time'
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. Forensic Science / Chemistry / Zoology / Physics (Min 50%)',
        estimatedFees: '₹1,40,000 / year',
        mode: 'Full-time'
      }
    ],
    feesRange: '₹1,20,000 - ₹1,50,000 / year',
    admissionProcess: 'Amity University Direct Test / Interview & 10+2 Academic Merit.',
    accreditation: 'NAAC A+ Grade | UGC Approved',
    contactEmail: 'aifs@amity.edu',
    contactPhone: '+91 120 4392000',
    address: 'Sector 125, Noida, Uttar Pradesh 201313',
    ranking: 'Top Private Forensic College in North India',
    facilities: ['Automated Fingerprint Scanner Lab', 'Mock Crime Scene House', 'Toxicology HPLC & GC-MS Suite'],
    featured: true
  },
  {
    id: 'ifs-mumbai',
    name: 'Institute of Forensic Science, Mumbai',
    shortName: 'IFS Mumbai',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    type: 'Government',
    website: 'https://ifsc.ac.in',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200',
    description: 'Government of Maharashtra flagship institute established under the Higher & Technical Education Dept to train forensic scientists.',
    coursesOffered: [
      {
        name: 'B.Sc. Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 Years',
        eligibility: '10+2 Science stream (Higher Secondary Board Merit)',
        estimatedFees: '₹12,000 / year',
        mode: 'Full-time'
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. Forensic Science (Min 55%)',
        estimatedFees: '₹18,000 / year',
        mode: 'Full-time'
      },
      {
        name: 'PG Diploma in Cyber Crime & Digital Forensics',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Graduate in Science / IT / Engineering / Law',
        estimatedFees: '₹15,000 / year',
        mode: 'Part-time'
      }
    ],
    feesRange: '₹10,000 - ₹20,000 / year',
    admissionProcess: 'Government Merit List based on 10+2 & B.Sc. aggregate percentage.',
    accreditation: 'Government of Maharashtra | Mumbai University Affiliated',
    contactEmail: 'director@ifsc.ac.in',
    contactPhone: '+91 22 22817581',
    address: '15, Madame Cama Road, Fort, Mumbai, Maharashtra 400032',
    ranking: '#1 Govt Institute in Maharashtra for Forensic Science',
    facilities: ['Digital Evidence Recovery Suite', 'Spectrophotometry Suite', 'Crime Library'],
    featured: false
  },
  {
    id: 'gifsa-chhatrapati-sambhajinagar',
    name: 'Government Institute of Forensic Science, Chhatrapati Sambhajinagar',
    shortName: 'GIFSA Chhatrapati Sambhajinagar',
    country: 'India',
    state: 'Maharashtra',
    city: 'Chhatrapati Sambhajinagar',
    type: 'Government',
    website: 'https://gifsa.ac.in',
    logo: 'https://gifsa.ac.in/wp-content/uploads/2020/01/cropped-banner1-270x270.jpg',
    bannerImage: 'https://gifsa.ac.in/wp-content/uploads/2020/01/1.jpg',
    description: 'Government Institute of Forensic Science, Chhatrapati Sambhajinagar (formerly Aurangabad) is a premier NAAC \'A\' Grade accredited state government institute established in 2009 by the Department of Higher and Technical Education, Government of Maharashtra. Affiliated with Dr. Babasaheb Ambedkar Marathwada University (BAMU), it is one of Maharashtra\'s flagship forensic science institutions dedicated to creating skilled forensic experts across Forensic Science, Forensic Chemistry, Forensic Biology & Serology, Digital & Cyber Forensics, Forensic Psychology, Questioned Documents, Fingerprint Analysis, and Criminal Law.',
    coursesOffered: [
      {
        name: 'B.Sc. Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: '10+2 (HSC) in Science stream with minimum 50% aggregate marks (45% for reserved categories as per Government of Maharashtra norms)',
        estimatedFees: '₹2,800 / year (approx ₹8,142 total tuition)',
        mode: 'Full-time',
        specializations: [
          'Forensic Science & Crime Scene Investigation',
          'Forensic Chemistry & Toxicology',
          'Forensic Physics & Ballistics',
          'Forensic Biology, Serology & DNA Profiling',
          'Digital & Cyber Forensics',
          'Forensic Psychology & Criminal Law'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science (all papers) from a recognized university (Admissions based on B.Sc. Merit / CET as per Maharashtra Government rules; 20 seats intake)',
        estimatedFees: '₹3,100 / year (approx ₹6,128 total tuition)',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Toxicology',
          'Forensic Biology, Serology & DNA Fingerprinting',
          'Digital & Cyber Forensics',
          'Questioned Documents & Fingerprint Examination',
          'Forensic Physics & Ballistics'
        ]
      },
      {
        name: 'PG Diploma in Forensic Science and Related Law (PGDFS & RL)',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science, Medicine, Forensic Science, Pharmacy, or Law from a recognized university (40 seats intake)',
        estimatedFees: '₹3,414 / year',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Evidence Law',
          'Forensic Toxicology, Serology & Medico-Legal Aspects'
        ]
      },
      {
        name: 'PG Diploma in Digital and Cyber Forensics and Related Law (PGDDCF & RL)',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science, IT, Computer Science, Engineering, BCA, Forensic Science, or Law from a recognized university (40 seats intake)',
        estimatedFees: '₹3,414 / year',
        mode: 'Full-time',
        specializations: [
          'Cyber Crime Investigation, Network & Mobile Forensics',
          'Information Technology Act & Digital Evidence Admissibility'
        ]
      },
      {
        name: 'Ph.D. Research Center in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s degree in Forensic Science or allied Science discipline with PET / NET / SET qualification as per BAMU norms',
        estimatedFees: '₹6,000 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry, Toxicology & Instrumental Analysis',
          'Digital Forensics, Cyber Security & Biometrics',
          'Forensic Biology & DNA Fingerprinting'
        ]
      }
    ],
    feesRange: '₹2,800 - ₹3,500 / year',
    admissionProcess: 'Centralized merit-based admission based on 10+2 HSC / B.Sc. Forensic Science aggregate marks following Government of Maharashtra reservation and admission rules.',
    accreditation: 'NAAC \'A\' Grade Accredited | Government of Maharashtra | Affiliated to Dr. Babasaheb Ambedkar Marathwada University (BAMU) | UGC Recognized',
    contactEmail: 'gifsa2009@gmail.com',
    contactPhone: '+91 240 2400219',
    address: 'Nipat Niranjan Nagar, Caves Road, Chhatrapati Sambhajinagar (Aurangabad), Maharashtra 431004, India',
    ranking: 'NAAC \'A\' Grade | Premier State Government Forensic Science Institute in Maharashtra',
    facilities: [
      'Forensic Chemistry & Analytical Toxicology Laboratory',
      'Forensic Biology, Serology & DNA Fingerprinting Lab',
      'Digital & Cyber Forensics Investigation Laboratory',
      'Questioned Documents, Handwriting & Fingerprint Analysis Lab',
      'Forensic Physics, Ballistics & Instrumentation Lab',
      'Forensic Psychology & Polygraph Testing Laboratory',
      'Central Institute Library with E-Granthalaya & Research Journals',
      'Dedicated Boys & Girls Government Hostels at Nipat Niranjan Nagar Campus'
    ],
    featured: true
  },
  {
    id: 'ifsc-nagpur',
    name: 'Government Institute of Forensic Science, Nagpur',
    shortName: 'IFSC Nagpur',
    country: 'India',
    state: 'Maharashtra',
    city: 'Nagpur',
    type: 'Government',
    website: 'https://ifscnagpur.in',
    logo: 'https://assets.zyrosite.com/YrD4LZ5JPbhWQ19A/logo_png-mePJEjx12xiox5wL.png',
    bannerImage: 'https://assets.zyrosite.com/m2WEny4kWZSN0ErL/ins_front_resize-Y4LvkaL1RNtK78EV.JPG',
    description: 'Government Institute of Forensic Science, Nagpur (IFSC Nagpur) is an Autonomous State Government Institute established in 2011 (vide GR No. NGC 2011/(20/22)/MASHI-4 dated 22 July 2011) under the Department of Higher and Technical Education, Government of Maharashtra, and affiliated to Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU), Nagpur. As the premier forensic science institution in the Vidarbha region and one of Maharashtra\'s three flagship Government Institutes of Forensic Science (alongside Mumbai and Chhatrapati Sambhajinagar), it offers comprehensive undergraduate, postgraduate, and PG Diploma programs across seven specialized departments: Criminalistics, Chemistry & Toxicology, Biology & Serology, Physics & Ballistics, Digital & Cyber Forensics, Forensic Psychology, and Law.',
    coursesOffered: [
      {
        name: 'B.Sc. Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020 Autonomous)',
        eligibility: '10+2 (HSC) in Science stream from a recognized board with merit-based selection as per Government of Maharashtra norms',
        estimatedFees: '₹3,500 / year',
        mode: 'Full-time',
        specializations: [
          'Criminalistics & Crime Scene Investigation',
          'Forensic Chemistry & Toxicology',
          'Forensic Biology & Serology',
          'Forensic Physics & Ballistics',
          'Digital & Cyber Forensics',
          'Forensic Psychology & Criminal Law'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science from a recognized university (Admissions based on B.Sc. Merit as per Government of Maharashtra & RTMNU rules)',
        estimatedFees: '₹4,200 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Digital & Cyber Forensics',
          'Questioned Documents, Fingerprints & Criminalistics',
          'Forensic Physics & Ballistics'
        ]
      },
      {
        name: 'Post Graduate Diploma in Forensic Science and Related Law (PGDF)',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science, Forensic Science, Medicine, Pharmacy, or Law from a recognized university',
        estimatedFees: '₹3,500 / year',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Management & Criminalistics',
          'Forensic Toxicology, Medico-Legal Jurisprudence & Evidence Law'
        ]
      },
      {
        name: 'Post Graduate Diploma in Digital and Cyber Forensic and Related Law (PGDC)',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science, IT, Computer Science, BCA, Engineering, Forensic Science, or Law from a recognized university',
        estimatedFees: '₹3,500 / year',
        mode: 'Full-time',
        specializations: [
          'Digital Evidence Recovery, Network & Mobile Forensics',
          'Cyber Crime Investigation & IT Act Compliance'
        ]
      },
      {
        name: 'Ph.D. Research Program in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s degree in Forensic Science or allied Science discipline with PET / NET / SET qualification as per RTMNU norms',
        estimatedFees: '₹6,500 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry, Toxicology & Instrumental Analysis',
          'Forensic Biology, Serology & DNA Analysis',
          'Digital & Cyber Forensics'
        ]
      }
    ],
    feesRange: '₹3,500 - ₹4,500 / year',
    admissionProcess: 'Centralized merit-based admission based on 10+2 HSC / B.Sc. Forensic Science aggregate marks following Government of Maharashtra and RTMNU reservation and admission norms.',
    accreditation: 'Autonomous Institute (UGC Conferred) | NAAC Accredited (\'B++\' Grade) | Government of Maharashtra | Affiliated to Rashtrasant Tukadoji Maharaj Nagpur University (RTMNU)',
    contactEmail: 'admission.bsc@ifscnagpur.in',
    contactPhone: '+91 712 2534503',
    address: 'Institute of Science Campus, R.T. Road, Civil Lines, Nagpur, Maharashtra 440001, India',
    ranking: 'UGC Autonomous Status | NAAC Accredited | Premier Government Forensic Institute in Vidarbha',
    facilities: [
      'Department of Criminalistics & Crime Scene Simulation Laboratory',
      'Forensic Chemistry & Analytical Toxicology Laboratory',
      'Forensic Biology, Serology & DNA Analysis Laboratory',
      'Digital & Cyber Forensics Investigation Lab',
      'Forensic Physics, Ballistics & Instrumentation Lab',
      'Forensic Psychology & Behavioural Analysis Lab',
      'Central Institute Library with Forensic Textbooks, Reference Manuals & E-Resources',
      'Government Boys Hostel, Sports Ground & Quadrangle at Civil Lines Campus'
    ],
    featured: true
  },
  {
    id: 'guru-ghasidas-vishwavidyalaya',
    name: 'Guru Ghasidas Vishwavidyalaya',
    shortName: 'GGV Bilaspur',
    country: 'India',
    state: 'Chhattisgarh',
    city: 'Bilaspur',
    type: 'Central',
    website: 'https://www.ggu.ac.in',
    logo: 'https://www.ggu.ac.in/media/BasePageImage/ggv_logo.png',
    bannerImage: 'https://www.ggu.ac.in/media/BasePageImage/main-gate.jpg',
    description: 'Guru Ghasidas Vishwavidyalaya (GGV), Bilaspur is a premier Central University established under the Central Universities Act, 2009 (No. 25 of 2009), formerly founded as Guru Ghasidas University in 1983 by the Government of Madhya Pradesh, and accredited with the prestigious NAAC A++ Grade (CGPA 3.62/4.0). Situated on a sprawling 655-acre green campus in Koni, Bilaspur, Chhattisgarh, its Department of Forensic Science is one of Central India\'s foremost central university departments offering B.Sc. (Hons.), M.Sc., and Ph.D. programs in Forensic Science, Questioned Documents, Fingerprint Analysis, Forensic Toxicology, Forensic Biology & Serology, Ballistics, and Digital Forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020 FYUGP)',
        eligibility: '10+2 (Intermediate) in Science stream (Physics, Chemistry, Biology / Mathematics) with minimum 50% aggregate marks (45% for SC/ST/OBC-NCL/PwD) + CUET (UG) Score',
        estimatedFees: '₹8,500 / year (approx ₹4,250 / semester)',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Physical Evidence',
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents & Fingerprint Examination',
          'Forensic Physics, Ballistics & Cyber Forensics'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. (Hons.) / B.Sc. in Forensic Science or B.Sc. with relevant Science subjects from a recognized university with minimum 50% aggregate marks + CUET (PG) Score',
        estimatedFees: '₹9,200 / year (approx ₹4,600 / semester)',
        mode: 'Full-time',
        specializations: [
          'Questioned Document & Fingerprint Science',
          'Forensic Chemistry & Toxicology',
          'Forensic Biology, Serology & DNA Fingerprinting',
          'Forensic Physics, Ballistics & Digital Forensics'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s degree in Forensic Science or allied Science discipline with minimum 55% aggregate marks + UGC-NET / CSIR-NET / VRET (Vishwavidyalaya Research Entrance Test) + Interview',
        estimatedFees: '₹12,000 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Toxicology, Trace Evidence & Instrumental Analysis',
          'Questioned Document Examination, Biometrics & Fingerprints',
          'Forensic Biology, Serology & Anthropology'
        ]
      }
    ],
    feesRange: '₹8,500 - ₹12,000 / year',
    admissionProcess: 'CUET (UG) for B.Sc. (Hons.), CUET (PG) for M.Sc., and UGC-NET / VRET for Ph.D., followed by centralized Samarth portal counselling.',
    accreditation: 'NAAC A++ Grade (Score 3.62/4.0) | Central University (Act of Parliament, 2009) | UGC Recognized | AIU Member',
    contactEmail: 'centraluniversity@ggu.ac.in',
    contactPhone: '+91 7752 260353',
    address: 'Koni, Bilaspur, Chhattisgarh 495009, India',
    ranking: 'NAAC A++ Grade (3.62) | Premier Central University in Chhattisgarh',
    facilities: [
      'Department of Forensic Science Crime Scene & Criminalistics Lab',
      'Forensic Chemistry, Toxicology & Advanced Instrumentation Lab',
      'Forensic Biology, Serology & Anthropology Laboratory',
      'Questioned Documents, Handwriting & Latent Fingerprint Lab',
      'Forensic Physics, Ballistics & Microscopy Laboratory',
      'Central Library (Nalanda) with E-ShodhSindhu & Forensic Science Journals',
      '655-Acre Residential Campus with Boys & Girls Hostels, Health Centre & Sports Complex'
    ],
    featured: true
  },
  {
    id: 'sardar-patel-university-anand',
    name: 'Sardar Patel University, Anand',
    shortName: 'SPU Vallabh Vidyanagar',
    country: 'India',
    state: 'Gujarat',
    city: 'Anand (Vallabh Vidyanagar)',
    type: 'Government',
    website: 'https://www.spuvvn.edu',
    logo: 'https://www.spuvvn.edu/orbit-cdn/uploads/spulogo.png',
    bannerImage: 'https://www.spuvvn.edu/orbit-cdn/uploads/DJI_0180-scaled.jpg',
    description: 'Sardar Patel University (SPU) is a premier public state university established in 1955 by an Act of the Legislative Assembly of the then Bombay Province and recognized by the University Grants Commission (UGC) under Sections 2(f) and 12(B), accredited with NAAC \'A\' Grade. Located in the educational township of Vallabh Vidyanagar, Anand, Gujarat, the university\'s Post Graduate Department of Biosciences, Department of Chemistry, and affiliated forensic/applied science centers deliver rigorous academic and research programs in Forensic Science, Analytical & Forensic Chemistry, Toxicology, Molecular Biology & DNA Profiling, Questioned Document Examination, and Cyber Security & Digital Forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. Forensic Science / Applied Sciences',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: '10+2 (HSC) in Science stream (Physics, Chemistry, Biology / Mathematics) from GSHSEB or recognized board via GCAS (Gujarat Common Admission Services) merit',
        estimatedFees: '₹15,000 - ₹35,000 / year',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Management & Criminalistics',
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents & Fingerprint Analysis',
          'Digital & Cyber Forensics'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Chemistry, Biosciences, Biotechnology, Biochemistry, Microbiology, Zoology, Physics, or allied sciences from a recognized university via GCAS PG merit',
        estimatedFees: '₹35,000 - ₹50,000 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Instrumental Toxicology',
          'Forensic Biotechnology, Serology & DNA Fingerprinting',
          'Questioned Document, Fingerprint & Trace Evidence Analysis',
          'Cyber Security & Digital Forensics'
        ]
      },
      {
        name: 'Ph.D. in Forensic & Allied Chemical / Biological Sciences',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s degree in Forensic Science, Chemistry, Biosciences, or allied Science discipline with minimum 55% aggregate marks + SPU Ph.D. Entrance Test / UGC-CSIR NET / GSET',
        estimatedFees: '₹20,000 / year',
        mode: 'Full-time',
        specializations: [
          'Analytical & Forensic Toxicology, Chromatography & Spectroscopy',
          'Molecular Genetics, DNA Barcoding & Forensic Biology',
          'Cyber Security, Biometrics & Digital Evidence Analysis'
        ]
      }
    ],
    feesRange: '₹15,000 - ₹50,000 / year',
    admissionProcess: 'Centralized admission through GCAS (Gujarat Common Admission Services) portal based on 10+2 / B.Sc. aggregate merit as per Government of Gujarat and SPU norms.',
    accreditation: 'NAAC \'A\' Grade Accredited | UGC Recognized (2(f) & 12(B)) | Public State University (Government of Gujarat) | AIU Member',
    contactEmail: 'registrar_spu@spuvvn.edu',
    contactPhone: '+91 2692 226801',
    address: 'Mota Bazaar, Vallabh Vidyanagar, Anand, Gujarat 388120, India',
    ranking: 'NAAC \'A\' Grade | UGC Centre of Potential for Excellence in Applied Sciences | NIRF Ranked State University',
    facilities: [
      'CISST (Central Interdisciplinary Sophisticated Instrumentation Centre — NMR, GC-MS, HPLC, XRD, SEM, FTIR)',
      'Post Graduate Department of Biosciences & Molecular DNA Profiling Laboratories',
      'Analytical Chemistry & Forensic Toxicology Research Laboratories',
      'Bhaikaka University Library with 2.5+ Lakh Volumes, INFLIBNET & Forensic Journals',
      'Department of Computer Science Digital Forensics & Cyber Security Lab',
      '86-Acre Green Campus in Vallabh Vidyanagar with University Hostels, Health Centre & Sports Complex'
    ],
    featured: true
  },
  {
    id: 'karunya-university-coimbatore',
    name: 'Karunya Institute of Technology and Sciences (Karunya University)',
    shortName: 'Karunya University Coimbatore',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Coimbatore',
    type: 'Private',
    website: 'https://www.karunya.edu',
    logo: 'https://admissions.karunya.edu/sites/admissions/files/uploads/logo.png',
    bannerImage: 'https://www.karunya.edu/img/homepage/Slides/slide1.jpg',
    description: 'Karunya Institute of Technology and Sciences (Deemed to be University), popularly known as Karunya University, is a premier NAAC A++ accredited (CGPA 3.55/4.0) Category-1 Deemed-to-be University established in 1986 and conferred university status under Section 3 of the UGC Act, 1956. Nestled in a lush 700-acre eco-friendly residential valley in Karunya Nagar at the foothills of the Western Ghats in Coimbatore, Tamil Nadu, its Division of Criminology and Forensic Science (School of Sciences, Arts, Media and Management) offers comprehensive undergraduate, postgraduate, and doctoral programs in Forensic Science, Criminology, Digital & Cyber Forensics, Crime Scene Investigation, Forensic Toxicology, Serology & DNA Profiling, Questioned Documents, and Fingerprint Examination.',
    coursesOffered: [
      {
        name: 'B.Sc. Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: 'Pass in 10+2 (Higher Secondary) with Physics, Chemistry, and Biology / Mathematics / Computer Science from a recognized board with minimum 50% aggregate marks',
        estimatedFees: '₹1,03,000 / year',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Physical Evidence',
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents & Fingerprint Analysis',
          'Digital Forensics, Cyber Crime & Criminal Law'
        ]
      },
      {
        name: 'B.Sc. Criminology and Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: 'Pass in 10+2 (Higher Secondary) in any stream (Science preferred) from a recognized board with minimum 50% aggregate marks',
        estimatedFees: '₹93,000 / year',
        mode: 'Full-time',
        specializations: [
          'Criminology, Penology & Victimology',
          'Crime Scene Management & Criminal Profiling',
          'Forensic Psychology & Criminal Justice Administration'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Criminology, Biology, Biotechnology, Biochemistry, Microbiology, Chemistry, Physics, or allied Life/Physical Sciences with minimum 50% aggregate marks',
        estimatedFees: '₹1,09,000 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry, Toxicology & Instrumental Analysis',
          'Questioned Documents, Handwriting & Fingerprint Science',
          'Forensic Biology, Serology & DNA Fingerprinting',
          'Cyber Forensics, Ballistics & Crime Scene Reconstruction'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s degree in Forensic Science or allied Science discipline with minimum 55% aggregate marks + KITS Ph.D. Entrance Written Test / UGC-NET / CSIR-NET + Interview',
        estimatedFees: '₹60,000 / year',
        mode: 'Full-time',
        specializations: [
          'Analytical Toxicology, Nanoforensics & Trace Evidence',
          'Forensic Biology, DNA Typing & Serology',
          'Digital Forensics, Biometrics & Questioned Documents'
        ]
      }
    ],
    feesRange: '₹93,000 - ₹1,09,000 / year',
    admissionProcess: 'Merit-based admission via Karunya Entrance Examination (KEE) / qualifying 10+2 or B.Sc. marks and online Single Window Counselling.',
    accreditation: 'NAAC A++ Grade (Score 3.55/4.0) | UGC Category-1 Deemed to be University | NIRF Ranked | AICTE & ICAR Approved',
    contactEmail: 'admissions@karunya.edu',
    contactPhone: '+91 422 2614300',
    address: 'Karunya Nagar, Coimbatore, Tamil Nadu 641114, India',
    ranking: 'NAAC A++ Grade (3.55) | UGC Category-1 University | NIRF Top 100 University in India',
    facilities: [
      'Division of Criminology and Forensic Science Crime Scene Simulation & Criminalistics Lab',
      'Central Instrumentation & Analytical Toxicology Laboratory (GC-MS, HPLC, FTIR, AAS, SEM)',
      'Forensic Biology, Serology & Molecular DNA Analysis Laboratory',
      'Questioned Documents, Stereomicroscopy & Latent Fingerprint Examination Lab',
      'Digital Forensics, Cyber Security & Incident Response Laboratory',
      'Central Library with IEEE, ScienceDirect, Springer & Forensic Research Databases',
      '700-Acre Fully Residential Eco-Green Valley Campus with 15+ Hostels, Hospital & Indoor Stadium'
    ],
    featured: true
  },
  {
    id: 'bundelkhand-university',
    name: 'Bundelkhand University (Dr. APJ Abdul Kalam Institute of Forensic Science & Criminology)',
    shortName: 'Bundelkhand University Jhansi',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Jhansi',
    type: 'State',
    website: 'https://www.bujhansi.ac.in',
    logo: 'https://upload.wikimedia.org/wikipedia/en/c/cb/Bundelkhand_University_Logo.png',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/commons/d/df/Bundelkhand_university_jhansi.jpg',
    description: 'Bundelkhand University, Jhansi is a premier NAAC A++ accredited (CGPA 3.53/4.0) State Government University established on August 26, 1975 in Jhansi, Uttar Pradesh, and conferred Category-I status by the UGC. It houses the renowned Dr. APJ Abdul Kalam Institute of Forensic Science and Criminology (established in 2001), one of North India\'s oldest and most respected university institutes dedicated to Forensic Science and Criminology, offering B.Sc. (Hons.), M.Sc., PG Diploma, and Ph.D. programs in Crime Scene Investigation, Forensic Chemistry & Toxicology, Forensic Biology & DNA Profiling, Questioned Documents, Fingerprint Science, Forensic Anthropology, and Ballistics.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 / 4 Years (NEP 2020)',
        eligibility: 'Pass in 10+2 (Intermediate) in Science stream (PCM / PCB) from a recognized board with minimum 50% aggregate marks',
        estimatedFees: '₹34,000 - ₹39,000 / year',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Physical Evidence Management',
          'Forensic Chemistry, Analytical Instrumentation & Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Questioned Documents, Handwriting & Fingerprint Analysis',
          'Forensic Physics, Ballistics & Criminal Law'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Biology, Chemistry, Physics, Mathematics, Biotechnology, or allied Science discipline from a recognized university with minimum 50% aggregate marks (Admission via BU Entrance Test)',
        estimatedFees: '₹58,700 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Analytical Toxicology',
          'Forensic Biology, Serology, Odontology & DNA Fingerprinting',
          'Questioned Document Examination & Fingerprint Science',
          'Forensic Ballistics, Cyber Forensics & Crime Scene Reconstruction'
        ]
      },
      {
        name: 'Post Graduate Diploma in Forensic Science (PGDFS)',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science, Law (LL.B.), Medicine, or allied discipline from a recognized university with minimum 45% aggregate marks',
        estimatedFees: '₹22,000 / year',
        mode: 'Full-time',
        specializations: [
          'Applied Criminalistics & Crime Scene Investigation',
          'Forensic Evidence Law, Fingerprints & Document Examination'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s degree in Forensic Science or allied Science discipline with minimum 55% aggregate marks + BU Research Entrance Test (RET) / UGC-NET / CSIR-NET + Interview',
        estimatedFees: '₹25,000 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Toxicology, Trace Evidence & Instrumental Analysis',
          'Forensic Biology, Anthropology & Molecular DNA Typing',
          'Questioned Documents, Biometrics & Digital Forensics'
        ]
      }
    ],
    feesRange: '₹22,000 - ₹58,700 / year',
    admissionProcess: 'Direct merit-based admission on 10+2 marks for B.Sc. (Hons.) & PG Diploma; Bundelkhand University Entrance Test (BUET) + Counselling for M.Sc.; UGC-NET / BU-RET + Interview for Ph.D.',
    accreditation: 'NAAC A++ Grade (CGPA 3.53/4.0) | UGC Category-I State University (12B & 2f) | NIRF Ranked | AIU Member',
    contactEmail: 'admissioncellbu@bujhansi.ac.in',
    contactPhone: '+91 510 2321158',
    address: 'Dr. APJ Abdul Kalam Institute of Forensic Science and Criminology, Bundelkhand University, Kanpur Road, Jhansi, Uttar Pradesh 284128, India',
    ranking: 'NAAC A++ Grade (3.53 CGPA) | UGC Category-I Autonomous State University | Pioneering Forensic Science Institute since 2001',
    facilities: [
      'Dr. APJ Abdul Kalam Institute of Forensic Science & Criminology Dedicated Academic Block',
      'Forensic Chemistry, Toxicology & Central Instrumentation Lab (GC-MS, HPLC, FTIR, UV-Vis)',
      'Forensic Biology, Serology, Anthropology & DNA Profiling Laboratory',
      'Questioned Documents (VSC), Latent Fingerprint & Impression Evidence Lab',
      'Forensic Physics, Ballistics & Crime Scene Simulation Laboratory',
      'Rani Lakshmi Bai Central Library & Innovation Centre across 186-Acre Campus',
      'Separate Boys & Girls University Hostels, Sports Stadium & Auditorium'
    ],
    featured: true
  },
  {
    id: 'maharshi-dayanand-university-rohtak',
    name: 'Maharshi Dayanand University, Rohtak (Department of Forensic Science)',
    shortName: 'MDU Rohtak',
    country: 'India',
    state: 'Haryana',
    city: 'Rohtak',
    type: 'State',
    website: 'https://mdu.ac.in',
    logo: 'https://mdu.ac.in/Imgs/logo%20colored%20transparent244x221.png',
    bannerImage: 'https://mdu.ac.in/UpFiles/UpImageFiles/2019/Apr/MDU%20Greenry%20622%20Acre%20Spread%20Campus.jpg',
    description: 'Maharshi Dayanand University (MDU), Rohtak is a premier NAAC A+ accredited State Government University established in 1976 by an Act of the Legislative Assembly of Haryana and recognized under Sections 2(f) and 12(B) of the UGC Act. Located on a sprawling 622-acre green campus in Rohtak, Haryana (NCR), its Department of Forensic Science (under the Faculty of Interdisciplinary Studies, initially established under the Department of Genetics in 2009 and elevated to an independent department in 2021) was the first in Haryana to launch a Ph.D. in Forensic Science (2013) and offers NEP-2020 aligned M.Sc. and Doctoral programs with nationally recognized research in DNA Forensics, Forensic Diatomology, Forensic Entomology, Wildlife Forensics, Questioned Documents, and Analytical Toxicology.',
    coursesOffered: [
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years (NEP 2020)',
        eligibility: 'B.Sc. in Forensic Science, Botany, Zoology, Biotechnology, Biochemistry, Chemistry, Physics, Mathematics, Biosciences / Biological Sciences, or B.D.S. from a recognized university with minimum 50% aggregate marks (47.5% for SC/ST of Haryana)',
        estimatedFees: '₹11,315 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Biology, Serology, Entomology & Diatomology',
          'DNA Profiling, Molecular Forensics & Wildlife Forensics',
          'Forensic Chemistry, Analytical Toxicology & Arson Investigation',
          'Questioned Documents, Fingerprint Science & Impressions',
          'Forensic Physics, Ballistics, Cyber Forensics & Crime Scene Management'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s degree in Forensic Science or allied Science discipline with minimum 55% aggregate marks + MDU Ph.D. Entrance Test / UGC-NET / CSIR-NET-JRF + Interview',
        estimatedFees: '₹13,310 - ₹24,200 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Diatomology, Entomology & Biological Trace Evidence',
          'DNA Forensics, Serology & Human Identification',
          'Forensic Chemical Sciences, Toxicology & Questioned Documents'
        ]
      },
      {
        name: 'PG Diploma in Criminology and Forensic Law',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor\'s degree in Science, Law (LL.B.), or allied discipline from a recognized university with minimum 45% aggregate marks',
        estimatedFees: '₹15,000 - ₹22,000 / year',
        mode: 'Full-time',
        specializations: [
          'Criminal Law, Penology & Forensic Evidence Admissibility',
          'Crime Scene Investigation & Medico-Legal Jurisprudence'
        ]
      }
    ],
    feesRange: '₹11,315 - ₹24,200 / year',
    admissionProcess: 'Merit-based admission via MDU Common Entrance Examination (MDUCEE) and centralized university counselling for M.Sc. Forensic Science (25 seats); UGC-NET / CSIR-NET / MDU Ph.D. Entrance Test + Interview for Ph.D.',
    accreditation: 'NAAC A+ Grade (CGPA 3.44/4.0) | UGC 12(B) & 2(f) State Government University | NIRF Top 100 State Public University | AIU Member',
    contactEmail: 'hod.fs@mdurohtak.ac.in',
    contactPhone: '+91 1262 2293018',
    address: 'Department of Forensic Science, Faculty of Interdisciplinary Studies, Maharshi Dayanand University, Delhi Road, Near Delhi Bypass, Rohtak, Haryana 124001, India',
    ranking: 'NAAC A+ Grade (3.44 CGPA) | NIRF Ranked State University | First University in Haryana to Offer Ph.D. in Forensic Science',
    facilities: [
      'Department of Forensic Science Crime Scene Investigation & Criminalistics Laboratory',
      'Forensic Biology, Serology, Diatomology & Forensic Entomology Research Lab',
      'Forensic Chemistry, Toxicology & Central Instrumentation Facility (GC-MS, FTIR, HPLC, UV-Vis)',
      'Questioned Document Examination, Stereomicroscopy & Latent Fingerprint Laboratory',
      'Aryabhatta Central Digital Library with 24x7 Reading Hall & E-Journal Consortium',
      '622-Acre Eco-Green Campus with 20 Boys & Girls Hostels, Sports Complex & Tagore Auditorium'
    ],
    featured: true
  },
  {
    id: 'bareilly-international-university',
    name: 'Bareilly International University (Faculty of Forensic Sciences & Rohilkhand Medical College)',
    shortName: 'BIU Bareilly',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Bareilly',
    type: 'Private',
    website: 'https://www.biu.edu.in',
    logo: 'https://www.biu.edu.in/static/photos/header/logobiu.png',
    bannerImage: 'https://www.biu.edu.in/static/photos/home/biubuilding.jpeg',
    description: 'Bareilly International University (BIU), Bareilly is a premier UGC-recognized university established in 2016 under the Uttar Pradesh State Legislature Act No. 26 of 2016 and promoted by the Rohilkhand Educational Charitable Trust. Integrated with the 720+ bed Rohilkhand Medical College & Hospital on its 42-acre Pilibhit Bypass Road campus, BIU\'s Faculty of Forensic Sciences (established in 2022) and Department of Forensic Medicine & Toxicology provide interdisciplinary clinical, autopsy, medico-legal, and laboratory training across B.Sc., M.Sc., and Doctoral Forensic Science programs.',
    coursesOffered: [
      {
        name: 'B.Sc. Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 Years',
        eligibility: '10+2 (Intermediate) in Science stream (Physics, Chemistry, Biology / Mathematics) from a recognized board with minimum 45%-50% aggregate marks (Minimum age 17 years as on Dec 31)',
        estimatedFees: '₹25,000 / year (₹75,000 Total Tuition)',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation, Physical Evidence & Criminalistics',
          'Forensic Biology, Serology & Human Anatomy',
          'Forensic Chemistry, Toxicology & Arson Analysis',
          'Questioned Documents, Fingerprint Science & Impressions',
          'Digital Forensics, Ballistics & Medico-Legal Jurisprudence'
        ]
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Biology, Physics, Chemistry, Biochemistry, Microbiology, Biotechnology, MLT, B.Pharm., MBBS, BDS, BHMS, or BAMS with minimum 50% aggregate marks + BIU Entrance Test',
        estimatedFees: '₹70,000 / year (₹1,40,000 Total Tuition)',
        mode: 'Full-time',
        specializations: [
          'Forensic Toxicology, Analytical Chemistry & Pharmacology',
          'Forensic Biology, Serology, DNA Profiling & Clinical Forensics',
          'Questioned Document Examination, Fingerprints & Biometrics',
          'Crime Scene Reconstruction, Forensic Ballistics & Cyber Forensics'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science / Allied Medical Sciences',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s degree in Forensic Science or allied Science/Medical discipline with minimum 55% aggregate marks + BIU Ph.D. Entrance Test / UGC-NET / CSIR-NET + Interview',
        estimatedFees: '₹75,000 - ₹1,00,000 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Toxicology, Clinical Toxicology & Analytical Instrumentation',
          'Forensic Serology, Molecular Diagnostics & Medico-Legal Research',
          'Trace Evidence, Questioned Documents & Criminalistics'
        ]
      }
    ],
    feesRange: '₹25,000 - ₹1,00,000 / year',
    admissionProcess: 'Admission through BIU Entrance Examination / CUET-UG / CUET-PG and merit-based university counselling (40 seats in B.Sc. Forensic Science, 20 seats in M.Sc. Forensic Science); UGC-NET / BIU Research Entrance Test + Interview for Ph.D.',
    accreditation: 'UGC Recognized (Section 2(f)) | UP State Legislature Act No. 26 of 2016 | NMC (MCI), DCI, INC & PCI Approved Constituent Colleges | AIU Member',
    contactEmail: 'info@biu.edu.in',
    contactPhone: '+91 581 2526153',
    address: 'Faculty of Forensic Sciences, Bareilly International University, Rohilkhand Medical College Campus, Pilibhit Bypass Road, Bareilly, Uttar Pradesh 243006, India',
    ranking: 'Premier Medical & Allied Sciences University in Rohilkhand Region | Integrated with 720+ Bed Teaching Hospital & Medico-Legal Morgue',
    facilities: [
      'Faculty of Forensic Sciences Criminalistics, Serology & Trace Evidence Laboratories',
      'Forensic Chemistry, Analytical Toxicology & Instrumentation Lab',
      'Questioned Documents, Fingerprint Development & Microscopy Laboratory',
      'Rohilkhand Medical College Department of Forensic Medicine, Autopsy Theatre & Toxicology Museum',
      'Central Medical & Scientific Digital Library with E-Journals (MEDLINE, ERMED & Forensic Databases)',
      '42-Acre Residential Medical Campus with Hostels, 720+ Bed Multi-Specialty Hospital, Auditorium & Sports Complex'
    ],
    featured: true
  },
  {
    id: 'panjab-university',
    name: 'Panjab University (Institute of Forensic Science & Criminology - IFSC), Chandigarh',
    shortName: 'PU Chandigarh (IFSC)',
    country: 'India',
    state: 'Chandigarh',
    city: 'Chandigarh',
    type: 'Government',
    website: 'https://forensicscience.puchd.ac.in',
    logo: 'https://puchd.ac.in/asset/pu-logo.png',
    bannerImage: 'https://puchd.ac.in/photos/pu9.jpg',
    description: 'Established in 2009 at the historic Sector 14 campus of Panjab University (originally founded in 1882), the Institute of Forensic Science & Criminology (IFSC) is one of Northern India\'s premier government postgraduate and doctoral research centers. Accredited with NAAC A++ Grade (CGPA 3.68), IFSC integrates Forensic Biology, Serology, DNA Fingerprinting, Forensic Chemistry & Toxicology, Questioned Documents, Forensic Anthropology, and Crime Scene Management with active collaborations with CFSL Chandigarh and State FSLs.',
    coursesOffered: [
      {
        name: 'M.Sc. in Forensic Science & Criminology',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. / B.Sc. (Hons.) in Forensic Science, Physical, Biological, Chemical Sciences, Pharmacy, Dental or Medical Sciences with minimum 50% aggregate marks + PU-CET (PG)',
        estimatedFees: '₹38,545 / year',
        mode: 'Full-time',
        specializations: ['Forensic Biology, Serology & DNA Profiling', 'Forensic Chemistry, Toxicology & Trace Evidence', 'Questioned Documents, Fingerprints & Forensic Anthropology']
      },
      {
        name: 'Ph.D. in Forensic Science & Criminology',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% aggregate marks + UGC-NET / JRF / PU Ph.D. Entrance Test',
        estimatedFees: '₹18,500 / year',
        mode: 'Full-time',
        specializations: ['Forensic Osteology & Anthropology', 'Analytical Toxicology & Drug Abuse', 'Questioned Document Examination & Biometrics']
      }
    ],
    feesRange: '₹18,500 - ₹38,545 / year',
    admissionProcess: 'Panjab University Common Entrance Test for Postgraduate Courses (PU-CET PG) + Merit Counseling',
    accreditation: 'NAAC Accredited A++ Grade (CGPA 3.68) | Category-I University by UGC',
    contactEmail: 'chairperson_ifsc@pu.ac.in',
    contactPhone: '+91 172 2534121',
    address: 'Institute of Forensic Science & Criminology (IFSC), BMS Block-II, Sector 14, Panjab University, Chandigarh 160014, India',
    ranking: 'NIRF Top 25 Universities in India | Premier Government Forensic Institute in North-West India',
    facilities: [
      'Forensic Anthropology & Osteology Museum and Skeletal Identification Lab',
      'Forensic Chemistry, Toxicology & Sophisticated Analytical Instrumentation Facility (SAIF/CIL)',
      'Forensic Biology, Serology & Molecular DNA Research Laboratory',
      'Questioned Documents, Fingerprint Science & Crime Scene Simulation Unit',
      'A.C. Joshi Central Library & 550-Acre Sector 14 Residential Campus'
    ],
    featured: true
  },
  {
    id: 'strathclyde-uk',
    name: 'Centre for Forensic Science, University of Strathclyde',
    shortName: 'Strathclyde Forensic',
    country: 'United Kingdom',
    state: 'Scotland',
    city: 'Glasgow',
    type: 'Government',
    website: 'https://www.strath.ac.uk/science/forensicscience',
    logo: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200',
    description: 'The oldest operational Centre for Forensic Science in the UK, renowned globally for pioneering DNA profiling and fire investigation research.',
    coursesOffered: [
      {
        name: 'MSc Forensic Science',
        degreeLevel: 'Master',
        duration: '1 Year',
        eligibility: 'First/second class Honours degree in Chemistry, Biology, or Forensic Science + IELTS 6.5',
        estimatedFees: '£23,500 / year',
        mode: 'Full-time',
        specializations: ['Forensic Biology & DNA', 'Forensic Chemistry & Toxicology']
      },
      {
        name: 'BSc (Hons) Forensic & Analytical Chemistry',
        degreeLevel: 'Bachelor',
        duration: '4 Years',
        eligibility: 'High School Diploma / A-Levels with Chemistry and Mathematics',
        estimatedFees: '£22,000 / year',
        mode: 'Full-time'
      }
    ],
    feesRange: '£22,000 - £25,000 / year',
    admissionProcess: 'UCAS Application (Undergraduate) or Direct Strathclyde International Portal (Postgraduate).',
    accreditation: 'The Chartered Society of Forensic Sciences (CSFS) Accredited',
    contactEmail: 'science-enquiries@strath.ac.uk',
    contactPhone: '+44 141 552 4400',
    address: '16 Richmond Street, Glasgow G1 1XQ, Scotland, UK',
    ranking: '#1 in UK for Forensic Science (Complete University Guide)',
    facilities: ['Operational Forensic Analysis Labs', 'Mass Spectrometry Center', 'Mock Crime Scene Flat'],
    featured: true
  },
  {
    id: 'gwu-usa',
    name: 'Department of Forensic Sciences, George Washington University',
    shortName: 'GWU Forensics',
    country: 'United States',
    state: 'District of Columbia',
    city: 'Washington D.C.',
    type: 'Private',
    website: 'https://forensicsciences.columbian.gwu.edu',
    logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=1200',
    description: 'Located in the heart of Washington D.C. near federal intelligence agencies (FBI, DEA, Secret Service) providing unmatched internship access.',
    coursesOffered: [
      {
        name: 'Master of Science in Forensic Sciences (MSFS)',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor in STEM discipline, GRE score, TOEFL/IELTS',
        estimatedFees: '$38,500 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry', 'Forensic Molecular Biology', 'High Technology Crime Investigation']
      }
    ],
    feesRange: '$35,000 - $40,000 / year',
    admissionProcess: 'GW Graduate Admissions Portal + Statement of Purpose + 2 Letters of Recommendation',
    accreditation: 'FEPAC Accredited (Forensic Science Education Programs Accreditation Commission)',
    contactEmail: 'forensic@gwu.edu',
    contactPhone: '+1 202 994 8400',
    address: '2101 G St NW, Washington, DC 20052, USA',
    ranking: 'Top Tier US Graduate Forensic Science Program',
    facilities: ['High-Tech Digital Forensics Suite', 'FBI Partnered Internship Network'],
    featured: true
  },
  {
    id: 'shsu-usa',
    name: 'Department of Forensic Science, Sam Houston State University',
    shortName: 'SHSU Huntsville',
    country: 'United States',
    state: 'Texas',
    city: 'Huntsville',
    type: 'Government',
    website: 'https://www.shsu.edu/academics/forensic-science',
    logo: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1200',
    description: 'Home to the Southeast Texas Applied Forensic Science (STAFS) Facility - one of the world\'s largest human decomposition research facilities.',
    coursesOffered: [
      {
        name: 'Master of Science in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'BS in Chemistry, Biology or Forensic Science',
        estimatedFees: '$18,000 / year (In-state) / $28,000 (Out-of-state)',
        mode: 'Full-time'
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '4 Years',
        eligibility: 'MS or BS with outstanding academic record in chemistry/biology',
        estimatedFees: '$20,000 / year',
        mode: 'Full-time'
      }
    ],
    feesRange: '$18,000 - $28,000 / year',
    admissionProcess: 'SHSU Online Portal + Official Transcripts + Interview',
    accreditation: 'FEPAC Accredited MS Program',
    contactEmail: 'forensics@shsu.edu',
    contactPhone: '+1 936 294 4370',
    address: '1003 19th St, Huntsville, TX 77340, USA',
    ranking: '#1 Applied Forensic Decomposition Research Center',
    facilities: ['STAFS Body Farm Outdoor Facility', 'Comparison Microscope Suite', 'Crime Scene House'],
    featured: true
  },
  {
    id: 'kcl-uk',
    name: 'Department of Forensic Science, King\'s College London',
    shortName: 'King\'s College London',
    country: 'United Kingdom',
    state: 'Greater London',
    city: 'London',
    type: 'Government',
    website: 'https://www.kcl.ac.uk/study/postgraduate-taught/courses/forensic-science-msc',
    logo: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
    description: 'London premier forensic medicine and anti-doping analysis university working directly with the Metropolitan Police Service and WADA.',
    coursesOffered: [
      {
        name: 'MSc Forensic Science',
        degreeLevel: 'Master',
        duration: '1 Year',
        eligibility: '2:1 UK Honours degree in Chemistry, Biochemistry, Forensic Science or related',
        estimatedFees: '£29,800 / year',
        mode: 'Full-time'
      }
    ],
    feesRange: '£29,000 - £32,000 / year',
    admissionProcess: 'King\'s Apply Online Application Portal',
    accreditation: 'CSFS Accredited | WADA Certified Drug Testing Hub',
    contactEmail: 'forensic-msc@kcl.ac.uk',
    contactPhone: '+44 20 7836 5454',
    address: 'Strand, London WC2R 2LS, United Kingdom',
    ranking: 'QS World Top 40 Universities',
    facilities: ['Drug Control Centre (DCC)', 'DNA Fingerprinting Unit', 'Medical Toxicology Suite'],
    featured: false
  },
  {
    id: 'guru-jambheshwar-university-hisar',
    name: 'Guru Jambheshwar University of Science and Technology (GJUS&T), Hisar',
    shortName: 'GJUS&T Hisar',
    country: 'India',
    state: 'Haryana',
    city: 'Hisar',
    type: 'State',
    website: 'https://www.gjust.ac.in',
    logo: 'https://www.gjust.ac.in/Logo/gju_final_logo_one_new.png',
    bannerImage: 'https://www.gjust.ac.in/img/slider_home.jpg',
    description: 'Established in 1995 by an Act of the Legislature of the State of Haryana, Guru Jambheshwar University of Science and Technology (GJUS&T), Hisar is a premier NAAC A+ Grade (CGPA 3.38) State Public University spread across a 372-acre green campus on NH-9. Through its Faculty of Environmental and Bio Sciences & Technology, Faculty of Physical Sciences & Technology, and Department of Pharmaceutical Sciences, GJUS&T delivers rigorous academic and research programs in Molecular Biology, Nanobiotechnology, Analytical & Forensic Chemistry, Pharmaceutical Chemistry, Pharmacology & Toxicology, and Cyber Security, equipped with a dedicated Central Instrumentation Laboratory (CIL).',
    coursesOffered: [
      {
        name: 'Dual Degree B.Sc. (Hons.) – M.Sc. in Biotechnology / Microbiology / Chemistry',
        degreeLevel: 'Bachelor',
        duration: '5 Years',
        eligibility: '10+2 with Physics, Chemistry, and Biology/Mathematics with minimum 50% aggregate marks (47.5% for SC candidates of Haryana)',
        estimatedFees: '₹29,500 – ₹48,200 / year',
        mode: 'Full-time',
        specializations: ['Molecular Diagnostics & DNA Profiling', 'Analytical & Instrumental Chemistry', 'Microbial Forensics & Toxicology']
      },
      {
        name: 'M.Sc. in Biotechnology / Microbiology / Chemistry',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. / B.Sc. (Hons.) in relevant Science discipline with minimum 50% aggregate marks',
        estimatedFees: '₹29,100 – ₹39,600 / year',
        mode: 'Full-time',
        specializations: ['Analytical Chemistry & Trace Evidence Analysis', 'Nanobiotechnology & Biosensors', 'Molecular Biology & Genetic Engineering']
      },
      {
        name: 'M.Pharm in Pharmacology & Pharmaceutical Chemistry',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Pharm with minimum 55% aggregate marks and valid GPAT / GJUS&T Entrance Score',
        estimatedFees: '₹79,900 / year',
        mode: 'Full-time',
        specializations: ['Toxicological Screening & Drug Analysis', 'Pharmaceutical & Analytical Chemistry']
      },
      {
        name: 'Ph.D. in Biotechnology / Chemistry / Pharmaceutical Sciences',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master\'s degree in relevant discipline with 55% marks + UGC-CSIR NET / GATE / GPAT / GJUS&T Ph.D. Entrance Test',
        estimatedFees: '₹30,000 / year',
        mode: 'Full-time',
        specializations: ['Nanotoxicology & Biosensors', 'Analytical & Environmental Toxicology', 'Pharmacology & Drug Discovery']
      }
    ],
    feesRange: '₹29,100 - ₹79,900 / year',
    admissionProcess: 'GJUS&T University Entrance Test / GAT-B (for DBT-supported M.Sc. Biotechnology) / GPAT / UGC-CSIR NET Counseling',
    accreditation: 'NAAC Accredited A+ Grade (CGPA 3.38) | UGC 12(B) & 2(f) | AICTE & PCI Approved',
    contactEmail: 'registrar@gjust.org',
    contactPhone: '+91 1662 263104',
    address: 'Delhi-Sirsa Road (NH-9), Hisar, Haryana 125001, India',
    ranking: 'NIRF 2025: #32 State Public Universities & #49 in Pharmacy (101–150 Overall Band)',
    facilities: [
      'Central Instrumentation Laboratory (CIL) with LC-MS/MS, GC-MS, NMR, XRD, FTIR & SEM',
      'Molecular Biology, Genetic Engineering & Nanobiotechnology Research Laboratories',
      'Pharmacology, Toxicology & Analytical Pharmaceutical Chemistry Labs',
      'Dr. Bhim Rao Ambedkar Library (Circular 3-Storey Digital Resource Center)',
      'Chaudhary Ranbir Singh Auditorium & 372-Acre Eco-Friendly Wi-Fi Campus with 9 Hostels'
    ],
    featured: true
  },
  {
    id: 'kristu-jayanti-university-bengaluru',
    name: 'Kristu Jayanti University (School of Biological and Forensic Sciences), Bengaluru',
    shortName: 'Kristu Jayanti Bengaluru',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    type: 'Private',
    website: 'https://kristujayanti.edu.in',
    logo: 'https://kristujayanti.edu.in/KJU%20Logo.webp',
    bannerImage: 'https://kristujayanti.edu.in/assets/images/Schools/modern-campus-facade-with-emblem.webp',
    description: 'Established in 1999 and managed by the Bodhi Niketan Trust (CMI Fathers), Kristu Jayanti University (formerly Kristu Jayanti College Autonomous) in Bengaluru is one of South India\'s premier institutions for Forensic Science education, accredited with NAAC A++ Grade (CGPA 3.78 — highest in Karnataka). The Department of Forensic Science under the School of Biological and Forensic Sciences offers flagship NEP-aligned undergraduate, postgraduate, and doctoral programs with dedicated laboratories for Questioned Documents, Fingerprint Science, Crime Scene Reconstruction, Forensic Biology & Serology, Forensic Toxicology, and Digital Forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. in Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 / PUC in Science stream with Physics, Chemistry, and Biology/Mathematics with minimum 50% aggregate marks',
        estimatedFees: '₹1,10,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Reconstruction', 'Questioned Documents & Fingerprint Analysis', 'Forensic Biology, Serology & Toxicology']
      },
      {
        name: 'B.Sc. in Forensic Science, Criminology and Biochemistry / Biotechnology',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 / PUC in Science stream (PCB/PCM) from a recognized board with minimum 50% aggregate marks',
        estimatedFees: '₹1,10,000 / year',
        mode: 'Full-time',
        specializations: ['Criminology & Criminal Law', 'Forensic Biochemistry & Molecular Biology', 'Forensic Biotechnology']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or Biological/Physical/Chemical Sciences with minimum 50% aggregate marks (45% for SC/ST)',
        estimatedFees: '₹1,25,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Toxicology', 'Forensic Biology, Serology & DNA Profiling', 'Cyber Forensics & Questioned Document Examination']
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-6 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% marks + KJUET / UGC-NET / CSIR-NET + Interview',
        estimatedFees: '₹65,000 / year (Full-time) | ₹60,000 / year (Part-time)',
        mode: 'Full-time',
        specializations: ['Forensic Toxicology & Analytical Chemistry', 'Fingerprint Science & Questioned Documents', 'Forensic Anthropology & Serology']
      }
    ],
    feesRange: '₹65,000 - ₹1,25,000 / year',
    admissionProcess: 'Kristu Jayanti Online Application + Academic Merit Screening + Counselling & Personal Interview (KJUET for Ph.D.)',
    accreditation: 'NAAC Accredited A++ Grade (CGPA 3.78) | UGC Recognized',
    contactEmail: 'admission@kristujayanti.com',
    contactPhone: '+91 80 6873 7777',
    address: 'K. Narayanapura, Kothanur (Post), Bengaluru, Karnataka 560077, India',
    ranking: 'NIRF Top 100 Ranked Institution | India Today Top 10 Emerging Science & Forensic Institutions',
    facilities: [
      'Dedicated Crime Scene Simulation & Reconstruction Studio',
      'Forensic Chemistry, Toxicology & Instrumentation Laboratory (UV-Vis, FTIR, GC, HPLC)',
      'Questioned Documents, Stereomicroscopy & Latent Fingerprint Examination Lab',
      'Forensic Biology, Serology, Odontology & Anthropology Suite',
      'Digital & Cyber Forensics Workstation Lab and Annual "Atrang" National Forensic Conclave'
    ],
    featured: true
  },
  {
    id: 'sam-global-university-bhopal',
    name: 'SAM Global University (Department of Forensic Science), Bhopal',
    shortName: 'SAM Global University',
    country: 'India',
    state: 'Madhya Pradesh',
    city: 'Bhopal',
    type: 'Private',
    website: 'https://www.samglobaluniversity.ac.in',
    logo: 'https://www.samglobaluniversity.ac.in/wp-content/uploads/2026/09/logo-png-scaled-506x184.webp',
    bannerImage: 'https://www.samglobaluniversity.ac.in/wp-content/uploads/2025/05/image-888.webp',
    description: 'Established in 2019 by the Shri Guru Hargovind Society (60+ years of educational legacy in Central India) under the Madhya Pradesh Niji Vishwavidyalaya Adhiniyam, SAM Global University in Bhopal/Raisen offers specialized undergraduate, postgraduate, and doctoral programs in Forensic Science. The curriculum integrates practical training in Crime Scene Investigation, Forensic Serology, DNA Fingerprinting, Forensic Toxicology, Ballistics, Questioned Document Examination, and Cyber Crime Investigation.',
    coursesOffered: [
      {
        name: 'B.Sc. / B.Sc. (Hons.) in Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 with Physics, Chemistry, and Biology/Mathematics (PCB/PCM) from a recognized board with minimum 45%–50% marks',
        estimatedFees: '₹40,000 – ₹55,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Management & Criminal Law', 'Forensic Biology, Serology & DNA Fingerprinting', 'Questioned Documents, Fingerprints & Digital Forensics']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Biology, Chemistry, Physics, Biotechnology, Microbiology, MLT, or B.Pharm/MBBS/BDS/BHMS/BAMS with minimum 50% marks',
        estimatedFees: '₹50,000 – ₹65,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Toxicology', 'Forensic Biology, Serology & DNA Profiling', 'Forensic Ballistics, Physics & Questioned Documents']
      },
      {
        name: 'Ph.D. in Forensic Science / Applied Sciences',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% aggregate marks + SGU Entrance Test / UGC-NET',
        estimatedFees: '₹75,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Toxicology & Analytical Chemistry', 'Crime Scene & Trace Evidence Research']
      }
    ],
    feesRange: '₹40,000 - ₹75,000 / year',
    admissionProcess: 'SAM Global University Merit / Entrance Counseling + Document Verification',
    accreditation: 'UGC Recognized (Section 2(f)) | AIU Member | MP Private University Regulatory Commission Approved',
    contactEmail: 'info@samglobaluniversity.ac.in',
    contactPhone: '+91 96445 53399',
    address: 'Kolua, Gram Adampur Chawni, Raisen Road, Bhopal (Campus: Agariya Chopda, Raisen 464551), Madhya Pradesh, India',
    ranking: 'Leading Private Forensic & Allied Health University in Central India (Madhya Pradesh)',
    facilities: [
      'Forensic Science & Crime Scene Investigation Training Lab',
      'Forensic Biology, Serology & Fingerprint Examination Laboratory',
      'Forensic Chemistry, Toxicology & Analytical Instrumentation Lab',
      'Moot Court & Medico-Legal Jurisprudence Training Facility',
      'Central Digital Library, Boys & Girls Hostels, and Transport Network across Bhopal'
    ],
    featured: true
  },
  {
    id: 'malla-reddy-vishwavidyapeeth-hyderabad',
    name: 'Malla Reddy Vishwavidyapeeth (Deemed to be University), Hyderabad',
    shortName: 'Malla Reddy Vishwavidyapeeth',
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    type: 'Deemed',
    website: 'https://mrvv.edu.in',
    logo: 'https://mrvv.edu.in/wp-content/uploads/2025/01/MRV_Final_Logo-2.png',
    bannerImage: 'https://mrvv.edu.in/wp-content/uploads/2025/10/Malla-reddy-Institute-Of-medical-Sciences.webp',
    description: 'Malla Reddy Vishwavidyapeeth (Deemed to be University under Section 3 of the UGC Act, 1956) and Malla Reddy University in Maisammaguda/Suraram, Hyderabad, form a comprehensive health sciences, medical, and allied sciences hub integrating Malla Reddy Institute of Medical Sciences (MRIMS) and the School of Allied Healthcare Sciences. The university offers specialized undergraduate, postgraduate, and medical degree programs in Forensic Sciences & Toxicology and MD Forensic Medicine, supported by teaching hospitals, mortuary complexes, and advanced clinical toxicology laboratories.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) in Forensic Sciences & Toxicology',
        degreeLevel: 'Bachelor',
        duration: '4 Years',
        eligibility: '10+2 or equivalent with Physics, Chemistry, and Biology (PCB) from a recognized Board with minimum 60%–70% aggregate marks',
        estimatedFees: '₹1,25,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Toxicology & Clinical Poisoning Analysis', 'Crime Scene Investigation & Fingerprint Analysis', 'Forensic Biology, Serology & Digital Forensics']
      },
      {
        name: 'M.Sc. in Forensic Sciences & Toxicology',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Biomedical Sciences, Life Sciences, Chemistry, or MBBS/BDS with minimum 55% aggregate marks',
        estimatedFees: '₹2,25,000 / year',
        mode: 'Full-time',
        specializations: ['Advanced Analytical & Clinical Toxicology', 'Forensic Biology, DNA Profiling & Serology', 'Forensic Chemistry & Trace Evidence']
      },
      {
        name: 'MD in Forensic Medicine & Toxicology',
        degreeLevel: 'Master',
        duration: '3 Years',
        eligibility: 'MBBS degree recognized by NMC + Mandatory 1-Year Internship + Qualifying NEET-PG Score',
        estimatedFees: '₹5,50,000 / year',
        mode: 'Full-time',
        specializations: ['Medico-Legal Autopsy & Post-Mortem Pathology', 'Clinical Forensic Medicine & Medical Ethics', 'Forensic Histopathology & Toxicology']
      }
    ],
    feesRange: '₹1,25,000 - ₹5,50,000 / year',
    admissionProcess: 'MRVV Entrance Test / Academic Merit Counseling (NEET-PG Counseling for MD Forensic Medicine)',
    accreditation: 'UGC Approved Deemed-to-be University | NAAC Accredited | NMC & DSIR-SIRO Recognized',
    contactEmail: 'info@mrvv.edu.in',
    contactPhone: '+91 93481 61303',
    address: 'Suraram Main Road / Maisammaguda, Dulapally, Medchal-Malkajgiri District, Hyderabad, Telangana 500055 / 500100, India',
    ranking: 'IIRF 2026 Ranked #22 Emerging Deemed University & Premier Medical-Forensic Hub in Telangana',
    facilities: [
      'Forensic Sciences & Analytical Toxicology Laboratory',
      '1,150+ Bed Malla Reddy Teaching Hospital & Medico-Legal Autopsy Complex (MRIMS)',
      'Crime Scene Investigation, Latent Fingerprint & Questioned Document Lab',
      'Molecular Diagnostics, Serology & Central Research Laboratory (DSIR-SIRO Certified)',
      'High-Fidelity Medical Simulation Center, Digital Library & Campus Hostels'
    ],
    featured: true
  },
  {
    id: 'rv-university-bengaluru',
    name: 'RV University (School of Liberal Arts & Sciences and School of Law), Bengaluru',
    shortName: 'RV University Bengaluru',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    type: 'Private',
    website: 'https://rvu.edu.in',
    logo: 'https://d2b6aloc836m7p.cloudfront.net/wp-content/uploads/2026/01/RV-Logo.png',
    bannerImage: 'https://d2b6aloc836m7p.cloudfront.net/wp-content/uploads/2026/09/RV-New-Banner-scaled.jpg',
    description: 'Established under the RV University Act, 2019 by the Rashtreeya Sikshana Samithi Trust (RSST — over 84 years of educational excellence in Bengaluru), RV University offers cutting-edge interdisciplinary education across Science, Law, and Technology. Through its School of Liberal Arts & Sciences, School of Computer Science & Engineering, and School of Law, RV University offers a distinctive NEP-aligned B.Sc. (Hons.) in Criminology, Cyber Law and Forensic Sciences, integrating physical crime scene forensics with digital forensics, cyber law, and criminal psychology.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) in Criminology, Cyber Law and Forensic Sciences',
        degreeLevel: 'Bachelor',
        duration: '4 Years',
        eligibility: '10+2 / PUC or equivalent in any stream (Science/Arts/Commerce) from a recognized board with minimum 50% aggregate marks',
        estimatedFees: '₹1,40,000 – ₹1,60,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Forensics', 'Cyber Law, Digital Forensics & OSINT', 'Criminology, Victimology & Criminal Psychology']
      },
      {
        name: 'B.Tech. (Hons.) / M.Tech. in Computer Science (Cyber Security & Digital Forensics Specialization)',
        degreeLevel: 'Bachelor',
        duration: '4 Years',
        eligibility: '10+2 with Physics and Mathematics + KCET / RVSAT / JEE Main Score',
        estimatedFees: '₹3,50,000 – ₹5,00,000 / year',
        mode: 'Full-time',
        specializations: ['Network Security & Incident Response', 'Digital Forensics & Malware Analysis']
      },
      {
        name: 'LL.M. / Ph.D. in Criminal Law, Cyber Law & Forensic Justice',
        degreeLevel: 'Master',
        duration: '1-3 Years',
        eligibility: 'LL.B. / Master\'s degree with minimum 55% aggregate marks + RVSAT / Interview',
        estimatedFees: '₹1,25,000 / year',
        mode: 'Full-time',
        specializations: ['Criminal Justice & Forensic Evidence Law', 'Cyber Crime Regulation & Digital Evidence']
      }
    ],
    feesRange: '₹1,25,000 - ₹3,50,000 / year',
    admissionProcess: 'RV Scholastic Admission Test (RVSAT) + Personal Interview & Holistic Selection Process',
    accreditation: 'UGC Recognized State Private University (Karnataka Act No. 11 of 2019) | BCI Approved',
    contactEmail: 'admissions@rvu.edu.in',
    contactPhone: '+91 89511 79896',
    address: 'RV Vidyanikethan Post, 8th Mile, Mysuru Road, Bengaluru, Karnataka 560059, India',
    ranking: 'Premier Interdisciplinary University by RSST Bengaluru | Top Emerging University in Karnataka',
    facilities: [
      'Forensic Science, Fingerprint & Crime Scene Simulation Laboratory',
      'Cyber Security, Digital Forensics & Ethical Hacking Lab',
      'Moot Court Hall & Center for Criminal Justice and Cyber Law Studies',
      'Psychology & Behavioral Criminology Assessment Lab',
      '50+ Acre Green RV Vidyanikethan Campus with Metro Connectivity, Sports Complex & Hostels'
    ],
    featured: true
  },
  {
    id: 'centurion-university-bhubaneswar',
    name: 'Centurion University of Technology and Management (School of Forensic Sciences), Bhubaneswar',
    shortName: 'Centurion University (CUTM)',
    country: 'India',
    state: 'Odisha',
    city: 'Bhubaneswar',
    type: 'Private',
    website: 'https://cutm.ac.in/department/school-of-forensic-sciences/',
    logo: 'https://upload.wikimedia.org/wikipedia/en/6/62/Centurion_University_of_Technology_and_Management_Logo.svg',
    bannerImage: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Centurion_University_Management_Block.jpg',
    description: 'Centurion University of Technology and Management (CUTM), Odisha is India\'s first skill-integrated multi-sector university accredited with NAAC A+ Grade. The dedicated School of Forensic Sciences at the Bhubaneswar (Jatni) Campus offers comprehensive undergraduate, postgraduate, integrated, diploma, and doctoral programs in Forensic Science and Cyber Security & Digital Forensics, featuring hands-on training in Crime Scene Investigation, Forensic Toxicology, Serology, Questioned Documents, Forensic DNA Analysis, and Digital Forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) in Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 with Physics, Chemistry, and Biology/Mathematics from a recognized board with minimum 50% aggregate marks',
        estimatedFees: '₹1,00,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Evidence', 'Forensic Biology, Serology & DNA Profiling', 'Forensic Chemistry, Toxicology & Ballistics']
      },
      {
        name: 'Integrated B.Sc. – M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 (PCB/PCM) with minimum 50% aggregate marks + CUEE Entrance Score',
        estimatedFees: '₹1,00,000 / year',
        mode: 'Full-time',
        specializations: ['Advanced Criminalistics & Analytical Toxicology', 'Forensic Serology & Molecular Diagnostics']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or Basic/Applied Sciences (Biology/Chemistry/Physics/Biotech) with minimum 50% marks',
        estimatedFees: '₹1,05,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Toxicology', 'Forensic Biology, Serology & DNA Fingerprinting', 'Questioned Documents, Fingerprints & Cyber Forensics']
      },
      {
        name: 'M.Sc. in Cyber Security & Digital Forensics',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. (Computer Science/IT/Forensic Science) / BCA / B.Tech with minimum 50% aggregate marks',
        estimatedFees: '₹1,05,000 / year',
        mode: 'Full-time',
        specializations: ['Digital Evidence Recovery & Mobile Forensics', 'Network Security, Malware Analysis & Incident Response']
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% aggregate marks + CUTM Research Entrance Test / UGC-NET',
        estimatedFees: '₹80,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Toxicology & Trace Evidence', 'Digital Forensics & Biometrics', 'Forensic DNA & Serology']
      }
    ],
    feesRange: '₹80,000 - ₹1,05,000 / year',
    admissionProcess: 'Centurion University Entrance Examination (CUEE) + Counseling & Document Verification',
    accreditation: 'NAAC Accredited A+ Grade | UGC 12(B) Recognized | NCVET Recognized Skill University',
    contactEmail: 'admissions@cutm.ac.in',
    contactPhone: '+91 82600 77222',
    address: 'Ramchandrapur, P.O. Jatni, Bhubaneswar, Dist: Khurda, Odisha 752050, India',
    ranking: 'NAAC A+ Grade University | Top Ranked Skill & Forensic Science University in Eastern India',
    facilities: [
      'School of Forensic Sciences Crime Scene Simulation & Reconstruction Lab',
      'Forensic Toxicology, Chemistry & Central Analytical Instrumentation Facility',
      'Forensic Biology, Serology & DNA Fingerprinting Laboratory',
      'Questioned Documents, Fingerprint Science & Ballistics Examination Lab',
      'Cyber Security & Digital Forensics Lab and 120-Acre Bhubaneswar Green Campus'
    ],
    featured: true
  },
  {
    id: 'peoples-college-forensic-science-cyber-security',
    name: "People's College of Forensic Science & Cyber Security (PCFSCS), Chhatrapati Sambhajinagar",
    shortName: "PCFSCS Chhatrapati Sambhajinagar",
    country: 'India',
    state: 'Maharashtra',
    city: 'Chhatrapati Sambhajinagar',
    type: 'Private',
    website: 'https://pcfscs.in',
    logo: 'https://pcfscs.in/images/new_logo.webp',
    bannerImage: 'https://pcfscs.in/images/about-img.webp',
    description: "Established in 2018 under Disha Bahuuddeshiy Sevabhavi Sanstha (Government of Maharashtra Approval Order No. 2018 (100/18) Mshi dated 15/06/2018), People's College of Forensic Science & Cyber Security (PCFSCS) is a dedicated NAAC-accredited institute in Chhatrapati Sambhajinagar (Aurangabad) affiliated with Dr. Babasaheb Ambedkar Marathwada University (BAMU). The college features seven specialized departments—Forensic Science, Cyber Security, Forensic Chemistry & Toxicology, Forensic Biology, Forensic Physics & Ballistics, Forensic Psychology, and Forensic Law (BNS)—bridging traditional physical crime scene investigation with modern cyber forensics.",
    coursesOffered: [
      {
        name: 'B.Sc. in Forensic Science & Cyber Security',
        degreeLevel: 'Bachelor',
        duration: '3 Years',
        eligibility: '10+2 (Higher Secondary) from any recognized school, college, or board as per BAMU & Government of Maharashtra norms',
        estimatedFees: '₹59,340 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Forensics', 'Cyber Security & Digital Threat Detection', 'Forensic Law (BNS), Biology, Chemistry & Psychology']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or relevant Basic/Applied Sciences from a recognized university',
        estimatedFees: '₹1,04,398 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Reconstruction & Questioned Documents', 'Forensic Biology, Serology & DNA Profiling', 'Advanced Criminalistics & Fingerprint Science']
      },
      {
        name: 'M.Sc. in Forensic Cyber Security (Cyber Forensics)',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Cyber Security, Computer Science, IT, or BCA from a recognized university',
        estimatedFees: '₹1,04,398 / year',
        mode: 'Full-time',
        specializations: ['Digital Evidence Recovery & Network Forensics', 'Cyber Simulation, Threat Intelligence & Malware Analysis']
      },
      {
        name: 'M.Sc. in Forensic Toxicology',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Chemistry, Biochemistry, or allied Science discipline from a recognized university',
        estimatedFees: '₹1,04,398 / year',
        mode: 'Full-time',
        specializations: ['Analytical & Medico-Legal Toxicology', 'Forensic Drug Analysis, Poisons & Trace Evidence Chemistry']
      },
      {
        name: 'M.Sc. in Forensic Applied Physics and Ballistics',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Physics, or Applied Sciences from a recognized university',
        estimatedFees: '₹1,04,398 / year',
        mode: 'Full-time',
        specializations: ['Internal, External & Terminal Forensic Ballistics', 'Firearms Examination, Toolmark Analysis & Crime Scene Physics']
      }
    ],
    feesRange: '₹59,340 - ₹1,04,398 / year',
    admissionProcess: 'Merit-based Admission as per Dr. Babasaheb Ambedkar Marathwada University (BAMU) & Government of Maharashtra norms (MahaDBT Scholarships available)',
    accreditation: 'NAAC Accredited (B Grade) | Recognized by Govt. of Maharashtra | Affiliated to Dr. Babasaheb Ambedkar Marathwada University (BAMU)',
    contactEmail: 'peoples.fscs@gmail.com',
    contactPhone: '+91 84848 25287',
    address: 'Disha Knowledge City, Deven County, Bhalgaon Road, Shendra, Chhatrapati Sambhajinagar (Aurangabad), Maharashtra 431007, India',
    ranking: 'Premier Dedicated Forensic Science & Cyber Security College in Marathwada (Affiliated to BAMU)',
    facilities: [
      'Forensic Chemistry, Analytical Toxicology & Instrumentation Lab',
      'Cyber Security & Digital Threat Simulation Suite',
      'Forensic Physics, Ballistics & Crime Scene Investigation Lab',
      'Forensic Biology, Serology & Forensic Psychology Lab',
      'Moot Court Sessions, Central Library, Campus Hostels & Transport Facility'
    ],
    featured: true
  },
  {
    id: 'upsifs-lucknow',
    name: 'Uttar Pradesh State Institute of Forensic Science (UPSIFS), Lucknow',
    shortName: 'UPSIFS Lucknow',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    type: 'Government',
    website: 'https://upsifs.org',
    logo: 'https://upsifs.org/assets/img/gold_upsifs.png',
    bannerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
    description: 'Established by the Government of Uttar Pradesh across a sprawling 50-acre state-of-the-art campus in Piparsand, Sarojini Nagar, Lucknow, and affiliated with the National Forensic Sciences University (NFSU), Gandhinagar, the Uttar Pradesh State Institute of Forensic Science (UPSIFS) is a flagship government institute dedicated to forensic science, cyber security, DNA forensics, forensic law, and scientific criminal investigation.',
    coursesOffered: [
      {
        name: 'B.Sc.-M.Sc. Forensic Science (5-Year Integrated)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 in Science (Physics, Chemistry, Biology/Mathematics) with minimum 60% aggregate marks (55% for SC/ST/PwD) + NFAT / CUET (UG) / JEE / NEET',
        estimatedFees: '₹24,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Management & Criminalistics', 'Forensic Chemistry, Toxicology & Ballistics', 'Forensic Biology, Serology & DNA Profiling']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Basic Sciences, Medicine, Engineering, Pharmacy, Dentistry, or AYUSH with minimum 55% aggregate marks + NFAT / CUET (PG)',
        estimatedFees: '₹24,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Toxicology & Chemistry', 'DNA Forensics & Serology', 'Forensic Ballistics & Questioned Documents']
      },
      {
        name: 'B.Tech.-M.Tech. in Computer Science & Engineering (Cyber Security)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 with Physics, Mathematics & Chemistry/Computer Science with minimum 60% marks + JEE Main / CUET (UG) / NFAT',
        estimatedFees: '₹30,000 / year',
        mode: 'Full-time',
        specializations: ['Cyber Security & Digital Forensics', 'Network Security, Malware Analysis & Incident Response']
      },
      {
        name: 'B.Sc. LL.B. (Hons.) (5-Year Integrated)',
        degreeLevel: 'Bachelor',
        duration: '5 Years',
        eligibility: '10+2 in Science stream with minimum 50% aggregate marks + CLAT / CUET (UG) / NFAT',
        estimatedFees: '₹24,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Law & Criminal Justice Administration', 'Techno-Legal Evidence & BNS Jurisprudence']
      },
      {
        name: 'M.Tech. in Artificial Intelligence & Data Science (Specialization in Cyber Security)',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.E. / B.Tech. in CSE/IT/ECE or MCA / M.Sc. (CS/IT) with minimum 55% marks + GATE / CUET (PG) / NFAT',
        estimatedFees: '₹30,000 / year',
        mode: 'Full-time',
        specializations: ['AI in Cyber Forensics', 'Threat Intelligence & Predictive Policing']
      },
      {
        name: 'LL.M. (Criminal Law & Criminal Justice Administration / Cyber Law & Cyber Crime Investigation)',
        degreeLevel: 'Master',
        duration: '1 Year',
        eligibility: 'LL.B. (3-Year or 5-Year Integrated) with minimum 50% marks + CLAT (PG) / CUET (PG)',
        estimatedFees: '₹24,000 / year',
        mode: 'Full-time',
        specializations: ['Criminal Law & Criminal Justice Administration', 'Cyber Law & Cyber Crime Investigation']
      },
      {
        name: 'PG Diploma in DNA Forensics / Cyber Security / Forensic Document Examination / Forensic Ballistics',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor’s degree in Science, Forensic Science, Medicine, Engineering, or Law with minimum 50% marks',
        estimatedFees: '₹20,000 / year',
        mode: 'Full-time',
        specializations: ['PG Diploma in DNA Forensics', 'PG Diploma in Cyber Security', 'PG Diploma in Forensic Document Examination', 'PG Diploma in Forensic Ballistics']
      }
    ],
    feesRange: '₹20,000 - ₹30,000 / year',
    admissionProcess: 'National Forensic Admission Test (NFAT) / CUET (UG & PG) / JEE Main / CLAT / GATE Merit Counseling',
    accreditation: 'Government of Uttar Pradesh State Institute | Affiliated to National Forensic Sciences University (NFSU) | UGC Recognized',
    contactEmail: 'info@upsifs.org',
    contactPhone: '+91 522 3511120',
    address: 'Piparsand, Sarojini Nagar, Kanpur Road, Lucknow, Uttar Pradesh 226008, India',
    ranking: 'Premier Flagship State Government Forensic Science Institute of Uttar Pradesh',
    facilities: [
      'Centre of Excellence in DNA Forensics & Molecular Biology Lab',
      'Advanced Cyber Security, Digital Forensics & AI Lab',
      'Forensic Ballistics, Firing Range & Explosives Analysis Facility',
      'Forensic Chemistry, Toxicology & Questioned Document Examination Labs',
      '50-Acre Smart Residential Campus with Moot Court, Auditorium & Hostels'
    ],
    featured: true
  },
  {
    id: 'rru-gandhinagar',
    name: 'Rashtriya Raksha University (RRU) - Lavad, Gandhinagar Campus (Headquarters)',
    shortName: 'RRU Gandhinagar (HQ)',
    country: 'India',
    state: 'Gujarat',
    city: 'Gandhinagar',
    type: 'Central',
    website: 'https://rru.ac.in',
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/2c/Rashtriya_Raksha_University_logo.png',
    bannerImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    description: 'Established as an Institution of National Importance under the Ministry of Home Affairs, Government of India (Act No. 31 of 2020), Rashtriya Raksha University (RRU) headquartered at Lavad, Dahegam, Gandhinagar is India’s pioneering National Security and Police University. Its School of Behavioural Sciences and Forensic Investigations (SBSFI) and School of Information Technology, Artificial Intelligence and Cyber Security (SITAICS) provide advanced education and operational research in Forensic Science, Forensic Psychology, Forensic Accounting, and Cyber Forensics.',
    coursesOffered: [
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor’s degree in Forensic Science or Basic/Applied Sciences with minimum 55% aggregate marks (50% for SC/ST)',
        estimatedFees: '₹1,00,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Criminalistics', 'Forensic Biology, Serology & DNA', 'Forensic Chemistry, Toxicology & Questioned Documents']
      },
      {
        name: 'M.Sc. in Cyber Security and Digital Forensics',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.E. / B.Tech. (CS/IT/ECE) or B.Sc. (CS/IT/Cyber Security/Forensic Science) or BCA with minimum 55% aggregate marks',
        estimatedFees: '₹1,10,000 / year',
        mode: 'Full-time',
        specializations: ['Digital Evidence Recovery & Memory Forensics', 'Network Security, Malware Analysis & Incident Response']
      },
      {
        name: 'M.Sc. / M.A. in Forensic Psychology',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor’s degree in Psychology, Forensic Science, Criminology, or Science/Arts with minimum 55% aggregate marks',
        estimatedFees: '₹1,00,000 / year',
        mode: 'Full-time',
        specializations: ['Criminal Profiling & Investigative Psychology', 'Polygraph, Brain Electrical Oscillation Signature (BEOS) & Narco Analysis']
      },
      {
        name: 'M.Sc. / M.Com. in Forensic Accounting and Financial Investigations',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor’s degree in Commerce, Accounting, BBA, Economics, or Science with minimum 55% aggregate marks',
        estimatedFees: '₹90,000 / year',
        mode: 'Full-time',
        specializations: ['Fraud Examination & Anti-Money Laundering (AML)', 'Corporate Financial Forensics & Economic Offences']
      },
      {
        name: 'Advanced Professional Diploma in Clinical Forensic Psychology',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'M.A. / M.Sc. in Psychology, Clinical Psychology, or Forensic Psychology with minimum 55% marks (RCI Recognized)',
        estimatedFees: '₹75,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Psychodiagnostics & Courtroom Testimony', 'Offender Rehabilitation & Correctional Psychology']
      },
      {
        name: 'Ph.D. in Forensic Science / Behavioural Sciences / Cyber Security',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master’s degree in Forensic Science, Psychology, or Cyber Security with minimum 55% marks + RRU Research Entrance Test / UGC-NET',
        estimatedFees: '₹60,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Investigations & Trace Evidence', 'Neuro-Forensics & Behavioural Profiling', 'Critical Infrastructure & Cyber Forensics']
      }
    ],
    feesRange: '₹60,000 - ₹1,10,000 / year',
    admissionProcess: 'RRU Common Entrance Test (RCET) / CUET (PG) / National Level Entrance Score + Personal Interview',
    accreditation: 'Institution of National Importance (Ministry of Home Affairs, Govt. of India) | NAAC Accredited | UGC & RCI Recognized',
    contactEmail: 'admission.sbsfi@rru.ac.in',
    contactPhone: '+91 79 68126800',
    address: 'Lavad, Dahegam, Gandhinagar, Gujarat 382305, India',
    ranking: 'Institution of National Importance | India’s Premier National Security & Police University (MHA)',
    facilities: [
      'School of Behavioural Sciences and Forensic Investigations (SBSFI) Crime Scene & Forensic Labs',
      'Forensic Psychology, Polygraph, BEOS Profiling & Suspect Interrogation Suite',
      'SITAICS Cyber Range, Digital Forensics & Malware Analysis Laboratory',
      'Ballistics, Weapons Simulation & Tactical Training Complex',
      '230-Acre Green Residential Campus at Lavad with Central Library, Sports Complex & Hostels'
    ],
    featured: true
  },
  {
    id: 'rru-pasighat',
    name: 'Rashtriya Raksha University (RRU) - Pasighat Campus (Arunachal Pradesh)',
    shortName: 'RRU Pasighat',
    country: 'India',
    state: 'Arunachal Pradesh',
    city: 'Pasighat',
    type: 'Central',
    website: 'https://rru.ac.in/pasighat-campus/',
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/2c/Rashtriya_Raksha_University_logo.png',
    bannerImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
    description: 'Rashtriya Raksha University (RRU) Pasighat Campus in East Siang district, Arunachal Pradesh is the North-Eastern regional campus of RRU (an Institution of National Importance under the Ministry of Home Affairs, Govt. of India). The campus specializes in Cyber Security and Digital Forensics, Police Administration, Criminology, and Border & Internal Security Management for the North-East region.',
    coursesOffered: [
      {
        name: 'PG Diploma in Cyber Security and Digital Forensics',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor’s degree in Science, Computer Applications, Engineering, or Technology with minimum 50% marks',
        estimatedFees: '₹60,000 / year',
        mode: 'Full-time',
        specializations: ['Digital Evidence Acquisition & Mobile Forensics', 'Cyber Crime Investigation & Network Security']
      },
      {
        name: 'M.A. in Police Administration and Strategic Management',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor’s degree in any stream from a recognized university with minimum 50% marks',
        estimatedFees: '₹65,000 / year',
        mode: 'Full-time',
        specializations: ['Scientific Policing & Crime Scene Management', 'Internal Security & Border Management']
      },
      {
        name: 'B.A. in Security Management (with Criminology & Forensic Basics)',
        degreeLevel: 'Bachelor',
        duration: '3 Years',
        eligibility: '10+2 in any stream from a recognized board with minimum 50% aggregate marks',
        estimatedFees: '₹45,000 / year',
        mode: 'Full-time',
        specializations: ['Criminology, Penology & Victimology', 'Homeland Security & Investigation Fundamentals']
      }
    ],
    feesRange: '₹45,000 - ₹65,000 / year',
    admissionProcess: 'RRU Common Entrance Test (RCET) / CUET + Merit Counseling',
    accreditation: 'Institution of National Importance (Ministry of Home Affairs, Govt. of India) | UGC Recognized',
    contactEmail: 'ap.campus@rru.ac.in',
    contactPhone: '+91 88370 50826',
    address: 'Near IGJ Govt. Higher Secondary School, Pasighat, East Siang District, Arunachal Pradesh 791102, India',
    ranking: 'Institution of National Importance (MHA, Govt. of India) - North-East Campus',
    facilities: [
      'Cyber Security & Digital Forensics Laboratory',
      'Police Science, Crime Investigation & Tactical Simulation Unit',
      'Digital Library with Remote Access to RRU Headquarters Resources',
      'Campus Hostels, Physical Conditioning & Sports Grounds'
    ],
    featured: true
  },
  {
    id: 'rru-lucknow',
    name: 'Rashtriya Raksha University (RRU) - Lucknow Campus (Uttar Pradesh)',
    shortName: 'RRU Lucknow',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    type: 'Central',
    website: 'https://rru.ac.in/lucknow-campus/',
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/2c/Rashtriya_Raksha_University_logo.png',
    bannerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
    description: 'Rashtriya Raksha University (RRU) Lucknow Campus, operating under the Ministry of Home Affairs, Government of India, is a dedicated regional center of excellence in Uttar Pradesh focusing on Cyber Security and Digital Forensics, Forensic Psychology, Police Science, and Criminal Justice Investigation.',
    coursesOffered: [
      {
        name: 'M.Sc. in Cyber Security and Digital Forensics',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. (CS/IT/Forensic Science/Physics/Maths) / BCA / B.Tech. with minimum 55% aggregate marks',
        estimatedFees: '₹82,500 / year',
        mode: 'Full-time',
        specializations: ['Digital Forensics & Incident Response (DFIR)', 'Cyber Crime Investigation & Ethical Hacking']
      },
      {
        name: 'M.A. / M.Sc. in Forensic Psychology',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor’s degree in Psychology, Science, or Allied Disciplines with minimum 55% aggregate marks',
        estimatedFees: '₹82,500 / year',
        mode: 'Full-time',
        specializations: ['Criminal Behavior & Investigative Profiling', 'Forensic Psychological Assessment & Deception Detection']
      },
      {
        name: 'PG Diploma in Police Science & Forensic Investigation (PGDIPS)',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor’s degree in any discipline from a recognized university with minimum 50% marks',
        estimatedFees: '₹55,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Evidence Collection', 'Criminal Law (BNS) & Modern Policing']
      },
      {
        name: 'M.A. in Police Administration and Strategic Management',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Graduation in any stream with minimum 50% aggregate marks',
        estimatedFees: '₹80,000 / year',
        mode: 'Full-time',
        specializations: ['Homeland Security & Counter-Terrorism', 'Scientific Investigation & Law Enforcement Management']
      }
    ],
    feesRange: '₹55,000 - ₹82,500 / year',
    admissionProcess: 'RRU Common Entrance Test (RCET) / CUET (PG) + Personal Interview',
    accreditation: 'Institution of National Importance (Ministry of Home Affairs, Govt. of India) | UGC Recognized',
    contactEmail: 'lucknow.campus@rru.ac.in',
    contactPhone: '+91 63574 36718',
    address: 'Dr. Shakuntala Misra National Rehabilitation University Campus, Mohaan Road, Lucknow, Uttar Pradesh 226017, India',
    ranking: 'Institution of National Importance (MHA, Govt. of India) - Uttar Pradesh Campus',
    facilities: [
      'Cyber Security & Digital Forensics Investigation Lab',
      'Forensic Psychology Testing & Behavioural Profiling Lab',
      'Crime Scene Simulation & Police Science Training Unit',
      'Central Library, Smart Classrooms & Hostel Facilities'
    ],
    featured: true
  },
  {
    id: 'rru-puducherry',
    name: 'Rashtriya Raksha University (RRU) - Puducherry Campus',
    shortName: 'RRU Puducherry',
    country: 'India',
    state: 'Puducherry',
    city: 'Puducherry',
    type: 'Central',
    website: 'https://rru.ac.in/puducherry-campus/',
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/2c/Rashtriya_Raksha_University_logo.png',
    bannerImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=1200',
    description: 'Rashtriya Raksha University (RRU) Puducherry Campus, established under the Ministry of Home Affairs, Government of India, serves Southern India with specialized academic and training programs in Criminology, Forensic & Clinical Psychology, Cyber Security and Digital Forensics, and Corporate Intelligence.',
    coursesOffered: [
      {
        name: 'M.A. / M.Sc. in Criminology',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor’s degree in Science, Arts, Law, Social Sciences, or Forensic Science with minimum 50% aggregate marks',
        estimatedFees: '₹80,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Science & Forensic Victimology', 'Cyber Criminology & Criminal Justice Administration']
      },
      {
        name: 'PG Diploma in Cyber Security and Digital Forensics',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor’s degree in Science, Computer Science, BCA, B.Tech, or Forensic Science with minimum 50% marks',
        estimatedFees: '₹60,000 / year',
        mode: 'Full-time',
        specializations: ['Network & Disk Forensics', 'Cyber Threat Intelligence & Incident Handling']
      },
      {
        name: 'B.A. in Criminology and Police Administration',
        degreeLevel: 'Bachelor',
        duration: '3 Years',
        eligibility: '10+2 in any stream from a recognized board with minimum 50% aggregate marks',
        estimatedFees: '₹55,000 / year',
        mode: 'Full-time',
        specializations: ['Fundamentals of Forensic Science & Crime Investigation', 'Police Administration & Criminal Law']
      }
    ],
    feesRange: '₹55,000 - ₹80,000 / year',
    admissionProcess: 'RRU Common Entrance Test (RCET) / CUET + Merit Counseling',
    accreditation: 'Institution of National Importance (Ministry of Home Affairs, Govt. of India) | UGC Recognized',
    contactEmail: 'puducherry.campus@rru.ac.in',
    contactPhone: '+91 63572 44807',
    address: 'Pondicherry Institute of Hotel Management & Catering Technology Campus, Murungapakkam, Puducherry 605004, India',
    ranking: 'Institution of National Importance (MHA, Govt. of India) - Puducherry Campus',
    facilities: [
      'Cyber Security & Digital Forensics Lab',
      'Criminology, Crime Scene Reconstruction & Police Science Lab',
      'Forensic Psychology & Behavioural Assessment Center',
      'Library, E-Learning Hub & Student Residential Facilities'
    ],
    featured: true
  },
  {
    id: 'rru-shivamogga',
    name: 'Rashtriya Raksha University (RRU) - Shivamogga Campus (Karnataka)',
    shortName: 'RRU Shivamogga',
    country: 'India',
    state: 'Karnataka',
    city: 'Shivamogga',
    type: 'Central',
    website: 'https://rru.ac.in/shivamogga-campus/',
    logo: 'https://upload.wikimedia.org/wikipedia/en/2/2c/Rashtriya_Raksha_University_logo.png',
    bannerImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    description: 'Inaugurated under the Ministry of Home Affairs, Government of India, Rashtriya Raksha University (RRU) Shivamogga Campus in Karnataka offers specialized postgraduate, undergraduate, and diploma programs in Criminology & Forensic Science, Cyber Security & Digital Forensics, and Defence & Strategic Studies.',
    coursesOffered: [
      {
        name: 'M.A. / M.Sc. in Criminology and Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor’s degree in Forensic Science, Criminology, Basic Sciences, or Social Sciences with minimum 50% marks',
        estimatedFees: '₹80,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Evidence Analysis', 'Forensic Toxicology, Questioned Documents & Fingerprint Science']
      },
      {
        name: 'PG Diploma in Cyber Security and Digital Forensics',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor’s degree in Science, BCA, B.E./B.Tech, or Forensic Science with minimum 50% marks',
        estimatedFees: '₹60,000 / year',
        mode: 'Full-time',
        specializations: ['Digital Evidence Recovery & Mobile Device Forensics', 'Cyber Crime Investigation & Network Defense']
      },
      {
        name: 'B.A. in Security Management',
        degreeLevel: 'Bachelor',
        duration: '3 Years',
        eligibility: '10+2 in any stream from a recognized board with minimum 50% aggregate marks',
        estimatedFees: '₹50,000 / year',
        mode: 'Full-time',
        specializations: ['Internal Security, Policing & Investigation', 'Corporate & Industrial Security']
      }
    ],
    feesRange: '₹50,000 - ₹80,000 / year',
    admissionProcess: 'RRU Common Entrance Test (RCET) / CUET + Merit Counseling',
    accreditation: 'Institution of National Importance (Ministry of Home Affairs, Govt. of India) | UGC Recognized',
    contactEmail: 'karnataka.campus@rru.ac.in',
    contactPhone: '+91 90999 35107',
    address: 'Oldairfield, Ragigudda, Navule, Shivamogga, Karnataka 577204, India',
    ranking: 'Institution of National Importance (MHA, Govt. of India) - Karnataka Campus',
    facilities: [
      'Criminology & Forensic Science Laboratory (Crime Scene, Fingerprints & Questioned Documents)',
      'Cyber Security & Digital Forensics Lab',
      'Tactical Policing & Security Simulation Facility',
      'Digital Library, Hostels & Outdoor Sports Complex'
    ],
    featured: true
  },
  {
    id: 'lloyd-institute-forensic-science-greater-noida',
    name: 'Lloyd Institute of Forensic Science (LIFS), Greater Noida',
    shortName: 'LIFS Greater Noida',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Greater Noida',
    type: 'Private',
    website: 'https://lifs.co.in',
    logo: 'https://lifs.co.in/images/lifs/ec-council.webp',
    bannerImage: 'https://lifs.co.in/images/lifs/lifs-banner1-28-2-23.webp',
    description: 'Located in Knowledge Park-II, Greater Noida (Delhi-NCR), Lloyd Institute of Forensic Science (LIFS) is a premier dedicated forensic science institution affiliated with the National Forensic Sciences University (NFSU), Gandhinagar (Ministry of Home Affairs, Govt. of India) and Chaudhary Charan Singh University (CCSU), Meerut. LIFS features EC-Council academic partnerships, mock crime scene houses, and advanced forensic instrumentation laboratories.',
    coursesOffered: [
      {
        name: 'B.Sc.-M.Sc. Forensic Science (5-Year Integrated - Affiliated to NFSU)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 in Science (PCB / PCM) with minimum 60% aggregate marks (55% for SC/ST/PwD) as per NFSU norms',
        estimatedFees: '₹1,10,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Management & Criminalistics', 'Forensic Chemistry, Toxicology & Ballistics', 'Forensic Biology, Serology & DNA Profiling']
      },
      {
        name: 'M.Sc. in Forensic Science (Affiliated to NFSU)',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Basic Sciences, Medicine, Pharmacy, Dentistry, or Engineering with minimum 55% aggregate marks (50% for SC/ST/PwD)',
        estimatedFees: '₹1,16,500 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Toxicology', 'Forensic Biology, Serology & DNA', 'Questioned Documents, Fingerprints & Cyber Forensics']
      },
      {
        name: 'B.Sc. in Forensic Science (Affiliated to CCSU)',
        degreeLevel: 'Bachelor',
        duration: '3 Years',
        eligibility: '10+2 in Science stream (PCM / PCB) with minimum 50% aggregate marks',
        estimatedFees: '₹90,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Evidence', 'Fingerprint Science & Questioned Documents']
      },
      {
        name: 'PG Professional Diploma in Forensic Document Examination',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor’s degree in Science, Forensic Science, or Law with minimum 50% aggregate marks',
        estimatedFees: '₹65,000 / year',
        mode: 'Full-time',
        specializations: ['Handwriting & Signature Verification', 'Forged Currency, Security Documents & Ink Analysis']
      }
    ],
    feesRange: '₹65,000 - ₹1,16,500 / year',
    admissionProcess: 'National Forensic Admission Test (NFAT) / Lloyd Entrance Test & Merit Counseling',
    accreditation: 'Affiliated to National Forensic Sciences University (NFSU), Gandhinagar & CCS University | EC-Council Academia Partner',
    contactEmail: 'admissions@lifs.co.in',
    contactPhone: '+91 98213 94572',
    address: 'Plot No. 11, Knowledge Park-II, Greater Noida, Delhi-NCR, Uttar Pradesh 201306, India',
    ranking: 'Top NFSU-Affiliated Dedicated Forensic Science Institute in Delhi-NCR',
    facilities: [
      'Dedicated Crime Scene House & Forensic Reconstruction Lab',
      'Forensic Chemistry, Analytical Toxicology & Instrumentation Lab',
      'Forensic Biology, Serology & Anthropology Laboratory',
      'Questioned Documents (VSC/Stereomicroscopy) & Fingerprint Development Lab',
      'EC-Council Certified Cyber Security & Digital Forensics Lab and Moot Court Hall'
    ],
    featured: true
  },
  {
    id: 'nsit-ifscs-ahmedabad',
    name: 'Narnarayan Shastri Institute of Technology - Institute of Forensic Sciences & Cyber Security (NSIT-IFSCS), Ahmedabad',
    shortName: 'NSIT-IFSCS Jetalpur',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    type: 'Private',
    website: 'https://www.nsitgurukul.com',
    logo: 'https://www.nsitgurukul.com/images/logo.png',
    bannerImage: 'https://www.nsitgurukul.com/images/about/about-us_1.jpg',
    description: 'Located in Jetalpur, Ahmedabad under the Swaminarayan Vividh Seva Niketan Trust, Narnarayan Shastri Institute of Technology - Institute of Forensic Sciences & Cyber Security (NSIT-IFSCS) is India’s first private institute affiliated with the National Forensic Sciences University (NFSU), Gandhinagar (an Institution of National Importance under MHA, Govt. of India). NSIT-IFSCS integrates NFSU’s curriculum with AI/XR-enabled EON Reality virtual crime scene simulation and specialized forensic laboratories.',
    coursesOffered: [
      {
        name: 'B.Sc.-M.Sc. Forensic Science (5-Year Integrated - Affiliated to NFSU)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 in Science stream (Physics, Chemistry, Biology/Mathematics) with minimum 60% marks (55% for SC/ST/PwD)',
        estimatedFees: '₹1,00,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Forensics', 'Forensic Chemistry & Toxicology', 'Forensic Biology, DNA & Cyber Forensics']
      },
      {
        name: 'M.Sc. in Forensic Science (Affiliated to NFSU)',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or Basic/Applied Sciences, Medicine, Pharmacy, or Engineering with minimum 55% aggregate marks',
        estimatedFees: '₹1,20,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Toxicology', 'Forensic Biology, Serology & DNA Profiling', 'Questioned Documents, Fingerprints & Ballistics']
      },
      {
        name: 'M.Sc. in Cyber Security / Digital Forensics and Information Security (Affiliated to NFSU)',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.E./B.Tech (CSE/IT/ECE) or B.Sc. (CS/IT/Cyber Security/Forensic Science) or BCA with minimum 55% aggregate marks',
        estimatedFees: '₹1,20,000 / year',
        mode: 'Full-time',
        specializations: ['Digital Evidence Recovery & Network Forensics', 'Vulnerability Assessment, Penetration Testing & Malware Analysis']
      },
      {
        name: 'B.Tech.-M.Tech. in Computer Science & Engineering (Cyber Security - Affiliated to NFSU)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 (PCM) with minimum 60% aggregate marks (55% for SC/ST/PwD) + JEE Main / NFAT / GUJCET',
        estimatedFees: '₹1,30,000 / year',
        mode: 'Full-time',
        specializations: ['Cyber Security & Digital Forensics', 'Cloud Security, Cryptography & Ethical Hacking']
      }
    ],
    feesRange: '₹1,00,000 - ₹1,30,000 / year',
    admissionProcess: 'National Forensic Admission Test (NFAT) / NFSU & NSIT Merit Counseling',
    accreditation: 'Affiliated to National Forensic Sciences University (NFSU), Gandhinagar | AICTE Approved | Recognized by Govt. of Gujarat',
    contactEmail: 'info@nsitgurukul.com',
    contactPhone: '+91 99099 76268',
    address: 'Jetalpur, Daskroi, National Highway No. 8, Ahmedabad, Gujarat 382426, India',
    ranking: 'First Private Institute Affiliated to National Forensic Sciences University (NFSU) in India',
    facilities: [
      'EON Reality AI & XR Virtual Crime Scene Reconstruction Center',
      'Forensic Chemistry, Analytical Toxicology & Instrumentation Lab',
      'Forensic Biology, Serology & Questioned Document Examination Lab',
      'Advanced Cyber Security, Digital Forensics & Ethical Hacking Lab',
      'Lush Green Jetalpur Gurukul Campus with Library, Auditorium & Transport'
    ],
    featured: true
  },
  {
    id: 'gujarat-university-ahmedabad',
    name: 'Gujarat University (Department of Forensic Science, School of Sciences), Ahmedabad',
    shortName: 'Gujarat University',
    country: 'India',
    state: 'Gujarat',
    city: 'Ahmedabad',
    type: 'State',
    website: 'https://www.gujaratuniversity.ac.in',
    logo: 'https://www.gujaratuniversity.ac.in/images/logo.png',
    bannerImage: 'https://www.gujaratuniversity.ac.in/images/tower.png',
    description: 'Established in 1949, Gujarat University is the largest and oldest state university in Gujarat, accredited by NAAC with an A+ Grade. Its Department of Forensic Science and Department of Cyber Security & Forensics under the School of Sciences at the Navrangpura campus in Ahmedabad offer highly sought-after 5-year Integrated B.Sc.-M.Sc., 2-year M.Sc., and Ph.D. programs in Forensic Science and Cyber Forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. + M.Sc. in Forensic Science (5-Year Integrated)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 (Science Stream - Group A, B, or AB) from GSEB / CBSE or equivalent board',
        estimatedFees: '₹32,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Forensics', 'Forensic Chemistry, Toxicology & Instrumentation', 'Forensic Biology, Serology & Questioned Documents']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Chemistry, Biology, Biotechnology, Biochemistry, Microbiology, or Physics with minimum 50% marks',
        estimatedFees: '₹27,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Toxicology', 'Forensic Biology & DNA Fingerprinting', 'Questioned Documents, Fingerprints & Ballistics']
      },
      {
        name: 'M.Sc. in Cyber Security and Forensics',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'BCA / B.Sc. (IT/CS/Cyber Security/Forensic Science) / B.E. / B.Tech with minimum 50% marks',
        estimatedFees: '₹90,000 / year',
        mode: 'Full-time',
        specializations: ['Digital Forensics & Incident Response', 'Network Security, Ethical Hacking & Malware Analysis']
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% marks + Gujarat University Ph.D. Entrance Test / UGC-NET',
        estimatedFees: '₹18,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Analytical Toxicology', 'Forensic Serology & Molecular Biology', 'Cyber & Digital Forensics']
      }
    ],
    feesRange: '₹18,000 - ₹90,000 / year',
    admissionProcess: 'GCAS (Gujarat Common Admission Services) Portal & Gujarat University Merit Counseling',
    accreditation: 'NAAC Accredited A+ Grade | UGC 12(B) Recognized State University',
    contactEmail: 'registrar@gujaratuniversity.ac.in',
    contactPhone: '+91 79 26301341',
    address: 'School of Sciences, Gujarat University Campus, Navrangpura, Ahmedabad, Gujarat 380009, India',
    ranking: 'NIRF Top 100 Universities in India | Premier State University in Gujarat',
    facilities: [
      'Department of Forensic Science Analytical & Crime Scene Laboratory',
      'Centre for Cyber Security & Digital Forensics Lab',
      'Forensic Biology, Serology & Toxicology Instrumentation Facility',
      'Dr. Babasaheb Ambedkar Central Library & 260-Acre Navrangpura Campus'
    ],
    featured: true
  },
  {
    id: 'msu-baroda-vadodara',
    name: 'The Maharaja Sayajirao University of Baroda (MSU Baroda), Vadodara',
    shortName: 'MSU Baroda',
    country: 'India',
    state: 'Gujarat',
    city: 'Vadodara',
    type: 'State',
    website: 'https://msubaroda.ac.in',
    logo: 'https://msu-new-2023-ec2-ubuntu-unzip.s3.ap-south-1.amazonaws.com/asset/images/msulogo412.png',
    bannerImage: 'https://msu-new-2023-ec2-ubuntu-unzip.s3.ap-south-1.amazonaws.com/asset/storage/slider/science.jpg',
    description: 'Originally founded as Baroda College of Science in 1881 and established as a residential university in 1949, The Maharaja Sayajirao University of Baroda (MSU Baroda) is a premier NAAC A-accredited state university in Vadodara. Across its Faculty of Science, Faculty of Law, Faculty of Arts, and Baroda Medical College, MSU Baroda offers specialized programs in Criminology & Criminal Justice, Cyber Security & Digital Forensics, Forensic Medicine, and Analytical & Food Forensics.',
    coursesOffered: [
      {
        name: 'B.A. (Hons.) in Criminology and Criminal Justice',
        degreeLevel: 'Bachelor',
        duration: '4 Years',
        eligibility: '10+2 in any stream from a recognized board with minimum 50% aggregate marks via GCAS Portal',
        estimatedFees: '₹18,500 / year',
        mode: 'Full-time',
        specializations: ['Criminology, Penology & Victimology', 'Forensic Science Fundamentals & Criminal Justice System']
      },
      {
        name: 'M.Sc. in Advanced Computing (Cyber Security & Digital Forensics Specialization)',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'BCA / B.Sc. (Computer Science/IT/Data Science) / B.E. with minimum 50% aggregate marks + MSU Entrance Test',
        estimatedFees: '₹48,000 / year',
        mode: 'Full-time',
        specializations: ['Cyber Security & Digital Forensics', 'Network Defense, Cryptography & Malware Analysis']
      },
      {
        name: 'M.D. in Forensic Medicine and Toxicology (Baroda Medical College)',
        degreeLevel: 'Doctorate',
        duration: '3 Years',
        eligibility: 'MBBS degree recognized by NMC + NEET-PG qualification',
        estimatedFees: '₹26,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Pathology & Autopsy Medicine', 'Clinical & Medico-Legal Toxicology']
      },
      {
        name: 'PG Diploma in Criminal Justice, Cyber Law & Forensic Evidence',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor’s degree in any discipline (Law/Science/Arts/Commerce) from a recognized university',
        estimatedFees: '₹15,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Jurisprudence & Medical Evidence', 'Cyber Crime Investigation & IT Law']
      }
    ],
    feesRange: '₹15,000 - ₹48,000 / year',
    admissionProcess: 'GCAS (Gujarat Common Admission Services) Portal & MSUB Entrance Examination',
    accreditation: 'NAAC Accredited A Grade | UGC 12(B) Recognized | NMC Recognized (Medical Faculty)',
    contactEmail: 'info@msubaroda.ac.in',
    contactPhone: '+91 265 2795555',
    address: 'Pratapgunj, Fatehgunj, Vadodara, Gujarat 390002, India',
    ranking: 'Heritage Unitary Residential State University of Gujarat (Est. 1881 / 1949)',
    facilities: [
      'Faculty of Science Advanced Computing & Cyber Forensics Lab',
      'Department of Forensic Medicine & Toxicology Autopsy & Museum Complex (SSG Hospital)',
      'Analytical Chemistry, Toxicology & Food Forensics Research Lab',
      'Smt. Hansa Mehta Library (Over 8 Lakh Books) & 275-Acre Heritage Campus'
    ],
    featured: true
  },
  {
    id: 'osmania-university-hyderabad',
    name: 'Osmania University (Department of Forensic Science, University College of Science), Hyderabad',
    shortName: 'Osmania University (UCS)',
    country: 'India',
    state: 'Telangana',
    city: 'Hyderabad',
    type: 'State',
    website: 'https://www.osmania.ac.in',
    logo: 'https://www.osmania.ac.in/images/logo.png',
    bannerImage: 'https://www.osmania.ac.in/images/tgr.jpg',
    description: 'Established in 1918, Osmania University is one of India’s oldest and most prestigious public universities, accredited by NAAC with an A+ Grade. The Department of Forensic Science at the University College of Science (Saifabad & Tarnaka Main Campus), Hyderabad offers postgraduate and doctoral programs in Forensic Science in close collaboration with the Telangana State Forensic Science Laboratory (TSFSL), Centre for DNA Fingerprinting and Diagnostics (CDFD), CCMB, and IICT Hyderabad.',
    coursesOffered: [
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. with Forensic Science, Chemistry, or Biological/Physical Sciences with minimum 40% marks + TG CPGET Entrance Rank',
        estimatedFees: '₹35,800 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry, Toxicology & Narcotics Analysis', 'Forensic Biology, Serology & DNA Fingerprinting (with CDFD/CCMB)', 'Questioned Documents, Fingerprint Science & Cyber Forensics']
      },
      {
        name: 'B.Sc. in Forensic Science (Constituent & Affiliated Colleges)',
        degreeLevel: 'Bachelor',
        duration: '3 Years',
        eligibility: '10+2 (Intermediate) in Science stream (BiPC / MPC) with minimum 50% aggregate marks via DOST Telangana',
        estimatedFees: '₹25,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Criminalistics', 'Forensic Chemistry, Biology & Toxicology']
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or Chemistry/Biochemistry with minimum 55% marks + OU Ph.D. Entrance Test / CSIR-UGC NET',
        estimatedFees: '₹18,000 / year',
        mode: 'Full-time',
        specializations: ['Analytical Toxicology & Trace Evidence', 'Forensic Genetics & Molecular Diagnostics', 'Digital & Questioned Document Forensics']
      }
    ],
    feesRange: '₹18,000 - ₹35,800 / year',
    admissionProcess: 'Telangana State Common Post Graduate Entrance Tests (TG CPGET) for M.Sc. | DOST Counseling for B.Sc.',
    accreditation: 'NAAC Accredited A+ Grade | UGC Category-I University with Potential for Excellence (UPE)',
    contactEmail: 'registrar@osmania.ac.in',
    contactPhone: '+91 40 27098043',
    address: 'Department of Forensic Science, University College of Science, Osmania University Main Campus, Amberpet, Hyderabad, Telangana 500007, India',
    ranking: 'NIRF Top 25 Public Universities in India | Premier Government Forensic Department in Telangana',
    facilities: [
      'Forensic Chemistry, Analytical Toxicology & Instrumentation Lab (HPLC, GC, UV-Vis, FTIR)',
      'Forensic Biology, Serology & DNA Profiling Training with CDFD & CCMB Hyderabad',
      'Questioned Documents, Fingerprint Science & Crime Scene Reconstruction Lab',
      'Central Facilities for Analytical Instrumentation (CFRD) & 1,600-Acre Osmania Campus'
    ],
    featured: true
  },
  {
    id: 'university-of-madras-chennai',
    name: 'University of Madras (Department of Criminology, Chepauk Campus), Chennai',
    shortName: 'University of Madras',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Chennai',
    type: 'State',
    website: 'https://www.unom.ac.in',
    logo: 'https://www.unom.ac.in/image/data/unomlogo.png',
    bannerImage: 'https://www.unom.ac.in/image/data/accredition/naac1.jpg',
    description: 'Founded in 1857 on the model of the University of London, the University of Madras is one of India’s three oldest premier universities and holds the highest NAAC A++ Accreditation. Its Department of Criminology (established in 1965 at the historic Chepauk Campus, Chennai) is a pioneer in Southern India offering M.Sc. in Cyber Forensics and Information Security, M.A. in Criminology and Criminal Justice Administration, PG Diplomas, and Ph.D. research.',
    coursesOffered: [
      {
        name: 'M.Sc. in Cyber Forensics and Information Security',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Computer Science, IT, Cyber Forensics, Forensic Science, Mathematics, Physics, Electronics, or BCA / B.E. / B.Tech',
        estimatedFees: '₹14,000 / year',
        mode: 'Full-time',
        specializations: ['Digital Evidence Recovery, Disk & Mobile Forensics', 'Information Security, Ethical Hacking & Cyber Crime Investigation']
      },
      {
        name: 'M.A. in Criminology and Criminal Justice Administration',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Any Bachelor’s degree (B.A. / B.Sc. / B.Com. / B.L. / BBA) from a recognized university',
        estimatedFees: '₹40,500 / year',
        mode: 'Full-time',
        specializations: ['Forensic Science & Crime Investigation', 'Victimology, Penology & Corporate Security Management']
      },
      {
        name: 'PG Diploma in Cyber Forensics and Information Security',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor’s degree in any discipline from a recognized university',
        estimatedFees: '₹12,000 / year',
        mode: 'Full-time',
        specializations: ['Cyber Crime Law & Digital Evidence Handling', 'Network Security & Incident Response']
      },
      {
        name: 'Ph.D. in Criminology and Cyber Forensics',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master’s degree in Criminology, Forensic Science, or Cyber Forensics with minimum 55% marks + University Entrance / UGC-NET',
        estimatedFees: '₹15,000 / year',
        mode: 'Full-time',
        specializations: ['Cyber Criminology & Digital Forensics', 'Victimology, Criminal Justice Policy & Policing']
      }
    ],
    feesRange: '₹12,000 - ₹40,500 / year',
    admissionProcess: 'University of Madras Postgraduate Entrance Examination + Merit Counseling',
    accreditation: 'NAAC Accredited A++ Grade (CGPA 3.59) | UGC Category-I University with Potential for Excellence',
    contactEmail: 'registrar@unom.ac.in',
    contactPhone: '+91 44 25399474',
    address: 'Department of Criminology, University of Madras, Chepauk Campus, Wallajah Road, Triplicane, Chennai, Tamil Nadu 600005, India',
    ranking: 'NIRF Top 50 Universities in India | Historic 1857 Public University & Pioneer in Criminology & Cyber Forensics',
    facilities: [
      'Dedicated Cyber Forensics & Information Security Laboratory',
      'Forensic Science & Crime Investigation Museum (Department of Criminology)',
      'Field Training with Tamil Nadu Forensic Sciences Department (TNFSD) & Cyber Crime Wing',
      'Historic Senate House, Madras University Library & Marina / Chepauk Campus Hostels'
    ],
    featured: true
  },
  {
    id: 'bharathiar-university-coimbatore',
    name: 'Bharathiar University (Department of Cyber Security & Forensic Science), Coimbatore',
    shortName: 'Bharathiar University',
    country: 'India',
    state: 'Tamil Nadu',
    city: 'Coimbatore',
    type: 'State',
    website: 'https://b-u.ac.in',
    logo: 'https://b-u.ac.in/sites/b-u.ac.in/files/logo2.png',
    bannerImage: 'https://b-u.ac.in/sites/b-u.ac.in/files/2025-10/home_entrance_0_0.jpg',
    description: 'Established in 1982 by the Government of Tamil Nadu in the scenic foothills of Marudhamalai, Coimbatore, Bharathiar University is a premier NAAC A++ Grade state university ranked among the top universities in India by NIRF. The university and its constituent/affiliated departments offer specialized programs in Cyber Security and Digital Forensics, Digital & Cyber Forensic Science, Forensic Linguistics, and Molecular Forensics.',
    coursesOffered: [
      {
        name: 'M.Sc. in Cyber Security (with Digital Forensics)',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Computer Science, IT, Cyber Forensics, Forensic Science, Electronics, or BCA with minimum 50% marks',
        estimatedFees: '₹24,500 / year',
        mode: 'Full-time',
        specializations: ['Digital Forensics, Malware Analysis & Incident Response', 'Network Security, Cryptography & Ethical Hacking']
      },
      {
        name: 'B.Sc. in Digital and Cyber Forensic Science / Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 Years',
        eligibility: '10+2 (Higher Secondary) with Mathematics / Computer Science / Physics / Chemistry / Biology from a recognized board',
        estimatedFees: '₹30,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Digital Forensics', 'Cyber Crime Law, Mobile Forensics & Network Security']
      },
      {
        name: 'PG Diploma in Forensic Linguistics / Cyber Security and Digital Forensics',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor’s degree in any discipline from a recognized university',
        estimatedFees: '₹8,770 / year',
        mode: 'Full-time',
        specializations: ['Forensic Phonetics, Speaker Identification & Authorship Attribution', 'Cyber Security & Digital Evidence Analysis']
      },
      {
        name: 'Ph.D. in Cyber Security, Digital Forensics & Applied Sciences',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master’s degree in relevant Science / Computer Science / Forensic discipline with minimum 55% marks + CET / UGC-NET',
        estimatedFees: '₹16,000 / year',
        mode: 'Full-time',
        specializations: ['Digital & Multimedia Forensics', 'Forensic Toxicology, Biotechnology & DNA Barcoding']
      }
    ],
    feesRange: '₹8,770 - ₹30,000 / year',
    admissionProcess: 'Bharathiar University Entrance Test & Merit-based Counseling',
    accreditation: 'NAAC Accredited A++ Grade (CGPA 3.63) | UGC Category-I State University',
    contactEmail: 'regr@buc.edu.in',
    contactPhone: '+91 422 2422222',
    address: 'Marudhamalai Main Road, Coimbatore, Tamil Nadu 641046, India',
    ranking: 'NIRF Top 25 Universities in India | NAAC A++ Accredited State University',
    facilities: [
      'Cyber Security & Digital Forensics Research Laboratory',
      'Forensic Linguistics & Acoustic Phonetics Analysis Lab',
      'DST-FIST & UGC-SAP Supported Central Instrumentation Center',
      '1,000-Acre Marudhamalai Foothills Campus with Arignar Anna Central Library & Hostels'
    ],
    featured: true
  },
  {
    id: 'gautam-buddha-university-greater-noida',
    name: 'Gautam Buddha University (School of Vocational Studies & Applied Sciences - Forensic Science), Greater Noida',
    shortName: 'GBU Greater Noida',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Greater Noida',
    type: 'State',
    website: 'https://www.gbu.ac.in',
    logo: 'https://www.gbu.ac.in/Content/img/fulllogogbu.png',
    bannerImage: 'https://www.gbu.ac.in/Content/img/banner/Homepic1.jpg',
    description: 'Established by the Uttar Pradesh Gautam Buddha University Act 2002 across a lush 511-acre campus in Greater Noida, Gautam Buddha University (GBU) is a state government university accredited by NAAC with a B+ Grade. Under the School of Vocational Studies and Applied Sciences (Department of Chemistry & Forensic Science) and School of Information & Communication Technology, GBU offers comprehensive B.Sc. (Hons.), M.Sc., PG Diploma, and Ph.D. programs in Forensic Science and Cyber Security.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) in Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '4 Years',
        eligibility: '10+2 in Science stream (PCM / PCB) with minimum 50% aggregate marks (45% for SC/ST) + GBU-ET / CUET (UG)',
        estimatedFees: '₹80,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Evidence', 'Forensic Chemistry, Toxicology & Questioned Documents', 'Forensic Biology, Serology & DNA Profiling']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or Basic/Applied Sciences with minimum 50% aggregate marks (45% for SC/ST) + GBU-ET / CUET (PG)',
        estimatedFees: '₹90,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Analytical Toxicology', 'Forensic Biology, Serology & DNA', 'Questioned Documents, Fingerprints & Forensic Ballistics']
      },
      {
        name: 'PG Diploma in Forensic Science',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Graduation in Science, Law, Medicine, or Allied Disciplines with minimum 50% marks',
        estimatedFees: '₹60,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Management & Forensic Law', 'Fingerprint & Document Examination']
      },
      {
        name: 'Ph.D. in Forensic Science & Applied Chemistry',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or Chemistry/Biotechnology with minimum 55% marks + GBU-ET / UGC-NET',
        estimatedFees: '₹50,000 / year',
        mode: 'Full-time',
        specializations: ['Nanoforensics & Latent Fingerprint Development', 'Analytical Toxicology & Environmental Forensics']
      }
    ],
    feesRange: '₹50,000 - ₹90,000 / year',
    admissionProcess: 'Gautam Buddha University Entrance Test (GBU-ET) / CUET (UG & PG) + Counseling',
    accreditation: 'NAAC Accredited | UGC 12(B) Recognized Uttar Pradesh State Government University',
    contactEmail: 'admissions@gbu.ac.in',
    contactPhone: '+91 120 2344200',
    address: 'opp. Yamuna Expressway, Greater Noida, Gautam Budh Nagar, Uttar Pradesh 201312, India',
    ranking: 'Premier 511-Acre State Government University in Delhi-NCR',
    facilities: [
      'Forensic Science Crime Scene Simulation & Fingerprint Examination Lab',
      'Forensic Chemistry, Toxicology & Advanced Analytical Instrumentation Lab',
      'Forensic Biology, Serology & Biotechnology Research Facility',
      'Bodhisattva Dr. B.R. Ambedkar Central Library, Indoor Stadium & 18 Campus Hostels'
    ],
    featured: true
  },
  {
    id: 'mg-university-kottayam',
    name: 'Mahatma Gandhi University (MGU), Kottayam',
    shortName: 'MG University Kottayam',
    country: 'India',
    state: 'Kerala',
    city: 'Kottayam',
    type: 'State',
    website: 'https://www.mgu.ac.in',
    logo: 'https://www.mgu.ac.in/assets/assets/images/logo-small.png',
    bannerImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    description: 'Established on October 2, 1983 in Priyadarsini Hills, Athirampuzha, Kottayam, Mahatma Gandhi University (MGU) is one of Kerala’s flagship public universities, holding the prestigious NAAC A++ Grade (CGPA 3.61) and NIRF Top 35 national ranking. Through its School of Computer Sciences, School of Biosciences, and specialized self-financing/affiliated institutions (STAS), MGU offers pioneering B.Sc. (Hons.) and M.Sc. programs in Cyber Forensics and Molecular/Analytical Forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) in Cyber Forensics (4-Year FYUGP)',
        degreeLevel: 'Bachelor',
        duration: '4 Years',
        eligibility: '10+2 (Plus Two) with Physics, Chemistry, and Mathematics/Biology/Computer Science with minimum 55% aggregate marks',
        estimatedFees: '₹42,000 / year',
        mode: 'Full-time',
        specializations: ['Digital Evidence Recovery, File System & Mobile Forensics', 'Ethical Hacking, Network Security & Cyber Law']
      },
      {
        name: 'M.Sc. in Cyber Forensics',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Cyber Forensics, Computer Science, IT, BCA, or B.Tech with minimum 55% aggregate marks + MGU CAT',
        estimatedFees: '₹45,000 / year',
        mode: 'Full-time',
        specializations: ['Advanced Memory, Cloud & IoT Forensics', 'Malware Reverse Engineering & Cyber Threat Intelligence']
      },
      {
        name: 'M.Sc. in Biochemistry / Biotechnology (with Forensic Molecular Biology)',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Biological / Chemical / Forensic Sciences with minimum 50% marks + MGU CAT',
        estimatedFees: '₹12,000 / year',
        mode: 'Full-time',
        specializations: ['DNA Profiling & Molecular Diagnostics', 'Analytical Biochemistry & Toxicology']
      },
      {
        name: 'Ph.D. in Cyber Forensics & Biosciences',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master’s degree in Cyber Forensics, Computer Science, or Biosciences with minimum 55% marks + MGU Doctoral Entrance / UGC-NET',
        estimatedFees: '₹15,000 / year',
        mode: 'Full-time',
        specializations: ['AI-Driven Digital Forensics & Steganalysis', 'Molecular Forensics & Nanobiotechnology']
      }
    ],
    feesRange: '₹12,000 - ₹45,000 / year',
    admissionProcess: 'Mahatma Gandhi University Common Admission Test (MGU-CAT) & Centralized Allotment Process (CAP)',
    accreditation: 'NAAC Accredited A++ Grade (CGPA 3.61) | UGC Category-I State University',
    contactEmail: 'mgu@mgu.ac.in',
    contactPhone: '+91 481 2731050',
    address: 'Priyadarsini Hills P.O., Athirampuzha, Kottayam, Kerala 686560, India',
    ranking: 'NIRF Top 35 Universities in India | NAAC A++ Accredited Premier University in Kerala',
    facilities: [
      'Dedicated Cyber Forensics, Ethical Hacking & Network Security Laboratories',
      'Inter-University Centre for Biomedical Research & Sophisticated Instrumentation (SAIF)',
      'Digital Evidence Acquisition, Mobile Forensics & Cryptography Suite',
      '110-Acre Priyadarsini Hills Green Campus with University Central Library & Hostels'
    ],
    featured: true
  },
  {
    id: 'sppu-pune',
    name: 'Savitribai Phule Pune University (SPPU), Pune',
    shortName: 'SPPU Pune',
    country: 'India',
    state: 'Maharashtra',
    city: 'Pune',
    type: 'State',
    website: 'http://www.unipune.ac.in',
    logo: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Savitribai_Phule_Pune_University_Logo.svg',
    bannerImage: 'http://www.unipune.ac.in/uop_files/Bannerimage/126.jpg',
    description: 'Established in 1949 and popularly known as the "Oxford of the East," Savitribai Phule Pune University (SPPU) is one of India’s premier public universities, accredited by NAAC with an A+ Grade across its historic 411-acre Ganeshkhind campus in Pune. Through its Department of Anthropology, Department of Law, Department of Technology, and affiliated colleges, SPPU offers specialized programs in Cyber Security and Digital Forensics, Forensic Anthropology & Odontology, and Forensic & Medical Jurisprudence.',
    coursesOffered: [
      {
        name: 'B.Sc. in Cyber Security and Digital Forensics (NEP 2020)',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 (HSC) in Science stream or Three-Year Engineering Diploma from a recognized board',
        estimatedFees: '₹45,000 / year',
        mode: 'Full-time',
        specializations: ['Digital Forensics, Incident Response & Ethical Hacking', 'Network Security, Cryptography & Cyber Law']
      },
      {
        name: 'M.A. / M.Sc. in Anthropology (Forensic Anthropology & Odontology Specialization)',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor’s degree in Science, Forensic Science, Anthropology, or Allied Sciences + SPPU OEE Entrance Exam',
        estimatedFees: '₹18,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Osteology, Skeletal Identification & Facial Reconstruction', 'Dermatoglyphics, Serology & Human Genetics']
      },
      {
        name: 'Professional Certification in Cyber Crime Investigation & Digital Forensics',
        degreeLevel: 'Certificate/Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor’s degree in any discipline from a recognized university',
        estimatedFees: '₹87,855 / year',
        mode: 'Full-time',
        specializations: ['Cyber Crime Investigation, OSINT & Dark Web Forensics', 'Mobile, Cloud & Network Evidence Analysis']
      },
      {
        name: 'Certificate / PG Diploma in Forensic Science and Medical Jurisprudence',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Graduate in Law, Science, Medicine, Pharmacy, or Social Sciences from a recognized university',
        estimatedFees: '₹18,000 / year',
        mode: 'Full-time',
        specializations: ['Medico-Legal Autopsy, Toxicology & Criminal Law (BNS)', 'Questioned Documents, Fingerprints & Crime Scene Evidence']
      },
      {
        name: 'Ph.D. in Forensic Anthropology, Chemistry & Cyber Security',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master’s degree in relevant discipline with minimum 55% marks + SPPU PET / UGC-CSIR NET',
        estimatedFees: '₹20,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Skeletal Biology & DNA Polymorphism', 'Analytical Toxicology & Digital Forensics']
      }
    ],
    feesRange: '₹18,000 - ₹87,855 / year',
    admissionProcess: 'SPPU Online Entrance Examination (OEE) & Merit Counseling',
    accreditation: 'NAAC Accredited A+ Grade (CGPA 3.60) | UGC Category-I State University',
    contactEmail: 'registrar@unipune.ac.in',
    contactPhone: '+91 20 25621000',
    address: 'Ganeshkhind Road, Pune, Maharashtra 411007, India',
    ranking: 'NIRF Top 25 Universities in India | Historic 411-Acre "Oxford of the East" Campus',
    facilities: [
      'Irawati Karve Museum of Anthropology & Forensic Osteology Laboratory',
      'Cyber Security, Digital Forensics & Network Defense Lab',
      'Central Instrumentation Facility (CIF) with GC-MS, LC-MS/MS, NMR & XRD',
      'Jayakar Knowledge Resource Centre (Library) & 411-Acre Heritage Campus'
    ],
    featured: true
  },
  {
    id: 'karnatak-university-dharwad',
    name: 'Karnatak University (Department of Studies in Criminology and Forensic Science), Dharwad',
    shortName: 'Karnatak University (KUD)',
    country: 'India',
    state: 'Karnataka',
    city: 'Dharwad',
    type: 'State',
    website: 'https://www.kud.ac.in',
    logo: 'https://kud.ac.in/images/kud-logo-new.png',
    bannerImage: 'https://kud.ac.in/image/banner-14.jpg',
    description: 'Established in 1949 at Pavate Nagar, Dharwad, Karnatak University (KUD) is the second oldest university in Karnataka, accredited by NAAC with an A Grade across a scenic 888-acre campus. Its pioneering Department of Studies in Criminology and Forensic Science (founded in 1959/1969, making it one of the oldest university forensic departments in India) and constituent Karnatak Science/Arts College offer B.Sc./B.A. (Hons.), M.Sc., M.A., and Ph.D. programs in Criminology and Forensic Science.',
    coursesOffered: [
      {
        name: 'M.Sc. in Criminology and Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Criminology, or Basic/Applied Sciences with minimum 45% aggregate marks (40% for SC/ST) + KUD Entrance Test',
        estimatedFees: '₹12,371 / year',
        mode: 'Full-time',
        specializations: ['Forensic Biology, Serology & Toxicology', 'Questioned Documents, Fingerprint Science & Forensic Ballistics', 'Crime Scene Investigation & Criminalistics']
      },
      {
        name: 'M.A. in Criminology and Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.A. / B.Sc. / B.Com. / B.S.W. / LL.B. with minimum 45% aggregate marks (40% for SC/ST) + KUD Entrance Test',
        estimatedFees: '₹9,800 / year',
        mode: 'Full-time',
        specializations: ['Criminal Justice Administration, Penology & Victimology', 'Police Science, Forensic Psychology & Crime Prevention']
      },
      {
        name: 'B.Sc. / B.A. (Hons.) in Criminology and Forensic Science (Karnatak Science & Arts College)',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 (PUC-II) in Science / Arts stream from a recognized board',
        estimatedFees: '₹15,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Science, Criminalistics & Crime Scene Investigation', 'Criminology, Police Administration & Juvenile Justice']
      },
      {
        name: 'Ph.D. in Criminology and Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. / M.A. in Criminology and Forensic Science with minimum 55% marks + KUD Ph.D. Entrance Test / UGC-NET',
        estimatedFees: '₹14,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Questioned Documents & Fingerprint Science', 'Forensic Toxicology, Cyber Crimes & Victimology']
      }
    ],
    feesRange: '₹9,800 - ₹15,000 / year',
    admissionProcess: 'Karnatak University Common Entrance Test (KUCET) for PG & UUCMS Portal for UG',
    accreditation: 'NAAC Accredited A Grade | UGC 12(B) Recognized University with Potential for Excellence',
    contactEmail: 'registrar@kud.ac.in',
    contactPhone: '+91 836 2215225',
    address: 'Department of Studies in Criminology and Forensic Science, Pavate Nagar, Karnatak University, Dharwad, Karnataka 580003, India',
    ranking: 'One of India’s Oldest University Departments of Criminology & Forensic Science (Est. 1959)',
    facilities: [
      'Historic Forensic Science & Criminology Museum (Weapons, Ballistics & Toxicology Specimens)',
      'Questioned Documents, Fingerprint Development & Footprint Casting Lab',
      'Forensic Photography, Biology, Serology & Chemical Analysis Lab',
      'University Scientific Instrumentation Centre (USIC) & 888-Acre Pavate Nagar Campus'
    ],
    featured: true
  },
  {
    id: 'christ-university-bengaluru',
    name: 'CHRIST (Deemed to be University) - Department of Life Sciences (Forensic Science), Bengaluru',
    shortName: 'Christ University Bengaluru',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    type: 'Deemed',
    website: 'https://christuniversity.in',
    logo: 'https://christuniversity.in/images/logo.png',
    bannerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
    description: 'Founded in 1969 and declared a Deemed-to-be University under Section 3 of the UGC Act in 2008, CHRIST (Deemed to be University), Bengaluru is accredited by NAAC with the highest A+ Grade. Under its School of Sciences (Department of Life Sciences) at the Bangalore Central Campus, Christ University offers premier B.Sc. (Hons. / Hons. with Research), M.Sc., and Ph.D. programs in Forensic Science with specialized laboratories in Criminalistics, Forensic Toxicology, Serology, Questioned Documents, and Digital Forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons. / Hons. with Research) in Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '4 Years',
        eligibility: '10+2 (PUC / ISC / CBSE) with Physics, Chemistry, Mathematics, and Biology with minimum 50% aggregate marks',
        estimatedFees: '₹1,48,000 - ₹1,68,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation, Ballistics & Fingerprint Science', 'Forensic Chemistry, Toxicology & Questioned Documents', 'Forensic Biology, DNA Profiling & Digital Forensics']
      },
      {
        name: 'B.Sc. in Biotechnology, Chemistry, Forensic Science (Triple Major / NEP)',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 in Science stream with Biology and Chemistry with minimum 50% aggregate marks',
        estimatedFees: '₹1,45,000 / year',
        mode: 'Full-time',
        specializations: ['Molecular Biotechnology & Forensic Genetics', 'Analytical Chemistry & Forensic Toxicology']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or any branch of Basic/Life/Chemical Sciences with minimum 50% aggregate marks',
        estimatedFees: '₹1,85,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Analytical Toxicology', 'Forensic Biology, Serology & DNA Fingerprinting', 'Questioned Documents, Cyber Forensics & Crime Scene Reconstruction']
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% aggregate marks + Christ University Ph.D. Entrance & Interview',
        estimatedFees: '₹60,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Entomology & Wildlife Forensics', 'Toxicology, Trace Evidence & Biometrics']
      }
    ],
    feesRange: '₹60,000 - ₹1,85,000 / year',
    admissionProcess: 'Christ University Entrance Test (CUET) + Skill Assessment, Micro Presentation & Personal Interview',
    accreditation: 'NAAC Accredited A+ Grade | UGC Recognized Deemed-to-be University | NIRF Top 70 University',
    contactEmail: 'mail@christuniversity.in',
    contactPhone: '+91 80 40129100',
    address: 'Hosur Road, Bhavani Nagar, S.G. Palya, Bengaluru, Karnataka 560029, India',
    ranking: 'NIRF Top 70 Universities in India | Premier Deemed University for Forensic & Life Sciences in Bengaluru',
    facilities: [
      'Dedicated Forensic Science Crime Scene Simulation & Ballistics Lab',
      'Forensic Chemistry, Analytical Toxicology & Advanced Instrumentation Facility',
      'Forensic Biology, Serology, Entomology & Molecular Genetics Lab',
      'Questioned Documents, Fingerprint Science & Digital Forensics Suite',
      'Knowledge Centre (Central Library), Auditorium & Hosur Road Central Campus'
    ],
    featured: true
  },
  {
    id: 'jain-university-bengaluru',
    name: 'JAIN (Deemed-to-be University) - School of Sciences (Department of Forensic Science), Bengaluru',
    shortName: 'JAIN University Bengaluru',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    type: 'Deemed',
    website: 'https://www.jainuniversity.ac.in',
    logo: 'https://www.jainuniversity.ac.in/jain/home/assets/images/jain-logo.png',
    bannerImage: 'https://www.jainuniversity.ac.in/jain/home/assets/images/2027/3831-ju-ug-web-banner-2027.webp',
    description: 'Accredited by NAAC with the highest A++ Grade (CGPA 3.71) and classified as a Category-I Deemed-to-be University by UGC, JAIN (Deemed-to-be University), Bengaluru is one of Southern India’s foremost centers for forensic and cyber security education. Its Department of Forensic Science under the School of Sciences offers industry-integrated B.Sc. (Hons.), M.Sc. in Forensic Science, M.Sc. in Digital Forensics & Information Security, and Ph.D. programs in partnership with EC-Council and forensic laboratories.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons. / Hons. with Research) in Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 (PUC / ISC / CBSE) in Science stream with Physics, Chemistry, and Biology/Mathematics with minimum 50% marks',
        estimatedFees: '₹1,80,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Forensics', 'Forensic Toxicology, Serology & DNA Analysis', 'Certified Hacking Forensic Investigator (CHFI) Track']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Life Sciences, Chemistry, Physics, or Allied Sciences with minimum 50% aggregate marks',
        estimatedFees: '₹2,50,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Toxicology', 'Forensic Biology, Serology & DNA Profiling', 'Questioned Documents, Fingerprints & Cyber Forensics']
      },
      {
        name: 'M.Sc. in Digital Forensics and Information Security',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. (CS/IT/Cyber Security/Forensic Science) / BCA / B.E. / B.Tech with minimum 50% aggregate marks',
        estimatedFees: '₹2,20,000 / year',
        mode: 'Full-time',
        specializations: ['Network, Cloud & Mobile Device Forensics', 'Malware Reverse Engineering, SOC Operations & VAPT']
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% aggregate marks + JAIN Entrance Test (JET-Ph.D.) / UGC-NET',
        estimatedFees: '₹75,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Toxicology & Trace Evidence', 'Digital Forensics & Biometrics', 'Forensic Anthropology & Serology']
      }
    ],
    feesRange: '₹75,000 - ₹2,50,000 / year',
    admissionProcess: 'JAIN Entrance Test (JET) + Personal Interview & Counseling',
    accreditation: 'NAAC Accredited A++ Grade (CGPA 3.71) | UGC Category-I Deemed-to-be University',
    contactEmail: 'admissions@jainuniversity.ac.in',
    contactPhone: '+91 80 46650100',
    address: 'School of Sciences, JC Road / Jayanagar 9th Block Campus, Bengaluru, Karnataka 560069, India',
    ranking: 'NIRF Top 65 Universities in India | NAAC A++ (CGPA 3.71) Deemed University',
    facilities: [
      'Dedicated Crime Scene Simulation & Forensic Reconstruction Lab',
      'Forensic Chemistry, Analytical Toxicology & Instrumentation Lab',
      'Forensic Biology, Serology, Odontology & Anthropology Lab',
      'EC-Council Partnered Cyber Forensics & Information Security Lab',
      'Questioned Documents, Fingerprint Science & Ballistics Examination Unit'
    ],
    featured: true
  },
  {
    id: 'galgotias-university-greater-noida',
    name: 'Galgotias University (Department of Forensic Science, School of Basic & Applied Sciences), Greater Noida',
    shortName: 'Galgotias University',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Greater Noida',
    type: 'Private',
    website: 'https://www.galgotiasuniversity.edu.in',
    logo: 'https://www.galgotiasuniversity.edu.in/public/uploads/media/ruw5LaQiSiFRCDtfkVElRnpmrjVqA8XHMqjIodhR.webp',
    bannerImage: 'https://www.galgotiasuniversity.edu.in/public/uploads/media/OEVr5a6uPsTXBnlpVn4Zywd2qOyWSYvNGNr7lbiz.jpg',
    description: 'Located opposite Buddha International Circuit along the Yamuna Expressway in Greater Noida, Galgotias University is a NAAC A+ accredited private university (CGPA 3.37). Its Department of Forensic Science under the School of Basic and Applied Sciences offers comprehensive B.Sc. (Hons. / Hons. with Research), M.Sc., PG Diploma, and Ph.D. programs in Forensic Science, equipped with dedicated Crime Scene Investigation, Toxicology, Serology, Ballistics, and Questioned Document laboratories.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons. / Hons. with Research) in Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 with Physics, Chemistry, and Biology/Mathematics with minimum 50% aggregate marks',
        estimatedFees: '₹94,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Forensics', 'Forensic Chemistry, Toxicology & Ballistics', 'Forensic Biology, Serology & Questioned Documents']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Biology, Chemistry, Biochemistry, Biotechnology, Microbiology, or B.Pharm / BDS with minimum 50% marks',
        estimatedFees: '₹94,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Toxicology', 'Forensic Biology, Serology & DNA Profiling', 'Questioned Documents, Fingerprints & Cyber Forensics']
      },
      {
        name: 'PG Diploma in Forensic Science',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor’s degree in Science, Forensic Science, Medicine, or Law with minimum 50% aggregate marks',
        estimatedFees: '₹55,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Management & Fingerprint Science', 'Document Examination & Forensic Law']
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% aggregate marks + Galgotias Ph.D. Entrance Test / UGC-NET',
        estimatedFees: '₹75,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Toxicology & Trace Evidence Chemistry', 'Questioned Document Examination, Biometrics & Digital Forensics']
      }
    ],
    feesRange: '₹55,000 - ₹94,000 / year',
    admissionProcess: 'CUET (UG & PG) / Galgotias Engineering & Science Entrance Exam (GEEE) / Merit-based Admission',
    accreditation: 'NAAC Accredited A+ Grade (CGPA 3.37) | UGC 12(B) Recognized | NIRF Ranked',
    contactEmail: 'admissions@galgotiasuniversity.edu.in',
    contactPhone: '+91 120 4370000',
    address: 'Plot No. 2, Sector 17-A, Yamuna Expressway, Greater Noida, Gautam Budh Nagar, Uttar Pradesh 203201, India',
    ranking: 'NAAC A+ Grade University | Top Ranked Forensic Science Department in Delhi-NCR',
    facilities: [
      'Dedicated Crime Scene Investigation & Reconstruction Lab',
      'Forensic Chemistry, Toxicology & Central Instrumentation Lab',
      'Forensic Biology, Serology, Anthropology & Odontology Lab',
      'Questioned Documents, Fingerprint Science & Forensic Ballistics Lab',
      '52-Acre Smart Campus with Moot Court, Central Library & Hostels'
    ],
    featured: true
  },
  {
    id: 'sharda-university-greater-noida',
    name: 'Sharda University (Sharda School of Basic Sciences & Research - Forensic Science), Greater Noida',
    shortName: 'Sharda University',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Greater Noida',
    type: 'Private',
    website: 'https://www.sharda.ac.in',
    logo: 'https://www.sharda.ac.in/attachments/site_logo/logo111.png',
    bannerImage: 'https://www.sharda.ac.in/attachments/banner_images/ai-enabled-campus.webp',
    description: 'Established across a 63-acre campus in Knowledge Park-III, Greater Noida, Sharda University is a NAAC A+ accredited global university with students from 95+ countries. Under the Sharda School of Basic Sciences & Research (SSBSR) and supported by the 1,200+ bed Sharda Hospital & School of Medical Sciences, the university offers B.Sc. (Hons.), M.Sc., and Ph.D. programs in Forensic Science with hands-on exposure to clinical toxicology, autopsy medicine, DNA profiling, and cyber forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons. / Hons. with Research) in Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 (Sr. Secondary) with Physics, Chemistry, and Biology/Mathematics with minimum 55% aggregate marks + SUAT / CUET (UG)',
        estimatedFees: '₹1,44,000 - ₹2,01,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Criminalistics', 'Forensic Toxicology, Chemistry & Ballistics', 'Forensic Biology, Serology & Questioned Documents']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Biology, Chemistry, Biotechnology, Biochemistry, Zoology, Botany, or B.Pharm / MBBS / BDS with minimum 55% marks',
        estimatedFees: '₹1,70,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Analytical Toxicology', 'Forensic Biology, Serology & DNA Fingerprinting', 'Questioned Documents, Fingerprints & Cyber Forensics']
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% marks + Sharda Ph.D. Entrance Test / UGC-NET',
        estimatedFees: '₹75,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Toxicology & Drug Analysis', 'Forensic Genetics, Serology & Trace Evidence']
      }
    ],
    feesRange: '₹75,000 - ₹2,01,000 / year',
    admissionProcess: 'Sharda University Admission Test (SUAT) / CUET (UG & PG) + Personal Interview',
    accreditation: 'NAAC Accredited A+ Grade | UGC 12(B) Recognized | NIRF Top 100 University',
    contactEmail: 'admission@sharda.ac.in',
    contactPhone: '+91 120 4570000',
    address: 'Plot No. 32-34, Knowledge Park III, Greater Noida, Gautam Budh Nagar, Uttar Pradesh 201310, India',
    ranking: 'NIRF Top 100 Universities in India | NAAC A+ Accredited Multidisciplinary University',
    facilities: [
      'Forensic Science Crime Scene Reconstruction & Ballistics Laboratory',
      'Forensic Toxicology, Chemistry & Central Instrumentation Facility',
      'Clinical Forensic Medicine & Autopsy Exposure at 1,200+ Bed Sharda Hospital',
      'Questioned Documents, Fingerprint Science & Cyber Forensics Lab',
      '63-Acre Global Campus with Swami Vivekananda Library & International Hostels'
    ],
    featured: true
  },
  {
    id: 'sage-university-indore',
    name: 'SAGE University (Institute of Sciences - Department of Forensic Science), Indore & Bhopal',
    shortName: 'SAGE University',
    country: 'India',
    state: 'Madhya Pradesh',
    city: 'Indore',
    type: 'Private',
    website: 'https://sageuniversity.in',
    logo: 'https://sageuniversity.in/assets/new_logo/logo.gif',
    bannerImage: 'https://sageuniversity.in/assets/images/campus/fra.jpg',
    description: 'Established by the SAGE Group in Indore and Bhopal, Madhya Pradesh, SAGE University is one of Central India’s youngest universities to achieve the prestigious NAAC A+ Grade Accreditation. Under its Institute of Sciences (Department of Forensic Science), SAGE University offers NEP-aligned B.Sc. (Hons.), M.Sc., and Ph.D. programs in Forensic Science with specialized training in Crime Scene Reconstruction, Forensic Toxicology, Serology, Questioned Documents, and Cyber Forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) in Forensic Science (NEP 2020)',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 in Science stream (Physics, Chemistry, and Biology/Mathematics) with minimum 50% aggregate marks + SEE Entrance',
        estimatedFees: '₹60,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Evidence', 'Forensic Chemistry, Toxicology & Ballistics', 'Forensic Biology, Serology & Fingerprint Science']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Biology, Chemistry, Biotechnology, Microbiology, or Allied Sciences with minimum 50% aggregate marks',
        estimatedFees: '₹55,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Toxicology & Analytical Chemistry', 'Forensic Biology, Serology & DNA Profiling', 'Questioned Documents, Fingerprints & Cyber Forensics']
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% aggregate marks + SAGE Ph.D. Entrance Exam / UGC-NET',
        estimatedFees: '₹70,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Toxicology & Environmental Forensics', 'Questioned Documents, Fingerprints & Crime Scene Science']
      }
    ],
    feesRange: '₹55,000 - ₹70,000 / year',
    admissionProcess: 'SAGE Entrance Exam (SEE) / CUET + Merit Counseling',
    accreditation: 'NAAC Accredited A+ Grade | UGC Recognized Private University in Madhya Pradesh',
    contactEmail: 'admission@sageuniversity.in',
    contactPhone: '+91 95225 78382',
    address: 'Kailod Kartal, Indore-Dewas Bypass Road, Rau, Indore, Madhya Pradesh 452020, India',
    ranking: 'NAAC A+ Grade University | Premier Forensic Science University in Central India (Indore & Bhopal)',
    facilities: [
      'Institute of Sciences Crime Scene Investigation & Forensic Simulation Lab',
      'Forensic Chemistry, Toxicology & Analytical Instrumentation Lab',
      'Forensic Biology, Serology & Questioned Document Examination Lab',
      'Cyber Security & Digital Forensics Lab, Moot Court & Central Library'
    ],
    featured: true
  },
  {
    id: 'jecrc-university-jaipur',
    name: 'JECRC University (School of Sciences - Department of Forensic Science), Jaipur',
    shortName: 'JECRC University Jaipur',
    country: 'India',
    state: 'Rajasthan',
    city: 'Jaipur',
    type: 'Private',
    website: 'https://jecrcuniversity.edu.in',
    logo: 'https://jecrcuniversity.edu.in/wp-content/uploads/2023/02/Untitled-design-1-2.png',
    bannerImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    description: 'Established across a 32-acre campus in Vidhani, Jaipur, JECRC University is a NAAC-accredited private university renowned in Rajasthan for its industry-aligned scientific and technological education. The Department of Forensic Science under the School of Sciences offers B.Sc. (Hons.), M.Sc., and Ph.D. programs in Forensic Science with hands-on training in Crime Scene Reconstruction, Forensic Chemistry & Toxicology, Serology, Questioned Documents, Ballistics, and Digital Forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons. / Hons. with Research) in Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 (Senior Secondary) in Science stream (PCB / PCM) with minimum 50% aggregate marks (45% for SC/ST/OBC)',
        estimatedFees: '₹65,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Criminalistics', 'Forensic Chemistry, Toxicology & Ballistics', 'Forensic Biology, Serology & Fingerprint Science']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Biology, Chemistry, Biotechnology, Microbiology, or Allied Sciences with minimum 50% aggregate marks',
        estimatedFees: '₹90,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Analytical Toxicology', 'Forensic Biology, Serology & DNA Profiling', 'Questioned Documents, Fingerprints & Cyber Forensics']
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% aggregate marks + JECRC Ph.D. Entrance Test / UGC-NET',
        estimatedFees: '₹75,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Toxicology & Trace Evidence', 'Latent Fingerprint Science, Questioned Documents & Digital Forensics']
      }
    ],
    feesRange: '₹65,000 - ₹90,000 / year',
    admissionProcess: 'CUET (UG & PG) / JECRC Merit Counseling & Personal Interview',
    accreditation: 'NAAC Accredited | UGC Recognized Private University in Rajasthan',
    contactEmail: 'admission@jecrcu.edu.in',
    contactPhone: '+91 141 6565615',
    address: 'Plot No. IS-2036 to IS-2039, Ramchandrapura Industrial Area, Vidhani, Sitapura Extension, Jaipur, Rajasthan 303905, India',
    ranking: 'Leading Forensic Science & Research University in Jaipur, Rajasthan',
    facilities: [
      'Crime Scene Investigation, Footprint & Bloodstain Pattern Analysis Lab',
      'Forensic Chemistry, Toxicology & Central Instrumentation Lab',
      'Forensic Biology, Serology, Anthropology & Odontology Lab',
      'Questioned Documents, Fingerprint Science & EC-Council Cyber Security Center',
      '32-Acre Sitapura Extension Campus with Central Library, MakerSpace & Hostels'
    ],
    featured: true
  },
  {
    id: 'mody-university-sikar',
    name: 'Mody University of Science and Technology (School of Sciences - Forensic Science), Lakshmangarh',
    shortName: 'Mody University Sikar',
    country: 'India',
    state: 'Rajasthan',
    city: 'Lakshmangarh (Sikar)',
    type: 'Private',
    website: 'https://www.modyuniversity.ac.in',
    logo: 'https://upload.wikimedia.org/wikipedia/en/6/60/Mody_University_logo.png',
    bannerImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
    description: 'Established in 1998 across a 265-acre eco-friendly residential campus in Lakshmangarh (Sikar district, Rajasthan), Mody University of Science and Technology is one of India’s premier women’s universities, accredited by NAAC with an A+ Grade. Under its School of Sciences, Mody University offers specialized B.Sc. (Hons. / Hons. with Research), M.Sc., and Ph.D. programs in Forensic Science empowering women in forensic investigation, toxicology, DNA profiling, and cyber forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons. / Hons. with Research) in Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 in Science stream (PCM / PCB) from a recognized board with minimum 50% aggregate marks',
        estimatedFees: '₹1,80,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Evidence', 'Forensic Chemistry, Toxicology & Ballistics', 'Forensic Biology, Serology & Questioned Documents']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Chemistry, Biology, Biotechnology, or Allied Sciences with minimum 50% aggregate marks',
        estimatedFees: '₹81,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Analytical Toxicology', 'Forensic Biology, Serology & DNA Profiling', 'Questioned Documents, Fingerprints & Cyber Forensics']
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% aggregate marks + Mody University Research Entrance Test / UGC-NET',
        estimatedFees: '₹80,000 / year',
        mode: 'Full-time',
        specializations: ['Analytical Toxicology & Trace Evidence', 'Forensic Biology, Genetics & Fingerprint Science']
      }
    ],
    feesRange: '₹80,000 - ₹1,80,000 / year',
    admissionProcess: 'Mody University Common Entrance Test (MUCET) / CUET + Merit Counseling',
    accreditation: 'NAAC Accredited A+ Grade | UGC 2(f) Recognized Exclusive Women’s University',
    contactEmail: 'admissions@modyuniversity.ac.in',
    contactPhone: '+91 91191 95002',
    address: 'NH-52, Sikar-Fatehpur Road, Lakshmangarh, District Sikar, Rajasthan 332311, India',
    ranking: 'NAAC A+ Grade University | India’s Premier Women’s University for Science & Forensic Education',
    facilities: [
      'School of Sciences Forensic Investigation, Fingerprint & Questioned Document Lab',
      'Forensic Chemistry, Toxicology & Advanced Analytical Instrumentation Lab',
      'Forensic Biology, Serology & Molecular Biology Laboratory',
      'Cyber Security & Digital Forensics Lab and Moot Court Hall',
      '265-Acre Secure Heritage Campus with Tapovan, Horse Riding, Central Library & Hostels'
    ],
    featured: true
  },
  {
    id: 'sgt-university-gurugram',
    name: 'SGT University (Faculty of Applied and Basic Sciences - Department of Forensic Science), Gurugram',
    shortName: 'SGT University Gurugram',
    country: 'India',
    state: 'Haryana',
    city: 'Gurugram',
    type: 'Private',
    website: 'https://sgtuniversity.ac.in',
    logo: 'https://sgtuniversity.ac.in/assets/images/sgtu-updated.png',
    bannerImage: 'https://sgtuniversity.ac.in/assets/images/homepage/banner/slide_1.webp',
    description: 'Established in 2013 across a 70-acre campus in Budhera, Gurugram (Delhi-NCR), Shree Guru Gobind Singh Tricentenary (SGT) University is a premier NAAC A+ accredited multidisciplinary university. Its Department of Forensic Science under the Faculty of Applied and Basic Sciences—alongside the Department of Forensic Medicine at the 800+ bed SGT Medical College, Hospital & Research Institute—offers B.Sc. (Hons.), M.Sc., Ph.D. in Forensic Science, and M.D. in Forensic Medicine & Toxicology.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons. / Hons. with Research) in Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 with Physics, Chemistry, and Biology/Mathematics with minimum 60% aggregate marks',
        estimatedFees: '₹1,20,000 - ₹1,75,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Forensics', 'Forensic Chemistry, Toxicology & Ballistics', 'Forensic Biology, Serology & Questioned Documents']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Basic Sciences, Life Sciences, B.Pharm, BDS, or MBBS with minimum 55% aggregate marks',
        estimatedFees: '₹1,20,000 - ₹1,75,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Toxicology', 'Forensic Biology, Serology & DNA Profiling', 'Questioned Documents, Fingerprints, Ballistics & Cyber Forensics']
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% aggregate marks + SGTU Ph.D. Entrance Test / UGC-NET',
        estimatedFees: '₹1,50,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Toxicology & Drug Abuse', 'Forensic Anthropology, Odontology & Trace Evidence']
      },
      {
        name: 'M.D. in Forensic Medicine and Toxicology (SGT Medical College)',
        degreeLevel: 'Doctorate',
        duration: '3 Years',
        eligibility: 'MBBS degree recognized by NMC + NEET-PG qualification',
        estimatedFees: '₹10,00,000 / year',
        mode: 'Full-time',
        specializations: ['Medico-Legal Autopsy & Forensic Pathology', 'Clinical Toxicology & Medical Jurisprudence']
      }
    ],
    feesRange: '₹1,20,000 - ₹10,00,000 / year',
    admissionProcess: 'CUET / SGTU Merit Counseling & Personal Interview (NEET-PG for M.D. Forensic Medicine)',
    accreditation: 'NAAC Accredited A+ Grade | UGC 12(B) Recognized | NMC Recognized (SGT Medical College)',
    contactEmail: 'info@sgtuniversity.org',
    contactPhone: '+91 1800 102 5661',
    address: 'Chandu-Budhera, Gurugram-Badli Road, Gurugram, Haryana 122505, India',
    ranking: 'NAAC A+ Grade University | Premier Forensic Science & Medical University in Gurugram (Delhi-NCR)',
    facilities: [
      'Crime Scene Simulation House, Bloodstain Pattern & Ballistics Lab',
      'Forensic Chemistry, Analytical Toxicology & Instrumentation Lab',
      'Forensic Biology, Serology, Odontology & Anthropology Laboratory',
      'Clinical Autopsy Mortuary & Forensic Medicine Museum at 800+ Bed SGT Hospital',
      'National Reference Simulation Centre (NRSC), Central Library & 70-Acre Campus'
    ],
    featured: true
  },
  {
    id: 'integral-university-lucknow',
    name: 'Integral University (Faculty of Science - Department of Biosciences & Forensic Science), Lucknow',
    shortName: 'Integral University Lucknow',
    country: 'India',
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    type: 'Private',
    website: 'https://www.iul.ac.in',
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/03/Integral_University_Logo.png',
    bannerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
    description: 'Established under Act Number 9 of 2004 by the Uttar Pradesh State Government across a 120-acre campus on Kursi Road, Lucknow, Integral University is accredited by NAAC with an A+ Grade. Through its Faculty of Science (Department of Biosciences & Department of Chemistry) and Integral Institute of Medical Sciences & Research (IIMSR), the university offers B.Sc. (Hons.), M.Sc., and Ph.D. programs in Forensic Science with comprehensive training in Toxicology, Serology, DNA Fingerprinting, and Questioned Documents.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) in Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 with Physics, Chemistry, and Biology/Mathematics with minimum 50% aggregate marks from a recognized board + IUET',
        estimatedFees: '₹85,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Evidence', 'Forensic Chemistry, Toxicology & Ballistics', 'Forensic Biology, Serology & Questioned Documents']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science, Biology, Chemistry, Biotechnology, Biochemistry, or Allied Sciences with minimum 50% aggregate marks + IUET',
        estimatedFees: '₹80,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Analytical Toxicology', 'Forensic Biology, Serology & DNA Profiling', 'Questioned Documents, Fingerprints & Cyber Forensics']
      },
      {
        name: 'Ph.D. in Forensic Science & Biosciences',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or Biosciences/Chemistry with minimum 55% aggregate marks + Integral University Research Entrance Test (IURET) / UGC-NET',
        estimatedFees: '₹75,000 / year',
        mode: 'Full-time',
        specializations: ['Molecular Forensics & Toxicology', 'Trace Evidence, Biometrics & Environmental Forensics']
      }
    ],
    feesRange: '₹75,000 - ₹85,000 / year',
    admissionProcess: 'Integral University Entrance Test (IUET) / CUET + Merit Counseling',
    accreditation: 'NAAC Accredited A+ Grade | UGC 2(f) & 12(B) Recognized | NMC & PCI Approved',
    contactEmail: 'admission@iul.ac.in',
    contactPhone: '+91 93351 77775',
    address: 'Dasauli, Bas-ha Kursi Road, Lucknow, Uttar Pradesh 226026, India',
    ranking: 'NAAC A+ Grade University | Leading Multidisciplinary & Forensic Science University in Lucknow',
    facilities: [
      'Forensic Science Crime Scene Reconstruction & Fingerprint Analysis Lab',
      'Forensic Chemistry, Toxicology & Central Instrumentation Facility',
      'Molecular Biology, Serology & DNA Fingerprinting Laboratory',
      'Forensic Medicine & Autopsy Exposure at Integral Institute of Medical Sciences & Research (IIMSR)',
      '120-Acre Residential Campus with Central Library, Auditorium & Hostels'
    ],
    featured: true
  },
  {
    id: 'ycis-satara',
    name: 'Yashavantrao Chavan Institute of Science (YCIS), Satara',
    shortName: 'YCIS Satara',
    country: 'India',
    state: 'Maharashtra',
    city: 'Satara',
    type: 'State',
    website: 'https://www.ycis.ac.in',
    logo: 'https://www.ycis.ac.in/header/newyclogo.png',
    bannerImage: 'https://www.ycis.ac.in/slider/1.jpeg',
    description: 'Established in 1958 by Padmabhushan Dr. Karmaveer Bhaurao Patil under the Rayat Shikshan Sanstha and operating as an Autonomous Institute & Constituent College of Karmaveer Bhaurao Patil University, Satara, Yashavantrao Chavan Institute of Science (YCIS), Satara is accredited by NAAC with the highest A++ Grade (CGPA 3.61). Its dedicated Department of Forensic Science offers comprehensive NEP-aligned B.Sc. (Hons.), M.Sc., Diploma, and research programs in Forensic Science, Cyber Forensics, Toxicology, Serology, Questioned Documents, and Crime Scene Investigation.',
    coursesOffered: [
      {
        name: 'B.Sc. (Hons.) in Forensic Science (NEP 2020)',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 (HSC) in Science stream with Physics, Chemistry, and Biology/Mathematics from a recognized board',
        estimatedFees: '₹41,500 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Investigation & Physical Forensics', 'Forensic Chemistry, Toxicology & Ballistics', 'Forensic Biology, Serology, DNA & Cyber Forensics', 'Questioned Documents, Fingerprint Science & Criminal Law (BNS)']
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or allied Science discipline from a recognized university + YCIS / KBPU Entrance Examination',
        estimatedFees: '₹43,315 - ₹54,000 / year',
        mode: 'Full-time',
        specializations: ['Forensic Chemistry & Analytical Toxicology', 'Forensic Biology, Serology & DNA Fingerprinting', 'Digital & Cyber Forensics', 'Questioned Document Examination & Fingerprint Science']
      },
      {
        name: 'Diploma / Skill Courses in Cyber Forensics, Crime Scene Management & Fingerprint Analysis',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: '10+2 (Science) or Undergraduate pursuing B.Sc. in Forensic / Allied Sciences',
        estimatedFees: '₹8,000 / year',
        mode: 'Full-time',
        specializations: ['Crime Scene Reconstruction & Fingerprint Development', 'Digital Evidence Recovery & Cyber Security']
      },
      {
        name: 'Ph.D. in Forensic Science & Allied Sciences',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% aggregate marks + KBPU PET / UGC-CSIR NET',
        estimatedFees: '₹25,000 / year',
        mode: 'Full-time',
        specializations: ['Analytical Toxicology & Trace Evidence Chemistry', 'Forensic Biology, Molecular Diagnostics & Digital Forensics']
      }
    ],
    feesRange: '₹8,000 - ₹54,000 / year',
    admissionProcess: 'YCIS / Karmaveer Bhaurao Patil University (KBPU) Entrance Test & Merit-based Counseling (MahaDBT Scholarships available)',
    accreditation: 'NAAC Accredited A++ Grade (CGPA 3.61) | Autonomous Constituent College of Karmaveer Bhaurao Patil University, Satara | UGC-CPE & DBT-STAR College',
    contactEmail: 'office@ycis.ac.in',
    contactPhone: '+91 2162 234392',
    address: 'Behind Collector Office, Sadar Bazar, Camp, Satara, Maharashtra 415001, India',
    ranking: 'NAAC A++ (CGPA 3.61) | Premier Autonomous Forensic & Science Institute in Western Maharashtra (Rayat Shikshan Sanstha)',
    facilities: [
      'Department of Forensic Science Crime Scene Investigation & Ballistics Lab',
      'Forensic Chemistry, Analytical Toxicology & DST-FIST Central Instrumentation Lab',
      'Forensic Biology, Serology, Entomology & Molecular Biology Laboratory',
      'Cyber Forensics, Questioned Documents & Fingerprint Examination Suite',
      'YC-CIII Incubation Center, Digital Library, Campus Hostels & Sports Complex'
    ],
    featured: true
  },
  {
    id: 'sandip-university-nashik',
    name: 'Sandip University, Nashik',
    shortName: 'SUN Nashik',
    country: 'India',
    state: 'Maharashtra',
    city: 'Nashik',
    type: 'Private',
    website: 'https://www.sandipuniversity.edu.in',
    logo: 'https://www.sandipuniversity.edu.in/images/logo.png',
    bannerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
    description: 'Established in 2017 under the Maharashtra Self-Financed Universities Act and sprawling across a 250+ acre lush green Wi-Fi enabled campus in Mahiravani, Nashik, Sandip University is a premier UGC-recognized Private University accredited by NAAC with an A Grade. Its School of Science (Department of Forensic Science) offers industry-aligned B.Sc., M.Sc., and Ph.D. programs in Forensic Science and Criminology with hands-on training in crime scene investigation, forensic toxicology, DNA profiling, fingerprint & questioned document examination, and cyber forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. in Forensic Science (NEP 2020)',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 (HSC) in Science stream (Physics, Chemistry, and Biology/Mathematics) with minimum 45% aggregate marks (40% for reserved categories) from a recognized board',
        estimatedFees: '₹95,000 - ₹1,10,000 / year',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Physical Forensics',
          'Forensic Chemistry & Analytical Toxicology',
          'Questioned Documents & Fingerprint Analysis',
          'Criminal Psychology, Criminology & Cyber Forensics'
        ]
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or any branch of Science (Physics, Chemistry, Botany, Zoology, Biotechnology, Microbiology, Biochemistry), Medicine, or B.Pharm with minimum 50% aggregate marks (45% for reserved categories)',
        estimatedFees: '₹80,000 - ₹90,000 / year',
        mode: 'Full-time',
        specializations: [
          'Forensic Chemistry & Toxicology',
          'Forensic Biology, Serology & DNA Profiling',
          'Digital & Cyber Forensics',
          'Questioned Documents, Fingerprints & Ballistics'
        ]
      },
      {
        name: 'Ph.D. in Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'M.Sc. in Forensic Science or allied Science discipline with minimum 55% aggregate marks + SU-PET (Sandip University Ph.D. Entrance Test) / UGC-CSIR NET',
        estimatedFees: '₹1,00,000 / year',
        mode: 'Full-time',
        specializations: [
          'Analytical Toxicology & Trace Evidence',
          'Digital Forensics & Cyber Crime Investigation',
          'Forensic Biology & Molecular Diagnostics'
        ]
      }
    ],
    feesRange: '₹80,000 - ₹1,10,000 / year',
    admissionProcess: 'SU-JEE (Sandip University Joint Entrance Exam) / Merit-based Admission in Qualifying Examination followed by Personal Interview & Counseling',
    accreditation: 'UGC Recognized under Section 2(f) | NAAC Accredited A Grade | AIU Member',
    contactEmail: 'info@sandipuniversity.edu.in',
    contactPhone: '1800-212-2714 / +91 95454 53092',
    address: 'Trimbak Road, Mahiravani, Nashik, Maharashtra 422213, India',
    ranking: 'NAAC A Grade | Top Emerging Private Multidisciplinary University in Maharashtra (250+ Acre Campus)',
    facilities: [
      'Dedicated Crime Scene Investigation & Forensic Reconstruction Lab',
      'Forensic Chemistry, Analytical Toxicology & Instrumentation Laboratory',
      'Forensic Biology, Serology & DNA Profiling Suite',
      'Questioned Document Examination, Fingerprint & Cyber Forensics Lab',
      '250+ Acre Wi-Fi Campus, Central Digital Library, Hostels & Sports Complex'
    ],
    featured: true
  },
  {
    id: 'shri-shivaji-science-college-amravati',
    name: 'Shri Shivaji Science College, Amravati',
    shortName: 'Shivaji Science College Amravati',
    country: 'India',
    state: 'Maharashtra',
    city: 'Amravati',
    type: 'State',
    website: 'https://www.shivajiscamt.org',
    logo: 'https://www.shivajiscamt.org/images/logo.png',
    bannerImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200',
    description: 'Established in 1958 by Shikshan Maharshi Dr. Panjabrao alias Bhausaheb Deshmukh under the Shri Shivaji Education Society and affiliated with Sant Gadge Baba Amravati University (SGBAU), Shri Shivaji Science College, Amravati is an autonomous-grade premier science institution accredited by NAAC with an A+ Grade (CGPA 3.42 in 4th Cycle) and recognized as a UGC College with Potential for Excellence (CPE). Its dedicated Department of Forensic Science (established in 2019) offers specialized B.Sc. in Forensic Science, B.Voc. in Forensic Science, and PG Diploma in Cyber Security programs integrating crime scene investigation, forensic biology, toxicology, ballistics, and digital forensics.',
    coursesOffered: [
      {
        name: 'B.Sc. in Forensic Science (NEP 2020)',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 (HSC) in Science stream (Physics, Chemistry, and Biology/Mathematics) from Maharashtra State Board or equivalent recognized board',
        estimatedFees: '₹12,000 - ₹28,500 / year',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Evidence Collection',
          'Forensic Biology, Serology & DNA Profiling',
          'Forensic Chemistry, Toxicology & Ballistics',
          'Fingerprint Analysis, Questioned Documents & Digital Forensics'
        ]
      },
      {
        name: 'B.Voc. (Bachelor of Vocation) in Forensic Science',
        degreeLevel: 'Bachelor',
        duration: '3 Years',
        eligibility: '10+2 (HSC) in Science stream from a recognized board (UGC-approved skill-oriented degree program)',
        estimatedFees: '₹15,000 - ₹25,000 / year',
        mode: 'Full-time',
        specializations: [
          'Applied Crime Scene Management & Field Forensics',
          'Analytical Forensic Instrumentation & Toxicology',
          'Latent Fingerprint, Document & Cyber Forensics'
        ]
      },
      {
        name: 'Postgraduate Diploma in Cyber Security & Digital Forensics',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'Bachelor’s Degree in Forensic Science, Computer Science, IT, BCA, Electronics, Physics, Chemistry, Life Sciences, or Law (LL.B.) from a recognized university',
        estimatedFees: '₹15,000 / year',
        mode: 'Full-time',
        specializations: [
          'Cyber Crime Investigation & Digital Evidence Recovery',
          'Network Security, Incident Response & Ethical Hacking'
        ]
      }
    ],
    feesRange: '₹12,000 - ₹28,500 / year',
    admissionProcess: 'Merit-based Admission as per Sant Gadge Baba Amravati University (SGBAU) & Government of Maharashtra norms (MahaDBT Scholarships applicable)',
    accreditation: 'NAAC Accredited A+ Grade (CGPA 3.42, 4th Cycle) | Affiliated to Sant Gadge Baba Amravati University (SGBAU) | UGC-CPE, DST-FIST & DBT-STAR Status',
    contactEmail: 'shivajiscamt.office@gmail.com',
    contactPhone: '+91 721 2660855',
    address: 'Shivaji Nagar, Morshi Road, Amravati, Maharashtra 444603, India',
    ranking: 'NAAC A+ (CGPA 3.42) | Premier Science & Forensic Institute in Vidarbha Region (NIRF Ranked College)',
    facilities: [
      'Department of Forensic Science Crime Scene & Physical Evidence Laboratory',
      'Forensic Biology, Serology, DNA & Toxicology Analysis Lab',
      'Cyber Security, Digital Forensics & Bioinformatics Center',
      'DST-FIST Central Instrumentation Facility & Research Laboratories',
      'Central Digital Library, Girls Hostel, Botanical Garden & Sports Complex'
    ],
    featured: true
  },
  {
    id: 'gh-raisoni-nagpur',
    name: 'G H Raisoni Skill Tech University (GHRSTU), Nagpur',
    shortName: 'GH Raisoni Nagpur',
    country: 'India',
    state: 'Maharashtra',
    city: 'Nagpur',
    type: 'Private',
    website: 'https://ghrstu.edu.in',
    logo: 'https://blogger.googleusercontent.com/img/a/AVvXsEisGM7zhetx-SuR9KTaDseNKeVgTZtQnmIpTZnZiGXn0GH9S8RGLPdBPDEG_iGHPY-vmaSD9KSV4AXa2UyeGziCJztNNFMXkRE871FPBR1p12AWq8KX5EwnsP6rHr8NKCyt5sgaRWPWEG5A6EB0-s2fY6Z1X1bJL7tcYY5OE_L6narP3rqPF91HGlhPDl4',
    bannerImage: 'https://blogger.googleusercontent.com/img/a/AVvXsEh1G7NDBa16Pk7pWQMcB0so8AleF_tqq_hLK3qzF6I-urFOUgN__PsJNBroGSPdPFwHYo4r--iaW1bC-wWqrhLkTaMPFLPvMhy3A8HF-jFJyGnYFll5i7rupu_eMtQUDC_lGJPlYxc6XtzDiJHUo3dYdEdiAq1OCITi7r3PS5PSD_IBS967YugjE5ubR0k',
    description: 'Established under the Maharashtra State Self-Financed Skill University Act and spearheaded by the renowned Raisoni Education Group in Nagpur, G H Raisoni Skill Tech University (GHRSTU), Nagpur offers skill-intensive, NEP 2020-aligned programs in Forensic Science and Digital Forensics. Its curriculum emphasizes practical laboratory mastery in crime scene reconstruction, forensic biology, analytical toxicology, fingerprint & questioned document examination, DNA profiling, and cyber evidence investigation.',
    coursesOffered: [
      {
        name: 'B.Sc. in Forensic Science (NEP 2020)',
        degreeLevel: 'Bachelor',
        duration: '3-4 Years',
        eligibility: '10+2 (HSC) or equivalent in Science stream (Physics, Chemistry, Biology/Mathematics) with minimum 45% aggregate marks (40% for reserved categories)',
        estimatedFees: '₹95,000 - ₹1,10,000 / year',
        mode: 'Full-time',
        specializations: [
          'Crime Scene Investigation & Reconstruction',
          'Forensic Biology, Serology & DNA Profiling',
          'Forensic Chemistry & Analytical Toxicology',
          'Fingerprint Science, Questioned Documents & Digital Forensics'
        ]
      },
      {
        name: 'M.Sc. in Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or allied Science discipline (Chemistry, Biology, Biotechnology, Microbiology, Biochemistry, Physics) with minimum 50% aggregate marks (45% for reserved categories)',
        estimatedFees: '₹85,000 - ₹1,00,000 / year',
        mode: 'Full-time',
        specializations: [
          'Advanced Criminalistics & Crime Scene Management',
          'Forensic Toxicology & Instrumental Chemistry',
          'Cyber Forensics & Digital Evidence Examination'
        ]
      }
    ],
    feesRange: '₹85,000 - ₹1,10,000 / year',
    admissionProcess: 'RUCET (Raisoni University Common Entrance Test) / Merit-based CAP Counseling & Personal Interview',
    accreditation: 'UGC Recognized Skill Tech University (Government of Maharashtra Act) | Raisoni Education Group (NAAC Accredited Institutions)',
    contactEmail: 'info@ghrstu.edu.in',
    contactPhone: '+91 78878 86726 / +91 93079 00682',
    address: 'Shradha Park, B-37/39, MIDC, Hingna-Wadi Link Road, Nagpur, Maharashtra 440016, India',
    ranking: 'Leading Skill-Focused Forensic & Technology University in Central India (Raisoni Group, Nagpur)',
    facilities: [
      'Forensic Science & Crime Scene Investigation Skill Laboratory',
      'Forensic Biology, Serology & Analytical Toxicology Lab',
      'Questioned Document, Latent Fingerprint & Ballistics Examination Unit',
      'Cyber Forensics, Network Security & Digital Evidence Lab',
      'Central Library, Innovation Incubation Center, Hostels & Transport Facility'
    ],
    featured: true
  }
];

const DELETED_COLLEGES_KEY = 'forenclue_deleted_college_ids';
const SYSTEM_SETTINGS_DOC = 'deleted_colleges';

/**
 * Retrieves the set of permanently deleted college IDs from localStorage and Firestore system_settings.
 */
async function getDeletedCollegeIds(): Promise<Set<string>> {
  const deletedSet = new Set<string>();

  // 1. Read localStorage cache first (synchronous & instant)
  try {
    const local = localStorage.getItem(DELETED_COLLEGES_KEY);
    if (local) {
      const arr = JSON.parse(local);
      if (Array.isArray(arr)) {
        arr.forEach(id => {
          if (typeof id === 'string') {
            deletedSet.add(id.toLowerCase().trim());
          }
        });
      }
    }
  } catch (_) {}

  // 2. Query Firestore system_settings/deleted_colleges
  try {
    const settingsDoc = await getDoc(doc(db, 'system_settings', SYSTEM_SETTINGS_DOC));
    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      if (Array.isArray(data?.deletedIds)) {
        data.deletedIds.forEach((id: any) => {
          if (typeof id === 'string') {
            deletedSet.add(id.toLowerCase().trim());
          }
        });
      }
    }
  } catch (err) {
    console.warn("Could not read deleted_colleges from system_settings:", err);
  }

  return deletedSet;
}

let cachedColleges: College[] | null = null;

export function getCachedColleges(): College[] | null {
  return cachedColleges;
}

export async function fetchColleges(): Promise<College[]> {
  try {
    const [deletedSet, querySnapshot] = await Promise.all([
      getDeletedCollegeIds(),
      getDocs(query(collection(db, COLLEGES_COLLECTION), orderBy('name', 'asc')))
    ]);
    
    const fetched: College[] = [];
    const seenIds = new Set<string>();

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const docIdLower = docSnap.id.toLowerCase().trim();

      // Skip records marked deleted
      if (data.isDeleted === true || data.status === 'deleted' || deletedSet.has(docIdLower)) {
        return;
      }

      seenIds.add(docIdLower);
      fetched.push({
        id: docSnap.id,
        name: data.name || '',
        shortName: data.shortName || '',
        country: data.country || 'India',
        state: data.state || '',
        city: data.city || '',
        type: data.type || 'Government',
        website: data.website || '',
        logo: data.logo || '',
        bannerImage: data.bannerImage || '',
        description: data.description || '',
        coursesOffered: Array.isArray(data.coursesOffered) ? data.coursesOffered : [],
        feesRange: data.feesRange || '',
        admissionProcess: data.admissionProcess || '',
        accreditation: data.accreditation || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        address: data.address || '',
        ranking: data.ranking || '',
        facilities: Array.isArray(data.facilities) ? data.facilities : [],
        featured: !!data.featured,
        createdBy: data.createdBy || 'ForenClue Admin',
        createdAt: data.createdAt ? (data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000).toISOString() : data.createdAt) : new Date().toISOString(),
        updatedAt: data.updatedAt ? (data.updatedAt.seconds ? new Date(data.updatedAt.seconds * 1000).toISOString() : data.updatedAt) : new Date().toISOString()
      });
    });

    // Include any verified directory colleges not yet persisted in Firestore (unless deleted by Admin)
    for (const sample of SAMPLE_COLLEGES) {
      const sampleIdLower = sample.id.toLowerCase().trim();
      if (!seenIds.has(sampleIdLower) && !deletedSet.has(sampleIdLower)) {
        seenIds.add(sampleIdLower);
        fetched.push(sample);
        // Persist in background if authenticated admin session is active
        setDoc(
          doc(db, COLLEGES_COLLECTION, sample.id),
          {
            ...sample,
            isDeleted: false,
            status: 'active',
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        ).catch(() => {});
      }
    }

    fetched.sort((a, b) => a.name.localeCompare(b.name));
    cachedColleges = fetched;
    return fetched;
  } catch (error) {
    console.warn("Could not fetch colleges from Firestore:", error);
    return cachedColleges || [];
  }
}

export async function fetchCollegeById(id: string): Promise<College | null> {
  const cleanId = String(id || '').trim();
  if (!cleanId) return null;
  const cleanLower = cleanId.toLowerCase();

  if (cachedColleges) {
    const fromCache = cachedColleges.find(c => c.id.toLowerCase() === cleanLower);
    if (fromCache) return fromCache;
  }

  try {
    const deletedSet = await getDeletedCollegeIds();
    if (deletedSet.has(cleanLower)) return null;

    const docRef = doc(db, COLLEGES_COLLECTION, cleanId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.isDeleted === true || data.status === 'deleted') {
        return null;
      }
      return {
        id: docSnap.id,
        name: data.name || '',
        shortName: data.shortName || '',
        country: data.country || 'India',
        state: data.state || '',
        city: data.city || '',
        type: data.type || 'Government',
        website: data.website || '',
        logo: data.logo || '',
        bannerImage: data.bannerImage || '',
        description: data.description || '',
        coursesOffered: Array.isArray(data.coursesOffered) ? data.coursesOffered : [],
        feesRange: data.feesRange || '',
        admissionProcess: data.admissionProcess || '',
        accreditation: data.accreditation || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        address: data.address || '',
        ranking: data.ranking || '',
        facilities: Array.isArray(data.facilities) ? data.facilities : [],
        featured: !!data.featured,
        createdAt: data.createdAt ? (data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000).toISOString() : data.createdAt) : new Date().toISOString()
      };
    }

    // Also check case-insensitive match from collection
    const snap = await getDocs(collection(db, COLLEGES_COLLECTION));
    for (const d of snap.docs) {
      if (d.id.toLowerCase() === cleanLower) {
        const data = d.data();
        if (data.isDeleted === true || data.status === 'deleted') return null;
        return {
          id: d.id,
          name: data.name || '',
          shortName: data.shortName || '',
          country: data.country || 'India',
          state: data.state || '',
          city: data.city || '',
          type: data.type || 'Government',
          website: data.website || '',
          logo: data.logo || '',
          bannerImage: data.bannerImage || '',
          description: data.description || '',
          coursesOffered: Array.isArray(data.coursesOffered) ? data.coursesOffered : [],
          feesRange: data.feesRange || '',
          admissionProcess: data.admissionProcess || '',
          accreditation: data.accreditation || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          address: data.address || '',
          ranking: data.ranking || '',
          facilities: Array.isArray(data.facilities) ? data.facilities : [],
          featured: !!data.featured,
          createdAt: data.createdAt ? (data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000).toISOString() : data.createdAt) : new Date().toISOString()
        };
      }
    }

    const fromSample = SAMPLE_COLLEGES.find(c => c.id.toLowerCase() === cleanLower);
    if (fromSample) return fromSample;
  } catch (err) {
    console.error("Error loading college by ID:", err);
  }
  
  return null;
}

export async function saveCollege(collegeData: Partial<College> & { id?: string }): Promise<string> {
  cachedColleges = null;
  const isUpdate = !!collegeData.id;
  const targetId = collegeData.id || `college_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const cleanId = targetId.trim();
  const lowerId = cleanId.toLowerCase();

  const payload = {
    name: collegeData.name || 'Untitled College',
    shortName: collegeData.shortName || '',
    country: collegeData.country || 'India',
    state: collegeData.state || '',
    city: collegeData.city || '',
    type: collegeData.type || 'Government',
    website: collegeData.website || '',
    logo: collegeData.logo || '',
    bannerImage: collegeData.bannerImage || '',
    description: collegeData.description || '',
    coursesOffered: collegeData.coursesOffered || [],
    feesRange: collegeData.feesRange || '',
    admissionProcess: collegeData.admissionProcess || '',
    accreditation: collegeData.accreditation || '',
    contactEmail: collegeData.contactEmail || '',
    contactPhone: collegeData.contactPhone || '',
    address: collegeData.address || '',
    ranking: collegeData.ranking || '',
    facilities: collegeData.facilities || [],
    featured: !!collegeData.featured,
    isDeleted: false,
    status: 'active',
    updatedAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, COLLEGES_COLLECTION, cleanId);
    if (!isUpdate) {
      (payload as any).createdAt = new Date().toISOString();
    }
    await setDoc(docRef, payload, { merge: true });

    // Clean up any deleted status in localStorage
    try {
      const local = localStorage.getItem(DELETED_COLLEGES_KEY);
      if (local) {
        const arr = JSON.parse(local);
        const filtered = (arr || []).filter((s: string) => s.toLowerCase() !== lowerId && s !== cleanId);
        localStorage.setItem(DELETED_COLLEGES_KEY, JSON.stringify(filtered));
      }
    } catch (_) {}

    return cleanId;
  } catch (error) {
    handleFirestoreError(error, isUpdate ? OperationType.UPDATE : OperationType.WRITE, `${COLLEGES_COLLECTION}/${cleanId}`);
    throw error;
  }
}

export async function deleteCollege(collegeId: string, collegeName?: string): Promise<void> {
  cachedColleges = null;
  const cleanId = String(collegeId || '').trim();
  if (!cleanId) return;

  const lowerId = cleanId.toLowerCase();
  const cleanName = String(collegeName || '').trim();
  const lowerName = cleanName.toLowerCase();

  // 1. Immediately update localStorage cache
  try {
    const local = localStorage.getItem(DELETED_COLLEGES_KEY);
    const arr: string[] = local ? JSON.parse(local) : [];
    if (!arr.map((s: string) => s.toLowerCase()).includes(lowerId)) {
      arr.push(lowerId);
      arr.push(cleanId);
      localStorage.setItem(DELETED_COLLEGES_KEY, JSON.stringify(arr));
    }
  } catch (localErr) {
    console.warn("Could not update local deleted colleges cache:", localErr);
  }

  // 2. Perform direct deletion from Firestore
  try {
    const docRef = doc(db, COLLEGES_COLLECTION, cleanId);
    await deleteDoc(docRef);
  } catch (directErr) {
    console.warn(`Direct deleteDoc for ${cleanId} encountered:`, directErr);
  }

  // 3. Also soft-delete / mark inactive as fallback
  try {
    const docRef = doc(db, COLLEGES_COLLECTION, cleanId);
    await updateDoc(docRef, { isDeleted: true, status: 'deleted', updatedAt: new Date().toISOString() });
  } catch (_) {}

  // 4. Also scan for any documents in colleges matching doc id or case-insensitive name
  try {
    const snap = await getDocs(collection(db, COLLEGES_COLLECTION));
    for (const d of snap.docs) {
      const data = d.data();
      const dIdLower = d.id.toLowerCase().trim();
      const dNameLower = String(data?.name || '').toLowerCase().trim();
      if (dIdLower === lowerId || (lowerName && dNameLower === lowerName)) {
        await deleteDoc(d.ref).catch(() => {});
      }
    }
  } catch (_) {}

  // 5. Backend Server API fallback deletion with admin privileges
  try {
    await fetch('/api/admin/delete-college', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: cleanId, name: cleanName })
    });
  } catch (apiErr) {
    console.warn("Server API college deletion notice:", apiErr);
  }
}

