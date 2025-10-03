import { api } from "@/providers/AuthProvider";
import { useState } from "react";

interface UseSolicitarRecuperacionResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  solicitarRecuperacion: (email: string) => Promise<void>;
  reset: () => void;
}

/**
 * Hook para solicitar la recuperación de contraseña
 * Envía un correo electrónico al usuario con instrucciones para restablecer su contraseña
 */
export const useSolicitarRecuperacion = (): UseSolicitarRecuperacionResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const solicitarRecuperacion = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Validación básica del email
      if (!email || !email.includes("@")) {
        throw new Error("Por favor ingresa un correo electrónico válido");
      }

      const response = await api.auth.solicitarRecuperacionPassword({
        email,
      });

      setSuccess(true);
      console.log("Recuperación solicitada exitosamente:", response.data);
    } catch (err: any) {
      console.error("Error al solicitar recuperación:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Error al solicitar la recuperación de contraseña"
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return {
    loading,
    error,
    success,
    solicitarRecuperacion,
    reset,
  };
};
