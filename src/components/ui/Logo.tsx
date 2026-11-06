import { useId } from 'react';
import { cn } from '@/lib/utils';

const FAIRY_BULBS = [
  { cx: 14, cy: 5.5, color: '#FEF08A', glow: '#F59E0B', delay: '0s' },
  { cx: 31, cy: 9.5, color: '#FBBF24', glow: '#EA580C', delay: '0.35s' },
  { cx: 48, cy: 11.2, color: '#FB923C', glow: '#F97316', delay: '0.7s' },
  { cx: 65, cy: 8.8, color: '#FEF08A', glow: '#F59E0B', delay: '1.05s' },
  { cx: 82, cy: 4.5, color: '#FDE047', glow: '#D97706', delay: '0.2s' },
  { cx: 99, cy: 8.8, color: '#FB7185', glow: '#E11D48', delay: '0.85s' },
  { cx: 116, cy: 11.2, color: '#FBBF24', glow: '#EA580C', delay: '0.5s' },
  { cx: 133, cy: 9.5, color: '#FEF08A', glow: '#F59E0B', delay: '1.2s' },
  { cx: 150, cy: 5.5, color: '#FDBA74', glow: '#EA580C', delay: '0.4s' },
  { cx: 167, cy: 9.2, color: '#FDE047', glow: '#F59E0B', delay: '0.95s' },
  { cx: 184, cy: 11.0, color: '#FB923C', glow: '#EA580C', delay: '0.15s' },
  { cx: 201, cy: 6.2, color: '#FEF08A', glow: '#F59E0B', delay: '0.65s' },
];

