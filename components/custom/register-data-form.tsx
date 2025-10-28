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
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useToast } from "@/providers/ToastProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("El email es obligatorio")
    .email("El email no es válido"),

  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(8, "Debe tener al menos 8 caracteres")
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Debe contener mayúscula, minúscula y número"
    ),

  confirmPassword: Yup.string()
    .required("Confirma tu contraseña")
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),

  phone: Yup.string()
    .required("El teléfono es obligatorio")
    .matches(/^[0-9]{10}$/, "El teléfono debe tener 10 dígitos"),

  birthDate: Yup.date()
    .required("La fecha de nacimiento es obligatoria")
    .test("edad-valida", "Debes tener entre 18 y 100 años", (value) => {
      if (!value) return false;
      const today = new Date();
      const age =
        today.getFullYear() -
        value.getFullYear() -
        (today <
        new Date(today.getFullYear(), value.getMonth(), value.getDate())
          ? 1
          : 0);
      return age >= 18 && age <= 100;
    }),
});

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

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      email: params.email || "",
      password: "",
      confirmPassword: "",
      phone: params.phone || "",
      birthDate: undefined,
    },
  });

  const { register, loading } = useCompleteRegistration();
  const { promise } = useToast();

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);

  // Prellenar datos si vienen de la validación de cédula (solo una vez)
  useEffect(() => {
    if (!isInitialized && params) {
      if (params.dateOfBirth) {
        try {
          const [year, month, day] = params.dateOfBirth.split("-").map(Number);
          const parsedDate = new Date(year, month - 1, day);
          if (!isNaN(parsedDate.getTime())) {
            setBirthDate(parsedDate);
            // Actualiza el valor en react-hook-form
            setValue("birthDate", parsedDate);
          }
        } catch (error) {
          console.error("Error parsing date:", error);
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

  const onSubmit = handleSubmit(async (data) => {
    const edad = calculateAge(data.birthDate);

    try {
      await promise(
        register({
          ci: params.ci,
          email: data.email.trim(),
          password: data.password,
          nombreCompleto: params.fullName || "Usuario",
          numeroContacto: data.phone,
          edad: edad,
        }),
        {
          loading: "Creando tu cuenta...",
          success: (res) => {
            const usuario = res.data;
            return usuario?.nombreCompleto
              ? `¡Bienvenido ${usuario.nombreCompleto}! Recibes ${usuario.creditosDisponibles ?? 0} créditos de bienvenida`
              : res.message || "Usuario creado exitosamente";
          },
          error: (err: any) =>{
            return err.message || "No se pudo crear la cuenta";          },
        }
      );

      setTimeout(() => {
        router.replace("/client/(tabs)/home");
      }, 1500);
    } catch (err) {
      // El error ya fue manejado
    }
  });

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
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    ref={emailInputRef}
                    id="email"
                    placeholder="m@example.com"
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                    returnKeyType="next"
                    value={value}
                    onChangeText={onChange}
                    editable={!loading}
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                  />
                )}
              />

              {errors.email && (
                <Text className="text-red-500 text-xs">
                  {errors.email.message}
                </Text>
              )}
            </View>

            {/* Contraseña */}
            <View className="gap-1.5">
              <Label htmlFor="password">Contraseña *</Label>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    ref={passwordInputRef}
                    id="password"
                    secureTextEntry
                    returnKeyType="next"
                    value={value}
                    onChangeText={onChange}
                    editable={!loading}
                    onSubmitEditing={() =>
                      confirmPasswordInputRef.current?.focus()
                    }
                  />
                )}
              />
              <Text className="text-xs text-muted-foreground">
                Mínimo 8 caracteres, incluye mayúscula, minúscula y número
              </Text>

              {errors.password && (
                <Text className="text-red-500 text-xs">
                  {errors.password.message}
                </Text>
              )}
            </View>

            {/* Confirmar contraseña */}
            <View className="gap-1.5">
              <Label htmlFor="confirm-password">Confirmar contraseña *</Label>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <Input
                    ref={confirmPasswordInputRef}
                    id="confirm-password"
                    secureTextEntry
                    returnKeyType="next"
                    value={value}
                    onChangeText={onChange}
                    editable={!loading}
                    onSubmitEditing={() => phoneInputRef.current?.focus()}
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            {/* Teléfono */}
            <View className="gap-1.5">
              <Label htmlFor="phone">Teléfono *</Label>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, value } }) => (
                  <Input
                    ref={phoneInputRef}
                    id="phone"
                    placeholder="0987654321"
                    inputMode="numeric"
                    maxLength={10}
                    returnKeyType="done"
                    value={value}
                    onChangeText={onChange}
                    editable={!loading}
                  />
                )}
              />
              {errors.phone && (
                <Text className="text-red-500 text-xs">
                  {errors.phone.message}
                </Text>
              )}
            </View>

            {/* Fecha de nacimiento */}
            <View className="gap-1.5">
              <Label htmlFor="birthDate">Fecha de nacimiento *</Label>
              <Controller
                control={control}
                name="birthDate"
                render={({ field: { onChange, value } }) => (
                  <>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                      <Input
                        id="birthDate"
                        placeholder="Fecha de nacimiento"
                        value={
                          value
                            ? new Date(value).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })
                            : ""
                        }
                        editable={false}
                        pointerEvents="none"
                      />
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={
                          value || birthDate || maxDate || new Date(2000, 0, 1)
                        }
                        mode="date"
                        display="spinner"
                        maximumDate={maxDate}
                        minimumDate={minDate}
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(false);
                          if (selectedDate && event.type === "set") {
                            setBirthDate(selectedDate);
                            onChange(selectedDate);
                          }
                        }}
                      />
                    )}
                  </>
                )}
              />

              {errors.birthDate && (
                <Text className="text-red-500 text-xs">
                  {errors.birthDate.message}
                </Text>
              )}
            </View>

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
