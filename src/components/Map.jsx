import * as THREE from "three"
import { Clone, useGLTF, useTexture } from "@react-three/drei"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useEffect, useMemo } from "react"
import { Ground } from "./GroundWithTexture"

export function Map() {
  return (
    <>
      <group position={[0, -1, 120]}>
        <Bridge positionZ={-110} />
        <Bridge positionZ={-27} />
        <Bridge positionZ={56} />

        <CubesBarricade />
      </group>

      <Ground />
    </>
  )
}

const Bridge = ({ type = "fixed", positionZ }) => {
  const bridge = useGLTF("bridge.glb")

  //SHADOWS
  useEffect(() => {
    bridge.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = false
        child.receiveShadow = true
      }
    })
  }, [bridge])

  return (
    <group position={[0, -28.5, positionZ]} receiveShadow>
      <RigidBody type="fixed" colliders="trimesh">
        <CuboidCollider args={[10, 1, 41]} position={[0, 28, 0]} />
        <Clone object={bridge.scene} scale={[6, 5, 5]} />
      </RigidBody>
    </group>
  )
}

function CubesBarricade() {
  const texture = useTexture("/wall/texture.jpg")

  const baseCube = useMemo(() => {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      color: new THREE.Color(0.5, 0.5, 0.5),
      envMapIntensity: 0.25,
    })
    return new THREE.Mesh(geometry, material)
  }, [texture])

  return (
    <group position={[-11.5, -0.9, -112]}>
      {Array.from({ length: 8 }).map((_, i) =>
        Array.from({ length: 19 }).map((_, j) => (
          <RigidBody key={`${i}-${j}`}>
            <Clone castShadow receiveShadow object={baseCube} position={[j + 2, i + 2, 0]} />
          </RigidBody>
        ))
      )}
    </group>
  )
}
