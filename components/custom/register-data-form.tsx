import { DatePicker } from "@/components/custom/date-picker";
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
import { useCompleteRegistration } from "@/hooks/useRegistration";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  TextInput,
  View,
} from "react-native";

export function RegisterDataForm() {
  const params = useLocalSearchParams<{
    ci: string;
    firstName: string;
    firstSurname: string;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
  }>();

  const { register, loading, error } = useCompleteRegistration();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  // Prellenar datos si vienen de la validación de cédula (solo una vez)
  useEffect(() => {
    if (!isInitialized && params) {
      setEmail(params.email || "");
      setPhone(params.phone || "");

      // Si viene fecha de nacimiento, convertirla a Date (corregir timezone)
      if (params.dateOfBirth) {
        try {
          // Parsear como fecha local (sin conversión de timezone)
          const [year, month, day] = params.dateOfBirth.split("-").map(Number);
          const date = new Date(year, month - 1, day); // month es 0-indexed

          if (!isNaN(date.getTime())) {
            setBirthDate(date);
          }
        } catch (e) {
          console.error("Error parsing date:", e);
        }
      }

      setIsInitialized(true);
    }
  }, [params, isInitialized]);

  // Calcular edad desde fecha de nacimiento
  const calculateAge = (date: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < date.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Calcular la fecha máxima (18 años atrás desde hoy)
  const maxDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date;
  }, []);

  // Calcular la fecha mínima (100 años atrás desde hoy)
  const minDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 100);
    return date;
  }, []);

  const validateForm = (): boolean => {
    if (!email || !password || !confirmPassword || !phone || !birthDate) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Ingresa un correo electrónico válido");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return false;
    }

    if (password.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres");
      return false;
    }

    // Validar que tenga mayúscula, minúscula y número
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      Alert.alert(
        "Error",
        "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
      );
      return false;
    }

    if (phone.length !== 10) {
      Alert.alert("Error", "El teléfono debe tener 10 dígitos");
      return false;
    }

    const edad = calculateAge(birthDate);
    if (edad < 18 || edad > 100) {
      Alert.alert("Error", "Debes tener entre 18 y 100 años para registrarte");
      return false;
    }

    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;

    if (!birthDate || !params.ci) {
      Alert.alert("Error", "Faltan datos requeridos");
      return;
    }

    try {
      const edad = calculateAge(birthDate);

      await register({
        ci: params.ci,
        email: email.trim(),
        password: password,
        nombreCompleto: params.fullName || "Usuario",
        numeroContacto: phone,
        edad: edad,
      });

      Alert.alert(
        "¡Registro exitoso!",
        "¡Bienvenido! Tu cuenta ha sido creada correctamente. Recibes 5 créditos de bienvenida.",
        [
          {
            text: "Comenzar",
            onPress: () => router.replace("/client/(tabs)/home"),
          },
        ]
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Error al registrarse");
    }
  };

  const goToLogin = () => {
    router.replace("/auth/login");
  };

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Completa los datos
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            {params.firstName && params.firstSurname
              ? `¡Bienvenido/a ${params.firstName} ${params.firstSurname}!`
              : params.fullName
                ? `¡Bienvenido/a ${params.fullName}!`
                : "¡Bienvenido/a!"}
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            {/* Email */}
            <View className="gap-1.5">
              <Label htmlFor="email">Email *</Label>
              <Input
                ref={emailInputRef}
                id="email"
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                returnKeyType="next"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
            </View>

            {/* Contraseña */}
            <View className="gap-1.5">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                ref={passwordInputRef}
                id="password"
                secureTextEntry
                returnKeyType="next"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
              />
              <Text className="text-xs text-muted-foreground">
                Mínimo 8 caracteres, incluye mayúscula, minúscula y número
              </Text>
            </View>

            {/* Confirmar contraseña */}
            <View className="gap-1.5">
              <Label htmlFor="confirm-password">Confirmar contraseña *</Label>
              <Input
                ref={confirmPasswordInputRef}
                id="confirm-password"
                secureTextEntry
                returnKeyType="next"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
                onSubmitEditing={() => phoneInputRef.current?.focus()}
              />
            </View>

            {/* Teléfono */}
            <View className="gap-1.5">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                ref={phoneInputRef}
                id="phone"
                placeholder="0987654321"
                inputMode="numeric"
                maxLength={10}
                returnKeyType="done"
                value={phone}
                onChangeText={setPhone}
                editable={!loading}
              />
            </View>

            {/* Fecha de nacimiento */}
            <View className="gap-1.5">
              <Label htmlFor="birthDate">Fecha de nacimiento *</Label>
              <DatePicker
                id="birthDate"
                value={birthDate}
                onChange={setBirthDate}
                placeholder="Selecciona tu fecha de nacimiento"
                mode="date"
                maximumDate={maxDate}
                minimumDate={minDate}
                disabled={loading}
              />
              {birthDate && (
                <Text className="text-xs text-muted-foreground">
                  Edad: {calculateAge(birthDate)} años
                </Text>
              )}
            </View>

            {/* Mensaje de error */}
            {error && (
              <View className="bg-destructive/10 border border-destructive rounded-md p-3">
                <Text className="text-destructive text-sm">{error}</Text>
              </View>
            )}

            {/* Botón de registro */}
            <Button className="w-full" onPress={onSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text>Crear cuenta</Text>
              )}
            </Button>
          </View>

          {/* Link a login */}
          <Text className="text-center text-sm mb-5">
            ¿Ya tienes una cuenta?{" "}
            <Pressable onPress={goToLogin} disabled={loading}>
              <Text className="text-sm underline underline-offset-4">
                Iniciar sesión
              </Text>
            </Pressable>
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
