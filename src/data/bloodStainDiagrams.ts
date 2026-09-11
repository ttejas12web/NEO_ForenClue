/**
 * Forensic Bloodstain Pattern Analysis (BPA) Reference Diagrams
 * Vector SVG Data URIs for educational clarity, high-resolution rendering, and full-size inspection
 */

const svgToDataUri = (svgString: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
};

// 1. Droplet In-Flight Geometry (Spherical vs Teardrop Myth)
export const BLOOD_DROP_FLIGHT_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <!-- Header -->
  <text x="400" y="45" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">BLOOD DROPLET FLUID DYNAMICS IN FREE FLIGHT</text>
  <text x="400" y="68" fill="#94a3b8" font-size="12" text-anchor="middle">Physical Forces: Cohesion, Surface Tension (0.05 N/m), and Gravitational Acceleration</text>

  <!-- Left Card: Scientific Reality (Spherical Oscillation) -->
  <g transform="translate(45, 95)">
    <rect width="330" height="345" fill="#1e293b" rx="12" stroke="#10b981" stroke-width="1.5"/>
    <rect x="15" y="15" width="300" height="30" fill="#10b981" fill-opacity="0.2" rx="6"/>
    <text x="165" y="35" fill="#34d399" font-size="13" font-weight="800" text-anchor="middle">SCIENTIFIC REALITY: SPHERICAL FLIGHT</text>

    <!-- Flight Stage Box -->
    <rect x="25" y="60" width="280" height="175" fill="#0f172a" rx="8" stroke="#334155"/>
    
    <!-- Droplet 1: Initial Detachment & Oscillation -->
    <circle cx="80" cy="115" r="22" fill="#dc2626" stroke="#f87171" stroke-width="2"/>
    <ellipse cx="80" cy="115" rx="18" ry="24" fill="none" stroke="#fca5a5" stroke-dasharray="3,2"/>
    <text x="80" y="165" fill="#cbd5e1" font-size="10" font-weight="700" text-anchor="middle">Damped Oscillation</text>
    <text x="80" y="180" fill="#64748b" font-size="9" text-anchor="middle">(Prolate / Oblate)</text>

    <!-- Flight Arrow -->
    <path d="M 120,115 L 180,115" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,3"/>
    <polygon points="180,111 190,115 180,119" fill="#38bdf8"/>

    <!-- Droplet 2: Stable Flight Sphere -->
    <circle cx="230" cy="115" r="24" fill="#991b1b" stroke="#ef4444" stroke-width="2.5"/>
    <!-- Inward Surface Tension Arrows -->
    <path d="M 230,75 L 230,86 M 230,155 L 230,144 M 190,115 L 201,115 M 270,115 L 259,115" stroke="#fbbf24" stroke-width="2"/>
    <text x="230" y="165" fill="#34d399" font-size="11" font-weight="800" text-anchor="middle">Equilibrium Sphere</text>
    <text x="230" y="180" fill="#94a3b8" font-size="9" text-anchor="middle">Uniform Surface Tension</text>

    <!-- Explanation text -->
    <text x="165" y="260" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Surface Tension Minimizes Surface Area</text>
    <text x="165" y="280" fill="#cbd5e1" font-size="11" text-anchor="middle">Internal cohesive bonds pull molecules inward</text>
    <text x="165" y="300" fill="#94a3b8" font-size="10" text-anchor="middle">Droplet maintains spherical shape until surface impact</text>
    <text x="165" y="322" fill="#34d399" font-size="10" font-weight="700" text-anchor="middle">True Droplet Shape in Air</text>
  </g>

  <!-- Right Card: Popular Misconception (The Teardrop Myth) -->
  <g transform="translate(425, 95)">
    <rect width="330" height="345" fill="#1e293b" rx="12" stroke="#ef4444" stroke-width="1.5"/>
    <rect x="15" y="15" width="300" height="30" fill="#ef4444" fill-opacity="0.2" rx="6"/>
    <text x="165" y="35" fill="#f87171" font-size="13" font-weight="800" text-anchor="middle">COMMON MISCONCEPTION: TEARDROP SHAPE</text>

    <!-- Erroneous Drawing Box -->
    <rect x="25" y="60" width="280" height="175" fill="#0f172a" rx="8" stroke="#334155"/>
    
    <!-- Erroneous Teardrop Graphic -->
    <path d="M 165,75 C 165,75 125,125 125,150 C 125,175 142,195 165,195 C 188,195 205,175 205,150 C 205,125 165,75 165,75 Z" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>
    
    <!-- Red Ban Cross Overlay -->
    <line x1="115" y1="85" x2="215" y2="185" stroke="#ef4444" stroke-width="4"/>
    <line x1="215" y1="85" x2="115" y2="185" stroke="#ef4444" stroke-width="4"/>
    
    <text x="165" y="218" fill="#ef4444" font-size="11" font-weight="800" text-anchor="middle">INCORRECT (Only Exists While Clinging to Emitter)</text>

    <!-- Explanation text -->
    <text x="165" y="260" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Teardrop Myth Refuted by High-Speed Video</text>
    <text x="165" y="280" fill="#cbd5e1" font-size="11" text-anchor="middle">A drop only has a tail when adhering to skin or weapon</text>
    <text x="165" y="300" fill="#94a3b8" font-size="10" text-anchor="middle">Once released in free flight, surface tension snaps it round</text>
    <text x="165" y="322" fill="#ef4444" font-size="10" font-weight="700" text-anchor="middle">Physically Impossible in Airborne Free Flight</text>
  </g>
</svg>
`);

// 2. Angle of Impact Trigonometric Formula & Measurement Protocol
export const ANGLE_OF_IMPACT_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="45" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">TRIGONOMETRIC DETERMINATION OF IMPACT ANGLE (BALTHAZARD)</text>
  <text x="400" y="68" fill="#94a3b8" font-size="12" text-anchor="middle">Width-to-Length Ratio Formulation: sin(θ) = Width (W) / Length (L)</text>

  <!-- Left: Stain Measurement Anatomy -->
  <g transform="translate(45, 95)">
    <rect width="360" height="345" fill="#1e293b" rx="12" stroke="#3b82f6" stroke-width="1.5"/>
    <rect x="15" y="15" width="330" height="28" fill="#3b82f6" fill-opacity="0.2" rx="6"/>
    <text x="180" y="34" fill="#60a5fa" font-size="13" font-weight="800" text-anchor="middle">ELLIPTICAL STAIN CALIPER MEASUREMENT</text>

    <!-- Diagram Display Box -->
    <rect x="25" y="55" width="310" height="195" fill="#0f172a" rx="8" stroke="#334155"/>
    
    <!-- Elliptical Parent Stain with Directional Tail -->
    <g transform="translate(130, 150) rotate(-35)">
      <!-- Main ellipse -->
      <ellipse cx="0" cy="0" rx="35" ry="70" fill="#b91c1c" stroke="#f87171" stroke-width="2"/>
      <!-- Tail extending outward -->
      <path d="M 0,-70 Q -8,-105 -2,-135 Q 2,-115 0,-70" fill="#b91c1c"/>
      <!-- Excluded tail demarcation bracket -->
      <line x1="-45" y1="-70" x2="45" y2="-70" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="3,2"/>
      <text x="50" y="-72" fill="#fbbf24" font-size="9" font-weight="700">Tail Excluded</text>

      <!-- Dimension: Width (Minor Axis) -->
      <line x1="-35" y1="0" x2="35" y2="0" stroke="#38bdf8" stroke-width="2.5"/>
      <circle cx="-35" cy="0" r="3" fill="#38bdf8"/>
      <circle cx="35" cy="0" r="3" fill="#38bdf8"/>

      <!-- Dimension: Length (Major Axis, Excluding Tail) -->
      <line x1="0" y1="-70" x2="0" y2="70" stroke="#34d399" stroke-width="2.5"/>
      <circle cx="0" cy="-70" r="3" fill="#34d399"/>
      <circle cx="0" cy="70" r="3" fill="#34d399"/>
    </g>

    <text x="180" y="270" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Measurement Rule: Exclude the Tail</text>
    <text x="180" y="292" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">• Width (W) = Minor axis at widest diameter</text>
    <text x="180" y="312" fill="#34d399" font-size="11" font-weight="700" text-anchor="middle">• Length (L) = Major axis of main ellipse ONLY</text>
    <text x="180" y="332" fill="#cbd5e1" font-size="10" text-anchor="middle">Spines, scallops, and tapering tails are omitted</text>
  </g>

  <!-- Right: Trigonometric Triangle & Formula -->
  <g transform="translate(435, 95)">
    <rect width="320" height="345" fill="#1e293b" rx="12" stroke="#fbbf24" stroke-width="1.5"/>
    <rect x="15" y="15" width="290" height="28" fill="#fbbf24" fill-opacity="0.2" rx="6"/>
    <text x="160" y="34" fill="#fcd34d" font-size="13" font-weight="800" text-anchor="middle">RIGHT-TRIANGLE DERIVATION</text>

    <!-- Triangle Visual -->
    <rect x="25" y="55" width="270" height="150" fill="#0f172a" rx="8" stroke="#334155"/>
    <polygon points="55,165 245,165 245,85" fill="#fbbf24" fill-opacity="0.1" stroke="#fbbf24" stroke-width="2"/>
    
    <!-- Right Angle Symbol -->
    <rect x="230" y="150" width="15" height="15" fill="none" stroke="#fbbf24" stroke-width="1.5"/>

    <!-- Labels -->
    <text x="150" y="182" fill="#34d399" font-size="11" font-weight="700" text-anchor="middle">Hypotenuse = Length (L)</text>
    <text x="258" y="125" fill="#38bdf8" font-size="11" font-weight="700">Opposite = Width (W)</text>
    
    <!-- Angle Arc -->
    <path d="M 85,165 A 30 30 0 0 0 80,152" stroke="#f43f5e" stroke-width="2.5" fill="none"/>
    <text x="95" y="155" fill="#f43f5e" font-size="13" font-weight="800">θ</text>

    <!-- Formula Box -->
    <rect x="25" y="220" width="270" height="105" fill="#0f172a" rx="8" stroke="#3b82f6"/>
    <text x="160" y="245" fill="#60a5fa" font-size="12" font-weight="800" text-anchor="middle">MATHEMATICAL EQUATION:</text>
    <text x="160" y="275" fill="#f8fafc" font-size="16" font-family="monospace" font-weight="800" text-anchor="middle">sin(θ) = W / L</text>
    <text x="160" y="305" fill="#fbbf24" font-size="14" font-family="monospace" font-weight="700" text-anchor="middle">θ = arcsin( W / L )</text>

    <text x="160" y="337" fill="#94a3b8" font-size="10" text-anchor="middle">Example: W=12mm, L=24mm → sin(θ)=0.5 → θ=30°</text>
  </g>
</svg>
`);

