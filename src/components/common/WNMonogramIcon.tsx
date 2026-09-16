import React from 'react';

interface WNMonogramIconProps {
  className?: string;
  size?: number;
}

export const WNMonogramIcon: React.FC<WNMonogramIconProps> = ({
  className = 'w-10 h-10',
}) => {
  return (
    <div className={`relative ${className} shrink-0 select-none group-hover:scale-105 transition-transform duration-300`}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          <linearGradient id="wn-icon-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F766E" />
            <stop offset="100%" stopColor="#0B534D" />
          </linearGradient>
          <linearGradient id="wn-icon-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D1FAE5" />
          </linearGradient>
          <linearGradient id="wn-border" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0F766E" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Squircle Background Container */}
        <rect
          x="1"
          y="1"
          width="38"
          height="38"
          rx="10"
          fill="url(#wn-icon-bg)"
          stroke="url(#wn-border)"
          strokeWidth="1.5"
        />

        {/* Letter W */}
        <path
          d="M8.5 14L11.8 26L15.2 18.2L18.6 26L21.9 14"
          stroke="url(#wn-icon-stroke)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Letter N */}
        <path
          d="M24.8 26V14L32.2 26V14"
          stroke="url(#wn-icon-stroke)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Career Spark / Modern Accent Node */}
        <circle cx="32.5" cy="11.5" r="1.5" fill="#34D399" />
      </svg>
    </div>
  );
};

export default WNMonogramIcon;
