import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Lights() {
  const light = useRef()

  useFrame((state) => {
    // Движение света за камерой
    // Three.js обновляет только те объекты, что находятся на сцене,
    // Поэтому принудительно используем updateMatrixWorld()
    //  - 4 используем, чтобы шадоумап не была позади игрока, вместе с тем оптимизируем освещение
    light.current.position.z = state.camera.position.z + 1 - 4
    light.current.target.position.z = state.camera.position.z - 4
    light.current.target.updateMatrixWorld()
  })

  return (
    <>
      <directionalLight
        ref={light}
        castShadow
        position={[4, 4, 1]}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
      />
      <ambientLight intensity={0.5} />
    </>
  )
}
