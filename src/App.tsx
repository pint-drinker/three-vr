import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { XR, createXRStore } from '@react-three/xr'
import Scene from './components/Scene'
import EnterVRButton from './components/EnterVRButton'

function App() {
  // Create XR store with default controllers and hands enabled
  const store = useMemo(() => createXRStore({
    controller: true, // Enable controllers
    hand: true, // Enable hand tracking
  }), [])

  return (
    <>
      <EnterVRButton store={store} />
      <Canvas
        camera={{ position: [0, 1.6, 0], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]} // Limit pixel ratio for performance
      >
        <XR store={store}>
          <Scene />
        </XR>
      </Canvas>
    </>
  )
}

export default App

