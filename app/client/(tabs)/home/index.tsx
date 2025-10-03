import { useOffers } from "@/hooks/useOffers";
import { useAuth } from "@/providers/AuthProvider";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
  const { user } = useAuth();
  const { ofertas, loading, error, refetch } = useOffers();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderOferta = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
      //   onPress={() => router.push(`/client/service/${item.id}`)}
    >
      {/* Imagen */}
      {item.imagenUrl && (
        <Image
          source={{ uri: item.imagenUrl }}
          className="w-full h-48"
          resizeMode="cover"
        />
      )}

      <View className="p-4">
        {/* Título y Precio */}
        <View className="flex-row justify-between items-start mb-2">
          <Text className="text-lg font-bold text-gray-800 flex-1">
            {item.titulo || item.servicio?.titulo}
          </Text>
          <Text className="text-xl font-bold text-blue-600 ml-2">
            ${item.precioPersonalizado || item.servicio?.precio}
          </Text>
        </View>

        {/* Descripción */}
        {item.descripcionPersonalizada && (
          <Text className="text-gray-600 mb-3" numberOfLines={2}>
            {item.descripcionPersonalizada}
          </Text>
        )}

        {/* Categoría */}
        {item.servicio?.categoria && (
          <View className="bg-blue-100 self-start px-3 py-1 rounded-full mb-3">
            <Text className="text-blue-700 text-xs font-medium">
              {item.servicio.categoria}
            </Text>
          </View>
        )}

        {/* Info del usuario */}
        {item.usuario && (
          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <View>
              <Text className="text-sm text-gray-600">
                {item.usuario.nombre}
              </Text>
              {item.usuario.calificacionPromedio && (
                <View className="flex-row items-center mt-1">
                  <Text className="text-yellow-500 mr-1">⭐</Text>
                  <Text className="text-sm text-gray-700">
                    {item.usuario.calificacionPromedio.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>

            {/* Ubicación */}
            {item.ubicacion?.ciudad && (
              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-1">📍</Text>
                <Text className="text-sm text-gray-600">
                  {item.ubicacion.ciudad}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Cargando ofertas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Text className="text-red-600 text-center mb-4">❌ {error}</Text>
        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-lg"
          onPress={refetch}
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">
          Hola, {user?.nombreCompleto || "Usuario"} 👋
        </Text>
        <Text className="text-gray-600 mt-1">
          Explora los servicios disponibles
        </Text>
      </View>

      {/* Lista de ofertas */}
      <FlatList
        data={ofertas}
        renderItem={renderOferta}
        keyExtractor={(item) => item.id || Math.random().toString()}
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563eb"]}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-6xl mb-4">🔍</Text>
            <Text className="text-gray-600 text-center">
              No hay ofertas disponibles en este momento
            </Text>
          </View>
        }
      />
    </View>
  );
}
