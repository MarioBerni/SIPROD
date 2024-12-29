export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configuración</h1>
      
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">Perfil</h2>
        <p className="mt-1 text-sm text-gray-500">
          Información y configuración de tu cuenta.
        </p>
        
        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              disabled
              value="tu@ejemplo.com"
              aria-label="Email del usuario"
              title="Email del usuario"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
            />
          </div>
          
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
              Tema
            </label>
            <select
              id="theme"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              defaultValue="dark"
              aria-label="Seleccionar tema"
              title="Seleccionar tema de la aplicación"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
              <option value="system">Sistema</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
