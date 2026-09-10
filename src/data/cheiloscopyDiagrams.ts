/**
 * Forensic Cheiloscopy Reference Diagrams
 * Vector SVG Data URIs for educational clarity and zero-latency rendering
 */

const svgToDataUri = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
};

// 1. Suzuki & Tsuchihashi Classification (6 types)
export const SUZUKI_CLASSIFICATION_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%" style="background:#0f172a; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="500" fill="#0f172a" rx="16"/>
  <rect x="15" y="15" width="770" height="470" fill="none" stroke="#334155" stroke-width="1.5" rx="12"/>
  
  <!-- Header -->
  <text x="400" y="45" fill="#f8fafc" font-size="20" font-weight="800" text-anchor="middle" letter-spacing="1">SUZUKI &amp; TSUCHIHASHI CLASSIFICATION</text>
  <text x="400" y="68" fill="#94a3b8" font-size="12" text-anchor="middle">Morphological Types of Sulci Labiorum (Lip Grooves)</text>

  <!-- Grid of 6 Types: 3 columns x 2 rows -->
  <!-- Row 1 -->
  <!-- Type I -->
  <g transform="translate(40, 95)">
    <rect width="220" height="170" fill="#1e293b" rx="10" stroke="#475569" stroke-width="1"/>
    <rect x="10" y="10" width="200" height="26" fill="#3b82f6" fill-opacity="0.15" rx="6"/>
    <text x="110" y="27" fill="#60a5fa" font-size="13" font-weight="700" text-anchor="middle">TYPE I</text>
    <rect x="40" y="48" width="140" height="85" fill="#334155" rx="8" stroke="#64748b" stroke-width="1"/>
    <line x1="60" y1="50" x2="60" y2="131" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="85" y1="50" x2="85" y2="131" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="110" y1="50" x2="110" y2="131" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="135" y1="50" x2="135" y2="131" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="160" y1="50" x2="160" y2="131" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <text x="110" y="152" fill="#cbd5e1" font-size="11" text-anchor="middle">Complete vertical grooves</text>
  </g>

  <!-- Type I' (Prime) -->
  <g transform="translate(290, 95)">
    <rect width="220" height="170" fill="#1e293b" rx="10" stroke="#475569" stroke-width="1"/>
    <rect x="10" y="10" width="200" height="26" fill="#06b6d4" fill-opacity="0.15" rx="6"/>
    <text x="110" y="27" fill="#22d3ee" font-size="13" font-weight="700" text-anchor="middle">TYPE I'</text>
    <rect x="40" y="48" width="140" height="85" fill="#334155" rx="8" stroke="#64748b" stroke-width="1"/>
    <line x1="60" y1="50" x2="60" y2="95" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="85" y1="75" x2="85" y2="131" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="110" y1="55" x2="110" y2="105" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="135" y1="80" x2="135" y2="131" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="160" y1="60" x2="160" y2="100" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <text x="110" y="152" fill="#cbd5e1" font-size="11" text-anchor="middle">Incomplete vertical grooves</text>
  </g>

  <!-- Type II -->
  <g transform="translate(540, 95)">
    <rect width="220" height="170" fill="#1e293b" rx="10" stroke="#475569" stroke-width="1"/>
    <rect x="10" y="10" width="200" height="26" fill="#10b981" fill-opacity="0.15" rx="6"/>
    <text x="110" y="27" fill="#34d399" font-size="13" font-weight="700" text-anchor="middle">TYPE II</text>
    <rect x="40" y="48" width="140" height="85" fill="#334155" rx="8" stroke="#64748b" stroke-width="1"/>
    <line x1="75" y1="131" x2="75" y2="90" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="75" y1="90" x2="60" y2="55" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="75" y1="90" x2="90" y2="55" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="140" y1="131" x2="140" y2="85" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="140" y1="85" x2="125" y2="52" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="140" y1="85" x2="155" y2="52" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <text x="110" y="152" fill="#cbd5e1" font-size="11" text-anchor="middle">Branched / bifurcated grooves</text>
  </g>

  <!-- Row 2 -->
  <!-- Type III -->
  <g transform="translate(40, 285)">
    <rect width="220" height="170" fill="#1e293b" rx="10" stroke="#475569" stroke-width="1"/>
    <rect x="10" y="10" width="200" height="26" fill="#f59e0b" fill-opacity="0.15" rx="6"/>
    <text x="110" y="27" fill="#fbbf24" font-size="13" font-weight="700" text-anchor="middle">TYPE III</text>
    <rect x="40" y="48" width="140" height="85" fill="#334155" rx="8" stroke="#64748b" stroke-width="1"/>
    <line x1="60" y1="55" x2="100" y2="125" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="100" y1="55" x2="60" y2="125" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="120" y1="55" x2="160" y2="125" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="160" y1="55" x2="120" y2="125" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <text x="110" y="152" fill="#cbd5e1" font-size="11" text-anchor="middle">Intersecting / cross grooves</text>
  </g>

  <!-- Type IV -->
  <g transform="translate(290, 285)">
    <rect width="220" height="170" fill="#1e293b" rx="10" stroke="#475569" stroke-width="1"/>
    <rect x="10" y="10" width="200" height="26" fill="#8b5cf6" fill-opacity="0.15" rx="6"/>
    <text x="110" y="27" fill="#a78bfa" font-size="13" font-weight="700" text-anchor="middle">TYPE IV</text>
    <rect x="40" y="48" width="140" height="85" fill="#334155" rx="8" stroke="#64748b" stroke-width="1"/>
    <line x1="70" y1="50" x2="70" y2="131" stroke="#f1f5f9" stroke-width="2"/>
    <line x1="100" y1="50" x2="100" y2="131" stroke="#f1f5f9" stroke-width="2"/>
    <line x1="130" y1="50" x2="130" y2="131" stroke="#f1f5f9" stroke-width="2"/>
    <line x1="150" y1="50" x2="150" y2="131" stroke="#f1f5f9" stroke-width="2"/>
    <line x1="42" y1="70" x2="178" y2="70" stroke="#f1f5f9" stroke-width="2"/>
    <line x1="42" y1="92" x2="178" y2="92" stroke="#f1f5f9" stroke-width="2"/>
    <line x1="42" y1="114" x2="178" y2="114" stroke="#f1f5f9" stroke-width="2"/>
    <text x="110" y="152" fill="#cbd5e1" font-size="11" text-anchor="middle">Reticular / mesh network</text>
  </g>

  <!-- Type V -->
  <g transform="translate(540, 285)">
    <rect width="220" height="170" fill="#1e293b" rx="10" stroke="#475569" stroke-width="1"/>
    <rect x="10" y="10" width="200" height="26" fill="#ec4899" fill-opacity="0.15" rx="6"/>
    <text x="110" y="27" fill="#f472b6" font-size="13" font-weight="700" text-anchor="middle">TYPE V</text>
    <rect x="40" y="48" width="140" height="85" fill="#334155" rx="8" stroke="#64748b" stroke-width="1"/>
    <path d="M 60,65 Q 85,90 65,120 M 100,55 Q 90,85 115,100 Q 125,115 105,125 M 140,65 C 160,80 130,105 155,125" fill="none" stroke="#f1f5f9" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="85" cy="70" r="2" fill="#f1f5f9"/>
    <circle cx="130" cy="80" r="2" fill="#f1f5f9"/>
    <text x="110" y="152" fill="#cbd5e1" font-size="11" text-anchor="middle">Undetermined / other pattern</text>
  </g>
