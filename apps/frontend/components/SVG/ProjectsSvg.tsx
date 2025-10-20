'use client';

import * as React from 'react';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const ProjectsSvg = (props: React.SVGProps<SVGSVGElement>) => {
  const arrowRef = useRef(null);
  const dot1Ref = useRef(null);
  const dot2Ref = useRef(null);
  const dot3Ref = useRef(null);
  const dot4Ref = useRef(null);

  useGSAP(() => {
    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 1,
      defaults: { ease: 'power2.inOut' }
    });

    // Initial state: arrow visible, dots hidden
    gsap.set([dot1Ref.current, dot2Ref.current, dot3Ref.current, dot4Ref.current], {
      opacity: 0,
      scale: 0
    });

    // Animation sequence
    timeline
      // Phase 1: Arrow moves and fades out
      .to(arrowRef.current, {
        x: 10,
        opacity: 0,
        scale: 0.8,
        duration: 0.5
      })
      // Phase 2: Dots appear with stagger
      .to([dot1Ref.current, dot2Ref.current, dot3Ref.current, dot4Ref.current], {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.08
      }, '-=0.2')
      // Phase 3: Hold dots visible
      .to({}, { duration: 1 })
      // Phase 4: Dots fade out
      .to([dot1Ref.current, dot2Ref.current, dot3Ref.current, dot4Ref.current], {
        opacity: 0,
        scale: 0,
        duration: 0.4,
        stagger: 0.08
      })
      // Phase 5: Arrow returns
      .to(arrowRef.current, {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5
      }, '-=0.2');

  }, []);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="62"
      height="62"
      fill="none"
      viewBox="0 0 62 62"
      {...props}
    >
      <circle cx="31" cy="31" r="31" fill="#FFFEF5" />
      <circle cx="31" cy="31" r="30.5" stroke="#fff" strokeOpacity="0.3" />

      {/* Arrow pointing right */}
      <g ref={arrowRef}>
        <path
          d="M23 31 L35 31 M30 26 L35 31 L30 36"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* 4 Dots in grid pattern */}
      <rect ref={dot1Ref} width="4" height="4" x="24" y="24" fill="#000" rx="2" />
      <rect ref={dot2Ref} width="4" height="4" x="35" y="24" fill="#000" rx="2" />
      <rect ref={dot3Ref} width="4" height="4" x="24" y="35" fill="#000" rx="2" />
      <rect ref={dot4Ref} width="4" height="4" x="35" y="35" fill="#000" rx="2" />
    </svg>
  );
};

export default ProjectsSvg;
