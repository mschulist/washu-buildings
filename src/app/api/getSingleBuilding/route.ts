import { BuildingModel, DB_NAME } from '@/db_utils/constants'
import { createClient } from '@/db_utils/create_client'
import { NextResponse } from 'next/server'

export async function POST(req: Request): Promise<NextResponse> {
  const { id } = await req.json()
  const supabase = createClient()
  const { data, error } = await supabase.from(DB_NAME).select('*').eq('id', id)

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }
  if (data?.length === 0 || !data) {
    return NextResponse.json(
      { success: false, error: 'Building not found' },
      { status: 404 },
    )
  }

  const building = data[0] as BuildingModel
  return NextResponse.json({ success: true, data: building })
}
