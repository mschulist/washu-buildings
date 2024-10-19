import { ColormapProps } from '@/map_utils/colormaps'
import { firstLetterUppercase } from './MapLegend'

export const filterableProps = [
  'department',
  'food',
  'blackboard',
  'whiteboard',
  'printer',
  'study_rooms',
]

export function MapFilter({
  colormapProperty,
  setColormapProperty,
}: {
  colormapProperty: string
  setColormapProperty: (newProperty: ColormapProps) => void
}) {
  return (
    <div className='top-3 right-3 fixed z-10'>
      <ul className='menu bg-base-200 rounded-box w-56'>
        <li>
          <details open>
            <summary>Filter</summary>
            <div className='form-control'>
              {filterableProps.map((prop) => (
                <label key={prop} className='label cursor-pointer'>
                  <span className='label-text'>
                    {firstLetterUppercase(prop)}
                  </span>
                  <input
                    type='radio'
                    name='colormapProperty'
                    value={prop}
                    checked={colormapProperty === prop}
                    className='radio'
                    onChange={() => setColormapProperty(prop as ColormapProps)}
                  />
                </label>
              ))}
            </div>
          </details>
        </li>
      </ul>
    </div>
  )
}