</svg>
`);

// 2. Lip Quadrant Anatomical Mapping
export const QUADRANT_MAPPING_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="45" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">FOUR-QUADRANT LIP DIVISION PROTOCOL</text>
  <text x="400" y="68" fill="#94a3b8" font-size="12" text-anchor="middle">Topographical Division for Examination and Recording</text>

  <!-- Lips Outline Schematic -->
  <!-- Upper Lip -->
  <path d="M 160,200 C 220,130 340,140 370,165 C 400,180 400,180 430,165 C 460,140 580,130 640,200 C 580,215 480,225 400,225 C 320,225 220,215 160,200 Z" fill="#e11d48" fill-opacity="0.25" stroke="#f43f5e" stroke-width="2.5"/>
  <!-- Lower Lip -->
  <path d="M 160,200 C 220,215 320,225 400,225 C 480,225 580,215 640,200 C 590,320 480,350 400,350 C 320,350 210,320 160,200 Z" fill="#e11d48" fill-opacity="0.2" stroke="#f43f5e" stroke-width="2.5"/>

  <!-- Dividing Axes -->
  <!-- Vertical Midline -->
  <line x1="400" y1="105" x2="400" y2="390" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6,4"/>
  <!-- Horizontal Commissural Line -->
  <line x1="120" y1="212" x2="680" y2="212" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6,4"/>

  <!-- Quadrant Labels -->
  <!-- Quadrant 1: Upper Right -->
  <rect x="200" y="110" width="170" height="42" fill="#1e293b" rx="8" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="285" y="128" fill="#60a5fa" font-size="12" font-weight="800" text-anchor="middle">QUADRANT 1 (UR)</text>
  <text x="285" y="144" fill="#cbd5e1" font-size="10" text-anchor="middle">Upper Right Labial Segment</text>

  <!-- Quadrant 2: Upper Left -->
  <rect x="430" y="110" width="170" height="42" fill="#1e293b" rx="8" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="515" y="128" fill="#60a5fa" font-size="12" font-weight="800" text-anchor="middle">QUADRANT 2 (UL)</text>
  <text x="515" y="144" fill="#cbd5e1" font-size="10" text-anchor="middle">Upper Left Labial Segment</text>

  <!-- Quadrant 3: Lower Left -->
  <rect x="430" y="360" width="170" height="42" fill="#1e293b" rx="8" stroke="#10b981" stroke-width="1.5"/>
  <text x="515" y="378" fill="#34d399" font-size="12" font-weight="800" text-anchor="middle">QUADRANT 3 (LL)</text>
  <text x="515" y="394" fill="#cbd5e1" font-size="10" text-anchor="middle">Lower Left Labial Segment</text>

  <!-- Quadrant 4: Lower Right -->
  <rect x="200" y="360" width="170" height="42" fill="#1e293b" rx="8" stroke="#10b981" stroke-width="1.5"/>
  <text x="285" y="378" fill="#34d399" font-size="12" font-weight="800" text-anchor="middle">QUADRANT 4 (LR)</text>
  <text x="285" y="394" fill="#cbd5e1" font-size="10" text-anchor="middle">Lower Right Labial Segment</text>

  <!-- Anatomical Landmarks -->
  <circle cx="400" cy="172" r="4" fill="#fbbf24"/>
  <text x="400" y="98" fill="#fbbf24" font-size="11" font-weight="700" text-anchor="middle">Labial Midline / Philtrum</text>

  <circle cx="160" cy="200" r="4" fill="#38bdf8"/>
  <text x="135" y="195" fill="#38bdf8" font-size="10" font-weight="600" text-anchor="end">Right Cheilion</text>

  <circle cx="640" cy="200" r="4" fill="#38bdf8"/>
  <text x="665" y="195" fill="#38bdf8" font-size="10" font-weight="600" text-anchor="start">Left Cheilion</text>

  <!-- Legend -->
  <rect x="220" y="420" width="360" height="28" fill="#0f172a" rx="6" stroke="#334155" stroke-width="1"/>
  <text x="400" y="438" fill="#94a3b8" font-size="11" text-anchor="middle">Oriented anatomically according to subject's right and left</text>
</svg>
`);

