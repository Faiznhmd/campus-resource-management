'use client';

import { useEffect } from 'react';
import api from '@/app/services/api';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        // Call backend logout endpoint
        await api.post('/auth/logout');
      } catch (error) {
        console.log('Error logging out', error);
      }

      // Remove token from client storage if used
      localStorage.removeItem('token');

      // Redirect to login page
      router.push('/auth/login');
    };

    logout();
  }, [router]);

  return <p style={{ padding: 20 }}>Logging out...</p>;
}
