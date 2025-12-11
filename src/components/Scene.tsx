import { Suspense } from 'react'
import { useXR } from '@react-three/xr'
import { OrbitControls, Environment } from '@react-three/drei'
import Forest from './Forest'

export default function Scene() {
  const { mode } = useXR()
  const isVR = mode === 'immersive-vr'

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.3} />

      {/* Environment for better visuals */}
      <Environment preset="forest" />

      {/* Fallback controls for non-VR testing */}
      {!isVR && <OrbitControls makeDefault />}

      {/* Main forest scene */}
      <Suspense fallback={null}>
        <Forest />
      </Suspense>
    </>
  )
}

