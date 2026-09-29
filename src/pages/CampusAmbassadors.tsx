import React from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  ShieldCheck, 
  MapPin, 
  Award, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  Users,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/layout/SEO';

interface Ambassador {
  id: string;
  name: string;
  role: string;
  institute: string;
  location: string;
  image: string;
  batch: string;
  status: 'Active' | 'Alumni';
  bio?: string;
  specialization?: string;
  achievements?: string[];
  socialLinks?: {
    linkedin?: string;
    email?: string;
  };
}

const campusAmbassadors: Ambassador[] = [
  {
    id: 'FC-CA-2026-012',
    name: 'Saima Khan',
    role: 'Campus Ambassador',
    institute: 'Vivekananda Global University',
    location: 'Jaipur, Rajasthan',
    batch: '2026 Cohort',
    status: 'Active',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg4klqG43pOkgW8fAlWjt5H1obZD0HBhe3sVc3AyrF5x5PSOLNN4P2t1Hq97Jnmx4K8EWUCyAV3v8sTi7YL7X8TGAcvfVfLDp9JnmJkmm3sENcu1n9WPnw4SLDCppsKMn6EspkyNfpv3VhrpphYr4w6gb9ZCchaQj41YZLamG1SBNOSHhqB8Dm8tZeyIUM/s320/20260308_162315_80fc6c9d-8487-44d1-8ef6-3a24db6e70f5%20-%20Saima%20Khan.jpg',
    specialization: 'Forensic Science & Criminology'
  },
  {
    id: 'FC-CA-2026-010',
    name: 'Ayush Kumar',
    role: 'Campus Ambassador',
    institute: 'Parul University',
    location: 'Vadodara, Gujarat',
    batch: '2026 Cohort',
    status: 'Active',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj9PzcbLcnI5vZBpn7wtepNjVpszBQQUrpyiO3EmdhrtTDgNbqacuWf_UzHvmgX1xzBK821aop57hvLs-O55RPYJe0j7GhmkO_tT6JSFSZ8R4Ar-d2sjsNqRt1_Su3tyiwHNV0JbdymhCbjJreYTwyYHmY-2AoOri2Kw7sKXtmGYoOPE3I7cFGAKl5cqCE/s4032/1000068898%20-%20AYUSH%20KUMAR.jpg',
    specialization: 'Forensic Science'
  },
  {
    id: 'FC-CA-2026-014',
    name: 'Nitin Soni',
    role: 'Campus Ambassador',
    institute: 'Mangalayatan University',
    location: 'Jabalpur, Madhya Pradesh',
    batch: '2026 Cohort',
    status: 'Active',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEimLaHKuA5L3v60DC84e1COxrXI0HMd2VCkfy8zRxvd3ZzLk0uVSJbJHhQyzGNZRUP8Lz_00k1NKU6vPheOiKxugzbmrAeiqc7raJTr9PTdUe_C3rLN_3GrCdzIUAuJN5bS09VvhD_c0j1XOYIkXBJpzce3Yx1sCwwN1u2BGgl8QLbclyqvAqPH5cuDV7A/s8160/IMG_20260630_140509121_HDR%20-%20Nitin%20Soni.jpg',
    specialization: 'Forensic Science'
  },
  {
    id: 'FC-CA-2026-004',
    name: 'Aastha Kumari',
    role: 'Campus Ambassador',
    institute: 'Usha Martin University',
    location: 'Ranchi, Jharkhand',
    batch: '2026 Cohort',
    status: 'Active',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSGONMohRXGtv00RKvOCSDfXR5gS4puptwQXWpmVZVw27hSTOoKd28_etukeDLGQ57hK8xAt40YT-_MslOPFmFia_7j3eMNmCaP8EbAwI0fyRXAxi1aBspneXRFFhtOXPSPV5FfxfVes93f0YHaOon0AcevogUH231CgW3OdAzTh-aVemaEOhiz1AEtZM/s1600/IMG-20260518-WA0035%20-%20Aastha%20tiwari.jpg',
    specialization: 'Forensic Science'
  },
  {
    id: 'FC-CA-2026-015',
    name: 'Anuradha Kesharwani',
    role: 'Campus Ambassador',
    institute: 'Sanskruti University',
    location: 'Ranchi, Jharkhand',
    batch: '2026 Cohort',
    status: 'Active',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgRzAHJyowVofHOO5z_K0aPW95KqLMuoky2bFokkTLICaKEnU1AaDOylzBEh-zBGBLDYb-cSsmfd7XFPgvSBAeWlMe4zZADfdcG5kTIhWHOGWejMGGtEXZVciK88Nai9uJV5T5G7t-KOXgwqKPgllA2IPfP66-krBUUvhdv5Am24zBn_iJxrMkMm8wKI74/s1448/IMG-20260906-WA0030%20-%20Anuradha%20Kesharwani.jpg',
    specialization: 'Forensic Science'
  },
  {
    id: 'FC-CA-2026-016',
    name: 'Monika Singh',
    role: 'Campus Ambassador',
    institute: 'Holkar Science College',
    location: 'Indore, Madhya Pradesh',
    batch: '2026 Cohort',
    status: 'Active',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOhIxz98Xn38HSMVggydpQGrsX5CdMiLXSMx0V0hULkvU38fj1Jh5XBR6y1bmK2LNVBnaFEbFzWMjOvqA84rSVjpn9Vbgr42klimM1i6xDkTNMfxQlYzJwdFJ_0o3egIrGWS8jvugG2bBdR99tueWRXPQKHnRttw0Dx_4yZ-j0_CojTY79rNwsrg1LH5Y/s1920/InShot_20260815_202750842%20-%20Miss%20DIY%20Hacks.jpg',
    specialization: 'Forensic Science'
  },
  {
    id: 'FC-CA-2026-017',
    name: 'Sudhir Chavan',
    role: 'Campus Ambassador',
    institute: 'MGM University',
    location: 'Chhatrapati Sambhajinagar, Maharashtra',
    batch: '2026 Cohort',
    status: 'Active',
    image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjkiHvuW0sofWvboeKVuBYCzIETR1iCtxLz4MzfdWcDS1TnCgCF2gZummMfC36qTNLqWevRG3alM5dlyGvQ56rEbTFHc6h-cac7GOjustIMpq9GW1cKLDMSsqVyhOniD1sU33Ytln4v5jlgfmvwn2UEwg81ATrnUcKyRzKK21KfI-BgtCPw-9WjH_gAEyA/s1800/Sudhir_Chavan%20photo%20%20-%20Sudhir%20Chavan.jpg',
    specialization: 'Forensic Science'
  }
];

