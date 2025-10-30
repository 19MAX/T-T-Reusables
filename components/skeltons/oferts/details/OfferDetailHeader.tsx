import { Text } from "@/components/ui/text";
import {
  useAddFavorito,
  useDeleteFavorito,
  useIsFavorito,
} from "@/hooks/favorites/useFavorites";
import { Oferta } from "@/hooks/useOffers";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OfferDetailHeader({
  showTraditionalHeader,
  colorScheme,
  oferta,
  router,
}: {
  showTraditionalHeader: boolean;
  colorScheme: string;
  oferta: Oferta;
  router: any;
}) {
  const { user } = useAuth();
  const {
    isFavorite,
    favoritoId,
    loading: checkingFavorite,
  } = useIsFavorito(oferta?.usuario?.id);
  const { addFavorito, loading: addingFavorite } = useAddFavorito();
  const { deleteFavorito, loading: deletingFavorite } = useDeleteFavorito();

  const esMiOferta = oferta?.usuario?.id === user?.id;
  const insets = useSafeAreaInsets();
  const isLoading = addingFavorite || deletingFavorite || checkingFavorite;

  const handleFavoritePress = async () => {
    if (!oferta?.usuario?.id) {
      Alert.alert("Error", "No se puede agregar a favoritos");
      return;
    }

    try {
      if (isFavorite && favoritoId) {
        await deleteFavorito(favoritoId);
        Alert.alert("¡Listo!", "Usuario eliminado de favoritos");
      } else {
        await addFavorito(oferta.usuario.id);
        Alert.alert("¡Éxito!", "Usuario agregado a favoritos");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo actualizar favoritos");
    }
  };

  const FavoriteButton = () => {
    if (esMiOferta) return null;

    return (
      <TouchableOpacity onPress={handleFavoritePress} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={colorScheme === "dark" ? "#ffffff" : "#000000"}
          />
        ) : (
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={
              isFavorite
                ? "#ef4444"
                : colorScheme === "dark"
                  ? "#ffffff"
                  : "#000000"
            }
          />
        )}
      </TouchableOpacity>
    );
  };

  if (showTraditionalHeader) {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          paddingTop: insets.top,
        }}
        className="bg-background border-b border-border"
      >
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons
              name="arrow-back"
              size={24}
              color={colorScheme === "dark" ? "#ffffff" : "#000000"}
            />
          </TouchableOpacity>
          <Text
            className="flex-1 font-semibold"
            variant="small"
            numberOfLines={1}
          >
            {oferta.titulo}
          </Text>
          <FavoriteButton />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        position: "absolute",
        top: insets.top + 4,
        left: 8,
        right: 8,
        zIndex: 5,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-black/50 backdrop-blur-sm rounded-full p-2"
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </TouchableOpacity>
      {!esMiOferta && (
        <TouchableOpacity
          className="bg-black/50 backdrop-blur-sm rounded-full p-2"
          onPress={handleFavoritePress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? "#ef4444" : "#ffffff"}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
