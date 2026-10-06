import { useEffect, useState } from "react";
import { useGlobeStore } from "@/lib/globe-store";
import { GlobeScene } from "./globe-scene";

const TEXTURES = [
  "/textures/earth-day.jpg",
  "/textures/earth-night.jpg",
  "/textures/earth-topo.jpg",
  "/textures/earth-clouds.jpg",
];

if (typeof window !== "undefined") {
  for (const src of TEXTURES) {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
  }
}

export function GlobeCanvas() {
  const [mounted, setMounted] = useState(false);
  const setStatus = useGlobeStore((s) => s.setStatus);

  useEffect(() => {
    setMounted(true);
    const timeout = window.setTimeout(() => {
      if (useGlobeStore.getState().status === "loading") {
        setStatus("error", "The globe took too long to appear.");
      }
    }, 15000);
    return () => window.clearTimeout(timeout);
  }, [setStatus]);

  if (!mounted) {
    return <div className="absolute inset-0 bg-bg" aria-hidden="true" />;
  }

  return <GlobeScene />;
}
