'use client';

import React, { useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useAnimationFrame,
} from 'framer-motion';
import StarSVG from './SVG/StarSVG';

type Props = {
  text?: string;
  blackened?: boolean;
  light?: boolean;
  speed?: number; // 1-10 from CMS, controls base animation speed
};

const AnimatedHeadLine = ({ text = '', blackened = true, light, speed = 5 }: Props) => {
  const baseX = useRef(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Transform scroll velocity to a speed multiplier
  // Faster scrolling = faster animation, slower scrolling = slower animation
  const velocityFactor = useTransform(scrollVelocity, [0, 1000], [0, 5], { clamp: false });

  // Smooth out the velocity changes for natural movement
  const smoothVelocity = useSpring(velocityFactor, {
    damping: 50,
    stiffness: 400,
  });

  // Calculate base speed from CMS setting (1-10 scale)
  // Negative value for left-to-right movement
  const baseVelocity = -0.5 * speed;

  // Apply velocity-based animation
  const x = useTransform(smoothVelocity, (v) => {
    return `${baseX.current + v * 0.1}%`;
  });

  // Continuous animation frame-by-frame
  useAnimationFrame((t, delta) => {
    let moveBy = (baseVelocity / 1000) * delta;

    // Apply velocity multiplier
    const currentVelocity = smoothVelocity.get();
    moveBy += (currentVelocity * moveBy) / 10;

    baseX.current = baseX.current + moveBy;

    // Reset position when it goes too far (creates infinite loop)
    if (baseX.current < -50) {
      baseX.current = 0;
    } else if (baseX.current > 0) {
      baseX.current = -50;
    }
  });

  // Duplicate text content for seamless infinite scroll
  const repeatedContent = (
    <>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-8 shrink-0">
          <StarSVG white={!blackened} xl />
          <h1
            className={`uppercase whitespace-nowrap ${
              !blackened ? 'text-[#202020]' : 'text-[#FFFEF5]'
            } text-[4rem] ${light ? '2xl:text-[5rem]' : '2xl:text-[13rem]'} font-SchnyderS`}
          >
            {text}
          </h1>
        </div>
      ))}
    </>
  );

  return (
    <div className="overflow-hidden py-8">
      <motion.div className="flex items-center gap-0" style={{ x }}>
        {repeatedContent}
      </motion.div>
    </div>
  );
};

export default AnimatedHeadLine;