// 3. Impact Angle Spectrum (90° down to 10°)
export const IMPACT_ANGLE_SERIES_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="45" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">DROPLET IMPACT ANGLE MORPHOLOGY SPECTRUM</text>
  <text x="400" y="68" fill="#94a3b8" font-size="12" text-anchor="middle">Visual Progression of Stain Elongation and Directional Spine Formation (90° to 10°)</text>

  <!-- 5 Angle Columns: 90°, 70°, 50°, 30°, 10° -->
  <g transform="translate(30, 95)">
    
    <!-- 90 Degrees -->
    <g transform="translate(0, 0)">
      <rect width="140" height="340" fill="#1e293b" rx="10" stroke="#334155"/>
      <rect x="10" y="10" width="120" height="26" fill="#3b82f6" fill-opacity="0.2" rx="4"/>
      <text x="70" y="28" fill="#60a5fa" font-size="13" font-weight="800" text-anchor="middle">90° (PERP)</text>
      
      <rect x="15" y="48" width="110" height="150" fill="#0f172a" rx="8"/>
      <!-- Circular Stain with uniform scallops -->
      <circle cx="70" cy="120" r="38" fill="#dc2626" stroke="#f87171" stroke-width="1.5"/>
      <!-- Small radiating scallops -->
      <circle cx="70" cy="78" r="2" fill="#dc2626"/>
      <circle cx="70" cy="162" r="2" fill="#dc2626"/>
      <circle cx="28" cy="120" r="2" fill="#dc2626"/>
      <circle cx="112" cy="120" r="2" fill="#dc2626"/>

      <text x="70" y="225" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Circular</text>
      <text x="70" y="245" fill="#94a3b8" font-size="11" text-anchor="middle">W / L = 1.0</text>
      <text x="70" y="275" fill="#cbd5e1" font-size="10" text-anchor="middle">No tail</text>
      <text x="70" y="295" fill="#cbd5e1" font-size="10" text-anchor="middle">Uniform scallops</text>
      <text x="70" y="315" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Zero Directionality</text>
    </g>

    <!-- 70 Degrees -->
    <g transform="translate(150, 0)">
      <rect width="140" height="340" fill="#1e293b" rx="10" stroke="#334155"/>
      <rect x="10" y="10" width="120" height="26" fill="#06b6d4" fill-opacity="0.2" rx="4"/>
      <text x="70" y="28" fill="#22d3ee" font-size="13" font-weight="800" text-anchor="middle">70° IMPACT</text>
      
      <rect x="15" y="48" width="110" height="150" fill="#0f172a" rx="8"/>
      <!-- Slight Oval -->
      <ellipse cx="70" cy="120" rx="35" ry="40" fill="#dc2626" stroke="#f87171" stroke-width="1.5"/>

      <text x="70" y="225" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Slight Oval</text>
      <text x="70" y="245" fill="#94a3b8" font-size="11" text-anchor="middle">W / L = 0.94</text>
      <text x="70" y="275" fill="#cbd5e1" font-size="10" text-anchor="middle">Minor asymmetry</text>
      <text x="70" y="295" fill="#cbd5e1" font-size="10" text-anchor="middle">Subtle scalloping</text>
      <text x="70" y="315" fill="#22d3ee" font-size="10" font-weight="700" text-anchor="middle">Incipient Vector</text>
    </g>

    <!-- 50 Degrees -->
    <g transform="translate(300, 0)">
      <rect width="140" height="340" fill="#1e293b" rx="10" stroke="#334155"/>
      <rect x="10" y="10" width="120" height="26" fill="#10b981" fill-opacity="0.2" rx="4"/>
      <text x="70" y="28" fill="#34d399" font-size="13" font-weight="800" text-anchor="middle">50° IMPACT</text>
      
      <rect x="15" y="48" width="110" height="150" fill="#0f172a" rx="8"/>
      <!-- Distinct Ellipse -->
      <ellipse cx="70" cy="125" rx="30" ry="48" fill="#dc2626" stroke="#f87171" stroke-width="1.5"/>
      <!-- Small tail budding -->
      <path d="M 68,77 L 70,62 L 72,77 Z" fill="#dc2626"/>

      <text x="70" y="225" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Elliptical</text>
      <text x="70" y="245" fill="#94a3b8" font-size="11" text-anchor="middle">W / L = 0.77</text>
      <text x="70" y="275" fill="#cbd5e1" font-size="10" text-anchor="middle">Clear major axis</text>
      <text x="70" y="295" fill="#cbd5e1" font-size="10" text-anchor="middle">Leading edge spines</text>
      <text x="70" y="315" fill="#34d399" font-size="10" font-weight="700" text-anchor="middle">Clear Direction</text>
    </g>

    <!-- 30 Degrees -->
    <g transform="translate(450, 0)">
      <rect width="140" height="340" fill="#1e293b" rx="10" stroke="#334155"/>
      <rect x="10" y="10" width="120" height="26" fill="#f59e0b" fill-opacity="0.2" rx="4"/>
      <text x="70" y="28" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">30° IMPACT</text>
      
      <rect x="15" y="48" width="110" height="150" fill="#0f172a" rx="8"/>
      <!-- Elongated Ellipse with prominent tail -->
      <ellipse cx="70" cy="130" rx="24" ry="50" fill="#dc2626" stroke="#f87171" stroke-width="1.5"/>
      <path d="M 67,80 Q 69,60 70,45 Q 71,60 73,80 Z" fill="#dc2626"/>
      <circle cx="70" cy="38" r="2.5" fill="#dc2626"/>

      <text x="70" y="225" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Elongated</text>
      <text x="70" y="245" fill="#94a3b8" font-size="11" text-anchor="middle">W / L = 0.50</text>
      <text x="70" y="275" fill="#cbd5e1" font-size="10" text-anchor="middle">Prominent tail</text>
      <text x="70" y="295" fill="#cbd5e1" font-size="10" text-anchor="middle">Wave cast-off satellite</text>
      <text x="70" y="315" fill="#fbbf24" font-size="10" font-weight="700" text-anchor="middle">Sharp Directionality</text>
    </g>

    <!-- 10 Degrees -->
    <g transform="translate(600, 0)">
      <rect width="140" height="340" fill="#1e293b" rx="10" stroke="#334155"/>
      <rect x="10" y="10" width="120" height="26" fill="#ec4899" fill-opacity="0.2" rx="4"/>
      <text x="70" y="28" fill="#f472b6" font-size="13" font-weight="800" text-anchor="middle">10° IMPACT</text>
      
      <rect x="15" y="48" width="110" height="150" fill="#0f172a" rx="8"/>
      <!-- Extreme Elongation / Tear shape -->
      <ellipse cx="70" cy="142" rx="14" ry="42" fill="#dc2626" stroke="#f87171" stroke-width="1.5"/>
      <path d="M 68,100 L 69,45 L 71,45 L 72,100 Z" fill="#dc2626"/>
      <circle cx="70" cy="38" r="2.5" fill="#dc2626"/>
      <circle cx="70" cy="28" r="1.5" fill="#dc2626"/>

      <text x="70" y="225" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Needle / Spear</text>
      <text x="70" y="245" fill="#94a3b8" font-size="11" text-anchor="middle">W / L = 0.17</text>
      <text x="70" y="275" fill="#cbd5e1" font-size="10" text-anchor="middle">Long linear tail</text>
      <text x="70" y="295" fill="#cbd5e1" font-size="10" text-anchor="middle">Multiple satellites</text>
      <text x="70" y="315" fill="#f472b6" font-size="10" font-weight="700" text-anchor="middle">Glancing Angle</text>
    </g>

  </g>
</svg>
`);

// 4. Area of Convergence (2D) vs Area of Origin (3D Stringing)
export const AREA_OF_ORIGIN_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">2D AREA OF CONVERGENCE VS. 3D AREA OF ORIGIN</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">Crime Scene Reconstruction: Directional Vector Projection and Tangent Elevation</text>

  <!-- 3D Isometric / Perspective View -->
  <g transform="translate(60, 85)">
    <rect width="680" height="360" fill="#1e293b" rx="12" stroke="#334155" stroke-width="1.5"/>

    <!-- Floor Surface Grid -->
    <polygon points="40,320 220,180 620,180 500,320" fill="#0f172a" stroke="#475569" stroke-width="1"/>
    <line x1="130" y1="250" x2="560" y2="250" stroke="#334155" stroke-dasharray="4,4"/>
    <line x1="330" y1="320" x2="420" y2="180" stroke="#334155" stroke-dasharray="4,4"/>

    <!-- 2D Convergence Point on Floor -->
    <ellipse cx="360" cy="245" rx="35" ry="16" fill="#fbbf24" fill-opacity="0.25" stroke="#fbbf24" stroke-width="2" stroke-dasharray="4,2"/>
    <circle cx="360" cy="245" r="4" fill="#fbbf24"/>
    <text x="360" y="275" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">2D AREA OF CONVERGENCE</text>
    <text x="360" y="292" fill="#cbd5e1" font-size="10" text-anchor="middle">(Intersection of 2D directional vectors on floor plane)</text>

    <!-- Stains on Floor (with vectors pointing through convergence) -->
    <!-- Stain 1 -->
    <ellipse cx="140" cy="290" rx="14" ry="6" fill="#ef4444" transform="rotate(-30 140 290)"/>
    <line x1="140" y1="290" x2="360" y2="245" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3"/>

    <!-- Stain 2 -->
    <ellipse cx="230" cy="210" rx="12" ry="5" fill="#ef4444" transform="rotate(20 230 210)"/>
    <line x1="230" y1="210" x2="360" y2="245" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3"/>

    <!-- Stain 3 -->
    <ellipse cx="480" cy="290" rx="13" ry="5" fill="#ef4444" transform="rotate(35 480 290)"/>
    <line x1="480" y1="290" x2="360" y2="245" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3"/>

    <!-- Stain 4 -->
    <ellipse cx="520" cy="210" rx="12" ry="5" fill="#ef4444" transform="rotate(-25 520 210)"/>
    <line x1="520" y1="210" x2="360" y2="245" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3"/>

    <!-- 3D Area of Origin in Space Above Convergence -->
    <!-- Vertical Height Line Z -->
    <line x1="360" y1="245" x2="360" y2="80" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6,3"/>
    
    <!-- 3D Origin Point -->
    <ellipse cx="360" cy="80" rx="20" ry="12" fill="#34d399" fill-opacity="0.3" stroke="#34d399" stroke-width="2"/>
    <circle cx="360" cy="80" r="5" fill="#34d399"/>
    <text x="360" y="55" fill="#34d399" font-size="13" font-weight="900" text-anchor="middle">3D AREA OF ORIGIN (SOURCE LOCATION)</text>

    <!-- 3D Stringing Lines from Stains to Origin -->
    <line x1="140" y1="290" x2="360" y2="80" stroke="#38bdf8" stroke-width="1.8"/>
    <line x1="230" y1="210" x2="360" y2="80" stroke="#38bdf8" stroke-width="1.8"/>
    <line x1="480" y1="290" x2="360" y2="80" stroke="#38bdf8" stroke-width="1.8"/>
    <line x1="520" y1="210" x2="360" y2="80" stroke="#38bdf8" stroke-width="1.8"/>

    <!-- Height Z Label and Equation -->
    <rect x="50" y="25" width="220" height="75" fill="#0f172a" rx="8" stroke="#38bdf8"/>
    <text x="160" y="48" fill="#38bdf8" font-size="11" font-weight="800" text-anchor="middle">TANGENT ELEVATION FORMULA</text>
    <text x="160" y="72" fill="#f8fafc" font-size="13" font-family="monospace" font-weight="800" text-anchor="middle">Height (Z) = d × tan(θ)</text>
    <text x="160" y="90" fill="#94a3b8" font-size="9" text-anchor="middle">d = distance to 2D convergence point</text>
  </g>
</svg>
`);

