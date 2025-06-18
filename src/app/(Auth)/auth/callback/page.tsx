"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/client';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient();
        
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          return;
        }

        if (data.session) {
          // User is now confirmed and logged in
          setStatus('success');
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          // Something went wrong
          setStatus('error');
        }
      } catch (error) {
        console.error('Callback handling error:', error);
        setStatus('error');
      }
    };

    handleAuthCallback();
  }, [router]);

  const getStatusMessage = () => {
    switch (status) {
      case 'loading':
        return 'Confirming your email...';
      case 'success':
        return 'Email confirmed! Redirecting to dashboard...';
      case 'error':
        return 'Something went wrong. Please try signing in again.';
      default:
        return 'Processing...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-100">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className={`p-6 rounded-lg border-4 border-black ${getStatusColor()}`}>
            <h2 className="text-2xl font-bold mb-4">Email Confirmation</h2>
            <p className="text-lg">{getStatusMessage()}</p>
            
            {status === 'loading' && (
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="mt-4">
                <button
                  onClick={() => router.push('/auth')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md border-2 border-black font-bold hover:bg-indigo-700"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}