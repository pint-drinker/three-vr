import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

interface InfoBoxProps {
  position: [number, number, number]
  title: string
  description: string
  visible: boolean
}

export default function InfoBox({ position, title, description, visible }: InfoBoxProps) {
  const textRef = useRef<THREE.Group>(null)

  // Make text always face camera
  useFrame(({ camera }) => {
    if (textRef.current) {
      textRef.current.lookAt(camera.position)
    }
  })

  if (!visible) return null

  return (
    <group ref={textRef} position={position}>
      {/* Background plane */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3, 1.5]} />
        <meshBasicMaterial color="black" opacity={0.7} transparent />
      </mesh>
      
      {/* Title */}
      <Text
        position={[0, 0.3, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
      >
        {title}
      </Text>
      
      {/* Description */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
      >
        {description}
      </Text>
    </group>
  )
}

