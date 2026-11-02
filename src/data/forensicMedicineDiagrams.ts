/**
 * Fundamentals of Forensic Medicine — Visual Reference Graphics & Clinical Diagrams
 * High-precision vector SVG Data URIs for zero-latency rendering and fullscreen zoom inspection
 */

const svgToDataUri = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
};

// 1. Marshall & Hoare Sigmoid Curve of Algor Mortis (Postmortem Cooling)
export const ALGOR_MORTIS_SIGMOID_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 480" width="100%" height="100%" style="background:#0f172a; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="820" height="480" fill="#0f172a" rx="16"/>
  <rect x="14" y="14" width="792" height="452" fill="none" stroke="#334155" stroke-width="1.5" rx="12"/>

  <!-- Header -->
  <text x="410" y="44" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="0.8">ALGOR MORTIS: MARSHALL &amp; HOARE DOUBLE-EXPONENTIAL COOLING CURVE</text>
  <text x="410" y="66" fill="#94a3b8" font-size="12" text-anchor="middle">Core Rectal Temperature (°C) vs. Time Since Death (Hours Postmortem)</text>

  <!-- Plot Area -->
  <rect x="95" y="88" width="665" height="310" fill="#1e293b" rx="8" stroke="#475569" stroke-width="1"/>

  <!-- Grid Lines Horizontal -->
  <line x1="95" y1="125" x2="760" y2="125" stroke="#334155" stroke-dasharray="4,4"/>
  <line x1="95" y1="185" x2="760" y2="185" stroke="#334155" stroke-dasharray="4,4"/>
  <line x1="95" y1="245" x2="760" y2="245" stroke="#334155" stroke-dasharray="4,4"/>
  <line x1="95" y1="305" x2="760" y2="305" stroke="#334155" stroke-dasharray="4,4"/>
  <line x1="95" y1="365" x2="760" y2="365" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="6,4"/>

  <!-- Grid Lines Vertical -->
  <line x1="205" y1="88" x2="205" y2="398" stroke="#334155" stroke-dasharray="4,4"/>
  <line x1="315" y1="88" x2="315" y2="398" stroke="#334155" stroke-dasharray="4,4"/>
  <line x1="425" y1="88" x2="425" y2="398" stroke="#334155" stroke-dasharray="4,4"/>
  <line x1="535" y1="88" x2="535" y2="398" stroke="#334155" stroke-dasharray="4,4"/>
  <line x1="645" y1="88" x2="645" y2="398" stroke="#334155" stroke-dasharray="4,4"/>

  <!-- Y-Axis Labels -->
  <text x="84" y="129" fill="#e2e8f0" font-size="12" font-weight="700" text-anchor="end">37.2°C</text>
  <text x="84" y="189" fill="#cbd5e1" font-size="11" text-anchor="end">33.0°C</text>
  <text x="84" y="249" fill="#cbd5e1" font-size="11" text-anchor="end">28.0°C</text>
  <text x="84" y="309" fill="#cbd5e1" font-size="11" text-anchor="end">24.0°C</text>
  <text x="84" y="369" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="end">20.0°C</text>
  <text x="36" y="245" fill="#94a3b8" font-size="12" font-weight="700" text-anchor="middle" transform="rotate(-90 36 245)">RECTAL TEMPERATURE (°C)</text>

  <!-- X-Axis Labels -->
  <text x="95" y="418" fill="#cbd5e1" font-size="11" text-anchor="middle">0 hr</text>
  <text x="205" y="418" fill="#cbd5e1" font-size="11" text-anchor="middle">3 hrs</text>
  <text x="315" y="418" fill="#cbd5e1" font-size="11" text-anchor="middle">6 hrs</text>
  <text x="425" y="418" fill="#cbd5e1" font-size="11" text-anchor="middle">12 hrs</text>
  <text x="535" y="418" fill="#cbd5e1" font-size="11" text-anchor="middle">18 hrs</text>
  <text x="645" y="418" fill="#cbd5e1" font-size="11" text-anchor="middle">24 hrs</text>
  <text x="745" y="418" fill="#cbd5e1" font-size="11" text-anchor="middle">30 hrs</text>
  <text x="425" y="445" fill="#94a3b8" font-size="12" font-weight="700" text-anchor="middle">POSTMORTEM INTERVAL (HOURS SINCE DEATH)</text>

  <!-- Theoretical Newton's Linear / Single Exponential Line (Dashed Grey) -->
  <path d="M 95 125 L 580 365" fill="none" stroke="#64748b" stroke-width="2" stroke-dasharray="6,6"/>
  <text x="480" y="285" fill="#94a3b8" font-size="11" font-style="italic">Theoretical Newton's Law (No Lag)</text>

  <!-- Highlight Box for Phase X (Initial Plateau) -->
  <rect x="95" y="102" width="110" height="52" fill="#f59e0b" fill-opacity="0.16" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,3" rx="6"/>
  <text x="150" y="117" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">[PHASE X]</text>
  <text x="150" y="147" fill="#fde68a" font-size="10" font-weight="600" text-anchor="middle">0.5 to 3.0 Hours</text>

  <!-- True Sigmoid Curve (Inverted S-Shape) -->
  <path d="M 95 125 C 145 125, 175 127, 205 136 C 260 154, 330 225, 425 292 C 515 348, 620 362, 745 365" fill="none" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>

  <!-- Key Points on Curve -->
  <circle cx="95" cy="125" r="5" fill="#fbbf24" stroke="#0f172a" stroke-width="2"/>
  <circle cx="205" cy="136" r="5" fill="#fbbf24" stroke="#0f172a" stroke-width="2"/>
  <circle cx="345" cy="235" r="5" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
  <circle cx="645" cy="362" r="5" fill="#38bdf8" stroke="#0f172a" stroke-width="2"/>

  <!-- Phase Annotations -->
  <g transform="translate(230, 102)">
    <rect width="235" height="50" fill="#0f172a" fill-opacity="0.85" rx="6" stroke="#f59e0b" stroke-width="1"/>
    <text x="12" y="20" fill="#fbbf24" font-size="11" font-weight="700">PHASE X: Initial Isothermic Plateau</text>
    <text x="12" y="37" fill="#cbd5e1" font-size="10">Rectal core remains ~37°C before thermal gradient forms</text>
  </g>

  <g transform="translate(365, 185)">
    <rect width="225" height="46" fill="#0f172a" fill-opacity="0.85" rx="6" stroke="#ef4444" stroke-width="1"/>
    <text x="12" y="19" fill="#f87171" font-size="11" font-weight="700">PHASE Y: Steepest Linear Cooling</text>
    <text x="12" y="35" fill="#cbd5e1" font-size="10">Maximal rate (~0.5°C to 1.0°C per hour)</text>
  </g>

  <text x="648" y="353" fill="#38bdf8" font-size="11" font-weight="700">Ambient Temp Equilibrium (20°C)</text>
