import { useEffect, useRef } from "react"

function Music() {
  const music = useRef(null)

  useEffect(() => {
    music.current = new Audio("/music.mp3")
    music.current.loop = true

    const handleKeyDown = () => {
      if (music.current) {
        music.current.play().catch((err) => console.error("Error al reproducir el audio:", err))
      }

      window.removeEventListener("keydown", handleKeyDown)
    }

    window.addEventListener("keydown", handleKeyDown)

    // Cleanup
    return () => {
      if (music.current) {
        music.current.pause()
        music.current.src = ""
      }
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])
}

export default Music
