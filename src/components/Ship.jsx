import { useGLTF } from "@react-three/drei"
import { CuboidCollider, RigidBody } from "@react-three/rapier"

const Ship = () => {
  const model = useGLTF("ship.glb")
  const mando = useGLTF("mandalorian.glb")

  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        <group rotation={[-0.06, 0.45, 0]} position={[-0, 7.1, 265]}>
          <primitive object={model.scene} scale={20} />
          <CuboidCollider args={[6, 6, 26]} position={[0, 0, -17]} />
        </group>
      </RigidBody>

      <RigidBody type="fixed" colliders="hull">
        <primitive
          object={mando.scene}
          scale={30}
          position={[0, -1, 230]}
          rotation={[0, 2.75, 0]}
        />
      </RigidBody>
    </>
  )
}

export default Ship
