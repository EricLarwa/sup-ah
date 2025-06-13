import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

function ensureEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    ensureEnv('NEXT_PUBLIC_SUPABASE_URL'),
    ensureEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // read only
          }
        },
      },
    }
  )
}