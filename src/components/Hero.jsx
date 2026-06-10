import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { TypeAnimation } from 'react-type-animation';

const Scene3D = lazy(() => import('./Scene3D'));

function ParticleDust() {
  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 20}s`,
      animationDuration: `${15 + Math.random() * 15}s`,
      opacity: 0.2 + Math.random() * 0.4,
      size: 1 + Math.random() * 2,
    }));
  }, []);

  return (
    <div className="particle-dust">
      {particles.map((p, i) => (
        <span
          key={i}
          style={{
            left: p.left,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
            opacity: p.opacity,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
}

function useWebGLSupport() {
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') || canvas.getContext('webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

export default function Hero() {
  const webglSupported = useWebGLSupport();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const showCanvas = webglSupported && !isMobile;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Canvas or Fallback Gradient */}
      {showCanvas ? (
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gradient-to-br from-bg via-surface to-bg" />
          }
        >
          <Scene3D />
        </Suspense>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(230,57,70,0.15), transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(0,240,255,0.1), transparent 60%), #0a0a0f',
          }}
        />
      )}

      {/* Particle Dust */}
      <ParticleDust />

      {/* Foreground Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Greeting */}
        <p className="font-mono text-sm md:text-base mb-4 tracking-widest uppercase"
           style={{ color: '#00f0ff' }}>
          Welcome to my world
        </p>

        {/* Main Heading */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          Hi, I&apos;m{' '}
          <span
            className="relative inline-block"
            style={{
              background: 'linear-gradient(135deg, #e63946, #ff6b7a, #e63946)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Prem Singh
          </span>
        </h1>

        {/* Typewriter */}
        <div className="text-xl md:text-2xl lg:text-3xl font-display font-medium mb-10 h-10">
          <TypeAnimation
            sequence={[
              'Software Engineer',
              2000,
              'AI Engineer',
              2000,
              'Full Stack Developer',
              2000,
              'Open Source Contributor',
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            style={{ color: '#8888a0' }}
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#projects" className="btn-primary">
            View Projects
          </a>
          <a href="#contact" className="btn-outline">
            Contact Me
          </a>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #0a0a0f, transparent)',
        }}
      />
    </section>
  );
}