</svg>
`);

// 2. Hanging vs. Ligature Strangulation Neck Mark Morphology
export const HANGING_VS_STRANGULATION_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 480" width="100%" height="100%" style="background:#0f172a; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="820" height="480" fill="#0f172a" rx="16"/>
  <rect x="14" y="14" width="792" height="452" fill="none" stroke="#334155" stroke-width="1.5" rx="12"/>

  <text x="410" y="44" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="0.8">COMPARATIVE MORPHOLOGY OF CERVICAL LIGATURE MARKS</text>
  <text x="410" y="66" fill="#94a3b8" font-size="12" text-anchor="middle">Forensic Pathological Differentiation of Neck Compression Patterns</text>

  <!-- SPECIMEN A (Left Card) -->
  <g transform="translate(38, 86)">
    <rect width="355" height="356" fill="#1e293b" rx="12" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="14" y="14" width="327" height="32" fill="#f59e0b" fill-opacity="0.15" rx="8"/>
    <text x="177" y="35" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">SPECIMEN A: OBLIQUE &amp; NON-CONTINUOUS</text>

    <!-- Neck Silhouette A -->
    <path d="M 115 70 C 115 110, 125 180, 105 245 L 250 245 C 230 180, 240 110, 240 70 Z" fill="#334155" stroke="#64748b" stroke-width="2"/>
    <!-- Mandible / Chin -->
    <path d="M 105 70 Q 177 98 250 70" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
    <!-- Hyoid Bone -->
    <path d="M 142 118 Q 177 128 212 118" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
    <text x="72" y="122" fill="#38bdf8" font-size="10" font-weight="700">Hyoid Bone</text>
    <!-- Thyroid Cartilage -->
    <polygon points="155,152 200,152 192,186 177,194 162,186" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <text x="262" y="175" fill="#cbd5e1" font-size="10" font-weight="700">Thyroid Cartilage</text>
    <line x1="202" y1="172" x2="256" y2="172" stroke="#64748b" stroke-dasharray="3,3"/>

    <!-- Oblique Furrow (Above Thyroid, rising toward mastoid with gap at knot) -->
    <path d="M 118 145 Q 175 150 232 102" fill="none" stroke="#ef4444" stroke-width="7" stroke-linecap="round"/>
    <circle cx="238" cy="92" r="8" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="3,2"/>
    <text x="255" y="96" fill="#fbbf24" font-size="10" font-weight="700">Inverted 'V' Knot Gap</text>

    <!-- Bullet Features A -->
    <rect x="18" y="258" width="319" height="84" fill="#0f172a" rx="8" stroke="#334155"/>
    <text x="30" y="277" fill="#f8fafc" font-size="11" font-weight="700">• Direction: Oblique (rising upward toward knot point)</text>
    <text x="30" y="295" fill="#f8fafc" font-size="11" font-weight="700">• Continuity: Non-continuous (interrupted at knot)</text>
    <text x="30" y="313" fill="#f8fafc" font-size="11" font-weight="700">• Level: Situated HIGH — Above Thyroid Cartilage (80%)</text>
    <text x="30" y="331" fill="#fbbf24" font-size="11" font-weight="700">• Base: Dry, hard, yellowish-brown parchmentized groove</text>
  </g>

  <!-- SPECIMEN B (Right Card) -->
  <g transform="translate(427, 86)">
    <rect width="355" height="356" fill="#1e293b" rx="12" stroke="#ec4899" stroke-width="1.5"/>
    <rect x="14" y="14" width="327" height="32" fill="#ec4899" fill-opacity="0.15" rx="8"/>
    <text x="177" y="35" fill="#f472b6" font-size="14" font-weight="800" text-anchor="middle">SPECIMEN B: TRANSVERSE &amp; CONTINUOUS</text>

    <!-- Neck Silhouette B -->
    <path d="M 115 70 C 115 110, 125 180, 105 245 L 250 245 C 230 180, 240 110, 240 70 Z" fill="#334155" stroke="#64748b" stroke-width="2"/>
    <path d="M 105 70 Q 177 98 250 70" fill="#475569" stroke="#94a3b8" stroke-width="2"/>
    <!-- Hyoid Bone -->
    <path d="M 142 118 Q 177 128 212 118" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
    <!-- Thyroid Cartilage (Fractured superior horn / lamina) -->
    <polygon points="155,152 200,152 192,186 177,194 162,186" fill="#1e293b" stroke="#f472b6" stroke-width="2"/>
    <line x1="165" y1="158" x2="188" y2="180" stroke="#ef4444" stroke-width="2.5"/>
    <text x="255" y="168" fill="#f472b6" font-size="10" font-weight="700">Thyroid / Cricoid</text>
    <text x="255" y="181" fill="#f472b6" font-size="10" font-weight="700">Fracture Common</text>

    <!-- Horizontal / Transverse Ligature Mark (At or Below Thyroid Cartilage) -->
    <path d="M 117 195 L 238 195" fill="none" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/>
    <path d="M 117 195 Q 177 202 238 195" fill="none" stroke="#fca5a5" stroke-width="2" stroke-dasharray="4,3"/>
    <text x="34" y="199" fill="#ef4444" font-size="10" font-weight="800">360° Horizontal</text>

    <!-- Bullet Features B -->
    <rect x="18" y="258" width="319" height="84" fill="#0f172a" rx="8" stroke="#334155"/>
    <text x="30" y="277" fill="#f8fafc" font-size="11" font-weight="700">• Direction: Transverse / Horizontal around neck</text>
    <text x="30" y="295" fill="#f8fafc" font-size="11" font-weight="700">• Continuity: Completely continuous (360° circumference)</text>
    <text x="30" y="313" fill="#f8fafc" font-size="11" font-weight="700">• Level: Situated LOW — At or Below Thyroid Cartilage</text>
    <text x="30" y="331" fill="#f472b6" font-size="11" font-weight="700">• Base: Soft, reddish, ecchymosed with severe neck bruising</text>
  </g>
</svg>
`);

