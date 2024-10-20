'use client'

import DeckGL, {
  MapViewState,
  PickingInfo,
  PolygonLayer,
  TripsLayer,
} from 'deck.gl'

import { useEffect, useState, useRef } from 'react'
import { Map } from 'react-map-gl/maplibre'
import { MapLegend } from './MapLegend'
import { MapFilter } from './MapFilter'
import { PopupModal } from './PopupModal'

import {
  ColormapProps,
  CreateColorMap,
  defaultColormapProps,
} from '@/map_utils/colormaps'
import { pickupData, trips, trailLength } from '@/map_utils/trail'

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

// type Theme = {
//   buildingColor: Color;
//   trailColor0: Color;
//   trailColor1: Color;
//   material: Material;
// };

// const DEFAULT_THEME: Theme = {
//   material: {
//     ambient: 0.1,
//     diffuse: 0.6,
//     shininess: 32,
//     specularColor: [60, 64, 70]
//   }
// };

function getTooltip({ object }: PickingInfo) {
  if (!object) {
    return null
  }
  return (
    object && {
      html: `\
        <div>${object.name}</div>
    `,
      className: 'rounded-xl',
    }
  )
}

// From https://css-tricks.com/using-requestanimationframe-with-react-hooks/
// We use this to animate a value, in this case `currentTime`, once a frame.
// Animation of the time allows for the shuttle rendering lines to move
const useAnimationFrame = (callback: (deltaTime: number) => void) => {
  const requestRef = useRef<number | null>(null)
  const previousTimeRef = useRef<number | null>(null)

  const animate = (time: number) => {
    if (previousTimeRef.current !== null) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])
}

export function MapBox() {
  const [currentTime, setCurrentTime] = useState(0)

  useAnimationFrame(() => {
    setCurrentTime((time) => {
      return (time + 0.001) % 1
    })
  })

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

  function openModal() {
    const modal = document.getElementById('modal')
    if (modal) {
      const m = modal as HTMLDialogElement
      m.showModal()
    }
  }

  const layers = [
    new PolygonLayer({
      id: 'buildings',
      data,
      opacity: 0.75,
      stroked: false,
      selectable: true,
      filled: true,
      extruded: true,
      getElevation: (f) => f.height * 2,
      getPolygon: (f) => f.polygon,
      getLineColor: [255, 255, 255],
      getFillColor: (f) => f.color,
      pickable: true,
      onClick: (pickingInfo) => {
        if (selectedBuilding != null) return
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
      getColor: [255, 50, 50],
      opacity: 0.3,
      widthMinPixels: 4,
      capRounded: true,
      jointRounded: true,
      trailLength,
      currentTime,

      shadowEnabled: false,
    }),
    new PolygonLayer({
      id: 'pickups',
      data: pickupData,
      opacity: 0.75,
      stroked: false,
      // selectable: true,
      filled: true,
      extruded: true,
      // wireframe: true,
      getElevation: (f) => f.height,
      getPolygon: (f) => f.polygon,
      getLineColor: [255, 255, 255],
      getFillColor: [255, 255, 255],
      pickable: true,
    }),
  ]

  const mapStyle =
    'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json'

  return (
    <div className='map-container'>
      <MapLegend colormap={colormap} />
      <MapFilter setColormapProperties={setColormapProperty} isVisible={true} />
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={selectedBuilding == null}
        getTooltip={getTooltip}>
        <Map reuseMaps mapStyle={mapStyle}>
          <PopupModal
            selectedBuilding={selectedBuilding}
            setSelectedBuilding={setSelectedBuilding}
          />
        </Map>
      </DeckGL>
      {/* <SplashScreen /> */}
    </div>
  )
}