// 5. Directionality Anatomy: Parent Stain, Spines, and Satellite Spatter
export const DIRECTIONALITY_ANATOMY_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="450" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="420" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">ANATOMY OF A DIRECTIONAL BLOODSTAIN</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">Morphological Indicators of Flight Trajectory, Impact Point, and Leading-Edge Wave Spatter</text>

  <!-- Central Visual Container -->
  <g transform="translate(50, 90)">
    <rect width="700" height="325" fill="#1e293b" rx="12" stroke="#334155" stroke-width="1.5"/>

    <!-- Main Directional Bloodstain Graphic -->
    <g transform="translate(100, 160)">
      <!-- Motion Vector Arrow above -->
      <line x1="50" y1="-85" x2="380" y2="-85" stroke="#38bdf8" stroke-width="3"/>
      <polygon points="380,-92 400,-85 380,-78" fill="#38bdf8"/>
      <text x="215" y="-100" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle">DIRECTION OF DROPLET TRAVEL →</text>

      <!-- Blunt Impact Edge (Point of Initial Surface Contact) -->
      <path d="M 60,-35 C 20,-35 20,35 60,35 C 130,35 180,25 240,12 L 320,0 L 240,-12 C 180,-25 130,-35 60,-35 Z" fill="#991b1b" stroke="#f87171" stroke-width="2"/>

      <!-- Lateral Spines (attached pointing forward) -->
      <path d="M 120,-32 L 140,-48 L 135,-29" fill="#991b1b"/>
      <path d="M 180,-25 L 205,-42 L 195,-22" fill="#991b1b"/>
      <path d="M 120,32 L 140,48 L 135,29" fill="#991b1b"/>
      <path d="M 180,25 L 205,42 L 195,22" fill="#991b1b"/>

      <!-- Tapered Tail -->
      <path d="M 320,0 L 350,0" stroke="#991b1b" stroke-width="3"/>

      <!-- Detached Wave Cast-off Satellite Stains -->
      <ellipse cx="375" cy="0" rx="8" ry="4" fill="#991b1b"/>
      <ellipse cx="405" cy="0" rx="4" ry="2" fill="#991b1b"/>

      <!-- Anatomical Callout Labels -->
      <!-- Label 1: Blunt End -->
      <line x1="40" y1="35" x2="40" y2="85" stroke="#fbbf24" stroke-width="1.5"/>
      <circle cx="40" cy="35" r="3" fill="#fbbf24"/>
      <text x="40" y="105" fill="#fbbf24" font-size="11" font-weight="800">POINT OF INITIAL IMPACT</text>
      <text x="40" y="122" fill="#cbd5e1" font-size="10">Blunt, rounded anterior margin</text>

      <!-- Label 2: Parent Stain -->
      <line x1="140" y1="-32" x2="140" y2="-60" stroke="#f8fafc" stroke-width="1.5"/>
      <circle cx="140" cy="-32" r="3" fill="#f8fafc"/>
      <text x="140" y="-70" fill="#f8fafc" font-size="11" font-weight="700">Spines</text>

      <!-- Label 3: Tapering Tail -->
      <line x1="330" y1="0" x2="330" y2="85" stroke="#34d399" stroke-width="1.5"/>
      <circle cx="330" cy="0" r="3" fill="#34d399"/>
      <text x="330" y="105" fill="#34d399" font-size="11" font-weight="800">TAPERING TAIL</text>
      <text x="330" y="122" fill="#cbd5e1" font-size="10">Always points in flight direction</text>

      <!-- Label 4: Satellite Stain -->
      <line x1="390" y1="0" x2="390" y2="55" stroke="#f472b6" stroke-width="1.5"/>
      <circle cx="390" cy="0" r="3" fill="#f472b6"/>
      <text x="390" y="75" fill="#f472b6" font-size="11" font-weight="800">SATELLITE SPATTER</text>
      <text x="390" y="92" fill="#cbd5e1" font-size="10">Detached droplets thrown ahead</text>
    </g>

    <!-- Key Takeaway Box -->
    <rect x="30" y="270" width="640" height="38" fill="#0f172a" rx="8" stroke="#334155"/>
    <text x="350" y="294" fill="#cbd5e1" font-size="11" text-anchor="middle">
      <tspan fill="#38bdf8" font-weight="800">RULE OF DIRECTIONALITY:</tspan> The tail of a bloodstain always points in the direction the droplet was moving upon impact.
    </text>
  </g>
</svg>
`);

// 6. Cast-Off Pattern & Minimum Blow Calculation (N + 1 Rule)
export const CASTOFF_ARC_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">CAST-OFF PATTERN MECHANICS &amp; MINIMUM BLOWS</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">Centrifugal Release from Swung Weapon and the (N + 1) Crime Scene Rule</text>

  <!-- Left: Swing Arc Geometry -->
  <g transform="translate(45, 90)">
    <rect width="360" height="350" fill="#1e293b" rx="12" stroke="#3b82f6" stroke-width="1.5"/>
    <rect x="15" y="15" width="330" height="28" fill="#3b82f6" fill-opacity="0.2" rx="6"/>
    <text x="180" y="34" fill="#60a5fa" font-size="13" font-weight="800" text-anchor="middle">SWING DYNAMICS &amp; CENTRIFUGAL ARC</text>

    <!-- Swing Visual Box -->
    <rect x="25" y="55" width="310" height="195" fill="#0f172a" rx="8" stroke="#334155"/>
    
    <!-- Weapon Swing Arc -->
    <path d="M 60,210 C 80,90 220,70 280,180" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-dasharray="6,3"/>
    
    <!-- Weapon (Baseball Bat / Crowbar schematic) -->
    <line x1="120" y1="170" x2="200" y2="90" stroke="#f8fafc" stroke-width="6" stroke-linecap="round"/>
    <line x1="170" y1="120" x2="200" y2="90" stroke="#ef4444" stroke-width="7" stroke-linecap="round"/>

    <!-- Droplets Detaching Tangentially -->
    <path d="M 200,90 L 260,60" stroke="#ef4444" stroke-width="2" stroke-dasharray="3,2"/>
    <circle cx="215" cy="82" r="4" fill="#ef4444"/>
    <circle cx="235" cy="72" r="5" fill="#ef4444"/>
    <circle cx="260" cy="60" r="4" fill="#ef4444"/>

    <text x="180" y="270" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Tangential Drop Detachment</text>
    <text x="180" y="292" fill="#cbd5e1" font-size="11" text-anchor="middle">Centrifugal force overcomes blood surface tension</text>
    <text x="180" y="312" fill="#94a3b8" font-size="10" text-anchor="middle">Forms linear or curved trails on ceiling &amp; adjacent walls</text>
    <text x="180" y="332" fill="#60a5fa" font-size="10" font-weight="700" text-anchor="middle">Tails reflect forward and backswing motion</text>
  </g>

  <!-- Right: Minimum Blow Calculation Box -->
  <g transform="translate(435, 90)">
    <rect width="320" height="350" fill="#1e293b" rx="12" stroke="#10b981" stroke-width="1.5"/>
    <rect x="15" y="15" width="290" height="28" fill="#10b981" fill-opacity="0.2" rx="6"/>
    <text x="160" y="34" fill="#34d399" font-size="13" font-weight="800" text-anchor="middle">MINIMUM NUMBER OF BLOWS: (N + 1)</text>

    <!-- Sequential Logic Container -->
    <rect x="25" y="55" width="270" height="200" fill="#0f172a" rx="8" stroke="#334155"/>

    <g transform="translate(35, 75)">
      <circle cx="15" cy="15" r="14" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6"/>
      <text x="15" y="20" fill="#60a5fa" font-size="12" font-weight="800" text-anchor="middle">1</text>
      <text x="40" y="14" fill="#f8fafc" font-size="11" font-weight="700">First Blow to Victim</text>
      <text x="40" y="28" fill="#94a3b8" font-size="10">Rarely produces cast-off (weapon is clean)</text>
    </g>

    <g transform="translate(35, 125)">
      <circle cx="15" cy="15" r="14" fill="#10b981" fill-opacity="0.2" stroke="#10b981"/>
      <text x="15" y="20" fill="#34d399" font-size="12" font-weight="800" text-anchor="middle">2</text>
      <text x="40" y="14" fill="#f8fafc" font-size="11" font-weight="700">Subsequent Blows</text>
      <text x="40" y="28" fill="#94a3b8" font-size="10">Weapon coated with blood casts droplets in flight</text>
    </g>

    <g transform="translate(35, 175)">
      <circle cx="15" cy="15" r="14" fill="#fbbf24" fill-opacity="0.2" stroke="#fbbf24"/>
      <text x="15" y="20" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">3</text>
      <text x="40" y="14" fill="#f8fafc" font-size="11" font-weight="700">Calculation Formula</text>
      <text x="40" y="28" fill="#fbbf24" font-size="10" font-weight="700">Min. Blows = Cast-Off Trails + 1</text>
    </g>

    <!-- Calculation Rule Box -->
    <rect x="25" y="270" width="270" height="60" fill="#0f172a" rx="8" stroke="#10b981"/>
    <text x="160" y="292" fill="#34d399" font-size="12" font-weight="800" text-anchor="middle">SCENARIO EXAMPLE:</text>
    <text x="160" y="312" fill="#cbd5e1" font-size="11" text-anchor="middle">If 4 distinct cast-off trails are documented:</text>
    <text x="160" y="328" fill="#fbbf24" font-size="11" font-weight="800" text-anchor="middle">Minimum Blows Delivered = 4 + 1 = 5 Blows</text>
  </g>
</svg>
`);

// 7. Swipe Pattern vs Wipe Pattern (Transfer Mechanisms)
export const SWIPE_VS_WIPE_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="460" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="430" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">TRANSFER MECHANISMS: SWIPE VS. WIPE PATTERNS</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">Distinguishing Lateral Motion of Bloody Surface vs. Clean Object Movement</text>

  <!-- Left Card: SWIPE PATTERN -->
  <g transform="translate(45, 90)">
    <rect width="330" height="335" fill="#1e293b" rx="12" stroke="#3b82f6" stroke-width="1.5"/>
    <rect x="15" y="15" width="300" height="28" fill="#3b82f6" fill-opacity="0.2" rx="6"/>
    <text x="165" y="34" fill="#60a5fa" font-size="13" font-weight="800" text-anchor="middle">SWIPE PATTERN</text>

    <rect x="25" y="55" width="280" height="150" fill="#0f172a" rx="8" stroke="#334155"/>
    
    <!-- Motion Vector -->
    <line x1="60" y1="80" x2="240" y2="80" stroke="#38bdf8" stroke-width="2"/>
    <polygon points="240,75 255,80 240,85" fill="#38bdf8"/>
    <text x="150" y="72" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Motion of Bloody Object →</text>

    <!-- Swipe Stain: Starts heavy, ends feathered/light -->
    <path d="M 60,105 L 140,105 C 190,110 240,120 255,130 C 240,140 190,150 140,155 L 60,155 Z" fill="#991b1b"/>
    <!-- Feathered lines at trailing edge -->
    <line x1="250" y1="120" x2="275" y2="125" stroke="#991b1b" stroke-width="2"/>
    <line x1="255" y1="130" x2="285" y2="130" stroke="#991b1b" stroke-width="1.5"/>
    <line x1="250" y1="140" x2="270" y2="135" stroke="#991b1b" stroke-width="2"/>

    <text x="165" y="235" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Blood-Bearing Object Across Clean Surface</text>
    <text x="165" y="255" fill="#cbd5e1" font-size="11" text-anchor="middle">• Originates on an UNSTAINED surface</text>
    <text x="165" y="275" fill="#94a3b8" font-size="10" text-anchor="middle">• Bloody hair, bloody clothing, or bloody hand sliding</text>
    <text x="165" y="295" fill="#94a3b8" font-size="10" text-anchor="middle">• Feathered edge indicates motion direction</text>
    <text x="165" y="318" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Source: Bloody Object in Motion</text>
  </g>

  <!-- Right Card: WIPE PATTERN -->
  <g transform="translate(425, 90)">
    <rect width="330" height="335" fill="#1e293b" rx="12" stroke="#fbbf24" stroke-width="1.5"/>
    <rect x="15" y="15" width="300" height="28" fill="#fbbf24" fill-opacity="0.2" rx="6"/>
    <text x="165" y="34" fill="#fcd34d" font-size="13" font-weight="800" text-anchor="middle">WIPE PATTERN</text>

    <rect x="25" y="55" width="280" height="150" fill="#0f172a" rx="8" stroke="#334155"/>
    
    <!-- Motion Vector -->
    <line x1="60" y1="80" x2="240" y2="80" stroke="#fbbf24" stroke-width="2"/>
    <polygon points="240,75 255,80 240,85" fill="#fbbf24"/>
    <text x="150" y="72" fill="#fbbf24" font-size="10" font-weight="700" text-anchor="middle">Motion of Clean Object Through Blood →</text>

    <!-- Pre-existing stain disturbed in middle -->
    <circle cx="85" cy="130" r="28" fill="#7f1d1d" stroke="#b91c1c" stroke-width="1.5"/>
    <!-- Smear drawn out through it -->
    <path d="M 85,115 L 250,115 C 265,125 265,135 250,145 L 85,145 Z" fill="#991b1b" fill-opacity="0.5"/>
    <line x1="250" y1="120" x2="275" y2="125" stroke="#991b1b" stroke-width="1.5"/>
    <line x1="250" y1="140" x2="270" y2="135" stroke="#991b1b" stroke-width="1.5"/>

    <text x="165" y="235" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Clean Object Through Pre-Existing Bloodstain</text>
    <text x="165" y="255" fill="#cbd5e1" font-size="11" text-anchor="middle">• Originates within an EXISTING wet bloodstain</text>
    <text x="165" y="275" fill="#94a3b8" font-size="10" text-anchor="middle">• Clean shoe, rag, or victim limb dragging through pool</text>
    <text x="165" y="295" fill="#94a3b8" font-size="10" text-anchor="middle">• Displaces and alters the original droplet boundary</text>
    <text x="165" y="318" fill="#fcd34d" font-size="10" font-weight="700" text-anchor="middle">Source: Unstained Slider Disrupting Stain</text>
  </g>
