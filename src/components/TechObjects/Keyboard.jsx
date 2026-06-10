import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import useDisassembleAnimation from '../../hooks/useDisassembleAnimation';
import { Edges } from '@react-three/drei';

export default function Keyboard() {
  const { groupRef, animateIn } = useDisassembleAnimation({ stagger: 0.008 });

  const keys = useMemo(() => {
    const items = [];
    const rows = [
      { count: 14, y: 1.2, widths: null },
      { count: 14, y: 0.4, widths: null },
      { count: 13, y: -0.4, widths: null },
      { count: 12, y: -1.2, widths: null },
      { count: 7, y: -2.0, widths: [1, 1, 1, 4, 1, 1, 1] }, // spacebar row
    ];

    const accentKeys = new Set([3, 4, 17, 18, 31, 45]); // WASD, Enter-ish
    const secondaryAccentKeys = new Set([0, 13, 27, 40, 50, 56]); // ESC, Enter, modifiers
    let keyIndex = 0;

    rows.forEach((row) => {
      for (let i = 0; i < row.count; i++) {
        const w = row.widths ? row.widths[i] : 1;
        const xOffset = row.widths
          ? row.widths.slice(0, i).reduce((a, b) => a + b, 0) * 0.7 - 2.5
          : (i - row.count / 2) * 0.7;

        items.push({
          position: [xOffset, row.y * 0.5, Math.random() * 0.1], // Slight random depth for floating feel
          width: w * 0.6,
          isAccent: accentKeys.has(keyIndex),
          isSecondary: secondaryAccentKeys.has(keyIndex),
          key: keyIndex,
        });
        keyIndex++;
      }
    });

    return items;
  }, []);

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  return (
    <group ref={groupRef} rotation={[0.4, -0.3, 0]} position={[0, -0.5, 1]}>
      {/* Hi-Tech Holographic Base plate */}
      <mesh position={[0, -0.3, -0.2]}>
        <boxGeometry args={[7, 3.2, 0.2]} />
        <meshPhysicalMaterial 
          color="#0a0a0f" 
          metalness={0.9} 
          roughness={0.1}
          transmission={0.8}
          thickness={0.5}
          transparent={true}
          opacity={0.7}
        />
        <Edges scale={1.0} threshold={15} color="#00f0ff" />
      </mesh>
      
      {/* Inner Glowing Circuit Board Base */}
      <mesh position={[0, -0.3, -0.1]}>
        <planeGeometry args={[6.8, 3.0]} />
        <meshBasicMaterial color="#00f0ff" wireframe={true} transparent={true} opacity={0.15} />
      </mesh>

      {/* Cyberpunk Keys */}
      {keys.map((k) => (
        <mesh key={k.key} position={k.position}>
          <boxGeometry args={[k.width, 0.45, 0.35]} />
          
          {k.isAccent || k.isSecondary ? (
            // Glowing Keys
            <meshStandardMaterial
              color={k.isAccent ? '#00f0ff' : '#e63946'}
              emissive={k.isAccent ? '#00f0ff' : '#e63946'}
              emissiveIntensity={k.isAccent ? 3 : 2}
              toneMapped={false}
              transparent={true}
              opacity={0.9}
            />
          ) : (
            // Dark Glass Keys
            <meshPhysicalMaterial
              color="#1a1a2e"
              metalness={0.8}
              roughness={0.2}
              transmission={0.9}
              thickness={0.5}
              clearcoat={1}
              transparent={true}
              opacity={0.8}
            />
          )}
          {/* Edge highlights for dark keys */}
          {!k.isAccent && !k.isSecondary && (
            <Edges scale={1.0} threshold={15} color="#3a3a5e" />
          )}
        </mesh>
      ))}
    </group>
  );
}
