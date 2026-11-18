import { Link } from 'react-router-dom';
import { Microscope, Columns3, Beaker, ArrowRight, Eye, BookOpen, CheckCircle2 } from 'lucide-react';
import { SEO } from '@/components/layout/SEO';

const SIMULATIONS = [
  {
    id: 'stereo_microscope',
    title: 'Forensic Stereo Zoom Microscope',
    description: 'Examine surface topology and forensic trace evidence under continuous 3D stereoscopic zoom magnification (0.7x to 4.5x) with dual incident and transmitted illumination.',
    icon: Eye,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    path: '/simulations/stereo-microscope'
  },
  {
    id: 'comparison_microscope',
    title: 'Forensic Comparison Microscope',
    description: 'Perform split-screen side-by-side microscopic comparison of evidence vs control samples including fired bullet striations, cartridge breechface marks, and textile fibers.',
    icon: Columns3,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    path: '/simulations/comparison-microscope'
  },
  {
    id: 'microscope',
    title: 'Virtual Compound Microscope',
    description: 'Explore various microscopic samples using a compound optical system featuring dual-stage magnification (4x, 10x, 40x, 100x objective lenses) in interactive 3D with a complete trichology & diatom lab manual.',
    icon: Microscope,
    color: 'text-info',
    bg: 'bg-info/10',
    path: '/simulations/microscope'
  },
  {
    id: 'spectrophotometer',
    title: 'UV-Vis Spectrophotometer',
    description: 'Perform hands-on virtual experiments to analyze absorbance and concentration of forensic samples using the Beer-Lambert Law, complete with a full analytical chemistry manual.',
    icon: Beaker,
    color: 'text-warning',
    bg: 'bg-warning/10',
    path: '/simulations/spectrophotometer'
  }
];

export default function Simulations() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-14">
      <SEO
        title="Virtual Forensic Science Labs & 3D Instrument Simulators"
        description="Experience interactive 3D forensic laboratory simulations and university lab manuals for Compound Microscopy, Stereo Zoom Microscopy, Ballistic Comparison Microscopy, and UV-Vis Spectrophotometry."
        keywords="virtual forensic lab, 3d microscope simulator, spectrophotometer lab simulation, comparison microscope ballistics, stereo microscope forensics, forenclue simulations"
        canonicalPath="/simulations"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Virtual Laboratory', path: '/simulations' },
        ]}
      />

      <header className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-info font-bold">
          <BookOpen size={15} />
          <span>Interactive 3D Criminalistics &amp; Analytical Instrumentation</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-text-main">
          Virtual <span className="text-info">Laboratory</span>
        </h1>
        <p className="text-text-muted text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Experience hands-on forensic instrumental analysis through our interactive 3D simulations and accompanying university-level Standard Operating Procedure (SOP) manuals. Select an instrument workstation below to begin your practical session.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SIMULATIONS.map((sim) => {
          const Icon = sim.icon;
          return (
            <Link 
              key={sim.id}
              to={sim.path}
              className="bg-surface border border-black/10 dark:border-white/10 rounded-2xl p-8 hover:bg-surface-hover hover:border-warning/40 transition-all group flex flex-col items-start shadow-lg"
            >
              <div className={`p-4 rounded-2xl ${sim.bg} ${sim.color} mb-6 group-hover:scale-110 transition-transform`}>
                <Icon size={36} strokeWidth={1.75} />
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-wider text-text-main mb-3 uppercase">
                {sim.title}
              </h2>
              <p className="text-text-muted leading-relaxed mb-8 flex-1 text-sm md:text-base">
                {sim.description}
              </p>
              <div className={`flex items-center gap-2 font-bold uppercase tracking-widest text-sm ${sim.color} group-hover:gap-4 transition-all`}>
                Start Simulation &amp; Read Lab Manual <ArrowRight size={16} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Educational Overview of Virtual Forensic Instrumentation */}
      <article className="rounded-2xl border border-black/10 dark:border-white/10 bg-surface p-6 sm:p-10 space-y-6">
        <h2 className="text-2xl font-heading font-bold text-text-main">
          Laboratory Methodology &amp; Curriculum Integration
        </h2>
        <p className="text-sm sm:text-base text-text-muted leading-relaxed">
          In university forensic science programs (B.Sc. and M.Sc. Forensic Science) and national competitive examinations (UGC-NET Paper II Code 82 and FACT), practical familiarity with optical and spectroscopic instrumentation is essential. Each ForenClue virtual workstation simulates authentic physical controls—including coarse/fine focal depth-of-field physics, dual-stage optical magnification, cuvette blank zeroing, and monochromator wavelength scanning—paired with comprehensive written laboratory guides covering mathematical principles, ISO/IEC 17025 calibration protocols, and court admissibility criteria.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="flex items-start gap-3 text-sm text-text-main">
            <CheckCircle2 size={18} className="text-info shrink-0 mt-0.5" />
            <span><strong>Optical Microscopy Suite:</strong> Abbe resolution limit, Köhler illumination, trichological Medullary Index, diatom acid digestion, and split-field ballistic striation matching.</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-text-main">
            <CheckCircle2 size={18} className="text-warning shrink-0 mt-0.5" />
            <span><strong>Analytical Spectrophotometry:</strong> Beer-Lambert Law quantitative derivation, Holmium Oxide wavelength verification, CO-oximetry, and questioned ink dye profiling.</span>
          </div>
        </div>
      </article>
    </div>
  );
}