// 3. Martin Santos Simple vs Compound Taxonomy
export const MARTIN_SANTOS_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#0b1120; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#0b1120" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="45" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">DR. MARTINS SANTOS CLASSIFICATION (1960)</text>
  <text x="400" y="68" fill="#94a3b8" font-size="12" text-anchor="middle">Categorization of Lip Grooves into Simple and Compound Forms</text>

  <!-- Section 1: Simple Forms (1 element) -->
  <g transform="translate(40, 90)">
    <rect width="340" height="350" fill="#1e293b" rx="12" stroke="#3b82f6" stroke-width="1.5"/>
    <rect x="15" y="15" width="310" height="32" fill="#3b82f6" fill-opacity="0.2" rx="8"/>
    <text x="170" y="36" fill="#60a5fa" font-size="14" font-weight="800" text-anchor="middle">SIMPLE GROOVES</text>

    <!-- R-1 Straight -->
    <g transform="translate(25, 65)">
      <rect width="290" height="55" fill="#0f172a" rx="8"/>
      <line x1="45" y1="12" x2="45" y2="43" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
      <text x="75" y="28" fill="#f8fafc" font-size="13" font-weight="700">R-1: Straight Line</text>
      <text x="75" y="44" fill="#94a3b8" font-size="11">Rectilinear groove</text>
    </g>

    <!-- C-2 Curved -->
    <g transform="translate(25, 130)">
      <rect width="290" height="55" fill="#0f172a" rx="8"/>
      <path d="M 35,12 Q 55,27 35,43" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
      <text x="75" y="28" fill="#f8fafc" font-size="13" font-weight="700">C-2: Curved Line</text>
      <text x="75" y="44" fill="#94a3b8" font-size="11">Single curved groove</text>
    </g>

    <!-- A-3 Angular -->
    <g transform="translate(25, 195)">
      <rect width="290" height="55" fill="#0f172a" rx="8"/>
      <polyline points="35,12 55,27 35,43" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
      <text x="75" y="28" fill="#f8fafc" font-size="13" font-weight="700">A-3: Angular Line</text>
      <text x="75" y="44" fill="#94a3b8" font-size="11">Sharp angle without fork</text>
    </g>

    <!-- S-4 Sinusoidal -->
    <g transform="translate(25, 260)">
      <rect width="290" height="55" fill="#0f172a" rx="8"/>
      <path d="M 45,12 Q 35,20 45,28 Q 55,36 45,44" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
      <text x="75" y="28" fill="#f8fafc" font-size="13" font-weight="700">S-4: Sinusoidal Line</text>
      <text x="75" y="44" fill="#94a3b8" font-size="11">Undulating / wave trajectory</text>
    </g>
  </g>

  <!-- Section 2: Compound Forms (Multiple elements) -->
  <g transform="translate(420, 90)">
    <rect width="340" height="350" fill="#1e293b" rx="12" stroke="#10b981" stroke-width="1.5"/>
    <rect x="15" y="15" width="310" height="32" fill="#10b981" fill-opacity="0.2" rx="8"/>
    <text x="170" y="36" fill="#34d399" font-size="14" font-weight="800" text-anchor="middle">COMPOUND GROOVES</text>

    <!-- B-5 Bifurcated -->
    <g transform="translate(25, 75)">
      <rect width="290" height="70" fill="#0f172a" rx="8"/>
      <line x1="45" y1="52" x2="45" y2="32" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
      <line x1="45" y1="32" x2="32" y2="15" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
      <line x1="45" y1="32" x2="58" y2="15" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
      <text x="75" y="33" fill="#f8fafc" font-size="13" font-weight="700">B-5: Bifurcated</text>
      <text x="75" y="50" fill="#94a3b8" font-size="11">Two branching divisions (Y-form)</text>
    </g>

    <!-- T-6 Trifurcated -->
    <g transform="translate(25, 160)">
      <rect width="290" height="70" fill="#0f172a" rx="8"/>
      <line x1="45" y1="55" x2="45" y2="35" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
      <line x1="45" y1="35" x2="30" y2="15" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
      <line x1="45" y1="35" x2="45" y2="15" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
      <line x1="45" y1="35" x2="60" y2="15" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
      <text x="75" y="33" fill="#f8fafc" font-size="13" font-weight="700">T-6: Trifurcated</text>
      <text x="75" y="50" fill="#94a3b8" font-size="11">Three branching divisions</text>
    </g>

    <!-- An-7 Anomalous -->
    <g transform="translate(25, 245)">
      <rect width="290" height="70" fill="#0f172a" rx="8"/>
      <path d="M 35,48 C 55,50 35,28 55,20 M 42,32 L 60,38" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
      <text x="75" y="33" fill="#f8fafc" font-size="13" font-weight="700">An-7: Anomalous</text>
      <text x="75" y="50" fill="#94a3b8" font-size="11">Irregular or mixed structural forms</text>
    </g>
  </g>
