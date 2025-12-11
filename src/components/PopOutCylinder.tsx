import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { SCENE_CONFIG } from '../utils/constants'
import InfoBox from './InfoBox'
import * as THREE from 'three'

interface PopOutCylinderProps {
  position: [number, number, number]
  treePosition: [number, number, number]
  visible: boolean
  info: { name: string; description: string }
}

export default function PopOutCylinder({ 
  position, 
  treePosition, 
  visible, 
  info 
}: PopOutCylinderProps) {
  const cylinderRef = useRef<THREE.Mesh>(null)
  const [targetDistance, setTargetDistance] = useState(0)
  const [currentDistance, setCurrentDistance] = useState(0)

  useEffect(() => {
    if (visible) {
      setTargetDistance(SCENE_CONFIG.POP_OUT_DISTANCE)
    } else {
      setTargetDistance(0)
    }
  }, [visible])

  useFrame(() => {
    if (cylinderRef.current) {
      // Smooth animation
      const diff = targetDistance - currentDistance
      setCurrentDistance(currentDistance + diff * SCENE_CONFIG.POP_OUT_SPEED * 10)
      
      // Calculate direction from tree to camera (simplified - behind tree)
      const direction = new THREE.Vector3()
        .subVectors(
          new THREE.Vector3(...position),
          new THREE.Vector3(...treePosition)
        )
        .normalize()
      
      const offset = direction.multiplyScalar(currentDistance)
      cylinderRef.current.position.set(
        treePosition[0] + offset.x,
        treePosition[1] + 1,
        treePosition[2] + offset.z
      )
    }
  })

  if (!visible && currentDistance < 0.1) return null

  const infoBoxPosition: [number, number, number] = [
    treePosition[0],
    treePosition[1] + 2.5 + currentDistance,
    treePosition[2]
  ]

  return (
    <group>
      <mesh ref={cylinderRef} castShadow>
        <cylinderGeometry args={[SCENE_CONFIG.CYLINDER_RADIUS, SCENE_CONFIG.CYLINDER_RADIUS, SCENE_CONFIG.CYLINDER_HEIGHT, 16]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <InfoBox 
        position={infoBoxPosition}
        title={info.name}
        description={info.description}
        visible={visible && currentDistance > 0.1}
      />
    </group>
  )
}

