import React from 'react';

interface MiloraLogoProps {
  className?: string;
  color?: string;
  subtextColor?: string;
  showSubtitle?: boolean;
}

export const MiloraLogo: React.FC<MiloraLogoProps> = ({
  className = 'h-10 w-auto',
  color = '#4A5D43',
  subtextColor,
  showSubtitle = true,
}) => {
  const effectiveSubtextColor = subtextColor || color;

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox={showSubtitle ? '0 0 520 180' : '0 0 520 120'}
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Milora Gold & Diamonds"
      >
        {/* MILORA Brand Mark */}
        <g fill={color}>
          {/* M */}
          <path d="M 20 100 L 20 30 L 34 30 L 68 76 L 102 30 L 116 30 L 116 100 L 98 100 L 98 56 L 75 88 L 61 88 L 38 56 L 38 100 Z" />
          
          {/* I */}
          <rect x="136" y="30" width="18" height="70" />
          
          {/* L */}
          <path d="M 174 30 L 192 30 L 192 84 L 230 84 L 230 100 L 174 100 Z" />
          
          {/* Macron above O */}
          <rect x="268" y="10" width="64" height="11" rx="2" />
          
          {/* Distinctive Wide Oval Ō */}
          <path
            fillRule="evenodd"
            d="M 300 28 C 342 28 376 44 376 65 C 376 86 342 102 300 102 C 258 102 224 86 224 65 C 224 44 258 28 300 28 Z M 300 45 C 272 45 248 54 248 65 C 248 76 272 85 300 85 C 328 85 352 76 352 65 C 352 54 328 45 300 45 Z"
          />
          
          {/* R */}
          <path d="M 396 30 L 436 30 C 452 30 464 40 464 54 C 464 65 456 73 444 76 L 468 100 L 445 100 L 424 78 L 414 78 L 414 100 L 396 100 Z M 414 45 L 414 64 L 433 64 C 441 64 446 60 446 54.5 C 446 49 441 45 433 45 Z" />
          
          {/* A */}
          <path d="M 482 30 L 500 30 L 530 100 L 510 100 L 504 84 L 478 84 L 472 100 L 452 100 Z M 491 49 L 483 71 L 499 71 Z" />
        </g>

        {/* GOLD & DIAMONDS Subtitle */}
        {showSubtitle && (
          <text
            x="260"
            y="152"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
            fontSize="25"
            fontWeight="600"
            letterSpacing="0.32em"
            fill={effectiveSubtextColor}
          >
            GOLD &amp; DIAMONDS
          </text>
        )}
      </svg>
    </div>
  );
};
