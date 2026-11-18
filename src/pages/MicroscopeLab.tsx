import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Microscope3D } from '@/components/laboratory/Microscope3D';
import { Microscope, Settings2, Lightbulb, Move, Search, Info, ShieldCheck, Sparkles, X, Layers, Activity, BookOpen, CheckCircle2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/layout/SEO';
import { EditorialAuthorCard } from '@/components/editorial/EditorialAuthorCard';
import diatomsImg from '@/assets/images/diatoms_microscope_slide_1787768186208.jpg';
import hairImg from '@/assets/images/human_hair_microscope_slide_1787768458808.jpg';
import plantEpidermisImg from '@/assets/images/plant_epidermis_microscope_1785090601160.jpg';
import syntheticFiberImg from '@/assets/images/synthetic_fiber_microscope_1785090621165.jpg';
import pollenGrainsImg from '@/assets/images/pollen_grains_microscope_1785090638783.jpg';
import bloodStainsImg from '@/assets/images/blood_stains_microscope_1785090877110.jpg';

interface SampleItem {
  id: string;
  name: string;
  category: string;
  recommendedMag: string;
  forensicNote: string;
  url: string;
}

const SAMPLES: SampleItem[] = [
  { 
    id: 's-hair', 
    name: 'Human Hair Shaft (Cuticle & Medulla)', 
    category: 'Forensic Trichology',
    recommendedMag: '10x – 40x',
    forensicNote: 'Microscopic examination evaluates the three anatomical regions: outer flattened imbricate cuticle scales, cortex pigment granule density, and medullary index (ratio < 0.33 for humans vs. > 0.5 for animals) to identify species, somatic origin, and forcible removal status.',
    url: hairImg 
  },
  { 
    id: 's-diatoms', 
    name: 'Diatoms (Drowning Diagnosis)', 
    category: 'Forensic Limnology',
    recommendedMag: '40x – 100x',
    forensicNote: 'Diatom Frustules (Bacillariophyceae) are gold-standard biomarkers in medico-legal investigations to differentiate ante-mortem drowning from post-mortem submersion. Silica frustules survive acid digestion of closed organs (femur marrow, kidneys, liver).',
    url: diatomsImg 
  },
  { 
    id: 's1', 
    name: 'Red Blood Cells (Erythrocytes)', 
    category: 'Forensic Serology',
    recommendedMag: '40x – 100x',
    forensicNote: 'Non-nucleated biconcave discs (~7.2–7.8 µm). Microscopic confirmation validates presumptive tests (Luminol, Kastle-Meyer) and aids in species differentiation (human vs. non-human erythrocytes).',
    url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 's2', 
    name: 'Plant Epidermis & Stomata', 
    category: 'Forensic Botany',
    recommendedMag: '10x – 40x',
    forensicNote: 'Guard cell morphology and stomatal indexing allow identification of specific flora, helping reconstruct clandestine burial locations, suspect movements, and environmental transfers.',
    url: plantEpidermisImg 
  },
  { 
    id: 's3', 
    name: 'Synthetic Polymer Fiber', 
    category: 'Trace Evidence',
    recommendedMag: '10x – 40x',
    forensicNote: 'Uniform extrusion profile, cross-sectional geometry, and delustrant particle distribution analyzed for cross-transfer between victim, suspect, and crime scene fabrics.',
    url: syntheticFiberImg 
  },
  { 
    id: 's4', 
    name: 'Pollen Grains (Exine Sculpturing)', 
    category: 'Forensic Palynology',
    recommendedMag: '40x – 100x',
    forensicNote: 'Distinctive ornamentation and aperture count of sporopollenin exine walls pinpoint regional origin, season of death, and travel pathways across geographical terrains.',
    url: pollenGrainsImg 
  },
  { 
    id: 's5', 
    name: 'Blood Stains (Crust Morphology)', 
    category: 'Forensic Serology',
    recommendedMag: '10x – 40x',
    forensicNote: 'Fibrin meshwork and dried cellular aggregate morphology examined for degradation characteristics, environmental weathering, and extraction suitability.',
    url: bloodStainsImg 
  },
];

const OBJECTIVES = [4, 10, 40, 100];

export default function MicroscopeLab() {
  const [currentSample, setCurrentSample] = useState(SAMPLES[0]);
  const [showMetadata, setShowMetadata] = useState(false);
  
  // Microscope State
  const [objective, setObjective] = useState(4);
  const [lightIntensity, setLightIntensity] = useState(50);
  const [coarseFocus, setCoarseFocus] = useState(20);
  const [fineFocus, setFineFocus] = useState(50);
  const [stageX, setStageX] = useState(50);
  const [stageY, setStageY] = useState(50);

  // Math for rendering Eyepiece
  const perfectFocus = 50; 
  const totalFocus = coarseFocus + (fineFocus - 50) * 0.1;
  const diff = Math.abs(totalFocus - perfectFocus);
  
  // Higher objectives have narrower depth of field, so they blur faster
  const blurAmount = diff * (objective / 10) * 0.5;
  
  const scaleMultiplier = objective / 4; // 4x = 1, 10x = 2.5, 40x = 10, 100x = 25
  const brightness = Math.max(0.1, lightIntensity / 100);

  return (
    <div className="w-full bg-base text-text-main font-sans">
      <SEO
        title="Virtual Compound Microscope Simulator & Forensic Trichology Lab Manual"
        description="Interactive 3D compound brightfield microscope simulation and 1,000-word forensic laboratory guide covering Numerical Aperture, Abbe resolution, hair medullary index, and diatom drowning analysis."
        keywords="virtual compound microscope, forensic trichology simulator, medullary index hair analysis, diatom drowning acid digestion, kohler illumination, numerical aperture forensic science"
        canonicalPath="/simulations/microscope"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Virtual Labs', path: '/simulations' },
          { name: 'Compound Microscope Lab', path: '/simulations/microscope' },
        ]}
      />

      {/* Interactive 3D Simulator Workspace */}
      <div className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-[#0a0a0a] text-white lg:overflow-hidden border-b border-white/10">
        
        {/* 3D Viewport - Left Side */}
        <div className="w-full h-[50vh] lg:h-full lg:flex-1 relative border-b lg:border-b-0 lg:border-r border-white/10 flex-shrink-0">
          <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
            <Microscope size={20} className="text-info" />
            <span className="font-bold tracking-widest text-sm uppercase">Compound Microscope 3D</span>
          </div>
          
          <div className="absolute bottom-4 left-4 z-10 text-xs text-white/40 uppercase tracking-widest pointer-events-none">
            Drag to rotate • Scroll to zoom • Scroll down for Lab Manual
          </div>
          
          <Canvas camera={{ position: [5, 2, 5], fov: 45 }}>
            <color attach="background" args={['#0a0a0a']} />
            <ambientLight intensity={0.5} />
            <Environment preset="city" />
            <Microscope3D 
              focus={coarseFocus} 
              objective={objective} 
              lightIntensity={lightIntensity}
              stageX={stageX}
              stageY={stageY}
            />
            <ContactShadows position={[0, -3.2, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />
            <OrbitControls makeDefault minDistance={2} maxDistance={15} target={[0, 1, 0]} />
          </Canvas>
        </div>

        {/* Controls & Eyepiece - Right Side */}
        <div className="w-full lg:w-[500px] flex flex-col lg:h-full bg-surface lg:overflow-y-auto">
          
          {/* Eyepiece / Slide View Area */}
          <div className="p-6 sm:p-8 flex justify-center bg-black relative shadow-inner overflow-hidden min-h-[320px] sm:min-h-[360px]">
             <div className="absolute top-3 left-4 z-10 text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2 pointer-events-none">
                <Search size={14} className="text-info" /> Eyepiece View ({objective}x)
             </div>

             <button
                onClick={() => setShowMetadata((prev) => !prev)}
                type="button"
                id="slide-info-dot-button"
                className={cn(
                  "absolute top-3 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 shadow-md cursor-pointer select-none",
                  showMetadata
                    ? "bg-info text-black border-info shadow-[0_0_15px_rgba(56,189,248,0.45)]"
                    : "bg-black/70 hover:bg-black/90 text-white/90 border-white/20 hover:border-info/60 backdrop-blur-md"
                )}
                title={showMetadata ? "Hide Specimen Metadata" : "View Specimen Forensic Metadata"}
                aria-label="Toggle Slide Metadata"
             >
                <span className="relative flex h-2 w-2">
                  <span className={cn(
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    showMetadata ? "bg-black" : "bg-info"
                  )} />
                  <span className={cn(
                    "relative inline-flex rounded-full h-2 w-2",
                    showMetadata ? "bg-black" : "bg-info"
                  )} />
                </span>
                <Info size={13} className={showMetadata ? "text-black" : "text-info"} />
                <span className="text-[11px] tracking-wide">
                  {showMetadata ? "Close Info" : "Slide Info"}
                </span>
             </button>

             <div 
                className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 border-[#111] shadow-[0_0_50px_rgba(0,0,0,1),inset_0_0_80px_rgba(0,0,0,1)] overflow-hidden relative bg-black flex items-center justify-center pointer-events-none"
             >
                <div 
                  className="absolute inset-0 bg-no-repeat transition-all duration-300"
                  style={{ 
                    backgroundImage: `url(${currentSample.url})`,
                    backgroundSize: '800px',
                    backgroundPosition: `${stageX}% ${stageY}%`,
                    filter: `blur(${blurAmount}px) brightness(${brightness}) sepia(0.2) hue-rotate(-5deg)`,
                    transform: `scale(${scaleMultiplier})`,
                  }}
                />
                
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,1)] rounded-full mix-blend-multiply" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30 mix-blend-screen" />
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="w-full h-[1px] bg-black" />
                  <div className="h-full w-[1px] bg-black absolute" />
                </div>
             </div>

             <AnimatePresence>
               {showMetadata && (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.96 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.96 }}
                   transition={{ duration: 0.18, ease: 'easeOut' }}
                   className="absolute inset-2 sm:inset-3 z-30 flex items-center justify-center bg-black/75 backdrop-blur-md rounded-2xl p-2"
                   onClick={() => setShowMetadata(false)}
                 >
                   <div 
                     onClick={(e) => e.stopPropagation()} 
                     className="w-full max-w-sm bg-[#16161a] border border-info/30 rounded-xl p-4 shadow-2xl text-left flex flex-col gap-3 max-h-[92%] overflow-y-auto"
                   >
                     <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
                       <div className="space-y-1">
                         <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-info bg-info/10 px-2 py-0.5 rounded border border-info/25">
                           {currentSample.category}
                         </span>
                         <h4 className="text-sm font-bold text-white leading-snug">
                           {currentSample.name}
                         </h4>
                       </div>
                       <button
                         onClick={() => setShowMetadata(false)}
                         className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                         title="Close Info"
                         aria-label="Close"
                       >
                         <X size={15} />
                       </button>
                     </div>

                     <div className="space-y-2.5 text-xs">
                       <div className="flex items-center justify-between text-[11px] bg-black/50 px-3 py-2 rounded-lg border border-white/5">
                         <span className="text-text-muted flex items-center gap-1.5 font-medium">
                           <Search size={12} className="text-info" /> Recommended Lens
                         </span>
                         <span className="text-info font-mono font-bold">{currentSample.recommendedMag}</span>
                       </div>

                       <div className="space-y-1 bg-black/30 p-2.5 rounded-lg border border-white/5">
                         <span className="text-[10px] font-mono uppercase tracking-wider text-info/90 font-bold flex items-center gap-1">
                           <Info size={11} /> Forensic Significance
                         </span>
                         <p className="text-text-muted leading-relaxed text-[11.5px]">
                           {currentSample.forensicNote}
                         </p>
                       </div>
                     </div>

                     <div className="pt-2 flex items-center justify-between text-[10px] text-white/40 font-mono border-t border-white/10">
                       <span>Specimen ID: {currentSample.id}</span>
                       <span className="text-info font-semibold">ForenClue Lab Reference</span>
                     </div>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </div>

          {/* Controls Panel */}
          <div className="p-6 flex flex-col gap-6 flex-1">
             
             <div className="space-y-3">
               <div className="flex items-center justify-between">
                 <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                   <Microscope size={14} className="text-info" /> Specimen Slide
                 </label>
                 <button
                   onClick={() => setShowMetadata((prev) => !prev)}
                   type="button"
                   className={cn(
                     "flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-md border transition-all cursor-pointer",
                     showMetadata
                       ? "bg-info/20 text-info border-info/40 font-bold"
                       : "bg-white/5 hover:bg-white/10 text-text-muted hover:text-white border-white/10"
                   )}
                   title="Click to toggle slide forensic information"
                 >
                   <Info size={12} className="text-info" />
                   <span>{showMetadata ? 'Hide Details' : 'View Details (i)'}</span>
                 </button>
               </div>
               <select 
                 className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-info outline-none transition-all cursor-pointer text-text-main"
                 value={currentSample.id}
                 onChange={(e) => setCurrentSample(SAMPLES.find(s => s.id === e.target.value) || SAMPLES[0])}
               >
                 {SAMPLES.map(s => (
                   <option key={s.id} value={s.id} className="bg-[#18181b] text-white">
                     {s.name}
                   </option>
                 ))}
               </select>
             </div>

             <div className="space-y-3">
               <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                 Objective Lens (Revolving Nosepiece)
               </label>
               <div className="flex gap-2">
                 {OBJECTIVES.map(obj => (
                   <button
                     key={obj}
                     onClick={() => setObjective(obj)}
                     className={cn(
                       "flex-1 py-3 rounded-xl font-bold text-sm transition-all border",
                       objective === obj 
                         ? "bg-info text-black border-info shadow-[0_0_15px_rgba(56,189,248,0.3)]" 
                         : "bg-black/40 text-white/50 border-white/5 hover:bg-white/5"
                     )}
                   >
                     {obj}x
                   </button>
                 ))}
               </div>
             </div>

             <div className="space-y-5 bg-black/20 p-5 rounded-2xl border border-white/5">
               <div className="space-y-3">
                 <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center justify-between">
                   <span className="flex items-center gap-2"><Settings2 size={14}/> Coarse Adjustment</span>
                   <span className="text-white/30">{coarseFocus.toFixed(0)}</span>
                 </label>
                 <input 
                   type="range" min="0" max="100" step="1"
                   value={coarseFocus} onChange={(e) => setCoarseFocus(Number(e.target.value))}
                   className="w-full accent-info h-2 bg-black rounded-full appearance-none cursor-pointer"
                 />
               </div>
               
               <div className="space-y-3">
                 <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center justify-between">
                   <span className="flex items-center gap-2"><Settings2 size={14} className="opacity-50"/> Fine Adjustment</span>
                   <span className="text-white/30">{fineFocus.toFixed(0)}</span>
                 </label>
                 <input 
                   type="range" min="0" max="100" step="1"
                   value={fineFocus} onChange={(e) => setFineFocus(Number(e.target.value))}
                   className="w-full accent-white h-2 bg-black rounded-full appearance-none cursor-pointer"
                 />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                   <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                     <Lightbulb size={14}/> Illuminator
                   </label>
                   <input 
                     type="range" min="0" max="100" step="1"
                     value={lightIntensity} onChange={(e) => setLightIntensity(Number(e.target.value))}
                     className="w-full accent-warning h-2 bg-black rounded-full appearance-none cursor-pointer"
                   />
                </div>

                <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/5">
                   <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                     <Move size={14}/> Mechanical Stage
                   </label>
                   <div className="flex flex-col gap-3">
                     <input 
                       type="range" min="0" max="100" step="1"
                       value={stageX} onChange={(e) => setStageX(Number(e.target.value))}
                       className="w-full accent-info h-1.5 bg-black rounded-full appearance-none cursor-pointer"
                       title="X Axis"
                     />
                     <input 
                       type="range" min="0" max="100" step="1"
                       value={stageY} onChange={(e) => setStageY(Number(e.target.value))}
                       className="w-full accent-info h-1.5 bg-black rounded-full appearance-none cursor-pointer"
                       title="Y Axis"
                     />
                   </div>
                </div>
             </div>

          </div>
        </div>
      </div>

      {/* Comprehensive 950+ Word Educational Forensic Microscopy Guide */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <header className="space-y-4 border-b border-black/10 dark:border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-info font-bold">
            <BookOpen size={15} />
            <span>ForenClue Virtual Laboratory Manual • SOP-MIC-101</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-text-main tracking-tight leading-tight">
            Compound Brightfield Microscopy in Forensic Criminalistics: Optical Principles, Laboratory Procedure & Trace Evidence Analysis
          </h1>
          <p className="text-base sm:text-lg text-text-muted leading-relaxed">
            Compound brightfield microscopy is the foundational non-destructive screening technique across Forensic Biology, Serology, Trichology, Palynology, and Limnology. Before any biological or trace exhibit is consumed in destructive molecular extraction (such as PCR-STR DNA typing or acid digestion), forensic scientists perform systematic microscopic morphology characterization to establish species origin, somatic tissue source, and evidentiary suitability.
          </p>
        </header>

        {/* Section 1: Optical Principles */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main">
            1. Optical Principles: Two-Stage Magnification, Numerical Aperture & Abbe Resolution
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            A compound microscope utilizes two coaxial positive lens systems—the objective lens positioned near the specimen plane and the ocular lens (eyepiece) positioned near the examiner’s eye—to achieve high angular magnification. Total visual magnification (<code className="font-mono text-info">M_total</code>) is the algebraic product of the objective magnification (<code className="font-mono text-info">M_obj</code>: 4x scanning, 10x low-power, 40x high-dry, or 100x oil-immersion) and the ocular magnification (<code className="font-mono text-info">M_oc</code>, typically 10x), yielding total magnifications of 40x, 100x, 400x, and 1000x.
          </p>
          <p className="text-base text-text-muted leading-relaxed">
            In forensic trace analysis, however, optical resolution—the minimum lateral distance (<code className="font-mono text-info">d</code>) at which two adjacent point structures can be distinguished as separate entities—is governed not by magnification, but by Ernst Abbe’s diffraction equation and the Numerical Aperture (<code className="font-mono text-info">NA</code>) of the objective-condenser system:
          </p>
          <div className="rounded-xl border border-info/30 bg-info/5 p-5 font-mono text-xs sm:text-sm text-text-main space-y-1">
            <div className="font-bold text-info uppercase tracking-wider mb-1">Abbe Resolution & Numerical Aperture Equations</div>
            <div>d = (0.61 × λ) / NA &nbsp;&nbsp; where &nbsp;&nbsp; NA = n × sin(θ)</div>
            <div className="text-text-muted text-xs pt-1">
              λ = illumination wavelength (~550 nm for green-yellow visible light); n = refractive index of medium between coverslip and front lens (air = 1.000, immersion oil = 1.515); θ = half-angle of the maximum cone of diffracted light captured by the objective.
            </div>
          </div>
          <p className="text-base text-text-muted leading-relaxed">
            As objective magnification increases from 4x (<code className="font-mono">NA ≈ 0.10</code>) to 40x (<code className="font-mono">NA ≈ 0.65</code>) and 100x oil-immersion (<code className="font-mono">NA ≈ 1.25–1.40</code>), the axial Depth of Field (<code className="font-mono">DoF</code>) narrows dramatically from ~50 µm at 4x to less than 0.5 µm at 100x. In the simulator above, notice how switching to the 40x or 100x objective requires precise adjustment of the <strong>Coarse</strong> (around 20) and <strong>Fine</strong> (around 50) focus controls to bring cellular structures into a sharp focal plane.
          </p>
        </section>

        {/* Section 2: Standard Operating Procedure */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main">
            2. Standard Laboratory Procedure (SOP) & Köhler Illumination Alignment
          </h2>
          <p className="text-base text-text-muted leading-relaxed">
            In accredited Forensic Science Laboratories (ISO/IEC 17025 and DFSS India protocols), microscopic examination follows a standardized sequence to prevent mechanical slide breakage and optical glare artifacts:
          </p>
          <ol className="space-y-3 list-decimal list-inside text-sm sm:text-base text-text-muted bg-surface p-6 rounded-2xl border border-black/10 dark:border-white/10">
            <li className="leading-relaxed">
              <strong className="text-text-main">Slide Mounting & Refractive Index Matching:</strong> Mount trace specimens (such as questioned hairs or textile fibers) flat on a pre-cleaned 1.0 mm borosilicate glass slide under a No. 1.5 coverslip (0.17 mm thickness) using a mounting medium whose refractive index approximates the specimen (<code className="font-mono">n ≈ 1.52–1.54</code> for keratin scale interior visibility, or nail polish/melt-mount for scale casting).
            </li>
            <li className="leading-relaxed">
              <strong className="text-text-main">Low-Power Scanning (4x / 10x Objective):</strong> Always rotate the 4x scanning objective into the optical path first. Secure the slide on the coaxial mechanical stage and adjust the illuminator rheostat to a comfortable intensity (~50%). Use the Coarse Adjustment knob to bring the specimen plane into focus, then center the target feature using the X-Y mechanical stage vernier controls.
            </li>
            <li className="leading-relaxed">
              <strong className="text-text-main">Köhler Illumination Calibration:</strong> Close the field diaphragm, adjust the substage Abbe condenser height until the polygonal edges of the field diaphragm appear sharp in the eyepiece, center the condenser using centering screws, and set the condenser iris aperture diaphragm to 70–80% of the objective’s Numerical Aperture to balance contrast and resolution.
            </li>
            <li className="leading-relaxed">
              <strong className="text-text-main">Parfocal High-Power Transition (40x / 100x):</strong> Because modern forensic microscopes are parfocal, rotating the nosepiece to 40x or 100x keeps the specimen nearly in focus. At 40x and 100x, manipulate <em>only</em> the Fine Adjustment micrometer knob to avoid driving the spring-loaded front lens through the glass coverslip.
            </li>
          </ol>
        </section>

        {/* Section 3: Real-World Forensic Applications */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-bold text-text-main">
            3. Real-World Forensic Applications of Compound Microscopy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-surface border border-black/10 dark:border-white/10 space-y-2">
              <h3 className="text-lg font-heading font-bold text-text-main flex items-center gap-2">
                <CheckCircle2 size={18} className="text-info shrink-0" />
                <span>Forensic Trichology (Human vs. Animal Hair)</span>
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Examiners measure the <strong>Medullary Index (MI)</strong>—the ratio of the central medulla diameter to the total hair shaft diameter. In human hair, <code className="font-mono">MI &lt; 0.33</code> with flattened imbricate cuticular scales and fine cortical pigment granules dispersed toward the periphery. In non-human mammalian hair, <code className="font-mono">MI &gt; 0.50</code> with coronal or spinous cuticular scales and distinct lattice or ladder-like medullae. Microscopic root staging distinguishes forcibly plucked anagen roots (bearing nuclear DNA-rich follicular sheaths) from naturally shed telogen club roots.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-black/10 dark:border-white/10 space-y-2">
              <h3 className="text-lg font-heading font-bold text-text-main flex items-center gap-2">
                <CheckCircle2 size={18} className="text-info shrink-0" />
                <span>Forensic Limnology (Diatom Test in Drowning)</span>
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                To differentiate ante-mortem drowning from post-mortem submersion of a body disposed of in water, forensic pathologists extract closed bone marrow from the femur or sternum and digest organic matrices in concentrated nitric acid (<code className="font-mono">HNO₃</code>). Microscopic examination at 400x–1000x reveals acid-resistant silica frustules of centric (radial symmetry) and pennate (bilateral symmetry) diatoms that entered systemic circulation while the victim’s heart was still beating.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-black/10 dark:border-white/10 space-y-2">
              <h3 className="text-lg font-heading font-bold text-text-main flex items-center gap-2">
                <CheckCircle2 size={18} className="text-info shrink-0" />
                <span>Forensic Palynology & Botany</span>
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Pollen grains and plant epidermal fragments trapped in suspect footwear mud, vehicle air filters, or victim clothing possess highly durable sporopollenin exine walls. Counting aperture pores/furrows and measuring exine sculpturing under 400x–1000x allows palynologists to link an exhibit to a specific biogeographical floral zone or seasonal pollination window.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-black/10 dark:border-white/10 space-y-2">
              <h3 className="text-lg font-heading font-bold text-text-main flex items-center gap-2">
                <CheckCircle2 size={18} className="text-info shrink-0" />
                <span>Forensic Serology & Synthetic Fiber Profiling</span>
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                In sexual assault and violent crime investigations, Christmas Tree staining (Nuclear Fast Red + Picroindigocarmine) under 400x–1000x provides definitive visual confirmation of human spermatozoa heads and tails. For synthetic polymer fibers, brightfield and polarized microscopy reveal trilobal, dog-bone, or hollow cross-sections and titanium dioxide (<code className="font-mono">TiO₂</code>) delustrant granule distributions.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: References */}
        <section className="space-y-4 pt-6 border-t border-black/10 dark:border-white/10">
          <h2 className="text-xl font-heading font-bold text-text-main flex items-center gap-2">
            <FileText size={18} className="text-info" />
            <span>Academic References & Laboratory Manuals</span>
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-text-muted bg-surface p-6 rounded-2xl border border-black/10 dark:border-white/10">
            <li>Deedrick, D. W., &amp; Koch, S. L. (2004). <em>Microscopy of Hair Part 1 &amp; 2: A Practical Guide and Manual for Human and Animal Hairs</em>. Forensic Science Communications, FBI Laboratory.</li>
            <li>Murphy, D. B., &amp; Davidson, M. W. (2012). <em>Fundamentals of Light Microscopy and Electronic Imaging</em> (2nd Ed.). Wiley-Blackwell.</li>
            <li>Pollanen, M. S. (1998). <em>Forensic Diatomology and Drowning</em>. Elsevier Science.</li>
            <li>Directorate of Forensic Science Services (DFSS), Ministry of Home Affairs, Govt. of India (2021). <em>Working Procedure Manual: Forensic Biology &amp; Serology</em>.</li>
          </ol>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/articles/compound-and-comparison-microscopy-trace-evidence-analysis"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-info/10 border border-info/30 text-xs font-bold text-info hover:bg-info hover:text-black transition-colors"
            >
              <span>Read Full Optical Microscopy Editorial Guide</span>
            </Link>
            <Link
              to="/simulations/spectrophotometer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-black/10 dark:border-white/10 text-xs font-bold text-text-main hover:border-warning hover:text-warning transition-colors"
            >
              <span>Switch to UV-Vis Spectrophotometer Lab</span>
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

