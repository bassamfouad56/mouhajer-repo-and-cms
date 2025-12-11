'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Award, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import gsap from 'gsap';
import SplitType from 'split-type';
import Link from 'next/link';
import { MagneticButton } from '@/components/magnetic-button';
import { useTranslations } from 'next-intl';

export function HeroVideo() {
  const t = useTranslations('Hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  useEffect(() => {
    if (!titleRef.current || !isLoaded) return;

    const split = new SplitType(titleRef.current, {
      types: 'lines,words',
      tagName: 'span',
    });

    const tl = gsap.timeline({ delay: 0.6 });

    // Animate words with stagger
    tl.fromTo(
      split.words,
      {
        opacity: 0,
        y: 80,
        rotateX: -60,
        transformOrigin: 'center bottom'
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.035,
        duration: 1,
        ease: 'power3.out',
      }
    );

    return () => {
      split.revert();
    };
  }, [isLoaded]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative h-screen min-h-[600px] max-h-[1200px] overflow-hidden bg-neutral-950"
    >
      {/* Video Background */}
      <motion.div
        style={{ scale: videoScale }}
        className="absolute inset-0"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          onLoadedData={() => setIsLoaded(true)}
        >
          <source src="/banner-2s.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/30 to-neutral-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/50 via-transparent to-neutral-950/50" />

        {/* Vignette effect */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }} />
      </motion.div>

      {/* Award Badge - Top Left */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={isLoaded ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="absolute left-4 top-24 z-20 sm:left-6 lg:left-12 lg:top-28"
      >
        <div className="flex items-center gap-2 border border-white/10 px-3 py-1.5 backdrop-blur-md sm:gap-3 sm:px-4 sm:py-2">
          <Award className="h-3 w-3 text-white/60 sm:h-4 sm:w-4" strokeWidth={1} />
          <span className="text-[10px] font-light tracking-wider text-white/60 sm:text-xs">
            {t('badge')}
          </span>
        </div>
      </motion.div>

      {/* Video Controls - Bottom Left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 2.2 }}
        className="absolute bottom-6 left-4 z-20 flex items-center gap-3 sm:bottom-8 sm:left-6 lg:bottom-12 lg:left-12"
      >
        <button
          onClick={toggleVideo}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/60 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 hover:text-white"
          aria-label={isVideoPlaying ? 'Pause video' : 'Play video'}
        >
          {isVideoPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </button>
        <button
          onClick={toggleMute}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/60 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 hover:text-white"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>
      </motion.div>

      {/* Main Content */}
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6 lg:px-12"
      >
        <div className="mx-auto max-w-5xl text-center">
          {/* Main Title */}
          <div className="mb-6 overflow-hidden sm:mb-8" style={{ perspective: '1000px' }}>
            <h1
              ref={titleRef}
              className="font-SchnyderS text-3xl font-light leading-[1.15] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
            >
              {t('titleLine1')}
              <br />
              {t('titleLine2')}
            </h1>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mx-auto mb-8 max-w-2xl px-4 text-sm font-light leading-relaxed text-white/70 sm:mb-12 sm:px-0 sm:text-base lg:text-lg"
          >
            {t('description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
          >
            <MagneticButton strength={0.2}>
              <Link
                href="#contact"
                className="group relative block w-full overflow-hidden bg-white px-8 py-4 text-xs font-medium uppercase tracking-[0.15em] text-neutral-950 transition-all hover:bg-transparent hover:text-white sm:w-auto sm:px-10 sm:py-5 sm:tracking-[0.2em]"
              >
                <span className="relative z-10">{t('ctaPrimary')}</span>
                <div className="absolute inset-0 border-2 border-white" />
                <div className="absolute inset-0 origin-left scale-x-0 bg-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            </MagneticButton>
            <MagneticButton strength={0.15}>
              <Link
                href="/projects"
                className="group flex items-center gap-2 border-b border-white/40 pb-1 text-xs font-light uppercase tracking-[0.15em] text-white/80 transition-all hover:border-white hover:text-white sm:gap-3 sm:tracking-[0.2em]"
              >
                <span>{t('ctaSecondary')}</span>
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator - Bottom Center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isLoaded ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 2 }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 sm:bottom-8 lg:bottom-12"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-light tracking-[0.2em] text-white/50 sm:text-xs">
            {t('scrollDown')}
          </span>
          <ChevronDown className="h-4 w-4 text-white/50" />
        </motion.div>
      </motion.div>

      {/* Decorative corner elements */}
      <div className="absolute left-4 top-4 hidden h-16 w-16 border-l border-t border-white/10 sm:left-6 sm:top-6 lg:left-12 lg:top-28 lg:block lg:h-24 lg:w-24" />
      <div className="absolute bottom-4 right-4 hidden h-16 w-16 border-b border-r border-white/10 sm:bottom-6 sm:right-6 lg:bottom-12 lg:right-12 lg:block lg:h-24 lg:w-24" />
    </section>
  );
}
