'use client'

import DeckGL, {
  MapViewState,
  PickingInfo,
  PolygonLayer,
  TripsLayer,
} from 'deck.gl'
import { useEffect, useState } from 'react'
import { Map } from 'react-map-gl/maplibre'
import { useRouter } from 'next/navigation'
import { MapLegend } from './MapLegend'
import StaticMap from 'react-map-gl'
import {
  ColormapProps,
  CreateColorMap,
  defaultColormapProps,
} from '@/map_utils/colormaps'
import { MapFilter } from './MapFilter'
import { Building } from './Building'
import { Popup } from 'react-map-gl'
import { MapProvider } from 'react-map-gl'

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

// Source: https://parking.wustl.edu/items/campus-circulator/
const pickupCenters = [
  [-90.314975, 38.645516], // Lee house
  [-90.312681, 38.64527], // Zetcher house
  [-90.309577, 38.647031], // Mallinckrodt Center
  [-90.306319, 38.646744], // Goldfrab Hall
  [-90.30405, 38.64764], // Sumers Welcome Center Pavillion
  [-90.300861, 38.648853], // Young Archway
  [-90.311765, 38.650132], // Washington University School of Law Library
  [-90.313425, 38.650318], // Lot 29
]

function radians(degrees: number) {
  return (degrees * Math.PI) / 180
}

const pickupPolygons = pickupCenters.map((center) => {
  const N = 24
  const r = 0.0001
  return Array.from({ length: N }, (_, i) => {
    let theta = (2.0 * Math.PI * i) / N
    return [
      center[0] + r * Math.cos(theta),
      center[1] + r * Math.sin(theta) * Math.cos(radians(center[1])),
    ]
  })
})

const pickUpData = pickupPolygons.map((polygon) => {
  return {
    height: 6.0,
    polygon,
  }
})

function distance(a: [number, number], b: [number, number]) {
  const center_lat = (a[1] + b[1]) / 2
  return Math.hypot(
    a[0] - b[0],
    (a[1] - b[1]) / Math.cos(radians(center_lat)),
    // a[0] - b[0],
    // a[1] - b[1],
  )
}

function makeTrip(path: [number, number][]) {
  // Total distance from start to this point in the path
  let distances: number[] = []

  let prev: [number, number] | null = null
  for (const point of path) {
    if (prev === null) distances.push(0)
    else distances.push(distances[distances.length - 1] + distance(point, prev))

    prev = point
  }

  // Normalized distance from start to this point in the path
  distances = distances.map((x) => x / distances[distances.length - 1])

  return {
    path,
    timestamps: distances,
  }
}

let trips = [
  makeTrip([
    [-90.314975, 38.645516], // Lee house
    [-90.312681, 38.64527], // Zetcher house
    [-90.309577, 38.647031], // Mallinckrodt Center
    [-90.306319, 38.646744], // Goldfrab Hall
    [-90.30405, 38.64764], // Sumers Welcome Center Pavillion
    [-90.300861, 38.648853], // Young Archway
    [-90.311765, 38.650132], // Washington University School of Law Library
    [-90.313425, 38.650318], // Lot 29
  ]),
]

const trailLength = 100

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
      className: 'rounded-xl',
    }
  )
}

export function MapBox() {
  const [data, setData] = useState<BlockProperties[]>([])
  const [colormap, setColormap] = useState<Record<string, string>>({})
  const [colormapProperty, setColormapProperty] =
    useState<ColormapProps>(defaultColormapProps)

  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)

  const INITIAL_VIEW_STATE: MapViewState = {
    latitude: 38.648228271786266,
    longitude: -90.30847514088006,
    zoom: 15,
    pitch: 45,
    bearing: 0,
  }
  fetch(
    'https://upload.wikimedia.org/wikipedia/commons/3/36/Yahya_al-Sinwar_2011_crop.JPG',
  )
    .then((res) => res.blob())
    .then((blob) => {
      console.log(blob)
    })

  useEffect(() => {
    async function fetchData() {
      const buildings = (await fetch('api/getAllBuildings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(async (res) => {
          const json = await res.json()
          console.log(json)
          if (!res.ok) {
            throw new Error(`Error! ${json.error}`)
          }
          return json
        })
        .then((data) => data.data)) as BlockProperties[]

      const { colormapObj, data } = CreateColorMap(buildings, colormapProperty)
      setColormap(colormapObj)
      setData(data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    const { colormapObj, data: d } = CreateColorMap(data, colormapProperty)
    setColormap(colormapObj)
    setData(d)
  }, [colormapProperty])

  const openModal = () => {
    const modal = document.getElementById('modal')
    if (modal) {
      const m = modal as any
      m.showModal()
    }
  }

  const mapStyle =
    'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'
  const layers = [
    new PolygonLayer({
      id: 'buildings',
      data,
      opacity: 0.75,
      stroked: false,
      selectable: true,
      filled: true,
      extruded: true,
      getElevation: (f: any) => f.height * 2,
      getPolygon: (f) => f.polygon,
      getLineColor: [255, 255, 255],
      getFillColor: (f) => f.color,
      pickable: true,
      onClick: (pickingInfo) => {
        openModal()
        if (pickingInfo && pickingInfo.coordinate) {
          setSelectedBuilding(pickingInfo.object.id)
        }
      },
    }),
    new TripsLayer({
      id: 'trips',
      data: trips,
      getPath: (d) => d.path,
      getTimestamps: (d) => d.timestamps,
      getColor: (d) => [255, 100, 50],
      opacity: 0.3,
      widthMinPixels: 2,
      // rounded: true,
      trailLength,
      currentTime: 0.3,

      shadowEnabled: false,
    }),
    new PolygonLayer({
      id: 'pickups',
      data: pickUpData,
      opacity: 0.75,
      stroked: false,
      // selectable: true,
      filled: true,
      extruded: true,
      // wireframe: true,
      getElevation: (f) => f.height,
      getPolygon: (f) => f.polygon,
      getLineColor: [255, 255, 255],
      getFillColor: (f) => [255, 255, 255],
      // pickable: true,
    }),
  ]

  return (
    <>
      <MapLegend colormap={colormap} />
      <MapFilter
        colormapProperties={colormapProperty}
        setColormapProperties={setColormapProperty}
      />
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={selectedBuilding == null}
        getTooltip={getTooltip}>
        <Map reuseMaps mapStyle={mapStyle}>
          <dialog
            id='modal'
            className='modal'
            onClose={() => setSelectedBuilding(null)}>
            <div className='modal-box max-w-[75vw]'>
              {selectedBuilding && <Building id={selectedBuilding} />}
            </div>
            <form method='dialog' className='modal-backdrop'>
              <button />
            </form>
          </dialog>
        </Map>
      </DeckGL>
    </>
  )
}
