import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as require_jsx_runtime, a as Canvas, d as Quaternion, f as SRGBColorSpace, h as Vector3, i as useCursor, l as Color, m as TextureLoader, n as CameraControls$1, o as useFrame, p as ShaderMaterial, r as CameraControls, s as useLoader, t as Stars, u as MeshStandardMaterial } from "../_libs/@react-three/drei+[...].mjs";
import { i as getPlace, n as useGlobeStore, r as LOCATIONS } from "./routes-CdKS9PZW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/globe-scene-lodUOWA6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** World-space sunlight direction. Matches the key directional light. */
var SUN_DIR = new Vector3(-.72, .38, .58).normalize();
/**
* Convert geographic coordinates to a Three.js position on a Y-up sphere
* whose UVs match a standard equirectangular Earth texture.
*/
function latLngToVector3(lat, lng, radius = 1) {
	const phi = (90 - lat) * (Math.PI / 180);
	const theta = (lng + 180) * (Math.PI / 180);
	return new Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
}
var VERT = `
varying vec3 vNormalW;
varying vec3 vPosW;

void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vPosW = world.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;
var FRAG = `
uniform vec3 uColor;
uniform float uPower;
uniform float uIntensity;
varying vec3 vNormalW;
varying vec3 vPosW;

void main() {
  vec3 normal = normalize(vNormalW);
  vec3 viewDir = normalize(cameraPosition - vPosW);
  float fresnel = pow(1.0 - abs(dot(viewDir, normal)), uPower);
  gl_FragColor = vec4(uColor * fresnel, fresnel * uIntensity);
}
`;
function useAtmosphereMaterial(color, power, intensity, side) {
	const material = (0, import_react.useMemo)(() => new ShaderMaterial({
		uniforms: {
			uColor: { value: new Color(color) },
			uPower: { value: power },
			uIntensity: { value: intensity }
		},
		vertexShader: VERT,
		fragmentShader: FRAG,
		transparent: true,
		blending: 2,
		depthWrite: false,
		side,
		toneMapped: false
	}), [
		color,
		intensity,
		power,
		side
	]);
	(0, import_react.useEffect)(() => () => material.dispose(), [material]);
	return material;
}
function Atmosphere() {
	const outer = useAtmosphereMaterial("#7aa0c4", 2.6, .72, 1);
	const inner = useAtmosphereMaterial("#9bb8d0", 3.8, .22, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		scale: 1.18,
		material: outer,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			1,
			64,
			64
		] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		scale: 1.035,
		material: inner,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			1,
			48,
			48
		] })
	})] });
}
var AUTO_ROTATE_SPEED = .12;
var IDLE_RESUME_MS = 2200;
function CameraRig() {
	const controlsRef = (0, import_react.useRef)(null);
	const resumeTimer = (0, import_react.useRef)(null);
	const focusing = (0, import_react.useRef)(false);
	const reduceMotion = (0, import_react.useRef)(false);
	const selectedId = useGlobeStore((s) => s.selectedId);
	const focusNonce = useGlobeStore((s) => s.focusNonce);
	const autoRotate = useGlobeStore((s) => s.autoRotate);
	const interacting = useGlobeStore((s) => s.interacting);
	const setInteracting = useGlobeStore((s) => s.setInteracting);
	(0, import_react.useEffect)(() => {
		reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}, []);
	(0, import_react.useEffect)(() => {
		const controls = controlsRef.current;
		if (!controls) return;
		controls.mouseButtons.right = CameraControls.ACTION.NONE;
		controls.mouseButtons.middle = CameraControls.ACTION.DOLLY;
		controls.touches.two = CameraControls.ACTION.TOUCH_DOLLY_ROTATE;
		controls.touches.three = CameraControls.ACTION.NONE;
	}, []);
	(0, import_react.useEffect)(() => {
		const place = getPlace(selectedId);
		const controls = controlsRef.current;
		if (!place || !controls) return;
		focusing.current = true;
		setInteracting(true);
		const distance = Math.min(Math.max(controls.distance, 2.05), 2.55);
		const target = latLngToVector3(place.lat, place.lng, distance);
		const animate = !reduceMotion.current;
		controls.setLookAt(target.x, target.y, target.z, 0, 0, 0, animate).finally(() => {
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
		if (autoRotate && !interacting && !focusing.current && !reduceMotion.current) controls.azimuthAngle += AUTO_ROTATE_SPEED * Math.min(delta, .1);
	}, -2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraControls$1, {
		ref: controlsRef,
		makeDefault: true,
		minDistance: 1.72,
		maxDistance: 4.6,
		minPolarAngle: .2,
		maxPolarAngle: Math.PI - .2,
		azimuthRotateSpeed: .52,
		polarRotateSpeed: .42,
		dollySpeed: .65,
		smoothTime: .55,
		draggingSmoothTime: .12,
		truckSpeed: 0,
		dollyToCursor: false,
		onStart: () => {
			setInteracting(true);
			if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
		},
		onEnd: () => {
			if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
			resumeTimer.current = window.setTimeout(() => {
				setInteracting(false);
			}, IDLE_RESUME_MS);
		}
	});
}
var NIGHT_VERT = `
varying vec2 vUv;
varying vec3 vWorldNormal;

