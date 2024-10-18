import Link from 'next/link'
import { BuildingModel } from '@/db_utils/constants'
import Image from 'next/image'

export function BuildingHero({
  buildingDetails,
}: {
  buildingDetails: BuildingModel
}) {
  return (
    <div className='hero bg-base-300 max-w-[75vw] rounded-3xl m-20'>
      <div className='text-center hero-content'>
        <div className='max-w-3/6'>
          <h1 className='mb-5 text-5xl font-bold'>{buildingDetails.name}</h1>
          {buildingDetails.image_src && (
            <Image
              src={buildingDetails.image_src}
              alt={buildingDetails.name}
              width={500}
              height={500}
            />
          )}
          <p className='mb-5'>{buildingDetails.general_info}</p>
          <div className='flex justify-center'>
            {buildingDetails.website && (
              <Link href={buildingDetails.website} className='btn btn-primary'>
                Website
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