</svg>
`);

// 8. Arterial Spurt / Gush Waveform Pattern
export const ARTERIAL_SPURT_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="450" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="420" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">ARTERIAL SPURT &amp; GUSH WAVEFORM CHARACTERISTICS</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">Hemodynamic Systolic Pulsations, Parabolic Trajectory Waves, and Gravity Run-Down</text>

  <!-- Graphic Display Box -->
  <g transform="translate(50, 90)">
    <rect width="700" height="325" fill="#1e293b" rx="12" stroke="#ef4444" stroke-width="1.5"/>

    <!-- Wall Surface Visual -->
    <rect x="25" y="25" width="650" height="190" fill="#0f172a" rx="8" stroke="#334155"/>
    
    <!-- Systolic Pressure Peaks (Waveform) -->
    <!-- Wave 1 (Highest systolic pressure) -->
    <path d="M 60,140 Q 120,40 180,100" fill="none" stroke="#ef4444" stroke-width="8" stroke-linecap="round"/>
    <line x1="120" y1="40" x2="120" y2="190" stroke="#b91c1c" stroke-width="4"/> <!-- Vertical Run-Down -->
    <circle cx="120" cy="190" r="7" fill="#b91c1c"/>

    <!-- Wave 2 (Second systolic beat) -->
    <path d="M 180,100 Q 250,55 320,115" fill="none" stroke="#ef4444" stroke-width="7" stroke-linecap="round"/>
    <line x1="250" y1="55" x2="250" y2="195" stroke="#b91c1c" stroke-width="3.5"/>
    <circle cx="250" cy="195" r="6" fill="#b91c1c"/>

    <!-- Wave 3 (Third systolic beat - pressure dropping) -->
    <path d="M 320,115 Q 390,75 460,130" fill="none" stroke="#ef4444" stroke-width="6" stroke-linecap="round"/>
    <line x1="390" y1="75" x2="390" y2="195" stroke="#b91c1c" stroke-width="3"/>
    <circle cx="390" cy="195" r="5" fill="#b91c1c"/>

    <!-- Wave 4 (Fourth beat - waning arterial pressure) -->
    <path d="M 460,130 Q 530,95 600,150" fill="none" stroke="#ef4444" stroke-width="5" stroke-linecap="round"/>
    <line x1="530" y1="95" x2="530" y2="195" stroke="#b91c1c" stroke-width="2.5"/>
    <circle cx="530" cy="195" r="4" fill="#b91c1c"/>

    <!-- Radiating Spines from High Pressure Impact -->
    <line x1="120" y1="40" x2="105" y2="25" stroke="#ef4444" stroke-width="2"/>
    <line x1="120" y1="40" x2="135" y2="20" stroke="#ef4444" stroke-width="2"/>
    <line x1="250" y1="55" x2="265" y2="35" stroke="#ef4444" stroke-width="2"/>

    <!-- Annotations -->
    <text x="120" y="25" fill="#fbbf24" font-size="11" font-weight="800" text-anchor="middle">Systole Peak 1</text>
    <text x="250" y="40" fill="#fbbf24" font-size="11" font-weight="800" text-anchor="middle">Systole Peak 2</text>
    <text x="390" y="60" fill="#fbbf24" font-size="11" font-weight="800" text-anchor="middle">Systole Peak 3</text>

    <!-- Key Descriptive Summary Points -->
    <g transform="translate(30, 230)">
      <rect width="640" height="75" fill="#0f172a" rx="8" stroke="#334155"/>
      <text x="320" y="22" fill="#ef4444" font-size="12" font-weight="800" text-anchor="middle">PATHOGNOMONIC FORENSIC INDICATORS OF ARTERIAL INJURY</text>
      <text x="320" y="42" fill="#cbd5e1" font-size="11" text-anchor="middle">1. Rhythmic zigzag/pulsating waveforms corresponding to cardiac ventricular contractions (~120 mmHg)</text>
      <text x="320" y="60" fill="#94a3b8" font-size="11" text-anchor="middle">2. Large volume gush with prominent vertical drainage (gravity run-down) and waning peak heights</text>
    </g>
  </g>
</svg>
`);

// 9. Skeletonization Timecourse & Crime Scene Alteration
export const SKELETONIZATION_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="450" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="420" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">SKELETONIZATION: CHRONOLOGY &amp; SCENE ALTERATION</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">Peripheral Ring Formation (30–90s) and Forensic Verification of Tampering / Movement</text>

  <!-- 3 Stages: Fresh Deposit, Peripheral Drying, Disturbed Skeletonized Ring -->
  <g transform="translate(35, 95)">
    <!-- Stage 1: Fresh Drop -->
    <g transform="translate(0, 0)">
      <rect width="225" height="310" fill="#1e293b" rx="10" stroke="#334155"/>
      <rect x="15" y="15" width="195" height="26" fill="#3b82f6" fill-opacity="0.2" rx="4"/>
      <text x="112" y="33" fill="#60a5fa" font-size="12" font-weight="800" text-anchor="middle">TIME: 0 SECONDS</text>

      <rect x="25" y="55" width="175" height="130" fill="#0f172a" rx="8"/>
      <!-- Fresh Wet Droplet with high meniscus -->
      <circle cx="112" cy="120" r="42" fill="#b91c1c" stroke="#ef4444" stroke-width="2"/>
      <circle cx="102" cy="110" r="10" fill="#f87171" fill-opacity="0.5"/>

      <text x="112" y="210" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Fresh Liquid State</text>
      <text x="112" y="230" fill="#cbd5e1" font-size="10" text-anchor="middle">Entire droplet completely wet</text>
      <text x="112" y="248" fill="#94a3b8" font-size="10" text-anchor="middle">Uniform liquid meniscus</text>
      <text x="112" y="275" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Wiping erases entire drop</text>
    </g>

    <!-- Stage 2: 30-90 Seconds (Peripheral Skeleton Ring Formation) -->
    <g transform="translate(250, 0)">
      <rect width="225" height="310" fill="#1e293b" rx="10" stroke="#fbbf24" stroke-width="1.5"/>
      <rect x="15" y="15" width="195" height="26" fill="#fbbf24" fill-opacity="0.2" rx="4"/>
      <text x="112" y="33" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">TIME: 30–90 SECONDS</text>

      <rect x="25" y="55" width="175" height="130" fill="#0f172a" rx="8"/>
      <!-- Drying ring on perimeter -->
      <circle cx="112" cy="120" r="42" fill="#991b1b" stroke="#7f1d1d" stroke-width="4"/>
      <!-- Liquid center still wet -->
      <circle cx="112" cy="120" r="34" fill="#dc2626"/>
      <circle cx="105" cy="112" r="8" fill="#f87171" fill-opacity="0.4"/>

      <text x="112" y="210" fill="#fbbf24" font-size="12" font-weight="700" text-anchor="middle">Peripheral Ring Dries</text>
      <text x="112" y="230" fill="#cbd5e1" font-size="10" text-anchor="middle">Edge desiccates rapidly first</text>
      <text x="112" y="248" fill="#94a3b8" font-size="10" text-anchor="middle">Outer boundary fixes to substrate</text>
      <text x="112" y="275" fill="#fbbf24" font-size="10" font-weight="700" text-anchor="middle">Liquid center remains fluid</text>
    </g>

    <!-- Stage 3: Post-Skeletonization Disturbance -->
    <g transform="translate(500, 0)">
      <rect width="225" height="310" fill="#1e293b" rx="10" stroke="#10b981" stroke-width="1.5"/>
      <rect x="15" y="15" width="195" height="26" fill="#10b981" fill-opacity="0.2" rx="4"/>
      <text x="112" y="33" fill="#34d399" font-size="12" font-weight="800" text-anchor="middle">DISTURBED SKELETON</text>

      <rect x="25" y="55" width="175" height="130" fill="#0f172a" rx="8"/>
      <!-- Intact dark dried outer ring -->
      <circle cx="85" cy="120" r="36" fill="none" stroke="#450a0a" stroke-width="5"/>
      <!-- Wiped/smeared center moving right -->
      <path d="M 95,95 L 180,105 C 190,120 190,125 180,135 L 95,145 Z" fill="#991b1b" fill-opacity="0.4"/>

      <text x="112" y="210" fill="#34d399" font-size="12" font-weight="700" text-anchor="middle">Skeletonized Ring Preserved</text>
      <text x="112" y="230" fill="#cbd5e1" font-size="10" text-anchor="middle">Outer dried ring survives wiping</text>
      <text x="112" y="248" fill="#94a3b8" font-size="10" text-anchor="middle">Fluid core displaced into smear</text>
      <text x="112" y="275" fill="#34d399" font-size="10" font-weight="700" text-anchor="middle">Proves Scene Tampering Delay</text>
    </g>
  </g>
