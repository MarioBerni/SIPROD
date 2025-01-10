import { AxiosError } from 'axios';

export const handleError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      return 'No autorizado. Por favor, inicie sesión.';
    } else if (error.response?.status === 404) {
      return 'Recurso no encontrado.';
    } else if (error.response?.status === 400) {
      return error.response.data?.message || 'Error en los datos enviados.';
    } else if (error.response?.status === 500) {
      return 'Error interno del servidor. Por favor, intente más tarde.';
    } else if (!error.response) {
      return 'Error de conexión. Por favor, verifique su conexión a internet.';
    }
    return error.response.data?.message || 'Error en la operación. Por favor, intente nuevamente.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Error inesperado. Por favor, intente nuevamente.';
};

export const handleValidationError = (error: unknown): Record<string, string> => {
  if (error instanceof AxiosError && error.response?.status === 400) {
    return error.response.data?.errors || {};
  }
  return {};
};

export const isAxiosError = (error: unknown): error is AxiosError => {
  return error instanceof AxiosError;
};
