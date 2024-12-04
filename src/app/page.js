"use client"
import Level from "@/components/Level"
import Lights from "@/components/Lights"
import Music from "@/components/Music"
import Player from "@/components/Player"
import { Environment, KeyboardControls, Loader, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { useControls } from "leva"
import { Suspense, useState } from "react"

export default function Home() {
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "left", keys: ["ArrowLeft", "KeyA"] },
    { name: "right", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
  ]

  const [keyForResetFigures, setKeyForResetFigures] = useState(1)

  return (
    <>
      <Canvas style={{ touchAction: "none" }} shadows>
        <Suspense fallback={null}>
          {/* <OrbitControls /> */}
          <Environment
            background
            files="/sky_04.hdr"
            backgroundRotation={[0, -2, 0]}
            backgroundIntensity={0.8}
          />

          <Physics>
            <KeyboardControls map={keyboardMap}>
              {/* <Lights /> */}
              <Player setKeyForResetFigures={setKeyForResetFigures} />
              <Level key={keyForResetFigures} />
            </KeyboardControls>
          </Physics>
        </Suspense>
      </Canvas>

      <Music />
      <Loader />
    </>
  )
}
