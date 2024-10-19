'use client'

import { BuildingModel } from '@/db_utils/constants'
import { useEffect, useState } from 'react'
import { BuildingHero } from './BuildingHero'
import { BuildingEditable } from './BuildingEditable'
import { EditCheckBox } from './EditCheckbox'
import { BackButton } from './BackButton'

export function Building({ id }: { id: string }) {
  const [buildingDetails, setBuildingDetails] = useState<BuildingModel | null>(
    null,
  )
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const building = await fetch('/api/getSingleBuilding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
        .then((res) => res.json())
        .then((data) => data.data as BuildingModel)
      setBuildingDetails(building)
    }
    fetchData()
  }, [id])

  if (!buildingDetails) {
    return (
      <div className='flex items-center justify-center h-screen bg-base-200'>
        <span className='loading loading-spinner loading-lg'></span>
      </div>
    )
  }
  return (
    <div className='flex flex-col items-center min-h-screen bg-base-200 py-10'>
      <BackButton />
      <BuildingHero buildingDetails={buildingDetails} />
      <EditCheckBox setIsEditing={setIsEditing} />
      <BuildingEditable
        buildingDetails={buildingDetails}
        isEditing={isEditing}
      />
    </div>
  )
}
