import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import { useRef, useState } from "react"

function Gideon() {
  const [moveGideon, setMoveGideon] = useState(false)

  const gideon = useGLTF("/gideon/scene.gltf")

  const rigidBodyRef = useRef(null)

  useFrame((state) => {
    if (moveGideon) {
      const time = state.clock.getElapsedTime()
      const x = 8 * Math.sin(2.75 * time)

      rigidBodyRef.current?.setNextKinematicTranslation({
        x: x,
        y: 0.5,
        z: 0,
      })
    }
  })

  const collisionHandler = (e) => {
    if (e.colliderObject.name === "mecha") {
      setMoveGideon(true)
    }
  }

  return (
    <RigidBody
      type="kinematicPosition"
      name="gideon"
      ref={rigidBodyRef}
      onCollisionEnter={collisionHandler}
    >
      <primitive
        object={gideon.scene}
        rotation={[0, 3.14, 0]}
        scale={2}
        position={[0, -0.6, 142]}
      />
    </RigidBody>
  )
}

export default Gideon
