import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Color } from "three";
import { SUN_DIR } from "@/lib/geo";
import { useGlobeStore } from "@/lib/globe-store";
import { Atmosphere } from "./atmosphere";
import { CameraRig } from "./camera-rig";
import { Earth } from "./earth";
import { Markers } from "./markers";

function Starfield() {
  const positions = useMemo(() => {
    const count = 2800;
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 48 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      data[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      data[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      data[i * 3 + 2] = radius * Math.cos(phi);
    }
    return data;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.32}
        color="#d5deea"
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

export function GlobeScene() {
  const sun = SUN_DIR.clone().multiplyScalar(8);

  return (
    <Canvas
      className="absolute inset-0 h-full w-full touch-none"
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "default",
        failIfMajorPerformanceCaveat: false,
      }}
      camera={{ position: [0, 0.28, 2.52], fov: 40, near: 0.1, far: 200 }}
      onCreated={({ gl }) => {
        gl.setClearColor(new Color("#07080c"), 1);
        gl.domElement.style.touchAction = "none";
        useGlobeStore.getState().setStatus("ready");
      }}
    >
      <color attach="background" args={["#07080c"]} />
      <ambientLight intensity={0.22} color="#6d7f93" />
      <hemisphereLight args={["#1c3148", "#07080c", 0.48]} />
      <directionalLight position={sun} intensity={2.05} color="#fff3dc" />
      <directionalLight position={[3.4, -1.2, -2.6]} intensity={0.12} color="#6f90b0" />

      <Starfield />
      <Earth />
      <Atmosphere />
      <Markers />
      <CameraRig />
    </Canvas>
  );
}
