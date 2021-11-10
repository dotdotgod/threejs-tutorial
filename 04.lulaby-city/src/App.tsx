import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Group, PositionalAudio } from "three";
import { Preload, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

const Sound = ({ url, distance }: { url: string; distance: number }) => {
  const sound = useRef<PositionalAudio>();
  const [listener] = useState(() => new THREE.AudioListener());
  const { camera } = useThree();
  const buffer = useLoader(THREE.AudioLoader, url);

  useEffect(() => {
    sound.current?.setBuffer(buffer);
    sound.current?.setRefDistance(distance);
    sound.current?.setLoop(true);
    sound.current?.play();
    camera.add(listener);
    return () => {
      camera.remove(listener);
    };
  }, [camera, buffer, listener, sound.current]);
  return <positionalAudio ref={sound} args={[listener]} />;
};

type GLTFResult = GLTF & {
  nodes: {
    mesh_0: THREE.Mesh;
    mesh_1: THREE.Mesh;
    mesh_2: THREE.Mesh;
    mesh_3: THREE.Mesh;
  };
  materials: {
    Scene_Root: THREE.MeshStandardMaterial;
  };
};

const Model = () => {
  const group = useRef<Group>(null);
  const { nodes, materials } = useGLTF("/scene-draco.glb") as GLTFResult;
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.003;
  });
  return (
    <group ref={group} scale={[0.001, 0.001, 0.001]} position={[0, 0, -100]}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group position={[-102253.52, -210688.86, -17050.52]}>
          <mesh
            material={materials.Scene_Root}
            geometry={nodes.mesh_0.geometry}
          />
          <mesh
            material={materials.Scene_Root}
            geometry={nodes.mesh_1.geometry}
          />
          <mesh
            material={materials.Scene_Root}
            geometry={nodes.mesh_2.geometry}
          />
          <mesh
            material={materials.Scene_Root}
            geometry={nodes.mesh_3.geometry}
          />
        </group>
        <group position={[100000, 120000, 2000]}>
          <Sound url="/zapsplat_icecream.mp3" distance={10} />
        </group>
        <mesh position={[250000, -200000, 50000]}>
          <sphereBufferGeometry attach="geometry" args={[30000, 32, 32]} />
          <meshBasicMaterial attach="material" color="#ff1020" />
        </mesh>
      </group>
    </group>
  );
};

function App() {
  return (
    <Canvas camera={{ position: [0, 2, 20], fov: 40 }}>
      <fog attach="fog" args={["#cc7b32", 0, 500]} />
      <Suspense fallback={null}>
        <Model />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

export default App;
