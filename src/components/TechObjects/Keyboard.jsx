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

function getKeyColors(label) {
  if (label === 'Esc') return { body: '#c45555', top: '#d46565' }; // retro red esc
  if (label === '↵') return { body: '#5588c4', top: '#6598d4' }; // retro blue enter
  if (MODIFIER_KEYS.has(label)) return { body: '#b0afa4', top: '#c0bfb4' };
  return { body: '#dbdad3', top: '#ebeae3' }; // Alphanumeric
}

// Keys are laid out on the XZ plane: width=X, depth=Z, height=Y (sticking up)
function Keycap({ position, width, label, rowIdx }) {
  const keyW = width * U - KEY_GAP;   // X dimension
  const keyD = U - KEY_GAP;            // Z dimension
  const keyH = KEY_HEIGHT;              // Y dimension (sticking up)
  const colors = getKeyColors(label);

  return (
    <group position={position}>
      {/* Key body — classic beige/gray */}
      <RoundedBox
        args={[keyW, keyH, keyD]}
        radius={0.025}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color={colors.body}
          metalness={0.1}
          roughness={0.7}
          clearcoat={0.1}
        />
      </RoundedBox>

      {/* Key top face — lighter so it's visible from above */}
      <RoundedBox
        args={[keyW - 0.06, 0.03, keyD - 0.06]}
        radius={0.012}
        smoothness={4}
        position={[0, keyH / 2 - 0.005, 0]}
      >
        <meshPhysicalMaterial
          color={colors.top}
          metalness={0.05}
          roughness={0.6}
          clearcoat={0.1}
        />
      </RoundedBox>
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
      {/* Keyboard case — classic beige plastic */}
      <RoundedBox
        args={[caseWidth, caseHeight, caseDepth]}
        radius={0.08}
        smoothness={6}
        position={[0, -caseHeight / 2 + 0.02, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#dcdbd1"
          metalness={0.1}
          roughness={0.8}
          clearcoat={0.1}
        />
      </RoundedBox>

      {/* Plate surface between keys */}
      <RoundedBox
        args={[caseWidth - 0.12, 0.03, caseDepth - 0.12]}
        radius={0.05}
        smoothness={4}
        position={[0, -0.01, 0]}
      >
        <meshPhysicalMaterial
          color="#a0a09a"
          metalness={0.3}
          roughness={0.6}
        />
      </RoundedBox>

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
