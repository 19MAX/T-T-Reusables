import { queryClient } from "@/providers/QueryProvider";
import { Api } from "@/services/api/client/Api";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
}

interface User {
  id: string;
  email: string;
  nombreCompleto?: string;
  rol?: string;
}

interface SignUpData {
  email: string;
  password: string;
  nombreCompleto: string;
  numeroContacto: string;
  edad: number;
  ci: string;
  urlFoto?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// Inicializa el cliente API
const api = new Api({
  baseURL: "https://api-tandt.softecsa.com/api",
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Cargar estado de autenticación al iniciar
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const userStr = await SecureStore.getItemAsync(USER_KEY);

        if (token && userStr) {
          const userData = JSON.parse(userStr);

          // Configurar el token en el cliente API
          api.instance.defaults.headers.common["Authorization"] =
            `Bearer ${token}`;

          setIsAuthenticated(true);
          setUser(userData);
        }
      } catch (e) {
        console.error("Error loading auth state:", e);
      } finally {
        setLoading(false);
      }
    };
    loadAuthState();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.auth.loginUsuario({ email, password });

      // La API devuelve "usuario" en lugar de "user"
      const userData = (response.data as any).usuario || response.data.user;

      if (response.data.accessToken && userData) {
        const { accessToken } = response.data;

        // Guardar token y usuario en SecureStore
        await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));

        // Configurar el token en el cliente API
        api.instance.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`;

        setIsAuthenticated(true);
        setUser(userData as User);

        // Limpiar el caché cuando inicia sesión un nuevo usuario
        queryClient.clear();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw new Error(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      const response = await api.auth.registrarUsuario(data);

      const usuario = (response.data as any).usuario;

      if (usuario && (usuario.id || usuario.email)) {
        // Después del registro exitoso, iniciar sesión automáticamente
        await signIn(data.email, data.password);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Sign up error:", error);

      if (error.message === "Invalid response from server") {
        throw error;
      }

      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        throw new Error(errorMessage.join(", "));
      }
      throw new Error(errorMessage || "Error al registrarse");
    }
  };

  const signOut = async () => {
    try {
      // Intentar cerrar sesión en el servidor
      await api.auth.cerrarSesion();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Limpiar el caché de React Query
      queryClient.clear();

      // Limpiar estado local
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);

      // Limpiar el header del cliente API
      delete api.instance.defaults.headers.common["Authorization"];

      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, signIn, signOut, signUp }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Exportar la instancia del API para usar en otros lugares
export { api };
