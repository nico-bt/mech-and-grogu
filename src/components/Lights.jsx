import { useHelper } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useEffect, useRef, useState } from "react"
import { DirectionalLightHelper, Vector3 } from "three"

function Lights({ characterPositionRef }) {
  const lightRef = useRef()

  const [smoothedLightPosition] = useState(new Vector3(0, 0, 200))
  const [smoothedLightTarget] = useState(new Vector3())

  useFrame((state, delta) => {
    const playerPosition = characterPositionRef.current?.translation()
    // make the light follow the char
    if (playerPosition) {
      const lightPosition = new Vector3()
      lightPosition.copy(playerPosition)
      lightPosition.z += 2
      lightPosition.y += 6
      lightPosition.x -= 4

      const lightTarget = new Vector3()
      lightTarget.copy(playerPosition)
      // lightTarget.y += 0.6

      // lerp
      smoothedLightPosition.lerp(lightPosition, 5 * delta)
      smoothedLightTarget.lerp(lightTarget, 5 * delta)

      lightRef.current.position.copy(smoothedLightPosition)
      lightRef.current.target.position.copy(smoothedLightTarget)

      lightRef.current.target.updateMatrixWorld()
    }
  })

  // useHelper(lightRef, DirectionalLightHelper, 1, "red")

  return (
    <>
      <directionalLight ref={lightRef} castShadow position={[0, 6, -2]} intensity={3.5} />
      <ambientLight intensity={1.25} />
    </>
  )
}

export default Lights
