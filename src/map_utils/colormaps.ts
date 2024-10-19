import { BlockProperties } from '@/components/Map'
import { BuildingModel } from '@/db_utils/constants'
import { scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import hexRgb from 'hex-rgb'

export function CreateColorMap(buildings: BlockProperties[]) {
  const departments = Array.from(new Set(buildings.map((d) => d.department)))
  const colormap = scaleOrdinal(schemeCategory10).domain(departments)
  const data = buildings.map((d) => {
    const [r, g, b] = hexRgb(colormap(d.department), { format: 'array' })
    return {
      ...d,
      color: [r, g, b],
    }
  })
  const colormapObj = departments.reduce(
    (acc, d) => {
      acc[d] = colormap(d)
      return acc
    },
    {} as Record<string, string>,
  )
  return { colormapObj, data }
}