// 3. Firearm Entry Wound Morphology (Close / Intermediate Range)
export const FIREARM_RANGE_TATTOOING_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 480" width="100%" height="100%" style="background:#0f172a; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="820" height="480" fill="#0f172a" rx="16"/>
  <rect x="14" y="14" width="792" height="452" fill="none" stroke="#334155" stroke-width="1.5" rx="12"/>

  <text x="410" y="44" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="0.8">RIFLED FIREARM ENTRY WOUND: CONCENTRIC ZONES OF DISCHARGE</text>
  <text x="410" y="66" fill="#94a3b8" font-size="12" text-anchor="middle">Anatomical Morphology of Close- to Intermediate-Range Gunshot Entry Defect</text>

  <!-- Target Diagram Panel -->
  <rect x="38" y="86" width="420" height="356" fill="#1e293b" rx="12" stroke="#475569"/>

  <!-- Outer Zone: Gunpowder Tattooing / Stippling (Zone D) -->
  <circle cx="248" cy="264" r="142" fill="#334155" fill-opacity="0.35" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5,5"/>
  <!-- Punctate Stippling Dots (Unburnt propellant grains embedded in dermis) -->
  <g fill="#dc2626">
    <circle cx="145" cy="195" r="3"/><circle cx="165" cy="168" r="2.5"/><circle cx="205" cy="142" r="3"/>
    <circle cx="255" cy="138" r="3.5"/><circle cx="305" cy="152" r="2.5"/><circle cx="342" cy="182" r="3"/>
    <circle cx="365" cy="225" r="3"/><circle cx="372" cy="272" r="2.5"/><circle cx="355" cy="318" r="3.5"/>
    <circle cx="322" cy="358" r="3"/><circle cx="275" cy="382" r="2.5"/><circle cx="218" cy="385" r="3"/>
    <circle cx="172" cy="362" r="3.5"/><circle cx="138" cy="322" r="2.5"/><circle cx="125" cy="268" r="3"/>
    <circle cx="132" cy="225" r="2.5"/><circle cx="182" cy="205" r="3"/><circle cx="315" cy="198" r="3"/>
    <circle cx="330" cy="295" r="3"/><circle cx="185" cy="332" r="3"/><circle cx="245" cy="355" r="2.5"/>
    <circle cx="288" cy="338" r="3"/><circle cx="162" cy="285" r="3"/><circle cx="222" cy="175" r="2.5"/>
  </g>

  <!-- Middle Zone: Smoke Blackening / Soot Smudging (Zone C) -->
  <circle cx="248" cy="264" r="88" fill="#090d16" fill-opacity="0.65" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>

  <!-- Ring B: Abrasion Collar / Contusion Ring -->
  <circle cx="248" cy="264" r="46" fill="#991b1b" stroke="#f87171" stroke-width="2"/>

  <!-- Ring A: Dirt / Grease Collar + Central Bullet Defect -->
  <circle cx="248" cy="264" r="28" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
  <circle cx="248" cy="264" r="20" fill="#020617"/>

  <!-- Callout Lines -->
  <line x1="248" y1="264" x2="475" y2="122" stroke="#38bdf8" stroke-width="1.8"/>
  <line x1="282" y1="234" x2="475" y2="195" stroke="#f87171" stroke-width="1.8"/>
  <line x1="312" y1="210" x2="475" y2="272" stroke="#94a3b8" stroke-width="1.8"/>
  <line x1="355" y1="182" x2="475" y2="352" stroke="#f59e0b" stroke-width="2.2"/>

  <!-- Legend / Diagnostic Key Panel -->
  <g transform="translate(475, 86)">
    <rect width="307" height="68" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="1.2"/>
    <text x="14" y="22" fill="#38bdf8" font-size="12" font-weight="800">ZONE A: Grease / Dirt Collar</text>
    <text x="14" y="40" fill="#cbd5e1" font-size="10.5">Bullet lubrication &amp; barrel fouling wiped onto</text>
    <text x="14" y="55" fill="#cbd5e1" font-size="10.5">inverted skin edges (present at all ranges).</text>

    <rect y="78" width="307" height="68" fill="#1e293b" rx="8" stroke="#f87171" stroke-width="1.2"/>
    <text x="14" y="100" fill="#f87171" font-size="12" font-weight="800">ZONE B: Abrasion / Contusion Collar</text>
    <text x="14" y="118" fill="#cbd5e1" font-size="10.5">Epidermal scraping as bullet indents &amp; stretches</text>
    <text x="14" y="133" fill="#cbd5e1" font-size="10.5">skin before perforation (proves entry vs. exit).</text>

    <rect y="156" width="307" height="72" fill="#1e293b" rx="8" stroke="#94a3b8" stroke-width="1.2"/>
    <text x="14" y="178" fill="#e2e8f0" font-size="12" font-weight="800">ZONE C: Soot Blackening (Smudging)</text>
    <text x="14" y="196" fill="#cbd5e1" font-size="10.5">Superficial carbon smoke deposit (~30 cm range).</text>
    <text x="14" y="213" fill="#38bdf8" font-size="10.5" font-weight="700">✓ Easily wiped off with a wet sponge.</text>

    <rect y="238" width="307" height="118" fill="#1e293b" rx="8" stroke="#f59e0b" stroke-width="2"/>
    <text x="14" y="260" fill="#fbbf24" font-size="12.5" font-weight="800">ZONE D: [FEATURE X] — Punctate Stippling</text>
    <text x="14" y="279" fill="#f8fafc" font-size="10.5">Reddish-brown punctate dermal micro-lesions caused</text>
    <text x="14" y="295" fill="#f8fafc" font-size="10.5">by incandescent unburnt/semi-burnt propellant</text>
    <text x="14" y="311" fill="#f8fafc" font-size="10.5">grains driven into the epidermis &amp; dermis.</text>
    <text x="14" y="333" fill="#fbbf24" font-size="11" font-weight="800">✗ CANNOT be wiped away by washing!</text>
  </g>
</svg>
`);

// 4. Traumatic Intracranial Hemorrhages (Epidural vs. Subdural Hematoma)
export const INTRACRANIAL_HEMORRHAGE_CT_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 480" width="100%" height="100%" style="background:#0f172a; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="820" height="480" fill="#0f172a" rx="16"/>
  <rect x="14" y="14" width="792" height="452" fill="none" stroke="#334155" stroke-width="1.5" rx="12"/>

  <text x="410" y="44" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="0.8">TRAUMATIC INTRACRANIAL HEMORRHAGES: AXIAL CRANIAL SCHEMATIC</text>
  <text x="410" y="66" fill="#94a3b8" font-size="12" text-anchor="middle">Comparison of Meningeal Compartment Morphology, Suture Boundaries &amp; Vascular Source</text>

  <!-- PATTERN A: EPIDURAL / EXTRADURAL HEMATOMA -->
  <g transform="translate(38, 86)">
    <rect width="355" height="356" fill="#1e293b" rx="12" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="14" y="14" width="327" height="32" fill="#f59e0b" fill-opacity="0.15" rx="8"/>
    <text x="177" y="35" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">PATTERN A: BICONVEX (LENTIFORM)</text>

    <!-- Cranial Vault Oval -->
    <ellipse cx="177" cy="155" rx="95" ry="82" fill="#0f172a" stroke="#cbd5e1" stroke-width="6"/>
    <!-- Brain Parenchyma -->
    <ellipse cx="184" cy="155" rx="78" ry="70" fill="#334155" stroke="#64748b" stroke-width="1.5"/>
    <!-- Midline Falx (Shifted right) -->
    <path d="M 177 78 Q 192 155 177 232" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,3"/>

    <!-- Biconvex / Lens-shaped Epidural Hematoma on Left Temporoparietal Wall -->
    <path d="M 88 122 Q 142 155 88 190 Q 78 155 88 122 Z" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>
    <!-- Fracture line at Pterion -->
    <line x1="72" y1="152" x2="96" y2="158" stroke="#fbbf24" stroke-width="3"/>
    <text x="22" y="145" fill="#fbbf24" font-size="10" font-weight="800">Pterion Fracture</text>

    <!-- Suture Attachment Points -->
    <circle cx="89" cy="122" r="4" fill="#38bdf8"/>
    <circle cx="89" cy="190" r="4" fill="#38bdf8"/>
    <text x="115" y="116" fill="#38bdf8" font-size="10" font-weight="700">Bounded by Cranial Sutures</text>

    <!-- Clinical Box A -->
    <rect x="18" y="252" width="319" height="88" fill="#0f172a" rx="8" stroke="#334155"/>
    <text x="30" y="272" fill="#fbbf24" font-size="11" font-weight="700">• Shape: Biconvex / Lens-shaped (Lentiform)</text>
    <text x="30" y="290" fill="#f8fafc" font-size="11" font-weight="700">• Vessel: Middle Meningeal Artery (Squamous temporal)</text>
    <text x="30" y="308" fill="#f8fafc" font-size="11" font-weight="700">• Sutures: Does NOT cross cranial suture lines</text>
    <text x="30" y="326" fill="#38bdf8" font-size="11" font-weight="700">• Classic Feature: "Lucid Interval" (McEwen's Pupil)</text>
  </g>

  <!-- PATTERN B: SUBDURAL HEMATOMA -->
  <g transform="translate(427, 86)">
    <rect width="355" height="356" fill="#1e293b" rx="12" stroke="#ec4899" stroke-width="1.5"/>
    <rect x="14" y="14" width="327" height="32" fill="#ec4899" fill-opacity="0.15" rx="8"/>
    <text x="177" y="35" fill="#f472b6" font-size="14" font-weight="800" text-anchor="middle">PATTERN B: CRESCENTIC (SICKLE-SHAPED)</text>

    <!-- Cranial Vault Oval -->
    <ellipse cx="177" cy="155" rx="95" ry="82" fill="#0f172a" stroke="#cbd5e1" stroke-width="6"/>
    <!-- Brain Parenchyma -->
    <ellipse cx="186" cy="155" rx="76" ry="68" fill="#334155" stroke="#64748b" stroke-width="1.5"/>
    <!-- Midline Falx -->
    <path d="M 177 78 Q 194 155 177 232" fill="none" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,3"/>

    <!-- Crescentic / Concavo-Convex Subdural Hematoma sweeping across hemisphere -->
    <path d="M 135 83 C 72 105, 72 205, 135 227 C 96 198, 96 112, 135 83 Z" fill="#dc2626" stroke="#f472b6" stroke-width="2"/>
    <text x="115" y="158" fill="#f8fafc" font-size="10" font-weight="700">Crosses Sutures Freely</text>

    <!-- Clinical Box B -->
    <rect x="18" y="252" width="319" height="88" fill="#0f172a" rx="8" stroke="#334155"/>
    <text x="30" y="272" fill="#f472b6" font-size="11" font-weight="700">• Shape: Crescent-shaped / Sickle-shaped (Concavo-convex)</text>
    <text x="30" y="290" fill="#f8fafc" font-size="11" font-weight="700">• Vessel: Parasagittal Bridging Cerebral Veins (Venous)</text>
    <text x="30" y="308" fill="#f8fafc" font-size="11" font-weight="700">• Sutures: Crosses suture lines; stops at Falx / Tentorium</text>
    <text x="30" y="326" fill="#cbd5e1" font-size="11" font-weight="700">• Risk: Elderly, alcoholics, shaken baby deceleration</text>
  </g>
</svg>
`);

