import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import useDisassembleAnimation from '../../hooks/useDisassembleAnimation';

export default function CPU() {
  const { groupRef, animateIn } = useDisassembleAnimation({ stagger: 0.006 });

  const { chip, pins, traces } = useMemo(() => {
    const pinList = [];
    const traceList = [];

    // Grid of pins under the chip
    const gridSize = 8;
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const px = (x - (gridSize - 1) / 2) * 0.35;
        const pz = (z - (gridSize - 1) / 2) * 0.35;
        pinList.push({
          position: [px, -0.5, pz],
          key: `pin-${x}-${z}`,
        });
      }
    }

    // Circuit traces radiating outward
    const traceCount = 20;
    for (let i = 0; i < traceCount; i++) {
      const angle = (i / traceCount) * Math.PI * 2;
      const innerR = 1.8;
      const outerR = 3.0 + Math.random() * 0.8;
      const y = 0.15;

      const startX = Math.cos(angle) * innerR;
      const startZ = Math.sin(angle) * innerR;
      const endX = Math.cos(angle) * outerR;
      const endZ = Math.sin(angle) * outerR;

      const midX = (startX + endX) / 2;
      const midZ = (startZ + endZ) / 2;
      const len = Math.sqrt((endX - startX) ** 2 + (endZ - startZ) ** 2);

      traceList.push({
        position: [midX, y, midZ],
        rotation: [0, -angle + Math.PI / 2, 0],
        length: len,
        key: `trace-${i}`,
      });
    }

    return {
      chip: { size: [3, 0.3, 3] },
      pins: pinList,
      traces: traceList,
    };
  }, []);

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  return (
    <group ref={groupRef}>
      {/* Main chip body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={chip.size} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      {/* Chip die (top center) */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.2, 0.05, 1.2]} />
        <meshStandardMaterial
          color="#e63946"
          emissive="#e63946"
          emissiveIntensity={1.5}
          metalness={0.7}
          roughness={0.3}
          toneMapped={false}
        />
      </mesh>
      {/* Pins */}
      {pins.map((pin) => (
        <mesh key={pin.key} position={pin.position}>
          <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
          <meshStandardMaterial
            color="#c0c0c0"
            metalness={0.95}
            roughness={0.1}
          />
        </mesh>
      ))}
      {/* Circuit traces */}
      {traces.map((trace) => (
        <mesh
          key={trace.key}
          position={trace.position}
          rotation={trace.rotation}
        >
          <boxGeometry args={[0.04, 0.02, trace.length]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
