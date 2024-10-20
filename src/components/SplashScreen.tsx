import React, { useState } from 'react';
import { MapFilter } from './MapFilter'; // Adjust the import path as necessary

function onEnter() {
  // Handle the enter action here
}

export function SplashScreen({ setSplashActive }: { setSplashActive: (active: boolean) => void }) {
  return (
    <>
      {/* Background blur layer */}
      <div className="fixed top-0 left-0 w-full h-full bg-background bg-opacity-75 backdrop-blur-sm" />
      {/* Splash screen content */}
      <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-foreground">WashU Campus View!</h1>
        <button
          className="btn btn-secondary mt-4"
          onClick={() => {
            setSplashActive(false); // Set splash screen inactive
            onEnter();
          }}
        >
          Enter
        </button>
      </div>
    </>
  );
}
