import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import CameraControlsImpl from "camera-controls";
import { latLngToVector3 } from "@/lib/geo";
import { getPlace } from "@/lib/locations";
import { useGlobeStore } from "@/lib/globe-store";

const AUTO_ROTATE_SPEED = 0.12;
const IDLE_RESUME_MS = 2200;

export function CameraRig() {
  const controlsRef = useRef<CameraControlsImpl>(null);
  const resumeTimer = useRef<number | null>(null);
  const focusing = useRef(false);
  const reduceMotion = useRef(false);

  const selectedId = useGlobeStore((s) => s.selectedId);
  const focusNonce = useGlobeStore((s) => s.focusNonce);
  const autoRotate = useGlobeStore((s) => s.autoRotate);
  const interacting = useGlobeStore((s) => s.interacting);
  const setInteracting = useGlobeStore((s) => s.setInteracting);

  useEffect(() => {
    reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.mouseButtons.right = CameraControlsImpl.ACTION.NONE;
    controls.mouseButtons.middle = CameraControlsImpl.ACTION.DOLLY;
    controls.touches.two = CameraControlsImpl.ACTION.TOUCH_DOLLY_ROTATE;
    controls.touches.three = CameraControlsImpl.ACTION.NONE;
  }, []);

  useEffect(() => {
    const place = getPlace(selectedId);
    const controls = controlsRef.current;
    if (!place || !controls) return;

    focusing.current = true;
    setInteracting(true);
    const distance = Math.min(Math.max(controls.distance, 2.05), 2.55);
    const target = latLngToVector3(place.lat, place.lng, distance);
    const animate = !reduceMotion.current;

    void controls.setLookAt(target.x, target.y, target.z, 0, 0, 0, animate).finally(() => {
      focusing.current = false;
      if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      resumeTimer.current = window.setTimeout(() => {
        setInteracting(false);
      }, IDLE_RESUME_MS);
    });
  }, [focusNonce, selectedId]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (autoRotate && !interacting && !focusing.current && !reduceMotion.current) {
      controls.azimuthAngle += AUTO_ROTATE_SPEED * Math.min(delta, 0.1);
    }
  }, -2);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      minDistance={1.55}
      maxDistance={4.2}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI - 0.2}
      azimuthRotateSpeed={0.52}
      polarRotateSpeed={0.42}
      dollySpeed={0.65}
      smoothTime={0.55}
      draggingSmoothTime={0.12}
      truckSpeed={0}
      dollyToCursor={false}
      onStart={() => {
        setInteracting(true);
        if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
      }}
      onEnd={() => {
        if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
        resumeTimer.current = window.setTimeout(() => {
          setInteracting(false);
        }, IDLE_RESUME_MS);
      }}
    />
  );
}
