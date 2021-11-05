import { useAspect } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { useEffect, useMemo } from "react";
import { Intro } from "./Intro";

function Scene() {
  const size = useAspect(1800, 1000);
  const video = useMemo(() => {
    const vid = document.createElement("video");
    vid.src = "/10.mp4";
    vid.crossOrigin = "Anonymous";
    vid.loop = true;
    return vid;
  }, []);
  useEffect(() => void video.play(), [video]);
  return (
    <mesh scale={size}>
      <planeBufferGeometry args={[1, 1]} />
      <meshBasicMaterial>
        <videoTexture attach="map" args={[video]} />
      </meshBasicMaterial>
    </mesh>
  );
}

function App() {
  return (
    <Intro>
      <Canvas orthographic linear camera={{ position: [0, 0, 100] }}>
        <Scene />
      </Canvas>
    </Intro>
  );
}

export default App;
