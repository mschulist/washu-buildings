type LatLong = [number, number]

function radians(degrees: number) {
  return (degrees * Math.PI) / 180
}

// function interp(a: LatLong, b: LatLong, t: number): LatLong {
//   return [(1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1]]
// }

// The (small-distance approximation) distance between two coordinates, accounting for the spherical earth
function distance(a: LatLong, b: LatLong) {
  const center_lat = (a[1] + b[1]) / 2
  return Math.hypot(a[0] - b[0], (a[1] - b[1]) / Math.cos(radians(center_lat)))
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

export const pickupData = pickupStations.map((pickup) => {
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

type Trip = {
  path: LatLong[]
  timestamps: number[]
}

function makeTrip(path: LatLong[]): Trip {
  // // Avoids a bug (?) in the trips rendering
  // if (path[0] === path[path.length - 1])
  //   path[path.length - 1] = interp(path[path.length - 2], path[path.length - 1], 0.999)

  // Total distance from start to this point in the path
  let distances: number[] = []

  let prev: LatLong | null = null
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

function offsetTrip(trip: Trip, offset: number) {
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
export const trips = Array.from({ length: 10 }, () =>
  offsetTrip(trip, Math.random()),
)

// The drawn length behind each moving trail view, where 1.0 is a full loop
export const trailLength = 0.1
