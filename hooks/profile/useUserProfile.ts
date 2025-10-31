import { api } from "@/providers/AuthProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Tipos basados en tu API
export interface UserProfile {
  id?: string;
  email?: string;
  nombreCompleto?: string;
  numeroContacto?: string;
  edad?: number;
  rol?: string;
  activo?: boolean;
  fechaCreacion?: {
    _seconds: number;
    _nanoseconds: number;
  };
  ci?: string;
  ciudad?: string;
  urlFoto?: string;
  creditosDisponibles?: number;
  fechaActualizacion?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

interface UseUserProfileResult {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  invalidate: () => Promise<void>;
}

/**
 * Hook para obtener el perfil del usuario autenticado
 * Usa TanStack Query para cachear los datos automáticamente
 * El token de autenticación ya está configurado en el API client
 */
export const useUserProfile = (): UseUserProfileResult => {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const response = await api.usuarios.obtenerPerfil();
        return response.data as UserProfile;
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        throw new Error(
          err.response?.data?.message || "Error al cargar el perfil"
        );
      }
    },
    // Opciones de caché
    staleTime: 5 * 60 * 1000, // 5 minutos - los datos se consideran frescos
    gcTime: 10 * 60 * 1000, // 10 minutos - tiempo antes de eliminar del caché
    retry: 2, // Reintentar 2 veces en caso de error
    refetchOnWindowFocus: true, // Refrescar cuando la ventana recibe foco
  });

  // Función para invalidar el caché y forzar una nueva consulta
  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
  };

  return {
    profile: profile || null,
    loading,
    error: error?.message || null,
    refetch: async () => {
      await refetch();
    },
    invalidate,
  };
};

/**
 * Hook adicional para obtener solo los créditos del usuario
 * Útil para actualizar solo los créditos sin recargar todo el perfil
 */
export const useUserCredits = () => {
  const { profile, loading, error } = useUserProfile();

  return {
    credits: profile?.creditosDisponibles ?? 0,
    loading,
    error,
  };
};