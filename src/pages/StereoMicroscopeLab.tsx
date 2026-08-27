import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { StereoMicroscope3D } from '@/components/laboratory/StereoMicroscope3D';
import { Microscope, Settings2, Lightbulb, Move, Search, Info, X, Eye, Sparkles, Sun, Layers, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Crosshair, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import hairImg from '@/assets/images/human_hair_microscope_slide_1787768458808.jpg';
import diatomsImg from '@/assets/images/diatoms_microscope_slide_1787768186208.jpg';
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
    recommendedMag: '20x – 45x',
    forensicNote: 'Diatom Frustules (Bacillariophyceae) are gold-standard biomarkers in medico-legal investigations to differentiate ante-mortem drowning from post-mortem submersion. Silica frustules survive acid digestion of closed organs (femur marrow, kidneys, liver).',
    url: diatomsImg 
  },
  { 
    id: 's1', 
    name: 'Red Blood Cells (Erythrocytes)', 
    category: 'Forensic Serology',
    recommendedMag: '30x – 45x',
    forensicNote: 'Non-nucleated biconcave discs (~7.2–7.8 µm). Microscopic confirmation validates presumptive tests (Luminol, Kastle-Meyer) and aids in species differentiation (human vs. non-human erythrocytes).',
    url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 's2', 
    name: 'Plant Epidermis & Stomata', 
    category: 'Forensic Botany',
    recommendedMag: '10x – 30x',
    forensicNote: 'Guard cell morphology and stomatal indexing allow identification of specific flora, helping reconstruct clandestine burial locations, suspect movements, and environmental transfers.',
    url: plantEpidermisImg 
  },
  { 
    id: 's3', 
    name: 'Synthetic Polymer Fiber', 
    category: 'Trace Evidence',
    recommendedMag: '10x – 35x',
    forensicNote: 'Uniform extrusion profile, cross-sectional geometry, and delustrant particle distribution analyzed for cross-transfer between victim, suspect, and crime scene fabrics.',
    url: syntheticFiberImg 
  },
  { 
    id: 's4', 
    name: 'Pollen Grains (Exine Sculpturing)', 
    category: 'Forensic Palynology',
    recommendedMag: '20x – 45x',
    forensicNote: 'Distinctive ornamentation and aperture count of sporopollenin exine walls pinpoint regional origin, season of death, and travel pathways across geographical terrains.',
    url: pollenGrainsImg 
  },
  { 
    id: 's5', 
    name: 'Blood Stains (Crust Morphology)', 
    category: 'Forensic Serology',
    recommendedMag: '10x – 30x',
    forensicNote: 'Fibrin meshwork and dried cellular aggregate morphology examined for degradation characteristics, environmental weathering, and extraction suitability.',
    url: bloodStainsImg 
  },
];

const ZOOM_STEPS = [0.7, 1.0, 2.0, 3.5, 4.5];

