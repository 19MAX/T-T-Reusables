export interface NormalizedApiSuccess<T = any> {
  message: string;
  data?: T;
  raw?: any;
}

/**
 * Normaliza las respuestas de éxito de la API para que siempre devuelvan:
 * - message: string
 * - data: contenido útil (ej. usuario, token, etc.)
 * - raw: la respuesta completa
 */
export const normalizeApiSuccess = <T = any>(
  response: any
): NormalizedApiSuccess<T> => {
  // Axios guarda los datos en response.data
  const data = response?.data ?? response;

  const message =
    typeof data?.message === "string"
      ? data.message
      : "Operación completada exitosamente";

  // Algunos endpoints devuelven un objeto principal (usuario, token, etc.)
  // Puedes detectar el campo relevante si existe
  const payload =
    data?.usuario || data?.user || data?.data || data || undefined;

  return {
    message,
    data: payload,
    raw: response,
  };
};
