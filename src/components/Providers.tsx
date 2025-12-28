'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
