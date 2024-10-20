import React from 'react'
import { MapFilter } from './MapFilter'
import { MapLegend } from './MapLegend'


function onEnter() {
  // Handle the enter action here
  setVisible(true)
}

export function SplashScreen({
  
}: {
  setSplashActive: (active: boolean) => void
}) {
  return (
    <>
    {splashActive && <SplashScreen setSplashActive={setSplashActive} />}
      {/* Background blur layer */}
      <div className='fixed top-0 left-0 w-full h-full bg-opacity-75 backdrop-blur-sm' />
      {/* Splash screen content */}
      <div className='fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center'>
        <h1 className='text-4xl font text-foreground'>
          Welcome to WashU Campus View
        </h1>
        <button
          className='btn btn-secondary mt-4'
          onClick={() => {
            setSplashActive(false) // Set splash screen inactive
            onEnter()
          }}>
          Enter
        </button>
      </div>
    </>
  )
}