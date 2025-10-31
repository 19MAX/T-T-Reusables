import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { useProfileUpdate } from "@/hooks/profile/useProfileUpdates";
import { useUserProfile } from "@/hooks/profile/useUserProfile";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  nivelEducacion: Yup.string().optional(),
  ciudadania: Yup.string().optional(),
  trabajoTipo: Yup.string().optional(),
  trabajoCiudad: Yup.string().optional(),
  trabajoExpectativa: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .optional()
    .min(0, "Debe ser mayor a 0")
    .max(999999, "Monto muy alto"),
});

// Opciones predefinidas
const NIVELES_EDUCACION = [
  "Primaria",
  "Secundaria",
  "Bachillerato",
  "Técnico",
  "Universitaria",
  "Postgrado",
  "Otro",
];

const CIUDADES_ECUADOR = [
  "Quito",
  "Guayaquil",
  "Cuenca",
  "Santo Domingo",
  "Machala",
  "Durán",
  "Manta",
  "Portoviejo",
  "Loja",
  "Ambato",
  "Esmeraldas",
  "Quevedo",
  "Riobamba",
  "Milagro",
  "Ibarra",
  "La Libertad",
  "Babahoyo",
  "Sangolquí",
  "Otra",
];

export default function EditAdditionalInfoScreen() {
  const { profile, loading: profileLoading } = useUserProfile();
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const { promise } = useToast();
  const { updateAdditionalInfo, loading } = useProfileUpdate();

  const [showEducationOptions, setShowEducationOptions] = React.useState(false);
  const [showCityOptions, setShowCityOptions] = React.useState(false);

  const ciudadaniaInputRef = useRef<TextInput>(null);
  const trabajoTipoInputRef = useRef<TextInput>(null);
  const expectativaInputRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      nivelEducacion: "",
      ciudadania: "",
      trabajoTipo: "",
      trabajoCiudad: "",
      trabajoExpectativa: undefined as number | undefined,
    },
  });

  const nivelEducacion = watch("nivelEducacion");
  const trabajoCiudad = watch("trabajoCiudad");

  // Actualizar valores cuando el perfil cargue
  useEffect(() => {
    if (profile) {
      setValue("nivelEducacion", profile.nivelEducacion || "");
      setValue("ciudadania", profile.ciudadania || "");

      // Manejar trabajoDeseado que puede ser un objeto
      const trabajoDeseado = profile.trabajoDeseado as any;
      if (trabajoDeseado) {
        setValue("trabajoTipo", trabajoDeseado.tipo || "");
        setValue("trabajoCiudad", trabajoDeseado.ciudad || "");
        setValue("trabajoExpectativa", trabajoDeseado.expectativaIngresos);
      }
    }
  }, [profile, setValue]);

  const handleBack = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    router.back();
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const updateData: any = {};

    if (data.nivelEducacion) {
      updateData.nivelEducacion = data.nivelEducacion.trim();
    }

    if (data.ciudadania) {
      updateData.ciudadania = data.ciudadania.trim();
    }

    // Solo incluir trabajoDeseado si al menos uno de los campos tiene valor
    if (data.trabajoTipo || data.trabajoCiudad || data.trabajoExpectativa) {
      updateData.trabajoDeseado = {
        ...(data.trabajoTipo && { tipo: data.trabajoTipo.trim() }),
        ...(data.trabajoCiudad && { ciudad: data.trabajoCiudad.trim() }),
        ...(data.trabajoExpectativa && {
          expectativaIngresos: data.trabajoExpectativa,
        }),
      };
    }

    try {
      await promise(updateAdditionalInfo(updateData), {
        loading: "Actualizando información...",
        success: "Información adicional actualizada",
        error: (err: any) => err.message || "Error al actualizar",
      });

      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (err) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch {}
    }
  });

  if (profileLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-muted-foreground">Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="p-4 gap-6">
            {/* Sección: Educación y Ciudadanía */}
            <View className="bg-card rounded-2xl p-5 border border-border gap-5">
              <View>
                <Text className="text-base font-semibold mb-3">
                  Datos personales
                </Text>

                {/* Nivel de educación */}
                <View className="gap-2 mb-4">
                  <Label htmlFor="nivelEducacion">Nivel de educación</Label>
                  <Controller
                    control={control}
                    name="nivelEducacion"
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TouchableOpacity
                          onPress={() =>
                            setShowEducationOptions(!showEducationOptions)
                          }
                          activeOpacity={0.7}
                        >
                          <Input
                            id="nivelEducacion"
                            placeholder="Selecciona tu nivel educativo"
                            value={value}
                            editable={false}
                            pointerEvents="none"
                          />
                        </TouchableOpacity>

                        {showEducationOptions && (
                          <View className="mt-2 bg-muted rounded-xl border border-border overflow-hidden">
                            {NIVELES_EDUCACION.map((nivel, index) => (
                              <TouchableOpacity
                                key={nivel}
                                activeOpacity={0.7}
                                className={cn(
                                  "px-4 py-3",
                                  index !== NIVELES_EDUCACION.length - 1 &&
                                    "border-b border-border",
                                  value === nivel && "bg-primary/10"
                                )}
                                onPress={() => {
                                  onChange(nivel);
                                  setShowEducationOptions(false);
                                  try {
                                    Haptics.impactAsync(
                                      Haptics.ImpactFeedbackStyle.Light
                                    );
                                  } catch {}
                                }}
                              >
                                <Text
                                  className={cn(
                                    "text-sm",
                                    value === nivel &&
                                      "text-primary font-semibold"
                                  )}
                                >
                                  {nivel}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </>
                    )}
                  />
                  {errors.nivelEducacion && (
                    <Text className="text-destructive text-xs">
                      {errors.nivelEducacion.message}
                    </Text>
                  )}
                </View>

                {/* Ciudadanía */}
                <View className="gap-2">
                  <Label htmlFor="ciudadania">Ciudadanía / Nacionalidad</Label>
                  <Controller
                    control={control}
                    name="ciudadania"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        ref={ciudadaniaInputRef}
                        id="ciudadania"
                        placeholder="Ej: Ecuatoriana"
                        value={value}
                        onChangeText={onChange}
                        editable={!loading}
                        returnKeyType="next"
                        autoCapitalize="words"
                        onSubmitEditing={() =>
                          trabajoTipoInputRef.current?.focus()
                        }
                      />
                    )}
                  />
                  {errors.ciudadania && (
                    <Text className="text-destructive text-xs">
                      {errors.ciudadania.message}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Sección: Trabajo Deseado */}
            <View className="bg-card rounded-2xl p-5 border border-border gap-5">
              <View>
                <View className="flex-row items-center mb-3">
                  <Ionicons
                    name="briefcase-outline"
                    size={20}
                    color={colorScheme === "dark" ? "#ffffff" : "#000000"}
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-base font-semibold">
                    Trabajo deseado
                  </Text>
                </View>
                <Text className="text-xs text-muted-foreground mb-4">
                  Todos los campos son opcionales
                </Text>

                {/* Tipo de trabajo */}
                <View className="gap-2 mb-4">
                  <Label htmlFor="trabajoTipo">Tipo de servicio</Label>
                  <Controller
                    control={control}
                    name="trabajoTipo"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        ref={trabajoTipoInputRef}
                        id="trabajoTipo"
                        placeholder="Ej: Mesera, Desarrollador, Diseñador"
                        value={value}
                        onChangeText={onChange}
                        editable={!loading}
                        returnKeyType="next"
                        autoCapitalize="words"
                      />
                    )}
                  />
                  {errors.trabajoTipo && (
                    <Text className="text-destructive text-xs">
                      {errors.trabajoTipo.message}
                    </Text>
                  )}
                </View>

                {/* Ciudad */}
                <View className="gap-2 mb-4">
                  <Label htmlFor="trabajoCiudad">Ciudad preferida</Label>
                  <Controller
                    control={control}
                    name="trabajoCiudad"
                    render={({ field: { onChange, value } }) => (
                      <>
                        <TouchableOpacity
                          onPress={() => setShowCityOptions(!showCityOptions)}
                          activeOpacity={0.7}
                        >
                          <Input
                            id="trabajoCiudad"
                            placeholder="Selecciona una ciudad"
                            value={value}
                            editable={false}
                            pointerEvents="none"
                          />
                        </TouchableOpacity>

                        {showCityOptions && (
                          <ScrollView
                            className="mt-2 bg-muted rounded-xl border border-border max-h-48"
                            nestedScrollEnabled
                          >
                            {CIUDADES_ECUADOR.map((ciudad, index) => (
                              <TouchableOpacity
                                key={ciudad}
                                activeOpacity={0.7}
                                className={cn(
                                  "px-4 py-3",
                                  index !== CIUDADES_ECUADOR.length - 1 &&
                                    "border-b border-border",
                                  value === ciudad && "bg-primary/10"
                                )}
                                onPress={() => {
                                  onChange(ciudad);
                                  setShowCityOptions(false);
                                  try {
                                    Haptics.impactAsync(
                                      Haptics.ImpactFeedbackStyle.Light
                                    );
                                  } catch {}
                                }}
                              >
                                <Text
                                  className={cn(
                                    "text-sm",
                                    value === ciudad &&
                                      "text-primary font-semibold"
                                  )}
                                >
                                  {ciudad}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        )}
                      </>
                    )}
                  />
                  {errors.trabajoCiudad && (
                    <Text className="text-destructive text-xs">
                      {errors.trabajoCiudad.message}
                    </Text>
                  )}
                </View>

                {/* Expectativa de ingresos */}
                <View className="gap-2">
                  <Label htmlFor="trabajoExpectativa">
                    Expectativa de ingresos (USD/mes)
                  </Label>
                  <Controller
                    control={control}
                    name="trabajoExpectativa"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        ref={expectativaInputRef}
                        id="trabajoExpectativa"
                        placeholder="Ej: 500"
                        keyboardType="numeric"
                        value={value?.toString() || ""}
                        onChangeText={(text) => {
                          const numValue = text ? parseFloat(text) : undefined;
                          onChange(numValue);
                        }}
                        editable={!loading}
                        returnKeyType="done"
                      />
                    )}
                  />
                  {errors.trabajoExpectativa && (
                    <Text className="text-destructive text-xs">
                      {errors.trabajoExpectativa.message}
                    </Text>
                  )}
                  <Text className="text-xs text-muted-foreground">
                    Ingreso mensual esperado en dólares americanos
                  </Text>
                </View>
              </View>
            </View>

            {/* Botones */}
            <View className="gap-3 pb-6">
              <Button
                onPress={onSubmit}
                disabled={loading || !isDirty}
                className="w-full"
              >
                {loading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="font-semibold">Guardar cambios</Text>
                )}
              </Button>

              {isDirty && (
                <Text className="text-xs text-center text-muted-foreground">
                  Tienes cambios sin guardar
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
