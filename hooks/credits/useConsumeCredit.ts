import { api } from "@/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UserProfile } from "../profile/useUserProfile";

interface UseCreditResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
  consumeCredit: (clienteId: string) => Promise<void>;
  resetState: () => void;
}

export const useConsumeCredit = (
  onSuccess?: () => void,
  onError?: (error: string) => void
): UseCreditResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Obtén acceso al queryClient para actualizar el caché
  const queryClient = useQueryClient();

  const consumeCredit = async (clienteId: string) => {
    if (!clienteId) {
      const errorMsg = "ID de cliente no proporcionado";
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setMessage(null);

      const response = await api.creditos.usarCredito(clienteId);

      if (response.data) {
        // console.log("Log en el hook donde consumo el credito :", response);
        setSuccess(true);
        setMessage(response.data.mensaje || "Crédito usado exitosamente");

        // Actualizar el caché del perfil del usuario
        // Opción 1: Restar 1 crédito del perfil actual en caché (Optimista)
        queryClient.setQueryData(["userProfile"], (oldData: UserProfile | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              creditosDisponibles: (oldData.creditosDisponibles ?? 0) - 1,
            };
          }
          return oldData;
        });

        // Opción 2: Si prefieres refrescar desde el servidor (descomenta si lo prefieres)
        // await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

        onSuccess?.();
      }
    } catch (err: any) {
      console.error("Error al usar crédito:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al usar el crédito";

      setError(errorMessage);
      setSuccess(false);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setMessage(null);
  };

  return {
    loading,
    error,
    success,
    message,
    consumeCredit,
    resetState,
  };
};