</svg>
`);

// 10. Surface Texture Influence on Droplet Edge Morphology
export const SURFACE_TEXTURE_EFFECT_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="450" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="420" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">SUBSTRATE TEXTURE &amp; DROPLET EDGE INTEGRITY</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">Identical Blood Droplet Volumes Falling from Equal Height (1 Meter) onto Varied Substrates</text>

  <!-- 4 Substrates: Smooth Plate Glass, Cardstock Paper, Rough Cardboard, Rough Porous Concrete -->
  <g transform="translate(30, 95)">
    <!-- 1. Smooth Glass -->
    <g transform="translate(0, 0)">
      <rect width="170" height="315" fill="#1e293b" rx="10" stroke="#38bdf8" stroke-width="1.5"/>
      <rect x="10" y="10" width="150" height="24" fill="#38bdf8" fill-opacity="0.2" rx="4"/>
      <text x="85" y="27" fill="#38bdf8" font-size="11" font-weight="800" text-anchor="middle">SMOOTH GLASS</text>

      <rect x="15" y="45" width="140" height="120" fill="#0f172a" rx="6"/>
      <!-- Clean sharp circle -->
      <circle cx="85" cy="105" r="32" fill="#b91c1c" stroke="#f87171" stroke-width="1"/>

      <text x="85" y="190" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Smooth / Clean</text>
      <text x="85" y="210" fill="#cbd5e1" font-size="10" text-anchor="middle">• Sharp circular perimeter</text>
      <text x="85" y="228" fill="#94a3b8" font-size="10" text-anchor="middle">• No edge scalloping</text>
      <text x="85" y="246" fill="#94a3b8" font-size="10" text-anchor="middle">• 0 satellite spatters</text>
      <text x="85" y="280" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Non-Porous Hard</text>
    </g>

    <!-- 2. Smooth Paper -->
    <g transform="translate(190, 0)">
      <rect width="170" height="315" fill="#1e293b" rx="10" stroke="#34d399" stroke-width="1.5"/>
      <rect x="10" y="10" width="150" height="24" fill="#34d399" fill-opacity="0.2" rx="4"/>
      <text x="85" y="27" fill="#34d399" font-size="11" font-weight="800" text-anchor="middle">SMOOTH CARDSTOCK</text>

      <rect x="15" y="45" width="140" height="120" fill="#0f172a" rx="6"/>
      <!-- Circle with minor wave scallops -->
      <circle cx="85" cy="105" r="33" fill="#b91c1c"/>
      <circle cx="85" cy="71" r="1.5" fill="#b91c1c"/>
      <circle cx="85" cy="139" r="1.5" fill="#b91c1c"/>

      <text x="85" y="190" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Slight Scalloping</text>
      <text x="85" y="210" fill="#cbd5e1" font-size="10" text-anchor="middle">• Minor edge waves</text>
      <text x="85" y="228" fill="#94a3b8" font-size="10" text-anchor="middle">• Uniform stain outline</text>
      <text x="85" y="246" fill="#94a3b8" font-size="10" text-anchor="middle">• Rare satellite droplets</text>
      <text x="85" y="280" fill="#34d399" font-size="10" font-weight="700" text-anchor="middle">Semi-Porous Smooth</text>
    </g>

    <!-- 3. Corrugated Cardboard -->
    <g transform="translate(380, 0)">
      <rect width="170" height="315" fill="#1e293b" rx="10" stroke="#fbbf24" stroke-width="1.5"/>
      <rect x="10" y="10" width="150" height="24" fill="#fbbf24" fill-opacity="0.2" rx="4"/>
      <text x="85" y="27" fill="#fbbf24" font-size="11" font-weight="800" text-anchor="middle">ROUGH CARDBOARD</text>

      <rect x="15" y="45" width="140" height="120" fill="#0f172a" rx="6"/>
      <!-- Irregular serrated circle with multiple spines -->
      <circle cx="85" cy="105" r="30" fill="#b91c1c"/>
      <path d="M 85,73 L 88,60 L 82,73 M 117,105 L 132,108 L 117,102 M 53,105 L 38,103 L 53,108 M 85,137 L 82,150 L 88,137" stroke="#b91c1c" stroke-width="2"/>
      <circle cx="138" cy="110" r="2" fill="#b91c1c"/>
      <circle cx="32" cy="102" r="2" fill="#b91c1c"/>

      <text x="85" y="190" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Marked Spines</text>
      <text x="85" y="210" fill="#cbd5e1" font-size="10" text-anchor="middle">• Irregular serrated rim</text>
      <text x="85" y="228" fill="#94a3b8" font-size="10" text-anchor="middle">• Distinct radiating spines</text>
      <text x="85" y="246" fill="#94a3b8" font-size="10" text-anchor="middle">• Small satellite spatters</text>
      <text x="85" y="280" fill="#fbbf24" font-size="10" font-weight="700" text-anchor="middle">Porous Textured</text>
    </g>

    <!-- 4. Rough Concrete -->
    <g transform="translate(570, 0)">
      <rect width="170" height="315" fill="#1e293b" rx="10" stroke="#f43f5e" stroke-width="1.5"/>
      <rect x="10" y="10" width="150" height="24" fill="#f43f5e" fill-opacity="0.2" rx="4"/>
      <text x="85" y="27" fill="#f43f5e" font-size="11" font-weight="800" text-anchor="middle">ROUGH CONCRETE</text>

      <rect x="15" y="45" width="140" height="120" fill="#0f172a" rx="6"/>
      <!-- Severe breakup and extensive satellites -->
      <circle cx="85" cy="105" r="26" fill="#b91c1c"/>
      <!-- Chaotic spines and satellite cluster -->
      <circle cx="60" cy="75" r="3" fill="#b91c1c"/>
      <circle cx="115" cy="72" r="3.5" fill="#b91c1c"/>
      <circle cx="125" cy="125" r="2.5" fill="#b91c1c"/>
      <circle cx="45" cy="125" r="3" fill="#b91c1c"/>
      <circle cx="85" cy="148" r="4" fill="#b91c1c"/>
      <circle cx="85" cy="62" r="2" fill="#b91c1c"/>

      <text x="85" y="190" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Severe Disruption</text>
      <text x="85" y="210" fill="#cbd5e1" font-size="10" text-anchor="middle">• Massive droplet rupture</text>
      <text x="85" y="228" fill="#94a3b8" font-size="10" text-anchor="middle">• Dense satellite crown</text>
      <text x="85" y="246" fill="#94a3b8" font-size="10" text-anchor="middle">• Distortion of true size</text>
      <text x="85" y="280" fill="#f43f5e" font-size="10" font-weight="700" text-anchor="middle">Rough &amp; Abrasive</text>
    </g>
  </g>
</svg>
`);

// 11. Gunshot Spatter: Forward Spatter vs Backspatter Cones
export const GUNSHOT_SPATTER_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 460" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="460" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="430" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">GUNSHOT SPATTER DYNAMICS: FORWARD VS. BACKSPATTER</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">High-Velocity Impact (&gt;100 ft/s), Droplet Size (&lt;1mm Mist), and Directional Plumes</text>

  <g transform="translate(45, 90)">
    <rect width="710" height="335" fill="#1e293b" rx="12" stroke="#334155" stroke-width="1.5"/>

    <!-- Central Target Substrate / Head Simulant Profile -->
    <rect x="310" y="55" width="90" height="170" fill="#0f172a" rx="10" stroke="#64748b" stroke-width="2"/>
    <text x="355" y="145" fill="#94a3b8" font-size="12" font-weight="800" text-anchor="middle">TARGET /</text>
    <text x="355" y="165" fill="#94a3b8" font-size="12" font-weight="800" text-anchor="middle">TISSUE</text>

    <!-- Bullet Path Arrow -->
    <line x1="60" y1="140" x2="650" y2="140" stroke="#fbbf24" stroke-width="2.5" stroke-dasharray="6,4"/>
    <polygon points="650,135 665,140 650,145" fill="#fbbf24"/>
    <text x="180" y="125" fill="#fbbf24" font-size="11" font-weight="800">BULLET TRAJECTORY →</text>

    <!-- Left: Backspatter (Blowback toward Shooter/Weapon) -->
    <g transform="translate(130, 55)">
      <!-- Backspatter Cone (Angle back toward entrance) -->
      <polygon points="180,85 40,30 40,140" fill="#f43f5e" fill-opacity="0.15" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4,2"/>
      <!-- Fine mist droplets -->
      <circle cx="160" cy="80" r="1.5" fill="#f43f5e"/>
      <circle cx="140" cy="65" r="1.2" fill="#f43f5e"/>
      <circle cx="120" cy="95" r="1.5" fill="#f43f5e"/>
      <circle cx="90" cy="50" r="1" fill="#f43f5e"/>
      <circle cx="80" cy="115" r="1.2" fill="#f43f5e"/>
      <circle cx="60" cy="75" r="1.5" fill="#f43f5e"/>
    </g>
    <text x="220" y="45" fill="#f43f5e" font-size="12" font-weight="800" text-anchor="middle">BACKSPATTER (BLOWBACK)</text>
    <text x="220" y="245" fill="#fca5a5" font-size="10" text-anchor="middle">• Emanates from ENTRANCE wound</text>
    <text x="220" y="262" fill="#94a3b8" font-size="10" text-anchor="middle">• Directed backward toward shooter/firearm</text>
    <text x="220" y="279" fill="#94a3b8" font-size="10" text-anchor="middle">• Muzzle gas expansion &amp; cavity collapse</text>

    <!-- Right: Forward Spatter (Exit Wound Plume) -->
    <g transform="translate(400, 55)">
      <!-- Wide high-density forward cone -->
      <polygon points="0,85 240,15 240,155" fill="#38bdf8" fill-opacity="0.15" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,2"/>
      <!-- Dense fine mist droplets (<1mm) -->
      <circle cx="30" cy="85" r="1.5" fill="#ef4444"/>
      <circle cx="60" cy="70" r="1" fill="#ef4444"/>
      <circle cx="80" cy="100" r="1.2" fill="#ef4444"/>
      <circle cx="110" cy="55" r="0.8" fill="#ef4444"/>
      <circle cx="125" cy="115" r="1" fill="#ef4444"/>
      <circle cx="160" cy="75" r="1" fill="#ef4444"/>
      <circle cx="180" cy="130" r="0.8" fill="#ef4444"/>
      <circle cx="210" cy="40" r="1" fill="#ef4444"/>
      <circle cx="220" cy="95" r="0.7" fill="#ef4444"/>
    </g>
    <text x="520" y="45" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">FORWARD SPATTER CONE</text>
    <text x="520" y="245" fill="#bae6fd" font-size="10" text-anchor="middle">• Emanates from EXIT wound</text>
    <text x="520" y="262" fill="#94a3b8" font-size="10" text-anchor="middle">• Projects in direction of bullet flight</text>
    <text x="520" y="279" fill="#94a3b8" font-size="10" text-anchor="middle">• High density, fine atomized mist (&lt;1 mm)</text>

    <!-- Bottom summary bar -->
    <rect x="25" y="295" width="660" height="28" fill="#0f172a" rx="6"/>
    <text x="355" y="314" fill="#cbd5e1" font-size="10" font-weight="700" text-anchor="middle">
      <tspan fill="#fbbf24">KEY PRINCIPLE:</tspan> Forward spatter is consistently more voluminous with wider dispersion than backspatter.
    </text>
  </g>
</svg>
`);

// 12. Void Pattern in Crime Scene Reconstruction
export const VOID_PATTERN_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="450" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="420" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="42" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">VOID PATTERN IN CRIME SCENE RECONSTRUCTION</text>
  <text x="400" y="65" fill="#94a3b8" font-size="12" text-anchor="middle">Intermediate Object Interception within Continuous Spatter Field (Shadowing / Line-of-Sight)</text>

  <g transform="translate(50, 90)">
    <rect width="700" height="325" fill="#1e293b" rx="12" stroke="#334155" stroke-width="1.5"/>

    <!-- Continuous Spatter Field on Wall (Lots of spatter dots) -->
    <rect x="30" y="25" width="640" height="210" fill="#0f172a" rx="8" stroke="#334155"/>

    <!-- Spatter dots background -->
    <g fill="#b91c1c" opacity="0.85">
      <!-- Left side spatter -->
      <circle cx="60" cy="50" r="3"/><circle cx="95" cy="75" r="4"/><circle cx="70" cy="110" r="2.5"/><circle cx="110" cy="140" r="3.5"/><circle cx="80" cy="180" r="4"/><circle cx="130" cy="80" r="3"/><circle cx="150" cy="130" r="2"/><circle cx="160" cy="190" r="3"/><circle cx="180" cy="60" r="2.5"/><circle cx="210" cy="110" r="3.5"/><circle cx="200" cy="160" r="4"/>
      <!-- Right side spatter -->
      <circle cx="490" cy="60" r="3"/><circle cx="520" cy="100" r="4"/><circle cx="505" cy="150" r="2.5"/><circle cx="550" cy="80" r="3.5"/><circle cx="570" cy="130" r="4"/><circle cx="610" cy="60" r="3"/><circle cx="620" cy="110" r="2.5"/><circle cx="640" cy="160" r="3.5"/><circle cx="580" cy="190" r="4"/><circle cx="530" cy="180" r="3"/>
      <!-- Top spatter above void -->
      <circle cx="270" cy="45" r="3"/><circle cx="320" cy="40" r="4"/><circle cx="370" cy="45" r="2.5"/><circle cx="420" cy="40" r="3.5"/>
    </g>

    <!-- The Void (Unstained Area: Chair / Person / Object Silhouette) -->
    <!-- Geometric Chair/Cabinet Silhouette Void -->
    <rect x="250" y="65" width="200" height="150" fill="#090d16" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6,4" rx="6"/>
    <text x="350" y="130" fill="#fbbf24" font-size="14" font-weight="900" text-anchor="middle">VOID (SHADOW)</text>
    <text x="350" y="150" fill="#fcd34d" font-size="11" font-weight="700" text-anchor="middle">Total Absence of Bloodstains</text>
    <text x="350" y="170" fill="#cbd5e1" font-size="10" text-anchor="middle">Object blocked spatter and was removed</text>

    <!-- Explanatory forensic takeaway -->
    <g transform="translate(30, 250)">
      <rect width="640" height="58" fill="#0f172a" rx="8" stroke="#334155"/>
      <text x="320" y="24" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">CRITICAL INVESTIGATIVE SIGNIFICANCE OF VOID PATTERNS</text>
      <text x="320" y="44" fill="#cbd5e1" font-size="11" text-anchor="middle">Establishes the precise silhouette, position, and orientation of a removed object or assailant present during bloodshed.</text>
    </g>
  </g>
</svg>
`);

