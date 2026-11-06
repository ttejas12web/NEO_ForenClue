export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  instructor: string;
  price: number;
  originalPrice: number;
  level: string;
  category: string;
  duration: string;
  description: string;
  instructorImage: string;
  curriculum: string[];
  instructorBio: string;
  thumbnail: string;
  publicationStatus: 'published' | 'coming-soon' | 'draft';
  notices: { id: number; date: string; content: string }[];
  modules: Module[];
}

export const COURSES: Course[] = [
  {
    id: 2,
    title: "Digital Forensics & Incident Response",
    instructor: "Tejas Tapse",
    price: 100,
    originalPrice: 1999,
    level: "Beginner",
    category: "Cyber Forensics",
    duration: "6 Weeks",
    description: "Master the art of recovering and investigating material found in digital devices.",
    instructorImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBbTT3QCs_EHXasFjAT9pC1laU-vAIRhIQ7qjpQHS3ErsprqykE9eT63H-XnATqutTGhCjq-zzbmvCeFhHfE0_DZ1wtZmu8pmARltV1makLhdqyCwftxjW55J0qyPbmjn6H6Abb6OzIHPUrkbkYOwmDeVxLmGyH_0nbr9qOnWtWKEg3NaPIvEJKTNg8vU/s1323/IMG_0865.PNG",
    curriculum: [
      "Digital Evidence Collection and Preservation",
      "File System Analysis (NTFS, FAT, EXT)",
      "Network Traffic Analysis and Spoofing detection",
      "Malware Analysis Fundamentals",
      "Incident Response Frameworks"
    ],
    instructorBio: "Tejas Tapse specializes in cyber security and digital forensic investigations, helping organizations respond to complex breaches.",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    publicationStatus: "coming-soon",
    notices: [
      { id: 1, date: "2024-03-18", content: "Updated lab environments are now live. Please re-download the VM image." },
      { id: 2, date: "2024-03-10", content: "Special webinar on 'Ransomware Investigation' next Monday." }
    ],
    modules: [
      {
        id: "m1",
        title: "Module 1: Digital Footprints",
        lessons: [
          { id: "l1", title: "Intro to Digital Forensics", duration: "25:00", videoUrl: "https://www.youtube.com/embed/6eM3O6UIdh0" },
          { id: "l2", title: "Imaging and Preservation", duration: "30:00", videoUrl: "https://www.youtube.com/embed/6eM3O6UIdh0" }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Forensic Serology & DNA Analysis",
    instructor: "Tejas Tapse",
    price: 100,
    originalPrice: 2499,
    level: "Intermediate",
    category: "Biological Science",
    duration: "5 Weeks",
    description: "Deep dive into biological evidence and DNA profiling technologies.",
    instructorImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBbTT3QCs_EHXasFjAT9pC1laU-vAIRhIQ7qjpQHS3ErsprqykE9eT63H-XnATqutTGhCjq-zzbmvCeFhHfE0_DZ1wtZmu8pmARltV1makLhdqyCwftxjW55J0qyPbmjn6H6Abb6OzIHPUrkbkYOwmDeVxLmGyH_0nbr9qOnWtWKEg3NaPIvEJKTNg8vU/s1323/IMG_0865.PNG",
    curriculum: [
      "Identification of Biological Fluids (Blood, Semen, Saliva)",
      "Bloodstain Pattern Analysis (BPA)",
      "DNA Extraction and Quantification",
      "PCR and STR Profiling",
      "Interpreting DNA Evidence in Legal Contexts"
    ],
    instructorBio: "With a background in molecular biology, Tejas Tapse provides expert insights into the science of biological evidence.",
    thumbnail: "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?q=80&w=800&auto=format&fit=crop",
    publicationStatus: "coming-soon",
    notices: [
      { id: 1, date: "2024-03-22", content: "New research paper on 'Rapid DNA Profiling' added to the reading material." }
    ],
    modules: [
      {
        id: "m1",
        title: "Module 1: Biological Evidence",
        lessons: [
          { id: "l1", title: "Serology Basics", duration: "22:00", videoUrl: "https://www.youtube.com/embed/m6_v3Z95YpM" }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Crime Scene Photography",
    instructor: "Tejas Tapse",
    price: 100,
    originalPrice: 1499,
    level: "Beginner",
    category: "Documentation",
    duration: "3 Weeks",
    description: "Essential techniques for documenting crime scenes accurately through photography.",
    instructorImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBbTT3QCs_EHXasFjAT9pC1laU-vAIRhIQ7qjpQHS3ErsprqykE9eT63H-XnATqutTGhCjq-zzbmvCeFhHfE0_DZ1wtZmu8pmARltV1makLhdqyCwftxjW55J0qyPbmjn6H6Abb6OzIHPUrkbkYOwmDeVxLmGyH_0nbr9qOnWtWKEg3NaPIvEJKTNg8vU/s1323/IMG_0865.PNG",
    curriculum: [
      "Camera Settings and Exposure for Investigations",
      "Macro Photography for Trace Evidence",
      "Lighting Techniques (Direct, Oblique, Cross)",
      "Panoramic and Overall Scene Documentation",
      "Legal Admissibility of Photographic Evidence"
    ],
    instructorBio: "Tejas Tapse combines investigative experience with technical photography skills to teach precise scene documentation.",
    thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    publicationStatus: "coming-soon",
    notices: [
      { id: 1, date: "2024-03-15", content: "Submit your 'Lighting Practice' assignment by this Sunday." }
    ],
    modules: [
      {
        id: "m1",
        title: "Module 1: Documentation",
        lessons: [
          { id: "l1", title: "Photography Basics", duration: "19:00", videoUrl: "https://www.youtube.com/embed/m6_v3Z95YpM" }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Questioned Document Examination",
    instructor: "Tejas Tapse",
    price: 100,
    originalPrice: 2999,
    level: "Intermediate",
    category: "Documentation",
    duration: "4 Weeks",
    description: "Learn to identify forgeries, handwriting analysis, and paper/ink comparisons.",
    instructorImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBbTT3QCs_EHXasFjAT9pC1laU-vAIRhIQ7qjpQHS3ErsprqykE9eT63H-XnATqutTGhCjq-zzbmvCeFhHfE0_DZ1wtZmu8pmARltV1makLhdqyCwftxjW55J0qyPbmjn6H6Abb6OzIHPUrkbkYOwmDeVxLmGyH_0nbr9qOnWtWKEg3NaPIvEJKTNg8vU/s1323/IMG_0865.PNG",
    curriculum: [
      "Handwriting Comparison and Identification",
      "Analysis of Altered and Obligations Documents",
      "Ink and Paper Analysis (Thin-Layer Chromatography)",
      "Typewriter and Printer Identification",
      "Counterfeit Detection Techniques"
    ],
    instructorBio: "Tejas Tapse is an expert in document authentication, helping prove the validity of critical evidence in court.",
    thumbnail: "/images/og/courses.png",
    publicationStatus: "coming-soon",
    notices: [
      { id: 1, date: "2024-03-21", content: "New high-resolution forgery samples uploaded to the asset gallery." }
    ],
    modules: [
      {
        id: "m1",
        title: "Module 1: Paper & Ink",
        lessons: [
          { id: "l1", title: "Document Authentication", duration: "28:00", videoUrl: "https://www.youtube.com/embed/m6_v3Z95YpM" }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Advanced Forensic Anthropology",
    instructor: "Tejas Tapse",
    price: 100,
    originalPrice: 3499,
    level: "Advanced",
    category: "Anthropology",
    duration: "8 Weeks",
    description: "Specialized study of human skeletal remains to determine identity and cause of death.",
    instructorImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhBbTT3QCs_EHXasFjAT9pC1laU-vAIRhIQ7qjpQHS3ErsprqykE9eT63H-XnATqutTGhCjq-zzbmvCeFhHfE0_DZ1wtZmu8pmARltV1makLhdqyCwftxjW55J0qyPbmjn6H6Abb6OzIHPUrkbkYOwmDeVxLmGyH_0nbr9qOnWtWKEg3NaPIvEJKTNg8vU/s1323/IMG_0865.PNG",
    curriculum: [
      "Human vs. Animal Osteology",
      "Determination of Age, Sex, and Ancestry from Bone",
      "Trauma Analysis (Blunt Force, Sharp Force, Ballistic)",
      "Taphonomic Changes and Estimation of PMI",
      "Reconstruction of Identity through Craniofacial Features"
    ],
    instructorBio: "Tejas Tapse brings deep anatomical knowledge to identifying human remains and reconstructing life histories from bone.",
    thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=800&auto=format&fit=crop",
    publicationStatus: "coming-soon",
    notices: [
      { id: 1, date: "2024-03-19", content: "Advanced skeletal reconstruction tool link sent to all enrolled students." }
    ],
    modules: [
      {
        id: "m1",
        title: "Module 1: Osteology",
        lessons: [
          { id: "l1", title: "Bone Identification", duration: "35:00", videoUrl: "https://www.youtube.com/embed/m6_v3Z95YpM" }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Certificate Course in Forensic Toxicology",
    instructor: "Mr. Rajat Pithadia",
    price: 0,
    originalPrice: 2999,
    level: "Advanced",
    category: "Forensic Toxicology",
    duration: "6 Modules • Self-Paced",
    description: "Comprehensive 6-module self-paced certification course (Course Code: FT2601) covering Foundations of Forensic Toxicology, Pharmacokinetics & Pharmacodynamics, Isolation & Clean-Up of Poisons from Viscera (Stas-Otto, Ammonium Sulphate, Distillation, Conway Microdiffusion, Dialysis), Modern Extraction (SPE, SPME, ASE), Chromatography & Spectrometry (TLC, HPLC, GLC, AAS, ICP-MS, Ion Chromatography), Metallic Poisons & Toxic Anions, Volatiles & Liquor Estimation in Breath/Blood/Urine, Barbiturates/Chloral Hydrate/Tranquilizers, Pesticides, NDPS Drugs, Sports Doping Analysis, Alkaloids, Plant & Animal Poisons, Food Poisoning, Hair/Metabolite Analysis, and Section 329 BNSS Reporting.",
    instructorImage: "https://blogger.googleusercontent.com/img/a/AVvXsEiseuO8LFJ74UtogyoZLu5orh44gH7WVqDM4oinlMLhD3u4grQKoinTCZYk-OfKJrXJjV8E9EZHoPbhefI60LoXmqO623wQXiv-4hXumhYmBrBJCh4HYvYk9ifZ4nSccrYe5qyJHQXAQvW_8Zgkdq3T7vCycYqiJy0aUSZYzhmqc8M12jhhUq3X1GoORws",
    curriculum: [
      "Module 1 (FT2601-M1): Foundations of Forensic Toxicology, Poisoning in India, Pharmacokinetics (ADME) & Pharmacodynamics (Receptors)",
      "Module 2 (FT2601-M2): Isolation & Clean-Up Procedures of Poisons from Viscera, Sample Matrices & Classical Extraction (Stas-Otto, Ammonium Sulphate, Distillation, Conway, Dialysis)",
      "Module 3 (FT2601-M3): Modern Extraction (Dry/Wet/Microwave Digestion, SPE, SPME, ASE), Chromatography (TLC, HPTLC, HPLC, GLC) & Spectrometry (UV-Vis, FTIR, MS, AAS, ICP-MS, IC)",
      "Module 4 (FT2601-M4): General Study & Analysis of Metallic Poisons, Inorganic Anions, Volatiles, Liquor Estimation in Breath/Blood/Urine, Barbiturates/Chloral Hydrate/Tranquilizers & Pesticides",
      "Module 5 (FT2601-M5): Narcotic Drugs & Psychotropic Substances (NDPS), Drugs of Abuse in Sports (WADA, GC-C-IRMS) & Alkaloid Characterization",
      "Module 6 (FT2601-M6): Plant & Animal Poisons, Food Poisoning, Hair & Metabolite Analysis, and Section 329 BNSS Medico-Legal Reporting"
    ],
    instructorBio: "Mr. Rajat Pithadia is an Academic Mentor at ForenClue, Assistant Professor at Parul University, Wiley Author, Ph.D. Scholar (Genotoxicity & Mutagenicity), and UGC-NET & GSET Qualified educator holding an M.Sc. in Forensic Chemistry, Toxicology & Pharmacology.",
    thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1000&auto=format&fit=crop",
    publicationStatus: "published",
    notices: [
      { id: 1, date: "2026-11-04", content: "Self-Paced Certification Protocol (FT2601): Complete all 6 research modules, score ≥ 90% on each module quiz, and pass the Case Assignments on even-numbered modules (Modules 2, 4, and 6) to unlock your official Certificate PDF." },
      { id: 2, date: "2026-11-04", content: "No video lectures are required—all research dossiers, interactive forensic calculators, quizzes, and case assignments are self-paced." }
    ],
    modules: [
      {
        id: "tox-mod-1",
        title: "Module 1: Foundations, Poisoning in India, Pharmacokinetics & Pharmacodynamics",
        lessons: [{ id: "m1-s1", title: "Self-Paced Research & Quiz (≥90%)", duration: "8 Hours", videoUrl: "" }]
      },
      {
        id: "tox-mod-2",
        title: "Module 2: Viscera Isolation & Clean-Up, Matrices & Classical Extraction",
        lessons: [{ id: "m2-s1", title: "Self-Paced Research, Quiz (≥90%) & Case Assignment", duration: "8 Hours", videoUrl: "" }]
      },
      {
        id: "tox-mod-3",
        title: "Module 3: Modern Extraction, Chromatography & Spectrometric/Inorganic Analysis",
        lessons: [{ id: "m3-s1", title: "Self-Paced Research & Quiz (≥90%)", duration: "8 Hours", videoUrl: "" }]
      },
      {
        id: "tox-mod-4",
        title: "Module 4: Metallic Poisons, Anions, Volatiles, Liquor Estimation, Depressants & Pesticides",
        lessons: [{ id: "m4-s1", title: "Self-Paced Research, Quiz (≥90%) & Case Assignment", duration: "9 Hours", videoUrl: "" }]
      },
      {
        id: "tox-mod-5",
        title: "Module 5: NDPS Drugs, Sports Doping Analysis & Alkaloid Characterization",
        lessons: [{ id: "m5-s1", title: "Self-Paced Research & Quiz (≥90%)", duration: "9 Hours", videoUrl: "" }]
      },
      {
        id: "tox-mod-6",
        title: "Module 6: Plant & Animal Poisons, Food Poisoning, Hair/Metabolites & Sec. 329 BNSS",
        lessons: [{ id: "m6-s1", title: "Self-Paced Research, Quiz (≥90%) & Case Assignment", duration: "9 Hours", videoUrl: "" }]
      }
    ]
  }
];

