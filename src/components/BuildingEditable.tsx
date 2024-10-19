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
  const [name, setName] = useState(buildingDetails.name)
  const [generalInfo, setGeneralInfo] = useState(buildingDetails.general_info)
  const [boardInfo, setBoardInfo] = useState(buildingDetails.board_info)
  const [printerInfo, setPrinterInfo] = useState(buildingDetails.printer_info)

  useEffect(() => {
    if (!isEditing) {
      setBuildingDetails({
        ...buildingDetails,
        name,
        general_info: generalInfo,
        board_info: boardInfo,
        printer_info: printerInfo,
      })
    }
  }, [name, generalInfo, boardInfo, printerInfo])

  return (
    <div className='grid grid-cols-3 gap-4 bg-base-200'>
      <EditableField
        name='Name'
        value={name}
        onChange={setName}
        isEditing={isEditing}
      />
      <EditableField
        name='General Info'
        value={generalInfo}
        onChange={setGeneralInfo}
        isEditing={isEditing}
      />
      <EditableField
        name='Board Info'
        value={boardInfo}
        onChange={setBoardInfo}
        isEditing={isEditing}
      />
      <EditableField
        name='Printer Info'
        value={printerInfo}
        onChange={setPrinterInfo}
        isEditing={isEditing}
      />
    </div>
  )
}
