import { motion } from 'motion/react';

export function IndependenceDayFlag() {
  return (
    <div className="flex items-end shrink-0 ml-4 mb-1 group" title="Happy Independence Day!">
      {/* Flag Pole */}
      <div className="relative flex flex-col items-center z-10">
        {/* Finial (Gold Ball on top) */}
        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-yellow-600 via-yellow-200 to-yellow-500 shadow-sm z-20 -mb-1" />
        {/* Pole */}
        <div className="w-1.5 h-12 bg-gradient-to-r from-gray-500 via-gray-200 to-gray-500 rounded-t-sm shadow-md" />
        {/* Base */}
        <div className="w-4 h-1.5 bg-gradient-to-r from-gray-600 via-gray-300 to-gray-600 rounded-t-md shadow-sm" />
      </div>
      
      {/* Flag Fabric */}
      <motion.div
        className="flex flex-col relative w-16 h-10 origin-left shadow-lg rounded-r-sm overflow-hidden border-y border-r border-black/10 dark:border-white/10 -ml-0.5 mb-1.5"
        animate={{
          rotateY: [0, -20, 0, 15, 0],
          skewY: [0, -3, 0, 3, 0],
          rotateZ: [0, -2, 0, 1, 0]
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ perspective: 800, transformStyle: "preserve-3d" }}
      >
        {/* Silk Ripple / Lighting Overlay */}
        <motion.div 
          className="absolute inset-0 z-20 pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            background: 'linear-gradient(90deg, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.8) 50%, rgba(0,0,0,0.4) 100%)',
            backgroundSize: '200% 100%'
          }}
          animate={{
            backgroundPosition: ["100% 0%", "-100% 0%"]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* India Saffron */}
        <div className="w-full h-1/3 bg-[#FF671F]" />
        
        {/* White + Ashoka Chakra */}
        <div className="w-full h-1/3 bg-[#FFFFFF] flex items-center justify-center relative">
          <motion.div 
            className="w-3 h-3 relative flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            {/* Outer Ring */}
            <div className="absolute inset-0 border-[0.7px] border-[#06038D] rounded-full" />
            {/* Inner Dot */}
            <div className="absolute w-[1.5px] h-[1.5px] bg-[#06038D] rounded-full" />
            {/* 24 Spokes (12 intersecting lines) */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-[0.2px] bg-[#06038D] opacity-90"
                style={{ transform: `rotate(${i * 15}deg)` }}
              />
            ))}
          </motion.div>
        </div>
        
        {/* India Green */}
        <div className="w-full h-1/3 bg-[#046A38]" />
      </motion.div>
    </div>
  );
}
