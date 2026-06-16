import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import useDisassembleAnimation from '../../hooks/useDisassembleAnimation';

// Key unit size
const U = 0.52;
const KEY_GAP = 0.05;
const KEY_HEIGHT = 0.22;

// QWERTY layout: [label, widthInUnits]
const ROWS = [
  [
    ['Esc', 1], ['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1],
    ['7', 1], ['8', 1], ['9', 1], ['0', 1], ['-', 1], ['=', 1], ['⌫', 2],
  ],
  [
    ['Tab', 1.5], ['Q', 1], ['W', 1], ['E', 1], ['R', 1], ['T', 1], ['Y', 1],
    ['U', 1], ['I', 1], ['O', 1], ['P', 1], ['[', 1], [']', 1], ['\\', 1.5],
  ],
  [
    ['Caps', 1.75], ['A', 1], ['S', 1], ['D', 1], ['F', 1], ['G', 1], ['H', 1],
    ['J', 1], ['K', 1], ['L', 1], [';', 1], ["'", 1], ['↵', 2.25],
  ],
  [
    ['⇧', 2.25], ['Z', 1], ['X', 1], ['C', 1], ['V', 1], ['B', 1], ['N', 1],
    ['M', 1], [',', 1], ['.', 1], ['/', 1], ['⇧', 2.75],
  ],
  [
    ['Ctrl', 1.25], ['❖', 1.25], ['Alt', 1.25], ['', 6.25], ['Alt', 1.25],
    ['Fn', 1.25], ['☰', 1.25], ['Ctrl', 1.25],
  ],
];

const WASD_KEYS = new Set(['W', 'A', 'S', 'D']);
const MODIFIER_KEYS = new Set(['Esc', 'Tab', 'Caps', '⇧', 'Ctrl', '❖', 'Alt', 'Fn', '☰', '↵', '⌫']);
const NUMBER_ROW = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);

function getNeonColor(label, rowIdx) {
  if (WASD_KEYS.has(label)) return '#00f0ff';
  if (label === '↵' || label === 'Esc') return '#ff3366';
  if (label === '⌫') return '#ff6b35';
  if (MODIFIER_KEYS.has(label)) return '#8855ff';
  if (NUMBER_ROW.has(label)) return '#00ff88';
  if (rowIdx === 1) return '#00e5ff';
  if (rowIdx === 2) return '#00ffcc';
  if (rowIdx === 3) return '#66bbff';
  return '#4488ff';
}

// Keys are laid out on the XZ plane: width=X, depth=Z, height=Y (sticking up)
function Keycap({ position, width, label, rowIdx }) {
  const keyW = width * U - KEY_GAP;   // X dimension
  const keyD = U - KEY_GAP;            // Z dimension
  const keyH = KEY_HEIGHT;              // Y dimension (sticking up)
  const isWASD = WASD_KEYS.has(label);
  const neonColor = getNeonColor(label, rowIdx);

  return (
    <group position={position}>
      {/* Key body — dark charcoal (visible, not invisible black) */}
      <RoundedBox
        args={[keyW, keyH, keyD]}
        radius={0.025}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={isWASD ? '#151520' : '#121218'}
          metalness={0.1}
          roughness={0.5}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>

      {/* Key top face — slightly lighter so it's visible from above */}
      <RoundedBox
        args={[keyW - 0.06, 0.03, keyD - 0.06]}
        radius={0.012}
        smoothness={4}
        position={[0, keyH / 2 - 0.005, 0]}
      >
        <meshPhysicalMaterial
          color={isWASD ? '#1a1a2a' : '#161620'}
          metalness={0.05}
          roughness={0.4}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </RoundedBox>

      {/* Neon underglow — thin strip at the bottom of the key */}
      <mesh position={[0, -keyH / 2 + 0.01, 0]}>
        <boxGeometry args={[keyW + 0.015, 0.012, keyD + 0.015]} />
        <meshStandardMaterial
          color={neonColor}
          emissive={neonColor}
          emissiveIntensity={isWASD ? 5 : 2.5}
          transparent
          opacity={isWASD ? 0.7 : 0.4}
          toneMapped={false}
        />
      </mesh>

      {/* Neon top edge glow — thin border on top surface edge */}
      <mesh position={[0, keyH / 2 + 0.001, 0]}>
        <boxGeometry args={[keyW - 0.02, 0.004, keyD - 0.02]} />
        <meshStandardMaterial
          color={neonColor}
          emissive={neonColor}
          emissiveIntensity={isWASD ? 3 : 1.2}
          transparent
          opacity={isWASD ? 0.45 : 0.15}
          toneMapped={false}
        />
      </mesh>

      {/* WASD point lights for extra glow */}
      {isWASD && (
        <pointLight
          position={[0, keyH / 2 + 0.08, 0]}
          color={neonColor}
          intensity={0.2}
          distance={0.7}
          decay={2}
        />
      )}
    </group>
  );
}

