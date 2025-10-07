import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// Configuración del QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran frescos (5 minutos)
      staleTime: 5 * 60 * 1000,
      // Tiempo antes de eliminar datos inactivos del caché (10 minutos)
      gcTime: 10 * 60 * 1000,
      // Reintentar consultas fallidas 2 veces
      retry: 2,
      // Refrescar datos cuando la ventana recibe foco
      refetchOnWindowFocus: true,
      // No refrescar automáticamente en cada montaje
      refetchOnMount: false,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

// Exportar el queryClient para uso manual si es necesario
export { queryClient };