</svg>
`);

// 4. Three Crime Scene Impression Types
export const CRIME_SCENE_IMPRESSIONS_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 440" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="440" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="410" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="45" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">CRIME SCENE LIP IMPRESSION CATEGORIES</text>
  <text x="400" y="68" fill="#94a3b8" font-size="12" text-anchor="middle">Physical Presentation Types Encountered in Forensic Investigation</text>

  <!-- Card 1: Patent (Visible) -->
  <g transform="translate(35, 95)">
    <rect width="225" height="300" fill="#1e293b" rx="12" stroke="#f43f5e" stroke-width="1.5"/>
    <rect x="15" y="15" width="195" height="28" fill="#f43f5e" fill-opacity="0.2" rx="6"/>
    <text x="112" y="34" fill="#fb7185" font-size="13" font-weight="800" text-anchor="middle">PATENT IMPRESSION</text>
    
    <rect x="25" y="55" width="175" height="110" fill="#0f172a" rx="8" stroke="#334155"/>
    <ellipse cx="112" cy="105" rx="45" ry="25" fill="#e11d48" opacity="0.8"/>
    <path d="M 85,105 Q 112,112 140,105" stroke="#991b1b" stroke-width="2" fill="none"/>
    <line x1="95" y1="92" x2="95" y2="118" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>
    <line x1="112" y1="90" x2="112" y2="120" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>
    <line x1="128" y1="92" x2="128" y2="118" stroke="#ffffff" stroke-width="1.5" opacity="0.6"/>

    <text x="112" y="190" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Visible Surface Transfer</text>
    <text x="112" y="210" fill="#cbd5e1" font-size="11" text-anchor="middle">Directly visible under ambient light</text>
    <text x="112" y="235" fill="#94a3b8" font-size="10" text-anchor="middle">Deposited with lipstick, blood, or paint</text>
    <text x="112" y="255" fill="#94a3b8" font-size="10" text-anchor="middle">Documented by direct 1:1 photography</text>
  </g>

  <!-- Card 2: Latent (Invisible) -->
  <g transform="translate(287, 95)">
    <rect width="225" height="300" fill="#1e293b" rx="12" stroke="#38bdf8" stroke-width="1.5"/>
    <rect x="15" y="15" width="195" height="28" fill="#38bdf8" fill-opacity="0.2" rx="6"/>
    <text x="112" y="34" fill="#7dd3fc" font-size="13" font-weight="800" text-anchor="middle">LATENT IMPRESSION</text>
    
    <rect x="25" y="55" width="175" height="110" fill="#0f172a" rx="8" stroke="#334155"/>
    <ellipse cx="112" cy="105" rx="45" ry="25" fill="#0284c7" opacity="0.2" stroke="#38bdf8" stroke-dasharray="3,2"/>
    <circle cx="112" cy="105" r="28" fill="none" stroke="#e0f2fe" stroke-width="1" stroke-dasharray="2,2"/>
    <text x="112" y="108" fill="#bae6fd" font-size="10" text-anchor="middle">Invisible Matrix</text>

    <text x="112" y="190" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Hidden Chemical Residue</text>
    <text x="112" y="210" fill="#cbd5e1" font-size="11" text-anchor="middle">Composed of saliva and surface lipids</text>
    <text x="112" y="235" fill="#94a3b8" font-size="10" text-anchor="middle">Requires optical or chemical enhancement</text>
    <text x="112" y="255" fill="#94a3b8" font-size="10" text-anchor="middle">Developed via powders, dyes, or ALS</text>
  </g>

  <!-- Card 3: Plastic (3-Dimensional) -->
  <g transform="translate(540, 95)">
    <rect width="225" height="300" fill="#1e293b" rx="12" stroke="#fbbf24" stroke-width="1.5"/>
    <rect x="15" y="15" width="195" height="28" fill="#fbbf24" fill-opacity="0.2" rx="6"/>
    <text x="112" y="34" fill="#fcd34d" font-size="13" font-weight="800" text-anchor="middle">PLASTIC IMPRESSION</text>
    
    <rect x="25" y="55" width="175" height="110" fill="#0f172a" rx="8" stroke="#334155"/>
    <rect x="50" y="75" width="125" height="70" fill="#d97706" opacity="0.3" rx="6"/>
    <path d="M 65,110 C 85,130 140,130 160,110" stroke="#fbbf24" stroke-width="3" fill="none"/>
    <line x1="85" y1="105" x2="85" y2="120" stroke="#fef3c7" stroke-width="2"/>
    <line x1="112" y1="110" x2="112" y2="126" stroke="#fef3c7" stroke-width="2"/>
    <line x1="140" y1="105" x2="140" y2="120" stroke="#fef3c7" stroke-width="2"/>

    <text x="112" y="190" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">3D Surface Indentation</text>
    <text x="112" y="210" fill="#cbd5e1" font-size="11" text-anchor="middle">Molded into a deformable substrate</text>
    <text x="112" y="235" fill="#94a3b8" font-size="10" text-anchor="middle">Found in butter, cheese, candles, soap</text>
    <text x="112" y="255" fill="#94a3b8" font-size="10" text-anchor="middle">Documented via oblique light casting</text>
  </g>
</svg>
`);

// 5. Lysochrome Dye Chemical Development Reaction
export const LYSOCHROME_REACTION_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%" style="background:#090e17; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="450" fill="#090e17" rx="16"/>
  <rect x="15" y="15" width="770" height="420" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="45" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">LYSOCHROME DYES IN LATENT LIP PRINT ENHANCEMENT</text>
  <text x="400" y="68" fill="#94a3b8" font-size="12" text-anchor="middle">Principle of Lipophilic Solvation Staining (Sudan Dyes / Oil Red O)</text>

  <!-- Left: Latent Print Residue on Glass -->
  <g transform="translate(45, 95)">
    <rect width="320" height="310" fill="#1e293b" rx="12" stroke="#475569" stroke-width="1.5"/>
    <text x="160" y="32" fill="#38bdf8" font-size="14" font-weight="700" text-anchor="middle">LATENT DEPOSIT (FATTY RESIDUE)</text>
    
    <rect x="25" y="55" width="270" height="150" fill="#0f172a" rx="8" stroke="#334155"/>
    <text x="40" y="75" fill="#64748b" font-size="11">Non-porous Substrate</text>

    <circle cx="80" cy="120" r="14" fill="#e2e8f0" fill-opacity="0.2" stroke="#94a3b8" stroke-dasharray="2,2"/>
    <circle cx="130" cy="140" r="18" fill="#e2e8f0" fill-opacity="0.2" stroke="#94a3b8" stroke-dasharray="2,2"/>
    <circle cx="180" cy="110" r="16" fill="#e2e8f0" fill-opacity="0.2" stroke="#94a3b8" stroke-dasharray="2,2"/>
    <circle cx="230" cy="135" r="12" fill="#e2e8f0" fill-opacity="0.2" stroke="#94a3b8" stroke-dasharray="2,2"/>
    <text x="160" y="180" fill="#94a3b8" font-size="11" text-anchor="middle">Lipids, sebum, and cosmetic base matrix</text>

    <text x="160" y="240" fill="#f8fafc" font-size="12" font-weight="600" text-anchor="middle">Unstained Latent State</text>
    <text x="160" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Hydrophobic lipid components remain invisible</text>
  </g>

  <!-- Arrow -->
  <g transform="translate(375, 230)">
    <polygon points="0,-12 35,0 0,12" fill="#38bdf8"/>
    <line x1="-15" y1="0" x2="30" y2="0" stroke="#38bdf8" stroke-width="4"/>
  </g>

  <!-- Right: Developed Lip Print with Sudan Black B -->
  <g transform="translate(435, 95)">
    <rect width="320" height="310" fill="#1e293b" rx="12" stroke="#10b981" stroke-width="1.5"/>
    <text x="160" y="32" fill="#34d399" font-size="14" font-weight="700" text-anchor="middle">AFTER LYSOCHROME STAINING</text>

    <rect x="25" y="55" width="270" height="150" fill="#0f172a" rx="8" stroke="#334155"/>
    <text x="40" y="75" fill="#64748b" font-size="11">Developed Grooves</text>

    <circle cx="80" cy="120" r="14" fill="#1e1b4b" stroke="#38bdf8" stroke-width="2"/>
    <circle cx="130" cy="140" r="18" fill="#1e1b4b" stroke="#38bdf8" stroke-width="2"/>
    <circle cx="180" cy="110" r="16" fill="#1e1b4b" stroke="#38bdf8" stroke-width="2"/>
    <circle cx="230" cy="135" r="12" fill="#1e1b4b" stroke="#38bdf8" stroke-width="2"/>
    
    <line x1="125" y1="126" x2="135" y2="154" stroke="#f1f5f9" stroke-width="2"/>
    <line x1="175" y1="98" x2="185" y2="122" stroke="#f1f5f9" stroke-width="2"/>

    <text x="160" y="180" fill="#34d399" font-size="11" font-weight="700" text-anchor="middle">Visualized Groove Morphology</text>

    <text x="160" y="240" fill="#f8fafc" font-size="12" font-weight="600" text-anchor="middle">Differential Solvation</text>
    <text x="160" y="262" fill="#94a3b8" font-size="11" text-anchor="middle">Dye selectively partitions into lipid phase</text>
  </g>
