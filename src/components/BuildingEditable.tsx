import { BuildingModel } from '@/db_utils/constants'
import { EditableField } from './EditableField'
import { useState } from 'react'

export function BuildingEditable({
  buildingDetails,
  isEditing,
}: {
  buildingDetails: BuildingModel
  isEditing: boolean
}) {
  const [name, setName] = useState(buildingDetails.name)
  const [generalInfo, setGeneralInfo] = useState(buildingDetails.general_info)
  const [boardInfo, setBoardInfo] = useState(buildingDetails.board_info)
  const [printerInfo, setPrinterInfo] = useState(buildingDetails.printer_info)

  return (
    <div className='flex flex-col items-center justify-center bg-base-200'>
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
