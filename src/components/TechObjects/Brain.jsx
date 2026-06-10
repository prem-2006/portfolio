import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import useDisassembleAnimation from '../../hooks/useDisassembleAnimation';

export default function Brain() {
  const { groupRef, animateIn } = useDisassembleAnimation({ stagger: 0.012 });

  const { nodes, connections } = useMemo(() => {
    const nodeList = [];
    const connList = [];

    // Generate brain-shaped node positions using icosahedron + displacement
    const ico = new THREE.IcosahedronGeometry(2, 2);
    const positions = ico.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      let x = positions.getX(i);
      let y = positions.getY(i);
      let z = positions.getZ(i);

      // Organic brain-like displacement
      const noise = Math.sin(x * 2) * Math.cos(y * 1.5) * 0.3;
      x += noise;
      y += Math.sin(z * 2) * 0.2;

      // Slightly elongate horizontally for brain shape
      x *= 1.3;
      y *= 0.9;

      nodeList.push({
        position: [x, y, z],
        key: `node-${i}`,
        size: 0.06 + Math.random() * 0.06,
        isPulse: Math.random() > 0.7,
      });
    }

    // Connect nearby nodes
    for (let i = 0; i < nodeList.length; i++) {
      const posI = new THREE.Vector3(...nodeList[i].position);
      for (let j = i + 1; j < nodeList.length; j++) {
        const posJ = new THREE.Vector3(...nodeList[j].position);
        const dist = posI.distanceTo(posJ);
        if (dist < 1.2 && Math.random() > 0.5) {
          const mid = new THREE.Vector3().lerpVectors(posI, posJ, 0.5);
          const dir = new THREE.Vector3().subVectors(posJ, posI);
          const len = dir.length();

          connList.push({
            position: [mid.x, mid.y, mid.z],
            quaternion: new THREE.Quaternion().setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              dir.normalize()
            ),
            length: len,
            key: `conn-${i}-${j}`,
          });
        }
      }
    }

    ico.dispose();
    return { nodes: nodeList, connections: connList };
  }, []);

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  return (
    <group ref={groupRef}>
      {/* Brain nodes */}
      {nodes.map((node) => (
        <mesh key={node.key} position={node.position}>
          <sphereGeometry args={[node.size, 8, 8]} />
          <meshStandardMaterial
            color={node.isPulse ? '#e63946' : '#8866cc'}
            emissive={node.isPulse ? '#e63946' : '#6644aa'}
            emissiveIntensity={node.isPulse ? 3 : 1}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Connections */}
      {connections.map((conn) => (
        <mesh
          key={conn.key}
          position={conn.position}
          quaternion={conn.quaternion}
        >
          <cylinderGeometry args={[0.01, 0.01, conn.length, 4]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00f0ff"
            emissiveIntensity={0.6}
            transparent
            opacity={0.3}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
