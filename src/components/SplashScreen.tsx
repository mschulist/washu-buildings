import React from 'react'

function onEnter() {}

export function SplashScreen() {
  return (
    <>
      <div className='text-center z-10'>
        <h1 className='text-5xl text-white mb-8'>Welcome</h1>
        <button className='btn btn-secondary' onClick={onEnter}>
          Enter
        </button>
      </div>
    </>
  )
}
