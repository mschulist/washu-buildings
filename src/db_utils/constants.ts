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
  'department',
  'last_class',
]

export type BuildingModel = {
  id: string
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
  whiteboard_info: string
  blackboard_info: string
  study_rooms_info: string
  food_info: string
  printer_info: string
  department: string
  last_class: string
  comments: string[]
}
