import { api, useAuth } from "@/providers/AuthProvider";
import CedulaValidationService, {
  PersonaData,
} from "@/services/CedulaValidationService";
import { useState } from "react";

interface RegistrationState {
  ci: string;
  personaData: PersonaData | null;
  isValidating: boolean;
  error: string | null;
}

interface UseRegistrationResult {
  state: RegistrationState;
  validateCedula: (ci: string) => Promise<boolean>;
  clearError: () => void;
  reset: () => void;
}

/**
 * Hook para manejar el flujo de registro con validación de cédula
 */
export const useRegistration = (): UseRegistrationResult => {
  const [state, setState] = useState<RegistrationState>({
    ci: "",
    personaData: null,
    isValidating: false,
    error: null,
  });

  /**
   * Valida el formato de la cédula ecuatoriana
   */
  const isValidCedulaFormat = (ci: string): boolean => {
    if (ci.length !== 10) return false;

    // Validar que solo contenga números
    if (!/^\d+$/.test(ci)) return false;

    // Validar código de provincia (primeros 2 dígitos deben ser entre 01 y 24)
    const provincia = parseInt(ci.substring(0, 2));
    if (provincia < 1 || provincia > 24) return false;

    // Algoritmo de validación del dígito verificador
    const digits = ci.split("").map(Number);
    const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];

    let sum = 0;
    for (let i = 0; i < coefficients.length; i++) {
      let value = digits[i] * coefficients[i];
      if (value >= 10) value -= 9;
      sum += value;
    }

    const verifier = (10 - (sum % 10)) % 10;
    return verifier === digits[9];
  };

  /**
   * Valida la cédula completa:
   * 1. Formato válido
   * 2. No existe en el sistema
   * 3. Existe en la API de personas
   */
  const validateCedula = async (ci: string): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isValidating: true, error: null, ci }));

      // 1. Validar formato
      if (!isValidCedulaFormat(ci)) {
        setState((prev) => ({
          ...prev,
          isValidating: false,
          error: "Número de cédula inválido. Verifica que sea correcto.",
        }));
        return false;
      }

      // 2. Verificar si ya existe en el sistema
      const verificacionResponse = await api.usuarios.verificarCi({ ci });

      if (verificacionResponse.data.existe) {
        setState((prev) => ({
          ...prev,
          isValidating: false,
          error:
            "Esta cédula ya está registrada en el sistema. Por favor inicia sesión.",
        }));
        return false;
      }

      // 3. Validar en la API externa de personas
      const personaResponse = await CedulaValidationService.validarCedula(ci);

      if (!personaResponse || !personaResponse.success) {
        setState((prev) => ({
          ...prev,
          isValidating: false,
          error:
            "No se pudo verificar la cédula en el registro civil. Verifica que el número sea correcto.",
        }));
        return false;
      }

      // Todo válido - guardar datos
      setState((prev) => ({
        ...prev,
        isValidating: false,
        personaData: personaResponse.data,
        error: null,
      }));

      return true;
    } catch (error: any) {
      console.error("Error validating cedula:", error);

      let errorMessage = "Error al validar la cédula. Intenta nuevamente.";

      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Cédula inválida";
      } else if (error.response?.status === 500) {
        errorMessage = "Error del servidor. Por favor intenta más tarde.";
      } else if (!error.response) {
        errorMessage = "Sin conexión. Verifica tu internet.";
      }

      setState((prev) => ({
        ...prev,
        isValidating: false,
        error: errorMessage,
      }));

      return false;
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const reset = () => {
    setState({
      ci: "",
      personaData: null,
      isValidating: false,
      error: null,
    });
  };

  return {
    state,
    validateCedula,
    clearError,
    reset,
  };
};

/**
 * Hook para manejar el formulario completo de registro
 * Ahora usa el método signUp del AuthProvider que incluye inicio de sesión automático
 */
export const useCompleteRegistration = () => {
  const { signUp } = useAuth(); // Usar el método del provider
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: {
    email: string;
    password: string;
    nombreCompleto: string;
    numeroContacto: string;
    edad: number;
    ci: string;
    urlFoto?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      await signUp(data);

    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMsg = err.message || "Error al registrarse";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    register,
    loading,
    error,
    clearError,
  };
};