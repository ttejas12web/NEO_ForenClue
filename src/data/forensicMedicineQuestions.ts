import { QuizQuestion } from '@/types/quiz';
import {
  ALGOR_MORTIS_SIGMOID_DIAGRAM,
  HANGING_VS_STRANGULATION_DIAGRAM,
  FIREARM_RANGE_TATTOOING_DIAGRAM,
  INTRACRANIAL_HEMORRHAGE_CT_DIAGRAM,
  GUSTAFSON_DENTAL_AGE_DIAGRAM,
  WALLACE_RULE_OF_NINES_DIAGRAM,
  WOUND_BALLISTICS_SHARP_BLUNT_DIAGRAM,
  DIATOM_BONE_MARROW_DROWNING_DIAGRAM,
  SKULL_SEXUAL_DIMORPHISM_DIAGRAM,
  LIVOR_MORTIS_BLANCHING_FIXATION_DIAGRAM
} from './forensicMedicineDiagrams';

export const FORENSIC_MEDICINE_QUESTIONS: QuizQuestion[] = [
  {
    id: 'fm-q1',
    question: 'Examine the Marshall & Hoare postmortem cooling curve (Algor Mortis) below. What physiological and physical mechanism accounts for the flat segment labeled [PHASE X] during the first 0.5 to 3.0 hours after somatic death, and why does Newton\'s simple linear law of cooling fail here?',
    options: [
      'Low thermal conductivity of skin and subcutaneous fat delays the outward thermal gradient while residual anaerobic tissue metabolism and glycogenolysis continue generating internal heat',
      'Rapid evaporation of sweat from the epidermis causes immediate core hyperthermia before heat loss begins',
      'Onset of rigor mortis in skeletal muscles freezes core body temperature at exactly 37.2°C until ATP is regenerated',
      'Gravitational settling of blood into dependent capillaries (livor mortis) insulates the rectum from ambient air currents'
    ],
    correctAnswerIndex: 0,
    explanation: 'Unlike an inorganic cylinder obeying Newton\'s single-exponential law of cooling, a human cadaver exhibits a double-exponential (inverted S-shaped or sigmoid) curve described by Marshall & Hoare (1962) and modeled in Henssge\'s Nomogram. During [PHASE X] (the initial postmortem temperature plateau lasting 0.5–3 hours), rectal core temperature does not drop immediately because skin and subcutaneous adipose tissue act as thermal insulators, delaying the establishment of an internal-to-surface temperature gradient, while residual anaerobic cellular metabolism and intestinal bacterial activity briefly continue generating heat.',
    hint: 'Consider how long it takes for a heat gradient to form across insulating subcutaneous fat and residual cellular glycogenolysis.',
    points: 10,
    image: ALGOR_MORTIS_SIGMOID_DIAGRAM,
    imageCaption: 'Figure 1: Marshall & Hoare Sigmoid Curve of Algor Mortis showing [PHASE X] initial lag plateau and [PHASE Y] linear cooling.'
  },
  {
    id: 'fm-q2',
    question: 'Under the Transplantation of Human Organs and Tissues Act (THOTA), 1994 in India, brain-stem death certification requires two clinical apnea and brain-stem reflex evaluations performed at least 6 hours apart by a board of four medical practitioners. Which combination of doctors is statutorily mandated on this panel?',
    options: [
      'Two judicial magistrates, one police surgeon, and the chief district medical officer',
      'Two forensic pathologists from a government mortuary and two transplant surgeons performing the recipient surgery',
      'The Registered Medical Practitioner (RMP) in charge of the hospital, an independent RMP specialist nominated from the approved panel, a neurologist or neurosurgeon, and the treating RMP',
      'Any four registered medical practitioners holding an MBBS degree employed in the intensive care unit'
    ],
    correctAnswerIndex: 2,
    explanation: 'Under Section 3(6) of the Transplantation of Human Organs and Tissues Act (THOTA), 1994, brain-stem death must be certified by a board of four medical experts: (1) The RMP in charge of the hospital where brain-stem death occurred, (2) An independent RMP specialist of unspecified standing nominated from a panel approved by the Appropriate Authority, (3) A neurologist or neurosurgeon nominated from the approved panel, and (4) The RMP treating the patient. Critically, no member of the transplant team who will harvest or implant the organs is permitted to be part of this certification board.',
    hint: 'Think of the four distinct statutory roles required by Section 3(6) of THOTA, excluding any member of the organ retrieval/transplant team.',
    points: 10
  },
  {
    id: 'fm-q3',
    question: 'Refer to the comparative cervical ligature mark diagram below. Which statement accurately differentiates Specimen A from Specimen B in a medico-legal autopsy?',
    options: [
      'Specimen A represents homicidal ligature strangulation with frequent fracture of the cricoid cartilage, whereas Specimen B represents typical suicidal hanging',
      'Specimen A represents typical hanging (oblique, non-continuous furrow situated above the thyroid cartilage with a parchmentized base), whereas Specimen B represents ligature strangulation (transverse, continuous 360° mark at or below the thyroid cartilage with frequent superior thyroid horn/laryngeal fracture)',
      'Both Specimen A and Specimen B are diagnostic of manual throttling (palmar strangulation) rather than ligature compression',
      'Specimen A occurs exclusively when the body is dragged postmortem by the neck, whereas Specimen B occurs only in judicial hanging'
    ],
    correctAnswerIndex: 1,
    explanation: 'In Hanging (Specimen A), the suspension weight of the body pulls the noose upward toward the point of suspension, creating an oblique, non-continuous furrow (interrupted by an inverted V-shaped gap at the knot) situated above the thyroid cartilage in ~80% of cases, with a dry, yellowish-brown parchmentized base due to epidermal abrasion and postmortem drying. In Ligature Strangulation (Specimen B), active constricting force applied perpendicular to the neck axis produces a transverse (horizontal), completely continuous 360° mark situated at or below the thyroid cartilage, accompanied by severe subcutaneous ecchymosis and frequent fracture of the thyroid cartilage lamina/superior cornu and tracheal rings.',
    hint: 'Compare the angle of pull (upward suspension vs. horizontal constriction), continuity around the knot, and position relative to the thyroid cartilage.',
    points: 10,
    image: HANGING_VS_STRANGULATION_DIAGRAM,
    imageCaption: 'Figure 2: Forensic comparison of cervical ligature morphology in Specimen A (Oblique/High) vs. Specimen B (Transverse/Continuous).'
  },
  {
    id: 'fm-q4',
    question: 'Which immediate ophthalmoscopic sign of somatic death—also known as the "Kevorkian Sign"—appears within minutes of circulatory arrest due to the loss of systolic blood pressure?',
    options: [
      'Tache noire de la sclérotique (triangular brownish-black scleral desiccation)',
      'Arcus senilis lipid ring deposition around the corneal limbus',
      'Complete clouding and opacification of the deep corneal stroma within 2 minutes of death',
      'Segmentation and fragmentation of retinal blood columns ("cattle-trucking" or "railroad-tracking") seen in retinal vessels'
    ],
    correctAnswerIndex: 3,
    explanation: 'Immediately following cardiac arrest, blood pressure drops to zero and the continuous stream of erythrocytes in the retinal arteries and veins breaks up into discrete, beaded segments separated by clear plasma gaps—resembling boxcars on a railway track ("cattle-trucking" or Kevorkian sign). Tache noire appears later (3–6 hours postmortem) only if the eyelids remain open, exposing the sclera to air drying.',
    hint: 'Look for the phenomenon seen inside the retinal blood vessels through an ophthalmoscope when blood flow ceases.',
    points: 10
  },
  {
    id: 'fm-q5',
    question: 'Study the rifled firearm entry wound diagram below. Why is [FEATURE X] (Zone D: Punctate Gunpowder Tattooing / Stippling) considered the definitive medico-legal criterion for an intermediate / close-range shot, and how is it differentiated from Zone C (Soot Blackening) at autopsy?',
    options: [
      'Zone D consists of superficial carbon smoke that washes off easily with water, whereas Zone C is permanent dermal burning',
      'Zone D is caused by the hot muzzle end of the barrel pressing tightly against the skin surface in a hard-contact shot',
      'Zone D is produced by incandescent unburnt or partially burnt propellant powder grains physically driven into the epidermis and dermis as punctate micro-abrasions/burns that CANNOT be wiped away with a wet sponge',
      'Zone D represents the exit beveling of the outer table of the cranial vault'
    ],
    correctAnswerIndex: 2,
    explanation: 'When a rifled firearm is discharged at close/intermediate range (typically up to ~60–90 cm for handguns), unburnt and semi-burnt propellant powder grains exit the barrel at high velocity and embed themselves into the epidermis and dermis, producing punctate reddish-brown micro-contusions and dermal burns known as "tattooing" or "stippling" (Zone D). Unlike soot blackening/smudging (Zone C), which is superficial carbon smoke deposit that can be wiped off with a wet sponge, true gunpowder tattooing is an intradermal mechanical-thermal lesion that cannot be washed away.',
    hint: 'Contrast superficial carbon smoke (Zone C) with high-velocity propellant grains embedded into the dermis (Zone D).',
    points: 10,
    image: FIREARM_RANGE_TATTOOING_DIAGRAM,
    imageCaption: 'Figure 3: Concentric zones around a rifled firearm entry wound showing Grease Collar (A), Abrasion Collar (B), Soot Smudging (C), and Tattooing (D).'
  },
  {
    id: 'fm-q6',
    question: 'A drowning victim is recovered from a river with aquatic weeds and gravel tightly clutched in the right hand. Which postmortem phenomenon explains this finding, and how does its biochemical status differ from ordinary rigor mortis?',
    options: [
      'Cadaveric spasm (instantaneous rigor / cataleptic rigidity); it initiates antemortem at the moment of violent nervous excitement with instantaneous extreme ATP depletion and NO preceding stage of primary relaxation',
      'Primary muscular flaccidity; it can be easily simulated postmortem by placing objects in the cadaver\'s hand',
      'Cold stiffening (freezing rigor); it occurs only when water temperature is below 0°C',
      'Pugilistic attitude (heat rigor); caused by coagulation of sarcoplasmic myogen proteins above 65°C'
    ],
    correctAnswerIndex: 0,
    explanation: 'Cadaveric spasm (instantaneous rigor) is a rare vital condition in which muscles that were under intense voluntary contraction immediately prior to death pass instantaneously into postmortem rigidity at the exact moment of somatic death—completely bypassing the stage of primary muscular relaxation. Because it requires an intact central nervous system discharge and severe antemortem ATP exhaustion, it CANNOT be simulated after death and provides conclusive medico-legal proof of the victim\'s last voluntary act (e.g., grasping weeds in antemortem drowning or a weapon in suicide).',
    hint: 'Which form of stiffness skips the stage of primary relaxation and preserves the exact final voluntary muscular contraction of life?',
    points: 10
  },
  {
    id: 'fm-q7',
    question: 'Analyze the axial cranial cross-section schematic below comparing Pattern A and Pattern B. Which statement correctly identifies Pattern A, its anatomical boundary, and its classic medico-legal clinical presentation?',
    options: [
      'Subarachnoid hemorrhage from a ruptured berry aneurysm; crosses all dural reflections and presents with "thunderclap headache"',
      'Epidural (Extradural) Hematoma; forms a biconvex (lentiform) clot arrested at cranial suture lines where periosteal dura adheres tightly to bone, classically associated with a squamous temporal (pterion) fracture tearing the middle meningeal artery and presenting with a "Lucid Interval"',
      'Subdural Hematoma; forms a biconvex clot caused by rupture of parasagittal bridging veins that freely crosses cranial suture lines',
      'Intracerebral hypertensive hemorrhage of the basal ganglia caused by lenticulostriate artery rupture'
    ],
    correctAnswerIndex: 1,
    explanation: 'Pattern A illustrates an acute Epidural (Extradural) Hematoma (EDH). A blow to the lateral temple fractures the thin squamous temporal bone at the pterion, lacerating the anterior branch of the Middle Meningeal Artery. High-pressure arterial blood strips the dura mater from the inner table of the skull, forming a biconvex (lentiform / lens-shaped) hematoma that cannot cross cranial suture lines because the outer periosteal layer of dura is firmly fused into the sutures. Clinically, it classically exhibits a "Lucid Interval" (temporary recovery from initial concussion followed by rapid deterioration into coma and ipsilateral Hutchinson\'s/McEwen\'s dilated pupil as intracranial pressure rises), which is a critical medico-legal trap if a patient is discharged prematurely from emergency care.',
    hint: 'Notice how Pattern A is lens-shaped (biconvex) and tethered at the cranial sutures near the pterion.',
    points: 10,
    image: INTRACRANIAL_HEMORRHAGE_CT_DIAGRAM,
    imageCaption: 'Figure 4: Axial cranial schematic comparing Pattern A (Biconvex Epidural Hematoma) vs. Pattern B (Crescentic Subdural Hematoma).'
  },
  {
    id: 'fm-q8',
    question: 'What is the biochemical mechanism responsible for the formation of Adipocere (Saponification) in bodies submerged in water or buried in damp, clayey soil, and which bacterial enzyme catalyzes it?',
    options: [
      'Dehydration and desiccation of tissues by hot, dry desert winds inhibiting all bacterial proteases',
      'Oxidation of hemoglobin into hematin and biliverdin by aerobic blowfly larvae',
      'Calcification of skeletal muscles into calcium carbonate crystals in alkaline arid sand',
      'Hydrolysis and hydrogenation of unsaturated liquid body fats (such as oleic acid) into insoluble saturated higher fatty acids (palmitic, stearic, and 10-hydroxystearic acids), catalyzed by lecithinase (alpha-toxin) from Clostridium perfringens in presence of moisture'
    ],
    correctAnswerIndex: 3,
    explanation: 'Adipocere (grave wax) is a late modification of putrefaction in which neutral unsaturated liquid body fats (triolein / oleic acid) undergo hydrolysis and bacterial hydrogenation into firm, yellowish-white, waxy saturated fatty acids (primarily palmitic, stearic, myristic, and 10-hydroxystearic acids). Water is essential (derived from damp soil/submersion and intrinsic body water), and the reaction is markedly accelerated by the lecithinase enzyme produced by anaerobic Clostridium perfringens (C. welchii). Because adipocere resists further putrefaction, facial features and deep wound tracks remain preserved for months or years.',
    hint: 'Think of the conversion of unsaturated liquid fat into saturated waxy fatty acids requiring moisture and Clostridium perfringens lecithinase.',
    points: 10
  },
  {
    id: 'fm-q9',
    question: 'Examine the longitudinal ground section of an adult tooth illustrating Gustafson\'s six age-estimation parameters below. Which parameter labeled [PARAMETER T] is universally recognized in forensic odontology as the single most reliable solitary criterion for adult age estimation, and what causes it?',
    options: [
      'Root Dentin Transparency / Translucency (T); caused by progressive physiological sclerosis and intratubular calcification of dentinal tubules starting from the root apex after ~30 years of age, equalizing the refractive index of tubules and matrix',
      'Occlusal Attrition (A); caused by abrasive silica particles in the diet wearing away enamel',
      'Periodontosis (P); caused by chronic bacterial gingivitis and alveolar bone loss',
      'Root Resorption (R); caused by osteoclastic destruction of the apical foramen'
    ],
    correctAnswerIndex: 0,
    explanation: 'In Gösta Gustafson\'s (1950) histological method (and subsequent Bang & Ramm and Johanson modifications), six dental changes are scored from 0 to 3: Attrition (A), Periodontosis (P), Secondary dentin (S), Cementum apposition (C), Root resorption (R), and Root transparency (T). Among all six, Apical Root Dentin Transparency [PARAMETER T] is the most reliable single indicator of chronological age because it begins consistently at the apex around age 30 and progresses coronally due to physiological mineral obliteration of dentinal tubules (making their refractive index match the peritubular matrix so light passes through), and is least influenced by external diet, oral hygiene, or periodontal disease.',
    hint: 'Identify the parameter at the root apex that turns translucent as dentinal tubules calcify and match the surrounding matrix\'s refractive index.',
    points: 10,
    image: GUSTAFSON_DENTAL_AGE_DIAGRAM,
    imageCaption: 'Figure 5: Longitudinal tooth section showing Gustafson\'s 6 parameters (A, P, S, C, R, and apical [PARAMETER T]).'
  },
  {
    id: 'fm-q10',
    question: 'How does the sequential color progression of a true antemortem dermal contusion (bruise) proceed over time as macrophages enzymatically degrade extravasated hemoglobin, and how is it differentiated from postmortem hypostasis at autopsy?',
    options: [
      'Yellow -> Green -> Blue -> Red; differentiated by wiping the skin surface with ethanol',
      'Black -> Cherry Red -> White; differentiated only by X-ray crystallography',
      'Red (oxy/deoxyhemoglobin, fresh) -> Blue/Violaceous (1–3 days) -> Green (biliverdin, 4–5 days) -> Yellow (bilirubin, 7–10 days) -> Brown (hemosiderin); on incision, a true contusion shows coagulated blood extravasated into interstitial tissue spaces that cannot be washed away by a gentle stream of water',
      'Green -> Purple -> Red; on incision, blood oozes from intact capillaries and washes off completely'
    ],
    correctAnswerIndex: 2,
    explanation: 'Age estimation of an antemortem bruise relies on the enzymatic breakdown of extravasated hemoglobin by tissue macrophages: Fresh (0–24 hrs): Red; 1–3 days: Blue/dark purple (deoxyhemoglobin); 4–5 days: Greenish (biliverdin); 7–10 days: Yellowish (bilirubin); 10–14 days: Brownish (hemosiderin), fading from the periphery inward. Crucially, subconjunctival hemorrhages do NOT show this color sequence because atmospheric oxygen diffuses directly through the thin conjunctiva, keeping hemoglobin bright red until absorption. At autopsy, incising a true contusion reveals clotted blood infiltrating the extravascular dermis/subcutis that cannot be washed away under running water, whereas in livor mortis blood remains confined inside dilated vessels.',
    hint: 'Follow the heme degradation pathway: Hemoglobin (Red/Blue) -> Biliverdin (Green) -> Bilirubin (Yellow) -> Hemosiderin (Brown).',
    points: 10
  },
  {
    id: 'fm-q11',
    question: 'Refer to the Wallace "Rule of Nines" adult burn assessment chart below. An adult victim sustains thermal burns covering the entire anterior trunk (chest + abdomen), the entire right upper limb (both anterior and posterior surfaces), and the anterior surface only of the right lower limb. What is the exact Total Body Surface Area (TBSA) burned, and which classical classification divides burn depth into SIX histological degrees (1st degree erythema to 6th degree charring to bone)?',
    options: [
      '27% TBSA; Wilson\'s three-tier classification',
      '45% TBSA; Lund and Browder pediatric chart',
      '37% TBSA; Hebra\'s three-degree classification',
      '36% TBSA (18% Anterior Trunk + 9% Right Upper Limb + 9% Anterior Right Lower Limb); Dupuytren\'s six-degree classification'
    ],
    correctAnswerIndex: 3,
    explanation: 'According to Alexander Wallace\'s "Rule of Nines" for an adult: (1) Entire Anterior Trunk (front of chest 9% + front of abdomen 9%) = 18%; (2) Entire Right Upper Limb (4.5% anterior + 4.5% posterior) = 9%; (3) Anterior surface only of Right Lower Limb (half of the 18% total right leg) = 9%. Summing the three regions yields 18% + 9% + 9% = 36% TBSA. Regarding burn depth classification, Guillaume Dupuytren classified burns into 6 histological degrees (1st: erythema; 2nd: vesication; 3rd: destruction of superficial dermis/painful nerve endings; 4th: whole skin thickness to subcutaneous fat; 5th: deep fascia and muscles; 6th: carbonization/charring of bone), whereas Wilson classified them into 3 groups (epidermal, dermo-epidermal, and deep).',
    hint: 'Add Anterior Trunk (18%) + Full Right Arm (4.5% + 4.5% = 9%) + Front of Right Leg (9%).',
    points: 10,
    image: WALLACE_RULE_OF_NINES_DIAGRAM,
    imageCaption: 'Figure 6: Adult Wallace Rule of Nines schematic with shaded burn regions on Anterior Trunk, Right Upper Limb, and Anterior Right Lower Limb.'
  },
  {
    id: 'fm-q12',
    question: 'In a fatal fire investigation, a charred body is recovered in a "Pugilistic Attitude" (boxer\'s/fencing posture) with an extradural "Heat Hematoma" inside the skull. Which quartet of autopsy findings definitively proves that the victim was ALIVE when the fire started (Antemortem Burns) rather than burned after death?',
    options: [
      'Vital "Line of Redness" around burns, blisters containing serous fluid rich in albumin and chlorides with a bright red inflamed base, soot particles adhering to mucus below the vocal cords in terminal bronchioles, and carboxyhemoglobin (COHb) saturation > 10% (often > 40–50%) in cardiac blood',
      'Pugilistic attitude alone, split skin cracks mimicking incised wounds, absence of trachea soot, and carboxyhemoglobin < 2%',
      'Presence of a honeycomb-like frothy extradural heat hematoma and fractures of the outer cranial table alone',
      'Yellowish dry parchment-like blisters filled exclusively with air and devoid of protein or leukocytes'
    ],
    correctAnswerIndex: 0,
    explanation: 'Both the "pugilistic attitude" (caused by thermal coagulation of flexor muscle proteins above 65°C overpowering extensors) and "heat hematoma" (blood forced out of diploic veins and venous sinuses by boiling) are purely physical heat phenomena that occur equally in antemortem and postmortem bodies. Proof of Antemortem Burning requires vital circulatory and respiratory reactions: (1) Vital erythema ("line of redness") with leukocytic margination, (2) Vital blisters containing protein-rich (albumin) and chloride-rich exudate over an inflamed dermal base, (3) Active inhalation of carbon soot particles deep into the lower respiratory tract (below the glottis into secondary/terminal bronchioles), and (4) Elevated blood Carboxyhemoglobin (COHb > 10%, typically > 40–50%).',
    hint: 'Separate vital respiratory/circulatory signs (soot in bronchioles, COHb, albumin-rich blisters) from physical heat artifacts (pugilistic posture, heat hematoma).',
    points: 10
  },
  {
    id: 'fm-q13',
    question: 'Inspect the magnified cross-sectional wound diagram below comparing Wound X and Wound Y. When a blunt iron rod strikes the scalp over the convex parietal bone, it splits the skin in a straight line that closely mimics a knife cut. Examination under a 10× magnifying lens reveals [FEATURE Z] in Wound Y. What is [FEATURE Z] and what does it prove?',
    options: [
      'Tailing of the wound; it proves the lesion was inflicted by a double-edged dagger',
      '"Tissue Bridging" (intact strands of nerves, blood vessels, and fibrous connective tissue spanning across the deep floor of the wound alongside bruised, abraded margins and crushed hair bulbs); it proves Wound Y is a blunt-force split laceration rather than a sharp incised wound',
      'Hesitation (tentative) cuts; it proves the wound was self-inflicted during a suicide attempt',
      'Hilt mark abrasion; it proves complete penetration of a single-edged pocket knife'
    ],
    correctAnswerIndex: 1,
    explanation: 'Over bony prominences such as the scalp, shin (tibia), zygoma, or eyebrow ridge, blunt impact compresses the skin against the underlying bone, producing a linear "split laceration" that superficially resembles a sharp incised wound (Wound X). Under a 10× hand lens, a split laceration (Wound Y) is definitively distinguished by: (1) [FEATURE Z] — "Tissue Bridging" (tougher deep structures like nerves, elastic fibers, and small blood vessels remain intact and bridge across the wound floor from wall to wall, whereas a sharp blade severs everything cleanly), (2) Irregular, contused, and abraded margins, and (3) Crushed (rather than cleanly sliced) hair bulbs.',
    hint: 'Look at the intact strands of vessels, nerves, and connective tissue stretching across the bottom of Wound Y.',
    points: 10,
    image: WOUND_BALLISTICS_SHARP_BLUNT_DIAGRAM,
    imageCaption: 'Figure 7: Cross-sectional comparison of Wound X (Clean-cut Incised Wound) vs. Wound Y (Blunt Split Laceration showing [FEATURE Z] Tissue Bridging).'
  },
  {
    id: 'fm-q14',
    question: 'In neuropathology of blunt head trauma, how are "Contrecoup" cortical contusions produced biomechanically, and in which cranial scenario are they classically most prominent?',
    options: [
      'When a stationary, supported head is struck by a small moving object (such as a hammer), causing injury exclusively under the point of impact',
      'Only in high-velocity perforating rifle wounds passing through the brainstem',
      'When cerebrospinal fluid freezes postmortem inside the lateral ventricles',
      'When a moving head is suddenly decelerated against a firm, unyielding surface (such as falling backward onto the occiput), creating a negative-pressure cavitation vacuum and tensile shear at the opposite cerebral poles (frontal and temporal lobes)'
    ],
    correctAnswerIndex: 3,
    explanation: 'Coup injuries occur beneath the site of impact when a moving object strikes a stationary head. Conversely, Contrecoup injuries occur diametrically opposite the point of impact when a moving head suddenly decelerates against a stationary, unyielding surface (e.g., a backwards fall striking the occiput on pavement). As the skull stops abruptly, the brain lags behind due to inertia, pulling away from the opposite inner skull table and generating a transient negative-pressure cavitation bubble and rotational shearing against the irregular bony ridges of the anterior and middle cranial fossae—causing severe contrecoup contusions on the tips and undersurfaces of the frontal and temporal lobes.',
    hint: 'Differentiate a moving object hitting a stationary head (coup) from a moving head hitting a stationary floor (deceleration contrecoup).',
    points: 10
  },
  {
    id: 'fm-q15',
    question: 'Examine the forensic diatom extraction and acid digestion workflow below. In a heavily putrefied body recovered from a pond 10 days after disappearance, why does recovering matching siliceous diatom frustules specifically from the closed femoral bone marrow (Step 1) establish antemortem drowning?',
    options: [
      'Diatoms actively swim through skin pores and burrow into bone marrow after death',
      'Putrefactive gases force pond water from the stomach directly into the medullary cavity of the femur after cardiac arrest',
      'For diatoms (10–60 μm) in inhaled water to penetrate ruptured alveolar-capillary membranes and reach distant closed organs like femoral bone marrow, an intact systemic circulation driven by a beating heart at the time of submersion is strictly required',
      'Nitric acid digestion synthesizes silica frustules out of normal human osteocytes during laboratory heating'
    ],
    correctAnswerIndex: 2,
    explanation: 'In putrefied or skeletonized immersion deaths where classic external signs of drowning (fine persistent leathery froth, washerwoman\'s skin, emphysema aquosum, Paltauf\'s hemorrhages) have disappeared, the Bone Marrow Diatom Test is gold-standard. When a live person inhales water during drowning, microscopic unicellular algae with acid-resistant crystalline silica (SiO₂) shells (diatoms, 10–60 μm) pass through ruptured pulmonary alveolar-capillary walls into the pulmonary veins and left heart. Only a living, beating heart can pump these diatoms via systemic arterial blood into the closed medullary cavity of the femur or sternum. After digesting 50 g of marrow in concentrated HNO₃/H₂SO₄, matching the species profile (pennate/centric) with a control sample of water from the scene confirms antemortem drowning.',
    hint: 'How can microscopic algae travel from the pulmonary alveoli all the way inside the closed shaft of the femur?',
    points: 10,
    image: DIATOM_BONE_MARROW_DROWNING_DIAGRAM,
    imageCaption: 'Figure 8: Forensic Diatom Test workflow showing systemic circulation to femoral bone marrow, HNO₃ acid digestion, and pennate/centric frustule comparison.'
  },
  {
    id: 'fm-q16',
    question: 'What is "Traumatic Asphyxia" (Crush Asphyxia), what is its characteristic external autopsy hallmark ("Masque Ecchymotique"), and how did the historical homicidal method known as "Burking" utilize it?',
    options: [
      'Mechanical fixation of the thoracic and upper abdominal walls by heavy external compression preventing respiratory chest expansion, producing intense purplish-blue cranio-cervical cyanosis and confluent petechiae strictly above the clavicles ("Masque Ecchymotique"); "Burking" combined kneeling on the victim\'s chest with manual smothering of the nose and mouth',
      'Internal airway obstruction by a food bolus impacting the larynx ("Café Coronary")',
      'Positional asphyxia caused by hanging upside down by the ankles for several hours',
      'Chemical asphyxia caused by inhalation of hydrogen sulfide gas in underground sewers'
    ],
    correctAnswerIndex: 0,
    explanation: 'Traumatic (Crush) Asphyxia results from heavy mechanical compression fixing the chest and upper abdomen (e.g., crowd stampedes, collapsed trenches, or vehicles pinning the thorax) so the diaphragm and intercostal muscles cannot expand. Extreme back-pressure in the valveless superior vena cava and jugular veins produces a dramatic line of demarcation at the clavicles/upper chest, above which the face, neck, sclerae, and upper shoulders are deeply congested, swollen, and covered with confluent petechial hemorrhages ("Masque Ecchymotique" of Morestin). "Burking" (named after 19th-century Edinburgh murderers William Burke and William Hare) combined sitting/kneeling on the victim\'s chest (traumatic asphyxia) while closing the nostrils and mouth with the hands (smothering), leaving virtually no external marks of violence for anatomical dissection buyers.',
    hint: 'Think of valveless superior vena cava back-pressure above the line of chest compression and the historical method of Burke and Hare.',
    points: 10
  },
  {
    id: 'fm-q17',
    question: 'Compare Cranial Profile I and Cranial Profile II in the forensic osteology diagram below. Which anthropological assessment accurately identifies the biological sex of the two adult skulls and states the diagnostic accuracy of the skull vs. pelvis?',
    options: [
      'Profile I is Female and Profile II is Male; the skull alone provides 100% accuracy whereas the pelvis provides only 60% accuracy',
      'Both Profile I and Profile II represent pre-pubertal children under 8 years of age',
      'Profile I and Profile II differentiate dolichocephalic racial ancestry rather than biological sex',
      'Profile I is Male (receding forehead, prominent glabella/supraorbital ridges, large mastoid process, square chin, ~90° everted gonial angle) and Profile II is Female (vertical forehead with prominent frontal bossing, sharp supraorbital margins, small gracile mastoid, obtuse >125° gonial angle); accuracy is ~90–92% by skull alone and ~98% by skull + pelvis together'
    ],
    correctAnswerIndex: 3,
    explanation: 'In adult forensic osteology (Krogman\'s hierarchy of sex determination accuracy: Whole skeleton = 100%, Pelvis + Skull = 98%, Pelvis alone = 95%, Skull alone = 90–92%, Long bones alone = 80–85%), Cranial Profile I exhibits classic adult Male traits: receding/sloping forehead, prominent glabella and heavy superciliary arches, rounded blunt supraorbital margins, large mastoid processes (which rest flat on a table when placed without the mandible), and a robust mandible with a square chin and ~90° everted gonial angle. Cranial Profile II exhibits classic adult Female traits: vertical rounded forehead preserving infantile frontal/parietal eminences, smooth glabella, sharp thin supraorbital margins, small mastoid processes, and a rounded chin with an obtuse (>125°) gonial angle.',
    hint: 'Compare the forehead slope, glabella prominence, mastoid size, and mandibular gonial angle between Profile I and Profile II.',
    points: 10,
    image: SKULL_SEXUAL_DIMORPHISM_DIAGRAM,
    imageCaption: 'Figure 9: Osteological comparison of Cranial Profile I (Adult Male) vs. Cranial Profile II (Adult Female) showing 4 key dimorphic landmarks.'
  },
  {
    id: 'fm-q18',
    question: 'During an autopsy of an electrocution and lightning fatality investigation, how do a true "Joule Burn" (endogenous electrical contact mark) and "Filigree Burns" (Lichtenberg Figures / Arborescent Marks) differ in pathogenesis and forensic appearance?',
    options: [
      'Both are deep 6th-degree charring lesions of bone caused exclusively by low-voltage household batteries',
      'A Joule Burn is an endogenous electro-thermal contact lesion at the entry point of an electrical conductor (collapsed pale cratered center, raised blistered periphery, and dermal "metallization" from conductor metal ions), whereas Filigree Burns (Lichtenberg Figures) are superficial, painless, fern-like erythematous cutaneous patterns seen in lightning strikes that fade within 24–48 hours',
      'A Joule Burn occurs only in lightning strikes, whereas Filigree Burns occur only with 110V AC domestic wires',
      'Filigree burns represent postmortem venous marbling caused by Clostridium perfringens gas gangrene'
    ],
    correctAnswerIndex: 1,
    explanation: 'A Joule Burn is specific to contact with an energized electrical conductor: electrical resistance of the keratinized epidermis converts electrical energy into heat (Joule\'s Law: H = I²RT), creating a round/oval chalky-white depressed crater with a raised hyperemic or blistered rim, honeycomb vacuolization of the stratum corneum, streaming/palisading of basal epidermal nuclei, and "metallization" (volatilized microscopic metal ions from the wire embedded in the skin, detectable by chemical spot tests or SEM-EDS). Conversely, Filigree Burns (Lichtenberg Figures or Keraunographic Arborescent Marks) are pathognomonic of lightning strikes, appearing as delicate, fern-like or feathery red dendritic patterns on the skin due to superficial electron shower tracking and capillary erythema/hemolysis, disappearing in 24–48 hours if the individual survives.',
    hint: 'Contrast the contact crater with dermal metallization (Joule burn) against the fern-like cutaneous lightning pattern (Lichtenberg figure).',
    points: 10
  },
  {
    id: 'fm-q19',
    question: 'Study the Livor Mortis (Postmortem Hypostasis) fixation and toxicology color key diagram below. A corpse is found with well-defined white "Contact Pallor" over the scapulae, buttocks, and calves, and fixed dorsal lividity that does NOT blanch on thumb pressure. However, the body is currently lying prone (face-down) when police arrive. Furthermore, the lividity exhibits the distinct [TOXIN GROUP M] Chocolate-Brown hue. What two medico-legal conclusions can be drawn?',
    options: [
      'The corpse originally lay supine for at least 8–12 hours until lividity became fixed by hemolysis and was subsequently moved/turned over after fixation; the chocolate-brown lividity indicates Methemoglobinemia caused by oxidizing poisons such as Nitrites, Aniline dyes, Potassium Chlorate, or Nitrobenzene',
      'The person died less than 30 minutes ago in the prone position from carbon monoxide poisoning',
      'Contact pallor over the scapulae and buttocks forms only when a person is suspended vertically by a rope; chocolate-brown lividity indicates cyanide poisoning',
      'Lividity never fixes after death and shifts completely within 5 minutes at any postmortem interval'
    ],
    correctAnswerIndex: 0,
    explanation: 'Livor mortis begins as patchy mottling within 1–2 hours, coalesces by 3–6 hours (when thumb pressure still blanches the skin by displacing intravascular blood), and becomes permanently FIXED after ~8–12 hours due to hemolysis of erythrocytes and diffusion of hemoglobin staining into the perivascular tissues. Finding fixed dorsal lividity with dorsal contact pallor (over scapulae, buttocks, and calves) on a body discovered lying prone proves conclusively that the body originally lay supine for >8–12 hours and was disturbed/moved postmortem. Furthermore, Chocolate-Brown (coffee-brown) lividity [TOXIN GROUP M] is diagnostic of Methemoglobinemia (oxidation of ferrous Fe²⁺ heme to ferric Fe³⁺), classically caused by Potassium Chlorate, Nitrites/Nitrates, Aniline, Acetanilide, or Nitrobenzene.',
    hint: 'Check what happens when a body is turned over after lividity fixes (>8–12 hrs) and look at Card 3 ([TOXIN GROUP M]) in the color key.',
    points: 10,
    image: LIVOR_MORTIS_BLANCHING_FIXATION_DIAGRAM,
    imageCaption: 'Figure 10: Supine livor mortis distribution with dorsal contact pallor zones and 4-card toxicological color key ([TOXIN GROUP M]).'
  },
  {
    id: 'fm-q20',
    question: 'In a medico-legal examination of suspected infanticide vs. stillbirth, what is "Spalding\'s Sign" on radiographic examination, and what are the comparative specific gravities of an unrespired fetal lung versus a respired newborn lung in the Hydrostatic (Raygat\'s) Floatation Test?',
    options: [
      'Spalding\'s sign is calcified femoral epiphysis at the knee (Béclard\'s center); unrespired lung specific gravity is 0.70 and respired lung is 1.20',
      'Spalding\'s sign is air inside the middle ear cavity (Wredin\'s test); both respired and unrespired lungs sink in water',
      'Spalding\'s sign is overriding/overlapping and loss of alignment of the fetal cranial vault bones due to brain shrinkage after intrauterine death (proving dead-born fetus); in the Hydrostatic Test, an unrespired lung has a specific gravity of ~1.04–1.05 (sinks in water), whereas a respired lung has a specific gravity of ~0.94 (floats in water)',
      'Spalding\'s sign is meconium staining of the umbilical cord; unrespired lungs float unless boiled in nitric acid'
    ],
    correctAnswerIndex: 2,
    explanation: 'Spalding\'s Sign is a pathognomonic radiological sign of intrauterine fetal death (dead-born / macerated fetus): liquefaction and shrinkage of the cerebrum after death in utero causes collapse of the pericranium and overriding/overlapping of the bones of the cranial vault without fracture, appearing 4–7 days after fetal death. In the Hydrostatic (Raygat\'s) Test for live birth, a lung that has never breathed (atelectatic) is firm, liver-like, and has a specific gravity of 1.04–1.05 (higher than water\'s 1.00, so it sinks), whereas a lung expanded by active respiration traps residual alveolar air that cannot be squeezed out, lowering its specific gravity to ~0.94 (so the whole thoracic pluck and individual squeezed lung pieces float). False positives in the hydrostatic test can occur from putrefactive gas formation or artificial mouth-to-mouth inflation.',
    hint: 'Recall cranial bone overlapping after intrauterine brain shrinkage (Spalding\'s sign) and whether specific gravity drops below 1.00 after breathing.',
    points: 10
  },
  {
    id: 'fm-q21',
    question: 'In forensic anthropometry and osteology, how is the "Cephalic Index" (Index of Breadth) mathematically calculated, which cranial category corresponds to a Cephalic Index between 70.0 and 74.9, and which long-bone regression formulae have the lowest standard error for stature estimation?',
    options: [
      '(Maximum Length of Skull / Maximum Breadth of Skull) × 100; Brachycephalic; Gustafson\'s equations',
      '(Maximum Breadth of Skull / Maximum Length of Skull) × 100; Dolichocephalic (long-headed, typical of Caucasoids and Negroids, 70.0–74.9); Trotter and Gleser regression equations (with combined Femur + Tibia giving the highest accuracy)',
      '(Facial Height / Bizygomatic Breadth) × 100; Mesocephalic; Rule of Haase',
      '(Foramen Magnum Diameter / Cranial Vault Capacity) × 100; Hyperbrachycephalic; Nysten\'s formula'
    ],
    correctAnswerIndex: 1,
    explanation: 'The Cephalic Index (CI) is calculated using spreading calipers between euryon-to-euryon (Maximum Breadth) and glabella-to-opisthocranion (Maximum Length): CI = (Maximum Breadth / Maximum Length) × 100. Crania are classified as: (1) Dolichocephalic (Long-headed): CI = 70.0–74.9 (characteristic of Caucasoid and Negroid populations), (2) Mesocephalic (Medium-headed): CI = 75.0–79.9 (common in Indian populations), and (3) Brachycephalic (Round/Short-headed): CI = 80.0–84.9 (characteristic of Mongoloid populations). For estimating adult stature from dry long bones, Trotter and Gleser\'s regression equations yield the lowest standard error of estimate (superior to Karl Pearson\'s older formulae), with lower limb bones (specifically Femur + Tibia combined) providing more accurate stature predictions than upper limb bones.',
    hint: 'Cephalic Index = (Maximum Breadth / Maximum Length) × 100; 70–74.9 is Dolichocephalic.',
    points: 10
  },
  {
    id: 'fm-q22',
    question: 'What are "Ectopic" (Migratory / Percolated) Bruises in forensic traumatology, and which two classic clinical signs correspond to fractures of the Anterior Cranial Fossa and Middle/Posterior Cranial Fossa respectively?',
    options: [
      'Bruises that appear at the exact point of weapon impact within 10 seconds; Chvostek\'s sign and Trousseau\'s sign',
      'Postmortem lividity patches that form on the fingertips; Kernig\'s sign and Brudzinski\'s sign',
      'Defense bruises on the ulnar border of the forearm; Babinski\'s sign and Romberg\'s sign',
      'Bruises that appear at a surface site distant from the actual site of vascular injury because extravasated blood tracks along fascial planes of least resistance under gravity; "Raccoon Eyes" (periorbital ecchymosis) in Anterior Cranial Fossa orbital roof fracture, and "Battle\'s Sign" (retroauricular mastoid ecchymosis) in Middle/Posterior Cranial Fossa petrous temporal fracture'
    ],
    correctAnswerIndex: 3,
    explanation: 'An ectopic (migratory or percolated) contusion appears at a site remote from the point of trauma because deep blood tracks along anatomical fascial planes under gravity before reaching superficial subcutaneous tissue—meaning the site of the bruise does NOT always indicate the site of impact and its appearance is delayed by 12–48 hours. Two classic medico-legal examples in basal skull fractures are: (1) Bilateral periorbital hematoma ("Raccoon Eyes" or "Spectacle Hematoma") from blood tracking forward through fractured orbital plates of the Anterior Cranial Fossa, and (2) Retroauricular ecchymosis over the mastoid process ("Battle\'s Sign") from blood tracking from a fracture of the petrous temporal bone in the Middle/Posterior Cranial Fossa.',
    hint: 'Think of blood tracking along tissue planes from basal skull fractures to the eyelids (Raccoon eyes) and behind the ear (Battle\'s sign).',
    points: 10
  },
  {
    id: 'fm-q23',
    question: 'In forensic entomology, which insect family acts as the primary necrophagous colonizer arriving within minutes to hours of death to oviposit in natural orifices and open wounds, and how is "Entomotoxicology" utilized when soft tissues have completely decomposed?',
    options: [
      'Calliphoridae (Metallic blue/green Blowflies); furthermore, in skeletonized remains devoid of blood or urine, toxicological analysis of Dipteran larvae and empty chitinous puparial cases (entomotoxicology) can detect antemortem drugs and poisons (such as opioids, benzodiazepines, cocaine, and organophosphates) that bioaccumulated in the feeding maggots and altered their larval development rate',
      'Dermestidae (Hide beetles); used only to measure ambient humidity',
      'Culicidae (Mosquitoes); used to determine the victim\'s ABO blood group three years after death',
      'Formicidae (Ants); used to calculate the victim\'s exact body weight at birth'
    ],
    correctAnswerIndex: 0,
    explanation: 'Necrophagous insects colonize a corpse in predictable ecological waves (Mégnin\'s succession). The first colonizers are Diptera of the family Calliphoridae (Blowflies, such as Calliphora, Lucilia, and Chrysomya species), attracted within minutes by volatile sulfur/putrefactive compounds to lay eggs in moist natural orifices (eyes, nostrils, mouth) and open bloodied wounds, followed shortly by Sarcophagidae (flesh flies). Using species-specific developmental thresholds and local weather data, forensic entomologists calculate Accumulated Degree Hours/Days (ADH/ADD) to establish the minimum Postmortem Interval (PMImin). In advanced decomposition, Entomotoxicology extracts drugs, heavy metals, and pesticides from maggots or persistent chitinous puparial shells, also correcting PMI estimates because stimulants (cocaine/methamphetamine) accelerate larval growth whereas organophosphates retard it.',
    hint: 'Which metallic flies lay the first eggs in moist orifices, and how do drugs in tissues affect feeding maggots and their chitinous puparia?',
    points: 10
  },
  {
    id: 'fm-q24',
    question: 'Under Indian criminal procedure law, in which specific medico-legal circumstances is a "Magistrate\'s Inquest" under Section 196 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 [formerly Section 176 CrPC] statutorily mandatory instead of a routine Police Inquest alone?',
    options: [
      'Every minor road traffic accident involving a two-wheeler with no fatalities',
      'Natural death of an elderly patient over 80 years of age in a private nursing home from myocardial infarction',
      'Death or disappearance of a person in police custody or judicial custody, death caused by police firing, and unnatural/suspicious death or suicide of a woman within 7 years of marriage (dowry death investigation), as well as ordering exhumation of an already buried body',
      'Routine food poisoning outbreaks in school hostels where all patients recover'
    ],
    correctAnswerIndex: 2,
    explanation: 'While a Police Inquest (Section 194 BNSS, 2023 / formerly Section 174 CrPC) conducted by an officer in charge of a police station is the most common inquest in India, a Magistrate\'s Inquest (Section 196 BNSS, 2023 / formerly Section 176 CrPC) conducted by a Judicial/Metropolitan Magistrate or Executive Magistrate (District Collector/SDM/Tahsildar) is mandatory in high-scrutiny cases: (1) Death or disappearance of any person or alleged rape of a woman while in police custody or prison/judicial custody (specifically by a Judicial Magistrate), (2) Death resulting from police firing, (3) Suicide or suspicious death of a woman within 7 years of marriage, and (4) Ordering the disinterment (exhumation) of a buried corpse for medico-legal examination.',
    hint: 'Think of custodial deaths, police firing, dowry deaths within 7 years of marriage, and exhumation orders under Section 196 BNSS (formerly Sec 176 CrPC).',
    points: 10
  },
  {
    id: 'fm-q25',
    question: 'Under Indian statutory law on "Grievous Hurt" (Section 116 of the Bharatiya Nyaya Sanhita [BNS], 2023 / formerly Section 320 IPC) and "Dying Declaration" (Section 26(a) of the Bharatiya Sakshya Adhiniyam [BSA], 2023 / formerly Section 32(1) IEA), which statement is legally and medically accurate?',
    options: [
      'A dying declaration is legally inadmissible unless the patient is under oath and cross-examined by defense counsel at the bedside',
      'Before recording a Dying Declaration, the attending doctor must certify "Compos Mentis" (mental fitness to give a statement), though oath is NOT required; under Section 116 BNS, Grievous Hurt comprises 8 specific clauses including emasculation, permanent privation of sight/hearing, permanent disfiguration of head/face, fracture/dislocation of a bone or tooth, and hurt endangering life or causing the sufferer to be in severe bodily pain or unable to follow ordinary pursuits for 15 days (reduced from 20 days under old Section 320 IPC)',
      'Loss of a deciduous (milk) tooth without pain or bleeding is classified as emasculation under Clause 1 of Grievous Hurt',
      'If a patient survives after giving a Dying Declaration, the statement continues to be admissible as a substantive Dying Declaration under Section 26(a) BSA'
    ],
    correctAnswerIndex: 1,
    explanation: 'Under Section 26(a) of the Bharatiya Sakshya Adhiniyam (BSA), 2023 [formerly Section 32(1) IEA], a Dying Declaration is a statement (verbal, written, or by gestures) made by a person regarding the cause or circumstances of their death. No oath is administered (under the principle "nemo moriturus praesumitur mentiri" — a dying person does not meet their Maker with a lie on their lips), and the doctor\'s primary role is to certify "Compos Mentis" (conscious, oriented mental fitness). If the declarant survives, the statement ceases to be a Dying Declaration and can only be used as a corroborative/contradictory statement (under Sec 160/148 BSA). Under Section 116 of the Bharatiya Nyaya Sanhita (BNS), 2023 [formerly Section 320 IPC], Grievous Hurt includes 8 clauses: (1) Emasculation, (2) Permanent privation of sight of either eye, (3) Permanent privation of hearing of either ear, (4) Privation of any member or joint, (5) Destruction/permanent impairing of powers of any member or joint, (6) Permanent disfiguration of head or face, (7) Fracture or dislocation of a bone or tooth, and (8) Any hurt which endangers life or causes the sufferer to be during the space of 15 days (updated in BNS from 20 days in IPC) in severe bodily pain or unable to follow ordinary pursuits.',
    hint: 'Remember the doctor\'s certification of "Compos Mentis" for a Dying Declaration and the BNS update from 20 days to 15 days in Clause 8 of Grievous Hurt.',
    points: 10
  }
];
