import { create } from "zustand";

export type GlobeStatus = "loading" | "ready" | "error";

type GlobeState = {
  selectedId: string | null;
  hoveredId: string | null;
  autoRotate: boolean;
  interacting: boolean;
  focusNonce: number;
  status: GlobeStatus;
  errorMessage: string | null;
  select: (id: string) => void;
  hover: (id: string | null) => void;
  setAutoRotate: (value: boolean) => void;
  toggleAutoRotate: () => void;
  setInteracting: (value: boolean) => void;
  setStatus: (status: GlobeStatus, errorMessage?: string | null) => void;
};

export const useGlobeStore = create<GlobeState>((set) => ({
  selectedId: null,
  hoveredId: null,
  autoRotate: true,
  interacting: false,
  focusNonce: 0,
  status: "loading",
  errorMessage: null,
  select: (id) => set((state) => ({ selectedId: id, focusNonce: state.focusNonce + 1 })),
  hover: (id) => set({ hoveredId: id }),
  setAutoRotate: (autoRotate) => set({ autoRotate }),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  setInteracting: (interacting) => set({ interacting }),
  setStatus: (status, errorMessage = null) => set({ status, errorMessage }),
}));
