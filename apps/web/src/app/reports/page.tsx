'use client';

import React from 'react';

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-4">
        <h1 className="text-2xl font-semibold text-gray-900">Reportes</h1>
        <div className="mt-4">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900">Lista de Reportes</h2>
              <div className="mt-4 space-y-4">
                {[1, 2, 3].map((report) => (
                  <div key={report} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Reporte #{report}</p>
                      <p className="text-sm text-gray-500">Actualizado hace 3 horas</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Activo
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
