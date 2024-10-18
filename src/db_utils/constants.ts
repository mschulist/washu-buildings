export const DB_NAME = 'buildings-test'

export const MAP_DISPLAY_COLS = [
  'name',
  'id',
  'polygon',
  'height',
  'printer',
  'whiteboard',
  'blackboard',
  'food',
  'study_rooms',
]

export type BuildingModel = {
  id: number
  name: string
  polygon: string
  height: number
  printer: number
  whiteboard: number
  blackboard: number
  food: number
  study_rooms: number
  general_info: string
  image_src: string
  website: string
  board_info: string
  printer_info: string
}
