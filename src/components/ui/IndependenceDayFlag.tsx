import { motion } from 'motion/react';

export function IndependenceDayFlag() {
  return (
    <div className="flex items-end shrink-0 ml-3 md:ml-4 pb-2" title="Happy Independence Day!">
      {/* Flag Pole */}
      <div className="w-1 h-10 bg-gradient-to-b from-gray-300 to-gray-500 rounded-full relative z-10" />
      
      {/* Flag */}
      <motion.div
        className="flex flex-col relative w-10 origin-left"
        animate={{
          rotateY: [0, 15, -15, 0],
          skewY: [0, 2, -2, 0],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ perspective: 1000 }}
      >
        <div className="w-full h-2.5 bg-[#FF9933] rounded-tr-sm shadow-sm" />
        <div className="w-full h-2.5 bg-white flex items-center justify-center relative shadow-sm">
          {/* Ashoka Chakra */}
          <motion.div 
            className="w-2 h-2 border-[0.5px] border-[#000080] rounded-full flex items-center justify-center relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute w-[0.5px] h-full bg-[#000080]/40"></div>
            <div className="absolute w-full h-[0.5px] bg-[#000080]/40"></div>
            <div className="absolute w-[0.5px] h-full bg-[#000080]/40 rotate-45"></div>
            <div className="absolute w-full h-[0.5px] bg-[#000080]/40 rotate-45"></div>
          </motion.div>
        </div>
        <div className="w-full h-2.5 bg-[#138808] rounded-br-sm shadow-sm" />
      </motion.div>
    </div>
  );
}
