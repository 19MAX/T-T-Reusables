import { api } from '@/providers/AuthProvider';
import { useEffect, useState } from 'react';

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
  fechaCreacion?: string;
  fechaActualizacion?: string;
  fechaInicioOferta?: string;
  fechaFinOferta?: string;
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
    nombre?: string;
    email?: string;
    calificacionPromedio?: number;
  };
}

interface UseOffersResult {
  ofertas: Oferta[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener las ofertas activas
 * El token de autenticación ya está configurado en el API client,
 * por lo que no necesitas pasarlo manualmente
 */
export const useOffers = (): UseOffersResult => {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOfertas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // El token ya está en los headers, no necesitas configurarlo
      const response = await api.ofertas.obtenerOfertasActivas();
      
      setOfertas(response.data || []);
    } catch (err: any) {
      console.error('Error fetching ofertas:', err);
      setError(err.response?.data?.message || 'Error al cargar las ofertas');
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
 * Hook para obtener las ofertas del usuario autenticado
 */
export const useMyOffers = (): UseOffersResult => {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyOfertas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Asume que tienes un endpoint para obtener las ofertas del usuario
      // Si no existe, puedes filtrar las ofertas activas por usuarioId
      const response = await api.ofertas.obtenerMisOfertas();
      
      setOfertas(response.data || []);
    } catch (err: any) {
      console.error('Error fetching my ofertas:', err);
      setError(err.response?.data?.message || 'Error al cargar tus ofertas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOfertas();
  }, []);

  return {
    ofertas,
    loading,
    error,
    refetch: fetchMyOfertas,
  };
};

/**
 * Hook para crear una nueva oferta
 */
// export const useCreateOffer = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const createOffer = async (data: Partial<Oferta>) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await api.ofertas.crearOferta(data);
      
//       return response.data;
//     } catch (err: any) {
//       console.error('Error creating oferta:', err);
//       const errorMsg = err.response?.data?.message || 'Error al crear la oferta';
//       setError(errorMsg);
//       throw new Error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     createOffer,
//     loading,
//     error,
//   };
// };