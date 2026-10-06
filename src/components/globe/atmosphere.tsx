import { useEffect, useMemo } from "react";
import { AdditiveBlending, BackSide, Color, FrontSide, ShaderMaterial, type Side } from "three";

const VERT = /* glsl */ `
varying vec3 vNormalW;
varying vec3 vPosW;

void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vPosW = world.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uPower;
uniform float uIntensity;
varying vec3 vNormalW;
varying vec3 vPosW;

void main() {
  vec3 normal = normalize(vNormalW);
  vec3 viewDir = normalize(cameraPosition - vPosW);
  float fresnel = pow(1.0 - abs(dot(viewDir, normal)), uPower);
  gl_FragColor = vec4(uColor * fresnel, clamp(fresnel * uIntensity, 0.0, 1.0));
}
`;

function useAtmosphereMaterial(color: string, power: number, intensity: number, side: Side) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uColor: { value: new Color(color) },
          uPower: { value: power },
          uIntensity: { value: intensity },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        side,
        toneMapped: false,
      }),
    [color, intensity, power, side],
  );

  useEffect(() => () => material.dispose(), [material]);
  return material;
}

export function Atmosphere() {
  const outer = useAtmosphereMaterial("#6ea7d6", 2.35, 0.82, BackSide);
  const inner = useAtmosphereMaterial("#9ec4e4", 4.2, 0.2, FrontSide);

  return (
    <group>
      <mesh scale={1.14} material={outer}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      <mesh scale={1.028} material={inner}>
        <sphereGeometry args={[1, 48, 48]} />
      </mesh>
    </group>
  );
}
