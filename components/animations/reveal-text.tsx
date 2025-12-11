'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import SplitType from 'split-type';

interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  animationType?: 'fade' | 'slide' | 'rotate' | 'scale' | 'luxury';
}

export function RevealText({
  children,
  className = '',
  delay = 0,
  stagger = 0.03,
  animationType = 'luxury',
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!ref.current || !isInView || !isReady) return;

    const split = new SplitType(ref.current, {
      types: 'lines,words,chars',
      tagName: 'span',
    });

    const tl = gsap.timeline({ delay });

    switch (animationType) {
      case 'luxury':
        tl.fromTo(
          split.chars,
          {
            opacity: 0,
            y: 100,
            rotateX: -90,
            transformOrigin: 'center bottom',
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            stagger,
            duration: 0.8,
            ease: 'power3.out',
          }
        );
        break;

      case 'slide':
        tl.fromTo(
          split.words,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            stagger,
            duration: 0.6,
            ease: 'power2.out',
          }
        );
        break;

      case 'fade':
        tl.fromTo(
          split.chars,
          { opacity: 0 },
          {
            opacity: 1,
            stagger,
            duration: 0.5,
          }
        );
        break;

      case 'rotate':
        tl.fromTo(
          split.chars,
          {
            opacity: 0,
            rotateY: 90,
            transformOrigin: 'center',
          },
          {
            opacity: 1,
            rotateY: 0,
            stagger,
            duration: 0.6,
            ease: 'back.out(1.5)',
          }
        );
        break;

      case 'scale':
        tl.fromTo(
          split.chars,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            stagger,
            duration: 0.5,
            ease: 'back.out(2)',
          }
        );
        break;
    }

    return () => {
      split.revert();
    };
  }, [isInView, isReady, delay, stagger, animationType]);

  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    <div ref={ref} className={className} style={{ perspective: '1000px' }}>
      {children}
    </div>
  );
}

// Simpler framer-motion based reveal for single words
export function RevealWord({
  children,
  className = '',
  delay = 0,
}: {
  children: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const words = children.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.1,
            ease: 'easeOut',
          }}
          className="inline-block"
          style={{ marginRight: index < words.length - 1 ? '0.25em' : '0' }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
