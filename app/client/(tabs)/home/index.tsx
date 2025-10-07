import { Category } from "@/components/custom/categoryButtonsCustom";
import { CustomHomeHeader } from "@/components/custom/headerCustom";
import { OfertaCardList } from "@/components/custom/OfertaCard";
import { OfertasDestacadas } from "@/components/custom/offerts/offertsList";
import { SectionHeader } from "@/components/custom/SectionHeader";
import { Oferta, useOffers } from "@/hooks/useOffers";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

// // Datos de ejemplo para los trabajos populares
// const popularJobs: Job[] = [
//   {
//     id: "1",
//     title: "Limpieza de casa",
//     description: "Servicio de limpieza profesional para tu hogar.",
//     location: "Miraflores",
//     price: 250,
//     imageUrl:
//       "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
//   },
//   {
//     id: "2",
//     title: "Paseador de perros",
//     description: "Paseos divertidos y seguros para tu mejor amigo.",
//     location: "San Isidro",
//     price: 150,
//     imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400",
//   },
//   {
//     id: "3",
//     title: "Clases de Yoga",
//     description: "Instructor certificado con 10 años de experiencia.",
//     location: "Barranco",
//     price: 200,
//     imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
//   },
// ];

// // Datos de ejemplo para nuevos anuncios
// const newJobs: Job[] = [
//   {
//     id: "4",
//     title: "Clases de Guitarra",
//     description: "Aprende a tocar guitarra desde cero. Todas las edades.",
//     location: "Surco",
//     price: 300,
//     imageUrl:
//       "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400",
//   },
//   {
//     id: "5",
//     title: "Plomero Profesional",
//     description: "Reparación de tuberías, instalaciones y mantenimiento.",
//     location: "La Molina",
//     price: 180,
//     imageUrl:
//       "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400",
//   },
// ];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("1");
  const { ofertas, loading, error } = useOffers();

  const handleOfertaPress = (oferta: Oferta) => {
    console.log("Oferta seleccionada:", oferta);
    router.push("client/offerts/" + oferta.id);
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
          // userName="Ana"
          // userAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuAAGur66cMvxkls2PjqS_wc2dNVoTfKuAVGG9hg6QvuDqbR7Eq_dAPRCeUZXY2TYvUqwUm8H3xHWd3P-Uez2D5yXH6osgxrH3Xymvj8ctwU0yKfdSubd0kV_nXHzZsd93JMK0zeG0wxXaj8znYxnV-BzAjpVzVmTtt7MFuej-HezSc-AGxLM-D8M-jvNcimuLhnW_3tg4LbfOkVVVR0BJKGt4Fr7bCzzaUqfxkd7P_L7j8dzUb-iwTZSJxIbKb2ZQJ_5btokukqqnsv"
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
