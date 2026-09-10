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
      '"Cheilos" (lip) and "skopein" (to examine/see); the forensic study of lip prints and sulci labiorum for personal identification',
      '"Cheilos" (skin) and "scopia" (drawing); the forensic recording of friction skin ridges',
      '"Chir" (hand) and "scopia" (examination); the study of palm crease patterns and flexion creases',
      '"Chelo" (claw) and "skopein" (to measure); the comparative measurement of toolmark impressions'
    ],
    correctAnswerIndex: 0,
    explanation: 'Cheiloscopy is derived from the Greek "cheilos" (lip) and "skopein" (to see, view, or examine). Forensically, it is defined as the identification technique based on the characteristic arrangement and wrinkles of the mucosal furrows on human lips (sulci labiorum rubrorum).',
    points: 10
  },
  {
    id: 'ch-q2',
    question: 'Who was the first researcher to document the system of furrows on the red part of human lips as a biological phenomenon in 1902?',
    options: [
      'Dr. R. Fischer',
      'Dr. Edmond Locard',
      'Dr. Le Moyne Snyder',
      'Dr. Yasuo Tsuchihashi'
    ],
    correctAnswerIndex: 0,
    explanation: 'In 1902, the anthropologist Dr. R. Fischer was the first to describe the biological phenomenon of furrow systems (sulci labiorum) on the red mucous part of human lips.',
    points: 10
  },
  {
    id: 'ch-q3',
    question: 'In 1932, which prominent forensic scientist and criminologist formally recommended the practical use of lip prints in criminal identification?',
    options: [
      'Dr. Edmond Locard',
      'Sir Francis Galton',
      'Alphonse Bertillon',
      'Karl Landsteiner'
    ],
    correctAnswerIndex: 0,
    explanation: 'Dr. Edmond Locard, renowned for Locard\'s Exchange Principle and director of the Institute of Criminalistics at Lyon, formally recommended the use of lip prints in criminology and personal identification in 1932.',
    points: 10
  },
  {
    id: 'ch-q4',
    question: 'In his landmark 1950 forensic textbook "Homicide Investigation", which author demonstrated that lip prints on drinking glasses and paper napkins possess significant criminal evidentiary value?',
    options: [
      'Dr. Le Moyne Snyder',
      'Dr. Alec Jeffreys',
      'Dr. Henry Faulds',
      'Dr. Calvin Goddard'
    ],
    correctAnswerIndex: 0,
    explanation: 'Dr. Le Moyne Snyder, in his classic 1950 forensic textbook "Homicide Investigation", highlighted how lipstick impressions and lip prints deposited on drinking glasses, coffee cups, and napkins could link suspects to crime scenes.',
    points: 10
  },
  {
    id: 'ch-q5',
    question: 'Refer to the classification diagram below. Dr. Martins Santos (1960) divided lip print patterns into which two primary taxonomic categories?',
    options: [
      'Simple Grooves (R-1, C-2, A-3, S-4) and Compound Grooves (B-5, T-6, An-7)',
      'Vertical Grooves (Type A) and Horizontal Grooves (Type B)',
      'Primary Patterns and Secondary Minutiae',
      'Continuous Linear Grooves and Reticular Meshes'
    ],
    correctAnswerIndex: 0,
    explanation: 'Dr. Martins Santos (1960) proposed a classification system dividing lip furrows into Simple grooves (formed by a single element: straight line R-1, curved C-2, angular A-3, sinusoidal S-4) and Compound grooves (formed by combined elements: bifurcated B-5, trifurcated T-6, anomalous An-7).',
    points: 10,
    image: MARTIN_SANTOS_DIAGRAM,
    imageCaption: 'Taxonomic breakdown of Dr. Martins Santos (1960) Simple vs. Compound Classification'
  },
  {
    id: 'ch-q6',
    question: 'Between 1970 and 1971, which Japanese forensic odontologists conducted foundational research at Keio University and Tokyo Dental College that established the globally adopted 6-type classification of lip prints?',
    options: [
      'Dr. Kazuo Suzuki and Dr. Yasuo Tsuchihashi',
      'Dr. Y. Kurosawa and Dr. H. Takayama',
      'Dr. M. Santos and Dr. P. Renaud',
      'Dr. K. Kasprzak and Dr. S. Afchar-Bayat'
    ],
    correctAnswerIndex: 0,
    explanation: 'Dr. Kazuo Suzuki and Dr. Yasuo Tsuchihashi conducted extensive forensic examinations of thousands of Japanese subjects and twin pairs between 1970 and 1971, establishing the permanence and uniqueness of lip prints and formulating the classic Suzuki & Tsuchihashi classification.',
    points: 10
  },
  {
    id: 'ch-q7',
    question: 'According to Suzuki and Tsuchihashi\'s classification, how is a Type I lip print pattern characterized?',
    options: [
      'Clear-cut, complete vertical grooves that run across the entire height of the vermilion zone',
      'Incomplete straight grooves that cover only part of the vertical lip height',
      'Branched or bifurcated grooves forming Y-shaped structures',
      'Intersecting grooves that crisscross forming X-shaped junctions'
    ],
    correctAnswerIndex: 0,
    explanation: 'Type I in the Suzuki & Tsuchihashi classification represents clear-cut, complete vertical grooves traversing the entire vertical dimension of the lip from the mucocutaneous border to the inner mucosal edge.',
    points: 10,
    image: SUZUKI_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Suzuki & Tsuchihashi Classification Scheme (Types I to V)'
  },
  {
    id: 'ch-q8',
    question: 'How is Type I\' (Type I Prime) distinguished from Type I in the Suzuki and Tsuchihashi system?',
    options: [
      'Type I\' features incomplete vertical grooves running along only a portion of the lip height without extending fully across',
      'Type I\' features horizontal parallel grooves rather than vertical grooves',
      'Type I\' features vertical grooves that end in a small circle or dot',
      'Type I\' is exclusively present on the lower lip while Type I is on the upper lip'
    ],
    correctAnswerIndex: 0,
    explanation: 'Type I\' (Type 1 prime) consists of straight vertical grooves that are incomplete or partial, disappearing before traversing the entire height of the vermilion border.',
    points: 10,
    image: SUZUKI_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Morphological comparison of Type I vs. Type I\' vertical groove lengths'
  },
  {
    id: 'ch-q9',
    question: 'Which pattern type in the Suzuki and Tsuchihashi system corresponds to branched or bifurcated (forked / Y-shaped) grooves?',
    options: [
      'Type II',
      'Type III',
      'Type I\'',
      'Type IV'
    ],
    correctAnswerIndex: 0,
    explanation: 'Type II patterns are defined by branched or bifurcated grooves, where a main furrow bifurcates into two diverging arms resembling a "Y".',
    points: 10,
    image: SUZUKI_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Suzuki & Tsuchihashi Type II: Bifurcated / branched furrow architecture'
  },
  {
    id: 'ch-q10',
    question: 'In Suzuki & Tsuchihashi\'s classification, what defines a Type III pattern?',
    options: [
      'Intersecting grooves that cross one another to form an "X" shape',
      'Reticular net-like or grid grooves',
      'Straight vertical grooves traversing the whole lip',
      'Undetermined irregular grooves with chaotic morphology'
    ],
    correctAnswerIndex: 0,
    explanation: 'Type III grooves are intersecting patterns where furrows cross over each other at an angle, creating distinctive crisscross or "X" junctions.',
    points: 10,
    image: SUZUKI_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Suzuki & Tsuchihashi Type III: Intersecting / crisscross (X-shaped) furrows'
  },
  {
    id: 'ch-q11',
    question: 'A lip print showing a reticular, grid-like, or net-like arrangement of intersecting grooves is classified under Suzuki & Tsuchihashi as:',
    options: [
      'Type IV',
      'Type II',
      'Type I',
      'Type V'
    ],
    correctAnswerIndex: 0,
    explanation: 'Type IV comprises reticular grooves, where multiple intersecting vertical and horizontal/oblique furrows produce a fine net-like, lattice, or grid arrangement.',
    points: 10,
    image: SUZUKI_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Suzuki & Tsuchihashi Type IV: Reticular / mesh-like groove network'
  },
  {
    id: 'ch-q12',
    question: 'What pattern is designated as Type V in Suzuki & Tsuchihashi\'s classification?',
    options: [
      'Undetermined, irregular, or polymorphic patterns that do not fit into Types I through IV',
      'Purely horizontal linear furrows',
      'Completely smooth lips without any visible furrows',
      'Grooves with multiple concentric circles'
    ],
    correctAnswerIndex: 0,
    explanation: 'Type V encompasses undetermined, irregular, or mixed patterns that cannot be readily classified into Types I, I\', II, III, or IV.',
    points: 10,
    image: SUZUKI_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Suzuki & Tsuchihashi Type V: Irregular and undetermined morphological patterns'
  },
  {
    id: 'ch-q13',
    question: 'In Suzuki & Tsuchihashi\'s topographical recording protocol, how is a complete lip print divided for systematic forensic examination?',
    options: [
      'Into 4 anatomical quadrants: Upper Right (UR), Upper Left (UL), Lower Left (LL), and Lower Right (LR)',
      'Into 2 longitudinal halves: Anterior and Posterior zones',
      'Into 3 concentric radial zones radiating from the philtrum',
      'Into 6 vertical columns numbered 1 through 6 from left to right'
    ],
    correctAnswerIndex: 0,
    explanation: 'For recording and identification, Suzuki & Tsuchihashi divided the lips into four anatomical quadrants using a vertical midline (passing through the tubercle) and a horizontal commissural line: Upper Right (UR), Upper Left (UL), Lower Left (LL), and Lower Right (LR).',
    points: 10,
    image: QUADRANT_MAPPING_DIAGRAM,
    imageCaption: 'Topographical 4-Quadrant Division System for Forensic Cheiloscopic Documentation'
  },
  {
    id: 'ch-q14',
    question: 'Examine the histological cross-section below. Which structural features characterize the vermilion zone (red portion of human lips)?',
    options: [
      'Thin translucent stratum corneum (eleidin), rich capillary loops in dermal papillae, Fordyce sebaceous glands, and NO sweat glands or hair follicles',
      'Thick keratinized stratum corneum with dense hair follicles and numerous eccrine sweat glands',
      'Abundant apocrine sweat glands and a dense subcutaneous adipose layer without vascularization',
      'Absence of any dermal papillae or sebaceous units'
    ],
    correctAnswerIndex: 0,
    explanation: 'The vermilion zone is an anatomical transition zone featuring thin, translucent stratum corneum containing eleidin, deeply vascularized dermal capillary loops giving it a red appearance, isolated sebaceous glands (Fordyce granules), and a complete absence of sweat glands and hair follicles.',
    points: 10,
    image: VERMILION_HISTOLOGY_DIAGRAM,
    imageCaption: 'Histological structure of the vermilion border showing sulci labiorum and vascular papillae'
  },
  {
    id: 'ch-q15',
    question: 'What constitutes the natural chemical composition of a latent lip print deposited by bare, unadorned lips on a drinking glass?',
    options: [
      'Lipids and triglycerides from Fordyce sebaceous glands, combined with salivary moisture, amylase, and exfoliated mucosal cells',
      'Pure eccrine sweat rich in sodium chloride and urea without any lipid content',
      'Hemoglobin breakdown products and keratin fibers exclusively',
      'Mineral oil and synthetic colorant pigments identical to cosmetic formulations'
    ],
    correctAnswerIndex: 0,
    explanation: 'Even without cosmetics, bare lips deposit latent prints consisting of sebum (neutral fats, triglycerides, free fatty acids) secreted by labial Fordyce spots, mixed with saliva containing water, salivary amylase, proteins, and exfoliated epithelial cells.',
    points: 10
  },
  {
    id: 'ch-q16',
    question: 'Refer to the crime scene impression diagram. A lip print indented into a soft block of butter or chocolate bar at a burglary scene is classified as:',
    options: [
      'A Plastic (3-Dimensional) Impression',
      'A Patent (Visible) Impression',
      'A Latent (Invisible) Impression',
      'A Chemical Residue Smear'
    ],
    correctAnswerIndex: 0,
    explanation: 'Plastic impressions are true three-dimensional negative indentations formed when lips press into soft, yielding materials such as butter, cheese, chocolate, candles, or soap.',
    points: 10,
    image: CRIME_SCENE_IMPRESSIONS_DIAGRAM,
    imageCaption: 'Forensic Distinction between Patent, Latent, and Plastic Lip Impressions'
  },
  {
    id: 'ch-q17',
    question: 'Why are lysochrome dyes such as Sudan Black B, Sudan III, and Oil Red O exceptionally effective for developing latent lip prints on non-porous surfaces?',
    options: [
      'They are lipophilic dyes that selectively dissolve in and stain the fatty acids, waxes, and neutral lipids present in lip secretions and lipstick bases',
      'They react specifically with amino acids to produce a purple Ruhemann\'s complex',
      'They bind covalently to the DNA phosphate backbone causing intense luminescence',
      'They precipitate silver halide crystals upon exposure to UV light'
    ],
    correctAnswerIndex: 0,
    explanation: 'Lysochromes are fat-soluble (lipophilic) dyes that partition preferentially into the hydrophobic lipid, sebum, and wax matrix of latent lip residue, producing a high-contrast stain (e.g. deep blue-black with Sudan Black B) without altering biological cellular material.',
    points: 10,
    image: LYSOCHROME_REACTION_DIAGRAM,
    imageCaption: 'Solvation staining mechanism of Sudan Black B on latent lip print lipid residues'
  },
  {
    id: 'ch-q18',
    question: 'When developing latent lip prints on fragile or curved glassware with fingerprint powders, why is magnetic flake powder applied with a magnetic wand preferred over conventional camel-hair or marabou brushes?',
    options: [
      'The magnetic wand forms a soft ball of powder that prevents physical brush bristles from scratching or distorting delicate lip furrow details',
      'Magnetic powder undergoes an exothermic reaction that permanently fixes the lip print',
      'Magnetic powder creates a fluorescent glow detectable without any light source',
      'Brushes dissolve the wax content of lip residue while magnetic powder does not'
    ],
    correctAnswerIndex: 0,
    explanation: 'Conventional brush bristles can wipe away or scratch the soft, malleable lipid and salivary residue of latent lip prints. A magnetic applicator suspends the powder in a soft magnetic cluster that gently dusts the substrate without bristle friction.',
    points: 10,
    image: MAGNETIC_LIFTING_DIAGRAM,
    imageCaption: 'Magnetic wand application and tape lifting methodology for non-porous substrates'
  },
  {
    id: 'ch-q19',
    question: 'Which fluorescent reagent, excited under an Alternate Light Source (ALS) at 450–530 nm, is widely documented in forensic literature for developing latent lip prints on dark, multicolored, or patterned drinking cups?',
    options: [
      'Nile Red',
      'Luminol',
      'Ninhydrin',
      'Amido Black'
    ],
    correctAnswerIndex: 0,
    explanation: 'Nile Red is an intensely fluorescent lysochrome dye that dissolves in neutral lipids and waxes; under alternate light sources (450–530 nm) with an orange or yellow barrier filter, it fluoresces brilliantly, overcoming dark or busy backgrounds.',
    points: 10
  },
  {
    id: 'ch-q20',
    question: 'Refer to the Thin-Layer Chromatography (TLC) diagram. If a crime scene lipstick dye spot travels 115 mm from the origin while the solvent front travels 240 mm, what is the Retention Factor (Rf)?',
    options: [
      'Rf = 0.48',
      'Rf = 2.09',
      'Rf = 0.85',
      'Rf = 0.24'
    ],
    correctAnswerIndex: 0,
    explanation: 'The Retention Factor formula is Rf = Distance traveled by solute / Distance traveled by solvent front. Here, Rf = 115 mm / 240 mm = 0.479 (approx 0.48). This matches the suspect\'s spot Rf in the comparative chromatogram.',
    points: 10,
    image: TLC_CHROMATOGRAPHY_DIAGRAM,
    imageCaption: 'TLC Silica Plate Chromatogram showing dye band separation and Rf calculation'
  },
  {
    id: 'ch-q21',
    question: 'Which analytical instrumental techniques are utilized in forensic laboratories to identify organic polymers, waxes, and pigments in lipstick smears non-destructively?',
    options: [
      'Attenuated Total Reflectance Fourier-Transform Infrared (ATR-FTIR) and Raman Spectroscopy',
      'Polymerase Chain Reaction (PCR) and Capillary Electrophoresis',
      'Inductively Coupled Plasma Mass Spectrometry (ICP-MS) alone',
      'Kastle-Meyer and Benzidine color tests'
    ],
    correctAnswerIndex: 0,
    explanation: 'ATR-FTIR and Raman spectroscopy allow non-destructive vibrational analysis of cosmetic binders, synthetic waxes (carnauba, beeswax), and organic pigment lakes directly from minute crime scene smears.',
    points: 10
  },
  {
    id: 'ch-q22',
    question: 'Beyond groove pattern comparison, what critical biological evidence can often be extracted from lip prints deposited on glasses, envelopes, or cigarette butts?',
    options: [
      'Nuclear DNA from exfoliated labial mucosal epithelial cells for STR profiling',
      'Vitreous humor for post-mortem potassium estimation',
      'Bone marrow hematopoietic stem cells',
      'Dermal collagen fibers for amino acid racemization'
    ],
    correctAnswerIndex: 0,
    explanation: 'When lips make contact with a substrate, thousands of nucleated squamous epithelial cells from the oral mucosa and vermilion zone are transferred, enabling forensic scientists to recover nuclear DNA for Short Tandem Repeat (STR) profiling.',
    points: 10
  },
  {
    id: 'ch-q23',
    question: 'What enzyme test is typically used to confirm the presence of saliva in an evidentiary lip print impression?',
    options: [
      'Salivary Alpha-Amylase test (e.g. Phadebas reagent or RSID-Saliva)',
      'Acid Phosphatase (AP) test',
      'Kastle-Meyer phenolphthalein test',
      'Takayama pyridine chromogen test'
    ],
    correctAnswerIndex: 0,
    explanation: 'Saliva contains high concentrations of salivary alpha-amylase (ptyalin). Confirmatory or presumptive tests such as the Phadebas tablet test or RSID-Saliva immunochromatographic strip detect this enzyme in lip print swabs.',
    points: 10
  },
  {
    id: 'ch-q24',
    question: 'Refer to the monozygotic twin comparison diagram. What major conclusion did Suzuki & Tsuchihashi reach after examining 107 pairs of identical (monozygotic) twins?',
    options: [
      'Identical twins share similar general pattern trends but have distinct, individualized minutiae configurations, confirming lip print uniqueness',
      'Identical twins possess 100% identical lip prints that cannot be distinguished',
      'Monozygotic twins have completely mirror-image identical groove patterns in every quadrant',
      'Lip prints in identical twins are random and show zero familial or genetic resemblance'
    ],
    correctAnswerIndex: 0,
    explanation: 'Suzuki & Tsuchihashi\'s landmark investigation of 107 pairs of monozygotic twins proved that while hereditary factors influence general pattern class tendencies, the specific minutiae points (bifurcation levels, intersections, ending ridges) are completely unique to each individual twin.',
    points: 10,
    image: TWINS_COMPARISON_DIAGRAM,
    imageCaption: 'Minutiae divergence and branch point variation between Monozygotic Twin A and Twin B'
  },
  {
    id: 'ch-q25',
    question: 'How do lip prints respond over time to superficial trauma, herpes simplex cold sores, mild chemical burns, or seasonal chapping?',
    options: [
      'The original furrow pattern re-establishes itself completely once the superficial mucosal epithelium heals, demonstrating pattern permanence',
      'The lip furrows are permanently erased, leaving a completely smooth scar',
      'A completely new pattern belonging to a different classification type replaces the old one',
      'The lip prints permanently double their furrow density after healing'
    ],
    correctAnswerIndex: 0,
    explanation: 'Research demonstrates that sulci labiorum have remarkable permanence. Unless an injury penetrates deeply into the dermis causing fibrotic scar tissue, superficial epithelial lesions, chapping, or herpes simplex infections heal with complete restoration of the original groove pattern.',
    points: 10
  },
  {
    id: 'ch-q26',
    question: 'Refer to the Renaud classification diagram. In Renaud\'s (1973) 10-type system (Types A through J), which pattern corresponds to Type C?',
    options: [
      'Complete bifurcated (forked) grooves',
      'Complete vertical straight grooves',
      'Reticular grid-like grooves',
      'Horizontal linear grooves'
    ],
    correctAnswerIndex: 0,
    explanation: 'In Renaud\'s French classification (1973), Type C represents complete bifurcated grooves, while Type A is complete vertical, Type B is incomplete vertical, and Type D is incomplete bifurcated.',
    points: 10,
    image: RENAUD_CLASSIFICATION_DIAGRAM,
    imageCaption: 'Renaud 10-Type Classification Scheme (Types A through J)'
  },
  {
    id: 'ch-q27',
    question: 'In the cheiloscopy classification proposed by Afchar-Bayat (1979), patterns are categorized primarily based on:',
    options: [
      'Six categories (A to F) categorizing vertical, oblique, intersecting, and reticular groove orientations',
      'Twenty-three minutiae characteristics identical to Galton ridge points',
      'The exact volume of cosmetic pigment deposited per square millimeter',
      'The curvature of the dental dental arch'
    ],
    correctAnswerIndex: 0,
    explanation: 'Afchar-Bayat (1979) established a classification dividing lip grooves into six categories from A to F, evaluating vertical perpendicular grooves, oblique branched lines, intersecting lines, and reticulated networks.',
    points: 10
  },
  {
    id: 'ch-q28',
    question: 'In forensic sex determination studies based on cheiloscopy, which general statistical tendency is frequently observed, though subject to regional and individual overlap?',
    options: [
      'Type I and Type I\' (vertical patterns) show higher statistical prevalence in females, while Types III and IV (crisscross/reticular) are more frequent in males',
      'Females only exhibit Type IV and males only exhibit Type I',
      'Lip prints are completely incapable of providing any statistical gender correlation whatsoever',
      'Male lip prints lack bifurcated grooves entirely'
    ],
    correctAnswerIndex: 0,
    explanation: 'Numerous forensic studies (e.g. Vahanwala, Suzuki, Sivapathasundharam) have shown that Type I and I\' (vertical patterns) dominate in female lip quadrants, while intersecting (Type III) and reticular (Type IV) patterns appear with higher frequency in males, although whole-quadrant multi-pattern assessment is required.',
    points: 10
  },
  {
    id: 'ch-q29',
    question: 'When attempting post-mortem cheiloscopy on a deceased individual, what physical artifact or phenomenon poses the greatest obstacle to obtaining an accurate lip print?',
    options: [
      'Desiccation, shrinkage, and loss of mucosal moisture in the vermilion zone, which requires rehydration or humidification prior to casting',
      'Immediate chemical decomposition of eleidin within 5 minutes of death',
      'Spontaneous conversion of Type I grooves into Type IV patterns post-mortem',
      'Complete calcification of the labial mucosal membrane'
    ],
    correctAnswerIndex: 0,
    explanation: 'Post-mortem drying (desiccation) causes the mucosal tissue to shrink and distort the natural sulci labiorum. Forensic odontologists use rehydrating solutions (e.g. formalin-alcohol mixtures) or moist compresses to restore mucosal turgor before recording post-mortem prints.',
    points: 10
  },
  {
    id: 'ch-q30',
    question: 'In the landmark United States criminal appeal People v. Davis (1999) / Illinois v. Davis, what was the primary judicial holding regarding the admissibility of cheiloscopic (lip print) evidence?',
    options: [
      'The court recognized lip print comparison as valid forensic science, but emphasized the necessity of demonstrating scientific consensus (Frye/Daubert compliance) and rigorous qualification of expert witnesses',
      'Lip print evidence was declared an absolute judicial fiction and banned from all future courtrooms',
      'Cheiloscopy was held to automatically supersede fingerprint evidence in all homicide trials',
      'Lip prints were ruled admissible only if accompanied by eyewitness video recordings'
    ],
    correctAnswerIndex: 0,
    explanation: 'In People v. Davis (1999) in Illinois, the court addressed the admissibility of lip print evidence under the Frye standard. The appellate court held that while lip print identification has forensic merit and can be admitted when properly substantiated, it requires rigorous demonstration of general scientific acceptance and qualified expert witness methodologies.',
    points: 10
  }
];