void main() {
  vUv = uv;
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
var NIGHT_FRAG = `
uniform sampler2D uNight;
uniform vec3 uSunDir;
varying vec2 vUv;
varying vec3 vWorldNormal;

void main() {
  vec3 normal = normalize(vWorldNormal);
  float night = 1.0 - smoothstep(-0.08, 0.28, dot(normal, normalize(uSunDir)));
  vec3 lights = texture2D(uNight, vUv).rgb;
  float luma = max(dot(lights, vec3(0.33, 0.5, 0.17)), 0.0);
  vec3 warm = lights * vec3(1.0, 0.82, 0.58);
  gl_FragColor = vec4(warm * night * 1.55, luma * night);
}
`;
function Earth() {
	const [day, night, bump] = useLoader(TextureLoader, [
		"/textures/earth-day.jpg",
		"/textures/earth-night.jpg",
		"/textures/earth-topo.png"
	]);
	(0, import_react.useLayoutEffect)(() => {
		day.colorSpace = SRGBColorSpace;
		night.colorSpace = SRGBColorSpace;
		bump.colorSpace = "";
		day.anisotropy = 8;
		night.anisotropy = 4;
		bump.anisotropy = 4;
		day.needsUpdate = true;
		night.needsUpdate = true;
		bump.needsUpdate = true;
	}, [
		bump,
		day,
		night
	]);
	const dayMaterial = (0, import_react.useMemo)(() => {
		return new MeshStandardMaterial({
			map: day,
			bumpMap: bump,
			bumpScale: .045,
			color: new Color("#c3ccd6"),
			roughness: .78,
			metalness: .06
		});
	}, [bump, day]);
	const nightMaterial = (0, import_react.useMemo)(() => new ShaderMaterial({
		uniforms: {
			uNight: { value: night },
			uSunDir: { value: SUN_DIR }
		},
		vertexShader: NIGHT_VERT,
		fragmentShader: NIGHT_FRAG,
		transparent: true,
		depthWrite: false,
		blending: 2,
		toneMapped: false
	}), [night]);
	(0, import_react.useLayoutEffect)(() => () => {
		dayMaterial.dispose();
		nightMaterial.dispose();
	}, [dayMaterial, nightMaterial]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		material: dayMaterial,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			1,
			96,
			96
		] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("mesh", {
		scale: 1.003,
		material: nightMaterial,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
			1,
			64,
			64
		] })
	})] });
}
var UP = new Vector3(0, 1, 0);
var tmpWorld = new Vector3();
var tmpCam = new Vector3();
var MARKER_COLOR = new Color("#e8eef4");
var MARKER_GLOW = new Color("#c5d4e2");
var MARKER_ACTIVE = new Color("#f6f8fa");
function Markers() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("group", { children: LOCATIONS.map((place) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocationMarker, { place }, place.id)) });
}
function LocationMarker({ place }) {
	const group = (0, import_react.useRef)(null);
	const glow = (0, import_react.useRef)(null);
	const coreMat = (0, import_react.useRef)(null);
	const glowMat = (0, import_react.useRef)(null);
	const beamMat = (0, import_react.useRef)(null);
	const ringMat = (0, import_react.useRef)(null);
	const selectedId = useGlobeStore((s) => s.selectedId);
	const hoveredId = useGlobeStore((s) => s.hoveredId);
	const select = useGlobeStore((s) => s.select);
	const hover = useGlobeStore((s) => s.hover);
	const isSelected = selectedId === place.id;
	const isHovered = hoveredId === place.id;
	const [pointerOver, setPointerOver] = (0, import_react.useState)(false);
	useCursor(pointerOver);
	const { position, quaternion } = (0, import_react.useMemo)(() => {
		const position = latLngToVector3(place.lat, place.lng, 1.012);
		return {
			position,
			quaternion: new Quaternion().setFromUnitVectors(UP, position.clone().normalize())
		};
	}, [place.lat, place.lng]);
	useFrame(({ camera, clock }) => {
		const node = group.current;
		if (!node) return;
		node.getWorldPosition(tmpWorld);
		tmpCam.copy(camera.position).normalize();
		const facing = tmpWorld.normalize().dot(tmpCam);
		const visible = facing > .02;
		node.visible = visible;
		if (!visible) return;
		const fade = Math.min(Math.max((facing - .02) / .22, 0), 1);
		const pulse = 1 + Math.sin(clock.elapsedTime * 2.2 + place.lat) * (isSelected ? .22 : .1);
		const active = isSelected || isHovered;
		if (glow.current) {
			const scale = (active ? 1.45 : 1) * pulse;
			glow.current.scale.setScalar(scale);
		}
		if (coreMat.current) coreMat.current.color.copy(active ? MARKER_ACTIVE : MARKER_COLOR);
		if (glowMat.current) glowMat.current.opacity = (active ? .55 : .32) * fade;
		if (beamMat.current) beamMat.current.opacity = (active ? .55 : .22) * fade;
		if (ringMat.current) ringMat.current.opacity = (isSelected ? .85 : 0) * fade;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("group", {
		ref: group,
		position,
		quaternion,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.008,
					0
				],
				onPointerOver: (event) => {
					event.stopPropagation();
					setPointerOver(true);
					hover(place.id);
				},
				onPointerOut: () => {
					setPointerOver(false);
					hover(null);
				},
				onClick: (event) => {
					event.stopPropagation();
					select(place.id);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.042,
					16,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					transparent: true,
					opacity: 0,
					depthWrite: false
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.01,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.011,
					16,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					ref: coreMat,
					color: MARKER_COLOR,
					toneMapped: false
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				ref: glow,
				position: [
					0,
					.01,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sphereGeometry", { args: [
					.026,
					16,
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					ref: glowMat,
					color: MARKER_GLOW,
					transparent: true,
					opacity: .32,
					depthWrite: false,
					blending: 2,
					toneMapped: false
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				position: [
					0,
					.07,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("cylinderGeometry", { args: [
					.0016,
					.0036,
					.12,
					8
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					ref: beamMat,
					color: MARKER_GLOW,
					transparent: true,
					opacity: .22,
					depthWrite: false,
					blending: 2,
					toneMapped: false
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("mesh", {
				rotation: [
					-Math.PI / 2,
					0,
					0
				],
				position: [
					0,
					.001,
					0
				],
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ringGeometry", { args: [
					.028,
					.036,
					32
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meshBasicMaterial", {
					ref: ringMat,
					color: MARKER_ACTIVE,
					transparent: true,
					opacity: 0,
					side: 2,
					depthWrite: false,
					toneMapped: false
				})]
			})
		]
	});
}
function GlobeScene() {
	const sun = SUN_DIR.clone().multiplyScalar(8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Canvas, {
		className: "absolute inset-0 h-full w-full touch-none",
		dpr: [1, 1.75],
		gl: {
			antialias: true,
			alpha: false,
			powerPreference: "high-performance"
		},
		camera: {
			position: [
				0,
				.42,
				2.92
			],
			fov: 42,
			near: .1,
			far: 200
		},
		onCreated: ({ gl }) => {
			gl.setClearColor("#07080c", 1);
			gl.domElement.style.touchAction = "none";
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("color", {
				attach: "background",
				args: ["#07080c"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ambientLight", {
				intensity: .26,
				color: "#6d7f93"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hemisphereLight", { args: [
				"#1e2e42",
				"#07080c",
				.42
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: sun,
				intensity: 1.55,
				color: "#fff4e5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("directionalLight", {
				position: [
					3.2,
					-1.1,
					-2.4
				],
				intensity: .16,
				color: "#7f9bb8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, {
				radius: 90,
				depth: 48,
				count: 3200,
				factor: 2.5,
				saturation: 0,
				fade: true,
				speed: .32
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
				fallback: null,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Earth, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Atmosphere, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markers, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraRig, {})
		]
	});
}
//#endregion
export { GlobeScene };
