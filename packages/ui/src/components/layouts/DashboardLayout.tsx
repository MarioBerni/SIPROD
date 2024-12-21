'use client';

import React from 'react';
import { Navbar } from '../navigation/Navbar';

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps): JSX.Element => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};
