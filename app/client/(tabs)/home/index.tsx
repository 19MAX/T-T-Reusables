import { Category } from "@/components/custom/categoryButtonsCustom";
import { CustomHomeHeader } from "@/components/custom/headerCustom";
import { OfertaCardList } from "@/components/custom/OfertaCard";
import { OfertasDestacadas } from "@/components/custom/offerts/offertsList";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { Oferta, useOffers } from "@/hooks/useOffers";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("1");
  const { ofertas, loading, error } = useOffers();

  const handleOfertaPress = (oferta: Oferta) => {
    console.log("Oferta seleccionada:", oferta);
    router.push(`/client/offerts/${oferta.id}`);
    // navigation.navigate('OfertaDetalle', { ofertaId: oferta.id });
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    console.log("Búsqueda:", text);
  };

  const handleNotificationPress = () => {
    console.log("Notificaciones presionadas");
    // navigation.navigate('Notifications');
  };

  const handleCreditsPress = () => {
    console.log("Créditos presionados");
    // navigation.navigate('Credits');
  };

  const handleCategoryPress = (category: Category) => {
    console.log("Categoría seleccionada:", category.name);
    setSelectedCategory(category.id);
  };

  const handleViewAllPopular = () => {
    console.log("Ver todos los populares");
    // navigation.navigate('AllJobs', { type: 'popular' });
  };

  const handleViewAllNew = () => {
    console.log("Ver todos los nuevos");
    // navigation.navigate('AllJobs', { type: 'new' });
  };

  return (
    <View className="flex-1 bg-background">
      <View className="pt-6" />
      <ScrollView>
        {/* Header Personalizado */}
        <CustomHomeHeader
          onSearchChange={handleSearchChange}
          onNotificationPress={handleNotificationPress}
          onCreditsPress={handleCreditsPress}
        />
        {/* Sección de Populares */}
        <SectionHeader
          title="Populares"
          onViewAllPress={handleViewAllPopular}
          className="my-4"
        />
        <OfertaCardList
          ofertas={ofertas}
          variant="vertical"
          onOfertaPress={handleOfertaPress}
          isLoading={loading}
          skeletonCount={3} // Cantidad de skeletons a mostrar
        />

        {/* Sección de Nuevos Anuncios */}
        <SectionHeader
          title="Nuevos Anuncios"
          onViewAllPress={handleViewAllNew}
          className="mt-6 mb-4"
        />
        <OfertaCardList
          ofertas={ofertas}
          variant="horizontal"
          onOfertaPress={handleOfertaPress}
          isLoading={loading}
          skeletonCount={5}
        />

        <OfertasDestacadas onOfertaPress={handleOfertaPress} />

        {/* Espacio al final para el bottom tab */}
        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
