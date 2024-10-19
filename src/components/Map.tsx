'use client'

import DeckGL, { MapViewState, PickingInfo, PolygonLayer } from 'deck.gl'
import { useEffect, useState } from 'react'
import { Map } from 'react-map-gl/maplibre'
import { useRouter } from 'next/navigation'
import { MapLegend } from './MapLegend'
import { ColormapProps, CreateColorMap } from '@/map_utils/colormaps'
import { MapFilter } from './MapFilter'

export type BlockProperties = {
  height: number
  name: string
  department: string
  food: number
  blackboard: number
  whiteboard: number
  printer: number
  study_rooms: number
}

function getTooltip({ object }: PickingInfo) {
  if (!object) {
    return null
  }
  return (
    object && {
      html: `\
        <div><b>Name</b></div>
        <div>${object.name}</div>
    `,
    }
  )
}

export function MapBox() {
  const [data, setData] = useState<BlockProperties[]>([])
  const [colormap, setColormap] = useState<Record<string, string>>({})
  const [filteredProperty, setFilteredProperty] =
    useState<ColormapProps>('department')

  const router = useRouter()

  const INITIAL_VIEW_STATE: MapViewState = {
    latitude: 38.648228271786266,
    longitude: -90.30847514088006,
    zoom: 15,
    pitch: 45,
    bearing: 0,
  }

  useEffect(() => {
    async function fetchData() {
      const buildings = (await fetch('api/getAllBuildings', { method: 'POST' })
        .then((res) => res.json())
        .then((data) => data.data)) as BlockProperties[]

      const { colormapObj, data } = CreateColorMap(buildings, filteredProperty)
      setColormap(colormapObj)
      setData(data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const { colormapObj, data: d } = CreateColorMap(data, filteredProperty)
    setColormap(colormapObj)
    setData(d)
  }, [filteredProperty])

  const mapStyle =
    'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'
  const layers = [
    new PolygonLayer({
      id: 'buildings',
      data: data,
      opacity: 0.75,
      stroked: false,
      selectable: true,
      filled: true,
      extruded: true,
      wireframe: true,
      getElevation: (f) => f.height * 2,
      getPolygon: (f) => f.polygon,
      getLineColor: [255, 255, 255],
      getFillColor: (f) => f.color,
      pickable: true,
      onClick(pickingInfo: PickingInfo) {
        router.push(`/buildings/${pickingInfo.object.id}`)
      },
    }),
  ]

  return (
    <>
      <MapLegend colormap={colormap} />
      <MapFilter
        colormapProperty={filteredProperty}
        setColormapProperty={setFilteredProperty}
      />
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        getTooltip={getTooltip}>
        <Map reuseMaps mapStyle={mapStyle} />
      </DeckGL>
    </>
  )
}
