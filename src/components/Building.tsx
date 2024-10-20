'use client'

import { BuildingModel } from '@/db_utils/constants'
import { useEffect, useState } from 'react'
import { BuildingHero } from './BuildingHero'
import { BuildingEditable } from './BuildingEditable'
import { EditCheckBox } from './EditCheckbox'
import { CommentDisplay } from './Comments'

export function Building({ id }: { id: string }) {
  const [buildingDetails, setBuildingDetails] = useState<BuildingModel | null>(
    null,
  )
  const [isEditing, setIsEditing] = useState<boolean>(false)

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

  useEffect(() => {
    if (!buildingDetails) return
    if (isEditing) return
    console.log(buildingDetails)

    fetch('api/updateSingleBuilding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ buildingData: buildingDetails }),
    })
  }, [isEditing])

  if (!buildingDetails) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <span className='loading loading-spinner loading-lg'></span>
      </div>
    )
  }
  return (
    <div className='relative text-foreground w-full rounded-xl p-6 shadow-lg'>
      <BuildingHero buildingDetails={buildingDetails} />
      <div className='flex flex-col px-16 w-full'>
        <BuildingEditable
          buildingDetails={buildingDetails}
          setBuildingDetails={setBuildingDetails}
          isEditing={isEditing}
        />
        <EditCheckBox isEditing={isEditing} setIsEditing={setIsEditing} />
      </div>
      <CommentDisplay
        comments={buildingDetails.comments}
        id={buildingDetails.id}
      />
    </div>
  )
}
