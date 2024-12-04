import { useGLTF } from "@react-three/drei"

export function Grogu() {
  const model = useGLTF("/baby_yoda.glb")

  return (
    <primitive object={model.scene} scale={8} rotation={[0, 0, 0]} position={[0, -4.125, -42]} />
  )
}
