import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useConsumeCredit } from "@/hooks/credits/useConsumeCredit";
import { useOfferDetail } from "@/hooks/useOffers";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  ScrollView,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import OfferContactBar from "@/components/skeltons/oferts/details/OfferContactBar";
import { OfferDetailContent } from "@/components/skeltons/oferts/details/OfferDetailContent";
import { OfferDetailHeader } from "@/components/skeltons/oferts/details/OfferDetailHeader";
import { OfferDetailSkeleton } from "@/components/skeltons/oferts/details/OfferDetailSkeleton";
import { useAuth } from "@/providers/AuthProvider";
export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const { oferta, loading, error, refetch } = useOfferDetail(id);
  const { user } = useAuth();
  // Hook para consumir crédito
  const {
    loading: creditLoading,
    error: creditError,
    success: creditSuccess,
    message: creditMessage,
    consumeCredit,
    resetState,
  } = useConsumeCredit(
    () => {
      // Callback cuando el crédito se usa exitosamente
      console.log("Crédito usado exitosamente");
      resetState();
      // Aquí se puede navegar o hacer otra acción
    },
    (error) => {
      // Callback cuando hay error
      console.error("Error al usar crédito:", error);
    }
  );

  const [showTraditionalHeader, setShowTraditionalHeader] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const IMAGE_HEIGHT = 320;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const threshold = IMAGE_HEIGHT - 80;
    setShowTraditionalHeader(scrollY > threshold);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleContactPress = async () => {
    if (!user?.id) {
      console.error("Usuario no autenticado");
      return;
    }

    const clienteId = user.id;
    await consumeCredit(clienteId);
  };

  if (loading) {
    return <OfferDetailSkeleton />;
  }

  if (error || !oferta) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-4">
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={colorScheme === "dark" ? "#ffffff" : "#000000"}
        />
        <Text className="text-lg font-semibold mt-4 text-center">
          {error || "Oferta no encontrada"}
        </Text>
        <Button
          onPress={() => router.back()}
          className="mt-6"
          variant="outline"
        >
          <Text>Volver</Text>
        </Button>
      </View>
    );
  }

  const modalidadText =
    {
      presencial: "Presencial",
      remoto: "Remoto",
      ambas: "Presencial y Remoto",
    }[oferta.ubicacion?.modalidad || ""] || "No especificado";

  return (
    <View className="flex-1 bg-background">
      <StatusBar
        style={
          showTraditionalHeader
            ? colorScheme === "dark"
              ? "light"
              : "dark"
            : "light"
        }
        animated
      />

      <OfferDetailHeader
        showTraditionalHeader={showTraditionalHeader}
        colorScheme={colorScheme === "dark" ?  "dark" : "light"}
        oferta={oferta}
        router={router}
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colorScheme === "dark" ? "#ffffff" : "#000000"}
          />
        }
      >
        <View style={{ height: IMAGE_HEIGHT }}>
          <Image
            source={{ uri: oferta.imagenUrl }}
            style={{ width: "100%", height: IMAGE_HEIGHT }}
            resizeMode="cover"
          />

          <LinearGradient
            colors={["rgba(0,0,0,0.6)", "transparent"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 150,
            }}
          />
        </View>
        <OfferDetailContent oferta={oferta} modalidadText={modalidadText} colorScheme={colorScheme} />
      </ScrollView>

      <OfferContactBar
        creditLoading={creditLoading}
        creditSuccess={creditSuccess}
        creditError={creditError}
        creditMessage={creditMessage}
        onConfirm={handleContactPress}
      />
    </View>
  );
}
