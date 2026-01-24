"use client";

import {
  useRef,
  useMemo,
  useEffect,
  useState,
  Suspense,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  useTexture,
  Text,
  Preload,
  PerformanceMonitor,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { urlForImage } from "@/sanity/lib/image";

// Helper function to safely get image URL
function getImageUrl(image: any): string {
  if (!image) return "/placeholder.jpg";
  try {
    return urlForImage(image).width(800).height(600).url();
  } catch {
    return "/placeholder.jpg";
  }
}

// Types
interface SanityProject {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: any;
  category?: string;
  location?: string;
  year?: string;
  featured?: boolean;
}

interface Immersive3DGridProps {
  projects: SanityProject[];
}

// Physics constants
const PHYSICS = {
  friction: 0.92,
  attraction: 0.08,
  repulsion: 0.15,
  maxVelocity: 0.5,
  mouseInfluence: 3,
  springStiffness: 0.1,
  dampening: 0.85,
};

// Custom shader for holographic effect
const HolographicMaterial = {
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color("#8f7852") },
    opacity: { value: 0.8 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    uniform float opacity;

    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      float scanline = sin(vPosition.y * 50.0 + time * 2.0) * 0.1 + 0.9;
      float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      float glow = fresnel * 0.8 + 0.2;

      vec3 finalColor = color * scanline * glow;
      float alpha = opacity * (fresnel * 0.5 + 0.5);

      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};

// Particle system for ambient effect
function ParticleField() {
  const count = 500;
  const particlesRef = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;

      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return [pos, vel];
  }, [count]);

  useFrame(({ clock }) => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position
      .array as Float32Array;
    const time = clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i * 3] + Math.sin(time + i) * 0.001;
      positions[i * 3 + 1] +=
        velocities[i * 3 + 1] + Math.cos(time + i) * 0.001;
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // Wrap around
      if (Math.abs(positions[i * 3]) > 25) positions[i * 3] *= -0.9;
      if (Math.abs(positions[i * 3 + 1]) > 25) positions[i * 3 + 1] *= -0.9;
      if (Math.abs(positions[i * 3 + 2]) > 25) positions[i * 3 + 2] *= -0.9;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8f7852"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Infinite grid background
function InfiniteGrid() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
      gridRef.current.rotation.z =
        Math.cos(clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  return (
    <group ref={gridRef} position={[0, -5, 0]}>
      <gridHelper
        args={[100, 100, "#333333", "#1a1a1a"]}
        rotation={[0, 0, 0]}
      />
      <gridHelper
        args={[100, 50, "#222222", "#111111"]}
        position={[0, 0.01, 0]}
      />
    </group>
  );
}

// Single project card in 3D space
interface ProjectCard3DProps {
  project: SanityProject;
  index: number;
  totalCount: number;
  mousePosition: THREE.Vector2;
  hoveredIndex: number | null;
  setHoveredIndex: (index: number | null) => void;
  onSelect: (project: SanityProject) => void;
}

