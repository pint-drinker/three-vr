import { useState, useEffect } from 'react'
import { XRStore } from '@react-three/xr'

interface EnterVRButtonProps {
  store: XRStore
}

export default function EnterVRButton({ store }: EnterVRButtonProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isPresenting, setIsPresenting] = useState(false)

  useEffect(() => {
    // Check if WebXR is supported
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setIsSupported(supported)
      })
    }

    // Listen for session changes
    const unsubscribe = store.subscribe((state) => {
      setIsPresenting(state.mode === 'immersive-vr')
    })

    // Also check initial state
    setIsPresenting(store.getState().mode === 'immersive-vr')

    return unsubscribe
  }, [store])

  const handleEnterVR = async () => {
    try {
      const state = store.getState()
      if (state.mode === 'immersive-vr') {
        // Already in VR, exit
        await state.session?.end()
      } else {
        // Start VR session
        await store.enterVR()
      }
    } catch (error) {
      console.error('Failed to enter VR:', error)
      alert('Failed to enter VR. Make sure you allow VR permissions when prompted.')
    }
  }

  if (!isSupported) {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '15px 30px',
        backgroundColor: '#ff4444',
        color: 'white',
        borderRadius: '8px',
        zIndex: 1000,
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
      }}>
        WebXR not supported. Please use a VR-compatible browser.
      </div>
    )
  }

  return (
    <button
      onClick={handleEnterVR}
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '15px 30px',
        backgroundColor: isPresenting ? '#ff4444' : '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        zIndex: 1000,
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontWeight: 'bold',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        transition: 'background-color 0.3s'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isPresenting ? '#cc3333' : '#45a049'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isPresenting ? '#ff4444' : '#4CAF50'
      }}
    >
      {isPresenting ? 'Exit VR' : 'Enter VR'}
    </button>
  )
}

