'use client'

import DeckGL, { MapViewState, PickingInfo, PolygonLayer } from 'deck.gl'
import { useEffect, useState } from 'react'
import { Map } from 'react-map-gl/maplibre'
import { useRouter } from 'next/navigation'

export type BlockProperties = {
  height: number
  name: string
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
      const buildings = await fetch('api/getAllBuildings', { method: 'POST' })
        .then((res) => res.json())
        .then((data) => data.data)
      setData(buildings)
    }
    fetchData()
  }, [])

  const mapStyle =
    'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'
  const layers = [
    new PolygonLayer({
      id: 'buildings',
      data: data,
      opacity: 0.8,
      stroked: false,
      selectable: true,
      filled: true,
      extruded: true,
      wireframe: true,
      getElevation: (f) => f.height * 2,
      getPolygon: (f) => f.polygon,
      getLineColor: [255, 255, 255],
      getFillColor: [255, 140, 0],
      pickable: true,
      onClick(pickingInfo: PickingInfo) {
        router.push(`/buildings/${pickingInfo.object.id}`)
      },
    }),
  ]

  return (
    <DeckGL
      layers={layers}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      getTooltip={getTooltip}>
      <Map reuseMaps mapStyle={mapStyle} />
    </DeckGL>
  )
}
