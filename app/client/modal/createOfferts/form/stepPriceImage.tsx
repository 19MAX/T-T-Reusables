import ProgressHeader from "@/components/custom/progressHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import * as ImagePicker from "expo-image-picker";
import { Camera, Upload, X } from "lucide-react-native";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { CreateOfertaFormData } from "../types";

interface StepPriceImageProps {
  onNext: () => void;
  onBack: () => void;
}

const StepPriceImage = ({ onNext, onBack }: StepPriceImageProps) => {
  const {
    control,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useFormContext<CreateOfertaFormData>();

  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const currentImage = watch("imagen");

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permisos necesarios",
        "Necesitamos acceso a tu galería para seleccionar una imagen"
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      setIsLoadingImage(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setValue("imagen", {
          uri: asset.uri,
          mimeType: asset.mimeType || "image/jpeg",
        });
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar la imagen");
    } finally {
      setIsLoadingImage(false);
    }
  };

  const takePicture = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permisos necesarios",
          "Necesitamos acceso a tu cámara para tomar una foto"
        );
        return;
      }

      setIsLoadingImage(true);
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setValue("imagen", {
          uri: asset.uri,
          mimeType: asset.mimeType || "image/jpeg",
        });
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo tomar la foto");
    } finally {
      setIsLoadingImage(false);
    }
  };

  const removeImage = () => {
    setValue("imagen", undefined);
  };

  const handleContinue = async () => {
    const isValid = await trigger(["precioPersonalizado", "imagen"]);
    if (isValid) {
      onNext();
    }
  };

  return (
    <View className="flex-1">
      {/* Header con Progress */}
      <ProgressHeader
        currentStep={3}
        totalSteps={5}
        title="Precio e imagen"
        subtitle="Personaliza tu oferta"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Precio */}
          <View className="mb-6">
            <Label nativeID="precio" className="mb-2">
              Precio personalizado (Opcional)
            </Label>
            <Controller
              control={control}
              name="precioPersonalizado"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Ej: 25.50"
                  value={value ? value.toString() : ""}
                  onChangeText={(text) => {
                    const numValue = parseFloat(text);
                    onChange(isNaN(numValue) ? undefined : numValue);
                  }}
                  onBlur={onBlur}
                  keyboardType="decimal-pad"
                  aria-labelledby="precio"
                  aria-errormessage="precio-error"
                  className={errors.precioPersonalizado ? "border-destructive" : ""}
                />
              )}
            />
            {errors.precioPersonalizado && (
              <Text
                nativeID="precio-error"
                className="text-destructive text-sm mt-1"
              >
                {errors.precioPersonalizado.message}
              </Text>
            )}
            <Text className="text-muted-foreground text-xs mt-1">
              Deja vacío para usar el precio del servicio base
            </Text>
          </View>

          {/* Imagen */}
          <View className="mb-6">
            <Label className="mb-2">Imagen (Opcional)</Label>

            {currentImage ? (
              <View className="relative">
                <Image
                  source={{ uri: currentImage.uri }}
                  className="w-full h-48 rounded-lg"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={removeImage}
                  className="absolute top-2 right-2 bg-destructive rounded-full p-2"
                >
                  <X size={20} color="white" />
                </Pressable>
              </View>
            ) : (
              <View className="gap-3">
                <Pressable
                  onPress={pickImage}
                  disabled={isLoadingImage}
                  className="border-2 border-dashed border-border rounded-lg p-6 items-center justify-center active:opacity-70"
                >
                  <Upload size={32} className="text-muted-foreground mb-2" />
                  <Text className="text-center font-medium">
                    Seleccionar de galería
                  </Text>
                  <Text className="text-muted-foreground text-xs text-center mt-1">
                    Formato: JPG, PNG (Max. 5MB)
                  </Text>
                </Pressable>

                <Pressable
                  onPress={takePicture}
                  disabled={isLoadingImage}
                  className="border-2 border-border rounded-lg p-4 flex-row items-center justify-center active:opacity-70"
                >
                  <Camera size={24} className="text-muted-foreground mr-2" />
                  <Text className="font-medium">Tomar foto</Text>
                </Pressable>
              </View>
            )}

            {errors.imagen && (
              <Text className="text-destructive text-sm mt-1">
                {errors.imagen.message}
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View className="px-4 py-4 border-t border-border flex-row gap-3">
        <Button onPress={onBack} variant="outline" className="flex-1">
          <Text className="font-semibold">Atrás</Text>
        </Button>
        <Button onPress={handleContinue} className="flex-1">
          <Text className="font-semibold">Continuar</Text>
        </Button>
      </View>
    </View>
  );
};

export default StepPriceImage;