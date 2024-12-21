'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-4">
        <h1 className="text-2xl font-semibold text-gray-900">Configuración</h1>
        <div className="mt-4">
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Perfil</h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Información y configuración de tu cuenta.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="tu@ejemplo.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                      Tema
                    </label>
                    <select
                      id="theme"
                      name="theme"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option>Claro</option>
                      <option>Oscuro</option>
                      <option>Sistema</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
