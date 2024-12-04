import { Clone, useGLTF } from "@react-three/drei"
import { CuboidCollider } from "@react-three/rapier"

const Bunker = () => {
  const bunker = useGLTF("star_wars_endor_bunker.glb")
  const bridge = useGLTF("bridge.glb")

  return (
    <>
      <primitive object={bunker.scene} position={[0, 19, -87]} scale={80} />

      <CuboidCollider args={[14, 1, 10]} position={[0, -1.3, -40]} />
      <CuboidCollider args={[50, 50, 1]} position={[0, -1.3, -40]} />
      <CuboidCollider args={[10, 25, 15]} position={[24, -1.3, -40]} />
      <CuboidCollider args={[10, 25, 15]} position={[-24, -1.3, -40]} />

      <Clone
        object={bridge.scene}
        rotation={[0, 3.14 / 2, 0]}
        scale={10}
        position={[0, -61.75, -48]}
      />
      <Clone
        object={bridge.scene}
        rotation={[0, 3.14 / 2, 0]}
        scale={10}
        position={[-156, -61.75, -48]}
      />
      <Clone
        object={bridge.scene}
        rotation={[0, 3.14 / 2, 0]}
        scale={10}
        position={[156, -61.75, -48]}
      />
    </>
  )
}

export default Bunker