// 13. Three Main Categories of Bloodstains (Passive, Spatter, Transfer)
export const PASSIVE_SPATTER_TRANSFER_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="45" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">THE 3 BASIC CATEGORIES OF BLOODSTAINS</text>
  <text x="400" y="68" fill="#94a3b8" font-size="12" text-anchor="middle">Standard Forensic Classification for Beginners</text>

  <!-- 1. Passive Stains (Gravity) -->
  <g transform="translate(35, 95)">
    <rect width="225" height="345" fill="#1e293b" rx="12" stroke="#38bdf8" stroke-width="1.5"/>
    <rect x="12" y="12" width="201" height="28" fill="#38bdf8" fill-opacity="0.2" rx="6"/>
    <text x="112" y="31" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">1. PASSIVE STAINS</text>

    <rect x="15" y="50" width="195" height="150" fill="#0f172a" rx="8"/>
    <!-- Drops falling under gravity -->
    <circle cx="112" cy="75" r="7" fill="#dc2626"/>
    <path d="M 112,87 L 112,110" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="3,2"/>
    <polygon points="112,116 108,108 116,108" fill="#38bdf8"/>
    <circle cx="112" cy="145" r="22" fill="#b91c1c" stroke="#ef4444" stroke-width="2"/>

    <text x="112" y="225" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Formed by Gravity Alone</text>
    <text x="112" y="248" fill="#cbd5e1" font-size="11" text-anchor="middle">• Passive Drips</text>
    <text x="112" y="268" fill="#cbd5e1" font-size="11" text-anchor="middle">• Drip Trails</text>
    <text x="112" y="288" fill="#cbd5e1" font-size="11" text-anchor="middle">• Blood Pools</text>
    <text x="112" y="308" fill="#cbd5e1" font-size="11" text-anchor="middle">• Flow Patterns</text>
    <text x="112" y="330" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Force = Gravity</text>
  </g>

  <!-- 2. Spatter Stains (Force/Impact) -->
  <g transform="translate(285, 95)">
    <rect width="225" height="345" fill="#1e293b" rx="12" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="12" y="12" width="201" height="28" fill="#f59e0b" fill-opacity="0.2" rx="6"/>
    <text x="112" y="31" fill="#f59e0b" font-size="12" font-weight="800" text-anchor="middle">2. SPATTER STAINS</text>

    <rect x="15" y="50" width="195" height="150" fill="#0f172a" rx="8"/>
    <!-- Radiating force spatters -->
    <circle cx="112" cy="120" r="12" fill="#dc2626"/>
    <circle cx="65" cy="80" r="5" fill="#ef4444"/>
    <circle cx="160" cy="75" r="4" fill="#ef4444"/>
    <circle cx="55" cy="155" r="4" fill="#ef4444"/>
    <circle cx="165" cy="160" r="6" fill="#ef4444"/>
    <circle cx="112" cy="65" r="3" fill="#ef4444"/>

    <text x="112" y="225" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Formed by Energy / Force</text>
    <text x="112" y="248" fill="#cbd5e1" font-size="11" text-anchor="middle">• Impact Spatters</text>
    <text x="112" y="268" fill="#cbd5e1" font-size="11" text-anchor="middle">• Cast-off Arcs</text>
    <text x="112" y="288" fill="#cbd5e1" font-size="11" text-anchor="middle">• Arterial Spurts</text>
    <text x="112" y="308" fill="#cbd5e1" font-size="11" text-anchor="middle">• Gunshot Mist</text>
    <text x="112" y="330" fill="#f59e0b" font-size="10" font-weight="700" text-anchor="middle">Force = Kinetic / Pressure</text>
  </g>

  <!-- 3. Transfer Stains (Contact) -->
  <g transform="translate(535, 95)">
    <rect width="225" height="345" fill="#1e293b" rx="12" stroke="#10b981" stroke-width="1.5"/>
    <rect x="12" y="12" width="201" height="28" fill="#10b981" fill-opacity="0.2" rx="6"/>
    <text x="112" y="31" fill="#10b981" font-size="12" font-weight="800" text-anchor="middle">3. TRANSFER STAINS</text>

    <rect x="15" y="50" width="195" height="150" fill="#0f172a" rx="8"/>
    <!-- Bloody shoe/hand impression -->
    <path d="M 80,95 C 80,80 145,80 145,95 C 145,120 135,140 135,160 C 135,170 90,170 90,160 C 90,140 80,120 80,95 Z" fill="#991b1b" stroke="#ef4444" stroke-width="1.5"/>
    <line x1="88" y1="105" x2="137" y2="105" stroke="#0f172a" stroke-width="2"/>
    <line x1="88" y1="120" x2="137" y2="120" stroke="#0f172a" stroke-width="2"/>
    <line x1="93" y1="135" x2="132" y2="135" stroke="#0f172a" stroke-width="2"/>

    <text x="112" y="225" fill="#f8fafc" font-size="12" font-weight="700" text-anchor="middle">Physical Contact Surface</text>
    <text x="112" y="248" fill="#cbd5e1" font-size="11" text-anchor="middle">• Shoe/Hand Prints</text>
    <text x="112" y="268" fill="#cbd5e1" font-size="11" text-anchor="middle">• Swipe Patterns</text>
    <text x="112" y="288" fill="#cbd5e1" font-size="11" text-anchor="middle">• Wipe Patterns</text>
    <text x="112" y="308" fill="#cbd5e1" font-size="11" text-anchor="middle">• Fabric Impressions</text>
    <text x="112" y="330" fill="#10b981" font-size="10" font-weight="700" text-anchor="middle">Force = Direct Contact</text>
  </g>
</svg>
`);

// 14. Anatomy of a Bloodstain: Parent Stain, Spines, and Satellite Spatter
export const SATELLITE_AND_SPINE_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="45" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">ANATOMY OF A BLOOD DROP IMPACT</text>
  <text x="400" y="68" fill="#94a3b8" font-size="12" text-anchor="middle">Parent Stain, Spines, and Satellite Spatter</text>

  <g transform="translate(50, 95)">
    <rect width="700" height="345" fill="#1e293b" rx="12" stroke="#334155" stroke-width="1.5"/>

    <!-- Central Drop Graphic -->
    <g transform="translate(240, 40)">
      <!-- Central Parent Drop with Spines -->
      <path d="M 120,40 L 126,80 L 155,50 L 140,90 L 180,85 L 145,115 L 190,135 L 145,145 L 175,180 L 135,165 L 145,210 L 115,175 L 95,215 L 90,170 L 55,195 L 75,150 L 35,140 L 80,120 L 40,90 L 85,90 L 65,55 L 105,80 Z" fill="#991b1b" stroke="#dc2626" stroke-width="2"/>
      <circle cx="115" cy="125" r="45" fill="#b91c1c"/>

      <!-- Satellite Spatters (Small detached drops) -->
      <circle cx="18" cy="45" r="5" fill="#ef4444"/>
      <circle cx="215" cy="40" r="4" fill="#ef4444"/>
      <circle cx="225" cy="190" r="6" fill="#ef4444"/>
      <circle cx="195" cy="235" r="3.5" fill="#ef4444"/>
      <circle cx="25" cy="220" r="5" fill="#ef4444"/>
      <circle cx="5" cy="120" r="4" fill="#ef4444"/>

      <!-- Callout Labels -->
      <!-- 1. Parent Stain -->
      <line x1="115" y1="125" x2="115" y2="280" stroke="#fcd34d" stroke-width="2"/>
      <circle cx="115" cy="125" r="4" fill="#fcd34d"/>
      <rect x="40" y="275" width="150" height="28" fill="#0f172a" rx="6" stroke="#fcd34d"/>
      <text x="115" y="293" fill="#fcd34d" font-size="12" font-weight="800" text-anchor="middle">PARENT STAIN</text>

      <!-- 2. Spine -->
      <line x1="180" y1="85" x2="250" y2="85" stroke="#38bdf8" stroke-width="2"/>
      <circle cx="180" cy="85" r="3" fill="#38bdf8"/>
      <rect x="250" y="70" width="120" height="28" fill="#0f172a" rx="6" stroke="#38bdf8"/>
      <text x="310" y="88" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">SPINE (Edge Spike)</text>

      <!-- 3. Satellite Spatter -->
      <line x1="225" y1="190" x2="250" y2="150" stroke="#34d399" stroke-width="2"/>
      <circle cx="225" cy="190" r="3" fill="#34d399"/>
      <rect x="250" y="135" width="150" height="28" fill="#0f172a" rx="6" stroke="#34d399"/>
      <text x="325" y="153" fill="#34d399" font-size="12" font-weight="800" text-anchor="middle">SATELLITE SPATTER</text>
    </g>

    <!-- Side Explanation Box -->
    <g transform="translate(25, 30)">
      <rect width="190" height="285" fill="#0f172a" rx="8" stroke="#334155"/>
      <text x="95" y="30" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle">DEFINITIONS</text>
      
      <text x="15" y="65" fill="#fcd34d" font-size="11" font-weight="800">1. Parent Stain:</text>
      <text x="15" y="85" fill="#cbd5e1" font-size="10">The main bloodstain</text>
      <text x="15" y="100" fill="#cbd5e1" font-size="10">created by initial impact.</text>

      <text x="15" y="135" fill="#38bdf8" font-size="11" font-weight="800">2. Spines:</text>
      <text x="15" y="155" fill="#cbd5e1" font-size="10">Pointed edge rays that</text>
      <text x="15" y="170" fill="#cbd5e1" font-size="10">remain ATTACHED to drop.</text>

      <text x="15" y="205" fill="#34d399" font-size="11" font-weight="800">3. Satellite Spatter:</text>
      <text x="15" y="225" fill="#cbd5e1" font-size="10">Small DETACHED droplets</text>
      <text x="15" y="240" fill="#cbd5e1" font-size="10">thrown off upon impact.</text>
    </g>
  </g>
</svg>
`);

