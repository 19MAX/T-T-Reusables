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