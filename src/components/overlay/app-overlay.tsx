import { useEffect, useRef } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCoord, getPlace, LOCATIONS } from "@/lib/locations";
import { useGlobeStore } from "@/lib/globe-store";

export function AppOverlay() {
  const selectedId = useGlobeStore((s) => s.selectedId);
  const hoveredId = useGlobeStore((s) => s.hoveredId);
  const autoRotate = useGlobeStore((s) => s.autoRotate);
  const interacting = useGlobeStore((s) => s.interacting);
  const status = useGlobeStore((s) => s.status);
  const errorMessage = useGlobeStore((s) => s.errorMessage);
  const select = useGlobeStore((s) => s.select);
  const hover = useGlobeStore((s) => s.hover);
  const toggleAutoRotate = useGlobeStore((s) => s.toggleAutoRotate);

  const selected = getPlace(selectedId);
  const orbiting = autoRotate && !interacting;

  return (
    <div className="overlay-motion pointer-events-none absolute inset-0 z-10">
      <div className="vignette absolute inset-0" />

      {status !== "ready" ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center md:pl-80">
          <div className="flex flex-col items-center gap-3">
            {status === "error" ? (
              <div className="pointer-events-auto flex flex-col items-center gap-3 rounded-xl bg-surface px-5 py-4 shadow-panel">
                <p className="font-display text-lg italic text-fg">Could not light the globe</p>
                <p className="max-w-xs text-center text-sm text-muted">
                  {errorMessage ?? "The scene failed to start. Try again."}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <span className="globe-loader" aria-hidden="true" />
                <p className="font-display text-lg italic text-fg">Lighting the globe</p>
              </>
            )}
          </div>
        </div>
      ) : null}

      <header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 pt-[max(1rem,env(safe-area-inset-top))] md:p-6">
        <div className="stagger-in pointer-events-auto">
          <p className="font-display text-2xl leading-none tracking-tight italic text-fg md:text-3xl">
            Meridian
          </p>
          <p className="mt-1 text-sm text-muted">A globe of luminous places</p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleAutoRotate}
          className="stagger-in pointer-events-auto"
          style={{ animationDelay: "80ms" }}
          aria-pressed={autoRotate}
        >
          <span className="relative size-4">
            <Play
              className={cn(
                "absolute inset-0 size-4 transition-[opacity,transform,filter] duration-200",
                orbiting ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-0",
              )}
              strokeWidth={1.75}
            />
            <Pause
              className={cn(
                "absolute inset-0 size-4 transition-[opacity,transform,filter] duration-200",
                orbiting ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]",
              )}
              strokeWidth={1.75}
            />
          </span>
          <span>{orbiting ? "Orbiting" : autoRotate ? "Paused" : "Orbit off"}</span>
        </Button>
      </header>

      <aside
        className="pointer-events-auto absolute top-24 bottom-36 hidden w-80 flex-col md:flex"
        style={{ left: "max(1.5rem, env(safe-area-inset-left))" }}
      >
        <div
          className="stagger-in flex min-h-0 flex-1 flex-col rounded-xl bg-surface p-2 shadow-panel"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex items-baseline justify-between px-3 pb-2 pt-2">
            <h2 className="text-sm font-medium text-fg">Featured places</h2>
            <p className="text-xs tabular-nums text-subtle">{LOCATIONS.length}</p>
          </div>
          <nav
            aria-label="Featured places"
            className="overlay-scroll min-h-0 flex-1 overflow-y-auto px-1 pb-1"
          >
            <ul className="flex flex-col gap-0.5">
              {LOCATIONS.map((place) => {
                const active = selectedId === place.id;
                const hot = hoveredId === place.id;
                return (
                  <li key={place.id}>
                    <button
                      type="button"
                      data-place={place.id}
                      onClick={() => select(place.id)}
                      onMouseEnter={() => hover(place.id)}
                      onMouseLeave={() => hover(null)}
                      className={cn(
                        "flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left transition-colors duration-150",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "bg-surface-2 text-fg"
                          : "text-muted hover:bg-surface-2/70 hover:text-fg",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 shrink-0 rounded-full",
                          active || hot ? "bg-accent" : "bg-subtle/70",
                        )}
                        aria-hidden="true"
                      />
                      <span className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
                        <span className="truncate font-medium">{place.name}</span>
                        <span className="truncate text-xs text-subtle">{place.region}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      <footer className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-6">
        <div className="pointer-events-auto md:hidden">
          <MobilePlaceRail selectedId={selectedId} onSelect={select} />
        </div>

        <div
          className="stagger-in pointer-events-auto mx-auto w-full max-w-xl rounded-xl bg-surface px-5 py-4 shadow-panel md:mx-0 md:ml-auto md:max-w-md"
          style={{ animationDelay: "160ms" }}
        >
          {selected ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl leading-tight tracking-tight text-fg italic">
                    {selected.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-muted">{selected.region}</p>
                </div>
                <p className="shrink-0 pt-1 text-xs tabular-nums text-subtle">
                  {formatCoord(selected.lat, selected.lng)}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-fg/85">{selected.summary}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <h2 className="font-display text-xl leading-tight tracking-tight text-fg italic">
                Look closer
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                Drag to spin the globe. Click a glowing marker — or a name from the list — to
                travel there.
              </p>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

function MobilePlaceRail({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedId || !scroller.current) return;
    const node = scroller.current.querySelector<HTMLElement>(`[data-place="${selectedId}"]`);
    node?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [selectedId]);

  return (
    <div
      ref={scroller}
      className="overlay-scroll flex gap-2 overflow-x-auto pb-1"
      aria-label="Featured places"
    >
      {LOCATIONS.map((place) => {
        const active = selectedId === place.id;
        return (
          <button
            key={place.id}
            type="button"
            data-place={place.id}
            onClick={() => onSelect(place.id)}
            className={cn(
              "min-h-11 shrink-0 rounded-full px-4 text-sm font-medium shadow-panel transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "active:scale-[0.96]",
              active ? "bg-accent text-accent-fg" : "bg-surface text-fg",
            )}
          >
            {place.name}
          </button>
        );
      })}
    </div>
  );
}
