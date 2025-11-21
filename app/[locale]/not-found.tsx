'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system for 3D effect
    class Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;

      constructor() {
        this.x = Math.random() * canvas!.width - canvas!.width / 2;
        this.y = Math.random() * canvas!.height - canvas!.height / 2;
        this.z = Math.random() * 2000;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.vz = (Math.random() - 0.5) * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        // Reset if too close or far
        if (this.z > 2000 || this.z < 0) {
          this.z = 0;
          this.x = Math.random() * canvas!.width - canvas!.width / 2;
          this.y = Math.random() * canvas!.height - canvas!.height / 2;
        }
      }

      draw() {
        if (!ctx || !canvas) return;

        const scale = 2000 / (2000 + this.z);
        const x2d = this.x * scale + canvas.width / 2;
        const y2d = this.y * scale + canvas.height / 2;
        const size = scale * 2;
        const opacity = 1 - this.z / 2000;

        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < 200; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950">
      {/* 3D Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.6 }}
      />

      {/* Gradient Orbs */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-[100px] animation-delay-2000" />

      {/* Content */}
      <div className="relative z-10 px-6 text-center">
        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="mb-12"
        >
          <div className="perspective-1000">
            <h1 className="text-[200px] font-light leading-none text-white sm:text-[280px] lg:text-[350px]"
                style={{
                  textShadow: '0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.3)',
                  transform: 'rotateX(10deg)',
                  transformStyle: 'preserve-3d',
                }}>
              404
            </h1>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="mb-4 text-4xl font-light tracking-tight text-white sm:text-5xl lg:text-6xl">
            Page Not Found
          </h2>
          <p className="mx-auto max-w-md text-lg font-light leading-relaxed text-neutral-400">
            The page you&apos;re looking for seems to have wandered into another
            dimension. Let&apos;s get you back on track.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-3 border border-white bg-white px-8 py-4 text-sm font-light tracking-widest text-neutral-950 transition-all hover:bg-transparent hover:text-white"
          >
            <Home size={18} />
            <span>GO HOME</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center gap-3 border border-neutral-600 px-8 py-4 text-sm font-light tracking-widest text-neutral-400 transition-all hover:border-white hover:text-white"
          >
            <ArrowLeft size={18} />
            <span>GO BACK</span>
          </button>
        </motion.div>

        {/* Popular Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16"
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neutral-700" />
            <span className="text-xs font-light tracking-[0.3em] text-neutral-500">
              POPULAR PAGES
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-neutral-700" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="/projects"
              className="text-sm font-light tracking-wider text-neutral-400 transition-colors hover:text-white"
            >
              Projects
            </Link>
            <span className="text-neutral-700">•</span>
            <Link
              href="/services"
              className="text-sm font-light tracking-wider text-neutral-400 transition-colors hover:text-white"
            >
              Services
            </Link>
            <span className="text-neutral-700">•</span>
            <Link
              href="/blog"
              className="text-sm font-light tracking-wider text-neutral-400 transition-colors hover:text-white"
            >
              Blog
            </Link>
            <span className="text-neutral-700">•</span>
            <Link
              href="/#contact"
              className="text-sm font-light tracking-wider text-neutral-400 transition-colors hover:text-white"
            >
              Contact
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="h-[600px] w-[600px] rounded-full border border-white/5" />
          <div className="absolute h-[400px] w-[400px] rounded-full border border-white/5" />
          <div className="absolute h-[200px] w-[200px] rounded-full border border-white/10" />
        </motion.div>
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
