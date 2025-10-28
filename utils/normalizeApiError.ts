// src/utils/normalizeApiError.ts
export interface NormalizedApiError {
  message: string;
  status?: number;
  raw?: any;
}

/**
 * Normaliza los errores de API (Axios, Fetch, etc.)
 * para que siempre devuelva un objeto con:
 * - message: string
 * - status: number | undefined
 * - raw: el error completo
 */
export const normalizeApiError = (error: any): NormalizedApiError => {
  // Intentar extraer la respuesta del backend (por ejemplo con Axios)
  const data = error?.response?.data ?? error;

  let message: string;

  if (Array.isArray(data?.message)) {
    // Si el backend devuelve un array de mensajes
    message = data.message.join(". ");
  } else if (typeof data?.message === "string") {
    // Si devuelve un solo mensaje
    message = data.message;
  } else if (typeof data === "string") {
    // Si el error viene directamente como texto (caso raro)
    message = data;
  } else if (error?.message) {
    // Si es un error genérico de JS
    message = error.message;
  } else {
    message = "Ha ocurrido un error inesperado";
  }

  const status =
    data?.statusCode || error?.response?.status || error?.status || undefined;

  return {
    message,
    status,
    raw: error,
  };
};
