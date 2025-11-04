
'use client';

import { useState, useEffect } from 'react';
import { SessionPayload } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<SessionPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const { user } = await response.json();
        setUser(user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      const role = user?.role;
      
      setUser(null);
      if(role == "agent"){
      window.location.href = '/signin/agent';

      }else{
        window.location.href = '/signin';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { user, loading, logout };
}