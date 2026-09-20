import { QuizQuestion } from '@/types/quiz';

export const CRIME_SCENE_DOCUMENTATION_QUESTIONS: QuizQuestion[] = [
  {
    id: 'csd-q1',
    question: 'When performing crime scene photography, in what sequential order must photographs be systematically captured before evidence is moved?',
    options: [
      'Close-up with scale -> Midrange -> Overall -> Close-up without scale',
      'Overall (wide-angle) -> Midrange (orientation) -> Close-up without scale -> Close-up with scale',
      'Midrange -> Close-up with scale -> Overall -> Aerial overview',
      'Close-up without scale -> Close-up with scale -> Midrange -> Overall'
    ],
    correctAnswerIndex: 1,
    explanation: 'Standard protocol requires a 4-step progressive hierarchy: Overall views establish location context, Midrange establishes evidence spatial relationships to landmarks, Close-up without scale captures pristine state, and Close-up with scale provides dimensional reference for comparison.',
    points: 20
  },
  {
    id: 'csd-q2',
    question: 'Which measurement technique is most appropriate for recording evidence positions in an irregular outdoor terrain lacking perpendicular walls?',
    options: [
      'Rectangular Coordinate Method',
      'Triangulation Method (measuring from two fixed permanent reference points)',
      'Baseline Method',
      'Compass Quadrant Method'
    ],
    correctAnswerIndex: 1,
    explanation: 'Triangulation measures the distance of an object from two distinct, non-movable fixed datum points (such as telephone poles, tree trunks, or survey markers), forming a triangle to establish a precise geometric position without requiring right-angled walls.',
    points: 20
  },
  {
    id: 'csd-q3',
    question: 'In a crime scene sketch, what is an "Exploded View" (or Cross-Projection) sketch specifically used to document?',
    options: [
      'Blast damage radius in bomb disposal cases',
      'Bloodstain spatters, bullet trajectory defects, and evidence on vertical walls and ceilings flattened alongside floor layout',
      'Underground buried evidence depths and layers',
      '3D computer animations of suspect getaway path'
    ],
    correctAnswerIndex: 1,
    explanation: 'A cross-projection (exploded) sketch acts as if the walls of a room are folded flat onto the floor plane like an opened cardboard box, allowing evidence on walls and ceilings (such as blood spatters and bullet holes) to be illustrated in relation to floor objects.',
    points: 20
  },
  {
    id: 'csd-q4',
    question: 'Why is a rough crime scene sketch strictly drawn at the scene, and what is its legal standing compared to a finished/smooth sketch?',
    options: [
      'The rough sketch is discarded as soon as the CAD or finished sketch is created',
      'The rough sketch is drawn at the scene with accurate field measurements, never altered afterward, and retained permanently in case files as primary evidence',
      'The rough sketch must be drawn strictly to scale using architectural drafting tools at the scene',
      'The rough sketch is created only for press and media releases'
    ],
    correctAnswerIndex: 1,
    explanation: 'A rough sketch is created contemporaneously at the scene, containing raw handwritten measurements and notes. It is never modified or erased after departing the scene and must be preserved permanently in the case jacket because finished/CAD sketches are derived from it.',
    points: 20
  },
  {
    id: 'csd-q5',
    question: 'In evidence photography, what is the primary technical reason for capturing a close-up photograph of an impression (e.g., footwear or bite mark) at a perpendicular 90-degree camera angle with oblique lighting?',
    options: [
      'To prevent perspective distortion and reveal subtle 3D surface depth/shadow contrast without lens flare',
      'To eliminate all shadow completely from the impression',
      'To make the image look brighter for newspaper publication',
      'Because flash units only fire when oriented at 90 degrees'
    ],
    correctAnswerIndex: 0,
    explanation: 'Capturing at a precise perpendicular (90°) angle eliminates geometric perspective distortion, ensuring 1:1 scale accuracy. Oblique (low-angle side) lighting casts directional shadows that accentuate subtle three-dimensional ridges, grooves, and tool impressions.',
    points: 20
  },
  {
    id: 'csd-q6',
    question: 'Which sketch measurement method uses a single straight line established between two known permanent points, with perpendicular offsets measured to evidence items?',
    options: [
      'Baseline (Coordinate) Method',
      'Polar Azimuth Method',
      'Triangulation Method',
      'Radial Sector Grid'
    ],
    correctAnswerIndex: 0,
    explanation: 'The baseline method establishes a straight reference line (such as a measuring tape laid between two fixed points). Evidence items are documented by noting their position along the baseline and the perpendicular (90°) distance to the left or right of it.',
    points: 20
  },
  {
    id: 'csd-q7',
    question: 'When documenting a crime scene log (entry/exit log), which personnel must be recorded?',
    options: [
      'Only civilian suspects and victims',
      'Every person entering or exiting the secure perimeter, including lead investigators, superior officers, emergency medical technicians, and coroners, along with time and purpose',
      'Only forensic laboratory technicians carrying physical evidence bags',
      'Only individuals who touch physical evidence items'
    ],
    correctAnswerIndex: 1,
    explanation: 'The crime scene entry/exit log maintained by the perimeter guard must chronicle every single person entering or departing the scene, regardless of rank, agency, or title, to prevent defense challenges regarding contamination or scene tampering.',
    points: 20
  },
  {
    id: 'csd-q8',
    question: 'What type of scale is internationally recognized as the forensic standard for photographing bite marks, footwear, and pattern injuries?',
    options: [
      'ABFO No. 2 Scale (American Board of Forensic Odontology)',
      'Standard wooden classroom 30cm ruler',
      'Generic coin or ballpoint pen',
      'Carpenters steel square'
    ],
    correctAnswerIndex: 0,
    explanation: 'The ABFO No. 2 L-shaped photomacrographic scale incorporates millimeter markings, alternating black and white bars for exposure control, and concentric circles to detect and correct perspective distortion in digital image processing.',
    points: 20
  },
  {
    id: 'csd-q9',
    question: 'In the Polar (Azimuth) Coordinate measurement method, what two parameters are recorded for each piece of evidence?',
    options: [
      'Length and weight of the evidence item',
      'An angular bearing (degrees from magnetic/true North) and line-of-sight distance from a single central datum point',
      'X-axis and Y-axis Cartesian wall offsets',
      'Elevation from sea level and room temperature'
    ],
    correctAnswerIndex: 1,
    explanation: 'The polar azimuth method utilizes a central transit or electronic total station at a known datum point, measuring the horizontal angle (azimuth in degrees from North) and the direct distance to each evidence marker, ideal for large open outdoor fields or aircraft crashes.',
    points: 20
  },
  {
    id: 'csd-q10',
    question: 'Which of the following errors during crime scene note-taking represents a severe legal vulnerability during cross-examination in court?',
    options: [
      'Using blue ink instead of black ink',
      'Tearing out pages from a spiral-bound notebook or using erasable pencil and white-out correction fluid',
      'Writing the exact ambient temperature and weather conditions',
      'Noting the chronological time of arrival in 24-hour military format'
    ],
    correctAnswerIndex: 1,
    explanation: 'Bound notebooks with pre-numbered pages are mandatory. Tearing out pages or using correction fluid/white-out creates an immediate suspicion of evidence suppression or alteration. Corrections must be made with a single neat strikethrough, initialed and dated.',
    points: 20
  },
  {
    id: 'csd-q11',
    question: 'What is the primary operational difference between crime scene videography and crime scene photography?',
    options: [
      'Videography replaces the need for still photographs and sketches entirely',
      'Videography provides continuous spatial context and acoustic-free ambient scene walkthrough; audio narration must be muted or strictly scripted to avoid recording informal investigator opinions',
      'Videography should always have loud ambient background music',
      'Videography must only be recorded at night using infrared filters'
    ],
    correctAnswerIndex: 1,
    explanation: 'Videography provides a continuous perspective of scene layout and physical relationship of items. Audio should generally be muted or strictly controlled because offhand remarks or subjective speculations by investigators recorded on audio can compromise court admissibility.',
    points: 20
  },
  {
    id: 'csd-q12',
    question: 'Why must measuring tapes made of woven cloth or fiberglass be avoided when establishing primary baseline lengths over 30 meters?',
    options: [
      'Cloth and fiberglass tapes stretch and sag under tension and temperature extremes, introducing significant measurement errors',
      'Cloth tapes react chemically with latent prints',
      'Fiberglass reflects laser distance meters',
      'Cloth tapes are banned under ISO 17025 standards'
    ],
    correctAnswerIndex: 0,
    explanation: 'Cloth and fiberglass tapes stretch under tension, wind, and humidity. High-grade steel measuring tapes or electronic laser total stations/distance meters are required for establishing baselines and primary control datum points.',
    points: 20
  },
  {
    id: 'csd-q13',
    question: 'What essential element must every finished crime scene sketch include to establish geographical spatial orientation?',
    options: [
      'Signature of the suspect',
      'A North directional arrow (indicating True or Magnetic North)',
      'A decorative border frame',
      'The retail cost estimate of damaged furniture'
    ],
    correctAnswerIndex: 1,
    explanation: 'A clear North compass arrow (indicating whether orientation is True North or Magnetic North) is mandatory on all rough and finished sketches to allow reconstruction teams and courtroom jurors to orient themselves accurately.',
    points: 20
  },
  {
    id: 'csd-q14',
    question: 'In photographic logging, what metadata must be recorded in the photo log for every photograph taken at the scene?',
    options: [
      'Date, time, camera settings/shutter speed, frame number, photo type (overall/mid/close), evidence marker number, and photographer identity',
      'Photographer blood group and passport number',
      'Only the digital file name',
      'Cost of the camera battery'
    ],
    correctAnswerIndex: 0,
    explanation: 'The photo log is an indispensable legal record containing frame/image number, date/time, subject description, camera lens/flash settings, photo category, and photographer name to authenticate digital images in judicial proceedings.',
    points: 20
  },
  {
    id: 'csd-q15',
    question: 'When sketching a deceased victim on the floor of an indoor crime scene, how many measurement points are required to accurately fix the body position?',
    options: [
      'Only one measurement to the center of the chest',
      'At least two distinct reference points (e.g., center of head and center of pelvis or heel) to two permanent fixed points each',
      'Measurements are not taken for bodies; only photography is permitted',
      'One measurement from the ceiling'
    ],
    correctAnswerIndex: 1,
    explanation: 'Because a human body is an irregular three-dimensional object with multiple joints, at least two anatomical reference points (e.g. vertex of skull and center of pelvic girdle/right heel) must be triangulated to fixed walls to lock both orientation and position on the sketch.',
    points: 20
  },
  {
    id: 'csd-q16',
    question: 'What is the purpose of placing numerical evidence markers (tents) throughout a crime scene prior to the second round of overall and midrange photography?',
    options: [
      'To give the media dramatic visuals',
      'To visually cross-reference physical items in photographs with the evidence log, sketch symbols, and inventory chain of custody',
      'To cover up blood spatters from sunlight',
      'To prevent witnesses from walking on the carpet'
    ],
    correctAnswerIndex: 1,
    explanation: 'Evidence markers establish a universal numbering system connecting photographs, sketch legends, evidence logs, and forensic lab submission forms so every piece of evidence retains identical identification throughout the legal process.',
    points: 20
  },
  {
    id: 'csd-q17',
    question: 'Which modern digital technology captures millions of 3D coordinates per second to create a millimeter-accurate "digital twin" point cloud of a crime scene?',
    options: [
      'Terrestrial 3D Laser Scanner (LiDAR)',
      'Analog 35mm pinhole camera',
      'Thermal night-vision goggles',
      'Handheld metal detector'
    ],
    correctAnswerIndex: 0,
    explanation: 'Terrestrial 3D Laser Scanning (LiDAR) emits laser pulses to record millions of XYZ coordinate points per second, generating an unalterable, millimeter-accurate 3D point cloud and virtual walkthrough of the complete crime scene.',
    points: 20
  },
  {
    id: 'csd-q18',
    question: 'In Rectangular Coordinate measurement, how are items of evidence located within an interior room?',
    options: [
      'By measuring two perpendicular distances from two adjacent intersecting fixed walls at right angles (90 degrees)',
      'By calculating distance from the center of the bed',
      'By measuring distance in diagonal lines across the carpet',
      'By using ceiling light fixture drop-down coordinates'
    ],
    correctAnswerIndex: 0,
    explanation: 'Rectangular coordinates record two perpendicular distance measurements from two adjacent, intersecting permanent walls to the item of evidence, forming a Cartesian X and Y coordinate system.',
    points: 20
  },
  {
    id: 'csd-q19',
    question: 'When packaging moist biological evidence (e.g., a blood-soaked shirt) found during documentation, what is the mandatory protocol?',
    options: [
      'Seal immediately in an airtight plastic zip-lock bag to keep moisture intact',
      'Air-dry naturally in a secure, well-ventilated drying cabinet and package in clean, breathable paper bags or porous wrapping',
      'Submerge in formaldehyde solution immediately',
      'Place in a metal paint can with solvent'
    ],
    correctAnswerIndex: 1,
    explanation: 'Biological evidence sealed while wet in plastic promotes rapid bacterial growth and mold (fungal hydrolytic enzymes) that digest and degrade DNA profiles. It must be air-dried and stored in breathable paper packaging.',
    points: 20
  },
  {
    id: 'csd-q20',
    question: 'What is meant by the "Chain of Custody" in forensic documentation, and what is the legal consequence if an unexplained gap occurs?',
    options: [
      'It is an inventory of police equipment; missing items result in administrative fines',
      'It is a chronological record tracing the unbroken custody, transfer, and disposition of evidence; an unexplained gap can render evidence inadmissible in court',
      'It refers to handcuffs used on the suspect during arrest',
      'It is a list of radio channels used by patrol cars'
    ],
    correctAnswerIndex: 1,
    explanation: 'Chain of custody proves that evidence presented in court is identical to what was seized at the crime scene, without substitution, contamination, or tampering. An unexplained gap or break in custody can lead to judicial exclusion of the evidence.',
    points: 20
  },
  {
    id: 'csd-q21',
    question: 'What is "Depth of Field" in crime scene photography, and how can an investigator maximize it to keep both foreground evidence markers and background walls in sharp focus?',
    options: [
      'Depth of field is lens zoom; use digital zoom at maximum level',
      'Depth of field is the zone of acceptable sharpness; maximize it by selecting a smaller aperture (higher f-stop number, e.g., f/8 to f/16) and using a tripod',
      'Depth of field is camera shutter noise; maximize it by turning on silent mode',
      'Depth of field refers to underwater photography depth'
    ],
    correctAnswerIndex: 1,
    explanation: 'Depth of field (DoF) determines how much of the scene in front of and behind the focal point appears sharp. Choosing a smaller lens aperture (higher f-stop such as f/11 or f/16) expands DoF, keeping both foreground evidence and background orientation landmarks in crisp focus.',
    points: 20
  },
  {
    id: 'csd-q22',
    question: 'In arson and fire scene documentation, why must charred debris suspected of containing liquid accelerants be packaged in clean, unlined metal paint cans or vapor-tight glass jars?',
    options: [
      'To prevent volatile hydrocarbons from evaporating and permeating through plastic containers',
      'Because glass and metal make the sample look clearer under microscope',
      'Because paper bags are too heavy',
      'Metal cans prevent fire debris from catching fire again'
    ],
    correctAnswerIndex: 0,
    explanation: 'Liquid accelerants (petroleum distillates like gasoline, kerosene, diesel) contain volatile organic compounds (VOCs) that readily diffuse and evaporate through porous paper and standard plastic bags. Air-tight, clean metal paint cans or glass jars trap the vapors for headspace GC-MS analysis.',
    points: 20
  },
  {
    id: 'csd-q23',
    question: 'What is a "Datum Point" in crime scene mapping, and what characteristics must it possess?',
    options: [
      'A temporary marker such as a vehicle tire or movable chair',
      'A permanent, fixed, immovable geographic reference point (e.g., corner of building foundation, sewer manhole, concrete benchmark) from which all measurements originate',
      'The exact spot where the first police officer stood',
      'The center of the blood pool'
    ],
    correctAnswerIndex: 1,
    explanation: 'A datum point is a permanent, stationary reference point that is guaranteed not to move between scene processing and subsequent reconstruction months or years later. All measurements and grid lines are referenced to this datum.',
    points: 20
  },
  {
    id: 'csd-q24',
    question: 'When documenting latent fingerprints developed with fluorescent powder or dye stains (such as Rhodamine 6G), what photographic technique is mandatory?',
    options: [
      'Direct bright sunlight with standard daylight camera flash',
      'Alternate Light Source (ALS) at specific excitation wavelength, with a matching barrier filter on the camera lens to block reflected light',
      'Long-exposure pinhole photography without lighting',
      'Standard black-and-white photocopy'
    ],
    correctAnswerIndex: 1,
    explanation: 'Fluorescence requires an excitation wavelength from an Alternate Light Source (e.g. blue or green laser/LED light). A matching barrier filter (such as orange or yellow) is placed over the camera lens to filter out the intense excitation light, allowing only the faint emitted fluorescence to expose the sensor.',
    points: 20
  },
  {
    id: 'csd-q25',
    question: 'Which of the following elements is strictly FORBIDDEN from being included on a final finished crime scene sketch presented in court?',
    options: [
      'Key / Legend explaining item letters and numbers',
      'Case number, date, time, and investigator name',
      'Investigator speculation or subjective emotional commentary (e.g., "Where brutal attack occurred" or "Suspect viciously stabbed victim here")',
      'Scale ratio statement (e.g., "Scale: 1/4 inch = 1 foot" or "Not to Scale")'
    ],
    correctAnswerIndex: 2,
    explanation: 'Sketches are objective factual representations of physical geography. Subjective assumptions, legal conclusions, or inflammatory statements (such as "where suspect ambushed victim") are prejudicial, inadmissible, and subject to immediate objection and disqualification by judges.',
    points: 20
  }
];
