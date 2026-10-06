import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  Color,
  LinearFilter,
  LinearMipmapLinearFilter,
  Mesh,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three";
import { SUN_DIR } from "@/lib/geo";

const DAY_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;

void main() {
  vUv = uv;
  vec4 world = modelMatrix * vec4(position, 1.0);
  vPosW = world.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const DAY_FRAG = /* glsl */ `
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uBump;
uniform vec3 uSunDir;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;

vec3 toLinear(vec3 c) {
  return pow(max(c, 0.0), vec3(2.2));
}

vec3 toGamma(vec3 c) {
  return pow(max(c, 0.0), vec3(1.0 / 2.2));
}

void main() {
  vec3 N = normalize(vNormalW);
  vec3 V = normalize(cameraPosition - vPosW);
  vec3 L = normalize(uSunDir);
  float NdotL = dot(N, L);

  vec3 day = toLinear(texture2D(uDay, vUv).rgb);
  vec3 nightTex = texture2D(uNight, vUv).rgb;
  float height = texture2D(uBump, vUv).r;
  day *= 0.88 + height * 0.28;

  float dayAmt = smoothstep(-0.02, 0.28, NdotL);
  float nightAmt = 1.0 - smoothstep(-0.16, 0.12, NdotL);

  vec3 ambient = vec3(0.03, 0.045, 0.07);
  vec3 sunCol = vec3(1.0, 0.96, 0.88);
  vec3 lit = day * (ambient + sunCol * max(NdotL, 0.0) * 1.35);

  float ocean = smoothstep(0.04, 0.22, day.b - max(day.r, day.g) * 0.72);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 52.0) * ocean * clamp(NdotL, 0.0, 1.0);
  lit += vec3(0.75, 0.86, 1.0) * spec * 0.7;

  float city = max(dot(nightTex, vec3(0.3, 0.5, 0.2)) - 0.04, 0.0);
  vec3 nightCol = day * 0.035 + nightTex * vec3(1.15, 0.82, 0.5) * city * 3.4 * nightAmt;

  vec3 color = mix(nightCol, lit, dayAmt);

  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.2);
  float term = smoothstep(-0.2, 0.2, NdotL);
  vec3 scatter = mix(vec3(0.95, 0.38, 0.12), vec3(0.28, 0.52, 0.95), term);
  color += scatter * fresnel * 0.28 * (0.25 + 0.75 * dayAmt);

  gl_FragColor = vec4(toGamma(color), 1.0);
}
`;

type EarthMaps = {
  day: Texture;
  night: Texture;
  bump: Texture;
  clouds: Texture;
};

function setupMap(tex: Texture, srgb: boolean) {
  if (srgb) tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.magFilter = LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

function useEarthMaps() {
  const [maps, setMaps] = useState<EarthMaps | null>(null);

  useEffect(() => {
    const loader = new TextureLoader();
    let cancelled = false;

    void Promise.all([
      loader.loadAsync("/textures/earth-day.jpg"),
      loader.loadAsync("/textures/earth-night.jpg"),
      loader.loadAsync("/textures/earth-topo.jpg"),
      loader.loadAsync("/textures/earth-clouds.jpg"),
    ])
      .then(([day, night, bump, clouds]) => {
        if (cancelled) {
          day.dispose();
          night.dispose();
          bump.dispose();
          clouds.dispose();
          return;
        }
        setupMap(day, true);
        setupMap(night, true);
        setupMap(bump, false);
        setupMap(clouds, false);
        setMaps({ day, night, bump, clouds });
      })
      .catch(() => {
        /* keep the untextured sphere until retry/reload */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return maps;
}

export function Earth() {
  const maps = useEarthMaps();
  const cloudsRef = useRef<Mesh>(null);

  const material = useMemo(() => {
    if (!maps) return null;
    return new ShaderMaterial({
      uniforms: {
        uDay: { value: maps.day },
        uNight: { value: maps.night },
        uBump: { value: maps.bump },
        uSunDir: { value: SUN_DIR },
      },
      vertexShader: DAY_VERT,
      fragmentShader: DAY_FRAG,
      toneMapped: false,
    });
  }, [maps]);

  useEffect(() => () => material?.dispose(), [material]);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += Math.min(delta, 0.1) * 0.012;
    }
  });

  if (!maps || !material) {
    return (
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#143047" roughness={0.92} metalness={0.04} />
      </mesh>
    );
  }

  return (
    <group>
      <mesh material={material}>
        <sphereGeometry args={[1, 96, 96]} />
      </mesh>
      <mesh ref={cloudsRef} scale={1.012}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshLambertMaterial
          color="#ffffff"
          map={maps.clouds}
          alphaMap={maps.clouds}
          transparent
          opacity={0.34}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={1.004}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color={new Color("#7eb0d8")}
          transparent
          opacity={0.07}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
