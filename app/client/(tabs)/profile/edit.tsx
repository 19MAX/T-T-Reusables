import { FormSection } from "@/components/custom/profile/FormSection";
import { ProfilePhotoEditor } from "@/components/custom/profile/ProfilePhotoEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import {
    UpdateProfileData,
    useProfileMutations,
} from "@/hooks/profile/useProfileMutation";
import { useUserProfile } from "@/hooks/profile/useUserProfile";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";

const CIUDADES_ECUADOR = [
  "Quito",
  "Guayaquil",
  "Cuenca",
  "Santo Domingo",
  "Machala",
  "Manta",
  "Portoviejo",
  "Loja",
  "Ambato",
  "Esmeraldas",
  "Riobamba",
  "Ibarra",
];

const MODALIDADES = ["presencial", "virtual", "ambas"] as const;

const EditProfileScreen = () => {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { profile, loading: profileLoading, refetch } = useUserProfile();
  const { updateProfile, updateProfileLoading, configureProfile } =
    useProfileMutations();

  // Estado del formulario
  const [formData, setFormData] = useState<UpdateProfileData>({
    nombreCompleto: "",
    numeroContacto: "",
    edad: undefined,
    ci: "",
    nivelEducacion: "",
    ciudadania: "",
    trabajoDeseado: undefined,
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Cargar datos del perfil
  useEffect(() => {
    if (profile) {
      setFormData({
        nombreCompleto: profile.nombreCompleto || "",
        numeroContacto: profile.numeroContacto || "",
        edad: profile.edad,
        ci: profile.ci || "",
        nivelEducacion: profile.nivelEducacion || "",
        ciudadania: profile.ciudadania || "",
        trabajoDeseado: profile.trabajoDeseado,
      });
    }
  }, [profile]);

  // Detectar cambios
  useEffect(() => {
    if (!profile) return;

    const changed =
      formData.nombreCompleto !== (profile.nombreCompleto || "") ||
      formData.numeroContacto !== (profile.numeroContacto || "") ||
      formData.edad !== profile.edad ||
      formData.ci !== (profile.ci || "") ||
      formData.nivelEducacion !== (profile.nivelEducacion || "") ||
      formData.ciudadania !== (profile.ciudadania || "") ||
      JSON.stringify(formData.trabajoDeseado) !==
        JSON.stringify(profile.trabajoDeseado);

    setHasChanges(changed);
  }, [formData, profile]);

  const handleInputChange = (field: keyof UpdateProfileData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTrabajoDeseadoChange = (
    field: keyof NonNullable<UpdateProfileData["trabajoDeseado"]>,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      trabajoDeseado: {
        ...(prev.trabajoDeseado || { tipo: "", ciudad: "" }),
        [field]: value,
      },
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.nombreCompleto?.trim()) {
      Alert.alert("Error", "El nombre completo es obligatorio");
      return false;
    }

    if (!formData.numeroContacto?.trim()) {
      Alert.alert("Error", "El número de contacto es obligatorio");
      return false;
    }

    if (formData.edad && (formData.edad < 18 || formData.edad > 100)) {
      Alert.alert("Error", "La edad debe estar entre 18 y 100 años");
      return false;
    }

    if (formData.ci && !/^\d{10}$/.test(formData.ci)) {
      Alert.alert("Error", "La cédula debe tener 10 dígitos");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    if (!validateForm()) return;

    try {
      if (profile?.id) {
        // Si tiene trabajo deseado, usar configureProfile
        if (formData.trabajoDeseado?.tipo && formData.trabajoDeseado?.ciudad) {
          await configureProfile({
            id: profile.id,
            data: formData,
          });
        } else {
          // Sino, actualizar perfil básico
          await updateProfile({
            nombreCompleto: formData.nombreCompleto,
            numeroContacto: formData.numeroContacto,
          });
        }

        try {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
        } catch {}

        Alert.alert("Éxito", "Perfil actualizado correctamente", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "No se pudo actualizar el perfil"
      );
    }
  };

  if (profileLoading && !profile) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      {/* Header */}
      <View className="bg-card border-b border-border px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 -ml-2"
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colorScheme === "dark" ? "#ffffff" : "#000000"}
          />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Editar Perfil</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={profileLoading} onRefresh={refetch} />
        }
      >
        {/* Foto de Perfil */}
        <View className="py-8 bg-card border-b border-border">
          <ProfilePhotoEditor
            currentPhotoUrl={profile?.urlFoto}
            userName={profile?.nombreCompleto}
            size="xl"
          />
        </View>

        <View className="p-4">
          {/* Información Personal */}
          <FormSection
            title="Información Personal"
            description="Datos básicos de tu cuenta"
            icon="person"
          >
            <View className="gap-4">
              <View>
                <Label nativeID="nombreCompleto">Nombre Completo *</Label>
                <Input
                  placeholder="Juan Pérez González"
                  value={formData.nombreCompleto}
                  onChangeText={(text) =>
                    handleInputChange("nombreCompleto", text)
                  }
                  aria-labelledby="nombreCompleto"
                />
              </View>

              <View>
                <Label nativeID="numeroContacto">Número de Contacto *</Label>
                <Input
                  placeholder="0987654321"
                  value={formData.numeroContacto}
                  onChangeText={(text) =>
                    handleInputChange("numeroContacto", text)
                  }
                  keyboardType="phone-pad"
                  aria-labelledby="numeroContacto"
                />
              </View>

              <View>
                <Label nativeID="edad">Edad</Label>
                <Input
                  placeholder="25"
                  value={formData.edad?.toString() || ""}
                  onChangeText={(text) =>
                    handleInputChange("edad", text ? parseInt(text) : undefined)
                  }
                  keyboardType="number-pad"
                  aria-labelledby="edad"
                />
              </View>

              <View>
                <Label nativeID="ci">Cédula de Identidad</Label>
                <Input
                  placeholder="1234567890"
                  value={formData.ci}
                  onChangeText={(text) => handleInputChange("ci", text)}
                  keyboardType="number-pad"
                  maxLength={10}
                  aria-labelledby="ci"
                />
              </View>
            </View>
          </FormSection>

          {/* Información Adicional */}
          <FormSection
            title="Información Adicional"
            description="Completa tu perfil profesional"
            icon="school"
          >
            <View className="gap-4">
              <View>
                <Label nativeID="nivelEducacion">Nivel de Educación</Label>
                <Input
                  placeholder="Universitaria, Secundaria, etc."
                  value={formData.nivelEducacion}
                  onChangeText={(text) =>
                    handleInputChange("nivelEducacion", text)
                  }
                  aria-labelledby="nivelEducacion"
                />
              </View>

              <View>
                <Label nativeID="ciudadania">Ciudadanía</Label>
                <Input
                  placeholder="Ecuatoriana"
                  value={formData.ciudadania}
                  onChangeText={(text) =>
                    handleInputChange("ciudadania", text)
                  }
                  aria-labelledby="ciudadania"
                />
              </View>
            </View>
          </FormSection>

          {/* Trabajo Deseado */}
          <FormSection
            title="Trabajo Deseado"
            description="¿Qué servicios deseas ofrecer?"
            icon="briefcase"
          >
            <View className="gap-4">
              <View>
                <Label nativeID="tipoTrabajo">Tipo de Servicio</Label>
                <Input
                  placeholder="Mesera, Desarrollador, etc."
                  value={formData.trabajoDeseado?.tipo || ""}
                  onChangeText={(text) =>
                    handleTrabajoDeseadoChange("tipo", text)
                  }
                  aria-labelledby="tipoTrabajo"
                />
              </View>

              <View>
                <Label nativeID="ciudadTrabajo">Ciudad</Label>
                <Input
                  placeholder="Quito, Guayaquil, etc."
                  value={formData.trabajoDeseado?.ciudad || ""}
                  onChangeText={(text) =>
                    handleTrabajoDeseadoChange("ciudad", text)
                  }
                  aria-labelledby="ciudadTrabajo"
                />
              </View>

              <View>
                <Label nativeID="expectativaIngresos">
                  Expectativa de Ingresos (USD)
                </Label>
                <Input
                  placeholder="500"
                  value={
                    formData.trabajoDeseado?.expectativaIngresos?.toString() ||
                    ""
                  }
                  onChangeText={(text) =>
                    handleTrabajoDeseadoChange(
                      "expectativaIngresos",
                      text ? parseInt(text) : undefined
                    )
                  }
                  keyboardType="number-pad"
                  aria-labelledby="expectativaIngresos"
                />
              </View>
            </View>
          </FormSection>

          {/* Botón Guardar */}
          <View className="mt-4 mb-8">
            <Button
              onPress={handleSave}
              disabled={!hasChanges || updateProfileLoading}
              size="lg"
            >
              <Text>
                {updateProfileLoading ? "Guardando..." : "Guardar Cambios"}
              </Text>
            </Button>

            {hasChanges && (
              <Text className="text-sm text-muted-foreground text-center mt-2">
                Tienes cambios sin guardar
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;