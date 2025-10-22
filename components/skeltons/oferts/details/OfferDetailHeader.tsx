import { Text } from "@/components/ui/text";
import { Oferta } from "@/hooks/useOffers";
import { useAuth } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
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

  const esMiOferta = oferta?.usuario?.id === user?.id;

  const insets = useSafeAreaInsets();

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
          {esMiOferta ? null : (
            <TouchableOpacity>
              <Ionicons
                name="heart-outline"
                size={24}
                color={colorScheme === "dark" ? "#ffffff" : "#000000"}
              />
            </TouchableOpacity>
          )}
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
      {esMiOferta ? null : (
        <TouchableOpacity className="bg-black/50 backdrop-blur-sm rounded-full p-2">
          <Ionicons name="heart-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      )}
    </View>
  );
}
