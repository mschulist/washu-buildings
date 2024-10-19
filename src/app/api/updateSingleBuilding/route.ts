import { DB_NAME } from '@/db_utils/constants'
import { createClient } from '@/db_utils/create_client'
import { NextResponse } from 'next/server'

export async function POST(req: Request): Promise<NextResponse> {
  const { buildingData } = await req.json()
  const supabase = createClient()
  const { error } = await supabase
    .from(DB_NAME)
    .update(buildingData)
    .eq('id', buildingData.id)

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    )
  }

  const { data: building } = await supabase
    .from(DB_NAME)
    .select('*')
    .eq('id', buildingData.id)
    .single()

  return NextResponse.json({ success: true, data: building })
}
