import { api } from "@/providers/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UserProfile } from "./useUserProfile";

// Tipos para actualización de información personal
interface PersonalInfoUpdate {
  nombreCompleto?: string;
  numeroContacto?: string;
}

// Tipos para información adicional
interface AdditionalInfoUpdate {
  nivelEducacion?: string;
  ciudadania?: string;
  trabajoDeseado?: {
    tipo: string;
    ciudad: string;
    expectativaIngresos?: number;
  };
  contactosFavoritos?: string[];
  urlFoto?: string;
}

interface UseProfileUpdateResult {
  loading: boolean;
  uploadingPhoto: boolean;
  error: string | null;
  updatePersonalInfo: (data: PersonalInfoUpdate) => Promise<any>;
  updateAdditionalInfo: (data: AdditionalInfoUpdate) => Promise<any>;
  updateProfilePhoto: (file: File) => Promise<any>;
  refreshProfile: () => Promise<void>;
  resetState: () => void;
}

export const useProfileUpdate = (): UseProfileUpdateResult => {
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Actualizar información personal (nombre y teléfono)
  const updatePersonalInfo = async (data: PersonalInfoUpdate) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.usuarios.actualizarPerfil(data);

      // Actualizar el caché de manera optimista
      queryClient.setQueryData(
        ["userProfile"],
        (oldData: UserProfile | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              ...response.data,
            };
          }
          return response.data;
        }
      );

      // Invalidar para refrescar desde el servidor (opcional, más seguro)
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      return response;
    } catch (err: any) {
      console.error("Error actualizando información personal:", err);
      const errorMessage =
        err.response?.data?.message ||
        Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(", ")
          : "Error al actualizar información personal";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar información adicional
  const updateAdditionalInfo = async (data: AdditionalInfoUpdate) => {
    try {
      setLoading(true);
      setError(null);

      // Obtener el ID del usuario del caché
      const currentProfile = queryClient.getQueryData<UserProfile>([
        "userProfile",
      ]);

      if (!currentProfile?.id) {
        throw new Error("Usuario no autenticado o ID no disponible");
      }

      const response = await api.usuarios.configurarPerfil(
        currentProfile.id,
        data
      );

      // Actualizar el caché de manera optimista
      queryClient.setQueryData(
        ["userProfile"],
        (oldData: UserProfile | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              ...response.data,
            };
          }
          return response.data;
        }
      );

      // Invalidar para refrescar desde el servidor
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      return response;
    } catch (err: any) {
      console.error("Error actualizando información adicional:", err);
      const errorMessage =
        err.response?.data?.message ||
        Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(", ")
          : "Error al actualizar información adicional";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar foto de perfil
  const updateProfilePhoto = async (file: File) => {
    try {
      setUploadingPhoto(true);
      setError(null);

      const formData = new FormData();
      formData.append("archivo", file);

      const response = await api.usuarios.actualizarFotoPerfil(
        formData as any
      );

      // Actualizar el caché con la nueva URL de la foto
      queryClient.setQueryData(
        ["userProfile"],
        (oldData: UserProfile | undefined) => {
          if (oldData) {
            return {
              ...oldData,
              urlFoto: response.data.urlFoto,
            };
          }
          return response.data;
        }
      );

      // Invalidar para refrescar desde el servidor
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      return response;
    } catch (err: any) {
      console.error("Error actualizando foto de perfil:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Error al actualizar foto de perfil";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Refrescar perfil completo desde el servidor
  const refreshProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      await queryClient.refetchQueries({ queryKey: ["userProfile"] });
    } catch (err: any) {
      console.error("Error refrescando perfil:", err);
      const errorMessage =
        err.response?.data?.message || "Error al refrescar perfil";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Resetear estado
  const resetState = () => {
    setLoading(false);
    setUploadingPhoto(false);
    setError(null);
  };

  return {
    loading,
    uploadingPhoto,
    error,
    updatePersonalInfo,
    updateAdditionalInfo,
    updateProfilePhoto,
    refreshProfile,
    resetState,
  };
};