// components/GoogleLoginButton.tsx
"use client";

import { useGoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import Image from 'next/image';

interface GoogleLoginButtonProps {
  buttonText?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  role?: 'student' | 'agent' | 'admin'; // Add role if needed
}

export const GoogleLoginButton = ({ 
  buttonText = "Continue with Google",
  className = "",
  onSuccess,
  onError,
  role = 'student' // Default to student
}: GoogleLoginButtonProps) => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_EXPRESS_API_BASE;
        
        // Send the ID token to backend
        const response = await fetch(`${BASE_URL}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            credential: tokenResponse.access_token, // This is actually the ID token in implicit flow
            role: role // Optional: send role if needed
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.status === "success" || data.status === "details_pending") {
            const { user, token } = data.data;
            
            if (user && token) {
              login(user, token);

              // Handle redirects
              if (data.redirect) {
                router.push(data.redirect);
              } else {
                // Default redirect based on role
                const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl');
                if (callbackUrl) {
                  router.push(callbackUrl);
                } else {
                  // Default redirects
                  if (user.role_key === 'student') {
                    router.push('/student');
                  } else if (user.role_key === 'agent') {
                    router.push('/agent');
                  } else {
                    router.push('/dashboard');
                  }
                }
              }
            }

            if (onSuccess) onSuccess();
          } else {
            throw new Error(data.message || "Google login failed");
          }
        } else {
          throw new Error(data.message || "Google login failed");
        }
      } catch (error) {
        console.error('Google login error:', error);
        if (onError) onError(error instanceof Error ? error.message : "Login failed");
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      if (onError) onError("Google authentication failed");
    },
    flow: 'implicit',
    scope: 'email profile',
  });

  return (
    <button
      onClick={() => googleLogin()}
      disabled={loading}
      className={`w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <div className="flex justify-center">
          <Image
            src="/images/google.png"
            alt="Google Logo"
            width={30}
            height={30}
          />
        </div> 
      )}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {loading ? "Processing..." : buttonText}
      </span>
    </button>
  );
};