import { BlockProperties } from '@/components/Map'
import { scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import hexRgb from 'hex-rgb'

export type ColormapProps = {
  food: boolean
  blackboard: boolean
  whiteboard: boolean
  printer: boolean
  study_rooms: boolean
}

export const defaultColormapProps: ColormapProps = {
  food: false,
  blackboard: false,
  whiteboard: false,
  printer: false,
  study_rooms: false,
}

function numericToBool(value: number) {
  if (value === 0 || value === null) {
    return false
  }
  return true
}

const binaryColormap = {
  Yes: '#11ff00',
  No: '#ff1100',
} as Record<string, string>

export function CreateColorMap(
  buildings: BlockProperties[],
  props: ColormapProps,
) {
  const nonSelected = Object.values(props).every((value) => !value)
  if (nonSelected) {
    const property = 'department'
    const propertySet = Array.from(new Set(buildings.map((d) => d[property])))

    const colormap = scaleOrdinal(schemeCategory10).domain(propertySet)
    const data = buildings.map((d) => {
      const [r, g, b] = hexRgb(colormap(d[property]), {
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

  const wantedProps = Object.keys(props).filter(
    (prop) => props[prop as keyof ColormapProps],
  ) as (keyof ColormapProps)[]

  const data = buildings.map((d) => {
    const shouldBeLit = wantedProps.every((prop) => {
      return numericToBool(d[prop])
    })

    const [r, g, b] = shouldBeLit
      ? hexRgb(binaryColormap.Yes, { format: 'array' })
      : hexRgb(binaryColormap.No, { format: 'array' })

    return {
      ...d,
      color: [r, g, b],
    }
  })

  return {
    data,
    colormapObj: binaryColormap,
  }
}
