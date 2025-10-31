import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useUpdateProfilePhoto } from "@/hooks/profile/useProfileMutation";
import { useUserProfile } from "@/hooks/profile/useUserProfile";
import { cn } from "@/lib/utils";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";

interface ProfilePhotoEditorProps {
  showName?: boolean;
  camera?: boolean;
  onPhotoUpdated?: (newPhotoUrl: string) => void;
  size?: "sm" | "md" | "mdSm" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-16 w-16",
  mdSm: "h-20 w-20",
  md: "h-24 w-24",
  lg: "h-32 w-32",
  xl: "h-40 w-40",
};

export const ProfilePhotoEditor: React.FC<ProfilePhotoEditorProps> = ({
  onPhotoUpdated,
  size = "xl",
  camera = true,
  showName = false,
}) => {
  const { profile, loading: loadingProfile } = useUserProfile();
  const { updatePhoto, loading: uploading } = useUpdateProfilePhoto();
  const [localPhotoUri, setLocalPhotoUri] = useState<string | undefined>();

  useEffect(() => {
    if (profile?.urlFoto) {
      setLocalPhotoUri(profile.urlFoto);
    }
  }, [profile?.urlFoto]);

  const initials =
    profile?.nombreCompleto
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "US";

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permisos necesarios",
        "Necesitamos acceso a tu galería para actualizar tu foto de perfil."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setLocalPhotoUri(uri);
      await handleUploadPhoto(uri);
    }
  };

  const takePhoto = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permisos necesarios",
        "Necesitamos acceso a tu cámara para tomar una foto."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      setLocalPhotoUri(uri);
      await handleUploadPhoto(uri);
    }
  };

  const handleUploadPhoto = async (uri: string) => {
    try {
      const result = await updatePhoto(uri);
      if (result.success && result.urlFoto) {
        try {
          await Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
        } catch {}
        onPhotoUpdated?.(result.urlFoto);
        setLocalPhotoUri(result.urlFoto);
      } else {
        Alert.alert("Error", result.error || "No se pudo actualizar la foto");
        setLocalPhotoUri(profile?.urlFoto);
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al subir la foto");
      setLocalPhotoUri(profile?.urlFoto);
    }
  };

  const showPhotoOptions = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    Alert.alert("Foto de perfil", "Elige una opción", [
      { text: "Tomar foto", onPress: takePhoto },
      { text: "Elegir de galería", onPress: pickImage },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  return (
    <View className="items-center">
      <View className="relative">
        <Avatar
          alt={profile?.nombreCompleto || "Usuario"}
          className={cn(sizeClasses[size], "border-4 border-primary/30")}
        >
          {localPhotoUri ? (
            <AvatarImage source={{ uri: localPhotoUri }} />
          ) : null}
          <AvatarFallback>
            <Text className="text-2xl font-bold">{initials}</Text>
          </AvatarFallback>
        </Avatar>

        {/* Loading Overlay */}
        {(uploading || loadingProfile) && (
          <View className="absolute inset-0 bg-black/50 rounded-full items-center justify-center">
            <ActivityIndicator color="#ffffff" size="large" />
          </View>
        )}

        {/* Edit Button — solo si camera = true */}
        {camera && (
          <TouchableOpacity
            onPress={showPhotoOptions}
            disabled={uploading}
            className={cn(
              "absolute bottom-0 right-0 bg-primary rounded-full p-2.5 border-4 border-background shadow-lg",
              uploading && "opacity-50"
            )}
            activeOpacity={0.7}
          >
            <Icon as={Camera} size={16} className="text-primary-foreground" />
          </TouchableOpacity>
        )}
      </View>
      {showName && profile?.nombreCompleto && (
        <Text className="text-lg font-semibold text-center mt-2">
          {profile?.nombreCompleto}
        </Text>
      )}
      {(uploading || loadingProfile) && (
        <Text className="text-sm text-muted-foreground mt-2">
          {uploading ? "Subiendo foto..." : "Cargando perfil..."}
        </Text>
      )}
    </View>
  );
};
