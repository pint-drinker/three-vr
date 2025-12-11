import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useXRInputSourceStates } from '@react-three/xr'
import { SCENE_CONFIG, MUSHROOM_TYPES } from '../utils/constants'
import InfoBox from './InfoBox'
import * as THREE from 'three'

interface MushroomProps {
  position: [number, number, number]
  typeIndex: number
}

export default function Mushroom({ position, typeIndex }: MushroomProps) {
  const mushroomRef = useRef<THREE.Group>(null)
  const originalPosition = useRef<THREE.Vector3>(new THREE.Vector3(...position))
  const [isGrabbed, setIsGrabbed] = useState(false)
  const [isRayGrabbed, setIsRayGrabbed] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [pullProgress, setPullProgress] = useState(0)
  const { gl } = useThree()
  const inputSources = useXRInputSourceStates()
  
  // Filter to get only controller input sources
  const controllers = inputSources.filter(src => 
    src.inputSource.targetRayMode === 'tracked-pointer'
  )
  
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
  
  // Helper to get world direction from XRSpace
  const getSpaceWorldDirection = (space: XRSpace | null | undefined, out: THREE.Vector3): boolean => {
    if (!space || !gl.xr) return false
    const frame = gl.xr.getFrame()
    if (!frame) return false
    const referenceSpace = gl.xr.getReferenceSpace()
    if (!referenceSpace) return false
    const pose = frame.getPose(space, referenceSpace)
    if (!pose) return false
    const matrix = new THREE.Matrix4().fromArray(pose.transform.matrix)
    const direction = new THREE.Vector3(0, 0, -1).applyMatrix4(matrix)
    out.copy(direction.normalize())
    return true
  }

  const mushroomInfo = MUSHROOM_TYPES[typeIndex % MUSHROOM_TYPES.length]

  // Handle select start (grab) - using pointer events
  const handleSelectStart = () => {
    if (!mushroomRef.current) return
    
    const mushroomPos = new THREE.Vector3()
    mushroomRef.current.getWorldPosition(mushroomPos)
    
    // Find closest controller
    let closestController: typeof controllers[0] | null = null
    let closestDistance = Infinity
    
    for (const controller of controllers) {
      const inputSource = controller.inputSource
      if (inputSource.targetRaySpace) {
        const controllerPosition = new THREE.Vector3()
        if (getSpaceWorldPosition(inputSource.targetRaySpace, controllerPosition)) {
          const distance = controllerPosition.distanceTo(mushroomPos)
          
          if (distance < closestDistance) {
            closestDistance = distance
            closestController = controller
          }
        }
      }
    }
    
    // Only direct grab if close enough
    if (closestController && closestDistance < SCENE_CONFIG.GRAB_DISTANCE) {
      setIsGrabbed(true)
      setShowInfo(true)
    }
  }

  // Handle select end (release)
  const handleSelectEnd = () => {
    setIsGrabbed(false)
    if (!isRayGrabbed) {
      setShowInfo(false)
    }
  }

  useFrame(() => {
    if (!mushroomRef.current || !controllers.length) return

    const mushroomPos = new THREE.Vector3()
    mushroomRef.current.getWorldPosition(mushroomPos)
    let closestControllerSpace: XRSpace | null = null
    let closestDistance = Infinity
    let rayIntersection = false

    // Check each controller for ray grab (when trigger is pressed)
    for (const controller of controllers) {
      const inputSource = controller.inputSource
      const targetRaySpace = inputSource.targetRaySpace
      if (!targetRaySpace) continue
      
      const controllerPosition = new THREE.Vector3()
      if (!getSpaceWorldPosition(targetRaySpace, controllerPosition)) continue
      
      const distance = controllerPosition.distanceTo(mushroomPos)
      
      // Check if controller is pointing at mushroom (ray grab)
      const raycaster = new THREE.Raycaster()
      const direction = new THREE.Vector3()
      if (!getSpaceWorldDirection(targetRaySpace, direction)) continue
      
      raycaster.set(controllerPosition, direction)
      
      const intersection = raycaster.intersectObject(mushroomRef.current, true)
      if (intersection.length > 0 && distance > SCENE_CONFIG.GRAB_DISTANCE && distance < SCENE_CONFIG.RAY_GRAB_DISTANCE) {
        // Check if trigger is pressed for ray grab
        const gamepad = inputSource.gamepad
        if (gamepad && gamepad.buttons[0]?.pressed) {
          rayIntersection = true
          if (distance < closestDistance) {
            closestDistance = distance
            closestControllerSpace = targetRaySpace
          }
        }
      }
    }

    // Handle ray grab
    if (rayIntersection && closestControllerSpace && !isGrabbed) {
      if (!isRayGrabbed) {
        setIsRayGrabbed(true)
        setShowInfo(true)
      }
      
      // Pull mushroom closer
      if (pullProgress < 1) {
        const newProgress = Math.min(pullProgress + SCENE_CONFIG.PULL_SPEED * 2, 1)
        setPullProgress(newProgress)
        
        // Interpolate position toward controller
        const controllerPosition = new THREE.Vector3()
        if (getSpaceWorldPosition(closestControllerSpace, controllerPosition)) {
          const targetPosition = controllerPosition.clone().add(
            new THREE.Vector3(0, -0.5, -0.5) // Offset in front of controller
          )
          
          const startPos = originalPosition.current.clone()
          const newPos = startPos.lerp(targetPosition, newProgress)
          mushroomRef.current.position.set(newPos.x, newPos.y, newPos.z)
        }
      }
    } else if (!rayIntersection && isRayGrabbed) {
      // Reset ray grab
      setIsRayGrabbed(false)
      setShowInfo(false)
      setPullProgress(0)
      mushroomRef.current.position.set(...originalPosition.current.toArray())
    }

    // Handle direct grab - attach to controller
    if (isGrabbed && controllers.length > 0) {
      const controller = controllers[0]
      const inputSource = controller.inputSource
      const gripSpace = inputSource.gripSpace || inputSource.targetRaySpace
      if (gripSpace && gl.xr) {
        const controllerPosition = new THREE.Vector3()
        if (getSpaceWorldPosition(gripSpace, controllerPosition)) {
          const offset = new THREE.Vector3(0, -0.3, -0.5)
          // Get rotation from space
          const frame = gl.xr.getFrame()
          if (frame) {
            const referenceSpace = gl.xr.getReferenceSpace()
            if (referenceSpace) {
              const pose = frame.getPose(gripSpace, referenceSpace)
              if (pose) {
                const matrix = new THREE.Matrix4().fromArray(pose.transform.matrix)
                const quaternion = new THREE.Quaternion().setFromRotationMatrix(matrix)
                offset.applyQuaternion(quaternion)
                mushroomRef.current.position.copy(controllerPosition).add(offset)
                mushroomRef.current.quaternion.copy(quaternion)
              }
            }
          }
        }
      }
    } else if (!isGrabbed && !isRayGrabbed) {
      // Reset position if not grabbed
      mushroomRef.current.position.set(...originalPosition.current.toArray())
    }
  })

  return (
    <group 
      ref={mushroomRef} 
      position={position}
      onPointerDown={handleSelectStart}
      onPointerUp={handleSelectEnd}
    >
      {/* Stem */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.3, 8]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>

      {/* Cap */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={typeIndex % 2 === 0 ? "#ff4444" : "#8b4513"} 
        />
      </mesh>

      {/* Spots on cap (for some types) */}
      {typeIndex % 2 === 0 && (
        <>
          <mesh position={[0.08, 0.4, 0.08]} castShadow>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.1, 0.38, 0.1]} castShadow>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </>
      )}

      {/* Info box - follows mushroom position */}
      <InfoBox
        position={[0, 0.8, 0]}
        title={mushroomInfo.name}
        description={mushroomInfo.description}
        visible={showInfo}
      />
    </group>
  )
}