</svg>
`);

// 6. TLC (Thin-Layer Chromatography) Lipstick Analysis
export const TLC_CHROMATOGRAPHY_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="460" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="430" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">THIN-LAYER CHROMATOGRAPHY (TLC) OF LIPSTICK SAMPLES</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">Comparative Separation Plate and Distance Measurements</text>

  <!-- TLC Plate Simulation -->
  <g transform="translate(100, 90)">
    <!-- Silica Gel Plate -->
    <rect width="300" height="320" fill="#f1f5f9" rx="6" stroke="#94a3b8" stroke-width="2"/>
    
    <!-- Solvent Front Line (240 mm) -->
    <line x1="20" y1="40" x2="280" y2="40" stroke="#0284c7" stroke-width="2" stroke-dasharray="5,3"/>
    <text x="288" y="44" fill="#0284c7" font-size="11" font-weight="700">Solvent Front</text>

    <!-- Origin Baseline (0 mm) -->
    <line x1="20" y1="280" x2="280" y2="280" stroke="#64748b" stroke-width="1.5"/>
    <text x="288" y="284" fill="#64748b" font-size="11" font-weight="700">Origin Line</text>

    <!-- Lane 1: Questioned Lipstick Smear -->
    <circle cx="75" cy="280" r="4" fill="#991b1b"/>
    <text x="75" y="305" fill="#334155" font-size="10" font-weight="700" text-anchor="middle">Questioned</text>
    <!-- Separated Spots -->
    <ellipse cx="75" cy="230" rx="9" ry="6" fill="#f43f5e"/> <!-- Spot 1 (50 mm) -->
    <ellipse cx="75" cy="165" rx="10" ry="7" fill="#fb923c"/> <!-- Spot 2 (115 mm) -->
    <ellipse cx="75" cy="95" rx="11" ry="8" fill="#e11d48"/> <!-- Spot 3 (185 mm) -->

    <!-- Lane 2: Reference Standard A -->
    <circle cx="150" cy="280" r="4" fill="#991b1b"/>
    <text x="150" y="305" fill="#334155" font-size="10" font-weight="700" text-anchor="middle">Standard A</text>
    <ellipse cx="150" cy="230" rx="9" ry="6" fill="#f43f5e"/>
    <ellipse cx="150" cy="165" rx="10" ry="7" fill="#fb923c"/>
    <ellipse cx="150" cy="95" rx="11" ry="8" fill="#e11d48"/>

    <!-- Lane 3: Reference Standard B -->
    <circle cx="225" cy="280" r="4" fill="#991b1b"/>
    <text x="225" y="305" fill="#334155" font-size="10" font-weight="700" text-anchor="middle">Standard B</text>
    <ellipse cx="225" cy="210" rx="9" ry="6" fill="#a855f7"/>
    <ellipse cx="225" cy="120" rx="10" ry="7" fill="#ec4899"/>
  </g>

  <!-- Right Analysis Panel -->
  <g transform="translate(450, 90)">
    <rect width="290" height="320" fill="#1e293b" rx="10" stroke="#334155" stroke-width="1.5"/>
    <text x="145" y="35" fill="#f8fafc" font-size="14" font-weight="800" text-anchor="middle">CHROMATOGRAPHIC DATA</text>

    <!-- Formula Box -->
    <rect x="20" y="55" width="250" height="65" fill="#0f172a" rx="8" stroke="#3b82f6"/>
    <text x="125" y="78" fill="#60a5fa" font-size="11" font-weight="700" text-anchor="middle">Retention Factor Definition:</text>
    <text x="125" y="100" fill="#f8fafc" font-size="12" font-family="monospace" text-anchor="middle">Rf = d(solute) / d(solvent front)</text>

    <text x="25" y="150" fill="#cbd5e1" font-size="11" font-weight="700">Measured Distances from Origin:</text>
    <text x="25" y="175" fill="#94a3b8" font-size="11">• Total solvent front distance = 240 mm</text>
    <text x="25" y="200" fill="#94a3b8" font-size="11">• Spot 1 (Pink) = 50 mm</text>
    <text x="25" y="225" fill="#94a3b8" font-size="11">• Spot 2 (Orange) = 115 mm</text>
    <text x="25" y="250" fill="#94a3b8" font-size="11">• Spot 3 (Red) = 185 mm</text>

    <rect x="20" y="270" width="250" height="35" fill="#0f172a" rx="6" stroke="#475569"/>
    <text x="125" y="292" fill="#94a3b8" font-size="10" text-anchor="middle">Compare dye band migrations</text>
  </g>
</svg>
`);

