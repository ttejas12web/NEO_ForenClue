import React from 'react';
import { motion } from 'motion/react';

export function MaintenanceBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Subtle Matrix / Forensic Grid Background */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0891b2 1px, transparent 1px),
            linear-gradient(to bottom, #0891b2 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* Radial vignette mask over grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#ffffff_85%)]" />

      {/* 2. Ambient Colorful Glow Spheres */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.04, 0.08, 0.04],
          x: [-20, 20, -20],
          y: [-10, 15, -10]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-cyan-400 rounded-full blur-[140px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.03, 0.06, 0.03],
          x: [15, -15, 15],
          y: [10, -10, 10]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-10 right-1/4 w-[450px] h-[350px] bg-amber-300 rounded-full blur-[130px]"
      />

      {/* 3. Top-Right Planetary Mechanical Gear / Tech Cog */}
      <div className="absolute -top-24 -right-24 md:-top-16 md:-right-16 w-96 h-96 opacity-[0.04] text-cyan-700">
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        >
          {/* Outer Gear Teeth */}
          <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 8" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Gear teeth notches */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <line
              key={deg}
              x1="100"
              y1="12"
              x2="100"
              y2="24"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}

          {/* Internal Cross spokes */}
          <line x1="100" y1="50" x2="100" y2="150" stroke="currentColor" strokeWidth="1" />
          <line x1="50" y1="100" x2="150" y2="100" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.3" />
        </motion.svg>
      </div>

      {/* Interlocking Secondary Counter-Rotating Cog */}
      <div className="absolute top-48 -right-12 md:top-56 md:right-32 w-56 h-56 opacity-[0.03] text-amber-600">
        <motion.svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <rect
              key={deg}
              x="95"
              y="12"
              width="10"
              height="14"
              rx="2"
              fill="currentColor"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}
          <circle cx="100" cy="100" r="28" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        </motion.svg>
      </div>

      {/* 4. Bottom-Left Precision Maintenance Dial & Circuit Gear */}
      <div className="absolute -bottom-28 -left-28 md:-bottom-20 md:-left-20 w-[420px] h-[420px] opacity-[0.035] text-cyan-700">
        <motion.svg
          viewBox="0 0 240 240"
          className="w-full h-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="120" cy="120" r="110" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 6" />
          <circle cx="120" cy="120" r="95" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="120" cy="120" r="75" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="15 8" />

          {/* Precision dial calibration ticks */}
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="120"
              y1="10"
              x2="120"
              y2={i % 3 === 0 ? "24" : "18"}
              stroke="currentColor"
              strokeWidth={i % 3 === 0 ? "2" : "1"}
              transform={`rotate(${i * 15} 120 120)`}
            />
          ))}

          <circle cx="120" cy="120" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="120" cy="120" r="12" fill="currentColor" opacity="0.4" />
        </motion.svg>
      </div>

      {/* Small tertiary gear at bottom-left */}
      <div className="absolute bottom-40 left-32 hidden sm:block w-40 h-40 opacity-[0.025] text-amber-700">
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="1" />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="6"
              x2="50"
              y2="14"
              stroke="currentColor"
              strokeWidth="2"
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
        </motion.svg>
      </div>

      {/* 5. Animated Laser Maintenance Scanning Beam */}
      <motion.div
        className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
        animate={{
          top: ['0%', '100%'],
          opacity: [0, 0.6, 0]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-full h-8 bg-gradient-to-b from-cyan-500/5 to-transparent -translate-y-full" />
      </motion.div>

      {/* 6. Subtle Floating Diagnostic Particles / Sparks */}
      {[
        { left: '15%', delay: 0, duration: 11 },
        { left: '28%', delay: 3, duration: 14 },
        { left: '42%', delay: 1.5, duration: 10 },
        { left: '60%', delay: 4, duration: 13 },
        { left: '75%', delay: 2, duration: 12 },
        { left: '88%', delay: 5, duration: 15 },
        { left: '50%', delay: 6, duration: 9 },
      ].map((p, idx) => (
        <motion.div
          key={idx}
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-500/20 shadow-[0_0_6px_rgba(6,182,212,0.3)]"
          style={{ left: p.left, bottom: '-10px' }}
          animate={{
            y: ['0vh', '-105vh'],
            opacity: [0, 0.7, 0],
            scale: [0.8, 1.4, 0.5]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
        />
      ))}

      {/* 7. Subtle Forensic / Maintenance System Calibration Labels in Background */}
      <div className="absolute top-20 left-6 hidden lg:block opacity-25 font-mono text-[9px] text-cyan-900 tracking-widest leading-loose select-none">
        <div>[SYSTEM_ENGINE: RUNNING_UPGRADE]</div>
        <div>[CORE_CALIBRATION: ACTIVE]</div>
        <div>[SCHEDULED_TARGET: 12:30_IST]</div>
      </div>

      <div className="absolute bottom-20 right-6 hidden lg:block opacity-25 font-mono text-[9px] text-amber-900 tracking-widest leading-loose text-right select-none">
        <div>[FORENSIC_INTEGRITY: 100%]</div>
        <div>[DIAGNOSTICS_CYCLE: SYNCED]</div>
        <div>[LATENCY_CHECK: STABLE]</div>
      </div>

      {/* 8. Micro Reticles & Precision Crosshairs in Corners */}
      <div className="absolute top-1/3 left-12 hidden md:block opacity-25 text-cyan-800 font-mono text-xs select-none">
        +
      </div>
      <div className="absolute top-2/3 right-16 hidden md:block opacity-25 text-cyan-800 font-mono text-xs select-none">
        +
      </div>
      <div className="absolute bottom-1/4 left-1/4 hidden md:block opacity-20 text-amber-800 font-mono text-xs select-none">
        +
      </div>
      <div className="absolute top-1/5 right-1/3 hidden md:block opacity-20 text-cyan-800 font-mono text-xs select-none">
        +
      </div>
    </div>
  );
}