// 15. Spatter Velocity Categories (Low, Medium, High)
export const VELOCITY_SPATTER_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="45" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">SPATTER VELOCITY CLASSIFICATION</text>
  <text x="400" y="68" fill="#94a3b8" font-size="12" text-anchor="middle">Low vs. Medium vs. High Velocity Impact Spatter</text>

  <!-- Low Velocity Card -->
  <g transform="translate(35, 95)">
    <rect width="225" height="345" fill="#1e293b" rx="12" stroke="#38bdf8" stroke-width="1.5"/>
    <rect x="12" y="12" width="201" height="28" fill="#38bdf8" fill-opacity="0.2" rx="6"/>
    <text x="112" y="31" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">LOW VELOCITY</text>

    <rect x="15" y="50" width="195" height="130" fill="#0f172a" rx="8"/>
    <!-- Large drops > 4mm -->
    <circle cx="70" cy="115" r="24" fill="#b91c1c" stroke="#ef4444" stroke-width="2"/>
    <circle cx="150" cy="115" r="20" fill="#b91c1c" stroke="#ef4444" stroke-width="2"/>

    <text x="112" y="205" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle">Large Size (> 4 mm)</text>
    <text x="112" y="230" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">Speed: ~5 ft/sec</text>
    <text x="112" y="260" fill="#cbd5e1" font-size="11" text-anchor="middle">Caused by:</text>
    <text x="112" y="280" fill="#cbd5e1" font-size="11" text-anchor="middle">• Passive dripping</text>
    <text x="112" y="300" fill="#cbd5e1" font-size="11" text-anchor="middle">• Gravitational fall</text>
    <text x="112" y="325" fill="#94a3b8" font-size="10" text-anchor="middle">Minimal force</text>
  </g>

  <!-- Medium Velocity Card -->
  <g transform="translate(285, 95)">
    <rect width="225" height="345" fill="#1e293b" rx="12" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="12" y="12" width="201" height="28" fill="#f59e0b" fill-opacity="0.2" rx="6"/>
    <text x="112" y="31" fill="#f59e0b" font-size="12" font-weight="800" text-anchor="middle">MEDIUM VELOCITY</text>

    <rect x="15" y="50" width="195" height="130" fill="#0f172a" rx="8"/>
    <!-- Medium drops 1 to 4mm -->
    <circle cx="60" cy="90" r="7" fill="#dc2626"/>
    <circle cx="110" cy="80" r="9" fill="#dc2626"/>
    <circle cx="160" cy="100" r="8" fill="#dc2626"/>
    <circle cx="85" cy="140" r="6" fill="#dc2626"/>
    <circle cx="140" cy="145" r="7" fill="#dc2626"/>

    <text x="112" y="205" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle">Medium (1 – 4 mm)</text>
    <text x="112" y="230" fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">Speed: 5 – 25 ft/sec</text>
    <text x="112" y="260" fill="#cbd5e1" font-size="11" text-anchor="middle">Caused by:</text>
    <text x="112" y="280" fill="#cbd5e1" font-size="11" text-anchor="middle">• Blunt force (bat, fist)</text>
    <text x="112" y="300" fill="#cbd5e1" font-size="11" text-anchor="middle">• Stabbing impacts</text>
    <text x="112" y="325" fill="#94a3b8" font-size="10" text-anchor="middle">Moderate mechanical force</text>
  </g>

  <!-- High Velocity Card -->
  <g transform="translate(535, 95)">
    <rect width="225" height="345" fill="#1e293b" rx="12" stroke="#ef4444" stroke-width="1.5"/>
    <rect x="12" y="12" width="201" height="28" fill="#ef4444" fill-opacity="0.2" rx="6"/>
    <text x="112" y="31" fill="#ef4444" font-size="12" font-weight="800" text-anchor="middle">HIGH VELOCITY</text>

    <rect x="15" y="50" width="195" height="130" fill="#0f172a" rx="8"/>
    <!-- Fine mist < 1mm -->
    <g fill="#ef4444" opacity="0.9">
      <circle cx="50" cy="80" r="1.5"/><circle cx="70" cy="75" r="1"/><circle cx="90" cy="90" r="1.5"/><circle cx="110" cy="70" r="2"/><circle cx="130" cy="85" r="1"/><circle cx="150" cy="75" r="1.5"/>
      <circle cx="60" cy="110" r="1"/><circle cx="80" cy="120" r="2"/><circle cx="100" cy="105" r="1.5"/><circle cx="120" cy="125" r="1"/><circle cx="140" cy="110" r="2"/><circle cx="160" cy="120" r="1.5"/>
      <circle cx="75" cy="145" r="1.5"/><circle cx="95" cy="140" r="1"/><circle cx="115" cy="150" r="2"/><circle cx="135" cy="145" r="1"/>
    </g>

    <text x="112" y="205" fill="#f8fafc" font-size="13" font-weight="800" text-anchor="middle">Fine Mist (< 1 mm)</text>
    <text x="112" y="230" fill="#ef4444" font-size="11" font-weight="700" text-anchor="middle">Speed: > 100 ft/sec</text>
    <text x="112" y="260" fill="#cbd5e1" font-size="11" text-anchor="middle">Caused by:</text>
    <text x="112" y="280" fill="#cbd5e1" font-size="11" text-anchor="middle">• Gunshots</text>
    <text x="112" y="300" fill="#cbd5e1" font-size="11" text-anchor="middle">• Explosions / High speed</text>
    <text x="112" y="325" fill="#94a3b8" font-size="10" text-anchor="middle">High kinetic energy</text>
  </g>
</svg>
`);

// 16. Drip Trail Pattern
export const DRIP_TRAIL_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="45" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">DRIP TRAIL PATTERN &amp; DIRECTION OF MOVEMENT</text>
  <text x="400" y="68" fill="#94a3b8" font-size="12" text-anchor="middle">Linear Series of Drops Deposited by a Moving Source</text>

  <g transform="translate(50, 95)">
    <rect width="700" height="345" fill="#1e293b" rx="12" stroke="#334155" stroke-width="1.5"/>

    <!-- Floor walkway -->
    <rect x="30" y="35" width="640" height="180" fill="#0f172a" rx="8" stroke="#334155"/>

    <!-- Direction Arrow -->
    <line x1="80" y1="70" x2="580" y2="70" stroke="#38bdf8" stroke-width="3" stroke-dasharray="6,4"/>
    <polygon points="585,70 565,60 565,80" fill="#38bdf8"/>
    <text x="330" y="60" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">DIRECTION OF PERSON MOVEMENT &rarr;</text>

    <!-- Series of Drops getting faster / elongating slightly -->
    <!-- Drop 1 (Standing / Slow) -->
    <circle cx="100" cy="140" r="16" fill="#b91c1c" stroke="#ef4444" stroke-width="1.5"/>
    <text x="100" y="180" fill="#cbd5e1" font-size="10" font-weight="700" text-anchor="middle">Drop 1 (Round)</text>

    <!-- Drop 2 (Walking) -->
    <path d="M 230,132 C 242,132 255,137 265,140 C 255,143 242,148 230,148 Z" fill="#b91c1c" stroke="#ef4444" stroke-width="1.5"/>
    <circle cx="230" cy="140" r="14" fill="#b91c1c"/>
    <text x="235" y="180" fill="#cbd5e1" font-size="10" font-weight="700" text-anchor="middle">Drop 2</text>

    <!-- Drop 3 (Walking faster) -->
    <path d="M 370,132 C 385,132 405,138 418,140 C 405,142 385,148 370,148 Z" fill="#b91c1c" stroke="#ef4444" stroke-width="1.5"/>
    <circle cx="370" cy="140" r="13" fill="#b91c1c"/>
    <text x="380" y="180" fill="#cbd5e1" font-size="10" font-weight="700" text-anchor="middle">Drop 3 (Oval + Tail)</text>

    <!-- Drop 4 (Jogging) -->
    <path d="M 520,132 C 540,132 565,138 580,140 C 565,142 540,148 520,148 Z" fill="#b91c1c" stroke="#ef4444" stroke-width="1.5"/>
    <circle cx="520" cy="140" r="12" fill="#b91c1c"/>
    <circle cx="592" cy="140" r="3" fill="#ef4444"/>
    <text x="535" y="180" fill="#cbd5e1" font-size="10" font-weight="700" text-anchor="middle">Drop 4 (Elongated)</text>

    <!-- Summary Box -->
    <g transform="translate(30, 235)">
      <rect width="640" height="85" fill="#0f172a" rx="8" stroke="#334155"/>
      <text x="320" y="24" fill="#fbbf24" font-size="13" font-weight="800" text-anchor="middle">KEY FORENSIC TAKEAWAY FOR DRIP TRAILS</text>
      <text x="320" y="48" fill="#cbd5e1" font-size="11" text-anchor="middle">• Tail points in the forward direction of the walking/running person</text>
      <text x="320" y="68" fill="#cbd5e1" font-size="11" text-anchor="middle">• Wider distance between drops and greater elongation indicate faster movement</text>
    </g>
  </g>
</svg>
`);

// 17. Blood Composition (Plasma, RBCs, WBCs, Platelets)
export const BLOOD_COMPONENTS_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <text x="400" y="45" fill="#f8fafc" font-size="19" font-weight="800" text-anchor="middle" letter-spacing="1">BASIC BIOLOGICAL COMPOSITION OF HUMAN BLOOD</text>
  <text x="400" y="68" fill="#94a3b8" font-size="12" text-anchor="middle">The 4 Key Components Tested in Forensic Serology</text>

  <g transform="translate(35, 95)">
    <!-- 1. Plasma -->
    <g transform="translate(0, 0)">
      <rect width="170" height="345" fill="#1e293b" rx="10" stroke="#eab308" stroke-width="1.5"/>
      <rect x="10" y="10" width="150" height="26" fill="#eab308" fill-opacity="0.2" rx="6"/>
      <text x="85" y="28" fill="#fde047" font-size="12" font-weight="800" text-anchor="middle">1. PLASMA (55%)</text>
      
      <rect x="15" y="45" width="140" height="100" fill="#0f172a" rx="8"/>
      <rect x="25" y="55" width="120" height="80" fill="#ca8a04" fill-opacity="0.3" rx="6"/>
      <text x="85" y="100" fill="#fef08a" font-size="11" font-weight="700" text-anchor="middle">Liquid Portion</text>

      <text x="85" y="170" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Pale Yellow Fluid</text>
      <text x="85" y="195" fill="#cbd5e1" font-size="10" text-anchor="middle">90% Water</text>
      <text x="85" y="215" fill="#cbd5e1" font-size="10" text-anchor="middle">Proteins &amp; Salts</text>
      <text x="85" y="235" fill="#cbd5e1" font-size="10" text-anchor="middle">Nutrients &amp; Hormones</text>
      <text x="85" y="265" fill="#94a3b8" font-size="9" text-anchor="middle">Transports cells</text>
    </g>

    <!-- 2. Red Blood Cells -->
    <g transform="translate(185, 0)">
      <rect width="170" height="345" fill="#1e293b" rx="10" stroke="#ef4444" stroke-width="1.5"/>
      <rect x="10" y="10" width="150" height="26" fill="#ef4444" fill-opacity="0.2" rx="6"/>
      <text x="85" y="28" fill="#fca5a5" font-size="11" font-weight="800" text-anchor="middle">2. RED CELLS (44%)</text>

      <rect x="15" y="45" width="140" height="100" fill="#0f172a" rx="8"/>
      <circle cx="85" cy="95" r="28" fill="#dc2626" stroke="#f87171" stroke-width="2"/>
      <ellipse cx="85" cy="95" rx="14" ry="10" fill="#991b1b"/>

      <text x="85" y="170" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Erythrocytes</text>
      <text x="85" y="195" fill="#cbd5e1" font-size="10" text-anchor="middle">Contain Hemoglobin</text>
      <text x="85" y="215" fill="#cbd5e1" font-size="10" text-anchor="middle">Iron (Fe) carries O₂</text>
      <text x="85" y="235" fill="#f87171" font-size="10" font-weight="700" text-anchor="middle">Reacts with Luminol</text>
      <text x="85" y="265" fill="#94a3b8" font-size="9" text-anchor="middle">No nucleus in mature cell</text>
    </g>

    <!-- 3. White Blood Cells -->
    <g transform="translate(370, 0)">
      <rect width="170" height="345" fill="#1e293b" rx="10" stroke="#38bdf8" stroke-width="1.5"/>
      <rect x="10" y="10" width="150" height="26" fill="#38bdf8" fill-opacity="0.2" rx="6"/>
      <text x="85" y="28" fill="#7dd3fc" font-size="11" font-weight="800" text-anchor="middle">3. WHITE CELLS (&lt;1%)</text>

      <rect x="15" y="45" width="140" height="100" fill="#0f172a" rx="8"/>
      <circle cx="85" cy="95" r="30" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
      <!-- Nucleus -->
      <path d="M 75,85 C 70,95 85,105 95,95 C 100,85 85,75 75,85 Z" fill="#6366f1"/>

      <text x="85" y="170" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Leukocytes</text>
      <text x="85" y="195" fill="#38bdf8" font-size="10" font-weight="700" text-anchor="middle">Contain Nuclear DNA</text>
      <text x="85" y="215" fill="#cbd5e1" font-size="10" text-anchor="middle">Immune Defense</text>
      <text x="85" y="235" fill="#38bdf8" font-size="10" text-anchor="middle">Used for DNA Profiling</text>
      <text x="85" y="265" fill="#94a3b8" font-size="9" text-anchor="middle">Source of STR Profiles</text>
    </g>

    <!-- 4. Platelets -->
    <g transform="translate(555, 0)">
      <rect width="170" height="345" fill="#1e293b" rx="10" stroke="#a855f7" stroke-width="1.5"/>
      <rect x="10" y="10" width="150" height="26" fill="#a855f7" fill-opacity="0.2" rx="6"/>
      <text x="85" y="28" fill="#d8b4fe" font-size="11" font-weight="800" text-anchor="middle">4. PLATELETS (&lt;1%)</text>

      <rect x="15" y="45" width="140" height="100" fill="#0f172a" rx="8"/>
      <circle cx="65" cy="85" r="8" fill="#9333ea"/>
      <circle cx="95" cy="90" r="10" fill="#9333ea"/>
      <circle cx="80" cy="115" r="7" fill="#9333ea"/>
      <circle cx="110" cy="110" r="9" fill="#9333ea"/>

      <text x="85" y="170" fill="#f8fafc" font-size="11" font-weight="700" text-anchor="middle">Thrombocytes</text>
      <text x="85" y="195" fill="#d8b4fe" font-size="10" font-weight="700" text-anchor="middle">Blood Clotting</text>
      <text x="85" y="215" fill="#cbd5e1" font-size="10" text-anchor="middle">Forms Fibrin Clots</text>
      <text x="85" y="235" fill="#cbd5e1" font-size="10" text-anchor="middle">Clots in 3 – 15 mins</text>
      <text x="85" y="265" fill="#94a3b8" font-size="9" text-anchor="middle">Stops bleeding</text>
    </g>
  </g>
