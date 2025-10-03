import { OfertasDestacadas } from "@/components/custom/offerts/offertsList";
import { Text } from "@/components/ui/text";
import { Oferta } from "@/hooks/useOffers";
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
  const handleOfertaPress = (oferta: Oferta) => {
    // Aquí puedes navegar a la pantalla de detalle de la oferta
    console.log('Oferta seleccionada:', oferta);
    // Ejemplo: navigation.navigate('OfertaDetalle', { ofertaId: oferta.id });
  };

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header de sección de ofertas */}
      <View className="px-4 pt-6 pb-3">
        <Text className="text-2xl font-bold mb-1">Ofertas Destacadas</Text>
        <Text className="text-muted-foreground">
          Las mejores ofertas disponibles para ti
        </Text>
      </View>

      {/* Lista horizontal de ofertas */}
      <OfertasDestacadas onOfertaPress={handleOfertaPress} />

      {/* Categorías Populares */}
      <View className="px-4 pt-6 pb-3">
        <Text className="text-2xl font-bold mb-1">Categorías Populares</Text>
        <Text className="text-muted-foreground">
          Explora servicios por categoría
        </Text>
      </View>

      <View className="h-40 mx-4 mb-4 bg-muted rounded-lg items-center justify-center">
        <Text className="text-muted-foreground">Próximamente: Categorías</Text>
      </View>

      {/* Servicios Recientes */}
      <View className="px-4 pt-6 pb-3">
        <Text className="text-2xl font-bold mb-1">Servicios Recientes</Text>
        <Text className="text-muted-foreground">
          Últimos servicios agregados
        </Text>
      </View>

      <View className="h-40 mx-4 mb-6 bg-muted rounded-lg items-center justify-center">
        <Text className="text-muted-foreground">Próximamente: Servicios</Text>
      </View>
    </ScrollView>
  );
}