export function Logo({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  const uid = useId().replace(/:/g, '');

  return (
    <div className={cn('relative inline-flex items-center shrink-0 select-none group/logo', className)}>
      {/* Warm Festive Diwali Golden Backlight Aura */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-2 -inset-y-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-400/20 to-yellow-300/15 blur-md sm:blur-lg animate-diwali-aura"
      />

      {/* Logo Wrapper with Draped Fairy Lights & Twinkling Sparkles */}
      <div className="relative inline-flex items-center">
        {/* Top Draped Diwali Fairy Light Garland (Mobile & Desktop Responsive) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 216 18"
          fill="none"
          preserveAspectRatio="none"
          className="pointer-events-none absolute -top-1.5 sm:-top-2 left-0.5 right-0.5 w-[calc(100%-4px)] h-3 sm:h-3.5 lg:h-4 z-20 overflow-visible"
        >
          <defs>
            <linearGradient id={`wire-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
              <stop offset="25%" stopColor="#FDE047" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#F97316" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#FDE047" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.35" />
            </linearGradient>
            <radialGradient id={`bulbGlow-${uid}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Festoon Golden Draped Cord (3 graceful scallops) */}
          <path
            d="M 4 3.5 Q 43 16.5 82 3.8 Q 116 16.5 150 3.8 Q 180 15.5 210 3.5"
            stroke={`url(#wire-${uid})`}
            strokeWidth="1.15"
            strokeLinecap="round"
            fill="none"
          />

          {/* Delicate Hanging Golden Moti Drops at Festoon Peaks */}
          {[82, 150].map((xPos, idx) => (
            <g key={xPos}>
              <line
                x1={xPos}
                y1="3.8"
                x2={xPos}
                y2="11.5"
                stroke="#FBBF24"
                strokeWidth="0.85"
                strokeOpacity="0.75"
              />
              <circle
                cx={xPos}
                cy="13"
                r="2.6"
                fill={`url(#bulbGlow-${uid})`}
                className="animate-diwali-bulb"
                style={{ animationDelay: idx === 0 ? '0.45s' : '1.1s' }}
              />
              <circle cx={xPos} cy="13" r="1.25" fill="#FEF9C3" />
            </g>
          ))}

          {/* Twinkling Diwali Fairy Bulbs along the Draped Cord */}
          {FAIRY_BULBS.map((bulb, index) => (
            <g
              key={index}
              className="animate-diwali-bulb"
              style={{ animationDelay: bulb.delay }}
            >
              {/* Warm Outer Halo */}
              <circle
                cx={bulb.cx}
                cy={bulb.cy}
                r="4.2"
                fill={bulb.glow}
                fillOpacity="0.28"
              />
              {/* Inner Glowing Bulb */}
              <circle
                cx={bulb.cx}
                cy={bulb.cy}
                r="1.9"
                fill={bulb.color}
              />
              {/* Specular Core */}
              <circle
                cx={bulb.cx}
                cy={bulb.cy}
                r="0.85"
                fill="#FFFFFF"
              />
            </g>
          ))}
        </svg>

        {/* Subtle Corner Festive 4-Point Star Sparkles */}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute -left-1.5 -top-1 w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 z-20 animate-diwali-sparkle"
          style={{ animationDelay: '0.2s' }}
        >
          <path
            fill="currentColor"
            d="M8 0L9.6 6.4L16 8L9.6 9.6L8 16L6.4 9.6L0 8L6.4 6.4L8 0Z"
          />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="pointer-events-none absolute -bottom-1 left-1/3 w-2 h-2 sm:w-2.5 sm:h-2.5 text-yellow-200 z-20 animate-diwali-sparkle"
          style={{ animationDelay: '1.35s' }}
        >
          <path
            fill="currentColor"
            d="M8 0L9.6 6.4L16 8L9.6 9.6L8 16L6.4 9.6L0 8L6.4 6.4L8 0Z"
          />
        </svg>

        {/* Main ForenClue Brand Logo Image with Warm Festive Illumination */}
        <img
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj7yfh9aP-3k7exKSgvW9ynV7lb9j62shvwJrpkiEi_9yiWUSxntW5Poc-MOXQCA0fd635VLo8C35glEPFtlSByqxDDepzEAX6D5T4SzFX-8fyKDIoo7_wV3EXH6u-UDF6P344Q4RRlRFY-qfqITWnuSXa7feb89eDlR9SCODoodogdY89rBez2K7fOiQI/s372/4b5616a4-6069-44a7-ba52-88f965165067.png"
          alt="ForenClue Logo"
          className={cn(
            'relative z-10 h-9.5 xs:h-10.5 sm:h-12 lg:h-14 w-auto object-contain shrink-0 select-none drop-shadow-[0_0_8px_rgba(251,191,36,0.28)] dark:drop-shadow-[0_0_11px_rgba(251,191,36,0.34)]',
            imgClassName
          )}
        />
      </div>

      {/* Aesthetic Illuminated Diwali Diya (Clay Lamp) with Living Flickering Flame */}
      <div
        aria-hidden="true"
        className="relative -ml-0.5 sm:ml-0.5 flex items-end justify-center shrink-0 pointer-events-none z-20"
      >
        {/* Warm Radial Glow Behind the Diya Flame */}
        <span className="absolute -top-1 sm:-top-1.5 w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full bg-amber-400/35 dark:bg-amber-400/45 blur-[6px] sm:blur-[8px] animate-diwali-aura" />

        <svg
          viewBox="0 0 36 38"
          fill="none"
          className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6.5 sm:h-6.5 lg:w-7.5 lg:h-7.5 overflow-visible drop-shadow-[0_2px_6px_rgba(245,158,11,0.5)]"
        >
          <defs>
            <radialGradient id={`flameHalo-${uid}`} cx="50%" cy="55%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#F59E0B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`flameOuter-${uid}`} x1="18" y1="2" x2="18" y2="21" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="55%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <linearGradient id={`flameInner-${uid}`} x1="18" y1="6" x2="18" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#FEF08A" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id={`diyaBody-${uid}`} x1="4" y1="21" x2="32" y2="34" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D97706" />
              <stop offset="48%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#7C2D12" />
            </linearGradient>
            <linearGradient id={`diyaRim-${uid}`} x1="4" y1="21" x2="32" y2="21" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FEF08A" />
            </linearGradient>
          </defs>

          {/* Soft Golden Reflection Pool Under Diya */}
          <ellipse cx="18" cy="34.5" rx="11" ry="2.2" fill="#F59E0B" fillOpacity="0.35" />

          {/* Multi-Layered Flickering Diya Flame */}
          <g className="animate-diwali-flame">
            {/* Ambient Flame Halo */}
            <circle cx="18" cy="12" r="9.5" fill={`url(#flameHalo-${uid})`} />
            {/* Outer Saffron-Orange Teardrop Flame */}
            <path
              d="M18 2.2C18 2.2 11.8 9.6 11.8 14.5C11.8 18.1 14.55 20.8 18 20.8C21.45 20.8 24.2 18.1 24.2 14.5C24.2 9.6 18 2.2 18 2.2Z"
              fill={`url(#flameOuter-${uid})`}
            />
            {/* Inner Golden-Ivory Core Flame */}
            <path
              d="M18 6.4C18 6.4 14.1 11.4 14.1 14.9C14.1 17.2 15.85 19.1 18 19.1C20.15 19.1 21.9 17.2 21.9 14.9C21.9 11.4 18 6.4 18 6.4Z"
              fill={`url(#flameInner-${uid})`}
            />
            {/* Bright White-Gold Wick Tip */}
            <ellipse cx="18" cy="16.6" rx="1.7" ry="2.3" fill="#FFFFFF" fillOpacity="0.92" />
          </g>

          {/* Tiny Floating Spark Dots Above Flame */}
          <circle
            cx="11.5"
            cy="6.5"
            r="1"
            fill="#FEF08A"
            className="animate-diwali-sparkle"
            style={{ animationDelay: '0.3s' }}
          />
          <circle
            cx="25"
            cy="8"
            r="1.15"
            fill="#FDE047"
            className="animate-diwali-sparkle"
            style={{ animationDelay: '1.1s' }}
          />

          {/* Ornate Terracotta & Gold Diya Bowl */}
          <path
            d="M4.5 21.5C7.8 19.6 12.7 20.6 18 20.6C23.3 20.6 28.2 19.6 31.5 21.5C30.4 28.6 25.1 33.2 18 33.2C10.9 33.2 5.6 28.6 4.5 21.5Z"
            fill={`url(#diyaBody-${uid})`}
            stroke={`url(#diyaRim-${uid})`}
            strokeWidth="1.2"
          />

          {/* Decorative Golden Scallop Motif on the Diya Bowl */}
          <path
            d="M7.5 25.2Q10.5 28.2 13.5 25.2Q18 28.8 22.5 25.2Q25.5 28.2 28.5 25.2"
            stroke="#FDE047"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />

          {/* Golden Rim Highlight & Glowing Oil Surface */}
          <path
            d="M5.2 21.5Q18 23.6 30.8 21.5"
            stroke={`url(#diyaRim-${uid})`}
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Festive Gold Jewel Dots on Diya Base */}
          <circle cx="13.5" cy="29.8" r="0.9" fill="#FEF08A" />
          <circle cx="18" cy="30.4" r="1.15" fill="#FEF08A" />
          <circle cx="22.5" cy="29.8" r="0.9" fill="#FEF08A" />
        </svg>
      </div>
    </div>
  );
}
