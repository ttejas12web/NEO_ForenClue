import { QuizQuestion } from '@/types/quiz';

// Beginner teaching illustrations, authored for this quiz. No real case photographs.
// Terminology: NIST OSAC / ASB TR 033: https://www.nist.gov/system/files/documents/2017/11/15/bpa_terms_and_definitions_in_bloodstain_pattern_analysis.pdf
// Pattern interpretation requires context; no stain-size-to-weapon or exact-time claims.
export const BLOOD_STAIN_QUESTIONS: QuizQuestion[] = [
  {
    "id": "bpa-basic-20260911-1",
    "question": "A drop falls straight down under gravity onto a smooth floor. Which stain is shown?",
    "options": [
      "Cast-off pattern",
      "Drip stain",
      "Swipe",
      "Void"
    ],
    "correctAnswerIndex": 1,
    "explanation": "A drop released by gravity produces a drip stain. A near-perpendicular impact on a smooth surface often leaves a roughly circular mark.",
    "hint": "Think about a single falling drop.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2001%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%22380%22%20cy%3D%22220%22%20r%3D%2257%22%20%2F%3E%3Ccircle%20cx%3D%22380%22%20cy%3D%22113%22%20r%3D%2210%22%20%2F%3E%3Cpath%20d%3D%22M380%20136v24m-8-8%208%208%208-8%22%20fill%3D%22none%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%223%22%2F%3E%3Ctext%20x%3D%22270%22%20y%3D%22320%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3ESmooth%2C%20horizontal%20surface%3C%2Ftext%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 1: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-2",
    "question": "Blood collects in one place on a level floor. What is the broad accumulation shown?",
    "options": [
      "Pool",
      "Drip trail",
      "Cast-off pattern",
      "Transfer impression"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A pool is an accumulation of liquid blood on a surface. Its outline depends on the surface and available space; size alone does not provide an exact blood volume.",
    "hint": "Look for accumulation rather than separate traveling drops.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2002%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M200%20180C245%20105%20410%20107%20485%20149C615%20172%20575%20285%20472%20302C360%20335%20193%20285%20190%20224Z%22%2F%3E%3Cpath%20d%3D%22M234%20177C300%20144%20410%20142%20460%20165%22%20stroke%3D%22%23dc6666%22%20stroke-width%3D%225%22%20fill%3D%22none%22%2F%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 2: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-3",
    "question": "The picture shows blood running down a vertical surface. Which pattern fits best?",
    "options": [
      "Satellite stains",
      "Void",
      "Flow pattern",
      "Footwear transfer"
    ],
    "correctAnswerIndex": 2,
    "explanation": "A flow pattern develops as liquid blood moves along a surface under gravity. The direction of the surface and any movement of it affect the path.",
    "hint": "Consider what gravity does to liquid on a wall.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2003%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cellipse%20cx%3D%22350%22%20cy%3D%22122%22%20rx%3D%22100%22%20ry%3D%2228%22%2F%3E%3Cpath%20d%3D%22M285%20127v155q0%2028%2017%2028t17-28V139M350%20135v184q0%2016%2012%2016t12-16V136M409%20134v120q0%2017%2012%2017t12-17V131%22%2F%3E%3Cpath%20d%3D%22M570%20135v145m-10-12%2010%2012%2010-12%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%223%22%20fill%3D%22none%22%2F%3E%3Ctext%20x%3D%22538%22%20y%3D%22320%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3EDown%3C%2Ftext%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 3: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-4",
    "question": "Which pattern is shown by the repeated tread-shaped marks in this image?",
    "options": [
      "Impact spatter",
      "Pool",
      "Drip stain",
      "Transfer impression"
    ],
    "correctAnswerIndex": 3,
    "explanation": "A blood-bearing surface can leave an impression when it contacts another surface. A tread-like design supports a footwear contact interpretation, but does not identify one specific shoe by itself.",
    "hint": "Look for a recognizable contact design.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2004%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cg%20transform%3D%22translate(260%2090)%20rotate(-12%20100%20120)%22%3E%3Crect%20x%3D%2222%22%20y%3D%2210%22%20width%3D%22125%22%20height%3D%22170%22%20rx%3D%2257%22%20fill%3D%22%23fef2f2%22%20stroke%3D%22%23991b1b%22%20stroke-width%3D%224%22%2F%3E%3Cpath%20d%3D%22M42%2035l35%2012%2048-12v13l-48%2012-35-12z%22%2F%3E%3Cpath%20d%3D%22M42%2060l35%2012%2048-12v13l-48%2012-35-12z%22%2F%3E%3Cpath%20d%3D%22M42%2085l35%2012%2048-12v13l-48%2012-35-12z%22%2F%3E%3Cpath%20d%3D%22M42%20110l35%2012%2048-12v13l-48%2012-35-12z%22%2F%3E%3Cpath%20d%3D%22M42%20135l35%2012%2048-12v13l-48%2012-35-12z%22%2F%3E%3Crect%20x%3D%2237%22%20y%3D%22197%22%20width%3D%22100%22%20height%3D%2260%22%20rx%3D%2215%22%2F%3E%3Cpath%20d%3D%22M48%20211h77%22%20stroke%3D%22white%22%20stroke-width%3D%226%22%2F%3E%3Cpath%20d%3D%22M48%20229h77%22%20stroke%3D%22white%22%20stroke-width%3D%226%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 4: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-5",
    "question": "A bloody object slides across an initially clean surface, leaving this smear. What is it called?",
    "options": [
      "Swipe",
      "Wipe",
      "Pool",
      "Drip trail"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A swipe transfers blood from a blood-bearing surface while the two surfaces move relative to one another. In this scenario, new blood is deposited onto the clean target.",
    "hint": "Was blood present on the target before contact?",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2005%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%2290%22%20y%3D%22120%22%20width%3D%22110%22%20height%3D%22170%22%20rx%3D%2222%22%20fill%3D%22%23fecaca%22%2F%3E%3Cpath%20d%3D%22M120%20145Q290%20130%20600%20155%22%20stroke%3D%22%23991b1b%22%20stroke-width%3D%2219%22%20opacity%3D%221%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M120%20169Q290%20154%20577%20179%22%20stroke%3D%22%23991b1b%22%20stroke-width%3D%2217%22%20opacity%3D%220.88%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M120%20194Q290%20179%20554%20204%22%20stroke%3D%22%23991b1b%22%20stroke-width%3D%2215%22%20opacity%3D%220.76%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M120%20220Q290%20205%20531%20230%22%20stroke%3D%22%23991b1b%22%20stroke-width%3D%2213%22%20opacity%3D%220.64%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M120%20245Q290%20230%20508%20255%22%20stroke%3D%22%23991b1b%22%20stroke-width%3D%2211%22%20opacity%3D%220.52%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M120%20267Q290%20252%20485%20277%22%20stroke%3D%22%23991b1b%22%20stroke-width%3D%229%22%20opacity%3D%220.4%22%20fill%3D%22none%22%2F%3E%3Ctext%20x%3D%2290%22%20y%3D%22330%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3EBlood-bearing%20object%20moves%20across%20a%20clean%20surface%3C%2Ftext%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 5: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-6",
    "question": "An object moves through a wet bloodstain already on the surface. Which pattern results?",
    "options": [
      "Swipe",
      "Cast-off pattern",
      "Wipe",
      "Void"
    ],
    "correctAnswerIndex": 2,
    "explanation": "A wipe alters a pre-existing wet bloodstain through movement of an object. Unlike a swipe onto a clean target, the blood was already there.",
    "hint": "Focus on the order: blood first, object movement second.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2006%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cellipse%20cx%3D%22335%22%20cy%3D%22216%22%20rx%3D%22175%22%20ry%3D%2294%22%2F%3E%3Cpath%20d%3D%22M130%20205Q330%20220%20560%20188%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%2255%22%2F%3E%3Cpath%20d%3D%22M160%20235Q350%20246%20576%20208%22%20fill%3D%22none%22%20stroke%3D%22%23fca5a5%22%20stroke-width%3D%2210%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%22335%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3EAn%20object%20passes%20through%20blood%20already%20on%20the%20surface%3C%2Ftext%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 6: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-7",
    "question": "A blood-bearing object swings and releases the drops shown in an arc. Which pattern is most consistent?",
    "options": [
      "Pool",
      "Cast-off pattern",
      "Flow pattern",
      "Drip stain"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Cast-off describes drops released from an object because it is moving. An arc can support this mechanism in context, but cannot on its own establish a weapon type or number of blows.",
    "hint": "Consider how motion releases drops from an object.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2007%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%22178.0939823495241%22%20cy%3D%22227.4848585920874%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22196.9983058370205%22%20cy%3D%22200.6437667033444%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22221.81589250689953%22%20cy%3D%22176.85157139959438%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22251.74482125016934%22%20cy%3D%22156.87706071398205%22%20r%3D%228%22%20%2F%3E%3Ccircle%20cx%3D%22285.8180101322324%22%20cy%3D%22141.36566330859483%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22322.934465338555%22%20cy%3D%22130.81859298696665%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22361.8948571632783%22%20cy%3D%22125.57665316570058%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22401.44027348757163%22%20cy%3D%22125.80922462507371%22%20r%3D%228%22%20%2F%3E%3Ccircle%20cx%3D%22440.2928985215211%22%20cy%3D%22131.50879237319333%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22477.19730237305413%22%20cy%3D%22142.49118847503243%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22510.96100726997713%22%20cy%3D%22158.4015429999032%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22540.4930196344387%22%20cy%3D%22178.72575079669835%22%20r%3D%228%22%20%2F%3E%3Ccircle%20cx%3D%22564.839082937748%22%20cy%3D%22202.80708357541155%22%20r%3D%225%22%20%2F%3E%3Cpath%20d%3D%22M290%20294l65-62%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%2220%22%2F%3E%3Cpath%20d%3D%22M340%20246l20-20%22%20stroke%3D%22%23991b1b%22%20stroke-width%3D%2221%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%22345%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3EDrops%20released%20as%20a%20blood-bearing%20object%20swings%3C%2Ftext%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 7: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-8",
    "question": "Case 1: A wall has stains around a clear rectangular area. Which term describes this unstained gap?",
    "options": [
      "Wipe",
      "Transfer impression",
      "Pool",
      "Void"
    ],
    "correctAnswerIndex": 3,
    "explanation": "A void is an absence of bloodstains in an otherwise stained area. An intervening object is one possible explanation; the outline alone does not prove what the object was or that it was stolen.",
    "hint": "Describe the gap before deciding what caused it.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2008%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%2270%22%20cy%3D%22100%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22167%22%20cy%3D%22153%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22264%22%20cy%3D%22206%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22361%22%20cy%3D%22259%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22458%22%20cy%3D%22312%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22555%22%20cy%3D%22135%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22652%22%20cy%3D%22188%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22139%22%20cy%3D%22241%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22236%22%20cy%3D%22294%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22333%22%20cy%3D%22117%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22430%22%20cy%3D%22170%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22527%22%20cy%3D%22223%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22624%22%20cy%3D%22276%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22111%22%20cy%3D%22329%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22208%22%20cy%3D%22152%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22305%22%20cy%3D%22205%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22402%22%20cy%3D%22258%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22499%22%20cy%3D%22311%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22596%22%20cy%3D%22134%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%2283%22%20cy%3D%22187%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22180%22%20cy%3D%22240%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22277%22%20cy%3D%22293%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22374%22%20cy%3D%22116%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22471%22%20cy%3D%22169%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22568%22%20cy%3D%22222%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%22275%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22152%22%20cy%3D%22328%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22249%22%20cy%3D%22151%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22346%22%20cy%3D%22204%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22443%22%20cy%3D%22257%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22540%22%20cy%3D%22310%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22637%22%20cy%3D%22133%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22124%22%20cy%3D%22186%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22221%22%20cy%3D%22239%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22318%22%20cy%3D%22292%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22415%22%20cy%3D%22115%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22512%22%20cy%3D%22168%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22609%22%20cy%3D%22221%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%2296%22%20cy%3D%22274%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22193%22%20cy%3D%22327%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22290%22%20cy%3D%22150%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22387%22%20cy%3D%22203%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22484%22%20cy%3D%22256%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22581%22%20cy%3D%22309%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22678%22%20cy%3D%22132%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22165%22%20cy%3D%22185%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22262%22%20cy%3D%22238%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22359%22%20cy%3D%22291%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22456%22%20cy%3D%22114%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22553%22%20cy%3D%22167%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22650%22%20cy%3D%22220%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22137%22%20cy%3D%22273%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22234%22%20cy%3D%22326%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22331%22%20cy%3D%22149%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22428%22%20cy%3D%22202%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22525%22%20cy%3D%22255%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22622%22%20cy%3D%22308%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22109%22%20cy%3D%22131%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22206%22%20cy%3D%22184%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22303%22%20cy%3D%22237%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22400%22%20cy%3D%22290%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22497%22%20cy%3D%22113%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22594%22%20cy%3D%22166%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%2281%22%20cy%3D%22219%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22178%22%20cy%3D%22272%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22275%22%20cy%3D%22325%22%20r%3D%223%22%20%2F%3E%3Crect%20x%3D%22285%22%20y%3D%22130%22%20width%3D%22190%22%20height%3D%22145%22%20fill%3D%22white%22%20stroke%3D%22%2394a3b8%22%20stroke-dasharray%3D%225%205%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22265%22%20y%3D%22325%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3EUnstained%20region%3C%2Ftext%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 8: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-9",
    "question": "Case 2: Separate blood drops form a route between two rooms. What pattern is shown?",
    "options": [
      "Flow pattern",
      "Swipe",
      "Drip trail",
      "Pool"
    ],
    "correctAnswerIndex": 2,
    "explanation": "A drip trail is a sequence of drip stains deposited as the source moves between locations. The source could be a bleeding person or a blood-bearing object. Spacing alone cannot establish an exact speed.",
    "hint": "Look at the arrangement of separate drops along a route.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2009%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%2265%22%20y%3D%22123%22%20width%3D%22630%22%20height%3D%22164%22%20fill%3D%22%23f1f5f9%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Cellipse%20cx%3D%22115%22%20cy%3D%22200%22%20rx%3D%2222%22%20ry%3D%2215%22%2F%3E%3Cellipse%20cx%3D%22211%22%20cy%3D%22219%22%20rx%3D%2222%22%20ry%3D%2215%22%2F%3E%3Cellipse%20cx%3D%22302%22%20cy%3D%22200%22%20rx%3D%2222%22%20ry%3D%2215%22%2F%3E%3Cellipse%20cx%3D%22406%22%20cy%3D%22219%22%20rx%3D%2222%22%20ry%3D%2215%22%2F%3E%3Cellipse%20cx%3D%22503%22%20cy%3D%22200%22%20rx%3D%2222%22%20ry%3D%2215%22%2F%3E%3Cellipse%20cx%3D%22609%22%20cy%3D%22219%22%20rx%3D%2222%22%20ry%3D%2215%22%2F%3E%3Ctext%20x%3D%2265%22%20y%3D%22104%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3ERoom%20A%3C%2Ftext%3E%3Ctext%20x%3D%22620%22%20y%3D%22104%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3ERoom%20B%3C%2Ftext%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 9: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-10",
    "question": "In the image, X points to a small stain separate from the main stain. What is it?",
    "options": [
      "Satellite stain",
      "Spine",
      "Parent stain",
      "Void"
    ],
    "correctAnswerIndex": 0,
    "explanation": "A satellite stain is a smaller separate stain around a larger stain. A spine is an attached pointed extension of a stain edge; the large central deposit is the parent stain.",
    "hint": "Check whether the small mark is attached to the main stain.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2010%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M330%20128L344%20157Q386%20139%20415%20174L450%20169L433%20196Q462%20229%20430%20258L440%20283L404%20270Q366%20299%20337%20271L306%20289L316%20255Q288%20231%20310%20194L287%20174L320%20176Z%22%2F%3E%3Ccircle%20cx%3D%22488%22%20cy%3D%22145%22%20r%3D%2210%22%20%2F%3E%3Ccircle%20cx%3D%22514%22%20cy%3D%22251%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22260%22%20cy%3D%22274%22%20r%3D%228%22%20%2F%3E%3Ccircle%20cx%3D%22286%22%20cy%3D%22114%22%20r%3D%226%22%20%2F%3E%3Cpath%20d%3D%22M488%20145l80-26%22%20stroke%3D%22%23334155%22%20stroke-width%3D%222%22%20fill%3D%22none%22%2F%3E%3Ctext%20x%3D%22576%22%20y%3D%22119%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3EX%3C%2Ftext%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 10: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-11",
    "question": "For this idealized directional stain, which way does the pointed end suggest the drop traveled?",
    "options": [
      "Toward the left",
      "Toward the right",
      "Straight upward out of the image",
      "It proves movement in both directions"
    ],
    "correctAnswerIndex": 1,
    "explanation": "For a suitable directional stain, the pointed end indicates the direction of travel along the target surface. Here it points right. Surface texture and distortion must be considered when interpreting real stains.",
    "hint": "Inspect which end is narrow and pointed.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2011%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cellipse%20cx%3D%22335%22%20cy%3D%22217%22%20rx%3D%2295%22%20ry%3D%2240%22%2F%3E%3Cpath%20d%3D%22M390%20180L525%20217L390%20254Z%22%2F%3E%3Ctext%20x%3D%2290%22%20y%3D%22220%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3ELeft%3C%2Ftext%3E%3Ctext%20x%3D%22588%22%20y%3D%22220%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3ERight%3C%2Ftext%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 11: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-12",
    "question": "This image shows many small stains. What can you safely conclude from their size alone?",
    "options": [
      "A gunshot definitely occurred",
      "The exact weapon is known",
      "The force had one exact speed",
      "The cause cannot be determined from size alone"
    ],
    "correctAnswerIndex": 3,
    "explanation": "Small stains can occur through different mechanisms. Size alone cannot reliably establish a gunshot, weapon, or impact speed; distribution, surface, other features and scene evidence are needed.",
    "hint": "Separate what you observe from what you infer.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2012%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%2270%22%20cy%3D%22100%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22167%22%20cy%3D%22153%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22264%22%20cy%3D%22206%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22361%22%20cy%3D%22259%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22458%22%20cy%3D%22312%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22555%22%20cy%3D%22135%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22652%22%20cy%3D%22188%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22139%22%20cy%3D%22241%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22236%22%20cy%3D%22294%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22333%22%20cy%3D%22117%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22430%22%20cy%3D%22170%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22527%22%20cy%3D%22223%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22624%22%20cy%3D%22276%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22111%22%20cy%3D%22329%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22208%22%20cy%3D%22152%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22305%22%20cy%3D%22205%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22402%22%20cy%3D%22258%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22499%22%20cy%3D%22311%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22596%22%20cy%3D%22134%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%2283%22%20cy%3D%22187%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22180%22%20cy%3D%22240%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22277%22%20cy%3D%22293%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22374%22%20cy%3D%22116%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22471%22%20cy%3D%22169%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22568%22%20cy%3D%22222%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22665%22%20cy%3D%22275%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22152%22%20cy%3D%22328%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22249%22%20cy%3D%22151%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22346%22%20cy%3D%22204%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22443%22%20cy%3D%22257%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22540%22%20cy%3D%22310%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22637%22%20cy%3D%22133%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22124%22%20cy%3D%22186%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22221%22%20cy%3D%22239%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22318%22%20cy%3D%22292%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22415%22%20cy%3D%22115%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22512%22%20cy%3D%22168%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22609%22%20cy%3D%22221%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%2296%22%20cy%3D%22274%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22193%22%20cy%3D%22327%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22290%22%20cy%3D%22150%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22387%22%20cy%3D%22203%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22484%22%20cy%3D%22256%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22581%22%20cy%3D%22309%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22678%22%20cy%3D%22132%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22165%22%20cy%3D%22185%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22262%22%20cy%3D%22238%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22359%22%20cy%3D%22291%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22456%22%20cy%3D%22114%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22553%22%20cy%3D%22167%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22650%22%20cy%3D%22220%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22137%22%20cy%3D%22273%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22234%22%20cy%3D%22326%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22331%22%20cy%3D%22149%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22428%22%20cy%3D%22202%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22525%22%20cy%3D%22255%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22622%22%20cy%3D%22308%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22109%22%20cy%3D%22131%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%22206%22%20cy%3D%22184%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22303%22%20cy%3D%22237%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22400%22%20cy%3D%22290%22%20r%3D%223%22%20%2F%3E%3Ccircle%20cx%3D%22497%22%20cy%3D%22113%22%20r%3D%224%22%20%2F%3E%3Ccircle%20cx%3D%22594%22%20cy%3D%22166%22%20r%3D%225%22%20%2F%3E%3Ccircle%20cx%3D%2281%22%20cy%3D%22219%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22178%22%20cy%3D%22272%22%20r%3D%227%22%20%2F%3E%3Ccircle%20cx%3D%22275%22%20cy%3D%22325%22%20r%3D%223%22%20%2F%3E%3Ctext%20x%3D%22165%22%20y%3D%22345%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3EMany%20small%20stains%3B%20no%20other%20scene%20information%20supplied%3C%2Ftext%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 12: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-13",
    "question": "Which property tends to pull a small airborne blood drop into a rounded shape?",
    "options": [
      "Gravity alone",
      "Clotting",
      "Surface tension",
      "Evaporation"
    ],
    "correctAnswerIndex": 2,
    "explanation": "Surface tension tends to minimize surface area, making a small free drop approximately spherical. Moving drops may oscillate or deform; they are not invariably perfect spheres or drawn-out teardrops.",
    "hint": "Think about the liquid surface pulling inward.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2013%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Ccircle%20cx%3D%22380%22%20cy%3D%22205%22%20r%3D%2272%22%20%2F%3E%3Cpath%20d%3D%22M250%20205h40m-10-8%2010%208-10%208M510%20205h-40m10-8-10%208%2010%208M380%2082v40m-8-10%208%2010%208-10M380%20328v-40m-8%2010%208-10%208%2010%22%20stroke%3D%22%23475569%22%20stroke-width%3D%223%22%20fill%3D%22none%22%2F%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 13: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-14",
    "question": "What does viscosity mean when discussing blood?",
    "options": [
      "Its resistance to flowing",
      "Its red colour",
      "Its ability to identify a person",
      "Its drying time"
    ],
    "correctAnswerIndex": 0,
    "explanation": "Viscosity means resistance to flow. Blood is generally more viscous than water, but its measured viscosity varies with temperature, cell concentration and flow conditions. It is not a fixed clotting or drying time.",
    "hint": "Think of how easily a liquid flows.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2014%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%22170%22%20y%3D%22110%22%20width%3D%22155%22%20height%3D%22210%22%20rx%3D%2215%22%20fill%3D%22%23dbeafe%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%2F%3E%3Crect%20x%3D%22435%22%20y%3D%22110%22%20width%3D%22155%22%20height%3D%22210%22%20rx%3D%2215%22%20fill%3D%22%23fee2e2%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%222%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%2295%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3EWater%3C%2Ftext%3E%3Ctext%20x%3D%22470%22%20y%3D%2295%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3EBlood%3C%2Ftext%3E%3Cpath%20d%3D%22M210%20151v115m-8-10%208%2010%208-10%22%20stroke%3D%22%232563eb%22%20stroke-width%3D%228%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M480%20151v65m-8-10%208%2010%208-10%22%20stroke%3D%22%23991b1b%22%20stroke-width%3D%228%22%20fill%3D%22none%22%2F%3E%3Ctext%20x%3D%22192%22%20y%3D%22350%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3EResistance%20to%20flow%20differs%3C%2Ftext%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 14: illustrative observation for this question (not a case photograph)"
  },
  {
    "id": "bpa-basic-20260911-15",
    "question": "Similar drops hit glass and rough concrete under comparable conditions. Why may their edges differ?",
    "options": [
      "The blood group must be different",
      "The roughness of the target affects spreading and breakup",
      "Rough edges always prove a gunshot",
      "Every drop must leave the same shape"
    ],
    "correctAnswerIndex": 1,
    "explanation": "Surface texture affects how a drop spreads and breaks up. Rough surfaces may produce irregular edges and secondary stains. Drop size, impact angle and speed also matter; texture does not determine every feature alone.",
    "hint": "Compare the two target surfaces.",
    "points": 10,
    "image": "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20760%20420%22%3E%3Crect%20width%3D%22760%22%20height%3D%22420%22%20rx%3D%2220%22%20fill%3D%22%23f8fafc%22%2F%3E%3Crect%20x%3D%2218%22%20y%3D%2218%22%20width%3D%22724%22%20height%3D%22384%22%20rx%3D%2214%22%20fill%3D%22white%22%20stroke%3D%22%23cbd5e1%22%2F%3E%3Ctext%20x%3D%2242%22%20y%3D%2254%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2219%22%20font-weight%3D%22700%22%20fill%3D%22%230f172a%22%3EOBSERVATION%2015%3C%2Ftext%3E%3Cg%20fill%3D%22%23991b1b%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Crect%20x%3D%2265%22%20y%3D%22104%22%20width%3D%22295%22%20height%3D%22225%22%20rx%3D%2210%22%20fill%3D%22%23eff6ff%22%2F%3E%3Crect%20x%3D%22400%22%20y%3D%22104%22%20width%3D%22295%22%20height%3D%22225%22%20rx%3D%2210%22%20fill%3D%22%23f1f5f9%22%2F%3E%3Ccircle%20cx%3D%22210%22%20cy%3D%22220%22%20r%3D%2254%22%20%2F%3E%3Cpath%20d%3D%22M536%20150L550%20168L570%20156L575%20185L609%20182L596%20207L625%20224L600%20242L605%20270L576%20267L559%20290L545%20270L512%20280L516%20250L488%20234L509%20212L493%20186L525%20184Z%22%2F%3E%3Ccircle%20cx%3D%22643%22%20cy%3D%22190%22%20r%3D%226%22%20%2F%3E%3Ccircle%20cx%3D%22469%22%20cy%3D%22277%22%20r%3D%227%22%20%2F%3E%3Ctext%20x%3D%22150%22%20y%3D%2290%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3ESmooth%20glass%3C%2Ftext%3E%3Ctext%20x%3D%22480%22%20y%3D%2290%22%20fill%3D%22%23334155%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%3ERough%20concrete%3C%2Ftext%3E%3C%2Fg%3E%3Ctext%20x%3D%2242%22%20y%3D%22382%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2364748b%22%3EIllustrative%20teaching%20diagram%20%E2%80%A2%20Not%20a%20crime-scene%20photograph%20%E2%80%A2%20Not%20to%20scale%3C%2Ftext%3E%3C%2Fsvg%3E",
    "imageCaption": "Figure 15: illustrative observation for this question (not a case photograph)"
  }
];
