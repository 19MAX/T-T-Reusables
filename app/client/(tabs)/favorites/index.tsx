import { FavoritoCardList } from "@/components/custom/favorite/FavoritoCard";
import { Text } from "@/components/ui/text";
import {
  Favorito,
  useDeleteFavorito,
  useFavoritos,
} from "@/hooks/favorites/useFavorites";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import {
  Alert,
  RefreshControl,
  ScrollView,
  View
} from "react-native";

const FavoritesScreen = () => {
  const { favoritos, loading, refetch } = useFavoritos();
  const { deleteFavorito, loading: deleting } = useDeleteFavorito();
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  const handleFavoritoPress = (favorito: Favorito) => {
    if (favorito.favoritoId) {
      router.push(`/client/favorites/${favorito.favoritoId}`);
    }
  };

  const handleDelete = async (favorito: Favorito) => {
    Alert.alert(
      "Eliminar favorito",
      `¿Deseas eliminar a ${favorito.usuario?.nombreCompleto} de tus favoritos?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              if (favorito.id) {
                await deleteFavorito(favorito.usuario?.id || "");
                Alert.alert("¡Listo!", "Usuario eliminado de favoritos");
              }
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.message || "No se pudo eliminar el favorito"
              );
            }
          },
        },
      ]
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-8">
      <View className="bg-muted rounded-full p-8 mb-6">
        <Ionicons
          name="heart-outline"
          size={64}
          color={colorScheme === "dark" ? "#ffffff" : "#000000"}
        />
      </View>
      <Text className="text-2xl font-bold text-center mb-2">
        Sin favoritos
      </Text>
      <Text className="text-base text-muted-foreground text-center">
        Aún no has agregado usuarios a tus favoritos. Explora ofertas y guarda
        tus perfiles preferidos.
      </Text>
    </View>
  );

  return (
    <View
      className="flex-1 bg-background"
    >
      {/* Header */}

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        {loading && favoritos.length === 0 ? (
          <View className="py-4">
            <FavoritoCardList
              favoritos={[]}
              variant="horizontal"
              isLoading={true}
              skeletonCount={5}
            />
          </View>
        ) : favoritos.length === 0 ? (
          <View className="flex-1" style={{ minHeight: 400 }}>
            {renderEmptyState()}
          </View>
        ) : (
          <View className="py-4">
            <FavoritoCardList
              favoritos={favoritos}
              variant="horizontal"
              onFavoritoPress={handleFavoritoPress}
              onDelete={handleDelete}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default FavoritesScreen;