// 5. Gustafson's Method of Adult Dental Age Estimation (6 Histological Criteria)
export const GUSTAFSON_DENTAL_AGE_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 480" width="100%" height="100%" style="background:#0f172a; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="820" height="480" fill="#0f172a" rx="16"/>
  <rect x="14" y="14" width="792" height="452" fill="none" stroke="#334155" stroke-width="1.5" rx="12"/>

  <text x="410" y="44" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="0.8">GUSTAFSON'S METHOD (1950): DENTAL HISTOLOGICAL AGE ESTIMATION</text>
  <text x="410" y="66" fill="#94a3b8" font-size="12" text-anchor="middle">Ground Longitudinal Section of Single-Rooted Tooth Showing Six Physiological Age Parameters (Scored 0 to 3)</text>

  <!-- Left Panel: Longitudinal Tooth Diagram -->
  <rect x="38" y="86" width="350" height="356" fill="#1e293b" rx="12" stroke="#475569"/>

  <!-- Crown & Enamel Cap (Flattened at top for Attrition) -->
  <path d="M 145 130 L 280 130 C 292 155, 285 205, 270 225 L 155 225 C 140 205, 133 155, 145 130 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
  <!-- Attrition flat wear facet -->
  <line x1="145" y1="130" x2="280" y2="130" stroke="#f59e0b" stroke-width="5"/>

  <!-- Root Dentin Body -->
  <path d="M 155 225 L 270 225 L 242 405 C 228 422, 197 422, 183 405 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="2"/>

  <!-- Gingival Attachment Recession (Periodontosis) -->
  <path d="M 110 245 Q 135 235 157 245" fill="none" stroke="#ec4899" stroke-width="4"/>
  <path d="M 268 245 Q 290 235 315 245" fill="none" stroke="#ec4899" stroke-width="4"/>

  <!-- Pulp Cavity & Secondary Dentin Deposition -->
  <path d="M 192 175 L 233 175 L 220 365 L 205 365 Z" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
  <!-- Secondary Dentin Layer narrowing pulp chamber -->
  <path d="M 192 175 L 233 175 L 228 245 L 197 245 Z" fill="#f59e0b" fill-opacity="0.75"/>

  <!-- Root Transparency / Translucency Zone [CRITERION T] at Apical Third -->
  <path d="M 168 325 L 257 325 L 242 405 C 228 422, 197 422, 183 405 Z" fill="#38bdf8" fill-opacity="0.65" stroke="#0284c7" stroke-width="2"/>
  <text x="212" y="372" fill="#0f172a" font-size="11" font-weight="900" text-anchor="middle">[PARAMETER T]</text>
  <text x="212" y="386" fill="#0f172a" font-size="9.5" font-weight="800" text-anchor="middle">Apical Translucency</text>

  <!-- Cementum Apposition around apex -->
  <path d="M 173 360 C 175 415, 200 426, 212 426 C 225 426, 250 415, 252 360" fill="none" stroke="#10b981" stroke-width="5"/>

  <!-- Right Panel: 6 Criteria Breakdown -->
  <g transform="translate(408, 86)">
    <rect width="374" height="50" fill="#1e293b" rx="8" stroke="#f59e0b" stroke-width="1.2"/>
    <text x="14" y="20" fill="#fbbf24" font-size="12" font-weight="800">1. A — Attrition (Occlusal Enamel Wear)</text>
    <text x="14" y="37" fill="#cbd5e1" font-size="10.5">Gradual wearing down of incisal/occlusal surface due to mastication.</text>

    <rect y="58" width="374" height="50" fill="#1e293b" rx="8" stroke="#ec4899" stroke-width="1.2"/>
    <text x="14" y="78" fill="#f472b6" font-size="12" font-weight="800">2. P — Periodontosis (Gingival Recession)</text>
    <text x="14" y="95" fill="#cbd5e1" font-size="10.5">Apical migration of epithelial attachment exposing the neck/root.</text>

    <rect y="116" width="374" height="50" fill="#1e293b" rx="8" stroke="#f97316" stroke-width="1.2"/>
    <text x="14" y="136" fill="#fb923c" font-size="12" font-weight="800">3. S — Secondary Dentin Deposition</text>
    <text x="14" y="153" fill="#cbd5e1" font-size="10.5">Progressive narrowing of the pulp cavity walls from within.</text>

    <rect y="174" width="374" height="50" fill="#1e293b" rx="8" stroke="#10b981" stroke-width="1.2"/>
    <text x="14" y="194" fill="#34d399" font-size="12" font-weight="800">4. C — Cementum Apposition</text>
    <text x="14" y="211" fill="#cbd5e1" font-size="10.5">Incremental layering of cellular cementum around the root apex.</text>

    <rect y="232" width="374" height="50" fill="#1e293b" rx="8" stroke="#a855f7" stroke-width="1.2"/>
    <text x="14" y="252" fill="#c084fc" font-size="12" font-weight="800">5. R — Root Resorption</text>
    <text x="14" y="269" fill="#cbd5e1" font-size="10.5">External osteoclastic erosion of cementum &amp; dentin at the apex.</text>

    <rect y="290" width="374" height="66" fill="#1e293b" rx="8" stroke="#38bdf8" stroke-width="2.2"/>
    <text x="14" y="311" fill="#38bdf8" font-size="12.5" font-weight="800">6. [PARAMETER T] — Root Dentin Transparency</text>
    <text x="14" y="328" fill="#f8fafc" font-size="10.5">Sclerosis/calcification of dentinal tubules matching refractive index</text>
    <text x="14" y="344" fill="#fbbf24" font-size="10.5" font-weight="800">★ SINGLE MOST RELIABLE CRITERION (Least affected by pathology)</text>
  </g>
