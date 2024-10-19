export function firstLetterUppercase(str: string) {
  const words = str.split(/[\s-_]+/)
  return words
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export function MapLegend({ colormap }: { colormap: Record<string, string> }) {
  return (
    <div className='z-10 left-3 fixed top-3'>
      <ul className='menu bg-base-200 rounded-box w-44 max-h-72 overflow-y-auto'>
        <li>
          <details open>
            <summary>Legend</summary>
            <div className='form-control'>
              {Object.entries(colormap).map(([key, value]) => (
                <label key={key ?? 'other'} className='label'>
                  <span>
                    {key === 'null' ? 'Other' : firstLetterUppercase(key)}
                  </span>
                  <svg
                    width='20'
                    height='20'
                    style={{ display: 'inline-block', marginLeft: '8px' }}>
                    <circle cx='10' cy='10' r='10' fill={value} />
                  </svg>
                </label>
              ))}
            </div>
          </details>
        </li>
      </ul>
    </div>
  )
}
