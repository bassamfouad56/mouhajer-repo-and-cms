'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        mouseX.set(x * 50);
        mouseY.set(y * 50);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // 3D Particle Animation
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      alpha: number;
    }

    const particles: Particle[] = [];
    const particleCount = 100;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 5,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        // Update position with 3D depth
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Create depth perspective
        const scale = 300 / (300 + particle.z);
        const x2d = canvas.width / 2 + (particle.x - canvas.width / 2) * scale;
        const y2d = canvas.height / 2 + (particle.y - canvas.height / 2) * scale;
        const size = particle.size * scale;

        // Wrap around
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.z < -500) particle.z = 1000;
        if (particle.z > 1000) particle.z = -500;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 2);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.alpha * scale})`);
        gradient.addColorStop(0.5, `rgba(200, 200, 255, ${particle.alpha * scale * 0.5})`);
        gradient.addColorStop(1, 'rgba(150, 150, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        particles.forEach((otherParticle, j) => {
          if (i === j) return;
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const dz = particle.z - otherParticle.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance < 150) {
            const otherScale = 300 / (300 + otherParticle.z);
            const ox2d = canvas.width / 2 + (otherParticle.x - canvas.width / 2) * otherScale;
            const oy2d = canvas.height / 2 + (otherParticle.y - canvas.height / 2) * otherScale;

            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x2d, y2d);
            ctx.lineTo(ox2d, oy2d);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950"
    >
      {/* 3D Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      />

      {/* Gradient Orbs */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl"
      />
      <motion.div
        style={{ x: springX.get() * -1, y: springY.get() * -1 }}
        className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-pink-500/20 to-orange-500/20 blur-3xl"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: [0.6, 0.01, 0.05, 0.95] }}
          className="mb-8"
        >
          <motion.h1
            style={{ x: springX, y: springY }}
            className="relative text-[12rem] font-light leading-none tracking-tighter text-transparent lg:text-[16rem]"
          >
            <span className="absolute inset-0 bg-gradient-to-br from-white via-neutral-300 to-neutral-500 bg-clip-text blur-sm">
              404
            </span>
            <span className="relative bg-gradient-to-br from-white via-neutral-200 to-neutral-400 bg-clip-text">
              404
            </span>

            {/* Floating sparkles */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -right-8 top-8 text-white/40"
            >
              <Sparkles className="h-12 w-12" />
            </motion.div>
            <motion.div
              animate={{
                y: [0, -15, 0],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 1,
              }}
              className="absolute -left-8 bottom-8 text-white/40"
            >
              <Sparkles className="h-10 w-10" />
            </motion.div>
          </motion.h1>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="mb-4 text-4xl font-light tracking-tight text-white lg:text-5xl">
            Page Not Found
          </h2>
          <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-400">
            The page you&apos;re looking for seems to have wandered off into the design cosmos.
            Don&apos;t worry, we&apos;ll help you find your way back to something extraordinary.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 overflow-hidden border-2 border-white px-8 py-4 text-sm font-light tracking-widest text-white transition-all hover:text-neutral-950"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Home className="h-4 w-4" />
              GO HOME
            </span>
            <div className="absolute inset-0 -translate-x-full bg-white transition-transform duration-300 group-hover:translate-x-0" />
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group relative inline-flex items-center gap-3 overflow-hidden border-2 border-white/40 px-8 py-4 text-sm font-light tracking-widest text-white/80 transition-all hover:border-white hover:text-neutral-950"
          >
            <span className="relative z-10 flex items-center gap-3">
              <ArrowLeft className="h-4 w-4" />
              GO BACK
            </span>
            <div className="absolute inset-0 -translate-x-full bg-white transition-transform duration-300 group-hover:translate-x-0" />
          </button>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 text-xs font-light tracking-widest text-neutral-600"
        >
          ERROR CODE: 404 | MOUHAJER DESIGN STUDIO
        </motion.div>
      </div>

      {/* Animated Grid */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </div>
  );
}