function ProjectCard3D({
  project,
  index,
  totalCount,
  mousePosition,
  hoveredIndex,
  setHoveredIndex,
  onSelect,
}: ProjectCard3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const targetPosition = useRef(new THREE.Vector3());

  // Calculate grid position in infinite spiral pattern
  const gridPosition = useMemo(() => {
    const cols = 4;
    const spacing = 5;
    const row = Math.floor(index / cols);
    const col = index % cols;

    // Offset for center alignment
    const offsetX = ((cols - 1) * spacing) / 2;
    const offsetZ = 0;

    // Spiral-like arrangement with depth
    const spiralAngle = index * 0.3;
    const spiralRadius = 2 + index * 0.2;

    return new THREE.Vector3(
      col * spacing - offsetX + Math.sin(spiralAngle) * 0.5,
      Math.sin(index * 0.5) * 0.5,
      row * spacing + offsetZ + Math.cos(spiralAngle) * 0.5,
    );
  }, [index]);

  // Initialize target position
  useEffect(() => {
    targetPosition.current.copy(gridPosition);
  }, [gridPosition]);

  // Load texture
  const imageUrl = project.mainImage
    ? getImageUrl(project.mainImage)
    : "/placeholder.jpg";

  const texture = useTexture(imageUrl);
  texture.colorSpace = THREE.SRGBColorSpace;

  const isHovered = hoveredIndex === index;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;

    const time = clock.getElapsedTime();

    // Calculate mouse influence
    const mouseInfluenceX = mousePosition.x * 2 * PHYSICS.mouseInfluence;
    const mouseInfluenceY = mousePosition.y * 2 * PHYSICS.mouseInfluence;

    // Update target with mouse influence
    targetPosition.current.x = gridPosition.x + mouseInfluenceX * 0.1;
    targetPosition.current.y = gridPosition.y + mouseInfluenceY * 0.1;

    // Spring physics
    const dx = targetPosition.current.x - meshRef.current.position.x;
    const dy = targetPosition.current.y - meshRef.current.position.y;
    const dz = targetPosition.current.z - meshRef.current.position.z;

    velocity.current.x += dx * PHYSICS.springStiffness;
    velocity.current.y += dy * PHYSICS.springStiffness;
    velocity.current.z += dz * PHYSICS.springStiffness;

    // Apply damping
    velocity.current.multiplyScalar(PHYSICS.dampening);

    // Clamp velocity
    velocity.current.clampLength(0, PHYSICS.maxVelocity);

    // Apply velocity
    meshRef.current.position.add(velocity.current);

    // Floating animation
    meshRef.current.position.y += Math.sin(time + index) * 0.002;

    // Rotation based on position
    meshRef.current.rotation.x = Math.sin(time * 0.3 + index) * 0.05;
    meshRef.current.rotation.y = Math.sin(time * 0.2 + index) * 0.05;

    // Scale animation on hover
    const targetScale = isHovered ? 1.15 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1,
    );

    // Glow effect
    if (glowRef.current) {
      glowRef.current.scale.copy(meshRef.current.scale).multiplyScalar(1.05);
      const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial;
      glowMaterial.opacity = isHovered ? 0.3 : 0.1;
    }

    // Z-position on hover
    if (isHovered) {
      meshRef.current.position.z = gridPosition.z - 1;
    }
  });

  return (
    <group>
      {/* Glow plane behind */}
      <mesh
        ref={glowRef}
        position={[gridPosition.x, gridPosition.y, gridPosition.z + 0.1]}
      >
        <planeGeometry args={[3.8, 2.6]} />
        <meshBasicMaterial
          color="#8f7852"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main card */}
      <mesh
        ref={meshRef}
        position={gridPosition}
        onPointerEnter={() => setHoveredIndex(index)}
        onPointerLeave={() => setHoveredIndex(null)}
        onClick={() => onSelect(project)}
      >
        <planeGeometry args={[3.5, 2.4]} />
        <meshStandardMaterial
          ref={materialRef}
          map={texture}
          metalness={0.1}
          roughness={0.4}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Frame */}
      <lineSegments
        position={[gridPosition.x, gridPosition.y, gridPosition.z + 0.01]}
      >
        <edgesGeometry args={[new THREE.PlaneGeometry(3.6, 2.5)]} />
        <lineBasicMaterial
          color={isHovered ? "#8f7852" : "#333333"}
          linewidth={2}
        />
      </lineSegments>

      {/* Title */}
      <Text
        position={[gridPosition.x, gridPosition.y - 1.5, gridPosition.z]}
        fontSize={0.18}
        color={isHovered ? "#8f7852" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
        maxWidth={3}
      >
        {project.title}
      </Text>

      {/* Category badge */}
      {project.category && (
        <Text
          position={[
            gridPosition.x - 1.5,
            gridPosition.y + 1.4,
            gridPosition.z,
          ]}
          fontSize={0.1}
          color="#8f7852"
          anchorX="left"
          anchorY="middle"
        >
          {project.category.toUpperCase()}
        </Text>
      )}
    </group>
  );
}

// Camera controller with physics
function CameraController({ mousePosition }: { mousePosition: THREE.Vector2 }) {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Target camera position based on mouse
    const targetX = mousePosition.x * 3;
    const targetY = mousePosition.y * 2 + 2;

    // Spring physics for camera
    velocity.current.x += (targetX - camera.position.x) * 0.02;
    velocity.current.y += (targetY - camera.position.y) * 0.02;
    velocity.current.multiplyScalar(0.95);

    camera.position.x += velocity.current.x;
    camera.position.y += velocity.current.y;

    // Gentle floating
    camera.position.y += Math.sin(time * 0.5) * 0.01;

    // Look at center with offset
    camera.lookAt(mousePosition.x * 0.5, mousePosition.y * 0.3, 5);
  });

  return null;
}

// Main scene
interface SceneProps {
  projects: SanityProject[];
  mousePosition: THREE.Vector2;
  onSelect: (project: SanityProject) => void;
}

function Scene({ projects, mousePosition, onSelect }: SceneProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      <CameraController mousePosition={mousePosition} />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8f7852" />
      <spotLight
        position={[0, 20, 0]}
        angle={0.5}
        penumbra={1}
        intensity={0.5}
        color="#ffffff"
      />

      {/* Environment */}
      <Environment preset="city" />

      {/* Background elements */}
      <InfiniteGrid />
      <ParticleField />

      {/* Project cards */}
      {projects.map((project, index) => (
        <ProjectCard3D
          key={project._id}
          project={project}
          index={index}
          totalCount={projects.length}
          mousePosition={mousePosition}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
          onSelect={onSelect}
        />
      ))}

      {/* Fog for depth */}
      <fog attach="fog" args={["#0a0a0a", 15, 50]} />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          kernelSize={KernelSize.LARGE}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.3}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.0005, 0.0005)}
        />
        <Vignette darkness={0.5} offset={0.3} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </>
  );
}

