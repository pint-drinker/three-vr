import { useMemo } from 'react'
import { SCENE_CONFIG } from '../utils/constants'

export default function Grass() {
  const grassPositions = useMemo(() => {
    const positions: [number, number, number][] = []
    
    for (let i = 0; i < SCENE_CONFIG.GRASS_DENSITY; i++) {
      const x = (Math.random() - 0.5) * SCENE_CONFIG.FOREST_SIZE
      const z = (Math.random() - 0.5) * SCENE_CONFIG.FOREST_SIZE
      positions.push([x, 0, z])
    }
    
    return positions
  }, [])

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[SCENE_CONFIG.FOREST_SIZE, SCENE_CONFIG.FOREST_SIZE]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>

      {/* Grass blades as simple geometry */}
      {grassPositions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, Math.random() * Math.PI * 2, 0]}>
          <boxGeometry args={[0.05, 0.2, 0.05]} />
          <meshStandardMaterial color="#3d7a1f" />
        </mesh>
      ))}
    </group>
  )
}

