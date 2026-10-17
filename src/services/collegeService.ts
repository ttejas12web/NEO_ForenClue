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
    name: 'National Forensic Sciences University (NFSU)',
    shortName: 'NFSU Gandhinagar',
    country: 'India',
    state: 'Gujarat',
    city: 'Gandhinagar',
    type: 'Institute of National Importance',
    website: 'https://nfsu.ac.in',
    logo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&q=80&w=1200',
    description: 'The world\'s first and only university dedicated strictly to Forensic and Cyber Security Sciences, established under the Ministry of Home Affairs, Govt. of India.',
    coursesOffered: [
      {
        name: 'B.Sc. - M.Sc. Forensic Science (5-Year Integrated)',
        degreeLevel: 'Master',
        duration: '5 Years',
        eligibility: '10+2 with Physics, Chemistry, Biology/Mathematics (Min 60%)',
        estimatedFees: '₹65,000 / semester',
        mode: 'Full-time',
        specializations: ['Fingerprint Science', 'Forensic Chemistry', 'DNA Profiling', 'Ballistics']
      },
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science / Physical Sciences / Chemistry / Biology (Min 55%)',
        estimatedFees: '₹70,000 / semester',
        mode: 'Full-time',
        specializations: ['Forensic Toxicology', 'Document & Questioned Examination', 'Cyber Forensics']
      },
      {
        name: 'M.Tech. Cyber Security & Digital Forensics',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.E./B.Tech. in CSE/IT/ECE or M.Sc. Computer Science',
        estimatedFees: '₹75,000 / semester',
        mode: 'Full-time',
        specializations: ['Malware Analysis', 'Network Incident Response', 'Cloud Forensics']
      },
      {
        name: 'Ph.D. in Forensic Science / Cyber Security',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'Master Degree in relevant discipline with GATE/NET/NFAT score',
        estimatedFees: '₹40,000 / semester',
        mode: 'Full-time'
      }
    ],
    feesRange: '₹60,000 - ₹80,000 / semester',
    admissionProcess: 'National Forensic Admission Test (NFAT) conducted annually by NFSU followed by counseling.',
    accreditation: 'NAAC A+ | UGC Recognized | Ministry of Home Affairs',
    contactEmail: 'admissions@nfsu.ac.in',
    contactPhone: '+91 79 23977100',
    address: 'Sector 9, Near Raysan Petrol Pump, Gandhinagar, Gujarat 382007',
    ranking: '#1 Dedicated Forensic University Worldwide',
    facilities: ['Advanced Ballistics Range', '3D Crime Scene Simulator', 'DNA Fingerprinting Center', 'High-Spec Cyber Lab', 'Central Library', 'On-Campus Hostels'],
    featured: true
  },
  {
    id: 'nfsu-delhi',
    name: 'National Forensic Sciences University - Delhi Campus',
    shortName: 'NFSU Delhi',
    country: 'India',
    state: 'Delhi',
    city: 'New Delhi',
    type: 'Institute of National Importance',
    website: 'https://delhi.nfsu.ac.in',
    logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200',
    description: 'Premier Delhi regional campus of NFSU located at LNJN NICFS Rohini, specializing in crime scene investigation and questioned document analysis.',
    coursesOffered: [
      {
        name: 'M.Sc. Forensic Science',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'B.Sc. in Forensic Science or relevant Science major',
        estimatedFees: '₹68,000 / semester',
        mode: 'Full-time'
      },
      {
        name: 'M.Sc. Criminology & Crime Scene Management',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'Bachelor Degree in Science / Law / Social Work',
        estimatedFees: '₹55,000 / semester',
        mode: 'Full-time'
      },
      {
        name: 'PG Diploma in Fingerprint Science',
        degreeLevel: 'Diploma',
        duration: '1 Year',
        eligibility: 'B.Sc. in Science / Forensic Science',
        estimatedFees: '₹40,000 / year',
        mode: 'Full-time'
      }
    ],
    feesRange: '₹40,000 - ₹70,000 / semester',
    admissionProcess: 'NFAT Entrance Examination & Merit Score',
    accreditation: 'Institute of National Importance | Ministry of Home Affairs',
    contactEmail: 'director_dc@nfsu.ac.in',
    contactPhone: '+91 11 27555890',
    address: 'LNJN NICFS, Institutional Area, Outer Ring Road, Sector 3, Rohini, Delhi 110085',
    ranking: 'Top Central Govt. Institute for Criminology & Forensics',
    facilities: ['Questioned Document Lab', 'Ballistic Comparison Microscope Lab', 'Moot Court', 'Forensic Medicine Reference Library'],
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
    id: 'panjab-university',
    name: 'Department of Forensic Science, Panjab University',
    shortName: 'PU Chandigarh',
    country: 'India',
    state: 'Chandigarh / Punjab',
    city: 'Chandigarh',
    type: 'Government',
    website: 'https://forensicscience.puchd.ac.in',
    logo: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&q=80&w=300',
    bannerImage: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200',
    description: 'One of India\'s oldest pioneer university departments for forensic science research and anthropology studies.',
    coursesOffered: [
      {
        name: 'M.Sc. Forensic Science & Criminology',
        degreeLevel: 'Master',
        duration: '2 Years',
        eligibility: 'PU Common Entrance Test (PU-CET PG) + B.Sc. Degree',
        estimatedFees: '₹25,000 / year',
        mode: 'Full-time'
      },
      {
        name: 'Ph.D. Forensic Science',
        degreeLevel: 'Doctorate',
        duration: '3-5 Years',
        eligibility: 'UGC-NET / GATE / PU Entrance',
        estimatedFees: '₹15,000 / year',
        mode: 'Full-time'
      }
    ],
    feesRange: '₹15,000 - ₹30,000 / year',
    admissionProcess: 'PU-CET PG Entrance Exam conducted by Panjab University.',
    accreditation: 'NAAC A++ Grade | Central University Status',
    contactEmail: 'forensic@pu.ac.in',
    contactPhone: '+91 172 2534120',
    address: 'Sector 14, Panjab University, Chandigarh 160014',
    ranking: 'NIRF Top 25 Universities in India',
    facilities: ['Forensic Anthropology Osteology Museum', 'Serology Research Unit'],
    featured: false
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

export async function fetchColleges(): Promise<College[]> {
  try {
    const q = query(collection(db, COLLEGES_COLLECTION), orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    
    const fetched: College[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // Skip records marked deleted
      if (data.isDeleted === true || data.status === 'deleted') {
        return;
      }

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

    return fetched;
  } catch (error) {
    console.warn("Could not fetch colleges from Firestore:", error);
    return [];
  }
}

export async function fetchCollegeById(id: string): Promise<College | null> {
  const cleanId = String(id || '').trim();
  if (!cleanId) return null;
  const cleanLower = cleanId.toLowerCase();

  try {
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
  } catch (err) {
    console.error("Error loading college by ID:", err);
  }
  
  return null;
}

export async function saveCollege(collegeData: Partial<College> & { id?: string }): Promise<string> {
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

