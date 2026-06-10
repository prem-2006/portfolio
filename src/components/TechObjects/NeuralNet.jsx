import { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import useDisassembleAnimation from '../../hooks/useDisassembleAnimation';

export default function NeuralNet() {
  const { groupRef, animateIn } = useDisassembleAnimation({ stagger: 0.015 });

  const { nodes, edges } = useMemo(() => {
    const nodeList = [];
    const edgeList = [];

    // Create layers of nodes (input → hidden → output)
    const layers = [
      { count: 5, x: -3 },
      { count: 7, x: -1 },
      { count: 8, x: 0.5 },
      { count: 6, x: 2 },
      { count: 3, x: 3.5 },
    ];

    let nodeIndex = 0;
    const layerNodes = [];

    layers.forEach((layer) => {
      const currentLayer = [];
      for (let i = 0; i < layer.count; i++) {
        const y = (i - (layer.count - 1) / 2) * 0.8;
        const z = (Math.random() - 0.5) * 1.5;
        const pos = [layer.x, y, z];
        const isPulse = Math.random() > 0.6;
        nodeList.push({ position: pos, key: nodeIndex, isPulse });
        currentLayer.push({ pos, index: nodeIndex });
        nodeIndex++;
      }
      layerNodes.push(currentLayer);
    });

    // Connect adjacent layers
    for (let l = 0; l < layerNodes.length - 1; l++) {
      layerNodes[l].forEach((fromNode) => {
        // Connect to random subset of next layer
        const nextLayer = layerNodes[l + 1];
        const connectionCount = Math.min(3, nextLayer.length);
        const shuffled = [...nextLayer].sort(() => Math.random() - 0.5);
        for (let c = 0; c < connectionCount; c++) {
          edgeList.push({
            from: fromNode.pos,
            to: shuffled[c].pos,
            key: `${fromNode.index}-${shuffled[c].index}`,
          });
        }
      });
    }

    return { nodes: nodeList, edges: edgeList };
  }, []);

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((node) => (
        <mesh key={node.key} position={node.position}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial
            color={node.isPulse ? '#e63946' : '#00f0ff'}
            emissive={node.isPulse ? '#e63946' : '#00f0ff'}
            emissiveIntensity={node.isPulse ? 3 : 1.5}
            toneMapped={false}
          />
        </mesh>
      ))}
      {/* Edges */}
      {edges.map((edge) => {
        const start = new THREE.Vector3(...edge.from);
        const end = new THREE.Vector3(...edge.to);
        const mid = new THREE.Vector3().lerpVectors(start, end, 0.5);
        const dir = new THREE.Vector3().subVectors(end, start);
        const len = dir.length();

        return (
          <mesh
            key={edge.key}
            position={mid}
            quaternion={new THREE.Quaternion().setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              dir.normalize()
            )}
          >
            <cylinderGeometry args={[0.015, 0.015, len, 4]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00f0ff"
              emissiveIntensity={0.8}
              transparent
              opacity={0.4}
              toneMapped={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