// 7. Monozygotic Identical Twins Cheiloscopic Comparison
export const TWINS_COMPARISON_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 440" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="440" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="410" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">CHEILOSCOPIC PATTERN COMPARISON IN MONOZYGOTIC TWINS</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">Comparative Quadrant Detail Demonstrating Morphological Differences in Twin Pairs</text>

  <!-- Twin A -->
  <g transform="translate(40, 90)">
    <rect width="330" height="310" fill="#1e293b" rx="12" stroke="#3b82f6" stroke-width="1.5"/>
    <rect x="15" y="15" width="300" height="28" fill="#3b82f6" fill-opacity="0.2" rx="6"/>
    <text x="165" y="34" fill="#60a5fa" font-size="13" font-weight="800" text-anchor="middle">TWIN A (LOWER QUADRANT DETAIL)</text>

    <rect x="25" y="55" width="280" height="150" fill="#0f172a" rx="8" stroke="#334155"/>
    <!-- Grooves on Twin A -->
    <line x1="60" y1="70" x2="60" y2="185" stroke="#38bdf8" stroke-width="2.5"/>
    <line x1="100" y1="70" x2="100" y2="185" stroke="#38bdf8" stroke-width="2.5"/>
    <line x1="100" y1="125" x2="125" y2="70" stroke="#f43f5e" stroke-width="2.5"/>
    <line x1="150" y1="90" x2="150" y2="185" stroke="#38bdf8" stroke-width="2.5"/>
    <circle cx="100" cy="125" r="5" fill="none" stroke="#fbbf24" stroke-width="2"/>
    <text x="135" y="145" fill="#fbbf24" font-size="10" font-weight="700">Branching at Point 1</text>

    <line x1="190" y1="70" x2="230" y2="185" stroke="#38bdf8" stroke-width="2.5"/>
    <line x1="230" y1="70" x2="190" y2="185" stroke="#38bdf8" stroke-width="2.5"/>

    <text x="165" y="235" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Pattern Configuration A</text>
    <text x="165" y="258" fill="#cbd5e1" font-size="11" text-anchor="middle">Primary vertical and bifurcated arrangement</text>
    <text x="165" y="280" fill="#94a3b8" font-size="10" text-anchor="middle">Recorded anatomical quadrant specimen</text>
  </g>

  <!-- Twin B -->
  <g transform="translate(430, 90)">
    <rect width="330" height="310" fill="#1e293b" rx="12" stroke="#ec4899" stroke-width="1.5"/>
    <rect x="15" y="15" width="300" height="28" fill="#ec4899" fill-opacity="0.2" rx="6"/>
    <text x="165" y="34" fill="#f472b6" font-size="13" font-weight="800" text-anchor="middle">TWIN B (LOWER QUADRANT DETAIL)</text>

    <rect x="25" y="55" width="280" height="150" fill="#0f172a" rx="8" stroke="#334155"/>
    <!-- Grooves on Twin B -->
    <line x1="60" y1="70" x2="60" y2="185" stroke="#f472b6" stroke-width="2.5"/>
    <line x1="105" y1="70" x2="105" y2="185" stroke="#f472b6" stroke-width="2.5"/>
    <line x1="105" y1="160" x2="80" y2="70" stroke="#fbbf24" stroke-width="2.5"/>
    <circle cx="105" cy="160" r="5" fill="none" stroke="#fbbf24" stroke-width="2"/>
    <text x="135" y="165" fill="#fbbf24" font-size="10" font-weight="700">Branching at Point 2</text>

    <line x1="160" y1="70" x2="160" y2="135" stroke="#f472b6" stroke-width="2.5"/>
    <line x1="210" y1="70" x2="210" y2="185" stroke="#f472b6" stroke-width="2.5"/>

    <text x="165" y="235" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Pattern Configuration B</text>
    <text x="165" y="258" fill="#cbd5e1" font-size="11" text-anchor="middle">Distinct branch level and groove termination</text>
    <text x="165" y="280" fill="#94a3b8" font-size="10" text-anchor="middle">Demonstrating individual variation within cohort</text>
  </g>
</svg>
`);

// 8. Vermilion Border Cross-Section Histology
export const VERMILION_HISTOLOGY_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="450" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="420" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">HISTOLOGICAL ANATOMY OF THE VERMILION ZONE</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">Cross-Sectional Architecture of the Labial Mucocutaneous Transition</text>

  <!-- Histology Cutaway -->
  <g transform="translate(60, 95)">
    <!-- Layer 1: Superficial Epithelium with eleidin -->
    <path d="M 0,35 Q 80,45 160,35 Q 240,25 320,38 Q 400,48 480,35 L 480,60 Q 400,73 320,63 Q 240,50 160,60 Q 80,70 0,60 Z" fill="#fda4af" stroke="#f43f5e" stroke-width="1.5"/>
    <text x="500" y="52" fill="#fda4af" font-size="12" font-weight="700">Thin Mucosal Epithelium</text>
    <text x="500" y="68" fill="#94a3b8" font-size="10">(Contains eleidin in cells)</text>

    <!-- Layer 2: Epithelial Strata & Sulcus Furrow -->
    <path d="M 0,60 Q 80,70 160,60 Q 240,50 320,63 Q 400,73 480,60 L 480,150 Q 400,165 320,150 Q 240,135 160,150 Q 80,165 0,150 Z" fill="#e11d48" fill-opacity="0.3" stroke="#f43f5e" stroke-width="1"/>
    <!-- Deep Sulcus Labii Groove -->
    <path d="M 235,27 L 240,95 L 245,27" fill="#090d16" stroke="#fbbf24" stroke-width="2"/>
    <text x="240" y="15" fill="#fbbf24" font-size="11" font-weight="800" text-anchor="middle">Sulcus Labii (Groove)</text>

    <!-- Layer 3: Dermal Papillae with Capillary Loops -->
    <rect x="0" y="150" width="480" height="150" fill="#1e293b" rx="4" stroke="#475569"/>
    <!-- Capillary blood vessels -->
    <path d="M 60,250 C 60,180 80,180 80,250 M 140,250 C 140,170 160,170 160,250 M 340,250 C 340,175 360,175 360,250 M 420,250 C 420,180 440,180 440,250" stroke="#ef4444" stroke-width="4" fill="none"/>
    
    <!-- Ectopic Sebaceous Gland (Fordyce Granule) -->
    <circle cx="240" cy="220" r="22" fill="#eab308" fill-opacity="0.3" stroke="#eab308" stroke-width="2"/>
    <line x1="240" y1="198" x2="240" y2="100" stroke="#eab308" stroke-width="2" stroke-dasharray="3,2"/>
    <text x="240" y="260" fill="#fde047" font-size="11" font-weight="700" text-anchor="middle">Ectopic Sebaceous Gland</text>

    <text x="500" y="210" fill="#ef4444" font-size="12" font-weight="700">Vascular Dermal Papillae</text>
    <text x="500" y="230" fill="#94a3b8" font-size="11">(Translucent view of red capillaries)</text>

    <text x="500" y="265" fill="#eab308" font-size="12" font-weight="700">No Sweat Glands or Hair</text>
    <text x="500" y="285" fill="#94a3b8" font-size="11">Occasional ectopic Fordyce spots</text>
  </g>
</svg>
`);