</svg>
`);

// 6. Wallace Rule of Nines Burn Surface Area Assessment Chart
export const WALLACE_RULE_OF_NINES_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 480" width="100%" height="100%" style="background:#0f172a; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="820" height="480" fill="#0f172a" rx="16"/>
  <rect x="14" y="14" width="792" height="452" fill="none" stroke="#334155" stroke-width="1.5" rx="12"/>

  <text x="410" y="44" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="0.8">WALLACE "RULE OF NINES" — ADULT BURN CASE ASSESSMENT</text>
  <text x="410" y="66" fill="#94a3b8" font-size="12" text-anchor="middle">Shaded Red Zones Indicate Thermal Burn Involvement on Forensic Examination</text>

  <!-- ANTERIOR VIEW -->
  <g transform="translate(55, 86)">
    <rect width="235" height="356" fill="#1e293b" rx="12" stroke="#475569"/>
    <text x="117" y="28" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle">ANTERIOR VIEW (FRONT)</text>

    <!-- Head (Unburned 4.5%) -->
    <circle cx="117" cy="68" r="22" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
    <text x="117" y="72" fill="#cbd5e1" font-size="10" font-weight="700" text-anchor="middle">4.5%</text>

    <!-- Anterior Trunk: Chest + Abdomen (BURNED = 18%) -->
    <rect x="82" y="95" width="70" height="110" rx="8" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>
    <text x="117" y="142" fill="#ffffff" font-size="12" font-weight="900" text-anchor="middle">ANTERIOR</text>
    <text x="117" y="158" fill="#ffffff" font-size="12" font-weight="900" text-anchor="middle">TRUNK</text>
    <text x="117" y="178" fill="#fef08a" font-size="13" font-weight="900" text-anchor="middle">[BURNED]</text>

    <!-- Right Upper Limb Anterior (Patient's Right = Viewer's Left, BURNED = 4.5%) -->
    <rect x="44" y="98" width="30" height="98" rx="10" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>
    <text x="59" y="150" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">R.Arm</text>
    <text x="59" y="164" fill="#fef08a" font-size="10" font-weight="800" text-anchor="middle">4.5%</text>

    <!-- Left Upper Limb Anterior (Unburned 4.5%) -->
    <rect x="160" y="98" width="30" height="98" rx="10" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
    <text x="175" y="152" fill="#cbd5e1" font-size="10" text-anchor="middle">4.5%</text>

    <!-- Perineum (Unburned 1%) -->
    <polygon points="108,207 126,207 117,222" fill="#334155" stroke="#94a3b8" stroke-width="1.5"/>

    <!-- Right Lower Limb Anterior (Patient's Right = Viewer's Left, BURNED = 9%) -->
    <rect x="82" y="218" width="31" height="115" rx="10" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>
    <text x="97" y="272" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">R.Leg</text>
    <text x="97" y="286" fill="#fef08a" font-size="11" font-weight="900" text-anchor="middle">9%</text>

    <!-- Left Lower Limb Anterior (Unburned 9%) -->
    <rect x="121" y="218" width="31" height="115" rx="10" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
    <text x="136" y="278" fill="#cbd5e1" font-size="10" text-anchor="middle">9%</text>
  </g>

  <!-- POSTERIOR VIEW -->
  <g transform="translate(310, 86)">
    <rect width="235" height="356" fill="#1e293b" rx="12" stroke="#475569"/>
    <text x="117" y="28" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle">POSTERIOR VIEW (BACK)</text>

    <!-- Head Posterior (Unburned 4.5%) -->
    <circle cx="117" cy="68" r="22" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
    <text x="117" y="72" fill="#cbd5e1" font-size="10" font-weight="700" text-anchor="middle">4.5%</text>

    <!-- Posterior Trunk (Unburned 18%) -->
    <rect x="82" y="95" width="70" height="110" rx="8" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
    <text x="117" y="152" fill="#cbd5e1" font-size="11" font-weight="700" text-anchor="middle">Back (18%)</text>

    <!-- Left Upper Limb Posterior (Viewer's Left, Unburned 4.5%) -->
    <rect x="44" y="98" width="30" height="98" rx="10" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
    <text x="59" y="152" fill="#cbd5e1" font-size="10" text-anchor="middle">4.5%</text>

    <!-- Right Upper Limb Posterior (Patient's Right = Viewer's Right, BURNED = 4.5%) -->
    <rect x="160" y="98" width="30" height="98" rx="10" fill="#ef4444" stroke="#fca5a5" stroke-width="2"/>
    <text x="175" y="150" fill="#ffffff" font-size="10" font-weight="800" text-anchor="middle">R.Arm</text>
    <text x="175" y="164" fill="#fef08a" font-size="10" font-weight="800" text-anchor="middle">4.5%</text>

    <!-- Left Lower Limb Posterior (Unburned 9%) -->
    <rect x="82" y="218" width="31" height="115" rx="10" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
    <text x="97" y="278" fill="#cbd5e1" font-size="10" text-anchor="middle">9%</text>

    <!-- Right Lower Limb Posterior (Unburned 9%) -->
    <rect x="121" y="218" width="31" height="115" rx="10" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
    <text x="136" y="278" fill="#cbd5e1" font-size="10" text-anchor="middle">9%</text>
  </g>

  <!-- CASE SUMMARY PANEL -->
  <g transform="translate(565, 86)">
    <rect width="217" height="356" fill="#1e293b" rx="12" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="108" y="32" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">CASE INVOLVEMENT LOG</text>
    <line x1="18" y1="44" x2="199" y2="44" stroke="#334155"/>

    <rect x="16" y="58" width="185" height="62" fill="#0f172a" rx="8" stroke="#ef4444"/>
    <text x="26" y="78" fill="#f87171" font-size="11" font-weight="800">Region 1: Anterior Trunk</text>
    <text x="26" y="96" fill="#cbd5e1" font-size="10.5">Entire Front Chest +</text>
    <text x="26" y="110" fill="#cbd5e1" font-size="10.5">Abdomen burned</text>

    <rect x="16" y="132" width="185" height="62" fill="#0f172a" rx="8" stroke="#ef4444"/>
    <text x="26" y="152" fill="#f87171" font-size="11" font-weight="800">Region 2: Right Upper Limb</text>
    <text x="26" y="170" fill="#cbd5e1" font-size="10.5">Circumferential (Both Front</text>
    <text x="26" y="184" fill="#cbd5e1" font-size="10.5">&amp; Back of Right Arm)</text>

    <rect x="16" y="206" width="185" height="62" fill="#0f172a" rx="8" stroke="#ef4444"/>
    <text x="26" y="226" fill="#f87171" font-size="11" font-weight="800">Region 3: Right Lower Limb</text>
    <text x="26" y="244" fill="#cbd5e1" font-size="10.5">Anterior (Front) surface</text>
    <text x="26" y="258" fill="#cbd5e1" font-size="10.5">ONLY of Right Leg</text>

    <rect x="16" y="282" width="185" height="56" fill="#f59e0b" fill-opacity="0.15" rx="8" stroke="#f59e0b"/>
    <text x="108" y="305" fill="#fbbf24" font-size="11.5" font-weight="800" text-anchor="middle">COMPUTE TOTAL TBSA (%)</text>
    <text x="108" y="324" fill="#fde68a" font-size="10" text-anchor="middle">Region 1 + Region 2 + Region 3</text>
  </g>
</svg>
`);

