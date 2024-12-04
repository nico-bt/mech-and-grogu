import { Text } from "@react-three/drei"
import * as THREE from "three"
import { Map } from "./Map"
import { Grogu } from "./Grogu"
import Stormtropers from "./Stormtroper"
import Bunker from "./Bunker"
import Ship from "./Ship"
import Gideon from "./Gideon"
// THREE.ColorManagement.legacyMode = false

function InitialText({ position = [12, 8.5, 46] }) {
  return (
    <group position={position}>
      <Text
        fontWeight={800}
        letterSpacing={0.03}
        scale={2.5}
        position={[-2.9, 1.7, 3]}
        maxWidth={0.25}
        lineHeight={1.1}
        rotation={[0.25, 3.14, 0]}
      >
        <meshBasicMaterial toneMapped={false} />
        <Text position={[0, 1.25, 0]}>⬆️</Text>
        <Text>⬅️⬇️➡️</Text>
        <Text scale={0.6} position={[0, -2.25, 0]}>
          Hold Shift: Run
        </Text>
        <Text fontWeight={200} scale={1.25} position={[0, -1.25, 0]}>
          ⌨️
        </Text>
      </Text>
    </group>
  )
}

function Level({ hideInitialText }) {
  return (
    <>
      {!hideInitialText && <InitialText />}

      <group rotation={[0, 3.14, 0]}>
        <Bunker />
        <Map />
        <Grogu />
        <Stormtropers />
        <Gideon />
        <Ship />
      </group>
    </>
  )
}

export default Level