// 9. Latent Lip Print Magnetic Powder Lifting Process
export const MAGNETIC_LIFTING_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 440" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="440" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="410" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">LATENT LIP PRINT DEVELOPMENT &amp; RECOVERY</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">Standard Forensic Recovery Steps on Non-Porous Surfaces</text>

  <!-- Step 1: Magnetic Wand Dusting -->
  <g transform="translate(35, 95)">
    <rect width="225" height="300" fill="#1e293b" rx="10" stroke="#334155" stroke-width="1.5"/>
    <text x="112" y="30" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">STEP 1: DUSTING</text>

    <rect x="25" y="50" width="175" height="120" fill="#0f172a" rx="8"/>
    <path d="M 50,70 L 60,150 C 90,165 135,165 165,150 L 175,70" fill="#0284c7" fill-opacity="0.15" stroke="#38bdf8" stroke-width="1.5"/>
    <rect x="105" y="55" width="14" height="45" fill="#94a3b8" rx="2"/>
    <path d="M 98,100 C 105,115 119,115 126,100 Z" fill="#334155" stroke="#64748b"/>
    <circle cx="112" cy="118" r="12" fill="#000000" opacity="0.8"/>

    <text x="112" y="195" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Magnetic Flake Application</text>
    <text x="112" y="215" fill="#cbd5e1" font-size="10" text-anchor="middle">Non-abrasive powder cluster</text>
    <text x="112" y="235" fill="#94a3b8" font-size="10" text-anchor="middle">Adheres to lipid residue</text>
    <text x="112" y="265" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Non-Contact Powdering</text>
  </g>

  <!-- Step 2: Photography with Scale -->
  <g transform="translate(287, 95)">
    <rect width="225" height="300" fill="#1e293b" rx="10" stroke="#334155" stroke-width="1.5"/>
    <text x="112" y="30" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">STEP 2: PHOTOGRAPHY</text>

    <rect x="25" y="50" width="175" height="120" fill="#0f172a" rx="8"/>
    <circle cx="112" cy="105" r="35" fill="none" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4,3"/>
    <rect x="50" y="145" width="125" height="14" fill="#f1f5f9" stroke="#000000"/>
    <line x1="75" y1="145" x2="75" y2="159" stroke="#000000"/>
    <line x1="100" y1="145" x2="100" y2="159" stroke="#000000"/>
    <line x1="125" y1="145" x2="125" y2="159" stroke="#000000"/>
    <line x1="150" y1="145" x2="150" y2="159" stroke="#000000"/>

    <text x="112" y="195" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Metric Scale Documentation</text>
    <text x="112" y="215" fill="#cbd5e1" font-size="10" text-anchor="middle">1:1 Macro photogrammetry</text>
    <text x="112" y="235" fill="#94a3b8" font-size="10" text-anchor="middle">Perpendicular camera axis</text>
    <text x="112" y="265" fill="#fbbf24" font-size="10" font-weight="700" text-anchor="middle">Primary Evidence Record</text>
  </g>

  <!-- Step 3: Cellophane Tape Transfer -->
  <g transform="translate(540, 95)">
    <rect width="225" height="300" fill="#1e293b" rx="10" stroke="#334155" stroke-width="1.5"/>
    <text x="112" y="30" fill="#10b981" font-size="12" font-weight="800" text-anchor="middle">STEP 3: LIFTING</text>

    <rect x="25" y="50" width="175" height="120" fill="#0f172a" rx="8"/>
    <rect x="45" y="65" width="135" height="90" fill="#f8fafc" rx="4"/>
    <path d="M 60,80 L 165,80 L 155,140 L 50,140 Z" fill="#38bdf8" fill-opacity="0.25" stroke="#38bdf8" stroke-width="1.5"/>
    <ellipse cx="107" cy="110" rx="35" ry="18" fill="#1e293b"/>

    <text x="112" y="195" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Lifting Tape &amp; Backing Card</text>
    <text x="112" y="215" fill="#cbd5e1" font-size="10" text-anchor="middle">Mounted on contrasting card</text>
    <text x="112" y="235" fill="#94a3b8" font-size="10" text-anchor="middle">Chain of custody recording</text>
    <text x="112" y="265" fill="#10b981" font-size="10" font-weight="700" text-anchor="middle">Physical Preservation</text>
  </g>
