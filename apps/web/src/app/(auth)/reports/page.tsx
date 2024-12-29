export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reportes</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Lista de Reportes</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((id) => (
            <div key={id} className="rounded-lg bg-white p-6 shadow">
              <h3 className="text-lg font-semibold">Reporte #{id}</h3>
              <p className="mt-2 text-sm text-gray-500">
                Actualizado hace 3 horas
              </p>
              <span className="mt-4 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                Activo
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
