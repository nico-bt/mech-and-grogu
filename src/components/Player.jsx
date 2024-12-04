import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { CapsuleCollider, RigidBody, vec3 } from "@react-three/rapier"
import { useEffect, useRef, useState } from "react"
import { MathUtils, Vector3 } from "three"
import { degToRad } from "three/src/math/MathUtils.js"
import Lights from "./Lights"

const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI
  while (angle < -Math.PI) angle += 2 * Math.PI
  return angle
}

const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start)
  end = normalizeAngle(end)

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI
    } else {
      end += 2 * Math.PI
    }
  }

  return normalizeAngle(start + (end - start) * t)
}

export default function Player({ setKeyForResetFigures, setHideInitialText }) {
  const WALK_SPEED = 7
  const RUN_SPEED = 17
  const ROTATION_SPEED = degToRad(1)

  const rb = useRef()
  const container = useRef()
  const character = useRef()

  const player = useGLTF("/bipedal_mech.glb")
  const { actions } = useAnimations(player.animations, container)
  const [animation, setAnimation] = useState("Armature|Idle")

  const [chocandoConGideon, setChocandoConGideon] = useState(false)

  //SHADOWS
  useEffect(() => {
    player.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [player])

  const characterRotationTarget = useRef(0)
  const rotationTarget = useRef(0)
  const cameraTarget = useRef()
  const cameraPosition = useRef()
  const cameraWorldPosition = useRef(new Vector3())
  const cameraLookAtWorldPosition = useRef(new Vector3())
  const cameraLookAt = useRef(new Vector3())
  const [, get] = useKeyboardControls()
  const isClicking = useRef(false)

  useEffect(() => {
    const onMouseDown = (e) => {
      isClicking.current = true
    }
    const onMouseUp = (e) => {
      isClicking.current = false
    }
    document.addEventListener("mousedown", onMouseDown)
    document.addEventListener("mouseup", onMouseUp)
    // touch
    document.addEventListener("touchstart", onMouseDown)
    document.addEventListener("touchend", onMouseUp)
    return () => {
      document.removeEventListener("mousedown", onMouseDown)
      document.removeEventListener("mouseup", onMouseUp)
      document.removeEventListener("touchstart", onMouseDown)
      document.removeEventListener("touchend", onMouseUp)
    }
  }, [])

  useFrame(({ camera, mouse }) => {
    if (rb.current) {
      const vel = rb.current.linvel()

      const movement = {
        x: 0,
        z: 0,
      }

      if (get().forward) {
        movement.z = 1
      }
      if (get().backward) {
        movement.z = -1
      }

      let speed = get().run ? RUN_SPEED : WALK_SPEED

      if (isClicking.current) {
        setAnimation("Armature|Walk")
        // console.log("clicking", mouse.x, mouse.y)
        if (Math.abs(mouse.x) > 0.1) {
          movement.x = -mouse.x
        }
        movement.z = mouse.y + 0.4
        if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
          speed = RUN_SPEED
        }
      }

      if (get().left) {
        movement.x = 1
      }
      if (get().right) {
        movement.x = -1
      }

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z)
        vel.x = Math.sin(rotationTarget.current + characterRotationTarget.current) * speed
        vel.z = Math.cos(rotationTarget.current + characterRotationTarget.current) * speed
        if (speed === RUN_SPEED) {
          // setAnimation("Armature|Run")
          actions["Armature|Walk"].timeScale = 1.6
          setAnimation("Armature|Walk")
        } else {
          actions["Armature|Walk"].timeScale = 1
          setAnimation("Armature|Walk")
        }
      } else {
        setAnimation("Armature|Idle")
      }

      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1
      )

      if (!chocandoConGideon) {
        rb.current.setLinvel(vel, true)
      } else {
        rb.current.setLinvel({ x: 0, y: 0, z: 50 }, true)
      }

      if (get().jump) {
        // setAnimation("Armature|InAir")
        // rb.current.applyImpulse({ x: 0, y: 6, z: 0 })
        // setAnimation("Armature|InAir")
        // setAnimation("Armature|JumpStart")
      }
    }

    // CAMERA
    container.current.rotation.y = MathUtils.lerp(
      container.current.rotation.y,
      rotationTarget.current,
      0.1
    )

    cameraPosition.current.getWorldPosition(cameraWorldPosition.current)
    camera.position.lerp(cameraWorldPosition.current, 0.1)

    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current)
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1)
      camera.lookAt(cameraLookAt.current)
    }

    // If player falls, fix camera to see the fall
    const playerPosition = rb.current?.translation()
    if (playerPosition) {
      if (playerPosition.y < -40) {
        camera.position.lerp({ ...cameraWorldPosition.current, y: -30 }, 0.1)
      }

      if (playerPosition.y < -150) {
        setKeyForResetFigures((prev) => prev + 1)
        // Reset Position and velocities (Linear & Angular)
        rb.current.setLinvel({ x: 0, y: 0, z: 0 })
        rb.current.setAngvel({ x: 0, y: 0, z: 0 })
        rb.current.setTranslation({ x: 0, y: 12, z: 30 })
      }

      // Hide initial text when player is far from bunker
      if (playerPosition.z < -24) {
        setHideInitialText(true)
      }
    }
  })

  // CHARACTER ANIMATION
  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.24).play()
    return () => actions?.[animation]?.fadeOut(0.24)
  }, [animation, actions])

  // CHOQUE CONTRA GIDEON
  const collisionHandler = (e) => {
    if (e.colliderObject.name === "gideon") {
      setChocandoConGideon(true)
      setTimeout(() => setChocandoConGideon(false), 5000)
    }
  }

  return (
    <>
      {/* Para pasarle la posicion del char y seguirlo en vez de a la camera */}
      <Lights characterPositionRef={rb} />

      <RigidBody
        colliders={false}
        lockRotations
        ref={rb}
        position={[2.5, 2, 32]}
        gravityScale={2}
        onCollisionEnter={collisionHandler}
        type="dynamic"
        name="mecha"
      >
        <group ref={container}>
          <group ref={cameraTarget} position-z={6} />
          <group ref={cameraPosition} position-y={6} position-z={-12} />
          {/* CHARACTER */}
          <group ref={character}>
            <primitive
              object={player.scene}
              scale={0.4}
              rotation={[0, 0, 0]}
              position={[0, -3.1, 0]}
            />
          </group>
        </group>
        <CapsuleCollider args={[1.25, 1.75, 1.5]} name="mecha" />
      </RigidBody>
    </>
  )
}