// 7. Incised Wound vs. Split Lacerated Wound (Tissue Bridging)
export const WOUND_BALLISTICS_SHARP_BLUNT_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 480" width="100%" height="100%" style="background:#0f172a; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="820" height="480" fill="#0f172a" rx="16"/>
  <rect x="14" y="14" width="792" height="452" fill="none" stroke="#334155" stroke-width="1.5" rx="12"/>

  <text x="410" y="44" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="0.8">MECHANICAL TRAUMA: INCISED WOUND VS. SPLIT LACERATION</text>
  <text x="410" y="66" fill="#94a3b8" font-size="12" text-anchor="middle">Magnified Cross-Sectional &amp; Margin Examination under Hand Lens (10x)</text>

  <!-- WOUND X: INCISED WOUND -->
  <g transform="translate(38, 86)">
    <rect width="355" height="356" fill="#1e293b" rx="12" stroke="#38bdf8" stroke-width="1.5"/>
    <rect x="14" y="14" width="327" height="32" fill="#38bdf8" fill-opacity="0.15" rx="8"/>
    <text x="177" y="35" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">WOUND X: SHARP-EDGE INCISED WOUND</text>

    <!-- Cross-section of V-shaped clean cut -->
    <path d="M 35 95 L 135 95 L 177 225 L 220 95 L 320 95 L 320 245 L 35 245 Z" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
    <path d="M 135 95 L 177 225 L 220 95" fill="#450a0a" stroke="#ef4444" stroke-width="3"/>

    <!-- Cleanly divided vessel & nerve ends -->
    <line x1="95" y1="150" x2="152" y2="150" stroke="#38bdf8" stroke-width="4"/>
    <line x1="202" y1="150" x2="260" y2="150" stroke="#38bdf8" stroke-width="4"/>
    <text x="177" y="140" fill="#fca5a5" font-size="10" font-weight="700" text-anchor="middle">Cleanly Severed</text>
    <text x="177" y="153" fill="#fca5a5" font-size="10" font-weight="700" text-anchor="middle">(No Bridging)</text>

    <rect x="18" y="258" width="319" height="84" fill="#0f172a" rx="8" stroke="#334155"/>
    <text x="30" y="277" fill="#38bdf8" font-size="11" font-weight="700">• Margins: Clean-cut, regular, linear, everted</text>
    <text x="30" y="295" fill="#f8fafc" font-size="11" font-weight="700">• Surrounding Skin: Free of contusion or abrasion</text>
    <text x="30" y="313" fill="#f8fafc" font-size="11" font-weight="700">• Hair Bulbs: Sharply &amp; cleanly divided across shaft</text>
    <text x="30" y="331" fill="#f8fafc" font-size="11" font-weight="700">• Termination: Shallow "Tailing" shows direction of cut</text>
  </g>

  <!-- WOUND Y: LACERATED WOUND -->
  <g transform="translate(427, 86)">
    <rect width="355" height="356" fill="#1e293b" rx="12" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="14" y="14" width="327" height="32" fill="#f59e0b" fill-opacity="0.15" rx="8"/>
    <text x="177" y="35" fill="#fbbf24" font-size="14" font-weight="800" text-anchor="middle">WOUND Y: BLUNT SPLIT LACERATION</text>

    <!-- Cross-section of jagged wound over skull bone -->
    <path d="M 35 95 L 122 95 L 132 125 L 125 155 L 148 190 L 177 222 L 205 188 L 228 152 L 218 122 L 232 95 L 320 95 L 320 245 L 35 245 Z" fill="#334155" stroke="#94a3b8" stroke-width="2"/>
    <!-- Marginal Contusion / Abrasion zones -->
    <rect x="95" y="92" width="32" height="12" fill="#991b1b" rx="3"/>
    <rect x="228" y="92" width="32" height="12" fill="#991b1b" rx="3"/>
    <text x="75" y="86" fill="#f87171" font-size="9.5" font-weight="700">Bruised Margins</text>

    <!-- Intact Tissue Bridges (Nerves, Vessels, Connective Tissue Strands) -->
    <path d="M 128 135 Q 177 142 225 135" fill="none" stroke="#fbbf24" stroke-width="4"/>
    <path d="M 138 168 Q 177 175 216 168" fill="none" stroke="#ef4444" stroke-width="4"/>
    <path d="M 152 196 Q 177 202 202 196" fill="none" stroke="#38bdf8" stroke-width="3.5"/>

    <rect x="115" y="102" width="125" height="24" fill="#0f172a" rx="6" stroke="#fbbf24" stroke-width="1.5"/>
    <text x="177" y="118" fill="#fbbf24" font-size="11" font-weight="900" text-anchor="middle">[FEATURE Z] BRIDGING</text>

    <rect x="18" y="258" width="319" height="84" fill="#0f172a" rx="8" stroke="#334155"/>
    <text x="30" y="277" fill="#fbbf24" font-size="11" font-weight="700">• Margins: Irregular, ragged, jagged &amp; contused</text>
    <text x="30" y="295" fill="#f8fafc" font-size="11" font-weight="700">• Hair Bulbs: Crushed &amp; intact hairs pushed into wound</text>
    <text x="30" y="313" fill="#fbbf24" font-size="11" font-weight="700">• [FEATURE Z]: Intact nerves, elastic fibers &amp; vessels</text>
    <text x="30" y="331" fill="#cbd5e1" font-size="11" font-weight="700">  spanning across the floor ("Tissue Bridging")</text>
  </g>
</svg>
`);

// 8. Diatom Bone Marrow Extraction & Acid Digestion Workflow
export const DIATOM_BONE_MARROW_DROWNING_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 480" width="100%" height="100%" style="background:#0f172a; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="820" height="480" fill="#0f172a" rx="16"/>
  <rect x="14" y="14" width="792" height="452" fill="none" stroke="#334155" stroke-width="1.5" rx="12"/>

  <text x="410" y="44" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="0.8">FORENSIC DIATOM TEST IN IMMERSION DEATHS (ACID DIGESTION PROTOCOL)</text>
  <text x="410" y="66" fill="#94a3b8" font-size="12" text-anchor="middle">Pathophysiological Pathway &amp; Laboratory Confirmation of Antemortem Drowning</text>

  <!-- Step 1: Alveolar-Capillary Penetration & Systemic Circulation -->
  <g transform="translate(35, 92)">
    <rect width="235" height="230" fill="#1e293b" rx="12" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="117" y="26" fill="#38bdf8" font-size="12.5" font-weight="800" text-anchor="middle">1. SYSTEMIC DISSEMINATION</text>
    <rect x="18" y="42" width="199" height="115" fill="#0f172a" rx="8" stroke="#334155"/>
    <text x="117" y="65" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Drowning Water Inhaled</text>
    <text x="117" y="84" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">↓</text>
    <text x="117" y="102" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Ruptured Alveolar Wall</text>
    <text x="117" y="121" fill="#ef4444" font-size="12" font-weight="800" text-anchor="middle">↓ [BEATING HEART]</text>
    <text x="117" y="142" fill="#fbbf24" font-size="11" font-weight="800" text-anchor="middle">Closed Femur Bone Marrow</text>
    <text x="117" y="182" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Protected from postmortem</text>
    <text x="117" y="198" fill="#cbd5e1" font-size="10.5" text-anchor="middle">water contamination &amp; putrefaction</text>
  </g>

  <!-- Step 2: Strong Acid Digestion -->
  <g transform="translate(292, 92)">
    <rect width="235" height="230" fill="#1e293b" rx="12" stroke="#f59e0b" stroke-width="1.5"/>
    <text x="117" y="26" fill="#fbbf24" font-size="12.5" font-weight="800" text-anchor="middle">2. ACID DIGESTION</text>
    <rect x="18" y="42" width="199" height="115" fill="#0f172a" rx="8" stroke="#334155"/>
    <text x="117" y="68" fill="#fbbf24" font-size="11.5" font-weight="800" text-anchor="middle">50 g Femur Marrow +</text>
    <text x="117" y="90" fill="#f8fafc" font-size="12" font-weight="800" text-anchor="middle">Conc. HNO₃ + H₂SO₄</text>
    <text x="117" y="114" fill="#94a3b8" font-size="10.5" text-anchor="middle">Organic tissue dissolved;</text>
    <text x="117" y="132" fill="#34d399" font-size="11" font-weight="800" text-anchor="middle">Silica (SiO₂) Exoskeleton</text>
    <text x="117" y="148" fill="#34d399" font-size="10.5" font-weight="700" text-anchor="middle">Resists Acid &amp; Heat</text>
    <text x="117" y="182" fill="#cbd5e1" font-size="10.5" text-anchor="middle">Centrifuged at 3000 rpm;</text>
    <text x="117" y="198" fill="#cbd5e1" font-size="10.5" text-anchor="middle">pellet washed in distilled H₂O</text>
  </g>

  <!-- Step 3: Microscopic Frustule Morphology -->
  <g transform="translate(550, 92)">
    <rect width="235" height="230" fill="#1e293b" rx="12" stroke="#10b981" stroke-width="1.5"/>
    <text x="117" y="26" fill="#34d399" font-size="12.5" font-weight="800" text-anchor="middle">3. MICROSCOPIC MATCH</text>
    <circle cx="117" cy="106" r="56" fill="#020617" stroke="#10b981" stroke-width="2"/>
    <!-- Pennate Diatom (Boat-shaped bilateral symmetry) -->
    <ellipse cx="95" cy="98" rx="28" ry="8" transform="rotate(-25 95 98)" fill="none" stroke="#38bdf8" stroke-width="2"/>
    <line x1="72" y1="109" x2="118" y2="87" stroke="#38bdf8" stroke-width="1.2"/>
    <!-- Centric Diatom (Radial symmetry) -->
    <circle cx="138" cy="118" r="16" fill="none" stroke="#fbbf24" stroke-width="2"/>
    <circle cx="138" cy="118" r="8" fill="none" stroke="#fbbf24" stroke-width="1" stroke-dasharray="2,2"/>

    <text x="117" y="182" fill="#38bdf8" font-size="10.5" font-weight="700" text-anchor="middle">Pennate (Navicula / Pinnularia)</text>
    <text x="117" y="198" fill="#fbbf24" font-size="10.5" font-weight="700" text-anchor="middle">&amp; Centric (Cyclotella) Frustules</text>
  </g>

  <!-- Bottom Diagnostic Rule Banner -->
  <rect x="35" y="340" width="750" height="102" fill="#1e293b" rx="12" stroke="#38bdf8" stroke-width="1.5"/>
  <text x="410" y="366" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">MEDICO-LEGAL INTERPRETATION OF POSITIVE BONE MARROW DIATOM TEST</text>
  <text x="410" y="390" fill="#f8fafc" font-size="11.5" text-anchor="middle">In postmortem submersion (body dumped after death), water may passively enter lungs,</text>
  <text x="410" y="410" fill="#fbbf24" font-size="11.5" font-weight="700" text-anchor="middle">but WITHOUT an active heartbeat (vital circulation), diatoms CANNOT reach femoral bone marrow, brain, or kidneys.</text>
  <text x="410" y="428" fill="#94a3b8" font-size="10.5" text-anchor="middle">Size of penetrating diatoms: typically 10–60 μm; species profile must match crime scene water sample.</text>
</svg>
`);

