import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Oferta } from "@/hooks/useOffers";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import { Badge } from "../ui/badge";

interface OfertaCardProps {
  oferta: Oferta;
  variant?: "vertical" | "horizontal";
  onPress?: (oferta: Oferta) => void;
  isLoading?: boolean;
}

// Skeleton para variante horizontal
function OfertaCardHorizontalSkeleton() {
  return (
    <View className="border-border border rounded-xl shadow-sm px-4 py-2 flex-row items-center mb-4">
      <Skeleton className="w-16 h-16 rounded-lg" />
      <View className="flex-1 ml-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-2/3 mb-2" />
        <Skeleton className="h-4 w-20" />
      </View>
      <Skeleton className="w-6 h-6 rounded-full" />
    </View>
  );
}

// Skeleton para variante vertical
function OfertaCardVerticalSkeleton() {
  return (
    <View className="border-border border rounded-xl overflow-hidden w-48 mr-4">
      <Skeleton className="w-full h-24" />
      <View className="p-3">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-full mb-1" />
        <Skeleton className="h-3 w-4/5 mb-2" />
        <View className="flex-row items-center mt-2">
          <Skeleton className="w-3 h-3 rounded-full mr-1" />
          <Skeleton className="h-3 w-20" />
        </View>
        <View className="flex-row items-center mt-2">
          <Skeleton className="h-6 w-20 rounded-full mr-2" />
          <Skeleton className="h-4 w-16" />
        </View>
      </View>
    </View>
  );
}

export function OfertaCard({
  oferta,
  variant = "vertical",
  onPress,
  isLoading = false,
}: OfertaCardProps) {
  const { colorScheme } = useColorScheme();

  // Mostrar skeleton si está cargando
  if (isLoading) {
    return variant === "horizontal" ? (
      <OfertaCardHorizontalSkeleton />
    ) : (
      <OfertaCardVerticalSkeleton />
    );
  }

  if (variant === "horizontal") {
    return (
      <TouchableOpacity
        onPress={() => onPress?.(oferta)}
        className="border-border border rounded-xl px-4 py-2 flex-row items-center mb-4"
      >
        <Image
          source={{ uri: oferta.imagenUrl }}
          className="w-16 h-16 rounded-lg"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4">
          <Text className="font-semibold text-base" numberOfLines={1}>
            {oferta?.titulo}
          </Text>
          <Text
            className="text-sm text-muted-foreground mt-1"
            numberOfLines={2}
          >
            {oferta?.descripcionPersonalizada}
          </Text>
          <Text className="text-sm font-bold text-primary mt-1">
            ${oferta?.precioPersonalizado}
          </Text>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={colorScheme === "dark" ? "#ffffff" : "#000000"}
        />
      </TouchableOpacity>
    );
  }

  // Variant vertical (default)
  return (
    <TouchableOpacity
      onPress={() => onPress?.(oferta)}
      className="border-border border rounded-xl overflow-hidden w-48 mr-4"
    >
      <Image
        source={{ uri: oferta?.imagenUrl }}
        className="w-full h-24"
        resizeMode="cover"
      />
      <View className="p-3">
        <Text className="font-semibold text-sm" numberOfLines={1}>
          {oferta?.titulo}
        </Text>
        <Text className="text-xs text-muted-foreground mt-1" numberOfLines={2}>
          {oferta?.descripcionPersonalizada}
        </Text>
        <View className="flex-row items-center mt-2">
          <Ionicons
            name="location"
            size={12}
            color={colorScheme === "dark" ? "#ffffff" : "#000000"}
          />
          <Text className="text-xs text-muted-foreground ml-1">
            {oferta?.ubicacion?.ciudad}
          </Text>
        </View>
        <View className="flex-row items-center mt-1">
          <View className="flex-1 mr-2">
            <Badge variant="outline">
              <Text className="text-xs" numberOfLines={1} ellipsizeMode="tail">
                {oferta?.servicio?.categoria || "General"}
              </Text>
            </Badge>
          </View>

          <Text className="text-sm font-bold text-primary shrink-0">
            ${oferta?.precioPersonalizado}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

interface OfertaCardListProps {
  ofertas: Oferta[];
  variant?: "vertical" | "horizontal";
  onOfertaPress?: (oferta: Oferta) => void;
  numColumns?: number;
  isLoading?: boolean;
  skeletonCount?: number;
}

export function OfertaCardList({
  ofertas,
  variant = "vertical",
  onOfertaPress,
  numColumns = 2,
  isLoading = false,
  skeletonCount = 3,
}: OfertaCardListProps) {
  // Mostrar skeletons mientras carga
  if (isLoading) {
    const skeletonArray = Array.from({ length: skeletonCount }, (_, i) => i);

    if (variant === "horizontal") {
      return (
        <View className="px-4">
          {skeletonArray.map((index) => (
            <OfertaCard
              key={`skeleton-${index}`}
              oferta={{} as Oferta}
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
          <OfertaCard
            oferta={{} as Oferta}
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
        {ofertas.map((oferta) => (
          <OfertaCard
            key={oferta.id}
            oferta={oferta}
            variant="horizontal"
            onPress={onOfertaPress}
          />
        ))}
      </View>
    );
  }

  // Variante vertical: lista horizontal con cards verticales
  return (
    <FlatList
      data={ofertas}
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-4"
      keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
      renderItem={({ item }) => (
        <OfertaCard oferta={item} variant="vertical" onPress={onOfertaPress} />
      )}
    />
  );
}