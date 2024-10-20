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
import { BitmapLayer } from '@deck.gl/layers'
import { SplashScreen } from './SplashScreen'

import {
  ColormapProps,
  CreateColorMap,
  defaultColormapProps,
} from '@/map_utils/colormaps'
import {
  pickupData,
  trips,
  trailLength,
  trailIncrement,
} from '@/map_utils/trail'
import { createClient } from '@/db_utils/createClientClient'
import { LoginButton } from './Login'

export type BlockProperties = {
  height: number
  name: string
  department: string
  food: number
  blackboard: number
  whiteboard: number
  printer: number
  study_rooms: number
  last_class: number
}

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
      return (time + trailIncrement) % 1
    })
  })

  const [data, setData] = useState<BlockProperties[]>([])
  const [colormap, setColormap] = useState<Record<string, string>>({})
  const [colormapProperty, setColormapProperty] =
    useState<ColormapProps>(defaultColormapProps)

  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null)

  const [validUser, setValidUser] = useState<boolean>(false)

  const INITIAL_VIEW_STATE: MapViewState = {
    latitude: 38.648228271786266,
    longitude: -90.30847514088006,
    zoom: 15,
    pitch: 45,
    bearing: 0,
  }
  const boundSize = 0.02

  const gradientLayer = new BitmapLayer({
    id: 'gradient-layer',
    bounds: [-90.4, 38.595, -90.215, 38.7],
    opacity: 1,
  })

  useEffect(() => {
    async function fetchData() {
      const buildings = (await fetch('api/getAllBuildings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(async (res) => {
          const json = await res.json()
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
    gradientLayer,
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
      getColor: [255, 125, 89],
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
    'https://gist.githubusercontent.com/audrey-chiang/0156564d28077ac528bf0e3d46a939af/raw/5d111157d82751a59c9b4b52cbd6cda585c94276/custom_dark_matter_without_labels.json'

  const bounds: [[west: number, south: number], [east: number, north: number]] =
    [
      [
        INITIAL_VIEW_STATE.longitude - boundSize,
        INITIAL_VIEW_STATE.latitude - boundSize,
      ],
      [
        INITIAL_VIEW_STATE.longitude + boundSize,
        INITIAL_VIEW_STATE.latitude + boundSize,
      ],
    ]

  function applyViewStateConstraints(viewState: MapViewState): MapViewState {
    return {
      ...viewState,
      zoom: Math.min(20, Math.max(14, viewState.zoom)),
      longitude: Math.min(
        bounds[1][0],
        Math.max(bounds[0][0], viewState.longitude),
      ),
      latitude: Math.min(
        bounds[1][1],
        Math.max(bounds[0][1], viewState.latitude),
      ),
    }
  }

  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient()
      const { error } = await supabase.auth.getUser()
      if (!error) {
        setValidUser(true)
      }
      setValidUser(true)
    }
    fetchUser()
  }, [])

  const [isVisible, setIsVisible] = useState(true)
  function onEnter() {
    setIsVisible(false)
  }

  return (
    <div className='map-container'>
      <LoginButton isVisible={!validUser && !isVisible} />
      <MapLegend colormap={colormap} isVisible={!isVisible} />
      <MapFilter
        setColormapProperties={setColormapProperty}
        isVisible={!isVisible}
      />
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={selectedBuilding == null}
        getTooltip={getTooltip}
        onViewStateChange={({ viewState }) => {
          applyViewStateConstraints(viewState as MapViewState)
        }}>
        <Map reuseMaps mapStyle={mapStyle}>
          <PopupModal
            selectedBuilding={selectedBuilding}
            setSelectedBuilding={setSelectedBuilding}
            validUser={validUser}
          />
        </Map>
      </DeckGL>
      <SplashScreen onEnter={onEnter} isVisible={isVisible} />
    </div>
  )
}