export default function StereoMicroscopeLab() {
  const [currentSample, setCurrentSample] = useState<SampleItem>(SAMPLES[0]);
  const [showMetadata, setShowMetadata] = useState(false);
  const [viewMode, setViewMode] = useState<'binocular' | 'single'>('binocular');
  
  // Stereo Microscope State
  const [zoomFactor, setZoomFactor] = useState(1.0); // 0.7x to 4.5x zoom
  const [ocularMag] = useState(10); // 10x widefield eyepieces
  const [lightIntensity, setLightIntensity] = useState(75);
  const [lightingMode, setLightingMode] = useState<'incident' | 'transmitted' | 'both'>('incident');
  const [coarseFocus, setCoarseFocus] = useState(50);
  const [fineFocus, setFineFocus] = useState(50);
  const [stageX, setStageX] = useState(50);
  const [stageY, setStageY] = useState(50);

  const nudgeStage = (dx: number, dy: number) => {
    setStageX((prev) => Math.min(100, Math.max(0, prev + dx)));
    setStageY((prev) => Math.min(100, Math.max(0, prev + dy)));
  };

  // Total stereoscopic magnification (Zoom * Ocular)
  const totalMagnification = Math.round(zoomFactor * ocularMag);

  // Focus Math
  const perfectFocus = 50; 
  const totalFocusValue = coarseFocus + (fineFocus - 50) * 0.15;
  const diff = Math.abs(totalFocusValue - perfectFocus);
  
  // Depth of field is deeper in stereo microscopes than compound high-power, but narrows with zoom
  const blurAmount = diff * (zoomFactor * 0.45);
  
  // Optical zoom scale
  const scaleMultiplier = (zoomFactor / 0.7) * 1.35;
  const brightness = Math.max(0.15, (lightIntensity / 100) * (lightingMode === 'both' ? 1.15 : 1.0));

  return (
    <div className="w-full min-h-[calc(100vh-80px)] lg:h-[calc(100vh-80px)] flex flex-col lg:flex-row bg-[#0a0a0a] text-white font-sans lg:overflow-hidden">
      
      {/* 3D Viewport - Left Side */}
      <div className="w-full h-[50vh] lg:h-full lg:flex-1 relative border-b lg:border-b-0 lg:border-r border-white/10 flex-shrink-0">
        <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2.5 shadow-lg">
          <Microscope size={20} className="text-amber-400" />
          <span className="font-bold tracking-widest text-sm uppercase">Stereo Zoom Microscope 3D</span>
          <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
            {totalMagnification}x MAG
          </span>
        </div>
        
        <div className="absolute bottom-4 left-4 z-10 text-xs text-white/40 uppercase tracking-widest pointer-events-none flex items-center gap-2">
          <span>Drag to orbit 3D • Scroll to zoom</span>
        </div>
        
        <Canvas camera={{ position: [5.5, 3.2, 5.5], fov: 42 }}>
          <color attach="background" args={['#0a0a0a']} />
          <ambientLight intensity={0.6} />
          <Environment preset="city" />
          <StereoMicroscope3D 
            focus={coarseFocus} 
            zoom={zoomFactor} 
            lightIntensity={lightIntensity}
            lightingMode={lightingMode}
            stageX={stageX}
            stageY={stageY}
            sampleName={currentSample.name}
            sampleUrl={currentSample.url}
          />
          <ContactShadows position={[0, -2.8, 0]} opacity={0.65} scale={11} blur={2.2} far={4} color="#000000" />
          <OrbitControls makeDefault minDistance={2} maxDistance={15} target={[0, 0.8, 0]} />
        </Canvas>
      </div>

      {/* Controls & Eyepiece - Right Side */}
      <div className="w-full lg:w-[500px] flex flex-col lg:h-full bg-surface lg:overflow-y-auto">
        
        {/* Eyepiece / Slide View Area */}
        <div className="p-6 sm:p-8 flex justify-center bg-black relative shadow-inner overflow-hidden min-h-[330px] sm:min-h-[370px]">
           {/* Top Header Controls in Slide Area */}
           <div className="absolute top-3 left-4 z-10 text-xs font-bold text-white/50 uppercase tracking-widest flex items-center gap-2 pointer-events-none">
              <Search size={14} className="text-amber-400" /> Stereo Eyepiece ({totalMagnification}x)
           </div>

           {/* View Mode Toggle (Binocular Dual vs Single) */}
           <div className="absolute bottom-3 left-4 z-20 flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-lg border border-white/10 text-[11px]">
              <button
                type="button"
                onClick={() => setViewMode('binocular')}
                className={cn(
                  "px-2.5 py-1 rounded font-medium transition-all cursor-pointer",
                  viewMode === 'binocular' ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-white/50 hover:text-white"
                )}
                title="Dual Binocular Stereoscopic View"
              >
                Dual 3D
              </button>
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={cn(
                  "px-2.5 py-1 rounded font-medium transition-all cursor-pointer",
                  viewMode === 'single' ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-white/50 hover:text-white"
                )}
                title="Single Widefield View"
              >
                Wide Field
              </button>
           </div>

           {/* Interactive "i" Dot Button in Slide Area */}
           <button
              onClick={() => setShowMetadata((prev) => !prev)}
              type="button"
              id="slide-info-dot-button"
              className={cn(
                "absolute top-3 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-200 shadow-md cursor-pointer select-none",
                showMetadata
                  ? "bg-amber-400 text-black border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.45)]"
                  : "bg-black/70 hover:bg-black/90 text-white/90 border-white/20 hover:border-amber-400/60 backdrop-blur-md"
              )}
              title={showMetadata ? "Hide Specimen Metadata" : "View Specimen Forensic Metadata"}
              aria-label="Toggle Slide Metadata"
           >
              <span className="relative flex h-2 w-2">
                <span className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                  showMetadata ? "bg-black" : "bg-amber-400"
                )} />
                <span className={cn(
                  "relative inline-flex rounded-full h-2 w-2",
                  showMetadata ? "bg-black" : "bg-amber-400"
                )} />
              </span>
              <Info size={13} className={showMetadata ? "text-black" : "text-amber-400"} />
              <span className="text-[11px] tracking-wide">
                {showMetadata ? "Close Info" : "Slide Info"}
              </span>
           </button>

           {/* Stereoscopic Eyepiece Optical Viewport */}
           {viewMode === 'binocular' ? (
             /* Dual Binocular Eyepiece View */
             <div className="flex items-center justify-center gap-3 relative py-2 select-none pointer-events-none">
                {/* Left Ocular */}
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-[#222] shadow-[0_0_40px_rgba(0,0,0,1),inset_0_0_60px_rgba(0,0,0,0.9)] overflow-hidden relative bg-black flex items-center justify-center">
                  <div 
                    className="w-full h-full absolute transition-all duration-75"
                    style={{
                      backgroundImage: `url(${currentSample.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: `${stageX - 1.5}% ${stageY}%`,
                      filter: `blur(${blurAmount}px) brightness(${brightness}) contrast(1.05)`,
                      transform: `scale(${scaleMultiplier})`
                    }}
                  />
                  {/* Subtle Left Optical Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                    <div className="w-full h-[1px] bg-white absolute" />
                    <div className="h-full w-[1px] bg-white absolute" />
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white/30 uppercase">
                    OS Left
                  </div>
                </div>

                {/* Right Ocular */}
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-[#222] shadow-[0_0_40px_rgba(0,0,0,1),inset_0_0_60px_rgba(0,0,0,0.9)] overflow-hidden relative bg-black flex items-center justify-center">
                  <div 
                    className="w-full h-full absolute transition-all duration-75"
                    style={{
                      backgroundImage: `url(${currentSample.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: `${stageX + 1.5}% ${stageY}%`,
                      filter: `blur(${blurAmount}px) brightness(${brightness}) contrast(1.05)`,
                      transform: `scale(${scaleMultiplier})`
                    }}
                  />
                  {/* Subtle Right Optical Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
                    <div className="w-full h-[1px] bg-white absolute" />
                    <div className="h-full w-[1px] bg-white absolute" />
                  </div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-white/30 uppercase">
                    OD Right
                  </div>
                </div>
             </div>
           ) : (
             /* Single Wide Field Eyepiece View */
             <div 
                className="w-64 h-64 sm:w-80 sm:h-80 rounded-full border-8 border-[#111] shadow-[0_0_50px_rgba(0,0,0,1),inset_0_0_80px_rgba(0,0,0,1)] overflow-hidden relative bg-black flex items-center justify-center pointer-events-none"
             >
                <div 
                  className="w-full h-full absolute transition-all duration-75"
                  style={{
                    backgroundImage: `url(${currentSample.url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: `${stageX}% ${stageY}%`,
                    filter: `blur(${blurAmount}px) brightness(${brightness}) contrast(1.05)`,
                    transform: `scale(${scaleMultiplier})`
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
                  <div className="w-full h-[1px] bg-black absolute" />
                  <div className="h-full w-[1px] bg-black absolute" />
                  <div className="w-16 h-16 rounded-full border border-black absolute" />
                </div>
             </div>
           )}

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
                   className="w-full max-w-sm bg-[#16161a] border border-amber-500/30 rounded-xl p-4 shadow-2xl text-left flex flex-col gap-3 max-h-[92%] overflow-y-auto"
                 >
                   <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-2.5">
                     <div className="space-y-1">
                       <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/25">
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
                         <Search size={12} className="text-amber-400" /> Recommended Stereo Zoom
                       </span>
                       <span className="text-amber-400 font-mono font-bold">{currentSample.recommendedMag}</span>
                     </div>

                     <div className="space-y-1 bg-black/30 p-2.5 rounded-lg border border-white/5">
                       <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-bold flex items-center gap-1">
                         <Info size={11} /> Forensic Significance
                       </span>
                       <p className="text-text-muted leading-relaxed text-[11.5px]">
                         {currentSample.forensicNote}
                       </p>
                     </div>
                   </div>

                   <div className="pt-2 flex items-center justify-between text-[10px] text-white/40 font-mono border-t border-white/10">
                     <span>Specimen ID: {currentSample.id}</span>
                     <span className="text-amber-400 font-semibold">ForenClue Stereo Lab</span>
                   </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Controls Panel */}
        <div className="p-6 space-y-6 flex-1 bg-surface">
           
           {/* Sample Selection */}
           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <label className="text-xs font-black uppercase tracking-widest text-text-muted flex items-center gap-2">
                 <Microscope size={14} className="text-amber-400" /> Specimen Slide
               </label>
               <button
                 onClick={() => setShowMetadata((prev) => !prev)}
                 type="button"
                 className={cn(
                   "flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-md border transition-all cursor-pointer",
                   showMetadata
                     ? "bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold"
                     : "bg-white/5 hover:bg-white/10 text-text-muted hover:text-white border-white/10"
                 )}
                 title="Click to toggle slide forensic information"
               >
                 <Info size={12} className="text-amber-400" />
                 <span>{showMetadata ? 'Hide Details' : 'View Details (i)'}</span>
               </button>
             </div>
             <select 
               className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-amber-400 outline-none transition-all cursor-pointer text-text-main"
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

           {/* Continuous Zoom Controls (0.7x – 4.5x) */}
           <div className="space-y-3">
             <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-text-muted">
               <span className="flex items-center gap-2">
                 <Settings2 size={14} className="text-amber-400" /> Zoom Body Magnification
               </span>
               <span className="font-mono text-amber-400 font-bold text-sm">
                 {zoomFactor.toFixed(1)}x ({totalMagnification}x Total)
               </span>
             </div>

             {/* Preset Zoom Pills */}
             <div className="grid grid-cols-5 gap-2">
               {ZOOM_STEPS.map((z) => (
                 <button
                   key={z}
                   onClick={() => setZoomFactor(z)}
                   className={cn(
                     "py-2 rounded-xl text-xs font-mono font-bold transition-all border cursor-pointer",
                     zoomFactor === z 
                       ? "bg-amber-400 text-black border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]" 
                       : "bg-black/40 border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                   )}
                 >
                   {z}x
                 </button>
               ))}
             </div>

             {/* Smooth Zoom Slider */}
             <input 
               type="range" 
               min="0.7" 
               max="4.5" 
               step="0.1"
               value={zoomFactor}
               onChange={(e) => setZoomFactor(parseFloat(e.target.value))}
               className="w-full accent-amber-400 h-1.5 bg-black/50 rounded-lg appearance-none cursor-pointer"
             />
             <div className="flex justify-between text-[10px] font-mono text-text-muted">
               <span>0.7x (Wide Overview)</span>
               <span>2.5x (Medium)</span>
               <span>4.5x (High Detail)</span>
             </div>
           </div>

           {/* Focus Controls */}
           <div className="space-y-4 pt-2 border-t border-white/5">
             <div className="space-y-2">
               <div className="flex justify-between text-xs font-black uppercase tracking-widest text-text-muted">
                 <span>Coarse Focus (Pod Height)</span>
                 <span className="font-mono text-white/70">{coarseFocus}%</span>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="100" 
                 value={coarseFocus}
                 onChange={(e) => setCoarseFocus(Number(e.target.value))}
                 className="w-full accent-amber-400 h-1.5 bg-black/50 rounded-lg appearance-none cursor-pointer"
               />
             </div>

             <div className="space-y-2">
               <div className="flex justify-between text-xs font-black uppercase tracking-widest text-text-muted">
                 <span>Fine Focal Plane</span>
                 <span className="font-mono text-white/70">{fineFocus}%</span>
               </div>
               <input 
                 type="range" 
                 min="0" 
                 max="100" 
                 value={fineFocus}
                 onChange={(e) => setFineFocus(Number(e.target.value))}
                 className="w-full accent-amber-400 h-1.5 bg-black/50 rounded-lg appearance-none cursor-pointer"
               />
             </div>
           </div>

           {/* Dual Illumination Controls */}
           <div className="space-y-3 pt-2 border-t border-white/5">
             <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-text-muted">
               <span className="flex items-center gap-2">
                 <Lightbulb size={14} className="text-amber-400" /> Illumination Source
               </span>
               <span className="font-mono text-white/70">{lightIntensity}%</span>
             </div>

             {/* Illumination Selector */}
             <div className="grid grid-cols-3 gap-2">
               {[
                 { id: 'incident', label: 'Top LED Ring' },
                 { id: 'transmitted', label: 'Bottom Stage' },
                 { id: 'both', label: 'Dual Light' },
               ].map(m => (
                 <button
                   key={m.id}
                   onClick={() => setLightingMode(m.id as any)}
                   className={cn(
                     "py-1.5 px-2 rounded-lg text-[11px] font-medium border transition-all cursor-pointer",
                     lightingMode === m.id
                       ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                       : "bg-black/30 border-white/10 text-white/60 hover:text-white"
                   )}
                 >
                   {m.label}
                 </button>
               ))}
             </div>

             <input 
               type="range" 
               min="0" 
               max="100" 
               value={lightIntensity}
               onChange={(e) => setLightIntensity(Number(e.target.value))}
               className="w-full accent-amber-400 h-1.5 bg-black/50 rounded-lg appearance-none cursor-pointer"
             />
           </div>

           {/* Mechanical Stage Position Controls */}
           <div className="space-y-4 pt-3 border-t border-white/5">
             <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-text-muted">
               <span className="flex items-center gap-2">
                 <Move size={14} className="text-amber-400" /> Mechanical Stage (X/Y Translation)
               </span>
               <span className="font-mono text-amber-400 font-bold text-[11px]">
                 X: {stageX}% • Y: {stageY}%
               </span>
             </div>

             {/* D-Pad + Quick Steppers */}
             <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-black/40 p-3.5 rounded-xl border border-white/5">
               {/* 2D Directional Nudge Pad */}
               <div className="sm:col-span-5 flex flex-col items-center justify-center gap-1">
                 <button
                   type="button"
                   onClick={() => nudgeStage(0, -5)}
                   className="p-2 rounded-lg bg-black/60 hover:bg-amber-500/20 text-white/70 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer shadow-sm active:scale-95"
                   title="Nudge Forward (Y -5%)"
                 >
                   <ChevronUp size={16} />
                 </button>
                 <div className="flex items-center gap-1">
                   <button
                     type="button"
                     onClick={() => nudgeStage(-5, 0)}
                     className="p-2 rounded-lg bg-black/60 hover:bg-amber-500/20 text-white/70 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer shadow-sm active:scale-95"
                     title="Nudge Left (X -5%)"
                   >
                     <ChevronLeft size={16} />
                   </button>
                   <button
                     type="button"
                     onClick={() => { setStageX(50); setStageY(50); }}
                     className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 transition-all cursor-pointer shadow-sm active:scale-95"
                     title="Center Specimen Slide"
                   >
                     <Crosshair size={16} />
                   </button>
                   <button
                     type="button"
                     onClick={() => nudgeStage(5, 0)}
                     className="p-2 rounded-lg bg-black/60 hover:bg-amber-500/20 text-white/70 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer shadow-sm active:scale-95"
                     title="Nudge Right (X +5%)"
                   >
                     <ChevronRight size={16} />
                   </button>
                 </div>
                 <button
                   type="button"
                   onClick={() => nudgeStage(0, 5)}
                   className="p-2 rounded-lg bg-black/60 hover:bg-amber-500/20 text-white/70 hover:text-amber-300 border border-white/10 hover:border-amber-500/30 transition-all cursor-pointer shadow-sm active:scale-95"
                   title="Nudge Backward (Y +5%)"
                 >
                   <ChevronDown size={16} />
                 </button>
               </div>

               {/* X & Y Axis Precision Sliders */}
               <div className="sm:col-span-7 space-y-2.5">
                 <div className="space-y-1">
                   <div className="flex justify-between text-[11px] font-mono text-white/60">
                     <span>Transverse (X-Axis)</span>
                     <span className="text-amber-400">{stageX.toFixed(0)} mm</span>
                   </div>
                   <input 
                     type="range" 
                     min="0" 
                     max="100" 
                     value={stageX}
                     onChange={(e) => setStageX(Number(e.target.value))}
                     className="w-full accent-amber-400 h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer"
                   />
                 </div>

                 <div className="space-y-1">
                   <div className="flex justify-between text-[11px] font-mono text-white/60">
                     <span>Longitudinal (Y-Axis)</span>
                     <span className="text-amber-400">{stageY.toFixed(0)} mm</span>
                   </div>
                   <input 
                     type="range" 
                     min="0" 
                     max="100" 
                     value={stageY}
                     onChange={(e) => setStageY(Number(e.target.value))}
                     className="w-full accent-amber-400 h-1.5 bg-black/60 rounded-lg appearance-none cursor-pointer"
                   />
                 </div>

                 <button
                   type="button"
                   onClick={() => { setStageX(50); setStageY(50); }}
                   className="w-full py-1 text-[11px] font-mono flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-amber-300 rounded-md border border-white/10 transition-all cursor-pointer"
                 >
                   <RotateCcw size={12} /> Reset to Stage Center
                 </button>
               </div>
             </div>
           </div>

        </div>

      </div>

    </div>
  );
}
