import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

/**
 * Hook personalizado para manejar el cierre de sesión
 * Incluye confirmación, loading states y manejo de errores
 */
export const useLogout = () => {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  /**
   * Cierra sesión con confirmación previa
   */
  const logoutWithConfirmation = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: () => handleLogout(),
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Cierra sesión sin confirmación
   */
  const handleLogout = async () => {
    try {
      setLoading(true);

      // El signOut ya maneja la llamada al API y limpieza local
      await signOut();

      // Redireccionar al login
      router.replace("/auth/login");
    } catch (error: any) {
      console.error("Logout error:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al cerrar sesión. Se limpiará la sesión local.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/auth/login"),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cierra sesión de manera silenciosa (sin confirmación)
   * Útil para cuando el token expira o hay un error de autenticación
   */
  const silentLogout = async () => {
    try {
      await signOut();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Silent logout error:", error);
      router.replace("/auth/login");
    }
  };

  return {
    logout: logoutWithConfirmation,
    logoutWithoutConfirmation: handleLogout,
    silentLogout,
    loading,
  };
};
