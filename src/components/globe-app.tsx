import { GlobeCanvas } from "@/components/globe/globe-canvas";
import { AppOverlay } from "@/components/overlay/app-overlay";

export function GlobeApp() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      <h1 className="sr-only">Meridian — a rotating 3D globe of featured places</h1>
      <GlobeCanvas />
      <AppOverlay />
    </main>
  );
}