// Loading component
function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-neutral-950">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6 h-16 w-16 mx-auto border-2 border-[#8f7852] border-t-transparent rounded-full"
        />
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[#8f7852] font-Satoshi text-sm tracking-[0.3em] uppercase"
        >
          Loading Experience
        </motion.p>
      </div>
    </div>
  );
}

// Selected project overlay
interface ProjectOverlayProps {
  project: SanityProject | null;
  onClose: () => void;
}

function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  if (!project) return null;

  const imageUrl = project.mainImage
    ? getImageUrl(project.mainImage)
    : "/placeholder.jpg";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50, rotateX: -15 }}
          animate={{ scale: 1, y: 0, rotateX: 0 }}
          exit={{ scale: 0.8, y: 50, rotateX: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative container w-full mx-6"
          onClick={(e) => e.stopPropagation()}
          style={{ perspective: "1000px" }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
          >
            <span className="font-Satoshi text-sm tracking-wider">
              CLOSE [ESC]
            </span>
          </button>

          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
            <motion.img
              src={imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              {project.category && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-4"
                >
                  <span className="px-3 py-1 bg-[#8f7852]/20 border border-[#8f7852]/50 text-[#8f7852] font-Satoshi text-xs tracking-wider">
                    {project.category}
                  </span>
                </motion.div>
              )}

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl lg:text-6xl font-SchnyderS font-light text-white mb-4"
              >
                {project.title}
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4 text-white/60 font-Satoshi text-sm mb-6"
              >
                {project.location && <span>{project.location}</span>}
                {project.year && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span>{project.year}</span>
                  </>
                )}
              </motion.div>

              {project.excerpt && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/80 font-Satoshi text-lg max-w-2xl mb-8"
                >
                  {project.excerpt}
                </motion.p>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href={`/projects/${project.slug.current}`}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#8f7852] text-black font-Satoshi text-sm tracking-wider hover:bg-white transition-colors"
                >
                  VIEW PROJECT
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Decorative frame */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-[#8f7852]/50" />
            <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-[#8f7852]/50" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-[#8f7852]/50" />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-[#8f7852]/50" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Main component
export default function Immersive3DGrid({ projects }: Immersive3DGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2(0, 0));
  const [selectedProject, setSelectedProject] = useState<SanityProject | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [dpr, setDpr] = useState(1.5);

  // Mouse movement handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    setMousePosition(new THREE.Vector2(x, y));
  }, []);

  // Keyboard handler for closing overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProject) {
        setSelectedProject(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[100vh] min-h-[800px] bg-neutral-950 overflow-hidden cursor-crosshair"
      onMouseMove={handleMouseMove}
    >
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center"
      >
        <p className="font-Satoshi text-xs tracking-[0.3em] text-white/40 uppercase">
          Move mouse to explore • Click to view project
        </p>
      </motion.div>

      {/* Stats overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-8 z-20"
      >
        <div className="font-Satoshi text-xs tracking-wider text-white/30">
          <span className="text-[#8f7852]">{projects.length}</span> PROJECTS IN
          VIEW
        </div>
      </motion.div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2, 12], fov: 60 }}
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={() => setIsLoading(false)}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(Math.min(2, dpr + 0.5))}
          onDecline={() => setDpr(Math.max(1, dpr - 0.5))}
        >
          <color attach="background" args={["#0a0a0a"]} />
          <Suspense fallback={null}>
            <Scene
              projects={projects}
              mousePosition={mousePosition}
              onSelect={setSelectedProject}
            />
            <Preload all />
          </Suspense>
        </PerformanceMonitor>
      </Canvas>

      {/* Loading screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected project overlay */}
      <ProjectOverlay
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none">
        <div className="absolute top-8 left-8 w-12 h-px bg-gradient-to-r from-[#8f7852] to-transparent" />
        <div className="absolute top-8 left-8 h-12 w-px bg-gradient-to-b from-[#8f7852] to-transparent" />
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none">
        <div className="absolute top-8 right-8 w-12 h-px bg-gradient-to-l from-[#8f7852] to-transparent" />
        <div className="absolute top-8 right-8 h-12 w-px bg-gradient-to-b from-[#8f7852] to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none">
        <div className="absolute bottom-8 left-8 w-12 h-px bg-gradient-to-r from-[#8f7852] to-transparent" />
        <div className="absolute bottom-8 left-8 h-12 w-px bg-gradient-to-t from-[#8f7852] to-transparent" />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none">
        <div className="absolute bottom-8 right-8 w-12 h-px bg-gradient-to-l from-[#8f7852] to-transparent" />
        <div className="absolute bottom-8 right-8 h-12 w-px bg-gradient-to-t from-[#8f7852] to-transparent" />
      </div>
    </div>
  );
}
