import { api } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";

// Tipos basados en tu API
export interface Servicio {
  id?: string;
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  precio?: number;
  estado?: string;
  tipo?: string;
}

interface UseServicesResult {
  servicios: Servicio[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseServiceByIdResult {
  servicio: Servicio | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener todos los servicios activos del catálogo
 */
export const useServices = (): UseServicesResult => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServicios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.servicios.obternerServiciosActivos();
      setServicios(response.data || []);
    } catch (err: any) {
      console.error("Error fetching servicios:", err);
      setError(
        err.response?.data?.message || "Error al cargar los servicios"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  return {
    servicios,
    loading,
    error,
    refetch: fetchServicios,
  };
};

/**
 * Hook para obtener un servicio específico por ID
 */
export const useServiceById = (id: string): UseServiceByIdResult => {
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServicio = async () => {
    if (!id) {
      setError("ID de servicio no proporcionado");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.servicios.obtenerServicioPorId(id);
      setServicio(response.data || null);
    } catch (err: any) {
      console.error("Error fetching servicio detail:", err);
      setError(
        err.response?.data?.message || "Error al cargar el detalle del servicio"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServicio();
  }, [id]);

  return {
    servicio,
    loading,
    error,
    refetch: fetchServicio,
  };
};
