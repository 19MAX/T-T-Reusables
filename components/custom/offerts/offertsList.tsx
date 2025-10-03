import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { Oferta, useOffers } from "@/hooks/useOffers";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Image, Pressable, View } from "react-native";
interface OfertaCardProps {
  oferta: Oferta;
  onPress?: (oferta: Oferta) => void;
}

const OfertaCard = ({ oferta, onPress }: OfertaCardProps) => {
  return (
    <Pressable
      onPress={() => onPress?.(oferta)}
      className="w-72 mr-4 bg-card rounded-xl overflow-hidden border border-border"
    >
      {/* Imagen */}
      <View className="relative h-48 bg-muted">
        {oferta.imagenUrl ? (
          <Image
            source={{ uri: oferta.imagenUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full items-center justify-center bg-muted">
            <Text className="text-muted-foreground">Sin imagen</Text>
          </View>
        )}

        {/* Badge de estado o categoría */}
        {oferta.servicio?.categoria && (
          <View className="absolute top-3 left-3">
            <Badge variant="default">
              <Text>{oferta.servicio.categoria}</Text>
            </Badge>
          </View>
        )}

        <View className="absolute top-3 left-3">
          {/* <Badge variant="outline">
            <Text>Badge</Text>
          </Badge> */}
          {/* <Badge variant="secondary" className="bg-blue-500 dark:bg-blue-600">
            <Ionicons name="accessibility-outline" />
            <Text className="text-white">Verified</Text>
          </Badge> */}
          {/* <Badge className="min-w-5 rounded-full px-1 bg-green-500 dark:bg-green-600" variant="outline">
            <Ionicons name="notifications" />
            <Text>20+</Text>
          </Badge> */}
        </View>
      </View>

      {/* Contenido */}
      <View className="p-4">
        {/* Título */}
        <Text className="text-lg font-bold mb-2" numberOfLines={2}>
          {oferta.titulo || oferta.servicio?.titulo || "Sin título"}
        </Text>

        {/* Descripción */}
        <Text className="text-muted-foreground text-sm mb-3" numberOfLines={2}>
          {oferta.descripcionPersonalizada ||
            oferta.servicio?.descripcion ||
            "Sin descripción"}
        </Text>

        {/* Ubicación */}
        {oferta.ubicacion?.ciudad && (
          <View className="flex-row items-center mb-3">
            <Text className="text-muted-foreground text-xs">
              <Ionicons name="location-outline" />
              {oferta.ubicacion.ciudad}
              {/* {oferta.ubicacion.modalidad && ` • ${oferta.ubicacion.modalidad}`} */}
            </Text>
          </View>
        )}

        {/* Precio y Usuario */}
        <View className="flex-row items-center justify-between">
          {oferta.usuario && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <View className="flex-row items-center">
                  {/* Avatar */}
                  <View className="w-8 h-8 rounded-full bg-muted items-center justify-center mr-2">
                    <Text className="text-xs font-semibold">
                      {oferta.usuario.nombreCompleto?.charAt(0).toUpperCase() ||
                        "U"}
                    </Text>
                  </View>

                  {/* Calificación */}
                  {oferta.usuario.calificacionPromedio && (
                    // <View className="flex-row items-center">
                    //   <Text className="text-xs text-muted-foreground">
                    //     Icono {oferta.usuario.calificacionPromedio.toFixed(1)}
                    //   </Text>
                    // </View>
                    <View className="flex-row items-center">
                      <Text className="text-xs text-muted-foreground">
                        <Ionicons name="star-outline" color="yellow" size={16}/> {oferta.usuario.calificacionPromedio.toFixed(1)}
                      </Text>
                    </View>
                  )}

                </View>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <Text>{oferta.usuario.nombreCompleto || "Usuario"}</Text>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Text>Ver perfil</Text>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Text>Contactar</Text>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem>
                  <Text className="text-destructive font-semibold">
                    ⚡ Gastar crédito
                  </Text>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <View>
            <Text className="text-2xl font-bold text-primary">
              ${oferta.precioPersonalizado || oferta.servicio?.precio || 0}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

interface OfertasDestacadasProps {
  onOfertaPress?: (oferta: Oferta) => void;
}

export const OfertasDestacadas = ({
  onOfertaPress,
}: OfertasDestacadasProps) => {
  const { ofertas, loading, error } = useOffers();

  if (loading) {
    return (
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        data={[1, 2, 3]} // mostramos 3 skeletons
        keyExtractor={(item) => item.toString()}
        renderItem={() => (
          <View className="w-72 mr-4 bg-card rounded-xl overflow-hidden border border-border">
            {/* Imagen Skeleton */}
            <Skeleton className="h-48 w-full mb-3" />

            {/* Contenido */}
            <View className="p-4 space-y-3">
              {/* Título */}
              <Skeleton className="h-5  rounded-md mb-3" />

              {/* Descripción */}
              <Skeleton className="h-4 w-full rounded-md mb-3" />
              <Skeleton className="h-4 rounded-md mb-3" />

              {/* Ubicación */}
              <Skeleton className="h-3  rounded-md mb-3" />

              {/* Precio y Usuario */}
              <View className="flex-row items-center justify-between mt-3">
                {/* Precio */}
                <Skeleton className="h-6 w-16 rounded-md mb-3" />

                {/* Usuario */}
                <View className="flex-row items-center">
                  <Skeleton className="h-8 w-8 rounded-full mr-2" />
                  <Skeleton className="h-3 w-10 rounded-md mb-3" />
                </View>
              </View>
            </View>
          </View>
        )}
      />
    );
  }

  if (error) {
    return (
      <View className="h-80 mx-4 bg-destructive/10 rounded-lg items-center justify-center border border-destructive/20">
        <Text className="text-destructive text-center px-4">{error}</Text>
      </View>
    );
  }

  if (ofertas.length === 0) {
    return (
      <View className="h-80 mx-4 bg-muted rounded-lg items-center justify-center">
        <Text className="text-muted-foreground text-center px-4">
          No hay ofertas disponibles en este momento
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={ofertas}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      keyExtractor={(item) => item.id || Math.random().toString()}
      renderItem={({ item }) => (
        <OfertaCard oferta={item} onPress={onOfertaPress} />
      )}
    />
  );
};
