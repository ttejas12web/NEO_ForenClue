import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Microscope3D } from '@/components/laboratory/Microscope3D';
import { Microscope, Settings2, Lightbulb, Move, Search, Info, ShieldCheck, Sparkles, X, Layers, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
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
    <div className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-[#0a0a0a] text-white font-sans lg:overflow-hidden">
      
      {/* 3D Viewport - Left Side */}
      <div className="w-full h-[50vh] lg:h-full lg:flex-1 relative border-b lg:border-b-0 lg:border-r border-white/10 flex-shrink-0">
        <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
          <Microscope size={20} className="text-info" />
          <span className="font-bold tracking-widest text-sm uppercase">Compound Microscope 3D</span>
        </div>
        
        <div className="absolute bottom-4 left-4 z-10 text-xs text-white/40 uppercase tracking-widest pointer-events-none">
          Drag to rotate • Scroll to zoom
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
           {/* Top Header Controls in Slide Area */}
           <div className="absolute top-3 left-4 z-10 text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2 pointer-events-none">
              <Search size={14} className="text-info" /> Eyepiece View ({objective}x)
           </div>

           {/* Interactive "i" Dot Button in Slide Area */}
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
              {/* Glowing Indicator Dot */}
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

           {/* Slide Optical Viewport */}
           <div 
              className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 border-[#111] shadow-[0_0_50px_rgba(0,0,0,1),inset_0_0_80px_rgba(0,0,0,1)] overflow-hidden relative bg-black flex items-center justify-center pointer-events-none"
           >
              {/* Sample Image */}
              <div 
                className="absolute inset-0 bg-no-repeat transition-all duration-300"
                style={{ 
                  backgroundImage: `url(${currentSample.url})`,
                  backgroundSize: '800px', // base size
                  backgroundPosition: `${stageX}% ${stageY}%`,
                  filter: `blur(${blurAmount}px) brightness(${brightness}) sepia(0.2) hue-rotate(-5deg)`,
                  transform: `scale(${scaleMultiplier})`,
                }}
              />
              
              {/* Lens dirt & vignette */}
              <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,1)] rounded-full mix-blend-multiply" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30 mix-blend-screen" />
              
              {/* Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-full h-[1px] bg-black" />
                <div className="h-full w-[1px] bg-black absolute" />
              </div>
           </div>

           {/* Slide Metadata Pop-up Overlay (Smooth Non-glitching Transition) */}
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
           
           {/* Sample Selection */}
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

           {/* Objective Lenses */}
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

           {/* Focus Controls */}
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

           {/* Stage & Light */}
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
  );
}
