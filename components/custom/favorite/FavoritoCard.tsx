import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Favorito } from "@/hooks/favorites/useFavorites";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { FlatList, Image, TouchableOpacity, View } from "react-native";

interface FavoritoCardProps {
  favorito: Favorito;
  variant?: "vertical" | "horizontal";
  onPress?: (favorito: Favorito) => void;
  onDelete?: (favorito: Favorito) => void;
  isLoading?: boolean;
}

// Skeleton para variante horizontal
function FavoritoCardHorizontalSkeleton() {
  return (
    <View className="border-border border rounded-xl px-4 py-3 flex-row items-center mb-4">
      <Skeleton className="w-16 h-16 rounded-full" />
      <View className="flex-1 ml-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </View>
      <Skeleton className="w-8 h-8 rounded-full" />
    </View>
  );
}

// Skeleton para variante vertical
function FavoritoCardVerticalSkeleton() {
  return (
    <View className="border-border border rounded-xl overflow-hidden w-40 mr-4">
      <View className="items-center p-4">
        <Skeleton className="w-20 h-20 rounded-full mb-3" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full" />
      </View>
    </View>
  );
}

export function FavoritoCard({
  favorito,
  variant = "vertical",
  onPress,
  onDelete,
  isLoading = false,
}: FavoritoCardProps) {
  const { colorScheme } = useColorScheme();

  // Mostrar skeleton si está cargando
  if (isLoading) {
    return variant === "horizontal" ? (
      <FavoritoCardHorizontalSkeleton />
    ) : (
      <FavoritoCardVerticalSkeleton />
    );
  }

  const userImage = favorito?.usuario?.urlFoto || favorito?.usuario?.urlFoto;
  const userName = favorito?.usuario?.nombreCompleto || "Usuario";
  const userEmail = favorito?.usuario?.email || "";

  if (variant === "horizontal") {
    return (
      <View className="border-border border rounded-xl px-4 py-3 flex-row items-center mb-4">
        <TouchableOpacity
          onPress={() => onPress?.(favorito)}
          className="flex-1 flex-row items-center"
        >
          <View className="w-16 h-16 rounded-full bg-muted items-center justify-center overflow-hidden">
            {userImage ? (
              <Image
                source={{ uri: userImage }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Ionicons
                name="person"
                size={32}
                color={colorScheme === "dark" ? "#ffffff" : "#000000"}
              />
            )}
          </View>
          <View className="flex-1 ml-4">
            <Text className="font-semibold text-base" numberOfLines={1}>
              {userName}
            </Text>
            <Text
              className="text-sm text-muted-foreground mt-1"
              numberOfLines={1}
            >
              {userEmail}
            </Text>
          </View>
        </TouchableOpacity>
        {onDelete && (
          <TouchableOpacity
            onPress={() => onDelete(favorito)}
            className="ml-2 p-2"
          >
            <Ionicons
              name="heart"
              size={24}
              color="#ef4444"
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Variant vertical (default)
  return (
    <View className="border-border border rounded-xl overflow-hidden w-40 mr-4">
      <TouchableOpacity
        onPress={() => onPress?.(favorito)}
        className="items-center p-4"
      >
        <View className="w-20 h-20 rounded-full bg-muted items-center justify-center overflow-hidden mb-3">
          {userImage ? (
            <Image
              source={{ uri: userImage }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Ionicons
              name="person"
              size={40}
              color={colorScheme === "dark" ? "#ffffff" : "#000000"}
            />
          )}
        </View>
        <Text
          className="font-semibold text-sm text-center"
          numberOfLines={1}
        >
          {userName}
        </Text>
        <Text
          className="text-xs text-muted-foreground mt-1 text-center"
          numberOfLines={1}
        >
          {userEmail}
        </Text>
      </TouchableOpacity>
      {onDelete && (
        <TouchableOpacity
          onPress={() => onDelete(favorito)}
          className="absolute top-2 right-2 bg-background rounded-full p-1.5 shadow-sm"
        >
          <Ionicons name="heart" size={18} color="#ef4444" />
        </TouchableOpacity>
      )}
    </View>
  );
}

interface FavoritoCardListProps {
  favoritos: Favorito[];
  variant?: "vertical" | "horizontal";
  onFavoritoPress?: (favorito: Favorito) => void;
  onDelete?: (favorito: Favorito) => void;
  isLoading?: boolean;
  skeletonCount?: number;
}

export function FavoritoCardList({
  favoritos,
  variant = "vertical",
  onFavoritoPress,
  onDelete,
  isLoading = false,
  skeletonCount = 3,
}: FavoritoCardListProps) {
  // Mostrar skeletons mientras carga
  if (isLoading) {
    const skeletonArray = Array.from({ length: skeletonCount }, (_, i) => i);
    if (variant === "horizontal") {
      return (
        <View className="px-4">
          {skeletonArray.map((index) => (
            <FavoritoCard
              key={`skeleton-${index}`}
              favorito={{} as Favorito}
              variant="horizontal"
              isLoading={true}
            />
          ))}
        </View>
      );
    }
    return (
      <FlatList
        data={skeletonArray}
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4"
        keyExtractor={(item) => `skeleton-${item}`}
        renderItem={() => (
          <FavoritoCard
            favorito={{} as Favorito}
            variant="vertical"
            isLoading={true}
          />
        )}
      />
    );
  }

  // Variante horizontal: lista vertical con cards horizontales
  if (variant === "horizontal") {
    return (
      <View className="px-4">
        {favoritos.map((favorito) => (
          <FavoritoCard
            key={favorito.id}
            favorito={favorito}
            variant="horizontal"
            onPress={onFavoritoPress}
            onDelete={onDelete}
          />
        ))}
      </View>
    );
  }

  // Variante vertical: lista horizontal con cards verticales
  return (
    <FlatList
      data={favoritos}
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4"
      keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
      renderItem={({ item }) => (
        <FavoritoCard
          favorito={item}
          variant="vertical"
          onPress={onFavoritoPress}
          onDelete={onDelete}
        />
      )}
    />
  );
}