// 9. Forensic Osteology: Skull Sexual Dimorphism Landmarks
export const SKULL_SEXUAL_DIMORPHISM_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 480" width="100%" height="100%" style="background:#0f172a; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="820" height="480" fill="#0f172a" rx="16"/>
  <rect x="14" y="14" width="792" height="452" fill="none" stroke="#334155" stroke-width="1.5" rx="12"/>

  <text x="410" y="44" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="0.8">FORENSIC OSTEOLOGY: CRANIAL SEXUAL DIMORPHISM LANDMARKS</text>
  <text x="410" y="66" fill="#94a3b8" font-size="12" text-anchor="middle">Comparative Anthropological Features of Adult Human Crania (Profile I vs. Profile II)</text>

  <!-- PROFILE I (Male Cranium) -->
  <g transform="translate(38, 86)">
    <rect width="355" height="356" fill="#1e293b" rx="12" stroke="#38bdf8" stroke-width="1.5"/>
    <rect x="14" y="14" width="327" height="32" fill="#38bdf8" fill-opacity="0.15" rx="8"/>
    <text x="177" y="35" fill="#38bdf8" font-size="14" font-weight="800" text-anchor="middle">CRANIAL PROFILE I</text>

    <!-- Lateral Skull Profile I (Sloping forehead, prominent glabella, large mastoid, square chin) -->
    <path d="M 95 155 C 108 102, 165 72, 232 82 C 278 90, 295 135, 282 185 L 258 218 L 245 192 L 210 195 L 205 235 L 122 235 L 118 202 L 105 195 L 108 168 L 86 162 Z" fill="#334155" stroke="#cbd5e1" stroke-width="2.5"/>
    <!-- Prominent Glabella / Supraorbital Ridge -->
    <circle cx="92" cy="158" r="6" fill="#ef4444"/>
    <text x="20" y="148" fill="#f87171" font-size="10" font-weight="800">Prominent Glabella</text>
    <!-- Sloping Forehead -->
    <text x="72" y="95" fill="#38bdf8" font-size="10" font-weight="700">Receding / Sloping Forehead</text>
    <!-- Large Mastoid Process -->
    <circle cx="256" cy="212" r="7" fill="#fbbf24"/>
    <text x="268" y="218" fill="#fbbf24" font-size="10" font-weight="800">Large Mastoid</text>
    <!-- Square Chin & ~90° Everted Gonial Angle -->
    <text x="48" y="232" fill="#34d399" font-size="10" font-weight="800">Square Chin</text>

    <rect x="18" y="254" width="319" height="88" fill="#0f172a" rx="8" stroke="#334155"/>
    <text x="30" y="273" fill="#38bdf8" font-size="11" font-weight="700">1. Forehead: Receding / sloping; small frontal eminences</text>
    <text x="30" y="291" fill="#f8fafc" font-size="11" font-weight="700">2. Supraorbital Margin: Rounded &amp; blunt; square orbits</text>
    <text x="30" y="309" fill="#f8fafc" font-size="11" font-weight="700">3. Mastoid Process &amp; Nuchal Lines: Large, rugged, heavy</text>
    <text x="30" y="327" fill="#f8fafc" font-size="11" font-weight="700">4. Mandible: Square symphysis menti; Gonial angle ~90° everted</text>
  </g>

  <!-- PROFILE II (Female Cranium) -->
  <g transform="translate(427, 86)">
    <rect width="355" height="356" rx="12" fill="#1e293b" stroke="#ec4899" stroke-width="1.5"/>
    <rect x="14" y="14" width="327" height="32" fill="#ec4899" fill-opacity="0.15" rx="8"/>
    <text x="177" y="35" fill="#f472b6" font-size="14" font-weight="800" text-anchor="middle">CRANIAL PROFILE II</text>

    <!-- Lateral Skull Profile II (Vertical forehead, smooth glabella, small mastoid, pointed chin) -->
    <path d="M 102 155 C 100 105, 148 75, 222 82 C 268 88, 282 132, 270 178 L 254 196 L 245 186 L 210 190 L 195 228 L 130 228 L 122 198 L 105 190 Z" fill="#334155" stroke="#cbd5e1" stroke-width="2.5"/>
    <!-- Vertical Bossed Forehead -->
    <circle cx="104" cy="118" r="6" fill="#f472b6"/>
    <text x="20" y="102" fill="#f472b6" font-size="10" font-weight="800">Vertical Forehead &amp;</text>
    <text x="20" y="114" fill="#f472b6" font-size="10" font-weight="800">Prominent Frontal Bossing</text>
    <!-- Smooth Glabella -->
    <text x="22" y="160" fill="#cbd5e1" font-size="10" font-weight="700">Smooth Glabella</text>
    <!-- Small Mastoid -->
    <circle cx="253" cy="193" r="5" fill="#38bdf8"/>
    <text x="264" y="198" fill="#38bdf8" font-size="10" font-weight="800">Small Mastoid</text>
    <!-- Rounded Chin & Obtuse Angle (>125°) -->
    <text x="38" y="230" fill="#fbbf24" font-size="10" font-weight="800">Rounded Chin</text>

    <rect x="18" y="254" width="319" height="88" fill="#0f172a" rx="8" stroke="#334155"/>
    <text x="30" y="273" fill="#f472b6" font-size="11" font-weight="700">1. Forehead: Vertical, rounded; prominent frontal eminences</text>
    <text x="30" y="291" fill="#f8fafc" font-size="11" font-weight="700">2. Supraorbital Margin: Sharp, thin-edged; rounded high orbits</text>
    <text x="30" y="309" fill="#f8fafc" font-size="11" font-weight="700">3. Mastoid Process &amp; Nuchal Lines: Small, smooth, gracile</text>
    <text x="30" y="327" fill="#f8fafc" font-size="11" font-weight="700">4. Mandible: Rounded/pointed chin; Obtuse gonial angle (&gt;125°)</text>
  </g>
