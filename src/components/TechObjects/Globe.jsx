import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import useDisassembleAnimation from '../../hooks/useDisassembleAnimation';

export default function Globe() {
  const { groupRef, animateIn } = useDisassembleAnimation({ stagger: 0.012 });

  const { latLines, lonLines, arcs, dots } = useMemo(() => {
    const lats = [];
    const lons = [];
    const arcList = [];
    const dotList = [];
    const radius = 2;

    // Latitude lines
    for (let i = -3; i <= 3; i++) {
      const phi = (i / 4) * Math.PI * 0.45;
      const r = Math.cos(phi) * radius;
      const y = Math.sin(phi) * radius;
      lats.push({ y, radius: r, key: `lat-${i}` });
    }

    // Longitude lines
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      lons.push({ angle, key: `lon-${i}` });
    }

    // Data arc cities (random points on sphere)
    const cities = [];
    for (let i = 0; i < 12; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      cities.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta),
      });
      dotList.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta),
        ],
        key: `dot-${i}`,
      });
    }

    // Connect some cities with arcs
    for (let i = 0; i < 6; i++) {
      const from = cities[i];
      const to = cities[(i + 3) % cities.length];
      arcList.push({
        from: [from.x, from.y, from.z],
        to: [to.x, to.y, to.z],
        key: `arc-${i}`,
      });
    }

    return { latLines: lats, lonLines: lons, arcs: arcList, dots: dotList };
  }, []);

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  return (
    <group ref={groupRef}>
      {/* Wireframe sphere */}
      <mesh>
        <sphereGeometry args={[2, 24, 24]} />
        <meshStandardMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.12}
          emissive="#00f0ff"
          emissiveIntensity={0.3}
          toneMapped={false}
        />
      </mesh>

      {/* Latitude rings */}
      {latLines.map((lat) => (
        <mesh key={lat.key} position={[0, lat.y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[lat.radius - 0.01, lat.radius + 0.01, 64]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.8}
            transparent
            opacity={0.3}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* City dots */}
      {dots.map((dot) => (
        <mesh key={dot.key} position={dot.position}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color="#e63946"
            emissive="#e63946"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Data arcs */}
      {arcs.map((arc) => {
        const start = new THREE.Vector3(...arc.from);
        const end = new THREE.Vector3(...arc.to);
        const mid = new THREE.Vector3()
          .lerpVectors(start, end, 0.5)
          .normalize()
          .multiplyScalar(3.2);

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(32);

        return (
          <line key={arc.key}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={points.length}
                array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#e63946"
              transparent
              opacity={0.6}
            />
          </line>
        );
      })}
    </group>
  );
}
