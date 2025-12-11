import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useXRInputSourceStates } from '@react-three/xr'
import { SCENE_CONFIG, TREE_TYPES } from '../utils/constants'
import PopOutCylinder from './PopOutCylinder'
import * as THREE from 'three'

interface TreeProps {
  position: [number, number, number]
  typeIndex: number
}

export default function Tree({ position, typeIndex }: TreeProps) {
  const treeRef = useRef<THREE.Group>(null)
  const [isHovered, setIsHovered] = useState(false)
  const { gl } = useThree()
  const inputSources = useXRInputSourceStates()
  
  // Filter to get only controller input sources
  const controllers = inputSources.filter(src => src.inputSource.targetRayMode === 'tracked-pointer')

  const treeInfo = TREE_TYPES[typeIndex % TREE_TYPES.length]
  
  // Helper to get world position from XRSpace
  const getSpaceWorldPosition = (space: XRSpace | null | undefined, out: THREE.Vector3): boolean => {
    if (!space || !gl.xr) return false
    const frame = gl.xr.getFrame()
    if (!frame) return false
    const referenceSpace = gl.xr.getReferenceSpace()
    if (!referenceSpace) return false
    const pose = frame.getPose(space, referenceSpace)
    if (!pose) return false
    const matrix = new THREE.Matrix4().fromArray(pose.transform.matrix)
    out.setFromMatrixPosition(matrix)
    return true
  }

  useFrame(() => {
    if (!treeRef.current || !controllers.length) return

    // Check distance from controllers to tree
    let hovered = false
    for (const controller of controllers) {
      const inputSource = controller.inputSource
      const targetRaySpace = inputSource.targetRaySpace
      if (!targetRaySpace) continue
      
      const controllerPosition = new THREE.Vector3()
      if (getSpaceWorldPosition(targetRaySpace, controllerPosition)) {
        const treePos = new THREE.Vector3(...position)
        const distance = controllerPosition.distanceTo(treePos)
        
        if (distance < SCENE_CONFIG.HOVER_DISTANCE) {
          hovered = true
          break
        }
      }
    }

    setIsHovered(hovered)
  })

  return (
    <group ref={treeRef} position={position}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>

      {/* Foliage - simple cone shape */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <coneGeometry args={[1.2, 2, 8]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>

      {/* Pop-out cylinder */}
      <PopOutCylinder
        position={[0, 0, 0]}
        treePosition={position}
        visible={isHovered}
        info={treeInfo}
      />
    </group>
  )
}

