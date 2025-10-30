import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useFavoritoDetail } from "@/hooks/favorites/useFavorites";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Mail } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import {
  Image,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

const UserDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { favorito, loading, error } = useFavoritoDetail(id);
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  const usuario = favorito?.usuario;

  const handleEmailPress = () => {
    if (usuario?.email) {
      Linking.openURL(`mailto:${usuario.email}`);
    }
  };

  const handleCallPress = () => {
    // Si tienes el número de teléfono en el objeto usuario
    // Linking.openURL(`tel:${usuario.telefono}`);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-background">
        <ScrollView className="flex-1">
          {/* Profile Image Skeleton */}
          <View className="items-center py-8 px-4">
            <Skeleton className="w-32 h-32 rounded-full mb-4" />
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </View>

          {/* Info Skeleton */}
          <View className="px-4 py-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <View className="space-y-3">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (error || !favorito) {
    return (
      <View className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={colorScheme === "dark" ? "#ffffff" : "#000000"}
          />
          <Text className="text-xl font-bold text-center mt-4 mb-2">
            Error al cargar
          </Text>
          <Text className="text-base text-muted-foreground text-center">
            {error || "No se pudo cargar la información del usuario"}
          </Text>
          <Button onPress={() => router.back()} className="mt-6">
            <Text>Volver</Text>
          </Button>
        </View>
      </View>
    );
  }

  const userImage = usuario?.urlFoto || usuario?.urlFoto;
  const userName = usuario?.nombreCompleto || "Usuario";
  const userEmail = usuario?.email || "";
  const rating = 0;

  return (
    <View className="flex-1 bg-background">
      {/* Header */}

      <ScrollView className="flex-1">
        {/* Profile Section */}
        <View className="items-center py-8 px-4 border-b border-border">
          <View className="w-32 h-32 rounded-full bg-muted items-center justify-center overflow-hidden mb-4 border-4 border-border">
            {userImage ? (
              <Image
                source={{ uri: userImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Ionicons
                name="person"
                size={64}
                color={colorScheme === "dark" ? "#ffffff" : "#000000"}
              />
            )}
          </View>

          <Text className="text-2xl font-bold text-center mb-1">
            {userName}
          </Text>

          {rating > 0 && (
            <View className="flex-row items-center mt-2">
              <Ionicons name="star" size={20} color="#fbbf24" />
              <Text className="text-lg font-semibold ml-1">
                {rating.toFixed(1)}
              </Text>
              <Text className="text-sm text-muted-foreground ml-1">/ 5.0</Text>
            </View>
          )}
        </View>

        {/* Information Section */}
        <View className="px-4 py-6">
          <Text className="text-lg font-bold mb-4">Información</Text>

          {/* Email */}
          {userEmail && (
            <TouchableOpacity
              onPress={handleEmailPress}
              className="flex-row items-center bg-muted p-4 rounded-xl mb-3"
            >
              <View className="w-10 h-10 rounded-full bg-background items-center justify-center mr-3">
                <Ionicons
                  name="mail"
                  size={20}
                  color={colorScheme === "dark" ? "#ffffff" : "#000000"}
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground mb-0.5">
                  Correo electrónico
                </Text>
                <Text className="text-base font-medium">{userEmail}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colorScheme === "dark" ? "#ffffff" : "#000000"}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Action Buttons */}
        <View className="px-4 pb-8">
          <Button
            onPress={handleEmailPress}
            className="mb-3"
            disabled={!userEmail}
          >
            <Icon size={20} as={Mail} className="text-primary-foreground" />
            <Text>Enviar correo</Text>
          </Button>

          <Button variant="outline" onPress={() => router.back()}>
            <Text className="font-semibold">Volver a favoritos</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default UserDetailScreen;
