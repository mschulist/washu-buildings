import React, { useRef, useEffect } from 'react'

export function firstLetterUppercase(str: string) {
  const words = str.split(/[\s-_]+/)
  return words
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export function MapLegend({
  colormap,
  isVisible,
}: {
  colormap: Record<string, string>
  isVisible: boolean
}) {
  const resizableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const resizable = resizableRef.current
    if (!resizable) return

    const onMouseMove = (e: MouseEvent) => {
      const width = e.clientX - resizable.offsetLeft
      const height = e.clientY - resizable.offsetTop
      resizable.style.width = `${width}px`
      resizable.style.height = `${height}px`
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    const onMouseDown = () => {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const resizer = resizable.querySelector('.resizer')
    resizer?.addEventListener('mousedown', onMouseDown)

    return () => {
      resizer?.removeEventListener('mousedown', onMouseDown)
    }
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div
      ref={resizableRef}
      className='relative w-64 h-64 border border-gray-300 overflow-hidden'>
      <div className='z-10 left-3 fixed top-3 overflow-hidden'>
        <ul className='menu bg-base-200 rounded-box w-44 max-h-72 overflow-y-auto'>
          <li>
            <details open>
              <summary>Legend</summary>
              <div className='form-control'>
                {Object.entries(colormap).length > 2 &&
                  Object.entries(colormap).map(([key, value]) => (
                    <label key={key ?? 'other'} className='label'>
                      <span>
                        {key === 'null' ? 'Other' : firstLetterUppercase(key)}
                      </span>
                      <svg width='20' height='20' className='inline-block ml-2'>
                        <circle cx='10' cy='10' r='10' fill={value} />
                      </svg>
                    </label>
                  ))}
              </div>
            </details>
          </li>
        </ul>
      </div>
      <div
        className='resizer w-4 h-4 bg-gray-300 absolute right-0 bottom-0 cursor-se-resize'
        style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}></div>
    </div>
  )
}
