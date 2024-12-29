import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-4">Lo sentimos, la página que buscas no existe.</p>
        <Link
          href="/"
          className="text-blue-500 hover:text-blue-600 underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
