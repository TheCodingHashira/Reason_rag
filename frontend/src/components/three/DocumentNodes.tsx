import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

interface NodeData {
  position: [number, number, number];
  scale: number;
  speed: number;
}

function DocumentNode({ position, scale, speed }: NodeData) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.2;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * speed) * 0.2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#0891b2"
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
      <Sphere args={[0.3, 16, 16]} position={position} scale={scale * 0.8}>
        <meshStandardMaterial
          color="#22d3ee"
          transparent
          opacity={0.3}
          emissive="#0891b2"
          emissiveIntensity={0.2}
        />
      </Sphere>
    </Float>
  );
}

function ConnectionLines({ nodes, isSearching }: { nodes: NodeData[]; isSearching: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const pts: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        pts.push([
          new THREE.Vector3(...nodes[i].position),
          new THREE.Vector3(...nodes[j].position)
        ]);
      }
    }
    return pts;
  }, [nodes]);

  return (
    <group ref={groupRef}>
      {points.map((pair, i) => (
        <Line
          key={i}
          points={pair}
          color="#0891b2"
          lineWidth={1}
          transparent
          opacity={isSearching ? 0.4 : 0.15}
        />
      ))}
    </group>
  );
}

function Scene({ isSearching }: { isSearching: boolean }) {
  const nodes = useMemo<NodeData[]>(() => [
    { position: [-3, 2, -2], scale: 0.4, speed: 1.2 },
    { position: [3, -1, -3], scale: 0.5, speed: 0.8 },
    { position: [-2, -2, -1], scale: 0.35, speed: 1.5 },
    { position: [2, 2, -2], scale: 0.45, speed: 1.0 },
    { position: [0, 0, -4], scale: 0.6, speed: 0.6 },
    { position: [-4, 0, -3], scale: 0.3, speed: 1.3 },
    { position: [4, 1, -2], scale: 0.4, speed: 0.9 },
  ], []);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#22d3ee" />
      
      {nodes.map((node, i) => (
        <DocumentNode key={i} {...node} />
      ))}
      
      <ConnectionLines nodes={nodes} isSearching={isSearching} />
    </>
  );
}

interface DocumentNodesProps {
  isSearching?: boolean;
}

export function DocumentNodes({ isSearching = false }: DocumentNodesProps) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <Scene isSearching={isSearching} />
      </Canvas>
    </div>
  );
}
