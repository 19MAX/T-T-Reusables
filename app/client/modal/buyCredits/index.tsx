import CardPaquete from "@/components/custom/paquetes/cardPaquete";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { usePaquetes } from "@/hooks/credits/paquetes";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BuyCreditScreen = () => {
  const { paquetes, loading, error, refetch } = usePaquetes();
  const [selectedPaquete, setSelectedPaquete] = useState<string | null>(null);

  // Componente de skeleton para un paquete
  const PaqueteSkeleton = () => (
    <View className="px-4 mb-3">
      <View className="border border-gray-300 dark:border-gray-700 rounded-2xl p-4 bg-white dark:bg-gray-900">
        <View className="flex-row items-center justify-between">
          {/* Columna izquierda */}
          <View className="flex-row items-center gap-3 flex-1">
            <Skeleton className="h-[25px] w-[25px] rounded-full" />
            <View className="flex-1 gap-2">
              <Skeleton className="h-[18px] w-[120px] rounded-md" />
              <Skeleton className="h-[14px] w-[150px] rounded-md" />
            </View>
          </View>
          {/* Columna derecha */}
          <View className="items-end">
            <Skeleton className="h-[20px] w-[60px] rounded-md" />
          </View>
        </View>
      </View>
    </View>
  );

  // Componente de skeleton para el header
  const HeaderSkeleton = () => (
    <>
      <View className="items-center py-4 bg-slate-50 dark:bg-gray-900">
        <Skeleton className="w-16 h-16 rounded-full mb-4" />
        <Skeleton className="h-[24px] w-[150px] rounded-md" />
      </View>
      <View className="py-4">
        <View className="px-4">
          <Skeleton className="h-[16px] w-[140px] rounded-md" />
        </View>
      </View>
    </>
  );

  const handleSelectPaquete = (paqueteId: string) => {
    setSelectedPaquete(paqueteId === selectedPaquete ? null : paqueteId);
  };

  const handleComprar = () => {
    if (!selectedPaquete) return;
    const paquete = paquetes.find((p) => p.id === selectedPaquete);
    console.log("Comprando paquete:", paquete);
    // Aquí iría la lógica de compra
  };

  // Ordenar paquetes por orden
  const paquetesOrdenados = [...paquetes].sort(
    (a, b) => (a.orden || 0) - (b.orden || 0)
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
        <View className="flex-1">
          <FlatList
            data={[1, 2, 3, 4]} // Mock data para mostrar 4 skeletons
            renderItem={() => <PaqueteSkeleton />}
            keyExtractor={(item) => item.toString()}
            ListHeaderComponent={HeaderSkeleton}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-red-600 text-center mb-4">{error}</Text>
        <Button onPress={refetch}>
          <Text>Reintentar</Text>
        </Button>
      </View>
    );
  }

  const ListHeaderComponent = () => (
    <>
      {/* Header con icono de diamante */}
      <View className="items-center py-4 bg-slate-50 dark:bg-gray-900">
        <View className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center mb-4">
          <Ionicons name="diamond" size={32} color="#10b981" />
        </View>
        <Text className="font-bold text-center">Comprar Créditos</Text>
      </View>

      {/* Título de sección */}
      <View className="py-4">
        <Text className="font-semibold px-4 text-sm">
          Selecciona un Paquete
        </Text>
      </View>
    </>
  );

  const ListEmptyComponent = () => (
    <View className="items-center justify-center py-12 px-4">
      <Text className="text-muted-foreground text-center">
        No hay paquetes disponibles en este momento
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: (typeof paquetes)[0] }) => (
    <CardPaquete
      paquete={item}
      checked={selectedPaquete === item.id}
      onPress={() => handleSelectPaquete(item.id!)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <View className="flex-1">
        <FlatList
          data={paquetesOrdenados}
          renderItem={renderItem}
          keyExtractor={(item) => item.id!}
          ListHeaderComponent={ListHeaderComponent}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: selectedPaquete ? 80 : 16,
          }}
          showsVerticalScrollIndicator={false}
        />

        {/* Botón flotante en el footer */}
        {selectedPaquete && (
          <View className="absolute bottom-0 left-0 right-0 px-4 py-4 bg-background border-t border-border">
            <Button onPress={handleComprar} className="w-full">
              <Text className="font-semibold">Continuar</Text>
            </Button>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default BuyCreditScreen;
