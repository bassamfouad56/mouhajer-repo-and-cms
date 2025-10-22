import React from "react";

/**
 * AI Room Redesign Icon
 * A sparkle/magic wand icon with a house, representing AI-powered interior design
 */
function AIRoomDesignSVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      viewBox="0 0 48 48"
      fill="none"
    >
      {/* Gradient definition for modern look */}
      <defs>
        <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle cx="24" cy="24" r="22" fill="url(#aiGradient)" />
      <circle cx="24" cy="24" r="23" fill="none" stroke="#fff" strokeWidth="1" />

      {/* House/Room icon */}
      <path
        d="M24 12L14 20V32C14 33.1 14.9 34 16 34H20V26H28V34H32C33.1 34 34 33.1 34 32V20L24 12Z"
        fill="#ffffff"
        opacity="0.9"
      />

      {/* Sparkle/AI effect - top left */}
      <g opacity="1">
        <path
          d="M12 10L13 12L15 13L13 14L12 16L11 14L9 13L11 12L12 10Z"
          fill="#FFD700"
        />
      </g>

      {/* Sparkle/AI effect - top right */}
      <g opacity="0.9">
        <path
          d="M36 8L37 10L39 11L37 12L36 14L35 12L33 11L35 10L36 8Z"
          fill="#FFD700"
        />
      </g>

      {/* Sparkle/AI effect - bottom right */}
      <g opacity="0.8">
        <path
          d="M38 34L39 36L41 37L39 38L38 40L37 38L35 37L37 36L38 34Z"
          fill="#FFD700"
        />
      </g>

      {/* Small accent sparkle */}
      <circle cx="10" cy="24" r="1.5" fill="#FFD700" opacity="0.7" />
      <circle cx="38" cy="22" r="1.5" fill="#FFD700" opacity="0.6" />
    </svg>
  );
}

export default AIRoomDesignSVG;