</svg>
`);

// 10. Postmortem Lividity (Livor Mortis) Distribution, Contact Pallor & Coloration
export const LIVOR_MORTIS_BLANCHING_FIXATION_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 480" width="100%" height="100%" style="background:#0f172a; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="820" height="480" fill="#0f172a" rx="16"/>
  <rect x="14" y="14" width="792" height="452" fill="none" stroke="#334155" stroke-width="1.5" rx="12"/>

  <text x="410" y="44" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="0.8">LIVOR MORTIS (POSTMORTEM HYPOSTASIS): FIXATION &amp; TOXICOLOGY COLOR KEY</text>
  <text x="410" y="66" fill="#94a3b8" font-size="12" text-anchor="middle">Gravitational Settling in Supine Corpse, Pressure Contact Pallor &amp; Specific Poison Colorations</text>

  <!-- Top Diagram: Supine Corpse on Floor showing Dependent Lividity & Contact Pallor -->
  <g transform="translate(38, 86)">
    <rect width="744" height="190" fill="#1e293b" rx="12" stroke="#475569"/>
    <text x="372" y="25" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle">SUPINE BODY ON FIRM FLOOR SURFACE (GRAVITY ARROW ↓)</text>

    <!-- Floor Line -->
    <line x1="60" y1="138" x2="684" y2="138" stroke="#94a3b8" stroke-width="4"/>
    <text x="372" y="175" fill="#94a3b8" font-size="11" font-weight="700" text-anchor="middle">Firm Underlying Surface Compressing Capillaries at Bony Prominences (Scapulae, Buttocks, Calves, Heels)</text>

    <!-- Dependent Violaceous Lividity Layer -->
    <rect x="95" y="75" width="554" height="60" rx="22" fill="#475569" stroke="#cbd5e1" stroke-width="2"/>
    <rect x="98" y="108" width="548" height="27" rx="10" fill="#9333ea" fill-opacity="0.75"/>

    <!-- Contact Pallor Zones (White compressed patches touching the floor) -->
    <rect x="175" y="122" width="75" height="14" fill="#f8fafc" rx="4"/>
    <rect x="335" y="122" width="85" height="14" fill="#f8fafc" rx="4"/>
    <rect x="505" y="122" width="65" height="14" fill="#f8fafc" rx="4"/>

    <text x="212" y="155" fill="#fbbf24" font-size="10.5" font-weight="800" text-anchor="middle">Scapular Pallor</text>
    <text x="377" y="155" fill="#fbbf24" font-size="10.5" font-weight="800" text-anchor="middle">Gluteal Contact Pallor</text>
    <text x="537" y="155" fill="#fbbf24" font-size="10.5" font-weight="800" text-anchor="middle">Calf Contact Pallor</text>

    <!-- Timeline Badges inside top box -->
    <text x="372" y="55" fill="#e9d5ff" font-size="11" font-weight="700" text-anchor="middle">Appears: 1–2 hrs (mottled) • Coalesces: 3–6 hrs (Blanches on thumb pressure) • Fixed: &gt;8–12 hrs (Hemolysis; Non-blanching)</text>
  </g>

  <!-- Bottom 4 Color Reference Cards for Toxicological Diagnosis -->
  <g transform="translate(38, 292)">
    <!-- Card 1 -->
    <rect width="175" height="150" fill="#1e293b" rx="10" stroke="#ef4444" stroke-width="2"/>
    <rect x="12" y="12" width="151" height="28" fill="#ef4444" rx="6"/>
    <text x="87" y="30" fill="#ffffff" font-size="11.5" font-weight="800" text-anchor="middle">CHERRY-RED</text>
    <text x="87" y="64" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Carbon Monoxide (CO)</text>
    <text x="87" y="84" fill="#cbd5e1" font-size="10" text-anchor="middle">(Carboxyhemoglobin)</text>
    <text x="87" y="112" fill="#94a3b8" font-size="9.5" text-anchor="middle">Formed by CO binding Hb</text>
    <text x="87" y="128" fill="#94a3b8" font-size="9.5" text-anchor="middle">with 200–250× O₂ affinity</text>

    <!-- Card 2 -->
    <g transform="translate(190, 0)">
      <rect width="175" height="150" fill="#1e293b" rx="10" stroke="#ec4899" stroke-width="2"/>
      <rect x="12" y="12" width="151" height="28" fill="#f43f5e" rx="6"/>
      <text x="87" y="30" fill="#ffffff" font-size="11.5" font-weight="800" text-anchor="middle">BRIGHT PINK</text>
      <text x="87" y="64" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Cyanide (HCN) &amp;</text>
      <text x="87" y="82" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Hypothermia / Cold</text>
      <text x="87" y="112" fill="#94a3b8" font-size="9.5" text-anchor="middle">Cytochrome oxidase block</text>
      <text x="87" y="128" fill="#94a3b8" font-size="9.5" text-anchor="middle">(High venous O₂ saturation)</text>
    </g>

    <!-- Card 3 -->
    <g transform="translate(380, 0)">
      <rect width="175" height="150" fill="#1e293b" rx="10" stroke="#f59e0b" stroke-width="2"/>
      <rect x="12" y="12" width="151" height="28" fill="#78350f" rx="6" stroke="#fbbf24"/>
      <text x="87" y="30" fill="#fef08a" font-size="11" font-weight="800" text-anchor="middle">CHOCOLATE-BROWN</text>
      <text x="87" y="62" fill="#fbbf24" font-size="11.5" font-weight="800" text-anchor="middle">[TOXIN GROUP M]</text>
      <text x="87" y="82" fill="#f8fafc" font-size="10.5" font-weight="700" text-anchor="middle">Potassium Chlorate,</text>
      <text x="87" y="98" fill="#f8fafc" font-size="10.5" font-weight="700" text-anchor="middle">Nitrites, Aniline, Bromates</text>
      <text x="87" y="124" fill="#fbbf24" font-size="10" font-weight="700" text-anchor="middle">(Methemoglobinemia Fe³⁺)</text>
    </g>

    <!-- Card 4 -->
    <g transform="translate(570, 0)">
      <rect width="174" height="150" fill="#1e293b" rx="10" stroke="#10b981" stroke-width="2"/>
      <rect x="12" y="12" width="150" height="28" fill="#065f46" rx="6" stroke="#34d399"/>
      <text x="87" y="30" fill="#a7f3d0" font-size="11" font-weight="800" text-anchor="middle">BLUISH-GREEN</text>
      <text x="87" y="64" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Hydrogen Sulfide (H₂S)</text>
      <text x="87" y="84" fill="#cbd5e1" font-size="10" text-anchor="middle">(Sulfhemoglobinemia)</text>
      <text x="87" y="112" fill="#94a3b8" font-size="9.5" text-anchor="middle">Sewer gas poisoning &amp;</text>
      <text x="87" y="128" fill="#94a3b8" font-size="9.5" text-anchor="middle">early cecal putrefaction</text>
    </g>
  </g>
</svg>
`);
