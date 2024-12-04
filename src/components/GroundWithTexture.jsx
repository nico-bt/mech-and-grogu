import { useTexture } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import { RepeatWrapping } from "three"

export function Ground() {
  const propsTexture = useTexture({
    map: "textures/textures/asphalt_02_diff_1k.jpg",
    normalMap: "textures/textures/asphalt_02_nor_gl_1k.jpg",
    roughnessMap: "textures/textures/asphalt_02_rough_1k.jpg",
  })

  // Clonar textura para usar en landing (si no cambia las dos juntas)
  let propsTextureLanding = { ...propsTexture }
  propsTextureLanding = Object.keys(propsTexture).reduce((acc, key) => {
    acc[key] = propsTexture[key].clone()
    return acc
  }, {})

  // Repetición y rotación para cada textura
  Object.values(propsTexture).forEach((texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping // Permitir repetición
    texture.repeat.set(1, 10) // Ajustar la cantidad de repeticiones
    // texture.rotation = Math.PI / 2 // Rotar 90 grados
    texture.center.set(0.5, 0.5) // Centrar la rotación
  })

  Object.values(propsTextureLanding).forEach((texture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping // Permitir repetición
    texture.repeat.set(2.6, 12) // Ajustar la cantidad de repeticiones
    // texture.rotation = Math.PI / 2 // Rotar 90 grados
    texture.center.set(0.5, 0.5) // Centrar la rotación
  })

  return (
    <>
      {/* Bridge */}
      <mesh position={[0, -1.1, 90]} receiveShadow>
        <boxGeometry args={[22, 1, 260]} />
        <meshStandardMaterial {...propsTexture} envMapIntensity={0.3} />
      </mesh>

      {/* Landing ship */}
      <RigidBody type="fixed" colliders="hull">
        <mesh position={[0, -30.5, 277]} receiveShadow>
          <cylinderGeometry args={[70, 10, 60, 32]} />
          <meshStandardMaterial {...propsTextureLanding} envMapIntensity={0.25} />
        </mesh>
      </RigidBody>
    </>
  )
}
