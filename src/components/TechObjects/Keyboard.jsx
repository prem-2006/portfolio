import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
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

function getGradientColor(x, totalWidth) {
  const t = Math.max(0, Math.min(1, (x + totalWidth / 2) / totalWidth));
  const color = new THREE.Color();
  if (t < 0.33) {
    color.lerpColors(new THREE.Color('#ff4400'), new THREE.Color('#ff00bb'), t / 0.33);
  } else if (t < 0.66) {
    color.lerpColors(new THREE.Color('#ff00bb'), new THREE.Color('#aa00ff'), (t - 0.33) / 0.33);
  } else {
    color.lerpColors(new THREE.Color('#aa00ff'), new THREE.Color('#00eeff'), (t - 0.66) / 0.34);
  }
  return '#' + color.getHexString();
}

function Keycap({ position, width, label, rowIdx, totalWidth }) {
  const keyW = width * U - KEY_GAP;
  const keyD = U - KEY_GAP;
  const keyH = KEY_HEIGHT;
  const neonColor = getGradientColor(position[0], totalWidth);

  return (
    <group position={position}>
      {/* Key body — dark charcoal/black */}
      <RoundedBox
        args={[keyW, keyH, keyD]}
        radius={0.025}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#0d0d12"
          metalness={0.2}
          roughness={0.6}
          clearcoat={0.3}
        />
      </RoundedBox>

      {/* Key top face — slightly lighter to differentiate */}
      <RoundedBox
        args={[keyW - 0.06, 0.03, keyD - 0.06]}
        radius={0.012}
        smoothness={4}
        position={[0, keyH / 2 - 0.005, 0]}
      >
        <meshPhysicalMaterial
          color="#15151a"
          metalness={0.1}
          roughness={0.5}
          clearcoat={0.5}
        />
      </RoundedBox>

      {/* Neon underglow — below the key */}
      <mesh position={[0, -keyH / 2 + 0.01, 0]}>
        <boxGeometry args={[keyW + 0.015, 0.012, keyD + 0.015]} />
        <meshStandardMaterial
          color={neonColor}
          emissive={neonColor}
          emissiveIntensity={4}
          transparent
          opacity={0.7}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function Keyboard() {
  const { groupRef, animateIn } = useDisassembleAnimation({
    stagger: 0.003,
    duration: 1.5,
    scatterRadius: 8,
  });

  const wrapperRef = useRef();

  useFrame((state, delta) => {
    if (wrapperRef.current) {
      wrapperRef.current.rotation.y += delta * 0.4;
    }
  });

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
        const z = (rowIdx - totalRows / 2 + 0.5) * (U + KEY_GAP * 0.5);

        items.push({
          position: [x, 0, z],
          width: widthU,
          label,
          rowIdx,
          key: keyIndex,
          totalWidth,
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

  const caseWidth = ROWS[0].reduce((sum, [, w]) => sum + w, 0) * U + 0.4;
  const caseDepth = ROWS.length * (U + KEY_GAP * 0.5) + 0.4;
  const caseHeight = 0.3;

  return (
    <group ref={wrapperRef} position={[0, -0.5, 1]} scale={0.9}>
      <group ref={groupRef} rotation={[0.35, -0.25, 0]}>
        {/* Keyboard case — Transparent Acrylic */}
        <RoundedBox
          args={[caseWidth, caseHeight, caseDepth]}
          radius={0.1}
          smoothness={6}
          position={[0, -caseHeight / 2 + 0.02, 0]}
          castShadow
          receiveShadow
        >
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.95}
            opacity={1}
            metalness={0.1}
            roughness={0.05}
            ior={1.5}
            thickness={0.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
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
            color="#ffffff"
            transmission={0.9}
            roughness={0.1}
            thickness={0.1}
          />
        </RoundedBox>

        {/* RGB Point Lights inside the acrylic base */}
        <pointLight position={[-caseWidth / 3, -caseHeight / 2, 0]} color="#ff4400" intensity={4} distance={caseWidth} />
        <pointLight position={[0, -caseHeight / 2, 0]} color="#ff00bb" intensity={4} distance={caseWidth} />
        <pointLight position={[caseWidth / 3, -caseHeight / 2, 0]} color="#00eeff" intensity={4} distance={caseWidth} />

        {/* Keycaps */}
        {keys.map((k) => (
          <Keycap
            key={k.key}
            position={k.position}
            width={k.width}
            label={k.label}
            rowIdx={k.rowIdx}
            totalWidth={k.totalWidth}
          />
        ))}
      </group>
    </group>
  );
}
