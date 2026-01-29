'use server'

import { createClient as createServerClient } from '@/lib/supabase/server'

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createServerClient()
  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  if (!email || !password || !name) {
    return { error: 'All fields are required' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: name,
      },
    },
  })

  if (error) {
    console.error('Signup error:', error.message)

    if (error.message.includes('already registered')) {
      return { error: 'An account with this email already exists. Please sign in instead.' }
    }

    return { error: error.message }
  }

  // If email confirmation is disabled and we have a user, create the profile
  if (data.user && data.session) {
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        name: name,
        subscription_tier: 'solo', // Default tier until they subscribe
      })

    if (profileError) {
      console.error('Profile creation error:', profileError.message)
      // Don't return error - user is created, profile can be created on first login
    }
  }

  return { success: true }
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login error:', error.message)

    if (error.message.includes('Invalid login credentials')) {
      return { error: 'Invalid email or password' }
    }

    return { error: error.message }
  }

  return { success: true }
}

export async function signOut() {
  const supabase = await createServerClient()
  await supabase.auth.signOut()
  // Redirect happens client-side after this returns
  return { success: true }
}
