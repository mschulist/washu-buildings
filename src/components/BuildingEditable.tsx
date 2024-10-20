import { BuildingModel } from '@/db_utils/constants'
import { EditableField } from './EditableField'
import { useState } from 'react'

export function BuildingEditable({
  buildingDetails,
  setBuildingDetails,
  isEditing,
}: {
  buildingDetails: BuildingModel
  setBuildingDetails: (buildingDetails: BuildingModel) => void
  isEditing: boolean
}) {
  const [whiteboardInfo, setWhiteboardInfo] = useState(
    buildingDetails.whiteboard_info,
  )
  const [whiteboardChecked, setWhiteboardChecked] = useState(
    buildingDetails.whiteboard,
  )

  const [blackboardInfo, setBlackboardInfo] = useState(
    buildingDetails.blackboard_info,
  )
  const [blackboardChecked, setBlackboardChecked] = useState(
    buildingDetails.blackboard,
  )

  const [printerInfo, setPrinterInfo] = useState(buildingDetails.printer_info)
  const [printerChecked, setPrinterChecked] = useState(buildingDetails.printer)

  const [studyRoomInfo, setStudyRoomInfo] = useState(
    buildingDetails.study_rooms_info,
  )
  const [studyRoomChecked, setStudyRoomChecked] = useState(
    buildingDetails.study_rooms,
  )

  const [foodInfo, setFoodInfo] = useState(buildingDetails.food_info)
  const [foodChecked, setFoodChecked] = useState(buildingDetails.food)

  function setAllInfoWhiteboard(s: string) {
    setWhiteboardInfo(s)
    setBuildingDetails({ ...buildingDetails, whiteboard_info: s })
  }
  function setAllCheckedWhiteboard(checked: number) {
    if (!isEditing) return
    setWhiteboardChecked(checked)
    setBuildingDetails({ ...buildingDetails, whiteboard: checked })
  }

  function setAllCheckedBlackboard(checked: number) {
    if (!isEditing) return
    setBlackboardChecked(checked)
    setBuildingDetails({ ...buildingDetails, blackboard: checked })
  }

  function setAllCheckedPrinter(checked: number) {
    if (!isEditing) return
    setPrinterChecked(checked)
    setBuildingDetails({ ...buildingDetails, printer: checked })
  }

  function setAllCheckedStudyRoom(checked: number) {
    if (!isEditing) return
    setStudyRoomChecked(checked)
    setBuildingDetails({ ...buildingDetails, study_rooms: checked })
  }

  function setAllCheckedFood(checked: number) {
    if (!isEditing) return
    setFoodChecked(checked)
    setBuildingDetails({ ...buildingDetails, food: checked })
  }

  function setAllInfoBlackboard(s: string) {
    setBlackboardInfo(s)
    setBuildingDetails({ ...buildingDetails, blackboard_info: s })
  }

  function setAllInfoPrinter(s: string) {
    setPrinterInfo(s)
    setBuildingDetails({ ...buildingDetails, printer_info: s })
  }

  function setAllInfoStudyRoom(s: string) {
    setStudyRoomInfo(s)
    setBuildingDetails({ ...buildingDetails, study_rooms_info: s })
  }

  function setAllInfoFood(s: string) {
    setFoodInfo(s)
    setBuildingDetails({ ...buildingDetails, food_info: s })
  }

  return (
    <div className='grid grid-cols-4 gap-4 p-4 rounded-2xl shadow-lg text-foreground'>
      <EditableField
        name='Whiteboard'
        value={whiteboardInfo}
        onChange={setAllInfoWhiteboard}
        isEditing={isEditing}
        onCheckChange={setAllCheckedWhiteboard}
        checked={whiteboardChecked}
      />
      <EditableField
        name='Blackboard'
        value={blackboardInfo}
        onChange={setAllInfoBlackboard}
        isEditing={isEditing}
        onCheckChange={setAllCheckedBlackboard}
        checked={blackboardChecked}
      />
      <EditableField
        name='Printer'
        value={printerInfo}
        onChange={setAllInfoPrinter}
        isEditing={isEditing}
        onCheckChange={setAllCheckedPrinter}
        checked={printerChecked}
      />
      <EditableField
        name='Study Rooms'
        value={studyRoomInfo}
        onChange={setAllInfoStudyRoom}
        isEditing={isEditing}
        onCheckChange={setAllCheckedStudyRoom}
        checked={studyRoomChecked}
      />
      <EditableField
        name='Food'
        value={foodInfo}
        onChange={setAllInfoFood}
        isEditing={isEditing}
        onCheckChange={setAllCheckedFood}
        checked={foodChecked}
      />
    </div>
  )
}
