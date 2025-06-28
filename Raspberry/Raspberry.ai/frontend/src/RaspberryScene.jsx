// src/RaspberryScene.jsx
import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three'; // Import Three.js

function SpinningRaspberry({ position, speed }) {
  const { scene } = useGLTF('/raspberry_precise.glb');
  const ref = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * speed;
      ref.current.rotation.x = t * 0.1;
    }
  });

  if (!scene) return null;

  // Traverse the scene and render each child
  return (
    <group ref={ref} position={position} scale={0.8} dispose={null}>
      {scene.traverse((object) => {
        if (object instanceof THREE.Mesh) { // Only render meshes
          return <primitive object={object} />;
        }
      })}
    </group>
  );
}


/* -------------------------------------------------- */
/*  Main scene                                         */
/* -------------------------------------------------- */
export default function RaspberryScene() {
  /* Generate positions & speeds ONCE so React never tries
     to diff raw objects/arrays on every re-render.        */
  const raspberries = useMemo(
    () =>
      Array.from({ length: 5 }, () => ({
        position: [
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 5
        ],
        speed: Math.random() * 0.4 + 0.1
      })),
    []
  );

  return (
    <div className="fixed inset-0 -z-10 h-screen w-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />

        {/* Suspense keeps React from touching the GLB object
           until it’s fully loaded and clone() has run        */}
        <Suspense fallback={null}>
          {raspberries.map((cfg, i) => (
            <SpinningRaspberry
              key={i}
              position={cfg.position}
              speed={cfg.speed}
            />
          ))}
        </Suspense>

        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

/* Pre-load the GLB so Suspense resolves faster. */
useGLTF.preload('/raspberry_precise.glb');