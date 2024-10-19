import { BlockProperties } from '@/components/Map'
import { scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import hexRgb from 'hex-rgb'

export type ColormapProps =
  | 'department'
  | 'food'
  | 'blackboard'
  | 'whiteboard'
  | 'printer'
  | 'study_rooms'

function numericToCategory(value: number | string) {
  if (typeof value === 'string') {
    return value
  }
  if (value === 0) {
    return 'No'
  } else if (value === -1 || value === null) {
    return 'Unknown'
  }
  return 'Yes'
}

export function CreateColorMap(
  buildings: BlockProperties[],
  property: ColormapProps,
) {
  const propertySet = Array.from(
    new Set(buildings.map((d) => numericToCategory(d[property]))),
  )
  const colormap = scaleOrdinal(schemeCategory10).domain(propertySet)
  const data = buildings.map((d) => {
    const [r, g, b] = hexRgb(colormap(numericToCategory(d[property])), {
      format: 'array',
    })
    return {
      ...d,
      color: [r, g, b],
    }
  })
  const colormapObj = propertySet.reduce(
    (acc, d) => {
      acc[d] = colormap(d)
      return acc
    },
    {} as Record<string, string>,
  )
  return { colormapObj, data }
}
