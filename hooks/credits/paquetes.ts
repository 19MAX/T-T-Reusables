import { api } from "@/providers/AuthProvider";
import { normalizeApiError } from "@/utils/normalizeApiError";
import { useEffect, useState } from "react";

export interface Paquete {
  id?: string;
  nombre?: string;
  descripcion?: string;
  cantidadCreditos?: number;
  precio?: number;
  moneda?: string;
  activo?: boolean;
  etiqueta?: string;
  descuento?: number;
  orden?: number;
}

interface UsePaquetesResult {
  paquetes: Paquete[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener la lista de paquetes disponibles
 */
export const usePaquetes = (
  incluirInactivos: boolean = false
): UsePaquetesResult => {
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaquetes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.paquetes.obtenerPaquetes({
        incluirInactivos: incluirInactivos.toString(),
      });

      setPaquetes(response.data || []);
    } catch (err: any) {
      console.error("Error fetching paquetes:", err);
      const normalized = normalizeApiError(err);
      setError(normalized.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaquetes();
  }, [incluirInactivos]);

  return {
    paquetes,
    loading,
    error,
    refetch: fetchPaquetes,
  };
};
