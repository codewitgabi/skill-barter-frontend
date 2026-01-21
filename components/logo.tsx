"use client";

interface LogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export default function Logo({
  className = "",
  size = 60,
  animated = true,
}: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="25 25 70 70"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for the logo elements */}
        <linearGradient id="skillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="1">
            {animated && (
              <animate
                attributeName="stop-color"
                values="#10b981;#3b82f6;#8b5cf6;#ec4899;#f59e0b;#10b981"
                dur="4s"
                repeatCount="indefinite"
              />
            )}
          </stop>
          <stop offset="50%" stopColor="#3b82f6" stopOpacity="1">
            {animated && (
              <animate
                attributeName="stop-color"
                values="#3b82f6;#8b5cf6;#ec4899;#f59e0b;#10b981;#3b82f6"
                dur="4s"
                repeatCount="indefinite"
              />
            )}
          </stop>
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1">
            {animated && (
              <animate
                attributeName="stop-color"
                values="#8b5cf6;#ec4899;#f59e0b;#10b981;#3b82f6;#8b5cf6"
                dur="4s"
                repeatCount="indefinite"
              />
            )}
          </stop>
        </linearGradient>

        {/* Radial gradient for glow effect */}
        <radialGradient id="glowGradient" cx="50%" cy="50%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>

        {/* Filter for glow */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background circle with subtle animation */}
      <circle cx="60" cy="60" r="32" fill="url(#glowGradient)" opacity="0.2">
        {animated && (
          <animate
            attributeName="r"
            values="32;34;32"
            dur="3s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Central hub/circle */}
      <circle
        cx="60"
        cy="60"
        r="15"
        fill="url(#skillGradient)"
        filter="url(#glow)"
      >
        {animated && (
          <animate
            attributeName="r"
            values="15;17;15"
            dur="2s"
            repeatCount="indefinite"
          />
        )}
      </circle>

      {/* Rotating ring around center */}
      {animated && (
        <circle
          cx="60"
          cy="60"
          r="30"
          fill="none"
          stroke="url(#skillGradient)"
          strokeWidth="1.5"
          strokeDasharray="5 3"
          opacity="0.6"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* "SB" monogram in center */}
      <g transform="translate(60, 60)">
        <text
          x="0"
          y="5"
          textAnchor="middle"
          fontSize="17"
          fontWeight="700"
          fill="white"
          fontFamily="system-ui, -apple-system, sans-serif"
          opacity="0.95"
        >
          SB
        </text>
      </g>
    </svg>
  );
}