</svg>
`);

// 18. Case Study 1: Living Room Void Pattern Investigation
export const CASE_VOID_SCENARIO_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <!-- Header -->
  <text x="400" y="42" fill="#fcd34d" font-size="13" font-weight="800" text-anchor="middle" letter-spacing="2">CASE STUDY SCENARIO 1: CRIME SCENE RECONSTRUCTION</text>
  <text x="400" y="66" fill="#f8fafc" font-size="18" font-weight="800" text-anchor="middle">The Missing Living Room Object Investigation</text>

  <g transform="translate(40, 85)">
    <rect width="720" height="360" fill="#1e293b" rx="12" stroke="#334155" stroke-width="1.5"/>

    <!-- Room Wall -->
    <rect x="25" y="25" width="460" height="310" fill="#0f172a" rx="8" stroke="#475569"/>

    <!-- Spatter on wall surrounding the void -->
    <!-- Radiating spatters -->
    <g fill="#dc2626" opacity="0.85">
      <!-- Top and sides spatter -->
      <circle cx="70" cy="60" r="6"/><circle cx="110" cy="50" r="4"/><circle cx="160" cy="70" r="5"/><circle cx="210" cy="45" r="7"/><circle cx="270" cy="55" r="4"/><circle cx="330" cy="45" r="6"/><circle cx="390" cy="65" r="5"/><circle cx="440" cy="55" r="7"/>
      <circle cx="50" cy="110" r="8"/><circle cx="75" cy="150" r="5"/><circle cx="55" cy="200" r="7"/><circle cx="70" cy="260" r="6"/><circle cx="50" cy="300" r="5"/>
      <circle cx="430" cy="120" r="6"/><circle cx="450" cy="180" r="7"/><circle cx="435" cy="230" r="5"/><circle cx="455" cy="280" r="8"/>
      <circle cx="130" cy="310" r="7"/><circle cx="220" cy="315" r="5"/><circle cx="320" cy="310" r="6"/><circle cx="380" cy="315" r="8"/>
    </g>

    <!-- The Sharp Rectangular Blank Void -->
    <rect x="110" y="90" width="290" height="190" fill="#090d16" stroke="#fbbf24" stroke-width="2" stroke-dasharray="6,4" rx="4"/>
    <text x="255" y="175" fill="#fbbf24" font-size="15" font-weight="800" text-anchor="middle">CLEAN UNSTAINED VOID</text>
    <text x="255" y="200" fill="#94a3b8" font-size="12" text-anchor="middle">(Missing TV / Object Silhouette)</text>

    <!-- Observation Side Card -->
    <g transform="translate(505, 25)">
      <rect width="190" height="310" fill="#0f172a" rx="8" stroke="#334155"/>
      <rect x="10" y="10" width="170" height="26" fill="#f59e0b" fill-opacity="0.2" rx="4"/>
      <text x="95" y="28" fill="#fcd34d" font-size="11" font-weight="800" text-anchor="middle">INVESTIGATOR LOG</text>

      <text x="12" y="60" fill="#f8fafc" font-size="11" font-weight="700">Scene Finding:</text>
      <text x="12" y="80" fill="#cbd5e1" font-size="10">• Blood spatter on wall</text>
      <text x="12" y="98" fill="#cbd5e1" font-size="10">• Sharp rectangular</text>
      <text x="12" y="114" fill="#cbd5e1" font-size="10">  blank silhouette</text>
      <text x="12" y="132" fill="#cbd5e1" font-size="10">• No TV found in room</text>

      <line x1="10" y1="150" x2="180" y2="150" stroke="#334155"/>

      <text x="12" y="175" fill="#38bdf8" font-size="11" font-weight="700">Forensic Deduction:</text>
      <text x="12" y="195" fill="#cbd5e1" font-size="10">An object was mounted</text>
      <text x="12" y="210" fill="#cbd5e1" font-size="10">here during the impact</text>
      <text x="12" y="225" fill="#cbd5e1" font-size="10">blocking the blood, and</text>
      <text x="12" y="240" fill="#cbd5e1" font-size="10">was removed afterward.</text>

      <rect x="10" y="265" width="170" height="32" fill="#1e293b" rx="6" stroke="#fbbf24"/>
      <text x="95" y="286" fill="#fbbf24" font-size="11" font-weight="800" text-anchor="middle">Pattern: VOID PATTERN</text>
    </g>
  </g>
</svg>
`);

// 19. Case Study 2: Hallway Escape Drip Trail Investigation
export const CASE_DRIP_TRAIL_SCENARIO_DIAGRAM = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" width="100%" height="100%" style="background:#090d16; font-family:system-ui, -apple-system, sans-serif;">
  <rect width="800" height="480" fill="#090d16" rx="16"/>
  <rect x="15" y="15" width="770" height="450" fill="none" stroke="#1e293b" stroke-width="1.5" rx="12"/>

  <!-- Header -->
  <text x="400" y="42" fill="#38bdf8" font-size="13" font-weight="800" text-anchor="middle" letter-spacing="2">CASE STUDY SCENARIO 2: CRIME SCENE RECONSTRUCTION</text>
  <text x="400" y="66" fill="#f8fafc" font-size="18" font-weight="800" text-anchor="middle">Hallway Escape Route &amp; Droplet Directionality</text>

  <g transform="translate(40, 85)">
    <rect width="720" height="360" fill="#1e293b" rx="12" stroke="#334155" stroke-width="1.5"/>

    <!-- Floor corridor -->
    <rect x="25" y="25" width="670" height="200" fill="#0f172a" rx="8" stroke="#334155"/>

    <!-- Corridor markers -->
    <rect x="35" y="35" width="110" height="30" fill="#1e293b" rx="6" stroke="#64748b"/>
    <text x="90" y="55" fill="#94a3b8" font-size="11" font-weight="700" text-anchor="middle">🚪 Bedroom Door</text>

    <rect x="575" y="35" width="110" height="30" fill="#1e293b" rx="6" stroke="#38bdf8"/>
    <text x="630" y="55" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">🚪 Backdoor Exit</text>

    <!-- Direction Arrow -->
    <line x1="170" y1="50" x2="550" y2="50" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,4"/>
    <polygon points="555,50 540,44 540,56" fill="#38bdf8"/>
    <text x="360" y="42" fill="#38bdf8" font-size="11" font-weight="800" text-anchor="middle">ESCAPE DIRECTION &rarr;</text>

    <!-- Droplet sequence along the hallway floor -->
    <!-- Drop 1 -->
    <circle cx="120" cy="140" r="15" fill="#b91c1c" stroke="#ef4444" stroke-width="1.5"/>
    <text x="120" y="180" fill="#cbd5e1" font-size="10" text-anchor="middle">Drop 1 (Origin)</text>

    <!-- Drop 2 -->
    <path d="M 240,132 C 255,132 270,137 282,140 C 270,143 255,148 240,148 Z" fill="#b91c1c" stroke="#ef4444" stroke-width="1.5"/>
    <circle cx="240" cy="140" r="14" fill="#b91c1c"/>
    <text x="250" y="180" fill="#cbd5e1" font-size="10" text-anchor="middle">Drop 2 (Walking)</text>

    <!-- Drop 3 -->
    <path d="M 390,132 C 410,132 435,138 450,140 C 435,142 410,148 390,148 Z" fill="#b91c1c" stroke="#ef4444" stroke-width="1.5"/>
    <circle cx="390" cy="140" r="13" fill="#b91c1c"/>
    <text x="410" y="180" fill="#cbd5e1" font-size="10" text-anchor="middle">Drop 3 (Jogging)</text>

    <!-- Drop 4 -->
    <path d="M 540,132 C 565,132 595,138 615,140 C 595,142 565,148 540,148 Z" fill="#b91c1c" stroke="#ef4444" stroke-width="1.5"/>
    <circle cx="540" cy="140" r="12" fill="#b91c1c"/>
    <circle cx="625" cy="140" r="3" fill="#ef4444"/>
    <text x="560" y="180" fill="#cbd5e1" font-size="10" text-anchor="middle">Drop 4 (Running)</text>

    <!-- Analysis Card at Bottom -->
    <g transform="translate(25, 240)">
      <rect width="670" height="95" fill="#0f172a" rx="8" stroke="#334155"/>
      <text x="335" y="26" fill="#38bdf8" font-size="12" font-weight="800" text-anchor="middle">CASE RECONSTRUCTION CONCLUSION</text>
      <text x="335" y="52" fill="#f8fafc" font-size="11" text-anchor="middle">1. Pattern Identified: <tspan fill="#fcd34d" font-weight="bold">DRIP TRAIL (Passive Walking Drops)</tspan></text>
      <text x="335" y="74" fill="#cbd5e1" font-size="11" text-anchor="middle">2. Direction: The pointed droplet tails point toward the <tspan fill="#34d399" font-weight="bold">Backdoor Exit</tspan>, proving the bleeding person fled outside.</text>
    </g>
  </g>
</svg>
`);


