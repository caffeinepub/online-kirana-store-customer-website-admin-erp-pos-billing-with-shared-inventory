import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, Suspense } from 'react';
import { Mesh, Group } from 'three';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

// Enhanced rice bag with more detail
function RiceBag() {
  const meshRef = useRef<Mesh>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (meshRef.current && !prefersReducedMotion) {
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
  });

  return (
    <group position={[-2, 0, 0]}>
      <mesh ref={meshRef} scale={[0.9, 1.3, 0.7]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#f97316" metalness={0.2} roughness={0.8} />
      </mesh>
      {/* Label detail */}
      <mesh position={[0, 0, 0.36]} scale={[0.7, 0.9, 0.01]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color="#fef3c7" metalness={0.1} roughness={0.9} />
      </mesh>
    </group>
  );
}

// Enhanced oil bottle with cap
function OilBottle() {
  const groupRef = useRef<Group>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (groupRef.current && !prefersReducedMotion) {
      groupRef.current.rotation.y -= delta * 0.35;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6 + 2) * 0.18;
    }
  });

  return (
    <group ref={groupRef} position={[2, 0, 0]}>
      {/* Bottle body */}
      <mesh scale={[0.45, 1.5, 0.45]}>
        <cylinderGeometry args={[0.5, 0.6, 1, 12]} />
        <meshStandardMaterial color="#fb923c" metalness={0.6} roughness={0.2} transparent opacity={0.9} />
      </mesh>
      {/* Bottle cap */}
      <mesh position={[0, 0.8, 0]} scale={[0.3, 0.15, 0.3]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color="#ea580c" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Label */}
      <mesh position={[0, 0, 0.28]} scale={[0.8, 1.2, 0.01]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial color="#fef3c7" metalness={0.1} roughness={0.9} />
      </mesh>
    </group>
  );
}

// Floating spice containers with more variety
function SpiceContainer({ position, color, size = 1 }: { position: [number, number, number]; color: string; size?: number }) {
  const meshRef = useRef<Mesh>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame((state) => {
    if (meshRef.current && !prefersReducedMotion) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.2 + position[0] * 2) * 0.25;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={size}>
      <cylinderGeometry args={[0.25, 0.25, 0.6, 8]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
    </mesh>
  );
}

// Enhanced atta pack with texture
function AttaPack() {
  const meshRef = useRef<Mesh>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (meshRef.current && !prefersReducedMotion) {
      meshRef.current.rotation.x += delta * 0.15;
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 1.5, -1.5]} scale={[0.7, 0.9, 0.35]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ea580c" metalness={0.3} roughness={0.7} />
    </mesh>
  );
}

// Grocery basket base
function GroceryBasket() {
  const meshRef = useRef<Mesh>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useFrame((state) => {
    if (meshRef.current && !prefersReducedMotion) {
      meshRef.current.position.y = -1.8 + Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <group>
      {/* Basket body */}
      <mesh ref={meshRef} position={[0, -1.8, 0]} scale={[2.5, 0.8, 1.8]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#c2410c" metalness={0.2} roughness={0.9} wireframe />
      </mesh>
    </group>
  );
}

export default function Hero3D() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="w-full h-full pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          {/* Enhanced warm lighting for richer grocery scene */}
          <ambientLight intensity={0.7} color="#fff5e6" />
          <directionalLight position={[6, 6, 6]} intensity={1.4} color="#ffffff" castShadow />
          <pointLight position={[-6, 4, -4]} intensity={1} color="#fb923c" />
          <pointLight position={[6, -2, 4]} intensity={0.6} color="#fdba74" />
          <spotLight position={[0, 6, 0]} intensity={0.7} angle={0.5} penumbra={1} color="#fef3c7" />
          
          {/* Composed grocery scene with basket */}
          <GroceryBasket />
          <RiceBag />
          <OilBottle />
          <AttaPack />
          <SpiceContainer position={[-1, -1.3, 0.8]} color="#dc2626" size={0.9} />
          <SpiceContainer position={[1.2, -1.6, 0.5]} color="#f59e0b" size={1.1} />
          <SpiceContainer position={[0.2, -0.9, 1.2]} color="#fdba74" size={0.85} />
          <SpiceContainer position={[-0.5, -1.1, -0.3]} color="#fb923c" size={0.95} />
        </Suspense>
      </Canvas>
    </div>
  );
}
