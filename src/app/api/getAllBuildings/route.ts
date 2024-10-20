import { DB_NAME, MAP_DISPLAY_COLS } from '@/db_utils/constants'
import { createClient } from '@/db_utils/createServerClient'
import { NextResponse } from 'next/server'

export async function POST(): Promise<NextResponse> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from(DB_NAME)
    .select(MAP_DISPLAY_COLS.join(','))

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message, ok: false },
      { status: 500 },
    )
  }

  return NextResponse.json({ success: true, data, ok: true })
}