const programBenefits = [
  {
    icon: Building2,
    title: 'University Chapter Leadership',
    description: 'Lead the official ForenClue forensic initiatives, organize campus workshops, and coordinate national level forensic events at your college.'
  },
  {
    icon: Award,
    title: 'Verified Credentials & LOR',
    description: 'Receive an official Gold-Tier Verified Ambassador Certificate and exclusive Letters of Recommendation directly from senior forensic examiners.'
  },
  {
    icon: BookOpen,
    title: 'Exclusive Resource Access',
    description: 'Complimentary access to premium forensic webinars, simulation labs, research repositories, and crime scene investigation casebooks.'
  },
  {
    icon: Users,
    title: 'National Professional Network',
    description: 'Connect directly with certified forensic experts, ballistics specialists, digital forensicators, and peer ambassadors across India.'
  }
];

export default function CampusAmbassadors() {
  const ambassadorSchemas = campusAmbassadors.map(amb => ({
    '@type': 'Person',
    '@id': `https://forenclue.in/ambassadors#${amb.id}`,
    'name': amb.name,
    'jobTitle': amb.role,
    'memberOf': {
      '@type': 'Organization',
      '@id': 'https://forenclue.in/#organization',
      'name': 'ForenClue Campus Ambassador Network'
    },
    'image': amb.image,
    'identifier': amb.id,
    'alumniOf': {
      '@type': 'EducationalOrganization',
      'name': amb.institute,
      'address': amb.location
    }
  }));

  return (
    <div className="min-h-screen bg-base relative overflow-hidden">
      <SEO 
        title="Campus Ambassadors | ForenClue University Leadership"
        description="Meet the official ForenClue Campus Ambassadors representing leading universities across India. Driving forensic science innovation, campus workshops, and academic excellence."
        keywords="campus ambassador, forensic science ambassador, Vivekananda Global University, Parul University, Mangalayatan University, Usha Martin University, Sanskruti University, Holkar Science College, MGM University, Sri Sri University, ForenClue student leadership, forensic workshops"
        image="https://blogger.googleusercontent.com/img/a/AVvXsEjnb4ZUOiND0rAIo-I8g9lVtlxNdiwc-uPrdSpWW2sPFQq4kPhDpOFRhEQmH1pnrHnNSRPuwWr0NdkrBka_MjU02zK15VK5-4DHQ01DUzJzLwx-M7-rUs9VEIp1RCYyV-6et12jaC5fleoimYUm1qwRQ-rMtZFH4a4-a_CyDhHsNo414RksWoPwo6cyfjI"
        customSchema={ambassadorSchemas}
      />

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[40rem] z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[15%] w-[30rem] h-[30rem] rounded-full bg-warning/10 blur-[130px]" />
        <div className="absolute top-[30%] right-[15%] w-[25rem] h-[25rem] rounded-full bg-warning/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 pt-6 sm:pt-12">
        
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          {/* Official Badge with Holographic Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative inline-block mx-auto group cursor-default"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-warning/30 to-amber-500/20 rounded-full blur-2xl scale-110 opacity-70 group-hover:scale-125 transition-all duration-700" />
            
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto rounded-full overflow-hidden flex items-center justify-center p-3 bg-surface/70 dark:bg-crust/80 backdrop-blur-md border border-warning/30 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
              {/* Spinning subtle aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-warning/10 via-transparent to-warning/10 animate-spin [animation-duration:18s] pointer-events-none" />
              
              {/* Diagonal shine sweep */}
              <motion.div 
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 z-20 pointer-events-none"
                animate={{ x: ['-150%', '150%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
              />

              <img 
                src="https://blogger.googleusercontent.com/img/a/AVvXsEjnb4ZUOiND0rAIo-I8g9lVtlxNdiwc-uPrdSpWW2sPFQq4kPhDpOFRhEQmH1pnrHnNSRPuwWr0NdkrBka_MjU02zK15VK5-4DHQ01DUzJzLwx-M7-rUs9VEIp1RCYyV-6et12jaC5fleoimYUm1qwRQ-rMtZFH4a4-a_CyDhHsNo414RksWoPwo6cyfjI" 
                alt="ForenClue Official Campus Ambassador Program" 
                className="w-full h-full object-contain relative z-10 select-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <div className="space-y-3">


            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-4xl sm:text-6xl font-heading font-black tracking-tight uppercase text-text-main"
            >
              Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning via-amber-400 to-warning-dark">Ambassadors</span>
            </motion.h1>


          </div>
        </div>

        {/* Ambassador Showcase Grid */}
        <div className="max-w-5xl mx-auto mb-20">
          {campusAmbassadors.length === 0 ? (
            <div className="text-center py-16 bg-surface border border-dashed border-black/10 dark:border-white/10 rounded-3xl p-8">
              <GraduationCap className="w-12 h-12 text-text-muted/40 mx-auto mb-3" />
              <h3 className="text-lg font-heading font-bold text-text-main uppercase">No Ambassadors Found</h3>
              <p className="text-xs text-text-muted font-body mt-1">Registered campus representatives will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {campusAmbassadors.map((amb, idx) => (
                <motion.div
                  key={amb.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-surface border border-black/10 dark:border-white/5 rounded-3xl overflow-hidden hover:border-warning/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),_0_0_35px_rgba(217,119,6,0.15)] transition-all duration-300 shadow-xl flex flex-col group relative"
                >
                  {/* Top Ambient Card Glow */}
                  <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-warning/10 via-warning/5 to-transparent pointer-events-none" />

                  {/* Header / Identity Bar */}
                  <div className="p-6 sm:p-7 relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    {/* Ambassador Profile Image with Dual Glow Rings */}
                    <div className="relative shrink-0">
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-warning/40 bg-base p-1 shadow-xl group-hover:border-warning group-hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all duration-300">
                        <img 
                          src={amb.image} 
                          alt={`${amb.name} - ForenClue Campus Ambassador`} 
                          className="w-full h-full object-cover object-top rounded-xl group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      {/* Verified Badge */}
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-warning to-amber-500 text-base-dark p-1.5 rounded-xl shadow-md border-2 border-surface flex items-center justify-center" title="Verified Campus Ambassador">
                        <ShieldCheck size={16} className="stroke-[2.5]" />
                      </div>
                    </div>

                    {/* Meta & Titles */}
                    <div className="space-y-2 text-center sm:text-left flex-grow">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {amb.status} Ambassador
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-warning/10 border border-warning/20 text-warning text-[10px] font-mono font-bold uppercase">
                          {amb.batch}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-2xl font-heading font-black uppercase text-text-main group-hover:text-warning transition-colors tracking-tight">
                          {amb.name}
                        </h2>
                        <p className="text-xs font-mono text-warning font-bold uppercase tracking-widest mt-0.5">
                          {amb.id}
                        </p>
                      </div>

                      {/* Institute */}
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-text-main font-semibold">
                          <Building2 size={14} className="text-warning shrink-0" />
                          <span>{amb.institute}</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] text-text-muted font-mono">
                          <MapPin size={13} className="text-text-muted/70 shrink-0" />
                          <span>{amb.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-6 sm:px-7 pb-6 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-500 font-bold uppercase">
                      <CheckCircle2 size={12} />
                      Official Credential Verified
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Program Pillars & Benefits Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase text-text-main tracking-tight">
              Why Join The <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning to-warning-dark">Ambassador Network</span>?
            </h2>
            <p className="text-xs sm:text-sm text-text-muted font-body">
              A high-impact leadership opportunity tailored for ambitious university students passionate about forensics, criminology, and scientific investigation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programBenefits.map((benefit, bIdx) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={bIdx}
                  className="bg-surface border border-black/10 dark:border-white/5 rounded-2xl p-6 relative group hover:border-warning/40 transition-all duration-300 shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center text-warning group-hover:scale-110 transition-transform">
                      <Icon size={22} className="stroke-[2.2]" />
                    </div>
                    <h3 className="text-base font-heading font-bold uppercase text-text-main group-hover:text-warning transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-xs text-text-muted font-body leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex items-center text-[10px] font-mono text-warning font-bold uppercase">
                    <span>Active Benefit</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-surface via-surface/90 to-surface border border-warning/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl text-center space-y-6">
            {/* Ambient background illumination */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-warning/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-warning/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
              <span className="px-3.5 py-1 rounded-full bg-warning/10 border border-warning/30 text-warning text-xs font-mono font-bold uppercase tracking-widest inline-block">
                Open Cohort Applications
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase text-text-main tracking-tight">
                Represent ForenClue At Your University
              </h2>
              <p className="text-xs sm:text-sm text-text-muted font-body leading-relaxed">
                Take the initiative to spearhead forensic workshops, guide peers, and build your certified credentials alongside premier forensic experts.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/contact?subject=Campus%20Ambassador%20Application"
                className="px-6 py-3 rounded-xl bg-warning hover:bg-warning-dark text-base-dark font-heading font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-warning/25 transition-all flex items-center gap-2"
              >
                Submit Application <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-xl bg-surface border border-black/10 dark:border-white/10 hover:border-warning/40 text-text-main hover:text-warning font-heading font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors"
              >
                Learn About ForenClue
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