</svg>
`);

// 10. Renaud Classification (10 Types A through J)
export const RENAUD_CLASSIFICATION_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">RENAUD 10-TYPE CHEILOSCOPIC TAXONOMY (1973)</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">Classification of Lip Print Grooves from Type A to Type J</text>

  <!-- Row 1: A, B, C, D, E -->
  <g transform="translate(30, 85)">
    <!-- A -->
    <g transform="translate(0, 0)">
      <rect width="135" height="160" fill="#1e293b" rx="8" stroke="#334155"/>
      <rect x="10" y="10" width="115" height="24" fill="#3b82f6" fill-opacity="0.2" rx="4"/>
      <text x="67" y="26" fill="#60a5fa" font-size="12" font-weight="800" text-anchor="middle">TYPE A</text>
      <line x1="67" y1="45" x2="67" y2="120" stroke="#f8fafc" stroke-width="2.5"/>
      <text x="67" y="142" fill="#94a3b8" font-size="10" text-anchor="middle">Complete Vertical</text>
    </g>
    <!-- B -->
    <g transform="translate(150, 0)">
      <rect width="135" height="160" fill="#1e293b" rx="8" stroke="#334155"/>
      <rect x="10" y="10" width="115" height="24" fill="#3b82f6" fill-opacity="0.2" rx="4"/>
      <text x="67" y="26" fill="#60a5fa" font-size="12" font-weight="800" text-anchor="middle">TYPE B</text>
      <line x1="67" y1="45" x2="67" y2="90" stroke="#f8fafc" stroke-width="2.5"/>
      <text x="67" y="142" fill="#94a3b8" font-size="10" text-anchor="middle">Incomplete Vertical</text>
    </g>
    <!-- C -->
    <g transform="translate(300, 0)">
      <rect width="135" height="160" fill="#1e293b" rx="8" stroke="#10b981" stroke-width="1.5"/>
      <rect x="10" y="10" width="115" height="24" fill="#10b981" fill-opacity="0.2" rx="4"/>
      <text x="67" y="26" fill="#34d399" font-size="12" font-weight="800" text-anchor="middle">TYPE C</text>
      <line x1="67" y1="120" x2="67" y2="85" stroke="#f8fafc" stroke-width="2.5"/>
      <line x1="67" y1="85" x2="45" y2="45" stroke="#f8fafc" stroke-width="2.5"/>
      <line x1="67" y1="85" x2="89" y2="45" stroke="#f8fafc" stroke-width="2.5"/>
      <text x="67" y="142" fill="#94a3b8" font-size="10" text-anchor="middle">Complete Bifurcated</text>
    </g>
    <!-- D -->
    <g transform="translate(450, 0)">
      <rect width="135" height="160" fill="#1e293b" rx="8" stroke="#10b981" stroke-width="1.5"/>
      <rect x="10" y="10" width="115" height="24" fill="#10b981" fill-opacity="0.2" rx="4"/>
      <text x="67" y="26" fill="#34d399" font-size="12" font-weight="800" text-anchor="middle">TYPE D</text>
      <line x1="67" y1="100" x2="67" y2="75" stroke="#f8fafc" stroke-width="2.5"/>
      <line x1="67" y1="75" x2="52" y2="50" stroke="#f8fafc" stroke-width="2.5"/>
      <line x1="67" y1="75" x2="82" y2="50" stroke="#f8fafc" stroke-width="2.5"/>
      <text x="67" y="142" fill="#94a3b8" font-size="10" text-anchor="middle">Incomplete Bifurcated</text>
    </g>
    <!-- E -->
    <g transform="translate(600, 0)">
      <rect width="135" height="160" fill="#1e293b" rx="8" stroke="#fbbf24" stroke-width="1.5"/>
      <rect x="10" y="10" width="115" height="24" fill="#fbbf24" fill-opacity="0.2" rx="4"/>
      <text x="67" y="26" fill="#fcd34d" font-size="12" font-weight="800" text-anchor="middle">TYPE E</text>
      <line x1="45" y1="45" x2="89" y2="120" stroke="#f8fafc" stroke-width="2.5"/>
      <line x1="89" y1="45" x2="45" y2="120" stroke="#f8fafc" stroke-width="2.5"/>
      <text x="67" y="142" fill="#94a3b8" font-size="10" text-anchor="middle">Complete Cross (X)</text>
    </g>
  </g>

  <!-- Row 2: F, G, H, I, J -->
  <g transform="translate(30, 265)">
    <!-- F -->
    <g transform="translate(0, 0)">
      <rect width="135" height="160" fill="#1e293b" rx="8" stroke="#fbbf24" stroke-width="1.5"/>
      <rect x="10" y="10" width="115" height="24" fill="#fbbf24" fill-opacity="0.2" rx="4"/>
      <text x="67" y="26" fill="#fcd34d" font-size="12" font-weight="800" text-anchor="middle">TYPE F</text>
      <line x1="52" y1="60" x2="82" y2="110" stroke="#f8fafc" stroke-width="2.5"/>
      <line x1="82" y1="60" x2="52" y2="110" stroke="#f8fafc" stroke-width="2.5"/>
      <text x="67" y="142" fill="#94a3b8" font-size="10" text-anchor="middle">Incomplete Cross</text>
    </g>
    <!-- G -->
    <g transform="translate(150, 0)">
      <rect width="135" height="160" fill="#1e293b" rx="8" stroke="#8b5cf6" stroke-width="1.5"/>
      <rect x="10" y="10" width="115" height="24" fill="#8b5cf6" fill-opacity="0.2" rx="4"/>
      <text x="67" y="26" fill="#a78bfa" font-size="12" font-weight="800" text-anchor="middle">TYPE G</text>
      <line x1="55" y1="50" x2="55" y2="115" stroke="#f8fafc" stroke-width="2"/>
      <line x1="80" y1="50" x2="80" y2="115" stroke="#f8fafc" stroke-width="2"/>
      <line x1="40" y1="70" x2="95" y2="70" stroke="#f8fafc" stroke-width="2"/>
      <line x1="40" y1="95" x2="95" y2="95" stroke="#f8fafc" stroke-width="2"/>
      <text x="67" y="142" fill="#94a3b8" font-size="10" text-anchor="middle">Reticular (Grid)</text>
    </g>
    <!-- H -->
    <g transform="translate(300, 0)">
      <rect width="135" height="160" fill="#1e293b" rx="8" stroke="#ec4899" stroke-width="1.5"/>
      <rect x="10" y="10" width="115" height="24" fill="#ec4899" fill-opacity="0.2" rx="4"/>
      <text x="67" y="26" fill="#f472b6" font-size="12" font-weight="800" text-anchor="middle">TYPE H</text>
      <path d="M 67,50 Q 80,75 67,95 Q 60,110 50,115" fill="none" stroke="#f8fafc" stroke-width="2.5"/>
      <text x="67" y="142" fill="#94a3b8" font-size="10" text-anchor="middle">Sword / Comma</text>
    </g>
    <!-- I -->
    <g transform="translate(450, 0)">
      <rect width="135" height="160" fill="#1e293b" rx="8" stroke="#06b6d4" stroke-width="1.5"/>
      <rect x="10" y="10" width="115" height="24" fill="#06b6d4" fill-opacity="0.2" rx="4"/>
      <text x="67" y="26" fill="#22d3ee" font-size="12" font-weight="800" text-anchor="middle">TYPE I</text>
      <line x1="40" y1="70" x2="95" y2="70" stroke="#f8fafc" stroke-width="2.5"/>
      <line x1="40" y1="95" x2="95" y2="95" stroke="#f8fafc" stroke-width="2.5"/>
      <text x="67" y="142" fill="#94a3b8" font-size="10" text-anchor="middle">Horizontal Lines</text>
    </g>
    <!-- J -->
    <g transform="translate(600, 0)">
      <rect width="135" height="160" fill="#1e293b" rx="8" stroke="#f97316" stroke-width="1.5"/>
      <rect x="10" y="10" width="115" height="24" fill="#f97316" fill-opacity="0.2" rx="4"/>
      <text x="67" y="26" fill="#fb923c" font-size="12" font-weight="800" text-anchor="middle">TYPE J</text>
      <path d="M 50,60 Q 80,70 60,95 Q 75,115 85,110" fill="none" stroke="#f8fafc" stroke-width="2.5"/>
      <text x="67" y="142" fill="#94a3b8" font-size="10" text-anchor="middle">Other / Mixed</text>
    </g>
  </g>
</svg>
`);
