import { Center, DepthBuffer, SpotLight, useGLTF } from "@react-three/drei";
import {
  Canvas,
  GroupProps,
  ThreeEvent,
  useFrame,
  useLoader,
  useThree,
} from "@react-three/fiber";
import React, { Suspense, useRef, useState } from "react";
import { Vector3, SpotLight as SpotLightImpl, Group } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

type GLTFResult = GLTF & {
  nodes: {
    cube1: THREE.Mesh;
    cube2: THREE.Mesh;
  };
  materials: {
    base: THREE.MeshStandardMaterial;
    inner: THREE.MeshStandardMaterial;
  };
};

function Dragon({ ...props }) {
  //@ts-ignore
  const { nodes, materials } = useGLTF(
    "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/dragon/model.gltf"
  );
  return (
    <mesh
      castShadow
      receiveShadow
      geometry={nodes.dragon.geometry}
      material={materials["Default OBJ.001"]}
      {...props}
      dispose={null}
    />
  );
}

const vec = new Vector3();

function MovingSpot({ ...props }) {
  const group = useRef<Group>();
  const [light, set] = useState<SpotLightImpl>();
  console.log(
    light,
    typeof light

    // instanceof light
  );
  const viewport = useThree((state) => state.viewport);
  useFrame((state) => {
    group?.current?.position?.lerp(
      vec.set(state.mouse.x, state.mouse.y, 0),
      0.1
    );
    light?.target.position.lerp(
      vec.set(
        (state.mouse.x * viewport.width) / 2,
        (state.mouse.y * viewport.height) / 2,
        0
      ),
      0.1
    );
  });
  return (
    <group ref={group}>
      <SpotLight
        //@ts-ignore
        ref={set}
        castShadow
        penumbra={1}
        distance={6}
        angle={0.3}
        attenuation={5}
        anglePower={5}
        intensity={2}
        {...props}
      />
      {light && <primitive object={light.target} />}
    </group>
  );
}

function App() {
  const [depthBuffer, setDepth] = useState();
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [-2, 2, 6], fov: 50, near: 1, far: 20 }}
    >
      <color attach="background" args={["#202020"]} />
      <fog attach="fog" args={["#202020", 5, 20]} />
      <ambientLight intensity={0.02} />
      <DepthBuffer ref={setDepth} size={512} />
      <MovingSpot
        depthBuffer={depthBuffer}
        color="#0c8cbf"
        position={[3, 3, 2]}
      />
      <MovingSpot
        depthBuffer={depthBuffer}
        color="#b00c3f"
        position={[1, 3, 0]}
      />
      <Suspense fallback={null}>
        <Center>
          <Dragon />
        </Center>
      </Suspense>
      <mesh receiveShadow position={[0, -1, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[50, 50]} />
        <meshPhongMaterial />
      </mesh>
    </Canvas>
  );
}

export default App;
