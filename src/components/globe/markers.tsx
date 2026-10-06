import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import {
  AdditiveBlending,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
} from "three";
import { latLngToVector3 } from "@/lib/geo";
import { LOCATIONS, type Place } from "@/lib/locations";
import { useGlobeStore } from "@/lib/globe-store";

const UP = new Vector3(0, 1, 0);
const tmpWorld = new Vector3();
const tmpCam = new Vector3();

const MARKER_COLOR = new Color("#e8eef4");
const MARKER_GLOW = new Color("#c5d4e2");
const MARKER_ACTIVE = new Color("#f6f8fa");

export function Markers() {
  return (
    <group>
      {LOCATIONS.map((place) => (
        <LocationMarker key={place.id} place={place} />
      ))}
    </group>
  );
}

function LocationMarker({ place }: { place: Place }) {
  const group = useRef<Group>(null);
  const glow = useRef<Mesh>(null);
  const coreMat = useRef<MeshBasicMaterial>(null);
  const glowMat = useRef<MeshBasicMaterial>(null);
  const beamMat = useRef<MeshBasicMaterial>(null);
  const ringMat = useRef<MeshBasicMaterial>(null);

  const selectedId = useGlobeStore((s) => s.selectedId);
  const hoveredId = useGlobeStore((s) => s.hoveredId);
  const select = useGlobeStore((s) => s.select);
  const hover = useGlobeStore((s) => s.hover);

  const isSelected = selectedId === place.id;
  const isHovered = hoveredId === place.id;
  const [pointerOver, setPointerOver] = useState(false);
  useCursor(pointerOver);

  const { position, quaternion } = useMemo(() => {
    const position = latLngToVector3(place.lat, place.lng, 1.012);
    const quaternion = new Quaternion().setFromUnitVectors(UP, position.clone().normalize());
    return { position, quaternion };
  }, [place.lat, place.lng]);

  useFrame(({ camera, clock }) => {
    const node = group.current;
    if (!node) return;

    node.getWorldPosition(tmpWorld);
    tmpCam.copy(camera.position).normalize();
    const facing = tmpWorld.normalize().dot(tmpCam);
    const visible = facing > 0.02;
    node.visible = visible;
    if (!visible) return;

    const fade = Math.min(Math.max((facing - 0.02) / 0.22, 0), 1);
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.2 + place.lat) * (isSelected ? 0.22 : 0.1);
    const active = isSelected || isHovered;

    if (glow.current) {
      const scale = (active ? 1.45 : 1) * pulse;
      glow.current.scale.setScalar(scale);
    }
    if (coreMat.current) {
      coreMat.current.color.copy(active ? MARKER_ACTIVE : MARKER_COLOR);
    }
    if (glowMat.current) {
      glowMat.current.opacity = (active ? 0.55 : 0.32) * fade;
    }
    if (beamMat.current) {
      beamMat.current.opacity = (active ? 0.55 : 0.22) * fade;
    }
    if (ringMat.current) {
      ringMat.current.opacity = (isSelected ? 0.85 : 0) * fade;
    }
  });

  return (
    <group ref={group} position={position} quaternion={quaternion}>
      <mesh
        position={[0, 0.008, 0]}
        onPointerOver={(event) => {
          event.stopPropagation();
          setPointerOver(true);
          hover(place.id);
        }}
        onPointerOut={() => {
          setPointerOver(false);
          hover(null);
        }}
        onClick={(event) => {
          event.stopPropagation();
          select(place.id);
        }}
      >
        <sphereGeometry args={[0.042, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.01, 0]}>
        <sphereGeometry args={[0.011, 16, 16]} />
        <meshBasicMaterial ref={coreMat} color={MARKER_COLOR} toneMapped={false} />
      </mesh>

      <mesh ref={glow} position={[0, 0.01, 0]}>
        <sphereGeometry args={[0.026, 16, 16]} />
        <meshBasicMaterial
          ref={glowMat}
          color={MARKER_GLOW}
          transparent
          opacity={0.32}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.0016, 0.0036, 0.12, 8]} />
        <meshBasicMaterial
          ref={beamMat}
          color={MARKER_GLOW}
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[0.028, 0.036, 32]} />
        <meshBasicMaterial
          ref={ringMat}
          color={MARKER_ACTIVE}
          transparent
          opacity={0}
          side={DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
