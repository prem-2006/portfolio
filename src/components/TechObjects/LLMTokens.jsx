import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import useDisassembleAnimation from '../../hooks/useDisassembleAnimation';

export default function LLMTokens() {
  const { groupRef, animateIn } = useDisassembleAnimation({ stagger: 0.01 });
  const particlesRef = useRef([]);

  const particles = useMemo(() => {
    const items = [];
    const tokens = [
      'attention', 'query', 'key', 'value', 'softmax', 'embed',
      'layer', 'norm', 'feed', 'forward', 'token', 'encode',
      'decode', 'head', 'multi', 'mask', 'bias', 'weight',
      'grad', 'loss', 'adam', 'batch', 'epoch', 'dim',
      'seq', 'pos', 'drop', 'relu', 'gelu', 'linear',
    ];

    // Transformer-like shape: two tall columns with connections
    // Left column (encoder)
    for (let i = 0; i < 15; i++) {
      const y = (i - 7) * 0.45;
      const x = -1.5 + Math.sin(i * 0.3) * 0.3;
      items.push({
        position: [x, y, (Math.random() - 0.5) * 0.8],
        text: tokens[i % tokens.length],
        key: i,
        isAccent: i % 5 === 0,
      });
    }

    // Right column (decoder)
    for (let i = 0; i < 15; i++) {
      const y = (i - 7) * 0.45;
      const x = 1.5 + Math.sin(i * 0.3 + Math.PI) * 0.3;
      items.push({
        position: [x, y, (Math.random() - 0.5) * 0.8],
        text: tokens[(i + 15) % tokens.length],
        key: i + 15,
        isAccent: i % 4 === 0,
      });
    }

    // Cross-attention connections (center particles)
    for (let i = 0; i < 10; i++) {
      const y = (i - 4.5) * 0.7;
      items.push({
        position: [0, y, (Math.random() - 0.5) * 0.5],
        text: '→',
        key: i + 30,
        isAccent: true,
      });
    }

    return items;
  }, []);

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  return (
    <group ref={groupRef}>
      {particles.map((p) => (
        <mesh key={p.key} position={p.position}>
          <boxGeometry args={[0.5, 0.2, 0.05]} />
          <meshStandardMaterial
            color={p.isAccent ? '#e63946' : '#1e1e3a'}
            emissive={p.isAccent ? '#e63946' : '#00f0ff'}
            emissiveIntensity={p.isAccent ? 2.5 : 0.6}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
