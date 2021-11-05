import * as THREE from "three";
import { Html, OrbitControls, Preload } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import React, { Suspense, useState } from "react";
import { Popconfirm } from "antd";
import "antd/dist/antd.css";
import { Texture, Vector3 } from "three";

interface Store {
  name: string;
  color: string;
  position: Vector3;
  link: number;
  url: string;
}

const store: Store[] = [
  {
    name: "outside",
    color: "lightpink",
    position: new Vector3(10, 0, -15),
    url: "/2294472375_24a3b8ef46_o.jpg",
    link: 1,
  },
  {
    name: "inside",
    color: "lightblue",
    position: new Vector3(15, 0, 0),
    url: "/Photosphere1.jpg",
    link: 0,
  },
];

type DomeProps = Omit<Store, "color" | "link" | "url"> & {
  texture: Texture;
  onClick: () => void;
};

function Dome({ name, position, texture, onClick }: DomeProps) {
  return (
    <group>
      <mesh>
        <sphereBufferGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      <mesh position={position}>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshBasicMaterial color="white" />
        <Html center>
          <Popconfirm
            title="Are you sure you want to leave?"
            onConfirm={onClick}
            okText="Yes"
            cancelText="No"
          >
            <a href="#">{name}</a>
          </Popconfirm>
        </Html>
      </mesh>
    </group>
  );
}

function Portals() {
  const [which, set] = useState(0);
  const { link, ...props } = store[which];
  const maps = useLoader(THREE.TextureLoader, store.map((entry) => entry.url)) // prettier-ignore
  return <Dome onClick={() => set(link)} {...props} texture={maps[which]} />;
}

function App() {
  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 0.1] }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.2}
        // autoRotate
        rotateSpeed={-0.5}
      />
      <Suspense fallback={null}>
        <Preload all />
        <Portals />
      </Suspense>
    </Canvas>
  );
}

export default App;
