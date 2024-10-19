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
import {
  ColormapProps,
  CreateColorMap,
  defaultColormapProps,
} from '@/map_utils/colormaps'
import { MapFilter } from './MapFilter'
import { PopupModal } from './PopupModal'
import { SplashScreen } from './SplashScreen'


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
// const pickupCenters = [
//   [-90.314975, 38.645516], // Lee house
//   [-90.312681, 38.64527], // Zetcher house
//   [-90.309577, 38.647031], // Mallinckrodt Center
//   [-90.306319, 38.646744], // Goldfrab Hall
//   [-90.30405, 38.64764], // Sumers Welcome Center Pavillion
//   [-90.300861, 38.648853], // Young Archway
//   [-90.311765, 38.650132], // Washington University School of Law Library
//   [-90.313425, 38.650318], // Lot 29
// ]

const pickupStations = [
  {
    name: 'S-40, Clocktower Station',
    loc: [-90.3129323147499, 38.6453046559579],
  },
  {
    name: 'Mallinckrodt Bus Plaza Station',
    loc: [-90.3088805661316, 38.6469369100415],
  },
  { name: 'Snow Way Station', loc: [-90.3139231126892, 38.6503492374085] },
  {
    name: 'Millbrook Garage Station',
    loc: [-90.3117158128975, 38.6501115105297],
  },
  { name: 'Skinker & FPP Station', loc: [-90.300904454631, 38.6488991631577] },
  {
    name: 'East End Garage Station',
    loc: [-90.3041283846558, 38.6465841895706],
  },
  {
    name: 'Mallinckrodt Bus Plaza Station',
    loc: [-90.3088805661316, 38.6469369100415],
  },
  {
    name: 'S-40, Habif Health Station',
    loc: [-90.3157644736801, 38.6455761224313],
  },
  {
    name: 'S-40, Clocktower Station',
    loc: [-90.3129323147499, 38.6453046559579],
  },
]

function radians(degrees: number) {
  return (degrees * Math.PI) / 180
}

const pickupData = pickupStations.map((pickup, _) => {
  const N = 24
  const r = 0.0001
  const loc = pickup.loc

  const polygon = Array.from({ length: N }, (_, i) => {
    const theta = (2.0 * Math.PI * i) / N
    return [
      loc[0] + r * Math.cos(theta),
      loc[1] + r * Math.sin(theta) * Math.cos(radians(loc[1])),
    ]
  })

  return {
    name: pickup.name,
    height: 6.0,
    polygon,
  }
})

function interp(
  a: [number, number],
  b: [number, number],
  t: number,
): [number, number] {
  return [(1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1]]
}

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
  // // Avoids a bug (?) in the trips rendering
  // if (path[0] === path[path.length - 1])
  //   path[path.length - 1] = interp(path[path.length - 2], path[path.length - 1], 0.999)

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
  console.log(distances)

  return {
    path,
    timestamps: distances,
  }
}

function offsetTrip(trip, offset: number) {
  return {
    path: trip.path,
    timestamps: trip.timestamps.map((t) => (t + offset) % 1),
  }
}


const trip = makeTrip([
  [-90.31292789999999, 38.6453327],
  [-90.3115199, 38.6451929],
  [-90.31086250000001, 38.6472135],
  [-90.30888689999999, 38.6469813],
  [-90.3081059, 38.6469089],
  [-90.3081502, 38.646658],
  [-90.3154372, 38.6473597],
  [-90.3151462, 38.6504833],
  [-90.31392729999999, 38.6503901],
  [-90.3117114, 38.6501428],
  [-90.3116273, 38.6501356],
  [-90.3114008, 38.65067],
  [-90.3007167, 38.6492647],
  [-90.30076989999999, 38.6488866],
  [-90.3012129, 38.6460183],
  [-90.3041713, 38.6462752],
  [-90.3041404, 38.6465043],
  [-90.3041288, 38.6465842],
  [-90.3041713, 38.6462752],
  [-90.3081502, 38.646658],
  [-90.30803759999999, 38.64733289999999],
  [-90.308865, 38.6471446],
  [-90.30888689999999, 38.6469813],
  [-90.3081059, 38.6469089],
  [-90.3081502, 38.646658],
  [-90.3154372, 38.6473597],
  [-90.3161259, 38.6456412],
  [-90.31576009999999, 38.6456041],
  [-90.31292789999999, 38.6453327],
])

// const trips = Array.from({length: 10}, (_, i) => offsetTrip(trip, i / 10))
const trips = Array.from({ length: 10 }, (_, i) =>
  offsetTrip(trip, Math.random()),
)

const trailLength = 0.1

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
const useAnimationFrame = (callback) => {
  const requestRef = useRef()
  const previousTimeRef = useRef()

  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [])
}

export function MapBox() {
  const [currentTime, setCurrentTime] = useState(0)

  useAnimationFrame((deltaTime) => {
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
          <PopupModal
            selectedBuilding={selectedBuilding}
            setSelectedBuilding={setSelectedBuilding}
          />
        </Map>
      </DeckGL>

      {/* <SplashScreen /> */}
    </>
  )
}
