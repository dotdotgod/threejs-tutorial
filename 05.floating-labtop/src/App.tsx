import * as THREE from "three";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF, ContactShadows } from "@react-three/drei";
import { useSpring } from "@react-spring/core";
import { a as three } from "@react-spring/three";
import { a as web } from "@react-spring/web";
import { GLTF } from "three-stdlib";
import { Group } from "three";
import { FluidValue } from "@react-spring/shared";

const vec = new THREE.Vector3();

type GLTFResult = GLTF & {
  nodes: {
    Cube002: THREE.Mesh;
    Cube002_1: THREE.Mesh;
    Cube008: THREE.Mesh;
    Cube008_1: THREE.Mesh;
    Cube008_2: THREE.Mesh;
    keyboard: THREE.Mesh;
    touchbar: THREE.Mesh;
  };
  materials: {
    "matte.001": THREE.MeshStandardMaterial;
    aluminium: THREE.MeshStandardMaterial;
    touchbar: THREE.MeshStandardMaterial;
    trackpad: THREE.MeshStandardMaterial;
    keys: THREE.MeshStandardMaterial;
    "screen.001": THREE.MeshStandardMaterial;
  };
};

function Model({
  open,
  hinge,
  ...props
}: {
  open: boolean;
  hinge: FluidValue<number>;
}) {
  const group = useRef<Group>();
  const { nodes, materials } = useGLTF("/mac-draco.glb") as GLTFResult;
  const [hovered, setHovered] = useState(false);
  useEffect(
    () => void (document.body.style.cursor = hovered ? "pointer" : "auto"),
    [hovered]
  );
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.lerp(vec.set(0, 0, open ? -24 : -32), 0.1);
    state.camera.lookAt(0, 0, 0);
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x || 0,
        open ? Math.cos(t / 2) / 8 + 0.25 : 0,
        0.1
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y || 0,
        open ? Math.sin(t / 4) / 4 : 0,
        0.1
      );
      group.current.rotation.z = THREE.MathUtils.lerp(
        group.current.rotation.z || 0,
        open ? Math.sin(t / 4) / 4 : 0,
        0.1
      );
      group.current.position.y = THREE.MathUtils.lerp(
        group.current.position.y || 0,
        open ? (-2 + Math.sin(t)) / 3 : -4.3,
        0.1
      );
    }
  });
  return (
    <group
      ref={group}
      {...props}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => setHovered(false)}
      dispose={null}
    >
      <three.group rotation-x={hinge} position={[0, -0.04, 0.41]}>
        <group position={[0, 2.96, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh
            material={materials.aluminium}
            geometry={nodes["Cube008"].geometry}
          />
          <mesh
            material={materials["matte.001"]}
            geometry={nodes["Cube008_1"].geometry}
          />
          <mesh
            material={materials["screen.001"]}
            geometry={nodes["Cube008_2"].geometry}
          />
        </group>
      </three.group>
      <mesh
        material={materials.keys}
        geometry={nodes.keyboard.geometry}
        position={[1.79, 0, 3.45]}
      />
      <group position={[0, -0.1, 3.39]}>
        <mesh
          material={materials.aluminium}
          geometry={nodes["Cube002"].geometry}
        />
        <mesh
          material={materials.trackpad}
          geometry={nodes["Cube002_1"].geometry}
        />
      </group>
      <mesh
        material={materials.touchbar}
        geometry={nodes.touchbar.geometry}
        position={[0, -0.03, 1.2]}
      />
    </group>
  );
}

function App() {
  const [open, setOpen] = useState(false);
  const props = useSpring({ open: Number(open) });
  return (
    <web.main
      style={{ background: props.open.to([0, 1], ["#f0f0f0", "#d25578"]) }}
    >
      <web.h1
        style={{
          opacity: props.open.to([0, 1], [1, 0]),
          transform: props.open.to(
            (o) => `translate3d(-50%,${o * 50 - 100}px,0)`
          ),
        }}
      >
        hello
      </web.h1>

      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 0], fov: 35 }}>
        <three.pointLight
          position={[10, 10, 10]}
          intensity={1.5}
          color={props.open.to([0, 1], ["#f0f0f0", "#d25578"])}
        />
        <Suspense fallback={null}>
          <group
            rotation={[0, Math.PI, 0]}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            <Model open={open} hinge={props.open.to([0, 1], [1.575, -0.425])} />
          </group>
          <Environment preset="city" />
        </Suspense>
        <ContactShadows
          rotation-x={Math.PI / 2}
          position={[0, -4.5, 0]}
          opacity={0.4}
          width={20}
          height={20}
          blur={2}
          far={4.5}
        />
      </Canvas>
    </web.main>
  );
}

export default App;
