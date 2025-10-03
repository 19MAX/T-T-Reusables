import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useRegistration } from "@/hooks/useRegistration";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  View
} from "react-native";

export function IdentificationForm() {
  const [cedula, setCedula] = useState("");
  const [isNavigating, setIsNavigating] = useState(false);
  const { state, validateCedula, clearError } = useRegistration();

  const handleSubmit = async () => {
    // Prevenir múltiples clicks
    if (isNavigating || state.isValidating) return;

    if (!cedula.trim()) {
      Alert.alert("Error", "Por favor ingresa tu número de cédula");
      return;
    }

    if (cedula.length !== 10) {
      Alert.alert("Error", "La cédula debe tener 10 dígitos");
      return;
    }

    const isValid = await validateCedula(cedula);

    if (isValid && state.personaData) {
      setIsNavigating(true);

      // Extraer primer nombre y primer apellido
      const firstName = state.personaData.name?.split(" ")[0] || "";
      const firstSurname = state.personaData.surname?.split(" ")[0] || "";

      // Construir el nombre completo solo con primer nombre y primer apellido
      const fullName =
        [firstName, firstSurname].filter(Boolean).join(" ") ||
        state.personaData.full_name?.split(" ").slice(0, 2).join(" ") ||
        "Usuario";

      // Navegar a la siguiente pantalla con los datos de la persona
      try {
        await router.push({
          pathname: "/auth/register/register-data",
          params: {
            ci: state.ci,
            firstName: firstName,
            firstSurname: firstSurname,
            fullName: fullName,
            email: state.personaData.email || "",
            phone: state.personaData.mobile || state.personaData.phone || "",
            dateOfBirth: state.personaData.date_of_birth || "",
          },
        });
      } catch (error) {
        console.error("Navigation error:", error);
        setIsNavigating(false);
      }
    }
  };

  const goToLogin = () => {
    router.push("/auth/login");
  };

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Empecemos
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Ingresa tu número de cedula
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email">Número de cédula</Label>
              <Input
                id="email"
                placeholder="1700000000"
                inputMode="numeric"
                maxLength={10}
                returnKeyType="send"
                editable={!state.isValidating}
                onSubmitEditing={handleSubmit}
                value={cedula}
                onChangeText={(text) => {
                  setCedula(text);
                  clearError();
                }}
              />

            {/* Mensaje de error */}
            {state.error && (
              <View className="bg-red-50 border border-red-200 rounded-lg p-3 mt-1">
                <Text className="text-red-600 text-sm">{state.error}</Text>
              </View>
            )}
            </View>
            <Button
              className="w-full"
              onPress={handleSubmit}
              disabled={state.isValidating || isNavigating}
            >
              {state.isValidating || isNavigating ? (
                <Text>
                  {state.isValidating ? "Verificando..." : "Cargando..."}
                </Text>
              ) : (
                <Text>Continuar</Text>
              )}
            </Button>
            <Button size="lg" variant="outline" className="w-full" onPress={goToLogin}>
              <Text>Ir al inicio de sesión</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
