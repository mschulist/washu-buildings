import React, { useEffect } from 'react'
import { updateSplashRotation } from './Map' // Import the function
import { useState } from 'react'

export function SplashScreen({
  onEnter,
  isVisible,
}: {
  onEnter: () => void
  isVisible: boolean
}) {
  const [fadeOut, setFadeOut] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  useEffect(() => {
    if (isVisible) {
      updateSplashRotation() // Rotate the splash screen when it becomes visible
    }
  }, [isVisible])

  const handleEnter = () => {
    // Start fade out effect
    setFadeOut(true)
    setTimeout(() => {
      setIsHidden(true)
      onEnter() // Call the onEnter after fade-out completes
    }, 500) // Set the duration to match the CSS transition time
  }

  if ((!isVisible && !fadeOut) || isHidden) {
    return null
  }

  return (
    <div
      className={`transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div
        className={`absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      />
      <div className='fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center'>
        <h1 className='text-4xl font text-foreground'>
          Welcome to WashU Campus View
        </h1>
        <button
          className='btn btn-circle btn-outline mt-5'
          onClick={handleEnter}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6'
            fill='currentColor'
            viewBox='0 0 15 15'
            stroke='none'>
            <polygon points='8.29289,2.29289 9.70711,2.29289 14.2071,6.79289 14.2071,8.20711 9.70711,12.7071 8.29289,12.7071 11,8.5 1.5,8.5 1.5,6.5 11,6.5' />
          </svg>
        </button>
      </div>
    </div>
  )
}
