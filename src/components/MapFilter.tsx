import { BuildingModel } from '@/db_utils/constants'

export type MapFilterFuncs = {
  [key: string]: (building: BuildingModel) => boolean
}

export function MapFilter({ filterFuncs }: { filterFuncs: MapFilterFuncs }) {
  filterFuncs['test'] = (building) => {
    return building.name === 'test'
  }
  return (
    <div className='top-3 right-3 fixed z-10'>
      <ul className='menu bg-base-200 rounded-box w-56'>
        <li>
          <details open>
            <summary>Features</summary>
            <div className='form-control'>
              <label className='label cursor-pointer'>
                <span className='label-text'>Filter 1</span>
                <input type='checkbox' checked={false} className='checkbox' />
              </label>
            </div>
          </details>
          <details open>
            <summary>Building Type</summary>
            <div className='form-control'>
              <label className='label cursor-pointer'>
                <span className='label-text'>Filter 1</span>
                <input type='checkbox' checked={false} className='checkbox' />
              </label>
            </div>
          </details>
        </li>
      </ul>
    </div>
  )
}
