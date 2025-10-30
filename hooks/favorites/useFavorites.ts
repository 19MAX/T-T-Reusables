import { api } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";

// Tipos basados en tu API
export interface Favorito {
  id?: string;
  usuarioId?: string;
  favoritoId?: string;
  fechaCreacion?: string;
  usuario?: {
    id?: string;
    nombreCompleto?: string;
    email?: string;
    urlFoto?: string;
  };
}

interface UseFavoritosResult {
  favoritos: Favorito[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseFavoritoDetailResult {
  favorito: Favorito | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Store global para sincronizar refetch entre hooks
let globalFavoritosRefetchCallbacks: (() => Promise<void>)[] = [];

export const registerFavoritosRefetchCallback = (
  callback: () => Promise<void>
) => {
  globalFavoritosRefetchCallbacks.push(callback);
  return () => {
    globalFavoritosRefetchCallbacks = globalFavoritosRefetchCallbacks.filter(
      (cb) => cb !== callback
    );
  };
};

export const triggerGlobalFavoritosRefetch = async () => {
  await Promise.all(globalFavoritosRefetchCallbacks.map((cb) => cb()));
};

/**
 * Hook para obtener la lista de favoritos del usuario autenticado
 */
export const useFavoritos = (): UseFavoritosResult => {
  const [favoritos, setFavoritos] = useState<Favorito[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavoritos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.favoritos.obtenerFavoritos();
      setFavoritos(response.data || []);
    } catch (err: any) {
      console.error("Error fetching favoritos:", err);
      setError(err.response?.data?.message || "Error al cargar los favoritos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoritos();
    // Registrar callback para refetch global
    const unregister = registerFavoritosRefetchCallback(fetchFavoritos);
    return unregister;
  }, []);

  return {
    favoritos,
    loading,
    error,
    refetch: fetchFavoritos,
  };
};

/**
 * Hook para obtener el detalle de un favorito específico
 */
export const useFavoritoDetail = (
  favoritoId: string
): UseFavoritoDetailResult => {
  const [favorito, setFavorito] = useState<Favorito | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavoritoDetail = async () => {
    if (!favoritoId) {
      setError("ID de favorito no proporcionado");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.favoritos.obtenerFavoritoId(favoritoId);
      setFavorito(response.data || null);
    } catch (err: any) {
      console.error("Error fetching favorito detail:", err);
      setError(
        err.response?.data?.message ||
          "Error al cargar el detalle del favorito"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoritoDetail();
  }, [favoritoId]);

  return {
    favorito,
    loading,
    error,
    refetch: fetchFavoritoDetail,
  };
};

/**
 * Hook para agregar un usuario a favoritos
 */
export const useAddFavorito = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFavorito = async (favoritoId: string): Promise<Favorito> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.favoritos.agregarFavorito({ favoritoId });
      // Trigger global refetch después de agregar
      await triggerGlobalFavoritosRefetch();
      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Error al agregar a favoritos";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    addFavorito,
    loading,
    error,
  };
};

/**
 * Hook para eliminar un usuario de favoritos
 */
export const useDeleteFavorito = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFavorito = async (favoritoId: string): Promise<void> => {
    console.log("Eliminando el ID de :", favoritoId);
    try {
      setLoading(true);
      setError(null);
      await api.favoritos.eliminarFavorito(favoritoId);
      // Trigger global refetch después de eliminar
      await triggerGlobalFavoritosRefetch();
    } catch (err: any) {
        console.error("Error deleting favorito:", err);
      const message =
        err.response?.data?.message || "Error al eliminar de favoritos";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteFavorito,
    loading,
    error,
  };
};

/**
 * Hook para verificar si un usuario está en favoritos
 */
export const useIsFavorito = (usuarioId: string | undefined) => {
  const { favoritos, loading } = useFavoritos();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoritoId, setFavoritoId] = useState<string | null>(null);

  useEffect(() => {
    if (!usuarioId || loading) {
      setIsFavorite(false);
      setFavoritoId(null);
      return;
    }

    const favorito = favoritos.find((f) => f.favoritoId === usuarioId);
    setIsFavorite(!!favorito);
    setFavoritoId(favorito?.id || null);
  }, [usuarioId, favoritos, loading]);

  return {
    isFavorite,
    favoritoId,
    loading,
  };
};