'use server'

import { createClient } from '@/db_utils/createServerClient'

export async function signInWithEmail(formData: FormData): Promise<boolean> {
  const supabase = createClient()

  const form = {
    email: formData.get('email') as string,
  }

  if (!form.email) {
    return false
  }

  const { error } = await supabase.auth.signInWithOtp({
    email: form.email,
    options: {
      shouldCreateUser: true,
    },
  })
  if (error) {
    console.error('Error signing in:', error.message)
    return false
  }
  return true
}
