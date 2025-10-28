// app/client/offerts/[id].tsx (ACTUALIZADO)
import { ImageViewer } from "@/components/custom/imageViewer";
import OfferOwnerBar from "@/components/custom/OfferOwnerBar";
import OfferContactBar from "@/components/skeltons/oferts/details/OfferContactBar";
import { OfferDetailContent } from "@/components/skeltons/oferts/details/OfferDetailContent";
import { OfferDetailHeader } from "@/components/skeltons/oferts/details/OfferDetailHeader";
import { OfferDetailSkeleton } from "@/components/skeltons/oferts/details/OfferDetailSkeleton";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useConsumeCredit } from "@/hooks/credits/useConsumeCredit";
import {
  useDeleteOferta,
  useOfferDetail,
  usePauseOferta,
  useReactivateOferta,
} from "@/hooks/useOffers";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
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
  TouchableOpacity,
  View,
} from "react-native";

export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { oferta, loading, error, refetch } = useOfferDetail(id);
  const { deleteOferta } = useDeleteOferta();
  const { pauseOferta } = usePauseOferta();
  const { reactivateOferta } = useReactivateOferta();
  const { user } = useAuth();
  const toast = useToast();

  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
      toast.success("Crédito usado exitosamente");
      resetState();
    },
    (error) => {
      toast.error(error || "Error al usar crédito");
    }
  );

  const [showTraditionalHeader, setShowTraditionalHeader] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const IMAGE_HEIGHT = 320;
  const esMiOferta = oferta?.usuario?.id === user?.id;
  const estaPausada = oferta?.estado === "pausada";

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const threshold = IMAGE_HEIGHT - 80;
    setShowTraditionalHeader(scrollY > threshold);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Oferta actualizada");
    } catch (err) {
      toast.error("Error al actualizar");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleContactPress = async () => {
    if (!user?.id) {
      toast.error("Usuario no autenticado");
      return;
    }
    const clienteId = user.id;
    await consumeCredit(clienteId);
  };

  const handlePauseOferta = async (ofertaId: string) => {
    if (estaPausada) {
      try {
        setActionLoading(true);
        await reactivateOferta(ofertaId);
        toast.success("Oferta reactivada correctamente");
        await refetch();
      } catch (err) {
        toast.error("Error al reactivar la oferta");
      } finally {
        setActionLoading(false);
      }
    } else {
      try {
        setActionLoading(true);
        await pauseOferta(ofertaId);
        toast.success("Oferta pausada correctamente");
        await refetch();
      } catch (error) {
        toast.error("Error al pausar la oferta");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDeleteOferta = async (ofertaId: string) => {
    try {
      setDeleteLoading(true);
      await deleteOferta(ofertaId);
      toast.success("Oferta eliminada correctamente");
      router.back();
    } catch (err) {
      toast.error("Error al eliminar la oferta");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditPress = (ofertaId: string) => {
    console.log("Navegar a editar oferta:", ofertaId);
  };

  const handleImagePress = () => {
    setImageViewerVisible(true);
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
        colorScheme={colorScheme === "dark" ? "dark" : "light"}
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
        <TouchableOpacity
          style={{ height: IMAGE_HEIGHT }}
          activeOpacity={0.9}
          onPress={handleImagePress}
        >
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
        </TouchableOpacity>
        <OfferDetailContent
          oferta={oferta}
          modalidadText={modalidadText}
          colorScheme={colorScheme}
        />
      </ScrollView>
      {esMiOferta ? (
        <OfferOwnerBar
          onEdit={() => handleEditPress(oferta.id!)}
          onPause={() => handlePauseOferta(oferta.id!)}
          onDelete={() => handleDeleteOferta(oferta.id!)}
          estado={oferta.estado}
          loadingPause={actionLoading}
          loadingDelete={deleteLoading}
        />
      ) : (
        <OfferContactBar
          creditLoading={creditLoading}
          creditSuccess={creditSuccess}
          creditError={creditError}
          creditMessage={creditMessage}
          onConfirm={handleContactPress}
        />
      )}
      <ImageViewer
        visible={imageViewerVisible}
        imageUri={oferta.imagenUrl ?? ""}
        onClose={() => setImageViewerVisible(false)}
      />
    </View>
  );
}
