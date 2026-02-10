'use client';

import { useEffect, useState } from 'react';

interface AutoGlitchTextProps {
  text: string;
  className?: string;
  glitchInterval?: number; // 闪烁间隔（毫秒），默认 4 秒
  glitchDuration?: number; // 闪烁持续时间（毫秒），默认 300ms
}

export default function AutoGlitchText({
  text,
  className = '',
  glitchInterval = 4000,
  glitchDuration = 400,
}: AutoGlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), glitchDuration);
    }, glitchInterval);

    return () => clearInterval(interval);
  }, [glitchInterval, glitchDuration]);

  return (
    <div className={`auto-glitch-wrapper ${className}`}>
      <div
        className={`auto-glitch ${isGlitching ? 'glitching' : ''}`}
        data-text={text}
      >
        {text}
      </div>
    </div>
  );
}
