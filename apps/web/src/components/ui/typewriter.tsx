'use client';

import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

interface TypewriterProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

interface AnimatedSpanProps {
  visible: boolean;
}

const AnimatedSpan = styled('span')<AnimatedSpanProps>`
  transition: opacity 0.2s;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
`;

export function Typewriter({ 
  text, 
  delay = 50, 
  className = '', 
  onComplete 
}: TypewriterProps) {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, delay, text, onComplete]);

  return (
    <AnimatedSpan 
      className={className}
      visible={currentText.length > 0}
    >
      {currentText}
    </AnimatedSpan>
  );
}
