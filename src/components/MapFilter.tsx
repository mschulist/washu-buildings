import { ColormapProps, defaultColormapProps } from '@/map_utils/colormaps'
import { firstLetterUppercase } from './MapLegend'
import { useState } from 'react'

const filterableProps = Object.keys(
  defaultColormapProps,
) as (keyof ColormapProps)[]

export function MapFilter({
  setColormapProperties,
  isVisible,
}: {
  setColormapProperties: (newProperties: ColormapProps) => void
  isVisible: boolean
}) {
  const [allFilters, setAllFilters] =
    useState<ColormapProps>(defaultColormapProps)

  if (!isVisible) {
    return null
  }

  function reverseFilter(property: keyof ColormapProps) {
    const newFilters = { ...allFilters }
    newFilters[property] = !newFilters[property]
    setAllFilters(newFilters)
    setColormapProperties(
      Object.fromEntries(
        Object.entries(newFilters).map(([key, value]) => [key, value]),
      ) as ColormapProps,
    )
  }

  return (
    <div className='top-3 right-3 fixed z-10'>
      <ul className='menu bg-base-200 rounded-box w-44'>
        <li>
          <details open>
            <summary>Filter</summary>
            <div className='form-control'>
              {filterableProps.map((prop) => (
                <label key={prop} className='label cursor-pointer'>
                  <button
                    name='colormapProperty'
                    // style={{
                    //   background: allFilters[prop] ? '#3beb7c' : 'none' ,
                    //   color: allFilters[prop] ? 'black !important' : 'white'
                    // }}
                    className={
                      allFilters[prop]
                        ? 'btn btn-outline btn-accent w-full'
                        : 'btn w-full'
                    }
                    onClick={() => reverseFilter(prop)}>
                    <span className='label-text'>
                      {prop === 'last_class'
                        ? 'Has Classes'
                        : firstLetterUppercase(prop)}
                    </span>
                  </button>
                </label>
              ))}
            </div>
          </details>
        </li>
      </ul>
    </div>
  )
}
