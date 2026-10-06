import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as require_jsx_runtime } from "../_libs/@react-three/drei+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
import { n as Play, r as Pause } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CdKS9PZW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var LOCATIONS = [
	{
		id: "reykjavik",
		name: "Reykjavík",
		region: "Iceland",
		lat: 64.1466,
		lng: -21.9426,
		summary: "A small capital on the mid-Atlantic ridge, held between black rock and a pale sky."
	},
	{
		id: "new-york",
		name: "New York",
		region: "United States",
		lat: 40.7128,
		lng: -74.006,
		summary: "An island of stacked light at the mouth of the Hudson, dense even from orbit."
	},
	{
		id: "san-francisco",
		name: "San Francisco",
		region: "United States",
		lat: 37.7749,
		lng: -122.4194,
		summary: "A grid against fog, with a gate standing at the edge of the continent."
	},
	{
		id: "rio",
		name: "Rio de Janeiro",
		region: "Brazil",
		lat: -22.9068,
		lng: -43.1729,
		summary: "Granite peaks and a city pressed thin between forest and a bright bay."
	},
	{
		id: "marrakech",
		name: "Marrakech",
		region: "Morocco",
		lat: 31.6295,
		lng: -7.9811,
		summary: "Red walls and a living square where the Atlas mountains meet the plain."
	},
	{
		id: "paris",
		name: "Paris",
		region: "France",
		lat: 48.8566,
		lng: 2.3522,
		summary: "Stone, river, and a measured glow along the Seine after dusk."
	},
	{
		id: "cairo",
		name: "Cairo",
		region: "Egypt",
		lat: 30.0444,
		lng: 31.2357,
		summary: "The Nile’s oldest city, facing the Giza plateau across a ribbon of water."
	},
	{
		id: "cape-town",
		name: "Cape Town",
		region: "South Africa",
		lat: -33.9249,
		lng: 18.4241,
		summary: "A city between a flat mountain and two oceans, wind-cut and clear."
	},
	{
		id: "mumbai",
		name: "Mumbai",
		region: "India",
		lat: 19.076,
		lng: 72.8777,
		summary: "A peninsula of monsoon light reaching into the Arabian Sea."
	},
	{
		id: "singapore",
		name: "Singapore",
		region: "Singapore",
		lat: 1.3521,
		lng: 103.8198,
		summary: "A garden city on the strait, bright and exact after nightfall."
	},
	{
		id: "tokyo",
		name: "Tokyo",
		region: "Japan",
		lat: 35.6762,
		lng: 139.6503,
		summary: "An endless low glow across the Kantō plain, still and vast from above."
	},
	{
		id: "sydney",
		name: "Sydney",
		region: "Australia",
		lat: -33.8688,
		lng: 151.2093,
		summary: "Harbour and sandstone, a city turned toward the Pacific."
	}
];
function getPlace(id) {
	if (!id) return void 0;
	return LOCATIONS.find((place) => place.id === id);
}
function formatCoord(lat, lng) {
	const ns = lat >= 0 ? "N" : "S";
	const ew = lng >= 0 ? "E" : "W";
	return `${Math.abs(lat).toFixed(2)}°${ns}  ${Math.abs(lng).toFixed(2)}°${ew}`;
}
var useGlobeStore = create((set) => ({
	selectedId: null,
	hoveredId: null,
	autoRotate: true,
	interacting: false,
	focusNonce: 0,
	select: (id) => set((state) => ({
		selectedId: id,
		focusNonce: state.focusNonce + 1
	})),
	hover: (id) => set({ hoveredId: id }),
	setAutoRotate: (autoRotate) => set({ autoRotate }),
	toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
	setInteracting: (interacting) => set({ interacting })
}));
function GlobeCanvas() {
	const [Scene, setScene] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		import("./globe-scene-lodUOWA6.mjs").then((mod) => {
			if (!cancelled) setScene(() => mod.GlobeScene);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	if (!Scene) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 bg-bg",
		"aria-hidden": "true"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scene, {});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-[color,background-color,transform,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			ghost: "bg-surface text-fg shadow-panel hover:bg-surface-2"
		},
		size: {
			default: "min-h-11 px-4",
			sm: "min-h-11 px-3.5"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function AppOverlay() {
	const selectedId = useGlobeStore((s) => s.selectedId);
	const hoveredId = useGlobeStore((s) => s.hoveredId);
	const autoRotate = useGlobeStore((s) => s.autoRotate);
	const interacting = useGlobeStore((s) => s.interacting);
	const select = useGlobeStore((s) => s.select);
	const hover = useGlobeStore((s) => s.hover);
	const toggleAutoRotate = useGlobeStore((s) => s.toggleAutoRotate);
	const selected = getPlace(selectedId);
	const orbiting = autoRotate && !interacting;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overlay-motion pointer-events-none absolute inset-0 z-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "vignette absolute inset-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 pt-[max(1rem,env(safe-area-inset-top))] md:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stagger-in pointer-events-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl leading-none tracking-tight italic text-fg md:text-3xl",
						children: "Meridian"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "A globe of luminous places"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "ghost",
					size: "sm",
					onClick: toggleAutoRotate,
					className: "stagger-in pointer-events-auto",
					style: { animationDelay: "80ms" },
					"aria-pressed": autoRotate,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative size-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
							className: cn("absolute inset-0 size-4 transition-[opacity,transform,filter] duration-200", orbiting ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-0"),
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
							className: cn("absolute inset-0 size-4 transition-[opacity,transform,filter] duration-200", orbiting ? "scale-100 opacity-100 blur-0" : "scale-[0.25] opacity-0 blur-[4px]"),
							strokeWidth: 1.75
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: orbiting ? "Orbiting" : autoRotate ? "Paused" : "Orbit off" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "pointer-events-auto absolute top-24 bottom-36 hidden w-80 flex-col md:flex",
				style: { left: "max(1.5rem, env(safe-area-inset-left))" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stagger-in flex min-h-0 flex-1 flex-col rounded-xl bg-surface p-2 shadow-panel",
					style: { animationDelay: "120ms" },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between px-3 pb-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium text-fg",
							children: "Featured places"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tabular-nums text-subtle",
							children: LOCATIONS.length
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						"aria-label": "Featured places",
						className: "overlay-scroll min-h-0 flex-1 overflow-y-auto px-1 pb-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-col gap-0.5",
							children: LOCATIONS.map((place) => {
								const active = selectedId === place.id;
								const hot = hoveredId === place.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"data-place": place.id,
									onClick: () => select(place.id),
									onMouseEnter: () => hover(place.id),
									onMouseLeave: () => hover(null),
									className: cn("flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left transition-colors duration-150", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface-2/70 hover:text-fg"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("size-1.5 shrink-0 rounded-full", active || hot ? "bg-accent" : "bg-subtle/70"),
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex min-w-0 flex-1 items-baseline justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate font-medium",
											children: place.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate text-xs text-subtle",
											children: place.region
										})]
									})]
								}) }, place.id);
							})
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-auto md:hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobilePlaceRail, {
						selectedId,
						onSelect: select
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "stagger-in pointer-events-auto mx-auto w-full max-w-xl rounded-xl bg-surface px-5 py-4 shadow-panel md:mx-0 md:ml-auto md:max-w-md",
					style: { animationDelay: "160ms" },
					children: selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl leading-tight tracking-tight text-fg italic",
								children: selected.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 text-sm text-muted",
								children: selected.region
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "shrink-0 pt-1 text-xs tabular-nums text-subtle",
								children: formatCoord(selected.lat, selected.lng)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-fg/85",
							children: selected.summary
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl leading-tight tracking-tight text-fg italic",
							children: "Look closer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted",
							children: "Drag to spin the globe. Click a glowing marker — or a name from the list — to travel there."
						})]
					})
				})]
			})
		]
	});
}
function MobilePlaceRail({ selectedId, onSelect }) {
	const scroller = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (!selectedId || !scroller.current) return;
		scroller.current.querySelector(`[data-place="${selectedId}"]`)?.scrollIntoView({
			inline: "center",
			block: "nearest",
			behavior: "smooth"
		});
	}, [selectedId]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: scroller,
		className: "overlay-scroll flex gap-2 overflow-x-auto pb-1",
		"aria-label": "Featured places",
		children: LOCATIONS.map((place) => {
			const active = selectedId === place.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"data-place": place.id,
				onClick: () => onSelect(place.id),
				className: cn("min-h-11 shrink-0 rounded-full px-4 text-sm font-medium shadow-panel transition-colors duration-150", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", "active:scale-[0.96]", active ? "bg-accent text-accent-fg" : "bg-surface text-fg"),
				children: place.name
			}, place.id);
		})
	});
}
function GlobeApp() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative h-dvh w-full overflow-hidden bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "sr-only",
				children: "Meridian — a rotating 3D globe of featured places"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobeCanvas, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppOverlay, {})
		]
	});
}
var routes_exports = /* @__PURE__ */ __exportAll({ component: () => Home });
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobeApp, {});
}
//#endregion
export { getPlace as i, useGlobeStore as n, LOCATIONS as r, routes_exports as t };
