import { QuizQuestion } from '@/types/quiz';
import {
  SUZUKI_CLASSIFICATION_DIAGRAM,
  QUADRANT_MAPPING_DIAGRAM,
  MARTIN_SANTOS_DIAGRAM,
  CRIME_SCENE_IMPRESSIONS_DIAGRAM,
  LYSOCHROME_REACTION_DIAGRAM,
  TLC_CHROMATOGRAPHY_DIAGRAM,
  TWINS_COMPARISON_DIAGRAM,
  VERMILION_HISTOLOGY_DIAGRAM,
  MAGNETIC_LIFTING_DIAGRAM,
  RENAUD_CLASSIFICATION_DIAGRAM
} from './cheiloscopyDiagrams';

export const CHEILOSCOPY_QUESTIONS: QuizQuestion[] = [
  {
    id: 'ch-q1',
    question: 'The term "Cheiloscopy" originates from which Greek root words, and what is its precise forensic scientific definition?',
    options: [
      '"Chir" (hand) and "skopein" (to view); the comparative measurement of palmar flexion creases for personal identification',
      '"Cheilos" (lip) and "skopein" (to observe/examine); the forensic study and examination of lip prints and mucosal furrows for personal identification',
      '"Chelo" (claw/margin) and "scopia" (description); the morphological recording of fingernail and toenail striations',
      '"Chilos" (juice/chyle) and "skopein" (to inspect); the microscopic analysis of salivary and serological fluids'
    ],
    correctAnswerIndex: 1,
    explanation: 'Cheiloscopy is derived from the Greek "cheilos" (lip) and "skopein" (to observe, see, or examine). In forensic odontostomatology, it is defined as the forensic investigation and individualizing examination of the mucosal wrinkles and groove patterns (sulci labiorum rubrorum) on the human vermilion zone.',
    points: 10
  },
  {
    id: 'ch-q2',
    question: 'Who was the first researcher to document the system of furrows on the red mucosal part of human lips as a biological phenomenon in 1902?',
    options: [
      'Dr. Edmond Locard',
      'Dr. Le Moyne Snyder',
      'Dr. R. Fischer',
      'Dr. Yasuo Tsuchihashi'
    ],
    correctAnswerIndex: 2,
    explanation: 'In 1902, the anthropologist Dr. R. Fischer first described the furrow system on the red mucous part of human lips (sulci labiorum) as an anatomical and biological characteristic.',
    points: 10
  },
  {
    id: 'ch-q3',
    question: 'In 1932, which prominent forensic scientist and criminologist formally recommended the practical use of lip prints in criminal identification?',
    options: [
      'Dr. Edmond Locard',
      'Sir Francis Galton',
      'Alphonse Bertillon',
      'Dr. Juan Vucetich'
    ],
    correctAnswerIndex: 0,
    explanation: 'Dr. Edmond Locard, director of the Institute of Criminalistics at Lyon and originator of Locard\'s Exchange Principle, formally recommended in 1932 that lip prints be utilized as physical evidence in criminal investigation and personal identification.',
    points: 10
  },
  {
    id: 'ch-q4',
    question: 'In his landmark 1950 forensic text "Homicide Investigation", which author demonstrated that lip impressions on drinking glasses and paper napkins possess significant criminal evidentiary value?',
    options: [
      'Dr. Paul L. Kirk',
      'Dr. Henry Faulds',
      'Dr. Alec Jeffreys',
      'Dr. Le Moyne Snyder'
    ],
    correctAnswerIndex: 3,
    explanation: 'Dr. Le Moyne Snyder, in his 1950 text "Homicide Investigation", highlighted practical criminal cases where lipstick impressions and latent lip prints on drinking glasses, cigarette butts, and napkins provided physical links to individuals present at crime scenes.',
    points: 10
  },
  {
    id: 'ch-q5',
    question: 'Refer to the classification diagram below. Dr. Martins Santos (1960) divided lip print patterns into which two primary taxonomic categories?',
    options: [
      'Vertical Axial Grooves (Class I) and Horizontal Transverse Grooves (Class II)',
      'Simple Grooves (R-1, C-2, A-3, S-4) and Compound Grooves (B-5, T-6, An-7)',
      'Continuous Linear Grooves (Type A) and Reticular Lattice Grooves (Type B)',
      'Primary Furrow Systems (Major) and Secondary Rugae (Minor)'
    ],
    correctAnswerIndex: 1,
    explanation: 'Dr. Martins Santos (1960) proposed a classification system dividing lip furrows into Simple grooves (formed by a single structural element: straight line R-1, curved C-2, angular A-3, sinusoidal S-4) and Compound grooves (formed by combined elements: bifurcated B-5, trifurcated T-6, anomalous An-7).',
    points: 10,
    image: MARTIN_SANTOS_DIAGRAM,
    imageCaption: 'Dr. Martins Santos (1960) Simple vs. Compound Classification Scheme'
  },
  {
    id: 'ch-q6',
    question: 'Between 1970 and 1974, which Japanese forensic researchers conducted extensive studies at Keio University and Tokyo Dental College that established the widely referenced 6-type classification of lip prints?',
    options: [
      'Dr. Y. Kurosawa and Dr. H. Takayama',
      'Dr. P. Renaud and Dr. M. Santos',
      'Dr. Kazuo Suzuki and Dr. Yasuo Tsuchihashi',
      'Dr. K. Kasprzak and Dr. S. Afchar-Bayat'
    ],
    correctAnswerIndex: 2,
    explanation: 'Dr. Kazuo Suzuki and Dr. Yasuo Tsuchihashi conducted extensive forensic examinations of Japanese cohorts, publishing foundational papers (1970–1974) that established the widely referenced 6-type classification (Types I, I\', II, III, IV, and V).',
    points: 10
  },
  {
    id: 'ch-q7',
    question: 'According to Suzuki and Tsuchihashi\'s classification, how is a Type I lip print pattern characterized?',
    options: [
      'Clear-cut, complete vertical grooves that run across the entire vertical height of the vermilion zone',
      'Incomplete vertical grooves running along only a portion of the lip height',
      'Branched or bifurcated grooves forming Y-shaped divisions',
      'Horizontal grooves that run parallel to the commissural line'
    ],
    correctAnswerIndex: 0,
    explanation: 'Type I in the Suzuki & Tsuchihashi classification consists of clear-cut, complete vertical grooves traversing the entire vertical dimension of the vermilion zone from border to border.',
    points: 10,
    image: SUZUKI_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Suzuki & Tsuchihashi Classification Scheme (Types I through V)'
  },
  {
    id: 'ch-q8',
    question: 'How is Type I\' (Type I Prime) differentiated from Type I in the Suzuki and Tsuchihashi system?',
    options: [
      'Type I\' features vertical grooves that bifurcate at both terminal ends',
      'Type I\' features horizontal transverse grooves running across the oral commissure',
      'Type I\' is defined by intersecting cross-shaped junctions',
      'Type I\' features incomplete vertical grooves traversing only a partial length of the lip height'
    ],
    correctAnswerIndex: 3,
    explanation: 'Type I\' (Type I prime) represents incomplete straight vertical grooves that terminate before traversing the entire vertical height of the vermilion zone.',
    points: 10,
    image: SUZUKI_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Groove morphology comparison: Type I complete vs. Type I\' incomplete vertical lines'
  },
  {
    id: 'ch-q9',
    question: 'Which pattern type in the Suzuki and Tsuchihashi system designates branched or bifurcated (Y-shaped) grooves?',
    options: [
      'Type I\'',
      'Type IV',
      'Type II',
      'Type III'
    ],
    correctAnswerIndex: 2,
    explanation: 'Type II patterns are defined by branched or bifurcated grooves, where a main furrow splits into two diverging arms forming a Y-shape.',
    points: 10,
    image: SUZUKI_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Suzuki & Tsuchihashi Type II: Bifurcated / branched groove architecture'
  },
  {
    id: 'ch-q10',
    question: 'In Suzuki & Tsuchihashi\'s classification, what morphological feature defines a Type III pattern?',
    options: [
      'Complete vertical furrows spanning the entire labial height',
      'Intersecting grooves that cross one another to form an "X" shape',
      'A dense reticular network forming a lattice grid',
      'Amorphous, irregular grooves that cannot be categorized'
    ],
    correctAnswerIndex: 1,
    explanation: 'Type III grooves are intersecting patterns where furrows cross over each other obliquely or perpendicularly, creating distinct crisscross or "X" junctions.',
    points: 10,
    image: SUZUKI_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Suzuki & Tsuchihashi Type III: Intersecting / crisscross (X-shaped) grooves'
  },
  {
    id: 'ch-q11',
    question: 'A lip print displaying a reticular, grid-like, or net-like arrangement of intersecting grooves is classified under Suzuki & Tsuchihashi as:',
    options: [
      'Type I',
      'Type II',
      'Type III',
      'Type IV'
    ],
    correctAnswerIndex: 3,
    explanation: 'Type IV comprises reticular grooves, where multiple intersecting vertical, horizontal, and oblique furrows produce a fine net-like, lattice, or grid arrangement.',
    points: 10,
    image: SUZUKI_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Suzuki & Tsuchihashi Type IV: Reticular / mesh-like groove network'
  },
  {
    id: 'ch-q12',
    question: 'What pattern is designated as Type V in Suzuki & Tsuchihashi\'s classification?',
    options: [
      'Undetermined, irregular, or mixed patterns that do not fit into Types I through IV',
      'Completely smooth mucosal zones with total absence of visible furrows',
      'Concentric circular or elliptical loop patterns around the labial tubercle',
      'Purely horizontal transverse linear grooves'
    ],
    correctAnswerIndex: 0,
    explanation: 'Type V encompasses undetermined, irregular, or polymorphic patterns that cannot be readily classified into Types I, I\', II, III, or IV.',
    points: 10,
    image: SUZUKI_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Suzuki & Tsuchihashi Type V: Irregular and undetermined morphological patterns'
  },
  {
    id: 'ch-q13',
    question: 'In Suzuki & Tsuchihashi\'s topographical recording protocol, how is a complete lip print divided for systematic forensic examination?',
    options: [
      'Into 2 longitudinal zones: Labial Mucosa and Labial Submucosa',
      'Into 6 vertical sextants numbered sequentially 1 through 6 from right to left',
      'Into 4 anatomical quadrants: Upper Right (UR), Upper Left (UL), Lower Left (LL), and Lower Right (LR)',
      'Into 3 concentric radial tiers originating from the oral aperture'
    ],
    correctAnswerIndex: 2,
    explanation: 'For recording and identification, Suzuki & Tsuchihashi divided the lips into four anatomical quadrants using a vertical midline (passing through the labial tubercle/philtrum) and a horizontal commissural line: Upper Right (UR), Upper Left (UL), Lower Left (LL), and Lower Right (LR).',
    points: 10,
    image: QUADRANT_MAPPING_DIAGRAM,
    imageCaption: 'Topographical 4-Quadrant Division System for Forensic Cheiloscopic Documentation'
  },
  {
    id: 'ch-q14',
    question: 'Examine the histological cross-section below. Which structural characteristics accurately describe the vermilion zone of human lips?',
    options: [
      'Thick fully keratinized stratum corneum with dense hair follicles, sebaceous units, and apocrine sweat glands',
      'Thin, lightly keratinized or non-keratinized mucosal epithelium containing eleidin, vascular dermal papillae, absence of sweat glands and hair follicles, with ectopic Fordyce sebaceous glands present in a subset of individuals',
      'Stratified columnar ciliated epithelium containing universal submucosal eccrine sweat glands',
      'Acellular collagenous membrane devoid of cellular nuclei, vascular papillae, or glandular structures'
    ],
    correctAnswerIndex: 1,
    explanation: 'The vermilion zone is a mucocutaneous transition zone featuring thin, lightly keratinized or non-keratinized epithelium containing eleidin (a semi-fluid intracellular intermediate protein), tall dermal papillae with rich capillary loops (giving the reddish color), and an absence of hair follicles and sweat glands. Fordyce spots (ectopic sebaceous glands) occur in some individuals but are not a universal anatomical structure.',
    points: 10,
    image: VERMILION_HISTOLOGY_DIAGRAM,
    imageCaption: 'Histological structure of the vermilion zone and mucocutaneous transition'
  },
  {
    id: 'ch-q15',
    question: 'What is the primary natural composition of a latent lip print deposited by unadorned, bare lips on a non-porous substrate?',
    options: [
      'Pure sodium chloride and urea crystals derived from mucosal eccrine sweat glands',
      'Exclusively synthetic waxes and cosmetic pigment lakes',
      'Precipitated salivary calcium phosphate salts devoid of organic constituents',
      'Salivary moisture, proteins (including amylase and mucins), and exfoliated epithelial cells, mixed with trace transferred facial lipids and occasional secretions from ectopic sebaceous glands when present'
    ],
    correctAnswerIndex: 3,
    explanation: 'Bare-lip latent deposits are primarily composed of saliva (water, salivary proteins such as amylase and mucins, electrolytes, and shed squamous epithelial cells) combined with trace surface lipids transferred from adjacent facial skin or hands, and occasionally sebaceous secretions from ectopic Fordyce glands in individuals who possess them.',
    points: 10
  },
  {
    id: 'ch-q16',
    question: 'Refer to the crime scene impression diagram. A lip print indented into a soft block of cheese, butter, or chocolate at a crime scene is classified as:',
    options: [
      'A Plastic (3-Dimensional) Impression',
      'A Patent (Visible) Impression',
      'A Latent (Invisible) Impression',
      'An Etched Chemical Residue'
    ],
    correctAnswerIndex: 0,
    explanation: 'Plastic impressions are true three-dimensional negative indentations formed when lips press into soft, yielding, deformable materials such as butter, cheese, chocolate, candles, or soap.',
    points: 10,
    image: CRIME_SCENE_IMPRESSIONS_DIAGRAM,
    imageCaption: 'Forensic Comparison of Patent, Latent, and Plastic Lip Impressions'
  },
  {
    id: 'ch-q17',
    question: 'Why are lysochrome dyes such as Sudan Black B, Sudan III, and Oil Red O effective for developing latent lip prints on non-porous surfaces?',
    options: [
      'They react specifically with amino acids through a ninhydrin-like transamination reaction to form Ruhemann\'s purple',
      'They form covalent crosslinks with the DNA phosphate backbone, inducing visible phosphorescence',
      'They are lipophilic (fat-soluble) dyes that selectively dissolve in and partition into the lipid and wax matrix of the residue',
      'They catalyze an acidic oxidation-reduction reaction that precipitates metallic silver particles'
    ],
    correctAnswerIndex: 2,
    explanation: 'Lysochromes are fat-soluble (lipophilic) dyes that partition preferentially into the hydrophobic lipid, sebum, and wax matrix of latent lip residue, producing high visual contrast (e.g., deep blue-black with Sudan Black B) without chemically altering cellular components.',
    points: 10,
    image: LYSOCHROME_REACTION_DIAGRAM,
    imageCaption: 'Selective lipophilic solvation mechanism of Sudan dyes on latent lip residues'
  },
  {
    id: 'ch-q18',
    question: 'When developing latent lip prints on smooth non-porous glassware, why is magnetic flake powder applied with a magnetic wand often preferred over conventional camel-hair brushes?',
    options: [
      'Magnetic powder chemically dissolves the glass surface to fix the impression permanently',
      'The magnetic wand forms a soft, flexible cluster of powder that minimizes physical bristle friction against delicate furrow residues',
      'Magnetic powder induces immediate intrinsic luminescence without any excitation light source',
      'Conventional brushes destroy salivary DNA whereas magnetic wands amplify PCR products'
    ],
    correctAnswerIndex: 1,
    explanation: 'Conventional brush bristles can wipe away, smear, or scratch the delicate, soft lipid and salivary residue of latent lip prints. A magnetic applicator holds the powder in a soft magnetic cluster that gently contacts the substrate without abrasive bristle drag.',
    points: 10,
    image: MAGNETIC_LIFTING_DIAGRAM,
    imageCaption: 'Magnetic wand application and tape lifting protocol for non-porous substrates'
  },
  {
    id: 'ch-q19',
    question: 'Which fluorescent dye, excited under an Alternate Light Source (ALS) at 450–530 nm with barrier filters, is documented in forensic literature for enhancing latent lip prints on dark or multicolored patterned surfaces?',
    options: [
      'Amido Black 10B',
      'Luminol',
      'Silver Nitrate',
      'Nile Red'
    ],
    correctAnswerIndex: 3,
    explanation: 'Nile Red is an intensely fluorescent lipophilic lysochrome dye that dissolves in neutral lipids and waxes. When illuminated under an alternate light source (450–530 nm) and viewed through yellow/orange barrier filters, it fluoresces strongly, enhancing contrast on visually complex or dark backgrounds.',
    points: 10
  },
  {
    id: 'ch-q20',
    question: 'Refer to the Thin-Layer Chromatography (TLC) diagram. If a questioned lipstick dye spot travels 115 mm from the origin while the solvent front travels 240 mm, what is its Retention Factor (Rf)?',
    options: [
      'Rf = 0.48',
      'Rf = 2.09',
      'Rf = 0.77',
      'Rf = 0.21'
    ],
    correctAnswerIndex: 0,
    explanation: 'The Retention Factor formula is Rf = Distance traveled by solute / Distance traveled by solvent front. Here, Rf = 115 mm / 240 mm = 0.479 (approximately 0.48).',
    points: 10,
    image: TLC_CHROMATOGRAPHY_DIAGRAM,
    imageCaption: 'Thin-Layer Chromatography (TLC) separation plate showing migration distances from origin'
  },
  {
    id: 'ch-q21',
    question: 'Which analytical techniques are used in forensic laboratories to identify organic pigments, dyes, and natural or synthetic wax binders in lipstick smears non-destructively?',
    options: [
      'Gas Chromatography with Flame Ionization Detection (GC-FID) following total acid digestion',
      'Agarose Gel Electrophoresis under alkaline pH conditions',
      'Attenuated Total Reflectance Fourier-Transform Infrared (ATR-FTIR) and Raman Spectroscopy',
      'Inductively Coupled Plasma Mass Spectrometry (ICP-MS) after high-temperature ashing'
    ],
    correctAnswerIndex: 2,
    explanation: 'ATR-FTIR and Raman spectroscopy provide non-destructive vibrational spectra that characterize cosmetic binders, natural waxes (e.g., beeswax, carnauba wax), synthetic waxes (e.g., paraffin, microcrystalline wax), and organic/inorganic pigments directly from minute smears.',
    points: 10
  },
  {
    id: 'ch-q22',
    question: 'Beyond groove morphology and chemical lipstick analysis, what biological evidence can frequently be recovered from lip contact impressions on drinking glasses or cigarette butts?',
    options: [
      'Vitreous humor fluid for post-mortem potassium calculation',
      'Nuclear DNA from shed labial mucosal epithelial cells for STR profiling',
      'Dermal elastin fibers for radiocarbon dating',
      'Hematopoietic stem cells for blood type determination'
    ],
    correctAnswerIndex: 1,
    explanation: 'When lips make contact with a substrate, thousands of nucleated squamous epithelial cells from the oral mucosa and vermilion zone are transferred, enabling forensic biologists to extract nuclear DNA for Short Tandem Repeat (STR) profiling.',
    points: 10
  },
  {
    id: 'ch-q23',
    question: 'In the forensic serological examination of suspected saliva in a lip print impression, how do the Phadebas test and the RSID-Saliva test differ in their analytical principles?',
    options: [
      'Phadebas is an STR DNA quantification assay, while RSID-Saliva is a presumptive color test for blood hemoglobin',
      'Phadebas tests for acid phosphatase activity, while RSID-Saliva tests for salivary amylase mRNA transcripts',
      'Both tests are interchangeable confirmatory assays that exclusively detect buccal epithelial cell nuclei',
      'Phadebas is a presumptive test measuring amylase enzymatic activity on starch, while RSID-Saliva is an immunochromatographic assay targeting human salivary alpha-amylase antigen'
    ],
    correctAnswerIndex: 3,
    explanation: 'Phadebas is a presumptive assay that detects alpha-amylase enzymatic activity (which is also present in other bodily fluids and non-human sources), whereas RSID-Saliva is an immunochromatographic membrane test utilizing specific monoclonal antibodies targeting human salivary alpha-amylase antigen.',
    points: 10
  },
  {
    id: 'ch-q24',
    question: 'Refer to the twin comparison diagram below. In his landmark 1974 investigation of 49 pairs of monozygotic (identical) twins, what primary finding did Dr. Yasuo Tsuchihashi report regarding cheiloscopic patterns?',
    options: [
      'Monozygotic twins exhibited similarities in overall pattern tendencies but demonstrated distinct differences in fine groove details and branch locations within the studied cohort',
      'All 49 pairs of identical twins displayed 100% identical lip print morphology across every quadrant',
      'Identical twins showed perfect mirror-image symmetry with identical minutiae coordinates',
      'Lip print patterns in monozygotic twins showed zero familial or hereditary correlation'
    ],
    correctAnswerIndex: 0,
    explanation: 'In his 1974 study of 49 pairs of monozygotic twins, Tsuchihashi observed that while twins frequently shared general pattern classifications, specific groove details, branching levels, and intersections varied between co-twins. While demonstrating individual variation within the cohort, researchers note that empirical validation across diverse populations remains necessary.',
    points: 10,
    image: TWINS_COMPARISON_DIAGRAM,
    imageCaption: 'Comparative quadrant detail showing morphological variations in monozygotic twin pairs'
  },
  {
    id: 'ch-q25',
    question: 'How do lip furrow patterns typically respond over time following superficial epithelial injuries such as minor chapping, abrasions, or mild herpes simplex lesions?',
    options: [
      'The furrow pattern is permanently erased and replaced by a completely smooth mucosal surface',
      'The groove pattern undergoes spontaneous random reorganization into a totally different classification type',
      'The mucosal furrow pattern generally recovers its original appearance once superficial epithelium regenerates, though deep dermal scarring or pathology can alter morphology',
      'The number of vertical furrows permanently doubles after any superficial epithelial injury'
    ],
    correctAnswerIndex: 2,
    explanation: 'Following superficial mucosal trauma (such as mild chapping, sunburn, or minor herpes labialis), lip furrow patterns generally re-emerge after epithelial healing. However, forensic researchers emphasize that deep lacerations, severe dermal scarring, surgical trauma, pathology, or degenerative changes can alter or obscure furrows, warranting cautious case-by-case evaluation.',
    points: 10
  },
  {
    id: 'ch-q26',
    question: 'Refer to the Renaud classification diagram. In Renaud\'s (1973) 10-type system (Types A through J), which morphological pattern corresponds to Type C?',
    options: [
      'Complete vertical straight grooves',
      'Complete bifurcated (forked) grooves',
      'Incomplete cross-shaped grooves',
      'Reticular grid-like grooves'
    ],
    correctAnswerIndex: 1,
    explanation: 'In Renaud\'s (1973) classification, Type C corresponds to complete bifurcated grooves, whereas Type A is complete vertical, Type B is incomplete vertical, Type D is incomplete bifurcated, and Type E is complete cross.',
    points: 10,
    image: RENAUD_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Renaud (1973) 10-Type Classification Scheme (Types A through J)'
  },
  {
    id: 'ch-q27',
    question: 'In the cheiloscopy classification scheme established by Dr. S. Afchar-Bayat (1979), how are lip furrow patterns categorized?',
    options: [
      'Into four binary quadrants (Q1 through Q4) with Galton minutiae count notation',
      'Into two categories: Non-keratinized furrows vs. Keratinized ridges',
      'Into ten numerical scores (1 through 10) based solely on the thickness of the labial tubercle',
      'Into specific morphological classes: A1 (complete vertical), A2 (incomplete vertical), B1 (straight branched), B2 (angled branched), C (converging), D (reticular), and E (other/ill-defined)'
    ],
    correctAnswerIndex: 3,
    explanation: 'The Afchar-Bayat (1979) classification divides groove patterns into six primary categories with subcategories: A1 (complete vertical), A2 (incomplete vertical), B1 (straight branched), B2 (angled branched), C (converging), D (reticular), and E (other/ill-defined).',
    points: 10
  },
  {
    id: 'ch-q28',
    question: 'In forensic sex determination studies based on cheiloscopy, which general statistical trend has been reported in literature, while noting significant individual and population overlap?',
    options: [
      'Types I and I\' (vertical patterns) show higher statistical prevalence in female cohorts, while Types III and IV (intersecting and reticular patterns) occur more frequently in male cohorts',
      'Females exhibit exclusively Type IV patterns, while males exhibit exclusively Type I patterns',
      'Bifurcated grooves (Type II) are biologically restricted to male individuals only',
      'Cheiloscopic patterns show complete mathematical parity with zero statistical differentiation across sexes'
    ],
    correctAnswerIndex: 0,
    explanation: 'Numerous forensic anthropological studies (e.g., Vahanwala, Suzuki, Sivapathasundharam) report statistical tendencies where Type I/I\' patterns predominate in females and Types III/IV patterns appear more frequently in males. However, because substantial overlap exists, sex determination from lip prints is considered presumptive rather than definitive.',
    points: 10
  },
  {
    id: 'ch-q29',
    question: 'When attempting post-mortem cheiloscopy on a deceased individual, what physical change in the vermilion zone poses the most significant challenge to obtaining an accurate print?',
    options: [
      'Immediate chemical dissolution of mucosal collagen within 10 minutes of death',
      'Spontaneous conversion of all vertical grooves into concentric circles',
      'Post-mortem desiccation, shrinkage, and loss of tissue turgor, which may require rehydration before recording impressions',
      'Rapid calcification of labial epithelial cells preventing powder adhesion'
    ],
    correctAnswerIndex: 2,
    explanation: 'Post-mortem drying (desiccation) and loss of mucosal moisture cause the vermilion tissue to shrink and distort natural sulci labiorum. Forensic practitioners often apply moist compresses or rehydrating solutions (such as formalin-glycerol mixtures) to restore tissue turgor prior to post-mortem printing or casting.',
    points: 10
  },
  {
    id: 'ch-q30',
    question: 'In the landmark Illinois case People v. Davis (1999) and subsequent 2007 post-conviction proceedings, what key legal and scientific considerations emerged regarding the courtroom admissibility of lip-print testimony?',
    options: [
      'Lip print evidence was declared an infallible absolute biometric under the Daubert standard and exempted from expert witness qualification',
      'The 1999 appellate court initially upheld admission under the Frye general acceptance standard, but subsequent legal proceedings highlighted vulnerabilities including the need for standardized methodologies, blind proficiency testing, and empirical error-rate data',
      'The court ruled that lip prints can only be introduced if accompanied by automated AFIS database matches',
      'Lip print evidence was ruled unconstitutional under all circumstances in United States jurisprudence'
    ],
    correctAnswerIndex: 1,
    explanation: 'In People v. Davis (1999), an Illinois appellate court affirmed the admission of lip print evidence under the Frye standard. However, in subsequent 2007 post-conviction proceedings, the reliability of the testimony faced substantial challenge regarding the lack of blind proficiency testing, standardized minimum minutiae thresholds, and comprehensive validation studies—demonstrating that cheiloscopy requires rigorous scientific scrutiny rather than blanket validation.',
    points: 10
  }
];
