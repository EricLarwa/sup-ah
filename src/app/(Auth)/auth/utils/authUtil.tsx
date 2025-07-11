// Login and signup utility functions
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/client';

export interface AuthResponse {
    success?: boolean;
    error?: string;
    user?: User | null;
}

export async function handleSignUp(email: string, password: string): Promise<AuthResponse> {
    const supabase = createClient();
    console.log('Attempting sign-up with email:', email);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true, user: data.user };
}

export async function handleLogin(email: string, password: string): Promise<AuthResponse> {
    const supabase = createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    console.log('Login response:', data, error);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
}

export async function handleLogout(): Promise<AuthResponse> {
    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function getCurrentUser(): Promise<AuthResponse> {
    const supabase = createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, user };
}

export async function signInWithOauth(provider: 'google' ): Promise<AuthResponse> {
    const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function resetPassword(email: string): Promise<AuthResponse> {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function updatePassword(newPassword: string): Promise<AuthResponse> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.updateUser({
    password: newPassword
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, user: data.user }
}

