import { BuildingModel } from '@/db_utils/constants'
import { EditableField } from './EditableField'
import { useEffect, useState } from 'react'

export function BuildingEditable({
  buildingDetails,
  setBuildingDetails,
  isEditing,
}: {
  buildingDetails: BuildingModel
  setBuildingDetails: (buildingDetails: BuildingModel) => void
  isEditing: boolean
}) {
  const [generalInfo, setGeneralInfo] = useState(buildingDetails.general_info)
  const [boardInfo, setBoardInfo] = useState(buildingDetails.board_info)
  const [printerInfo, setPrinterInfo] = useState(buildingDetails.printer_info)

  function setAllInfoGeneral(s: string) {
    setGeneralInfo(s)
    setBuildingDetails({ ...buildingDetails, general_info: s })
  }

  function setAllInfoBoard(s: string) {
    setBoardInfo(s)
    setBuildingDetails({ ...buildingDetails, board_info: s })
  }

  function setAllInfoPrinter(s: string) {
    setPrinterInfo(s)
    setBuildingDetails({ ...buildingDetails, printer_info: s })
  }

  return (
    <div className='grid grid-cols-3 gap-4 p-4 rounded-2xl shadow-lg text-foreground'>
      <EditableField
        name='General Info'
        value={generalInfo}
        onChange={setAllInfoGeneral}
        isEditing={isEditing}
      />
      <EditableField
        name='Board Info'
        value={boardInfo}
        onChange={setAllInfoBoard}
        isEditing={isEditing}
      />
      <EditableField
        name='Printer Info'
        value={printerInfo}
        onChange={setAllInfoPrinter}
        isEditing={isEditing}
      />
    </div>
  )
}
