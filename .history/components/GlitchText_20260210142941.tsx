import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string; // Allow additional styling
}

export default function GlitchText({ text, className = '' }: GlitchTextProps) {
  return (
    <div className={`glitch-wrapper ${className}`}>
      <div
        className="glitch relative font-bold tracking-wider"
        data-text={text}
      >
        {text}
      </div>
    </div>
  );
}
