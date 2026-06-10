import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import useDisassembleAnimation from '../../hooks/useDisassembleAnimation';

export default function DNAHelix() {
  const { groupRef, animateIn } = useDisassembleAnimation({ stagger: 0.01 });

  const { strand1, strand2, rungs } = useMemo(() => {
    const s1 = [];
    const s2 = [];
    const r = [];
    const points = 40;
    const radius = 1.2;
    const height = 6;

    for (let i = 0; i < points; i++) {
      const t = i / points;
      const y = (t - 0.5) * height;
      const angle = t * Math.PI * 4; // 2 full twists

      // Strand 1
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      s1.push({
        position: [x1, y, z1],
        key: `s1-${i}`,
        isCode: i % 4 === 0,
      });

      // Strand 2 (opposite side)
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      s2.push({
        position: [x2, y, z2],
        key: `s2-${i}`,
        isCode: i % 4 === 2,
      });

      // Connecting rungs every 3 points
      if (i % 3 === 0) {
        const midX = (x1 + x2) / 2;
        const midZ = (z1 + z2) / 2;
        const dir = new THREE.Vector3(x2 - x1, 0, z2 - z1);
        const len = dir.length();

        r.push({
          position: [midX, y, midZ],
          rotation: [0, -Math.atan2(z2 - z1, x2 - x1), 0],
          length: len,
          key: `rung-${i}`,
        });
      }
    }

    return { strand1: s1, strand2: s2, rungs: r };
  }, []);

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  return (
    <group ref={groupRef}>
      {/* Strand 1 */}
      {strand1.map((node) => (
        <mesh key={node.key} position={node.position}>
          <sphereGeometry args={[node.isCode ? 0.14 : 0.1, 10, 10]} />
          <meshStandardMaterial
            color={node.isCode ? '#00f0ff' : '#4a4a8a'}
            emissive={node.isCode ? '#00f0ff' : '#2a2a5a'}
            emissiveIntensity={node.isCode ? 2.5 : 0.5}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Strand 2 */}
      {strand2.map((node) => (
        <mesh key={node.key} position={node.position}>
          <sphereGeometry args={[node.isCode ? 0.14 : 0.1, 10, 10]} />
          <meshStandardMaterial
            color={node.isCode ? '#e63946' : '#4a4a8a'}
            emissive={node.isCode ? '#e63946' : '#2a2a5a'}
            emissiveIntensity={node.isCode ? 2.5 : 0.5}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Connecting rungs */}
      {rungs.map((rung) => (
        <mesh
          key={rung.key}
          position={rung.position}
          rotation={rung.rotation}
        >
          <boxGeometry args={[rung.length, 0.03, 0.03]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#00f0ff"
            emissiveIntensity={0.8}
            transparent
            opacity={0.4}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
