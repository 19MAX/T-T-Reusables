import { api } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";

// Tipos basados en tu API
export interface Oferta {
  id?: string;
  usuarioId?: string;
  servicioId?: string;
  titulo?: string;
  imagenUrl?: string;
  precioPersonalizado?: number;
  descripcionPersonalizada?: string;
  disponibilidad?: {
    diasSemana?: string[];
    horaInicio?: string;
    horaFin?: string;
  };
  ubicacion?: {
    ciudad?: string;
    direccion?: string;
    modalidad?: string;
  };
  estado?: string;
  fechaCreacion?: string | { _seconds: number; _nanoseconds: number };
  fechaActualizacion?: string | { _seconds: number; _nanoseconds: number };
  fechaInicioOferta?: string | { _seconds: number; _nanoseconds: number };
  fechaFinOferta?: string | { _seconds: number; _nanoseconds: number };
  servicio?: {
    id?: string;
    titulo?: string;
    descripcion?: string;
    categoria?: string;
    precio?: number;
    estado?: string;
    tipo?: string;
  };
  usuario?: {
    id?: string;
    nombreCompleto?: string;
    email?: string;
    calificacionPromedio?: number;
    ci?: string;
    fotoPerfil?: string | null;
  };
}

interface UseOffersResult {
  ofertas: Oferta[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseOfferDetailResult {
  oferta: Oferta | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Store global para sincronizar refetch entre hooks
let globalRefetchCallbacks: (() => Promise<void>)[] = [];

export const registerRefetchCallback = (callback: () => Promise<void>) => {
  globalRefetchCallbacks.push(callback);
  return () => {
    globalRefetchCallbacks = globalRefetchCallbacks.filter(
      (cb) => cb !== callback
    );
  };
};

export const triggerGlobalRefetch = async () => {
  await Promise.all(globalRefetchCallbacks.map((cb) => cb()));
};

/**
 * Hook para obtener las ofertas activas
 */
export const useOffers = (): UseOffersResult => {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOfertas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.ofertas.obtenerOfertasActivas();
      setOfertas(response.data || []);
    } catch (err: any) {
      console.error("Error fetching ofertas:", err);
      setError(err.response?.data?.message || "Error al cargar las ofertas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfertas();

    // Registrar callback para refetch global
    const unregister = registerRefetchCallback(fetchOfertas);
    return unregister;
  }, []);

  return {
    ofertas,
    loading,
    error,
    refetch: fetchOfertas,
  };
};

/**
 * Hook para obtener el detalle de una oferta específica
 */
export const useOfferDetail = (id: string): UseOfferDetailResult => {
  const [oferta, setOferta] = useState<Oferta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOfertaDetail = async () => {
    if (!id) {
      setError("ID de oferta no proporcionado");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.ofertas.obtenerOfertaPorId(id);
      setOferta(response.data || null);
    } catch (err: any) {
      console.error("Error fetching oferta detail:", err);
      setError(
        err.response?.data?.message || "Error al cargar el detalle de la oferta"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfertaDetail();
  }, [id]);

  return {
    oferta,
    loading,
    error,
    refetch: fetchOfertaDetail,
  };
};

/**
 * Hook para obtener las ofertas del usuario autenticado
 */
export const useMyOffers = (): UseOffersResult => {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMisOfertas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.ofertas.obtenerMisOfertas();
      setOfertas(response.data || []);
    } catch (err: any) {
      console.error("Error fetching mis ofertas:", err);
      setError(err.response?.data?.message || "Error al cargar tus ofertas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMisOfertas();

    // Registrar callback para refetch global
    const unregister = registerRefetchCallback(fetchMisOfertas);
    return unregister;
  }, []);

  return {
    ofertas,
    loading,
    error,
    refetch: fetchMisOfertas,
  };
};

type CreateOfertaData = {
  servicioId: string;
  titulo: string;
  descripcionPersonalizada?: string;
  precioPersonalizado?: number;
  imagen?: any;
  disponibilidad: {
    diasSemana: string[];
    horaInicio: string;
    horaFin: string;
  };
  ubicacion: {
    ciudad: string;
    direccion?: string;
    modalidad: "presencial" | "virtual" | "ambas";
  };
};

export const useCreateOferta = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOferta = async (data: CreateOfertaData) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("servicioId", data.servicioId);
      formData.append("titulo", data.titulo);

      if (data.descripcionPersonalizada) {
        formData.append(
          "descripcionPersonalizada",
          data.descripcionPersonalizada
        );
      }

      if (data.precioPersonalizado) {
        formData.append(
          "precioPersonalizado",
          data.precioPersonalizado.toString()
        );
      }

      formData.append("disponibilidad", JSON.stringify(data.disponibilidad));
      formData.append("ubicacion", JSON.stringify(data.ubicacion));

      if (data.imagen) {
        const imageUri = data.imagen.uri;
        const imageName = imageUri.split("/").pop() || "image.jpg";
        const imageType = data.imagen.mimeType || "image/jpeg";

        formData.append("imagen", {
          uri: imageUri,
          name: imageName,
          type: imageType,
        } as any);
      }

      const response = await api.ofertas.crearOferta(formData as any);

      // Trigger global refetch después de crear
      await triggerGlobalRefetch();

      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Error al crear la oferta";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    createOferta,
    loading,
    error,
  };
};

interface UseOfferActionResult {
  loading: boolean;
  error: string | null;
}

/**
 * Hook para eliminar una oferta permanentemente
 */
export const useDeleteOferta = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteOferta = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await api.ofertas.eliminarOferta(id);

      // Trigger global refetch después de eliminar
      await triggerGlobalRefetch();
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Error al eliminar la oferta";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteOferta,
    loading,
    error,
  };
};

/**
 * Hook para pausar una oferta de servicio
 */
export const usePauseOferta = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pauseOferta = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await api.ofertas.pausarOferta(id);

      // Trigger global refetch después de pausar
      await triggerGlobalRefetch();
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Error al pausar la oferta";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    pauseOferta,
    loading,
    error,
  };
};

/**
 * Hook para reactivar una oferta pausada
 */
export const useReactivateOferta = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reactivateOferta = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await api.ofertas.activarOferta(id);

      // Trigger global refetch después de reactivar
      await triggerGlobalRefetch();
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Error al reactivar la oferta";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    reactivateOferta,
    loading,
    error,
  };
};
