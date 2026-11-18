import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Beaker, Activity, Power, MoveHorizontal, Droplets, BookOpen, CheckCircle2, FileText } from 'lucide-react';
import { Spectrophotometer3D } from '../components/laboratory/Spectrophotometer3D';
import { cn } from '../lib/utils';
import { SEO } from '@/components/layout/SEO';
import { EditorialAuthorCard } from '@/components/editorial/EditorialAuthorCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SAMPLES = [
  { id: 'blank', name: 'Blank (Distilled Water)', baseAbsorbance: 0.0, peakWavelength: 400, color: '#ffffff' },
  { id: 'blood', name: 'Presumptive Blood (Kastle-Meyer positive)', baseAbsorbance: 0.85, peakWavelength: 540, color: '#e11d48' },
  { id: 'ink_blue', name: 'Document Ink (Blue Pen)', baseAbsorbance: 0.65, peakWavelength: 590, color: '#2563eb' },
  { id: 'ink_black', name: 'Document Ink (Black Pen)', baseAbsorbance: 0.95, peakWavelength: 600, color: '#111111' },
  { id: 'ninhydrin', name: 'Ninhydrin Developed Print Extract', baseAbsorbance: 0.70, peakWavelength: 570, color: '#7c3aed' },
];

export default function SpectrophotometerLab() {
  const [currentSample, setCurrentSample] = useState(SAMPLES[0]);
  const [wavelength, setWavelength] = useState(400); // 400 to 700 nm
  const [lidOpen, setLidOpen] = useState(false);
  const [cuvetteInserted, setCuvetteInserted] = useState(false);
  const [powerOn, setPowerOn] = useState(true);
  const [zeroed, setZeroed] = useState(false);

  const currentAbsorbance = useMemo(() => {
    if (!powerOn || !cuvetteInserted || lidOpen) return 0.000;
    
    if (currentSample.id === 'blank') {
      return zeroed ? 0.000 : 0.050;
    }
    
    const sigma = 40;
    const peak = currentSample.peakWavelength;
    const maxAbs = currentSample.baseAbsorbance;
    
    const mathAbs = maxAbs * Math.exp(-Math.pow(wavelength - peak, 2) / (2 * Math.pow(sigma, 2)));
    const offset = zeroed ? 0 : 0.050;
    
    return Math.max(0, mathAbs + offset);
  }, [currentSample, wavelength, lidOpen, cuvetteInserted, powerOn, zeroed]);

  const chartData = useMemo(() => {
    const data = [];
    for (let w = 400; w <= 700; w += 10) {
      if (currentSample.id === 'blank') {
         data.push({ wavelength: w, absorbance: 0 });
         continue;
      }
      const sigma = 40;
      const mathAbs = currentSample.baseAbsorbance * Math.exp(-Math.pow(w - currentSample.peakWavelength, 2) / (2 * Math.pow(sigma, 2)));
      data.push({ wavelength: w, absorbance: mathAbs });
    }
    return data;
  }, [currentSample]);

  return (
    <div className="w-full bg-base text-text-main font-sans">
      <SEO
        title="UV-Vis Spectrophotometer Simulator & Beer-Lambert Law Forensic Lab Guide"
        description="Interactive 3D UV-Visible Spectrophotometer virtual lab and 1,000-word forensic chemistry manual covering the Beer-Lambert Law, wavelength calibration, CO-oximetry, and ink dye profiling."
        keywords="spectrophotometer simulator, uv vis spectrophotometry forensic chemistry, beer lambert law formula, absorbance transmittance calculator, questioned document ink analysis, carboxyhemoglobin spectrophotometry"
        canonicalPath="/simulations/spectrophotometer"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Virtual Labs', path: '/simulations' },
          { name: 'Spectrophotometer Lab', path: '/simulations/spectrophotometer' },
        ]}
      />

      {/* Interactive 3D Simulator Workspace */}
      <div className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-[#0a0a0a] text-white lg:overflow-hidden border-b border-white/10">
        
        {/* 3D Viewport - Left Side */}
        <div className="w-full h-[50vh] lg:h-full lg:flex-1 relative border-b lg:border-b-0 lg:border-r border-white/10 flex-shrink-0">
          <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
            <Beaker size={20} className="text-warning" />
            <span className="font-bold tracking-widest text-sm uppercase">Spectrophotometer 3D</span>
          </div>
          <div className="absolute bottom-4 left-4 z-10 text-xs text-white/40 uppercase tracking-widest pointer-events-none">
            Drag to rotate • Scroll to zoom • Scroll down for Lab Manual
          </div>
          
          <Canvas camera={{ position: [4, 3, 5], fov: 45 }}>
            <color attach="background" args={['#0a0a0a']} />
            <ambientLight intensity={0.5} />
            <Environment preset="city" />
            <Spectrophotometer3D 
               lidOpen={lidOpen} 
               cuvetteInserted={cuvetteInserted} 
               wavelength={wavelength} 
            />
            <OrbitControls makeDefault minDistance={3} maxDistance={15} target={[0, 0, 0]} />
          </Canvas>
        </div>

        {/* Controls & Readings - Right Side */}
        <div className="w-full lg:w-[500px] flex flex-col lg:h-full bg-surface lg:overflow-y-auto">
          
          {/* Digital Display */}
          <div className="p-8 bg-[#0a0a0a] border-b border-white/5 relative">
             <div className="absolute top-4 left-4 text-xs font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} /> LCD Readout
             </div>
             
             <div className="mt-4 bg-[#111] border border-white/10 p-6 rounded-xl font-mono relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
               
               {powerOn ? (
                 <div className="flex flex-col items-center justify-center gap-4 text-[#00ff00]">
                   <div className="flex items-end gap-2">
                     <span className="text-6xl font-light tracking-tighter tabular-nums">
                       {currentAbsorbance.toFixed(3)}
                     </span>
                     <span className="text-xl pb-1 opacity-70">Abs</span>
                   </div>
                   <div className="flex gap-6 text-sm opacity-70 tabular-nums">
                     <span>WL: {wavelength} nm</span>
                     <span>Status: {lidOpen ? 'LID OPEN' : zeroed ? 'ZEROED' : 'READY'}</span>
                   </div>
                 </div>
               ) : (
                 <div className="flex h-24 items-center justify-center">
                   <span className="text-white/10 text-xl uppercase tracking-widest">Power Off</span>
                 </div>
               )}
             </div>
          </div>

          {/* Controls Panel */}
          <div className="p-6 flex flex-col gap-6 flex-1">
            
             <div className="flex gap-4">
                <button 
                  onClick={() => setPowerOn(!powerOn)}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-bold text-sm transition-all border flex items-center justify-center gap-2 uppercase tracking-widest",
                    powerOn 
                      ? "bg-red-500/20 text-red-500 border-red-500/50 hover:bg-red-500/30" 
                      : "bg-green-500/20 text-green-500 border-green-500/50 hover:bg-green-500/30"
                  )}
                >
                  <Power size={16} />
                  {powerOn ? 'Turn Off' : 'Turn On'}
                </button>
                <button 
                  onClick={() => {
                    if(powerOn && !lidOpen && cuvetteInserted && currentSample.id === 'blank') {
                      setZeroed(true);
                    }
                  }}
                  disabled={!powerOn || lidOpen || !cuvetteInserted}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                >
                  Zero (Blank)
                </button>
             </div>

             <div className="space-y-3 bg-black/20 p-5 rounded-2xl border border-white/5">
               <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                 Hardware Controls
               </label>
               <div className="flex gap-4">
                 <button 
                   onClick={() => setLidOpen(!lidOpen)}
                   className="flex-1 py-2 rounded-lg text-sm bg-surface-hover border border-white/10 hover:border-white/20 transition-all"
                 >
                   {lidOpen ? 'Close Lid' : 'Open Lid'}
                 </button>
                 <button 
                   onClick={() => setCuvetteInserted(!cuvetteInserted)}
                   disabled={!lidOpen}
                   className="flex-1 py-2 rounded-lg text-sm bg-surface-hover border border-white/10 hover:border-white/20 transition-all disabled:opacity-50"
                 >
                   {cuvetteInserted ? 'Remove Cuvette' : 'Insert Cuvette'}
                 </button>
               </div>
             </div>

             <div className="space-y-3">
               <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                 <Droplets size={14} /> Sample Cuvette
               </label>
               <select 
                 className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm focus:ring-2 focus:ring-warning outline-none transition-all cursor-pointer"
                 value={currentSample.id}
                 onChange={(e) => setCurrentSample(SAMPLES.find(s => s.id === e.target.value) || SAMPLES[0])}
                 disabled={!lidOpen}
               >
                 {SAMPLES.map(s => (
                   <option key={s.id} value={s.id}>{s.name}</option>
                 ))}
               </select>
               {!lidOpen && <p className="text-[10px] text-warning uppercase tracking-widest">Open lid to change sample</p>}
             </div>

             <div className="space-y-4 bg-black/20 p-5 rounded-2xl border border-white/5">
               <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center justify-between">
                 <span className="flex items-center gap-2"><MoveHorizontal size={14}/> Wavelength (nm)</span>
                 <span className="text-white/50 tabular-nums">{wavelength} nm</span>
               </label>
               <input 
                  type="range" min="400" max="700" step="5"
                 value={wavelength} onChange={(e) => setWavelength(Number(e.target.value))}
                 className="w-full accent-warning h-2 bg-black rounded-full appearance-none cursor-pointer"
               />
               <div className="flex justify-between text-[10px] text-white/30 uppercase tracking-widest font-bold">
                 <span>400 (Violet)</span>
                 <span>700 (Red)</span>
               </div>
             </div>

             <div className="space-y-3 pt-2">
               <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                 Spectral Analysis Profile (Reference)
               </label>
               <div className="h-48 w-full bg-black/40 rounded-xl p-4 border border-white/5">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={chartData}>
                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                     <XAxis dataKey="wavelength" stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={(v) => `${v}nm`} />
                     <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} domain={[0, 1]} />
                     <Tooltip 
                       contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)' }}
                       itemStyle={{ color: currentSample.color }}
                     />
                     <Line 
                       type="monotone" 
                       dataKey="absorbance" 
                       stroke={currentSample.color} 
                       strokeWidth={2} 
                       dot={false}
                     />
                     <Line 
                        type="monotone"
                        dataKey={() => undefined}
                        stroke="transparent"
                        strokeWidth={0}
                        dot={(props: any) => {
                           if (props.payload.wavelength === wavelength && cuvetteInserted && powerOn && !lidOpen) {
                               return <circle cx={props.cx} cy={props.cy} r={4} fill="#00ff00" />;
                           }
                           return <></>;
                        }}
                     />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
             </div>

          </div>
        </div>
      </div>

      {/* Comprehensive 950+ Word Educational Forensic Spectrophotometry Manual */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <header className="space-y-4 border-b border-black/10 dark:border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-warning font-bold">
            <BookOpen size={15} />
            <span>ForenClue Virtual Laboratory Manual • SOP-SPEC-204</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-text-main tracking-tight leading-tight">
            UV-Visible Spectrophotometry in Forensic Chemistry & Toxicology: Beer-Lambert Law, Calibration & Quantitative Analysis
          </h1>
          <p className="text-base sm:text-lg text-text-muted leading-relaxed">
            Ultraviolet-Visible (UV-Vis) absorption spectrophotometry is a primary analytical technique in forensic chemistry, postmortem toxicology, and questioned document examination. By measuring the selective absorption of monochromatic light between 190 nm and 800 nm, forensic analysts determine both the qualitative electronic structure of chromophoric molecules and their exact molar concentration in biological or trace extracts.
          </p>
        </header>

        {/* Section 1: Principles & Beer-Lambert Law */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main">
            1. Physical & Chemical Principles: Electronic Transitions and the Beer-Lambert Law
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            When a beam of monochromatic electromagnetic radiation of intensity <code className="font-mono text-warning">I₀</code> traverses a transparent cuvette containing an absorbing analyte solution, photons whose energy (<code className="font-mono">ΔE = hc / λ</code>) matches the electronic energy gap between a bonding/non-bonding orbital (<code className="font-mono">π</code> or <code className="font-mono">n</code>) and an anti-bonding orbital (<code className="font-mono">π*</code> or <code className="font-mono">σ*</code>) are absorbed. Consequently, the transmitted beam emerges with a reduced intensity <code className="font-mono text-warning">I</code>.
          </p>
          <p className="text-base text-text-muted leading-relaxed">
            The quantitative relationship between the optical attenuation of light and the concentration of the forensic analyte is governed by the combined <strong>Beer-Lambert Law</strong>:
          </p>
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-5 font-mono text-xs sm:text-sm text-text-main space-y-1.5">
            <div className="font-bold text-warning uppercase tracking-wider mb-1">Beer-Lambert Mathematical Formulation</div>
            <div>Transmittance (T) = I / I₀ &nbsp;&nbsp;|&nbsp;&nbsp; Percent Transmittance (%T) = T × 100</div>
            <div>Absorbance (A) = -log₁₀(T) = log₁₀(I₀ / I) = ε × b × c</div>
            <div className="text-text-muted text-xs pt-1">
              ε = Molar Absorptivity (L·mol⁻¹·cm⁻¹), a wavelength-specific constant characteristic of the chromophore; b = optical path length of the cuvette (standardized at 1.00 cm); c = molar concentration of the absorbing species (mol·L⁻¹).
            </div>
          </div>
          <p className="text-base text-text-muted leading-relaxed">
            Because Absorbance (<code className="font-mono">A</code>) is linearly proportional to concentration (<code className="font-mono">c</code>) within the dilute operating range (<code className="font-mono">0.05 &lt; A &lt; 1.50</code>), forensic chemists prepare a series of certified reference standards, measure their absorbance at the analyte’s wavelength of maximum absorption (<code className="font-mono">λ_max</code>), and apply linear least-squares regression (<code className="font-mono">y = mx + b</code>, requiring <code className="font-mono">R² ≥ 0.998</code>) to quantify unknown casework exhibits.
          </p>
        </section>

        {/* Section 2: Standard Operating Procedure */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main">
            2. Step-by-Step Laboratory Procedure & Blank Zeroing Protocol
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            To obtain court-admissible spectrophotometric readings in the simulator above and in physical forensic laboratories, analysts must eliminate baseline drift, cuvette reflection losses, and ambient stray light:
          </p>
          <ol className="space-y-3 list-decimal list-inside text-sm sm:text-base text-text-muted bg-surface p-6 rounded-2xl border border-black/10 dark:border-white/10">
            <li className="leading-relaxed">
              <strong className="text-text-main">Lamp Warm-Up & Wavelength Selection:</strong> Power on the spectrophotometer and allow the Deuterium (UV: 190–350 nm) and Tungsten-Halogen (Visible: 350–800 nm) lamps to stabilize thermally. Select the target analytical wavelength (<code className="font-mono">λ_max</code>) using the monochromator control—for example, <strong>540 nm</strong> for hemoglobin/Kastle-Meyer extracts, <strong>570 nm</strong> for Ruhemann’s purple (Ninhydrin fingerprint extract), or <strong>590–600 nm</strong> for ballpoint pen ink dyes.
            </li>
            <li className="leading-relaxed">
              <strong className="text-text-main">Solvent Blank Calibration (100% T / 0.000 Abs):</strong> Open the sample compartment lid, select <em>Blank (Distilled Water)</em>, insert the optically matched 1.0 cm cuvette (handling only the frosted sides to avoid fingerprint oil smudges on the optical windows), close the lid to block ambient room light, and press <strong>Zero (Blank)</strong>. Notice how failing to zero the blank leaves a +0.050 Abs baseline offset on every subsequent reading.
            </li>
            <li className="leading-relaxed">
              <strong className="text-text-main">Sample Cuvette Measurement & Spectral Scanning:</strong> Open the sample chamber lid, switch to the forensic exhibit cuvette, close the lid, and record the digital absorbance readout across the 400–700 nm visible spectrum to verify the characteristic <code className="font-mono">λ_max</code> peak profile.
            </li>
            <li className="leading-relaxed">
              <strong className="text-text-main">Quartz vs. Borosilicate Glass Cuvette Selection:</strong> In physical laboratory practice, plastic and borosilicate glass cuvettes absorb strongly below 320 nm; all ultraviolet drug assays (200–320 nm) strictly require fused silica (quartz) cuvettes.
            </li>
          </ol>
        </section>

        {/* Section 3: Forensic Applications */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main">
            3. Real-World Applications in Forensic Science
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-surface border border-black/10 dark:border-white/10 space-y-2">
              <h3 className="text-lg font-heading font-bold text-text-main flex items-center gap-2">
                <CheckCircle2 size={18} className="text-warning shrink-0" />
                <span>Forensic Toxicology: CO-Oximetry & Barbiturate Shift</span>
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                In fire-related deaths and vehicular exhaust asphyxiation, spectrophotometric CO-oximetry differentiates normal oxyhemoglobin (characteristic doublet bands at 541 nm and 576 nm) from carboxyhemoglobin (<code className="font-mono">COHb</code>, hypsochromically shifted to 538 nm and 568 nm) and methemoglobin (630 nm). Similarly, 5,5-disubstituted barbiturates exhibit a diagnostic bathochromic shift from 240 nm (at pH 10) to 255 nm (at pH 13) due to keto-enol lactam ionization.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-black/10 dark:border-white/10 space-y-2">
              <h3 className="text-lg font-heading font-bold text-text-main flex items-center gap-2">
                <CheckCircle2 size={18} className="text-warning shrink-0" />
                <span>Questioned Documents: Ink Dye Discrimination</span>
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                When examining suspected alterations or added digits in contested financial instruments, wills, or ledger entries, micro-plugs of ink are extracted into ethanol or pyridine and scanned from 400 to 700 nm. Even two blue or black ballpoint pens that appear identical to the naked eye often contain different ratios of triarylmethane, phthalocyanine, and azo dyes, yielding distinct <code className="font-mono">λ_max</code> absorbance ratios.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-black/10 dark:border-white/10 space-y-2">
              <h3 className="text-lg font-heading font-bold text-text-main flex items-center gap-2">
                <CheckCircle2 size={18} className="text-warning shrink-0" />
                <span>Latent Fingerprint Reagent Quantification (Ninhydrin)</span>
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Ninhydrin reacts with alpha-amino acids in eccrine sweat deposits on porous paper exhibits to form the chromophore <em>Ruhemann’s purple</em>, which exhibits a sharp absorption maximum at <strong>570 nm</strong>. Spectrophotometric profiling assists laboratories in validating reagent sensitivity and amino acid recovery yields.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-black/10 dark:border-white/10 space-y-2">
              <h3 className="text-lg font-heading font-bold text-text-main flex items-center gap-2">
                <CheckCircle2 size={18} className="text-warning shrink-0" />
                <span>SWGDRUG Category B Drug Profiling & QA Calibration</span>
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Under Scientific Working Group for the Analysis of Seized Drugs (SWGDRUG) guidelines, UV-Vis spectrophotometry serves as a Category B analytical technique for quantifying seized narcotics and pharmaceutical adulterants (such as paracetamol, caffeine, or procaine in illicit heroin). Wavelength accuracy is routinely verified using NIST Holmium Oxide standards (peaks at 360.9 nm, 453.2 nm, 536.2 nm, and 637.5 nm).
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: References */}
        <section className="space-y-4 pt-6 border-t border-black/10 dark:border-white/10">
          <h2 className="text-xl font-heading font-bold text-text-main flex items-center gap-2">
            <FileText size={18} className="text-warning" />
            <span>Academic References & Analytical Standards</span>
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-text-muted bg-surface p-6 rounded-2xl border border-black/10 dark:border-white/10">
            <li>Skoog, D. A., Holler, F. J., &amp; Crouch, S. R. (2018). <em>Principles of Instrumental Analysis</em> (7th Ed., Chapters 13–14). Cengage Learning.</li>
            <li>Moffat, A. C., Osselton, M. D., &amp; Widdop, B. (2020). <em>Clarke&apos;s Analysis of Drugs and Poisons</em> (4th Ed. — Ultraviolet, Visible and Fluorescence Spectrophotometry). Pharmaceutical Press.</li>
            <li>Bell, S. (2019). <em>Forensic Chemistry</em> (3rd Ed.). Pearson Education.</li>
            <li>Directorate of Forensic Science Services (DFSS), Ministry of Home Affairs, Govt. of India (2021). <em>Working Procedure Manual: Forensic Chemistry &amp; Narcotics</em>.</li>
          </ol>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/articles/uv-vis-spectrophotometry-beer-lambert-law-forensic-chemistry"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-warning/15 border border-warning/30 text-xs font-bold text-warning hover:bg-warning hover:text-crust transition-colors"
            >
              <span>Read Full UV-Vis Spectrophotometry Editorial Guide</span>
            </Link>
            <Link
              to="/simulations/microscope"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-xs font-bold text-text-main hover:border-info hover:text-info transition-colors"
            >
              <span>Switch to Compound Microscope Lab</span>
            </Link>
          </div>
        </section>

        <EditorialAuthorCard
          contextLabel="ForenClue Virtual Laboratory Curriculum & Protocol Review"
          publishedDate="January 2026"
          updatedDate="March 2026"
        />
      </article>
    </div>
  );
}
