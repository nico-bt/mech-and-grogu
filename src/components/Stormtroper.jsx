import { Clone, useGLTF } from "@react-three/drei"
import { CuboidCollider, RigidBody } from "@react-three/rapier"
import { useEffect } from "react"

const Stormtropers = ({ type = "dynamic", rotation = [0, 3.14, 0] }) => {
  const model = useGLTF("/stormtrooper_idle/scene.gltf")

  useEffect(() => {
    model.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    model.materials.lambert1.envMapIntensity = 0.6
  }, [model])

  return (
    <group position={[-1.5, 1.1, 50]} castShadow receiveShadow>
      {/* TROPERS */}
      {Array.from({ length: 9 }).map((_, i) =>
        Array.from({ length: 6 }).map((_, j) => (
          <RigidBody
            key={`${i}-${j}` + Math.random()}
            colliders={false}
            rotation={rotation}
            position={[j * 3.2 - 7, 0, i * 9]}
            type={type}
            scale={1.5}
          >
            <CuboidCollider args={[0.2, 1, 0.2]} />
            <Clone object={model.scene} position={[0, -1, 0.25]} scale={1.25} />
          </RigidBody>
        ))
      )}
    </group>
  )
}

export default Stormtropers
