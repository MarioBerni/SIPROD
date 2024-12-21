'use client';

import React from 'react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-4">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Total Usuarios</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">1,200</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Reportes Activos</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">450</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-medium text-gray-900">Eficiencia</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">98%</p>
          </div>
        </div>
      </main>
    </div>
  );
}