export default function Keyboard() {
  const { groupRef, animateIn } = useDisassembleAnimation({
    stagger: 0.003,
    duration: 1.5,
    scatterRadius: 8,
  });

  // Keys laid out on XZ plane: X=columns, Z=rows (front to back)
  const keys = useMemo(() => {
    const items = [];
    let keyIndex = 0;
    const totalWidth = ROWS[0].reduce((sum, [, w]) => sum + w, 0) * U;
    const totalRows = ROWS.length;

    ROWS.forEach((row, rowIdx) => {
      let xCursor = -totalWidth / 2;

      row.forEach(([label, widthU]) => {
        const keyW = widthU * U;
        const x = xCursor + keyW / 2;
        // Z goes from negative (back/top row) to positive (front/bottom row)
        const z = (rowIdx - totalRows / 2 + 0.5) * (U + KEY_GAP * 0.5);

        items.push({
          position: [x, 0, z],
          width: widthU,
          label,
          rowIdx,
          key: keyIndex,
        });

        xCursor += keyW;
        keyIndex++;
      });
    });

    return items;
  }, []);

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  const caseWidth = ROWS[0].reduce((sum, [, w]) => sum + w, 0) * U + 0.3;
  const caseDepth = ROWS.length * (U + KEY_GAP * 0.5) + 0.3;
  const caseHeight = 0.25;

  return (
    // Tilt the keyboard toward camera: slight X tilt to see key tops, slight Y rotation
    <group ref={groupRef} rotation={[0.35, -0.25, 0]} position={[0, -0.5, 1]} scale={0.9}>
      {/* Keyboard case — dark aluminum */}
      <RoundedBox
        args={[caseWidth, caseHeight, caseDepth]}
        radius={0.08}
        smoothness={6}
        position={[0, -caseHeight / 2 + 0.02, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#0a0a0e"
          metalness={0.85}
          roughness={0.25}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          envMapIntensity={1.5}
        />
      </RoundedBox>

      {/* Plate surface between keys — slightly reflective to catch neon */}
      <RoundedBox
        args={[caseWidth - 0.12, 0.03, caseDepth - 0.12]}
        radius={0.05}
        smoothness={4}
        position={[0, -0.01, 0]}
      >
        <meshPhysicalMaterial
          color="#08080d"
          metalness={0.6}
          roughness={0.35}
          clearcoat={0.4}
        />
      </RoundedBox>

      {/* Front LED underglow strip */}
      <mesh position={[0, -caseHeight / 2 + 0.02, caseDepth / 2 - 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[caseWidth - 0.2, 0.05]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#00f0ff"
          emissiveIntensity={4}
          transparent
          opacity={0.2}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Rear LED strip */}
      <mesh position={[0, -caseHeight / 2 + 0.02, -caseDepth / 2 + 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[caseWidth - 0.2, 0.04]} />
        <meshStandardMaterial
          color="#8855ff"
          emissive="#8855ff"
          emissiveIntensity={3}
          transparent
          opacity={0.12}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Keycaps */}
      {keys.map((k) => (
        <Keycap
          key={k.key}
          position={k.position}
          width={k.width}
          label={k.label}
          rowIdx={k.rowIdx}
        />
      ))}
    </group>
  );
}
