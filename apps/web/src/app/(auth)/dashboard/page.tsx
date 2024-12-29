'use client';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Estadísticas */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Estadísticas</h3>
          <p className="text-gray-600">Resumen de actividades y métricas clave</p>
        </div>

        {/* Tarjeta de Actividad Reciente */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Actividad Reciente</h3>
          <p className="text-gray-600">Últimas actualizaciones y eventos</p>
        </div>

        {/* Tarjeta de Recursos */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Recursos</h3>
          <p className="text-gray-600">Estado actual de recursos asignados</p>
        </div>
      </div>
    </div>
  );
}
