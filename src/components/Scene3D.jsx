import { Suspense, useRef, lazy } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import useRandomObject from '../hooks/useRandomObject';

// Lazy load each tech object
import Keyboard from './TechObjects/Keyboard';
const NeuralNet = lazy(() => import('./TechObjects/NeuralNet'));
const LLMTokens = lazy(() => import('./TechObjects/LLMTokens'));
const CPU = lazy(() => import('./TechObjects/CPU'));
const Globe = lazy(() => import('./TechObjects/Globe'));
const DNAHelix = lazy(() => import('./TechObjects/DNAHelix'));
const Brain = lazy(() => import('./TechObjects/Brain'));

const OBJECTS = [Keyboard, NeuralNet, LLMTokens, CPU, Globe, DNAHelix, Brain];

function MouseParallax({ children }) {
  const groupRef = useRef();
  const { pointer } = useThree();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y +=
        (pointer.x * 0.3 - groupRef.current.rotation.y) * 0.02;
      groupRef.current.rotation.x +=
        (-pointer.y * 0.2 - groupRef.current.rotation.x) * 0.02;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function Scene3D() {
  // Always select the Keyboard object as requested
  const SelectedObject = Keyboard;

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -3, 3]} intensity={0.5} color="#00f0ff" />
      <pointLight position={[3, -5, -5]} intensity={0.3} color="#e63946" />
      <fog attach="fog" args={['#0a0a0f', 8, 20]} />

      {/* 3D Object with mouse parallax */}
      <Suspense fallback={null}>
        <MouseParallax>
          <SelectedObject />
        </MouseParallax>
      </Suspense>

      {/* Post-processing */}
      {!prefersReducedMotion && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={1}
            luminanceSmoothing={0.9}
            mipmapBlur
            intensity={1.5}
            radius={0.8}
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
