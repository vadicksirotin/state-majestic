'use client';

import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, useAnimations, Environment, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import styles from '@/app/page.module.css';

function Model({ url, onLoad }: { url: string; onLoad?: () => void }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions, names } = useAnimations(animations, group);

  useEffect(() => {
    if (scene && onLoad) onLoad();
  }, [scene, onLoad]);

  useEffect(() => {
    // Play the first available animation
    if (names.length > 0) {
      const action = actions[names[0]];
      if (action) {
        action.reset().fadeIn(0.5).play();
      }
    }
  }, [actions, names]);

  return (
    <group ref={group} dispose={null}>
      {/* Если модель повернута боком или спиной, измените значение Math.PI на  или -Math.PI / 2 */}
      <primitive object={scene} scale={6.5} position={[0, -1.4, 0]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
}

export function HeroModel() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {!loaded && (
        <div className={styles.modelFallback}>
          <div className={styles.silhouette} />
        </div>
      )}
      <div style={{ width: '100%', height: '100%', opacity: loaded ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
        <Canvas camera={{ position: [0, 0.5, 6], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#C9A84C" />
          <directionalLight position={[-10, 5, -5]} intensity={0.8} color="#3B82F6" />
          <Environment preset="city" />

          <Suspense fallback={null}>
            <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.5} floatingRange={[-0.1, 0.1]}>
              <Model url="/models/3dmodel.glb" onLoad={() => setLoaded(true)} />
            </Float>
          </Suspense>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.8}
            minAzimuthAngle={-Math.PI / 4}
            maxAzimuthAngle={Math.PI / 4}
          />
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload('/models/3dmodel.glb');
