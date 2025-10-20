import { OfertaCardList } from "@/components/custom/OfertaCard";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Oferta, useMyOffers } from "@/hooks/useOffers";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function MyOffertsScreen() {
  const router = useRouter();
  // const { ofertas, loading, error, refetch } = useOffers();
  const { ofertas, loading, error, refetch } = useMyOffers();

  const handleCreateOffer = () => {
    router.push("/client/modal/createOfferts");
  };

  const handleOfertaPress = (oferta: Oferta) => {
    router.push(`/client/offerts/${oferta.id}`);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-card border-b border-border px-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-foreground">
              Mis Ofertas
            </Text>
            <Text className="text-sm text-muted-foreground">
              {ofertas.length} oferta{ofertas.length !== 1 ? "s" : ""} activa
              {ofertas.length !== 1 ? "s" : ""}
            </Text>
          </View>

          <TouchableOpacity
            className="bg-primary rounded-full p-3"
            onPress={handleCreateOffer}
          >
                  <Icon as={Plus} className="text-primary-foreground" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {error ? (
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color="#ef4444"
            style={{ marginBottom: 16 }}
          />
          <Text className="text-destructive text-center font-semibold mb-2">
            Error al cargar ofertas
          </Text>
          <Text className="text-muted-foreground text-center text-sm mb-4">
            {error}
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-lg px-6 py-3"
            onPress={refetch}
          >
            <Text className="text-primary-foreground font-semibold">
              Intentar de nuevo
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <OfertaCardList
            ofertas={ofertas}
            variant="horizontal"
            onOfertaPress={handleOfertaPress}
            isLoading={loading}
            skeletonCount={5}
          />
        </ScrollView>
      )}
    </View>
  );
}
