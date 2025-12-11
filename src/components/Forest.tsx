import { useMemo } from 'react'
import { SCENE_CONFIG } from '../utils/constants'
import Tree from './Tree'
import Mushroom from './Mushroom'
import Grass from './Grass'

export default function Forest() {
  // Generate random tree positions
  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = []
    const halfSize = SCENE_CONFIG.FOREST_SIZE / 2 - 2
    
    for (let i = 0; i < SCENE_CONFIG.TREE_COUNT; i++) {
      let attempts = 0
      let x: number, z: number
      
      // Ensure trees don't overlap too much
      do {
        x = (Math.random() - 0.5) * SCENE_CONFIG.FOREST_SIZE
        z = (Math.random() - 0.5) * SCENE_CONFIG.FOREST_SIZE
        attempts++
      } while (
        attempts < 50 && 
        positions.some(([px, , pz]) => {
          const dist = Math.sqrt((x - px) ** 2 + (z - pz) ** 2)
          return dist < 3 // Minimum distance between trees
        })
      )
      
      positions.push([x, 0, z])
    }
    
    return positions
  }, [])

  // Generate random mushroom positions
  const mushroomPositions = useMemo(() => {
    const positions: [number, number, number][] = []
    const halfSize = SCENE_CONFIG.FOREST_SIZE / 2
    
    for (let i = 0; i < SCENE_CONFIG.MUSHROOM_COUNT; i++) {
      const x = (Math.random() - 0.5) * SCENE_CONFIG.FOREST_SIZE
      const z = (Math.random() - 0.5) * SCENE_CONFIG.FOREST_SIZE
      positions.push([x, 0, z])
    }
    
    return positions
  }, [])

  return (
    <group>
      {/* Ground and grass */}
      <Grass />

      {/* Trees */}
      {treePositions.map((pos, i) => (
        <Tree key={`tree-${i}`} position={pos} typeIndex={i} />
      ))}

      {/* Mushrooms */}
      {mushroomPositions.map((pos, i) => (
        <Mushroom key={`mushroom-${i}`} position={pos} typeIndex={i} />
      ))}
    </group>
  )
}

