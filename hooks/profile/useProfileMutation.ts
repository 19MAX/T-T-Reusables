import { api } from "@/providers/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// ==================== TIPOS ====================
export interface UpdateProfileData {
  nombreCompleto?: string;
  numeroContacto?: string;
  edad?: number;
  ci?: string;
  urlFoto?: string;
  nivelEducacion?: string;
  ciudadania?: string;
  trabajoDeseado?: {
    tipo: string;
    ciudad: string;
    expectativaIngresos?: number;
  };
  contactosFavoritos?: string[];
}

export interface UpdatePhotoResult {
  success: boolean;
  urlFoto?: string;
  error?: string;
}

// ==================== HOOK PRINCIPAL ====================
export const useProfileMutations = () => {
  const queryClient = useQueryClient();

  // Mutación para actualizar perfil básico
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await api.usuarios.actualizarPerfil(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  // Mutación para configurar perfil completo (servicios)
  const configureProfileMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProfileData;
    }) => {
      const response = await api.usuarios.configurarPerfil(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });

  return {
    updateProfile: updateProfileMutation.mutateAsync,
    updateProfileLoading: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,

    configureProfile: configureProfileMutation.mutateAsync,
    configureProfileLoading: configureProfileMutation.isPending,
    configureProfileError: configureProfileMutation.error,
  };
};

// ==================== HOOK PARA FOTO DE PERFIL ====================
export const useUpdateProfilePhoto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const updatePhoto = async (photoUri: string): Promise<UpdatePhotoResult> => {
    try {
      setLoading(true);
      setError(null);

      // Crear FormData para la imagen
      const formData = new FormData();
      const filename = photoUri.split("/").pop() || "photo.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("archivo", {
        uri: photoUri,
        name: filename,
        type,
      } as any);

      const response = await api.usuarios.actualizarFotoPerfil(formData as any);

      // Invalidar cache del perfil
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      return {
        success: true,
        urlFoto: response.data.urlFoto,
      };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error al actualizar la foto de perfil";
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    updatePhoto,
    loading,
    error,
  };
};

// ==================== HOOK PARA VALIDACIÓN DE CI ====================
export const useVerifyCi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyCi = async (ci: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.usuarios.verificarCi({ ci });
      return response.data.existe || false;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error al verificar la cédula";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyCi,
    loading,
    error,
  };
};

// ==================== HOOK PARA ACTUALIZAR FCM TOKEN ====================
export const useUpdateFcmToken = () => {
  const updateFcmTokenMutation = useMutation({
    mutationFn: async (fcmToken: string) => {
      const response = await api.usuarios.actualizarFcmToken({ fcmToken });
      return response.data;
    },
  });

  return {
    updateFcmToken: updateFcmTokenMutation.mutateAsync,
    loading: updateFcmTokenMutation.isPending,
    error: updateFcmTokenMutation.error,
  };
};