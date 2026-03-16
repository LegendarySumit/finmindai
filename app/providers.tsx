'use client';

import { AuthProvider } from '@/lib/authContext';
import AuthActivityTracker from '@/components/AuthActivityTracker';
import { ReactNode } from 'react';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider>
      <AuthActivityTracker />
      {children}
    </AuthProvider>
  );
};
